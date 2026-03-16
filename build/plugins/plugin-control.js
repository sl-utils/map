import { u_mapGetMapType as l, u_mapGetBounds as r, u_mapGetMapSize as g, u_mapGetDistance as p } from "../utils/slu-map.js";
import "../canvas/slu-canvas.js";
import "../canvas/slu-canvas-img.js";
import "../map/canvas-event.js";
import { MapCanvasLayer as m } from "../map/canvas-layer.js";
import "../_virtual/leaflet-src.js";
import "../_virtual/index.js";
import "../leaflet/slu-leaflet-net-map.js";
import { u_mathGetPoint as f } from "../utils/slu-math.js";
class T extends m {
  constructor(t, n) {
    super(t.map, n), this.options = {}, this.info = { zoom: 0 }, this.mapType = l(this.map), this.setLatlng = (i) => {
      const s = this.getLatLngFromEvent(i);
      s && (this.latLng = { lat: s[0], lng: s[1] }, this.info.lat = this.getLatlng(s[0], !1), this.info.lng = this.getLatlng(s[1], !0), this.cb && this.cb(this.info));
    }, Object.assign(this.options, {
      precision: 4,
      pointerEvents: "none"
    }, n), this.eventSwitch(!0);
  }
  init() {
    let t = this.latLng = this.map.getCenter();
    return this.info.lat = this.getLatlng(t.lat, !1), this.info.lng = this.getLatlng(t.lng, !0), this.setZoomAndScale(), this.info;
  }
  setOptions(t) {
    return Object.assign(this.options, t), this.info.lat = this.getLatlng(this.latLng.lat, !1), this.info.lng = this.getLatlng(this.latLng.lng, !0), this.setZoomAndScale(), this.info;
  }
  /**位置等更新时触发 */
  onUpdate(t) {
    return this.cb = t, this;
  }
  eventSwitch(t) {
    let n = t ? "on" : "off";
    t && this.eventSwitch(!1), this.map[n]("mousemove", (i) => this.setLatlng(i)), this.map[n]("zoomend", () => this.setZoomAndScale());
  }
  getLatlng(t, n) {
    let i = "N";
    if (t < 0 && (i = "S"), n) {
      for (i = "E"; t < 0; )
        t = t + 360;
      t = t % 360, t > 180 && (i = "W", t = 360 - t);
    }
    if (t = Math.abs(t), !this.options.ifTran) return f(t, this.options.precision ?? 5) + "°" + i;
    let s = t % 1 * 60, e = (s % 1 * 60).toFixed(2), a = Math.floor(t);
    return s = Math.floor(s), `${a}°${s}'${e}"${i}`;
  }
  setZoomAndScale() {
    if (!this.map) return;
    this.info.zoom = this.getZoom();
    const t = r(this.map);
    let n = g(this.map).w, i = Math.abs(t.lngRight - t.lngLeft), s = (t.latTop + t.latBottom) / 2, e = p([s, 0], [s, i], this.mapType);
    e = e / n * 50;
    let a = "";
    e > 2e3 ? (e = e / 1852, a = " nm") : a = " m";
    let o = e, h = 1;
    for (; o > 10; )
      h = h * 10, o = Math.ceil(o / 10);
    o = Math.ceil(o) * h, this.info.width = 50 * o / e + "px", this.info.scale = o + a, this.cb && this.cb(this.info);
  }
  getZoom() {
    const t = this.map;
    return typeof t.getZoom == "function" ? t.getZoom() : 0;
  }
  getLatLngFromEvent(t) {
    if (!t) return null;
    if (t.latlng) {
      const { lat: n, lng: i } = t.latlng;
      return [n, i];
    }
    if (t.lnglat) {
      const { lat: n, lng: i } = t.lnglat;
      return [n, i];
    }
    return null;
  }
}
export {
  T as MapPluginControl
};
