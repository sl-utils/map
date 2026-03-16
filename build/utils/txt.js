const m = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map();
function T(l, n, s, o, t) {
  let u = 0;
  const c = {};
  for (const e of l) {
    const i = s.get(e) ?? t;
    u += i, c[e] = (c[e] ?? 0) + 1;
  }
  const r = n - u;
  for (const e of Object.keys(c)) {
    const i = c[e], h = s.get(e) ?? t, f = h * i / u, g = r * f * o / i, a = h + g;
    s.set(e, a);
  }
}
function w(l, n) {
  const s = /* @__PURE__ */ new Map();
  let o = 0;
  for (const e of "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,.-+=?") {
    const i = l.measureText(e).width;
    s.set(e, i), o += i;
  }
  const t = o / s.size, u = 3, c = (n / t + u) / (u + 1), r = s.keys();
  for (const e of r)
    s.set(e, (s.get(e) ?? t) * c);
  return s;
}
function d(l, n, s, o) {
  const t = M.get(s);
  if (o && t !== void 0 && t.count > 2e4) {
    let r = z.get(s);
    if (r === void 0 && (r = w(l, t.size), z.set(s, r)), t.count > 5e5) {
      let i = 0;
      for (const h of n)
        i += r.get(h) ?? t.size;
      return i * 1.01;
    }
    const e = l.measureText(n);
    return T(n, e.width, r, Math.max(0.05, 1 - t.count / 2e5), t.size), M.set(s, {
      count: t.count + n.length,
      size: t.size
    }), e.width;
  }
  const u = l.measureText(n), c = u.width / n.length;
  if ((t?.count ?? 0) > 2e4)
    return u.width;
  if (t === void 0)
    M.set(s, {
      count: n.length,
      size: c
    });
  else {
    const r = c - t.size, e = n.length / (t.count + n.length), i = t.size + r * e;
    M.set(s, {
      count: t.count + n.length,
      size: i
    });
  }
  return u.width;
}
function C(l, n, s, o, t, u, c, r) {
  if (n.length <= 1) return n.length;
  if (t < s) return -1;
  let e = Math.floor(s / t * u), i = d(l, n.slice(0, Math.max(0, e)), o, c);
  const h = r?.(n);
  if (i !== s) if (i < s) {
    for (; i < s; )
      e++, i = d(l, n.slice(0, Math.max(0, e)), o, c);
    e--;
  } else
    for (; i > s; ) {
      const f = h !== void 0 ? 0 : n.lastIndexOf(" ", e - 1);
      f > 0 ? e = f : e--, i = d(l, n.slice(0, Math.max(0, e)), o, c);
    }
  if (n[e] !== " ") {
    let f = 0;
    if (h === void 0)
      f = n.lastIndexOf(" ", e);
    else
      for (const g of h) {
        if (g > e) break;
        f = g;
      }
    f > 0 && (e = f);
  }
  return e;
}
function L(l, n, s, o, t, u) {
  const c = `${n}_${s}_${o}px`, r = m.get(c);
  if (r !== void 0) return r;
  if (o <= 0)
    return [];
  let e = [];
  const i = n.split(`
`), h = M.get(s), f = h === void 0 ? n.length : o / h.size * 1.5, g = t && h !== void 0 && h.count > 2e4;
  for (let a of i) {
    let p = d(l, a.slice(0, Math.max(0, f)), s, g), b = Math.min(a.length, f);
    if (p <= o)
      e.push(a);
    else {
      for (; p > o; ) {
        const v = C(l, a, o, s, p, b, g, u), k = a.slice(0, Math.max(0, v));
        a = a.slice(k.length), e.push(k), p = d(l, a.slice(0, Math.max(0, f)), s, g), b = Math.min(a.length, f);
      }
      p > 0 && e.push(a);
    }
  }
  return e = e.map((a, p) => p === 0 ? a.trimEnd() : a.trim()), m.set(c, e), m.size > 500 && m.delete(m.keys().next().value), e;
}
function O() {
  m.clear(), z.clear(), M.clear();
}
export {
  O as u_TextClearMultilineCache,
  L as u_TextSplitMultilineText
};
