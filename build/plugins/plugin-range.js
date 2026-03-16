import { l as w } from "../_virtual/leaflet-src.js";
import { MapPluginDraw as k } from "./plugin-draw.js";
import { MapCanvasDraw as E } from "../map/canvas-draw.js";
import { MapCanvasEvent as B } from "../map/canvas-event.js";
import { MapCanvasLayer as T } from "../map/canvas-layer.js";
import "../_virtual/index.js";
import "../leaflet/slu-leaflet-net-map.js";
import { u_mapGetMapMouseEvent as F, u_mapGetDistance as y, u_mapGetAngle as M, u_mapGetPointByLatlng as b, u_mapGetLatLngByPoint as _ } from "../utils/slu-map.js";
import { SLUCanvas as S } from "../canvas/slu-canvas.js";
import "../canvas/slu-canvas-img.js";
class Y extends T {
  /** 测绘类，传入Amap或者调用addTo */
  constructor(t, l) {
    const s = t.map;
    super(s, l), this.options = {
      pane: "canvas",
      className: "range",
      colorLine: "#364A7D",
      colorArc: "#FFF",
      colorArcStart: "#415880",
      colorFont: " #333333"
    }, this.lnglats = [], this.ifDrag = !1, this.eventDrag = (e) => {
      this.ifDrag = !0;
    }, this.eventDragend = (e) => {
      this.ifDrag = !1;
    }, this.eventClick = (e) => {
      console.log(e), this.eventClickTimer = setTimeout(() => {
        const { latlng: i } = F(e, this.type);
        let a = new w.LatLng(i.lat, i.lng);
        this.lnglats[this.lnglats.length - 1].push(a), this.renderFixedData(), this.renderAnimation();
      }, 100);
    }, this.eventMousemove = (e) => {
      if (this.ifDrag) return;
      const { latlng: i } = F(e, this.type);
      this.lnglat = new w.LatLng(i.lat, i.lng), this.renderAnimation();
    }, this.eventDblclick = () => {
      this.eventClickTimer && (clearTimeout(this.eventClickTimer), this.eventClickTimer = null), this.close(), this.lnglat = void 0, this.renderFixedData(), this.renderAnimation();
    }, Object.assign(this.options, l), this.ctrMapDraw = new E(s, this.canvas), this.ctrMapAniDraw = new k(t, Object.assign({}, this.options, { className: this.options.className + " ani" })), this.ctrEvent = new B(s);
  }
  setOptions(t) {
    return Object.assign(this.options, t), this._redraw(), this;
  }
  /** 启用测距功能 */
  open() {
    let t = this.lnglats.length;
    return this.lnglats[t] && this.lnglats[t].length > 0 && t++, this.lnglats[t] = [], this.eventSwitch(!0), this;
  }
  /** 关闭测距功能 */
  close(t = !0) {
    this.eventSwitch(!1), t && this.endCb?.();
  }
  onEnd(t) {
    this.endCb = t;
  }
  /** 缓存绘图数据（对于引进确定的数据进行缓存） */
  renderFixedData() {
    this.ctrMapDraw.reSetCanvas(), this.ctrEvent.clearEventsByKey("range");
    let t = [], l = this.lnglats.length, s = [], e = [], i = [], a = [], n = this.options;
    for (let r = 0; r < l; r++) {
      let p = this.lnglats[r], g = [], c = 0;
      for (let o = 0, d = p.length; o < d; o++) {
        let h = p[o], v = [h.lat, h.lng], u = "起点";
        if (g.push(v), o == 0) {
          let m = { latlng: g[0], size: 3, colorFill: n.colorArcStart, colorLine: n.colorLine };
          e.push(m), i.push({ text: u, latlng: v, colorFill: n.colorFont, py: -12, px: 5, textAlign: "right", panel: { colorFill: "#fff", fillAlpha: 0.8, colorLine: "#90A4A4", widthLine: 1 } });
        } else {
          let m = p[o - 1], D = 5, x = y([m.lat, m.lng], [h.lat, h.lng], 0), C = M(this.map, [m.lat, m.lng], [h.lat, h.lng]);
          c += x, u = (x > 1852 ? (x / 1852).toFixed(2) + " nm" : x.toFixed(0) + " m") + "/" + C.toFixed(2) + "°", o == d - 1 && (r < l - 1 || this.lnglat === void 0) && (u = u + ";" + (c > 1852 ? (c / 1852).toFixed(2) + " nm" : c.toFixed(0) + " m"), D = 20, a.push({
            latlng: v,
            posX: 17,
            posY: 34,
            left: 20,
            size: [16, 16],
            sizeo: [16, 16],
            type: "click",
            url: "/assets/icons/icon-16.png"
          }), t.push({
            latlng: v,
            range: [8, 8],
            type: "click",
            left: 20,
            cb: () => {
              this.lnglats.splice(r, 1), this._redraw();
            }
          })), i.push({
            text: u,
            colorFill: n.colorFont,
            latlng: v,
            py: -12,
            px: 5,
            textAlign: "right",
            panel: {
              pr: D,
              colorFill: "#fff",
              fillAlpha: 0.8,
              colorLine: "#90A4A4",
              widthLine: 1
            }
          });
        }
      }
      let f = [...g];
      f.shift();
      let A = { latlngs: f, size: 3, colorFill: n.colorArc, colorLine: n.colorLine }, L = { latlngs: g, colorLine: n.colorLine };
      s.push(L), e.push(A);
    }
    this.ctrEvent.setEventsByKey(t, "range"), this.ctrMapDraw.setAllImgs(a), this.ctrMapDraw.setAllLines(s), this.ctrMapDraw.setAllArcs(e), this.ctrMapDraw.setAllTexts(i), this.ctrMapDraw.drawMapAll();
  }
  renderAnimation() {
    this.map && this.genAniLineDate();
  }
  /** 动画虚线绘制 */
  genAniLineDate() {
    let t = this.ctrMapAniDraw;
    t.setAllTexts([]).setAllLines([]);
    let l = this.lnglats.length, s = this.lnglats[l - 1] || [];
    if (this.lnglat && this.lnglat.lat !== void 0 && s.length > 0) {
      let e = s[s.length - 1], i = y([this.lnglat.lat, this.lnglat.lng], [e.lat, e.lng], 0), a = M(this.map, [e.lat, e.lng], [this.lnglat.lat, this.lnglat.lng]), n = (i > 1852 ? (i / 1852).toFixed(2) + " nm" : i.toFixed(0) + " m") + "/" + a.toFixed(2) + "°";
      t.setAllLines([{ latlngs: [[this.lnglat.lat, this.lnglat.lng], [e.lat, e.lng]], dash: [3, 3], colorLine: "#364A7D" }]), t.setAllTexts([{ latlng: [this.lnglat.lat, this.lnglat.lng], text: n, colorFill: "#FFFFFF" }]);
    }
    t.drawMapAll();
  }
  /** 绘制文本信息  flag标识该条线已经绘制完成 */
  drawEndTextImg(t, l) {
    let { latlng: s, panel: e, text: i = "text" } = t, a = b(this.map, s), n = document.createElement("canvas").getContext("2d");
    S.setCtxPara(n, t);
    let r = n.measureText(i), p = r.width, g = r.actualBoundingBoxAscent, c = r.actualBoundingBoxDescent, f = a[0] - p / 2, A = a[1] - (g - c) / 2, o = f + p + 5 + 16 / 2, d = A - (g - c) / 2, h = _(this.map, [o, d]);
    return this.ctrEvent.pushEventByKey("text", {
      latlng: h,
      point: [o, d],
      range: [10, 10],
      type: "click",
      cb: () => {
        this.lnglats.splice(l, 1), this._redraw();
      }
    }), {
      latlng: h,
      url: "/assets/images/icon/com_close_red.png",
      size: [16, 16]
    };
  }
  /**事件开关方法 
          * @param flag true开启 false关闭
  */
  eventSwitch(t) {
    let l = t ? "on" : "off";
    t && this.eventSwitch(!1), this.map[l]("drag", this.eventDrag), this.map[l]("dragend", this.eventDragend), this.map[l]("click", this.eventClick), this.map[l]("dblclick", this.eventDblclick), this.map[l]("mousemove", this.eventMousemove);
  }
}
export {
  Y as MapPluginRange
};
