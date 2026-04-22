import B from "../node_modules/rbush/index.js";
import { MapPluginDraw as _ } from "./plugin-draw.js";
import "../canvas/slu-canvas.js";
import { SLUCanvasImg as x } from "../canvas/slu-canvas-img.js";
import "../canvas/slu-canvas-text.js";
import { u_mapGetPointByLatlng as O } from "../utils/slu-map.js";
class P extends _ {
  constructor(t, a) {
    super(t, a), this.rbush = new B(), this.rbush_search = /* @__PURE__ */ Object.create({}), this.rbushData = [], this.bigDataImgs = [], this._renderBigDataImgs = [], this.resetRbush = () => {
      this.rbush && this.rbush.clear(), this.rbushData.length = 0, this.bigDataImgs.forEach((h) => {
        this.transformRbush(h);
      }), this.rbush.load(this.rbushData);
    }, this.bigDataOption = a;
  }
  /**大数据绘制图标 用于事件添加 */
  get renderBigDataList() {
    return this._renderBigDataImgs;
  }
  /**绘制大量图标 rbush筛选重叠优化
   * @param imgs 图标数组
   */
  setbigDataImgs(t) {
    this.rbush.clear(), this.rbushData.length = 0, this.bigDataImgs = t, this.rbushData = t.map((a) => (this._draw.transformImageSize(a), this.transformRbush(a))), this.rbush.load(this.rbushData), this.drawMapAll();
  }
  /**
   * 将画布划分为多个矩形
   * 矩形内限制最大重叠图形，超出不绘制
   */
  handleOverlapImage() {
    const t = this, { canvas: a, rbush: h, ctx: e, _draw: r, map: n } = t, s = n.getZoom(), { width: i, height: o } = a, { minBound: D = [i, o], maxCount: p } = this.getZoomOption(s), [g, l] = D, f = /* @__PURE__ */ new Set();
    for (let c = 0; c < i; c += g / 2)
      for (let d = 0; d < o; d += l / 2) {
        const b = [c + g / 2, d + l / 2], m = this.rbush_search;
        m.maxX = b[0] + g / 2, m.minX = b[0] - g / 2, m.maxY = b[1] + l / 2, m.minY = b[1] - l / 2, h.search(m).forEach((I, w) => {
          const { data: u } = I;
          (w < p || p == -1) && !f.has(u) && (r.transformXY(u), f.add(u), x.drawImg(u, e), this._renderBigDataImgs.push(u));
        });
      }
  }
  /**
   * 根据图层缩放 获取配置
   * @param zoom
   * @returns { maxCount: number; minBound?: [number, number]; }
   */
  getZoomOption(t) {
    const a = this, { bigDataOption: h } = a, { zoomOption: e } = h;
    if (e[t]) return e[t];
    const r = Object.keys(e).map((s) => Number(s)).sort((s, i) => Number(s) - Number(i)), n = r.length;
    for (let s = 0, i = r.length - 1; s < i; s++)
      if (t > r[s] && t < r[s + 1])
        return e[r[s]];
    return e[r[n - 1]];
  }
  /**图片转化为rbush数据格式
   * @param img 图标
   * @returns rbush数据格式
   */
  transformRbush(t) {
    const { latlng: a, size: h = [0, 0], left: e = 0, top: r = 0 } = t;
    let n = h[0], s = h[1], [i, o] = O(this.map, a);
    return {
      minX: i - n / 2 + e,
      minY: o - s / 2 + r,
      maxX: i + n / 2 + e,
      maxY: o + s / 2 + r,
      data: t,
      latlng: a
    };
  }
  /**绘制所有需要绘制的类
   * @returns MapPluginBigData实例
   */
  drawMapAll() {
    return console.time("start"), this._renderBigDataImgs.length = 0, this._draw.drawMapAll(), this.handleOverlapImage(), console.timeEnd("start"), this;
  }
}
export {
  P as MapPluginBigData
};
