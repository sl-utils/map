import { l as b } from "../_virtual/leaflet-src.js";
import { MAP_EVENT as S } from "../const/index.js";
import { u_mathGetPoint as x } from "./slu-math.js";
import { m as w } from "../_virtual/maplibre-gl.js";
const y = 6378245, u = 3.141592653589793, _ = 0.006693421622965943, m = u * 3e3 / 180, j = 6378137;
function U(t, n) {
  const e = v(t, n);
  return I(e.lng, e.lat);
}
function I(t, n) {
  const e = N(t, n), s = t * 2 - e.lng, a = n * 2 - e.lat;
  return {
    lng: s,
    lat: a
  };
}
function H(t, n) {
  const e = z(t, n);
  return D(e.lng, e.lat);
}
function z(t, n) {
  let e = B(t - 105, n - 35), s = A(t - 105, n - 35);
  const a = n / 180 * u;
  let i = Math.sin(a);
  i = 1 - _ * i * i;
  const r = Math.sqrt(i);
  e = e * 180 / (y * (1 - _) / (i * r) * u), s = s * 180 / (y / r * Math.cos(a) * u);
  const o = n + e;
  return {
    lng: t + s,
    lat: o
  };
}
function D(t, n) {
  const e = Math.sqrt(t * t + n * n) + 2e-5 * Math.sin(n * m), s = Math.atan2(n, t) + 3e-6 * Math.cos(t * m), a = e * Math.cos(s) + 65e-4, i = e * Math.sin(s) + 6e-3;
  return {
    lng: a,
    lat: i
  };
}
function v(t, n) {
  const e = t - 65e-4, s = n - 6e-3, a = Math.sqrt(e * e + s * s) - 2e-5 * Math.sin(s * m), i = Math.atan2(s, e) - 3e-6 * Math.cos(e * m), r = a * Math.cos(i), o = a * Math.sin(i);
  return {
    lng: r,
    lat: o
  };
}
function N(t, n) {
  let e = B(t - 105, n - 35), s = A(t - 105, n - 35);
  const a = n / 180 * u;
  let i = Math.sin(a);
  i = 1 - _ * i * i;
  const r = Math.sqrt(i);
  e = e * 180 / (y * (1 - _) / (i * r) * u), s = s * 180 / (y / r * Math.cos(a) * u);
  const o = n + e;
  return {
    lng: t + s,
    lat: o
  };
}
function B(t, n) {
  let e = -100 + 2 * t + 3 * n + 0.2 * n * n + 0.1 * t * n + 0.2 * Math.sqrt(Math.abs(t));
  return e += (20 * Math.sin(6 * t * u) + 20 * Math.sin(2 * t * u)) * 2 / 3, e += (20 * Math.sin(n * u) + 40 * Math.sin(n / 3 * u)) * 2 / 3, e += (160 * Math.sin(n / 12 * u) + 320 * Math.sin(n * u / 30)) * 2 / 3, e;
}
function A(t, n) {
  let e = 300 + t + 2 * n + 0.1 * t * t + 0.1 * t * n + 0.1 * Math.sqrt(Math.abs(t));
  return e += (20 * Math.sin(6 * t * u) + 20 * Math.sin(2 * t * u)) * 2 / 3, e += (20 * Math.sin(t * u) + 40 * Math.sin(t / 3 * u)) * 2 / 3, e += (150 * Math.sin(t / 12 * u) + 300 * Math.sin(t / 30 * u)) * 2 / 3, e;
}
function J(t, n, e) {
  let [s, a] = M(t, n), [i, r] = M(t, e), o = Math.atan2(r - a, i - s);
  return o = o * 180 / Math.PI, o = 90 + o < 0 ? 450 + o : 90 + o, o;
}
function Q(t) {
  if (f(t)) {
    let n = t.getBounds();
    return {
      lngLeft: n.getSouthWest().lng,
      latTop: n.getNorthEast().lat,
      lngRight: n.getNorthEast().lng,
      latBottom: n.getSouthWest().lat
    };
  } else if (d(t)) {
    let { southwest: n, northeast: e } = t.getBounds();
    return {
      lngLeft: n.lng,
      latTop: e.lat,
      lngRight: e.lng,
      latBottom: n.lat
    };
  } else if (g(t)) {
    const n = t.getBounds();
    return {
      lngLeft: n.getWest(),
      lngRight: n.getEast(),
      latBottom: n.getSouth(),
      latTop: n.getNorth()
    };
  }
  throw new Error("百度地图暂时不支持！");
}
function X(t) {
  let n = Number(t);
  return 2 * Math.asin(n / (2 * j)) * (180 / Math.PI);
}
function q(t, n, e) {
  let [s, a] = t, [i, r] = n, o = 0;
  if (f(e))
    o = b.latLng(t).distanceTo(n);
  else if (d(e))
    o = AMap.GeometryUtil.distance([a, s], [r, i]);
  else if (g(e)) {
    const c = new w.LngLat(t[1], t[0]), l = new w.LngLat(n[1], n[0]);
    o = c.distanceTo(l);
  } else
    o = 0;
  return o;
}
function V(t, n) {
  if (!n) return [0, 0];
  let e;
  return f(t) ? e = t.containerPointToLatLng(n) : g(t) ? e = t.unproject(n) : e = t.containerToLngLat(new AMap.Pixel(n[0], n[1])), [e.lat, e.lng];
}
function F(t, n = 100, e) {
  if (e.length === 0)
    return 0;
  let s = 1e-5, a = e.map((c) => c[0]).reduce((c, l) => c + l) / e.length, i = [a, 100], r = [a, 100 + s], o = q(i, r, t);
  return n / o * s;
}
function M(t, n) {
  if (!n) return [-1e3, -1e3];
  let [e = 90, s = 180] = n, a;
  if (isNaN(e) || isNaN(s)) return [-1e3, -1e3];
  if (f(t))
    a = t.latLngToContainerPoint([e, s]);
  else if (d(t))
    a = t.lngLatToContainer([s, e]);
  else if (g(t))
    a = t.project([s, e]);
  else
    throw new Error("百度地图暂时不支持！");
  return [a.x, a.y];
}
function Y(t, n) {
  return n?.map((e) => M(t, e)) || [];
}
function k(t, n) {
  let { sizeFix: e, latlng: s, size: a = [0, 0] } = n;
  if (!e || !s)
    return Array.isArray(a) || (a = [a, a]), a;
  let i = Array.isArray(e) ? e : [e, e], [r, o] = s, c = F(t, i[1], [s]), [l, L] = M(t, [r, o]), [h, p] = M(t, [r, o + c]), E = Math.abs(h - l), G = E * i[1] / i[0];
  return [E, G];
}
function tt(t) {
  let n, e;
  if (g(t)) {
    const a = t.getCanvas().getBoundingClientRect();
    n = a.width, e = a.height;
  } else {
    let s = t.getSize(), { x: a, y: i, width: r, height: o } = s;
    n = a || r, e = i || o;
  }
  return { w: n, h: e };
}
function nt(t, n) {
  let e, s, a, i;
  if (R(t.type), i = t.type, f(n) && C(t)) {
    const { latlng: r, originalEvent: o, containerPoint: c } = t, { lat: l, lng: L } = r;
    e = { lat: l, lng: L };
    const { x: h, y: p } = c;
    s = { x: h, y: p }, a = o;
  } else if (d(n) && T(t)) {
    const { pixel: r, originEvent: o, lnglat: c } = t, { lat: l, lng: L } = c;
    e = { lat: l, lng: L };
    const { x: h, y: p } = r;
    s = { x: h, y: p }, a = o;
  } else if (g(n) && P(t)) {
    const { lat: r, lng: o } = t.lngLat;
    e = { lat: r, lng: o }, s = t.point, a = t.originalEvent;
  } else
    throw new Error("百度地图暂时不支持！");
  return {
    type: i,
    latlng: e,
    containerPoint: s,
    orginDOMEvent: a,
    orginMapEvent: t
  };
}
function et(t, n, e) {
  n === "dragEnable" && (f(t) ? e ? t.dragging.enable() : t.dragging.disable() : d(t) ? t.setStatus({ dragEnable: e }) : g(t) && (e ? t.dragPan.enable() : t.dragPan.disable()));
}
function st(t, n, e, s) {
  if (s) {
    const a = M(t, n);
    n = V(t, [a[0] + s[0], a[1] + s[1]]);
  }
  if (f(t))
    t.setView(n, e);
  else if (d(t) || g(t)) {
    const [a, i] = n, r = [i, a];
    t.setCenter(r), t.setZoom(e);
  } else
    throw new Error("百度地图暂时不支持！");
}
function at(t, n, e) {
  let s, a;
  if (!(n.length == 0 || !n)) {
    if (O(n)) {
      let i = Math.max(...n.map((l) => l[0])), r = Math.min(...n.map((l) => l[0])), o = Math.max(...n.map((l) => l[1])), c = Math.min(...n.map((l) => l[1]));
      s = [r, c], a = [i, o];
    } else
      s = n, a = e;
    if (f(t))
      t.fitBounds([s, a]);
    else if (d(t)) {
      const i = new AMap.Bounds(s.reverse(), a.reverse()), [r, o] = t.getFitZoomAndCenterByBounds(i);
      t.setZoomAndCenter(r, o);
    } else if (g(t)) {
      const i = [
        [s[1], s[0]],
        [a[1], a[0]]
      ];
      t.fitBounds(i, { padding: 100, duration: 0 });
    }
  }
}
function it(t, n, e) {
  let s = "N";
  if (t < 0 && (s = "S"), n) {
    for (s = "E"; t < 0; )
      t = t + 360;
    t = t % 360, t > 180 && (s = "W", t = 360 - t);
  }
  if (t = Math.abs(t), !e) return x(t, 5) + "°" + s;
  let a = t % 1 * 60, i = (a % 1 * 60).toFixed(2), r = Math.floor(t);
  return a = Math.floor(a), `${r}°${a}'${i}"${s}`;
}
function ot(t) {
  if (!t) return null;
  if (C(t)) {
    const { lat: n, lng: e } = t.latlng;
    return [n, e];
  } else if (T(t)) {
    const { lat: n, lng: e } = t.lnglat;
    return [n, e];
  } else if (P(t)) {
    const { lat: n, lng: e } = t.lngLat;
    return [n, e];
  }
  return null;
}
function rt(t, n, e) {
  if (Array.isArray(t) && t.length > 0) {
    let s;
    e ? s = t.findIndex((a) => a == n || a[e] == n[e]) : s = t.findIndex((a) => a == n), s >= 0 && t.splice(s, 1);
  }
  return t || [];
}
function O(t) {
  return t && Array.isArray(t[0]);
}
function lt(t) {
  return t && Array.isArray(t) && t.length == 2;
}
function f(t) {
  try {
    return t instanceof b.Map;
  } catch {
    return !1;
  }
}
function d(t) {
  try {
    return t instanceof AMap.Map;
  } catch {
    return !1;
  }
}
function g(t) {
  try {
    return t instanceof w.Map;
  } catch {
    return !1;
  }
}
function ut(t) {
  try {
    return !1;
  } catch {
    return !1;
  }
}
function C(t) {
  return t && "latlng" in t && "containerPoint" in t;
}
function T(t) {
  return t && "lnglat" in t && "pixel" in t;
}
function P(t) {
  return t && "lngLat" in t && "point" in t;
}
function ct(t) {
  return t instanceof b.Layer;
}
function gt(t) {
  return t instanceof AMap.CustomLayer;
}
function ft(t) {
  return t && typeof t == "object" && "id" in t && "render" in t && "type" in t;
}
function dt(t, n) {
  return n in t;
}
function R(t) {
  if (!(t in S))
    throw new Error(`Invalid MapEventType: ${t}`);
}
export {
  rt as u_arrItemDel,
  J as u_mapGetAngle,
  Q as u_mapGetBounds,
  X as u_mapGetDiffLatitude,
  q as u_mapGetDistance,
  ot as u_mapGetLatLngByEvent,
  V as u_mapGetLatLngByPoint,
  it as u_mapGetLatlngByValue,
  F as u_mapGetLngDiffByDistance,
  nt as u_mapGetMapMouseEvent,
  tt as u_mapGetMapSize,
  M as u_mapGetPointByLatlng,
  Y as u_mapGetPointsByLatlngs,
  k as u_mapGetSizeByMap,
  at as u_mapSetFitBounds,
  et as u_mapSetMapStatus,
  st as u_mapSetViewCenter,
  v as u_mapTobd09cj02,
  U as u_mapTobd09gps84,
  D as u_mapTogcj02bd09,
  I as u_mapTogcj02gps84,
  H as u_mapTogps84bd09,
  z as u_mapTogps84gcj02,
  T as u_tsEventisAmap,
  C as u_tsEventisLeaflet,
  P as u_tsEventisMapLibre,
  lt as u_tsIfOneArrTwoLen,
  dt as u_tsIsKeyOf,
  R as u_tsIsMapEventType,
  gt as u_tsLayerisAmap,
  ct as u_tsLayerisLeaflet,
  ft as u_tsLayerisMapLibre,
  d as u_tsMapisAmap,
  ut as u_tsMapisBaidu,
  f as u_tsMapisLeaflet,
  g as u_tsMapisMapLibre
};
