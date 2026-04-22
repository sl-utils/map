import { MapPluginDraw as f } from "./plugin-draw.js";
import "../_virtual/leaflet-src.js";
import "../_virtual/maplibre-gl.js";
import "../canvas/slu-canvas.js";
import "../canvas/slu-canvas-img.js";
import "../canvas/slu-canvas-text.js";
import { MapCanvasEvent as D } from "../map/canvas-event.js";
import "../_virtual/index.js";
import "../leaflet/slu-leaflet-net-map.js";
class M {
  constructor(t, e) {
    this.options = {
      pane: "canvas",
      className: "track",
      zIndex: 100,
      ifArc: !0,
      arcInterval: 1,
      sizeArc: 3,
      colorArc: "#FFFFFF",
      colorArcFill: "#D9AF3B",
      widthLine: 1,
      colorLine: "#525b65",
      textStart: "起点",
      textEnd: "终点",
      colorTextStart: "#8D4CC3",
      colorTextEnd: "#D85151",
      colorArcStart: "#8D4CC3",
      colorArcEnd: "#D85151"
    }, this.allTracks = [], this.earlyTime = 0, this.intervalTime = 20, this.time = 0, this.ifShow = !1, this.cbs = /* @__PURE__ */ Object.create(null);
    const r = t.map;
    this.map = r, Object.assign(this.options, e);
    let i = this.options.zIndex + 1;
    this.layerDraw = new f(t, this.options), this.layerAniDraw = new f(t, Object.assign({}, this.options, { zIndex: i, className: "track ani" })), this.allEvents = new D(r);
  }
  /**zoom变化 重设arc数据 */
  onRemove() {
    this.layerDraw.onRemove(), this.layerAniDraw.onRemove();
  }
  /**设置添加轨迹数据(并重新绘制)
   * @param tracks 轨迹数据
   */
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
  /**获取指定时间各轨迹点的位置信息集合
   * @param time 时间点
   * @returns 指定时间各轨迹点的位置信息集合
   */
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
    !t || r - t < e || (this.earlyTime = 0, this.trigger("next"));
  }
  /**设置轨迹上的动点船
   * @param imgs 图片数据
   * @param texts @default [] 文本数据
   */
  setAniImage(t, e = []) {
    const { layerAniDraw: r } = this;
    r.resetCanvas(), r.setAllImgs(t), r.setAllTexts(e), r.drawMapAll();
  }
  /**添加点击圆点时的监听函数
   * @param cb 点击事件回调 
   * @returns MapPluginTrack实例
   */
  addCbClickPoint(t) {
    return this.cbClickPoint = t, this._drawTracks(), this;
  }
  /**设置轨迹的显示和隐藏
   * @param ifShow 是否显示轨迹
   */
  setIfShow(t) {
    this.ifShow = t, this._drawTracks();
  }
  /**绘制轨迹数据 */
  _drawTracks() {
    const t = this, { layerDraw: e, layerAniDraw: r, allEvents: i, allTracks: a, options: s, time: n } = t, { ifArc: l } = s;
    if (e.resetCanvas(), e.setAllLines([]), e.setAllArcs([]), e.setAllTexts([]), i.clearEventsByKey("track"), !this.ifShow) {
      e.drawMapAll();
      return;
    }
    let m = [];
    for (const c in a)
      if (Object.prototype.hasOwnProperty.call(a, c)) {
        const o = a[c];
        t.drawHistoryTrack(o), t.addPointEvent(o, m);
      }
    i.setEventsByKey(m, "track"), e.drawMapAll();
  }
  /**单条轨迹绘制 （并给点添加事件）
   * @param track 轨迹数据
  */
  drawHistoryTrack(t) {
    this.drawLine(t), this.drawArc(t), this.drawStartEnd(t);
  }
  /**绘制轨迹线
   * @param track 轨迹数据
   */
  drawLine(t) {
    let { widthLine: e, colorLine: r } = this.options, { data: i } = t, a = this.time, s = [];
    for (let l = 0, m = i.length; l < m; l++) {
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
  /**绘制轨迹点
   * @param track 轨迹数据
   */
  drawArc(t) {
    let { sizeArc: e, colorArcFill: r, colorArc: i, arcInterval: a = 0, ifArc: s } = this.options, { data: n } = t;
    if (!s) return;
    let l = 0, m = n.map((o, g) => {
      if (a < 1e3 && g % (a + 1) === 0) return [o.lat, o.lng];
      if (a >= 1e3 && (o.timeStamp - l) / a > 1)
        return l = o.timeStamp, [o.lat, o.lng];
    }).filter((o) => o !== void 0), c = Object.assign(
      {},
      {
        size: e,
        colorFill: r,
        latlngs: m,
        colorLine: i,
        minZoom: 10
      }
    );
    this.layerDraw.addArc(c);
  }
  /**绘制轨迹起点终点
   * @param track 轨迹数据
   */
  drawStartEnd(t) {
  }
  /**添加轨迹点事件
   * @param track 轨迹数据
   * @param eves 事件数组
  */
  addPointEvent(t, e) {
    if (!this.cbClickPoint) return;
    let r = t.data.map((i) => [i.lat, i.lng]);
    e.push({
      type: ["click"],
      minZoom: 10,
      latlngs: r,
      info: t,
      range: [3, 3],
      cb: (i) => {
        this.cbClickPoint && this.cbClickPoint(i);
      }
    });
  }
  /**获得指定时间的位置信息
   * @param epoch 时间戳
   * @param infos 轨迹数据数组
   * @returns 位置信息
  */
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
  /**计算位置信息
   * @param sData 起点轨迹数据
   * @param eData 终点轨迹数据
   * @param time 时间戳
   * @returns 位置信息
   */
  computeDate(t, e, r) {
    let { lat: i, lng: a, timeStamp: s, course: n, speed: l } = t, { lat: m, lng: c, timeStamp: o } = e;
    if (t == e)
      return { lat: i, lng: a, SPEED: l, time: new Date(r * 1e3), rotate: n, speed: 0 };
    let g = 90 - Math.atan2(m - i, c - a) * 180 / Math.PI, h = s, p = o, d = (r - h) / (p - h);
    d = d > 1 ? 1 : d < 0 ? 0 : d;
    let w = m - i, T = c - a, A = i + w * d, u = a + T * d, y = Math.sqrt(w / (p - h) * w / (p - h) + T / (p - h) * T / (p - h));
    return { lat: A, lng: u, time: new Date(r * 1e3), rotate: g, speed: y, SPEED: l };
  }
  /**移除所有的监听函数 */
  clearCb() {
    this.cbClickPoint = void 0;
  }
  /**添加监听函数
   * @param key 事件键
   * @param cb 监听函数
  */
  on(t, e) {
    this.cbs[t] = e;
  }
  /**触发监听函数
   * @param key 事件键
  */
  trigger(t) {
    this.cbs[t] && this.cbs[t]();
  }
}
export {
  M as MapPluginTrack
};
