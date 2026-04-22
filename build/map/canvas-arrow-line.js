import { u_mapGetPointsByLatlngs as L } from "../utils/slu-map.js";
import { SLUCanvas as C } from "../canvas/slu-canvas.js";
import { SLUCanvasImg as x } from "../canvas/slu-canvas-img.js";
const S = "/assets/images/direction-arrow.png";
class U {
  constructor(i, e, t) {
    this.map = i, this.ctx = e, this.opt = t, this.options = {
      lineWidth: 16,
      // 默认每帧移动.5px
      speed: 0.5,
      partialHeight: 16,
      partialSpace: 2,
      partialWidth: 16,
      degree: 1,
      fillColor: "rgb(41, 152, 137)",
      strokeColor: "rgb(179, 218, 255)",
      imgUrl: S
    }, this.allLines = [], this.offset = 0, this.allPoints = [], this.opt = Object.assign({}, this.options, this.opt), this.initResource();
  }
  /**(箭头)图片地址 */
  get imgUrl() {
    return this.opt.imgUrl;
  }
  /**(箭头)图片宽度 */
  get partialWidth() {
    return this.opt.partialWidth;
  }
  /**(箭头)图片高度 */
  get partialHeight() {
    return this.opt.partialHeight;
  }
  /**边界 */
  get patternBound() {
    return [this.opt.partialWidth, this.opt.partialHeight];
  }
  /**初始化资源加载图片 */
  initResource() {
    x.loadImg([this.imgUrl]);
  }
  /**设置所有线
   * @param lines 线集合
   */
  setAllLines(i) {
    this.allLines = i, this.update();
  }
  /**更新所有线的点并绘制 */
  update() {
    this.allPoints = this.allLines.map((i) => {
      const { latlngs: e = [], latlng: t = [] } = i;
      return t.length && e.push(t), L(this.map, e);
    }), this.draw();
  }
  /**判断点是否在画布范围内
   * @param point 点
   * @param range 画布范围
   * @returns 是否在画布范围内
   */
  visiblePoint(i, e) {
    const [t, o] = i, [h, s] = e;
    return t < 0 || o < 0 ? !1 : !(t > h || o > s);
  }
  /** 线段连线方向
   * @param point1
   * @param point2
   * @returns 线段连线方向
   */
  directionLine(i, e) {
    const [t, o] = i, [h, s] = e;
    return t == h && o > s ? "top" : t == h && o < s ? "bottom" : o == s && t > h ? "left" : o == s && t < h ? "right" : t > h && o > s ? "topleft" : t > h && o < s ? "bottomleft" : t < h && o > s ? "topright" : t < h && o < s ? "bottomright" : "undefined";
  }
  /** 不在画布范围内修改起始点 减少生成过多粒子
   * @param points 线段点
   * @returns 修正后的线段点
   */
  validLine(i) {
    const { width: e, height: t } = this.ctx.canvas, o = this.visiblePoint(i[0], [e, t]), h = this.visiblePoint(i[1], [e, t]), s = this.directionLine(i[0], i[1]);
    let [r, a] = i[0], [l, n] = i[1];
    if (!o || !h)
      if (a == n) {
        if (a < 0 || a > t)
          return !1;
        if (o && !h)
          l = s == "right" ? e : 0;
        else if (h && !o)
          r = s == "right" ? 0 : e;
        else {
          if (s == "right" && (r >= e || l <= 0) || s == "left" && (r <= 0 || l >= e))
            return !1;
          r = s == "right" ? 0 : e, l = s == "right" ? e : 0;
        }
      } else if (r == l) {
        if (r < 0 || r > e)
          return !1;
        if (o && !h)
          n = s == "top" ? 0 : t;
        else if (h && !o)
          a = s == "top" ? t : 0;
        else {
          if (s == "top" && (a <= 0 || n >= t) || s == "bottom" && (a >= t || n <= 0))
            return !1;
          a = s == "top" ? t : 0, n = s == "top" ? 0 : t;
        }
      } else {
        const g = (n - a) / (l - r), p = a - g * r, c = -p / g, f = (t - p) / g, u = p, d = g * e + p;
        if (o)
          switch (s) {
            case "topleft":
              [l, n] = c >= 0 && c <= e ? [c, 0] : [0, u];
              break;
            case "topright":
              [l, n] = c >= 0 && c <= e ? [c, 0] : [e, d];
              break;
            case "bottomleft":
              [l, n] = f >= 0 && f <= e ? [f, t] : [0, u];
              break;
            case "bottomright":
              [l, n] = f >= 0 && f <= e ? [f, t] : [e, d];
              break;
            default:
              return !1;
          }
        else if (h)
          switch (s) {
            case "topleft":
              [r, a] = f >= 0 && f <= e ? [f, t] : [e, d];
              break;
            case "topright":
              [r, a] = f >= 0 && f <= e ? [f, t] : [0, u];
              break;
            case "bottomleft":
              [r, a] = c >= 0 && c <= e ? [c, 0] : [e, d];
              break;
            case "bottomright":
              [r, a] = c >= 0 && c <= e ? [c, 0] : [0, u];
              break;
            default:
              return !1;
          }
        else {
          switch (s) {
            case "topleft":
              if (r <= 0 || a <= 0 || l >= e || n >= t)
                return !1;
              [r, a] = f >= 0 && f <= e ? [f, t] : [e, d], [l, n] = c >= 0 && c <= e ? [c, 0] : [0, u];
              break;
            case "topright":
              if (r >= e || a <= 0 || l <= 0 || n >= t)
                return !1;
              [r, a] = f >= 0 && f <= e ? [f, t] : [0, u], [l, n] = c >= 0 && c <= e ? [c, 0] : [e, d];
              break;
            case "bottomleft":
              if (r <= 0 || a >= t || l >= e || n <= 0)
                return !1;
              [r, a] = c >= 0 && c <= e ? [c, 0] : [e, d], [l, n] = f >= 0 && f <= e ? [f, t] : [0, u];
              break;
            case "bottomright":
              if (r >= e || a >= t || l <= 0 || n <= 0)
                return !1;
              [r, a] = c >= 0 && c <= e ? [c, 0] : [0, u], [l, n] = f >= 0 && f <= e ? [f, t] : [e, d];
              break;
            default:
              return !1;
          }
          if (!this.visiblePoint([r, a], [e, t]) || !this.visiblePoint([l, n], [e, t]))
            return !1;
        }
      }
    return [[r, a], [l, n]];
  }
  /**获取二次贝塞尔曲线划分任意点位置
   * @param {number} t 当前百分比
   * @param {Array} p1 起点坐标
   * @param {Array} cp 控制点
   * @param {Array} p2 终点坐标
   * @returns 二次贝塞尔曲线划分任意点位置
   */
  getQuadraticBezierPoint(i, e, t, o) {
    const [h, s] = e, [r, a] = t, [l, n] = o;
    let g = (1 - i) * (1 - i) * h + 2 * i * (1 - i) * r + i * i * l, p = (1 - i) * (1 - i) * s + 2 * i * (1 - i) * a + i * i * n;
    return [g, p];
  }
  /**绘制箭头线 */
  draw() {
    const i = this, { ctx: e, opt: t } = i, { isBezier: o, degree: h = 1, speed: s, partialWidth: r, partialSpace: a } = t;
    e.save(), this.patternPathInit(), e.lineCap = "round", e.lineWidth = t.lineWidth;
    for (let l = 0, n = this.allPoints.length; l < n; l++) {
      let g = this.getValidPoints(this.allPoints[l]);
      if (o)
        for (let p = 1, c = this.allPoints[l].length; p < c; p++) {
          const f = [];
          let u = this.allPoints[l][p - 1], d = this.allPoints[l][p];
          const k = C.getBezierCtrlPoint(u, d, h), w = 50, y = Math.sqrt(Math.pow(u[0] - d[0], 2) + Math.pow(u[1] - d[1], 2)), v = Math.floor(w * (y / e.canvas.width)) || 1;
          for (let m = 0; m <= v; m++) {
            const b = this.getQuadraticBezierPoint(m / v, u, k, d);
            f.push(b);
          }
          let P = this.getValidPoints(f);
          if (!(P.length < 2))
            for (let m = 0, b = P.length; m < b; m += 2)
              this.drawPath([P[m], P[m + 1]]);
        }
      else {
        if (g.length < 2) continue;
        for (let p = 0, c = g.length; p < c; p += 2)
          this.drawPath([g[p], g[p + 1]]);
      }
    }
    e.restore(), this.offset += s, this.offset >= r + a && (this.offset = 0);
  }
  /**获取修正后的线段点
   * @param points 线段点
   * @returns 修正后的线段点
   */
  getValidPoints(i) {
    let e = [], t = i[0];
    for (let o = 1, h = i.length; o < h; o++) {
      const s = this.validLine([t, i[o]]);
      t = i[o], s && e.push(s[0], s[1]);
    }
    return e;
  }
  /**绘制箭头线路径
   * @param points 线段点
   */
  drawPath(i) {
    const e = this, { ctx: t, opt: o } = e, { speed: h = 0.1, partialWidth: s } = o;
    let r = i[0];
    t.save(), t.beginPath(), t.translate(r[0], r[1]), t.moveTo(0, 0);
    for (let a = 1, l = i.length; a < l; a++) {
      const n = i[a];
      if (r = i[a - 1], t.lineTo(n[0] - r[0], n[1] - r[1]), a > 0) {
        t.save();
        const g = Math.atan2(n[1] - r[1], n[0] - r[0]);
        t.rotate(g), t.translate(this.offset + h, 0), t.stroke(), t.translate(-this.offset - h, 0), t.restore(), t.beginPath(), t.translate(-r[0], -r[1]), t.translate(n[0], n[1]), r = n, t.moveTo(0, 0);
      }
    }
    t.restore();
  }
  /**初始化箭头线图案路径 */
  patternPathInit() {
    const i = this.createPattern();
    if (!i) {
      this.ctx.strokeStyle = this.opt.strokeColor, this.ctx.fillStyle = this.opt.fillColor;
      return;
    }
    this.ctx.strokeStyle = i;
  }
  /**创建箭头线图案
   * @returns 箭头线图案
   */
  createPattern() {
    const { strokeColor: i, fillColor: e, partialSpace: t } = this.opt, o = x.ImageCache[this.imgUrl];
    if (!o) return null;
    const [h, s] = this.patternBound, r = document.createElement("canvas"), a = r.getContext("2d");
    r.width = h, r.height = s + t, a.fillStyle = e, a.fillRect(0, 0, h, s + t), a.drawImage(o, 0, t, h, s);
    const l = a.createPattern(r, "repeat"), n = new DOMMatrix();
    return n.rotateSelf(90), n.translateSelf(h / 2, (s + t) / 2), l.setTransform(n), l;
  }
}
export {
  U as MapCanvasArrowLine
};
