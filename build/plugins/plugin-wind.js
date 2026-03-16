import { MapCanvasDraw as c } from "../map/canvas-draw.js";
import "../map/canvas-event.js";
import "../_virtual/leaflet-src.js";
import { u_mapGetPointByLatlng as u, u_mapGetLatLngByPoint as z, u_mapGetMapSize as d } from "../utils/slu-map.js";
import "../_virtual/index.js";
import "../leaflet/slu-leaflet-net-map.js";
import "../canvas/slu-canvas.js";
import "../canvas/slu-canvas-img.js";
import { MapPluginGridBase as w } from "./grid/grid.js";
class R extends w {
  constructor(i, o) {
    super(i.map, o), this.iconResolver = (t) => {
      const r = [(t < 0.3 ? 0 : t < 1.6 ? 1 : t < 3.4 ? 2 : t < 5.5 ? 3 : t < 8 ? 4 : t < 10.8 ? 5 : t < 13.9 ? 6 : t < 17.2 ? 7 : t < 20.8 ? 8 : t < 24.5 ? 9 : t < 28.5 ? 10 : t < 32.7 ? 11 : 12) + 2, 1], { url: n, size: e, sizeo: s } = this.options;
      return {
        url: n,
        size: e,
        sizeo: s,
        posX: r[0] * (e[0] + 1),
        posY: r[1] * (e[1] + 1)
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
    }, this.draw = new c(this.map, this.canvas), this.options = { ...this.options, ...o };
  }
  /**设置图标解析器 */
  setIconResolver(i) {
    return this.iconResolver = i, this;
  }
  /**设置风速风向数据 */
  setData(i) {
    this._setDatas(i), this.renderFixedData();
  }
  /**获取视图范围内的(指定像素间隔的数据) */
  getViewBoundsGridWind(i, o = 2) {
    var t = [];
    let [a, r] = u(this.map, [0, 0]), n = r % o, e = a % o;
    for (let l = n, g = i.height; l < g; l += o)
      for (let h = e; h <= i.width; h += o) {
        let [m, p] = z(this.map, [h, l]);
        if (isFinite(p)) {
          var s = this.interpolate(p, m);
          s && t.push({ latlng: [m, p], speed: s[0], direction: s[1] });
        }
      }
    return t;
  }
  /**根据风力等级获取图片裁剪地址 x,y */
  renderAnimation() {
  }
  renderFixedData() {
    var i = d(this.map);
    let o = this.getViewBoundsGridWind({ x: 10, y: 10, width: i.w, height: i.h }, 60), t = this.options, a = 1, r = [];
    for (let n = 0; n < o.length; ) {
      const e = o[n];
      n = n + a;
      const s = this.iconResolver(e.speed);
      r.push({
        url: s.url,
        size: s.size || t.size,
        sizeo: s.sizeo,
        posX: s.posX,
        posY: s.posY,
        latlng: e.latlng,
        rotate: e.direction
      });
    }
    this.draw.setAllImgs(r), this.draw.drawMapAll();
  }
}
export {
  R as MapPluginWind
};
