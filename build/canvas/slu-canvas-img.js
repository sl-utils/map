const g = class g {
  /**加载需要提前加载的异步图片，保证图片层级正确 
   * @param urls 图片路径数组
  */
  static loadImg(s = ["/assets/images/map/map_selected.png"]) {
    s.forEach((e) => this.getImgPromise(e));
  }
  /**绘制图片,默认图片中心点
   * @param img 图片对象
   * @param ctx 画布上下文
   * @returns Promise<void>
   */
  static async drawImg(s, e) {
    if (s.ifHide === !0) return;
    let { point: i, points: a = [], size: t = [0, 0], url: h, sizeo: r, posX: u = 0, posY: X = 0, left: Y = 0, top: M = 0, rotate: O = 0, alpha: b = 1 } = s, o = t[0], l = t[1], n = r && r[0], c = r && r[1], p = -o / 2 + Y, I = -l / 2 + M, d = this.ImageCache[h] || await this.getImgPromise(h);
    i && (a.length ? a.push(i) : a = [i]);
    const f = O * Math.PI / 180, w = Math.cos(f), z = Math.sin(f);
    e.globalAlpha = b;
    for (let m = 0, j = a.length; m < j; m++) {
      const [y, C] = a[m];
      e.save(), e.setTransform(w, z, -z, w, y, C), n && c ? e.drawImage(d, u, X, n, c, p, I, o, l) : e.drawImage(d, p, I, o, l), e.restore();
    }
  }
  /**根据图片路径地址，获取图片后缓存 , 避免重复请求
  * @param url 图片路径
  * @returns Promise<HTMLImageElement>
  */
  static getImgPromise(s) {
    let e = this.ImageCache[s];
    return e ? Promise.resolve(e) : new Promise((i, a) => {
      let t = new Image();
      t.onload = () => {
        this.ImageCache[s] = t, i(t);
      }, t.src = `${s}`;
    });
  }
};
g.ImageCache = /* @__PURE__ */ Object.create(null);
let P = g;
export {
  P as SLUCanvasImg
};
