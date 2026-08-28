import * as L from 'leaflet';
import type { CanvasGif, CanvasImage, CanvasPosition, CanvasTextPanel, OptCanvas, TextOverlap } from '../canvas';
import { Map as MaplibreMap } from 'maplibre-gl';
/** 地图canvas基础图形绘制类
 * @constructor
 * @param map 地图实例
 * @param canvas 画布元素
 *  设置/新增/删除：点(arc) 线(line BezierLine) 多边形(rect) 图片(img) Gif(gif) 文本(text)
 *  绘制：所有需要绘制的类(按drawIndex顺序)
 *  将对象上经纬度数据(lnglats,lnglat)变换为像素XY的数据(points,point)
 *  设置图片/圆点的大小
 */
export declare class MapCanvasDraw {
    constructor(map: AMAP.Map | L.Map | MaplibreMap, canvas: HTMLCanvasElement);
    /**画布 */
    private canvas;
    /**画布上下文 */
    protected ctx: CanvasRenderingContext2D;
    /**地图实例 */
    protected map: AMAP.Map | L.Map | MaplibreMap;
    /**Gif实例 */
    private gif;
    /**所有的小圆数据 */
    protected _allArcs: MapArc[];
    /**所有的线数据 */
    protected _allLines: MapLine[];
    /**所有的贝塞尔曲线数据 */
    protected _allBLins: MapLine[];
    /**所有的多边形数据 */
    protected _allRects: MapRect[];
    /**所有的文本数据 */
    protected _allTexts: MapText[];
    /**所有的图片数据 */
    protected _allImgs: MapImage[];
    /**所有的Gif数据 */
    protected _allGifs: MapGif[];
    /**当前地图缩放层级 */
    protected get zoom(): number;
    /**清空并重新设置画布 */
    reSetCanvas(): void;
    /**绘制所有需要绘制的类(按drawIndex顺序) */
    drawMapAll(): void;
    /**绘制通过index */
    protected drawByIndex(): void;
    /**设置圆点
     * @param arcs 圆点集合
     * @returns MapCanvasDraw实例
     */
    setAllArcs(arcs: MapArc[]): MapCanvasDraw;
    /**设置线数据
     * @param lines 线集合
     * @returns MapCanvasDraw实例
     */
    setAllLines(lines: MapLine[]): MapCanvasDraw;
    /**设置贝塞尔曲线数据
     * @param lines 贝塞尔曲线集合
     * @returns MapCanvasDraw实例
     */
    setAllBezierLines(lines: MapLine[]): MapCanvasDraw;
    /**设置多边形数据
     * @param rects 多边形集合
     * @returns MapCanvasDraw实例
     */
    setAllRects(rects: MapRect[]): MapCanvasDraw;
    /**设置文本数据
     * @param texts 文本集合
     * @returns MapCanvasDraw实例
     */
    setAllTexts(texts: MapText[]): MapCanvasDraw;
    /**设置图片数据
     * @param imgs 图片集合
     * @returns MapCanvasDraw实例
     */
    setAllImgs(imgs: MapImage[]): MapCanvasDraw;
    /**设置图片数据
     * @param gifs Gif集合
     * @returns MapCanvasDraw实例
     */
    setAllGifs(gifs: MapGif[]): MapCanvasDraw;
    /**增加圆点
     * @param arc 圆点
     * @returns MapCanvasDraw实例
     */
    addArc(arc: MapArc): MapCanvasDraw;
    /**增加线
     * @param line 线
     * @returns MapCanvasDraw实例
     */
    addLine(line: MapLine): MapCanvasDraw;
    /**增加贝塞尔曲线
     * @param line 贝塞尔曲线
     * @returns MapCanvasDraw实例
     */
    addBezierLine(line: MapLine): MapCanvasDraw;
    /**增加多边形
     * @param rect 多边形
     * @returns MapCanvasDraw实例
     */
    addRect(rect: MapRect): MapCanvasDraw;
    /**增加文本
     * @param text 文本
     * @returns MapCanvasDraw实例
     */
    addText(text: MapText): MapCanvasDraw;
    /**增加图片
     * @param img 图片
     * @returns MapCanvasDraw实例
     */
    addImg(img: MapImage): MapCanvasDraw;
    /**删除指定圆点
     * @param arc 圆点
     * @returns MapCanvasDraw实例
     */
    delArc(arc: MapArc): MapCanvasDraw;
    /**删除指定线
     * @param line 线
     * @returns MapCanvasDraw实例
     */
    delLine(line: MapLine): MapCanvasDraw;
    /**删除指定贝塞尔曲线
     * @param line 贝塞尔曲线
     * @returns MapCanvasDraw实例
     */
    delBezierLine(line: MapLine): MapCanvasDraw;
    /**删除指定多边形
     * @param rect 多边形
     * @returns MapCanvasDraw实例
     */
    delRect(rect: MapRect): MapCanvasDraw;
    /**删除指定文本
     * @param text 文本
     * @returns MapCanvasDraw实例
     */
    delText(text: MapText): MapCanvasDraw;
    /**删除指定Img
     * @param img 图片
     * @returns MapCanvasDraw实例
     */
    delImg(img: MapImage): MapCanvasDraw;
    /**清空
     * @param type @default 'all' ,不填清空所有内容数据
     * @returns MapCanvasDraw实例
     */
    delAll(type?: 'all' | 'text' | 'arc' | 'line' | 'bezier' | 'rect' | 'img' | 'gif'): MapCanvasDraw;
    /**将对象上经纬度数据(lnglats,lnglat)变换为像素XY的数据(points,point)
     * lnglats为undefined,points也为undefined
     * lnglat为undefined,point为[0,0]
     * @param info 对象
     */
    transformXY(info: MapPosition & CanvasPosition): void;
    /**设置图片的大小
     * @param img 图片
     */
    transformImageSize(img: MapImage): void;
    /**设置圆点的大小
     * @param arc 圆点
     */
    private transformArcSize;
}
/**地图上的单点位信息 */
export interface MapPoint {
    /**单经纬度 [lng, lat] */
    lnglat: [number, number];
    /**经纬度集合 */
    lnglats?: [number, number][];
}
/**地图上的多点位信息 */
export interface MapPoints {
    /**经纬度集合 */
    lnglats: [number, number][];
    /**单经纬度 */
    lnglat?: [number, number];
}
/**地图上的大小配置(可选固定大小) */
interface Size_ {
    /**图片大小 */
    size: [number, number] | number;
    /**固定的图片大小 */
    sizeFix?: [number, number] | number;
}
/**地图上的固定大小配置(以米为单位) */
export interface SizeFix_ {
    /**图片大小 */
    size?: [number, number] | number;
    /**固定的图片大小，以米为单位 */
    sizeFix: [number, number] | number;
}
/**地图元素显示的相关配置 */
export interface MapShow {
    /**显示的最大地图级别(包含此级别) */
    maxZoom?: number;
    /**显示的最小地图级别(包含此级别) */
    minZoom?: number;
    /**绘制层级，类似z-index */
    index?: number;
}
/**地图上的图片(无事件) @template I 标识图片携带的info的类型 */
type CanavsImageNoPosition<I> = Omit<CanvasImage<I>, keyof CanvasPosition>;
/**地图上的位置数据，支持单点或多点 */
export type MapPosition = MapPoint | MapPoints;
/**地图上的大小配置，支持普通大小或固定大小 */
export type MapSize = Size_ | SizeFix_;
/**地图上的图片(无事件) @template I 标识图片携带的info的类型 */
export type MapImage<I = any> = CanavsImageNoPosition<I> & MapShow & MapPosition & MapSize;
/**地图上的Gif(无事件) @template I 标识Gif携带的info的类型 */
export type MapGif<I = any> = CanvasGif<I> & MapShow & MapPosition & MapSize;
/**地图文本基础配置 @template I 标识文本携带的info的类型 */
export interface MapTextBase<I = any> extends OptCanvas {
    /**文本内容 */
    text?: string;
    /**是否描边 */
    ifShadow?: boolean;
    /**水平偏移量 */
    px?: number;
    /**垂直偏移量 */
    py?: number;
    /**文本行间距 */
    lineHeight?: number;
    /**文本最大宽度 */
    maxWidth?: number;
    /**背景板配置 */
    panel?: CanvasTextPanel;
    /**文本重叠处理配置 */
    overlap?: TextOverlap;
    /**自定义信息 */
    info?: I;
}
/**不带事件的地图文本类 @template I 标识文本携带的info的类型 */
export type MapText<I = any> = MapTextBase<I> & MapShow & MapPosition;
/**不带事件的地图圆点类 */
export type MapArc = OptCanvas & MapShow & MapPosition & MapSize;
/**不带事件的地图矩形类 */
export type MapRect = OptCanvas & MapShow & MapPoints;
/**不带事件的地图多边形类 */
export type MapPolygon = OptCanvas & MapShow & MapPoints;
/**不带事件的地图线条类 */
export type MapLine = OptCanvas & MapShow & MapPoints;
export {};
