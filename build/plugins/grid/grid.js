import { u_mapGetLatLngByPoint as c } from "../../utils/slu-map.js";
import { SLUCanvas as x } from "../../canvas/slu-canvas.js";
import "../../canvas/slu-canvas-img.js";
import "../../map/canvas-event.js";
import { MapCanvasLayer as C } from "../../map/canvas-layer.js";
import "../../_virtual/leaflet-src.js";
import "../../_virtual/index.js";
import "../../leaflet/slu-leaflet-net-map.js";
import { SLUWorker as M } from "../../utils/slu-worker.js";
class X extends C {
  constructor(t, e) {
    super(t, e), this.dataLength = 1, this.worker = new M("grid-worker1", (i) => this.workerCb(i)), this.workerId = 0;
  }
  /**将线程绘制的图像绘制出来 */
  workerCb(t) {
    t.workerId && this.workerId - 1 !== t.workerId || (this.resetCanvas(), this.ctx.drawImage(t.data, 0, 0));
  }
  /**设置网格数据 */
  _setDatas(t) {
    if (!t || t.length === 0) {
      this.gridXY = [];
      return;
    }
    let { lo1: e = 0, la1: i = 0, dx: r = 0, dy: l = 0 } = t[0]?.header || {};
    this.lng0 = e, this.lat0 = i, this.lngΔ = r, this.latΔ = l, this.invalid = null, this.builder(t);
  }
  /**采用线程调取生成可视区网格数据 */
  interpolateFieldByWorker(t) {
    let [e, i] = c(this.map, [0, 0]), [, r] = c(this.map, [1, t.height]), l = [];
    for (let h = 0; h <= t.height; h++) l[h] = c(this.map, [0, h])[0];
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
      lngd: r - i,
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
    var e = [];
    for (let r = t.x, l = t.height; r < l; r += 2) {
      let h = [];
      for (let a = t.x; a <= t.width; a += 2) {
        let [o, s] = c(this.map, [a, r]);
        if (isFinite(s)) {
          var i = this.interpolate(s, o);
          i && (h[a + 1] = h[a] = i);
        }
      }
      e[r + 1] = e[r] = h;
    }
    this.boundsDatas = e, this.genMosaic(e);
  }
  /**获取视图范围内的(指定像素间隔的数据) */
  getViewBoundsGrid(t, e = 2) {
    var i = [];
    for (let l = t.x, h = t.height; l < h; l += e) {
      let a = [];
      for (let o = t.x; o <= t.width; o += e) {
        let [s, n] = c(this.map, [o, l]);
        if (isFinite(n)) {
          var r = this.interpolate(n, s);
          r && (a[o + 1] = a[o] = r);
        }
      }
      i[l + 1] = i[l] = a;
    }
    return this.boundsDatas = i, i;
  }
  /**构建网格数据gridXY: [开始的数据,结束的数据] [x序号] [y序号] 
   * @param data 一维数据
   * @param nx 列数
   * @param ny 行数
   * @returns 三维网格数据
   */
  builder(t) {
    let { nx: e = 0, ny: i = 0, dx: r = 0 } = t[0]?.header || {}, l = 1, h = Math.floor(e * r) >= 360, a = [], o = t[0].data || [], s = t[1]?.data || [], n = 0;
    for (var g = 0; g < i; g++) {
      let u = [];
      o[g], s[g];
      for (var f = 0; f < e; f++, n++) {
        let d = o[n], m = s[n];
        d = d === this.invalid || m === void 0 ? d : d * l, m = m === this.invalid || m === void 0 ? m : m * l, u[f] = [d, m];
      }
      h && u.push(u[0]), a[g] = u;
    }
    return this.gridXY = a, a;
  }
  /**获得指定经纬度的数据信息
  * @param lng 经度
  * @param lat 纬度
  * @return [ 计算得到的开始值S , 计算的到的结束值E, sqrt(S*S+E*E) ]
  */
  interpolate(t, e) {
    if (!this.gridXY) return null;
    let i = this.gridXY, r = this.lng0, l = this.lngΔ, h = this.latΔ, a = this.lat0, o = this.floorMod(t - r, 360) / l, s = (a - e) / h, n = Math.floor(o), g = n + 1, f = Math.floor(s), u = f + 1;
    var d;
    if (d = i[f]) {
      let w = d[n], v = d[g];
      if (this.isValue(w) && this.isValue(v) && (d = i[u])) {
        var m = d[n], p = d[g];
        if (this.isValue(m) && this.isValue(p))
          return this.bilinearInterpolateVector(o - n, s - f, w, v, m, p);
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
  bilinearInterpolateVector(t, e, i, r, l, h) {
    let a = 1 - t, o = 1 - e, s = a * o, n = t * o, g = a * e, f = t * e, u = i[0] * s + r[0] * n + l[0] * g + h[0] * f, d = i[1] * s + r[1] * n + l[1] * g + h[1] * f;
    return [u, d, Math.sqrt(u * u + d * d)];
  }
  /**针对经纬度特殊的取余数方法
   * 小于等于n的数字若a小于0，返回 2n+a ， -365  => 2n-365 
  */
  floorMod(t, e) {
    return t - e * Math.floor(t / e);
  }
  /**判断是否为有效数据 */
  isValue(t) {
    return t != null;
  }
  /**此处无数据数据 */
  isNull(t) {
    return this.invalid === t[0] && this.invalid === t[1];
  }
  /**生成马赛克类型图 */
  genMosaic(t) {
    let e = this.ctx, i = this.width, r = this.height;
    e.globalAlpha = 0.35;
    for (let l = 0, h = r; l < h; l++)
      for (let a = 0, o = i; a < o; a++) {
        let s = t[l][a] || [], n = s[2];
        e.fillStyle = this.getColorByValue(n), e.fillRect(a, l, 1, 1);
      }
  }
  /**生成黑白遮罩，以便构建渐变图 */
  genShade(t) {
    let e = this.options;
    this.shadowElement || (this.shadowElement = this.genShadowRadius(1, 0)), !this.gradientElement && e.gradient && (this.gradientElement = this.genGradient(e.gradient));
    let i = this.ctx, r = this.width, l = this.height, h = 0, a = e.gradientMax || -1;
    e.gradientRadius;
    for (let s = 0, n = l; s < n; s++)
      for (let g = 0, f = r; g < f; g++) {
        let u = t[s][g], d = u[2];
        i.globalAlpha = Math.min(Math.max(d / a, h), 1), i.drawImage(this.shadowElement, g, s);
      }
    let o = i.getImageData(0, 0, this.width, this.height);
    return this._colorize(o.data, this.gradient), i.putImageData(o, 0, 0), this;
  }
  /**获取该值所在的颜色 */
  getColorByValue(t) {
    if (t === this.invalid || t === void 0 || t === null) return "rgba(0,0,0,0)";
    let e = this.options, i = e.mosaicColor || [], r = e.mosaicValue || [];
    for (let l = 0, h = r.length; l < h; l++) {
      let a = r[l];
      if (t < a) return i[l];
    }
    return i[i.length - 1];
  }
  /**生成单个的阴影半径(圆形) 
   * @param r 半径
   * @param blur 模糊度
  */
  genShadowRadius(t, e = 15) {
    let i = x.createCanvas(), r = i.getContext("2d"), l = t + e;
    return i.width = i.height = l * 2, r.shadowOffsetX = r.shadowOffsetY = l * 2, r.shadowBlur = e, r.shadowColor = "black", r.beginPath(), r.arc(-l, -l, t, 0, Math.PI * 2, !0), r.closePath(), r.fill(), i;
  }
  /**构建渐变色 */
  genGradient(t) {
    let e = x.createCanvas(), i = e.getContext("2d"), r = i.createLinearGradient(0, 0, 0, 256);
    e.width = 1, e.height = 256;
    for (var l in t) r.addColorStop(+l, t[l]);
    return i.fillStyle = r, i.fillRect(0, 0, 10, 256), this.gradient = i.getImageData(0, 0, 1, 256).data, e;
  }
  /**填充颜色 */
  _colorize(t, e) {
    for (var i = 0, r = t.length, l; i < r; i += 4)
      l = t[i + 3] * 4, l && (t[i] = e[l], t[i + 1] = e[l + 1], t[i + 2] = e[l + 2]);
  }
}
export {
  X as MapPluginGridBase
};
