
import { MapCanvasDraw, MapCanvasEvent, MapCanvasLayer, SLUMap } from "../map";
import { MapPluginDraw } from "./plugin-draw";
import { u_deepMergeOpt, u_mapGetLngLatByPoint, u_mapGetLngDiffByDistance, u_mapGetMapMouseEvent, u_mapGetPointByLnglat, u_mapSetMapStatus, u_mapTogcj02gps84, u_mapTogps84gcj02, u_tsMapisAmap } from "../utils/slu-map";
import { OptMapPluginPlot, MapArc, DataMapPlot, MapPlotType, MapRect, MapText, MapEvent, MapLine, AMapMapsEvent, OptMapPluginPlotBase, OptMapPluginPlotText, OptMapPluginPlotEdit } from "../types";
import { LeafletMouseEvent } from "leaflet";
import { MapMouseEvent as MaplibreMouseEvent } from 'maplibre-gl';
/**自定义标绘类
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap 地图实例
 * @param options 标绘配置
 */
export class MapPluginPlot extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: OptMapPluginPlot) {
        const map = sluMap.map, { plotOpt, editOpt, textOpt } = options || {};
        super(map, plotOpt);
        this.ctrMapDraw = new MapCanvasDraw(map, this.canvas);
        if (plotOpt) this.options = u_deepMergeOpt(this.options, plotOpt);
        const aniOpt = u_deepMergeOpt(this.options, { className: this.options.className + ' ani' });
        this.ctrMapAniDraw = new MapPluginDraw(sluMap, aniOpt);
        this.ctrEvent = new MapCanvasEvent(map);
        if (editOpt) this.editArc = u_deepMergeOpt(this.editArc, editOpt);
        if (textOpt) this.plotText = u_deepMergeOpt(this.plotText, textOpt);
    }
    /**标绘形状配置 */
    public options: OptMapPluginPlotBase = {
        pane: 'canvas',
        className: 'plot',
    };
    /**动态绘制图层 */
    private ctrMapAniDraw!: MapPluginDraw;
    /**静态标绘图层 */
    private ctrMapDraw!: MapCanvasDraw;
    /**图层事件控制器 */
    private ctrEvent!: MapCanvasEvent;
    /**编辑圆点样式 */
    private editArc: OptMapPluginPlotEdit = {
        lnglat: [0, 0],
        colorFill: '#fff',
        colorLine: '#2C9B8A',
        size: 4,
    };
    /**标绘文字样式 */
    private plotText: OptMapPluginPlotText = {
        colorFill: "#2C9B8A",
        widthLine: 2,
        colorLine: '#FFFFFF',
        ifShadow: true,
    };
    /**所有的标绘集合 */
    private plotList: DataMapPlot[] = [];
    /**正在动态绘制的标(仅仅改变图形不会动态改变原始数据) */
    public plotAni?: DataMapPlot = { lngLats: [], type: 'polygon', ifEdit: true };
    /**记录当前鼠标经纬度 [lng, lat] */
    private curPoint?: [number, number];
    /** 单击事件 */
    private eventClickTimer: ReturnType<typeof setTimeout> | null = null;
    /**开启新增的绘制
     * @param type 标绘类型
     * @returns 新增的标绘实例
     */
    public open(type: MapPlotType): DataMapPlot {
        /**移除掉之前添加的所有的监听函数 */
        // this.clearCb();
        let i = this.plotList.length - 1 > 0 ? this.plotList.length - 1 : 0;
        this.eventSwitch(true);
        /**存在正在编辑的或者正在绘制的就是新增的，且还未保存则直接重新绘制（还能保证颜色就是之前的设置）*/
        let plot = this.plotList.find(info => info.ifEdit);
        /**优先复用正在编辑的 */
        if (plot) {
            plot.lngLats = [];
            plot.type = type;
            plot.ifEdit = true;
            this.plotAni = plot;
            return plot;
        }
        /**复用 plotAni */
        if (this.plotAni && this.plotAni === this.plotList[i] && this.plotAni.ifEdit) {
            const cur = this.plotAni;
            cur.lngLats = [];
            cur.type = type;
            cur.ifEdit = true;
            return cur;
        }
        /**新建 不加的话将会每次都删除 */
        if (this.plotList[i] && this.plotList[i].lngLats.length > 0) i++;
        const newplot = this.createPlot(type);
        this.plotList[i] = this.plotAni = newplot;
        this.renderAnimation();
        this.cbPlotListChange && this.cbPlotListChange(this.plotList);
        return this.plotAni;
    }
    /**关闭绘制 
     * @returns MapPluginPlot实例
    */
    public close(): MapPluginPlot {
        this.eventSwitch(false);
        return this;
    }
    /**保存标绘
     * @returns MapPluginPlot实例
    */
    public savePlot(): MapPluginPlot {
        if (this.plotAni) {
            let plot = this.plotAni;
            plot.ifEdit = false;
            this.plotAni = undefined;
            this.redraw();
            this.cbPlotListChange && this.cbPlotListChange(this.plotList);
        }
        return this;
    }
    /**删除标绘
     * @param plot 标绘实例
     * @returns MapPluginPlot实例
     */
    public delPlot(plot?: DataMapPlot): MapPluginPlot {
        plot = plot || this.plotAni;
        const idx = this.plotList.findIndex(info => info === plot);
        if (idx > -1) this.plotList.splice(idx, 1);
        this._redraw();
        this.cbPlotListChange && this.cbPlotListChange(this.plotList);
        return this;
    }
    /**设置所有区域数据
     * @param plotList 标绘集合
     * @returns MapPluginPlot实例
     */
    public setPlotList(plotList: DataMapPlot[]): MapPluginPlot {
        this.plotList = plotList;
        this.renderFixedData();
        return this;
    }
    /**设置编辑区域数据
     * @param plot 标绘实例
     * @returns MapPluginPlot实例
     */
    public setEditPlot(plot: DataMapPlot): MapPluginPlot {
        let info = this.plotList.find(info => info === plot);
        info && (info.ifEdit = true);
        this.eventSwitch(false);
        this._redraw();
        return this;
    }
    /**重绘
     * @returns MapPluginPlot实例
     */
    public redraw(): MapPluginPlot {
        this._redraw();
        return this;
    }
    /**渲染静态标绘图层 */
    protected renderFixedData(): void {
        if (!this.map) return;
        this.ctrMapDraw.delAll();
        this.ctrMapDraw.reSetCanvas();
        this.plotList.forEach((info, i) => {
            if (info.lngLats.length > 0 && !info.ifEdit && info.ifHide !== true) {
                this.drawPlot(this.ctrMapDraw, info, info.type);
            }
        });
        this.ctrMapDraw.drawMapAll();
    }
    /**渲染动态绘制图层 */
    protected renderAnimation(): void {
        if (!this.map) return;
        this.genAniPlot();
    }
    /**创建标绘
     * @param type 标绘类型
     * @returns 标绘数据
     */
    private createPlot(type: MapPlotType): DataMapPlot {
        switch (type) {
            case 'point':
                return { type: 'point', lngLats: [], ifEdit: true, url: '', points: [] };
            case 'circle':
                return { type: 'circle', lngLats: [], ifEdit: true };
            case 'rect':
                return { type: 'rect', lngLats: [], ifEdit: true };
            case 'line':
            case 'polygon':
                return { type, lngLats: [], ifEdit: true };
        }
    }
    /**生成动态绘制图层 */
    private genAniPlot(): void {
        this.ctrMapAniDraw.delAll();
        this.ctrMapAniDraw.resetCanvas();
        this.ctrEvent.clearAllEvents();
        let polygon = this.plotList.find(info => info.ifEdit);
        /**动态绘制图层绘制正处于编辑态的标绘 */
        if (polygon) {
            this.plotAni = polygon;
            let plotAni = { ...polygon }, lngLats = polygon.lngLats;
            /**圆的特殊判断不然小手一抖，多个点 */
            if (this.curPoint && (plotAni.type === 'circle' && lngLats.length < 2 || plotAni.type !== 'circle')) {
                plotAni.lngLats = [...lngLats, this.curPoint]
            }
            this.drawPlot(this.ctrMapAniDraw, plotAni, plotAni.type);
            this.openMouseEdit(plotAni);
            this.ctrMapAniDraw.drawMapAll();
            return;
        }
    }
    /**绘制标绘
     * @param layer 绘制图层
     * @param plotInfo 标绘数据
     * @param type 标绘类型
     */
    private drawPlot(layer: MapCanvasDraw | MapPluginDraw, plotInfo: DataMapPlot, type: MapPlotType): void {
        let info = Object.assign({}, this.options, plotInfo);
        info.colorFill = info.colorFill;
        info.colorLine = info.colorLine || info.colorFill;
        switch (info.type) {
            case 'line':
                layer.addLine({ ...info, lnglats: info.lngLats });
                break;
            case 'polygon':
                let polygon: MapRect = { ...info, lnglats: info.lngLats };
                layer.addRect(polygon);
                break;
            case 'circle':
                if (info.lngLats.length == 0) break;
                let [slnglat, elnglat] = info.lngLats, rail = info.rail || 0;
                if (!elnglat) {
                    let [lng, lat] = slnglat;
                    let lngDis = u_mapGetLngDiffByDistance(this.map, rail, [slnglat]);
                    info.lngLats[1] = [lng + lngDis, lat];
                }
                let size = this.calcRadius(info.lngLats);
                // info.lnglats = [];
                layer.addArc({ ...info, size, lnglat: slnglat });
                break;
            case 'rect':
                const lnglats = this.calcRect(info.lngLats);
                let rect: MapRect = { ...info, lnglats };
                layer.addRect(rect);
                break;
            case 'point':
                if (!info.lngLats.length) break;
                const { url, size: pSize = [16, 16] } = info;
                if (url) {
                    layer.addImg({ ...info, lnglat: info.lngLats[0], size: pSize })
                } else {
                    layer.addArc({ ...info, size: 4, dash: [0, 0], lnglat: info.lngLats[0] });
                }
                break;
        }
        let name: MapText = { ...this.plotText, text: info.name || '', lnglat: this.calcCenter(info.lngLats, type) }
        layer.addText(name);
    }
    /**各个点的平均值计算中心点
     * @param points [经度,纬度][]
     * @param type 标绘类型
     * @returns 中心点[number, number]
     */
    private calcCenter(points: [number, number][], type: MapPlotType): [number, number] {
        let len = points.length
        if (len < 2 || type === 'circle' || type == 'point') return (points[0] || [0, 0]);
        if (type == 'line') {
            // 加权计算线长度 选取中心点
            let totalLength = 0;
            let weightedXSum = 0;
            let weightedYSum = 0;
            for (let i = 0, len = points.length - 1; i < len; i++) {
                const [x1, y1] = points[i];
                const [x2, y2] = points[i + 1];
                // 计算线段长度
                const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                totalLength += length;
                // 计算线段中点
                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;
                // 累加加权的中点坐标
                weightedXSum += midX * length;
                weightedYSum += midY * length;
            }
            // 计算加权中心点
            const centerX = weightedXSum / totalLength;
            const centerY = weightedYSum / totalLength;
            return [centerX, centerY];
        }
        let center = points.reduce((pre, cur) => {
            return [(pre[0] + cur[0]), pre[1] + cur[1]];
        }, [0, 0]);
        center = [center[0] / len, center[1] / len];
        return center;
    }
    /**直接最大最小计算中心点
     * @param points 纬度经度点数组
     * @returns 中心点[number, number]
     */
    private calcCenter2(points: [number, number][]): [number, number] {
        let len = points.length
        if (len < 2) return (points[0] || [0, 0]);
        let maxmin = points.reduce((pre, cur) => {
            let [maxLat, minLat, maxLng, minLng] = pre;
            return [
                maxLat > cur[0] ? maxLat : cur[0],
                minLat < cur[0] ? minLat : cur[0],
                maxLng > cur[1] ? maxLng : cur[1],
                minLng < cur[1] ? minLng : cur[1]
            ];
        }, [-Infinity, Infinity, -Infinity, Infinity]);
        let [maxLat, minLat, maxLng, minLng] = maxmin;
        return [(maxLat + minLat) / 2, (maxLng + minLng) / 2];
    }
    /**计算多边形的重心
     * @param points 纬度经度点数组
     * @returns 中心点[number, number]
     */
    private calcCenter3(points: [number, number][]): [number, number] {
        let xSum = 0;
        let ySum = 0;
        let areaSum = 0;
        for (let i = 0, len = points.length - 1; i < len; i++) {
            const j = (i + 1) % points.length;
            const cross = points[i][0] * points[j][1] - points[j][0] * points[i][1];
            areaSum += cross;
            xSum += (points[i][0] + points[j][0]) * cross;
            ySum += (points[i][1] + points[j][1]) * cross;
        }
        areaSum *= 3;
        const center: [number, number] = [xSum / areaSum, ySum / areaSum];
        return center;
    }
    /**计算矩形的四个点
     * @param lnglats 经度纬度点数组
     * @returns 矩形四个点[number, number]
     */
    private calcRect(lnglats: [number, number][]): [number, number][] {
        if (lnglats.length < 2) return lnglats;
        let lngLats: [number, number][] = [];
        let [lnglat1, lnglat2] = lnglats;
        lngLats.push(lnglat1);
        lngLats.push([lnglat1[0], lnglat2[1]]);
        lngLats.push(lnglat2);
        lngLats.push([lnglat2[0], lnglat1[1]]);
        return lngLats;
    }
    /**计算圆的半径
     * @param lnglats 经度纬度点数组
     * @returns 圆的半径
     */
    private calcRadius(lnglats: [number, number][]): number {
        if (lnglats.length < 2) return 0;
        let [px1, py1] = u_mapGetPointByLnglat(this.map, lnglats[0]);
        let [px2, py2] = u_mapGetPointByLnglat(this.map, lnglats[1]);
        let x = Math.abs(px1 - px2);
        let y = Math.abs(py1 - py2);
        return Math.sqrt(x * x + y * y);
    }
    /**开启鼠标编辑功能
     * @param plotInfo 标绘数据
     */
    private openMouseEdit(plotInfo: DataMapPlot): void {
        let type = plotInfo.type;
        switch (type) {
            case 'point':
                return this.setPointEdit(plotInfo);
            case 'line':
                return this.setLineEditPoint(plotInfo);
            case 'polygon':
                return this.setPolygonEditPoint(plotInfo);
            case 'circle':
                return this.setCircleEditPoint(plotInfo);
            case 'rect':
                return this.setRectEditPoint(plotInfo);
        }
    }
    /**设置圆的编辑点
     * @param plotInfo 标绘数据
     */
    private setCircleEditPoint(plotInfo: DataMapPlot): void {
        let { lngLats } = plotInfo, eves: MapEvent[] = [];
        for (let i = 0, len = lngLats.length; i < len; i++) {
            let s = lngLats[i];
            this.addEvent(s, i, plotInfo, eves, false);
        }
        let line: MapLine = { ...this.options, lnglats: plotInfo.lngLats };
        this.ctrMapAniDraw.addLine(line);
        this.ctrEvent.setEventsByKey(eves, 'circleEdit');
    }
    /**设置多边形的编辑点
     * @param plotInfo 标绘数据
     */
    private setPolygonEditPoint(plotInfo: DataMapPlot): void {
        let { lngLats } = plotInfo, eves: MapEvent[] = [];
        for (let i = 0, len = lngLats.length; i < len; i++) {
            let s = lngLats[i];
            this.addEvent(s, i, plotInfo, eves, false);
            if (!this.curPoint) {
                /**编辑时可能的新增点位*/
                let next = i + 1 == len ? 0 : i + 1, e = lngLats[next];
                /**把相邻两个经纬度点转为xy，计算canvas的中心点,再将该中心点转为经纬度点 */
                let [px1, py1] = u_mapGetPointByLnglat(this.map, s)
                let [px2, py2] = u_mapGetPointByLnglat(this.map, e)
                let x = (px1 + px2) / 2, y = (py1 + py2) / 2;
                let point = u_mapGetLngLatByPoint(this.map, [x, y])
                this.addEvent(point, i, plotInfo, eves, true);
            }
        }
        this.ctrEvent.setEventsByKey(eves, 'polygonEdit');
    }
    /**点标绘仍可编辑移动位置
     * @param plotInfo 标绘数据
     */
    private setPointEdit(plotInfo: DataMapPlot): void {
        let { lngLats } = plotInfo;
        if (!lngLats || !lngLats[0] || lngLats[0].length != 2) return;
        let eves: MapEvent[] = [];
        this.addEvent(lngLats[0], 0, plotInfo, eves);
        this.ctrEvent.setEventsByKey(eves, 'pointEdit')
    }
    /**设置线段的编辑点
     * @param plotInfo 标绘数据
     */
    private setLineEditPoint(plotInfo: DataMapPlot): void {
        let { lngLats } = plotInfo, eves: MapEvent[] = [];
        for (let i = 0, len = lngLats.length; i < len; i++) {
            let s = lngLats[i];
            this.addEvent(s, i, plotInfo, eves, false);
        }
        this.ctrEvent.setEventsByKey(eves, 'lineEdit');
    }
    /**设置矩形的编辑点
     * @param plotInfo 标绘数据
     */
    private setRectEditPoint(plotInfo: DataMapPlot): void {
        /**存储的两个点 */
        let { lngLats } = plotInfo, eves: MapEvent[] = [];
        /**计算出的四个点 */
        let lnglats: [number, number][] = this.calcRect(lngLats);
        for (let i = 0, len = lnglats.length; i < len; i++) {
            let lngLat = lnglats[i];
            this.addEvent(lngLat, i, plotInfo, eves, false);
        }
        this.ctrEvent.setEventsByKey(eves, 'rectEdit');
    }
    /**添加响应事件 
     * @param lngLat 经纬度
     * @param i 索引
     * @param plotInfo 标绘数据
     * @param eves 事件
     * @param ifVirtual 是否为虚拟点
    */
    private addEvent(lngLat: [number, number], i: number, plotInfo: DataMapPlot, eves: MapEvent[], ifVirtual?: boolean): void {
        const that = this, { map } = that;
        let circle: MapArc = { ...this.editArc, lnglat: lngLat } as MapArc, { lngLats, type } = plotInfo;
        if (ifVirtual) { circle.size = 3, circle.fillAlpha = 0.9 };
        this.ctrMapAniDraw.addArc(circle);
        let hitLnglat: [number, number] = lngLat;
        if (u_tsMapisAmap(this.map)) {
            /**添加事件的经纬度是84坐标系，需要转换为火星坐标系 */
            const { lat, lng } = u_mapTogps84gcj02(lngLat[0], lngLat[1]);
            hitLnglat = [lng, lat];
        }
        eves.push({
            lnglat: hitLnglat,
            type: 'mousedown',
            cb: () => {
                /**禁止地图拖动 */
                u_mapSetMapStatus(map, 'dragEnable', false)
                /**将计算的虚拟点添加到经纬度 */
                if (ifVirtual) {
                    /**在指定index后添加一个的数据 */
                    for (let j = lngLats.length, end = i + 1; j > end; j--) {
                        lngLats[j] = lngLats[j - 1];
                    }
                    lngLats[i + 1] = lngLat;
                    // this.cbPointAdd && this.cbPointAdd(this.plotAni);
                    this.cbPointChange && this.cbPointChange(this.plotAni!);
                }
                this._redraw();
                let moveCb = (e: LeafletMouseEvent | AMapMapsEvent | MaplibreMouseEvent) => {
                    let { latlng: eLatlng } = u_mapGetMapMouseEvent(e, this.map);
                    let lat84 = eLatlng.lat, lng84 = eLatlng.lng;
                    if (u_tsMapisAmap(this.map)) {
                        /**将鼠标当前的地图原生坐标（高德为火星）转换回 84坐标系 */
                        const { lat, lng } = u_mapTogcj02gps84(eLatlng.lng, eLatlng.lat);
                        lat84 = lat, lng84 = lng;
                    }
                    // let event = u_mapGetMapEvent(e)
                    if (type === 'polygon' || type === 'circle' || type === 'point' || type === 'line') {
                        /**移动点位数据并重绘 */
                        lngLat[0] = lng84;
                        lngLat[1] = lat84;
                    } else if (type === 'rect') {
                        /**计算4个点位数据 ( 不能采用SLTMap.Plot.Info.latLngs因为此值一直在变化 )*/
                        let points = this.calcRect(lngLats);
                        let index = (i + 2) % 4;
                        let p1: [number, number] = [lng84, lat84];
                        let p2 = points[index];
                        this.plotAni!.lngLats = [p1, p2].filter(p => !!p);
                    }
                    this.renderAnimation();
                };
                let upCb = () => {
                    this.map.off('mousemove', moveCb)
                    this.map.off('mouseup', upCb)
                    u_mapSetMapStatus(map, 'dragEnable', true)
                    // this.cbPointMove && this.cbPointMove(this.plotAni);
                    this.cbPointChange && this.cbPointChange(this.plotAni!);
                    this._redraw();
                }
                this.map.on('mousemove', moveCb)
                this.map.on('mouseup', upCb)
            }
        })
    }
    /**事件开关方法 
    * @param flag true开启 false关闭
    */
    private eventSwitch(flag: boolean): void {
        let key: 'on' | 'off' = flag ? 'on' : 'off';
        /**开启事件前需关闭事件防止多次添加 */
        if (flag) this.eventSwitch(false);
        this.map[key]('click', this.eventClick);
        this.map[key]('dblclick', this.eventDblclick);
        this.map[key]('mousemove', this.eventMousemove);
    }
    /**鼠标点击事件
     * @param e 鼠标事件对象
     */
    private eventClick = (e: LeafletMouseEvent | AMapMapsEvent | MaplibreMouseEvent): void => {
        this.eventClickTimer = setTimeout(() => {
            const plot = this.plotAni;
            if (!plot) return;
            let { latlng } = u_mapGetMapMouseEvent(e, this.map);
            let lat84 = latlng.lat, lng84 = latlng.lng;
            if (u_tsMapisAmap(this.map)) {
                /**将鼠标当前的地图原生坐标（高德为火星）转换回 84坐标系 */
                const { lat, lng } = u_mapTogcj02gps84(latlng.lng, latlng.lat);
                lat84 = lat, lng84 = lng;
            }
            const point: [number, number] = [lng84, lat84];
            if (plot.type === 'polygon' || plot.type === 'line') {
                plot.lngLats.push(point);
            } else if (plot.lngLats.length < 2) {
                plot.lngLats = [...plot.lngLats, point];
            }
            /**矩形和圆形只需要两个点 */
            if ((plot.type === 'rect' || plot.type === 'circle') && plot.lngLats.length >= 2) {
                this.eventDblclick();
            } else {
                this._redraw();
            }
            // this.cbPointAdd && this.cbPointAdd(this.plotAni);
            this.cbPointChange && this.cbPointChange(this.plotAni!);
        }, 50);
    }
    /**鼠标移动事件
     * @param e 鼠标事件对象
     */
    private eventMousemove = (e: LeafletMouseEvent | AMapMapsEvent | MaplibreMouseEvent): void => {
        let { latlng } = u_mapGetMapMouseEvent(e, this.map);
        let lat84 = latlng.lat, lng84 = latlng.lng;
        if (u_tsMapisAmap(this.map)) {
            /**将鼠标当前的地图原生坐标（高德为火星）转换回 84坐标系 */
            const { lat, lng } = u_mapTogcj02gps84(latlng.lng, latlng.lat);
            lat84 = lat, lng84 = lng;
        }
        this.curPoint = [lng84, lat84];
        this.renderAnimation();
    }
    /**双击关闭事件 */
    private eventDblclick = (): void => {
        if (this.eventClickTimer) {
            clearTimeout(this.eventClickTimer);
            this.eventClickTimer = null;
        }
        const plot = this.plotAni;
        if (!plot) return;
        const { type, lngLats } = plot;
        if (type === 'polygon' && lngLats.length < 3) {
            return;
        }
        this.close();
        this.curPoint = undefined;
        this._redraw();
    }
    /**移除所有的监听函数 */
    private clearCb(): void {
        this.cbPointAdd = undefined;
        this.cbPointMove = undefined;
        this.cbPointChange = undefined;
    }
    /**绘制时添加了新点位时的回调
     * @param plotAni 绘制的点位数据
    */
    private cbPointChange?: (plotAni: DataMapPlot) => void;
    /**绘制时添加了新点位时的回调
     * @param plotAni 绘制的点位数据
    */
    private cbPointAdd?: (plotAni: DataMapPlot) => void;
    /**绘制时移动已有点位时的回调
     * @param plotAni 绘制的点位数据
    */
    private cbPointMove?: (plotAni: DataMapPlot) => void;
    /**添加新增点位时的监听函数
     * @param cb 回调函数
     * @returns MapPluginPlot实例
     */
    public addCbPointChange(cb: (plotAni: DataMapPlot) => void): MapPluginPlot {
        this.cbPointChange = cb;
        return this
    }
    /**添加新增点位时的监听函数
     * @param cb 回调函数
     * @returns MapPluginPlot实例
     */
    public addCbPointAdd(cb: (plotAni: DataMapPlot) => void): MapPluginPlot {
        this.cbPointAdd = cb;
        return this
    }
    /**添加新增点位时的监听函数
     * @param cb 回调函数
     * @returns MapPluginPlot实例
     */
    public addCbPointMove(cb: (plotAni: DataMapPlot) => void): MapPluginPlot {
        this.cbPointMove = cb;
        return this
    }
    /**标绘列表变化时的回调（新增/删除等） */
    private cbPlotListChange?: (plotList: DataMapPlot[]) => void;
    /**设置标绘列表变化时的监听函数
     * @param cb 回调函数，参数为最新的标绘列表
     * @returns MapPluginPlot实例
     */
    public addCbPlotListChange(cb: (plotList: DataMapPlot[]) => void): MapPluginPlot {
        this.cbPlotListChange = cb;
        return this;
    }
}
