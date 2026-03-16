import "../_virtual/leaflet-src.js";
import "../canvas/slu-canvas.js";
import "../canvas/slu-canvas-img.js";
import "../map/canvas-event.js";
import { MapCanvasLayer as r } from "../map/canvas-layer.js";
import "../_virtual/index.js";
import "../leaflet/slu-leaflet-net-map.js";
import { MapCanvasRadar as i } from "../map/canvas-radar.js";
class p extends r {
  constructor(a, t) {
    super(a.map, t), this.isDrag = !1, this.canvasRadar = new i(a.map, this.ctx);
  }
  /**重设雷达绘制类 */
  setAllRadars(a) {
    return this.canvasRadar.setAllRadars(a), this;
  }
  /**添加雷达绘制类 */
  addRadar(a) {
    return this.canvasRadar.addRadar(a), this;
  }
  renderFixedData() {
  }
  renderAnimation(a) {
    this.resetCanvas(), this.canvasRadar.drawRadarStatic(), this.canvasRadar.drawRadarAmi(a), this.flagAnimation && cancelAnimationFrame(this.flagAnimation), this.flagAnimation = requestAnimationFrame((t) => {
      this.isDrag || this.renderAnimation(t);
    });
  }
  /**拖拽不允许更新动画 */
  addMapEvents(a, t) {
    a[t]("dragstart", this.drawEnd, this), a[t]("movestart", this.drawEnd, this), a[t]("moveend", this.drawStart, this);
  }
  drawStart() {
    console.log("drawStart"), this.isDrag = !1;
  }
  drawEnd() {
    console.log("drawEnd"), this.isDrag = !0;
  }
}
export {
  p as MapPluginRadar
};
