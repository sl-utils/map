import { MapCanvasDraw as u } from "../map/canvas-draw.js";
import "../map/canvas-event.js";
import "../_virtual/leaflet-src.js";
import { u_mapGetPointByLatlng as d, u_mapGetLatLngByPoint as z, u_mapGetMapSize as w } from "../utils/slu-map.js";
import "../_virtual/index.js";
import "../leaflet/slu-leaflet-net-map.js";
import "../_virtual/maplibre-gl.js";
import "../canvas/slu-canvas.js";
import "../canvas/slu-canvas-img.js";
import "../canvas/slu-canvas-text.js";
import { MapPluginGridBase as f } from "./grid/plugin-grid-base.js";
class F extends f {
  constructor(i, s) {
    super(i.map, s), this.iconResolver = (t) => {
      const e = [(t < 0.3 ? 0 : t < 1.6 ? 1 : t < 3.4 ? 2 : t < 5.5 ? 3 : t < 8 ? 4 : t < 10.8 ? 5 : t < 13.9 ? 6 : t < 17.2 ? 7 : t < 20.8 ? 8 : t < 24.5 ? 9 : t < 28.5 ? 10 : t < 32.7 ? 11 : 12) + 2, 1], { url: n, size: r, sizeo: o } = this.options;
      return {
        url: n,
        size: r,
        sizeo: o,
        posX: e[0] * (r[0] + 1),
        posY: e[1] * (r[1] + 1)
      };
    }, this.options = {
      url: "/assets/icons/icon-28.png",
      size: [28, 28],
      sizeo: [28, 28],
      zooMsize: [
        [6, 6],
        [6, 6],
        [6, 6],
        [6, 6],
        [8, 8],
        [8, 8],
        //0-5
        [12, 12],
        [16, 16],
        [22, 22],
        [28, 28],
        [28, 28],
        [28, 28],
        //6-11
        [32, 32],
        [32, 32],
        [32, 32],
        [32, 32],
        [32, 32],
        [32, 32],
        [32, 32],
        [32, 32],
        [32, 32],
        [32, 32],
        [32, 32],
        [32, 32]
      ],
      pane: "windPane"
    }, this.draw = new u(this.map, this.canvas), this.options = { ...this.options, ...s };
  }
  /**设置图标解析器
   * @param resolver 图标解析器
   * @returns MapPluginWind实例
   */
  setIconResolver(i) {
    return this.iconResolver = i, this;
  }
  /**设置风速风向数据
   * @param data 风速风向数据
   */
  setData(i) {
    this._setDatas(i), this.renderFixedData();
  }
  /**获取视图范围内的(指定像素间隔的数据)
   * @param bounds 视图范围
   * @param pixelInterval @default 2 像素间隔
   * @returns 风速风向数据
   */
  getViewBoundsGridWind(i, s = 2) {
    const t = [];
    let [l, e] = d(this.map, [0, 0]), n = e % s, r = l % s;
    for (let o = n, a = i.height; o < a; o += s)
      for (let p = r, g = i.width; p < g; p += s) {
        let [c, h] = z(this.map, [p, o]);
        if (isFinite(h)) {
          const m = this.interpolate(h, c);
          m && t.push({ latlng: [c, h], speed: m[0], direction: m[1] });
        }
      }
    return t;
  }
  /**根据风力等级获取图片裁剪地址 x,y */
  renderAnimation() {
  }
  /**渲染静态图层 */
  renderFixedData() {
    const i = w(this.map);
    let s = this.getViewBoundsGridWind({ x: 10, y: 10, width: i.w, height: i.h }, 60), t = this.options, l = 1, e = [];
    for (let n = 0, r = s.length; n < r; ) {
      const o = s[n];
      n = n + l;
      const a = this.iconResolver(o.speed);
      e.push({
        url: a.url,
        size: a.size || t.size,
        sizeo: a.sizeo,
        posX: a.posX,
        posY: a.posY,
        latlng: o.latlng,
        rotate: o.direction
      });
    }
    this.draw.setAllImgs(e), this.draw.drawMapAll();
  }
}
export {
  F as MapPluginWind
};
