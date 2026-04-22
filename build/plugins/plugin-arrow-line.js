import "../_virtual/leaflet-src.js";
import "../_virtual/maplibre-gl.js";
import "../canvas/slu-canvas.js";
import "../canvas/slu-canvas-img.js";
import "../canvas/slu-canvas-text.js";
import "../map/canvas-event.js";
import { MapCanvasLayer as n } from "../map/canvas-layer.js";
import "../_virtual/index.js";
import "../leaflet/slu-leaflet-net-map.js";
import { MapCanvasArrowLine as s } from "../map/canvas-arrow-line.js";
class c extends n {
  constructor(r, t) {
    super(r.map, t), this.isDrag = !1, this.arrowLine = new s(r.map, this.ctx, t);
  }
  /**设置所有线数据
   * @param lines 箭头线数据
   */
  setAllLines(r) {
    this.arrowLine.setAllLines(r);
  }
  /**渲染静态图层 */
  renderFixedData() {
    this.arrowLine.update();
  }
  /**渲染动态数据
   * @param time 时间戳
   */
  renderAnimation(r) {
    this.resetCanvas(), this.arrowLine.draw(), this.flagAnimation && cancelAnimationFrame(this.flagAnimation), this.flagAnimation = requestAnimationFrame((t) => {
      this.isDrag || this.renderAnimation(t);
    });
  }
  /**控制地图监听事件 拖拽不允许更新动画
   * @param map 地图实例
   * @param key 事件类型
   */
  addMapEvents(r, t) {
    const i = () => this.drawEnd(), a = () => this.drawStart();
    r[t]("dragstart", i), r[t]("dragend", a);
  }
  /**拖拽结束，开始绘制 */
  drawStart() {
    this.isDrag = !1;
  }
  /**拖拽开始，结束绘制 */
  drawEnd() {
    this.isDrag = !0;
  }
}
export {
  c as MapPluginArrowLine
};
