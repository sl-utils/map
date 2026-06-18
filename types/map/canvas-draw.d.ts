import * as L from 'leaflet';
import { MapArc, MapLine, MapRect, MapText, MapImage, MapGif, CanvasPosition, MapPosition } from '../types';
import { Map as MaplibreMap } from 'maplibre-gl';
/** 地图canvas基础图形绘制类
 * @constructor
 * @param map 地图实例
 * @param canvas 画布元素
 *  设置/新增/删除：点(arc) 线(line BezierLine) 多边形(rect) 图片(img) Gif(gif) 文本(text)
 *  绘制：所有需要绘制的类(按drawIndex顺序)
 *  将对象上经纬度数据(latlngs,latlng)变换为像素XY的数据(points,point)
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
    /**将对象上经纬度数据(latlngs,latlng)变换为像素XY的数据(points,point)
     * latlngs为undefined,points也为undefined
     * latlng为undefined,point为[0,0]
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
