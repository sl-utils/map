import * as L from "leaflet";
import { MapPluginDraw } from "./plugin-draw";
import { MapCanvasDraw, MapCanvasEvent, MapCanvasLayer } from "../map";
import { u_mapGetAngle, u_mapGetDistance, u_mapGetLatLngByPoint, u_mapGetMapMouseEvent, u_mapGetPointByLatlng } from "../utils/slu-map";
import { SLUCanvas } from "../canvas";
/** 测绘类 */
export class MapPluginRange extends MapCanvasLayer {
    /** 测绘类，传入Amap或者调用addTo */
    constructor(map: L.Map | AMAP.Map, options?: SLPMap.Range) {
        super(map, options);
        Object.assign(this.options, options);
        /** 动态绘制图层 */
        this.ctrMapDraw = new MapCanvasDraw(map, this.canvas);
        this.ctrMapAniDraw = new MapPluginDraw(map, Object.assign({}, this.options, { className: this.options.className + ' ani' }));
        this.ctrEvent = new MapCanvasEvent(map);
    }
    /**默认配置 */
    public options: SLPMap.Range = {
        pane: 'canvas',
        className: 'range',
        colorLine: '#364A7D',
        colorArc: '#FFF',
        colorArcStart: '#415880',
        colorFont: ' #333333',

    };
    /** 地图事件控制管理对象 */
    private ctrEvent: MapCanvasEvent;
    /** 地图基础绘制类 */
    private ctrMapDraw: MapCanvasDraw;
    /** 动画绘制类 */
    private ctrMapAniDraw: MapPluginDraw;
    /** 所有的已确定的经纬度 (绘制确定的点线)*/
    private lnglats: L.LatLng[][] = [];
    /** 鼠标当前所在的经纬度(绘制虚线) */
    private lnglat?: L.LatLng;
    /** 是否正在拖动地图 */
    private ifDrag: boolean = false;
    /** 单击事件 */
    private eventClickTimer: NodeJS.Timeout | undefined;
    public setOptions(opt: SLPMap.Range) {
        Object.assign(this.options, opt);
        this._redraw();
        return this;
    }
    /** 启用测距功能 */
    public open() {
        let i = this.lnglats.length;
        /**不加的话将会每次都删除 */
        if (this.lnglats[i] && this.lnglats[i].length > 0) i++;
        this.lnglats[i] = [];
        this.eventSwitch(true)
        return this;
    }
    /** 关闭测距功能 */
    public close(flag: boolean = true) {
        this.eventSwitch(false);
        flag && this.endCb?.();
    }
    endCb?: () => void;
    public onEnd(cb: () => void) {
        this.endCb = cb;
    }
    /** 缓存绘图数据（对于引进确定的数据进行缓存） */
    protected renderFixedData(): void {
        this.ctrMapDraw.reSetCanvas();
        this.ctrEvent.clearEventsByKey('range');
        // 暂存事件
        let eves: MapEvent[] = [];
        let lineLen = this.lnglats.length, lines: MapLine[] = [], arcs: MapArc[] = [], texts: MapText[] = [], imgs: MapImageEvent[] = [], opt = this.options;
        for (let i = 0; i < lineLen; i++) {
            let lnglats = this.lnglats[i], latlngs: [number, number][] = [], all = 0;
            for (let j = 0, len = lnglats.length; j < len; j++) {
                let p = lnglats[j], latlng: [number, number] = [p.lat, p.lng], text = '起点';
                latlngs.push(latlng)
                if (j == 0) {
                    let arc: MapArc = { latlng: latlngs[0], size: 3, colorFill: opt.colorArcStart, colorLine: opt.colorLine };
                    arcs.push(arc);
                    texts.push({ text, latlng, colorFill: opt.colorFont, py: -12, px: 5, textAlign: 'right', panel: { colorFill: '#fff', fillAlpha: 0.8, colorLine: '#90A4A4', widthLine: 1 } })
                } else {
                    let per = lnglats[j - 1], pr = 5;
                    let distance = u_mapGetDistance([per.lat, per.lng], [p.lat, p.lng], 0);
                    let θ = u_mapGetAngle(this.map, [per.lat, per.lng], [p.lat, p.lng])
                    all += distance;
                    text = (distance > 1852 ? ((distance / 1852).toFixed(2) + ' nm') : (distance.toFixed(0) + ' m')) + '/' + θ.toFixed(2) + '°';
                    if (j == len - 1 && (i < lineLen - 1 || this.lnglat === undefined)) {
                        text = text + ';' + (all > 1852 ? ((all / 1852).toFixed(2) + ' nm') : (all.toFixed(0) + ' m'));
                        pr = 20;
                        // imgs.push(this.drawEndTextImg({ text, latlng, pr }, i))
                        imgs.push({
                            latlng: latlng,
                            posX: 17,
                            posY: 34,
                            left: 20,
                            size: [16, 16],
                            sizeo: [16, 16],
                            type: 'click',
                            url: '/assets/icons/icon-16.png',
                        });
                        eves.push({
                            latlng: latlng,
                            range: [8, 8],
                            type: 'click',
                            left: 20,
                            cb: () => {
                                this.lnglats.splice(i, 1);
                                this._redraw();
                            }
                        })
                    }
                    texts.push({
                        text, colorFill: opt.colorFont, latlng, py: -12, px: 5, textAlign: 'right', panel: {
                            pr, colorFill: '#fff', fillAlpha: 0.8, colorLine: '#90A4A4', widthLine: 1
                        }
                    })
                }
            }
            let arcLatlngs = [...latlngs];
            arcLatlngs.shift()
            let arc: MapArc = { latlngs: arcLatlngs, size: 3, colorFill: opt.colorArc, colorLine: opt.colorLine };
            let line: MapLine = { latlngs, colorLine: opt.colorLine };
            lines.push(line);
            arcs.push(arc);
        }
        this.ctrEvent.setEventsByKey(eves, 'range');
        this.ctrMapDraw.setAllImgs(imgs);
        this.ctrMapDraw.setAllLines(lines);
        this.ctrMapDraw.setAllArcs(arcs);
        this.ctrMapDraw.setAllTexts(texts);
        this.ctrMapDraw.drawMapAll();
    }
    protected renderAnimation() {
        if (!this.map) return;
        this.genAniLineDate();
    }
    /** 动画虚线绘制 */
    private genAniLineDate() {
        let layer = this.ctrMapAniDraw;
        layer.setAllTexts([]).setAllLines([]);
        let lineLen = this.lnglats.length;
        let last = this.lnglats[lineLen - 1] || [];
        /**虚线绘制 */
        if (this.lnglat && this.lnglat.lat !== undefined && last.length > 0) {
            let p = last[last.length - 1];
            let distance = u_mapGetDistance([this.lnglat.lat, this.lnglat.lng], [p.lat, p.lng], 0);
            let θ = u_mapGetAngle(this.map, [p.lat, p.lng], [this.lnglat.lat, this.lnglat.lng])
            let text = (distance > 1852 ? ((distance / 1852).toFixed(2) + ' nm') : (distance.toFixed(0) + ' m')) + '/' + θ.toFixed(2) + '°';
            layer.setAllLines([{ latlngs: [[this.lnglat.lat, this.lnglat.lng], [p.lat, p.lng]], dash: [3, 3], colorLine: '#364A7D' }]);
            layer.setAllTexts([{ latlng: [this.lnglat.lat, this.lnglat.lng], text, colorFill: '#FFFFFF' }])
        }
        layer.drawMapAll();
    }
    /** 绘制文本信息  flag标识该条线已经绘制完成 */
    protected drawEndTextImg(info: MapText, lineId: number): MapImage {
        let { latlng, panel, text = 'text' } = info;
        let point = u_mapGetPointByLatlng(this.map, latlng)
        let ctx = document.createElement('canvas').getContext('2d')!
        /**字体配置决定meas的值，所以计算前需要设置配置 */
        SLUCanvas.setCtxPara(ctx, info);
        let meas = ctx.measureText(text)
        let w = meas.width;
        /**从CanvasRenderingContext2D.textBaseline 属性标明的水平线到渲染文本的矩形边界顶部的距离 */
        let y1 = meas.actualBoundingBoxAscent;
        /**从CanvasRenderingContext2D.textBaseline 属性标明的水平线到渲染文本的矩形边界底部的距离 */
        let y2 = meas.actualBoundingBoxDescent;
        /**使文本渲染水平位置在指定位置的中心*/
        let x0 = point[0] - w / 2;
        /**使文本渲染垂直位置在指定位置的中心*/
        let y0 = point[1] - (y1 - y2) / 2;
        let size = 16;
        let px = x0 + w + 5 + size / 2, py = y0 - (y1 - y2) / 2;
        let mapLatlng = u_mapGetLatLngByPoint(this.map, [px, py])
        // SLUCanvas.drawImg({
        //     point: [px, py], url: '/assets/images/icon/com_close_red.png', size: [16, 16]
        // }, this.ctx);
        // this.aniLayer.addImg({
        //     latlng: mapLatlng,
        //     url: '/assets/images/icon/com_close_red.png',
        //     size: [16, 16],
        // })
        this.ctrEvent.pushEventByKey('text', {
            latlng: mapLatlng,
            point: [px, py],
            range: [10, 10],
            type: 'click',
            cb: () => {
                this.lnglats.splice(lineId, 1);
                this._redraw();
            }
        })
        return {
            latlng: mapLatlng,
            url: '/assets/images/icon/com_close_red.png',
            size: [16, 16],
        }
    }

    /**事件开关方法 
            * @param flag true开启 false关闭
    */
    private eventSwitch(flag: boolean) {
        let key: 'on' | 'off' = flag ? 'on' : 'off';
        /**开启事件前需关闭事件防止多次添加 */
        if (flag) this.eventSwitch(false);
        this.map[key]('drag', this.eventDrag);
        this.map[key]('dragend', this.eventDragend);
        this.map[key]('click', this.eventClick);
        this.map[key]('dblclick', this.eventDblclick);
        this.map[key]('mousemove', this.eventMousemove);
    }
    private eventDrag = (e: L.LeafletMouseEvent) => {
        this.ifDrag = true;
    }
    private eventDragend = (e: L.LeafletMouseEvent) => {
        this.ifDrag = false;
    }
    /** 单击事件 */
    private eventClick = (e: L.LeafletMouseEvent | AMapMapsEvent) => {
        console.log(e)
        this.eventClickTimer = setTimeout(() => {
            const { latlng } = u_mapGetMapMouseEvent(e, this.type);
            let lnglat = new L.LatLng(latlng.lat, latlng.lng);
            let lnglats = this.lnglats[this.lnglats.length - 1];
            lnglats.push(lnglat);
            this.renderFixedData();
            this.renderAnimation();
        }, 100);
    }
    /** 鼠标移动事件 */
    private eventMousemove = (e: L.LeafletMouseEvent | AMapMapsEvent) => {
        if (this.ifDrag) return;
        const { latlng } = u_mapGetMapMouseEvent(e, this.type);
        this.lnglat = new L.LatLng(latlng.lat, latlng.lng);
        this.renderAnimation();
    }
    /** 双击关闭事件 */
    private eventDblclick = () => {
        if (this.eventClickTimer) {
            clearTimeout(this.eventClickTimer);
            this.eventClickTimer = null;
        }
        this.close();
        this.lnglat = undefined;
        this.renderFixedData();
        this.renderAnimation();
    }
}