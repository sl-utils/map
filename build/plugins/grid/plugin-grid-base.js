import { u_mapGetLatLngByPoint as m } from "../../utils/slu-map.js";
import { SLUCanvas as C } from "../../canvas/slu-canvas.js";
import "../../canvas/slu-canvas-img.js";
import "../../canvas/slu-canvas-text.js";
import "../../map/canvas-event.js";
import { MapCanvasLayer as v } from "../../map/canvas-layer.js";
import "../../_virtual/leaflet-src.js";
import "../../_virtual/index.js";
import "../../leaflet/slu-leaflet-net-map.js";
import "../../_virtual/maplibre-gl.js";
import { SLUWorker as x } from "../../utils/slu-worker.js";
class E extends v {
  constructor(t, e) {
    super(t, e), this.options = {
      pane: "wavePane",
      zIndex: 200,
      mosaicColor: ["#0000CD", "#0066ff", "#00B7ff", "#00E0FF", "#00FFFF", "#00FFCC", "#00FF99", "#00FF00", "#99FF00", "#CCFF00", "#FFFF00", "#FFCC00", "#FF9900", "#FF6600", "#FF0000", "#B03060", "#D02090", "#FF00FF"],
      mosaicValue: [0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    }, this.dataLength = 1, this.worker = new x("grid-worker1", (i) => this.workerCb(i)), this.workerId = 0, Object.assign(this.options, e);
  }
  /**将线程绘制的图像绘制出来
   * @param data 线程绘制的图像
   */
  workerCb(t) {
    t.workerId && this.workerId - 1 !== t.workerId || (this.resetCanvas(), this.ctx.drawImage(t.data, 0, 0));
  }
  /**设置网格数据
   * @param datas 网格数据
   */
  _setDatas(t) {
    if (!t || t.length === 0) {
      this.gridXY = [];
      return;
    }
    let { lo1: e = 0, la1: i = 0, dx: a = 0, dy: l = 0 } = t[0]?.header || Object.assign({});
    this.lng0 = e, this.lat0 = i, this.lngΔ = a, this.latΔ = l, this.invalid = null, this.builder(t);
  }
  /**采用线程调取生成可视区网格数据
   * @param bounds 可视区域的像素范围
   */
  interpolateFieldByWorker(t) {
    let [e, i] = m(this.map, [0, 0]), [, a] = m(this.map, [1, t.height]), l = [];
    for (let r = 0, o = t.height; r <= o; r++) l[r] = m(this.map, [0, r])[0];
    this.worker.post({
      id: this.workerId++,
      width: t.width,
      height: t.height,
      lats: l,
      lat: e,
      lng: i,
      lat0: this.lat0,
      lng0: this.lng0,
      latΔ: this.latΔ,
      lngΔ: this.lngΔ,
      lngd: a - i,
      invalid: this.invalid,
      grid: this.gridXY,
      mosaicColor: this.options.mosaicColor,
      mosaicValue: this.options.mosaicValue
    });
  }
  /**grid数据，以及获得指定经纬度数据的方法interpolate
   * @param bounds 可视区域的像素范围
  */
  interpolateField(t) {
    const e = [];
    for (let i = t.x, a = t.height; i < a; i += 2) {
      const l = [];
      for (let r = t.x, o = t.width; r <= o; r += 2) {
        let [g, s] = m(this.map, [r, i]);
        if (isFinite(s)) {
          const h = this.interpolate(s, g);
          h && (l[r + 1] = l[r] = h);
        }
      }
      e[i + 1] = e[i] = l;
    }
    this.boundsDatas = e, this.genMosaic(e);
  }
  /**获取视图范围内的(指定像素间隔的数据)
   * @param bounds 可视区域的像素范围
   * @param pixelInterval @default 2 像素间隔
   * @returns 可视区域的网格数据
   */
  getViewBoundsGrid(t, e = 2) {
    const i = [];
    for (let a = t.x, l = t.height; a < l; a += e) {
      let r = [];
      for (let o = t.x, g = t.width; o <= g; o += e) {
        let [s, h] = m(this.map, [o, a]);
        if (isFinite(h)) {
          const n = this.interpolate(h, s);
          n && (r[o + 1] = r[o] = n);
        }
      }
      i[a + 1] = i[a] = r;
    }
    return this.boundsDatas = i, i;
  }
  /**构建网格数据gridXY: [开始的数据,结束的数据] [x序号] [y序号] 
   * @param grids 一维数据
   * @returns 三维网格数据
   */
  builder(t) {
    let { nx: e = 0, ny: i = 0, dx: a = 0 } = t[0]?.header || Object.assign({}), l = 1, r = Math.floor(e * a) >= 360, o = [], g = t[0].data || [], s = t[1]?.data || [], h = 0;
    for (let n = 0; n < i; n++) {
      let c = [];
      g[n], s[n];
      for (let f = 0; f < e; f++, h++) {
        let d = g[h], u = s[h];
        d = d === this.invalid || u === void 0 ? d : d * l, u = u === this.invalid || u === void 0 ? u : u * l, c[f] = [d, u];
      }
      r && c.push(c[0]), o[n] = c;
    }
    return this.gridXY = o, o;
  }
  /**获得指定经纬度的数据信息
  * @param lng 经度
  * @param lat 纬度
  * @return [ 计算得到的开始值S , 计算的到的结束值E, sqrt(S*S+E*E) ]
  */
  interpolate(t, e) {
    if (!this.gridXY) return null;
    let i = this.gridXY, a = this.lng0, l = this.lngΔ, r = this.latΔ, o = this.lat0, g = this.floorMod(t - a, 360) / l, s = (o - e) / r, h = Math.floor(g), n = h + 1, c = Math.floor(s), f = c + 1, d;
    if (d = i[c]) {
      const u = d[h], p = d[n];
      if (this.isValue(u) && this.isValue(p) && (d = i[f])) {
        const w = d[h], F = d[n];
        if (this.isValue(w) && this.isValue(F))
          return this.bilinearInterpolateVector(g - h, s - c, u, p, w, F);
      }
    }
    return null;
  }
  /**根据网格数据构建虚拟数值
  * @param x 指定经度的X数值相对最近的低位整数坐标的差值 [0,1)
  * @param y 指定纬度的Y数值相对最近的低位整数坐标的差值 [0,1)
  * @param g00 该经纬度所在的网格的左上角的风速信息
  * @param g10 该经纬度所在的网格的右上角的风速信息
  * @param g01 该经纬度所在的网格的左下角的风速信息
  * @param g11 该经纬度所在的网格的右下角的风速信息
  * @returns [ 计算得到的开始值S , 计算的到的结束值E, 平均速度 ]
  */
  bilinearInterpolateVector(t, e, i, a, l, r) {
    let o = 1 - t, g = 1 - e, s = o * g, h = t * g, n = o * e, c = t * e, f = i[0] * s + a[0] * h + l[0] * n + r[0] * c, d = i[1] * s + a[1] * h + l[1] * n + r[1] * c;
    return [f, d, Math.sqrt(f * f + d * d)];
  }
  /**针对经纬度特殊的取余数方法
   * 小于等于n的数字若a小于0，返回 2n+a ， -365  => 2n-365 
   * @param a 待取余的数字
   * @param n 取余的除数
   * @returns 取余的结果
  */
  floorMod(t, e) {
    return t - e * Math.floor(t / e);
  }
  /**判断是否为有效数据
   * @param x 待判断的数字
   * @returns 是否为有效数据
   */
  isValue(t) {
    return t != null;
  }
  /**此处无数据数据
   * @param xy 待判断的经纬度
   * @returns 是否为无数据数据
   */
  isNull(t) {
    return this.invalid === t[0] && this.invalid === t[1];
  }
  /**生成马赛克类型图
   * @param datas 网格数据
   */
  genMosaic(t) {
    let e = this.ctx, i = this.width, a = this.height;
    e.globalAlpha = 0.35;
    for (let l = 0, r = a; l < r; l++)
      for (let o = 0, g = i; o < g; o++) {
        let s = t[l][o] || [], h = s[2];
        e.fillStyle = this.getColorByValue(h), e.fillRect(o, l, 1, 1);
      }
  }
  /**生成黑白遮罩，以便构建渐变图
   * @param datas 网格数据
   * @returns MapPluginGridBase实例
   */
  genShade(t) {
    let e = this.options;
    this.shadowElement || (this.shadowElement = this.genShadowRadius(1, 0)), !this.gradientElement && e.gradient && (this.gradientElement = this.genGradient(e.gradient));
    let i = this.ctx, a = this.width, l = this.height, r = 0, o = e.gradientMax || -1;
    e.gradientRadius;
    for (let s = 0, h = l; s < h; s++)
      for (let n = 0, c = a; n < c; n++) {
        let f = t[s][n], d = f[2];
        i.globalAlpha = Math.min(Math.max(d / o, r), 1), i.drawImage(this.shadowElement, n, s);
      }
    let g = i.getImageData(0, 0, this.width, this.height);
    return this._colorize(g.data, this.gradient), i.putImageData(g, 0, 0), this;
  }
  /**获取该值所在的颜色
   * @param value 待判断的数值
   * @returns 该数值对应的颜色
   */
  getColorByValue(t) {
    if (t === this.invalid || t === void 0 || t === null) return "rgba(0,0,0,0)";
    let e = this.options, i = e.mosaicColor || [], a = e.mosaicValue || [];
    for (let l = 0, r = a.length; l < r; l++) {
      let o = a[l];
      if (t < o) return i[l];
    }
    return i[i.length - 1];
  }
  /**生成单个的阴影半径(圆形) 
   * @param r 半径
   * @param blur @default 15 模糊度
   * @returns 画布元素
  */
  genShadowRadius(t, e = 15) {
    let i = C.createCanvas(), a = i.getContext("2d"), l = t + e;
    return i.width = i.height = l * 2, a.shadowOffsetX = a.shadowOffsetY = l * 2, a.shadowBlur = e, a.shadowColor = "black", a.beginPath(), a.arc(-l, -l, t, 0, Math.PI * 2, !0), a.closePath(), a.fill(), i;
  }
  /**构建渐变色
   * @param grad 渐变颜色
   * @returns 画布元素
   */
  genGradient(t) {
    let e = C.createCanvas(), i = e.getContext("2d"), a = i.createLinearGradient(0, 0, 0, 256);
    e.width = 1, e.height = 256;
    for (const l in t) a.addColorStop(+l, t[l]);
    return i.fillStyle = a, i.fillRect(0, 0, 10, 256), this.gradient = i.getImageData(0, 0, 1, 256).data, e;
  }
  /**填充颜色
   * @param pixels 像素数据
   * @param gradient 渐变颜色
   */
  _colorize(t, e) {
    for (let i = 0, a = t.length, l; i < a; i += 4)
      l = t[i + 3] * 4, l && (t[i] = e[l], t[i + 1] = e[l + 1], t[i + 2] = e[l + 2]);
  }
}
export {
  E as MapPluginGridBase
};
