import * as L from "leaflet";
import { MapPluginDraw } from "./plugin-draw";
import { MapCanvasDraw, MapCanvasEvent, MapCanvasLayer, SLUMap } from "../map";
import { um_deepMergeOpt, um_getAngle, um_getDistance, um_getLngLatByPoint, um_getMapMouseEvent, um_getPointByLnglat } from "../utils";
import { SLUCanvas } from "../canvas";
import type { MapEvent, MapLine, MapArc, MapText, MapImageEvent, MapImage, AMapMapsEvent ,MOptCanvas} from "../map";
import type { CanvasTextPanel } from "../canvas";
import { LeafletMouseEvent } from "leaflet";
import { MapMouseEvent as MaplibreMouseEvent } from 'maplibre-gl';

/**
 * 测距插件
 *
 * 用于在地图上进行距离测量，支持多点测距、实时距离显示、方位角计算等。
 * 支持多条测距线同时存在，可删除单条测距线。
 *
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap SLUMap 地图实例
 * @param options 测距配置
 *
 * @example
 * ```typescript
 * import { SLUMap, MapPluginRange } from '@sl-utils/map';
 *
 * const map = new SLUMap('map');
 * await map.init({ type: 'L' });
 *
 * // 创建测距插件
 * const range = new MapPluginRange(map, {
 *   colorLine: '#364A7D',
 *   colorArc: '#FFF',
 *   colorArcStart: '#415880',
 *   colorFont: '#333333',
 *   textPanel: {
 *     radius: 3,
 *     pl: 2, pr: 2, pt: 2, pb: 2,
 *     colorFill: '#fff',
 *     fillAlpha: 0.8,
 *     colorLine: '#90A4A4',
 *     widthLine: 1
 *   }
 * });
 *
 * // 开启测距模式
 * range.open();
 *
 * // 监听测距结束
 * range.onEnd(() => {
 *   console.log('测距结束');
 * });
 *
 * // 关闭测距模式
 * range.close();
 *
 * // 移除图层
 * range.onRemove();
 * ```
 */
export class MapPluginRange extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: MOptPluginRange) {
        const map = sluMap.map;
        super(map, options);
        if (options) this.options = um_deepMergeOpt(this.options, options);
        /** 动态绘制图层 */
        this.ctrMapDraw = new MapCanvasDraw(map, this.canvas);
        const aniOpt = um_deepMergeOpt(this.options, { className: this.options.className + ' ani' });
        this.ctrMapAniDraw = new MapPluginDraw(sluMap, aniOpt);
        this.ctrEvent = new MapCanvasEvent(map);
    }
    /**默认配置 */
    public options: MOptPluginRange = {
        pane: 'canvas',
        className: 'range',
        colorLine: '#364A7D',
        colorArc: '#FFF',
        colorArcStart: '#415880',
        colorFont: ' #333333',
        textPanel: {
            radius: 3,
            pl: 2,
            pr: 2,
            pt: 2,
            pb: 2,
            colorFill: '#fff',
            fillAlpha: 0.8,
            colorLine: '#90A4A4',
            widthLine: 1
        }
    };
    /** 地图事件控制管理对象 */
    private ctrEvent: MapCanvasEvent;
    /** 地图基础绘制类 */
    private ctrMapDraw: MapCanvasDraw;
    /** 动画绘制类 */
    private ctrMapAniDraw: MapPluginDraw;
    /** 所有的已确定的经纬度 (绘制确定的点线)[多条测距线]*/
    private lnglatLists: [number, number][][] = [];
    /** 鼠标当前所在的经纬度(绘制虚线) */
    private lnglat?: [number, number];
    /** 是否正在拖动地图 */
    private ifDrag: boolean = false;
    /** 单击事件 */
    private flagTimeout: ReturnType<typeof setTimeout> | null = null;
    /** 启用测距功能
     * @returns MapPluginRange实例
     */
    public open(): MapPluginRange {
        let i = this.lnglatLists.length;
        /**不加的话将会每次都删除 */
        if (this.lnglatLists[i] && this.lnglatLists[i].length > 0) i++;
        this.lnglatLists[i] = [];
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
        const { lnglatLists, options } = this, { textPanel, colorFont, colorLine, colorArcStart, colorArc } = options;
        const lineLen = lnglatLists.length, lines: MapLine[] = [], arcs: MapArc[] = [], texts: MapText[] = [], imgs: MapImageEvent[] = [];
        for (let i = 0; i < lineLen; i++) {
            const lnglats = lnglatLists[i], lngLats: [number, number][] = [];
            let allDis = 0;
            for (let j = 0, len = lnglats.length; j < len; j++) {
                let cur = lnglats[j], lnglat: [number, number] = cur, text = '起点';
                lngLats.push(lnglat)
                if (j == 0) {
                    let arc: MapArc = { lnglat: lngLats[0], size: 3, colorFill: colorArcStart, colorLine: colorLine };
                    arcs.push(arc);
                    texts.push({ text, lnglat, colorFill: colorFont, py: -12, px: 5, textAlign: 'right', panel: textPanel })
                } else {
                    let per = lnglats[j - 1], pr = 5;
                    let distance = um_getDistance(per, cur, this.map);
                    let θ = um_getAngle(this.map, per, cur)
                    allDis += distance;
                    text = (distance > 1852 ? ((distance / 1852).toFixed(2) + ' nm') : (distance.toFixed(0) + ' m')) + '/' + θ.toFixed(2) + '°';
                    if (j == len - 1 && (i < lineLen - 1 || this.lnglat === undefined)) {
                        text = text + ';' + (allDis > 1852 ? ((allDis / 1852).toFixed(2) + ' nm') : (allDis.toFixed(0) + ' m'));
                        pr = 20;
                        // imgs.push(this.drawEndTextImg({ text, latlng, pr }, i))
                        imgs.push({
                            lnglat: lnglat,
                            posX: 17,
                            posY: 34,
                            left: 20,
                            size: [16, 16],
                            sizeo: [16, 16],
                            type: 'click',
                            url: '/assets/icons/icon-16.png',
                        });
                        eves.push({
                            lnglat: lnglat,
                            range: [8, 8],
                            type: 'click',
                            left: 20,
                            cb: () => {
                                this.lnglatLists.splice(i, 1);
                                this._redraw();
                            }
                        })
                    }
                    texts.push({
                        text, colorFill: colorFont, lnglat, py: -12, px: 5, textAlign: 'right', panel: textPanel
                    })
                }
            }
            let arcLnglats = [...lngLats];
            arcLnglats.shift()
            let arc: MapArc = { lnglats: arcLnglats, size: 3, colorFill: colorArc, colorLine: colorLine };
            let line: MapLine = { lnglats, colorLine: colorLine };
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
        const { ctrMapAniDraw: layer, lnglatLists, lnglat: [lng, lat] = [], options: { textPanel } } = this;
        layer.setAllTexts([]).setAllLines([]);
        const last = lnglatLists[lnglatLists.length - 1] || [];
        /**虚线绘制 */
        if (lng !== undefined && lat !== undefined && last.length > 0) {
            const end = last[last.length - 1], move: [number, number] = [lng, lat];
            let distance = um_getDistance(move, end, this.map);
            let θ = um_getAngle(this.map, end, move)
            let text = (distance > 1852 ? ((distance / 1852).toFixed(2) + ' nm') : (distance.toFixed(0) + ' m')) + '/' + θ.toFixed(2) + '°';
            layer.setAllLines([{ lnglats: [move, end], dash: [3, 3], colorLine: '#364A7D' }]);
            layer.setAllTexts([{ lnglat: move, text, colorFill: '#FFFFFF', panel: textPanel }])
        }
        layer.drawMapAll();
    }
    /** 绘制文本信息  flag标识该条线已经绘制完成
     * @param info 文本信息
     * @param lineId 线索引
     * @returns MapImage实例
     */
    protected drawEndTextImg(info: MapText, lineId: number): MapImage {
        let { lnglat, panel, text = 'text' } = info;
        let point = um_getPointByLnglat(this.map, lnglat)
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
        let mapLnglat = um_getLngLatByPoint(this.map, [px, py])
        this.ctrEvent.pushEventByKey('text', {
            lnglat: mapLnglat,
            point: [px, py],
            range: [10, 10],
            type: 'click',
            cb: () => {
                this.lnglatLists.splice(lineId, 1);
                this._redraw();
            }
        })
        return {
            lnglat: mapLnglat,
            url: '/assets/images/icon/icon-16.png',
            size: [16, 16],
            posX: 16,
            posY: 16 * 2,
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
        this.flagTimeout = setTimeout(() => {
            const { latlng: { lat, lng } } = um_getMapMouseEvent(e, this.map);
            const lnglats = this.lnglatLists[this.lnglatLists.length - 1] || [];
            lnglats.push([lng, lat]);
            this.renderFixedData();
            this.renderAnimation();
        }, 100);
    }
    /** 鼠标移动事件
     * @param e 事件对象
     */
    private eventMousemove = (e: LeafletMouseEvent | AMapMapsEvent | MaplibreMouseEvent): void => {
        if (this.ifDrag) return;
        const { latlng: { lat, lng } } = um_getMapMouseEvent(e, this.map);
        this.lnglat = [lng, lat];
        this.renderAnimation();
    }
    /** 双击关闭事件 */
    private eventDblclick = (): void => {
        if (this.flagTimeout) {
            clearTimeout(this.flagTimeout);
            this.flagTimeout = null;
        }
        this.close();
        this.lnglat = undefined;
        this.renderFixedData();
        this.renderAnimation();
    }
}

/**范围标注插件配置 */
export interface MOptPluginRange extends MOptCanvas {
    /**线条颜色 */
    colorLine?: string;
    /**圆弧颜色 */
    colorArc?: string;
    /**起始圆弧颜色 */
    colorArcStart?: string;
    /**字体颜色 */
    colorFont?: string;
    /**语言类型 */
    lang?: 'cn' | 'en';
    /**文本面板配置 */
    textPanel?: CanvasTextPanel;
}
