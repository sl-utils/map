import { u_mapGetPointsByLatlngs as B } from "../utils/slu-map.js";
import { SLUCanvas as C } from "../canvas/slu-canvas.js";
import "../canvas/slu-canvas-img.js";
import "../map/canvas-event.js";
import { MapCanvasLayer as y } from "../map/canvas-layer.js";
import "../_virtual/leaflet-src.js";
import "../_virtual/index.js";
import "../leaflet/slu-leaflet-net-map.js";
import { u_mathGetBezierPointByPercent as E } from "../utils/slu-math.js";
class k extends y {
  constructor(e, t) {
    super(e.map, t), this.isDrag = !1, this._allParticle = [];
  }
  /**设置所有粒子数据 */
  setAllParticles(e) {
    this._allParticle = e, this._redraw();
  }
  renderAnimation(e) {
    this.resetCanvas(), this._allParticle.forEach((t) => {
      t.curPoints = [], t.curve = [];
      let i = t.points = B(this.map, t.latlngs) || [];
      for (let r = 0, a = i.length; r < a - 1; r++) {
        const s = i[r], l = i[r + 1];
        let d = C.getBezierCtrlPoint(s, l, t.degree);
        t.curve.push(d);
      }
    }), this._drawParticles(), this.flagAnimation && cancelAnimationFrame(this.flagAnimation), this.flagAnimation = requestAnimationFrame((t) => {
      this.isDrag || this.renderAnimation(t);
    });
  }
  _animat() {
    this.flagAnimation = requestAnimationFrame(() => {
      this._animat();
    }), this._drawParticles();
  }
  /**绘制粒子效果 */
  _drawParticles() {
    let e = this._allParticle, t = this.ctx;
    t.globalCompositeOperation = "source-over", e.forEach((i) => {
      i.showParticle !== !1 && (t.strokeStyle = i.colorParticle || "white", t.fillStyle = i.colorParticle || "white", t.shadowColor = i.colorParticle || "white", t.shadowBlur = 5, this.genCurBezierPoints(i), this.drawParticle(i));
    });
  }
  /**获取当前贝塞尔曲线的粒子点位 */
  genCurBezierPoints(e) {
    let { points: t = [], index: i = 0, dense: r = 1 } = e, a = i + 1;
    if (t.length < 2) return;
    a >= t.length && (i = 0, a = 1, e.index = 0, e.curPoints = void 0, e.age = 0);
    let s = e.curPoints, l = t[i], d = t[a], o = l, c = d, v = e.curve[i];
    (!s || s.length < 2) && (s = [o, o]);
    let f = c[0] - o[0], w = c[1] - o[1], m = Math.sqrt(f * f + w * w), x = 1 / (r * m), h = e.speed || 1e-3;
    h = h > 0.1 ? h / m : h;
    let P = e.length || 0.03, _ = (P > 0.1 ? P : P * m) * r, n = (e.age || 0) + h, p = [];
    n = n > 1 ? 1 : n;
    for (let u = 0; u < _; u++) {
      let g = n - x * u;
      if (g < 0)
        break;
      g = g > 0 ? g : 0;
      let A = E(g, o, c, v);
      p.push(A);
    }
    n == 1 && (e.index = ++i, n = 0), e.age = n, e.curPoints = p;
  }
  /**绘制粒子 */
  drawParticle(e) {
    var t = this.ctx;
    let i = e.curPoints || [];
    for (let r = 0, a = i.length; r < a; r++) {
      let s = i[r], l = (1 - r / a) * (1 / 2);
      t.globalAlpha = r == 0 ? 1 : l, t.beginPath(), t.arc(s[0], s[1], 1, 0, 2 * Math.PI, !1), t.stroke(), t.fill();
    }
  }
  /**拖拽不允许更新动画 */
  addMapEvents(e, t) {
    e[t]("dragstart", this.drawEnd, this), e[t]("movestart", this.drawEnd, this), e[t]("moveend", this.drawStart, this);
  }
  drawStart() {
    console.log("drawStart"), this.isDrag = !1;
  }
  drawEnd() {
    console.log("drawEnd"), this.isDrag = !0;
  }
}
export {
  k as MapPluginPartial
};
