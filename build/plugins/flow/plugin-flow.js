import { u_mapGetMapSize as h, u_mapGetBounds as p, u_mapGetMapMouseEvent as c, u_mapGetLatLngByPoint as l } from "../../utils/slu-map.js";
import "../../canvas/slu-canvas.js";
import "../../canvas/slu-canvas-img.js";
import "../../canvas/slu-canvas-text.js";
import "../../map/canvas-event.js";
import { MapCanvasLayer as d } from "../../map/canvas-layer.js";
import "../../_virtual/leaflet-src.js";
import "../../_virtual/index.js";
import "../../leaflet/slu-leaflet-net-map.js";
import "../../_virtual/maplibre-gl.js";
import { PluginVelocity as m } from "./plugin-velocity.js";
class L extends d {
  constructor(t, i) {
    super(t.map, i), this.options = {
      pane: "overlayPane",
      displayValues: !0,
      maxVelocity: 15,
      unit: "m/s",
      angleConvention: "bearingCCW",
      emptyString: "No velocity data",
      colorScale: null
    }, this.windy = null, Object.assign(this.options, i);
  }
  /**设置数据并绘制canvas
   * @param datas 数据
   * data[0] 为X轴经度longitude方向的数据
   * data[1] 为Y轴纬度latitude方向的数据
   */
  setData(t) {
    if (this.options.data = t, this.windy && this.windy.stop(), !t || t.length <= 0) {
      this.windy = null, this.resetCanvas();
      return;
    }
    this.windy ? this.windy.setData(t) : this.initWindy(), this.startWindy();
  }
  /**添加鼠标点击时的回调函数
   * @param cb 回调函数
   * @param degrees 方向
   * @param speed 速度
   */
  addCbMouseClick(t) {
    this.cbClick = t;
  }
  /*------------------------------------ PRIVATE ------------------------------------------*/
  /**渲染静态图层 */
  renderFixedData() {
    let t = this.options.data;
    t && t.length > 0 && this.windy && (this.windy.stop(), this.startWindy());
  }
  /**添加或关闭地图特定的监听事件(_eventSwitch事件后自动调用) 
   * @param map 地图实例
   * @param key 事件类型
  */
  addMapEvents(t, i) {
    const e = () => this.stopWindy(), n = (o) => this.onMouseClick(o);
    t[i]("zoomstart", e), t[i]("dragstart", e), t[i]("click", n);
  }
  /**初始化windy对象 */
  initWindy() {
    const t = Object.assign({ canvas: this.canvas, map: this.map }, this.options);
    this.windy = new m(t), this.canvas.classList.add("velocity-overlay");
  }
  /**开始动画 */
  startWindy() {
    const t = h(this.map), { lngLeft: i, latTop: e, lngRight: n, latBottom: o } = p(this.map), s = [i, o], a = [n, e];
    this.windy?.start(t.w, t.h, [s, a]);
  }
  /**停止动画 */
  stopWindy() {
    this.windy && this.windy.stop();
  }
  /**鼠标点击事件监听
   * @param e 鼠标事件
   */
  onMouseClick(t) {
    if (!this.windy) return;
    const i = this, { containerPoint: e } = c(t, this.map), [n, o] = l(this.map, [e.x, e.y]), s = this.windy.interpolate(o, n);
    let a = 0, r = 0;
    s && !isNaN(s[0]) && !isNaN(s[1]) && s[2] && (a = i.vectorToDegrees(s[0], s[1], this.options.angleConvention), r = i.vectorToSpeed(s[0], s[1], this.options.unit)), this.cbClick?.(a, r);
  }
  /**将m/s转换为方向
   * @param uMs X轴速度
   * @param vMs Y轴速度
   * @param angleConvention 角度约定
   * @returns 方向
   */
  vectorToDegrees(t, i, e) {
    e.endsWith("CCW") && (i = i > 0 ? i = -i : Math.abs(i));
    const n = Math.sqrt(Math.pow(t, 2) + Math.pow(i, 2));
    let s = Math.atan2(t / n, i / n) * 180 / Math.PI + 180;
    return (e === "bearingCW" || e === "meteoCCW") && (s += 180, s >= 360 && (s -= 360)), s;
  }
  /**将m/s 转换为指定单位的速度
   * @param uMs X轴速度
   * @param vMs Y轴速度
   * @param unit 单位
   * @returns 速度
   */
  vectorToSpeed(t, i, e) {
    const n = Math.sqrt(Math.pow(t, 2) + Math.pow(i, 2));
    switch (e) {
      case "k/h":
        return this.meterSec2kilometerHour(n);
      case "kt":
        return this.meterSec2Knots(n);
      default:
        return n;
    }
  }
  /**将m/s转换为kn节
   * @param meters m/s
   * @returns knot节/s
   */
  meterSec2Knots(t) {
    return t / 0.514;
  }
  /**将m/s转换为km/h
   * @param meters m/s
   * @returns km/h
   */
  meterSec2kilometerHour(t) {
    return t * 3.6;
  }
}
export {
  L as MapPluginFlow
};
