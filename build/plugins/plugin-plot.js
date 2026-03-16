import { MapCanvasDraw as w } from "../map/canvas-draw.js";
import { MapCanvasEvent as b } from "../map/canvas-event.js";
import { MapCanvasLayer as M } from "../map/canvas-layer.js";
import "../_virtual/leaflet-src.js";
import "../_virtual/index.js";
import "../leaflet/slu-leaflet-net-map.js";
import { u_mapGetMapMouseEvent as L, u_mapGetLngDiffByDistance as C, u_mapGetPointByLatlng as v, u_mapGetLatLngByPoint as D, u_mapSetMapStatus as A } from "../utils/slu-map.js";
import "../canvas/slu-canvas.js";
import "../canvas/slu-canvas-img.js";
import { MapPluginDraw as x } from "./plugin-draw.js";
import { u_arrAddItemsIndex as k } from "../utils/slu-array.js";
class X extends M {
  constructor(t, i) {
    const n = t.map;
    super(n, i), this.options = {
      pane: "canvas",
      className: "plot"
    }, this.editArc = {
      latlng: [0, 0],
      colorFill: "#fff",
      colorLine: "#2C9B8A",
      size: 4
    }, this.plotList = [], this.plotAni = { latLngs: [], type: "polygon", ifEdit: !0 }, this.eventClick = (e) => {
      this.eventClickTimer = setTimeout(() => {
        let s = this.plotAni.latLngs.length, l = this.plotAni.type;
        const { latlng: a } = L(e, this.type);
        (l === "polygon" || l === "line" || s < 2) && this.plotAni.latLngs.push([a.lat, a.lng]), (l === "rect" || l === "circle") && this.plotAni.latLngs.length >= 2 ? this.eventDblclick() : this._redraw(), this.cbPointChange && this.cbPointChange(this.plotAni);
      }, 50);
    }, this.eventMousemove = (e) => {
      const { latlng: s } = L(e, this.type);
      this.curPoint = [s.lat, s.lng], this.renderAnimation();
    }, this.eventDblclick = () => {
      this.eventClickTimer && (clearTimeout(this.eventClickTimer), this.eventClickTimer = null), !(this.plotAni.type === "polygon" && this.plotAni.latLngs.length < 3) && (this.close(), this.curPoint = void 0, this._redraw());
    }, this.ctrMapDraw = new w(n, this.canvas), this.ctrMapAniDraw = new x(t, Object.assign({}, this.options, { className: this.options.className + " ani" })), this.ctrEvent = new b(n), Object.assign(this.options, i);
  }
  /**开启新增的绘制 */
  open(t) {
    let i = this.plotList.length - 1 > 0 ? this.plotList.length - 1 : 0;
    this.eventSwitch(!0);
    let n = this.plotList.find((e) => e.ifEdit);
    if (n || this.plotAni === this.plotList[i] && this.plotAni.ifEdit) {
      let e = n || this.plotAni;
      return this.plotAni = e, e.latLngs = [], e.type = t, e.ifEdit = !0, this.plotAni;
    }
    return this.plotList[i] && this.plotList[i].latLngs.length > 0 && i++, this.plotList[i] = this.plotAni = { latLngs: [], type: t, ifEdit: !0 }, this.renderAnimation(), this.plotAni;
  }
  /**关闭绘制 */
  close() {
    return this.eventSwitch(!1), this;
  }
  /**保存标绘 */
  savePlot() {
    if (this.plotAni) {
      let t = this.plotAni;
      t.ifEdit = !1, this.plotAni = void 0, this.redraw();
    }
    return this;
  }
  /**删除标绘 */
  delPlot(t) {
    return t = t || this.plotAni, this.plotList = this.plotList.filter((i) => i !== t), this._redraw(), this;
  }
  /**设置所有区域数据 */
  setPlotList(t) {
    return this.plotList = t, this.renderFixedData(), this;
  }
  /**设置编辑区域数据 */
  setEditPlot(t) {
    let i = this.plotList.find((n) => n === t);
    return i && (i.ifEdit = !0), this.eventSwitch(!1), this._redraw(), this;
  }
  /**重绘 */
  redraw() {
    return this._redraw(), this;
  }
  renderFixedData() {
    this.map && (this.ctrMapDraw.delAll(), this.ctrMapDraw.reSetCanvas(), this.plotList.forEach((t, i) => {
      t.latLngs.length > 0 && !t.ifEdit && t.ifHide !== !0 && this.drawPlot(this.ctrMapDraw, t, t.type);
    }), this.ctrMapDraw.drawMapAll());
  }
  renderAnimation() {
    this.map && this.genAniPlot();
  }
  /**生成动态绘制图层 */
  genAniPlot() {
    this.ctrMapAniDraw.delAll(), this.ctrMapAniDraw.resetCanvas(), this.ctrEvent.clearAllEvents();
    let t = this.plotList.find((i) => i.ifEdit);
    if (t) {
      this.plotAni = t;
      let i = { ...t }, n = t.latLngs;
      this.curPoint && (i.type === "circle" && n.length < 2 || i.type !== "circle") && (i.latLngs = [...n, this.curPoint]), this.drawPlot(this.ctrMapAniDraw, i, i.type), this.openMouseEdit(i), this.ctrMapAniDraw.drawMapAll();
      return;
    }
  }
  /**绘制标绘 */
  drawPlot(t, i, n) {
    let e = Object.assign({}, this.options, i);
    e.colorFill = e.colorFill, e.colorLine = e.colorLine || e.colorFill;
    let s;
    switch (n) {
      case "line":
        e = e, t.addLine({ ...e, latlngs: e.latLngs });
        break;
      case "polygon":
        e = e, s = e.latLngs;
        let a = { ...e, latlngs: s };
        t.addRect(a);
        break;
      case "circle":
        if (e = e, e.latLngs.length == 0) break;
        let h = e.latLngs[0], o = e.latLngs[1], r = e?.rail || 0;
        if (!o) {
          let [g, u] = h, f = C(this.map, r, [[g, u]]);
          e.latLngs[1] = [h[0], u + f];
        }
        let p = this.calcRadius(e.latLngs);
        t.addArc({ ...e, size: p, latlng: h });
        break;
      case "rect":
        e = e, s = this.calcRect(e.latLngs);
        let c = { ...e, latlngs: s };
        t.addRect(c);
        break;
      case "point":
        if (s = e.latLngs, !s || s.length == 0) break;
        const { url: d, size: m = [16, 16] } = e = e;
        d && t.addImg({ ...e, latlng: s[0], size: m });
        break;
    }
    let l = { text: e.name || "", colorFill: "#2C9B8A", widthLine: 2, colorLine: "#FFFFFF", ifShadow: !0, latlng: this.calcCenter(e.latLngs, n) };
    t.addText(l);
  }
  /**各个点的平均值计算中心点 */
  calcCenter(t, i) {
    let n = t.length;
    if (n < 2 || i === "circle" || i == "point") return t[0] || [0, 0];
    if (i == "line") {
      let s = 0, l = 0, a = 0;
      for (let r = 0; r < t.length - 1; r++) {
        const [p, c] = t[r], [d, m] = t[r + 1], g = Math.sqrt(Math.pow(d - p, 2) + Math.pow(m - c, 2));
        s += g;
        const u = (p + d) / 2, f = (c + m) / 2;
        l += u * g, a += f * g;
      }
      const h = l / s, o = a / s;
      return [h, o];
    }
    let e = t.reduce((s, l) => [s[0] + l[0], s[1] + l[1]], [0, 0]);
    return e = [e[0] / n, e[1] / n], e;
  }
  /**直接最大最小计算中心点 */
  calcCenter2(t) {
    if (t.length < 2) return t[0] || [0, 0];
    let n = t.reduce((h, o) => {
      let [r, p, c, d] = h;
      return [
        r > o[0] ? r : o[0],
        p < o[0] ? p : o[0],
        c > o[1] ? c : o[1],
        d < o[1] ? d : o[1]
      ];
    }, [-1 / 0, 1 / 0, -1 / 0, 1 / 0]), [e, s, l, a] = n;
    return [(e + s) / 2, (l + a) / 2];
  }
  /**计算多边形的重心*/
  calcCenter3(t) {
    let i = 0, n = 0, e = 0;
    for (let l = 0; l < t.length; l++) {
      const a = (l + 1) % t.length, h = t[l][0] * t[a][1] - t[a][0] * t[l][1];
      e += h, i += (t[l][0] + t[a][0]) * h, n += (t[l][1] + t[a][1]) * h;
    }
    return e *= 3, [i / e, n / e];
  }
  /**计算矩形的四个点 */
  calcRect(t) {
    if (t.length < 2) return t;
    let i = [], n = t[0], e = t[1];
    return i.push(n), i.push([n[0], e[1]]), i.push(e), i.push([e[0], n[1]]), i;
  }
  /**计算圆的半径 */
  calcRadius(t) {
    if (t.length < 2) return 0;
    let i = v(this.map, t[0]), n = v(this.map, t[1]), e = Math.abs(i[0] - n[0]), s = Math.abs(i[1] - n[1]);
    return Math.sqrt(e * e + s * s);
  }
  /**开启鼠标编辑功能 */
  openMouseEdit(t) {
    switch (t.type) {
      case "point":
        return this.setPointEdit(t);
      case "line":
        return this.setLineEditPoint(t);
      case "polygon":
        return this.setPolygonEditPoint(t);
      case "circle":
        return this.setCircleEditPoint(t);
      case "rect":
        return this.setRectEditPoint(t);
    }
  }
  /**设置圆的编辑点 */
  setCircleEditPoint(t) {
    let { latLngs: i } = t, n = [];
    for (let s = 0, l = i.length; s < l; s++) {
      let a = i[s];
      this.addEvent(a, s, t, n, !1);
    }
    let e = { ...this.options, latlngs: t.latLngs };
    this.ctrMapAniDraw.addLine(e), this.ctrEvent.setEventsByKey(n, "circleEdit");
  }
  /**设置多边形的编辑点 */
  setPolygonEditPoint(t) {
    let { latLngs: i } = t, n = [];
    for (let e = 0, s = i.length; e < s; e++) {
      let l = i[e];
      if (this.addEvent(l, e, t, n, !1), !this.curPoint) {
        let a = e + 1 == s ? 0 : e + 1, h = i[a], o = v(this.map, l), r = v(this.map, h), p = (o[0] + r[0]) / 2, c = (o[1] + r[1]) / 2, d = D(this.map, [p, c]);
        this.addEvent(d, e, t, n, !0);
      }
    }
    this.ctrEvent.setEventsByKey(n, "polygonEdit");
  }
  /**点标绘仍可编辑移动位置 */
  setPointEdit(t) {
    let { latLngs: i } = t;
    if (!i) return;
    let n = [];
    this.addEvent(i[0], 0, t, n), this.ctrEvent.setEventsByKey(n, "pointEdit");
  }
  /**设置线段的编辑点 */
  setLineEditPoint(t) {
    let { latLngs: i } = t, n = [];
    for (let e = 0, s = i.length; e < s; e++) {
      let l = i[e];
      this.addEvent(l, e, t, n, !1);
    }
    this.ctrEvent.setEventsByKey(n, "lineEdit");
  }
  /**设置矩形的编辑点 */
  setRectEditPoint(t) {
    let { latLngs: i } = t, n = this.calcRect(i), e = [];
    for (let s = 0, l = n.length; s < l; s++) {
      let a = n[s];
      this.addEvent(a, s, t, e, !1);
    }
    this.ctrEvent.setEventsByKey(e, "rectEdit");
  }
  /**添加响应事件 
   * @param latLng 经纬度
   * @param i 索引
   * @param plotInfo 绘制信息
   * @param eves 事件
   * @param ifVirtual 是否为虚拟点
  */
  addEvent(t, i, n, e, s) {
    const l = this, { map: a } = l;
    let h = { ...this.editArc, latlng: t }, { latLngs: o, type: r } = n;
    s && (h.size = 3, h.fillAlpha = 0.9), this.ctrMapAniDraw.addArc(h), e.push({
      latlng: t,
      type: "mousedown",
      cb: (p) => {
        A(a, "dragEnable", !1), s && (k(n.latLngs, [t], i), this.cbPointChange && this.cbPointChange(this.plotAni)), this._redraw();
        let c = (m) => {
          const { latlng: g } = L(m, this.type);
          if (r === "polygon" || r === "circle" || r === "point" || r === "line")
            t[0] = g.lat, t[1] = g.lng;
          else if (r === "rect") {
            let u = this.calcRect(o), f = (i + 2) % 4, E = [g.lat, g.lng], P = u[f];
            this.plotAni.latLngs = [E, P].filter((y) => !!y);
          }
          this.renderAnimation();
        }, d = () => {
          this.map.off("mousemove", c), this.map.off("mouseup", d), A(a, "dragEnable", !0), this.cbPointChange && this.cbPointChange(this.plotAni), this._redraw();
        };
        this.map.on("mousemove", c), this.map.on("mouseup", d);
      }
    });
  }
  /**事件开关方法 
  * @param flag true开启 false关闭
  */
  eventSwitch(t) {
    let i = t ? "on" : "off";
    t && this.eventSwitch(!1), this.map[i]("click", this.eventClick), this.map[i]("dblclick", this.eventDblclick), this.map[i]("mousemove", this.eventMousemove);
  }
  /**移除所有的监听函数 */
  clearCb() {
    this.cbPointAdd = void 0, this.cbPointMove = void 0, this.cbPointChange = void 0;
  }
  /**添加新增点位时的监听函数 */
  addCbPointChange(t) {
    return this.cbPointChange = t, this;
  }
  /**添加新增点位时的监听函数 */
  addCbPointAdd(t) {
    return this.cbPointAdd = t, this;
  }
  /**添加新增点位时的监听函数 */
  addCbPointMove(t) {
    return this.cbPointMove = t, this;
  }
}
export {
  X as MapPluginPlot
};
