const P = class P {
  constructor() {
  }
  /**绘制小圆点
   * @param arc 圆数据
   * @param ctx 画布上下文
   * @returns SLUCanvas实例
   */
  static drawArc(e, t = this.ctx) {
    if (e.ifHide === !0) return this;
    let { point: i, points: s = [], size: r = 10 } = e;
    i && (s.length ? s.push(i) : s = [i]), this.setCtxPara(t, e);
    for (let a = 0, l = s.length; a < l; a++) {
      t.beginPath();
      const [h, o] = s[a] || [0, 0];
      t.arc(h, o, r, 0, 2 * Math.PI, !1), t.stroke(), t.globalAlpha = e.fillAlpha ?? 1, t.fill();
    }
    return this.setCtxPara(t), this;
  }
  /**绘制矩形
   * @param rect 矩形数据
   * @param ctx 画布上下文
   * @returns SLUCanvas实例
   */
  static drawRect(e, t = this.ctx) {
    if (e.ifHide === !0) return this;
    let { point: i, points: s = [], width: r = 0, height: a = 0, radius: l = [0, 0, 0, 0] } = e;
    i && (s.length ? s.push(i) : s = [i]), this.setCtxPara(t, e);
    for (let h = 0, o = s.length; h < o; h++) {
      const [d, n] = s[h] || [0, 0];
      t.beginPath(), t.roundRect(d, n, r, a, l), t.stroke(), t.globalAlpha = e.fillAlpha ?? 1, t.fill(), t.closePath();
    }
    return this.setCtxPara(t), this;
  }
  /**绘制多边形
   * @param polygon 多边形数据
   * @param ctx 画布上下文
   * @returns SLUCanvas实例
   */
  static drawPolygon(e, t = this.ctx) {
    const { points: i = [] } = e;
    if (e.ifHide === !0 || i.length < 2) return this;
    this.setCtxPara(t, e);
    for (let s = 0, r = i.length; s < r; s++) {
      const [a, l] = i[s] || [0, 0];
      s == 0 ? (t.beginPath(), t.moveTo(a, l)) : s == r - 1 ? (t.lineTo(a, l), t.closePath(), t.globalAlpha = e.fillAlpha ?? 1, t.fill(), t.lineWidth > 0 && (t.globalAlpha = e.alpha ?? 1, t.stroke())) : t.lineTo(a, l);
    }
    return this.setCtxPara(t), this;
  }
  /**绘制线
   * @param line 线数据
   * @param ctx 画布上下文
   * @returns SLUCanvas实例
   */
  static drawLine(e, t = this.ctx) {
    if (e.ifHide === !0) return this;
    const { points: i = [] } = e;
    if (i.length < 2) return this;
    this.setCtxPara(t, e);
    const [s, r] = i[0] || [0, 0];
    e.widthLine, t.beginPath(), t.moveTo(s, r);
    for (let a = 1, l = i.length; a < l; a++) {
      const [h, o] = i[a] || [0, 0];
      t.lineTo(h, o);
    }
    return t.stroke(), this.setCtxPara(t), this;
  }
  /**绘制贝塞尔曲线
   * @param line 贝塞尔曲线数据
   * @param ctx 画布上下文
   * @returns SLUCanvas实例
   */
  static drawBezierLine(e, t = this.ctx) {
    if (e.ifHide === !0) return this;
    const { points: i = [] } = e;
    if (i.length < 2) return this;
    this.setCtxPara(t, e);
    const [s, r] = i[0] || [0, 0], a = e.degree ?? 1;
    t.beginPath(), t.moveTo(s, r);
    for (let l = 1, h = i.length; l < h; l++) {
      let [o, d] = i[l - 1], [n, p] = i[l], [u, f] = this.getBezierCtrlPoint([o, d], [n, p], a);
      t.quadraticCurveTo(u, f, n, p);
    }
    return t.stroke(), this.setCtxPara(t), this;
  }
  /**创建一个画布
   * @returns 画布元素
   */
  static createCanvas() {
    return document.createElement("canvas");
  }
  /**获取贝塞尔曲线的控制点
   * @param s:起点
   * @param e:终点
   * @param degree：曲度等级（越大越弯曲）
   * @returns 控制点
   */
  static getBezierCtrlPoint(e, t, i = 1) {
    const s = e, r = t, a = (s[0] + r[0]) / 2, l = (s[1] + r[1]) / 2, h = i;
    let o = a - s[0], d = l - s[1], n = Math.sqrt(o * o + d * d);
    if (n === 0) return [a, l];
    let p = Math.PI / 2 - Math.asin(d / n), u = h * Math.cos(p) * n, f = h * Math.sin(p) * n * o / Math.abs(o);
    return u = isNaN(u) ? 0 : u, f = isNaN(f) ? 0 : f, [a + u, l - f];
  }
  /**设置画布的相关配置
   * @param ctx 2D画布渲染上下文
   * @param fig 画布属性配置
   * @returns 2D画布渲染上下文
   */
  static setCtxPara(e, t = {}) {
    return this.ctx = e, this.deletePara(t), t = Object.assign({}, this.ctxFig, t), e.globalAlpha = t.alpha, e.globalCompositeOperation = t.globalCompositeOperation, e.fillStyle = t.colorFill, e.strokeStyle = t.colorLine, e.lineWidth = t.widthLine, e.shadowColor = t.shadowColor, e.shadowBlur = t.shadowBlur, e.font = t.font, e.textBaseline = t.textBaseline, e.setLineDash(t.dash), e.lineDashOffset = t.dashOff, e;
  }
  /**移除掉值为 undefined 或 null 的属性，方便赋值
   * @param obj 对象
   */
  static deletePara(e = {}) {
    for (const t in e)
      if (Object.prototype.hasOwnProperty.call(e, t)) {
        const i = e[t];
        i == null && Reflect.deleteProperty(e, t);
      }
  }
};
P.ctxFig = {
  alpha: 1,
  fillAlpha: 1,
  colorFill: "#EE3434",
  colorLine: "#FFFFFF",
  shadowColor: "#000000",
  shadowBlur: 0,
  widthLine: 1,
  dash: [10, 0],
  dashOff: 0,
  font: "14px serif",
  textBaseline: "top",
  globalCompositeOperation: "source-over"
};
let C = P;
export {
  C as SLUCanvas
};
