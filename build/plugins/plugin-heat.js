import { u_arrItemDel as I, u_mapGetMapSize as G, u_mapGetPointByLatlng as P } from "../utils/slu-map.js";
import { SLUCanvas as y } from "../canvas/slu-canvas.js";
import "../canvas/slu-canvas-img.js";
import "../canvas/slu-canvas-text.js";
import "../map/canvas-event.js";
import { MapCanvasLayer as O } from "../map/canvas-layer.js";
import { l as u } from "../_virtual/leaflet-src.js";
import "../_virtual/index.js";
import "../leaflet/slu-leaflet-net-map.js";
import "../_virtual/maplibre-gl.js";
class E extends O {
  constructor(t, a) {
    super(t.map, a), this._allHeats = [], this.heatDatas = [], this.options = {
      pane: "canvas",
      className: "heat",
      radius: 20,
      blur: 10,
      gradient: {
        0.2: "blue",
        0.4: "cyan",
        0.6: "lime",
        0.8: "yellow",
        1: "red"
      },
      minOpacity: 0.1,
      gradientIndex: 1,
      ifTip: !0,
      tipX: 80,
      tipY: 20
    }, this.setOptions(a);
  }
  /**渲染动态数据 */
  renderAnimation() {
    this.heatDatas = this.computeHeatData(), this.resetCanvas(), this.drawByheatData(), this.options && this.options.ifTip && this._addGradient(this.computeZoomGradient().toString());
  }
  /**重置[纬度，经度]集合
   * @param heats 热力数据集合
  */
  setAllHeats(t) {
    return this._allHeats = t, this._redraw();
  }
  /**添加[纬度，经度],并重绘
   * @param heat 热力数据
  */
  addHeat(t) {
    return this._allHeats.push(t), this._redraw();
  }
  /**删除[纬度，经度],并重绘
   * @param heat 热力数据
  */
  delHeat(t) {
    return I(this._allHeats, t), this._redraw();
  }
  /**设置配置
   * @param options 热力图配置
   */
  setOptions(t) {
    return u.setOptions(this, t), this._updateOptions(), this._redraw();
  }
  /**更新配置 */
  _updateOptions() {
    this.genShadowRadius(this.options.radius, this.options.blur), this.options.gradient && this.genGradient(this.options.gradient);
  }
  /**计算热力图数据
   * @returns 热力图绘制数据 [位置x,位置y,权重W]
   */
  computeHeatData() {
    let t = this.map;
    if (!t)
      return [];
    let a = this._r, i = G(t), e = u.point([i.w, i.h]), s = new u.Bounds(u.point([-a, -a]), e.add([a, a])), d = this.computeZoomGradient(), S = 1 / d, m = a / 2, r = [], w = t?._getMapPanePos?.() || { x: 0, y: 0 }, D = w.x % m, H = w.y % m, h, g, o, f, p, c, x, n;
    for (h = 0, g = this._allHeats.length; h < g; h++) {
      let _ = this._allHeats[h], l = P(this.map, _.latlng);
      s.contains(l) && (f = Math.floor((l[0] - D) / m) + 2, p = Math.floor((l[1] - H) / m) + 2, n = (_.weight !== void 0 ? _.weight : 1) * S, r[p] = r[p] || [], o = r[p][f], o ? (o[0] = (o[0] * o[2] + l[0] * n) / (o[2] + n), o[1] = (o[1] * o[2] + l[1] * n) / (o[2] + n), o[2] += n) : r[p][f] = [l[0], l[1], n]);
    }
    let M = [];
    for (h = 0, g = r.length; h < g; h++)
      if (r[h])
        for (c = 0, x = r[h].length; c < x; c++)
          o = r[h][c], o && M.push([
            Math.round(o[0]),
            Math.round(o[1]),
            Math.min(o[2], 1)
          ]);
    return M;
  }
  /**计算最高变色需要的数值
   * @returns 最高变色需要的数值
   */
  computeZoomGradient() {
    let t = this.options.gradientIndex, a = this.map.getZoom();
    return Math.pow(2, Math.min(12, Math.atan(Math.PI / 8 / a) * 100 * t | 0));
  }
  /**添加等级标识
   * @param num 等级标识
   */
  _addGradient(t) {
    let a = this.ctx, i = this.options.tipX, e = this.options.tipY;
    a.globalAlpha = 0.5, a.drawImage(this._gradEl, i, e, 20, 128), a.fillText("0", i + 25, e), a.fillText(t, i + 25, e + 128);
  }
  /**根据数据重绘制热力图
   * @returns MapPluginHeat实例
   */
  drawByheatData() {
    let t = this.ctx;
    this._circleShadow || this.genShadowRadius(this.options.radius), this._grad || this.genGradient(this.options.gradient);
    let a = this.options.minOpacity || 0.05;
    for (let e = 0, s = this.heatDatas.length, d; e < s; e++)
      d = this.heatDatas[e], t.globalAlpha = Math.min(Math.max(d[2], a), 1), t.drawImage(this._circleShadow, d[0] - this._r, d[1] - this._r);
    const i = t.getImageData(0, 0, this.width, this.height);
    return this._colorize(i.data, this._grad), t.putImageData(i, 0, 0), this;
  }
  /**生成单个的阴影半径
   * @param r 半径
   * @param blur @default 15 模糊半径
   */
  genShadowRadius(t, a = 15) {
    let i = this._circleShadow = y.createCanvas(), e = i.getContext("2d"), s = this._r = t + a;
    i.width = i.height = s * 2, e.shadowOffsetX = e.shadowOffsetY = s * 2, e.shadowBlur = a, e.shadowColor = "black", e.beginPath(), e.arc(-s, -s, t, 0, Math.PI * 2, !0), e.closePath(), e.fill();
  }
  /**创建渐变色
   * @param grad 渐变色
   * @returns MapPluginHeat实例
   */
  genGradient(t) {
    let a = this._gradEl = y.createCanvas(), i = a.getContext("2d"), e = i.createLinearGradient(0, 0, 0, 256);
    a.width = 1, a.height = 256;
    for (let s in t)
      e.addColorStop(+s, t[s]);
    return i.fillStyle = e, i.fillRect(0, 0, 10, 256), this._grad = i.getImageData(0, 0, 1, 256).data, this;
  }
  /**填充颜色
   * @param pixels 像素数据
   * @param gradient 渐变色
   */
  _colorize(t, a) {
    for (let i = 0, e = t.length, s; i < e; i += 4)
      s = t[i + 3] * 4, s && (t[i] = a[s], t[i + 1] = a[s + 1], t[i + 2] = a[s + 2]);
  }
}
export {
  E as MapPluginHeat
};
