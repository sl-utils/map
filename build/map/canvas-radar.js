import { SLUCanvas as y } from "../canvas/slu-canvas.js";
import "../canvas/slu-canvas-img.js";
import "../canvas/slu-canvas-text.js";
import { u_mapGetSizeByMap as I, u_mapGetPointByLatlng as b, u_tsIfOneArrTwoLen as R } from "../utils/slu-map.js";
class z {
  constructor(r, t) {
    this.map = r, this.ctx = t, this.options = {
      animeId: "0",
      angle: [0, 90],
      ifClockwise: !0,
      time: 3,
      currentAngle: 0,
      sectorAngle: 30,
      colorSector: "#00FF00",
      colorGrid: "#49EFEF66",
      colorText: "#FFFF00",
      colorRadar: "#00FFFF",
      colorDash: ["#FF0000", "#00FF00"],
      arcDash: [100, 500],
      gridDensity: 8,
      dashDensity: 3,
      sizeFix: [0, 0],
      latlng: [0, 0]
    }, this.allRadars = [];
  }
  /**当前地图缩放层级 */
  get zoom() {
    return this.map.getZoom();
  }
  /**重设雷达绘制类
   * @param radars 雷达数据集合
   * @returns MapCanvasRadar实例
   */
  setAllRadars(r) {
    return this.allRadars = r.filter((t) => t).map((t) => Object.assign({}, this.options, t)), this;
  }
  /**添加雷达绘制类
   * @param radar 雷达数据
   * @returns MapCanvasRadar实例
   */
  addRadar(r) {
    return this.allRadars.push(Object.assign({}, this.options, r)), this;
  }
  /**开始绘制所有雷达静态部分 */
  drawRadarStatic() {
    const r = this, { zoom: t } = this;
    r.allRadars.forEach((o) => {
      const { maxZoom: e = 50, minZoom: c = 0 } = o;
      t < c || t > e || (this.updatePoint(o), r.drawGrid(o), r.drawDashArc(o), r.drawCustomDashArc(o), r.drawOutline(o), r.drawOutlineUnit(o), r.drawBackground(o), r.drawText(o), r.drawScanRange(o));
    });
  }
  /**开始绘制所有雷达动态扫描部分
   * @param time 当前时间(毫秒)
   */
  drawRadarAmi(r) {
    const t = this.pertime && r ? r - this.pertime : 16.666666666666668, o = this.zoom;
    this.pertime = r, this.allRadars.forEach((e) => {
      const { maxZoom: c = 50, minZoom: a = 0 } = e;
      o < a || o > c || (this.updatePoint(e), this.updateAngle(e, t), this.drawScan(e));
    });
  }
  /**更新所有雷达位置和大小
   * @param radar 雷达数据
   */
  updatePoint(r) {
    const { map: t } = this;
    r.radius = I(t, r)[0], r.center = b(t, r.latlng);
  }
  /**绘制雷达网格
   * @param radar 雷达数据
   */
  drawGrid(r) {
    const { ctx: t } = this, { center: o, radius: e, gridDensity: c, colorGrid: a } = r, [n, s] = o;
    t.save(), t.beginPath(), t.arc(n, s, e, 0, Math.PI * 2), t.clip();
    const l = Math.max(Math.floor(e / c), 30), h = e / l + 1 | 0, i = l * h - e, [g, d] = [n - e - i, s - e - i], u = e * 2 + i;
    for (let f = 1, p = h * 2; f < p; f++) {
      const [x, m] = [g + f * l, d], [M, w] = [g, d + f * l];
      y.drawLine(
        {
          points: [[x, m], [x, m + u]],
          colorLine: a
        },
        t
      ), y.drawLine(
        {
          points: [[M, w], [M + u, w]],
          colorLine: a
        },
        t
      );
    }
    t.restore();
  }
  /**虚线圈到中心点距离
   * @param radar 雷达数据
   */
  drawDashArc(r) {
    const { ctx: t } = this, { center: o, radius: e, colorRadar: c, dashDensity: a, arcDash: n } = r, [s, l] = o, h = r.sizeFix;
    if (n.length > 0 || !R(h)) return;
    const i = e / a, g = Number(Math.round(h[0] / a));
    t.save(), t.setLineDash([2, 5]), t.strokeStyle = c, t.fillStyle = c, t.textAlign = "center";
    for (let d = 1, u = Math.floor(e / i); d <= u; d++) {
      t.beginPath();
      const f = i * d;
      t.arc(s, l, f, 0, Math.PI * 2), t.stroke(), e >= 50 && t.fillText(`${g * d > h[0] ? h[0] : g * d}m`, s, l + f - 5);
    }
    t.restore();
  }
  /**绘制自定义的虚线圈
   * @param radar 雷达数据
   */
  drawCustomDashArc(r) {
    const { ctx: t } = this, { center: o, radius: e, colorDash: c, arcDash: a = [] } = r, [n, s] = o, l = r.sizeFix;
    if (a.length == 0 || !R(l)) return;
    const h = e / l[0];
    t.save(), t.setLineDash([2, 5]);
    const i = this.caculateColorChange(c, a.length);
    t.textAlign = "center", a.forEach((g, d) => {
      if (g >= e) return;
      const u = h * g;
      t.fillStyle = t.strokeStyle = `rgb(
            ${i[d][0]},
            ${i[d][1]},
            ${i[d][2]})`, t.beginPath(), t.arc(n, s, u, 0, Math.PI * 2), t.stroke(), e >= 50 && t.fillText(`${g > l[0] ? l[0] : g}m`, n, s + u - 5);
    }), t.restore();
  }
  /**绘制轮廓
   * @param radar 雷达数据
   */
  drawOutline(r) {
    const { ctx: t } = this, { center: o, radius: e, colorRadar: c } = r, [a, n] = o;
    t.save(), t.beginPath(), t.lineWidth = e < 100 ? 1 : 2, t.strokeStyle = c, t.arc(a, n, e, 0, Math.PI * 2), t.stroke(), t.restore();
  }
  /**绘制边缘单元
   * @param radar 雷达数据
   */
  drawOutlineUnit(r) {
    const { ctx: t } = this, { center: o, radius: e, colorRadar: c } = r, [a, n] = o, s = e >= 100, l = 1, h = s ? 4 : e < 50 ? 1 : 3;
    t.save(), t.strokeStyle = c, t.lineWidth = l, t.translate(a, n);
    for (let i = 0; i < 360; i++) {
      let g = i % 5 == 0 ? h * 2 : h;
      if (!s && i % 5 !== 0) continue;
      t.beginPath(), t.rotate(i * Math.PI / 180);
      const d = [e, 0], u = [e + g, 0];
      t.moveTo(...d), t.lineTo(...u), t.stroke(), t.rotate(-i * Math.PI / 180);
    }
    t.restore();
  }
  /**雷达背景蒙版 中间泛白
   * @param radar 雷达数据
   */
  drawBackground(r) {
    const { ctx: t } = this, { center: o, radius: e } = r, [c, a] = o;
    t.save(), t.restore();
  }
  /**绘制文字描述
   * @param radar 雷达数据
   */
  drawText(r) {
    const { ctx: t } = this, { center: o, radius: e, colorText: c } = r, [a, n] = o;
    if (e < 100) return;
    const s = 20, l = [
      ["90°", "E"],
      ["180°", "S"],
      ["270°", "W"],
      ["360°", "N"]
    ], h = [
      [
        [e - s / 2, 4],
        [e + s, 4]
      ],
      [
        [0, e - s / 2 - 5],
        [0, e + s + 4]
      ],
      [
        [-e + s / 2 + 4, 4],
        [-e - s, 4]
      ],
      [
        [0, -e + s / 2 + 4],
        [0, -e - s + 4]
      ]
    ];
    t.save(), t.font = "12px Droid Sans bold", t.fillStyle = c, t.textAlign = "center", t.translate(a, n), l.forEach((i, g) => {
      const [d, u] = i, [f, p] = h[g];
      t.fillText(d, f[0], f[1]), t.fillText(u, p[0], p[1]);
    }), t.restore();
  }
  /**绘制扫描范围
   * @param radar 雷达数据
   */
  drawScanRange(r) {
    const { ctx: t } = this, { angle: o, center: e, radius: c, colorRadar: a } = r, [n, s] = e;
    t.save(), t.translate(n, s), o.forEach((l) => {
      const h = (l - 90) % 360 * Math.PI / 180;
      t.rotate(h), y.drawLine({ points: [[0, 0], [c, 0]], colorLine: a }, t), t.rotate(-h);
    }), t.restore();
  }
  /**更新动态当前角度
   * @param radar 雷达数据
   * @param diffTime 时间差
   */
  updateAngle(r, t) {
    let { angle: [o, e], currentAngle: c, ifClockwise: a, time: n } = r;
    o -= 90, e -= 90;
    let s = c + (e - o) * t / 1e3 / n * (a ? 1 : -1);
    a && s >= e ? s = o + s % e : !a && s <= o && (s = e - (o - s) % 360), r.currentAngle = s;
  }
  /**绘制扫描部分(动态)
   * @param radar 雷达数据
   */
  drawScan(r) {
    const { ctx: t } = this, { center: o, radius: e, currentAngle: c, colorSector: a } = r, [n, s] = o;
    t.save();
    const l = c % 360 * Math.PI / 180, h = e * Math.cos(l), i = e * Math.sin(l);
    y.drawLine({
      points: [
        [n, s],
        [n + h, s + i]
      ],
      colorLine: a
    }), this.drawSector(r), t.restore();
  }
  /**
   * 绘制扇形区域
   * @param sectorDeg 扇形渐变角度
   */
  drawSector(r) {
    let { ctx: t } = this, { angle: [o, e], center: c, radius: a, ifClockwise: n, currentAngle: s, colorSector: l, sectorAngle: h } = r, [i, g] = c;
    o -= 90, e -= 90, t.save();
    let d = 50;
    const u = h % 360 * Math.PI / 180, f = n ? 1 : -1;
    let p = u / d * f;
    const x = s % 360 * Math.PI / 180, m = o % 360 * Math.PI / 180, M = e % 360 * Math.PI / 180;
    let w = x - f * u, A = x;
    for (let S = 0; S < d; S++) {
      t.beginPath(), t.moveTo(i, g);
      const P = w * 180 / Math.PI, F = Math.floor(1 / d * 255);
      n && P % 360 >= o || !n && P % 360 <= e ? t.arc(i, g, a, w, A, !n) : t.arc(i, g, a, n ? m : M, A, !n), t.fillStyle = `${l}${F.toString(16).padStart(2, "0")}`, t.fill(), w += p;
    }
    t.restore();
  }
  /**计算colors 渐变颜色
   * @param colors 颜色数组
   * @param total 总颜色数
   * @returns 渐变颜色数组
   */
  caculateColorChange(r, t) {
    const o = r.length, e = o <= t ? t / (o - 1) : 1, c = r.map((n, s) => {
      let l = parseInt(n.slice(1, 3), 16), h = parseInt(n.slice(3, 5), 16), i = parseInt(n.slice(5, 7), 16);
      return [l, h, i];
    });
    if (r.length < 2) return new Array(t).fill(0).map(() => c[0]);
    const a = [];
    for (let n = 0; n < t; n++) {
      const s = Math.floor(n / e), [l, h, i] = c[s], [g, d, u] = c[s + 1], f = n % e / e, p = Math.floor(l + (g - l) * f), x = Math.floor(h + (d - h) * f), m = Math.floor(i + (u - i) * f);
      a.push([p, x, m]);
    }
    return a;
  }
}
export {
  z as MapCanvasRadar
};
