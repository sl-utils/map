
import { MapCanvasDraw, MapCanvasEvent, MapCanvasLayer } from "../map";
import { MapPluginDraw } from "./plugin-draw";
import { u_mapGetLatLngByPoint, u_mapGetLngDiffByDistance, u_mapGetMapMouseEvent, u_mapGetPointByLatlng, u_mapSetMapStatus } from "../utils/slu-map";
import { u_arrAddItemsIndex } from "../utils/slu-array";
/**自定义标绘类 需要调用addTo添加到map地图中 */
export class MapPluginPlot extends MapCanvasLayer {
    constructor(map: AMAP.Map | L.Map, options?: SLPMap.Plot) {
        super(map, options);
        this.ctrMapDraw = new MapCanvasDraw(map, this.canvas);
        this.ctrMapAniDraw = new MapPluginDraw(map, Object.assign({}, this.options, { className: this.options.className + ' ani' }));
        this.ctrEvent = new MapCanvasEvent(map);
        Object.assign(this.options, options);
    }
    /**默认配置 */
    public options: SLPMap.Plot = {
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
    private editArc: MapArc = {
        latlng: [0, 0],
        colorFill: '#fff',
        colorLine: '#2C9B8A',
        size: 4,
    };
    /**所有的标绘集合 */
    private plotList: MapPlotInfo<MapPlotType>[] = [];
    /**正在动态绘制的标(仅仅改变图形不会动态改变原始数据) */
    public plotAni?: MapPlotInfo = { latLngs: [], type: 'polygon', ifEdit: true };
    /**记录当前鼠标纬经度 */
    private curPoint?: [number, number];
    /** 单击事件 */
    private eventClickTimer: NodeJS.Timeout | undefined;
    /**开启新增的绘制 */
    public open<T extends MapPlotType>(type: T): MapPlotInfo<T> {
        /**移除掉之前添加的所有的监听函数 */
        // this.clearCb();
        let i = this.plotList.length - 1 > 0 ? this.plotList.length - 1 : 0;
        this.eventSwitch(true);
        /**存在正在编辑的或者正在绘制的就是新增的，且还未保存则直接重新绘制（还能保证颜色就是之前的设置）*/
        let plot = this.plotList.find(info => info.ifEdit);
        if (plot || (this.plotAni === this.plotList[i] && this.plotAni.ifEdit)) {
            let cur: MapPlotInfo = plot || this.plotAni!;
            this.plotAni = cur;
            cur.latLngs = [];
            cur.type = type;
            cur.ifEdit = true;
            return this.plotAni as MapPlotInfo<typeof type>;
        };
        /**不加的话将会每次都删除 */
        if (this.plotList[i] && this.plotList[i].latLngs.length > 0) i++;
        this.plotList[i] = this.plotAni = { latLngs: [], type: type, ifEdit: true } as MapPlotInfo;
        this.renderAnimation();
        return this.plotAni as MapPlotInfo<typeof type>;
    }
    /**关闭绘制 */
    public close() {
        this.eventSwitch(false);
        return this;
    }
    /**保存标绘 */
    public savePlot() {
        if (this.plotAni) {
            let plot = this.plotAni;
            plot.ifEdit = false;
            this.plotAni = undefined;
            this.redraw();
        }
        return this;
    }
    /**删除标绘 */
    public delPlot(plot?: MapPlotInfo) {
        plot = plot || this.plotAni;
        this.plotList = this.plotList.filter(info => info !== plot);
        this._redraw();
        return this;
    }
    /**设置所有区域数据 */
    public setPlotList(plotList: MapPlotInfo[]) {
        this.plotList = plotList;
        this.renderFixedData();
        return this;
    }
    /**设置编辑区域数据 */
    public setEditPlot(plot: MapPlotInfo) {
        let info = this.plotList.find(info => info === plot);
        info && (info.ifEdit = true);
        this.eventSwitch(false);
        this._redraw();
        return this;
    }
    /**重绘 */
    public redraw() {
        this._redraw();
        return this;
    }
    protected renderFixedData() {
        if (!this.map) return;
        this.ctrMapDraw.delAll();
        this.ctrMapDraw.reSetCanvas();
        this.plotList.forEach((info, i) => {
            if (info.latLngs.length > 0 && !info.ifEdit && info.ifHide !== true) {
                this.drawPlot(this.ctrMapDraw, info, info.type);
            }
        });
        this.ctrMapDraw.drawMapAll();
    }
    protected renderAnimation() {
        if (!this.map) return;
        this.genAniPlot();
    }
    /**生成动态绘制图层 */
    private genAniPlot() {
        this.ctrMapAniDraw.delAll();
        this.ctrMapAniDraw.resetCanvas();
        this.ctrEvent.clearAllEvents();
        let polygon = this.plotList.find(info => info.ifEdit);
        /**动态绘制图层绘制正处于编辑态的标绘 */
        if (polygon) {
            this.plotAni = polygon;
            let plotAni = { ...polygon }, latlngs = polygon.latLngs;
            /**圆的特殊判断不然小手一抖，多个点 */
            if (this.curPoint && (plotAni.type === 'circle' && latlngs.length < 2 || plotAni.type !== 'circle')) {
                plotAni.latLngs = [...latlngs, this.curPoint]
            }
            this.drawPlot(this.ctrMapAniDraw, plotAni, plotAni.type);
            this.openMouseEdit(plotAni);
            this.ctrMapAniDraw.drawMapAll();
            return;
        }
    }
    /**绘制标绘 */
    private drawPlot(layer: MapCanvasDraw | MapPluginDraw, plotInfo: MapPlotInfo, type: MapPlotType) {
        let info = Object.assign({}, this.options, plotInfo);
        info.colorFill = info.colorFill;
        info.colorLine = info.colorLine || info.colorFill;
        let latlngs: [number, number][];
        switch (type) {
            case 'line':
                info = info as MapPlotInfo<'line'>
                layer.addLine({ ...info, latlngs: info.latLngs });
                break;
            case 'polygon':
                info = info as MapPlotInfo<'polygon'>
                latlngs = info.latLngs;
                let polygon: MapRect = { ...info, latlngs };
                layer.addRect(polygon);
                break;
            case 'circle':
                info = info as MapPlotInfo<'circle'>
                if (info.latLngs.length == 0) break;
                let slatlng = info.latLngs[0], elatlng = info.latLngs[1], rail = info?.rail || 0;
                if (!elatlng) {
                    let [lat, lng] = slatlng;
                    let lngDis = u_mapGetLngDiffByDistance(this.map, rail, [[lat, lng]])
                    info.latLngs[1] = [slatlng[0], lng + lngDis];
                }
                let size = this.calcRadius(info.latLngs);
                layer.addArc({ ...info, size, latlng: slatlng });
                break;
            case 'rect':
                info = info as MapPlotInfo<'rect'>
                latlngs = this.calcRect(info.latLngs);
                let rect: MapRect = { ...info, latlngs };
                layer.addRect(rect);
                break;
            case 'point':
                latlngs = info.latLngs;
                if (!latlngs || latlngs.length == 0) break;
                const { url, size: pSize = [16, 16] } = info = info as MapPlotInfo<'point'>
                if (url) {
                    layer.addImg({ ...info, latlng: latlngs[0], size: pSize })
                }
                break;
        }
        let name: MapText = { text: info.name || '', colorFill: "#2C9B8A", widthLine: 2, colorLine: '#FFFFFF', ifShadow: true, latlng: this.calcCenter(info.latLngs, type) }
        layer.addText(name);
    }
    /**各个点的平均值计算中心点 */
    private calcCenter(points: [number, number][], type: MapPlotType): [number, number] {
        let len = points.length
        if (len < 2 || type === 'circle' || type == 'point') return (points[0] || [0, 0]);
        if (type == 'line') {
            // 加权计算线长度 选取中心点
            let totalLength = 0;
            let weightedXSum = 0;
            let weightedYSum = 0;
            for (let i = 0; i < points.length - 1; i++) {
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
    /**直接最大最小计算中心点 */
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
    /**计算多边形的重心*/
    private calcCenter3(points: [number, number][]): [number, number] {
        let xSum = 0;
        let ySum = 0;
        let areaSum = 0;
        for (let i = 0; i < points.length; i++) {
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
    /**计算矩形的四个点 */
    private calcRect(latLngs: [number, number][]): [number, number][] {
        if (latLngs.length < 2) return latLngs;
        let latlngs: [number, number][] = [];
        let latlng1 = latLngs[0];
        let latlng2 = latLngs[1];
        latlngs.push(latlng1);
        latlngs.push([latlng1[0], latlng2[1]]);
        latlngs.push(latlng2);
        latlngs.push([latlng2[0], latlng1[1]]);
        return latlngs;
    }
    /**计算圆的半径 */
    private calcRadius(latLngs: [number, number][]): number {
        if (latLngs.length < 2) return 0;
        let point1 = u_mapGetPointByLatlng(this.map, latLngs[0]);
        let point2 = u_mapGetPointByLatlng(this.map, latLngs[1]);
        let x = Math.abs(point1[0] - point2[0]);
        let y = Math.abs(point1[1] - point2[1]);
        return Math.sqrt(x * x + y * y);
    }
    /**开启鼠标编辑功能 */
    private openMouseEdit(plotInfo: MapPlotInfo) {
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
    /**设置圆的编辑点 */
    private setCircleEditPoint(plotInfo: MapPlotInfo): void {
        let { latLngs } = plotInfo;
        let eves: MapEvent[] = [];
        for (let i = 0, len = latLngs.length; i < len; i++) {
            let s = latLngs[i];
            this.addEvent(s, i, plotInfo, eves, false);
        }
        let line: MapLine = { ...this.options, latlngs: plotInfo.latLngs };
        this.ctrMapAniDraw.addLine(line);
        this.ctrEvent.setEventsByKey(eves, 'circleEdit');
    }
    /**设置多边形的编辑点 */
    private setPolygonEditPoint(plotInfo: MapPlotInfo): void {
        let { latLngs } = plotInfo;
        let eves: MapEvent[] = [];
        for (let i = 0, len = latLngs.length; i < len; i++) {
            let s = latLngs[i];
            this.addEvent(s, i, plotInfo, eves, false);
            if (!this.curPoint) {
                /**编辑时可能的新增点位*/
                let next = i + 1 == len ? 0 : i + 1, e = latLngs[next];
                /**把相邻两个经纬度点转为xy，计算canvas的中心点,再将该中心点转为经纬度点 */
                let point1 = u_mapGetPointByLatlng(this.map, s)
                let point2 = u_mapGetPointByLatlng(this.map, e)
                let x = (point1[0] + point2[0]) / 2, y = (point1[1] + point2[1]) / 2;
                let point = u_mapGetLatLngByPoint(this.map, [x, y])
                this.addEvent(point, i, plotInfo, eves, true);
            }
        }
        this.ctrEvent.setEventsByKey(eves, 'polygonEdit');
    }
    /**点标绘仍可编辑移动位置 */
    private setPointEdit(plotInfo: MapPlotInfo): void {
        let { latLngs } = plotInfo
        if (!latLngs) return;
        let eves: MapEvent[] = [];
        this.addEvent(latLngs[0], 0, plotInfo, eves);
        this.ctrEvent.setEventsByKey(eves, 'pointEdit')
    }
    /**设置线段的编辑点 */
    private setLineEditPoint(plotInfo: MapPlotInfo): void {
        let { latLngs } = plotInfo;
        let eves: MapEvent[] = [];
        for (let i = 0, len = latLngs.length; i < len; i++) {
            let s = latLngs[i];
            this.addEvent(s, i, plotInfo, eves, false);
        }
        this.ctrEvent.setEventsByKey(eves, 'lineEdit');
    }
    /**设置矩形的编辑点 */
    private setRectEditPoint(plotInfo: MapPlotInfo): void {
        /**存储的两个点 */
        let { latLngs } = plotInfo;
        /**计算出的四个点 */
        let latlngs: [number, number][] = this.calcRect(latLngs);
        let eves: MapEvent[] = [];
        for (let i = 0, len = latlngs.length; i < len; i++) {
            let latLng = latlngs[i];
            this.addEvent(latLng, i, plotInfo, eves, false);
        }
        this.ctrEvent.setEventsByKey(eves, 'rectEdit');
    }
    /**添加响应事件 
     * @param latLng 经纬度
     * @param i 索引
     * @param plotInfo 绘制信息
     * @param eves 事件
     * @param ifVirtual 是否为虚拟点
    */
    private addEvent(latLng: [number, number], i: number, plotInfo: MapPlotInfo, eves: MapEvent[], ifVirtual?: boolean) {
        const that = this, { map } = that;
        let circle: MapArc = { ...this.editArc, latlng: latLng }, { latLngs, type } = plotInfo, { } = this;
        if (ifVirtual) { circle.size = 3, circle.fillAlpha = 0.9 };
        this.ctrMapAniDraw.addArc(circle);
        eves.push({
            latlng: latLng,
            type: 'mousedown',
            cb: (info) => {
                /**禁止地图拖动 */
                u_mapSetMapStatus(map, 'dragEnable', false)
                /**将计算的虚拟点添加到经纬度 */
                if (ifVirtual) {
                    u_arrAddItemsIndex(plotInfo.latLngs, [latLng], i);
                    // this.cbPointAdd && this.cbPointAdd(this.plotAni);
                    this.cbPointChange && this.cbPointChange(this.plotAni!);
                }
                this._redraw();
                let moveCb = (e: L.LeafletMouseEvent | AMapMapsEvent) => {
                    const { latlng: eLatlng } = u_mapGetMapMouseEvent(e, this.type);
                    // let event = u_mapGetMapEvent(e)
                    if (type === 'polygon' || type === 'circle' || type === 'point' || type === 'line') {
                        /**移动点位数据并重绘 */
                        latLng[0] = eLatlng.lat;
                        latLng[1] = eLatlng.lng;
                    } else if (type === 'rect') {
                        /**计算4个点位数据 ( 不能采用SLTMap.Plot.Info.latLngs因为此值一直在变化 )*/
                        let points = this.calcRect(latLngs);
                        let index = (i + 2) % 4;
                        let p1: [number, number] = [eLatlng.lat, eLatlng.lng];
                        let p2 = points[index];
                        this.plotAni!.latLngs = [p1, p2].filter(p => !!p);
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
    private eventSwitch(flag: boolean) {
        let key: 'on' | 'off' = flag ? 'on' : 'off';
        /**开启事件前需关闭事件防止多次添加 */
        if (flag) this.eventSwitch(false);
        this.map[key]('click', this.eventClick);
        this.map[key]('dblclick', this.eventDblclick);
        this.map[key]('mousemove', this.eventMousemove);
    }
    private eventClick = (e: L.LeafletMouseEvent | AMapMapsEvent) => {
        this.eventClickTimer = setTimeout(() => {
            let len = this.plotAni!.latLngs.length, type = this.plotAni!.type;
            const { latlng } = u_mapGetMapMouseEvent(e, this.type);
            if (type === 'polygon' || type === 'line' || len < 2) (this.plotAni!.latLngs as any).push([latlng.lat, latlng.lng]);
            /**矩形和圆形只需要两个点 */
            if ((type === 'rect' || type === 'circle') && this.plotAni!.latLngs.length >= 2) {
                this.eventDblclick();
            } else {
                this._redraw();
            }
            // this.cbPointAdd && this.cbPointAdd(this.plotAni);
            this.cbPointChange && this.cbPointChange(this.plotAni!);
        }, 50);
    }
    /** 鼠标移动事件 */
    private eventMousemove = (e: L.LeafletMouseEvent | AMapMapsEvent) => {
        const { latlng } = u_mapGetMapMouseEvent(e, this.type);
        this.curPoint = [latlng.lat, latlng.lng];
        this.renderAnimation();
    }
    /** 双击关闭事件 */
    private eventDblclick = () => {
        if (this.eventClickTimer) {
            clearTimeout(this.eventClickTimer);
            this.eventClickTimer = null;
        }
        if (this.plotAni!.type === 'polygon' && this.plotAni!.latLngs.length < 3) {
            return;
        }
        this.close();
        this.curPoint = undefined;
        this._redraw();
    }
    /**移除所有的监听函数 */
    private clearCb() {
        this.cbPointAdd = undefined;
        this.cbPointMove = undefined;
        this.cbPointChange = undefined;
    }
    /**绘制时添加了新点位时的回调*/
    private cbPointChange?: (plotAni: MapPlotInfo) => void;
    /**绘制时添加了新点位时的回调*/
    private cbPointAdd?: (plotAni: MapPlotInfo) => void;
    /**绘制时移动已有点位时的回调*/
    private cbPointMove?: (plotAni: MapPlotInfo) => void;
    /**添加新增点位时的监听函数 */
    public addCbPointChange(cb: (plotAni: MapPlotInfo) => void) {
        this.cbPointChange = cb;
        return this
    }
    /**添加新增点位时的监听函数 */
    public addCbPointAdd(cb: (plotAni: MapPlotInfo) => void) {
        this.cbPointAdd = cb;
        return this
    }
    /**添加新增点位时的监听函数 */
    public addCbPointMove(cb: (plotAni: MapPlotInfo) => void) {
        this.cbPointMove = cb;
        return this
    }
}
