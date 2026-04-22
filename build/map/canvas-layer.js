import { l as i } from "../_virtual/leaflet-src.js";
import { u_tsMapisLeaflet as o, u_tsMapisAmap as h, u_tsMapisMapLibre as n, u_mapGetMapSize as l, u_tsLayerisAmap as d, u_tsLayerisLeaflet as p, u_tsLayerisMapLibre as c } from "../utils/slu-map.js";
class _ {
  constructor(e, t) {
    this.canvas = document.createElement("canvas"), this.ctx = this.canvas.getContext("2d"), this.width = 0, this.height = 0, this.options = {
      pane: "canvas"
    }, this.flagAnimation = 0, this._redraw = () => {
      this.map && (this.resetCanvas(), this.renderFixedData(), this.renderAnimation());
    }, this.map = e, Object.assign(this.options, t), this.initCanvas(), o(e) ? this._initLeaflet() : h(e) ? this._initAMap() : n(e) && this._initMapLibreAsync();
  }
  /**移除图层 */
  onRemove() {
    return this._eventSwitch(!1), this.flagAnimation && cancelAnimationFrame(this.flagAnimation), this._onAmapRemove(), this._onLeafletRemove(), this._onMapLibreRemove(), this;
  }
  /**清空并重新设置画布 */
  resetCanvas() {
    const { canvas: e, map: t } = this;
    if (o(t)) {
      const r = t.containerPointToLayerPoint([0, 0]);
      i.DomUtil.setPosition(e, r);
    }
    const { w: s, h: a } = l(t);
    e.style.width = s + "px", e.style.height = a + "px", this.width = e.width = s, this.height = e.height = a;
  }
  /**添加或关闭地图特定的监听事件(_eventSwitch事件后自动调用)
   * @param map 地图实例
   * @param key 事件类型
   */
  addMapEvents(e, t) {
  }
  /**绘制静态数据推荐使用此方法(固定的图) */
  renderFixedData() {
  }
  /** 推荐使用此方法绘制动态图(跟随鼠标拖动，移动时需要立刻绘制时)
   ** 动画图层绘制前的画布清空、计算等均在此方法中自行计算 
   ** 与renderFixedData本质是一样的
   */
  renderAnimation() {
  }
  /**添加地图事件监听
   * @param key 事件类型
   * @param cb 事件回调函数
   */
  on(e, t) {
    this.map.on(e, (s) => {
      t();
    });
  }
  /**移除地图事件监听
   * @param key 事件类型
   * @param cb 事件回调函数
   */
  off(e, t) {
    this.map.off(e, (s) => {
      t();
    });
  }
  /**初始化canvas */
  initCanvas() {
    const { canvas: e, options: t } = this;
    e.className = `sl-layer ${t.className || "sl-canvas-map"}`, e.style.zIndex = `${t.zIndex || 100}`, e.style.transformOrigin = "50% 50%", this.initLeafletCanvas();
  }
  /**将图层添加到map实例中显示
   * @returns MapCanvasLayer实例
   */
  onAdd() {
    return this._onAmapAdd(), this._onMapLibreAdd(), this._eventSwitch(!0), this;
  }
  /**基础的监听事件   
  * @param flag @default true
  *  true开启重绘事件监听; false关闭重绘事件监听
  **/
  _eventSwitch(e = !0) {
    let t = this.map, s = e ? "on" : "off";
    this.addLeafletEvent(e), this.addMaplibreEvent(e), this.addMapEvents(t, s);
  }
  /**------------------------------高德地图的实现------------------------------*/
  /**初始化高德地图的图层 */
  _initAMap() {
    const e = Object.assign({
      zooms: [3, 18],
      alwaysRender: !1,
      //缩放过程中是否重绘，复杂绘制建议设为false
      zIndex: 200,
      render: () => this._redraw()
    }, this.options);
    this.layer = new AMap.CustomLayer(this.canvas, e), this.onAdd();
  }
  /**将图层添加到map实例中显示 */
  _onAmapAdd() {
    const { map: e, layer: t } = this;
    h(e) && d(t) && (t.setMap(e), t.render = this._redraw);
  }
  /**移除图层 */
  _onAmapRemove() {
    const { map: e, layer: t } = this;
    h(e) && d(t) && e.remove(t);
  }
  /**------------------------------Leaflet地图的实现------------------------------*/
  /**初始化Leaflet地图的图层 */
  _initLeaflet() {
    const e = this.layer = new i.Layer(this.options);
    this.layer.onAdd = () => (this.onAdd(), e), this.onAdd();
  }
  /**初始化画布并添加到Pane中 */
  initLeafletCanvas() {
    const { canvas: e, map: t, options: s } = this;
    if (!o(t)) return;
    let a = s.pane || "overlayPane", r = t.getPane(a) || t.createPane(a);
    r.appendChild(e), r.style.pointerEvents = "none";
    let m = t.options.zoomAnimation && i.Browser.any3d;
    i.DomUtil.addClass(e, "leaflet-zoom-" + (m ? "animated" : "hide")), i.extend(e, {
      onselectstart: i.Util.falseFn,
      onmousemove: i.Util.falseFn,
      onload: i.bind(this._onCanvasLoad, this)
    });
  }
  /**移除图层 */
  _onLeafletRemove() {
    let { map: e, layer: t, options: s } = this;
    if (o(e) && p(t)) {
      let a = s.pane;
      a && e.getPane(a)?.removeChild(this.canvas), t.remove();
    }
  }
  /**添加Leaflet地图事件监听
   *  @param flag @default true
   *  true开启重绘事件监听; false关闭重绘事件监听
   */
  addLeafletEvent(e = !0) {
    const t = this.map;
    if (o(t)) {
      requestAnimationFrame(() => this._reset());
      const s = e ? "on" : "off";
      t[s]("viewreset", this._reset, this), t[s]("resize", this._reset, this), t[s]("moveend", this._reset, this), t.options.zoomAnimation && i.Browser.any3d && t[s]("zoomanim", this._animateZoom, this);
    }
  }
  /**重设画布,并重新渲染*/
  _reset() {
    this.resetCanvas(), this._redraw();
  }
  /**缩放动画
   * @param e 缩放事件对象
   */
  _animateZoom(e) {
    let t = this.map;
    const s = t.getZoomScale(e.zoom), a = t._getCenterOffset(e.center)._multiplyBy(-s).subtract(t._getMapPanePos());
    i.DomUtil.setTransform(this.canvas, a, s);
  }
  /**画布加载完成 */
  _onCanvasLoad() {
    p(this.layer) && this.layer.fire("load");
  }
  /**------------------------------MapLibre地图的实现------------------------------*/
  /**异步初始化MapLibre地图的图层 */
  _initMapLibreAsync() {
    const e = this.map;
    n(e) && (e.loaded?.() || e.isStyleLoaded?.() || !!e.getStyle?.() ? (this._initMapLibre(), this.onAdd()) : e.once("load", () => {
      this._initMapLibre(), this.onAdd();
    }));
  }
  /**添加MapLibre图层到地图上 */
  _initMapLibre() {
    const e = this.map;
    if (n(e)) {
      const t = `slu-canvas-${Math.random().toString(36).slice(2)}`, s = {
        id: t,
        type: "custom",
        renderingMode: "2d",
        onAdd: () => this._onMapLibreAdd(),
        onRemove: () => this._onMapLibreRemove(),
        render: () => {
        }
      };
      e.getLayer(t) || e.addLayer(s), this.layer = s;
    }
  }
  /**将图层添加到容器 */
  _onMapLibreAdd() {
    const e = this.map;
    if (n(e)) {
      const t = e.getCanvasContainer();
      this.canvas.style.position = "absolute", this.canvas.style.top = "0", this.canvas.style.left = "0", this.canvas.style.zIndex = String(this.options.zIndex || 100), t.appendChild(this.canvas);
    }
  }
  /**移除图层 */
  _onMapLibreRemove() {
    n(this.map) && c(this.layer) && (this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas), this.layer?.id && this.map.getLayer(this.layer.id) && this.map.removeLayer(this.layer.id));
  }
  /**添加MapLibre地图事件监听
   *  @param flag @default true
   *  true开启事件监听; false关闭事件监听
   */
  addMaplibreEvent(e = !0) {
    const t = this.map;
    if (n(t)) {
      requestAnimationFrame(() => this._reset());
      const s = e ? "on" : "off";
      t[s]("resize", () => this._reset()), t[s]("move", () => this._reset()), t[s]("zoom", () => this._reset()), t[s]("moveend", () => this._reset());
    }
  }
}
export {
  _ as MapCanvasLayer
};
