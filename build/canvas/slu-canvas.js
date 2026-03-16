const f = class f {
  /**canvas画布的工具类*/
  constructor() {
  }
  /**绘制小圆点 */
  static drawArc(t, e = this.ctx) {
    if (t.ifHide === !0) return this;
    let { point: i, points: l = [], size: a = 10 } = t;
    i && (l = [...l, i]), this.setCtxPara(e, t);
    for (let s = 0, o = l.length; s < o; s++) {
      e.beginPath();
      const r = l[s];
      e.arc(r[0], r[1], a, 0, 2 * Math.PI, !1), e.stroke(), e.globalAlpha = t.fillAlpha == null ? 1 : t.fillAlpha, e.fill();
    }
    return this.setCtxPara(e), this;
  }
  /**绘制矩形 */
  static drawRect(t, e = this.ctx) {
    if (t.ifHide === !0) return this;
    let { point: i, points: l = [i], width: a = 0, height: s = 0, radius: o = [0, 0, 0, 0] } = t;
    this.setCtxPara(e, t);
    for (let r = 0; r < l.length; r++) {
      let [h, n] = l[r] || [0, 0];
      e.beginPath(), e.roundRect(h, n, a, s, o), e.stroke(), e.globalAlpha = t.fillAlpha == null ? 1 : t.fillAlpha, e.fill(), e.closePath();
    }
    return this.setCtxPara(e), this;
  }
  /**画绘制多边形*/
  static drawPolygon(t, e = this.ctx) {
    let { points: i = [] } = t;
    if (t.ifHide === !0 || i.length < 2) return this;
    this.setCtxPara(e, t);
    for (let l = 0, a = i.length; l < a; l++) {
      let [s, o] = i[l];
      l == 0 ? (e.beginPath(), e.moveTo(s, o)) : l == a - 1 ? (e.lineTo(s, o), e.closePath(), e.globalAlpha = t.fillAlpha == null ? 1 : t.fillAlpha, e.fill(), e.lineWidth > 0 && (e.globalAlpha = t.alpha || 1, e.stroke())) : e.lineTo(s, o);
    }
    return this.setCtxPara(e), this;
  }
  /**画线*/
  static drawLine(t, e = this.ctx) {
    if (t.ifHide === !0) return this;
    let { points: i = [] } = t;
    if (i.length < 2) return this;
    this.setCtxPara(e, t);
    let l = i[0] || [];
    t.widthLine, e.beginPath(), e.moveTo(l[0], l[1]);
    for (let a = 1, s = i.length; a < s; a++) {
      let o = i[a];
      e.lineTo(o[0], o[1]);
    }
    return e.stroke(), this.setCtxPara(e), this;
  }
  /**画贝塞尔曲线*/
  static drawBezierLine(t, e = this.ctx) {
    if (t.ifHide === !0) return this;
    let { points: i = [] } = t;
    if (i.length < 2) return this;
    this.setCtxPara(e, t);
    let l = i[0], a = t.degree;
    e.beginPath(), e.moveTo(l[0], l[1]);
    for (let s = 1, o = i.length; s < o; s++) {
      let r = i[s - 1], h = i[s], n = this.getBezierCtrlPoint(r, h, a);
      e.quadraticCurveTo(n[0], n[1], h[0], h[1]);
    }
    return e.stroke(), this.setCtxPara(e), this;
  }
  /**创建一个画布 */
  static createCanvas() {
    return document.createElement("canvas");
  }
  /**获取贝塞尔曲线的控制点
   * @param s:起点
   * @param e:终点
   * @param degree：曲度等级（越大越弯曲）
   */
  static getBezierCtrlPoint(t, e, i = 1) {
    const l = t, a = e, s = [(l[0] + a[0]) / 2, (l[1] + a[1]) / 2], o = i;
    let r = s[0] - l[0], h = s[1] - l[1], n = Math.sqrt(r * r + h * h), u = Math.PI / 2 - Math.asin(h / n), d = o * Math.cos(u) * n, p = o * Math.sin(u) * n * r / Math.abs(r);
    return d = isNaN(d) ? 0 : d, p = isNaN(p) ? 0 : p, [s[0] + d, s[1] - p];
  }
  /**设置画布的相关配置
   * @param fig 画布属性配置
   * @param ctx 2D画布渲染上下文
   */
  static setCtxPara(t, e = {}) {
    return this.ctx = t, this.deletePara(e), e = Object.assign({}, this.ctxFig, e), t.globalAlpha = e.alpha, t.globalCompositeOperation = e.globalCompositeOperation, t.fillStyle = e.colorFill, t.strokeStyle = e.colorLine, t.lineWidth = e.widthLine, t.shadowColor = e.shadowColor, t.shadowBlur = e.shadowBlur, t.font = e.font, t.textBaseline = e.textBaseline, t.setLineDash(e.dash), t.lineDashOffset = e.dashOff, t;
  }
  /**移除掉值为 undefined 或 null 的属性，方便赋值 */
  static deletePara(t = {}) {
    for (const e in t)
      if (Object.prototype.hasOwnProperty.call(t, e)) {
        const i = t[e];
        i == null && Reflect.deleteProperty(t, e);
      }
  }
};
f.ctxFig = {
  alpha: 1,
  widthLine: 1,
  colorLine: "#FFFFFF",
  colorFill: "#EE3434",
  dash: [10, 0],
  dashOff: 0,
  fillAlpha: 1,
  font: "14px serif",
  textBaseline: "top",
  globalCompositeOperation: "source-over",
  shadowBlur: 0,
  shadowColor: "#000000"
};
let P = f;
export {
  P as SLUCanvas
};
