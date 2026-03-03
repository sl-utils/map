import { MapCanvasDraw, MapCanvasLayer } from "../map";

/**地图插件----绘制 */
export class MapPluginDraw extends MapCanvasLayer {
    constructor(map: AMAP.Map | L.Map, options?: AMAP.CustomLayerOption | MapCanvasPara) {
        super(map, options);
        this._draw = new MapCanvasDraw(map, this.canvas);
    }
    /**地图绘制控制类 */
    protected _draw: MapCanvasDraw;
    /**地图事件引起的重绘绘制 */
    protected override renderFixedData() {
        this.resetCanvas();
        this.drawMapAll();
    }
    /**绘制所有需要绘制的类 */
    public drawMapAll() {
        this._draw.drawMapAll();
        return this;
    }
    /**设置原点 */
    public setAllArcs(arcs: MapArc[]) {
        this._draw.setAllArcs(arcs);
        return this;
    }
    /**设置线数据 */
    public setAllLines(lines: MapLine[]) {
        this._draw.setAllLines(lines);
        return this;
    }
    /**设置贝塞尔曲线数据 */
    public setAllBezierLines(lines: MapLine[]) {
        this._draw.setAllBezierLines(lines);
        return this;
    }
    /**设置多边形数据 */
    public setAllRects(rects: MapRect[]) {
        this._draw.setAllRects(rects);
        return this;
    }
    /**设置文本数据 */
    public setAllTexts(texts: MapText[]) {
        this._draw.setAllTexts(texts);
        return this;
    }
    /**设置图片数据 */
    public setAllImgs(imgs: MapImage[]) {
        this._draw.setAllImgs(imgs);
        return this;
    }
    /**设置gif数据 */
    public setAllGifs(gifs: MapGif[]) {
        this._draw.setAllGifs(gifs);
        return this;
    }
    /**增加原点 */
    public addArc(arc: MapArc) {
        this._draw.addArc(arc);
        return this;
    }
    /**增加线 */
    public addLine(line: MapLine) {
        this._draw.addLine(line);
        return this;
    }
    /**增加贝塞尔曲线 */
    public addBezierLine(line: MapLine) {
        this._draw.addBezierLine(line);
        return this;
    }
    /**增加多边形 */
    public addRect(rect: MapRect) {
        this._draw.addRect(rect);
        return this;
    }
    /**增加文本 */
    public addText(text: MapText) {
        this._draw.addText(text);
        return this;
    }
    /**增加图片 */
    public addImg(img: MapImage) {
        this._draw.addImg(img);
        return this;
    }
    /**删除指定圆点 */
    public delArc(arc: MapArc) {
        this._draw.delArc(arc);
        return this;
    }
    /**删除指定线 */
    public delLine(line: MapLine) {
        this._draw.delLine(line);
        return this;
    }
    /**删除指定贝塞尔曲线 */
    public delBezierLine(line: MapLine) {
        this._draw.delBezierLine(line);
        return this;
    }
    /**删除指定多边形 */
    public delRect(rect: MapRect) {
        this._draw.delRect(rect);
        return this;
    }
    /**删除指定多边形 */
    public delText(text: MapText) {
        this._draw.delText(text);
        return this;
    }
    /**删除指定Img */
    public delImg(img: MapImage) {
        this._draw.delImg(img);
        return this;
    }
    /**清空
     * @param type 不填清空所有内容数据
     */
    public delAll(type: 'all' | 'arc' | 'line' | 'bezier' | 'rect' | 'img' | 'gif' = 'all') {
        this._draw.delAll(type);
        return this;
    }
}