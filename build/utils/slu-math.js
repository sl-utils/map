function y(r, n = 2, o = 0) {
  let e = r * Math.pow(10, n);
  return e = o == 0 ? Math.round(e) : o == 1 ? Math.floor(e) : Math.ceil(e), e / Math.pow(10, n);
}
function M(r, n, o, e) {
  const [a, c] = n, [i, h] = e, [u, P] = o, t = r;
  let l = (1 - t) * (1 - t) * a + 2 * t * (1 - t) * i + t * t * u, x = (1 - t) * (1 - t) * c + 2 * t * (1 - t) * h + t * t * P;
  return [l, x];
}
export {
  M as u_mathGetBezierPointByPercent,
  y as u_mathGetPoint
};
