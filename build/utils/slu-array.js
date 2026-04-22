function i(t) {
  return Array.isArray ? Array.isArray(t) : Object.prototype.toString.call(t) === "[object Array]";
}
function u(t) {
  return i(t) && t.length > 0;
}
function c(t, o, n) {
  if (u(o) && n !== void 0) {
    let r = t.slice(0, n + 1), s = t.slice(n + 1);
    t.length = 0, r.forEach((e) => t.push(e)), o.forEach((e) => t.push(e)), s.forEach((e) => t.push(e));
  }
  return t;
}
export {
  c as u_arrAddItemsIndex
};
