const m = /* @__PURE__ */ new Map(), M = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map();
function T(a, n, s, o, t) {
  let u = 0;
  const c = Object.assign({});
  for (const e of a) {
    const i = s.get(e) ?? t;
    u += i, c[e] = (c[e] ?? 0) + 1;
  }
  const r = n - u;
  for (const e of Object.keys(c)) {
    const i = c[e], h = s.get(e) ?? t, f = h * i / u, g = r * f * o / i, l = h + g;
    s.set(e, l);
  }
}
function w(a, n) {
  const s = /* @__PURE__ */ new Map();
  let o = 0;
  for (const e of "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,.-+=?") {
    const i = a.measureText(e).width;
    s.set(e, i), o += i;
  }
  const t = o / s.size, u = 3, c = (n / t + u) / (u + 1), r = s.keys();
  for (const e of r)
    s.set(e, (s.get(e) ?? t) * c);
  return s;
}
function d(a, n, s, o) {
  const t = M.get(s);
  if (o && t !== void 0 && t.count > 2e4) {
    let r = z.get(s);
    if (r === void 0 && (r = w(a, t.size), z.set(s, r)), t.count > 5e5) {
      let i = 0;
      for (const h of n)
        i += r.get(h) ?? t.size;
      return i * 1.01;
    }
    const e = a.measureText(n);
    return T(n, e.width, r, Math.max(0.05, 1 - t.count / 2e5), t.size), M.set(s, {
      count: t.count + n.length,
      size: t.size
    }), e.width;
  }
  const u = a.measureText(n), c = u.width / n.length;
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
function C(a, n, s, o, t, u, c, r) {
  if (n.length <= 1) return n.length;
  if (t < s) return -1;
  let e = Math.floor(s / t * u), i = d(a, n.slice(0, Math.max(0, e)), o, c);
  const h = r?.(n);
  if (i !== s) if (i < s) {
    for (; i < s; )
      e++, i = d(a, n.slice(0, Math.max(0, e)), o, c);
    e--;
  } else
    for (; i > s; ) {
      const f = h !== void 0 ? 0 : n.lastIndexOf(" ", e - 1);
      f > 0 ? e = f : e--, i = d(a, n.slice(0, Math.max(0, e)), o, c);
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
function O(a, n, s, o, t, u) {
  const c = `${n}_${s}_${o}px`, r = m.get(c);
  if (r !== void 0) return r;
  if (o <= 0)
    return [];
  let e = [];
  const i = n.split(`
`), h = M.get(s), f = h === void 0 ? n.length : o / h.size * 1.5, g = t && h !== void 0 && h.count > 2e4;
  for (let l of i) {
    let p = d(a, l.slice(0, Math.max(0, f)), s, g), b = Math.min(l.length, f);
    if (p <= o)
      e.push(l);
    else {
      for (; p > o; ) {
        const v = C(a, l, o, s, p, b, g, u), k = l.slice(0, Math.max(0, v));
        l = l.slice(k.length), e.push(k), p = d(a, l.slice(0, Math.max(0, f)), s, g), b = Math.min(l.length, f);
      }
      p > 0 && e.push(l);
    }
  }
  return e = e.map((l, p) => p === 0 ? l.trimEnd() : l.trim()), m.set(c, e), m.size > 500 && m.delete(m.keys().next().value), e;
}
function j() {
  m.clear(), z.clear(), M.clear();
}
export {
  j as u_TextClearMultilineCache,
  O as u_TextSplitMultilineText
};
