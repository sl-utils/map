import { MapCanvasDraw as P } from "../map/canvas-draw.js";
import { MapCanvasEvent as w } from "../map/canvas-event.js";
import { MapCanvasLayer as b } from "../map/canvas-layer.js";
import "../_virtual/leaflet-src.js";
import "../_virtual/index.js";
import "../leaflet/slu-leaflet-net-map.js";
import { u_mapGetMapMouseEvent as E, u_mapGetLngDiffByDistance as M, u_mapGetPointByLatlng as L, u_mapGetLatLngByPoint as C, u_mapSetMapStatus as y } from "../utils/slu-map.js";
import "../_virtual/maplibre-gl.js";
import "../canvas/slu-canvas.js";
import "../canvas/slu-canvas-img.js";
import "../canvas/slu-canvas-text.js";
import { MapPluginDraw as x } from "./plugin-draw.js";
import { u_arrAddItemsIndex as D } from "../utils/slu-array.js";
class Y extends b {
  constructor(t, i) {
    const n = t.map, { plotOpt: e, editOpt: s, textOpt: l } = i || {};
    super(n, e), this.options = {
      pane: "canvas",
      className: "plot"
    }, this.editArc = {
      latlng: [0, 0],
      colorFill: "#fff",
      colorLine: "#2C9B8A",
      size: 4
    }, this.plotText = {
      colorFill: "#2C9B8A",
      widthLine: 2,
      colorLine: "#FFFFFF",
      ifShadow: !0
    }, this.plotList = [], this.plotAni = { latLngs: [], type: "polygon", ifEdit: !0 }, this.eventClick = (r) => {
      this.eventClickTimer = setTimeout(() => {
        const a = this.plotAni;
        if (!a) return;
        const { latlng: h } = E(r, this.map), o = [h.lat, h.lng];
        a.type === "polygon" || a.type === "line" ? a.latLngs.push(o) : a.latLngs.length < 2 && (a.latLngs = [...a.latLngs, o]), (a.type === "rect" || a.type === "circle") && a.latLngs.length >= 2 ? this.eventDblclick() : this._redraw(), this.cbPointChange && this.cbPointChange(this.plotAni);
      }, 50);
    }, this.eventMousemove = (r) => {
      const { latlng: a } = E(r, this.map);
      this.curPoint = [a.lat, a.lng], this.renderAnimation();
    }, this.eventDblclick = () => {
      this.eventClickTimer && (clearTimeout(this.eventClickTimer), this.eventClickTimer = null);
      const r = this.plotAni;
      if (!r) return;
      const { type: a, latLngs: h } = r;
      a === "polygon" && h.length < 3 || (this.close(), this.curPoint = void 0, this._redraw());
    }, this.ctrMapDraw = new P(n, this.canvas), Object.assign(this.options, e), this.ctrMapAniDraw = new x(t, Object.assign({}, this.options, { className: this.options.className + " ani" })), this.ctrEvent = new w(n), Object.assign(this.editArc, s), Object.assign(this.plotText, l);
  }
  /**开启新增的绘制
   * @param type 标绘类型
   * @returns 新增的标绘实例
   */
  open(t) {
    let i = this.plotList.length - 1 > 0 ? this.plotList.length - 1 : 0;
    this.eventSwitch(!0);
    let n = this.plotList.find((s) => s.ifEdit);
    if (n)
      return n.latLngs = [], n.type = t, n.ifEdit = !0, this.plotAni = n, n;
    if (this.plotAni && this.plotAni === this.plotList[i] && this.plotAni.ifEdit) {
      const s = this.plotAni;
      return s.latLngs = [], s.type = t, s.ifEdit = !0, s;
    }
    this.plotList[i] && this.plotList[i].latLngs.length > 0 && i++;
    const e = this.createPlot(t);
    return this.plotList[i] = this.plotAni = e, this.renderAnimation(), this.plotAni;
  }
  /**关闭绘制 
   * @returns MapPluginPlot实例
  */
  close() {
    return this.eventSwitch(!1), this;
  }
  /**保存标绘
   * @returns MapPluginPlot实例
  */
  savePlot() {
    if (this.plotAni) {
      let t = this.plotAni;
      t.ifEdit = !1, this.plotAni = void 0, this.redraw();
    }
    return this;
  }
  /**删除标绘
   * @param plot 标绘实例
   * @returns MapPluginPlot实例
   */
  delPlot(t) {
    return t = t || this.plotAni, this.plotList = this.plotList.filter((i) => i !== t), this._redraw(), this;
  }
  /**设置所有区域数据
   * @param plotList 标绘集合
   * @returns MapPluginPlot实例
   */
  setPlotList(t) {
    return this.plotList = t, this.renderFixedData(), this;
  }
  /**设置编辑区域数据
   * @param plot 标绘实例
   * @returns MapPluginPlot实例
   */
  setEditPlot(t) {
    let i = this.plotList.find((n) => n === t);
    return i && (i.ifEdit = !0), this.eventSwitch(!1), this._redraw(), this;
  }
  /**重绘
   * @returns MapPluginPlot实例
   */
  redraw() {
    return this._redraw(), this;
  }
  /**渲染静态标绘图层 */
  renderFixedData() {
    this.map && (this.ctrMapDraw.delAll(), this.ctrMapDraw.reSetCanvas(), this.plotList.forEach((t, i) => {
      t.latLngs.length > 0 && !t.ifEdit && t.ifHide !== !0 && this.drawPlot(this.ctrMapDraw, t, t.type);
    }), this.ctrMapDraw.drawMapAll());
  }
  /**渲染动态绘制图层 */
  renderAnimation() {
    this.map && this.genAniPlot();
  }
  /**创建标绘
   * @param type 标绘类型
   * @returns 标绘数据
   */
  createPlot(t) {
    switch (t) {
      case "point":
        return { type: "point", latLngs: [], ifEdit: !0, url: "", points: [] };
      case "circle":
        return { type: "circle", latLngs: [], ifEdit: !0 };
      case "rect":
        return { type: "rect", latLngs: [], ifEdit: !0 };
      case "line":
      case "polygon":
        return { type: t, latLngs: [], ifEdit: !0 };
    }
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
  /**绘制标绘
   * @param layer 绘制图层
   * @param plotInfo 标绘数据
   * @param type 标绘类型
   */
  drawPlot(t, i, n) {
    let e = Object.assign({}, this.options, i);
    switch (e.colorFill = e.colorFill, e.colorLine = e.colorLine || e.colorFill, e.type) {
      case "line":
        t.addLine({ ...e, latlngs: e.latLngs });
        break;
      case "polygon":
        let l = { ...e, latlngs: e.latLngs };
        t.addRect(l);
        break;
      case "circle":
        if (e.latLngs.length == 0) break;
        let [r, a] = e.latLngs, h = e.rail || 0;
        if (!a) {
          let [u, m] = r, f = M(this.map, h, [[u, m]]);
          e.latLngs[1] = [u, m + f];
        }
        let o = this.calcRadius(e.latLngs);
        t.addArc({ ...e, size: o, latlng: r });
        break;
      case "rect":
        const p = this.calcRect(e.latLngs);
        let c = { ...e, latlngs: p };
        t.addRect(c);
        break;
      case "point":
        if (!e.latLngs.length) break;
        const { url: d, size: g = [16, 16] } = e;
        d && t.addImg({ ...e, latlng: e.latLngs[0], size: g });
        break;
    }
    let s = { ...this.plotText, text: e.name || "", latlng: this.calcCenter(e.latLngs, n) };
    t.addText(s);
  }
  /**各个点的平均值计算中心点
   * @param points 纬度经度点数组
   * @param type 标绘类型
   * @returns 中心点[number, number]
   */
  calcCenter(t, i) {
    let n = t.length;
    if (n < 2 || i === "circle" || i == "point") return t[0] || [0, 0];
    if (i == "line") {
      let s = 0, l = 0, r = 0;
      for (let o = 0, p = t.length - 1; o < p; o++) {
        const [c, d] = t[o], [g, u] = t[o + 1], m = Math.sqrt(Math.pow(g - c, 2) + Math.pow(u - d, 2));
        s += m;
        const f = (c + g) / 2, v = (d + u) / 2;
        l += f * m, r += v * m;
      }
      const a = l / s, h = r / s;
      return [a, h];
    }
    let e = t.reduce((s, l) => [s[0] + l[0], s[1] + l[1]], [0, 0]);
    return e = [e[0] / n, e[1] / n], e;
  }
  /**直接最大最小计算中心点
   * @param points 纬度经度点数组
   * @returns 中心点[number, number]
   */
  calcCenter2(t) {
    if (t.length < 2) return t[0] || [0, 0];
    let n = t.reduce((a, h) => {
      let [o, p, c, d] = a;
      return [
        o > h[0] ? o : h[0],
        p < h[0] ? p : h[0],
        c > h[1] ? c : h[1],
        d < h[1] ? d : h[1]
      ];
    }, [-1 / 0, 1 / 0, -1 / 0, 1 / 0]), [e, s, l, r] = n;
    return [(e + s) / 2, (l + r) / 2];
  }
  /**计算多边形的重心
   * @param points 纬度经度点数组
   * @returns 中心点[number, number]
   */
  calcCenter3(t) {
    let i = 0, n = 0, e = 0;
    for (let l = 0, r = t.length - 1; l < r; l++) {
      const a = (l + 1) % t.length, h = t[l][0] * t[a][1] - t[a][0] * t[l][1];
      e += h, i += (t[l][0] + t[a][0]) * h, n += (t[l][1] + t[a][1]) * h;
    }
    return e *= 3, [i / e, n / e];
  }
  /**计算矩形的四个点
   * @param latLngs 纬度经度点数组
   * @returns 矩形四个点[number, number]
   */
  calcRect(t) {
    if (t.length < 2) return t;
    let i = [], [n, e] = t;
    return i.push(n), i.push([n[0], e[1]]), i.push(e), i.push([e[0], n[1]]), i;
  }
  /**计算圆的半径
   * @param latLngs 纬度经度点数组
   * @returns 圆的半径
   */
  calcRadius(t) {
    if (t.length < 2) return 0;
    let [i, n] = L(this.map, t[0]), [e, s] = L(this.map, t[1]), l = Math.abs(i - e), r = Math.abs(n - s);
    return Math.sqrt(l * l + r * r);
  }
  /**开启鼠标编辑功能
   * @param plotInfo 标绘数据
   */
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
  /**设置圆的编辑点
   * @param plotInfo 标绘数据
   */
  setCircleEditPoint(t) {
    let { latLngs: i } = t, n = [];
    for (let s = 0, l = i.length; s < l; s++) {
      let r = i[s];
      this.addEvent(r, s, t, n, !1);
    }
    let e = { ...this.options, latlngs: t.latLngs };
    this.ctrMapAniDraw.addLine(e), this.ctrEvent.setEventsByKey(n, "circleEdit");
  }
  /**设置多边形的编辑点
   * @param plotInfo 标绘数据
   */
  setPolygonEditPoint(t) {
    let { latLngs: i } = t, n = [];
    for (let e = 0, s = i.length; e < s; e++) {
      let l = i[e];
      if (this.addEvent(l, e, t, n, !1), !this.curPoint) {
        let r = e + 1 == s ? 0 : e + 1, a = i[r], [h, o] = L(this.map, l), [p, c] = L(this.map, a), d = (h + p) / 2, g = (o + c) / 2, u = C(this.map, [d, g]);
        this.addEvent(u, e, t, n, !0);
      }
    }
    this.ctrEvent.setEventsByKey(n, "polygonEdit");
  }
  /**点标绘仍可编辑移动位置
   * @param plotInfo 标绘数据
   */
  setPointEdit(t) {
    let { latLngs: i } = t;
    if (!i) return;
    let n = [];
    this.addEvent(i[0], 0, t, n), this.ctrEvent.setEventsByKey(n, "pointEdit");
  }
  /**设置线段的编辑点
   * @param plotInfo 标绘数据
   */
  setLineEditPoint(t) {
    let { latLngs: i } = t, n = [];
    for (let e = 0, s = i.length; e < s; e++) {
      let l = i[e];
      this.addEvent(l, e, t, n, !1);
    }
    this.ctrEvent.setEventsByKey(n, "lineEdit");
  }
  /**设置矩形的编辑点
   * @param plotInfo 标绘数据
   */
  setRectEditPoint(t) {
    let { latLngs: i } = t, n = [], e = this.calcRect(i);
    for (let s = 0, l = e.length; s < l; s++) {
      let r = e[s];
      this.addEvent(r, s, t, n, !1);
    }
    this.ctrEvent.setEventsByKey(n, "rectEdit");
  }
  /**添加响应事件 
   * @param latLng 经纬度
   * @param i 索引
   * @param plotInfo 标绘数据
   * @param eves 事件
   * @param ifVirtual 是否为虚拟点
  */
  addEvent(t, i, n, e, s) {
    const l = this, { map: r } = l;
    let a = { ...this.editArc, latlng: t }, { latLngs: h, type: o } = n;
    s && (a.size = 3, a.fillAlpha = 0.9), this.ctrMapAniDraw.addArc(a), e.push({
      latlng: t,
      type: "mousedown",
      cb: () => {
        y(r, "dragEnable", !1), s && (D(h, [t], i), this.cbPointChange && this.cbPointChange(this.plotAni)), this._redraw();
        let p = (d) => {
          const { latlng: g } = E(d, this.map);
          if (o === "polygon" || o === "circle" || o === "point" || o === "line")
            t[0] = g.lat, t[1] = g.lng;
          else if (o === "rect") {
            let u = this.calcRect(h), m = (i + 2) % 4, f = [g.lat, g.lng], v = u[m];
            this.plotAni.latLngs = [f, v].filter((A) => !!A);
          }
          this.renderAnimation();
        }, c = () => {
          this.map.off("mousemove", p), this.map.off("mouseup", c), y(r, "dragEnable", !0), this.cbPointChange && this.cbPointChange(this.plotAni), this._redraw();
        };
        this.map.on("mousemove", p), this.map.on("mouseup", c);
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
  /**添加新增点位时的监听函数
   * @param cb 回调函数
   * @returns MapPluginPlot实例
   */
  addCbPointChange(t) {
    return this.cbPointChange = t, this;
  }
  /**添加新增点位时的监听函数
   * @param cb 回调函数
   * @returns MapPluginPlot实例
   */
  addCbPointAdd(t) {
    return this.cbPointAdd = t, this;
  }
  /**添加新增点位时的监听函数
   * @param cb 回调函数
   * @returns MapPluginPlot实例
   */
  addCbPointMove(t) {
    return this.cbPointMove = t, this;
  }
}
export {
  Y as MapPluginPlot
};
