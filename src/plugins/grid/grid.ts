import { MapCanvasLayer } from "../../map";
import { SLUCanvas } from "../../canvas";
import { u_mapGetLatLngByPoint } from "../../utils/slu-map";
import { SLUWorker } from "../../utils/slu-worker";

export class MapPluginGridBase extends MapCanvasLayer {
    constructor(map: L.Map | AMAP.Map, options: Partial<SLPMapGrid>) {
        super(map, options);
    }
    public readonly options: SLPMapGrid
    /**网格数据   数据 [X] [Y]  */
    protected gridXY?: [number, number][][];
    /**可视区网格数据 */
    protected boundsDatas?: [number, number, number][][];
    /**数据起始经度 */
    protected lng0: number;
    /**数据起始纬度 */
    protected lat0: number;
    /**数据经度差值 数据经度间隔 (若全球数据中0.5经度间隔得到一个数据，则 dx = 1 * 0.5 )*/
    protected lngΔ: number;
    /**数据纬度差值 */
    protected latΔ: number;
    /**单挑数据由几个数据组成 */
    protected dataLength: number = 1;
    /**无数据值 */
    protected invalid: number | undefined | null;
    /**构建阴影的html */
    protected shadowElement?: HTMLCanvasElement;
    /**渐变图像的html */
    protected gradientElement?: HTMLCanvasElement;
    /**渐变数据 */
    protected gradient?: Uint8ClampedArray;
    /**启用新的线程 */
    private worker = new SLUWorker<WorkerInfo, { workerId: number, data: CanvasImageSource }>('grid-worker1', (data) => this.workerCb(data));
    /**线程id */
    private workerId: number = 0;
    /**将线程绘制的图像绘制出来 */
    private workerCb(data: { workerId: number, data: CanvasImageSource }) {
        if (data.workerId && (this.workerId - 1) !== data.workerId) return;
        this.resetCanvas();
        this.ctx.drawImage(data.data, 0, 0);
    }
    /**设置网格数据 */
    public _setDatas(datas: SLDMapGrid[]) {
        if (!datas || datas.length === 0) {
            this.gridXY = [];
            return
        };
        let { lo1 = 0, la1 = 0, dx = 0, dy = 0 } = datas[0]?.header || {};
        this.lng0 = lo1;
        this.lat0 = la1;
        this.lngΔ = dx;
        this.latΔ = dy;
        this.invalid = null;
        this.builder(datas);
    }
    /**采用线程调取生成可视区网格数据 */
    protected interpolateFieldByWorker(bounds: GridBounds) {
        let [lat, lng] = u_mapGetLatLngByPoint(this.map, [0, 0]);
        let [, lng1] = u_mapGetLatLngByPoint(this.map, [1, bounds.height]);
        let lats: number[] = [];
        for (let i = 0; i <= bounds.height; i++) lats[i] = u_mapGetLatLngByPoint(this.map, [0, i])[0];
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
    /**grid数据，以及获得指定经纬度数据的方法interpolate
     * @param bounds 可视区域的像素范围
    */
    protected interpolateField(bounds: GridBounds) {
        var columns: [number, number, number][][] = [];
        for (let y = bounds.x, len = bounds.height; y < len; y += 2) {
            let column: [number, number, number][] = [];
            for (let x = bounds.x; x <= bounds.width; x += 2) {
                //得到可视区X , Y 点对应地图上的经纬度
                let [lat, lng] = u_mapGetLatLngByPoint(this.map, [x, y]);
                /**是否是有效数字 */
                if (isFinite(lng)) {
                    //获得指定经纬度的信息 [ u数据 , v数据 , 平均值 ]
                    var wind = this.interpolate(lng, lat);
                    if (wind) column[x + 1] = column[x] = wind;
                }
            }
            columns[y + 1] = columns[y] = column;
        }
        this.boundsDatas = columns;
        this.genMosaic(columns);
    };
    /**获取视图范围内的(指定像素间隔的数据) */
    protected getViewBoundsGrid(bounds: GridBounds, pixelInterval: number = 2): [number, number, number][][] {
        var columns: [number, number, number][][] = [];
        for (let y = bounds.x, len = bounds.height; y < len; y += pixelInterval) {
            let column: [number, number, number][] = [];
            for (let x = bounds.x; x <= bounds.width; x += pixelInterval) {
                //得到可视区X , Y 点对应地图上的经纬度
                let [lat, lng] = u_mapGetLatLngByPoint(this.map, [x, y]);
                /**是否是有效数字 */
                if (isFinite(lng)) {
                    //获得指定经纬度的信息 [ u数据 , v数据 , 平均值 ]
                    var wind = this.interpolate(lng, lat);
                    if (wind) column[x + 1] = column[x] = wind;
                }
            }
            columns[y + 1] = columns[y] = column;
        }
        this.boundsDatas = columns;
        return columns;
    }
    /**构建网格数据gridXY: [开始的数据,结束的数据] [x序号] [y序号] 
     * @param data 一维数据
     * @param nx 列数
     * @param ny 行数
     * @returns 三维网格数据
     */
    private builder(grids: SLDMapGrid[]): number[][][] {
        let { nx = 0, ny = 0, dx = 0 } = grids[0]?.header || {};
        let scale = 1;
        /**数据行数 * 间隔 要比360 */
        let isContinuous = Math.floor(nx * dx) >= 360;
        let grid: [number, number][][] = [];
        let uData = grids[0].data || [], vData = grids[1]?.data || [];
        let p = 0;
        /** [开始的数据,结束的数据] [x序号] [y序号]   */
        for (var j = 0; j < ny; j++) {
            /** [开始的数据,结束的数据] [x序号]   */
            let row: [number, number][] = [], xUData = uData[j], xVdata = vData[j];
            for (var i = 0; i < nx; i++, p++) {
                let u = uData[p], v = vData[p];
                u = u === this.invalid || v === undefined ? u : u * scale;
                v = v === this.invalid || v === undefined ? v : v * scale;
                row[i] = [u, v];
            }
            if (isContinuous) row.push(row[0]);
            grid[j] = row;
        }
        this.gridXY = grid;
        return grid;
    }
    /**获得指定经纬度的数据信息
    * @param lng 经度
    * @param lat 纬度
    * @return [ 计算得到的开始值S , 计算的到的结束值E, sqrt(S*S+E*E) ]
    */
    protected interpolate(lng: number, lat: number): null | [number, number, number] {
        if (!this.gridXY) return null;
        let grid = this.gridXY, lng0 = this.lng0, Δlng = this.lngΔ, Δlat = this.latΔ, lat0 = this.lat0;
        /** 该经度属于nx的第几个 */
        let i = this.floorMod(lng - lng0, 360) / Δlng;
        /** 该纬度属于ny的第几个 */
        let j = (lat0 - lat) / Δlat;
        let fx = Math.floor(i),
            nx = fx + 1,
            fy = Math.floor(j),
            ny = fy + 1;
        var row: [number, number][];
        /** Y轴第fy个数据 赋值并且不为undefined */
        if (row = grid[fy]) {
            let g00 = row[fx], g10 = row[nx];
            if (this.isValue(g00) && this.isValue(g10) && (row = grid[ny])) {
                //X轴第fy+1个数据
                var g01 = row[fx], g11 = row[nx];
                if (this.isValue(g01) && this.isValue(g11)) {
                    return this.bilinearInterpolateVector(i - fx, j - fy, g00, g10, g01, g11);
                }
            }
        }
        return null;
    }
    /**根据网格数据构建虚拟数值
    * @param x 指定经度的X数值相对最近的低位整数坐标的差值 [0,1)
    * @param y 指定纬度的Y数值相对最近的低位整数坐标的差值 [0,1)
    * @param g00 该经纬度所在的网格的左上角的风速信息
    * @param g10 该经纬度所在的网格的右上角的风速信息
    * @param g01 该经纬度所在的网格的左下角的风速信息
    * @param g11 该经纬度所在的网格的右下角的风速信息
    * @returns [ 计算得到的开始值S , 计算的到的结束值E, 平均速度 ]
    */
    private bilinearInterpolateVector(x: number, y: number, g00: [number, number], g10: [number, number], g01: [number, number], g11: [number, number]): [number, number, number] {
        /**右侧(下一个)的影响权重 */
        let rx = 1 - x, ry = 1 - y;
        let a = rx * ry,
            b = x * ry,
            c = rx * y,
            d = x * y;
        let u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;
        let v = g00[1] * a + g10[1] * b + g01[1] * c + g11[1] * d;
        return [u, v, Math.sqrt(u * u + v * v)];
    }
    /**针对经纬度特殊的取余数方法
     * 小于等于n的数字若a小于0，返回 2n+a ， -365  => 2n-365 
    */
    private floorMod(a: number, n: number): number {
        return a - n * Math.floor(a / n);
    }
    /**判断是否为有效数据 */
    private isValue(x: number[]): boolean {
        return x !== null && x !== undefined;
    }
    /**此处无数据数据 */
    private isNull(xy: [number, number]) {
        return this.invalid === xy[0] && this.invalid === xy[1];
    }
    /**生成马赛克类型图 */
    protected genMosaic(datas: [number, number, number][][]) {
        let ctx = this.ctx, width = this.width, height = this.height;
        //根据点位创建颜色深度不一的黑色遮罩
        ctx.globalAlpha = 0.35;
        for (let i = 0, len = height; i < len; i++) {
            for (let j = 0, len = width; j < len; j++) {
                let p = datas[i][j] || [], value = p[2];
                ctx.fillStyle = this.getColorByValue(value);
                ctx.fillRect(j, i, 1, 1);
            }
        }
    }
    /**生成黑白遮罩，以便构建渐变图 */
    protected genShade(datas: [number, number, number][][]) {
        let options = this.options;
        if (!this.shadowElement) this.shadowElement = this.genShadowRadius(1, 0);
        if (!this.gradientElement && options.gradient) this.gradientElement = this.genGradient(options.gradient);
        let ctx = this.ctx, width = this.width, height = this.height, minOpacity = 0, max = options.gradientMax || -1, r = options.gradientRadius || 1;
        //根据点位创建颜色深度不一的黑色遮罩
        for (let i = 0, len = height; i < len; i++) {
            for (let j = 0, len = width; j < len; j++) {
                let p = datas[i][j], value = p[2];
                ctx.globalAlpha = Math.min(Math.max(value / max, minOpacity), 1);
                ctx.drawImage(this.shadowElement, j, i);
            }
        }
        let colored = ctx.getImageData(0, 0, this.width, this.height);
        /**根据遮罩的深度不同添加不同的渐变颜色 */
        this._colorize(colored.data, this.gradient!);
        ctx.putImageData(colored, 0, 0);
        return this;
    }
    /**获取该值所在的颜色 */
    protected getColorByValue(value: number): string {
        if (value === this.invalid || value === undefined || value === null) return 'rgba(0,0,0,0)';
        let options = this.options, colors = options.mosaicColor || [], values = options.mosaicValue || [];
        for (let i = 0, len = values.length; i < len; i++) {
            let p = values[i];
            if (value < p) return colors[i];
        }
        return colors[colors.length - 1];
    }

    /**生成单个的阴影半径(圆形) 
     * @param r 半径
     * @param blur 模糊度
    */
    protected genShadowRadius(r: number, blur: number = 15): HTMLCanvasElement {
        /**优化建议,不同zoom下影响的半径不一样 */
        let circle = SLUCanvas.createCanvas(),
            ctx = circle.getContext('2d')!,
            r2 = r + blur;
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
    /**构建渐变色 */
    private genGradient(grad: { [key: number]: string }): HTMLCanvasElement {
        let canvas = SLUCanvas.createCanvas(),
            ctx = canvas.getContext('2d')!,
            gradient = ctx.createLinearGradient(0, 0, 0, 256);
        canvas.width = 1;
        canvas.height = 256;
        for (var i in grad) gradient.addColorStop(+i, grad[i]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 10, 256);
        this.gradient = ctx.getImageData(0, 0, 1, 256).data;
        return canvas;
    }
    /**填充颜色 */
    private _colorize(pixels: Uint8ClampedArray, gradient: Uint8ClampedArray): void {
        for (var i = 0, len = pixels.length, j; i < len; i += 4) {
            j = pixels[i + 3] * 4;
            if (j) {
                pixels[i] = gradient[j];
                pixels[i + 1] = gradient[j + 1];
                pixels[i + 2] = gradient[j + 2];
            }
        }
    }
}
