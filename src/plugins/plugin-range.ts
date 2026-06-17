import * as L from "leaflet";
import { MapPluginDraw } from "./plugin-draw";
import { MapCanvasDraw, MapCanvasEvent, MapCanvasLayer, SLUMap } from "../map";
import { u_mapGetAngle, u_mapGetDistance, u_mapGetLatLngByPoint, u_mapGetMapMouseEvent, u_mapGetPointByLatlng } from "../utils/slu-map";
import { SLUCanvas } from "../canvas";
import { OptMapPluginRange, MapEvent, MapLine, MapArc, MapText, MapImageEvent, MapImage, AMapMapsEvent } from "../types";
import { LeafletMouseEvent } from "leaflet";
import { MapMouseEvent as MaplibreMouseEvent } from 'maplibre-gl';
/**测绘类
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap 地图实例
 * @param options 测绘配置
 */
export class MapPluginRange extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: OptMapPluginRange) {
        const map = sluMap.map;
        super(map, options);
        Object.assign(this.options, options);
        /** 动态绘制图层 */
        this.ctrMapDraw = new MapCanvasDraw(map, this.canvas);
        this.ctrMapAniDraw = new MapPluginDraw(sluMap, Object.assign({}, this.options, { className: this.options.className + ' ani' }));
        this.ctrEvent = new MapCanvasEvent(map);
    }
    /**默认配置 */
    public options: OptMapPluginRange = {
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
    private eventClickTimer: ReturnType<typeof setTimeout> | null = null;
    /** 启用测距功能
     * @returns MapPluginRange实例
     */
    public open(): MapPluginRange {
        let i = this.lnglats.length;
        /**不加的话将会每次都删除 */
        if (this.lnglats[i] && this.lnglats[i].length > 0) i++;
        this.lnglats[i] = [];
        this.eventSwitch(true)
        return this;
    }
    /** 关闭测距功能
     * @param flag @default true 是否关闭事件监听
     */
    public close(flag: boolean = true): void {
        this.eventSwitch(false);
        flag && this.endCb?.();
    }
    /** 测距结束回调函数 */
    endCb?: () => void;
    /** 测距结束回调函数 */
    public onEnd(cb: () => void): void {
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
                    let distance = u_mapGetDistance([per.lat, per.lng], [p.lat, p.lng], this.map);
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
    /** 渲染动画 */
    protected renderAnimation(): void {
        if (!this.map) return;
        this.genAniLineDate();
    }
    /** 动画虚线绘制 */
    private genAniLineDate(): void {
        let layer = this.ctrMapAniDraw;
        layer.setAllTexts([]).setAllLines([]);
        let lineLen = this.lnglats.length;
        let last = this.lnglats[lineLen - 1] || [];
        /**虚线绘制 */
        if (this.lnglat && this.lnglat.lat !== undefined && last.length > 0) {
            let p = last[last.length - 1];
            let distance = u_mapGetDistance([this.lnglat.lat, this.lnglat.lng], [p.lat, p.lng], this.map);
            let θ = u_mapGetAngle(this.map, [p.lat, p.lng], [this.lnglat.lat, this.lnglat.lng])
            let text = (distance > 1852 ? ((distance / 1852).toFixed(2) + ' nm') : (distance.toFixed(0) + ' m')) + '/' + θ.toFixed(2) + '°';
            layer.setAllLines([{ latlngs: [[this.lnglat.lat, this.lnglat.lng], [p.lat, p.lng]], dash: [3, 3], colorLine: '#364A7D' }]);
            layer.setAllTexts([{ latlng: [this.lnglat.lat, this.lnglat.lng], text, colorFill: '#FFFFFF' }])
        }
        layer.drawMapAll();
    }
    /** 绘制文本信息  flag标识该条线已经绘制完成
     * @param info 文本信息
     * @param lineId 线索引
     * @returns MapImage实例
     */
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

    /**控制地图监听事件
   * @param map 地图实例
   * @param key 事件类型
   */
    private eventSwitch(flag: boolean): void {
        let key: 'on' | 'off' = flag ? 'on' : 'off';
        /**开启事件前需关闭事件防止多次添加 */
        if (flag) this.eventSwitch(false);
        this.map[key]('drag', this.eventDrag);
        this.map[key]('dragend', this.eventDragend);
        this.map[key]('click', this.eventClick);
        this.map[key]('dblclick', this.eventDblclick);
        this.map[key]('mousemove', this.eventMousemove);
    }
    /** 拖动事件 */
    private eventDrag = (): void => {
        this.ifDrag = true;
    }
    /** 拖动结束事件 */
    private eventDragend = (): void => {
        this.ifDrag = false;
    }
    /** 单击事件
     * @param e 事件对象
     */
    private eventClick = (e: LeafletMouseEvent | AMapMapsEvent | MaplibreMouseEvent): void => {
        this.eventClickTimer = setTimeout(() => {
            const { latlng } = u_mapGetMapMouseEvent(e, this.map);
            let lnglat = new L.LatLng(latlng.lat, latlng.lng);
            let lnglats = this.lnglats[this.lnglats.length - 1];
            lnglats.push(lnglat);
            this.renderFixedData();
            this.renderAnimation();
        }, 100);
    }
    /** 鼠标移动事件
     * @param e 事件对象
     */
    private eventMousemove = (e: LeafletMouseEvent | AMapMapsEvent | MaplibreMouseEvent): void => {
        if (this.ifDrag) return;
        const { latlng } = u_mapGetMapMouseEvent(e, this.map);
        this.lnglat = new L.LatLng(latlng.lat, latlng.lng);
        this.renderAnimation();
    }
    /** 双击关闭事件 */
    private eventDblclick = (): void => {
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
