import { MapCanvasDraw as e } from "../map/canvas-draw.js";
import "../map/canvas-event.js";
import { MapCanvasLayer as s } from "../map/canvas-layer.js";
import "../_virtual/leaflet-src.js";
import "../_virtual/index.js";
import "../leaflet/slu-leaflet-net-map.js";
import "../canvas/slu-canvas.js";
import "../canvas/slu-canvas-img.js";
class _ extends s {
  constructor(t, r) {
    super(t.map, r), this._draw = new e(t.map, this.canvas);
  }
  /**地图事件引起的重绘绘制 */
  renderFixedData() {
    this.resetCanvas(), this.drawMapAll();
  }
  /**绘制所有需要绘制的类 */
  drawMapAll() {
    return this._draw.drawMapAll(), this;
  }
  /**设置原点 */
  setAllArcs(t) {
    return this._draw.setAllArcs(t), this;
  }
  /**设置线数据 */
  setAllLines(t) {
    return this._draw.setAllLines(t), this;
  }
  /**设置贝塞尔曲线数据 */
  setAllBezierLines(t) {
    return this._draw.setAllBezierLines(t), this;
  }
  /**设置多边形数据 */
  setAllRects(t) {
    return this._draw.setAllRects(t), this;
  }
  /**设置文本数据 */
  setAllTexts(t) {
    return this._draw.setAllTexts(t), this;
  }
  /**设置图片数据 */
  setAllImgs(t) {
    return this._draw.setAllImgs(t), this;
  }
  /**设置gif数据 */
  setAllGifs(t) {
    return this._draw.setAllGifs(t), this;
  }
  /**增加原点 */
  addArc(t) {
    return this._draw.addArc(t), this;
  }
  /**增加线 */
  addLine(t) {
    return this._draw.addLine(t), this;
  }
  /**增加贝塞尔曲线 */
  addBezierLine(t) {
    return this._draw.addBezierLine(t), this;
  }
  /**增加多边形 */
  addRect(t) {
    return this._draw.addRect(t), this;
  }
  /**增加文本 */
  addText(t) {
    return this._draw.addText(t), this;
  }
  /**增加图片 */
  addImg(t) {
    return this._draw.addImg(t), this;
  }
  /**删除指定圆点 */
  delArc(t) {
    return this._draw.delArc(t), this;
  }
  /**删除指定线 */
  delLine(t) {
    return this._draw.delLine(t), this;
  }
  /**删除指定贝塞尔曲线 */
  delBezierLine(t) {
    return this._draw.delBezierLine(t), this;
  }
  /**删除指定多边形 */
  delRect(t) {
    return this._draw.delRect(t), this;
  }
  /**删除指定多边形 */
  delText(t) {
    return this._draw.delText(t), this;
  }
  /**删除指定Img */
  delImg(t) {
    return this._draw.delImg(t), this;
  }
  /**清空
   * @param type 不填清空所有内容数据
   */
  delAll(t = "all") {
    return this._draw.delAll(t), this;
  }
}
export {
  _ as MapPluginDraw
};
