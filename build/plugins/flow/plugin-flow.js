import { u_mapGetMapSize as h, u_mapGetBounds as p, u_mapGetMapMouseEvent as d, u_mapGetLatLngByPoint as l } from "../../utils/slu-map.js";
import "../../canvas/slu-canvas.js";
import "../../canvas/slu-canvas-img.js";
import "../../map/canvas-event.js";
import { MapCanvasLayer as c } from "../../map/canvas-layer.js";
import "../../_virtual/leaflet-src.js";
import "../../_virtual/index.js";
import "../../leaflet/slu-leaflet-net-map.js";
import { VelocityWindy as y } from "./velocity-windy.js";
class S extends c {
  constructor(t, i) {
    super(t.map, i), this.options = {
      pane: "overlayPane",
      displayValues: !0,
      unit: "m/s",
      angleConvention: "bearingCCW",
      emptyString: "No velocity data",
      maxVelocity: 15,
      colorScale: null
    }, this.windy = null, Object.assign(this.options, i);
  }
  /**设置配置项 */
  setOptions(t) {
    let i = this.options = Object.assign(this.options, t);
    this.windy && (this.windy.setOptions(i), i.hasOwnProperty("data") && this.windy.setData(i.data));
  }
  /**设置数据并绘制canvas
   * data[0] 为X轴经度longitude方向的数据
   * data[1] 为Y轴纬度latitude方向的数据
   */
  setData(t) {
    if (this.options.data = t, this.windy)
      this.windy.setData(t);
    else {
      if (this.initWindy(), !t || t.length <= 0) {
        this.windy?.stop(), this.resetCanvas();
        return;
      }
      this.startWindy();
    }
  }
  /**添加鼠标点击时的回调函数 */
  addCbMouseClick(t) {
    this.cbClick = t;
  }
  /*------------------------------------ PRIVATE ------------------------------------------*/
  renderFixedData() {
    let t = this.options.data;
    t && t.length > 0 && this.windy && (this.windy.stop(), this.startWindy());
  }
  /**添加或关闭地图特定的监听事件(_eventSwitch事件后自动调用) */
  addMapEvents(t, i) {
    t[i]("zoomstart", this.stopWindy, this), t[i]("dragstart", this.stopWindy, this), t[i]("click", this.onMouseClick, this);
  }
  /**初始化windy对象 */
  initWindy() {
    var t = Object.assign({
      canvas: this.canvas,
      map: this.map
    }, this.options);
    this.windy = new y(t), this.canvas.classList.add("velocity-overlay");
  }
  /**开始动画 */
  startWindy() {
    const t = h(this.map), { lngLeft: i, latTop: e, lngRight: a, latBottom: n } = p(this.map);
    var s = [i, n], o = [a, e];
    this.windy?.start(
      t.w,
      t.h,
      [s, o]
    );
  }
  /**停止动画 */
  stopWindy() {
    this.windy && this.windy.stop();
  }
  /**鼠标点击事件监听 */
  onMouseClick(t) {
    if (!this.windy) return;
    var i = this;
    const { containerPoint: e } = d(t, this.type);
    var [a, n] = l(this.map, [e.x, e.y]), s = this.windy.interpolate(n, a);
    let o = 0, r = 0;
    s && !isNaN(s[0]) && !isNaN(s[1]) && s[2] && (o = i.vectorToDegrees(s[0], s[1], this.options.angleConvention), r = i.vectorToSpeed(s[0], s[1], this.options.unit)), this.cbClick?.(o, r), console.log(o, r);
  }
  vectorToDegrees(t, i, e) {
    e.endsWith("CCW") && (i = i > 0 ? i = -i : Math.abs(i));
    var a = Math.sqrt(Math.pow(t, 2) + Math.pow(i, 2)), n = Math.atan2(t / a, i / a), s = n * 180 / Math.PI + 180;
    return (e === "bearingCW" || e === "meteoCCW") && (s += 180, s >= 360 && (s -= 360)), s;
  }
  /**将m/s 转换为指定单位的速度 */
  vectorToSpeed(t, i, e) {
    var a = Math.sqrt(Math.pow(t, 2) + Math.pow(i, 2));
    switch (e) {
      case "k/h":
        return this.meterSec2kilometerHour(a);
      case "kt":
        return this.meterSec2Knots(a);
      default:
        return a;
    }
  }
  meterSec2Knots(t) {
    return t / 0.514;
  }
  meterSec2kilometerHour(t) {
    return t * 3.6;
  }
}
export {
  S as MapPluginFlow
};
