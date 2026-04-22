import "../_virtual/leaflet-src.js";
import "../_virtual/maplibre-gl.js";
import "../canvas/slu-canvas.js";
import "../canvas/slu-canvas-img.js";
import "../canvas/slu-canvas-text.js";
import "../map/canvas-event.js";
import { MapCanvasLayer as s } from "../map/canvas-layer.js";
import "../_virtual/index.js";
import "../leaflet/slu-leaflet-net-map.js";
import { MapCanvasRadar as n } from "../map/canvas-radar.js";
class v extends s {
  constructor(a, r) {
    super(a.map, r), this.isDrag = !1, this.canvasRadar = new n(a.map, this.ctx);
  }
  /**重设雷达绘制类
   * @param radars 雷达绘制数据
   * @returns MapPluginRadar实例
   */
  setAllRadars(a) {
    return this.canvasRadar.setAllRadars(a), this;
  }
  /**添加雷达绘制类
   * @param radar 雷达绘制数据
   * @returns MapPluginRadar实例
   */
  addRadar(a) {
    return this.canvasRadar.addRadar(a), this;
  }
  /**渲染静态标绘图层 */
  renderFixedData() {
  }
  /**渲染动画
   * @param time 时间戳
   */
  renderAnimation(a) {
    this.resetCanvas(), this.canvasRadar.drawRadarStatic(), this.canvasRadar.drawRadarAmi(a), this.flagAnimation && cancelAnimationFrame(this.flagAnimation), this.flagAnimation = requestAnimationFrame((r) => {
      this.isDrag || this.renderAnimation(r);
    });
  }
  /**控制地图监听事件 拖拽不允许更新动画
  * @param map 地图实例
  * @param key 事件类型
  */
  addMapEvents(a, r) {
    const t = () => this.drawEnd(), i = () => this.drawStart();
    a[r]("dragstart", t), a[r]("dragend", i);
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
  v as MapPluginRadar
};
