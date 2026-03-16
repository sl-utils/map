import { u_mapGetPointsByLatlngs as k } from "../utils/slu-map.js";
import { SLUCanvas as w } from "../canvas/slu-canvas.js";
import { SLUCanvasImg as v } from "../canvas/slu-canvas-img.js";
const y = "/assets/images/direction-arrow.png";
class B {
  constructor(i, e, t) {
    this.map = i, this.ctx = e, this.animeLineOpt = t, this.defaultOption = {
      lineWidth: 16,
      // 默认每帧移动.5px
      speed: 0.5,
      imgUrl: y,
      partialHeight: 16,
      partialSpace: 2,
      partialWidth: 16,
      fillColor: "rgb(41, 152, 137)",
      strokeColor: "rgb(179, 218, 255)",
      degree: 1
    }, this.allLines = [], this.offset = 0, this.allPoints = [], this.animeLineOpt = Object.assign({}, this.defaultOption, this.animeLineOpt), this.initResource();
  }
  get imgUrl() {
    return this.animeLineOpt.imgUrl;
  }
  get patternBound() {
    return [this.animeLineOpt.partialWidth, this.animeLineOpt.partialHeight];
  }
  initResource() {
    v.loadImg([this.imgUrl]);
  }
  setAllLines(i) {
    this.allLines = i, this.update();
  }
  update() {
    this.allPoints = this.allLines.map((i) => {
      const { latlngs: e = [], latlng: t = [] } = i;
      return t.length && e.push(t), k(this.map, e);
    }), this.draw();
  }
  visiblePoint(i, e) {
    const [t, h] = i, [l, a] = e;
    return t < 0 || h < 0 ? !1 : !(t > l || h > a);
  }
  /**
   * 线段连线方向
   * @param point1
   * @param point2
   * @returns
   */
  directionLine(i, e) {
    const [t, h] = i, [l, a] = e;
    return t == l && h > a ? "top" : t == l && h < a ? "bottom" : h == a && t > l ? "left" : h == a && t < l ? "right" : t > l && h > a ? "topleft" : t > l && h < a ? "bottomleft" : t < l && h > a ? "topright" : t < l && h < a ? "bottomright" : "undefined";
  }
  /**
   * 不在画布范围内修改起始点 减少生成过多粒子
   * @returns
   */
  validLine(i) {
    const { width: e, height: t } = this.ctx.canvas, h = this.visiblePoint(i[0], [e, t]), l = this.visiblePoint(i[1], [e, t]), a = this.directionLine(i[0], i[1]);
    let [r, n] = i[0], [s, o] = i[1];
    if (!h || !l)
      if (n == o) {
        if (n < 0 || n > t)
          return !1;
        if (h && !l)
          s = a == "right" ? e : 0;
        else if (l && !h)
          r = a == "right" ? 0 : e;
        else {
          if (a == "right" && (r >= e || s <= 0) || a == "left" && (r <= 0 || s >= e))
            return !1;
          r = a == "right" ? 0 : e, s = a == "right" ? e : 0;
        }
      } else if (r == s) {
        if (r < 0 || r > e)
          return !1;
        if (h && !l)
          o = a == "top" ? 0 : t;
        else if (l && !h)
          n = a == "top" ? t : 0;
        else {
          if (a == "top" && (n <= 0 || o >= t) || a == "bottom" && (n >= t || o <= 0))
            return !1;
          n = a == "top" ? t : 0, o = a == "top" ? 0 : t;
        }
      } else {
        const g = (o - n) / (s - r), d = n - g * r, c = -d / g, f = (t - d) / g, p = d, u = g * e + d;
        if (h)
          switch (a) {
            case "topleft":
              [s, o] = c >= 0 && c <= e ? [c, 0] : [0, p];
              break;
            case "topright":
              [s, o] = c >= 0 && c <= e ? [c, 0] : [e, u];
              break;
            case "bottomleft":
              [s, o] = f >= 0 && f <= e ? [f, t] : [0, p];
              break;
            case "bottomright":
              [s, o] = f >= 0 && f <= e ? [f, t] : [e, u];
              break;
            default:
              return !1;
          }
        else if (l)
          switch (a) {
            case "topleft":
              [r, n] = f >= 0 && f <= e ? [f, t] : [e, u];
              break;
            case "topright":
              [r, n] = f >= 0 && f <= e ? [f, t] : [0, p];
              break;
            case "bottomleft":
              [r, n] = c >= 0 && c <= e ? [c, 0] : [e, u];
              break;
            case "bottomright":
              [r, n] = c >= 0 && c <= e ? [c, 0] : [0, p];
              break;
            default:
              return !1;
          }
        else {
          switch (a) {
            case "topleft":
              if (r <= 0 || n <= 0 || s >= e || o >= t)
                return !1;
              [r, n] = f >= 0 && f <= e ? [f, t] : [e, u], [s, o] = c >= 0 && c <= e ? [c, 0] : [0, p];
              break;
            case "topright":
              if (r >= e || n <= 0 || s <= 0 || o >= t)
                return !1;
              [r, n] = f >= 0 && f <= e ? [f, t] : [0, p], [s, o] = c >= 0 && c <= e ? [c, 0] : [e, u];
              break;
            case "bottomleft":
              if (r <= 0 || n >= t || s >= e || o <= 0)
                return !1;
              [r, n] = c >= 0 && c <= e ? [c, 0] : [e, u], [s, o] = f >= 0 && f <= e ? [f, t] : [0, p];
              break;
            case "bottomright":
              if (r >= e || n >= t || s <= 0 || o <= 0)
                return !1;
              [r, n] = c >= 0 && c <= e ? [c, 0] : [0, p], [s, o] = f >= 0 && f <= e ? [f, t] : [e, u];
              break;
            default:
              return !1;
          }
          if (!this.visiblePoint([r, n], [e, t]) || !this.visiblePoint([s, o], [e, t]))
            return !1;
        }
      }
    return [[r, n], [s, o]];
  }
  /**
   * 获取二次贝塞尔曲线划分任意点位置
   * @param {number} t 当前百分比
   * @param {Array} p1 起点坐标
   * @param {Array} cp 控制点
   * @param {Array} p2 终点坐标
   */
  getQuadraticBezierPoint(i, e, t, h) {
    const [l, a] = e, [r, n] = t, [s, o] = h;
    let g = (1 - i) * (1 - i) * l + 2 * i * (1 - i) * r + i * i * s, d = (1 - i) * (1 - i) * a + 2 * i * (1 - i) * n + i * i * o;
    return [g, d];
  }
  draw() {
    const i = this, { ctx: e, animeLineOpt: t } = i, { isBezier: h, degree: l = 1, speed: a, partialWidth: r, partialSpace: n } = t;
    e.save(), this.patternPathInit(), e.lineCap = "round", e.lineWidth = t.lineWidth;
    for (let s = 0; s < this.allPoints.length; s++) {
      let o = this.getValidPoints(this.allPoints[s]);
      if (h)
        for (let g = 1; g < this.allPoints[s].length; g++) {
          const d = [];
          let c = this.allPoints[s][g - 1], f = this.allPoints[s][g];
          const p = w.getBezierCtrlPoint(c, f, l), u = 50, L = Math.sqrt(Math.pow(c[0] - f[0], 2) + Math.pow(c[1] - f[1], 2)), b = Math.floor(u * (L / this.ctx.canvas.width)) || 1;
          for (let m = 0; m <= b; m++) {
            const x = this.getQuadraticBezierPoint(m / b, c, p, f);
            d.push(x);
          }
          let P = this.getValidPoints(d);
          if (!(P.length < 2))
            for (let m = 0; m < P.length; m += 2)
              this.drawPath([P[m], P[m + 1]]);
        }
      else {
        if (o.length < 2) continue;
        for (let g = 0; g < o.length; g += 2)
          this.drawPath([o[g], o[g + 1]]);
      }
    }
    e.restore(), this.offset += a, this.offset >= r + n && (this.offset = 0);
  }
  getValidPoints(i) {
    let e = [], t = i[0];
    for (let h = 1; h < i.length; h++) {
      const l = this.validLine([t, i[h]]);
      t = i[h], l && e.push(l[0], l[1]);
    }
    return e;
  }
  drawPath(i) {
    const e = this, { ctx: t, animeLineOpt: h } = e, { speed: l = 0.1, partialWidth: a } = h;
    let r = i[0];
    t.save(), t.beginPath(), t.translate(r[0], r[1]), t.moveTo(0, 0);
    for (let n = 1; n < i.length; n++) {
      const s = i[n];
      if (r = i[n - 1], t.lineTo(s[0] - r[0], s[1] - r[1]), n > 0) {
        t.save();
        const o = Math.atan2(s[1] - r[1], s[0] - r[0]);
        t.rotate(o), t.translate(this.offset + l, 0), t.stroke(), t.translate(-this.offset - l, 0), t.restore(), t.beginPath(), t.translate(-r[0], -r[1]), t.translate(s[0], s[1]), r = s, t.moveTo(0, 0);
      }
    }
    t.restore();
  }
  patternPathInit() {
    const i = this.createPattern();
    if (!i) {
      this.ctx.strokeStyle = this.animeLineOpt.strokeColor, this.ctx.fillStyle = this.animeLineOpt.fillColor;
      return;
    }
    this.ctx.strokeStyle = i;
  }
  createPattern() {
    const { strokeColor: i, fillColor: e, partialSpace: t } = this.animeLineOpt, h = v.ImageCache[this.imgUrl];
    if (!h) return null;
    const [l, a] = this.patternBound, r = document.createElement("canvas"), n = r.getContext("2d");
    r.width = l, r.height = a + t, n.fillStyle = e, n.fillRect(0, 0, l, a + t), n.drawImage(h, 0, t, l, a);
    const s = n.createPattern(r, "repeat"), o = new DOMMatrix();
    return o.rotateSelf(90), o.translateSelf(l / 2, (a + t) / 2), s.setTransform(o), s;
  }
}
export {
  B as MapCanvasArrowLine
};
