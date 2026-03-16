import { SLUCanvas as M } from "../canvas/slu-canvas.js";
import "../canvas/slu-canvas-img.js";
import { u_mapGetSizeByMap as F, u_mapGetPointByLatlng as D } from "../utils/slu-map.js";
class k {
  constructor(r, t) {
    this.map = r, this.ctx = t, this.radarDefault = { animeId: "0", angle: [0, 90], currentAngle: 0, ifClockwise: !0, time: 3, gridDensity: 8, arcDash: [100, 500], colorDash: ["#FF0000", "#00FF00"], dashDensity: 3, colorSector: "#00FF00", colorText: "#FFFF00", colorGrid: "#49EFEF66", colorRadar: "#00FFFF", sectorAngle: 30, sizeFix: [0, 0], latlng: [0, 0] }, this.allRadars = [];
  }
  get zoom() {
    return this.map.getZoom();
  }
  /**重设雷达绘制类 */
  setAllRadars(r) {
    return this.allRadars = r.filter((t) => t).map((t) => Object.assign({}, this.radarDefault, t)), this;
  }
  /**添加雷达绘制类 */
  addRadar(r) {
    return this.allRadars.push(Object.assign({}, this.radarDefault, r)), this;
  }
  /**开始绘制所有雷达静态部分 */
  drawRadarStatic() {
    const r = this, { zoom: t } = this;
    r.allRadars.forEach((s) => {
      const { maxZoom: e = 50, minZoom: c = 0 } = s;
      t < c || t > e || (this.updatePoint(s), r.drawGrid(s), r.drawDashArc(s), r.drawCustomDashArc(s), r.drawOutline(s), r.drawOutlineUnit(s), r.drawBackground(s), r.drawText(s), r.drawScanRange(s));
    });
  }
  /**开始绘制所有雷达动态扫描部分 */
  drawRadarAmi(r) {
    const t = this.pertime && r ? r - this.pertime : 16.666666666666668, s = this.zoom;
    this.pertime = r, this.allRadars.forEach((e) => {
      const { maxZoom: c = 50, minZoom: n = 0 } = e;
      s < n || s > c || (this.updatePoint(e), this.updateAngle(e, t), this.drawScan(e));
    });
  }
  /**更新所有雷达位置和大小 */
  updatePoint(r) {
    const { map: t } = this;
    r.radius = F(t, r)[0], r.center = D(t, r.latlng);
  }
  /**绘制雷达网格 */
  drawGrid(r) {
    const { ctx: t } = this, { center: s, radius: e, gridDensity: c, colorGrid: n } = r, [o, a] = s;
    t.save(), t.beginPath(), t.arc(o, a, e, 0, Math.PI * 2), t.clip();
    const l = Math.max(Math.floor(e / c), 30), h = e / l + 1 | 0, i = l * h - e, [g, d] = [o - e - i, a - e - i], f = e * 2 + i;
    for (let u = 1; u < h * 2; u++) {
      const [p, x] = [g + u * l, d], [m, w] = [g, d + u * l];
      M.drawLine(
        {
          points: [[p, x], [p, x + f]],
          colorLine: n
        },
        t
      ), M.drawLine(
        {
          points: [[m, w], [m + f, w]],
          colorLine: n
        },
        t
      );
    }
    t.restore();
  }
  /**虚线圈到中心点距离 */
  drawDashArc(r) {
    const { ctx: t } = this, { center: s, radius: e, colorRadar: c, dashDensity: n, arcDash: o } = r, [a, l] = s, h = r.sizeFix;
    if (o.length > 0) return;
    const i = e / n, g = Number(Math.round(h[0] / n));
    t.save(), t.setLineDash([2, 5]), t.strokeStyle = c, t.fillStyle = c, t.textAlign = "center";
    for (let d = 1; d <= Math.floor(e / i); d++) {
      t.beginPath();
      const f = i * d;
      t.arc(a, l, f, 0, Math.PI * 2), t.stroke(), e >= 50 && t.fillText(`${g * d > h[0] ? h[0] : g * d}m`, a, l + f - 5);
    }
    t.restore();
  }
  /**绘制自定义的虚线圈 */
  drawCustomDashArc(r) {
    const { ctx: t } = this, { center: s, radius: e, colorDash: c, arcDash: n = [] } = r, [o, a] = s;
    if (n.length == 0) return;
    const l = r.sizeFix, h = e / l[0];
    t.save(), t.setLineDash([2, 5]);
    const i = this.caculateColorChange(c, n.length);
    t.textAlign = "center", n.forEach((g, d) => {
      if (g >= e) return;
      const f = h * g;
      t.fillStyle = t.strokeStyle = `rgb(
            ${i[d][0]},
            ${i[d][1]},
            ${i[d][2]})`, t.beginPath(), t.arc(o, a, f, 0, Math.PI * 2), t.stroke(), e >= 50 && t.fillText(`${g > l[0] ? l[0] : g}m`, o, a + f - 5);
    }), t.restore();
  }
  /**绘制轮廓 */
  drawOutline(r) {
    const { ctx: t } = this, { center: s, radius: e, colorRadar: c } = r, [n, o] = s;
    t.save(), t.beginPath(), t.lineWidth = e < 100 ? 1 : 2, t.strokeStyle = c, t.arc(n, o, e, 0, Math.PI * 2), t.stroke(), t.restore();
  }
  /**绘制边缘单元 */
  drawOutlineUnit(r) {
    const { ctx: t } = this, { center: s, radius: e, colorRadar: c } = r, [n, o] = s, a = e >= 100, l = 1, h = a ? 4 : e < 50 ? 1 : 3;
    t.save(), t.strokeStyle = c, t.lineWidth = l, t.translate(n, o);
    for (let i = 0; i < 360; i++) {
      let g = i % 5 == 0 ? h * 2 : h;
      if (!a && i % 5 !== 0) continue;
      t.beginPath(), t.rotate(i * Math.PI / 180);
      const d = [e, 0], f = [e + g, 0];
      t.moveTo(...d), t.lineTo(...f), t.stroke(), t.rotate(-i * Math.PI / 180);
    }
    t.restore();
  }
  /**雷达背景蒙版 中间泛白*/
  drawBackground(r) {
    const { ctx: t } = this, { center: s, radius: e } = r, [c, n] = s;
    t.save(), t.restore();
  }
  /**绘制文字描述 */
  drawText(r) {
    const { ctx: t } = this, { center: s, radius: e, colorText: c } = r, [n, o] = s;
    if (e < 100) return;
    const a = 20, l = [
      ["90°", "E"],
      ["180°", "S"],
      ["270°", "W"],
      ["360°", "N"]
    ], h = [
      [
        [e - a / 2, 4],
        [e + a, 4]
      ],
      [
        [0, e - a / 2 - 5],
        [0, e + a + 4]
      ],
      [
        [-e + a / 2 + 4, 4],
        [-e - a, 4]
      ],
      [
        [0, -e + a / 2 + 4],
        [0, -e - a + 4]
      ]
    ];
    t.save(), t.font = "12px Droid Sans bold", t.fillStyle = c, t.textAlign = "center", t.translate(n, o), l.forEach((i, g) => {
      const [d, f] = i, [u, p] = h[g];
      t.fillText(d, u[0], u[1]), t.fillText(f, p[0], p[1]);
    }), t.restore();
  }
  /**绘制扫描范围 */
  drawScanRange(r) {
    const { ctx: t } = this, { angle: s, center: e, radius: c, colorRadar: n } = r, [o, a] = e;
    t.save(), t.translate(o, a), s.forEach((l) => {
      const h = (l - 90) % 360 * Math.PI / 180;
      t.rotate(h), M.drawLine({ points: [[0, 0], [c, 0]], colorLine: n }, t), t.rotate(-h);
    }), t.restore();
  }
  /**更新动态当前角度 */
  updateAngle(r, t) {
    let { angle: [s, e], currentAngle: c, ifClockwise: n, time: o } = r;
    s -= 90, e -= 90;
    let a = c + (e - s) * t / 1e3 / o * (n ? 1 : -1);
    n && a >= e ? a = s + a % e : !n && a <= s && (a = e - (s - a) % 360), r.currentAngle = a;
  }
  /**绘制扫描部分(动态) */
  drawScan(r) {
    const { ctx: t } = this, { center: s, radius: e, currentAngle: c, colorSector: n } = r, [o, a] = s;
    t.save();
    const l = c % 360 * Math.PI / 180, h = e * Math.cos(l), i = e * Math.sin(l);
    M.drawLine({
      points: [
        [o, a],
        [o + h, a + i]
      ],
      colorLine: n
    }), this.drawSector(r), t.restore();
  }
  /**
   * 绘制扇形区域
   * @param sectorDeg 扇形渐变角度
   * @returns
   */
  drawSector(r) {
    let { ctx: t } = this, { angle: [s, e], center: c, radius: n, ifClockwise: o, currentAngle: a, colorSector: l, sectorAngle: h } = r, [i, g] = c;
    s -= 90, e -= 90, t.save();
    let d = 50;
    const f = h % 360 * Math.PI / 180, u = o ? 1 : -1;
    let p = f / d * u;
    const x = a % 360 * Math.PI / 180, m = s % 360 * Math.PI / 180, w = e % 360 * Math.PI / 180;
    let y = x - u * f, S = x;
    for (let A = 0; A < d; A++) {
      t.beginPath(), t.moveTo(i, g);
      const P = y * 180 / Math.PI, R = Math.floor(1 / d * 255);
      o && P % 360 >= s || !o && P % 360 <= e ? t.arc(i, g, n, y, S, !o) : t.arc(i, g, n, o ? m : w, S, !o), t.fillStyle = `${l}${R.toString(16).padStart(2, "0")}`, t.fill(), y += p;
    }
    t.restore();
  }
  /**计算colors 渐变颜色 */
  caculateColorChange(r, t) {
    const s = r.length, e = s <= t ? t / (s - 1) : 1, c = r.map((o, a) => {
      let l = parseInt(o.slice(1, 3), 16), h = parseInt(o.slice(3, 5), 16), i = parseInt(o.slice(5, 7), 16);
      return [l, h, i];
    });
    if (r.length < 2) return new Array(t).fill(0).map(() => c[0]);
    const n = [];
    for (let o = 0; o < t; o++) {
      const a = Math.floor(o / e), [l, h, i] = c[a], [g, d, f] = c[a + 1], u = o % e / e, p = Math.floor(l + (g - l) * u), x = Math.floor(h + (d - h) * u), m = Math.floor(i + (f - i) * u);
      n.push([p, x, m]);
    }
    return n;
  }
}
export {
  k as MapCanvasRadar
};
