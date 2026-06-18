import { OptMapCanvas, MapArc, MapLine, MapRect, MapText, MapImage, MapGif } from "../types";
import { MapCanvasDraw, MapCanvasLayer, SLUMap } from "../map";
/**地图插件----绘制类
 * @extends MapCanvasLayer
 * @param sluMap 地图实例
 * @param options 地图绘制选项
 * @description 地图绘制类，用于绘制地图上的元素：圆点、线、贝塞尔曲线、多边形、文本、图片、gif动画
 */
export declare class MapPluginDraw extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: AMAP.CustomLayerOption | OptMapCanvas);
    /**地图绘制控制类 */
    protected _draw: MapCanvasDraw;
    /**地图事件引起的重绘绘制 */
    protected renderFixedData(): void;
    /**绘制所有需要绘制的类
     * @returns MapPluginDraw实例
     */
    drawMapAll(): MapPluginDraw;
    /**设置圆点数据
     * @param arcs 圆点数据
     * @returns MapPluginDraw实例
     */
    setAllArcs(arcs: MapArc[]): MapPluginDraw;
    /**设置线数据
     * @param lines 线数据
     * @returns MapPluginDraw实例
     */
    setAllLines(lines: MapLine[]): MapPluginDraw;
    /**设置贝塞尔曲线数据
     * @param lines 贝塞尔曲线数据
     * @returns MapPluginDraw实例
     */
    setAllBezierLines(lines: MapLine[]): MapPluginDraw;
    /**设置多边形数据
     * @param rects 多边形数据
     * @returns MapPluginDraw实例
     */
    setAllRects(rects: MapRect[]): MapPluginDraw;
    /**设置文本数据
     * @param texts 文本数据
     * @returns MapPluginDraw实例
     */
    setAllTexts(texts: MapText[]): MapPluginDraw;
    /**设置图片数据
     * @param imgs 图片数据
     * @returns MapPluginDraw实例
     */
    setAllImgs(imgs: MapImage[]): MapPluginDraw;
    /**设置gif数据
     * @param gifs gif数据
     * @returns MapPluginDraw实例
     */
    setAllGifs(gifs: MapGif[]): MapPluginDraw;
    /**增加圆点
     * @param arc 圆点数据
     * @returns MapPluginDraw实例
     */
    addArc(arc: MapArc): MapPluginDraw;
    /**增加线
     * @param line 线数据
     * @returns MapPluginDraw实例
     */
    addLine(line: MapLine): MapPluginDraw;
    /**增加贝塞尔曲线
     * @param line 贝塞尔曲线数据
     * @returns MapPluginDraw实例
     */
    addBezierLine(line: MapLine): MapPluginDraw;
    /**增加多边形
     * @param rect 多边形数据
     * @returns MapPluginDraw实例
     */
    addRect(rect: MapRect): MapPluginDraw;
    /**增加文本
     * @param text 文本数据
     * @returns MapPluginDraw实例
     */
    addText(text: MapText): MapPluginDraw;
    /**增加图片
     * @param img 图片数据
     * @returns MapPluginDraw实例
     */
    addImg(img: MapImage): MapPluginDraw;
    /**删除指定圆点
     * @param arc 圆点数据
     * @returns MapPluginDraw实例
     */
    delArc(arc: MapArc): MapPluginDraw;
    /**删除指定线
     * @param line 线数据
     * @returns MapPluginDraw实例
     */
    delLine(line: MapLine): MapPluginDraw;
    /**删除指定贝塞尔曲线
     * @param line 贝塞尔曲线数据
     * @returns MapPluginDraw实例
     */
    delBezierLine(line: MapLine): MapPluginDraw;
    /**删除指定多边形
     * @param rect 多边形数据
     * @returns MapPluginDraw实例
     */
    delRect(rect: MapRect): MapPluginDraw;
    /**删除指定文本
     * @param text 文本数据
     * @returns MapPluginDraw实例
     */
    delText(text: MapText): MapPluginDraw;
    /**删除指定图片
     * @param img 图片数据
     * @returns MapPluginDraw实例
     */
    delImg(img: MapImage): MapPluginDraw;
    /**清空
     * @param type @default 'all' ,不填清空所有内容数据
     * @returns MapPluginDraw实例
     */
    delAll(type?: 'all' | 'arc' | 'line' | 'bezier' | 'rect' | 'img' | 'gif'): MapPluginDraw;
}
