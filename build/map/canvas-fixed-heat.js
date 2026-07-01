import { u_deepMergeOpt, u_mapGetPointByLnglat, u_mapGetProjectedPointByLnglat } from "../utils/slu-map";
export class MapCanvasFixedHeat {
    constructor(map, ctx, heatOpt) {
        this.map = map;
        this.ctx = ctx;
        this.heatOpt = heatOpt;
        this.defaultOption = {
            refZoom: 13,
            minZoom: 13,
            maxZoom: 16,
            radius: 30,
            blur: 5,
            opacity: 1,
            gradient: {
                0.0: '#00008b',
                0.4: '#0088ff',
                0.5: '#00ffff',
                0.6: '#ffff00',
                0.8: '#ff8800',
                1.0: '#ff0000',
            },
        };
        this.data = [];
        this.aggregatedData = [];
        this.maxIntensity = 1;
        this.renderScale = 1;
        this.heatCanvas = null;
        this.bounds = null;
        this.heatOpt = u_deepMergeOpt(this.defaultOption, heatOpt);
    }
    setData(data) {
        this.data = data;
        this.aggregatedData = this.buildHeatPoints(data);
        this.maxIntensity = this.aggregatedData.length ? Math.max(...this.aggregatedData.map(d => d[2]), 1) : 1;
        this.renderToImage();
    }
    buildHeatPoints(data) {
        if (!data.length)
            return [];
        const GRID = 0.001;
        const grid = new Map();
        const getKey = (lat, lng) => {
            const latIdx = Math.floor(lat / GRID);
            const lngIdx = Math.floor(lng / GRID);
            return `${latIdx}_${lngIdx}`;
        };
        data.forEach(([lng, lat, intensity]) => {
            const key = getKey(lat, lng);
            if (!grid.has(key))
                grid.set(key, { sumIntensity: 0, count: 0 });
            const cell = grid.get(key);
            cell.sumIntensity += intensity;
            cell.count += 1;
        });
        const result = [];
        grid.forEach((cell, key) => {
            const [latIdx, lngIdx] = key.split('_').map(Number);
            const centerLat = (latIdx + 0.5) * GRID;
            const centerLng = (lngIdx + 0.5) * GRID;
            const avg = cell.sumIntensity / cell.count;
            result.push([centerLng, centerLat, avg]);
        });
        return result;
    }
    renderToImage() {
        const data = this.aggregatedData;
        if (!data.length) {
            this.heatCanvas = null;
            this.bounds = null;
            return;
        }
        const minLng = Math.min(...data.map(d => d[0]));
        const maxLng = Math.max(...data.map(d => d[0]));
        const minLat = Math.min(...data.map(d => d[1]));
        const maxLat = Math.max(...data.map(d => d[1]));
        this.bounds = { minLng, maxLng, minLat, maxLat };
        const refZoom = this.heatOpt.refZoom;
        const projPoints = data.map(d => {
            const [x, y] = u_mapGetProjectedPointByLnglat(this.map, d[0], d[1], refZoom);
            return [x, y, d[2]];
        });
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        projPoints.forEach(p => {
            minX = Math.min(minX, p[0]);
            maxX = Math.max(maxX, p[0]);
            minY = Math.min(minY, p[1]);
            maxY = Math.max(maxY, p[1]);
        });
        const projMargin = this.heatOpt.radius + this.heatOpt.blur + 20;
        const extMinX = minX - projMargin;
        const extMaxX = maxX + projMargin;
        const extMinY = minY - projMargin;
        const extMaxY = maxY + projMargin;
        let canvasWidth = Math.ceil(extMaxX - extMinX);
        let canvasHeight = Math.ceil(extMaxY - extMinY);
        const MAX_SIZE = 4096;
        let scale = 1;
        const maxDim = Math.max(canvasWidth, canvasHeight);
        if (maxDim > MAX_SIZE) {
            scale = MAX_SIZE / maxDim;
            canvasWidth = Math.round(canvasWidth * scale);
            canvasHeight = Math.round(canvasHeight * scale);
        }
        this.renderScale = scale;
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, canvasWidth);
        canvas.height = Math.max(1, canvasHeight);
        const ctx = canvas.getContext('2d');
        const localPoints = projPoints.map(p => {
            const lx = (p[0] - extMinX) * scale;
            const ly = (p[1] - extMinY) * scale;
            return [lx, ly, p[2]];
        });
        const r = this.heatOpt.radius * scale;
        const cellSize = r / 2;
        const grid = [];
        const aggData = [];
        for (let i = 0, len = localPoints.length; i < len; i++) {
            const [px, py, k] = localPoints[i];
            const gx = Math.floor(px / cellSize) + 2;
            const gy = Math.floor(py / cellSize) + 2;
            if (!grid[gy])
                grid[gy] = [];
            let cell = grid[gy][gx];
            if (!cell) {
                grid[gy][gx] = [px, py, k];
            }
            else {
                const prevK = cell[2];
                const nextK = prevK + k;
                cell[0] = (cell[0] * prevK + px * k) / nextK;
                cell[1] = (cell[1] * prevK + py * k) / nextK;
                cell[2] = nextK;
            }
        }
        for (let y = 0, len = grid.length; y < len; y++) {
            if (!grid[y])
                continue;
            for (let x = 0, len2 = grid[y].length; x < len2; x++) {
                const cell = grid[y][x];
                if (cell) {
                    aggData.push([
                        Math.round(cell[0]),
                        Math.round(cell[1]),
                        Math.min(cell[2], this.maxIntensity)
                    ]);
                }
            }
        }
        this.renderHeat(ctx, aggData);
        this.heatCanvas = canvas;
    }
    renderHeat(ctx, points) {
        const { radius, blur, gradient } = this.heatOpt;
        const drawRadius = radius * this.renderScale;
        const drawBlur = blur * this.renderScale;
        const weightCanvas = document.createElement('canvas');
        const weightCtx = weightCanvas.getContext('2d');
        weightCanvas.width = ctx.canvas.width;
        weightCanvas.height = ctx.canvas.height;
        points.forEach(([x, y, value]) => {
            const norm = value / this.maxIntensity;
            const grad = weightCtx.createRadialGradient(x, y, 0, x, y, drawRadius);
            grad.addColorStop(0, `rgba(0,0,0,${norm})`);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            weightCtx.fillStyle = grad;
            weightCtx.beginPath();
            weightCtx.arc(x, y, drawRadius, 0, Math.PI * 2);
            weightCtx.fill();
        });
        weightCtx.filter = `blur(${drawBlur}px)`;
        weightCtx.drawImage(weightCanvas, 0, 0);
        const imageData = weightCtx.getImageData(0, 0, weightCanvas.width, weightCanvas.height);
        const data = imageData.data;
        const colorMap = Object.entries(gradient).sort((a, b) => +a[0] - +b[0]);
        for (let i = 0, len = data.length; i < len; i += 4) {
            let alpha = data[i + 3] / 255;
            if (alpha < 0.05) {
                data[i + 3] = 0;
                continue;
            }
            if (alpha === 0)
                continue;
            for (let j = 0, len2 = colorMap.length; j < len2; j++) {
                const [threshold, color] = colorMap[j];
                if (alpha <= +threshold) {
                    const [r, g, b] = this.hexToRgb(color);
                    data[i] = r;
                    data[i + 1] = g;
                    data[i + 2] = b;
                    data[i + 3] = Math.round(alpha * 255);
                    break;
                }
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }
    hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
    }
    draw() {
        const { ctx, heatCanvas, bounds, heatOpt } = this;
        if (!heatCanvas || !bounds)
            return;
        const zoom = this.map.getZoom();
        const { minZoom, maxZoom, opacity } = heatOpt;
        if (zoom < minZoom || zoom > maxZoom)
            return;
        const sw = u_mapGetPointByLnglat(this.map, [bounds.minLng, bounds.minLat]);
        const ne = u_mapGetPointByLnglat(this.map, [bounds.maxLng, bounds.maxLat]);
        const left = Math.min(sw[0], ne[0]);
        const right = Math.max(sw[0], ne[0]);
        const top = Math.min(sw[1], ne[1]);
        const bottom = Math.max(sw[1], ne[1]);
        const width = right - left;
        const height = bottom - top;
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.drawImage(heatCanvas, left, top, width, height);
        ctx.restore();
    }
    clear() {
        this.heatCanvas = null;
        this.bounds = null;
        this.data.length = 0;
        this.aggregatedData.length = 0;
        this.maxIntensity = 1;
        this.renderScale = 1;
    }
}
//# sourceMappingURL=canvas-fixed-heat.js.map