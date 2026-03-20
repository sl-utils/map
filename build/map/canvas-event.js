import { u_arrItemDel as _, u_mapGetPointByLatlng as C } from "../utils/slu-map.js";
import I from "../node_modules/rbush/index.js";
const a = class a {
  /**地图事件控制类 */
  constructor(t) {
    this.rbush = new I(), this.rbush_search = /* @__PURE__ */ Object.create(null), this._listenCbs = /* @__PURE__ */ Object.create(null), this._allMapEvents = /* @__PURE__ */ new Map(), this._allRbush = [], this.perEvents = [], this.cbMapEvent = (e) => {
      let { cb: s, cbs: i } = e.event;
      if (s) {
        s(e);
        return;
      }
      if (i) {
        i[e.type]?.(e);
        return;
      }
      (this._listenCbs[e.type] || []).map((r) => r(e));
    }, this.types = ["click", "dblclick", "mousemove", "mousedown", "mouseup", "rightclick"], this.resetRbush = () => {
      this.rbush && this.rbush.clear(), this._eventSwitch(!1), this._allRbush.length = 0, this._allMapEvents.forEach((e) => {
        e.forEach((s) => {
          this.transformRbush(s);
        });
      }), this.rbush.load(this._allRbush), this._eventSwitch(!0);
    }, this.triggerEvent = (e) => {
      let s = [];
      this._allMapEvents.forEach((n) => {
        s = s.concat(n);
      });
      let i = document.querySelector("#map").style;
      if (i.cursor = a.ifInitCursor ? "default" : i.cursor, s.length === 0) return;
      let { curEvents: l, enterEvents: r, leaveEvents: o } = this.getEventsByRange(e);
      r.forEach((n) => this.doCbByEventType(n, "mouseenter")), o.forEach((n) => this.doCbByEventType(n, "mouseleave")), this.perEvents = l, l.length != 0 && (a.ifInitCursor = !1, i.cursor = "pointer", l.forEach((n) => this.doCbByEventType(n, e.type)));
    }, this.map = t, this._eventSwitch(!0), this.map.on("moveend", this.resetRbush), this.map.on("zoomend", this.resetRbush);
  }
  /**地图销毁必须调用此方法，否则事件指针会异常 */
  static destory() {
    a.ifInit = !0;
  }
  /** 事件开关 
   * @param flag true开启地图事件监听 false关闭地图事件监听
  */
  _eventSwitch(t) {
    a.ifInit && (a.ifInit = !1, this.map.on("mousemove", () => {
      a.ifInitCursor = !0;
    })), this.types.forEach((e) => {
      this.map[t ? "on" : "off"](e, this.triggerEvent);
    });
  }
  /**统一监听该类的指定事件 */
  on(t, e) {
    (this._listenCbs[t] = this._listenCbs[t] || []).push(e);
  }
  /**统一关闭指定事件的监听 */
  off(t, e) {
    let s = this._listenCbs[t] = this._listenCbs[t] || [];
    e ? _(s, e) : this._listenCbs[t] = [];
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
    this._allMapEvents.clear(), this._allRbush.length = 0, this.rbush.clear();
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
    let { range: e = [5, 5], latlng: s, latlngs: i = [], left: l = 0, top: r = 0 } = t;
    s && s.length === 2 && (i = [...i, s]), i.forEach((o) => {
      const [n, m] = o;
      let [p, u] = C(this.map, o), c = {
        minX: p - e[0] + l,
        minY: u - e[1] + r,
        maxX: p + e[0] + l,
        maxY: u + e[1] + r,
        data: t,
        latlng: o
      };
      this._allRbush.push(c);
    });
  }
  /**获取指针触发范围内的事件 */
  getEventsByRange(t) {
    let e, s, i, l, r, o, n = this.map.getZoom();
    if (t.latlng) {
      let h = t;
      ({ lng: e, lat: s } = h.latlng), { x: i, y: l } = h.containerPoint, { pageX: r, pageY: o } = h.originalEvent;
    } else {
      let h = t;
      ({ lng: e, lat: s } = h.lnglat), { x: i, y: l } = h.pixel, { pageX: r, pageY: o } = h.originEvent;
    }
    let m = [], p = [], u = this.perEvents;
    t.type == "click" && console.time("start");
    const c = this.rbush_search;
    return c.maxX = c.minX = i, c.maxY = c.minY = l, this.rbush.search(c).forEach((h) => {
      let E = h.data, v = h.latlng, { minZoom: R = 1, maxZoom: B = 50 } = E;
      if (R > n || B < n) return;
      let b = /* @__PURE__ */ Object.create(null);
      b.latlng = v, b.page = [r, o], b.point = [i, l];
      let f = /* @__PURE__ */ Object.create(null);
      f.type = "unset", f.position = b, f.event = E, f.info = E.info, m.push(f);
      let g = u.find(
        (y) => y.position.latlng[0] === v[0] && y.position.latlng[1] === v[1]
      );
      g ? _(u, g) : p.push(f);
    }), t.type == "click" && console.timeEnd("start"), { curEvents: m, enterEvents: p, leaveEvents: u };
  }
  /**通过事件类型执行回调函数*/
  doCbByEventType(t, e) {
    let s = t.event.type;
    Array.isArray(s) || (s = [s]), s.includes(e) && (t.type = e, this.cbMapEvent(t));
  }
};
a.ifInitCursor = !0, a.ifInit = !0;
let d = a;
export {
  d as MapCanvasEvent
};
