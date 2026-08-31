import type { MapArc, MapLine, MapRect, MapText, MapImage, MapGif, SLMap, MOptCanvasLayer } from "../map";
import { MapCanvasLayer, MapCanvasDraw } from "../map"
/**
 * 地图绘制插件
 *
 * 用于在地图上绘制各种图形元素，包括圆点、线段、贝塞尔曲线、多边形、文本、图片、GIF 动画等。
 * 是 MapPluginTrack、MapPluginPlot 等插件的基础绘制类。
 *
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap SLMap 地图实例
 * @param options 地图绘制选项
 *
 * @example
 * ```typescript
 * import { SLMap, MapPluginDraw } from '@sl-utils/map';
 *
 * const map = new SLMap('map');
 * await map.init({ type: 'L' });
 *
 * // 创建绘制插件
 * const draw = new MapPluginDraw(map, {
 *   pane: 'canvas',
 *   zIndex: 100
 * });
 *
 * // 绘制圆点
 * draw.setAllArcs([
 *   { lnglat: [114.12, 22.68], size: 5, colorFill: '#FF0000', colorLine: '#FFFFFF' },
 *   { lnglat: [114.15, 22.70], size: 8, colorFill: '#00FF00' }
 * ]);
 *
 * // 绘制线段
 * draw.setAllLines([
 *   {
 *     lnglats: [[114.12, 22.68], [114.15, 22.70], [114.18, 22.72]],
 *     colorLine: '#FF6600',
 *     widthLine: 2
 *   }
 * ]);
 *
 * // 绘制贝塞尔曲线
 * draw.setAllBezierLines([
 *   {
 *     lnglats: [[114.12, 22.68], [114.20, 22.75]],
 *     colorLine: '#0066FF',
 *     widthLine: 2,
 *     degree: 0.5
 *   }
 * ]);
 *
 * // 绘制多边形
 * draw.setAllRects([
 *   {
 *     lnglats: [[114.12, 22.68], [114.15, 22.68], [114.15, 22.70], [114.12, 22.70]],
 *     colorFill: 'rgba(255, 0, 0, 0.3)',
 *     colorLine: '#FF0000'
 *   }
 * ]);
 *
 * // 绘制文本
 * draw.setAllTexts([
 *   { lnglat: [114.12, 22.68], text: '深圳', colorFill: '#333333', fontSize: 14 }
 * ]);
 *
 * // 绘制图片
 * draw.setAllImgs([
 *   {
 *     lnglat: [114.15, 22.70],
 *     url: '/assets/icons/marker.png',
 *     size: [32, 32]
 *   }
 * ]);
 *
 * // 绘制 GIF 动画
 * draw.setAllGifs([
 *   {
 *     lnglat: [114.18, 22.72],
 *     url: '/assets/images/animation.gif',
 *     size: [48, 48]
 *   }
 * ]);
 *
 * // 执行绘制
 * draw.drawMapAll();
 *
 * // 清空所有绘制
 * draw.delAll('all');
 *
 * // 移除图层
 * draw.onRemove();
 * ```
 */
export class MapPluginDraw extends MapCanvasLayer {
    constructor(sluMap: SLMap, options?: AMAP.CustomLayerOption | MOptCanvasLayer) {
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
     * @param type @default 'all' ,不填清空所有内容数据
     * @returns MapPluginDraw实例
     */
    public delAll(type: 'all' | 'arc' | 'line' | 'bezier' | 'rect' | 'img' | 'gif' = 'all'): MapPluginDraw {
        this._draw.delAll(type);
        return this;
    }
}