import { MapPluginDraw as u } from "./plugin-draw.js";
import "../_virtual/leaflet-src.js";
import "../canvas/slu-canvas.js";
import "../canvas/slu-canvas-img.js";
import { MapCanvasEvent as D } from "../map/canvas-event.js";
import "../_virtual/index.js";
import "../leaflet/slu-leaflet-net-map.js";
class P {
  /**轨迹绘制类 */
  constructor(t, e) {
    this.options = {
      pane: "canvas",
      ifLine: !0,
      ifArc: !0,
      arcInterval: 1,
      className: "track",
      zIndex: 100,
      sizeArc: 3,
      colorArc: "#FFFFFF",
      colorArcFill: "#D9AF3B",
      widthLine: 1,
      colorLine: "#525b65",
      textEnd: "终点",
      textStart: "起点",
      colorTextEnd: "#D85151",
      colorTextStart: "#8D4CC3",
      colorArcStart: "#8D4CC3",
      colorArcEnd: "#D85151"
    }, this.allTracks = [], this.earlyTime = 0, this.intervalTime = 20, this.time = 0, this.cbs = /* @__PURE__ */ Object.create(null);
    const r = t.map;
    this.map = r, Object.assign(this.options, e);
    let i = this.options.zIndex + 1;
    this.layerDraw = new u(t, this.options), this.layerAniDraw = new u(t, Object.assign({}, this.options, { zIndex: i, className: "track ani" })), this.allEvents = new D(r);
  }
  /**zoom变化 重设arc数据 */
  onRemove() {
    this.layerDraw.onRemove(), this.layerAniDraw.onRemove();
  }
  /**设置添加轨迹数据(并重新绘制) */
  setTracks(t) {
    const e = this, { allTracks: r } = e;
    t.forEach((i) => {
      const a = r.find((s) => s.id === i.id);
      a ? a.data.push(...i.data) : r.push(i);
    }), e.earlyTime = 1 / 0, r.forEach((i) => {
      const a = i.data, s = a.length, n = a[s - 1];
      n && (e.earlyTime = Math.min(e.earlyTime, n.timeStamp));
    }), this.setAniImage([]);
  }
  /**获取指定时间各轨迹点的位置信息集合 */
  getInfosByTime(t) {
    const e = this, { allTracks: r } = e, i = [];
    return e.time = t.getTime() / 1e3, this.getNextTrack(), r.forEach((a) => {
      const s = a.data;
      let n = this.getInfoByTime(e.time, s), l = Object.assign({}, { orginData: a.orginData }, n);
      i.push(l);
    }), this._drawTracks(), i;
  }
  /**获取下一时间段的数据 */
  getNextTrack() {
    let { earlyTime: t, intervalTime: e, time: r } = this;
    !t || r - t < e || (this.earlyTime = 0, console.log("获取下一段数据"), this.trigger("next"));
  }
  /**设置轨迹上的动点船 */
  setAniImage(t, e = []) {
    const { layerAniDraw: r } = this;
    r.resetCanvas(), r.setAllImgs(t), r.setAllTexts(e), r.drawMapAll();
  }
  /**添加点击圆点时的监听函数 */
  addCbClickPoint(t) {
    return this.cbClickPoint = t, this._drawTracks(), this;
  }
  /**设置轨迹的显示和隐藏 */
  setOpt(t) {
    Object.assign(this.options, t), this._drawTracks();
  }
  /**绘制轨迹数据 */
  _drawTracks() {
    const t = this, { layerDraw: e, layerAniDraw: r, allEvents: i, allTracks: a, options: s, time: n } = t, { ifArc: l, ifLine: c } = s;
    if (e.resetCanvas(), e.setAllLines([]), e.setAllArcs([]), e.setAllTexts([]), i.clearEventsByKey("track"), !c) {
      e.drawMapAll();
      return;
    }
    let m = [];
    for (const o in a)
      if (Object.prototype.hasOwnProperty.call(a, o)) {
        const h = a[o];
        t.drawHistoryTrack(h), t.addPointEvent(h, m);
      }
    i.setEventsByKey(m, "track"), e.drawMapAll();
  }
  /**单条轨迹绘制 （并给点添加事件）*/
  drawHistoryTrack(t) {
    this.drawLine(t), this.drawArc(t), this.drawStartEnd(t);
  }
  /**绘制轨迹线 */
  drawLine(t) {
    let { widthLine: e, colorLine: r } = this.options, { data: i } = t, a = this.time, s = [];
    for (let l = 0; l < i.length; l++) {
      let c = i[l];
      if (s.push([c.lat, c.lng]), c.timeStamp > a && l > 1) break;
    }
    let n = {
      latlngs: s,
      widthLine: e,
      colorLine: r,
      minZoom: 10
    };
    this.layerDraw.addLine(n);
  }
  /**绘制轨迹点 */
  drawArc(t) {
    let { sizeArc: e, colorArcFill: r, colorArc: i, arcInterval: a = 0, ifArc: s } = this.options, { data: n } = t;
    if (!s) return;
    let l = 0, c = n.map((o, h) => {
      if (a < 1e3 && h % (a + 1) === 0) return [o.lat, o.lng];
      if (a >= 1e3 && (o.timeStamp - l) / a > 1)
        return l = o.timeStamp, [o.lat, o.lng];
    }).filter((o) => o), m = Object.assign(
      {},
      {
        size: e,
        colorFill: r,
        latlngs: c,
        colorLine: i,
        minZoom: 10
      }
    );
    this.layerDraw.addArc(m);
  }
  /**实现移除数组第一个和最后一个元素得到新的数组 */
  removeFirstLast(t) {
    let e = t.length;
    return e <= 2 ? [] : t.slice(1, e - 1);
  }
  /**绘制轨迹起点终点 */
  drawStartEnd(t) {
  }
  /**添加轨迹点事件*/
  addPointEvent(t, e) {
    if (!this.cbClickPoint) return;
    let r = t.data.map((i) => [i.lat, i.lng]);
    e.push({
      type: ["click"],
      latlng: [90, 180],
      minZoom: 10,
      latlngs: r,
      info: t,
      range: [3, 3],
      cb: (i) => {
        this.cbClickPoint && this.cbClickPoint(i);
      }
    });
  }
  /**获得指定时间的位置信息 */
  getInfoByTime(t, e) {
    let r = e.length, i = e[0], a = e[r - 1];
    if (t <= i.timeStamp)
      i = i, a = e[1] || i;
    else if (t >= a.timeStamp)
      a = a, i = e[r - 2] || a;
    else
      for (let s = 0; s < r; s++) {
        i = e[s], a = e[s + 1];
        let n = i.timeStamp, l = a.timeStamp;
        if (n <= t && l >= t)
          break;
      }
    return this.computeDate(i, a, t);
  }
  /**计算位置信息 */
  computeDate(t, e, r) {
    let { lat: i, lng: a, timeStamp: s, course: n, speed: l } = t, { lat: c, lng: m, timeStamp: o } = e;
    if (t == e)
      return { lat: i, lng: a, SPEED: l, time: new Date(r * 1e3), rotate: n, speed: 0 };
    let h = 90 - Math.atan2(c - i, m - a) * 180 / Math.PI, d = s, g = o, p = (r - d) / (g - d);
    p = p > 1 ? 1 : p < 0 ? 0 : p;
    let w = c - i, T = m - a, A = i + w * p, f = a + T * p, y = Math.sqrt(w / (g - d) * w / (g - d) + T / (g - d) * T / (g - d));
    return { lat: A, lng: f, time: new Date(r * 1e3), rotate: h, speed: y, SPEED: l };
  }
  /**移除所有的监听函数 */
  clearCb() {
    this.cbClickPoint = void 0;
  }
  /** */
  on(t, e) {
    this.cbs[t] = e;
  }
  /** */
  trigger(t) {
    this.cbs[t] && this.cbs[t]();
  }
}
export {
  P as MapPluginTrack
};
