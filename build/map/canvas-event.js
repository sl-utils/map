import { u_arrItemDel as y, u_mapGetPointByLatlng as d } from "../utils/slu-map.js";
import w from "../node_modules/rbush/index.js";
const r = class r {
  /**地图事件控制类 */
  constructor(t) {
    this.rbush = new w(), this._listenCbs = /* @__PURE__ */ Object.create(null), this._allMapEvents = /* @__PURE__ */ new Map(), this._allRbush = [], this.perEvents = [], this.cbMapEvent = (e) => {
      let { cb: s, cbs: i } = e.event;
      if (s) {
        s(e);
        return;
      }
      if (i) {
        i[e.type]?.(e);
        return;
      }
      (this._listenCbs[e.type] || []).map((l) => l(e));
    }, this.resetRbush = () => {
      this.rbush && this.rbush.clear(), this._eventSwitch(!1), this._allRbush = [], this._allMapEvents.forEach((e) => {
        e.forEach((s) => {
          this.transformRbush(s);
        });
      }), this.rbush.load(this._allRbush), this._eventSwitch(!0);
    }, this.triggerEvent = (e) => {
      let s = [];
      this._allMapEvents.forEach((a) => {
        s = s.concat(a);
      });
      let i = document.querySelector("#map").style;
      if (i.cursor = r.ifInitCursor ? "default" : i.cursor, s.length === 0) return;
      let { curEvents: n, enterEvents: l, leaveEvents: o } = this.getEventsByRange(e);
      l.forEach((a) => this.doCbByEventType(a, "mouseenter")), o.forEach((a) => this.doCbByEventType(a, "mouseleave")), this.perEvents = n, n.length != 0 && (r.ifInitCursor = !1, i.cursor = "pointer", n.forEach((a) => this.doCbByEventType(a, e.type)));
    }, this.map = t, this._eventSwitch(!0), this.map.on("moveend", this.resetRbush), this.map.on("zoomend", this.resetRbush);
  }
  /**地图销毁必须调用此方法，否则事件指针会异常 */
  static destory() {
    r.ifInit = !0;
  }
  static initCursor() {
    r.ifInitCursor = !0;
  }
  /** 事件开关 
   * @param flag true开启地图事件监听 false关闭地图事件监听
  */
  _eventSwitch(t) {
    r.ifInit && (r.ifInit = !1, this.map.on("mousemove", () => {
      r.ifInitCursor = !0;
    })), ["click", "dblclick", "mousemove", "mousedown", "mouseup", "rightclick"].map((s) => {
      this.map[t ? "on" : "off"](s, this.triggerEvent);
    });
  }
  /**统一监听该类的指定事件 */
  on(t, e) {
    (this._listenCbs[t] = this._listenCbs[t] || []).push(e);
  }
  /**统一关闭指定事件的监听 */
  off(t, e) {
    let s = this._listenCbs[t] = this._listenCbs[t] || [];
    e ? y(s, e) : this._listenCbs[t] = [];
  }
  /**清空之前设置的统一监听事件 */
  clear() {
    this._listenCbs = /* @__PURE__ */ Object.create(null);
  }
  /** 
   * @param evs 事件集合
   * @param key 事件key
   * 设置key 事件 会覆盖原来的事件 
   * 不覆盖使用 pushEventByKey
   *  */
  setEventsByKey(t, e) {
    this._allMapEvents.set(e, t.filter((s) => !s.ifHide)), this._allRbush = [], this.rbush.clear(), this._allMapEvents.forEach((s) => {
      s.forEach((i) => this.handleTransform(i));
    }), this.rbush.load(this._allRbush);
  }
  /**
   * 清除所有事件
   */
  clearAllEvents() {
    this._allMapEvents = /* @__PURE__ */ new Map(), this._allRbush = [], this.rbush.clear();
  }
  /**
   * 清除指定类型事件
   * @param key
   */
  clearEventsByKey(t) {
    this.setEventsByKey([], t);
  }
  /**
   * 添加一个事件
   * 尽量使用setEventsByKey 
   * 或者pushEventByKey数组 而不是for 一个个push
   * 不然每次for循环push都会重新构造rbush
   *  */
  pushEventByKey(t, e) {
    this._allMapEvents.has(t) || this._allMapEvents.set(t, []);
    const s = this._allMapEvents.get(t);
    Array.isArray(e) ? s.push(...e) : s.push(e), this.setEventsByKey(s, t);
  }
  /** 添加事件 */
  handleTransform(t) {
    this.transformEvent(t), this.transformRbush(t);
  }
  /** 转换添加事件 */
  transformEvent(t) {
    t.ifHide !== !0 && (t.latlng, t.latlngs, t.type, t.info, t.cb);
  }
  /** 转为Rbush数据格式 */
  transformRbush(t) {
    if (t.ifHide === !0) return;
    let { range: e = [5, 5], latlng: s, latlngs: i = [], left: n = 0, top: l = 0 } = t;
    s && s.length === 2 && (i = [...i, s]), i.forEach((o) => {
      const [a, g] = o;
      let [u, p] = d(this.map, o), f = {
        minX: u - e[0] + n,
        minY: p - e[1] + l,
        maxX: u + e[0] + n,
        maxY: p + e[1] + l,
        data: t
      };
      this._allRbush.push(f);
    });
  }
  /**获取指针触发范围内的事件 */
  getEventsByRange(t) {
    let e, s, i, n, l, o, a = this.map.getZoom();
    if (t.latlng) {
      let h = t;
      ({ lng: e, lat: s } = h.latlng), { x: i, y: n } = h.containerPoint, { pageX: l, pageY: o } = h.originalEvent;
    } else {
      let h = t;
      ({ lng: e, lat: s } = h.lnglat), { x: i, y: n } = h.pixel, { pageX: l, pageY: o } = h.originEvent;
    }
    let g = { latlng: [s, e], page: [l, o], point: [i, n] }, u = [], p = [], f = this.perEvents;
    return t.type == "click" && console.time("start"), this.rbush.search({ minX: i, minY: n, maxX: i, maxY: n }).forEach((h) => {
      let R = h.data, { latlng: c, latlngs: E = [], range: X = [5, 5], left: Y = 0, top: T = 0, minZoom: C = 1, maxZoom: B = 50 } = h.data;
      if (C > a || B < a) return;
      c && c.length === 2 && (E = [...E, c]);
      let [I, M] = d(this.map, c), m = this.genEventResponse(c, [I, M], R, g);
      u.push(m);
      let b = f.find(
        (v) => v.position.latlng[0] === m.position.latlng[0] && v.position.latlng[1] === m.position.latlng[1]
      );
      b ? y(f, b) : p.push(m);
    }), t.type == "click" && console.timeEnd("start"), { curEvents: u, enterEvents: p, leaveEvents: f };
  }
  /**通过事件类型执行回调函数*/
  doCbByEventType(t, e) {
    let s = t.event.type;
    Array.isArray(s) || (s = [s]), s.includes(e) && (t.type = e, this.cbMapEvent(t));
  }
  /**生成地图事件响应对象 
   * @param latlng 该事件对象的地图坐标
   * @param point 该事件对象的地图像素坐标
   * @param event 地图事件
   * @param cursor 鼠标位置信息
  */
  genEventResponse(t, e, s, i) {
    let n = e[0] + i.page[0] - i.point[0], l = e[1] + i.page[1] - i.point[1];
    return { position: { latlng: t, page: [n, l], point: e }, cursor: i, event: s, info: s.info ?? {}, type: "unset" };
  }
};
r.ifInitCursor = !0, r.ifInit = !0;
let _ = r;
export {
  _ as MapCanvasEvent
};
