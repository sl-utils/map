import { u_tsMapisMapLibre as M, u_tsIsMapEventType as C, u_arrItemDel as g, u_mapGetPointByLatlng as R, u_tsEventisLeaflet as B, u_tsEventisAmap as I, u_tsEventisMapLibre as x } from "../utils/slu-map.js";
import L from "../node_modules/rbush/index.js";
const r = class r {
  constructor(t) {
    this.rbush = new L(), this.rbush_search = /* @__PURE__ */ Object.create(null), this._listenCbs = /* @__PURE__ */ Object.create(null), this._allMapEvents = /* @__PURE__ */ new Map(), this._allRbush = [], this.perEvents = [], this.cbMapEvent = (s) => {
      let { cb: e, cbs: i } = s.event;
      if (e) {
        e(s);
        return;
      }
      if (i) {
        i[s.type]?.(s);
        return;
      }
      (this._listenCbs[s.type] || []).map((a) => a(s));
    }, this.types = ["click", "dblclick", "mousemove", "mousedown", "mouseup", "rightclick"], this.resetRbush = () => {
      this.rbush && this.rbush.clear(), this._eventSwitch(!1), this._allRbush.length = 0, this._allMapEvents.forEach((s) => {
        s.forEach((e) => {
          this.transformRbush(e);
        });
      }), this.rbush.load(this._allRbush), this._eventSwitch(!0);
    }, this.triggerEvent = (s) => {
      let e = [], i;
      if (this._allMapEvents.forEach((n) => {
        e = e.concat(n);
      }), M(this.map) ? i = this.map.getCanvasContainer() : i = this.map.getContainer(), !i) return;
      let l = i.style;
      if (l.cursor = r.ifInitCursor ? "default" : l.cursor, e.length === 0) return;
      let { curEvents: a, enterEvents: u, leaveEvents: c } = this.getEventsByRange(s);
      if (u.forEach((n) => this.doCbByEventType(n, "mouseenter")), c.forEach((n) => this.doCbByEventType(n, "mouseleave")), this.perEvents = a, a.length == 0) return;
      r.ifInitCursor = !1, l.cursor = "pointer";
      const h = s.type;
      C(h), a.forEach((n) => this.doCbByEventType(n, h));
    }, this.map = t, this._eventSwitch(!0), this.map.on("moveend", this.resetRbush), this.map.on("zoomend", this.resetRbush);
  }
  /**地图销毁必须调用此方法，否则事件指针会异常 */
  static destory() {
    r.ifInit = !0;
  }
  /** 事件开关 
   * @param flag true开启地图事件监听 false关闭地图事件监听
  */
  _eventSwitch(t) {
    r.ifInit && (r.ifInit = !1, this.map.on("mousemove", () => {
      r.ifInitCursor = !0;
    })), this.types.forEach((s) => {
      this.map[t ? "on" : "off"](s, this.triggerEvent);
    });
  }
  /**统一监听该类的指定事件
   * @param type 事件类型
   * @param cb 事件回调函数
   */
  on(t, s) {
    (this._listenCbs[t] = this._listenCbs[t] || []).push(s);
  }
  /**统一关闭指定事件的监听
   * @param type 事件类型
   * @param cb 事件回调函数
   */
  off(t, s) {
    let e = this._listenCbs[t] = this._listenCbs[t] || [];
    s ? g(e, s) : this._listenCbs[t].length = 0;
  }
  /**清空之前设置的统一监听事件 */
  clear() {
    this._listenCbs = /* @__PURE__ */ Object.create(null);
  }
  /** 设置指定key的事件
   * @param evs 事件集合
   * @param key 事件key
   * 设置key 事件 会覆盖原来的事件 
   * 不覆盖使用 pushEventByKey
   *  */
  setEventsByKey(t, s) {
    this._allMapEvents.set(s, t.filter((e) => !e.ifHide)), this._allRbush.length = 0, this.rbush.clear(), this._allMapEvents.forEach((e) => {
      e.forEach((i) => this.handleTransform(i));
    }), this.rbush.load(this._allRbush);
  }
  /**清除所有事件 */
  clearAllEvents() {
    this._allMapEvents.clear(), this._allRbush.length = 0, this.rbush.clear();
  }
  /**清除指定类型事件
   * @param key 事件key
   */
  clearEventsByKey(t) {
    this.setEventsByKey([], t);
  }
  /**添加一个事件
   * @param key 事件key
   * @param ev 事件对象
   * 尽量使用setEventsByKey 
   * 或者pushEventByKey数组 而不是for 一个个push
   * 不然每次for循环push都会重新构造rbush
   *  */
  pushEventByKey(t, s) {
    this._allMapEvents.has(t) || this._allMapEvents.set(t, []);
    const e = this._allMapEvents.get(t);
    Array.isArray(s) ? e.push(...s) : e.push(s), this.setEventsByKey(e, t);
  }
  /**添加事件
   * @param ev 事件对象
   */
  handleTransform(t) {
    this.transformEvent(t), this.transformRbush(t);
  }
  /**转换添加事件
   * @param event 事件对象
   */
  transformEvent(t) {
    t.ifHide !== !0 && (t.latlng, t.latlngs, t.type, t.info, t.cb);
  }
  /**转为Rbush数据格式
   * @param event 事件对象
   */
  transformRbush(t) {
    if (t.ifHide === !0) return;
    let { range: s = [5, 5], latlng: e, latlngs: i = [], left: l = 0, top: a = 0 } = t;
    e && e.length === 2 && (i = [...i, e]), i.forEach((u) => {
      let [c, h] = R(this.map, u), n = {
        minX: c - s[0] + l,
        minY: h - s[1] + a,
        maxX: c + s[0] + l,
        maxY: h + s[1] + a,
        data: t,
        latlng: u
      };
      this._allRbush.push(n);
    });
  }
  /**获取指针触发范围内的事件
   * @param e 地图事件
   * @returns MapEventRange
   */
  getEventsByRange(t) {
    let s, e, i, l, a = this.map.getZoom();
    if (B(t)) {
      let o = t;
      ({ x: s, y: e } = o.containerPoint), { pageX: i, pageY: l } = o.originalEvent;
    } else if (I(t)) {
      let o = t;
      ({ x: s, y: e } = o.pixel), { pageX: i, pageY: l } = o.originEvent;
    } else x(t) && ({ x: s, y: e } = t.point, { pageX: i, pageY: l } = t.originalEvent);
    let u = [], c = [], h = this.perEvents;
    t.type == "click" && console.time("start");
    const n = this.rbush_search;
    return n.maxX = n.minX = s, n.maxY = n.minY = e, this.rbush.search(n).forEach((o) => {
      let E = o.data, b = o.latlng, { minZoom: _ = 1, maxZoom: d = 50 } = E;
      if (_ > a || d < a) return;
      let f = /* @__PURE__ */ Object.create(null);
      f.latlng = b, f.page = [i, l], f.point = [s, e];
      let p = /* @__PURE__ */ Object.create(null);
      p.type = "unset", p.position = f, p.event = E, p.info = E.info, u.push(p);
      let m = h.find(
        (v) => v.position.latlng[0] === b[0] && v.position.latlng[1] === b[1]
      );
      m ? g(h, m) : c.push(p);
    }), t.type == "click" && console.timeEnd("start"), { curEvents: u, enterEvents: c, leaveEvents: h };
  }
  /**通过事件类型执行回调函数
   * @param resp 事件响应对象
   * @param type 事件类型
  */
  doCbByEventType(t, s) {
    let e = t.event.type;
    Array.isArray(e) || (e = [e]), e.includes(s) && (t.type = s, this.cbMapEvent(t));
  }
};
r.ifInitCursor = !0, r.ifInit = !0;
let y = r;
export {
  y as MapCanvasEvent
};
