const h = class h {
  /**加载需要提前加载的异步图片，保证图片层级正确 */
  static loadImg(t = ["/assets/images/map/map_selected.png"]) {
    t.forEach((e) => this.getImgPromise(e));
  }
  /**绘制图片,默认图片中心点 */
  static async drawImg(t, e) {
    if (t.ifHide === !0) return;
    let { point: i, points: a = [], size: s = [0, 0], url: n, sizeo: r, posX: P = 0, posY: u = 0, left: c = 0, top: p = 0, rotate: o = 0, alpha: O = 1 } = t, m = s[0], l = s[1], I = r && r[0], f = r && r[1], d = this.ImageCache[n] || await this.getImgPromise(n);
    i && (a = [...a, i]);
    for (let g = 0; g < a.length; g++) {
      const w = a[g], X = w[0], Y = w[1];
      o = o * Math.PI / 180, e.globalAlpha = O, e.setTransform(1, 0, 0, 1, X, Y), e.rotate(o), I && f ? e.drawImage(d, P, u, I, f, -m / 2 + c, -l / 2 + p, m, l) : e.drawImage(d, -m / 2 + c, -l / 2 + p, m, l), e.rotate(-o), e.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
  /**根据图片路径地址，获取图片后缓存 , 避免重复请求
  * @param url 图片路径
  */
  static getImgPromise(t) {
    let e = this.ImageCache[t];
    return e ? Promise.resolve(e) : new Promise((i, a) => {
      let s = new Image();
      s.onload = () => {
        this.ImageCache[t] = s, i(s);
      }, s.src = `${t}`;
    });
  }
};
h.ImageCache = /* @__PURE__ */ Object.create(null);
let z = h;
export {
  z as SLUCanvasImg
};
