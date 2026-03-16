import { u_arrItemDel as I, u_mapGetMapSize as G, u_mapGetPointByLatlng as P } from "../utils/slu-map.js";
import { SLUCanvas as y } from "../canvas/slu-canvas.js";
import "../canvas/slu-canvas-img.js";
import "../map/canvas-event.js";
import { MapCanvasLayer as O } from "../map/canvas-layer.js";
import { l as u } from "../_virtual/leaflet-src.js";
import "../_virtual/index.js";
import "../leaflet/slu-leaflet-net-map.js";
class Y extends O {
  constructor(t, a) {
    super(t.map, a), this._allHeats = [], this.heatDatas = [], this.options = {
      pane: "canvas",
      className: "heat",
      radius: 20,
      blur: 10,
      minOpacity: 0.1,
      gradientIndex: 1,
      ifTip: !0,
      tipX: 80,
      tipY: 20,
      gradient: {
        0.2: "blue",
        0.4: "cyan",
        0.6: "lime",
        0.8: "yellow",
        1: "red"
      }
    }, this.setOptions(a);
  }
  renderAnimation() {
    this.heatDatas = this.computeHeatData(), this.resetCanvas(), this.drawByheatData(), this.options && this.options.ifTip && this._addGradient(this.computeZoomGradient());
  }
  /**重置[纬度，经度]集合*/
  setAllHeats(t) {
    return this._allHeats = t, this._redraw();
  }
  /**添加[纬度，经度],并重绘*/
  addHeat(t) {
    return this._allHeats.push(t), this._redraw();
  }
  delHeat(t) {
    return I(this._allHeats, t), this._redraw();
  }
  /**更新配置 */
  setOptions(t) {
    return u.setOptions(this, t), this._updateOptions(), this._redraw();
  }
  _updateOptions() {
    this.genShadowRadius(this.options.radius, this.options.blur), this.options.gradient && this.genGradient(this.options.gradient);
  }
  /**计算热力图数据 */
  computeHeatData() {
    let t = this.map;
    if (!t)
      return [];
    let a = this._r, e = G(t), i = u.point([e.w, e.h]), s = new u.Bounds(u.point([-a, -a]), i.add([a, a])), p = this.computeZoomGradient(), v = 1 / p, m = a / 2, o = [], w = t?._getMapPanePos?.() || { x: 0, y: 0 }, S = w.x % m, D = w.y % m, h, g, r, f, d, c, x, n;
    for (h = 0, g = this._allHeats.length; h < g; h++) {
      let _ = this._allHeats[h], l = P(this.map, _.latlng);
      if (s.contains(l)) {
        f = Math.floor((l[0] - S) / m) + 2, d = Math.floor((l[1] - D) / m) + 2;
        var H = _.weight !== void 0 ? _.weight : 1;
        n = H * v, o[d] = o[d] || [], r = o[d][f], r ? (r[0] = (r[0] * r[2] + l[0] * n) / (r[2] + n), r[1] = (r[1] * r[2] + l[1] * n) / (r[2] + n), r[2] += n) : o[d][f] = [l[0], l[1], n];
      }
    }
    let M = [];
    for (h = 0, g = o.length; h < g; h++)
      if (o[h])
        for (c = 0, x = o[h].length; c < x; c++)
          r = o[h][c], r && M.push([
            Math.round(r[0]),
            Math.round(r[1]),
            Math.min(r[2], 1)
          ]);
    return M;
  }
  /**计算最高变色需要的数值 */
  computeZoomGradient() {
    let t = this.options.gradientIndex, a = this.map.getZoom();
    return Math.pow(2, Math.min(12, Math.atan(Math.PI / 8 / a) * 100 * t | 0));
  }
  /**添加等级标识 */
  _addGradient(t) {
    let a = this.ctx, e = this.options.tipX, i = this.options.tipY;
    a.globalAlpha = 0.5, a.drawImage(this._gradEl, e, i, 20, 128), a.fillText("0", e + 25, i), a.fillText(t, e + 25, i + 128);
  }
  /**根据数据重绘制热力图 */
  drawByheatData() {
    let t = this.ctx;
    this._circleShadow || this.genShadowRadius(this.options.radius), this._grad || this.genGradient(this.options.gradient);
    let a = this.options.minOpacity || 0.05;
    for (var e = 0, i = this.heatDatas.length, s; e < i; e++)
      s = this.heatDatas[e], t.globalAlpha = Math.min(Math.max(s[2], a), 1), t.drawImage(this._circleShadow, s[0] - this._r, s[1] - this._r);
    var p = t.getImageData(0, 0, this.width, this.height);
    return this._colorize(p.data, this._grad), t.putImageData(p, 0, 0), this;
  }
  /**生成单个的阴影半径 */
  genShadowRadius(t, a = 15) {
    let e = this._circleShadow = y.createCanvas(), i = e.getContext("2d"), s = this._r = t + a;
    e.width = e.height = s * 2, i.shadowOffsetX = i.shadowOffsetY = s * 2, i.shadowBlur = a, i.shadowColor = "black", i.beginPath(), i.arc(-s, -s, t, 0, Math.PI * 2, !0), i.closePath(), i.fill();
  }
  /**创建渐变色 */
  genGradient(t) {
    let a = this._gradEl = y.createCanvas(), e = a.getContext("2d"), i = e.createLinearGradient(0, 0, 0, 256);
    a.width = 1, a.height = 256;
    for (var s in t)
      i.addColorStop(+s, t[s]);
    return e.fillStyle = i, e.fillRect(0, 0, 10, 256), this._grad = e.getImageData(0, 0, 1, 256).data, this;
  }
  /**填充颜色 */
  _colorize(t, a) {
    for (var e = 0, i = t.length, s; e < i; e += 4)
      s = t[e + 3] * 4, s && (t[e] = a[s], t[e + 1] = a[s + 1], t[e + 2] = a[s + 2]);
  }
}
export {
  Y as MapPluginHeat
};
