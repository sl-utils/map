import { MapCanvasLayer } from "@sl-utils/map";
import * as L from "leaflet";
import { SLUCanvas } from "../canvas";
import { u_arrItemDel, u_mapGetMapSize, u_mapGetPointByLatlng } from "../utils/slu-map";
/**热力图图层  传入经纬度坐标[],也可传入系数 [纬度,经度,系数?] */
export class MapPluginHeat extends MapCanvasLayer {
    constructor(map: L.Map | AMAP.Map, options?: SLPMap.Heat) {
        super(map, options);
        this.setOptions(options);
    }
    // _map: any;
    /**热力数据集合 */
    private _allHeats: SLTMap.Heat.Info[] = [];
    /**计算后的热力图绘制数据 [位置x,位置y,权重W] */
    private heatDatas: [number, number, number][] = [];
    /**用于绘制阴影，决定渲染颜色层级 */
    private _circleShadow!: HTMLCanvasElement
    /**单点渲染半径（ 默认+blur 15 ） */
    private _r!: number;
    /**渐变的二进制数据 */
    private _grad!: Uint8ClampedArray;
    private _gradEl!: HTMLCanvasElement;
    /**默认配置 */
    public options: SLPMap.Heat = {
        pane: 'canvas',
        className: 'heat',
        radius: 20,
        blur: 10,
        minOpacity: 0.1,
        gradientIndex: 1,
        ifTip: true,
        tipX: 80,
        tipY: 20,
        gradient: {
            0.2: 'blue',
            0.4: 'cyan',
            0.6: 'lime',
            0.8: 'yellow',
            1.0: 'red'
        }
    }
    protected renderAnimation() {
        this.heatDatas = this.computeHeatData();
        this.resetCanvas();
        this.drawByheatData();
        if (this.options && this.options.ifTip) {
            this._addGradient(this.computeZoomGradient());
        }
    }
    /**重置[纬度，经度]集合*/
    public setAllHeats(heats: SLTMap.Heat.Info[]) {
        this._allHeats = heats;
        return this._redraw();
    }
    /**添加[纬度，经度],并重绘*/
    public addHeat(heat: SLTMap.Heat.Info) {
        this._allHeats.push(heat);
        return this._redraw();
    }
    public delHeat(heat: SLTMap.Heat.Info) {
        u_arrItemDel(this._allHeats, heat);
        return this._redraw();
    }
    /**更新配置 */
    setOptions(options?: SLPMap.Heat) {
        L.setOptions(this, options);
        this._updateOptions();
        return this._redraw();
    }
    private _updateOptions() {
        this.genShadowRadius(this.options.radius, this.options.blur);
        if (this.options.gradient) {
            this.genGradient(this.options.gradient);
        }
    }
    /**计算热力图数据 */
    private computeHeatData(): [number, number, number][] {
        let map: any = this.map;
        if (!map) { return []; }
        let r = this._r,
            size = u_mapGetMapSize(map),
            sizePoint = L.point([size.w, size.h]),
            /**可视范围+影响范围大小 扩大边界 */
            bounds = new L.Bounds(L.point([-r, -r]), sizePoint.add([r, r])),
            num = this.computeZoomGradient(),
            v = 1 / num,
            cellSize = r / 2,
            grid: any[] = [],
            /**拖动后相对初始化时Ponit的偏移量 */
            panePos = map?._getMapPanePos?.() || { x: 0, y: 0 }, // TODO 高德地图下偏移暂无法计算（每次都会重置上一次偏移）
            offsetX = panePos.x % cellSize, offsetY = panePos.y % cellSize,
            i, len, cell, x, y, j, len2, k;
        /**对点位进行计算 */
        for (i = 0, len = this._allHeats.length; i < len; i++) {
            let heat: SLTMap.Heat.Info = this._allHeats[i]
            /**得到像素点位 */
            let p = u_mapGetPointByLatlng(this.map, heat.latlng);
            /**判断点位是否在范围内 */
            if (bounds.contains(p)) {
                /** X，Y拖动后同一经纬度对应的Point会变化，为确保热力图和之前的一模一样，故需要减去偏移量*/
                x = Math.floor((p[0] - offsetX) / cellSize) + 2;
                y = Math.floor((p[1] - offsetY) / cellSize) + 2;
                /**阴影等级（热力等级）*/
                var alt = heat.weight !== undefined ? heat.weight : 1;
                k = alt * v;
                grid[y] = grid[y] || [];
                cell = grid[y][x];
                if (!cell) {
                    /**初始 */
                    grid[y][x] = [p[0], p[1], k];
                } else {
                    /**当grid[y][x]已经存在，表示这两个经纬度归在同一个半径cellSize
                     经过几次叠加后，热力等级不一样 
                     */
                    cell[0] = (cell[0] * cell[2] + p[0] * k) / (cell[2] + k); // 加权求网格中心（如果某网格边缘高权重靠右 则网格中心合并的也会偏移靠右）
                    cell[1] = (cell[1] * cell[2] + p[1] * k) / (cell[2] + k);
                    cell[2] += k;
                }
            }
        }
        let data: [number, number, number][] = [];
        /**对grid进行格式，获得 整数点位和合理的热力等级*/
        for (i = 0, len = grid.length; i < len; i++) {
            if (grid[i]) {
                for (j = 0, len2 = grid[i].length; j < len2; j++) {
                    cell = grid[i][j];
                    if (cell) {
                        data.push([
                            Math.round(cell[0]),
                            Math.round(cell[1]),
                            Math.min(cell[2], 1)
                        ]);
                    }
                }
            }
        }
        return data
        /**去设置热力图数据并绘制 */
    }
    /**计算最高变色需要的数值 */
    private computeZoomGradient(): number {
        let gradientIndex = this.options.gradientIndex!,
            zoom = this.map.getZoom(),
            num = Math.pow(2, Math.min(12, Math.atan(Math.PI / 8 / zoom) * 100 * gradientIndex | 0));
        return num
    }
    /**添加等级标识 */
    private _addGradient(num: any) {
        let ctx = this.ctx, x = this.options.tipX!, y = this.options.tipY!;
        ctx.globalAlpha = 0.5;
        ctx.drawImage(this._gradEl, x, y, 20, 128);
        ctx.fillText('0', x + 25, y);
        ctx.fillText(num, x + 25, y + 128);
    }
    /**根据数据重绘制热力图 */
    private drawByheatData() {
        let ctx = this.ctx;
        if (!this._circleShadow) this.genShadowRadius(this.options.radius);
        if (!this._grad) this.genGradient(this.options.gradient);
        let minOpacity = this.options.minOpacity || 0.05;
        //根据点位创建颜色深度不一的黑色遮罩
        for (var i = 0, len = this.heatDatas.length, p; i < len; i++) {
            p = this.heatDatas[i];
            ctx.globalAlpha = Math.min(Math.max(p[2]!, minOpacity), 1);
            ctx.drawImage(this._circleShadow, p[0] - this._r, p[1] - this._r);
        }
        var colored = ctx.getImageData(0, 0, this.width, this.height);
        /**根据遮罩的深度不同添加不同的渐变颜色 */
        this._colorize(colored.data, this._grad);
        ctx.putImageData(colored, 0, 0);
        return this;
    }
    /**生成单个的阴影半径 */
    private genShadowRadius(r: any, blur: any = 15): void {
        /**优化建议,不同zoom下影响的半径不一样 */
        let circle = this._circleShadow = SLUCanvas.createCanvas(),
            ctx = circle.getContext('2d')!,
            r2 = this._r = r + blur;
        circle.width = circle.height = r2 * 2;
        ctx.shadowOffsetX = ctx.shadowOffsetY = r2 * 2;
        ctx.shadowBlur = blur;
        ctx.shadowColor = 'black';
        ctx.beginPath();
        ctx.arc(-r2, -r2, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
    /**创建渐变色 */
    private genGradient(grad: any) {
        let canvas = this._gradEl = SLUCanvas.createCanvas(),
            ctx = canvas.getContext('2d')!,
            gradient = ctx.createLinearGradient(0, 0, 0, 256);
        canvas.width = 1;
        canvas.height = 256;
        for (var i in grad) {
            gradient.addColorStop(+i, grad[i]);
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 10, 256);
        this._grad = ctx.getImageData(0, 0, 1, 256).data;
        return this;
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