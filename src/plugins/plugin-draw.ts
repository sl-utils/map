import { OptMapCanvas, MapArc, MapLine, MapRect, MapText, MapImage, MapGif } from "@sl-utils/map";
import { MapCanvasDraw, MapCanvasLayer, SLUMap } from "../map";

/**地图插件----绘制类
 * @extends MapCanvasLayer
 * @param sluMap 地图实例
 * @param options 地图绘制选项
 * @description 地图绘制类，用于绘制地图上的元素：圆点、线、贝塞尔曲线、多边形、文本、图片、gif动画
 */
export class MapPluginDraw extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: AMAP.CustomLayerOption | OptMapCanvas) {
        super(sluMap.map, options);
        this._draw = new MapCanvasDraw(sluMap.map, this.canvas);
    }
    /**地图绘制控制类 */
    protected _draw: MapCanvasDraw;
    /**地图事件引起的重绘绘制 */
    protected override renderFixedData(): void {
        this.resetCanvas();
        this.drawMapAll();
    }
    /**绘制所有需要绘制的类
     * @returns MapPluginDraw实例
     */
    public drawMapAll(): MapPluginDraw {
        this._draw.drawMapAll();
        return this;
    }
    /**设置圆点数据
     * @param arcs 圆点数据
     * @returns MapPluginDraw实例
     */
    public setAllArcs(arcs: MapArc[]): MapPluginDraw {
        this._draw.setAllArcs(arcs);
        return this;
    }
    /**设置线数据
     * @param lines 线数据
     * @returns MapPluginDraw实例
     */
    public setAllLines(lines: MapLine[]): MapPluginDraw {
        this._draw.setAllLines(lines);
        return this;
    }
    /**设置贝塞尔曲线数据 
     * @param lines 贝塞尔曲线数据
     * @returns MapPluginDraw实例
     */
    public setAllBezierLines(lines: MapLine[]): MapPluginDraw {
        this._draw.setAllBezierLines(lines);
        return this;
    }
    /**设置多边形数据 
     * @param rects 多边形数据
     * @returns MapPluginDraw实例
     */
    public setAllRects(rects: MapRect[]): MapPluginDraw {
        this._draw.setAllRects(rects);
        return this;
    }
    /**设置文本数据 
     * @param texts 文本数据
     * @returns MapPluginDraw实例
     */
    public setAllTexts(texts: MapText[]): MapPluginDraw {
        this._draw.setAllTexts(texts);
        return this;
    }
    /**设置图片数据
     * @param imgs 图片数据
     * @returns MapPluginDraw实例
     */
    public setAllImgs(imgs: MapImage[]): MapPluginDraw {
        this._draw.setAllImgs(imgs);
        return this;
    }
    /**设置gif数据
     * @param gifs gif数据
     * @returns MapPluginDraw实例
     */
    public setAllGifs(gifs: MapGif[]): MapPluginDraw {
        this._draw.setAllGifs(gifs);
        return this;
    }
    /**增加圆点
     * @param arc 圆点数据
     * @returns MapPluginDraw实例
     */
    public addArc(arc: MapArc): MapPluginDraw {
        this._draw.addArc(arc);
        return this;
    }
    /**增加线
     * @param line 线数据
     * @returns MapPluginDraw实例
     */
    public addLine(line: MapLine): MapPluginDraw {
        this._draw.addLine(line);
        return this;
    }
    /**增加贝塞尔曲线
     * @param line 贝塞尔曲线数据
     * @returns MapPluginDraw实例
     */
    public addBezierLine(line: MapLine): MapPluginDraw {
        this._draw.addBezierLine(line);
        return this;
    }
    /**增加多边形
     * @param rect 多边形数据
     * @returns MapPluginDraw实例
     */
    public addRect(rect: MapRect): MapPluginDraw {
        this._draw.addRect(rect);
        return this;
    }
    /**增加文本
     * @param text 文本数据
     * @returns MapPluginDraw实例
     */
    public addText(text: MapText): MapPluginDraw {
        this._draw.addText(text);
        return this;
    }
    /**增加图片
     * @param img 图片数据
     * @returns MapPluginDraw实例
     */
    public addImg(img: MapImage): MapPluginDraw {
        this._draw.addImg(img);
        return this;
    }
    /**删除指定圆点
     * @param arc 圆点数据
     * @returns MapPluginDraw实例
     */
    public delArc(arc: MapArc): MapPluginDraw {
        this._draw.delArc(arc);
        return this;
    }
    /**删除指定线
     * @param line 线数据
     * @returns MapPluginDraw实例
     */
    public delLine(line: MapLine): MapPluginDraw {
        this._draw.delLine(line);
        return this;
    }
    /**删除指定贝塞尔曲线
     * @param line 贝塞尔曲线数据
     * @returns MapPluginDraw实例
     */
    public delBezierLine(line: MapLine): MapPluginDraw {
        this._draw.delBezierLine(line);
        return this;
    }
    /**删除指定多边形
     * @param rect 多边形数据
     * @returns MapPluginDraw实例
     */
    public delRect(rect: MapRect): MapPluginDraw {
        this._draw.delRect(rect);
        return this;
    }
    /**删除指定文本
     * @param text 文本数据
     * @returns MapPluginDraw实例
     */
    public delText(text: MapText): MapPluginDraw {
        this._draw.delText(text);
        return this;
    }
    /**删除指定图片
     * @param img 图片数据
     * @returns MapPluginDraw实例
     */
    public delImg(img: MapImage): MapPluginDraw {
        this._draw.delImg(img);
        return this;
    }
    /**清空
     * @param type 不填清空所有内容数据
     * @returns MapPluginDraw实例
     */
    public delAll(type: 'all' | 'arc' | 'line' | 'bezier' | 'rect' | 'img' | 'gif' = 'all'): MapPluginDraw {
        this._draw.delAll(type);
        return this;
    }
}