import { l as n } from "../_virtual/leaflet-src.js";
import { d as g } from "../_virtual/index.js";
import { SLEMap as h, SLULeafletNetMap as b } from "../leaflet/slu-leaflet-net-map.js";
import { u_mapSetFitBounds as C, u_mapGetBounds as w, u_mapSetViewCenter as M } from "../utils/slu-map.js";
class L {
  constructor(e, t = {}) {
    this.curs = /* @__PURE__ */ Object.create(null), this.ele = e;
  }
  get map() {
    return this._map;
  }
  /**初始实例化地图
   * @param options 地图初始化参数
   */
  async init(e = {}) {
    const { type: t } = e, a = this.ele;
    t === "A" ? this._map = await this.initAmap(a, e) : (this._map = await this.initLeaflet(a, e), this.showMap([h.tianDiTuNormalMap, h.tianDiTuNormalAnnotion]));
  }
  /**设置合适的视图范围 */
  setFitView(e) {
    return this._map && C(this._map, e), this;
  }
  /**获取地图边界 */
  getBound() {
    return w(this._map);
  }
  /**
   * 设置地图中心
   * @param center 中心 latlng顺序
   * @param zoom 
   * @param offset 中心 但需要偏移固定像素
   */
  setCenter(e, t, a) {
    M(this._map, e, t, a);
  }
  /**显示指定的网络图层 */
  showMap(e = []) {
    const { map: t, curs: a } = this;
    if (t && t instanceof n.Map) {
      e[0].split(".")[0];
      let r = t.getCenter(), i = t.getZoom();
      t._resetView(r, i, !0), e?.forEach((o) => {
        if (a[o]) return;
        let s = new b(o);
        s.addTo(t), a[o] = s;
      });
      for (const o in a) {
        let s = o;
        e.includes(s) || (a[s].remove(), Reflect.deleteProperty(a, o));
      }
    }
    return this;
  }
  /**---------------leaflet地图的相关方法------------------- */
  initLeaflet(e, t) {
    const { zoom: a = 11, minZoom: r = 2, maxZoom: i = 20, center: [o, s] = [22.68471, 114.12027], dragging: l = !0, zoomControl: c = !1, attributionControl: u = !1, doubleClickZoom: p = !1, closePopupOnClick: f = !1 } = t;
    let m = {
      dragging: l,
      zoomControl: c,
      zoom: a,
      minZoom: r,
      maxZoom: i,
      center: n.latLng(o, s),
      attributionControl: u,
      doubleClickZoom: p,
      crs: n.CRS.EPSG3857,
      closePopupOnClick: f
      //点击地图不关闭弹出层
    }, d = new n.Map(e, m);
    return Promise.resolve(d);
  }
  /**---------------高德地图的相关方法------------------- */
  async initAmap(e, t) {
    const { zoom: a = 11, minZoom: r = 2, maxZoom: i = 20, center: [o, s] = [22.68471, 114.12027], dragging: l = !0, zoomControl: c = !1, attributionControl: u = !1, doubleClickZoom: p = !1, closePopupOnClick: f = !1, showLabel: m = !0 } = t;
    return g.load({
      key: "87e1b1e9aa88724f69208972546fdd57",
      // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "1.4.15",
      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ["Map3D"]
      //插件列表
    }).then(() => new AMap.Map(e, {
      // mask: mask,
      center: [s, o],
      disableSocket: !0,
      viewMode: "2D",
      mapStyle: "amap://styles/dfd45346264e1fa2bb3b796f36cab42a",
      skyColor: "#A3CCFF",
      lang: "zh_cn",
      //设置地图语言类型
      labelzIndex: 130,
      pitch: 40,
      zoom: a,
      zooms: [r, i],
      dragEnable: l,
      doubleClickZoom: p,
      keyboardEnable: !1,
      isHotspot: !1,
      showLabel: m,
      layers: []
    }));
  }
}
export {
  L as SLUMap
};
