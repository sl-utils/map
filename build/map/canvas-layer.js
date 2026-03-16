import { l as s } from "../_virtual/leaflet-src.js";
import { u_mapGetMapSize as h } from "../utils/slu-map.js";
class d {
  constructor(e, t) {
    if (this.canvas = document.createElement("canvas"), this.ctx = this.canvas.getContext("2d"), this.width = 0, this.height = 0, this.options = {
      pane: "canvas"
    }, this.flagAnimation = 0, this._redraw = () => {
      console.log("##########--------MapCanvasLayer=>_redraw--------##########"), this.map && (this.resetCanvas(), this.renderFixedData(), this.renderAnimation());
    }, this.map = e, Object.assign(this.options, t), e instanceof s.Map) {
      this.type = 0;
      let a = this.layer = new s.Layer(this.options);
      this.layer.onAdd = () => (this.onAdd(), a);
    } else e instanceof AMap.Map && (this.type = 1, t = Object.assign({
      zooms: [3, 18],
      alwaysRender: !1,
      //缩放过程中是否重绘，复杂绘制建议设为false
      zIndex: 200
    }, t), this.layer = new AMap.CustomLayer(this.canvas, t));
    this.initCanvas(), this.onAdd();
  }
  /**移除图层 */
  onRemove() {
    const { flagAnimation: e } = this;
    return this._eventSwitch(!1), e && cancelAnimationFrame(e), this._onAmapRemove(), this._onLeafletRemove(), this;
  }
  /** 清空并重新设置画布 */
  resetCanvas() {
    const { canvas: e, map: t } = this;
    if (t instanceof s.Map) {
      var a = t.containerPointToLayerPoint([0, 0]);
      s.DomUtil.setPosition(e, a);
    }
    const { w: i, h: n } = h(t);
    e.style.width = i + "px", e.style.height = n + "px", this.width = e.width = i, this.height = e.height = n;
  }
  /**添加或关闭地图特定的监听事件(_eventSwitch事件后自动调用) */
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
  /** */
  on(e, t) {
    this.map.on(e, (a) => {
      t();
    });
  }
  /** */
  off(e, t) {
    this.map.off(e, (a) => {
      t();
    });
  }
  /**初始化canvas */
  initCanvas() {
    const { canvas: e, map: t, type: a, options: i, layer: n } = this;
    e.className = `sl-layer ${i.className || "sl-canvas-map"}`, e.style.zIndex = `${i.zIndex || 100}`, e.style.transformOrigin = "50% 50%", this.initLeafletCanvas();
  }
  /** 将图层添加到map实例中显示 */
  onAdd() {
    this._onAmapAdd(), this._eventSwitch(!0);
    let e = this.layer;
    return e.render = this._redraw, this;
  }
  /**基础的监听事件   
  * @param flag true开启重绘事件监听 false 关闭重绘事件监听
  **/
  _eventSwitch(e = !0) {
    let t = this.map, a = e ? "on" : "off";
    this.addLeafletEvent(e), this.addMapEvents(t, a);
  }
  /**------------------------------高德地图的实现------------------------------*/
  _onAmapAdd() {
    const { map: e, layer: t, type: a } = this;
    a === 1 && t.setMap(e);
  }
  _onAmapRemove() {
    const { map: e, layer: t, type: a } = this;
    a === 1 && e.remove(t);
  }
  /**------------------------------Leaflet地图的实现------------------------------*/
  /**初始化画布并添加到Pane中 */
  initLeafletCanvas() {
    const { canvas: e, map: t, type: a, options: i } = this;
    if (a || !(t instanceof s.Map)) return;
    let n = i.pane || "overlayPane", o = t.getPane(n) || t.createPane(n);
    o.appendChild(e), o.style.pointerEvents = "none";
    let r = t.options.zoomAnimation && s.Browser.any3d;
    s.DomUtil.addClass(e, "leaflet-zoom-" + (r ? "animated" : "hide")), s.extend(e, {
      onselectstart: s.Util.falseFn,
      onmousemove: s.Util.falseFn,
      onload: s.bind(this._onCanvasLoad, this)
    });
  }
  /**移除 */
  _onLeafletRemove() {
    let { map: e, layer: t, options: a, type: i } = this;
    if (i == 0) {
      let n = a.pane;
      n && e.getPane(n)?.removeChild(this.canvas), t.remove();
    }
  }
  addLeafletEvent(e = !0) {
    let t = this.map;
    if (t instanceof s.Map) {
      requestAnimationFrame(() => this._reset());
      let a = e ? "on" : "off";
      t[a]("viewreset", this._reset, this), t[a]("resize", this._reset, this), t[a]("moveend", this._reset, this), t.options.zoomAnimation && s.Browser.any3d && t[a]("zoomanim", this._animateZoom, this);
    }
  }
  /**重设画布,并重新渲染*/
  _reset() {
    this.resetCanvas(), this._redraw();
  }
  /**缩放动画 */
  _animateZoom(e) {
    let t = this.map;
    var a = t.getZoomScale(e.zoom), i = t._getCenterOffset(e.center)._multiplyBy(-a).subtract(t._getMapPanePos());
    s.DomUtil.setTransform(this.canvas, i, a);
  }
  _onCanvasLoad() {
    this.layer instanceof s.Layer && this.layer.fire("load");
  }
}
export {
  d as MapCanvasLayer
};
