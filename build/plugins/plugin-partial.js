import { u_mapGetPointsByLatlngs as B } from "../utils/slu-map.js";
import { SLUCanvas as y } from "../canvas/slu-canvas.js";
import "../canvas/slu-canvas-img.js";
import "../canvas/slu-canvas-text.js";
import "../map/canvas-event.js";
import { MapCanvasLayer as C } from "../map/canvas-layer.js";
import "../_virtual/leaflet-src.js";
import "../_virtual/index.js";
import "../leaflet/slu-leaflet-net-map.js";
import "../_virtual/maplibre-gl.js";
import { u_mathGetBezierPointByPercent as z } from "../utils/slu-math.js";
class O extends C {
  constructor(e, t) {
    super(e.map, t), this.isDrag = !1, this._allParticle = [];
  }
  /**设置所有粒子数据
   * @param particles 粒子数据
   */
  setAllParticles(e) {
    this._allParticle = e, this._redraw();
  }
  /**渲染动态数据
   * @param time 时间戳
   */
  renderAnimation(e) {
    this.resetCanvas(), this._allParticle.forEach((t) => {
      t.curPoints = [], t.curve = [];
      let i = t.points = B(this.map, t.latlngs) || [];
      for (let r = 0, a = i.length - 1; r < a; r++) {
        const s = i[r], l = i[r + 1];
        let m = y.getBezierCtrlPoint(s, l, t.degree);
        t.curve.push(m);
      }
    }), this._drawParticles(), this.flagAnimation && cancelAnimationFrame(this.flagAnimation), this.flagAnimation = requestAnimationFrame((t) => {
      this.isDrag || this.renderAnimation(t);
    });
  }
  /**动画循环 */
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
  /**获取当前贝塞尔曲线的粒子点位
   * @param particle 粒子数据
   */
  genCurBezierPoints(e) {
    let { points: t = [], index: i = 0, dense: r = 1 } = e, a = i + 1;
    if (t.length < 2) return;
    a >= t.length && (i = 0, a = 1, e.index = 0, e.curPoints = void 0, e.age = 0);
    let s = e.curPoints, l = t[i], m = t[a], o = l, c = m, x = e.curve[i];
    (!s || s.length < 2) && (s = [o, o]);
    let f = c[0] - o[0], p = c[1] - o[1], P = Math.sqrt(f * f + p * p), _ = 1 / (r * P), h = e.speed || 1e-3;
    h = h > 0.1 ? h / P : h;
    let d = e.length || 0.03, v = (d > 0.1 ? d : d * P) * r, n = (e.age || 0) + h, w = [];
    n = n > 1 ? 1 : n;
    for (let u = 0; u < v; u++) {
      let g = n - _ * u;
      if (g < 0)
        break;
      g = g > 0 ? g : 0;
      let A = z(g, o, c, x);
      w.push(A);
    }
    n == 1 && (e.index = ++i, n = 0), e.age = n, e.curPoints = w;
  }
  /**绘制粒子
   * @param particle 粒子数据
   */
  drawParticle(e) {
    let t = this.ctx, i = e.curPoints || [];
    for (let r = 0, a = i.length; r < a; r++) {
      let s = i[r], l = (1 - r / a) * (1 / 2);
      t.globalAlpha = r == 0 ? 1 : l, t.beginPath(), t.arc(s[0], s[1], 1, 0, 2 * Math.PI, !1), t.stroke(), t.fill();
    }
  }
  /**控制地图监听事件 拖拽不允许更新动画
   * @param map 地图实例
   * @param key 事件类型
   */
  addMapEvents(e, t) {
    const i = () => this.drawEnd(), r = () => this.drawStart();
    e[t]("dragstart", i), e[t]("dragend", r);
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
  O as MapPluginPartial
};
