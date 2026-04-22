import { l as f } from "../_virtual/leaflet-src.js";
import { d as b } from "../_virtual/index.js";
import { MapNameType as d, SLULeafletNetMap as L } from "../leaflet/slu-leaflet-net-map.js";
import { u_mapGetLatLngByEvent as y, u_mapGetLatlngByValue as c, u_mapSetFitBounds as M, u_mapSetViewCenter as C, u_mapGetBounds as S, u_mapGetMapSize as w, u_tsMapisLeaflet as _, u_tsIsKeyOf as Z, u_tsMapisMapLibre as I, u_mapGetPointByLatlng as v, u_mapGetLatLngByPoint as z, u_mapGetDistance as k } from "../utils/slu-map.js";
import { m as x } from "../_virtual/maplibre-gl.js";
class D {
  constructor(t) {
    this.controlInfo = /* @__PURE__ */ Object.create({}), this.ifDMS = !0, this.curs = /* @__PURE__ */ Object.create(null), this.setLatlng = (e) => {
      const [a, s] = y(e);
      !a || !s || (this.latLng.lat = a, this.latLng.lng = s, this.controlInfo.lat = c(a, !1, this.ifDMS), this.controlInfo.lng = c(s, !0, this.ifDMS), this.controlCb && this.controlCb(this.controlInfo));
    }, this.ele = t;
  }
  /**地图实例 */
  get map() {
    return this._map;
  }
  /**初始实例化地图
   * @param options @default {} 地图初始化参数
   */
  async init(t = {}) {
    const { type: e } = t, a = this.ele;
    switch (e) {
      case "A":
        this._map = await this.initAmap(a, t);
        break;
      case "M":
        this._map = await this.initMaplibre(a, t);
        break;
      default:
        this._map = await this.initLeaflet(a, t), this.showMap([d.tianDiTuNormalMap, d.tianDiTuNormalAnnotion]);
        break;
    }
  }
  /**设置合适的视图范围
   * @param latlngs 纬度经度数组
   * @returns SLUMap实例
   */
  setFitView(t) {
    return this._map && M(this._map, t), this;
  }
  /**
   * 设置地图中心
   * @param center 中心 latlng顺序
   * @param zoom 缩放级别
   * @param offset 中心 但需要偏移固定像素
   */
  setCenter(t, e, a) {
    C(this._map, t, e, a);
  }
  /**获取地图边界
   * @returns 地图边界信息
   */
  getBound() {
    return S(this._map);
  }
  /**获取地图中心
   * @returns 地图中心
   */
  getCenter() {
    return this.map.getCenter();
  }
  /**获取地图缩放级别
   * @returns 地图缩放级别
   */
  getZoom() {
    return this.map.getZoom();
  }
  /**获取地图大小
   * @returns 地图大小{ w: number; h: number }
   */
  getSize() {
    return w(this._map);
  }
  /**显示指定的网络图层
   * @param names @default [] 网络图层名称数组
   * @returns SLUMap实例
   */
  showMap(t = []) {
    const { map: e, curs: a } = this;
    if (e && _(e)) {
      t[0].split(".")[0];
      let s = e.getCenter(), i = e.getZoom();
      e.setView(s, i, { animate: !1 }), t?.forEach((n) => {
        if (a[n]) return;
        let o = new L(n);
        o.addTo(e), a[n] = o;
      });
      for (const n of Object.keys(a)) {
        if (!Z(a, n)) continue;
        let o = n;
        t.includes(o) || (a[o].remove(), Reflect.deleteProperty(a, n));
      }
    }
    return this;
  }
  /**打开地图控件
   * @param ifDMS @default true 是否使用度分秒格式，否则显示度格式，默认精度为5
   * @returns 地图控件信息
   */
  openControl(t = !0) {
    this.eventSwitch(!0);
    const e = this.latLng = this.getCenter();
    return this.ifDMS = t, this.controlInfo.lat = c(e.lat, !1, t), this.controlInfo.lng = c(e.lng, !0, t), this.setZoomAndScale(), this.controlInfo;
  }
  /**关闭地图控件 */
  closeControl() {
    this.eventSwitch(!1);
  }
  /**地图控件更新时触发
   * @param cb 回调函数
   */
  onControlUpdate(t) {
    this.controlCb = t;
  }
  /**切换控件经纬度格式
   * @param ifDMS 是否使用度分秒格式，否则显示度格式，默认精度为5
   * @returns 地图控件信息
   */
  changeLatlngFormat(t) {
    this.ifDMS = t;
    const { lat: e, lng: a } = this.latLng;
    return this.controlInfo.lat = c(e, !1, t), this.controlInfo.lng = c(a, !0, t), this.setZoomAndScale(), this.controlInfo;
  }
  /**---------------leaflet地图的相关方法------------------- */
  /**初始化leaflet地图
   * @param ele 地图容器元素
   * @param opt 地图初始化参数
   * @returns LMap实例
   */
  initLeaflet(t, e) {
    const { zoom: a = 11, minZoom: s = 2, maxZoom: i = 20, center: [n, o] = [22.68471, 114.12027], dragging: l = !0, zoomControl: r = !1, attributionControl: m = !1, doubleClickZoom: h = !1, closePopupOnClick: u = !1 } = e;
    let p = {
      dragging: l,
      zoomControl: r,
      zoom: a,
      minZoom: s,
      maxZoom: i,
      center: f.latLng(n, o),
      attributionControl: m,
      doubleClickZoom: h,
      crs: f.CRS.EPSG3857,
      closePopupOnClick: u
      //点击地图不关闭弹出层
    }, g = new f.Map(t, p);
    return Promise.resolve(g);
  }
  /**---------------maplibre地图的相关方法------------------- */
  /**初始化maplibre地图
   * @param ele 地图容器元素
   * @param opt 地图初始化参数
   * @returns maplibregl.Map实例
   */
  async initMaplibre(t, e) {
    const { style: a, zoom: s = 11, minZoom: i = 2, maxZoom: n = 20, center: o = [114.12027, 22.68471], dragging: l = !0, attributionControl: r = !1, doubleClickZoom: m = !1 } = e;
    let h = new x.Map({
      container: t,
      style: a,
      center: o,
      zoom: s,
      minZoom: i,
      maxZoom: n,
      antialias: !0,
      dragRotate: l,
      touchZoomRotate: !1,
      doubleClickZoom: m,
      attributionControl: r ? void 0 : !1
    });
    return Promise.resolve(h);
  }
  /**切换中英文
   * @param ifEn 是否切换英文
   */
  changeLanguage(t) {
    const e = this.map;
    if (I(e)) {
      const a = e.getStyle().layers || [], s = t ? "en" : "zh-Hans";
      a.forEach((i) => {
        if (i.type === "symbol" && i.layout && "text-field" in i.layout)
          try {
            e.setLayoutProperty(i.id, "text-field", ["get", `name:${s}`]);
          } catch {
          }
      });
    }
  }
  /**---------------高德地图的相关方法------------------- */
  /**初始化高德地图
   * @param ele 地图容器元素
   * @param opt 地图初始化参数
   * @returns AMap实例
   */
  async initAmap(t, e) {
    const { zoom: a = 11, minZoom: s = 2, maxZoom: i = 20, center: [n, o] = [22.68471, 114.12027], dragging: l = !0, zoomControl: r = !1, attributionControl: m = !1, doubleClickZoom: h = !1, closePopupOnClick: u = !1, showLabel: p = !0 } = e;
    return b.load({
      key: "87e1b1e9aa88724f69208972546fdd57",
      // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "1.4.15",
      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ["Map3D"]
      //插件列表
    }).then(() => new AMap.Map(t, {
      // mask: mask,
      center: [o, n],
      disableSocket: !0,
      viewMode: "2D",
      mapStyle: "amap://styles/dfd45346264e1fa2bb3b796f36cab42a",
      skyColor: "#A3CCFF",
      lang: "zh_cn",
      //设置地图语言类型
      labelzIndex: 130,
      pitch: 40,
      zoom: a,
      zooms: [s, i],
      dragEnable: l,
      doubleClickZoom: h,
      keyboardEnable: !1,
      isHotspot: !1,
      showLabel: p,
      layers: []
    }));
  }
  /**--------------地图控件的相关方法------------------- */
  /**监听事件开关
   * @param flag 开启或关闭事件
   */
  eventSwitch(t) {
    let e = t ? "on" : "off";
    t && this.eventSwitch(!1), this.map[e]("mousemove", (a) => this.setLatlng(a)), this.map[e]("zoomend", () => this.setZoomAndScale()), this.map[e]("moveend", () => this.setScale());
  }
  /**设置地图层级和比例尺 */
  setZoomAndScale() {
    if (!this.map) return;
    let t = this.getZoom();
    t = Number.isInteger(t) ? t : Number(t.toFixed(2)), this.controlInfo.zoom = t, this.setScale();
  }
  /**设置地图比例尺 */
  setScale() {
    if (!this.map) return;
    const { lat: t, lng: e } = this.getCenter(), [a, s] = v(this.map, [t, e]), i = [a + 50, s], n = z(this.map, i);
    let o = k([t, e], n, this.map), l = "";
    o > 2e3 ? (o = o / 1852, l = "nm") : l = "m";
    const r = this.getScaleNum(o);
    this.controlInfo.width = Math.round(50 * r / o) + "px", this.controlInfo.scale = Math.round(r) + l, this.controlCb && this.controlCb(this.controlInfo);
  }
  /**取整比例尺
   * @param num 距离（米）
   * @returns 取整后的比例尺（米）
   */
  getScaleNum(t) {
    if (t < 1) return 1;
    if (t <= 10) return Math.ceil(t / 2) * 2;
    const e = Math.pow(10, Math.floor(Math.log10(t)));
    let a = t / e;
    return a <= 2 ? Math.ceil(a * 2) / 2 * e : a <= 5 ? Math.ceil(a) * e : Math.ceil(a / 5) * 5 * e;
  }
}
export {
  D as SLUMap
};
