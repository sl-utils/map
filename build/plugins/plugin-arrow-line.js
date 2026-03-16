import "../_virtual/leaflet-src.js";
import "../canvas/slu-canvas.js";
import "../canvas/slu-canvas-img.js";
import "../map/canvas-event.js";
import { MapCanvasLayer as r } from "../map/canvas-layer.js";
import "../_virtual/index.js";
import "../leaflet/slu-leaflet-net-map.js";
import { MapCanvasArrowLine as a } from "../map/canvas-arrow-line.js";
class l extends r {
  constructor(i, t) {
    super(i.map, t), this.isDrag = !1, this.arrowLine = new a(i.map, this.ctx, t);
  }
  setAllLines(i) {
    this.arrowLine.setAllLines(i);
  }
  renderFixedData() {
    this.arrowLine.update();
  }
  renderAnimation(i) {
    this.resetCanvas(), this.arrowLine.draw(), this.flagAnimation && cancelAnimationFrame(this.flagAnimation), this.flagAnimation = requestAnimationFrame((t) => {
      this.isDrag || this.renderAnimation(t);
    });
  }
  /**拖拽不允许更新动画 */
  addMapEvents(i, t) {
    i[t]("dragstart", this.drawEnd, this), i[t]("movestart", this.drawEnd, this), i[t]("moveend", this.drawStart, this);
  }
  drawStart() {
    this.isDrag = !1;
  }
  drawEnd() {
    this.isDrag = !0;
  }
}
export {
  l as MapPluginArrowLine
};
