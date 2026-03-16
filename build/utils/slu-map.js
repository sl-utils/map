import { l as L } from "../_virtual/leaflet-src.js";
const d = 6378245, l = 3.141592653589793, v = 0.006693421622965943, p = l * 3e3 / 180, A = 6378137;
function j(t, e) {
  var n = P(t, e), a = w(n.lng, n.lat);
  return a;
}
function w(t, e) {
  var n = S(t, e), a = t * 2 - n.lng, r = e * 2 - n.lat, s = {
    lng: a,
    lat: r
  };
  return s;
}
function q(t, e) {
  var n = T(t, e), a = E(n.lng, n.lat);
  return a;
}
function T(t, e) {
  var n = y(t - 105, e - 35), a = B(t - 105, e - 35), r = e / 180 * l, s = Math.sin(r);
  s = 1 - v * s * s;
  var o = Math.sqrt(s);
  n = n * 180 / (d * (1 - v) / (s * o) * l), a = a * 180 / (d / o * Math.cos(r) * l);
  var i = e + n, g = t + a, u = {
    lng: g,
    lat: i
  };
  return u;
}
function E(t, e) {
  var n = Math.sqrt(t * t + e * e) + 2e-5 * Math.sin(e * p), a = Math.atan2(e, t) + 3e-6 * Math.cos(t * p), r = n * Math.cos(a) + 65e-4, s = n * Math.sin(a) + 6e-3, o = {
    lng: r,
    lat: s
  };
  return o;
}
function P(t, e) {
  var n = t - 65e-4, a = e - 6e-3, r = Math.sqrt(n * n + a * a) - 2e-5 * Math.sin(a * p), s = Math.atan2(a, n) - 3e-6 * Math.cos(n * p), o = r * Math.cos(s), i = r * Math.sin(s), g = {
    lng: o,
    lat: i
  };
  return g;
}
function S(t, e) {
  var n = y(t - 105, e - 35), a = B(t - 105, e - 35), r = e / 180 * l, s = Math.sin(r);
  s = 1 - v * s * s;
  var o = Math.sqrt(s);
  n = n * 180 / (d * (1 - v) / (s * o) * l), a = a * 180 / (d / o * Math.cos(r) * l);
  var i = e + n, g = t + a, u = {
    lng: g,
    lat: i
  };
  return u;
}
function y(t, e) {
  var n = -100 + 2 * t + 3 * e + 0.2 * e * e + 0.1 * t * e + 0.2 * Math.sqrt(Math.abs(t));
  return n += (20 * Math.sin(6 * t * l) + 20 * Math.sin(2 * t * l)) * 2 / 3, n += (20 * Math.sin(e * l) + 40 * Math.sin(e / 3 * l)) * 2 / 3, n += (160 * Math.sin(e / 12 * l) + 320 * Math.sin(e * l / 30)) * 2 / 3, n;
}
function B(t, e) {
  var n = 300 + t + 2 * e + 0.1 * t * t + 0.1 * t * e + 0.1 * Math.sqrt(Math.abs(t));
  return n += (20 * Math.sin(6 * t * l) + 20 * Math.sin(2 * t * l)) * 2 / 3, n += (20 * Math.sin(t * l) + 40 * Math.sin(t / 3 * l)) * 2 / 3, n += (150 * Math.sin(t / 12 * l) + 300 * Math.sin(t / 30 * l)) * 2 / 3, n;
}
function I(t, e, n) {
  let [a, r] = f(t, e), [s, o] = f(t, n), i = Math.atan2(o - r, s - a);
  return i = i * 180 / Math.PI, i = 90 + i < 0 ? 450 + i : 90 + i, i;
}
function N(t) {
  const e = m(t);
  if (e == 0) {
    let n = t.getBounds();
    return {
      lngLeft: n.getSouthWest().lng,
      latTop: n.getNorthEast().lat,
      lngRight: n.getNorthEast().lng,
      latBottom: n.getSouthWest().lat
    };
  } else if (e == 1) {
    let { southwest: n, northeast: a } = t.getBounds();
    return {
      lngLeft: n.lng,
      latTop: a.lat,
      lngRight: a.lng,
      latBottom: n.lat
    };
  }
  throw new Error("百度地图暂时不支持！");
}
function F(t) {
  let e = Number(t);
  return 2 * Math.asin(e / (2 * A)) * (180 / Math.PI);
}
function G(t, e, n) {
  let [a, r] = t, [s, o] = e, i = 0;
  return n && AMap && AMap.GeometryUtil ? i = AMap.GeometryUtil.distance([r, a], [o, s]) : i = L.latLng(t).distanceTo(e), i;
}
function C(t, e) {
  if (!e) return [0, 0];
  let n;
  return t instanceof L.Map ? n = t.containerPointToLatLng(e) : n = t.containerToLngLat(new AMap.Pixel(e[0], e[1])), [n.lat, n.lng];
}
function x(t, e = 100, n) {
  if (n.length === 0)
    return 0;
  let a = t instanceof L.Map ? 0 : 1, r = 1e-5, s = n.map((u) => u[0]).reduce((u, c) => u + c) / n.length, o = [s, 100], i = [s, 100 + r], g = G(o, i, a);
  return e / g * r;
}
function f(t, e) {
  if (!e) return [-1e3, -1e3];
  let [n = 90, a = 180] = e, r;
  return isNaN(n) || isNaN(a) ? [-1e3, -1e3] : (t.latLngToContainerPoint ? r = t.latLngToContainerPoint([n, a]) : r = t.lngLatToContainer([a, n]), [r.x, r.y]);
}
function R(t, e) {
  return e?.map((n) => f(t, n)) || [];
}
function V(t, e) {
  let { sizeFix: n, latlng: a, size: r = [0, 0] } = e;
  if (!n || !a)
    return Array.isArray(r) || (r = [r, r]), r;
  let s = Array.isArray(n) ? n : [n, n], [o, i] = a, g = x(t, s[1], [a]), [u, c] = f(t, [o, i]), [M, h] = f(t, [o, i + g]), _ = Math.abs(M - u), b = _ * s[1] / s[0];
  return [_, b];
}
function Z(t) {
  let e = t.getSize(), { x: n, y: a, width: r, height: s } = e;
  return {
    w: n || r,
    h: a || s
  };
}
function U(t, e) {
  let n, a, r, s;
  if (s = t.type, e == 0) {
    const { latlng: o, originalEvent: i, containerPoint: g } = t = t, { lat: u, lng: c } = o;
    n = { lat: u, lng: c };
    const { x: M, y: h } = g;
    a = { x: M, y: h }, r = i;
  } else if (e == 1) {
    const { pixel: o, originEvent: i, lnglat: g } = t = t, { lat: u, lng: c } = g;
    n = { lat: u, lng: c };
    const { x: M, y: h } = o;
    a = { x: M, y: h }, r = i;
  }
  return {
    type: s,
    latlng: n,
    containerPoint: a,
    orginDOMEvent: r,
    orginMapEvent: t
  };
}
function W(t, e, n) {
  let a = t;
  const r = a.setStatus ? a : void 0, s = a.dragging ? a : void 0;
  e === "dragEnable" && (s ? n ? s.dragging.enable() : s.dragging.disable() : r && r.setStatus({ dragEnable: n }));
}
function m(t) {
  return t instanceof L.Map ? 0 : t instanceof AMap.Map ? 1 : 2;
}
function O(t, e, n, a) {
  const r = m(t);
  if (a) {
    const s = f(t, e);
    e = C(t, [s[0] + a[0], s[1] + a[1]]);
  }
  if (r == 0)
    t = t, t.setView(e, n);
  else if (r == 1)
    t = t, t.setCenter(e.reverse()), t.setZoom(n);
  else
    throw new Error("百度地图暂时不支持！");
}
function H(t, e, n) {
  const a = m(t);
  let r, s;
  if (!(e.length == 0 || !e)) {
    if (z(e)) {
      let o = Math.max(...e.map((c) => c[0])), i = Math.min(...e.map((c) => c[0])), g = Math.max(...e.map((c) => c[1])), u = Math.min(...e.map((c) => c[1]));
      r = [i, u], s = [o, g];
    } else
      r = e, s = n;
    if (a == 0)
      t = t, t.fitBounds([r, s]);
    else if (a == 1) {
      t = t;
      const o = new AMap.Bounds(r.reverse(), s.reverse()), [i, g] = t.getFitZoomAndCenterByBounds(o);
      t.setZoomAndCenter(i, g);
    }
  }
}
function z(t) {
  return t && Array.isArray(t[0]);
}
function J(t, e, n) {
  if (Array.isArray(t) && t.length > 0) {
    let a;
    n ? a = t.findIndex((r) => r == e || r[n] == e[n]) : a = t.findIndex((r) => r == e), a >= 0 && t.splice(a, 1);
  }
  return t || [];
}
export {
  J as u_arrItemDel,
  I as u_mapGetAngle,
  N as u_mapGetBounds,
  F as u_mapGetDiffLatitude,
  G as u_mapGetDistance,
  C as u_mapGetLatLngByPoint,
  x as u_mapGetLngDiffByDistance,
  U as u_mapGetMapMouseEvent,
  Z as u_mapGetMapSize,
  m as u_mapGetMapType,
  f as u_mapGetPointByLatlng,
  R as u_mapGetPointsByLatlngs,
  V as u_mapGetSizeByMap,
  H as u_mapSetFitBounds,
  W as u_mapSetMapStatus,
  O as u_mapSetViewCenter,
  P as u_mapTobd09cj02,
  j as u_mapTobd09gps84,
  E as u_mapTogcj02bd09,
  w as u_mapTogcj02gps84,
  q as u_mapTogps84bd09,
  T as u_mapTogps84gcj02
};
