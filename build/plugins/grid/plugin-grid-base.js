import { MapCanvasLayer } from "../../map";
import { SLUCanvas } from "../../canvas";
import { um_deepMergeOpt, um_getLngLatByPoint } from "../../utils";
import { SLUWorker } from "../../utils/slu-worker";
export class MapPluginGridBase extends MapCanvasLayer {
    constructor(map, options) {
        super(map, options);
        this.options = {
            pane: "wavePane",
            zIndex: 200,
            mosaicColor: ["#0000CD", "#0066ff", "#00B7ff", "#00E0FF", "#00FFFF", "#00FFCC", "#00FF99", "#00FF00", "#99FF00", "#CCFF00", "#FFFF00", "#FFCC00", "#FF9900", "#FF6600", "#FF0000", "#B03060", "#D02090", "#FF00FF"],
            mosaicValue: [0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        };
        this.dataLength = 1;
        this.worker = new SLUWorker('grid-worker', (data) => this.workerCb(data));
        this.workerId = 0;
        this.options = um_deepMergeOpt(this.options, options);
    }
    workerCb(data) {
        if (data.workerId && (this.workerId - 1) !== data.workerId)
            return;
        this.resetCanvas();
        this.ctx.drawImage(data.data, 0, 0);
    }
    _setDatas(datas) {
        if (!datas || datas.length === 0) {
            this.gridXY = [];
            return;
        }
        ;
        let { lo1 = 0, la1 = 0, dx = 0, dy = 0 } = datas[0]?.header || Object.assign({});
        this.lng0 = lo1;
        this.lat0 = la1;
        this.lngΔ = dx;
        this.latΔ = dy;
        this.invalid = null;
        this.builder(datas);
    }
    interpolateFieldByWorker(bounds) {
        let [lng, lat] = um_getLngLatByPoint(this.map, [0, 0]);
        let [lng1, lat1] = um_getLngLatByPoint(this.map, [1, bounds.height]);
        let lats = [];
        for (let i = 0, len = bounds.height; i <= len; i++)
            lats[i] = um_getLngLatByPoint(this.map, [0, i])[1];
        this.worker.post({
            id: this.workerId++,
            width: bounds.width,
            height: bounds.height,
            lats: lats,
            lat, lng, lat0: this.lat0, lng0: this.lng0, latΔ: this.latΔ, lngΔ: this.lngΔ,
            lngd: lng1 - lng,
            invalid: this.invalid,
            grid: this.gridXY,
            mosaicColor: this.options.mosaicColor,
            mosaicValue: this.options.mosaicValue,
        });
    }
    interpolateField(bounds) {
        const columns = [];
        for (let y = bounds.x, len = bounds.height; y < len; y += 2) {
            const column = [];
            for (let x = bounds.x, len2 = bounds.width; x <= len2; x += 2) {
                let [lng, lat] = um_getLngLatByPoint(this.map, [x, y]);
                if (isFinite(lng)) {
                    const wind = this.interpolate(lng, lat);
                    if (wind)
                        column[x + 1] = column[x] = wind;
                }
            }
            columns[y + 1] = columns[y] = column;
        }
        this.boundsDatas = columns;
        this.genMosaic(columns);
    }
    ;
    getViewBoundsGrid(bounds, pixelInterval = 2) {
        const columns = [];
        for (let y = bounds.x, len = bounds.height; y < len; y += pixelInterval) {
            let column = [];
            for (let x = bounds.x, len2 = bounds.width; x <= len2; x += pixelInterval) {
                let [lng, lat] = um_getLngLatByPoint(this.map, [x, y]);
                if (isFinite(lng)) {
                    const wind = this.interpolate(lng, lat);
                    if (wind)
                        column[x + 1] = column[x] = wind;
                }
            }
            columns[y + 1] = columns[y] = column;
        }
        this.boundsDatas = columns;
        return columns;
    }
    builder(grids) {
        let { nx = 0, ny = 0, dx = 0 } = grids[0]?.header || Object.assign({});
        let scale = 1;
        let isContinuous = Math.floor(nx * dx) >= 360;
        let grid = [];
        let uData = grids[0].data || [], vData = grids[1]?.data || [];
        let p = 0;
        for (let j = 0; j < ny; j++) {
            let row = [], xUData = uData[j], xVdata = vData[j];
            for (let i = 0; i < nx; i++, p++) {
                let u = uData[p], v = vData[p];
                u = u === this.invalid || v === undefined ? u : u * scale;
                v = v === this.invalid || v === undefined ? v : v * scale;
                row[i] = [u, v];
            }
            if (isContinuous)
                row.push(row[0]);
            grid[j] = row;
        }
        this.gridXY = grid;
        return grid;
    }
    interpolate(lng, lat) {
        if (!this.gridXY)
            return null;
        let grid = this.gridXY, lng0 = this.lng0, Δlng = this.lngΔ, Δlat = this.latΔ, lat0 = this.lat0;
        let i = this.floorMod(lng - lng0, 360) / Δlng;
        let j = (lat0 - lat) / Δlat;
        let fx = Math.floor(i), nx = fx + 1, fy = Math.floor(j), ny = fy + 1;
        let row;
        if (row = grid[fy]) {
            const g00 = row[fx], g10 = row[nx];
            if (this.isValue(g00) && this.isValue(g10) && (row = grid[ny])) {
                const g01 = row[fx], g11 = row[nx];
                if (this.isValue(g01) && this.isValue(g11)) {
                    return this.bilinearInterpolateVector(i - fx, j - fy, g00, g10, g01, g11);
                }
            }
        }
        return null;
    }
    bilinearInterpolateVector(x, y, g00, g10, g01, g11) {
        let rx = 1 - x, ry = 1 - y;
        let a = rx * ry, b = x * ry, c = rx * y, d = x * y;
        let u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;
        let v = g00[1] * a + g10[1] * b + g01[1] * c + g11[1] * d;
        return [u, v, Math.sqrt(u * u + v * v)];
    }
    floorMod(a, n) {
        return a - n * Math.floor(a / n);
    }
    isValue(x) {
        return x !== null && x !== undefined;
    }
    isNull(xy) {
        return this.invalid === xy[0] && this.invalid === xy[1];
    }
    genMosaic(datas) {
        let ctx = this.ctx, width = this.width, height = this.height;
        ctx.globalAlpha = 0.35;
        for (let i = 0, len = height; i < len; i++) {
            for (let j = 0, len = width; j < len; j++) {
                let p = datas[i][j] || [], value = p[2];
                ctx.fillStyle = this.getColorByValue(value);
                ctx.fillRect(j, i, 1, 1);
            }
        }
    }
    genShade(datas) {
        let options = this.options;
        if (!this.shadowElement)
            this.shadowElement = this.genShadowRadius(1, 0);
        if (!this.gradientElement && options.gradient)
            this.gradientElement = this.genGradient(options.gradient);
        let ctx = this.ctx, width = this.width, height = this.height, minOpacity = 0, max = options.gradientMax || -1, r = options.gradientRadius || 1;
        for (let i = 0, len = height; i < len; i++) {
            for (let j = 0, len = width; j < len; j++) {
                let p = datas[i][j], value = p[2];
                ctx.globalAlpha = Math.min(Math.max(value / max, minOpacity), 1);
                ctx.drawImage(this.shadowElement, j, i);
            }
        }
        let colored = ctx.getImageData(0, 0, this.width, this.height);
        this._colorize(colored.data, this.gradient);
        ctx.putImageData(colored, 0, 0);
        return this;
    }
    getColorByValue(value) {
        if (value === this.invalid || value === undefined || value === null)
            return 'rgba(0,0,0,0)';
        let options = this.options, colors = options.mosaicColor || [], values = options.mosaicValue || [];
        for (let i = 0, len = values.length; i < len; i++) {
            let p = values[i];
            if (value < p)
                return colors[i];
        }
        return colors[colors.length - 1];
    }
    genShadowRadius(r, blur = 15) {
        let circle = SLUCanvas.createCanvas(), ctx = circle.getContext('2d'), r2 = r + blur;
        circle.width = circle.height = r2 * 2;
        ctx.shadowOffsetX = ctx.shadowOffsetY = r2 * 2;
        ctx.shadowBlur = blur;
        ctx.shadowColor = 'black';
        ctx.beginPath();
        ctx.arc(-r2, -r2, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        return circle;
    }
    genGradient(grad) {
        let canvas = SLUCanvas.createCanvas(), ctx = canvas.getContext('2d'), gradient = ctx.createLinearGradient(0, 0, 0, 256);
        canvas.width = 1;
        canvas.height = 256;
        for (const i in grad)
            gradient.addColorStop(+i, grad[i]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 10, 256);
        this.gradient = ctx.getImageData(0, 0, 1, 256).data;
        return canvas;
    }
    _colorize(pixels, gradient) {
        for (let i = 0, len = pixels.length, j; i < len; i += 4) {
            j = pixels[i + 3] * 4;
            if (j) {
                pixels[i] = gradient[j];
                pixels[i + 1] = gradient[j + 1];
                pixels[i + 2] = gradient[j + 2];
            }
        }
    }
}
//# sourceMappingURL=plugin-grid-base.js.map