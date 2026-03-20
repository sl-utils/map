import w from "../node_modules/rbush/index.js";
import { MapPluginDraw as B } from "./plugin-draw.js";
import "../canvas/slu-canvas.js";
import { SLUCanvasImg as x } from "../canvas/slu-canvas-img.js";
import { u_mapGetPointByLatlng as O } from "../utils/slu-map.js";
class L extends B {
  constructor(t, s) {
    super(t, s), this.rbush = new w(), this.rbushData = [], this.bigDataImgs = [], this._renderBigDataImgs = [], this.resetRbush = () => {
      this.rbush && this.rbush.clear(), this.rbushData = [], this.bigDataImgs.forEach((e) => {
        this.transformRbush(e);
      }), this.rbush.load(this.rbushData);
    }, this.bigDataOption = s;
  }
  get renderBigDataList() {
    return this._renderBigDataImgs;
  }
  /**绘制大量图标 rbush筛选重叠优化 */
  setbigDataImgs(t) {
    this.rbush.clear(), this.rbushData = [], this.bigDataImgs = t, this.rbushData = t.map((s) => (this._draw.transformImageSize(s), this.transformRbush(s))), this.rbush.load(this.rbushData);
  }
  /**
   * 将画布划分为多个矩形
   * 矩形内限制最大重叠图形，超出不绘制
   */
  handleOverlapImage() {
    const t = this, { canvas: s, rbush: e, ctx: r, _draw: i, map: h } = t, a = h.getZoom(), { width: n, height: o } = s, { minBound: f = [n, o], maxCount: c } = this.getZoomOption(a), [u, g] = f, p = /* @__PURE__ */ new Set();
    for (let d = 0; d < n; d += u / 2)
      for (let l = 0; l < o; l += g / 2) {
        const b = [d + u / 2, l + g / 2];
        e.search({
          minX: b[0] - u / 2,
          minY: b[1] - g / 2,
          maxX: b[0] + u / 2,
          maxY: b[1] + g / 2
        }).forEach((D, I) => {
          const { data: m } = D;
          (I < c || c == -1) && !p.has(m) && (i.transformXY(m), p.add(m), x.drawImg(m, r), this._renderBigDataImgs.push(m));
        });
      }
  }
  /**
   * 根据图层缩放 获取配置
   * @param zoom
   * @returns
   */
  getZoomOption(t) {
    const s = this, { bigDataOption: e } = s, { zoomOption: r } = e;
    if (r[t]) return r[t];
    const i = Object.keys(r).map((a) => Number(a)).sort((a, n) => Number(a) - Number(n)), h = i.length;
    for (let a = 0; a < h - 1; a++)
      if (t > i[a] && t < i[a + 1])
        return r[i[a]];
    return r[i[h - 1]];
  }
  /**图片转化为rbush数据格式 */
  transformRbush(t) {
    const { latlng: s, size: e = [0, 0], left: r = 0, top: i = 0 } = t;
    let h = e[0], a = e[1], [n, o] = O(this.map, s);
    return {
      minX: n - h / 2 + r,
      minY: o - a / 2 + i,
      maxX: n + h / 2 + r,
      maxY: o + a / 2 + i,
      data: t,
      latlng: s
    };
  }
  /**绘制所有需要绘制的类 */
  drawMapAll() {
    return console.time("start"), this._renderBigDataImgs = [], this._draw.drawMapAll(), this.handleOverlapImage(), console.timeEnd("start"), this;
  }
}
export {
  L as MapPluginBigData
};
