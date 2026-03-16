function s(t) {
  return t.length = 0, t;
}
function u(t) {
  return Array.isArray ? Array.isArray(t) : Object.prototype.toString.call(t) === "[object Array]";
}
function l(t) {
  return u(t) && t.length > 0;
}
function r(t, o, n) {
  if (u(t) && l(o) && n !== void 0) {
    let c = t.slice(0, n + 1), i = t.slice(n + 1);
    s(t), c.forEach((e) => t.push(e)), o.forEach((e) => t.push(e)), i.forEach((e) => t.push(e));
  }
  return t;
}
export {
  r as u_arrAddItemsIndex
};
