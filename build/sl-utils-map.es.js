const Ln = class Ln {
  /**canvas画布的工具类*/
  constructor() {
  }
  /**绘制小圆点 */
  static drawArc(t, e = this.ctx) {
    if (t.ifHide === !0) return this;
    let { point: a, points: r = [], size: o = 10 } = t;
    a && (r = [...r, a]), this.setCtxPara(e, t);
    for (let l = 0, u = r.length; l < u; l++) {
      e.beginPath();
      const c = r[l];
      e.arc(c[0], c[1], o, 0, 2 * Math.PI, !1), e.stroke(), e.globalAlpha = t.fillAlpha == null ? 1 : t.fillAlpha, e.fill();
    }
    return this.setCtxPara(e), this;
  }
  /**绘制矩形 */
  static drawRect(t, e = this.ctx) {
    if (t.ifHide === !0) return this;
    let { point: a, points: r = [a], width: o = 0, height: l = 0, radius: u = [0, 0, 0, 0] } = t;
    this.setCtxPara(e, t);
    for (let c = 0; c < r.length; c++) {
      let [d, g] = r[c] || [0, 0];
      e.beginPath(), e.roundRect(d, g, o, l, u), e.stroke(), e.globalAlpha = t.fillAlpha == null ? 1 : t.fillAlpha, e.fill(), e.closePath();
    }
    return this.setCtxPara(e), this;
  }
  /**画绘制多边形*/
  static drawPolygon(t, e = this.ctx) {
    let { points: a = [] } = t;
    if (t.ifHide === !0 || a.length < 2) return this;
    this.setCtxPara(e, t);
    for (let r = 0, o = a.length; r < o; r++) {
      let [l, u] = a[r];
      r == 0 ? (e.beginPath(), e.moveTo(l, u)) : r == o - 1 ? (e.lineTo(l, u), e.closePath(), e.globalAlpha = t.fillAlpha == null ? 1 : t.fillAlpha, e.fill(), e.lineWidth > 0 && (e.globalAlpha = t.alpha || 1, e.stroke())) : e.lineTo(l, u);
    }
    return this.setCtxPara(e), this;
  }
  /**画线*/
  static drawLine(t, e = this.ctx) {
    if (t.ifHide === !0) return this;
    let { points: a = [] } = t;
    if (a.length < 2) return this;
    this.setCtxPara(e, t);
    let r = a[0] || [];
    t.widthLine, e.beginPath(), e.moveTo(r[0], r[1]);
    for (let o = 1, l = a.length; o < l; o++) {
      let u = a[o];
      e.lineTo(u[0], u[1]);
    }
    return e.stroke(), this.setCtxPara(e), this;
  }
  /**画贝塞尔曲线*/
  static drawBezierLine(t, e = this.ctx) {
    if (t.ifHide === !0) return this;
    let { points: a = [] } = t;
    if (a.length < 2) return this;
    this.setCtxPara(e, t);
    let r = a[0], o = t.degree;
    e.beginPath(), e.moveTo(r[0], r[1]);
    for (let l = 1, u = a.length; l < u; l++) {
      let c = a[l - 1], d = a[l], g = this.getBezierCtrlPoint(c, d, o);
      e.quadraticCurveTo(g[0], g[1], d[0], d[1]);
    }
    return e.stroke(), this.setCtxPara(e), this;
  }
  /**创建一个画布 */
  static createCanvas() {
    return document.createElement("canvas");
  }
  /**获取贝塞尔曲线的控制点
   * @param s:起点
   * @param e:终点
   * @param degree：曲度等级（越大越弯曲）
   */
  static getBezierCtrlPoint(t, e, a = 1) {
    const r = t, o = e, l = [(r[0] + o[0]) / 2, (r[1] + o[1]) / 2], u = a;
    let c = l[0] - r[0], d = l[1] - r[1], g = Math.sqrt(c * c + d * d), m = Math.PI / 2 - Math.asin(d / g), p = u * Math.cos(m) * g, y = u * Math.sin(m) * g * c / Math.abs(c);
    return p = isNaN(p) ? 0 : p, y = isNaN(y) ? 0 : y, [l[0] + p, l[1] - y];
  }
  /**设置画布的相关配置
   * @param fig 画布属性配置
   * @param ctx 2D画布渲染上下文
   */
  static setCtxPara(t, e = {}) {
    return this.ctx = t, this.deletePara(e), e = Object.assign({}, this.ctxFig, e), t.globalAlpha = e.alpha, t.globalCompositeOperation = e.globalCompositeOperation, t.fillStyle = e.colorFill, t.strokeStyle = e.colorLine, t.lineWidth = e.widthLine, t.shadowColor = e.shadowColor, t.shadowBlur = e.shadowBlur, t.font = e.font, t.textBaseline = e.textBaseline, t.setLineDash(e.dash), t.lineDashOffset = e.dashOff, t;
  }
  /**移除掉值为 undefined 或 null 的属性，方便赋值 */
  static deletePara(t = {}) {
    for (const e in t)
      if (Object.prototype.hasOwnProperty.call(t, e)) {
        const a = t[e];
        a == null && Reflect.deleteProperty(t, e);
      }
  }
};
Ln.ctxFig = {
  alpha: 1,
  widthLine: 1,
  colorLine: "#FFFFFF",
  colorFill: "#EE3434",
  dash: [10, 0],
  dashOff: 0,
  fillAlpha: 1,
  font: "14px serif",
  textBaseline: "top",
  globalCompositeOperation: "source-over",
  shadowBlur: 0,
  shadowColor: "#000000"
};
let ht = Ln;
class bh {
  constructor() {
    this.canvasTool = document.createElement("canvas"), this.LAST_DISPOSA_METHOD = null, this.CURRENT_FRAME_INDEX = -1, this.TRANSPARENCY = null, this.gifCache = {}, this.aniIds = {}, this.opts = [];
  }
  /**加载gif并进行缓存 , 避免重复请求 url */
  async loadGIF(t, e) {
    let { url: a } = t, r = this.gifCache[a];
    if (this.CTX = e, r)
      r.status === 1 ? (this.opts.push(t), clearTimeout(this.timeId), this.timeId = setTimeout(() => {
        console.log(this.opts);
        let o = this.opts;
        this.opts = [], o.forEach((l) => this.loadGIF(l, this.CTX));
      }, 100)) : r.status === 2 && (this.stopGif(t), this.playGif(t));
    else {
      this.gifCache[a] = { status: 0, data: null, frameList: [] }, r = this.gifCache[a];
      try {
        r.status = 1;
        const o = await this.fetchGIF(a), l = new Eh(o);
        r.status = 2, this.parseHeader(a, l), this.parseBlock(t, l);
      } catch (o) {
        console.error("Error loading GIF:", o);
      }
    }
  }
  fetchGIF(t) {
    return new Promise((e, a) => {
      const r = new XMLHttpRequest();
      r.open("GET", t, !0), "overrideMimeType" in r && r.overrideMimeType("text/plain; charset=x-user-defined"), r.onload = () => {
        if (r.status === 200) {
          const o = r.response;
          o.toString().indexOf("ArrayBuffer") > 0 ? e(new Uint8Array(o)) : e(o);
        } else
          a(new Error("XHR Error - Response"));
      }, r.onerror = () => {
        a(new Error("XHR Error"));
      }, r.send();
    });
  }
  /**解析数据流头部并设置工具canvas的宽高 */
  parseHeader(t, e) {
    let a = e, r = this.gifInfo = /* @__PURE__ */ Object.create(null), o = this.canvasTool;
    if (r.sig = a.read(3), r.ver = a.read(3), r.sig !== "GIF") throw new Error("Not a GIF file.");
    r.width = a.readUnsigned(), r.height = a.readUnsigned();
    let l = this.byteToBitArr(a.readByte());
    r.gctFlag = !!l.shift(), r.colorRes = this.bitsToNum(l.splice(0, 3)), r.sorted = !!l.shift(), r.gctSize = this.bitsToNum(l.splice(0, 3)), r.bgColor = a.readByte(), r.pixelAspectRatio = a.readByte(), r.gctFlag && (r.gct = this.parseCT(1 << r.gctSize + 1, e)), o.width = r.width, o.height = r.height, o.style.width = r.width + "px", o.style.height = r.height + "px", o.getContext("2d").setTransform(1, 0, 0, 1, 0, 0);
  }
  /**解析内容块 */
  parseBlock(t, e) {
    let a = /* @__PURE__ */ Object.create(null), r = e;
    switch (a.sentinel = r.readByte(), String.fromCharCode(a.sentinel)) {
      // For ease of matching
      case "!":
        a.type = "ext", this.parseExt(a, e, t.url);
        break;
      case ",":
        a.type = "img", this.parseImg(a, e, t.url);
        break;
      case ";":
        a.type = "eof", this.playGif(t);
        break;
      default:
        throw new Error("Unknown block: 0x" + a.sentinel.toString(16));
    }
    a.type !== "eof" && this.parseBlock(t, e);
  }
  /**播放gif */
  playGif(t, e = 0) {
    const a = this, { delay: r = 0 } = t, { frameList: o } = a.gifCache[t.url], l = o.length;
    let u;
    const c = (d) => {
      u === void 0 && (u = d), d - (u || d) >= r && (u = d, e++, e >= l && (e = 0)), a.drawFrame(t, e), a.aniIds[t.id] = requestAnimationFrame(c);
    };
    a.aniIds[t.id] = requestAnimationFrame(c);
  }
  /**绘制每一帧 */
  drawFrame(t, e) {
    const a = this, r = a.CTX;
    let { point: o, points: l = [], size: u = [100, 100], url: c, sizeo: d, posX: g = 0, posY: m = 0, left: p = 0, top: y = 0, rotate: M = 0, alpha: w = 1, delay: P } = t, { frameList: E } = a.gifCache[t.url];
    a.canvasTool.getContext("2d").putImageData(E[e].data, 0, 0);
    let A = a.canvasTool, T = u[0], G = u[1], R = d && d[0], z = d && d[1];
    o && (l = [...l, o]);
    for (let Z = 0; Z < l.length; Z++) {
      const X = l[Z], F = X[0], Y = X[1];
      M = M * Math.PI / 180, r.globalAlpha = w, r.setTransform(1, 0, 0, 1, F, Y), r.rotate(M), R && z ? r.drawImage(A, g, m, R, z, -T / 2 + p, -G / 2 + y, T, G) : r.drawImage(A, -T / 2 + p, -G / 2 + y, T, G), r.rotate(-M), r.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
  /**关闭之前的定时动画 */
  stopGif(t) {
    const e = this, a = e.aniIds[t.id];
    a && (cancelAnimationFrame(a), e.aniIds[t.id] = null);
  }
  // 解析
  parseExt(t, e, a) {
    let r = e, o = (g) => {
      r.readByte();
      var m = this.byteToBitArr(r.readByte());
      g.reserved = m.splice(0, 3), g.disposalMethod = this.bitsToNum(m.splice(0, 3)), this.LAST_DISPOSA_METHOD = g.disposalMethod, g.userInput = m.shift(), g.transparencyGiven = m.shift(), g.delayTime = r.readUnsigned(), g.transparencyIndex = r.readByte(), g.terminator = r.readByte(), this.pushFrame(g.delayTime, a), this.TRANSPARENCY = g.transparencyGiven ? g.transparencyIndex : null;
    }, l = (g) => {
      g.comment = this.readSubBlocks(e);
    }, u = (g) => {
      r.readByte(), g.ptHeader = r.readBytes(12), g.ptData = this.readSubBlocks(e);
    }, c = (g) => {
      var m = function(y) {
        r.readByte(), y.unknown = r.readByte(), y.iterations = r.readUnsigned(), y.terminator = r.readByte();
      }, p = (y) => {
        y.appData = this.readSubBlocks(e);
      };
      r.readByte(), g.identifier = r.read(8), g.authCode = r.read(3), g.identifier === "NETSCAPE" ? m(g) : p(g);
    }, d = (g) => {
      g.data = this.readSubBlocks(e);
    };
    switch (t.label = r.readByte(), t.label) {
      case 249:
        t.extType = "gce", o(t);
        break;
      case 254:
        t.extType = "com", l(t);
        break;
      case 1:
        t.extType = "pte", u(t);
        break;
      case 255:
        t.extType = "app", c(t);
        break;
      default:
        t.extType = "unknown", d(t);
        break;
    }
  }
  pushFrame(t, e) {
    let a = this.gifCache[e].frameList;
    this.ctx && a.push({
      delay: t,
      data: this.ctx.getImageData(0, 0, this.gifInfo.width, this.gifInfo.height)
    });
  }
  parseImg(t, e, a) {
    let r = e;
    function o(c, d) {
      let g = new Array(c.length);
      const m = c.length / d;
      function p(A, T) {
        const G = c.slice(T * d, (T + 1) * d);
        g.splice.apply(g, [A * d, d].concat(G));
      }
      const y = [0, 4, 2, 1], M = [8, 8, 4, 2];
      let w = 0;
      for (var P = 0; P < 4; P++)
        for (var E = y[P]; E < m; E += M[P])
          p(E, w), w++;
      return g;
    }
    t.leftPos = r.readUnsigned(), t.topPos = r.readUnsigned(), t.width = r.readUnsigned(), t.height = r.readUnsigned();
    let l = this.byteToBitArr(r.readByte());
    t.lctFlag = l.shift(), t.interlaced = l.shift(), t.sorted = l.shift(), t.reserved = l.splice(0, 2), t.lctSize = this.bitsToNum(l.splice(0, 3)), t.lctFlag && (t.lct = this.parseCT(1 << t.lctSize + 1, e)), t.lzwMinCodeSize = r.readByte();
    const u = this.readSubBlocks(e);
    t.pixels = this.lzwDecode(t.lzwMinCodeSize, u), t.interlaced && (t.pixels = o(t.pixels, t.width)), this.doImg(t, a);
  }
  /**读取数据块 */
  readSubBlocks(t) {
    let e, a = t, r = "";
    do
      e = a.readByte(), r += a.read(e);
    while (e !== 0);
    return r;
  }
  /**解码LZW编码 */
  lzwDecode(t, e) {
    let a = 0;
    function r(y) {
      let M = 0;
      for (let w = 0; w < y; w++)
        e.charCodeAt(a >> 3) & 1 << (a & 7) && (M |= 1 << w), a++;
      return M;
    }
    let o = [], l = 1 << t, u = l + 1, c = t + 1, d = [];
    function g() {
      d = [], c = t + 1;
      for (let y = 0; y < l; y++)
        d[y] = [y];
      d[l] = [], d[u] = null;
    }
    let m = null, p = null;
    for (; ; ) {
      if (p = m, m = r(c), m === l) {
        g();
        continue;
      }
      if (m === u)
        break;
      if (m < d.length)
        p !== l && d.push(d[p].concat(d[m][0]));
      else {
        if (m !== d.length)
          throw new Error("Invalid LZW code.");
        d.push(d[p].concat(d[p][0]));
      }
      o.push.apply(o, d[m]), d.length === 1 << c && c < 12 && c++;
    }
    return o;
  }
  /** */
  doImg(t, e) {
    let a = this.ctx, r = this.canvasTool, o = this.gifInfo, l = this.gifCache[e].frameList;
    this.ctx || (a = this.ctx = r.getContext("2d"));
    const u = l.length, c = t.lctFlag ? t.lct : o.gct;
    u > 0 && (this.LAST_DISPOSA_METHOD === 3 ? this.CURRENT_FRAME_INDEX !== null && this.CURRENT_FRAME_INDEX > -1 ? a.putImageData(l[this.CURRENT_FRAME_INDEX].data, 0, 0) : a.clearRect(0, 0, r.width, r.height) : this.CURRENT_FRAME_INDEX = u - 1, this.LAST_DISPOSA_METHOD === 2 && a.clearRect(0, 0, r.width, r.height));
    let d = a.getImageData(t.leftPos, t.topPos, t.width, t.height);
    t.pixels.forEach((g, m) => {
      g !== this.TRANSPARENCY && (d.data[m * 4 + 0] = c[g][0], d.data[m * 4 + 1] = c[g][1], d.data[m * 4 + 2] = c[g][2], d.data[m * 4 + 3] = 255);
    }), a.putImageData(d, t.leftPos, t.topPos);
  }
  /**数字转换为对应的位然后变为长度为7的boolean数组
   * @param bite number 
   */
  byteToBitArr(t) {
    let e = [];
    for (let a = 7; a >= 0; a--)
      e.push(!!(t & 1 << a));
    return e;
  }
  /**boolean数组转换为对应的数字
   * @param ba boolean[]
   */
  bitsToNum(t) {
    return t.reduce(function(e, a) {
      return e * 2 + Number(a);
    }, 0);
  }
  /**获取全局颜色列表
   * @param size 全局颜色列表大小
   */
  parseCT(t, e) {
    let a = [];
    for (let r = 0; r < t; r++)
      a.push(e.readBytes(3));
    return a;
  }
}
class Eh {
  constructor(t) {
    this.pos = 0, this.data = t, this.len = t.length, this.pos = 0;
  }
  /**读取一字节（8位）的数据 */
  readByte() {
    if (this.pos >= this.data.length)
      throw new Error("Attempted to read past end of stream.");
    return this.data instanceof Uint8Array ? this.data[this.pos++] : this.data.charCodeAt(this.pos++) & 255;
  }
  /**读取指定长度的数据 */
  readBytes(t) {
    let e = [];
    for (let a = 0; a < t; a++)
      e.push(this.readByte());
    return e;
  }
  /**获取指定长度字符串 */
  read(t) {
    let e = "";
    for (let a = 0; a < t; a++)
      e += String.fromCharCode(this.readByte());
    return e;
  }
  /**读取无符号数据2字节 最大：255<<8 + 255 */
  readUnsigned() {
    let t = this.readBytes(2);
    return (t[1] << 8) + t[0];
  }
}
const Tn = class Tn {
  /**加载需要提前加载的异步图片，保证图片层级正确 */
  static loadImg(t = ["/assets/images/map/map_selected.png"]) {
    t.forEach((e) => this.getImgPromise(e));
  }
  /**绘制图片,默认图片中心点 */
  static async drawImg(t, e) {
    if (t.ifHide === !0) return;
    let { point: a, points: r = [], size: o = [0, 0], url: l, sizeo: u, posX: c = 0, posY: d = 0, left: g = 0, top: m = 0, rotate: p = 0, alpha: y = 1 } = t, M = o[0], w = o[1], P = u && u[0], E = u && u[1], A = this.ImageCache[l] || await this.getImgPromise(l);
    a && (r = [...r, a]);
    for (let T = 0; T < r.length; T++) {
      const G = r[T], R = G[0], z = G[1];
      p = p * Math.PI / 180, e.globalAlpha = y, e.setTransform(1, 0, 0, 1, R, z), e.rotate(p), P && E ? e.drawImage(A, c, d, P, E, -M / 2 + g, -w / 2 + m, M, w) : e.drawImage(A, -M / 2 + g, -w / 2 + m, M, w), e.rotate(-p), e.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
  /**根据图片路径地址，获取图片后缓存 , 避免重复请求
  * @param url 图片路径
  */
  static getImgPromise(t) {
    let e = this.ImageCache[t];
    return e ? Promise.resolve(e) : new Promise((a, r) => {
      let o = new Image();
      o.onload = () => {
        this.ImageCache[t] = o, a(o);
      }, o.src = `${t}`;
    });
  }
};
Tn.ImageCache = /* @__PURE__ */ Object.create(null);
let Di = Tn;
const se = /* @__PURE__ */ new Map(), oe = /* @__PURE__ */ new Map(), Za = /* @__PURE__ */ new Map();
function Sh(s, t, e, a, r) {
  let o = 0;
  const l = {};
  for (const c of s) {
    const d = e.get(c) ?? r;
    o += d, l[c] = (l[c] ?? 0) + 1;
  }
  const u = t - o;
  for (const c of Object.keys(l)) {
    const d = l[c], g = e.get(c) ?? r, m = g * d / o, p = u * m * a / d, y = g + p;
    e.set(c, y);
  }
}
function Ah(s, t) {
  const e = /* @__PURE__ */ new Map();
  let a = 0;
  for (const c of "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,.-+=?") {
    const d = s.measureText(c).width;
    e.set(c, d), a += d;
  }
  const r = a / e.size, o = 3, l = (t / r + o) / (o + 1), u = e.keys();
  for (const c of u)
    e.set(c, (e.get(c) ?? r) * l);
  return e;
}
function _e(s, t, e, a) {
  const r = oe.get(e);
  if (a && r !== void 0 && r.count > 2e4) {
    let u = Za.get(e);
    if (u === void 0 && (u = Ah(s, r.size), Za.set(e, u)), r.count > 5e5) {
      let d = 0;
      for (const g of t)
        d += u.get(g) ?? r.size;
      return d * 1.01;
    }
    const c = s.measureText(t);
    return Sh(t, c.width, u, Math.max(0.05, 1 - r.count / 2e5), r.size), oe.set(e, {
      count: r.count + t.length,
      size: r.size
    }), c.width;
  }
  const o = s.measureText(t), l = o.width / t.length;
  if ((r?.count ?? 0) > 2e4)
    return o.width;
  if (r === void 0)
    oe.set(e, {
      count: t.length,
      size: l
    });
  else {
    const u = l - r.size, c = t.length / (r.count + t.length), d = r.size + u * c;
    oe.set(e, {
      count: r.count + t.length,
      size: d
    });
  }
  return o.width;
}
function Lh(s, t, e, a, r, o, l, u) {
  if (t.length <= 1) return t.length;
  if (r < e) return -1;
  let c = Math.floor(e / r * o), d = _e(s, t.slice(0, Math.max(0, c)), a, l);
  const g = u?.(t);
  if (d !== e) if (d < e) {
    for (; d < e; )
      c++, d = _e(s, t.slice(0, Math.max(0, c)), a, l);
    c--;
  } else
    for (; d > e; ) {
      const m = g !== void 0 ? 0 : t.lastIndexOf(" ", c - 1);
      m > 0 ? c = m : c--, d = _e(s, t.slice(0, Math.max(0, c)), a, l);
    }
  if (t[c] !== " ") {
    let m = 0;
    if (g === void 0)
      m = t.lastIndexOf(" ", c);
    else
      for (const p of g) {
        if (p > c) break;
        m = p;
      }
    m > 0 && (c = m);
  }
  return c;
}
function Th(s, t, e, a, r, o) {
  const l = `${t}_${e}_${a}px`, u = se.get(l);
  if (u !== void 0) return u;
  if (a <= 0)
    return [];
  let c = [];
  const d = t.split(`
`), g = oe.get(e), m = g === void 0 ? t.length : a / g.size * 1.5, p = g !== void 0 && g.count > 2e4;
  for (let y of d) {
    let M = _e(s, y.slice(0, Math.max(0, m)), e, p), w = Math.min(y.length, m);
    if (M <= a)
      c.push(y);
    else {
      for (; M > a; ) {
        const P = Lh(s, y, a, e, M, w, p, o), E = y.slice(0, Math.max(0, P));
        y = y.slice(E.length), c.push(E), M = _e(s, y.slice(0, Math.max(0, m)), e, p), w = Math.min(y.length, m);
      }
      M > 0 && c.push(y);
    }
  }
  return c = c.map((y, M) => M === 0 ? y.trimEnd() : y.trim()), se.set(l, c), se.size > 500 && se.delete(se.keys().next().value), c;
}
class Ch {
  /**绘制文本（包含重叠处理）
   * @param info 文本信息
   * @param textRects 已绘制文本
   * @param ctx 画布
  */
  static drawText(t, e = [], a = this.ctx) {
    let { text: r = "", maxWidth: o = 0, font: l = a.font, ifHide: u } = t;
    if (u === !0 || !r) return null;
    this.ctx = a, ht.setCtxPara(a, t);
    const c = this.wordWrap(r, o, l), d = this.calcTextRect(c, t), g = this.avoidOverlap(t, d, e);
    this.renderTexts(t, c, d, e, g, a);
  }
  /**对文本换行计算,按规则得到多行文本 
   * @param text 文本
   * @param ctx 画布
   * @param max 最大宽度
   * @param font 字体
  */
  static wordWrap(t, e, a, r = this.ctx) {
    let o = t.split(`
`).filter((u) => u != "");
    if (e <= 0) return o;
    let l = [];
    return o.forEach((u) => {
      l.push(...Th(r, u, a, e, !0, (c) => [c.lastIndexOf(",") + 1]));
    }), l;
  }
  /**计算得到文本框(无论是否绘制背景框都需要计算)
   * @param texts 文本组
   * @param info 文本配置
   * @param ctx 画布
   */
  static calcTextRect(t, e, a = this.ctx) {
    let { point: r = [20, 20], panel: o = {}, lineHeight: l, textAlign: u, px: c = 0, py: d = 0 } = e, g = 0, m = 0, [p, y] = r, { actualBoundingBoxDescent: M = 0 } = a.measureText("M");
    m = (l || M) * t.length, g = Math.max(...t.map((z) => a.measureText(z).width));
    const { pl: w = 0, pr: P = w, pt: E = 0, pb: A = E } = o;
    let T = g + w + P, G = m + E + A;
    return u === "center" && (p -= T / 2), u === "right" && (p -= T), {
      x: p + c,
      y: y + d,
      width: T,
      height: G
    };
  }
  /**八个方向查找空隙 
  * @param rect 文本范围
  * @param rects 已存在的文本范围
  * @returns [X轴偏移量,Y轴偏移量,状态控制标识 0-7:方位 8:正常显示 9:不显示 ]
  */
  static avoidOverlap(t, e, a) {
    const { x: r, y: o, width: l = 0, height: u = 0 } = e, { overlap: c, textAlign: d } = t, { type: g = "show", querySpace: m = 1, maxDistance: p = 200, minSpacing: y = 0 } = c || {};
    if (g === "show") return [0, 0, 8];
    let M = this.isTextOverlap(e, a);
    if (g === "hide")
      return M ? [0, 0, 9] : [0, 0, 8];
    if (M)
      for (let w = 0; w <= p; w += m)
        for (let P = 0; P < 8; P++) {
          const E = P % 4 === 0 ? 0 : P < 4 ? 1 : -1, A = P == 2 || P == 6 ? 0 : P < 2 || P > 6 ? -1 : 1;
          let T = w * E - (E < 0 ? l : 0), G = w * A - (A < 0 ? u : 0);
          if (!this.isTextOverlap({ x: r + T, y: o + G, width: l, height: u }, a, y))
            return [T, G, P];
        }
    else
      return [0, 0, 8];
    return [0, 0, 9];
  }
  /**绘制文本
   * @param info 文本配置
   * @param texts 文本字符串组
   * @param rect 文本框
   * @param textRects 已绘制文本框
   * @param ctr 偏移控制
   */
  static renderTexts(t, e, a, r, o, l) {
    const [u, c, d] = o, { panel: g = {}, overlap: m = {}, textAlign: p = "center", px: y = 0, py: M = 0, point: w = [0, 0] } = t, { pl: P = 0, pt: E = 0, pb: A = E, pr: T = P } = g, { line: G } = m, { width: R = 0, height: z = 0 } = a, [Z, X] = w;
    if (d !== 9) {
      if (a.x += u, a.y += c, r.push({ ...a }), u != 0 || c != 0 && G) {
        let { x: F, y: Y } = a;
        switch (d) {
          case 0:
            F = F, Y = Y + z;
            break;
          case 1:
            F = F, Y = Y + z;
            break;
          case 2:
            F = F, Y = Y;
            break;
          case 3:
            F = F, Y = Y;
            break;
          case 4:
            F = F, Y = Y;
            break;
          case 5:
            F = F + R, Y = Y;
            break;
          case 6:
            F = F + R, Y = Y;
            break;
          case 7:
            F = F + R, Y = Y + z;
            break;
        }
        ht.drawLine({ ...G, points: [[Z, X], [F, Y]] }, l);
      }
      g && ht.drawRect(
        {
          point: [a.x, a.y],
          width: a.width,
          height: a.height,
          radius: g.radius,
          ...g
        },
        l
      ), ht.setCtxPara(l, t), this.renderMultiText(e, [a.x + P, a.y + E], t, l), ht.setCtxPara(l);
    }
  }
  /**绘制多行文本*/
  static renderMultiText(t, e, a, r) {
    let [o, l] = e;
    const { lineHeight: u, ifShadow: c } = a;
    let { actualBoundingBoxDescent: d } = r.measureText("M");
    t.forEach((g) => {
      let m = u && u > d ? (u - d) / 2 : 0, p = u || d;
      c && r.strokeText(g, o, l + m), r.fillText(g, o, l + m), l += p;
    });
  }
  /**文本是否重叠 */
  static isTextOverlap(t, e, a = 0) {
    for (const r of e) {
      const { x: o, y: l, width: u = 0, height: c = 0 } = t, { x: d, y: g = 0, width: m = 0, height: p = 0 } = r;
      if (!(d > o + u + a || d + m + a < o || g > l + c + a || g + p + a < l))
        return !0;
    }
    return !1;
  }
}
function Ih(s) {
  if (Object.prototype.hasOwnProperty.call(s, "__esModule")) return s;
  var t = s.default;
  if (typeof t == "function") {
    var e = function a() {
      var r = !1;
      try {
        r = this instanceof a;
      } catch {
      }
      return r ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    e.prototype = t.prototype;
  } else e = {};
  return Object.defineProperty(e, "__esModule", { value: !0 }), Object.keys(s).forEach(function(a) {
    var r = Object.getOwnPropertyDescriptor(s, a);
    Object.defineProperty(e, a, r.get ? r : {
      enumerable: !0,
      get: function() {
        return s[a];
      }
    });
  }), e;
}
var he = { exports: {} };
var Gh = he.exports, Ua;
function Mr() {
  return Ua || (Ua = 1, (function(s, t) {
    (function(e, a) {
      a(t);
    })(Gh, (function(e) {
      var a = "1.9.4";
      function r(i) {
        var n, h, f, _;
        for (h = 1, f = arguments.length; h < f; h++) {
          _ = arguments[h];
          for (n in _)
            i[n] = _[n];
        }
        return i;
      }
      var o = Object.create || /* @__PURE__ */ (function() {
        function i() {
        }
        return function(n) {
          return i.prototype = n, new i();
        };
      })();
      function l(i, n) {
        var h = Array.prototype.slice;
        if (i.bind)
          return i.bind.apply(i, h.call(arguments, 1));
        var f = h.call(arguments, 2);
        return function() {
          return i.apply(n, f.length ? f.concat(h.call(arguments)) : arguments);
        };
      }
      var u = 0;
      function c(i) {
        return "_leaflet_id" in i || (i._leaflet_id = ++u), i._leaflet_id;
      }
      function d(i, n, h) {
        var f, _, v, x;
        return x = function() {
          f = !1, _ && (v.apply(h, _), _ = !1);
        }, v = function() {
          f ? _ = arguments : (i.apply(h, arguments), setTimeout(x, n), f = !0);
        }, v;
      }
      function g(i, n, h) {
        var f = n[1], _ = n[0], v = f - _;
        return i === f && h ? i : ((i - _) % v + v) % v + _;
      }
      function m() {
        return !1;
      }
      function p(i, n) {
        if (n === !1)
          return i;
        var h = Math.pow(10, n === void 0 ? 6 : n);
        return Math.round(i * h) / h;
      }
      function y(i) {
        return i.trim ? i.trim() : i.replace(/^\s+|\s+$/g, "");
      }
      function M(i) {
        return y(i).split(/\s+/);
      }
      function w(i, n) {
        Object.prototype.hasOwnProperty.call(i, "options") || (i.options = i.options ? o(i.options) : {});
        for (var h in n)
          i.options[h] = n[h];
        return i.options;
      }
      function P(i, n, h) {
        var f = [];
        for (var _ in i)
          f.push(encodeURIComponent(h ? _.toUpperCase() : _) + "=" + encodeURIComponent(i[_]));
        return (!n || n.indexOf("?") === -1 ? "?" : "&") + f.join("&");
      }
      var E = /\{ *([\w_ -]+) *\}/g;
      function A(i, n) {
        return i.replace(E, function(h, f) {
          var _ = n[f];
          if (_ === void 0)
            throw new Error("No value provided for variable " + h);
          return typeof _ == "function" && (_ = _(n)), _;
        });
      }
      var T = Array.isArray || function(i) {
        return Object.prototype.toString.call(i) === "[object Array]";
      };
      function G(i, n) {
        for (var h = 0; h < i.length; h++)
          if (i[h] === n)
            return h;
        return -1;
      }
      var R = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
      function z(i) {
        return window["webkit" + i] || window["moz" + i] || window["ms" + i];
      }
      var Z = 0;
      function X(i) {
        var n = +/* @__PURE__ */ new Date(), h = Math.max(0, 16 - (n - Z));
        return Z = n + h, window.setTimeout(i, h);
      }
      var F = window.requestAnimationFrame || z("RequestAnimationFrame") || X, Y = window.cancelAnimationFrame || z("CancelAnimationFrame") || z("CancelRequestAnimationFrame") || function(i) {
        window.clearTimeout(i);
      };
      function Q(i, n, h) {
        if (h && F === X)
          i.call(n);
        else
          return F.call(window, l(i, n));
      }
      function _t(i) {
        i && Y.call(window, i);
      }
      var ei = {
        __proto__: null,
        extend: r,
        create: o,
        bind: l,
        get lastId() {
          return u;
        },
        stamp: c,
        throttle: d,
        wrapNum: g,
        falseFn: m,
        formatNum: p,
        trim: y,
        splitWords: M,
        setOptions: w,
        getParamString: P,
        template: A,
        isArray: T,
        indexOf: G,
        emptyImageUrl: R,
        requestFn: F,
        cancelFn: Y,
        requestAnimFrame: Q,
        cancelAnimFrame: _t
      };
      function Ut() {
      }
      Ut.extend = function(i) {
        var n = function() {
          w(this), this.initialize && this.initialize.apply(this, arguments), this.callInitHooks();
        }, h = n.__super__ = this.prototype, f = o(h);
        f.constructor = n, n.prototype = f;
        for (var _ in this)
          Object.prototype.hasOwnProperty.call(this, _) && _ !== "prototype" && _ !== "__super__" && (n[_] = this[_]);
        return i.statics && r(n, i.statics), i.includes && (Jr(i.includes), r.apply(null, [f].concat(i.includes))), r(f, i), delete f.statics, delete f.includes, f.options && (f.options = h.options ? o(h.options) : {}, r(f.options, i.options)), f._initHooks = [], f.callInitHooks = function() {
          if (!this._initHooksCalled) {
            h.callInitHooks && h.callInitHooks.call(this), this._initHooksCalled = !0;
            for (var v = 0, x = f._initHooks.length; v < x; v++)
              f._initHooks[v].call(this);
          }
        }, n;
      }, Ut.include = function(i) {
        var n = this.prototype.options;
        return r(this.prototype, i), i.options && (this.prototype.options = n, this.mergeOptions(i.options)), this;
      }, Ut.mergeOptions = function(i) {
        return r(this.prototype.options, i), this;
      }, Ut.addInitHook = function(i) {
        var n = Array.prototype.slice.call(arguments, 1), h = typeof i == "function" ? i : function() {
          this[i].apply(this, n);
        };
        return this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(h), this;
      };
      function Jr(i) {
        if (!(typeof L > "u" || !L || !L.Mixin)) {
          i = T(i) ? i : [i];
          for (var n = 0; n < i.length; n++)
            i[n] === L.Mixin.Events && console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.", new Error().stack);
        }
      }
      var Ct = {
        /* @method on(type: String, fn: Function, context?: Object): this
         * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
         *
         * @alternative
         * @method on(eventMap: Object): this
         * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
         */
        on: function(i, n, h) {
          if (typeof i == "object")
            for (var f in i)
              this._on(f, i[f], n);
          else {
            i = M(i);
            for (var _ = 0, v = i.length; _ < v; _++)
              this._on(i[_], n, h);
          }
          return this;
        },
        /* @method off(type: String, fn?: Function, context?: Object): this
         * Removes a previously added listener function. If no function is specified, it will remove all the listeners of that particular event from the object. Note that if you passed a custom context to `on`, you must pass the same context to `off` in order to remove the listener.
         *
         * @alternative
         * @method off(eventMap: Object): this
         * Removes a set of type/listener pairs.
         *
         * @alternative
         * @method off: this
         * Removes all listeners to all events on the object. This includes implicitly attached events.
         */
        off: function(i, n, h) {
          if (!arguments.length)
            delete this._events;
          else if (typeof i == "object")
            for (var f in i)
              this._off(f, i[f], n);
          else {
            i = M(i);
            for (var _ = arguments.length === 1, v = 0, x = i.length; v < x; v++)
              _ ? this._off(i[v]) : this._off(i[v], n, h);
          }
          return this;
        },
        // attach listener (without syntactic sugar now)
        _on: function(i, n, h, f) {
          if (typeof n != "function") {
            console.warn("wrong listener type: " + typeof n);
            return;
          }
          if (this._listens(i, n, h) === !1) {
            h === this && (h = void 0);
            var _ = { fn: n, ctx: h };
            f && (_.once = !0), this._events = this._events || {}, this._events[i] = this._events[i] || [], this._events[i].push(_);
          }
        },
        _off: function(i, n, h) {
          var f, _, v;
          if (this._events && (f = this._events[i], !!f)) {
            if (arguments.length === 1) {
              if (this._firingCount)
                for (_ = 0, v = f.length; _ < v; _++)
                  f[_].fn = m;
              delete this._events[i];
              return;
            }
            if (typeof n != "function") {
              console.warn("wrong listener type: " + typeof n);
              return;
            }
            var x = this._listens(i, n, h);
            if (x !== !1) {
              var b = f[x];
              this._firingCount && (b.fn = m, this._events[i] = f = f.slice()), f.splice(x, 1);
            }
          }
        },
        // @method fire(type: String, data?: Object, propagate?: Boolean): this
        // Fires an event of the specified type. You can optionally provide a data
        // object — the first argument of the listener function will contain its
        // properties. The event can optionally be propagated to event parents.
        fire: function(i, n, h) {
          if (!this.listens(i, h))
            return this;
          var f = r({}, n, {
            type: i,
            target: this,
            sourceTarget: n && n.sourceTarget || this
          });
          if (this._events) {
            var _ = this._events[i];
            if (_) {
              this._firingCount = this._firingCount + 1 || 1;
              for (var v = 0, x = _.length; v < x; v++) {
                var b = _[v], S = b.fn;
                b.once && this.off(i, S, b.ctx), S.call(b.ctx || this, f);
              }
              this._firingCount--;
            }
          }
          return h && this._propagateEvent(f), this;
        },
        // @method listens(type: String, propagate?: Boolean): Boolean
        // @method listens(type: String, fn: Function, context?: Object, propagate?: Boolean): Boolean
        // Returns `true` if a particular event type has any listeners attached to it.
        // The verification can optionally be propagated, it will return `true` if parents have the listener attached to it.
        listens: function(i, n, h, f) {
          typeof i != "string" && console.warn('"string" type argument expected');
          var _ = n;
          typeof n != "function" && (f = !!n, _ = void 0, h = void 0);
          var v = this._events && this._events[i];
          if (v && v.length && this._listens(i, _, h) !== !1)
            return !0;
          if (f) {
            for (var x in this._eventParents)
              if (this._eventParents[x].listens(i, n, h, f))
                return !0;
          }
          return !1;
        },
        // returns the index (number) or false
        _listens: function(i, n, h) {
          if (!this._events)
            return !1;
          var f = this._events[i] || [];
          if (!n)
            return !!f.length;
          h === this && (h = void 0);
          for (var _ = 0, v = f.length; _ < v; _++)
            if (f[_].fn === n && f[_].ctx === h)
              return _;
          return !1;
        },
        // @method once(…): this
        // Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
        once: function(i, n, h) {
          if (typeof i == "object")
            for (var f in i)
              this._on(f, i[f], n, !0);
          else {
            i = M(i);
            for (var _ = 0, v = i.length; _ < v; _++)
              this._on(i[_], n, h, !0);
          }
          return this;
        },
        // @method addEventParent(obj: Evented): this
        // Adds an event parent - an `Evented` that will receive propagated events
        addEventParent: function(i) {
          return this._eventParents = this._eventParents || {}, this._eventParents[c(i)] = i, this;
        },
        // @method removeEventParent(obj: Evented): this
        // Removes an event parent, so it will stop receiving propagated events
        removeEventParent: function(i) {
          return this._eventParents && delete this._eventParents[c(i)], this;
        },
        _propagateEvent: function(i) {
          for (var n in this._eventParents)
            this._eventParents[n].fire(i.type, r({
              layer: i.target,
              propagatedFrom: i.target
            }, i), !0);
        }
      };
      Ct.addEventListener = Ct.on, Ct.removeEventListener = Ct.clearAllEventListeners = Ct.off, Ct.addOneTimeEventListener = Ct.once, Ct.fireEvent = Ct.fire, Ct.hasEventListeners = Ct.listens;
      var Ui = Ut.extend(Ct);
      function q(i, n, h) {
        this.x = h ? Math.round(i) : i, this.y = h ? Math.round(n) : n;
      }
      var Cn = Math.trunc || function(i) {
        return i > 0 ? Math.floor(i) : Math.ceil(i);
      };
      q.prototype = {
        // @method clone(): Point
        // Returns a copy of the current point.
        clone: function() {
          return new q(this.x, this.y);
        },
        // @method add(otherPoint: Point): Point
        // Returns the result of addition of the current and the given points.
        add: function(i) {
          return this.clone()._add(U(i));
        },
        _add: function(i) {
          return this.x += i.x, this.y += i.y, this;
        },
        // @method subtract(otherPoint: Point): Point
        // Returns the result of subtraction of the given point from the current.
        subtract: function(i) {
          return this.clone()._subtract(U(i));
        },
        _subtract: function(i) {
          return this.x -= i.x, this.y -= i.y, this;
        },
        // @method divideBy(num: Number): Point
        // Returns the result of division of the current point by the given number.
        divideBy: function(i) {
          return this.clone()._divideBy(i);
        },
        _divideBy: function(i) {
          return this.x /= i, this.y /= i, this;
        },
        // @method multiplyBy(num: Number): Point
        // Returns the result of multiplication of the current point by the given number.
        multiplyBy: function(i) {
          return this.clone()._multiplyBy(i);
        },
        _multiplyBy: function(i) {
          return this.x *= i, this.y *= i, this;
        },
        // @method scaleBy(scale: Point): Point
        // Multiply each coordinate of the current point by each coordinate of
        // `scale`. In linear algebra terms, multiply the point by the
        // [scaling matrix](https://en.wikipedia.org/wiki/Scaling_%28geometry%29#Matrix_representation)
        // defined by `scale`.
        scaleBy: function(i) {
          return new q(this.x * i.x, this.y * i.y);
        },
        // @method unscaleBy(scale: Point): Point
        // Inverse of `scaleBy`. Divide each coordinate of the current point by
        // each coordinate of `scale`.
        unscaleBy: function(i) {
          return new q(this.x / i.x, this.y / i.y);
        },
        // @method round(): Point
        // Returns a copy of the current point with rounded coordinates.
        round: function() {
          return this.clone()._round();
        },
        _round: function() {
          return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
        },
        // @method floor(): Point
        // Returns a copy of the current point with floored coordinates (rounded down).
        floor: function() {
          return this.clone()._floor();
        },
        _floor: function() {
          return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
        },
        // @method ceil(): Point
        // Returns a copy of the current point with ceiled coordinates (rounded up).
        ceil: function() {
          return this.clone()._ceil();
        },
        _ceil: function() {
          return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
        },
        // @method trunc(): Point
        // Returns a copy of the current point with truncated coordinates (rounded towards zero).
        trunc: function() {
          return this.clone()._trunc();
        },
        _trunc: function() {
          return this.x = Cn(this.x), this.y = Cn(this.y), this;
        },
        // @method distanceTo(otherPoint: Point): Number
        // Returns the cartesian distance between the current and the given points.
        distanceTo: function(i) {
          i = U(i);
          var n = i.x - this.x, h = i.y - this.y;
          return Math.sqrt(n * n + h * h);
        },
        // @method equals(otherPoint: Point): Boolean
        // Returns `true` if the given point has the same coordinates.
        equals: function(i) {
          return i = U(i), i.x === this.x && i.y === this.y;
        },
        // @method contains(otherPoint: Point): Boolean
        // Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
        contains: function(i) {
          return i = U(i), Math.abs(i.x) <= Math.abs(this.x) && Math.abs(i.y) <= Math.abs(this.y);
        },
        // @method toString(): String
        // Returns a string representation of the point for debugging purposes.
        toString: function() {
          return "Point(" + p(this.x) + ", " + p(this.y) + ")";
        }
      };
      function U(i, n, h) {
        return i instanceof q ? i : T(i) ? new q(i[0], i[1]) : i == null ? i : typeof i == "object" && "x" in i && "y" in i ? new q(i.x, i.y) : new q(i, n, h);
      }
      function nt(i, n) {
        if (i)
          for (var h = n ? [i, n] : i, f = 0, _ = h.length; f < _; f++)
            this.extend(h[f]);
      }
      nt.prototype = {
        // @method extend(point: Point): this
        // Extends the bounds to contain the given point.
        // @alternative
        // @method extend(otherBounds: Bounds): this
        // Extend the bounds to contain the given bounds
        extend: function(i) {
          var n, h;
          if (!i)
            return this;
          if (i instanceof q || typeof i[0] == "number" || "x" in i)
            n = h = U(i);
          else if (i = Pt(i), n = i.min, h = i.max, !n || !h)
            return this;
          return !this.min && !this.max ? (this.min = n.clone(), this.max = h.clone()) : (this.min.x = Math.min(n.x, this.min.x), this.max.x = Math.max(h.x, this.max.x), this.min.y = Math.min(n.y, this.min.y), this.max.y = Math.max(h.y, this.max.y)), this;
        },
        // @method getCenter(round?: Boolean): Point
        // Returns the center point of the bounds.
        getCenter: function(i) {
          return U(
            (this.min.x + this.max.x) / 2,
            (this.min.y + this.max.y) / 2,
            i
          );
        },
        // @method getBottomLeft(): Point
        // Returns the bottom-left point of the bounds.
        getBottomLeft: function() {
          return U(this.min.x, this.max.y);
        },
        // @method getTopRight(): Point
        // Returns the top-right point of the bounds.
        getTopRight: function() {
          return U(this.max.x, this.min.y);
        },
        // @method getTopLeft(): Point
        // Returns the top-left point of the bounds (i.e. [`this.min`](#bounds-min)).
        getTopLeft: function() {
          return this.min;
        },
        // @method getBottomRight(): Point
        // Returns the bottom-right point of the bounds (i.e. [`this.max`](#bounds-max)).
        getBottomRight: function() {
          return this.max;
        },
        // @method getSize(): Point
        // Returns the size of the given bounds
        getSize: function() {
          return this.max.subtract(this.min);
        },
        // @method contains(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle contains the given one.
        // @alternative
        // @method contains(point: Point): Boolean
        // Returns `true` if the rectangle contains the given point.
        contains: function(i) {
          var n, h;
          return typeof i[0] == "number" || i instanceof q ? i = U(i) : i = Pt(i), i instanceof nt ? (n = i.min, h = i.max) : n = h = i, n.x >= this.min.x && h.x <= this.max.x && n.y >= this.min.y && h.y <= this.max.y;
        },
        // @method intersects(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds
        // intersect if they have at least one point in common.
        intersects: function(i) {
          i = Pt(i);
          var n = this.min, h = this.max, f = i.min, _ = i.max, v = _.x >= n.x && f.x <= h.x, x = _.y >= n.y && f.y <= h.y;
          return v && x;
        },
        // @method overlaps(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds
        // overlap if their intersection is an area.
        overlaps: function(i) {
          i = Pt(i);
          var n = this.min, h = this.max, f = i.min, _ = i.max, v = _.x > n.x && f.x < h.x, x = _.y > n.y && f.y < h.y;
          return v && x;
        },
        // @method isValid(): Boolean
        // Returns `true` if the bounds are properly initialized.
        isValid: function() {
          return !!(this.min && this.max);
        },
        // @method pad(bufferRatio: Number): Bounds
        // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
        // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
        // Negative values will retract the bounds.
        pad: function(i) {
          var n = this.min, h = this.max, f = Math.abs(n.x - h.x) * i, _ = Math.abs(n.y - h.y) * i;
          return Pt(
            U(n.x - f, n.y - _),
            U(h.x + f, h.y + _)
          );
        },
        // @method equals(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle is equivalent to the given bounds.
        equals: function(i) {
          return i ? (i = Pt(i), this.min.equals(i.getTopLeft()) && this.max.equals(i.getBottomRight())) : !1;
        }
      };
      function Pt(i, n) {
        return !i || i instanceof nt ? i : new nt(i, n);
      }
      function bt(i, n) {
        if (i)
          for (var h = n ? [i, n] : i, f = 0, _ = h.length; f < _; f++)
            this.extend(h[f]);
      }
      bt.prototype = {
        // @method extend(latlng: LatLng): this
        // Extend the bounds to contain the given point
        // @alternative
        // @method extend(otherBounds: LatLngBounds): this
        // Extend the bounds to contain the given bounds
        extend: function(i) {
          var n = this._southWest, h = this._northEast, f, _;
          if (i instanceof et)
            f = i, _ = i;
          else if (i instanceof bt) {
            if (f = i._southWest, _ = i._northEast, !f || !_)
              return this;
          } else
            return i ? this.extend(K(i) || ct(i)) : this;
          return !n && !h ? (this._southWest = new et(f.lat, f.lng), this._northEast = new et(_.lat, _.lng)) : (n.lat = Math.min(f.lat, n.lat), n.lng = Math.min(f.lng, n.lng), h.lat = Math.max(_.lat, h.lat), h.lng = Math.max(_.lng, h.lng)), this;
        },
        // @method pad(bufferRatio: Number): LatLngBounds
        // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
        // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
        // Negative values will retract the bounds.
        pad: function(i) {
          var n = this._southWest, h = this._northEast, f = Math.abs(n.lat - h.lat) * i, _ = Math.abs(n.lng - h.lng) * i;
          return new bt(
            new et(n.lat - f, n.lng - _),
            new et(h.lat + f, h.lng + _)
          );
        },
        // @method getCenter(): LatLng
        // Returns the center point of the bounds.
        getCenter: function() {
          return new et(
            (this._southWest.lat + this._northEast.lat) / 2,
            (this._southWest.lng + this._northEast.lng) / 2
          );
        },
        // @method getSouthWest(): LatLng
        // Returns the south-west point of the bounds.
        getSouthWest: function() {
          return this._southWest;
        },
        // @method getNorthEast(): LatLng
        // Returns the north-east point of the bounds.
        getNorthEast: function() {
          return this._northEast;
        },
        // @method getNorthWest(): LatLng
        // Returns the north-west point of the bounds.
        getNorthWest: function() {
          return new et(this.getNorth(), this.getWest());
        },
        // @method getSouthEast(): LatLng
        // Returns the south-east point of the bounds.
        getSouthEast: function() {
          return new et(this.getSouth(), this.getEast());
        },
        // @method getWest(): Number
        // Returns the west longitude of the bounds
        getWest: function() {
          return this._southWest.lng;
        },
        // @method getSouth(): Number
        // Returns the south latitude of the bounds
        getSouth: function() {
          return this._southWest.lat;
        },
        // @method getEast(): Number
        // Returns the east longitude of the bounds
        getEast: function() {
          return this._northEast.lng;
        },
        // @method getNorth(): Number
        // Returns the north latitude of the bounds
        getNorth: function() {
          return this._northEast.lat;
        },
        // @method contains(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle contains the given one.
        // @alternative
        // @method contains (latlng: LatLng): Boolean
        // Returns `true` if the rectangle contains the given point.
        contains: function(i) {
          typeof i[0] == "number" || i instanceof et || "lat" in i ? i = K(i) : i = ct(i);
          var n = this._southWest, h = this._northEast, f, _;
          return i instanceof bt ? (f = i.getSouthWest(), _ = i.getNorthEast()) : f = _ = i, f.lat >= n.lat && _.lat <= h.lat && f.lng >= n.lng && _.lng <= h.lng;
        },
        // @method intersects(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
        intersects: function(i) {
          i = ct(i);
          var n = this._southWest, h = this._northEast, f = i.getSouthWest(), _ = i.getNorthEast(), v = _.lat >= n.lat && f.lat <= h.lat, x = _.lng >= n.lng && f.lng <= h.lng;
          return v && x;
        },
        // @method overlaps(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
        overlaps: function(i) {
          i = ct(i);
          var n = this._southWest, h = this._northEast, f = i.getSouthWest(), _ = i.getNorthEast(), v = _.lat > n.lat && f.lat < h.lat, x = _.lng > n.lng && f.lng < h.lng;
          return v && x;
        },
        // @method toBBoxString(): String
        // Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
        toBBoxString: function() {
          return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(",");
        },
        // @method equals(otherBounds: LatLngBounds, maxMargin?: Number): Boolean
        // Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds. The margin of error can be overridden by setting `maxMargin` to a small number.
        equals: function(i, n) {
          return i ? (i = ct(i), this._southWest.equals(i.getSouthWest(), n) && this._northEast.equals(i.getNorthEast(), n)) : !1;
        },
        // @method isValid(): Boolean
        // Returns `true` if the bounds are properly initialized.
        isValid: function() {
          return !!(this._southWest && this._northEast);
        }
      };
      function ct(i, n) {
        return i instanceof bt ? i : new bt(i, n);
      }
      function et(i, n, h) {
        if (isNaN(i) || isNaN(n))
          throw new Error("Invalid LatLng object: (" + i + ", " + n + ")");
        this.lat = +i, this.lng = +n, h !== void 0 && (this.alt = +h);
      }
      et.prototype = {
        // @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
        // Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
        equals: function(i, n) {
          if (!i)
            return !1;
          i = K(i);
          var h = Math.max(
            Math.abs(this.lat - i.lat),
            Math.abs(this.lng - i.lng)
          );
          return h <= (n === void 0 ? 1e-9 : n);
        },
        // @method toString(): String
        // Returns a string representation of the point (for debugging purposes).
        toString: function(i) {
          return "LatLng(" + p(this.lat, i) + ", " + p(this.lng, i) + ")";
        },
        // @method distanceTo(otherLatLng: LatLng): Number
        // Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
        distanceTo: function(i) {
          return si.distance(this, K(i));
        },
        // @method wrap(): LatLng
        // Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
        wrap: function() {
          return si.wrapLatLng(this);
        },
        // @method toBounds(sizeInMeters: Number): LatLngBounds
        // Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
        toBounds: function(i) {
          var n = 180 * i / 40075017, h = n / Math.cos(Math.PI / 180 * this.lat);
          return ct(
            [this.lat - n, this.lng - h],
            [this.lat + n, this.lng + h]
          );
        },
        clone: function() {
          return new et(this.lat, this.lng, this.alt);
        }
      };
      function K(i, n, h) {
        return i instanceof et ? i : T(i) && typeof i[0] != "object" ? i.length === 3 ? new et(i[0], i[1], i[2]) : i.length === 2 ? new et(i[0], i[1]) : null : i == null ? i : typeof i == "object" && "lat" in i ? new et(i.lat, "lng" in i ? i.lng : i.lon, i.alt) : n === void 0 ? null : new et(i, n, h);
      }
      var Yt = {
        // @method latLngToPoint(latlng: LatLng, zoom: Number): Point
        // Projects geographical coordinates into pixel coordinates for a given zoom.
        latLngToPoint: function(i, n) {
          var h = this.projection.project(i), f = this.scale(n);
          return this.transformation._transform(h, f);
        },
        // @method pointToLatLng(point: Point, zoom: Number): LatLng
        // The inverse of `latLngToPoint`. Projects pixel coordinates on a given
        // zoom into geographical coordinates.
        pointToLatLng: function(i, n) {
          var h = this.scale(n), f = this.transformation.untransform(i, h);
          return this.projection.unproject(f);
        },
        // @method project(latlng: LatLng): Point
        // Projects geographical coordinates into coordinates in units accepted for
        // this CRS (e.g. meters for EPSG:3857, for passing it to WMS services).
        project: function(i) {
          return this.projection.project(i);
        },
        // @method unproject(point: Point): LatLng
        // Given a projected coordinate returns the corresponding LatLng.
        // The inverse of `project`.
        unproject: function(i) {
          return this.projection.unproject(i);
        },
        // @method scale(zoom: Number): Number
        // Returns the scale used when transforming projected coordinates into
        // pixel coordinates for a particular zoom. For example, it returns
        // `256 * 2^zoom` for Mercator-based CRS.
        scale: function(i) {
          return 256 * Math.pow(2, i);
        },
        // @method zoom(scale: Number): Number
        // Inverse of `scale()`, returns the zoom level corresponding to a scale
        // factor of `scale`.
        zoom: function(i) {
          return Math.log(i / 256) / Math.LN2;
        },
        // @method getProjectedBounds(zoom: Number): Bounds
        // Returns the projection's bounds scaled and transformed for the provided `zoom`.
        getProjectedBounds: function(i) {
          if (this.infinite)
            return null;
          var n = this.projection.bounds, h = this.scale(i), f = this.transformation.transform(n.min, h), _ = this.transformation.transform(n.max, h);
          return new nt(f, _);
        },
        // @method distance(latlng1: LatLng, latlng2: LatLng): Number
        // Returns the distance between two geographical coordinates.
        // @property code: String
        // Standard code name of the CRS passed into WMS services (e.g. `'EPSG:3857'`)
        //
        // @property wrapLng: Number[]
        // An array of two numbers defining whether the longitude (horizontal) coordinate
        // axis wraps around a given range and how. Defaults to `[-180, 180]` in most
        // geographical CRSs. If `undefined`, the longitude axis does not wrap around.
        //
        // @property wrapLat: Number[]
        // Like `wrapLng`, but for the latitude (vertical) axis.
        // wrapLng: [min, max],
        // wrapLat: [min, max],
        // @property infinite: Boolean
        // If true, the coordinate space will be unbounded (infinite in both axes)
        infinite: !1,
        // @method wrapLatLng(latlng: LatLng): LatLng
        // Returns a `LatLng` where lat and lng has been wrapped according to the
        // CRS's `wrapLat` and `wrapLng` properties, if they are outside the CRS's bounds.
        wrapLatLng: function(i) {
          var n = this.wrapLng ? g(i.lng, this.wrapLng, !0) : i.lng, h = this.wrapLat ? g(i.lat, this.wrapLat, !0) : i.lat, f = i.alt;
          return new et(h, n, f);
        },
        // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
        // Returns a `LatLngBounds` with the same size as the given one, ensuring
        // that its center is within the CRS's bounds.
        // Only accepts actual `L.LatLngBounds` instances, not arrays.
        wrapLatLngBounds: function(i) {
          var n = i.getCenter(), h = this.wrapLatLng(n), f = n.lat - h.lat, _ = n.lng - h.lng;
          if (f === 0 && _ === 0)
            return i;
          var v = i.getSouthWest(), x = i.getNorthEast(), b = new et(v.lat - f, v.lng - _), S = new et(x.lat - f, x.lng - _);
          return new bt(b, S);
        }
      }, si = r({}, Yt, {
        wrapLng: [-180, 180],
        // Mean Earth Radius, as recommended for use by
        // the International Union of Geodesy and Geophysics,
        // see https://rosettacode.org/wiki/Haversine_formula
        R: 6371e3,
        // distance between two geographical points using spherical law of cosines approximation
        distance: function(i, n) {
          var h = Math.PI / 180, f = i.lat * h, _ = n.lat * h, v = Math.sin((n.lat - i.lat) * h / 2), x = Math.sin((n.lng - i.lng) * h / 2), b = v * v + Math.cos(f) * Math.cos(_) * x * x, S = 2 * Math.atan2(Math.sqrt(b), Math.sqrt(1 - b));
          return this.R * S;
        }
      }), In = 6378137, vs = {
        R: In,
        MAX_LATITUDE: 85.0511287798,
        project: function(i) {
          var n = Math.PI / 180, h = this.MAX_LATITUDE, f = Math.max(Math.min(h, i.lat), -h), _ = Math.sin(f * n);
          return new q(
            this.R * i.lng * n,
            this.R * Math.log((1 + _) / (1 - _)) / 2
          );
        },
        unproject: function(i) {
          var n = 180 / Math.PI;
          return new et(
            (2 * Math.atan(Math.exp(i.y / this.R)) - Math.PI / 2) * n,
            i.x * n / this.R
          );
        },
        bounds: (function() {
          var i = In * Math.PI;
          return new nt([-i, -i], [i, i]);
        })()
      };
      function ys(i, n, h, f) {
        if (T(i)) {
          this._a = i[0], this._b = i[1], this._c = i[2], this._d = i[3];
          return;
        }
        this._a = i, this._b = n, this._c = h, this._d = f;
      }
      ys.prototype = {
        // @method transform(point: Point, scale?: Number): Point
        // Returns a transformed point, optionally multiplied by the given scale.
        // Only accepts actual `L.Point` instances, not arrays.
        transform: function(i, n) {
          return this._transform(i.clone(), n);
        },
        // destructive transform (faster)
        _transform: function(i, n) {
          return n = n || 1, i.x = n * (this._a * i.x + this._b), i.y = n * (this._c * i.y + this._d), i;
        },
        // @method untransform(point: Point, scale?: Number): Point
        // Returns the reverse transformation of the given point, optionally divided
        // by the given scale. Only accepts actual `L.Point` instances, not arrays.
        untransform: function(i, n) {
          return n = n || 1, new q(
            (i.x / n - this._b) / this._a,
            (i.y / n - this._d) / this._c
          );
        }
      };
      function qi(i, n, h, f) {
        return new ys(i, n, h, f);
      }
      var Ms = r({}, si, {
        code: "EPSG:3857",
        projection: vs,
        transformation: (function() {
          var i = 0.5 / (Math.PI * vs.R);
          return qi(i, 0.5, -i, 0.5);
        })()
      }), Qr = r({}, Ms, {
        code: "EPSG:900913"
      });
      function Gn(i) {
        return document.createElementNS("http://www.w3.org/2000/svg", i);
      }
      function On(i, n) {
        var h = "", f, _, v, x, b, S;
        for (f = 0, v = i.length; f < v; f++) {
          for (b = i[f], _ = 0, x = b.length; _ < x; _++)
            S = b[_], h += (_ ? "L" : "M") + S.x + " " + S.y;
          h += n ? B.svg ? "z" : "x" : "";
        }
        return h || "M0 0";
      }
      var ws = document.documentElement.style, Ie = "ActiveXObject" in window, to = Ie && !document.addEventListener, Nn = "msLaunchUri" in navigator && !("documentMode" in document), xs = qt("webkit"), Rn = qt("android"), kn = qt("android 2") || qt("android 3"), io = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10), eo = Rn && qt("Google") && io < 537 && !("AudioNode" in window), Ps = !!window.opera, zn = !Nn && qt("chrome"), Bn = qt("gecko") && !xs && !Ps && !Ie, so = !zn && qt("safari"), Dn = qt("phantom"), Fn = "OTransition" in ws, no = navigator.platform.indexOf("Win") === 0, Zn = Ie && "transition" in ws, bs = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !kn, Un = "MozPerspective" in ws, ao = !window.L_DISABLE_3D && (Zn || bs || Un) && !Fn && !Dn, ji = typeof orientation < "u" || qt("mobile"), ro = ji && xs, oo = ji && bs, qn = !window.PointerEvent && window.MSPointerEvent, jn = !!(window.PointerEvent || qn), Wn = "ontouchstart" in window || !!window.TouchEvent, ho = !window.L_NO_TOUCH && (Wn || jn), lo = ji && Ps, uo = ji && Bn, co = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1, fo = (function() {
        var i = !1;
        try {
          var n = Object.defineProperty({}, "passive", {
            get: function() {
              i = !0;
            }
          });
          window.addEventListener("testPassiveEventSupport", m, n), window.removeEventListener("testPassiveEventSupport", m, n);
        } catch {
        }
        return i;
      })(), _o = (function() {
        return !!document.createElement("canvas").getContext;
      })(), Es = !!(document.createElementNS && Gn("svg").createSVGRect), mo = !!Es && (function() {
        var i = document.createElement("div");
        return i.innerHTML = "<svg/>", (i.firstChild && i.firstChild.namespaceURI) === "http://www.w3.org/2000/svg";
      })(), go = !Es && (function() {
        try {
          var i = document.createElement("div");
          i.innerHTML = '<v:shape adj="1"/>';
          var n = i.firstChild;
          return n.style.behavior = "url(#default#VML)", n && typeof n.adj == "object";
        } catch {
          return !1;
        }
      })(), po = navigator.platform.indexOf("Mac") === 0, vo = navigator.platform.indexOf("Linux") === 0;
      function qt(i) {
        return navigator.userAgent.toLowerCase().indexOf(i) >= 0;
      }
      var B = {
        ie: Ie,
        ielt9: to,
        edge: Nn,
        webkit: xs,
        android: Rn,
        android23: kn,
        androidStock: eo,
        opera: Ps,
        chrome: zn,
        gecko: Bn,
        safari: so,
        phantom: Dn,
        opera12: Fn,
        win: no,
        ie3d: Zn,
        webkit3d: bs,
        gecko3d: Un,
        any3d: ao,
        mobile: ji,
        mobileWebkit: ro,
        mobileWebkit3d: oo,
        msPointer: qn,
        pointer: jn,
        touch: ho,
        touchNative: Wn,
        mobileOpera: lo,
        mobileGecko: uo,
        retina: co,
        passiveEvents: fo,
        canvas: _o,
        svg: Es,
        vml: go,
        inlineSvg: mo,
        mac: po,
        linux: vo
      }, Hn = B.msPointer ? "MSPointerDown" : "pointerdown", Xn = B.msPointer ? "MSPointerMove" : "pointermove", Vn = B.msPointer ? "MSPointerUp" : "pointerup", Yn = B.msPointer ? "MSPointerCancel" : "pointercancel", Ss = {
        touchstart: Hn,
        touchmove: Xn,
        touchend: Vn,
        touchcancel: Yn
      }, Kn = {
        touchstart: bo,
        touchmove: Ge,
        touchend: Ge,
        touchcancel: Ge
      }, Mi = {}, $n = !1;
      function yo(i, n, h) {
        return n === "touchstart" && Po(), Kn[n] ? (h = Kn[n].bind(this, h), i.addEventListener(Ss[n], h, !1), h) : (console.warn("wrong event specified:", n), m);
      }
      function Mo(i, n, h) {
        if (!Ss[n]) {
          console.warn("wrong event specified:", n);
          return;
        }
        i.removeEventListener(Ss[n], h, !1);
      }
      function wo(i) {
        Mi[i.pointerId] = i;
      }
      function xo(i) {
        Mi[i.pointerId] && (Mi[i.pointerId] = i);
      }
      function Jn(i) {
        delete Mi[i.pointerId];
      }
      function Po() {
        $n || (document.addEventListener(Hn, wo, !0), document.addEventListener(Xn, xo, !0), document.addEventListener(Vn, Jn, !0), document.addEventListener(Yn, Jn, !0), $n = !0);
      }
      function Ge(i, n) {
        if (n.pointerType !== (n.MSPOINTER_TYPE_MOUSE || "mouse")) {
          n.touches = [];
          for (var h in Mi)
            n.touches.push(Mi[h]);
          n.changedTouches = [n], i(n);
        }
      }
      function bo(i, n) {
        n.MSPOINTER_TYPE_TOUCH && n.pointerType === n.MSPOINTER_TYPE_TOUCH && pt(n), Ge(i, n);
      }
      function Eo(i) {
        var n = {}, h, f;
        for (f in i)
          h = i[f], n[f] = h && h.bind ? h.bind(i) : h;
        return i = n, n.type = "dblclick", n.detail = 2, n.isTrusted = !1, n._simulated = !0, n;
      }
      var So = 200;
      function Ao(i, n) {
        i.addEventListener("dblclick", n);
        var h = 0, f;
        function _(v) {
          if (v.detail !== 1) {
            f = v.detail;
            return;
          }
          if (!(v.pointerType === "mouse" || v.sourceCapabilities && !v.sourceCapabilities.firesTouchEvents)) {
            var x = sa(v);
            if (!(x.some(function(S) {
              return S instanceof HTMLLabelElement && S.attributes.for;
            }) && !x.some(function(S) {
              return S instanceof HTMLInputElement || S instanceof HTMLSelectElement;
            }))) {
              var b = Date.now();
              b - h <= So ? (f++, f === 2 && n(Eo(v))) : f = 1, h = b;
            }
          }
        }
        return i.addEventListener("click", _), {
          dblclick: n,
          simDblclick: _
        };
      }
      function Lo(i, n) {
        i.removeEventListener("dblclick", n.dblclick), i.removeEventListener("click", n.simDblclick);
      }
      var As = Re(
        ["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]
      ), Wi = Re(
        ["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]
      ), Qn = Wi === "webkitTransition" || Wi === "OTransition" ? Wi + "End" : "transitionend";
      function ta(i) {
        return typeof i == "string" ? document.getElementById(i) : i;
      }
      function Hi(i, n) {
        var h = i.style[n] || i.currentStyle && i.currentStyle[n];
        if ((!h || h === "auto") && document.defaultView) {
          var f = document.defaultView.getComputedStyle(i, null);
          h = f ? f[n] : null;
        }
        return h === "auto" ? null : h;
      }
      function J(i, n, h) {
        var f = document.createElement(i);
        return f.className = n || "", h && h.appendChild(f), f;
      }
      function at(i) {
        var n = i.parentNode;
        n && n.removeChild(i);
      }
      function Oe(i) {
        for (; i.firstChild; )
          i.removeChild(i.firstChild);
      }
      function wi(i) {
        var n = i.parentNode;
        n && n.lastChild !== i && n.appendChild(i);
      }
      function xi(i) {
        var n = i.parentNode;
        n && n.firstChild !== i && n.insertBefore(i, n.firstChild);
      }
      function Ls(i, n) {
        if (i.classList !== void 0)
          return i.classList.contains(n);
        var h = Ne(i);
        return h.length > 0 && new RegExp("(^|\\s)" + n + "(\\s|$)").test(h);
      }
      function W(i, n) {
        if (i.classList !== void 0)
          for (var h = M(n), f = 0, _ = h.length; f < _; f++)
            i.classList.add(h[f]);
        else if (!Ls(i, n)) {
          var v = Ne(i);
          Ts(i, (v ? v + " " : "") + n);
        }
      }
      function lt(i, n) {
        i.classList !== void 0 ? i.classList.remove(n) : Ts(i, y((" " + Ne(i) + " ").replace(" " + n + " ", " ")));
      }
      function Ts(i, n) {
        i.className.baseVal === void 0 ? i.className = n : i.className.baseVal = n;
      }
      function Ne(i) {
        return i.correspondingElement && (i = i.correspondingElement), i.className.baseVal === void 0 ? i.className : i.className.baseVal;
      }
      function It(i, n) {
        "opacity" in i.style ? i.style.opacity = n : "filter" in i.style && To(i, n);
      }
      function To(i, n) {
        var h = !1, f = "DXImageTransform.Microsoft.Alpha";
        try {
          h = i.filters.item(f);
        } catch {
          if (n === 1)
            return;
        }
        n = Math.round(n * 100), h ? (h.Enabled = n !== 100, h.Opacity = n) : i.style.filter += " progid:" + f + "(opacity=" + n + ")";
      }
      function Re(i) {
        for (var n = document.documentElement.style, h = 0; h < i.length; h++)
          if (i[h] in n)
            return i[h];
        return !1;
      }
      function ci(i, n, h) {
        var f = n || new q(0, 0);
        i.style[As] = (B.ie3d ? "translate(" + f.x + "px," + f.y + "px)" : "translate3d(" + f.x + "px," + f.y + "px,0)") + (h ? " scale(" + h + ")" : "");
      }
      function ft(i, n) {
        i._leaflet_pos = n, B.any3d ? ci(i, n) : (i.style.left = n.x + "px", i.style.top = n.y + "px");
      }
      function fi(i) {
        return i._leaflet_pos || new q(0, 0);
      }
      var Xi, Vi, Cs;
      if ("onselectstart" in document)
        Xi = function() {
          j(window, "selectstart", pt);
        }, Vi = function() {
          st(window, "selectstart", pt);
        };
      else {
        var Yi = Re(
          ["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]
        );
        Xi = function() {
          if (Yi) {
            var i = document.documentElement.style;
            Cs = i[Yi], i[Yi] = "none";
          }
        }, Vi = function() {
          Yi && (document.documentElement.style[Yi] = Cs, Cs = void 0);
        };
      }
      function Is() {
        j(window, "dragstart", pt);
      }
      function Gs() {
        st(window, "dragstart", pt);
      }
      var ke, Os;
      function Ns(i) {
        for (; i.tabIndex === -1; )
          i = i.parentNode;
        i.style && (ze(), ke = i, Os = i.style.outlineStyle, i.style.outlineStyle = "none", j(window, "keydown", ze));
      }
      function ze() {
        ke && (ke.style.outlineStyle = Os, ke = void 0, Os = void 0, st(window, "keydown", ze));
      }
      function ia(i) {
        do
          i = i.parentNode;
        while ((!i.offsetWidth || !i.offsetHeight) && i !== document.body);
        return i;
      }
      function Rs(i) {
        var n = i.getBoundingClientRect();
        return {
          x: n.width / i.offsetWidth || 1,
          y: n.height / i.offsetHeight || 1,
          boundingClientRect: n
        };
      }
      var Co = {
        __proto__: null,
        TRANSFORM: As,
        TRANSITION: Wi,
        TRANSITION_END: Qn,
        get: ta,
        getStyle: Hi,
        create: J,
        remove: at,
        empty: Oe,
        toFront: wi,
        toBack: xi,
        hasClass: Ls,
        addClass: W,
        removeClass: lt,
        setClass: Ts,
        getClass: Ne,
        setOpacity: It,
        testProp: Re,
        setTransform: ci,
        setPosition: ft,
        getPosition: fi,
        get disableTextSelection() {
          return Xi;
        },
        get enableTextSelection() {
          return Vi;
        },
        disableImageDrag: Is,
        enableImageDrag: Gs,
        preventOutline: Ns,
        restoreOutline: ze,
        getSizedParentNode: ia,
        getScale: Rs
      };
      function j(i, n, h, f) {
        if (n && typeof n == "object")
          for (var _ in n)
            zs(i, _, n[_], h);
        else {
          n = M(n);
          for (var v = 0, x = n.length; v < x; v++)
            zs(i, n[v], h, f);
        }
        return this;
      }
      var jt = "_leaflet_events";
      function st(i, n, h, f) {
        if (arguments.length === 1)
          ea(i), delete i[jt];
        else if (n && typeof n == "object")
          for (var _ in n)
            Bs(i, _, n[_], h);
        else if (n = M(n), arguments.length === 2)
          ea(i, function(b) {
            return G(n, b) !== -1;
          });
        else
          for (var v = 0, x = n.length; v < x; v++)
            Bs(i, n[v], h, f);
        return this;
      }
      function ea(i, n) {
        for (var h in i[jt]) {
          var f = h.split(/\d/)[0];
          (!n || n(f)) && Bs(i, f, null, null, h);
        }
      }
      var ks = {
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        wheel: !("onwheel" in window) && "mousewheel"
      };
      function zs(i, n, h, f) {
        var _ = n + c(h) + (f ? "_" + c(f) : "");
        if (i[jt] && i[jt][_])
          return this;
        var v = function(b) {
          return h.call(f || i, b || window.event);
        }, x = v;
        !B.touchNative && B.pointer && n.indexOf("touch") === 0 ? v = yo(i, n, v) : B.touch && n === "dblclick" ? v = Ao(i, v) : "addEventListener" in i ? n === "touchstart" || n === "touchmove" || n === "wheel" || n === "mousewheel" ? i.addEventListener(ks[n] || n, v, B.passiveEvents ? { passive: !1 } : !1) : n === "mouseenter" || n === "mouseleave" ? (v = function(b) {
          b = b || window.event, Fs(i, b) && x(b);
        }, i.addEventListener(ks[n], v, !1)) : i.addEventListener(n, x, !1) : i.attachEvent("on" + n, v), i[jt] = i[jt] || {}, i[jt][_] = v;
      }
      function Bs(i, n, h, f, _) {
        _ = _ || n + c(h) + (f ? "_" + c(f) : "");
        var v = i[jt] && i[jt][_];
        if (!v)
          return this;
        !B.touchNative && B.pointer && n.indexOf("touch") === 0 ? Mo(i, n, v) : B.touch && n === "dblclick" ? Lo(i, v) : "removeEventListener" in i ? i.removeEventListener(ks[n] || n, v, !1) : i.detachEvent("on" + n, v), i[jt][_] = null;
      }
      function di(i) {
        return i.stopPropagation ? i.stopPropagation() : i.originalEvent ? i.originalEvent._stopped = !0 : i.cancelBubble = !0, this;
      }
      function Ds(i) {
        return zs(i, "wheel", di), this;
      }
      function Ki(i) {
        return j(i, "mousedown touchstart dblclick contextmenu", di), i._leaflet_disable_click = !0, this;
      }
      function pt(i) {
        return i.preventDefault ? i.preventDefault() : i.returnValue = !1, this;
      }
      function _i(i) {
        return pt(i), di(i), this;
      }
      function sa(i) {
        if (i.composedPath)
          return i.composedPath();
        for (var n = [], h = i.target; h; )
          n.push(h), h = h.parentNode;
        return n;
      }
      function na(i, n) {
        if (!n)
          return new q(i.clientX, i.clientY);
        var h = Rs(n), f = h.boundingClientRect;
        return new q(
          // offset.left/top values are in page scale (like clientX/Y),
          // whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
          (i.clientX - f.left) / h.x - n.clientLeft,
          (i.clientY - f.top) / h.y - n.clientTop
        );
      }
      var Io = B.linux && B.chrome ? window.devicePixelRatio : B.mac ? window.devicePixelRatio * 3 : window.devicePixelRatio > 0 ? 2 * window.devicePixelRatio : 1;
      function aa(i) {
        return B.edge ? i.wheelDeltaY / 2 : (
          // Don't trust window-geometry-based delta
          i.deltaY && i.deltaMode === 0 ? -i.deltaY / Io : (
            // Pixels
            i.deltaY && i.deltaMode === 1 ? -i.deltaY * 20 : (
              // Lines
              i.deltaY && i.deltaMode === 2 ? -i.deltaY * 60 : (
                // Pages
                i.deltaX || i.deltaZ ? 0 : (
                  // Skip horizontal/depth wheel events
                  i.wheelDelta ? (i.wheelDeltaY || i.wheelDelta) / 2 : (
                    // Legacy IE pixels
                    i.detail && Math.abs(i.detail) < 32765 ? -i.detail * 20 : (
                      // Legacy Moz lines
                      i.detail ? i.detail / -32765 * 60 : (
                        // Legacy Moz pages
                        0
                      )
                    )
                  )
                )
              )
            )
          )
        );
      }
      function Fs(i, n) {
        var h = n.relatedTarget;
        if (!h)
          return !0;
        try {
          for (; h && h !== i; )
            h = h.parentNode;
        } catch {
          return !1;
        }
        return h !== i;
      }
      var Go = {
        __proto__: null,
        on: j,
        off: st,
        stopPropagation: di,
        disableScrollPropagation: Ds,
        disableClickPropagation: Ki,
        preventDefault: pt,
        stop: _i,
        getPropagationPath: sa,
        getMousePosition: na,
        getWheelDelta: aa,
        isExternalTarget: Fs,
        addListener: j,
        removeListener: st
      }, ra = Ui.extend({
        // @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
        // Run an animation of a given element to a new position, optionally setting
        // duration in seconds (`0.25` by default) and easing linearity factor (3rd
        // argument of the [cubic bezier curve](https://cubic-bezier.com/#0,0,.5,1),
        // `0.5` by default).
        run: function(i, n, h, f) {
          this.stop(), this._el = i, this._inProgress = !0, this._duration = h || 0.25, this._easeOutPower = 1 / Math.max(f || 0.5, 0.2), this._startPos = fi(i), this._offset = n.subtract(this._startPos), this._startTime = +/* @__PURE__ */ new Date(), this.fire("start"), this._animate();
        },
        // @method stop()
        // Stops the animation (if currently running).
        stop: function() {
          this._inProgress && (this._step(!0), this._complete());
        },
        _animate: function() {
          this._animId = Q(this._animate, this), this._step();
        },
        _step: function(i) {
          var n = +/* @__PURE__ */ new Date() - this._startTime, h = this._duration * 1e3;
          n < h ? this._runFrame(this._easeOut(n / h), i) : (this._runFrame(1), this._complete());
        },
        _runFrame: function(i, n) {
          var h = this._startPos.add(this._offset.multiplyBy(i));
          n && h._round(), ft(this._el, h), this.fire("step");
        },
        _complete: function() {
          _t(this._animId), this._inProgress = !1, this.fire("end");
        },
        _easeOut: function(i) {
          return 1 - Math.pow(1 - i, this._easeOutPower);
        }
      }), $ = Ui.extend({
        options: {
          // @section Map State Options
          // @option crs: CRS = L.CRS.EPSG3857
          // The [Coordinate Reference System](#crs) to use. Don't change this if you're not
          // sure what it means.
          crs: Ms,
          // @option center: LatLng = undefined
          // Initial geographic center of the map
          center: void 0,
          // @option zoom: Number = undefined
          // Initial map zoom level
          zoom: void 0,
          // @option minZoom: Number = *
          // Minimum zoom level of the map.
          // If not specified and at least one `GridLayer` or `TileLayer` is in the map,
          // the lowest of their `minZoom` options will be used instead.
          minZoom: void 0,
          // @option maxZoom: Number = *
          // Maximum zoom level of the map.
          // If not specified and at least one `GridLayer` or `TileLayer` is in the map,
          // the highest of their `maxZoom` options will be used instead.
          maxZoom: void 0,
          // @option layers: Layer[] = []
          // Array of layers that will be added to the map initially
          layers: [],
          // @option maxBounds: LatLngBounds = null
          // When this option is set, the map restricts the view to the given
          // geographical bounds, bouncing the user back if the user tries to pan
          // outside the view. To set the restriction dynamically, use
          // [`setMaxBounds`](#map-setmaxbounds) method.
          maxBounds: void 0,
          // @option renderer: Renderer = *
          // The default method for drawing vector layers on the map. `L.SVG`
          // or `L.Canvas` by default depending on browser support.
          renderer: void 0,
          // @section Animation Options
          // @option zoomAnimation: Boolean = true
          // Whether the map zoom animation is enabled. By default it's enabled
          // in all browsers that support CSS3 Transitions except Android.
          zoomAnimation: !0,
          // @option zoomAnimationThreshold: Number = 4
          // Won't animate zoom if the zoom difference exceeds this value.
          zoomAnimationThreshold: 4,
          // @option fadeAnimation: Boolean = true
          // Whether the tile fade animation is enabled. By default it's enabled
          // in all browsers that support CSS3 Transitions except Android.
          fadeAnimation: !0,
          // @option markerZoomAnimation: Boolean = true
          // Whether markers animate their zoom with the zoom animation, if disabled
          // they will disappear for the length of the animation. By default it's
          // enabled in all browsers that support CSS3 Transitions except Android.
          markerZoomAnimation: !0,
          // @option transform3DLimit: Number = 2^23
          // Defines the maximum size of a CSS translation transform. The default
          // value should not be changed unless a web browser positions layers in
          // the wrong place after doing a large `panBy`.
          transform3DLimit: 8388608,
          // Precision limit of a 32-bit float
          // @section Interaction Options
          // @option zoomSnap: Number = 1
          // Forces the map's zoom level to always be a multiple of this, particularly
          // right after a [`fitBounds()`](#map-fitbounds) or a pinch-zoom.
          // By default, the zoom level snaps to the nearest integer; lower values
          // (e.g. `0.5` or `0.1`) allow for greater granularity. A value of `0`
          // means the zoom level will not be snapped after `fitBounds` or a pinch-zoom.
          zoomSnap: 1,
          // @option zoomDelta: Number = 1
          // Controls how much the map's zoom level will change after a
          // [`zoomIn()`](#map-zoomin), [`zoomOut()`](#map-zoomout), pressing `+`
          // or `-` on the keyboard, or using the [zoom controls](#control-zoom).
          // Values smaller than `1` (e.g. `0.5`) allow for greater granularity.
          zoomDelta: 1,
          // @option trackResize: Boolean = true
          // Whether the map automatically handles browser window resize to update itself.
          trackResize: !0
        },
        initialize: function(i, n) {
          n = w(this, n), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._sizeChanged = !0, this._initContainer(i), this._initLayout(), this._onResize = l(this._onResize, this), this._initEvents(), n.maxBounds && this.setMaxBounds(n.maxBounds), n.zoom !== void 0 && (this._zoom = this._limitZoom(n.zoom)), n.center && n.zoom !== void 0 && this.setView(K(n.center), n.zoom, { reset: !0 }), this.callInitHooks(), this._zoomAnimated = Wi && B.any3d && !B.mobileOpera && this.options.zoomAnimation, this._zoomAnimated && (this._createAnimProxy(), j(this._proxy, Qn, this._catchTransitionEnd, this)), this._addLayers(this.options.layers);
        },
        // @section Methods for modifying map state
        // @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
        // Sets the view of the map (geographical center and zoom) with the given
        // animation options.
        setView: function(i, n, h) {
          if (n = n === void 0 ? this._zoom : this._limitZoom(n), i = this._limitCenter(K(i), n, this.options.maxBounds), h = h || {}, this._stop(), this._loaded && !h.reset && h !== !0) {
            h.animate !== void 0 && (h.zoom = r({ animate: h.animate }, h.zoom), h.pan = r({ animate: h.animate, duration: h.duration }, h.pan));
            var f = this._zoom !== n ? this._tryAnimatedZoom && this._tryAnimatedZoom(i, n, h.zoom) : this._tryAnimatedPan(i, h.pan);
            if (f)
              return clearTimeout(this._sizeTimer), this;
          }
          return this._resetView(i, n, h.pan && h.pan.noMoveStart), this;
        },
        // @method setZoom(zoom: Number, options?: Zoom/pan options): this
        // Sets the zoom of the map.
        setZoom: function(i, n) {
          return this._loaded ? this.setView(this.getCenter(), i, { zoom: n }) : (this._zoom = i, this);
        },
        // @method zoomIn(delta?: Number, options?: Zoom options): this
        // Increases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
        zoomIn: function(i, n) {
          return i = i || (B.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom + i, n);
        },
        // @method zoomOut(delta?: Number, options?: Zoom options): this
        // Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
        zoomOut: function(i, n) {
          return i = i || (B.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom - i, n);
        },
        // @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
        // Zooms the map while keeping a specified geographical point on the map
        // stationary (e.g. used internally for scroll zoom and double-click zoom).
        // @alternative
        // @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
        // Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
        setZoomAround: function(i, n, h) {
          var f = this.getZoomScale(n), _ = this.getSize().divideBy(2), v = i instanceof q ? i : this.latLngToContainerPoint(i), x = v.subtract(_).multiplyBy(1 - 1 / f), b = this.containerPointToLatLng(_.add(x));
          return this.setView(b, n, { zoom: h });
        },
        _getBoundsCenterZoom: function(i, n) {
          n = n || {}, i = i.getBounds ? i.getBounds() : ct(i);
          var h = U(n.paddingTopLeft || n.padding || [0, 0]), f = U(n.paddingBottomRight || n.padding || [0, 0]), _ = this.getBoundsZoom(i, !1, h.add(f));
          if (_ = typeof n.maxZoom == "number" ? Math.min(n.maxZoom, _) : _, _ === 1 / 0)
            return {
              center: i.getCenter(),
              zoom: _
            };
          var v = f.subtract(h).divideBy(2), x = this.project(i.getSouthWest(), _), b = this.project(i.getNorthEast(), _), S = this.unproject(x.add(b).divideBy(2).add(v), _);
          return {
            center: S,
            zoom: _
          };
        },
        // @method fitBounds(bounds: LatLngBounds, options?: fitBounds options): this
        // Sets a map view that contains the given geographical bounds with the
        // maximum zoom level possible.
        fitBounds: function(i, n) {
          if (i = ct(i), !i.isValid())
            throw new Error("Bounds are not valid.");
          var h = this._getBoundsCenterZoom(i, n);
          return this.setView(h.center, h.zoom, n);
        },
        // @method fitWorld(options?: fitBounds options): this
        // Sets a map view that mostly contains the whole world with the maximum
        // zoom level possible.
        fitWorld: function(i) {
          return this.fitBounds([[-90, -180], [90, 180]], i);
        },
        // @method panTo(latlng: LatLng, options?: Pan options): this
        // Pans the map to a given center.
        panTo: function(i, n) {
          return this.setView(i, this._zoom, { pan: n });
        },
        // @method panBy(offset: Point, options?: Pan options): this
        // Pans the map by a given number of pixels (animated).
        panBy: function(i, n) {
          if (i = U(i).round(), n = n || {}, !i.x && !i.y)
            return this.fire("moveend");
          if (n.animate !== !0 && !this.getSize().contains(i))
            return this._resetView(this.unproject(this.project(this.getCenter()).add(i)), this.getZoom()), this;
          if (this._panAnim || (this._panAnim = new ra(), this._panAnim.on({
            step: this._onPanTransitionStep,
            end: this._onPanTransitionEnd
          }, this)), n.noMoveStart || this.fire("movestart"), n.animate !== !1) {
            W(this._mapPane, "leaflet-pan-anim");
            var h = this._getMapPanePos().subtract(i).round();
            this._panAnim.run(this._mapPane, h, n.duration || 0.25, n.easeLinearity);
          } else
            this._rawPanBy(i), this.fire("move").fire("moveend");
          return this;
        },
        // @method flyTo(latlng: LatLng, zoom?: Number, options?: Zoom/pan options): this
        // Sets the view of the map (geographical center and zoom) performing a smooth
        // pan-zoom animation.
        flyTo: function(i, n, h) {
          if (h = h || {}, h.animate === !1 || !B.any3d)
            return this.setView(i, n, h);
          this._stop();
          var f = this.project(this.getCenter()), _ = this.project(i), v = this.getSize(), x = this._zoom;
          i = K(i), n = n === void 0 ? x : n;
          var b = Math.max(v.x, v.y), S = b * this.getZoomScale(x, n), C = _.distanceTo(f) || 1, k = 1.42, D = k * k;
          function H(dt) {
            var Ye = dt ? -1 : 1, Mh = dt ? S : b, wh = S * S - b * b + Ye * D * D * C * C, xh = 2 * Mh * D * C, $s = wh / xh, Fa = Math.sqrt($s * $s + 1) - $s, Ph = Fa < 1e-9 ? -18 : Math.log(Fa);
            return Ph;
          }
          function wt(dt) {
            return (Math.exp(dt) - Math.exp(-dt)) / 2;
          }
          function gt(dt) {
            return (Math.exp(dt) + Math.exp(-dt)) / 2;
          }
          function Ot(dt) {
            return wt(dt) / gt(dt);
          }
          var Et = H(0);
          function Li(dt) {
            return b * (gt(Et) / gt(Et + k * dt));
          }
          function gh(dt) {
            return b * (gt(Et) * Ot(Et + k * dt) - wt(Et)) / D;
          }
          function ph(dt) {
            return 1 - Math.pow(1 - dt, 1.5);
          }
          var vh = Date.now(), Ba = (H(1) - Et) / k, yh = h.duration ? 1e3 * h.duration : 1e3 * Ba * 0.8;
          function Da() {
            var dt = (Date.now() - vh) / yh, Ye = ph(dt) * Ba;
            dt <= 1 ? (this._flyToFrame = Q(Da, this), this._move(
              this.unproject(f.add(_.subtract(f).multiplyBy(gh(Ye) / C)), x),
              this.getScaleZoom(b / Li(Ye), x),
              { flyTo: !0 }
            )) : this._move(i, n)._moveEnd(!0);
          }
          return this._moveStart(!0, h.noMoveStart), Da.call(this), this;
        },
        // @method flyToBounds(bounds: LatLngBounds, options?: fitBounds options): this
        // Sets the view of the map with a smooth animation like [`flyTo`](#map-flyto),
        // but takes a bounds parameter like [`fitBounds`](#map-fitbounds).
        flyToBounds: function(i, n) {
          var h = this._getBoundsCenterZoom(i, n);
          return this.flyTo(h.center, h.zoom, n);
        },
        // @method setMaxBounds(bounds: LatLngBounds): this
        // Restricts the map view to the given bounds (see the [maxBounds](#map-maxbounds) option).
        setMaxBounds: function(i) {
          return i = ct(i), this.listens("moveend", this._panInsideMaxBounds) && this.off("moveend", this._panInsideMaxBounds), i.isValid() ? (this.options.maxBounds = i, this._loaded && this._panInsideMaxBounds(), this.on("moveend", this._panInsideMaxBounds)) : (this.options.maxBounds = null, this);
        },
        // @method setMinZoom(zoom: Number): this
        // Sets the lower limit for the available zoom levels (see the [minZoom](#map-minzoom) option).
        setMinZoom: function(i) {
          var n = this.options.minZoom;
          return this.options.minZoom = i, this._loaded && n !== i && (this.fire("zoomlevelschange"), this.getZoom() < this.options.minZoom) ? this.setZoom(i) : this;
        },
        // @method setMaxZoom(zoom: Number): this
        // Sets the upper limit for the available zoom levels (see the [maxZoom](#map-maxzoom) option).
        setMaxZoom: function(i) {
          var n = this.options.maxZoom;
          return this.options.maxZoom = i, this._loaded && n !== i && (this.fire("zoomlevelschange"), this.getZoom() > this.options.maxZoom) ? this.setZoom(i) : this;
        },
        // @method panInsideBounds(bounds: LatLngBounds, options?: Pan options): this
        // Pans the map to the closest view that would lie inside the given bounds (if it's not already), controlling the animation using the options specific, if any.
        panInsideBounds: function(i, n) {
          this._enforcingBounds = !0;
          var h = this.getCenter(), f = this._limitCenter(h, this._zoom, ct(i));
          return h.equals(f) || this.panTo(f, n), this._enforcingBounds = !1, this;
        },
        // @method panInside(latlng: LatLng, options?: padding options): this
        // Pans the map the minimum amount to make the `latlng` visible. Use
        // padding options to fit the display to more restricted bounds.
        // If `latlng` is already within the (optionally padded) display bounds,
        // the map will not be panned.
        panInside: function(i, n) {
          n = n || {};
          var h = U(n.paddingTopLeft || n.padding || [0, 0]), f = U(n.paddingBottomRight || n.padding || [0, 0]), _ = this.project(this.getCenter()), v = this.project(i), x = this.getPixelBounds(), b = Pt([x.min.add(h), x.max.subtract(f)]), S = b.getSize();
          if (!b.contains(v)) {
            this._enforcingBounds = !0;
            var C = v.subtract(b.getCenter()), k = b.extend(v).getSize().subtract(S);
            _.x += C.x < 0 ? -k.x : k.x, _.y += C.y < 0 ? -k.y : k.y, this.panTo(this.unproject(_), n), this._enforcingBounds = !1;
          }
          return this;
        },
        // @method invalidateSize(options: Zoom/pan options): this
        // Checks if the map container size changed and updates the map if so —
        // call it after you've changed the map size dynamically, also animating
        // pan by default. If `options.pan` is `false`, panning will not occur.
        // If `options.debounceMoveend` is `true`, it will delay `moveend` event so
        // that it doesn't happen often even if the method is called many
        // times in a row.
        // @alternative
        // @method invalidateSize(animate: Boolean): this
        // Checks if the map container size changed and updates the map if so —
        // call it after you've changed the map size dynamically, also animating
        // pan by default.
        invalidateSize: function(i) {
          if (!this._loaded)
            return this;
          i = r({
            animate: !1,
            pan: !0
          }, i === !0 ? { animate: !0 } : i);
          var n = this.getSize();
          this._sizeChanged = !0, this._lastCenter = null;
          var h = this.getSize(), f = n.divideBy(2).round(), _ = h.divideBy(2).round(), v = f.subtract(_);
          return !v.x && !v.y ? this : (i.animate && i.pan ? this.panBy(v) : (i.pan && this._rawPanBy(v), this.fire("move"), i.debounceMoveend ? (clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(l(this.fire, this, "moveend"), 200)) : this.fire("moveend")), this.fire("resize", {
            oldSize: n,
            newSize: h
          }));
        },
        // @section Methods for modifying map state
        // @method stop(): this
        // Stops the currently running `panTo` or `flyTo` animation, if any.
        stop: function() {
          return this.setZoom(this._limitZoom(this._zoom)), this.options.zoomSnap || this.fire("viewreset"), this._stop();
        },
        // @section Geolocation methods
        // @method locate(options?: Locate options): this
        // Tries to locate the user using the Geolocation API, firing a [`locationfound`](#map-locationfound)
        // event with location data on success or a [`locationerror`](#map-locationerror) event on failure,
        // and optionally sets the map view to the user's location with respect to
        // detection accuracy (or to the world view if geolocation failed).
        // Note that, if your page doesn't use HTTPS, this method will fail in
        // modern browsers ([Chrome 50 and newer](https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins))
        // See `Locate options` for more details.
        locate: function(i) {
          if (i = this._locateOptions = r({
            timeout: 1e4,
            watch: !1
            // setView: false
            // maxZoom: <Number>
            // maximumAge: 0
            // enableHighAccuracy: false
          }, i), !("geolocation" in navigator))
            return this._handleGeolocationError({
              code: 0,
              message: "Geolocation not supported."
            }), this;
          var n = l(this._handleGeolocationResponse, this), h = l(this._handleGeolocationError, this);
          return i.watch ? this._locationWatchId = navigator.geolocation.watchPosition(n, h, i) : navigator.geolocation.getCurrentPosition(n, h, i), this;
        },
        // @method stopLocate(): this
        // Stops watching location previously initiated by `map.locate({watch: true})`
        // and aborts resetting the map view if map.locate was called with
        // `{setView: true}`.
        stopLocate: function() {
          return navigator.geolocation && navigator.geolocation.clearWatch && navigator.geolocation.clearWatch(this._locationWatchId), this._locateOptions && (this._locateOptions.setView = !1), this;
        },
        _handleGeolocationError: function(i) {
          if (this._container._leaflet_id) {
            var n = i.code, h = i.message || (n === 1 ? "permission denied" : n === 2 ? "position unavailable" : "timeout");
            this._locateOptions.setView && !this._loaded && this.fitWorld(), this.fire("locationerror", {
              code: n,
              message: "Geolocation error: " + h + "."
            });
          }
        },
        _handleGeolocationResponse: function(i) {
          if (this._container._leaflet_id) {
            var n = i.coords.latitude, h = i.coords.longitude, f = new et(n, h), _ = f.toBounds(i.coords.accuracy * 2), v = this._locateOptions;
            if (v.setView) {
              var x = this.getBoundsZoom(_);
              this.setView(f, v.maxZoom ? Math.min(x, v.maxZoom) : x);
            }
            var b = {
              latlng: f,
              bounds: _,
              timestamp: i.timestamp
            };
            for (var S in i.coords)
              typeof i.coords[S] == "number" && (b[S] = i.coords[S]);
            this.fire("locationfound", b);
          }
        },
        // TODO Appropriate docs section?
        // @section Other Methods
        // @method addHandler(name: String, HandlerClass: Function): this
        // Adds a new `Handler` to the map, given its name and constructor function.
        addHandler: function(i, n) {
          if (!n)
            return this;
          var h = this[i] = new n(this);
          return this._handlers.push(h), this.options[i] && h.enable(), this;
        },
        // @method remove(): this
        // Destroys the map and clears all related event listeners.
        remove: function() {
          if (this._initEvents(!0), this.options.maxBounds && this.off("moveend", this._panInsideMaxBounds), this._containerId !== this._container._leaflet_id)
            throw new Error("Map container is being reused by another instance");
          try {
            delete this._container._leaflet_id, delete this._containerId;
          } catch {
            this._container._leaflet_id = void 0, this._containerId = void 0;
          }
          this._locationWatchId !== void 0 && this.stopLocate(), this._stop(), at(this._mapPane), this._clearControlPos && this._clearControlPos(), this._resizeRequest && (_t(this._resizeRequest), this._resizeRequest = null), this._clearHandlers(), this._loaded && this.fire("unload");
          var i;
          for (i in this._layers)
            this._layers[i].remove();
          for (i in this._panes)
            at(this._panes[i]);
          return this._layers = [], this._panes = [], delete this._mapPane, delete this._renderer, this;
        },
        // @section Other Methods
        // @method createPane(name: String, container?: HTMLElement): HTMLElement
        // Creates a new [map pane](#map-pane) with the given name if it doesn't exist already,
        // then returns it. The pane is created as a child of `container`, or
        // as a child of the main map pane if not set.
        createPane: function(i, n) {
          var h = "leaflet-pane" + (i ? " leaflet-" + i.replace("Pane", "") + "-pane" : ""), f = J("div", h, n || this._mapPane);
          return i && (this._panes[i] = f), f;
        },
        // @section Methods for Getting Map State
        // @method getCenter(): LatLng
        // Returns the geographical center of the map view
        getCenter: function() {
          return this._checkIfLoaded(), this._lastCenter && !this._moved() ? this._lastCenter.clone() : this.layerPointToLatLng(this._getCenterLayerPoint());
        },
        // @method getZoom(): Number
        // Returns the current zoom level of the map view
        getZoom: function() {
          return this._zoom;
        },
        // @method getBounds(): LatLngBounds
        // Returns the geographical bounds visible in the current map view
        getBounds: function() {
          var i = this.getPixelBounds(), n = this.unproject(i.getBottomLeft()), h = this.unproject(i.getTopRight());
          return new bt(n, h);
        },
        // @method getMinZoom(): Number
        // Returns the minimum zoom level of the map (if set in the `minZoom` option of the map or of any layers), or `0` by default.
        getMinZoom: function() {
          return this.options.minZoom === void 0 ? this._layersMinZoom || 0 : this.options.minZoom;
        },
        // @method getMaxZoom(): Number
        // Returns the maximum zoom level of the map (if set in the `maxZoom` option of the map or of any layers).
        getMaxZoom: function() {
          return this.options.maxZoom === void 0 ? this._layersMaxZoom === void 0 ? 1 / 0 : this._layersMaxZoom : this.options.maxZoom;
        },
        // @method getBoundsZoom(bounds: LatLngBounds, inside?: Boolean, padding?: Point): Number
        // Returns the maximum zoom level on which the given bounds fit to the map
        // view in its entirety. If `inside` (optional) is set to `true`, the method
        // instead returns the minimum zoom level on which the map view fits into
        // the given bounds in its entirety.
        getBoundsZoom: function(i, n, h) {
          i = ct(i), h = U(h || [0, 0]);
          var f = this.getZoom() || 0, _ = this.getMinZoom(), v = this.getMaxZoom(), x = i.getNorthWest(), b = i.getSouthEast(), S = this.getSize().subtract(h), C = Pt(this.project(b, f), this.project(x, f)).getSize(), k = B.any3d ? this.options.zoomSnap : 1, D = S.x / C.x, H = S.y / C.y, wt = n ? Math.max(D, H) : Math.min(D, H);
          return f = this.getScaleZoom(wt, f), k && (f = Math.round(f / (k / 100)) * (k / 100), f = n ? Math.ceil(f / k) * k : Math.floor(f / k) * k), Math.max(_, Math.min(v, f));
        },
        // @method getSize(): Point
        // Returns the current size of the map container (in pixels).
        getSize: function() {
          return (!this._size || this._sizeChanged) && (this._size = new q(
            this._container.clientWidth || 0,
            this._container.clientHeight || 0
          ), this._sizeChanged = !1), this._size.clone();
        },
        // @method getPixelBounds(): Bounds
        // Returns the bounds of the current map view in projected pixel
        // coordinates (sometimes useful in layer and overlay implementations).
        getPixelBounds: function(i, n) {
          var h = this._getTopLeftPoint(i, n);
          return new nt(h, h.add(this.getSize()));
        },
        // TODO: Check semantics - isn't the pixel origin the 0,0 coord relative to
        // the map pane? "left point of the map layer" can be confusing, specially
        // since there can be negative offsets.
        // @method getPixelOrigin(): Point
        // Returns the projected pixel coordinates of the top left point of
        // the map layer (useful in custom layer and overlay implementations).
        getPixelOrigin: function() {
          return this._checkIfLoaded(), this._pixelOrigin;
        },
        // @method getPixelWorldBounds(zoom?: Number): Bounds
        // Returns the world's bounds in pixel coordinates for zoom level `zoom`.
        // If `zoom` is omitted, the map's current zoom level is used.
        getPixelWorldBounds: function(i) {
          return this.options.crs.getProjectedBounds(i === void 0 ? this.getZoom() : i);
        },
        // @section Other Methods
        // @method getPane(pane: String|HTMLElement): HTMLElement
        // Returns a [map pane](#map-pane), given its name or its HTML element (its identity).
        getPane: function(i) {
          return typeof i == "string" ? this._panes[i] : i;
        },
        // @method getPanes(): Object
        // Returns a plain object containing the names of all [panes](#map-pane) as keys and
        // the panes as values.
        getPanes: function() {
          return this._panes;
        },
        // @method getContainer: HTMLElement
        // Returns the HTML element that contains the map.
        getContainer: function() {
          return this._container;
        },
        // @section Conversion Methods
        // @method getZoomScale(toZoom: Number, fromZoom: Number): Number
        // Returns the scale factor to be applied to a map transition from zoom level
        // `fromZoom` to `toZoom`. Used internally to help with zoom animations.
        getZoomScale: function(i, n) {
          var h = this.options.crs;
          return n = n === void 0 ? this._zoom : n, h.scale(i) / h.scale(n);
        },
        // @method getScaleZoom(scale: Number, fromZoom: Number): Number
        // Returns the zoom level that the map would end up at, if it is at `fromZoom`
        // level and everything is scaled by a factor of `scale`. Inverse of
        // [`getZoomScale`](#map-getZoomScale).
        getScaleZoom: function(i, n) {
          var h = this.options.crs;
          n = n === void 0 ? this._zoom : n;
          var f = h.zoom(i * h.scale(n));
          return isNaN(f) ? 1 / 0 : f;
        },
        // @method project(latlng: LatLng, zoom: Number): Point
        // Projects a geographical coordinate `LatLng` according to the projection
        // of the map's CRS, then scales it according to `zoom` and the CRS's
        // `Transformation`. The result is pixel coordinate relative to
        // the CRS origin.
        project: function(i, n) {
          return n = n === void 0 ? this._zoom : n, this.options.crs.latLngToPoint(K(i), n);
        },
        // @method unproject(point: Point, zoom: Number): LatLng
        // Inverse of [`project`](#map-project).
        unproject: function(i, n) {
          return n = n === void 0 ? this._zoom : n, this.options.crs.pointToLatLng(U(i), n);
        },
        // @method layerPointToLatLng(point: Point): LatLng
        // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
        // returns the corresponding geographical coordinate (for the current zoom level).
        layerPointToLatLng: function(i) {
          var n = U(i).add(this.getPixelOrigin());
          return this.unproject(n);
        },
        // @method latLngToLayerPoint(latlng: LatLng): Point
        // Given a geographical coordinate, returns the corresponding pixel coordinate
        // relative to the [origin pixel](#map-getpixelorigin).
        latLngToLayerPoint: function(i) {
          var n = this.project(K(i))._round();
          return n._subtract(this.getPixelOrigin());
        },
        // @method wrapLatLng(latlng: LatLng): LatLng
        // Returns a `LatLng` where `lat` and `lng` has been wrapped according to the
        // map's CRS's `wrapLat` and `wrapLng` properties, if they are outside the
        // CRS's bounds.
        // By default this means longitude is wrapped around the dateline so its
        // value is between -180 and +180 degrees.
        wrapLatLng: function(i) {
          return this.options.crs.wrapLatLng(K(i));
        },
        // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
        // Returns a `LatLngBounds` with the same size as the given one, ensuring that
        // its center is within the CRS's bounds.
        // By default this means the center longitude is wrapped around the dateline so its
        // value is between -180 and +180 degrees, and the majority of the bounds
        // overlaps the CRS's bounds.
        wrapLatLngBounds: function(i) {
          return this.options.crs.wrapLatLngBounds(ct(i));
        },
        // @method distance(latlng1: LatLng, latlng2: LatLng): Number
        // Returns the distance between two geographical coordinates according to
        // the map's CRS. By default this measures distance in meters.
        distance: function(i, n) {
          return this.options.crs.distance(K(i), K(n));
        },
        // @method containerPointToLayerPoint(point: Point): Point
        // Given a pixel coordinate relative to the map container, returns the corresponding
        // pixel coordinate relative to the [origin pixel](#map-getpixelorigin).
        containerPointToLayerPoint: function(i) {
          return U(i).subtract(this._getMapPanePos());
        },
        // @method layerPointToContainerPoint(point: Point): Point
        // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
        // returns the corresponding pixel coordinate relative to the map container.
        layerPointToContainerPoint: function(i) {
          return U(i).add(this._getMapPanePos());
        },
        // @method containerPointToLatLng(point: Point): LatLng
        // Given a pixel coordinate relative to the map container, returns
        // the corresponding geographical coordinate (for the current zoom level).
        containerPointToLatLng: function(i) {
          var n = this.containerPointToLayerPoint(U(i));
          return this.layerPointToLatLng(n);
        },
        // @method latLngToContainerPoint(latlng: LatLng): Point
        // Given a geographical coordinate, returns the corresponding pixel coordinate
        // relative to the map container.
        latLngToContainerPoint: function(i) {
          return this.layerPointToContainerPoint(this.latLngToLayerPoint(K(i)));
        },
        // @method mouseEventToContainerPoint(ev: MouseEvent): Point
        // Given a MouseEvent object, returns the pixel coordinate relative to the
        // map container where the event took place.
        mouseEventToContainerPoint: function(i) {
          return na(i, this._container);
        },
        // @method mouseEventToLayerPoint(ev: MouseEvent): Point
        // Given a MouseEvent object, returns the pixel coordinate relative to
        // the [origin pixel](#map-getpixelorigin) where the event took place.
        mouseEventToLayerPoint: function(i) {
          return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(i));
        },
        // @method mouseEventToLatLng(ev: MouseEvent): LatLng
        // Given a MouseEvent object, returns geographical coordinate where the
        // event took place.
        mouseEventToLatLng: function(i) {
          return this.layerPointToLatLng(this.mouseEventToLayerPoint(i));
        },
        // map initialization methods
        _initContainer: function(i) {
          var n = this._container = ta(i);
          if (n) {
            if (n._leaflet_id)
              throw new Error("Map container is already initialized.");
          } else throw new Error("Map container not found.");
          j(n, "scroll", this._onScroll, this), this._containerId = c(n);
        },
        _initLayout: function() {
          var i = this._container;
          this._fadeAnimated = this.options.fadeAnimation && B.any3d, W(i, "leaflet-container" + (B.touch ? " leaflet-touch" : "") + (B.retina ? " leaflet-retina" : "") + (B.ielt9 ? " leaflet-oldie" : "") + (B.safari ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));
          var n = Hi(i, "position");
          n !== "absolute" && n !== "relative" && n !== "fixed" && n !== "sticky" && (i.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos();
        },
        _initPanes: function() {
          var i = this._panes = {};
          this._paneRenderers = {}, this._mapPane = this.createPane("mapPane", this._container), ft(this._mapPane, new q(0, 0)), this.createPane("tilePane"), this.createPane("overlayPane"), this.createPane("shadowPane"), this.createPane("markerPane"), this.createPane("tooltipPane"), this.createPane("popupPane"), this.options.markerZoomAnimation || (W(i.markerPane, "leaflet-zoom-hide"), W(i.shadowPane, "leaflet-zoom-hide"));
        },
        // private methods that modify map state
        // @section Map state change events
        _resetView: function(i, n, h) {
          ft(this._mapPane, new q(0, 0));
          var f = !this._loaded;
          this._loaded = !0, n = this._limitZoom(n), this.fire("viewprereset");
          var _ = this._zoom !== n;
          this._moveStart(_, h)._move(i, n)._moveEnd(_), this.fire("viewreset"), f && this.fire("load");
        },
        _moveStart: function(i, n) {
          return i && this.fire("zoomstart"), n || this.fire("movestart"), this;
        },
        _move: function(i, n, h, f) {
          n === void 0 && (n = this._zoom);
          var _ = this._zoom !== n;
          return this._zoom = n, this._lastCenter = i, this._pixelOrigin = this._getNewPixelOrigin(i), f ? h && h.pinch && this.fire("zoom", h) : ((_ || h && h.pinch) && this.fire("zoom", h), this.fire("move", h)), this;
        },
        _moveEnd: function(i) {
          return i && this.fire("zoomend"), this.fire("moveend");
        },
        _stop: function() {
          return _t(this._flyToFrame), this._panAnim && this._panAnim.stop(), this;
        },
        _rawPanBy: function(i) {
          ft(this._mapPane, this._getMapPanePos().subtract(i));
        },
        _getZoomSpan: function() {
          return this.getMaxZoom() - this.getMinZoom();
        },
        _panInsideMaxBounds: function() {
          this._enforcingBounds || this.panInsideBounds(this.options.maxBounds);
        },
        _checkIfLoaded: function() {
          if (!this._loaded)
            throw new Error("Set map center and zoom first.");
        },
        // DOM event handling
        // @section Interaction events
        _initEvents: function(i) {
          this._targets = {}, this._targets[c(this._container)] = this;
          var n = i ? st : j;
          n(this._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup", this._handleDOMEvent, this), this.options.trackResize && n(window, "resize", this._onResize, this), B.any3d && this.options.transform3DLimit && (i ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
        },
        _onResize: function() {
          _t(this._resizeRequest), this._resizeRequest = Q(
            function() {
              this.invalidateSize({ debounceMoveend: !0 });
            },
            this
          );
        },
        _onScroll: function() {
          this._container.scrollTop = 0, this._container.scrollLeft = 0;
        },
        _onMoveEnd: function() {
          var i = this._getMapPanePos();
          Math.max(Math.abs(i.x), Math.abs(i.y)) >= this.options.transform3DLimit && this._resetView(this.getCenter(), this.getZoom());
        },
        _findEventTargets: function(i, n) {
          for (var h = [], f, _ = n === "mouseout" || n === "mouseover", v = i.target || i.srcElement, x = !1; v; ) {
            if (f = this._targets[c(v)], f && (n === "click" || n === "preclick") && this._draggableMoved(f)) {
              x = !0;
              break;
            }
            if (f && f.listens(n, !0) && (_ && !Fs(v, i) || (h.push(f), _)) || v === this._container)
              break;
            v = v.parentNode;
          }
          return !h.length && !x && !_ && this.listens(n, !0) && (h = [this]), h;
        },
        _isClickDisabled: function(i) {
          for (; i && i !== this._container; ) {
            if (i._leaflet_disable_click)
              return !0;
            i = i.parentNode;
          }
        },
        _handleDOMEvent: function(i) {
          var n = i.target || i.srcElement;
          if (!(!this._loaded || n._leaflet_disable_events || i.type === "click" && this._isClickDisabled(n))) {
            var h = i.type;
            h === "mousedown" && Ns(n), this._fireDOMEvent(i, h);
          }
        },
        _mouseEvents: ["click", "dblclick", "mouseover", "mouseout", "contextmenu"],
        _fireDOMEvent: function(i, n, h) {
          if (i.type === "click") {
            var f = r({}, i);
            f.type = "preclick", this._fireDOMEvent(f, f.type, h);
          }
          var _ = this._findEventTargets(i, n);
          if (h) {
            for (var v = [], x = 0; x < h.length; x++)
              h[x].listens(n, !0) && v.push(h[x]);
            _ = v.concat(_);
          }
          if (_.length) {
            n === "contextmenu" && pt(i);
            var b = _[0], S = {
              originalEvent: i
            };
            if (i.type !== "keypress" && i.type !== "keydown" && i.type !== "keyup") {
              var C = b.getLatLng && (!b._radius || b._radius <= 10);
              S.containerPoint = C ? this.latLngToContainerPoint(b.getLatLng()) : this.mouseEventToContainerPoint(i), S.layerPoint = this.containerPointToLayerPoint(S.containerPoint), S.latlng = C ? b.getLatLng() : this.layerPointToLatLng(S.layerPoint);
            }
            for (x = 0; x < _.length; x++)
              if (_[x].fire(n, S, !0), S.originalEvent._stopped || _[x].options.bubblingMouseEvents === !1 && G(this._mouseEvents, n) !== -1)
                return;
          }
        },
        _draggableMoved: function(i) {
          return i = i.dragging && i.dragging.enabled() ? i : this, i.dragging && i.dragging.moved() || this.boxZoom && this.boxZoom.moved();
        },
        _clearHandlers: function() {
          for (var i = 0, n = this._handlers.length; i < n; i++)
            this._handlers[i].disable();
        },
        // @section Other Methods
        // @method whenReady(fn: Function, context?: Object): this
        // Runs the given function `fn` when the map gets initialized with
        // a view (center and zoom) and at least one layer, or immediately
        // if it's already initialized, optionally passing a function context.
        whenReady: function(i, n) {
          return this._loaded ? i.call(n || this, { target: this }) : this.on("load", i, n), this;
        },
        // private methods for getting map state
        _getMapPanePos: function() {
          return fi(this._mapPane) || new q(0, 0);
        },
        _moved: function() {
          var i = this._getMapPanePos();
          return i && !i.equals([0, 0]);
        },
        _getTopLeftPoint: function(i, n) {
          var h = i && n !== void 0 ? this._getNewPixelOrigin(i, n) : this.getPixelOrigin();
          return h.subtract(this._getMapPanePos());
        },
        _getNewPixelOrigin: function(i, n) {
          var h = this.getSize()._divideBy(2);
          return this.project(i, n)._subtract(h)._add(this._getMapPanePos())._round();
        },
        _latLngToNewLayerPoint: function(i, n, h) {
          var f = this._getNewPixelOrigin(h, n);
          return this.project(i, n)._subtract(f);
        },
        _latLngBoundsToNewLayerBounds: function(i, n, h) {
          var f = this._getNewPixelOrigin(h, n);
          return Pt([
            this.project(i.getSouthWest(), n)._subtract(f),
            this.project(i.getNorthWest(), n)._subtract(f),
            this.project(i.getSouthEast(), n)._subtract(f),
            this.project(i.getNorthEast(), n)._subtract(f)
          ]);
        },
        // layer point of the current center
        _getCenterLayerPoint: function() {
          return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
        },
        // offset of the specified place to the current center in pixels
        _getCenterOffset: function(i) {
          return this.latLngToLayerPoint(i).subtract(this._getCenterLayerPoint());
        },
        // adjust center for view to get inside bounds
        _limitCenter: function(i, n, h) {
          if (!h)
            return i;
          var f = this.project(i, n), _ = this.getSize().divideBy(2), v = new nt(f.subtract(_), f.add(_)), x = this._getBoundsOffset(v, h, n);
          return Math.abs(x.x) <= 1 && Math.abs(x.y) <= 1 ? i : this.unproject(f.add(x), n);
        },
        // adjust offset for view to get inside bounds
        _limitOffset: function(i, n) {
          if (!n)
            return i;
          var h = this.getPixelBounds(), f = new nt(h.min.add(i), h.max.add(i));
          return i.add(this._getBoundsOffset(f, n));
        },
        // returns offset needed for pxBounds to get inside maxBounds at a specified zoom
        _getBoundsOffset: function(i, n, h) {
          var f = Pt(
            this.project(n.getNorthEast(), h),
            this.project(n.getSouthWest(), h)
          ), _ = f.min.subtract(i.min), v = f.max.subtract(i.max), x = this._rebound(_.x, -v.x), b = this._rebound(_.y, -v.y);
          return new q(x, b);
        },
        _rebound: function(i, n) {
          return i + n > 0 ? Math.round(i - n) / 2 : Math.max(0, Math.ceil(i)) - Math.max(0, Math.floor(n));
        },
        _limitZoom: function(i) {
          var n = this.getMinZoom(), h = this.getMaxZoom(), f = B.any3d ? this.options.zoomSnap : 1;
          return f && (i = Math.round(i / f) * f), Math.max(n, Math.min(h, i));
        },
        _onPanTransitionStep: function() {
          this.fire("move");
        },
        _onPanTransitionEnd: function() {
          lt(this._mapPane, "leaflet-pan-anim"), this.fire("moveend");
        },
        _tryAnimatedPan: function(i, n) {
          var h = this._getCenterOffset(i)._trunc();
          return (n && n.animate) !== !0 && !this.getSize().contains(h) ? !1 : (this.panBy(h, n), !0);
        },
        _createAnimProxy: function() {
          var i = this._proxy = J("div", "leaflet-proxy leaflet-zoom-animated");
          this._panes.mapPane.appendChild(i), this.on("zoomanim", function(n) {
            var h = As, f = this._proxy.style[h];
            ci(this._proxy, this.project(n.center, n.zoom), this.getZoomScale(n.zoom, 1)), f === this._proxy.style[h] && this._animatingZoom && this._onZoomTransitionEnd();
          }, this), this.on("load moveend", this._animMoveEnd, this), this._on("unload", this._destroyAnimProxy, this);
        },
        _destroyAnimProxy: function() {
          at(this._proxy), this.off("load moveend", this._animMoveEnd, this), delete this._proxy;
        },
        _animMoveEnd: function() {
          var i = this.getCenter(), n = this.getZoom();
          ci(this._proxy, this.project(i, n), this.getZoomScale(n, 1));
        },
        _catchTransitionEnd: function(i) {
          this._animatingZoom && i.propertyName.indexOf("transform") >= 0 && this._onZoomTransitionEnd();
        },
        _nothingToAnimate: function() {
          return !this._container.getElementsByClassName("leaflet-zoom-animated").length;
        },
        _tryAnimatedZoom: function(i, n, h) {
          if (this._animatingZoom)
            return !0;
          if (h = h || {}, !this._zoomAnimated || h.animate === !1 || this._nothingToAnimate() || Math.abs(n - this._zoom) > this.options.zoomAnimationThreshold)
            return !1;
          var f = this.getZoomScale(n), _ = this._getCenterOffset(i)._divideBy(1 - 1 / f);
          return h.animate !== !0 && !this.getSize().contains(_) ? !1 : (Q(function() {
            this._moveStart(!0, h.noMoveStart || !1)._animateZoom(i, n, !0);
          }, this), !0);
        },
        _animateZoom: function(i, n, h, f) {
          this._mapPane && (h && (this._animatingZoom = !0, this._animateToCenter = i, this._animateToZoom = n, W(this._mapPane, "leaflet-zoom-anim")), this.fire("zoomanim", {
            center: i,
            zoom: n,
            noUpdate: f
          }), this._tempFireZoomEvent || (this._tempFireZoomEvent = this._zoom !== this._animateToZoom), this._move(this._animateToCenter, this._animateToZoom, void 0, !0), setTimeout(l(this._onZoomTransitionEnd, this), 250));
        },
        _onZoomTransitionEnd: function() {
          this._animatingZoom && (this._mapPane && lt(this._mapPane, "leaflet-zoom-anim"), this._animatingZoom = !1, this._move(this._animateToCenter, this._animateToZoom, void 0, !0), this._tempFireZoomEvent && this.fire("zoom"), delete this._tempFireZoomEvent, this.fire("move"), this._moveEnd(!0));
        }
      });
      function Oo(i, n) {
        return new $(i, n);
      }
      var kt = Ut.extend({
        // @section
        // @aka Control Options
        options: {
          // @option position: String = 'topright'
          // The position of the control (one of the map corners). Possible values are `'topleft'`,
          // `'topright'`, `'bottomleft'` or `'bottomright'`
          position: "topright"
        },
        initialize: function(i) {
          w(this, i);
        },
        /* @section
         * Classes extending L.Control will inherit the following methods:
         *
         * @method getPosition: string
         * Returns the position of the control.
         */
        getPosition: function() {
          return this.options.position;
        },
        // @method setPosition(position: string): this
        // Sets the position of the control.
        setPosition: function(i) {
          var n = this._map;
          return n && n.removeControl(this), this.options.position = i, n && n.addControl(this), this;
        },
        // @method getContainer: HTMLElement
        // Returns the HTMLElement that contains the control.
        getContainer: function() {
          return this._container;
        },
        // @method addTo(map: Map): this
        // Adds the control to the given map.
        addTo: function(i) {
          this.remove(), this._map = i;
          var n = this._container = this.onAdd(i), h = this.getPosition(), f = i._controlCorners[h];
          return W(n, "leaflet-control"), h.indexOf("bottom") !== -1 ? f.insertBefore(n, f.firstChild) : f.appendChild(n), this._map.on("unload", this.remove, this), this;
        },
        // @method remove: this
        // Removes the control from the map it is currently active on.
        remove: function() {
          return this._map ? (at(this._container), this.onRemove && this.onRemove(this._map), this._map.off("unload", this.remove, this), this._map = null, this) : this;
        },
        _refocusOnMap: function(i) {
          this._map && i && i.screenX > 0 && i.screenY > 0 && this._map.getContainer().focus();
        }
      }), $i = function(i) {
        return new kt(i);
      };
      $.include({
        // @method addControl(control: Control): this
        // Adds the given control to the map
        addControl: function(i) {
          return i.addTo(this), this;
        },
        // @method removeControl(control: Control): this
        // Removes the given control from the map
        removeControl: function(i) {
          return i.remove(), this;
        },
        _initControlPos: function() {
          var i = this._controlCorners = {}, n = "leaflet-", h = this._controlContainer = J("div", n + "control-container", this._container);
          function f(_, v) {
            var x = n + _ + " " + n + v;
            i[_ + v] = J("div", x, h);
          }
          f("top", "left"), f("top", "right"), f("bottom", "left"), f("bottom", "right");
        },
        _clearControlPos: function() {
          for (var i in this._controlCorners)
            at(this._controlCorners[i]);
          at(this._controlContainer), delete this._controlCorners, delete this._controlContainer;
        }
      });
      var oa = kt.extend({
        // @section
        // @aka Control.Layers options
        options: {
          // @option collapsed: Boolean = true
          // If `true`, the control will be collapsed into an icon and expanded on mouse hover, touch, or keyboard activation.
          collapsed: !0,
          position: "topright",
          // @option autoZIndex: Boolean = true
          // If `true`, the control will assign zIndexes in increasing order to all of its layers so that the order is preserved when switching them on/off.
          autoZIndex: !0,
          // @option hideSingleBase: Boolean = false
          // If `true`, the base layers in the control will be hidden when there is only one.
          hideSingleBase: !1,
          // @option sortLayers: Boolean = false
          // Whether to sort the layers. When `false`, layers will keep the order
          // in which they were added to the control.
          sortLayers: !1,
          // @option sortFunction: Function = *
          // A [compare function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
          // that will be used for sorting the layers, when `sortLayers` is `true`.
          // The function receives both the `L.Layer` instances and their names, as in
          // `sortFunction(layerA, layerB, nameA, nameB)`.
          // By default, it sorts layers alphabetically by their name.
          sortFunction: function(i, n, h, f) {
            return h < f ? -1 : f < h ? 1 : 0;
          }
        },
        initialize: function(i, n, h) {
          w(this, h), this._layerControlInputs = [], this._layers = [], this._lastZIndex = 0, this._handlingClick = !1, this._preventClick = !1;
          for (var f in i)
            this._addLayer(i[f], f);
          for (f in n)
            this._addLayer(n[f], f, !0);
        },
        onAdd: function(i) {
          this._initLayout(), this._update(), this._map = i, i.on("zoomend", this._checkDisabledLayers, this);
          for (var n = 0; n < this._layers.length; n++)
            this._layers[n].layer.on("add remove", this._onLayerChange, this);
          return this._container;
        },
        addTo: function(i) {
          return kt.prototype.addTo.call(this, i), this._expandIfNotCollapsed();
        },
        onRemove: function() {
          this._map.off("zoomend", this._checkDisabledLayers, this);
          for (var i = 0; i < this._layers.length; i++)
            this._layers[i].layer.off("add remove", this._onLayerChange, this);
        },
        // @method addBaseLayer(layer: Layer, name: String): this
        // Adds a base layer (radio button entry) with the given name to the control.
        addBaseLayer: function(i, n) {
          return this._addLayer(i, n), this._map ? this._update() : this;
        },
        // @method addOverlay(layer: Layer, name: String): this
        // Adds an overlay (checkbox entry) with the given name to the control.
        addOverlay: function(i, n) {
          return this._addLayer(i, n, !0), this._map ? this._update() : this;
        },
        // @method removeLayer(layer: Layer): this
        // Remove the given layer from the control.
        removeLayer: function(i) {
          i.off("add remove", this._onLayerChange, this);
          var n = this._getLayer(c(i));
          return n && this._layers.splice(this._layers.indexOf(n), 1), this._map ? this._update() : this;
        },
        // @method expand(): this
        // Expand the control container if collapsed.
        expand: function() {
          W(this._container, "leaflet-control-layers-expanded"), this._section.style.height = null;
          var i = this._map.getSize().y - (this._container.offsetTop + 50);
          return i < this._section.clientHeight ? (W(this._section, "leaflet-control-layers-scrollbar"), this._section.style.height = i + "px") : lt(this._section, "leaflet-control-layers-scrollbar"), this._checkDisabledLayers(), this;
        },
        // @method collapse(): this
        // Collapse the control container if expanded.
        collapse: function() {
          return lt(this._container, "leaflet-control-layers-expanded"), this;
        },
        _initLayout: function() {
          var i = "leaflet-control-layers", n = this._container = J("div", i), h = this.options.collapsed;
          n.setAttribute("aria-haspopup", !0), Ki(n), Ds(n);
          var f = this._section = J("section", i + "-list");
          h && (this._map.on("click", this.collapse, this), j(n, {
            mouseenter: this._expandSafely,
            mouseleave: this.collapse
          }, this));
          var _ = this._layersLink = J("a", i + "-toggle", n);
          _.href = "#", _.title = "Layers", _.setAttribute("role", "button"), j(_, {
            keydown: function(v) {
              v.keyCode === 13 && this._expandSafely();
            },
            // Certain screen readers intercept the key event and instead send a click event
            click: function(v) {
              pt(v), this._expandSafely();
            }
          }, this), h || this.expand(), this._baseLayersList = J("div", i + "-base", f), this._separator = J("div", i + "-separator", f), this._overlaysList = J("div", i + "-overlays", f), n.appendChild(f);
        },
        _getLayer: function(i) {
          for (var n = 0; n < this._layers.length; n++)
            if (this._layers[n] && c(this._layers[n].layer) === i)
              return this._layers[n];
        },
        _addLayer: function(i, n, h) {
          this._map && i.on("add remove", this._onLayerChange, this), this._layers.push({
            layer: i,
            name: n,
            overlay: h
          }), this.options.sortLayers && this._layers.sort(l(function(f, _) {
            return this.options.sortFunction(f.layer, _.layer, f.name, _.name);
          }, this)), this.options.autoZIndex && i.setZIndex && (this._lastZIndex++, i.setZIndex(this._lastZIndex)), this._expandIfNotCollapsed();
        },
        _update: function() {
          if (!this._container)
            return this;
          Oe(this._baseLayersList), Oe(this._overlaysList), this._layerControlInputs = [];
          var i, n, h, f, _ = 0;
          for (h = 0; h < this._layers.length; h++)
            f = this._layers[h], this._addItem(f), n = n || f.overlay, i = i || !f.overlay, _ += f.overlay ? 0 : 1;
          return this.options.hideSingleBase && (i = i && _ > 1, this._baseLayersList.style.display = i ? "" : "none"), this._separator.style.display = n && i ? "" : "none", this;
        },
        _onLayerChange: function(i) {
          this._handlingClick || this._update();
          var n = this._getLayer(c(i.target)), h = n.overlay ? i.type === "add" ? "overlayadd" : "overlayremove" : i.type === "add" ? "baselayerchange" : null;
          h && this._map.fire(h, n);
        },
        // IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see https://stackoverflow.com/a/119079)
        _createRadioElement: function(i, n) {
          var h = '<input type="radio" class="leaflet-control-layers-selector" name="' + i + '"' + (n ? ' checked="checked"' : "") + "/>", f = document.createElement("div");
          return f.innerHTML = h, f.firstChild;
        },
        _addItem: function(i) {
          var n = document.createElement("label"), h = this._map.hasLayer(i.layer), f;
          i.overlay ? (f = document.createElement("input"), f.type = "checkbox", f.className = "leaflet-control-layers-selector", f.defaultChecked = h) : f = this._createRadioElement("leaflet-base-layers_" + c(this), h), this._layerControlInputs.push(f), f.layerId = c(i.layer), j(f, "click", this._onInputClick, this);
          var _ = document.createElement("span");
          _.innerHTML = " " + i.name;
          var v = document.createElement("span");
          n.appendChild(v), v.appendChild(f), v.appendChild(_);
          var x = i.overlay ? this._overlaysList : this._baseLayersList;
          return x.appendChild(n), this._checkDisabledLayers(), n;
        },
        _onInputClick: function() {
          if (!this._preventClick) {
            var i = this._layerControlInputs, n, h, f = [], _ = [];
            this._handlingClick = !0;
            for (var v = i.length - 1; v >= 0; v--)
              n = i[v], h = this._getLayer(n.layerId).layer, n.checked ? f.push(h) : n.checked || _.push(h);
            for (v = 0; v < _.length; v++)
              this._map.hasLayer(_[v]) && this._map.removeLayer(_[v]);
            for (v = 0; v < f.length; v++)
              this._map.hasLayer(f[v]) || this._map.addLayer(f[v]);
            this._handlingClick = !1, this._refocusOnMap();
          }
        },
        _checkDisabledLayers: function() {
          for (var i = this._layerControlInputs, n, h, f = this._map.getZoom(), _ = i.length - 1; _ >= 0; _--)
            n = i[_], h = this._getLayer(n.layerId).layer, n.disabled = h.options.minZoom !== void 0 && f < h.options.minZoom || h.options.maxZoom !== void 0 && f > h.options.maxZoom;
        },
        _expandIfNotCollapsed: function() {
          return this._map && !this.options.collapsed && this.expand(), this;
        },
        _expandSafely: function() {
          var i = this._section;
          this._preventClick = !0, j(i, "click", pt), this.expand();
          var n = this;
          setTimeout(function() {
            st(i, "click", pt), n._preventClick = !1;
          });
        }
      }), No = function(i, n, h) {
        return new oa(i, n, h);
      }, Zs = kt.extend({
        // @section
        // @aka Control.Zoom options
        options: {
          position: "topleft",
          // @option zoomInText: String = '<span aria-hidden="true">+</span>'
          // The text set on the 'zoom in' button.
          zoomInText: '<span aria-hidden="true">+</span>',
          // @option zoomInTitle: String = 'Zoom in'
          // The title set on the 'zoom in' button.
          zoomInTitle: "Zoom in",
          // @option zoomOutText: String = '<span aria-hidden="true">&#x2212;</span>'
          // The text set on the 'zoom out' button.
          zoomOutText: '<span aria-hidden="true">&#x2212;</span>',
          // @option zoomOutTitle: String = 'Zoom out'
          // The title set on the 'zoom out' button.
          zoomOutTitle: "Zoom out"
        },
        onAdd: function(i) {
          var n = "leaflet-control-zoom", h = J("div", n + " leaflet-bar"), f = this.options;
          return this._zoomInButton = this._createButton(
            f.zoomInText,
            f.zoomInTitle,
            n + "-in",
            h,
            this._zoomIn
          ), this._zoomOutButton = this._createButton(
            f.zoomOutText,
            f.zoomOutTitle,
            n + "-out",
            h,
            this._zoomOut
          ), this._updateDisabled(), i.on("zoomend zoomlevelschange", this._updateDisabled, this), h;
        },
        onRemove: function(i) {
          i.off("zoomend zoomlevelschange", this._updateDisabled, this);
        },
        disable: function() {
          return this._disabled = !0, this._updateDisabled(), this;
        },
        enable: function() {
          return this._disabled = !1, this._updateDisabled(), this;
        },
        _zoomIn: function(i) {
          !this._disabled && this._map._zoom < this._map.getMaxZoom() && this._map.zoomIn(this._map.options.zoomDelta * (i.shiftKey ? 3 : 1));
        },
        _zoomOut: function(i) {
          !this._disabled && this._map._zoom > this._map.getMinZoom() && this._map.zoomOut(this._map.options.zoomDelta * (i.shiftKey ? 3 : 1));
        },
        _createButton: function(i, n, h, f, _) {
          var v = J("a", h, f);
          return v.innerHTML = i, v.href = "#", v.title = n, v.setAttribute("role", "button"), v.setAttribute("aria-label", n), Ki(v), j(v, "click", _i), j(v, "click", _, this), j(v, "click", this._refocusOnMap, this), v;
        },
        _updateDisabled: function() {
          var i = this._map, n = "leaflet-disabled";
          lt(this._zoomInButton, n), lt(this._zoomOutButton, n), this._zoomInButton.setAttribute("aria-disabled", "false"), this._zoomOutButton.setAttribute("aria-disabled", "false"), (this._disabled || i._zoom === i.getMinZoom()) && (W(this._zoomOutButton, n), this._zoomOutButton.setAttribute("aria-disabled", "true")), (this._disabled || i._zoom === i.getMaxZoom()) && (W(this._zoomInButton, n), this._zoomInButton.setAttribute("aria-disabled", "true"));
        }
      });
      $.mergeOptions({
        zoomControl: !0
      }), $.addInitHook(function() {
        this.options.zoomControl && (this.zoomControl = new Zs(), this.addControl(this.zoomControl));
      });
      var Ro = function(i) {
        return new Zs(i);
      }, ha = kt.extend({
        // @section
        // @aka Control.Scale options
        options: {
          position: "bottomleft",
          // @option maxWidth: Number = 100
          // Maximum width of the control in pixels. The width is set dynamically to show round values (e.g. 100, 200, 500).
          maxWidth: 100,
          // @option metric: Boolean = True
          // Whether to show the metric scale line (m/km).
          metric: !0,
          // @option imperial: Boolean = True
          // Whether to show the imperial scale line (mi/ft).
          imperial: !0
          // @option updateWhenIdle: Boolean = false
          // If `true`, the control is updated on [`moveend`](#map-moveend), otherwise it's always up-to-date (updated on [`move`](#map-move)).
        },
        onAdd: function(i) {
          var n = "leaflet-control-scale", h = J("div", n), f = this.options;
          return this._addScales(f, n + "-line", h), i.on(f.updateWhenIdle ? "moveend" : "move", this._update, this), i.whenReady(this._update, this), h;
        },
        onRemove: function(i) {
          i.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
        },
        _addScales: function(i, n, h) {
          i.metric && (this._mScale = J("div", n, h)), i.imperial && (this._iScale = J("div", n, h));
        },
        _update: function() {
          var i = this._map, n = i.getSize().y / 2, h = i.distance(
            i.containerPointToLatLng([0, n]),
            i.containerPointToLatLng([this.options.maxWidth, n])
          );
          this._updateScales(h);
        },
        _updateScales: function(i) {
          this.options.metric && i && this._updateMetric(i), this.options.imperial && i && this._updateImperial(i);
        },
        _updateMetric: function(i) {
          var n = this._getRoundNum(i), h = n < 1e3 ? n + " m" : n / 1e3 + " km";
          this._updateScale(this._mScale, h, n / i);
        },
        _updateImperial: function(i) {
          var n = i * 3.2808399, h, f, _;
          n > 5280 ? (h = n / 5280, f = this._getRoundNum(h), this._updateScale(this._iScale, f + " mi", f / h)) : (_ = this._getRoundNum(n), this._updateScale(this._iScale, _ + " ft", _ / n));
        },
        _updateScale: function(i, n, h) {
          i.style.width = Math.round(this.options.maxWidth * h) + "px", i.innerHTML = n;
        },
        _getRoundNum: function(i) {
          var n = Math.pow(10, (Math.floor(i) + "").length - 1), h = i / n;
          return h = h >= 10 ? 10 : h >= 5 ? 5 : h >= 3 ? 3 : h >= 2 ? 2 : 1, n * h;
        }
      }), ko = function(i) {
        return new ha(i);
      }, zo = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>', Us = kt.extend({
        // @section
        // @aka Control.Attribution options
        options: {
          position: "bottomright",
          // @option prefix: String|false = 'Leaflet'
          // The HTML text shown before the attributions. Pass `false` to disable.
          prefix: '<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">' + (B.inlineSvg ? zo + " " : "") + "Leaflet</a>"
        },
        initialize: function(i) {
          w(this, i), this._attributions = {};
        },
        onAdd: function(i) {
          i.attributionControl = this, this._container = J("div", "leaflet-control-attribution"), Ki(this._container);
          for (var n in i._layers)
            i._layers[n].getAttribution && this.addAttribution(i._layers[n].getAttribution());
          return this._update(), i.on("layeradd", this._addAttribution, this), this._container;
        },
        onRemove: function(i) {
          i.off("layeradd", this._addAttribution, this);
        },
        _addAttribution: function(i) {
          i.layer.getAttribution && (this.addAttribution(i.layer.getAttribution()), i.layer.once("remove", function() {
            this.removeAttribution(i.layer.getAttribution());
          }, this));
        },
        // @method setPrefix(prefix: String|false): this
        // The HTML text shown before the attributions. Pass `false` to disable.
        setPrefix: function(i) {
          return this.options.prefix = i, this._update(), this;
        },
        // @method addAttribution(text: String): this
        // Adds an attribution text (e.g. `'&copy; OpenStreetMap contributors'`).
        addAttribution: function(i) {
          return i ? (this._attributions[i] || (this._attributions[i] = 0), this._attributions[i]++, this._update(), this) : this;
        },
        // @method removeAttribution(text: String): this
        // Removes an attribution text.
        removeAttribution: function(i) {
          return i ? (this._attributions[i] && (this._attributions[i]--, this._update()), this) : this;
        },
        _update: function() {
          if (this._map) {
            var i = [];
            for (var n in this._attributions)
              this._attributions[n] && i.push(n);
            var h = [];
            this.options.prefix && h.push(this.options.prefix), i.length && h.push(i.join(", ")), this._container.innerHTML = h.join(' <span aria-hidden="true">|</span> ');
          }
        }
      });
      $.mergeOptions({
        attributionControl: !0
      }), $.addInitHook(function() {
        this.options.attributionControl && new Us().addTo(this);
      });
      var Bo = function(i) {
        return new Us(i);
      };
      kt.Layers = oa, kt.Zoom = Zs, kt.Scale = ha, kt.Attribution = Us, $i.layers = No, $i.zoom = Ro, $i.scale = ko, $i.attribution = Bo;
      var Wt = Ut.extend({
        initialize: function(i) {
          this._map = i;
        },
        // @method enable(): this
        // Enables the handler
        enable: function() {
          return this._enabled ? this : (this._enabled = !0, this.addHooks(), this);
        },
        // @method disable(): this
        // Disables the handler
        disable: function() {
          return this._enabled ? (this._enabled = !1, this.removeHooks(), this) : this;
        },
        // @method enabled(): Boolean
        // Returns `true` if the handler is enabled
        enabled: function() {
          return !!this._enabled;
        }
        // @section Extension methods
        // Classes inheriting from `Handler` must implement the two following methods:
        // @method addHooks()
        // Called when the handler is enabled, should add event hooks.
        // @method removeHooks()
        // Called when the handler is disabled, should remove the event hooks added previously.
      });
      Wt.addTo = function(i, n) {
        return i.addHandler(n, this), this;
      };
      var Do = { Events: Ct }, la = B.touch ? "touchstart mousedown" : "mousedown", ni = Ui.extend({
        options: {
          // @section
          // @aka Draggable options
          // @option clickTolerance: Number = 3
          // The max number of pixels a user can shift the mouse pointer during a click
          // for it to be considered a valid click (as opposed to a mouse drag).
          clickTolerance: 3
        },
        // @constructor L.Draggable(el: HTMLElement, dragHandle?: HTMLElement, preventOutline?: Boolean, options?: Draggable options)
        // Creates a `Draggable` object for moving `el` when you start dragging the `dragHandle` element (equals `el` itself by default).
        initialize: function(i, n, h, f) {
          w(this, f), this._element = i, this._dragStartTarget = n || i, this._preventOutline = h;
        },
        // @method enable()
        // Enables the dragging ability
        enable: function() {
          this._enabled || (j(this._dragStartTarget, la, this._onDown, this), this._enabled = !0);
        },
        // @method disable()
        // Disables the dragging ability
        disable: function() {
          this._enabled && (ni._dragging === this && this.finishDrag(!0), st(this._dragStartTarget, la, this._onDown, this), this._enabled = !1, this._moved = !1);
        },
        _onDown: function(i) {
          if (this._enabled && (this._moved = !1, !Ls(this._element, "leaflet-zoom-anim"))) {
            if (i.touches && i.touches.length !== 1) {
              ni._dragging === this && this.finishDrag();
              return;
            }
            if (!(ni._dragging || i.shiftKey || i.which !== 1 && i.button !== 1 && !i.touches) && (ni._dragging = this, this._preventOutline && Ns(this._element), Is(), Xi(), !this._moving)) {
              this.fire("down");
              var n = i.touches ? i.touches[0] : i, h = ia(this._element);
              this._startPoint = new q(n.clientX, n.clientY), this._startPos = fi(this._element), this._parentScale = Rs(h);
              var f = i.type === "mousedown";
              j(document, f ? "mousemove" : "touchmove", this._onMove, this), j(document, f ? "mouseup" : "touchend touchcancel", this._onUp, this);
            }
          }
        },
        _onMove: function(i) {
          if (this._enabled) {
            if (i.touches && i.touches.length > 1) {
              this._moved = !0;
              return;
            }
            var n = i.touches && i.touches.length === 1 ? i.touches[0] : i, h = new q(n.clientX, n.clientY)._subtract(this._startPoint);
            !h.x && !h.y || Math.abs(h.x) + Math.abs(h.y) < this.options.clickTolerance || (h.x /= this._parentScale.x, h.y /= this._parentScale.y, pt(i), this._moved || (this.fire("dragstart"), this._moved = !0, W(document.body, "leaflet-dragging"), this._lastTarget = i.target || i.srcElement, window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance && (this._lastTarget = this._lastTarget.correspondingUseElement), W(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(h), this._moving = !0, this._lastEvent = i, this._updatePosition());
          }
        },
        _updatePosition: function() {
          var i = { originalEvent: this._lastEvent };
          this.fire("predrag", i), ft(this._element, this._newPos), this.fire("drag", i);
        },
        _onUp: function() {
          this._enabled && this.finishDrag();
        },
        finishDrag: function(i) {
          lt(document.body, "leaflet-dragging"), this._lastTarget && (lt(this._lastTarget, "leaflet-drag-target"), this._lastTarget = null), st(document, "mousemove touchmove", this._onMove, this), st(document, "mouseup touchend touchcancel", this._onUp, this), Gs(), Vi();
          var n = this._moved && this._moving;
          this._moving = !1, ni._dragging = !1, n && this.fire("dragend", {
            noInertia: i,
            distance: this._newPos.distanceTo(this._startPos)
          });
        }
      });
      function ua(i, n, h) {
        var f, _ = [1, 4, 2, 8], v, x, b, S, C, k, D, H;
        for (v = 0, k = i.length; v < k; v++)
          i[v]._code = mi(i[v], n);
        for (b = 0; b < 4; b++) {
          for (D = _[b], f = [], v = 0, k = i.length, x = k - 1; v < k; x = v++)
            S = i[v], C = i[x], S._code & D ? C._code & D || (H = Be(C, S, D, n, h), H._code = mi(H, n), f.push(H)) : (C._code & D && (H = Be(C, S, D, n, h), H._code = mi(H, n), f.push(H)), f.push(S));
          i = f;
        }
        return i;
      }
      function ca(i, n) {
        var h, f, _, v, x, b, S, C, k;
        if (!i || i.length === 0)
          throw new Error("latlngs not passed");
        Gt(i) || (console.warn("latlngs are not flat! Only the first ring will be used"), i = i[0]);
        var D = K([0, 0]), H = ct(i), wt = H.getNorthWest().distanceTo(H.getSouthWest()) * H.getNorthEast().distanceTo(H.getNorthWest());
        wt < 1700 && (D = qs(i));
        var gt = i.length, Ot = [];
        for (h = 0; h < gt; h++) {
          var Et = K(i[h]);
          Ot.push(n.project(K([Et.lat - D.lat, Et.lng - D.lng])));
        }
        for (b = S = C = 0, h = 0, f = gt - 1; h < gt; f = h++)
          _ = Ot[h], v = Ot[f], x = _.y * v.x - v.y * _.x, S += (_.x + v.x) * x, C += (_.y + v.y) * x, b += x * 3;
        b === 0 ? k = Ot[0] : k = [S / b, C / b];
        var Li = n.unproject(U(k));
        return K([Li.lat + D.lat, Li.lng + D.lng]);
      }
      function qs(i) {
        for (var n = 0, h = 0, f = 0, _ = 0; _ < i.length; _++) {
          var v = K(i[_]);
          n += v.lat, h += v.lng, f++;
        }
        return K([n / f, h / f]);
      }
      var Fo = {
        __proto__: null,
        clipPolygon: ua,
        polygonCenter: ca,
        centroid: qs
      };
      function fa(i, n) {
        if (!n || !i.length)
          return i.slice();
        var h = n * n;
        return i = qo(i, h), i = Uo(i, h), i;
      }
      function da(i, n, h) {
        return Math.sqrt(Ji(i, n, h, !0));
      }
      function Zo(i, n, h) {
        return Ji(i, n, h);
      }
      function Uo(i, n) {
        var h = i.length, f = typeof Uint8Array < "u" ? Uint8Array : Array, _ = new f(h);
        _[0] = _[h - 1] = 1, js(i, _, n, 0, h - 1);
        var v, x = [];
        for (v = 0; v < h; v++)
          _[v] && x.push(i[v]);
        return x;
      }
      function js(i, n, h, f, _) {
        var v = 0, x, b, S;
        for (b = f + 1; b <= _ - 1; b++)
          S = Ji(i[b], i[f], i[_], !0), S > v && (x = b, v = S);
        v > h && (n[x] = 1, js(i, n, h, f, x), js(i, n, h, x, _));
      }
      function qo(i, n) {
        for (var h = [i[0]], f = 1, _ = 0, v = i.length; f < v; f++)
          jo(i[f], i[_]) > n && (h.push(i[f]), _ = f);
        return _ < v - 1 && h.push(i[v - 1]), h;
      }
      var _a;
      function ma(i, n, h, f, _) {
        var v = f ? _a : mi(i, h), x = mi(n, h), b, S, C;
        for (_a = x; ; ) {
          if (!(v | x))
            return [i, n];
          if (v & x)
            return !1;
          b = v || x, S = Be(i, n, b, h, _), C = mi(S, h), b === v ? (i = S, v = C) : (n = S, x = C);
        }
      }
      function Be(i, n, h, f, _) {
        var v = n.x - i.x, x = n.y - i.y, b = f.min, S = f.max, C, k;
        return h & 8 ? (C = i.x + v * (S.y - i.y) / x, k = S.y) : h & 4 ? (C = i.x + v * (b.y - i.y) / x, k = b.y) : h & 2 ? (C = S.x, k = i.y + x * (S.x - i.x) / v) : h & 1 && (C = b.x, k = i.y + x * (b.x - i.x) / v), new q(C, k, _);
      }
      function mi(i, n) {
        var h = 0;
        return i.x < n.min.x ? h |= 1 : i.x > n.max.x && (h |= 2), i.y < n.min.y ? h |= 4 : i.y > n.max.y && (h |= 8), h;
      }
      function jo(i, n) {
        var h = n.x - i.x, f = n.y - i.y;
        return h * h + f * f;
      }
      function Ji(i, n, h, f) {
        var _ = n.x, v = n.y, x = h.x - _, b = h.y - v, S = x * x + b * b, C;
        return S > 0 && (C = ((i.x - _) * x + (i.y - v) * b) / S, C > 1 ? (_ = h.x, v = h.y) : C > 0 && (_ += x * C, v += b * C)), x = i.x - _, b = i.y - v, f ? x * x + b * b : new q(_, v);
      }
      function Gt(i) {
        return !T(i[0]) || typeof i[0][0] != "object" && typeof i[0][0] < "u";
      }
      function ga(i) {
        return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."), Gt(i);
      }
      function pa(i, n) {
        var h, f, _, v, x, b, S, C;
        if (!i || i.length === 0)
          throw new Error("latlngs not passed");
        Gt(i) || (console.warn("latlngs are not flat! Only the first ring will be used"), i = i[0]);
        var k = K([0, 0]), D = ct(i), H = D.getNorthWest().distanceTo(D.getSouthWest()) * D.getNorthEast().distanceTo(D.getNorthWest());
        H < 1700 && (k = qs(i));
        var wt = i.length, gt = [];
        for (h = 0; h < wt; h++) {
          var Ot = K(i[h]);
          gt.push(n.project(K([Ot.lat - k.lat, Ot.lng - k.lng])));
        }
        for (h = 0, f = 0; h < wt - 1; h++)
          f += gt[h].distanceTo(gt[h + 1]) / 2;
        if (f === 0)
          C = gt[0];
        else
          for (h = 0, v = 0; h < wt - 1; h++)
            if (x = gt[h], b = gt[h + 1], _ = x.distanceTo(b), v += _, v > f) {
              S = (v - f) / _, C = [
                b.x - S * (b.x - x.x),
                b.y - S * (b.y - x.y)
              ];
              break;
            }
        var Et = n.unproject(U(C));
        return K([Et.lat + k.lat, Et.lng + k.lng]);
      }
      var Wo = {
        __proto__: null,
        simplify: fa,
        pointToSegmentDistance: da,
        closestPointOnSegment: Zo,
        clipSegment: ma,
        _getEdgeIntersection: Be,
        _getBitCode: mi,
        _sqClosestPointOnSegment: Ji,
        isFlat: Gt,
        _flat: ga,
        polylineCenter: pa
      }, Ws = {
        project: function(i) {
          return new q(i.lng, i.lat);
        },
        unproject: function(i) {
          return new et(i.y, i.x);
        },
        bounds: new nt([-180, -90], [180, 90])
      }, Hs = {
        R: 6378137,
        R_MINOR: 6356752314245179e-9,
        bounds: new nt([-2003750834279e-5, -1549657073972e-5], [2003750834279e-5, 1876465623138e-5]),
        project: function(i) {
          var n = Math.PI / 180, h = this.R, f = i.lat * n, _ = this.R_MINOR / h, v = Math.sqrt(1 - _ * _), x = v * Math.sin(f), b = Math.tan(Math.PI / 4 - f / 2) / Math.pow((1 - x) / (1 + x), v / 2);
          return f = -h * Math.log(Math.max(b, 1e-10)), new q(i.lng * n * h, f);
        },
        unproject: function(i) {
          for (var n = 180 / Math.PI, h = this.R, f = this.R_MINOR / h, _ = Math.sqrt(1 - f * f), v = Math.exp(-i.y / h), x = Math.PI / 2 - 2 * Math.atan(v), b = 0, S = 0.1, C; b < 15 && Math.abs(S) > 1e-7; b++)
            C = _ * Math.sin(x), C = Math.pow((1 - C) / (1 + C), _ / 2), S = Math.PI / 2 - 2 * Math.atan(v * C) - x, x += S;
          return new et(x * n, i.x * n / h);
        }
      }, Ho = {
        __proto__: null,
        LonLat: Ws,
        Mercator: Hs,
        SphericalMercator: vs
      }, Xo = r({}, si, {
        code: "EPSG:3395",
        projection: Hs,
        transformation: (function() {
          var i = 0.5 / (Math.PI * Hs.R);
          return qi(i, 0.5, -i, 0.5);
        })()
      }), va = r({}, si, {
        code: "EPSG:4326",
        projection: Ws,
        transformation: qi(1 / 180, 1, -1 / 180, 0.5)
      }), Vo = r({}, Yt, {
        projection: Ws,
        transformation: qi(1, 0, -1, 0),
        scale: function(i) {
          return Math.pow(2, i);
        },
        zoom: function(i) {
          return Math.log(i) / Math.LN2;
        },
        distance: function(i, n) {
          var h = n.lng - i.lng, f = n.lat - i.lat;
          return Math.sqrt(h * h + f * f);
        },
        infinite: !0
      });
      Yt.Earth = si, Yt.EPSG3395 = Xo, Yt.EPSG3857 = Ms, Yt.EPSG900913 = Qr, Yt.EPSG4326 = va, Yt.Simple = Vo;
      var zt = Ui.extend({
        // Classes extending `L.Layer` will inherit the following options:
        options: {
          // @option pane: String = 'overlayPane'
          // By default the layer will be added to the map's [overlay pane](#map-overlaypane). Overriding this option will cause the layer to be placed on another pane by default.
          pane: "overlayPane",
          // @option attribution: String = null
          // String to be shown in the attribution control, e.g. "© OpenStreetMap contributors". It describes the layer data and is often a legal obligation towards copyright holders and tile providers.
          attribution: null,
          bubblingMouseEvents: !0
        },
        /* @section
         * Classes extending `L.Layer` will inherit the following methods:
         *
         * @method addTo(map: Map|LayerGroup): this
         * Adds the layer to the given map or layer group.
         */
        addTo: function(i) {
          return i.addLayer(this), this;
        },
        // @method remove: this
        // Removes the layer from the map it is currently active on.
        remove: function() {
          return this.removeFrom(this._map || this._mapToAdd);
        },
        // @method removeFrom(map: Map): this
        // Removes the layer from the given map
        //
        // @alternative
        // @method removeFrom(group: LayerGroup): this
        // Removes the layer from the given `LayerGroup`
        removeFrom: function(i) {
          return i && i.removeLayer(this), this;
        },
        // @method getPane(name? : String): HTMLElement
        // Returns the `HTMLElement` representing the named pane on the map. If `name` is omitted, returns the pane for this layer.
        getPane: function(i) {
          return this._map.getPane(i ? this.options[i] || i : this.options.pane);
        },
        addInteractiveTarget: function(i) {
          return this._map._targets[c(i)] = this, this;
        },
        removeInteractiveTarget: function(i) {
          return delete this._map._targets[c(i)], this;
        },
        // @method getAttribution: String
        // Used by the `attribution control`, returns the [attribution option](#gridlayer-attribution).
        getAttribution: function() {
          return this.options.attribution;
        },
        _layerAdd: function(i) {
          var n = i.target;
          if (n.hasLayer(this)) {
            if (this._map = n, this._zoomAnimated = n._zoomAnimated, this.getEvents) {
              var h = this.getEvents();
              n.on(h, this), this.once("remove", function() {
                n.off(h, this);
              }, this);
            }
            this.onAdd(n), this.fire("add"), n.fire("layeradd", { layer: this });
          }
        }
      });
      $.include({
        // @method addLayer(layer: Layer): this
        // Adds the given layer to the map
        addLayer: function(i) {
          if (!i._layerAdd)
            throw new Error("The provided object is not a Layer.");
          var n = c(i);
          return this._layers[n] ? this : (this._layers[n] = i, i._mapToAdd = this, i.beforeAdd && i.beforeAdd(this), this.whenReady(i._layerAdd, i), this);
        },
        // @method removeLayer(layer: Layer): this
        // Removes the given layer from the map.
        removeLayer: function(i) {
          var n = c(i);
          return this._layers[n] ? (this._loaded && i.onRemove(this), delete this._layers[n], this._loaded && (this.fire("layerremove", { layer: i }), i.fire("remove")), i._map = i._mapToAdd = null, this) : this;
        },
        // @method hasLayer(layer: Layer): Boolean
        // Returns `true` if the given layer is currently added to the map
        hasLayer: function(i) {
          return c(i) in this._layers;
        },
        /* @method eachLayer(fn: Function, context?: Object): this
         * Iterates over the layers of the map, optionally specifying context of the iterator function.
         * ```
         * map.eachLayer(function(layer){
         *     layer.bindPopup('Hello');
         * });
         * ```
         */
        eachLayer: function(i, n) {
          for (var h in this._layers)
            i.call(n, this._layers[h]);
          return this;
        },
        _addLayers: function(i) {
          i = i ? T(i) ? i : [i] : [];
          for (var n = 0, h = i.length; n < h; n++)
            this.addLayer(i[n]);
        },
        _addZoomLimit: function(i) {
          (!isNaN(i.options.maxZoom) || !isNaN(i.options.minZoom)) && (this._zoomBoundLayers[c(i)] = i, this._updateZoomLevels());
        },
        _removeZoomLimit: function(i) {
          var n = c(i);
          this._zoomBoundLayers[n] && (delete this._zoomBoundLayers[n], this._updateZoomLevels());
        },
        _updateZoomLevels: function() {
          var i = 1 / 0, n = -1 / 0, h = this._getZoomSpan();
          for (var f in this._zoomBoundLayers) {
            var _ = this._zoomBoundLayers[f].options;
            i = _.minZoom === void 0 ? i : Math.min(i, _.minZoom), n = _.maxZoom === void 0 ? n : Math.max(n, _.maxZoom);
          }
          this._layersMaxZoom = n === -1 / 0 ? void 0 : n, this._layersMinZoom = i === 1 / 0 ? void 0 : i, h !== this._getZoomSpan() && this.fire("zoomlevelschange"), this.options.maxZoom === void 0 && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom && this.setZoom(this._layersMaxZoom), this.options.minZoom === void 0 && this._layersMinZoom && this.getZoom() < this._layersMinZoom && this.setZoom(this._layersMinZoom);
        }
      });
      var Pi = zt.extend({
        initialize: function(i, n) {
          w(this, n), this._layers = {};
          var h, f;
          if (i)
            for (h = 0, f = i.length; h < f; h++)
              this.addLayer(i[h]);
        },
        // @method addLayer(layer: Layer): this
        // Adds the given layer to the group.
        addLayer: function(i) {
          var n = this.getLayerId(i);
          return this._layers[n] = i, this._map && this._map.addLayer(i), this;
        },
        // @method removeLayer(layer: Layer): this
        // Removes the given layer from the group.
        // @alternative
        // @method removeLayer(id: Number): this
        // Removes the layer with the given internal ID from the group.
        removeLayer: function(i) {
          var n = i in this._layers ? i : this.getLayerId(i);
          return this._map && this._layers[n] && this._map.removeLayer(this._layers[n]), delete this._layers[n], this;
        },
        // @method hasLayer(layer: Layer): Boolean
        // Returns `true` if the given layer is currently added to the group.
        // @alternative
        // @method hasLayer(id: Number): Boolean
        // Returns `true` if the given internal ID is currently added to the group.
        hasLayer: function(i) {
          var n = typeof i == "number" ? i : this.getLayerId(i);
          return n in this._layers;
        },
        // @method clearLayers(): this
        // Removes all the layers from the group.
        clearLayers: function() {
          return this.eachLayer(this.removeLayer, this);
        },
        // @method invoke(methodName: String, …): this
        // Calls `methodName` on every layer contained in this group, passing any
        // additional parameters. Has no effect if the layers contained do not
        // implement `methodName`.
        invoke: function(i) {
          var n = Array.prototype.slice.call(arguments, 1), h, f;
          for (h in this._layers)
            f = this._layers[h], f[i] && f[i].apply(f, n);
          return this;
        },
        onAdd: function(i) {
          this.eachLayer(i.addLayer, i);
        },
        onRemove: function(i) {
          this.eachLayer(i.removeLayer, i);
        },
        // @method eachLayer(fn: Function, context?: Object): this
        // Iterates over the layers of the group, optionally specifying context of the iterator function.
        // ```js
        // group.eachLayer(function (layer) {
        // 	layer.bindPopup('Hello');
        // });
        // ```
        eachLayer: function(i, n) {
          for (var h in this._layers)
            i.call(n, this._layers[h]);
          return this;
        },
        // @method getLayer(id: Number): Layer
        // Returns the layer with the given internal ID.
        getLayer: function(i) {
          return this._layers[i];
        },
        // @method getLayers(): Layer[]
        // Returns an array of all the layers added to the group.
        getLayers: function() {
          var i = [];
          return this.eachLayer(i.push, i), i;
        },
        // @method setZIndex(zIndex: Number): this
        // Calls `setZIndex` on every layer contained in this group, passing the z-index.
        setZIndex: function(i) {
          return this.invoke("setZIndex", i);
        },
        // @method getLayerId(layer: Layer): Number
        // Returns the internal ID for a layer
        getLayerId: function(i) {
          return c(i);
        }
      }), Yo = function(i, n) {
        return new Pi(i, n);
      }, Kt = Pi.extend({
        addLayer: function(i) {
          return this.hasLayer(i) ? this : (i.addEventParent(this), Pi.prototype.addLayer.call(this, i), this.fire("layeradd", { layer: i }));
        },
        removeLayer: function(i) {
          return this.hasLayer(i) ? (i in this._layers && (i = this._layers[i]), i.removeEventParent(this), Pi.prototype.removeLayer.call(this, i), this.fire("layerremove", { layer: i })) : this;
        },
        // @method setStyle(style: Path options): this
        // Sets the given path options to each layer of the group that has a `setStyle` method.
        setStyle: function(i) {
          return this.invoke("setStyle", i);
        },
        // @method bringToFront(): this
        // Brings the layer group to the top of all other layers
        bringToFront: function() {
          return this.invoke("bringToFront");
        },
        // @method bringToBack(): this
        // Brings the layer group to the back of all other layers
        bringToBack: function() {
          return this.invoke("bringToBack");
        },
        // @method getBounds(): LatLngBounds
        // Returns the LatLngBounds of the Feature Group (created from bounds and coordinates of its children).
        getBounds: function() {
          var i = new bt();
          for (var n in this._layers) {
            var h = this._layers[n];
            i.extend(h.getBounds ? h.getBounds() : h.getLatLng());
          }
          return i;
        }
      }), Ko = function(i, n) {
        return new Kt(i, n);
      }, bi = Ut.extend({
        /* @section
         * @aka Icon options
         *
         * @option iconUrl: String = null
         * **(required)** The URL to the icon image (absolute or relative to your script path).
         *
         * @option iconRetinaUrl: String = null
         * The URL to a retina sized version of the icon image (absolute or relative to your
         * script path). Used for Retina screen devices.
         *
         * @option iconSize: Point = null
         * Size of the icon image in pixels.
         *
         * @option iconAnchor: Point = null
         * The coordinates of the "tip" of the icon (relative to its top left corner). The icon
         * will be aligned so that this point is at the marker's geographical location. Centered
         * by default if size is specified, also can be set in CSS with negative margins.
         *
         * @option popupAnchor: Point = [0, 0]
         * The coordinates of the point from which popups will "open", relative to the icon anchor.
         *
         * @option tooltipAnchor: Point = [0, 0]
         * The coordinates of the point from which tooltips will "open", relative to the icon anchor.
         *
         * @option shadowUrl: String = null
         * The URL to the icon shadow image. If not specified, no shadow image will be created.
         *
         * @option shadowRetinaUrl: String = null
         *
         * @option shadowSize: Point = null
         * Size of the shadow image in pixels.
         *
         * @option shadowAnchor: Point = null
         * The coordinates of the "tip" of the shadow (relative to its top left corner) (the same
         * as iconAnchor if not specified).
         *
         * @option className: String = ''
         * A custom class name to assign to both icon and shadow images. Empty by default.
         */
        options: {
          popupAnchor: [0, 0],
          tooltipAnchor: [0, 0],
          // @option crossOrigin: Boolean|String = false
          // Whether the crossOrigin attribute will be added to the tiles.
          // If a String is provided, all tiles will have their crossOrigin attribute set to the String provided. This is needed if you want to access tile pixel data.
          // Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
          crossOrigin: !1
        },
        initialize: function(i) {
          w(this, i);
        },
        // @method createIcon(oldIcon?: HTMLElement): HTMLElement
        // Called internally when the icon has to be shown, returns a `<img>` HTML element
        // styled according to the options.
        createIcon: function(i) {
          return this._createIcon("icon", i);
        },
        // @method createShadow(oldIcon?: HTMLElement): HTMLElement
        // As `createIcon`, but for the shadow beneath it.
        createShadow: function(i) {
          return this._createIcon("shadow", i);
        },
        _createIcon: function(i, n) {
          var h = this._getIconUrl(i);
          if (!h) {
            if (i === "icon")
              throw new Error("iconUrl not set in Icon options (see the docs).");
            return null;
          }
          var f = this._createImg(h, n && n.tagName === "IMG" ? n : null);
          return this._setIconStyles(f, i), (this.options.crossOrigin || this.options.crossOrigin === "") && (f.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), f;
        },
        _setIconStyles: function(i, n) {
          var h = this.options, f = h[n + "Size"];
          typeof f == "number" && (f = [f, f]);
          var _ = U(f), v = U(n === "shadow" && h.shadowAnchor || h.iconAnchor || _ && _.divideBy(2, !0));
          i.className = "leaflet-marker-" + n + " " + (h.className || ""), v && (i.style.marginLeft = -v.x + "px", i.style.marginTop = -v.y + "px"), _ && (i.style.width = _.x + "px", i.style.height = _.y + "px");
        },
        _createImg: function(i, n) {
          return n = n || document.createElement("img"), n.src = i, n;
        },
        _getIconUrl: function(i) {
          return B.retina && this.options[i + "RetinaUrl"] || this.options[i + "Url"];
        }
      });
      function $o(i) {
        return new bi(i);
      }
      var Qi = bi.extend({
        options: {
          iconUrl: "marker-icon.png",
          iconRetinaUrl: "marker-icon-2x.png",
          shadowUrl: "marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          tooltipAnchor: [16, -28],
          shadowSize: [41, 41]
        },
        _getIconUrl: function(i) {
          return typeof Qi.imagePath != "string" && (Qi.imagePath = this._detectIconPath()), (this.options.imagePath || Qi.imagePath) + bi.prototype._getIconUrl.call(this, i);
        },
        _stripUrl: function(i) {
          var n = function(h, f, _) {
            var v = f.exec(h);
            return v && v[_];
          };
          return i = n(i, /^url\((['"])?(.+)\1\)$/, 2), i && n(i, /^(.*)marker-icon\.png$/, 1);
        },
        _detectIconPath: function() {
          var i = J("div", "leaflet-default-icon-path", document.body), n = Hi(i, "background-image") || Hi(i, "backgroundImage");
          if (document.body.removeChild(i), n = this._stripUrl(n), n)
            return n;
          var h = document.querySelector('link[href$="leaflet.css"]');
          return h ? h.href.substring(0, h.href.length - 11 - 1) : "";
        }
      }), ya = Wt.extend({
        initialize: function(i) {
          this._marker = i;
        },
        addHooks: function() {
          var i = this._marker._icon;
          this._draggable || (this._draggable = new ni(i, i, !0)), this._draggable.on({
            dragstart: this._onDragStart,
            predrag: this._onPreDrag,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this).enable(), W(i, "leaflet-marker-draggable");
        },
        removeHooks: function() {
          this._draggable.off({
            dragstart: this._onDragStart,
            predrag: this._onPreDrag,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this).disable(), this._marker._icon && lt(this._marker._icon, "leaflet-marker-draggable");
        },
        moved: function() {
          return this._draggable && this._draggable._moved;
        },
        _adjustPan: function(i) {
          var n = this._marker, h = n._map, f = this._marker.options.autoPanSpeed, _ = this._marker.options.autoPanPadding, v = fi(n._icon), x = h.getPixelBounds(), b = h.getPixelOrigin(), S = Pt(
            x.min._subtract(b).add(_),
            x.max._subtract(b).subtract(_)
          );
          if (!S.contains(v)) {
            var C = U(
              (Math.max(S.max.x, v.x) - S.max.x) / (x.max.x - S.max.x) - (Math.min(S.min.x, v.x) - S.min.x) / (x.min.x - S.min.x),
              (Math.max(S.max.y, v.y) - S.max.y) / (x.max.y - S.max.y) - (Math.min(S.min.y, v.y) - S.min.y) / (x.min.y - S.min.y)
            ).multiplyBy(f);
            h.panBy(C, { animate: !1 }), this._draggable._newPos._add(C), this._draggable._startPos._add(C), ft(n._icon, this._draggable._newPos), this._onDrag(i), this._panRequest = Q(this._adjustPan.bind(this, i));
          }
        },
        _onDragStart: function() {
          this._oldLatLng = this._marker.getLatLng(), this._marker.closePopup && this._marker.closePopup(), this._marker.fire("movestart").fire("dragstart");
        },
        _onPreDrag: function(i) {
          this._marker.options.autoPan && (_t(this._panRequest), this._panRequest = Q(this._adjustPan.bind(this, i)));
        },
        _onDrag: function(i) {
          var n = this._marker, h = n._shadow, f = fi(n._icon), _ = n._map.layerPointToLatLng(f);
          h && ft(h, f), n._latlng = _, i.latlng = _, i.oldLatLng = this._oldLatLng, n.fire("move", i).fire("drag", i);
        },
        _onDragEnd: function(i) {
          _t(this._panRequest), delete this._oldLatLng, this._marker.fire("moveend").fire("dragend", i);
        }
      }), De = zt.extend({
        // @section
        // @aka Marker options
        options: {
          // @option icon: Icon = *
          // Icon instance to use for rendering the marker.
          // See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
          // If not specified, a common instance of `L.Icon.Default` is used.
          icon: new Qi(),
          // Option inherited from "Interactive layer" abstract class
          interactive: !0,
          // @option keyboard: Boolean = true
          // Whether the marker can be tabbed to with a keyboard and clicked by pressing enter.
          keyboard: !0,
          // @option title: String = ''
          // Text for the browser tooltip that appear on marker hover (no tooltip by default).
          // [Useful for accessibility](https://leafletjs.com/examples/accessibility/#markers-must-be-labelled).
          title: "",
          // @option alt: String = 'Marker'
          // Text for the `alt` attribute of the icon image.
          // [Useful for accessibility](https://leafletjs.com/examples/accessibility/#markers-must-be-labelled).
          alt: "Marker",
          // @option zIndexOffset: Number = 0
          // By default, marker images zIndex is set automatically based on its latitude. Use this option if you want to put the marker on top of all others (or below), specifying a high value like `1000` (or high negative value, respectively).
          zIndexOffset: 0,
          // @option opacity: Number = 1.0
          // The opacity of the marker.
          opacity: 1,
          // @option riseOnHover: Boolean = false
          // If `true`, the marker will get on top of others when you hover the mouse over it.
          riseOnHover: !1,
          // @option riseOffset: Number = 250
          // The z-index offset used for the `riseOnHover` feature.
          riseOffset: 250,
          // @option pane: String = 'markerPane'
          // `Map pane` where the markers icon will be added.
          pane: "markerPane",
          // @option shadowPane: String = 'shadowPane'
          // `Map pane` where the markers shadow will be added.
          shadowPane: "shadowPane",
          // @option bubblingMouseEvents: Boolean = false
          // When `true`, a mouse event on this marker will trigger the same event on the map
          // (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
          bubblingMouseEvents: !1,
          // @option autoPanOnFocus: Boolean = true
          // When `true`, the map will pan whenever the marker is focused (via
          // e.g. pressing `tab` on the keyboard) to ensure the marker is
          // visible within the map's bounds
          autoPanOnFocus: !0,
          // @section Draggable marker options
          // @option draggable: Boolean = false
          // Whether the marker is draggable with mouse/touch or not.
          draggable: !1,
          // @option autoPan: Boolean = false
          // Whether to pan the map when dragging this marker near its edge or not.
          autoPan: !1,
          // @option autoPanPadding: Point = Point(50, 50)
          // Distance (in pixels to the left/right and to the top/bottom) of the
          // map edge to start panning the map.
          autoPanPadding: [50, 50],
          // @option autoPanSpeed: Number = 10
          // Number of pixels the map should pan by.
          autoPanSpeed: 10
        },
        /* @section
         *
         * In addition to [shared layer methods](#Layer) like `addTo()` and `remove()` and [popup methods](#Popup) like bindPopup() you can also use the following methods:
         */
        initialize: function(i, n) {
          w(this, n), this._latlng = K(i);
        },
        onAdd: function(i) {
          this._zoomAnimated = this._zoomAnimated && i.options.markerZoomAnimation, this._zoomAnimated && i.on("zoomanim", this._animateZoom, this), this._initIcon(), this.update();
        },
        onRemove: function(i) {
          this.dragging && this.dragging.enabled() && (this.options.draggable = !0, this.dragging.removeHooks()), delete this.dragging, this._zoomAnimated && i.off("zoomanim", this._animateZoom, this), this._removeIcon(), this._removeShadow();
        },
        getEvents: function() {
          return {
            zoom: this.update,
            viewreset: this.update
          };
        },
        // @method getLatLng: LatLng
        // Returns the current geographical position of the marker.
        getLatLng: function() {
          return this._latlng;
        },
        // @method setLatLng(latlng: LatLng): this
        // Changes the marker position to the given point.
        setLatLng: function(i) {
          var n = this._latlng;
          return this._latlng = K(i), this.update(), this.fire("move", { oldLatLng: n, latlng: this._latlng });
        },
        // @method setZIndexOffset(offset: Number): this
        // Changes the [zIndex offset](#marker-zindexoffset) of the marker.
        setZIndexOffset: function(i) {
          return this.options.zIndexOffset = i, this.update();
        },
        // @method getIcon: Icon
        // Returns the current icon used by the marker
        getIcon: function() {
          return this.options.icon;
        },
        // @method setIcon(icon: Icon): this
        // Changes the marker icon.
        setIcon: function(i) {
          return this.options.icon = i, this._map && (this._initIcon(), this.update()), this._popup && this.bindPopup(this._popup, this._popup.options), this;
        },
        getElement: function() {
          return this._icon;
        },
        update: function() {
          if (this._icon && this._map) {
            var i = this._map.latLngToLayerPoint(this._latlng).round();
            this._setPos(i);
          }
          return this;
        },
        _initIcon: function() {
          var i = this.options, n = "leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide"), h = i.icon.createIcon(this._icon), f = !1;
          h !== this._icon && (this._icon && this._removeIcon(), f = !0, i.title && (h.title = i.title), h.tagName === "IMG" && (h.alt = i.alt || "")), W(h, n), i.keyboard && (h.tabIndex = "0", h.setAttribute("role", "button")), this._icon = h, i.riseOnHover && this.on({
            mouseover: this._bringToFront,
            mouseout: this._resetZIndex
          }), this.options.autoPanOnFocus && j(h, "focus", this._panOnFocus, this);
          var _ = i.icon.createShadow(this._shadow), v = !1;
          _ !== this._shadow && (this._removeShadow(), v = !0), _ && (W(_, n), _.alt = ""), this._shadow = _, i.opacity < 1 && this._updateOpacity(), f && this.getPane().appendChild(this._icon), this._initInteraction(), _ && v && this.getPane(i.shadowPane).appendChild(this._shadow);
        },
        _removeIcon: function() {
          this.options.riseOnHover && this.off({
            mouseover: this._bringToFront,
            mouseout: this._resetZIndex
          }), this.options.autoPanOnFocus && st(this._icon, "focus", this._panOnFocus, this), at(this._icon), this.removeInteractiveTarget(this._icon), this._icon = null;
        },
        _removeShadow: function() {
          this._shadow && at(this._shadow), this._shadow = null;
        },
        _setPos: function(i) {
          this._icon && ft(this._icon, i), this._shadow && ft(this._shadow, i), this._zIndex = i.y + this.options.zIndexOffset, this._resetZIndex();
        },
        _updateZIndex: function(i) {
          this._icon && (this._icon.style.zIndex = this._zIndex + i);
        },
        _animateZoom: function(i) {
          var n = this._map._latLngToNewLayerPoint(this._latlng, i.zoom, i.center).round();
          this._setPos(n);
        },
        _initInteraction: function() {
          if (this.options.interactive && (W(this._icon, "leaflet-interactive"), this.addInteractiveTarget(this._icon), ya)) {
            var i = this.options.draggable;
            this.dragging && (i = this.dragging.enabled(), this.dragging.disable()), this.dragging = new ya(this), i && this.dragging.enable();
          }
        },
        // @method setOpacity(opacity: Number): this
        // Changes the opacity of the marker.
        setOpacity: function(i) {
          return this.options.opacity = i, this._map && this._updateOpacity(), this;
        },
        _updateOpacity: function() {
          var i = this.options.opacity;
          this._icon && It(this._icon, i), this._shadow && It(this._shadow, i);
        },
        _bringToFront: function() {
          this._updateZIndex(this.options.riseOffset);
        },
        _resetZIndex: function() {
          this._updateZIndex(0);
        },
        _panOnFocus: function() {
          var i = this._map;
          if (i) {
            var n = this.options.icon.options, h = n.iconSize ? U(n.iconSize) : U(0, 0), f = n.iconAnchor ? U(n.iconAnchor) : U(0, 0);
            i.panInside(this._latlng, {
              paddingTopLeft: f,
              paddingBottomRight: h.subtract(f)
            });
          }
        },
        _getPopupAnchor: function() {
          return this.options.icon.options.popupAnchor;
        },
        _getTooltipAnchor: function() {
          return this.options.icon.options.tooltipAnchor;
        }
      });
      function Jo(i, n) {
        return new De(i, n);
      }
      var ai = zt.extend({
        // @section
        // @aka Path options
        options: {
          // @option stroke: Boolean = true
          // Whether to draw stroke along the path. Set it to `false` to disable borders on polygons or circles.
          stroke: !0,
          // @option color: String = '#3388ff'
          // Stroke color
          color: "#3388ff",
          // @option weight: Number = 3
          // Stroke width in pixels
          weight: 3,
          // @option opacity: Number = 1.0
          // Stroke opacity
          opacity: 1,
          // @option lineCap: String= 'round'
          // A string that defines [shape to be used at the end](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linecap) of the stroke.
          lineCap: "round",
          // @option lineJoin: String = 'round'
          // A string that defines [shape to be used at the corners](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linejoin) of the stroke.
          lineJoin: "round",
          // @option dashArray: String = null
          // A string that defines the stroke [dash pattern](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dasharray). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
          dashArray: null,
          // @option dashOffset: String = null
          // A string that defines the [distance into the dash pattern to start the dash](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dashoffset). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
          dashOffset: null,
          // @option fill: Boolean = depends
          // Whether to fill the path with color. Set it to `false` to disable filling on polygons or circles.
          fill: !1,
          // @option fillColor: String = *
          // Fill color. Defaults to the value of the [`color`](#path-color) option
          fillColor: null,
          // @option fillOpacity: Number = 0.2
          // Fill opacity.
          fillOpacity: 0.2,
          // @option fillRule: String = 'evenodd'
          // A string that defines [how the inside of a shape](https://developer.mozilla.org/docs/Web/SVG/Attribute/fill-rule) is determined.
          fillRule: "evenodd",
          // className: '',
          // Option inherited from "Interactive layer" abstract class
          interactive: !0,
          // @option bubblingMouseEvents: Boolean = true
          // When `true`, a mouse event on this path will trigger the same event on the map
          // (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
          bubblingMouseEvents: !0
        },
        beforeAdd: function(i) {
          this._renderer = i.getRenderer(this);
        },
        onAdd: function() {
          this._renderer._initPath(this), this._reset(), this._renderer._addPath(this);
        },
        onRemove: function() {
          this._renderer._removePath(this);
        },
        // @method redraw(): this
        // Redraws the layer. Sometimes useful after you changed the coordinates that the path uses.
        redraw: function() {
          return this._map && this._renderer._updatePath(this), this;
        },
        // @method setStyle(style: Path options): this
        // Changes the appearance of a Path based on the options in the `Path options` object.
        setStyle: function(i) {
          return w(this, i), this._renderer && (this._renderer._updateStyle(this), this.options.stroke && i && Object.prototype.hasOwnProperty.call(i, "weight") && this._updateBounds()), this;
        },
        // @method bringToFront(): this
        // Brings the layer to the top of all path layers.
        bringToFront: function() {
          return this._renderer && this._renderer._bringToFront(this), this;
        },
        // @method bringToBack(): this
        // Brings the layer to the bottom of all path layers.
        bringToBack: function() {
          return this._renderer && this._renderer._bringToBack(this), this;
        },
        getElement: function() {
          return this._path;
        },
        _reset: function() {
          this._project(), this._update();
        },
        _clickTolerance: function() {
          return (this.options.stroke ? this.options.weight / 2 : 0) + (this._renderer.options.tolerance || 0);
        }
      }), Fe = ai.extend({
        // @section
        // @aka CircleMarker options
        options: {
          fill: !0,
          // @option radius: Number = 10
          // Radius of the circle marker, in pixels
          radius: 10
        },
        initialize: function(i, n) {
          w(this, n), this._latlng = K(i), this._radius = this.options.radius;
        },
        // @method setLatLng(latLng: LatLng): this
        // Sets the position of a circle marker to a new location.
        setLatLng: function(i) {
          var n = this._latlng;
          return this._latlng = K(i), this.redraw(), this.fire("move", { oldLatLng: n, latlng: this._latlng });
        },
        // @method getLatLng(): LatLng
        // Returns the current geographical position of the circle marker
        getLatLng: function() {
          return this._latlng;
        },
        // @method setRadius(radius: Number): this
        // Sets the radius of a circle marker. Units are in pixels.
        setRadius: function(i) {
          return this.options.radius = this._radius = i, this.redraw();
        },
        // @method getRadius(): Number
        // Returns the current radius of the circle
        getRadius: function() {
          return this._radius;
        },
        setStyle: function(i) {
          var n = i && i.radius || this._radius;
          return ai.prototype.setStyle.call(this, i), this.setRadius(n), this;
        },
        _project: function() {
          this._point = this._map.latLngToLayerPoint(this._latlng), this._updateBounds();
        },
        _updateBounds: function() {
          var i = this._radius, n = this._radiusY || i, h = this._clickTolerance(), f = [i + h, n + h];
          this._pxBounds = new nt(this._point.subtract(f), this._point.add(f));
        },
        _update: function() {
          this._map && this._updatePath();
        },
        _updatePath: function() {
          this._renderer._updateCircle(this);
        },
        _empty: function() {
          return this._radius && !this._renderer._bounds.intersects(this._pxBounds);
        },
        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: function(i) {
          return i.distanceTo(this._point) <= this._radius + this._clickTolerance();
        }
      });
      function Qo(i, n) {
        return new Fe(i, n);
      }
      var Xs = Fe.extend({
        initialize: function(i, n, h) {
          if (typeof n == "number" && (n = r({}, h, { radius: n })), w(this, n), this._latlng = K(i), isNaN(this.options.radius))
            throw new Error("Circle radius cannot be NaN");
          this._mRadius = this.options.radius;
        },
        // @method setRadius(radius: Number): this
        // Sets the radius of a circle. Units are in meters.
        setRadius: function(i) {
          return this._mRadius = i, this.redraw();
        },
        // @method getRadius(): Number
        // Returns the current radius of a circle. Units are in meters.
        getRadius: function() {
          return this._mRadius;
        },
        // @method getBounds(): LatLngBounds
        // Returns the `LatLngBounds` of the path.
        getBounds: function() {
          var i = [this._radius, this._radiusY || this._radius];
          return new bt(
            this._map.layerPointToLatLng(this._point.subtract(i)),
            this._map.layerPointToLatLng(this._point.add(i))
          );
        },
        setStyle: ai.prototype.setStyle,
        _project: function() {
          var i = this._latlng.lng, n = this._latlng.lat, h = this._map, f = h.options.crs;
          if (f.distance === si.distance) {
            var _ = Math.PI / 180, v = this._mRadius / si.R / _, x = h.project([n + v, i]), b = h.project([n - v, i]), S = x.add(b).divideBy(2), C = h.unproject(S).lat, k = Math.acos((Math.cos(v * _) - Math.sin(n * _) * Math.sin(C * _)) / (Math.cos(n * _) * Math.cos(C * _))) / _;
            (isNaN(k) || k === 0) && (k = v / Math.cos(Math.PI / 180 * n)), this._point = S.subtract(h.getPixelOrigin()), this._radius = isNaN(k) ? 0 : S.x - h.project([C, i - k]).x, this._radiusY = S.y - x.y;
          } else {
            var D = f.unproject(f.project(this._latlng).subtract([this._mRadius, 0]));
            this._point = h.latLngToLayerPoint(this._latlng), this._radius = this._point.x - h.latLngToLayerPoint(D).x;
          }
          this._updateBounds();
        }
      });
      function th(i, n, h) {
        return new Xs(i, n, h);
      }
      var $t = ai.extend({
        // @section
        // @aka Polyline options
        options: {
          // @option smoothFactor: Number = 1.0
          // How much to simplify the polyline on each zoom level. More means
          // better performance and smoother look, and less means more accurate representation.
          smoothFactor: 1,
          // @option noClip: Boolean = false
          // Disable polyline clipping.
          noClip: !1
        },
        initialize: function(i, n) {
          w(this, n), this._setLatLngs(i);
        },
        // @method getLatLngs(): LatLng[]
        // Returns an array of the points in the path, or nested arrays of points in case of multi-polyline.
        getLatLngs: function() {
          return this._latlngs;
        },
        // @method setLatLngs(latlngs: LatLng[]): this
        // Replaces all the points in the polyline with the given array of geographical points.
        setLatLngs: function(i) {
          return this._setLatLngs(i), this.redraw();
        },
        // @method isEmpty(): Boolean
        // Returns `true` if the Polyline has no LatLngs.
        isEmpty: function() {
          return !this._latlngs.length;
        },
        // @method closestLayerPoint(p: Point): Point
        // Returns the point closest to `p` on the Polyline.
        closestLayerPoint: function(i) {
          for (var n = 1 / 0, h = null, f = Ji, _, v, x = 0, b = this._parts.length; x < b; x++)
            for (var S = this._parts[x], C = 1, k = S.length; C < k; C++) {
              _ = S[C - 1], v = S[C];
              var D = f(i, _, v, !0);
              D < n && (n = D, h = f(i, _, v));
            }
          return h && (h.distance = Math.sqrt(n)), h;
        },
        // @method getCenter(): LatLng
        // Returns the center ([centroid](https://en.wikipedia.org/wiki/Centroid)) of the polyline.
        getCenter: function() {
          if (!this._map)
            throw new Error("Must add layer to map before using getCenter()");
          return pa(this._defaultShape(), this._map.options.crs);
        },
        // @method getBounds(): LatLngBounds
        // Returns the `LatLngBounds` of the path.
        getBounds: function() {
          return this._bounds;
        },
        // @method addLatLng(latlng: LatLng, latlngs?: LatLng[]): this
        // Adds a given point to the polyline. By default, adds to the first ring of
        // the polyline in case of a multi-polyline, but can be overridden by passing
        // a specific ring as a LatLng array (that you can earlier access with [`getLatLngs`](#polyline-getlatlngs)).
        addLatLng: function(i, n) {
          return n = n || this._defaultShape(), i = K(i), n.push(i), this._bounds.extend(i), this.redraw();
        },
        _setLatLngs: function(i) {
          this._bounds = new bt(), this._latlngs = this._convertLatLngs(i);
        },
        _defaultShape: function() {
          return Gt(this._latlngs) ? this._latlngs : this._latlngs[0];
        },
        // recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
        _convertLatLngs: function(i) {
          for (var n = [], h = Gt(i), f = 0, _ = i.length; f < _; f++)
            h ? (n[f] = K(i[f]), this._bounds.extend(n[f])) : n[f] = this._convertLatLngs(i[f]);
          return n;
        },
        _project: function() {
          var i = new nt();
          this._rings = [], this._projectLatlngs(this._latlngs, this._rings, i), this._bounds.isValid() && i.isValid() && (this._rawPxBounds = i, this._updateBounds());
        },
        _updateBounds: function() {
          var i = this._clickTolerance(), n = new q(i, i);
          this._rawPxBounds && (this._pxBounds = new nt([
            this._rawPxBounds.min.subtract(n),
            this._rawPxBounds.max.add(n)
          ]));
        },
        // recursively turns latlngs into a set of rings with projected coordinates
        _projectLatlngs: function(i, n, h) {
          var f = i[0] instanceof et, _ = i.length, v, x;
          if (f) {
            for (x = [], v = 0; v < _; v++)
              x[v] = this._map.latLngToLayerPoint(i[v]), h.extend(x[v]);
            n.push(x);
          } else
            for (v = 0; v < _; v++)
              this._projectLatlngs(i[v], n, h);
        },
        // clip polyline by renderer bounds so that we have less to render for performance
        _clipPoints: function() {
          var i = this._renderer._bounds;
          if (this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(i))) {
            if (this.options.noClip) {
              this._parts = this._rings;
              return;
            }
            var n = this._parts, h, f, _, v, x, b, S;
            for (h = 0, _ = 0, v = this._rings.length; h < v; h++)
              for (S = this._rings[h], f = 0, x = S.length; f < x - 1; f++)
                b = ma(S[f], S[f + 1], i, f, !0), b && (n[_] = n[_] || [], n[_].push(b[0]), (b[1] !== S[f + 1] || f === x - 2) && (n[_].push(b[1]), _++));
          }
        },
        // simplify each clipped part of the polyline for performance
        _simplifyPoints: function() {
          for (var i = this._parts, n = this.options.smoothFactor, h = 0, f = i.length; h < f; h++)
            i[h] = fa(i[h], n);
        },
        _update: function() {
          this._map && (this._clipPoints(), this._simplifyPoints(), this._updatePath());
        },
        _updatePath: function() {
          this._renderer._updatePoly(this);
        },
        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: function(i, n) {
          var h, f, _, v, x, b, S = this._clickTolerance();
          if (!this._pxBounds || !this._pxBounds.contains(i))
            return !1;
          for (h = 0, v = this._parts.length; h < v; h++)
            for (b = this._parts[h], f = 0, x = b.length, _ = x - 1; f < x; _ = f++)
              if (!(!n && f === 0) && da(i, b[_], b[f]) <= S)
                return !0;
          return !1;
        }
      });
      function ih(i, n) {
        return new $t(i, n);
      }
      $t._flat = ga;
      var Ei = $t.extend({
        options: {
          fill: !0
        },
        isEmpty: function() {
          return !this._latlngs.length || !this._latlngs[0].length;
        },
        // @method getCenter(): LatLng
        // Returns the center ([centroid](http://en.wikipedia.org/wiki/Centroid)) of the Polygon.
        getCenter: function() {
          if (!this._map)
            throw new Error("Must add layer to map before using getCenter()");
          return ca(this._defaultShape(), this._map.options.crs);
        },
        _convertLatLngs: function(i) {
          var n = $t.prototype._convertLatLngs.call(this, i), h = n.length;
          return h >= 2 && n[0] instanceof et && n[0].equals(n[h - 1]) && n.pop(), n;
        },
        _setLatLngs: function(i) {
          $t.prototype._setLatLngs.call(this, i), Gt(this._latlngs) && (this._latlngs = [this._latlngs]);
        },
        _defaultShape: function() {
          return Gt(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
        },
        _clipPoints: function() {
          var i = this._renderer._bounds, n = this.options.weight, h = new q(n, n);
          if (i = new nt(i.min.subtract(h), i.max.add(h)), this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(i))) {
            if (this.options.noClip) {
              this._parts = this._rings;
              return;
            }
            for (var f = 0, _ = this._rings.length, v; f < _; f++)
              v = ua(this._rings[f], i, !0), v.length && this._parts.push(v);
          }
        },
        _updatePath: function() {
          this._renderer._updatePoly(this, !0);
        },
        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: function(i) {
          var n = !1, h, f, _, v, x, b, S, C;
          if (!this._pxBounds || !this._pxBounds.contains(i))
            return !1;
          for (v = 0, S = this._parts.length; v < S; v++)
            for (h = this._parts[v], x = 0, C = h.length, b = C - 1; x < C; b = x++)
              f = h[x], _ = h[b], f.y > i.y != _.y > i.y && i.x < (_.x - f.x) * (i.y - f.y) / (_.y - f.y) + f.x && (n = !n);
          return n || $t.prototype._containsPoint.call(this, i, !0);
        }
      });
      function eh(i, n) {
        return new Ei(i, n);
      }
      var Jt = Kt.extend({
        /* @section
         * @aka GeoJSON options
         *
         * @option pointToLayer: Function = *
         * A `Function` defining how GeoJSON points spawn Leaflet layers. It is internally
         * called when data is added, passing the GeoJSON point feature and its `LatLng`.
         * The default is to spawn a default `Marker`:
         * ```js
         * function(geoJsonPoint, latlng) {
         * 	return L.marker(latlng);
         * }
         * ```
         *
         * @option style: Function = *
         * A `Function` defining the `Path options` for styling GeoJSON lines and polygons,
         * called internally when data is added.
         * The default value is to not override any defaults:
         * ```js
         * function (geoJsonFeature) {
         * 	return {}
         * }
         * ```
         *
         * @option onEachFeature: Function = *
         * A `Function` that will be called once for each created `Feature`, after it has
         * been created and styled. Useful for attaching events and popups to features.
         * The default is to do nothing with the newly created layers:
         * ```js
         * function (feature, layer) {}
         * ```
         *
         * @option filter: Function = *
         * A `Function` that will be used to decide whether to include a feature or not.
         * The default is to include all features:
         * ```js
         * function (geoJsonFeature) {
         * 	return true;
         * }
         * ```
         * Note: dynamically changing the `filter` option will have effect only on newly
         * added data. It will _not_ re-evaluate already included features.
         *
         * @option coordsToLatLng: Function = *
         * A `Function` that will be used for converting GeoJSON coordinates to `LatLng`s.
         * The default is the `coordsToLatLng` static method.
         *
         * @option markersInheritOptions: Boolean = false
         * Whether default Markers for "Point" type Features inherit from group options.
         */
        initialize: function(i, n) {
          w(this, n), this._layers = {}, i && this.addData(i);
        },
        // @method addData( <GeoJSON> data ): this
        // Adds a GeoJSON object to the layer.
        addData: function(i) {
          var n = T(i) ? i : i.features, h, f, _;
          if (n) {
            for (h = 0, f = n.length; h < f; h++)
              _ = n[h], (_.geometries || _.geometry || _.features || _.coordinates) && this.addData(_);
            return this;
          }
          var v = this.options;
          if (v.filter && !v.filter(i))
            return this;
          var x = Ze(i, v);
          return x ? (x.feature = je(i), x.defaultOptions = x.options, this.resetStyle(x), v.onEachFeature && v.onEachFeature(i, x), this.addLayer(x)) : this;
        },
        // @method resetStyle( <Path> layer? ): this
        // Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
        // If `layer` is omitted, the style of all features in the current layer is reset.
        resetStyle: function(i) {
          return i === void 0 ? this.eachLayer(this.resetStyle, this) : (i.options = r({}, i.defaultOptions), this._setLayerStyle(i, this.options.style), this);
        },
        // @method setStyle( <Function> style ): this
        // Changes styles of GeoJSON vector layers with the given style function.
        setStyle: function(i) {
          return this.eachLayer(function(n) {
            this._setLayerStyle(n, i);
          }, this);
        },
        _setLayerStyle: function(i, n) {
          i.setStyle && (typeof n == "function" && (n = n(i.feature)), i.setStyle(n));
        }
      });
      function Ze(i, n) {
        var h = i.type === "Feature" ? i.geometry : i, f = h ? h.coordinates : null, _ = [], v = n && n.pointToLayer, x = n && n.coordsToLatLng || Vs, b, S, C, k;
        if (!f && !h)
          return null;
        switch (h.type) {
          case "Point":
            return b = x(f), Ma(v, i, b, n);
          case "MultiPoint":
            for (C = 0, k = f.length; C < k; C++)
              b = x(f[C]), _.push(Ma(v, i, b, n));
            return new Kt(_);
          case "LineString":
          case "MultiLineString":
            return S = Ue(f, h.type === "LineString" ? 0 : 1, x), new $t(S, n);
          case "Polygon":
          case "MultiPolygon":
            return S = Ue(f, h.type === "Polygon" ? 1 : 2, x), new Ei(S, n);
          case "GeometryCollection":
            for (C = 0, k = h.geometries.length; C < k; C++) {
              var D = Ze({
                geometry: h.geometries[C],
                type: "Feature",
                properties: i.properties
              }, n);
              D && _.push(D);
            }
            return new Kt(_);
          case "FeatureCollection":
            for (C = 0, k = h.features.length; C < k; C++) {
              var H = Ze(h.features[C], n);
              H && _.push(H);
            }
            return new Kt(_);
          default:
            throw new Error("Invalid GeoJSON object.");
        }
      }
      function Ma(i, n, h, f) {
        return i ? i(n, h) : new De(h, f && f.markersInheritOptions && f);
      }
      function Vs(i) {
        return new et(i[1], i[0], i[2]);
      }
      function Ue(i, n, h) {
        for (var f = [], _ = 0, v = i.length, x; _ < v; _++)
          x = n ? Ue(i[_], n - 1, h) : (h || Vs)(i[_]), f.push(x);
        return f;
      }
      function Ys(i, n) {
        return i = K(i), i.alt !== void 0 ? [p(i.lng, n), p(i.lat, n), p(i.alt, n)] : [p(i.lng, n), p(i.lat, n)];
      }
      function qe(i, n, h, f) {
        for (var _ = [], v = 0, x = i.length; v < x; v++)
          _.push(n ? qe(i[v], Gt(i[v]) ? 0 : n - 1, h, f) : Ys(i[v], f));
        return !n && h && _.length > 0 && _.push(_[0].slice()), _;
      }
      function Si(i, n) {
        return i.feature ? r({}, i.feature, { geometry: n }) : je(n);
      }
      function je(i) {
        return i.type === "Feature" || i.type === "FeatureCollection" ? i : {
          type: "Feature",
          properties: {},
          geometry: i
        };
      }
      var Ks = {
        toGeoJSON: function(i) {
          return Si(this, {
            type: "Point",
            coordinates: Ys(this.getLatLng(), i)
          });
        }
      };
      De.include(Ks), Xs.include(Ks), Fe.include(Ks), $t.include({
        toGeoJSON: function(i) {
          var n = !Gt(this._latlngs), h = qe(this._latlngs, n ? 1 : 0, !1, i);
          return Si(this, {
            type: (n ? "Multi" : "") + "LineString",
            coordinates: h
          });
        }
      }), Ei.include({
        toGeoJSON: function(i) {
          var n = !Gt(this._latlngs), h = n && !Gt(this._latlngs[0]), f = qe(this._latlngs, h ? 2 : n ? 1 : 0, !0, i);
          return n || (f = [f]), Si(this, {
            type: (h ? "Multi" : "") + "Polygon",
            coordinates: f
          });
        }
      }), Pi.include({
        toMultiPoint: function(i) {
          var n = [];
          return this.eachLayer(function(h) {
            n.push(h.toGeoJSON(i).geometry.coordinates);
          }), Si(this, {
            type: "MultiPoint",
            coordinates: n
          });
        },
        // @method toGeoJSON(precision?: Number|false): Object
        // Coordinates values are rounded with [`formatNum`](#util-formatnum) function with given `precision`.
        // Returns a [`GeoJSON`](https://en.wikipedia.org/wiki/GeoJSON) representation of the layer group (as a GeoJSON `FeatureCollection`, `GeometryCollection`, or `MultiPoint`).
        toGeoJSON: function(i) {
          var n = this.feature && this.feature.geometry && this.feature.geometry.type;
          if (n === "MultiPoint")
            return this.toMultiPoint(i);
          var h = n === "GeometryCollection", f = [];
          return this.eachLayer(function(_) {
            if (_.toGeoJSON) {
              var v = _.toGeoJSON(i);
              if (h)
                f.push(v.geometry);
              else {
                var x = je(v);
                x.type === "FeatureCollection" ? f.push.apply(f, x.features) : f.push(x);
              }
            }
          }), h ? Si(this, {
            geometries: f,
            type: "GeometryCollection"
          }) : {
            type: "FeatureCollection",
            features: f
          };
        }
      });
      function wa(i, n) {
        return new Jt(i, n);
      }
      var sh = wa, We = zt.extend({
        // @section
        // @aka ImageOverlay options
        options: {
          // @option opacity: Number = 1.0
          // The opacity of the image overlay.
          opacity: 1,
          // @option alt: String = ''
          // Text for the `alt` attribute of the image (useful for accessibility).
          alt: "",
          // @option interactive: Boolean = false
          // If `true`, the image overlay will emit [mouse events](#interactive-layer) when clicked or hovered.
          interactive: !1,
          // @option crossOrigin: Boolean|String = false
          // Whether the crossOrigin attribute will be added to the image.
          // If a String is provided, the image will have its crossOrigin attribute set to the String provided. This is needed if you want to access image pixel data.
          // Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
          crossOrigin: !1,
          // @option errorOverlayUrl: String = ''
          // URL to the overlay image to show in place of the overlay that failed to load.
          errorOverlayUrl: "",
          // @option zIndex: Number = 1
          // The explicit [zIndex](https://developer.mozilla.org/docs/Web/CSS/CSS_Positioning/Understanding_z_index) of the overlay layer.
          zIndex: 1,
          // @option className: String = ''
          // A custom class name to assign to the image. Empty by default.
          className: ""
        },
        initialize: function(i, n, h) {
          this._url = i, this._bounds = ct(n), w(this, h);
        },
        onAdd: function() {
          this._image || (this._initImage(), this.options.opacity < 1 && this._updateOpacity()), this.options.interactive && (W(this._image, "leaflet-interactive"), this.addInteractiveTarget(this._image)), this.getPane().appendChild(this._image), this._reset();
        },
        onRemove: function() {
          at(this._image), this.options.interactive && this.removeInteractiveTarget(this._image);
        },
        // @method setOpacity(opacity: Number): this
        // Sets the opacity of the overlay.
        setOpacity: function(i) {
          return this.options.opacity = i, this._image && this._updateOpacity(), this;
        },
        setStyle: function(i) {
          return i.opacity && this.setOpacity(i.opacity), this;
        },
        // @method bringToFront(): this
        // Brings the layer to the top of all overlays.
        bringToFront: function() {
          return this._map && wi(this._image), this;
        },
        // @method bringToBack(): this
        // Brings the layer to the bottom of all overlays.
        bringToBack: function() {
          return this._map && xi(this._image), this;
        },
        // @method setUrl(url: String): this
        // Changes the URL of the image.
        setUrl: function(i) {
          return this._url = i, this._image && (this._image.src = i), this;
        },
        // @method setBounds(bounds: LatLngBounds): this
        // Update the bounds that this ImageOverlay covers
        setBounds: function(i) {
          return this._bounds = ct(i), this._map && this._reset(), this;
        },
        getEvents: function() {
          var i = {
            zoom: this._reset,
            viewreset: this._reset
          };
          return this._zoomAnimated && (i.zoomanim = this._animateZoom), i;
        },
        // @method setZIndex(value: Number): this
        // Changes the [zIndex](#imageoverlay-zindex) of the image overlay.
        setZIndex: function(i) {
          return this.options.zIndex = i, this._updateZIndex(), this;
        },
        // @method getBounds(): LatLngBounds
        // Get the bounds that this ImageOverlay covers
        getBounds: function() {
          return this._bounds;
        },
        // @method getElement(): HTMLElement
        // Returns the instance of [`HTMLImageElement`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement)
        // used by this overlay.
        getElement: function() {
          return this._image;
        },
        _initImage: function() {
          var i = this._url.tagName === "IMG", n = this._image = i ? this._url : J("img");
          if (W(n, "leaflet-image-layer"), this._zoomAnimated && W(n, "leaflet-zoom-animated"), this.options.className && W(n, this.options.className), n.onselectstart = m, n.onmousemove = m, n.onload = l(this.fire, this, "load"), n.onerror = l(this._overlayOnError, this, "error"), (this.options.crossOrigin || this.options.crossOrigin === "") && (n.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), this.options.zIndex && this._updateZIndex(), i) {
            this._url = n.src;
            return;
          }
          n.src = this._url, n.alt = this.options.alt;
        },
        _animateZoom: function(i) {
          var n = this._map.getZoomScale(i.zoom), h = this._map._latLngBoundsToNewLayerBounds(this._bounds, i.zoom, i.center).min;
          ci(this._image, h, n);
        },
        _reset: function() {
          var i = this._image, n = new nt(
            this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
            this._map.latLngToLayerPoint(this._bounds.getSouthEast())
          ), h = n.getSize();
          ft(i, n.min), i.style.width = h.x + "px", i.style.height = h.y + "px";
        },
        _updateOpacity: function() {
          It(this._image, this.options.opacity);
        },
        _updateZIndex: function() {
          this._image && this.options.zIndex !== void 0 && this.options.zIndex !== null && (this._image.style.zIndex = this.options.zIndex);
        },
        _overlayOnError: function() {
          this.fire("error");
          var i = this.options.errorOverlayUrl;
          i && this._url !== i && (this._url = i, this._image.src = i);
        },
        // @method getCenter(): LatLng
        // Returns the center of the ImageOverlay.
        getCenter: function() {
          return this._bounds.getCenter();
        }
      }), nh = function(i, n, h) {
        return new We(i, n, h);
      }, xa = We.extend({
        // @section
        // @aka VideoOverlay options
        options: {
          // @option autoplay: Boolean = true
          // Whether the video starts playing automatically when loaded.
          // On some browsers autoplay will only work with `muted: true`
          autoplay: !0,
          // @option loop: Boolean = true
          // Whether the video will loop back to the beginning when played.
          loop: !0,
          // @option keepAspectRatio: Boolean = true
          // Whether the video will save aspect ratio after the projection.
          // Relevant for supported browsers. See [browser compatibility](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)
          keepAspectRatio: !0,
          // @option muted: Boolean = false
          // Whether the video starts on mute when loaded.
          muted: !1,
          // @option playsInline: Boolean = true
          // Mobile browsers will play the video right where it is instead of open it up in fullscreen mode.
          playsInline: !0
        },
        _initImage: function() {
          var i = this._url.tagName === "VIDEO", n = this._image = i ? this._url : J("video");
          if (W(n, "leaflet-image-layer"), this._zoomAnimated && W(n, "leaflet-zoom-animated"), this.options.className && W(n, this.options.className), n.onselectstart = m, n.onmousemove = m, n.onloadeddata = l(this.fire, this, "load"), i) {
            for (var h = n.getElementsByTagName("source"), f = [], _ = 0; _ < h.length; _++)
              f.push(h[_].src);
            this._url = h.length > 0 ? f : [n.src];
            return;
          }
          T(this._url) || (this._url = [this._url]), !this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(n.style, "objectFit") && (n.style.objectFit = "fill"), n.autoplay = !!this.options.autoplay, n.loop = !!this.options.loop, n.muted = !!this.options.muted, n.playsInline = !!this.options.playsInline;
          for (var v = 0; v < this._url.length; v++) {
            var x = J("source");
            x.src = this._url[v], n.appendChild(x);
          }
        }
        // @method getElement(): HTMLVideoElement
        // Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
        // used by this overlay.
      });
      function ah(i, n, h) {
        return new xa(i, n, h);
      }
      var Pa = We.extend({
        _initImage: function() {
          var i = this._image = this._url;
          W(i, "leaflet-image-layer"), this._zoomAnimated && W(i, "leaflet-zoom-animated"), this.options.className && W(i, this.options.className), i.onselectstart = m, i.onmousemove = m;
        }
        // @method getElement(): SVGElement
        // Returns the instance of [`SVGElement`](https://developer.mozilla.org/docs/Web/API/SVGElement)
        // used by this overlay.
      });
      function rh(i, n, h) {
        return new Pa(i, n, h);
      }
      var Ht = zt.extend({
        // @section
        // @aka DivOverlay options
        options: {
          // @option interactive: Boolean = false
          // If true, the popup/tooltip will listen to the mouse events.
          interactive: !1,
          // @option offset: Point = Point(0, 0)
          // The offset of the overlay position.
          offset: [0, 0],
          // @option className: String = ''
          // A custom CSS class name to assign to the overlay.
          className: "",
          // @option pane: String = undefined
          // `Map pane` where the overlay will be added.
          pane: void 0,
          // @option content: String|HTMLElement|Function = ''
          // Sets the HTML content of the overlay while initializing. If a function is passed the source layer will be
          // passed to the function. The function should return a `String` or `HTMLElement` to be used in the overlay.
          content: ""
        },
        initialize: function(i, n) {
          i && (i instanceof et || T(i)) ? (this._latlng = K(i), w(this, n)) : (w(this, i), this._source = n), this.options.content && (this._content = this.options.content);
        },
        // @method openOn(map: Map): this
        // Adds the overlay to the map.
        // Alternative to `map.openPopup(popup)`/`.openTooltip(tooltip)`.
        openOn: function(i) {
          return i = arguments.length ? i : this._source._map, i.hasLayer(this) || i.addLayer(this), this;
        },
        // @method close(): this
        // Closes the overlay.
        // Alternative to `map.closePopup(popup)`/`.closeTooltip(tooltip)`
        // and `layer.closePopup()`/`.closeTooltip()`.
        close: function() {
          return this._map && this._map.removeLayer(this), this;
        },
        // @method toggle(layer?: Layer): this
        // Opens or closes the overlay bound to layer depending on its current state.
        // Argument may be omitted only for overlay bound to layer.
        // Alternative to `layer.togglePopup()`/`.toggleTooltip()`.
        toggle: function(i) {
          return this._map ? this.close() : (arguments.length ? this._source = i : i = this._source, this._prepareOpen(), this.openOn(i._map)), this;
        },
        onAdd: function(i) {
          this._zoomAnimated = i._zoomAnimated, this._container || this._initLayout(), i._fadeAnimated && It(this._container, 0), clearTimeout(this._removeTimeout), this.getPane().appendChild(this._container), this.update(), i._fadeAnimated && It(this._container, 1), this.bringToFront(), this.options.interactive && (W(this._container, "leaflet-interactive"), this.addInteractiveTarget(this._container));
        },
        onRemove: function(i) {
          i._fadeAnimated ? (It(this._container, 0), this._removeTimeout = setTimeout(l(at, void 0, this._container), 200)) : at(this._container), this.options.interactive && (lt(this._container, "leaflet-interactive"), this.removeInteractiveTarget(this._container));
        },
        // @namespace DivOverlay
        // @method getLatLng: LatLng
        // Returns the geographical point of the overlay.
        getLatLng: function() {
          return this._latlng;
        },
        // @method setLatLng(latlng: LatLng): this
        // Sets the geographical point where the overlay will open.
        setLatLng: function(i) {
          return this._latlng = K(i), this._map && (this._updatePosition(), this._adjustPan()), this;
        },
        // @method getContent: String|HTMLElement
        // Returns the content of the overlay.
        getContent: function() {
          return this._content;
        },
        // @method setContent(htmlContent: String|HTMLElement|Function): this
        // Sets the HTML content of the overlay. If a function is passed the source layer will be passed to the function.
        // The function should return a `String` or `HTMLElement` to be used in the overlay.
        setContent: function(i) {
          return this._content = i, this.update(), this;
        },
        // @method getElement: String|HTMLElement
        // Returns the HTML container of the overlay.
        getElement: function() {
          return this._container;
        },
        // @method update: null
        // Updates the overlay content, layout and position. Useful for updating the overlay after something inside changed, e.g. image loaded.
        update: function() {
          this._map && (this._container.style.visibility = "hidden", this._updateContent(), this._updateLayout(), this._updatePosition(), this._container.style.visibility = "", this._adjustPan());
        },
        getEvents: function() {
          var i = {
            zoom: this._updatePosition,
            viewreset: this._updatePosition
          };
          return this._zoomAnimated && (i.zoomanim = this._animateZoom), i;
        },
        // @method isOpen: Boolean
        // Returns `true` when the overlay is visible on the map.
        isOpen: function() {
          return !!this._map && this._map.hasLayer(this);
        },
        // @method bringToFront: this
        // Brings this overlay in front of other overlays (in the same map pane).
        bringToFront: function() {
          return this._map && wi(this._container), this;
        },
        // @method bringToBack: this
        // Brings this overlay to the back of other overlays (in the same map pane).
        bringToBack: function() {
          return this._map && xi(this._container), this;
        },
        // prepare bound overlay to open: update latlng pos / content source (for FeatureGroup)
        _prepareOpen: function(i) {
          var n = this._source;
          if (!n._map)
            return !1;
          if (n instanceof Kt) {
            n = null;
            var h = this._source._layers;
            for (var f in h)
              if (h[f]._map) {
                n = h[f];
                break;
              }
            if (!n)
              return !1;
            this._source = n;
          }
          if (!i)
            if (n.getCenter)
              i = n.getCenter();
            else if (n.getLatLng)
              i = n.getLatLng();
            else if (n.getBounds)
              i = n.getBounds().getCenter();
            else
              throw new Error("Unable to get source layer LatLng.");
          return this.setLatLng(i), this._map && this.update(), !0;
        },
        _updateContent: function() {
          if (this._content) {
            var i = this._contentNode, n = typeof this._content == "function" ? this._content(this._source || this) : this._content;
            if (typeof n == "string")
              i.innerHTML = n;
            else {
              for (; i.hasChildNodes(); )
                i.removeChild(i.firstChild);
              i.appendChild(n);
            }
            this.fire("contentupdate");
          }
        },
        _updatePosition: function() {
          if (this._map) {
            var i = this._map.latLngToLayerPoint(this._latlng), n = U(this.options.offset), h = this._getAnchor();
            this._zoomAnimated ? ft(this._container, i.add(h)) : n = n.add(i).add(h);
            var f = this._containerBottom = -n.y, _ = this._containerLeft = -Math.round(this._containerWidth / 2) + n.x;
            this._container.style.bottom = f + "px", this._container.style.left = _ + "px";
          }
        },
        _getAnchor: function() {
          return [0, 0];
        }
      });
      $.include({
        _initOverlay: function(i, n, h, f) {
          var _ = n;
          return _ instanceof i || (_ = new i(f).setContent(n)), h && _.setLatLng(h), _;
        }
      }), zt.include({
        _initOverlay: function(i, n, h, f) {
          var _ = h;
          return _ instanceof i ? (w(_, f), _._source = this) : (_ = n && !f ? n : new i(f, this), _.setContent(h)), _;
        }
      });
      var He = Ht.extend({
        // @section
        // @aka Popup options
        options: {
          // @option pane: String = 'popupPane'
          // `Map pane` where the popup will be added.
          pane: "popupPane",
          // @option offset: Point = Point(0, 7)
          // The offset of the popup position.
          offset: [0, 7],
          // @option maxWidth: Number = 300
          // Max width of the popup, in pixels.
          maxWidth: 300,
          // @option minWidth: Number = 50
          // Min width of the popup, in pixels.
          minWidth: 50,
          // @option maxHeight: Number = null
          // If set, creates a scrollable container of the given height
          // inside a popup if its content exceeds it.
          // The scrollable container can be styled using the
          // `leaflet-popup-scrolled` CSS class selector.
          maxHeight: null,
          // @option autoPan: Boolean = true
          // Set it to `false` if you don't want the map to do panning animation
          // to fit the opened popup.
          autoPan: !0,
          // @option autoPanPaddingTopLeft: Point = null
          // The margin between the popup and the top left corner of the map
          // view after autopanning was performed.
          autoPanPaddingTopLeft: null,
          // @option autoPanPaddingBottomRight: Point = null
          // The margin between the popup and the bottom right corner of the map
          // view after autopanning was performed.
          autoPanPaddingBottomRight: null,
          // @option autoPanPadding: Point = Point(5, 5)
          // Equivalent of setting both top left and bottom right autopan padding to the same value.
          autoPanPadding: [5, 5],
          // @option keepInView: Boolean = false
          // Set it to `true` if you want to prevent users from panning the popup
          // off of the screen while it is open.
          keepInView: !1,
          // @option closeButton: Boolean = true
          // Controls the presence of a close button in the popup.
          closeButton: !0,
          // @option autoClose: Boolean = true
          // Set it to `false` if you want to override the default behavior of
          // the popup closing when another popup is opened.
          autoClose: !0,
          // @option closeOnEscapeKey: Boolean = true
          // Set it to `false` if you want to override the default behavior of
          // the ESC key for closing of the popup.
          closeOnEscapeKey: !0,
          // @option closeOnClick: Boolean = *
          // Set it if you want to override the default behavior of the popup closing when user clicks
          // on the map. Defaults to the map's [`closePopupOnClick`](#map-closepopuponclick) option.
          // @option className: String = ''
          // A custom CSS class name to assign to the popup.
          className: ""
        },
        // @namespace Popup
        // @method openOn(map: Map): this
        // Alternative to `map.openPopup(popup)`.
        // Adds the popup to the map and closes the previous one.
        openOn: function(i) {
          return i = arguments.length ? i : this._source._map, !i.hasLayer(this) && i._popup && i._popup.options.autoClose && i.removeLayer(i._popup), i._popup = this, Ht.prototype.openOn.call(this, i);
        },
        onAdd: function(i) {
          Ht.prototype.onAdd.call(this, i), i.fire("popupopen", { popup: this }), this._source && (this._source.fire("popupopen", { popup: this }, !0), this._source instanceof ai || this._source.on("preclick", di));
        },
        onRemove: function(i) {
          Ht.prototype.onRemove.call(this, i), i.fire("popupclose", { popup: this }), this._source && (this._source.fire("popupclose", { popup: this }, !0), this._source instanceof ai || this._source.off("preclick", di));
        },
        getEvents: function() {
          var i = Ht.prototype.getEvents.call(this);
          return (this.options.closeOnClick !== void 0 ? this.options.closeOnClick : this._map.options.closePopupOnClick) && (i.preclick = this.close), this.options.keepInView && (i.moveend = this._adjustPan), i;
        },
        _initLayout: function() {
          var i = "leaflet-popup", n = this._container = J(
            "div",
            i + " " + (this.options.className || "") + " leaflet-zoom-animated"
          ), h = this._wrapper = J("div", i + "-content-wrapper", n);
          if (this._contentNode = J("div", i + "-content", h), Ki(n), Ds(this._contentNode), j(n, "contextmenu", di), this._tipContainer = J("div", i + "-tip-container", n), this._tip = J("div", i + "-tip", this._tipContainer), this.options.closeButton) {
            var f = this._closeButton = J("a", i + "-close-button", n);
            f.setAttribute("role", "button"), f.setAttribute("aria-label", "Close popup"), f.href = "#close", f.innerHTML = '<span aria-hidden="true">&#215;</span>', j(f, "click", function(_) {
              pt(_), this.close();
            }, this);
          }
        },
        _updateLayout: function() {
          var i = this._contentNode, n = i.style;
          n.width = "", n.whiteSpace = "nowrap";
          var h = i.offsetWidth;
          h = Math.min(h, this.options.maxWidth), h = Math.max(h, this.options.minWidth), n.width = h + 1 + "px", n.whiteSpace = "", n.height = "";
          var f = i.offsetHeight, _ = this.options.maxHeight, v = "leaflet-popup-scrolled";
          _ && f > _ ? (n.height = _ + "px", W(i, v)) : lt(i, v), this._containerWidth = this._container.offsetWidth;
        },
        _animateZoom: function(i) {
          var n = this._map._latLngToNewLayerPoint(this._latlng, i.zoom, i.center), h = this._getAnchor();
          ft(this._container, n.add(h));
        },
        _adjustPan: function() {
          if (this.options.autoPan) {
            if (this._map._panAnim && this._map._panAnim.stop(), this._autopanning) {
              this._autopanning = !1;
              return;
            }
            var i = this._map, n = parseInt(Hi(this._container, "marginBottom"), 10) || 0, h = this._container.offsetHeight + n, f = this._containerWidth, _ = new q(this._containerLeft, -h - this._containerBottom);
            _._add(fi(this._container));
            var v = i.layerPointToContainerPoint(_), x = U(this.options.autoPanPadding), b = U(this.options.autoPanPaddingTopLeft || x), S = U(this.options.autoPanPaddingBottomRight || x), C = i.getSize(), k = 0, D = 0;
            v.x + f + S.x > C.x && (k = v.x + f - C.x + S.x), v.x - k - b.x < 0 && (k = v.x - b.x), v.y + h + S.y > C.y && (D = v.y + h - C.y + S.y), v.y - D - b.y < 0 && (D = v.y - b.y), (k || D) && (this.options.keepInView && (this._autopanning = !0), i.fire("autopanstart").panBy([k, D]));
          }
        },
        _getAnchor: function() {
          return U(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
        }
      }), oh = function(i, n) {
        return new He(i, n);
      };
      $.mergeOptions({
        closePopupOnClick: !0
      }), $.include({
        // @method openPopup(popup: Popup): this
        // Opens the specified popup while closing the previously opened (to make sure only one is opened at one time for usability).
        // @alternative
        // @method openPopup(content: String|HTMLElement, latlng: LatLng, options?: Popup options): this
        // Creates a popup with the specified content and options and opens it in the given point on a map.
        openPopup: function(i, n, h) {
          return this._initOverlay(He, i, n, h).openOn(this), this;
        },
        // @method closePopup(popup?: Popup): this
        // Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
        closePopup: function(i) {
          return i = arguments.length ? i : this._popup, i && i.close(), this;
        }
      }), zt.include({
        // @method bindPopup(content: String|HTMLElement|Function|Popup, options?: Popup options): this
        // Binds a popup to the layer with the passed `content` and sets up the
        // necessary event listeners. If a `Function` is passed it will receive
        // the layer as the first argument and should return a `String` or `HTMLElement`.
        bindPopup: function(i, n) {
          return this._popup = this._initOverlay(He, this._popup, i, n), this._popupHandlersAdded || (this.on({
            click: this._openPopup,
            keypress: this._onKeyPress,
            remove: this.closePopup,
            move: this._movePopup
          }), this._popupHandlersAdded = !0), this;
        },
        // @method unbindPopup(): this
        // Removes the popup previously bound with `bindPopup`.
        unbindPopup: function() {
          return this._popup && (this.off({
            click: this._openPopup,
            keypress: this._onKeyPress,
            remove: this.closePopup,
            move: this._movePopup
          }), this._popupHandlersAdded = !1, this._popup = null), this;
        },
        // @method openPopup(latlng?: LatLng): this
        // Opens the bound popup at the specified `latlng` or at the default popup anchor if no `latlng` is passed.
        openPopup: function(i) {
          return this._popup && (this instanceof Kt || (this._popup._source = this), this._popup._prepareOpen(i || this._latlng) && this._popup.openOn(this._map)), this;
        },
        // @method closePopup(): this
        // Closes the popup bound to this layer if it is open.
        closePopup: function() {
          return this._popup && this._popup.close(), this;
        },
        // @method togglePopup(): this
        // Opens or closes the popup bound to this layer depending on its current state.
        togglePopup: function() {
          return this._popup && this._popup.toggle(this), this;
        },
        // @method isPopupOpen(): boolean
        // Returns `true` if the popup bound to this layer is currently open.
        isPopupOpen: function() {
          return this._popup ? this._popup.isOpen() : !1;
        },
        // @method setPopupContent(content: String|HTMLElement|Popup): this
        // Sets the content of the popup bound to this layer.
        setPopupContent: function(i) {
          return this._popup && this._popup.setContent(i), this;
        },
        // @method getPopup(): Popup
        // Returns the popup bound to this layer.
        getPopup: function() {
          return this._popup;
        },
        _openPopup: function(i) {
          if (!(!this._popup || !this._map)) {
            _i(i);
            var n = i.layer || i.target;
            if (this._popup._source === n && !(n instanceof ai)) {
              this._map.hasLayer(this._popup) ? this.closePopup() : this.openPopup(i.latlng);
              return;
            }
            this._popup._source = n, this.openPopup(i.latlng);
          }
        },
        _movePopup: function(i) {
          this._popup.setLatLng(i.latlng);
        },
        _onKeyPress: function(i) {
          i.originalEvent.keyCode === 13 && this._openPopup(i);
        }
      });
      var Xe = Ht.extend({
        // @section
        // @aka Tooltip options
        options: {
          // @option pane: String = 'tooltipPane'
          // `Map pane` where the tooltip will be added.
          pane: "tooltipPane",
          // @option offset: Point = Point(0, 0)
          // Optional offset of the tooltip position.
          offset: [0, 0],
          // @option direction: String = 'auto'
          // Direction where to open the tooltip. Possible values are: `right`, `left`,
          // `top`, `bottom`, `center`, `auto`.
          // `auto` will dynamically switch between `right` and `left` according to the tooltip
          // position on the map.
          direction: "auto",
          // @option permanent: Boolean = false
          // Whether to open the tooltip permanently or only on mouseover.
          permanent: !1,
          // @option sticky: Boolean = false
          // If true, the tooltip will follow the mouse instead of being fixed at the feature center.
          sticky: !1,
          // @option opacity: Number = 0.9
          // Tooltip container opacity.
          opacity: 0.9
        },
        onAdd: function(i) {
          Ht.prototype.onAdd.call(this, i), this.setOpacity(this.options.opacity), i.fire("tooltipopen", { tooltip: this }), this._source && (this.addEventParent(this._source), this._source.fire("tooltipopen", { tooltip: this }, !0));
        },
        onRemove: function(i) {
          Ht.prototype.onRemove.call(this, i), i.fire("tooltipclose", { tooltip: this }), this._source && (this.removeEventParent(this._source), this._source.fire("tooltipclose", { tooltip: this }, !0));
        },
        getEvents: function() {
          var i = Ht.prototype.getEvents.call(this);
          return this.options.permanent || (i.preclick = this.close), i;
        },
        _initLayout: function() {
          var i = "leaflet-tooltip", n = i + " " + (this.options.className || "") + " leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
          this._contentNode = this._container = J("div", n), this._container.setAttribute("role", "tooltip"), this._container.setAttribute("id", "leaflet-tooltip-" + c(this));
        },
        _updateLayout: function() {
        },
        _adjustPan: function() {
        },
        _setPosition: function(i) {
          var n, h, f = this._map, _ = this._container, v = f.latLngToContainerPoint(f.getCenter()), x = f.layerPointToContainerPoint(i), b = this.options.direction, S = _.offsetWidth, C = _.offsetHeight, k = U(this.options.offset), D = this._getAnchor();
          b === "top" ? (n = S / 2, h = C) : b === "bottom" ? (n = S / 2, h = 0) : b === "center" ? (n = S / 2, h = C / 2) : b === "right" ? (n = 0, h = C / 2) : b === "left" ? (n = S, h = C / 2) : x.x < v.x ? (b = "right", n = 0, h = C / 2) : (b = "left", n = S + (k.x + D.x) * 2, h = C / 2), i = i.subtract(U(n, h, !0)).add(k).add(D), lt(_, "leaflet-tooltip-right"), lt(_, "leaflet-tooltip-left"), lt(_, "leaflet-tooltip-top"), lt(_, "leaflet-tooltip-bottom"), W(_, "leaflet-tooltip-" + b), ft(_, i);
        },
        _updatePosition: function() {
          var i = this._map.latLngToLayerPoint(this._latlng);
          this._setPosition(i);
        },
        setOpacity: function(i) {
          this.options.opacity = i, this._container && It(this._container, i);
        },
        _animateZoom: function(i) {
          var n = this._map._latLngToNewLayerPoint(this._latlng, i.zoom, i.center);
          this._setPosition(n);
        },
        _getAnchor: function() {
          return U(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
        }
      }), hh = function(i, n) {
        return new Xe(i, n);
      };
      $.include({
        // @method openTooltip(tooltip: Tooltip): this
        // Opens the specified tooltip.
        // @alternative
        // @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
        // Creates a tooltip with the specified content and options and open it.
        openTooltip: function(i, n, h) {
          return this._initOverlay(Xe, i, n, h).openOn(this), this;
        },
        // @method closeTooltip(tooltip: Tooltip): this
        // Closes the tooltip given as parameter.
        closeTooltip: function(i) {
          return i.close(), this;
        }
      }), zt.include({
        // @method bindTooltip(content: String|HTMLElement|Function|Tooltip, options?: Tooltip options): this
        // Binds a tooltip to the layer with the passed `content` and sets up the
        // necessary event listeners. If a `Function` is passed it will receive
        // the layer as the first argument and should return a `String` or `HTMLElement`.
        bindTooltip: function(i, n) {
          return this._tooltip && this.isTooltipOpen() && this.unbindTooltip(), this._tooltip = this._initOverlay(Xe, this._tooltip, i, n), this._initTooltipInteractions(), this._tooltip.options.permanent && this._map && this._map.hasLayer(this) && this.openTooltip(), this;
        },
        // @method unbindTooltip(): this
        // Removes the tooltip previously bound with `bindTooltip`.
        unbindTooltip: function() {
          return this._tooltip && (this._initTooltipInteractions(!0), this.closeTooltip(), this._tooltip = null), this;
        },
        _initTooltipInteractions: function(i) {
          if (!(!i && this._tooltipHandlersAdded)) {
            var n = i ? "off" : "on", h = {
              remove: this.closeTooltip,
              move: this._moveTooltip
            };
            this._tooltip.options.permanent ? h.add = this._openTooltip : (h.mouseover = this._openTooltip, h.mouseout = this.closeTooltip, h.click = this._openTooltip, this._map ? this._addFocusListeners() : h.add = this._addFocusListeners), this._tooltip.options.sticky && (h.mousemove = this._moveTooltip), this[n](h), this._tooltipHandlersAdded = !i;
          }
        },
        // @method openTooltip(latlng?: LatLng): this
        // Opens the bound tooltip at the specified `latlng` or at the default tooltip anchor if no `latlng` is passed.
        openTooltip: function(i) {
          return this._tooltip && (this instanceof Kt || (this._tooltip._source = this), this._tooltip._prepareOpen(i) && (this._tooltip.openOn(this._map), this.getElement ? this._setAriaDescribedByOnLayer(this) : this.eachLayer && this.eachLayer(this._setAriaDescribedByOnLayer, this))), this;
        },
        // @method closeTooltip(): this
        // Closes the tooltip bound to this layer if it is open.
        closeTooltip: function() {
          if (this._tooltip)
            return this._tooltip.close();
        },
        // @method toggleTooltip(): this
        // Opens or closes the tooltip bound to this layer depending on its current state.
        toggleTooltip: function() {
          return this._tooltip && this._tooltip.toggle(this), this;
        },
        // @method isTooltipOpen(): boolean
        // Returns `true` if the tooltip bound to this layer is currently open.
        isTooltipOpen: function() {
          return this._tooltip.isOpen();
        },
        // @method setTooltipContent(content: String|HTMLElement|Tooltip): this
        // Sets the content of the tooltip bound to this layer.
        setTooltipContent: function(i) {
          return this._tooltip && this._tooltip.setContent(i), this;
        },
        // @method getTooltip(): Tooltip
        // Returns the tooltip bound to this layer.
        getTooltip: function() {
          return this._tooltip;
        },
        _addFocusListeners: function() {
          this.getElement ? this._addFocusListenersOnLayer(this) : this.eachLayer && this.eachLayer(this._addFocusListenersOnLayer, this);
        },
        _addFocusListenersOnLayer: function(i) {
          var n = typeof i.getElement == "function" && i.getElement();
          n && (j(n, "focus", function() {
            this._tooltip._source = i, this.openTooltip();
          }, this), j(n, "blur", this.closeTooltip, this));
        },
        _setAriaDescribedByOnLayer: function(i) {
          var n = typeof i.getElement == "function" && i.getElement();
          n && n.setAttribute("aria-describedby", this._tooltip._container.id);
        },
        _openTooltip: function(i) {
          if (!(!this._tooltip || !this._map)) {
            if (this._map.dragging && this._map.dragging.moving() && !this._openOnceFlag) {
              this._openOnceFlag = !0;
              var n = this;
              this._map.once("moveend", function() {
                n._openOnceFlag = !1, n._openTooltip(i);
              });
              return;
            }
            this._tooltip._source = i.layer || i.target, this.openTooltip(this._tooltip.options.sticky ? i.latlng : void 0);
          }
        },
        _moveTooltip: function(i) {
          var n = i.latlng, h, f;
          this._tooltip.options.sticky && i.originalEvent && (h = this._map.mouseEventToContainerPoint(i.originalEvent), f = this._map.containerPointToLayerPoint(h), n = this._map.layerPointToLatLng(f)), this._tooltip.setLatLng(n);
        }
      });
      var ba = bi.extend({
        options: {
          // @section
          // @aka DivIcon options
          iconSize: [12, 12],
          // also can be set through CSS
          // iconAnchor: (Point),
          // popupAnchor: (Point),
          // @option html: String|HTMLElement = ''
          // Custom HTML code to put inside the div element, empty by default. Alternatively,
          // an instance of `HTMLElement`.
          html: !1,
          // @option bgPos: Point = [0, 0]
          // Optional relative position of the background, in pixels
          bgPos: null,
          className: "leaflet-div-icon"
        },
        createIcon: function(i) {
          var n = i && i.tagName === "DIV" ? i : document.createElement("div"), h = this.options;
          if (h.html instanceof Element ? (Oe(n), n.appendChild(h.html)) : n.innerHTML = h.html !== !1 ? h.html : "", h.bgPos) {
            var f = U(h.bgPos);
            n.style.backgroundPosition = -f.x + "px " + -f.y + "px";
          }
          return this._setIconStyles(n, "icon"), n;
        },
        createShadow: function() {
          return null;
        }
      });
      function lh(i) {
        return new ba(i);
      }
      bi.Default = Qi;
      var te = zt.extend({
        // @section
        // @aka GridLayer options
        options: {
          // @option tileSize: Number|Point = 256
          // Width and height of tiles in the grid. Use a number if width and height are equal, or `L.point(width, height)` otherwise.
          tileSize: 256,
          // @option opacity: Number = 1.0
          // Opacity of the tiles. Can be used in the `createTile()` function.
          opacity: 1,
          // @option updateWhenIdle: Boolean = (depends)
          // Load new tiles only when panning ends.
          // `true` by default on mobile browsers, in order to avoid too many requests and keep smooth navigation.
          // `false` otherwise in order to display new tiles _during_ panning, since it is easy to pan outside the
          // [`keepBuffer`](#gridlayer-keepbuffer) option in desktop browsers.
          updateWhenIdle: B.mobile,
          // @option updateWhenZooming: Boolean = true
          // By default, a smooth zoom animation (during a [touch zoom](#map-touchzoom) or a [`flyTo()`](#map-flyto)) will update grid layers every integer zoom level. Setting this option to `false` will update the grid layer only when the smooth animation ends.
          updateWhenZooming: !0,
          // @option updateInterval: Number = 200
          // Tiles will not update more than once every `updateInterval` milliseconds when panning.
          updateInterval: 200,
          // @option zIndex: Number = 1
          // The explicit zIndex of the tile layer.
          zIndex: 1,
          // @option bounds: LatLngBounds = undefined
          // If set, tiles will only be loaded inside the set `LatLngBounds`.
          bounds: null,
          // @option minZoom: Number = 0
          // The minimum zoom level down to which this layer will be displayed (inclusive).
          minZoom: 0,
          // @option maxZoom: Number = undefined
          // The maximum zoom level up to which this layer will be displayed (inclusive).
          maxZoom: void 0,
          // @option maxNativeZoom: Number = undefined
          // Maximum zoom number the tile source has available. If it is specified,
          // the tiles on all zoom levels higher than `maxNativeZoom` will be loaded
          // from `maxNativeZoom` level and auto-scaled.
          maxNativeZoom: void 0,
          // @option minNativeZoom: Number = undefined
          // Minimum zoom number the tile source has available. If it is specified,
          // the tiles on all zoom levels lower than `minNativeZoom` will be loaded
          // from `minNativeZoom` level and auto-scaled.
          minNativeZoom: void 0,
          // @option noWrap: Boolean = false
          // Whether the layer is wrapped around the antimeridian. If `true`, the
          // GridLayer will only be displayed once at low zoom levels. Has no
          // effect when the [map CRS](#map-crs) doesn't wrap around. Can be used
          // in combination with [`bounds`](#gridlayer-bounds) to prevent requesting
          // tiles outside the CRS limits.
          noWrap: !1,
          // @option pane: String = 'tilePane'
          // `Map pane` where the grid layer will be added.
          pane: "tilePane",
          // @option className: String = ''
          // A custom class name to assign to the tile layer. Empty by default.
          className: "",
          // @option keepBuffer: Number = 2
          // When panning the map, keep this many rows and columns of tiles before unloading them.
          keepBuffer: 2
        },
        initialize: function(i) {
          w(this, i);
        },
        onAdd: function() {
          this._initContainer(), this._levels = {}, this._tiles = {}, this._resetView();
        },
        beforeAdd: function(i) {
          i._addZoomLimit(this);
        },
        onRemove: function(i) {
          this._removeAllTiles(), at(this._container), i._removeZoomLimit(this), this._container = null, this._tileZoom = void 0;
        },
        // @method bringToFront: this
        // Brings the tile layer to the top of all tile layers.
        bringToFront: function() {
          return this._map && (wi(this._container), this._setAutoZIndex(Math.max)), this;
        },
        // @method bringToBack: this
        // Brings the tile layer to the bottom of all tile layers.
        bringToBack: function() {
          return this._map && (xi(this._container), this._setAutoZIndex(Math.min)), this;
        },
        // @method getContainer: HTMLElement
        // Returns the HTML element that contains the tiles for this layer.
        getContainer: function() {
          return this._container;
        },
        // @method setOpacity(opacity: Number): this
        // Changes the [opacity](#gridlayer-opacity) of the grid layer.
        setOpacity: function(i) {
          return this.options.opacity = i, this._updateOpacity(), this;
        },
        // @method setZIndex(zIndex: Number): this
        // Changes the [zIndex](#gridlayer-zindex) of the grid layer.
        setZIndex: function(i) {
          return this.options.zIndex = i, this._updateZIndex(), this;
        },
        // @method isLoading: Boolean
        // Returns `true` if any tile in the grid layer has not finished loading.
        isLoading: function() {
          return this._loading;
        },
        // @method redraw: this
        // Causes the layer to clear all the tiles and request them again.
        redraw: function() {
          if (this._map) {
            this._removeAllTiles();
            var i = this._clampZoom(this._map.getZoom());
            i !== this._tileZoom && (this._tileZoom = i, this._updateLevels()), this._update();
          }
          return this;
        },
        getEvents: function() {
          var i = {
            viewprereset: this._invalidateAll,
            viewreset: this._resetView,
            zoom: this._resetView,
            moveend: this._onMoveEnd
          };
          return this.options.updateWhenIdle || (this._onMove || (this._onMove = d(this._onMoveEnd, this.options.updateInterval, this)), i.move = this._onMove), this._zoomAnimated && (i.zoomanim = this._animateZoom), i;
        },
        // @section Extension methods
        // Layers extending `GridLayer` shall reimplement the following method.
        // @method createTile(coords: Object, done?: Function): HTMLElement
        // Called only internally, must be overridden by classes extending `GridLayer`.
        // Returns the `HTMLElement` corresponding to the given `coords`. If the `done` callback
        // is specified, it must be called when the tile has finished loading and drawing.
        createTile: function() {
          return document.createElement("div");
        },
        // @section
        // @method getTileSize: Point
        // Normalizes the [tileSize option](#gridlayer-tilesize) into a point. Used by the `createTile()` method.
        getTileSize: function() {
          var i = this.options.tileSize;
          return i instanceof q ? i : new q(i, i);
        },
        _updateZIndex: function() {
          this._container && this.options.zIndex !== void 0 && this.options.zIndex !== null && (this._container.style.zIndex = this.options.zIndex);
        },
        _setAutoZIndex: function(i) {
          for (var n = this.getPane().children, h = -i(-1 / 0, 1 / 0), f = 0, _ = n.length, v; f < _; f++)
            v = n[f].style.zIndex, n[f] !== this._container && v && (h = i(h, +v));
          isFinite(h) && (this.options.zIndex = h + i(-1, 1), this._updateZIndex());
        },
        _updateOpacity: function() {
          if (this._map && !B.ielt9) {
            It(this._container, this.options.opacity);
            var i = +/* @__PURE__ */ new Date(), n = !1, h = !1;
            for (var f in this._tiles) {
              var _ = this._tiles[f];
              if (!(!_.current || !_.loaded)) {
                var v = Math.min(1, (i - _.loaded) / 200);
                It(_.el, v), v < 1 ? n = !0 : (_.active ? h = !0 : this._onOpaqueTile(_), _.active = !0);
              }
            }
            h && !this._noPrune && this._pruneTiles(), n && (_t(this._fadeFrame), this._fadeFrame = Q(this._updateOpacity, this));
          }
        },
        _onOpaqueTile: m,
        _initContainer: function() {
          this._container || (this._container = J("div", "leaflet-layer " + (this.options.className || "")), this._updateZIndex(), this.options.opacity < 1 && this._updateOpacity(), this.getPane().appendChild(this._container));
        },
        _updateLevels: function() {
          var i = this._tileZoom, n = this.options.maxZoom;
          if (i !== void 0) {
            for (var h in this._levels)
              h = Number(h), this._levels[h].el.children.length || h === i ? (this._levels[h].el.style.zIndex = n - Math.abs(i - h), this._onUpdateLevel(h)) : (at(this._levels[h].el), this._removeTilesAtZoom(h), this._onRemoveLevel(h), delete this._levels[h]);
            var f = this._levels[i], _ = this._map;
            return f || (f = this._levels[i] = {}, f.el = J("div", "leaflet-tile-container leaflet-zoom-animated", this._container), f.el.style.zIndex = n, f.origin = _.project(_.unproject(_.getPixelOrigin()), i).round(), f.zoom = i, this._setZoomTransform(f, _.getCenter(), _.getZoom()), m(f.el.offsetWidth), this._onCreateLevel(f)), this._level = f, f;
          }
        },
        _onUpdateLevel: m,
        _onRemoveLevel: m,
        _onCreateLevel: m,
        _pruneTiles: function() {
          if (this._map) {
            var i, n, h = this._map.getZoom();
            if (h > this.options.maxZoom || h < this.options.minZoom) {
              this._removeAllTiles();
              return;
            }
            for (i in this._tiles)
              n = this._tiles[i], n.retain = n.current;
            for (i in this._tiles)
              if (n = this._tiles[i], n.current && !n.active) {
                var f = n.coords;
                this._retainParent(f.x, f.y, f.z, f.z - 5) || this._retainChildren(f.x, f.y, f.z, f.z + 2);
              }
            for (i in this._tiles)
              this._tiles[i].retain || this._removeTile(i);
          }
        },
        _removeTilesAtZoom: function(i) {
          for (var n in this._tiles)
            this._tiles[n].coords.z === i && this._removeTile(n);
        },
        _removeAllTiles: function() {
          for (var i in this._tiles)
            this._removeTile(i);
        },
        _invalidateAll: function() {
          for (var i in this._levels)
            at(this._levels[i].el), this._onRemoveLevel(Number(i)), delete this._levels[i];
          this._removeAllTiles(), this._tileZoom = void 0;
        },
        _retainParent: function(i, n, h, f) {
          var _ = Math.floor(i / 2), v = Math.floor(n / 2), x = h - 1, b = new q(+_, +v);
          b.z = +x;
          var S = this._tileCoordsToKey(b), C = this._tiles[S];
          return C && C.active ? (C.retain = !0, !0) : (C && C.loaded && (C.retain = !0), x > f ? this._retainParent(_, v, x, f) : !1);
        },
        _retainChildren: function(i, n, h, f) {
          for (var _ = 2 * i; _ < 2 * i + 2; _++)
            for (var v = 2 * n; v < 2 * n + 2; v++) {
              var x = new q(_, v);
              x.z = h + 1;
              var b = this._tileCoordsToKey(x), S = this._tiles[b];
              if (S && S.active) {
                S.retain = !0;
                continue;
              } else S && S.loaded && (S.retain = !0);
              h + 1 < f && this._retainChildren(_, v, h + 1, f);
            }
        },
        _resetView: function(i) {
          var n = i && (i.pinch || i.flyTo);
          this._setView(this._map.getCenter(), this._map.getZoom(), n, n);
        },
        _animateZoom: function(i) {
          this._setView(i.center, i.zoom, !0, i.noUpdate);
        },
        _clampZoom: function(i) {
          var n = this.options;
          return n.minNativeZoom !== void 0 && i < n.minNativeZoom ? n.minNativeZoom : n.maxNativeZoom !== void 0 && n.maxNativeZoom < i ? n.maxNativeZoom : i;
        },
        _setView: function(i, n, h, f) {
          var _ = Math.round(n);
          this.options.maxZoom !== void 0 && _ > this.options.maxZoom || this.options.minZoom !== void 0 && _ < this.options.minZoom ? _ = void 0 : _ = this._clampZoom(_);
          var v = this.options.updateWhenZooming && _ !== this._tileZoom;
          (!f || v) && (this._tileZoom = _, this._abortLoading && this._abortLoading(), this._updateLevels(), this._resetGrid(), _ !== void 0 && this._update(i), h || this._pruneTiles(), this._noPrune = !!h), this._setZoomTransforms(i, n);
        },
        _setZoomTransforms: function(i, n) {
          for (var h in this._levels)
            this._setZoomTransform(this._levels[h], i, n);
        },
        _setZoomTransform: function(i, n, h) {
          var f = this._map.getZoomScale(h, i.zoom), _ = i.origin.multiplyBy(f).subtract(this._map._getNewPixelOrigin(n, h)).round();
          B.any3d ? ci(i.el, _, f) : ft(i.el, _);
        },
        _resetGrid: function() {
          var i = this._map, n = i.options.crs, h = this._tileSize = this.getTileSize(), f = this._tileZoom, _ = this._map.getPixelWorldBounds(this._tileZoom);
          _ && (this._globalTileRange = this._pxBoundsToTileRange(_)), this._wrapX = n.wrapLng && !this.options.noWrap && [
            Math.floor(i.project([0, n.wrapLng[0]], f).x / h.x),
            Math.ceil(i.project([0, n.wrapLng[1]], f).x / h.y)
          ], this._wrapY = n.wrapLat && !this.options.noWrap && [
            Math.floor(i.project([n.wrapLat[0], 0], f).y / h.x),
            Math.ceil(i.project([n.wrapLat[1], 0], f).y / h.y)
          ];
        },
        _onMoveEnd: function() {
          !this._map || this._map._animatingZoom || this._update();
        },
        _getTiledPixelBounds: function(i) {
          var n = this._map, h = n._animatingZoom ? Math.max(n._animateToZoom, n.getZoom()) : n.getZoom(), f = n.getZoomScale(h, this._tileZoom), _ = n.project(i, this._tileZoom).floor(), v = n.getSize().divideBy(f * 2);
          return new nt(_.subtract(v), _.add(v));
        },
        // Private method to load tiles in the grid's active zoom level according to map bounds
        _update: function(i) {
          var n = this._map;
          if (n) {
            var h = this._clampZoom(n.getZoom());
            if (i === void 0 && (i = n.getCenter()), this._tileZoom !== void 0) {
              var f = this._getTiledPixelBounds(i), _ = this._pxBoundsToTileRange(f), v = _.getCenter(), x = [], b = this.options.keepBuffer, S = new nt(
                _.getBottomLeft().subtract([b, -b]),
                _.getTopRight().add([b, -b])
              );
              if (!(isFinite(_.min.x) && isFinite(_.min.y) && isFinite(_.max.x) && isFinite(_.max.y)))
                throw new Error("Attempted to load an infinite number of tiles");
              for (var C in this._tiles) {
                var k = this._tiles[C].coords;
                (k.z !== this._tileZoom || !S.contains(new q(k.x, k.y))) && (this._tiles[C].current = !1);
              }
              if (Math.abs(h - this._tileZoom) > 1) {
                this._setView(i, h);
                return;
              }
              for (var D = _.min.y; D <= _.max.y; D++)
                for (var H = _.min.x; H <= _.max.x; H++) {
                  var wt = new q(H, D);
                  if (wt.z = this._tileZoom, !!this._isValidTile(wt)) {
                    var gt = this._tiles[this._tileCoordsToKey(wt)];
                    gt ? gt.current = !0 : x.push(wt);
                  }
                }
              if (x.sort(function(Et, Li) {
                return Et.distanceTo(v) - Li.distanceTo(v);
              }), x.length !== 0) {
                this._loading || (this._loading = !0, this.fire("loading"));
                var Ot = document.createDocumentFragment();
                for (H = 0; H < x.length; H++)
                  this._addTile(x[H], Ot);
                this._level.el.appendChild(Ot);
              }
            }
          }
        },
        _isValidTile: function(i) {
          var n = this._map.options.crs;
          if (!n.infinite) {
            var h = this._globalTileRange;
            if (!n.wrapLng && (i.x < h.min.x || i.x > h.max.x) || !n.wrapLat && (i.y < h.min.y || i.y > h.max.y))
              return !1;
          }
          if (!this.options.bounds)
            return !0;
          var f = this._tileCoordsToBounds(i);
          return ct(this.options.bounds).overlaps(f);
        },
        _keyToBounds: function(i) {
          return this._tileCoordsToBounds(this._keyToTileCoords(i));
        },
        _tileCoordsToNwSe: function(i) {
          var n = this._map, h = this.getTileSize(), f = i.scaleBy(h), _ = f.add(h), v = n.unproject(f, i.z), x = n.unproject(_, i.z);
          return [v, x];
        },
        // converts tile coordinates to its geographical bounds
        _tileCoordsToBounds: function(i) {
          var n = this._tileCoordsToNwSe(i), h = new bt(n[0], n[1]);
          return this.options.noWrap || (h = this._map.wrapLatLngBounds(h)), h;
        },
        // converts tile coordinates to key for the tile cache
        _tileCoordsToKey: function(i) {
          return i.x + ":" + i.y + ":" + i.z;
        },
        // converts tile cache key to coordinates
        _keyToTileCoords: function(i) {
          var n = i.split(":"), h = new q(+n[0], +n[1]);
          return h.z = +n[2], h;
        },
        _removeTile: function(i) {
          var n = this._tiles[i];
          n && (at(n.el), delete this._tiles[i], this.fire("tileunload", {
            tile: n.el,
            coords: this._keyToTileCoords(i)
          }));
        },
        _initTile: function(i) {
          W(i, "leaflet-tile");
          var n = this.getTileSize();
          i.style.width = n.x + "px", i.style.height = n.y + "px", i.onselectstart = m, i.onmousemove = m, B.ielt9 && this.options.opacity < 1 && It(i, this.options.opacity);
        },
        _addTile: function(i, n) {
          var h = this._getTilePos(i), f = this._tileCoordsToKey(i), _ = this.createTile(this._wrapCoords(i), l(this._tileReady, this, i));
          this._initTile(_), this.createTile.length < 2 && Q(l(this._tileReady, this, i, null, _)), ft(_, h), this._tiles[f] = {
            el: _,
            coords: i,
            current: !0
          }, n.appendChild(_), this.fire("tileloadstart", {
            tile: _,
            coords: i
          });
        },
        _tileReady: function(i, n, h) {
          n && this.fire("tileerror", {
            error: n,
            tile: h,
            coords: i
          });
          var f = this._tileCoordsToKey(i);
          h = this._tiles[f], h && (h.loaded = +/* @__PURE__ */ new Date(), this._map._fadeAnimated ? (It(h.el, 0), _t(this._fadeFrame), this._fadeFrame = Q(this._updateOpacity, this)) : (h.active = !0, this._pruneTiles()), n || (W(h.el, "leaflet-tile-loaded"), this.fire("tileload", {
            tile: h.el,
            coords: i
          })), this._noTilesToLoad() && (this._loading = !1, this.fire("load"), B.ielt9 || !this._map._fadeAnimated ? Q(this._pruneTiles, this) : setTimeout(l(this._pruneTiles, this), 250)));
        },
        _getTilePos: function(i) {
          return i.scaleBy(this.getTileSize()).subtract(this._level.origin);
        },
        _wrapCoords: function(i) {
          var n = new q(
            this._wrapX ? g(i.x, this._wrapX) : i.x,
            this._wrapY ? g(i.y, this._wrapY) : i.y
          );
          return n.z = i.z, n;
        },
        _pxBoundsToTileRange: function(i) {
          var n = this.getTileSize();
          return new nt(
            i.min.unscaleBy(n).floor(),
            i.max.unscaleBy(n).ceil().subtract([1, 1])
          );
        },
        _noTilesToLoad: function() {
          for (var i in this._tiles)
            if (!this._tiles[i].loaded)
              return !1;
          return !0;
        }
      });
      function uh(i) {
        return new te(i);
      }
      var Ai = te.extend({
        // @section
        // @aka TileLayer options
        options: {
          // @option minZoom: Number = 0
          // The minimum zoom level down to which this layer will be displayed (inclusive).
          minZoom: 0,
          // @option maxZoom: Number = 18
          // The maximum zoom level up to which this layer will be displayed (inclusive).
          maxZoom: 18,
          // @option subdomains: String|String[] = 'abc'
          // Subdomains of the tile service. Can be passed in the form of one string (where each letter is a subdomain name) or an array of strings.
          subdomains: "abc",
          // @option errorTileUrl: String = ''
          // URL to the tile image to show in place of the tile that failed to load.
          errorTileUrl: "",
          // @option zoomOffset: Number = 0
          // The zoom number used in tile URLs will be offset with this value.
          zoomOffset: 0,
          // @option tms: Boolean = false
          // If `true`, inverses Y axis numbering for tiles (turn this on for [TMS](https://en.wikipedia.org/wiki/Tile_Map_Service) services).
          tms: !1,
          // @option zoomReverse: Boolean = false
          // If set to true, the zoom number used in tile URLs will be reversed (`maxZoom - zoom` instead of `zoom`)
          zoomReverse: !1,
          // @option detectRetina: Boolean = false
          // If `true` and user is on a retina display, it will request four tiles of half the specified size and a bigger zoom level in place of one to utilize the high resolution.
          detectRetina: !1,
          // @option crossOrigin: Boolean|String = false
          // Whether the crossOrigin attribute will be added to the tiles.
          // If a String is provided, all tiles will have their crossOrigin attribute set to the String provided. This is needed if you want to access tile pixel data.
          // Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
          crossOrigin: !1,
          // @option referrerPolicy: Boolean|String = false
          // Whether the referrerPolicy attribute will be added to the tiles.
          // If a String is provided, all tiles will have their referrerPolicy attribute set to the String provided.
          // This may be needed if your map's rendering context has a strict default but your tile provider expects a valid referrer
          // (e.g. to validate an API token).
          // Refer to [HTMLImageElement.referrerPolicy](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/referrerPolicy) for valid String values.
          referrerPolicy: !1
        },
        initialize: function(i, n) {
          this._url = i, n = w(this, n), n.detectRetina && B.retina && n.maxZoom > 0 ? (n.tileSize = Math.floor(n.tileSize / 2), n.zoomReverse ? (n.zoomOffset--, n.minZoom = Math.min(n.maxZoom, n.minZoom + 1)) : (n.zoomOffset++, n.maxZoom = Math.max(n.minZoom, n.maxZoom - 1)), n.minZoom = Math.max(0, n.minZoom)) : n.zoomReverse ? n.minZoom = Math.min(n.maxZoom, n.minZoom) : n.maxZoom = Math.max(n.minZoom, n.maxZoom), typeof n.subdomains == "string" && (n.subdomains = n.subdomains.split("")), this.on("tileunload", this._onTileRemove);
        },
        // @method setUrl(url: String, noRedraw?: Boolean): this
        // Updates the layer's URL template and redraws it (unless `noRedraw` is set to `true`).
        // If the URL does not change, the layer will not be redrawn unless
        // the noRedraw parameter is set to false.
        setUrl: function(i, n) {
          return this._url === i && n === void 0 && (n = !0), this._url = i, n || this.redraw(), this;
        },
        // @method createTile(coords: Object, done?: Function): HTMLElement
        // Called only internally, overrides GridLayer's [`createTile()`](#gridlayer-createtile)
        // to return an `<img>` HTML element with the appropriate image URL given `coords`. The `done`
        // callback is called when the tile has been loaded.
        createTile: function(i, n) {
          var h = document.createElement("img");
          return j(h, "load", l(this._tileOnLoad, this, n, h)), j(h, "error", l(this._tileOnError, this, n, h)), (this.options.crossOrigin || this.options.crossOrigin === "") && (h.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), typeof this.options.referrerPolicy == "string" && (h.referrerPolicy = this.options.referrerPolicy), h.alt = "", h.src = this.getTileUrl(i), h;
        },
        // @section Extension methods
        // @uninheritable
        // Layers extending `TileLayer` might reimplement the following method.
        // @method getTileUrl(coords: Object): String
        // Called only internally, returns the URL for a tile given its coordinates.
        // Classes extending `TileLayer` can override this function to provide custom tile URL naming schemes.
        getTileUrl: function(i) {
          var n = {
            r: B.retina ? "@2x" : "",
            s: this._getSubdomain(i),
            x: i.x,
            y: i.y,
            z: this._getZoomForUrl()
          };
          if (this._map && !this._map.options.crs.infinite) {
            var h = this._globalTileRange.max.y - i.y;
            this.options.tms && (n.y = h), n["-y"] = h;
          }
          return A(this._url, r(n, this.options));
        },
        _tileOnLoad: function(i, n) {
          B.ielt9 ? setTimeout(l(i, this, null, n), 0) : i(null, n);
        },
        _tileOnError: function(i, n, h) {
          var f = this.options.errorTileUrl;
          f && n.getAttribute("src") !== f && (n.src = f), i(h, n);
        },
        _onTileRemove: function(i) {
          i.tile.onload = null;
        },
        _getZoomForUrl: function() {
          var i = this._tileZoom, n = this.options.maxZoom, h = this.options.zoomReverse, f = this.options.zoomOffset;
          return h && (i = n - i), i + f;
        },
        _getSubdomain: function(i) {
          var n = Math.abs(i.x + i.y) % this.options.subdomains.length;
          return this.options.subdomains[n];
        },
        // stops loading all tiles in the background layer
        _abortLoading: function() {
          var i, n;
          for (i in this._tiles)
            if (this._tiles[i].coords.z !== this._tileZoom && (n = this._tiles[i].el, n.onload = m, n.onerror = m, !n.complete)) {
              n.src = R;
              var h = this._tiles[i].coords;
              at(n), delete this._tiles[i], this.fire("tileabort", {
                tile: n,
                coords: h
              });
            }
        },
        _removeTile: function(i) {
          var n = this._tiles[i];
          if (n)
            return n.el.setAttribute("src", R), te.prototype._removeTile.call(this, i);
        },
        _tileReady: function(i, n, h) {
          if (!(!this._map || h && h.getAttribute("src") === R))
            return te.prototype._tileReady.call(this, i, n, h);
        }
      });
      function Ea(i, n) {
        return new Ai(i, n);
      }
      var Sa = Ai.extend({
        // @section
        // @aka TileLayer.WMS options
        // If any custom options not documented here are used, they will be sent to the
        // WMS server as extra parameters in each request URL. This can be useful for
        // [non-standard vendor WMS parameters](https://docs.geoserver.org/stable/en/user/services/wms/vendor.html).
        defaultWmsParams: {
          service: "WMS",
          request: "GetMap",
          // @option layers: String = ''
          // **(required)** Comma-separated list of WMS layers to show.
          layers: "",
          // @option styles: String = ''
          // Comma-separated list of WMS styles.
          styles: "",
          // @option format: String = 'image/jpeg'
          // WMS image format (use `'image/png'` for layers with transparency).
          format: "image/jpeg",
          // @option transparent: Boolean = false
          // If `true`, the WMS service will return images with transparency.
          transparent: !1,
          // @option version: String = '1.1.1'
          // Version of the WMS service to use
          version: "1.1.1"
        },
        options: {
          // @option crs: CRS = null
          // Coordinate Reference System to use for the WMS requests, defaults to
          // map CRS. Don't change this if you're not sure what it means.
          crs: null,
          // @option uppercase: Boolean = false
          // If `true`, WMS request parameter keys will be uppercase.
          uppercase: !1
        },
        initialize: function(i, n) {
          this._url = i;
          var h = r({}, this.defaultWmsParams);
          for (var f in n)
            f in this.options || (h[f] = n[f]);
          n = w(this, n);
          var _ = n.detectRetina && B.retina ? 2 : 1, v = this.getTileSize();
          h.width = v.x * _, h.height = v.y * _, this.wmsParams = h;
        },
        onAdd: function(i) {
          this._crs = this.options.crs || i.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version);
          var n = this._wmsVersion >= 1.3 ? "crs" : "srs";
          this.wmsParams[n] = this._crs.code, Ai.prototype.onAdd.call(this, i);
        },
        getTileUrl: function(i) {
          var n = this._tileCoordsToNwSe(i), h = this._crs, f = Pt(h.project(n[0]), h.project(n[1])), _ = f.min, v = f.max, x = (this._wmsVersion >= 1.3 && this._crs === va ? [_.y, _.x, v.y, v.x] : [_.x, _.y, v.x, v.y]).join(","), b = Ai.prototype.getTileUrl.call(this, i);
          return b + P(this.wmsParams, b, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + x;
        },
        // @method setParams(params: Object, noRedraw?: Boolean): this
        // Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
        setParams: function(i, n) {
          return r(this.wmsParams, i), n || this.redraw(), this;
        }
      });
      function ch(i, n) {
        return new Sa(i, n);
      }
      Ai.WMS = Sa, Ea.wms = ch;
      var Qt = zt.extend({
        // @section
        // @aka Renderer options
        options: {
          // @option padding: Number = 0.1
          // How much to extend the clip area around the map view (relative to its size)
          // e.g. 0.1 would be 10% of map view in each direction
          padding: 0.1
        },
        initialize: function(i) {
          w(this, i), c(this), this._layers = this._layers || {};
        },
        onAdd: function() {
          this._container || (this._initContainer(), W(this._container, "leaflet-zoom-animated")), this.getPane().appendChild(this._container), this._update(), this.on("update", this._updatePaths, this);
        },
        onRemove: function() {
          this.off("update", this._updatePaths, this), this._destroyContainer();
        },
        getEvents: function() {
          var i = {
            viewreset: this._reset,
            zoom: this._onZoom,
            moveend: this._update,
            zoomend: this._onZoomEnd
          };
          return this._zoomAnimated && (i.zoomanim = this._onAnimZoom), i;
        },
        _onAnimZoom: function(i) {
          this._updateTransform(i.center, i.zoom);
        },
        _onZoom: function() {
          this._updateTransform(this._map.getCenter(), this._map.getZoom());
        },
        _updateTransform: function(i, n) {
          var h = this._map.getZoomScale(n, this._zoom), f = this._map.getSize().multiplyBy(0.5 + this.options.padding), _ = this._map.project(this._center, n), v = f.multiplyBy(-h).add(_).subtract(this._map._getNewPixelOrigin(i, n));
          B.any3d ? ci(this._container, v, h) : ft(this._container, v);
        },
        _reset: function() {
          this._update(), this._updateTransform(this._center, this._zoom);
          for (var i in this._layers)
            this._layers[i]._reset();
        },
        _onZoomEnd: function() {
          for (var i in this._layers)
            this._layers[i]._project();
        },
        _updatePaths: function() {
          for (var i in this._layers)
            this._layers[i]._update();
        },
        _update: function() {
          var i = this.options.padding, n = this._map.getSize(), h = this._map.containerPointToLayerPoint(n.multiplyBy(-i)).round();
          this._bounds = new nt(h, h.add(n.multiplyBy(1 + i * 2)).round()), this._center = this._map.getCenter(), this._zoom = this._map.getZoom();
        }
      }), Aa = Qt.extend({
        // @section
        // @aka Canvas options
        options: {
          // @option tolerance: Number = 0
          // How much to extend the click tolerance around a path/object on the map.
          tolerance: 0
        },
        getEvents: function() {
          var i = Qt.prototype.getEvents.call(this);
          return i.viewprereset = this._onViewPreReset, i;
        },
        _onViewPreReset: function() {
          this._postponeUpdatePaths = !0;
        },
        onAdd: function() {
          Qt.prototype.onAdd.call(this), this._draw();
        },
        _initContainer: function() {
          var i = this._container = document.createElement("canvas");
          j(i, "mousemove", this._onMouseMove, this), j(i, "click dblclick mousedown mouseup contextmenu", this._onClick, this), j(i, "mouseout", this._handleMouseOut, this), i._leaflet_disable_events = !0, this._ctx = i.getContext("2d");
        },
        _destroyContainer: function() {
          _t(this._redrawRequest), delete this._ctx, at(this._container), st(this._container), delete this._container;
        },
        _updatePaths: function() {
          if (!this._postponeUpdatePaths) {
            var i;
            this._redrawBounds = null;
            for (var n in this._layers)
              i = this._layers[n], i._update();
            this._redraw();
          }
        },
        _update: function() {
          if (!(this._map._animatingZoom && this._bounds)) {
            Qt.prototype._update.call(this);
            var i = this._bounds, n = this._container, h = i.getSize(), f = B.retina ? 2 : 1;
            ft(n, i.min), n.width = f * h.x, n.height = f * h.y, n.style.width = h.x + "px", n.style.height = h.y + "px", B.retina && this._ctx.scale(2, 2), this._ctx.translate(-i.min.x, -i.min.y), this.fire("update");
          }
        },
        _reset: function() {
          Qt.prototype._reset.call(this), this._postponeUpdatePaths && (this._postponeUpdatePaths = !1, this._updatePaths());
        },
        _initPath: function(i) {
          this._updateDashArray(i), this._layers[c(i)] = i;
          var n = i._order = {
            layer: i,
            prev: this._drawLast,
            next: null
          };
          this._drawLast && (this._drawLast.next = n), this._drawLast = n, this._drawFirst = this._drawFirst || this._drawLast;
        },
        _addPath: function(i) {
          this._requestRedraw(i);
        },
        _removePath: function(i) {
          var n = i._order, h = n.next, f = n.prev;
          h ? h.prev = f : this._drawLast = f, f ? f.next = h : this._drawFirst = h, delete i._order, delete this._layers[c(i)], this._requestRedraw(i);
        },
        _updatePath: function(i) {
          this._extendRedrawBounds(i), i._project(), i._update(), this._requestRedraw(i);
        },
        _updateStyle: function(i) {
          this._updateDashArray(i), this._requestRedraw(i);
        },
        _updateDashArray: function(i) {
          if (typeof i.options.dashArray == "string") {
            var n = i.options.dashArray.split(/[, ]+/), h = [], f, _;
            for (_ = 0; _ < n.length; _++) {
              if (f = Number(n[_]), isNaN(f))
                return;
              h.push(f);
            }
            i.options._dashArray = h;
          } else
            i.options._dashArray = i.options.dashArray;
        },
        _requestRedraw: function(i) {
          this._map && (this._extendRedrawBounds(i), this._redrawRequest = this._redrawRequest || Q(this._redraw, this));
        },
        _extendRedrawBounds: function(i) {
          if (i._pxBounds) {
            var n = (i.options.weight || 0) + 1;
            this._redrawBounds = this._redrawBounds || new nt(), this._redrawBounds.extend(i._pxBounds.min.subtract([n, n])), this._redrawBounds.extend(i._pxBounds.max.add([n, n]));
          }
        },
        _redraw: function() {
          this._redrawRequest = null, this._redrawBounds && (this._redrawBounds.min._floor(), this._redrawBounds.max._ceil()), this._clear(), this._draw(), this._redrawBounds = null;
        },
        _clear: function() {
          var i = this._redrawBounds;
          if (i) {
            var n = i.getSize();
            this._ctx.clearRect(i.min.x, i.min.y, n.x, n.y);
          } else
            this._ctx.save(), this._ctx.setTransform(1, 0, 0, 1, 0, 0), this._ctx.clearRect(0, 0, this._container.width, this._container.height), this._ctx.restore();
        },
        _draw: function() {
          var i, n = this._redrawBounds;
          if (this._ctx.save(), n) {
            var h = n.getSize();
            this._ctx.beginPath(), this._ctx.rect(n.min.x, n.min.y, h.x, h.y), this._ctx.clip();
          }
          this._drawing = !0;
          for (var f = this._drawFirst; f; f = f.next)
            i = f.layer, (!n || i._pxBounds && i._pxBounds.intersects(n)) && i._updatePath();
          this._drawing = !1, this._ctx.restore();
        },
        _updatePoly: function(i, n) {
          if (this._drawing) {
            var h, f, _, v, x = i._parts, b = x.length, S = this._ctx;
            if (b) {
              for (S.beginPath(), h = 0; h < b; h++) {
                for (f = 0, _ = x[h].length; f < _; f++)
                  v = x[h][f], S[f ? "lineTo" : "moveTo"](v.x, v.y);
                n && S.closePath();
              }
              this._fillStroke(S, i);
            }
          }
        },
        _updateCircle: function(i) {
          if (!(!this._drawing || i._empty())) {
            var n = i._point, h = this._ctx, f = Math.max(Math.round(i._radius), 1), _ = (Math.max(Math.round(i._radiusY), 1) || f) / f;
            _ !== 1 && (h.save(), h.scale(1, _)), h.beginPath(), h.arc(n.x, n.y / _, f, 0, Math.PI * 2, !1), _ !== 1 && h.restore(), this._fillStroke(h, i);
          }
        },
        _fillStroke: function(i, n) {
          var h = n.options;
          h.fill && (i.globalAlpha = h.fillOpacity, i.fillStyle = h.fillColor || h.color, i.fill(h.fillRule || "evenodd")), h.stroke && h.weight !== 0 && (i.setLineDash && i.setLineDash(n.options && n.options._dashArray || []), i.globalAlpha = h.opacity, i.lineWidth = h.weight, i.strokeStyle = h.color, i.lineCap = h.lineCap, i.lineJoin = h.lineJoin, i.stroke());
        },
        // Canvas obviously doesn't have mouse events for individual drawn objects,
        // so we emulate that by calculating what's under the mouse on mousemove/click manually
        _onClick: function(i) {
          for (var n = this._map.mouseEventToLayerPoint(i), h, f, _ = this._drawFirst; _; _ = _.next)
            h = _.layer, h.options.interactive && h._containsPoint(n) && (!(i.type === "click" || i.type === "preclick") || !this._map._draggableMoved(h)) && (f = h);
          this._fireEvent(f ? [f] : !1, i);
        },
        _onMouseMove: function(i) {
          if (!(!this._map || this._map.dragging.moving() || this._map._animatingZoom)) {
            var n = this._map.mouseEventToLayerPoint(i);
            this._handleMouseHover(i, n);
          }
        },
        _handleMouseOut: function(i) {
          var n = this._hoveredLayer;
          n && (lt(this._container, "leaflet-interactive"), this._fireEvent([n], i, "mouseout"), this._hoveredLayer = null, this._mouseHoverThrottled = !1);
        },
        _handleMouseHover: function(i, n) {
          if (!this._mouseHoverThrottled) {
            for (var h, f, _ = this._drawFirst; _; _ = _.next)
              h = _.layer, h.options.interactive && h._containsPoint(n) && (f = h);
            f !== this._hoveredLayer && (this._handleMouseOut(i), f && (W(this._container, "leaflet-interactive"), this._fireEvent([f], i, "mouseover"), this._hoveredLayer = f)), this._fireEvent(this._hoveredLayer ? [this._hoveredLayer] : !1, i), this._mouseHoverThrottled = !0, setTimeout(l(function() {
              this._mouseHoverThrottled = !1;
            }, this), 32);
          }
        },
        _fireEvent: function(i, n, h) {
          this._map._fireDOMEvent(n, h || n.type, i);
        },
        _bringToFront: function(i) {
          var n = i._order;
          if (n) {
            var h = n.next, f = n.prev;
            if (h)
              h.prev = f;
            else
              return;
            f ? f.next = h : h && (this._drawFirst = h), n.prev = this._drawLast, this._drawLast.next = n, n.next = null, this._drawLast = n, this._requestRedraw(i);
          }
        },
        _bringToBack: function(i) {
          var n = i._order;
          if (n) {
            var h = n.next, f = n.prev;
            if (f)
              f.next = h;
            else
              return;
            h ? h.prev = f : f && (this._drawLast = f), n.prev = null, n.next = this._drawFirst, this._drawFirst.prev = n, this._drawFirst = n, this._requestRedraw(i);
          }
        }
      });
      function La(i) {
        return B.canvas ? new Aa(i) : null;
      }
      var ie = (function() {
        try {
          return document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"), function(i) {
            return document.createElement("<lvml:" + i + ' class="lvml">');
          };
        } catch {
        }
        return function(i) {
          return document.createElement("<" + i + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
        };
      })(), fh = {
        _initContainer: function() {
          this._container = J("div", "leaflet-vml-container");
        },
        _update: function() {
          this._map._animatingZoom || (Qt.prototype._update.call(this), this.fire("update"));
        },
        _initPath: function(i) {
          var n = i._container = ie("shape");
          W(n, "leaflet-vml-shape " + (this.options.className || "")), n.coordsize = "1 1", i._path = ie("path"), n.appendChild(i._path), this._updateStyle(i), this._layers[c(i)] = i;
        },
        _addPath: function(i) {
          var n = i._container;
          this._container.appendChild(n), i.options.interactive && i.addInteractiveTarget(n);
        },
        _removePath: function(i) {
          var n = i._container;
          at(n), i.removeInteractiveTarget(n), delete this._layers[c(i)];
        },
        _updateStyle: function(i) {
          var n = i._stroke, h = i._fill, f = i.options, _ = i._container;
          _.stroked = !!f.stroke, _.filled = !!f.fill, f.stroke ? (n || (n = i._stroke = ie("stroke")), _.appendChild(n), n.weight = f.weight + "px", n.color = f.color, n.opacity = f.opacity, f.dashArray ? n.dashStyle = T(f.dashArray) ? f.dashArray.join(" ") : f.dashArray.replace(/( *, *)/g, " ") : n.dashStyle = "", n.endcap = f.lineCap.replace("butt", "flat"), n.joinstyle = f.lineJoin) : n && (_.removeChild(n), i._stroke = null), f.fill ? (h || (h = i._fill = ie("fill")), _.appendChild(h), h.color = f.fillColor || f.color, h.opacity = f.fillOpacity) : h && (_.removeChild(h), i._fill = null);
        },
        _updateCircle: function(i) {
          var n = i._point.round(), h = Math.round(i._radius), f = Math.round(i._radiusY || h);
          this._setPath(i, i._empty() ? "M0 0" : "AL " + n.x + "," + n.y + " " + h + "," + f + " 0," + 65535 * 360);
        },
        _setPath: function(i, n) {
          i._path.v = n;
        },
        _bringToFront: function(i) {
          wi(i._container);
        },
        _bringToBack: function(i) {
          xi(i._container);
        }
      }, Ve = B.vml ? ie : Gn, ee = Qt.extend({
        _initContainer: function() {
          this._container = Ve("svg"), this._container.setAttribute("pointer-events", "none"), this._rootGroup = Ve("g"), this._container.appendChild(this._rootGroup);
        },
        _destroyContainer: function() {
          at(this._container), st(this._container), delete this._container, delete this._rootGroup, delete this._svgSize;
        },
        _update: function() {
          if (!(this._map._animatingZoom && this._bounds)) {
            Qt.prototype._update.call(this);
            var i = this._bounds, n = i.getSize(), h = this._container;
            (!this._svgSize || !this._svgSize.equals(n)) && (this._svgSize = n, h.setAttribute("width", n.x), h.setAttribute("height", n.y)), ft(h, i.min), h.setAttribute("viewBox", [i.min.x, i.min.y, n.x, n.y].join(" ")), this.fire("update");
          }
        },
        // methods below are called by vector layers implementations
        _initPath: function(i) {
          var n = i._path = Ve("path");
          i.options.className && W(n, i.options.className), i.options.interactive && W(n, "leaflet-interactive"), this._updateStyle(i), this._layers[c(i)] = i;
        },
        _addPath: function(i) {
          this._rootGroup || this._initContainer(), this._rootGroup.appendChild(i._path), i.addInteractiveTarget(i._path);
        },
        _removePath: function(i) {
          at(i._path), i.removeInteractiveTarget(i._path), delete this._layers[c(i)];
        },
        _updatePath: function(i) {
          i._project(), i._update();
        },
        _updateStyle: function(i) {
          var n = i._path, h = i.options;
          n && (h.stroke ? (n.setAttribute("stroke", h.color), n.setAttribute("stroke-opacity", h.opacity), n.setAttribute("stroke-width", h.weight), n.setAttribute("stroke-linecap", h.lineCap), n.setAttribute("stroke-linejoin", h.lineJoin), h.dashArray ? n.setAttribute("stroke-dasharray", h.dashArray) : n.removeAttribute("stroke-dasharray"), h.dashOffset ? n.setAttribute("stroke-dashoffset", h.dashOffset) : n.removeAttribute("stroke-dashoffset")) : n.setAttribute("stroke", "none"), h.fill ? (n.setAttribute("fill", h.fillColor || h.color), n.setAttribute("fill-opacity", h.fillOpacity), n.setAttribute("fill-rule", h.fillRule || "evenodd")) : n.setAttribute("fill", "none"));
        },
        _updatePoly: function(i, n) {
          this._setPath(i, On(i._parts, n));
        },
        _updateCircle: function(i) {
          var n = i._point, h = Math.max(Math.round(i._radius), 1), f = Math.max(Math.round(i._radiusY), 1) || h, _ = "a" + h + "," + f + " 0 1,0 ", v = i._empty() ? "M0 0" : "M" + (n.x - h) + "," + n.y + _ + h * 2 + ",0 " + _ + -h * 2 + ",0 ";
          this._setPath(i, v);
        },
        _setPath: function(i, n) {
          i._path.setAttribute("d", n);
        },
        // SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
        _bringToFront: function(i) {
          wi(i._path);
        },
        _bringToBack: function(i) {
          xi(i._path);
        }
      });
      B.vml && ee.include(fh);
      function Ta(i) {
        return B.svg || B.vml ? new ee(i) : null;
      }
      $.include({
        // @namespace Map; @method getRenderer(layer: Path): Renderer
        // Returns the instance of `Renderer` that should be used to render the given
        // `Path`. It will ensure that the `renderer` options of the map and paths
        // are respected, and that the renderers do exist on the map.
        getRenderer: function(i) {
          var n = i.options.renderer || this._getPaneRenderer(i.options.pane) || this.options.renderer || this._renderer;
          return n || (n = this._renderer = this._createRenderer()), this.hasLayer(n) || this.addLayer(n), n;
        },
        _getPaneRenderer: function(i) {
          if (i === "overlayPane" || i === void 0)
            return !1;
          var n = this._paneRenderers[i];
          return n === void 0 && (n = this._createRenderer({ pane: i }), this._paneRenderers[i] = n), n;
        },
        _createRenderer: function(i) {
          return this.options.preferCanvas && La(i) || Ta(i);
        }
      });
      var Ca = Ei.extend({
        initialize: function(i, n) {
          Ei.prototype.initialize.call(this, this._boundsToLatLngs(i), n);
        },
        // @method setBounds(latLngBounds: LatLngBounds): this
        // Redraws the rectangle with the passed bounds.
        setBounds: function(i) {
          return this.setLatLngs(this._boundsToLatLngs(i));
        },
        _boundsToLatLngs: function(i) {
          return i = ct(i), [
            i.getSouthWest(),
            i.getNorthWest(),
            i.getNorthEast(),
            i.getSouthEast()
          ];
        }
      });
      function dh(i, n) {
        return new Ca(i, n);
      }
      ee.create = Ve, ee.pointsToPath = On, Jt.geometryToLayer = Ze, Jt.coordsToLatLng = Vs, Jt.coordsToLatLngs = Ue, Jt.latLngToCoords = Ys, Jt.latLngsToCoords = qe, Jt.getFeature = Si, Jt.asFeature = je, $.mergeOptions({
        // @option boxZoom: Boolean = true
        // Whether the map can be zoomed to a rectangular area specified by
        // dragging the mouse while pressing the shift key.
        boxZoom: !0
      });
      var Ia = Wt.extend({
        initialize: function(i) {
          this._map = i, this._container = i._container, this._pane = i._panes.overlayPane, this._resetStateTimeout = 0, i.on("unload", this._destroy, this);
        },
        addHooks: function() {
          j(this._container, "mousedown", this._onMouseDown, this);
        },
        removeHooks: function() {
          st(this._container, "mousedown", this._onMouseDown, this);
        },
        moved: function() {
          return this._moved;
        },
        _destroy: function() {
          at(this._pane), delete this._pane;
        },
        _resetState: function() {
          this._resetStateTimeout = 0, this._moved = !1;
        },
        _clearDeferredResetState: function() {
          this._resetStateTimeout !== 0 && (clearTimeout(this._resetStateTimeout), this._resetStateTimeout = 0);
        },
        _onMouseDown: function(i) {
          if (!i.shiftKey || i.which !== 1 && i.button !== 1)
            return !1;
          this._clearDeferredResetState(), this._resetState(), Xi(), Is(), this._startPoint = this._map.mouseEventToContainerPoint(i), j(document, {
            contextmenu: _i,
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
            keydown: this._onKeyDown
          }, this);
        },
        _onMouseMove: function(i) {
          this._moved || (this._moved = !0, this._box = J("div", "leaflet-zoom-box", this._container), W(this._container, "leaflet-crosshair"), this._map.fire("boxzoomstart")), this._point = this._map.mouseEventToContainerPoint(i);
          var n = new nt(this._point, this._startPoint), h = n.getSize();
          ft(this._box, n.min), this._box.style.width = h.x + "px", this._box.style.height = h.y + "px";
        },
        _finish: function() {
          this._moved && (at(this._box), lt(this._container, "leaflet-crosshair")), Vi(), Gs(), st(document, {
            contextmenu: _i,
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
            keydown: this._onKeyDown
          }, this);
        },
        _onMouseUp: function(i) {
          if (!(i.which !== 1 && i.button !== 1) && (this._finish(), !!this._moved)) {
            this._clearDeferredResetState(), this._resetStateTimeout = setTimeout(l(this._resetState, this), 0);
            var n = new bt(
              this._map.containerPointToLatLng(this._startPoint),
              this._map.containerPointToLatLng(this._point)
            );
            this._map.fitBounds(n).fire("boxzoomend", { boxZoomBounds: n });
          }
        },
        _onKeyDown: function(i) {
          i.keyCode === 27 && (this._finish(), this._clearDeferredResetState(), this._resetState());
        }
      });
      $.addInitHook("addHandler", "boxZoom", Ia), $.mergeOptions({
        // @option doubleClickZoom: Boolean|String = true
        // Whether the map can be zoomed in by double clicking on it and
        // zoomed out by double clicking while holding shift. If passed
        // `'center'`, double-click zoom will zoom to the center of the
        //  view regardless of where the mouse was.
        doubleClickZoom: !0
      });
      var Ga = Wt.extend({
        addHooks: function() {
          this._map.on("dblclick", this._onDoubleClick, this);
        },
        removeHooks: function() {
          this._map.off("dblclick", this._onDoubleClick, this);
        },
        _onDoubleClick: function(i) {
          var n = this._map, h = n.getZoom(), f = n.options.zoomDelta, _ = i.originalEvent.shiftKey ? h - f : h + f;
          n.options.doubleClickZoom === "center" ? n.setZoom(_) : n.setZoomAround(i.containerPoint, _);
        }
      });
      $.addInitHook("addHandler", "doubleClickZoom", Ga), $.mergeOptions({
        // @option dragging: Boolean = true
        // Whether the map is draggable with mouse/touch or not.
        dragging: !0,
        // @section Panning Inertia Options
        // @option inertia: Boolean = *
        // If enabled, panning of the map will have an inertia effect where
        // the map builds momentum while dragging and continues moving in
        // the same direction for some time. Feels especially nice on touch
        // devices. Enabled by default.
        inertia: !0,
        // @option inertiaDeceleration: Number = 3000
        // The rate with which the inertial movement slows down, in pixels/second².
        inertiaDeceleration: 3400,
        // px/s^2
        // @option inertiaMaxSpeed: Number = Infinity
        // Max speed of the inertial movement, in pixels/second.
        inertiaMaxSpeed: 1 / 0,
        // px/s
        // @option easeLinearity: Number = 0.2
        easeLinearity: 0.2,
        // TODO refactor, move to CRS
        // @option worldCopyJump: Boolean = false
        // With this option enabled, the map tracks when you pan to another "copy"
        // of the world and seamlessly jumps to the original one so that all overlays
        // like markers and vector layers are still visible.
        worldCopyJump: !1,
        // @option maxBoundsViscosity: Number = 0.0
        // If `maxBounds` is set, this option will control how solid the bounds
        // are when dragging the map around. The default value of `0.0` allows the
        // user to drag outside the bounds at normal speed, higher values will
        // slow down map dragging outside bounds, and `1.0` makes the bounds fully
        // solid, preventing the user from dragging outside the bounds.
        maxBoundsViscosity: 0
      });
      var Oa = Wt.extend({
        addHooks: function() {
          if (!this._draggable) {
            var i = this._map;
            this._draggable = new ni(i._mapPane, i._container), this._draggable.on({
              dragstart: this._onDragStart,
              drag: this._onDrag,
              dragend: this._onDragEnd
            }, this), this._draggable.on("predrag", this._onPreDragLimit, this), i.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDragWrap, this), i.on("zoomend", this._onZoomEnd, this), i.whenReady(this._onZoomEnd, this));
          }
          W(this._map._container, "leaflet-grab leaflet-touch-drag"), this._draggable.enable(), this._positions = [], this._times = [];
        },
        removeHooks: function() {
          lt(this._map._container, "leaflet-grab"), lt(this._map._container, "leaflet-touch-drag"), this._draggable.disable();
        },
        moved: function() {
          return this._draggable && this._draggable._moved;
        },
        moving: function() {
          return this._draggable && this._draggable._moving;
        },
        _onDragStart: function() {
          var i = this._map;
          if (i._stop(), this._map.options.maxBounds && this._map.options.maxBoundsViscosity) {
            var n = ct(this._map.options.maxBounds);
            this._offsetLimit = Pt(
              this._map.latLngToContainerPoint(n.getNorthWest()).multiplyBy(-1),
              this._map.latLngToContainerPoint(n.getSouthEast()).multiplyBy(-1).add(this._map.getSize())
            ), this._viscosity = Math.min(1, Math.max(0, this._map.options.maxBoundsViscosity));
          } else
            this._offsetLimit = null;
          i.fire("movestart").fire("dragstart"), i.options.inertia && (this._positions = [], this._times = []);
        },
        _onDrag: function(i) {
          if (this._map.options.inertia) {
            var n = this._lastTime = +/* @__PURE__ */ new Date(), h = this._lastPos = this._draggable._absPos || this._draggable._newPos;
            this._positions.push(h), this._times.push(n), this._prunePositions(n);
          }
          this._map.fire("move", i).fire("drag", i);
        },
        _prunePositions: function(i) {
          for (; this._positions.length > 1 && i - this._times[0] > 50; )
            this._positions.shift(), this._times.shift();
        },
        _onZoomEnd: function() {
          var i = this._map.getSize().divideBy(2), n = this._map.latLngToLayerPoint([0, 0]);
          this._initialWorldOffset = n.subtract(i).x, this._worldWidth = this._map.getPixelWorldBounds().getSize().x;
        },
        _viscousLimit: function(i, n) {
          return i - (i - n) * this._viscosity;
        },
        _onPreDragLimit: function() {
          if (!(!this._viscosity || !this._offsetLimit)) {
            var i = this._draggable._newPos.subtract(this._draggable._startPos), n = this._offsetLimit;
            i.x < n.min.x && (i.x = this._viscousLimit(i.x, n.min.x)), i.y < n.min.y && (i.y = this._viscousLimit(i.y, n.min.y)), i.x > n.max.x && (i.x = this._viscousLimit(i.x, n.max.x)), i.y > n.max.y && (i.y = this._viscousLimit(i.y, n.max.y)), this._draggable._newPos = this._draggable._startPos.add(i);
          }
        },
        _onPreDragWrap: function() {
          var i = this._worldWidth, n = Math.round(i / 2), h = this._initialWorldOffset, f = this._draggable._newPos.x, _ = (f - n + h) % i + n - h, v = (f + n + h) % i - n - h, x = Math.abs(_ + h) < Math.abs(v + h) ? _ : v;
          this._draggable._absPos = this._draggable._newPos.clone(), this._draggable._newPos.x = x;
        },
        _onDragEnd: function(i) {
          var n = this._map, h = n.options, f = !h.inertia || i.noInertia || this._times.length < 2;
          if (n.fire("dragend", i), f)
            n.fire("moveend");
          else {
            this._prunePositions(+/* @__PURE__ */ new Date());
            var _ = this._lastPos.subtract(this._positions[0]), v = (this._lastTime - this._times[0]) / 1e3, x = h.easeLinearity, b = _.multiplyBy(x / v), S = b.distanceTo([0, 0]), C = Math.min(h.inertiaMaxSpeed, S), k = b.multiplyBy(C / S), D = C / (h.inertiaDeceleration * x), H = k.multiplyBy(-D / 2).round();
            !H.x && !H.y ? n.fire("moveend") : (H = n._limitOffset(H, n.options.maxBounds), Q(function() {
              n.panBy(H, {
                duration: D,
                easeLinearity: x,
                noMoveStart: !0,
                animate: !0
              });
            }));
          }
        }
      });
      $.addInitHook("addHandler", "dragging", Oa), $.mergeOptions({
        // @option keyboard: Boolean = true
        // Makes the map focusable and allows users to navigate the map with keyboard
        // arrows and `+`/`-` keys.
        keyboard: !0,
        // @option keyboardPanDelta: Number = 80
        // Amount of pixels to pan when pressing an arrow key.
        keyboardPanDelta: 80
      });
      var Na = Wt.extend({
        keyCodes: {
          left: [37],
          right: [39],
          down: [40],
          up: [38],
          zoomIn: [187, 107, 61, 171],
          zoomOut: [189, 109, 54, 173]
        },
        initialize: function(i) {
          this._map = i, this._setPanDelta(i.options.keyboardPanDelta), this._setZoomDelta(i.options.zoomDelta);
        },
        addHooks: function() {
          var i = this._map._container;
          i.tabIndex <= 0 && (i.tabIndex = "0"), j(i, {
            focus: this._onFocus,
            blur: this._onBlur,
            mousedown: this._onMouseDown
          }, this), this._map.on({
            focus: this._addHooks,
            blur: this._removeHooks
          }, this);
        },
        removeHooks: function() {
          this._removeHooks(), st(this._map._container, {
            focus: this._onFocus,
            blur: this._onBlur,
            mousedown: this._onMouseDown
          }, this), this._map.off({
            focus: this._addHooks,
            blur: this._removeHooks
          }, this);
        },
        _onMouseDown: function() {
          if (!this._focused) {
            var i = document.body, n = document.documentElement, h = i.scrollTop || n.scrollTop, f = i.scrollLeft || n.scrollLeft;
            this._map._container.focus(), window.scrollTo(f, h);
          }
        },
        _onFocus: function() {
          this._focused = !0, this._map.fire("focus");
        },
        _onBlur: function() {
          this._focused = !1, this._map.fire("blur");
        },
        _setPanDelta: function(i) {
          var n = this._panKeys = {}, h = this.keyCodes, f, _;
          for (f = 0, _ = h.left.length; f < _; f++)
            n[h.left[f]] = [-1 * i, 0];
          for (f = 0, _ = h.right.length; f < _; f++)
            n[h.right[f]] = [i, 0];
          for (f = 0, _ = h.down.length; f < _; f++)
            n[h.down[f]] = [0, i];
          for (f = 0, _ = h.up.length; f < _; f++)
            n[h.up[f]] = [0, -1 * i];
        },
        _setZoomDelta: function(i) {
          var n = this._zoomKeys = {}, h = this.keyCodes, f, _;
          for (f = 0, _ = h.zoomIn.length; f < _; f++)
            n[h.zoomIn[f]] = i;
          for (f = 0, _ = h.zoomOut.length; f < _; f++)
            n[h.zoomOut[f]] = -i;
        },
        _addHooks: function() {
          j(document, "keydown", this._onKeyDown, this);
        },
        _removeHooks: function() {
          st(document, "keydown", this._onKeyDown, this);
        },
        _onKeyDown: function(i) {
          if (!(i.altKey || i.ctrlKey || i.metaKey)) {
            var n = i.keyCode, h = this._map, f;
            if (n in this._panKeys) {
              if (!h._panAnim || !h._panAnim._inProgress)
                if (f = this._panKeys[n], i.shiftKey && (f = U(f).multiplyBy(3)), h.options.maxBounds && (f = h._limitOffset(U(f), h.options.maxBounds)), h.options.worldCopyJump) {
                  var _ = h.wrapLatLng(h.unproject(h.project(h.getCenter()).add(f)));
                  h.panTo(_);
                } else
                  h.panBy(f);
            } else if (n in this._zoomKeys)
              h.setZoom(h.getZoom() + (i.shiftKey ? 3 : 1) * this._zoomKeys[n]);
            else if (n === 27 && h._popup && h._popup.options.closeOnEscapeKey)
              h.closePopup();
            else
              return;
            _i(i);
          }
        }
      });
      $.addInitHook("addHandler", "keyboard", Na), $.mergeOptions({
        // @section Mouse wheel options
        // @option scrollWheelZoom: Boolean|String = true
        // Whether the map can be zoomed by using the mouse wheel. If passed `'center'`,
        // it will zoom to the center of the view regardless of where the mouse was.
        scrollWheelZoom: !0,
        // @option wheelDebounceTime: Number = 40
        // Limits the rate at which a wheel can fire (in milliseconds). By default
        // user can't zoom via wheel more often than once per 40 ms.
        wheelDebounceTime: 40,
        // @option wheelPxPerZoomLevel: Number = 60
        // How many scroll pixels (as reported by [L.DomEvent.getWheelDelta](#domevent-getwheeldelta))
        // mean a change of one full zoom level. Smaller values will make wheel-zooming
        // faster (and vice versa).
        wheelPxPerZoomLevel: 60
      });
      var Ra = Wt.extend({
        addHooks: function() {
          j(this._map._container, "wheel", this._onWheelScroll, this), this._delta = 0;
        },
        removeHooks: function() {
          st(this._map._container, "wheel", this._onWheelScroll, this);
        },
        _onWheelScroll: function(i) {
          var n = aa(i), h = this._map.options.wheelDebounceTime;
          this._delta += n, this._lastMousePos = this._map.mouseEventToContainerPoint(i), this._startTime || (this._startTime = +/* @__PURE__ */ new Date());
          var f = Math.max(h - (+/* @__PURE__ */ new Date() - this._startTime), 0);
          clearTimeout(this._timer), this._timer = setTimeout(l(this._performZoom, this), f), _i(i);
        },
        _performZoom: function() {
          var i = this._map, n = i.getZoom(), h = this._map.options.zoomSnap || 0;
          i._stop();
          var f = this._delta / (this._map.options.wheelPxPerZoomLevel * 4), _ = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(f)))) / Math.LN2, v = h ? Math.ceil(_ / h) * h : _, x = i._limitZoom(n + (this._delta > 0 ? v : -v)) - n;
          this._delta = 0, this._startTime = null, x && (i.options.scrollWheelZoom === "center" ? i.setZoom(n + x) : i.setZoomAround(this._lastMousePos, n + x));
        }
      });
      $.addInitHook("addHandler", "scrollWheelZoom", Ra);
      var _h = 600;
      $.mergeOptions({
        // @section Touch interaction options
        // @option tapHold: Boolean
        // Enables simulation of `contextmenu` event, default is `true` for mobile Safari.
        tapHold: B.touchNative && B.safari && B.mobile,
        // @option tapTolerance: Number = 15
        // The max number of pixels a user can shift his finger during touch
        // for it to be considered a valid tap.
        tapTolerance: 15
      });
      var ka = Wt.extend({
        addHooks: function() {
          j(this._map._container, "touchstart", this._onDown, this);
        },
        removeHooks: function() {
          st(this._map._container, "touchstart", this._onDown, this);
        },
        _onDown: function(i) {
          if (clearTimeout(this._holdTimeout), i.touches.length === 1) {
            var n = i.touches[0];
            this._startPos = this._newPos = new q(n.clientX, n.clientY), this._holdTimeout = setTimeout(l(function() {
              this._cancel(), this._isTapValid() && (j(document, "touchend", pt), j(document, "touchend touchcancel", this._cancelClickPrevent), this._simulateEvent("contextmenu", n));
            }, this), _h), j(document, "touchend touchcancel contextmenu", this._cancel, this), j(document, "touchmove", this._onMove, this);
          }
        },
        _cancelClickPrevent: function i() {
          st(document, "touchend", pt), st(document, "touchend touchcancel", i);
        },
        _cancel: function() {
          clearTimeout(this._holdTimeout), st(document, "touchend touchcancel contextmenu", this._cancel, this), st(document, "touchmove", this._onMove, this);
        },
        _onMove: function(i) {
          var n = i.touches[0];
          this._newPos = new q(n.clientX, n.clientY);
        },
        _isTapValid: function() {
          return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
        },
        _simulateEvent: function(i, n) {
          var h = new MouseEvent(i, {
            bubbles: !0,
            cancelable: !0,
            view: window,
            // detail: 1,
            screenX: n.screenX,
            screenY: n.screenY,
            clientX: n.clientX,
            clientY: n.clientY
            // button: 2,
            // buttons: 2
          });
          h._simulated = !0, n.target.dispatchEvent(h);
        }
      });
      $.addInitHook("addHandler", "tapHold", ka), $.mergeOptions({
        // @section Touch interaction options
        // @option touchZoom: Boolean|String = *
        // Whether the map can be zoomed by touch-dragging with two fingers. If
        // passed `'center'`, it will zoom to the center of the view regardless of
        // where the touch events (fingers) were. Enabled for touch-capable web
        // browsers.
        touchZoom: B.touch,
        // @option bounceAtZoomLimits: Boolean = true
        // Set it to false if you don't want the map to zoom beyond min/max zoom
        // and then bounce back when pinch-zooming.
        bounceAtZoomLimits: !0
      });
      var za = Wt.extend({
        addHooks: function() {
          W(this._map._container, "leaflet-touch-zoom"), j(this._map._container, "touchstart", this._onTouchStart, this);
        },
        removeHooks: function() {
          lt(this._map._container, "leaflet-touch-zoom"), st(this._map._container, "touchstart", this._onTouchStart, this);
        },
        _onTouchStart: function(i) {
          var n = this._map;
          if (!(!i.touches || i.touches.length !== 2 || n._animatingZoom || this._zooming)) {
            var h = n.mouseEventToContainerPoint(i.touches[0]), f = n.mouseEventToContainerPoint(i.touches[1]);
            this._centerPoint = n.getSize()._divideBy(2), this._startLatLng = n.containerPointToLatLng(this._centerPoint), n.options.touchZoom !== "center" && (this._pinchStartLatLng = n.containerPointToLatLng(h.add(f)._divideBy(2))), this._startDist = h.distanceTo(f), this._startZoom = n.getZoom(), this._moved = !1, this._zooming = !0, n._stop(), j(document, "touchmove", this._onTouchMove, this), j(document, "touchend touchcancel", this._onTouchEnd, this), pt(i);
          }
        },
        _onTouchMove: function(i) {
          if (!(!i.touches || i.touches.length !== 2 || !this._zooming)) {
            var n = this._map, h = n.mouseEventToContainerPoint(i.touches[0]), f = n.mouseEventToContainerPoint(i.touches[1]), _ = h.distanceTo(f) / this._startDist;
            if (this._zoom = n.getScaleZoom(_, this._startZoom), !n.options.bounceAtZoomLimits && (this._zoom < n.getMinZoom() && _ < 1 || this._zoom > n.getMaxZoom() && _ > 1) && (this._zoom = n._limitZoom(this._zoom)), n.options.touchZoom === "center") {
              if (this._center = this._startLatLng, _ === 1)
                return;
            } else {
              var v = h._add(f)._divideBy(2)._subtract(this._centerPoint);
              if (_ === 1 && v.x === 0 && v.y === 0)
                return;
              this._center = n.unproject(n.project(this._pinchStartLatLng, this._zoom).subtract(v), this._zoom);
            }
            this._moved || (n._moveStart(!0, !1), this._moved = !0), _t(this._animRequest);
            var x = l(n._move, n, this._center, this._zoom, { pinch: !0, round: !1 }, void 0);
            this._animRequest = Q(x, this, !0), pt(i);
          }
        },
        _onTouchEnd: function() {
          if (!this._moved || !this._zooming) {
            this._zooming = !1;
            return;
          }
          this._zooming = !1, _t(this._animRequest), st(document, "touchmove", this._onTouchMove, this), st(document, "touchend touchcancel", this._onTouchEnd, this), this._map.options.zoomAnimation ? this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), !0, this._map.options.zoomSnap) : this._map._resetView(this._center, this._map._limitZoom(this._zoom));
        }
      });
      $.addInitHook("addHandler", "touchZoom", za), $.BoxZoom = Ia, $.DoubleClickZoom = Ga, $.Drag = Oa, $.Keyboard = Na, $.ScrollWheelZoom = Ra, $.TapHold = ka, $.TouchZoom = za, e.Bounds = nt, e.Browser = B, e.CRS = Yt, e.Canvas = Aa, e.Circle = Xs, e.CircleMarker = Fe, e.Class = Ut, e.Control = kt, e.DivIcon = ba, e.DivOverlay = Ht, e.DomEvent = Go, e.DomUtil = Co, e.Draggable = ni, e.Evented = Ui, e.FeatureGroup = Kt, e.GeoJSON = Jt, e.GridLayer = te, e.Handler = Wt, e.Icon = bi, e.ImageOverlay = We, e.LatLng = et, e.LatLngBounds = bt, e.Layer = zt, e.LayerGroup = Pi, e.LineUtil = Wo, e.Map = $, e.Marker = De, e.Mixin = Do, e.Path = ai, e.Point = q, e.PolyUtil = Fo, e.Polygon = Ei, e.Polyline = $t, e.Popup = He, e.PosAnimation = ra, e.Projection = Ho, e.Rectangle = Ca, e.Renderer = Qt, e.SVG = ee, e.SVGOverlay = Pa, e.TileLayer = Ai, e.Tooltip = Xe, e.Transformation = ys, e.Util = ei, e.VideoOverlay = xa, e.bind = l, e.bounds = Pt, e.canvas = La, e.circle = th, e.circleMarker = Qo, e.control = $i, e.divIcon = lh, e.extend = r, e.featureGroup = Ko, e.geoJSON = wa, e.geoJson = sh, e.gridLayer = uh, e.icon = $o, e.imageOverlay = nh, e.latLng = K, e.latLngBounds = ct, e.layerGroup = Yo, e.map = Oo, e.marker = Jo, e.point = U, e.polygon = eh, e.polyline = ih, e.popup = oh, e.rectangle = dh, e.setOptions = w, e.stamp = c, e.svg = Ta, e.svgOverlay = rh, e.tileLayer = Ea, e.tooltip = hh, e.transformation = qi, e.version = a, e.videoOverlay = ah;
      var mh = window.L;
      e.noConflict = function() {
        return window.L = mh, this;
      }, window.L = e;
    }));
  })(he, he.exports)), he.exports;
}
var V = Mr();
const qa = 6378245, Mt = 3.141592653589793, ja = 0.006693421622965943, Wa = Mt * 3e3 / 180;
function Ha(s, t) {
  var e = rn(s, t), a = Oh(e.lng, e.lat);
  return a;
}
function rn(s, t) {
  var e = Nh(s - 105, t - 35), a = Rh(s - 105, t - 35), r = t / 180 * Mt, o = Math.sin(r);
  o = 1 - ja * o * o;
  var l = Math.sqrt(o);
  e = e * 180 / (qa * (1 - ja) / (o * l) * Mt), a = a * 180 / (qa / l * Math.cos(r) * Mt);
  var u = t + e, c = s + a, d = {
    lng: c,
    lat: u
  };
  return d;
}
function Oh(s, t) {
  var e = Math.sqrt(s * s + t * t) + 2e-5 * Math.sin(t * Wa), a = Math.atan2(t, s) + 3e-6 * Math.cos(s * Wa), r = e * Math.cos(a) + 65e-4, o = e * Math.sin(a) + 6e-3, l = {
    lng: r,
    lat: o
  };
  return l;
}
function Nh(s, t) {
  var e = -100 + 2 * s + 3 * t + 0.2 * t * t + 0.1 * s * t + 0.2 * Math.sqrt(Math.abs(s));
  return e += (20 * Math.sin(6 * s * Mt) + 20 * Math.sin(2 * s * Mt)) * 2 / 3, e += (20 * Math.sin(t * Mt) + 40 * Math.sin(t / 3 * Mt)) * 2 / 3, e += (160 * Math.sin(t / 12 * Mt) + 320 * Math.sin(t * Mt / 30)) * 2 / 3, e;
}
function Rh(s, t) {
  var e = 300 + s + 2 * t + 0.1 * s * s + 0.1 * s * t + 0.1 * Math.sqrt(Math.abs(s));
  return e += (20 * Math.sin(6 * s * Mt) + 20 * Math.sin(2 * s * Mt)) * 2 / 3, e += (20 * Math.sin(s * Mt) + 40 * Math.sin(s / 3 * Mt)) * 2 / 3, e += (150 * Math.sin(s / 12 * Mt) + 300 * Math.sin(s / 30 * Mt)) * 2 / 3, e;
}
function Xa(s, t, e) {
  let [a, r] = mt(s, t), [o, l] = mt(s, e), u = Math.atan2(l - r, o - a);
  return u = u * 180 / Math.PI, u = 90 + u < 0 ? 450 + u : 90 + u, u;
}
function gn(s) {
  const t = ms(s);
  if (t == 0) {
    let e = s.getBounds();
    return {
      lngLeft: e.getSouthWest().lng,
      latTop: e.getNorthEast().lat,
      lngRight: e.getNorthEast().lng,
      latBottom: e.getSouthWest().lat
    };
  } else if (t == 1) {
    let { southwest: e, northeast: a } = s.getBounds();
    return {
      lngLeft: e.lng,
      latTop: a.lat,
      lngRight: a.lng,
      latBottom: e.lat
    };
  }
  throw new Error("百度地图暂时不支持！");
}
function rs(s, t, e) {
  let [a, r] = s, [o, l] = t, u = 0;
  return e && AMap && AMap.GeometryUtil ? u = AMap.GeometryUtil.distance([r, a], [l, o]) : u = V.latLng(s).distanceTo(t), u;
}
function Ft(s, t) {
  if (!t) return [0, 0];
  let e;
  return s instanceof V.Map ? e = s.containerPointToLatLng(t) : e = s.containerToLngLat(new AMap.Pixel(t[0], t[1])), [e.lat, e.lng];
}
function wr(s, t = 100, e) {
  if (e.length === 0)
    return 0;
  let a = s instanceof V.Map ? 0 : 1, r = 1e-5, o = e.map((d) => d[0]).reduce((d, g) => d + g) / e.length, l = [o, 100], u = [o, 100 + r], c = rs(l, u, a);
  return t / c * r;
}
function mt(s, t) {
  if (!t) return [-1e3, -1e3];
  let [e = 90, a = 180] = t, r;
  return isNaN(e) || isNaN(a) ? [-1e3, -1e3] : (s.latLngToContainerPoint ? r = s.latLngToContainerPoint([e, a]) : r = s.lngLatToContainer([a, e]), [r.x, r.y]);
}
function pn(s, t) {
  return t?.map((e) => mt(s, e)) || [];
}
function on(s, t) {
  let { sizeFix: e, latlng: a, size: r = [0, 0] } = t;
  if (!e || !a)
    return Array.isArray(r) || (r = [r, r]), r;
  let o = Array.isArray(e) ? e : [e, e], [l, u] = a, c = wr(s, o[1], [a]), [d, g] = mt(s, [l, u]), [m, p] = mt(s, [l, u + c]), y = Math.abs(m - d), M = y * o[1] / o[0];
  return [y, M];
}
function yi(s) {
  let t = s.getSize(), { x: e, y: a, width: r, height: o } = t;
  return {
    w: e || r,
    h: a || o
  };
}
function ki(s, t) {
  let e, a, r, o;
  if (o = s.type, t == 0) {
    const { latlng: l, originalEvent: u, containerPoint: c } = s = s, { lat: d, lng: g } = l;
    e = { lat: d, lng: g };
    const { x: m, y: p } = c;
    a = { x: m, y: p }, r = u;
  } else if (t == 1) {
    const { pixel: l, originEvent: u, lnglat: c } = s = s, { lat: d, lng: g } = c;
    e = { lat: d, lng: g };
    const { x: m, y: p } = l;
    a = { x: m, y: p }, r = u;
  }
  return {
    type: o,
    latlng: e,
    containerPoint: a,
    orginDOMEvent: r,
    orginMapEvent: s
  };
}
function Va(s, t, e) {
  let a = s;
  const r = a.setStatus ? a : void 0, o = a.dragging ? a : void 0;
  t === "dragEnable" && (o ? e ? o.dragging.enable() : o.dragging.disable() : r && r.setStatus({ dragEnable: e }));
}
function ms(s) {
  return s instanceof V.Map ? 0 : s instanceof AMap.Map ? 1 : 2;
}
function kh(s, t, e, a) {
  const r = ms(s);
  if (a) {
    const o = mt(s, t);
    t = Ft(s, [o[0] + a[0], o[1] + a[1]]);
  }
  if (r == 0)
    s = s, s.setView(t, e);
  else if (r == 1)
    s = s, s.setCenter(t.reverse()), s.setZoom(e);
  else
    throw new Error("百度地图暂时不支持！");
}
function zh(s, t, e) {
  const a = ms(s);
  let r, o;
  if (!(t.length == 0 || !t)) {
    if (Bh(t)) {
      let l = Math.max(...t.map((g) => g[0])), u = Math.min(...t.map((g) => g[0])), c = Math.max(...t.map((g) => g[1])), d = Math.min(...t.map((g) => g[1]));
      r = [u, d], o = [l, c];
    } else
      r = t, o = e;
    if (a == 0)
      s = s, s.fitBounds([r, o]);
    else if (a == 1) {
      s = s;
      const l = new AMap.Bounds(r.reverse(), o.reverse()), [u, c] = s.getFitZoomAndCenterByBounds(l);
      s.setZoomAndCenter(u, c);
    }
  }
}
function Bh(s) {
  return s && Array.isArray(s[0]);
}
function ti(s, t, e) {
  if (Array.isArray(s) && s.length > 0) {
    let a;
    a = s.findIndex((r) => r == t), a >= 0 && s.splice(a, 1);
  }
  return s || [];
}
class gs {
  constructor(t, e) {
    this._allArcs = [], this._allLines = [], this._allBLins = [], this._allRects = [], this._allTexts = [], this._allImgs = [], this._allGifs = [], this.map = t, this.canvas = e, this.ctx = e.getContext("2d");
  }
  get zoom() {
    return this.map.getZoom();
  }
  /** 清空并重新设置画布 */
  reSetCanvas() {
    let { canvas: t, map: e, ctx: a } = this;
    const { w: r, h: o } = yi(e);
    t.style.width = r + "px", t.style.height = o + "px", t.width = r, t.height = o;
  }
  /**绘制所有需要绘制的类(按drawIndex顺序) */
  drawMapAll() {
    this.reSetCanvas(), this.drawByIndex();
  }
  /**绘制通过index */
  async drawByIndex() {
    let t = [], e = this, { ctx: a, zoom: r } = e, o = e._allRects.map((l) => ({ ...l, mold: "R" }));
    o = o.concat(e._allLines.map((l) => ({ ...l, mold: "L" }))), o = o.concat(e._allBLins.map((l) => ({ ...l, mold: "B" }))), o = o.concat(e._allArcs.map((l) => ({ ...l, mold: "A" }))), o = o.concat(e._allTexts.map((l) => ({ ...l, mold: "T" }))), o = o.concat(e._allImgs.map((l) => ({ ...l, mold: "I" }))), o = o.concat(e._allGifs.map((l) => ({ ...l, mold: "G" }))), o.sort((l, u) => (l.index || 0) - (u.index || 0)), o.forEach((l, u) => {
      let { minZoom: c = 0, maxZoom: d = 50, overlap: g } = l;
      if (r >= c && r <= d)
        switch (e.transformXY(l), l.mold) {
          case "A":
            e.transformArcSize(l), ht.drawArc(l, a);
            break;
          case "L":
            ht.drawLine(l, a);
            break;
          case "B":
            ht.drawBezierLine(l, a);
            break;
          case "R":
            ht.drawPolygon(l, a);
            break;
          case "T":
            Ch.drawText(l, t, a);
            break;
          case "I":
            e.transformImageSize(l), Di.drawImg(l, a);
            break;
          case "G":
            e.transformImageSize(l), e.gif = e.gif || new bh(), e.gif.loadGIF(l, a);
            break;
        }
    });
  }
  /**设置原点 */
  setAllArcs(t) {
    return this._allArcs = t, this;
  }
  /**设置线数据 */
  setAllLines(t) {
    return this._allLines = t, this;
  }
  /**设置贝塞尔曲线数据 */
  setAllBezierLines(t) {
    return this._allBLins = t, this;
  }
  /**设置多边形数据 */
  setAllRects(t) {
    return this._allRects = t, this;
  }
  /**设置文本数据 */
  setAllTexts(t) {
    return this._allTexts = t, this;
  }
  /**设置图片数据 */
  setAllImgs(t) {
    return this._allImgs = t, this;
  }
  /**设置图片数据 */
  setAllGifs(t) {
    return this._allGifs = t, this;
  }
  /**增加原点 */
  addArc(t) {
    return !t.latlngs && !t.latlng ? this : (this._allArcs.push(t), this);
  }
  /**增加线 */
  addLine(t) {
    return t.latlngs ? (this._allLines.push(t), this) : this;
  }
  /**增加贝塞尔曲线 */
  addBezierLine(t) {
    return t.latlngs ? (this._allBLins.push(t), this) : this;
  }
  /**增加多边形 */
  addRect(t) {
    return t.latlngs ? (this._allRects.push(t), this) : this;
  }
  /**增加文本 */
  addText(t) {
    return !t.latlngs && !t.latlng ? this : (this._allTexts.push(t), this);
  }
  /**增加图片 */
  addImg(t) {
    return !t.latlngs && !t.latlng ? this : (this._allImgs.push(t), this);
  }
  /**删除指定圆点 */
  delArc(t) {
    return ti(this._allArcs, t), this;
  }
  /**删除指定线 */
  delLine(t) {
    return ti(this._allLines, t), this;
  }
  /**删除指定贝塞尔曲线 */
  delBezierLine(t) {
    return ti(this._allBLins, t), this;
  }
  /**删除指定多边形 */
  delRect(t) {
    return ti(this._allRects, t), this;
  }
  /**删除指定文本 */
  delText(t) {
    return ti(this._allTexts, t), this;
  }
  /**删除指定Img */
  delImg(t) {
    return ti(this._allImgs, t), this;
  }
  /**清空
   * @param type 不填清空所有内容数据
   */
  delAll(t = "all") {
    const e = this;
    switch (t) {
      case "arc":
        e._allArcs = [];
        break;
      case "line":
        e._allLines = [];
        break;
      case "bezier":
        e._allBLins = [];
        break;
      case "rect":
        e._allRects = [];
        break;
      case "img":
        e._allImgs = [];
        break;
      case "gif":
        e._allGifs = [];
        break;
      case "text":
        e._allTexts = [];
        break;
      case "all":
        e._allArcs = [], e._allLines = [], e._allBLins = [], e._allRects = [], e._allImgs = [], e._allGifs = [], e._allTexts = [];
    }
    return e;
  }
  /**将对象上经纬度数据(latlngs,latlng)变换为像素XY的数据(points,point)
   * latlngs为undefined,points也为undefined
   * latlng为undefined,point为[0,0]
   */
  transformXY(t) {
    t.points = pn(this.map, t.latlngs), t.point = mt(this.map, t.latlng);
  }
  /**设置固定大小的图片 */
  transformImageSize(t) {
    let [e, a] = on(this.map, t);
    t.size = [e, a];
  }
  transformArcSize(t) {
    let [e, a] = on(this.map, t);
    t.size = e;
  }
}
function xr(s, t, e = 0, a = s.length - 1, r = Dh) {
  for (; a > e; ) {
    if (a - e > 600) {
      const c = a - e + 1, d = t - e + 1, g = Math.log(c), m = 0.5 * Math.exp(2 * g / 3), p = 0.5 * Math.sqrt(g * m * (c - m) / c) * (d - c / 2 < 0 ? -1 : 1), y = Math.max(e, Math.floor(t - d * m / c + p)), M = Math.min(a, Math.floor(t + (c - d) * m / c + p));
      xr(s, t, y, M, r);
    }
    const o = s[t];
    let l = e, u = a;
    for (ne(s, e, t), r(s[a], o) > 0 && ne(s, e, a); l < u; ) {
      for (ne(s, l, u), l++, u--; r(s[l], o) < 0; ) l++;
      for (; r(s[u], o) > 0; ) u--;
    }
    r(s[e], o) === 0 ? ne(s, e, u) : (u++, ne(s, u, a)), u <= t && (e = u + 1), t <= u && (a = u - 1);
  }
}
function ne(s, t, e) {
  const a = s[t];
  s[t] = s[e], s[e] = a;
}
function Dh(s, t) {
  return s < t ? -1 : s > t ? 1 : 0;
}
class Pr {
  constructor(t = 9) {
    this._maxEntries = Math.max(4, t), this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4)), this.clear();
  }
  all() {
    return this._all(this.data, []);
  }
  search(t) {
    let e = this.data;
    const a = [];
    if (!$e(t, e)) return a;
    const r = this.toBBox, o = [];
    for (; e; ) {
      for (let l = 0; l < e.children.length; l++) {
        const u = e.children[l], c = e.leaf ? r(u) : u;
        $e(t, c) && (e.leaf ? a.push(u) : Qs(t, c) ? this._all(u, a) : o.push(u));
      }
      e = o.pop();
    }
    return a;
  }
  collides(t) {
    let e = this.data;
    if (!$e(t, e)) return !1;
    const a = [];
    for (; e; ) {
      for (let r = 0; r < e.children.length; r++) {
        const o = e.children[r], l = e.leaf ? this.toBBox(o) : o;
        if ($e(t, l)) {
          if (e.leaf || Qs(t, l)) return !0;
          a.push(o);
        }
      }
      e = a.pop();
    }
    return !1;
  }
  load(t) {
    if (!(t && t.length)) return this;
    if (t.length < this._minEntries) {
      for (let a = 0; a < t.length; a++)
        this.insert(t[a]);
      return this;
    }
    let e = this._build(t.slice(), 0, t.length - 1, 0);
    if (!this.data.children.length)
      this.data = e;
    else if (this.data.height === e.height)
      this._splitRoot(this.data, e);
    else {
      if (this.data.height < e.height) {
        const a = this.data;
        this.data = e, e = a;
      }
      this._insert(e, this.data.height - e.height - 1, !0);
    }
    return this;
  }
  insert(t) {
    return t && this._insert(t, this.data.height - 1), this;
  }
  clear() {
    return this.data = Ci([]), this;
  }
  remove(t, e) {
    if (!t) return this;
    let a = this.data;
    const r = this.toBBox(t), o = [], l = [];
    let u, c, d;
    for (; a || o.length; ) {
      if (a || (a = o.pop(), c = o[o.length - 1], u = l.pop(), d = !0), a.leaf) {
        const g = Fh(t, a.children, e);
        if (g !== -1)
          return a.children.splice(g, 1), o.push(a), this._condense(o), this;
      }
      !d && !a.leaf && Qs(a, r) ? (o.push(a), l.push(u), u = 0, c = a, a = a.children[0]) : c ? (u++, a = c.children[u], d = !1) : a = null;
    }
    return this;
  }
  toBBox(t) {
    return t;
  }
  compareMinX(t, e) {
    return t.minX - e.minX;
  }
  compareMinY(t, e) {
    return t.minY - e.minY;
  }
  toJSON() {
    return this.data;
  }
  fromJSON(t) {
    return this.data = t, this;
  }
  _all(t, e) {
    const a = [];
    for (; t; )
      t.leaf ? e.push(...t.children) : a.push(...t.children), t = a.pop();
    return e;
  }
  _build(t, e, a, r) {
    const o = a - e + 1;
    let l = this._maxEntries, u;
    if (o <= l)
      return u = Ci(t.slice(e, a + 1)), Ti(u, this.toBBox), u;
    r || (r = Math.ceil(Math.log(o) / Math.log(l)), l = Math.ceil(o / Math.pow(l, r - 1))), u = Ci([]), u.leaf = !1, u.height = r;
    const c = Math.ceil(o / l), d = c * Math.ceil(Math.sqrt(l));
    Ya(t, e, a, d, this.compareMinX);
    for (let g = e; g <= a; g += d) {
      const m = Math.min(g + d - 1, a);
      Ya(t, g, m, c, this.compareMinY);
      for (let p = g; p <= m; p += c) {
        const y = Math.min(p + c - 1, m);
        u.children.push(this._build(t, p, y, r - 1));
      }
    }
    return Ti(u, this.toBBox), u;
  }
  _chooseSubtree(t, e, a, r) {
    for (; r.push(e), !(e.leaf || r.length - 1 === a); ) {
      let o = 1 / 0, l = 1 / 0, u;
      for (let c = 0; c < e.children.length; c++) {
        const d = e.children[c], g = Js(d), m = qh(t, d) - g;
        m < l ? (l = m, o = g < o ? g : o, u = d) : m === l && g < o && (o = g, u = d);
      }
      e = u || e.children[0];
    }
    return e;
  }
  _insert(t, e, a) {
    const r = a ? t : this.toBBox(t), o = [], l = this._chooseSubtree(r, this.data, e, o);
    for (l.children.push(t), ue(l, r); e >= 0 && o[e].children.length > this._maxEntries; )
      this._split(o, e), e--;
    this._adjustParentBBoxes(r, o, e);
  }
  // split overflowed node into two
  _split(t, e) {
    const a = t[e], r = a.children.length, o = this._minEntries;
    this._chooseSplitAxis(a, o, r);
    const l = this._chooseSplitIndex(a, o, r), u = Ci(a.children.splice(l, a.children.length - l));
    u.height = a.height, u.leaf = a.leaf, Ti(a, this.toBBox), Ti(u, this.toBBox), e ? t[e - 1].children.push(u) : this._splitRoot(a, u);
  }
  _splitRoot(t, e) {
    this.data = Ci([t, e]), this.data.height = t.height + 1, this.data.leaf = !1, Ti(this.data, this.toBBox);
  }
  _chooseSplitIndex(t, e, a) {
    let r, o = 1 / 0, l = 1 / 0;
    for (let u = e; u <= a - e; u++) {
      const c = le(t, 0, u, this.toBBox), d = le(t, u, a, this.toBBox), g = jh(c, d), m = Js(c) + Js(d);
      g < o ? (o = g, r = u, l = m < l ? m : l) : g === o && m < l && (l = m, r = u);
    }
    return r || a - e;
  }
  // sorts node children by the best axis for split
  _chooseSplitAxis(t, e, a) {
    const r = t.leaf ? this.compareMinX : Zh, o = t.leaf ? this.compareMinY : Uh, l = this._allDistMargin(t, e, a, r), u = this._allDistMargin(t, e, a, o);
    l < u && t.children.sort(r);
  }
  // total margin of all possible split distributions where each node is at least m full
  _allDistMargin(t, e, a, r) {
    t.children.sort(r);
    const o = this.toBBox, l = le(t, 0, e, o), u = le(t, a - e, a, o);
    let c = Ke(l) + Ke(u);
    for (let d = e; d < a - e; d++) {
      const g = t.children[d];
      ue(l, t.leaf ? o(g) : g), c += Ke(l);
    }
    for (let d = a - e - 1; d >= e; d--) {
      const g = t.children[d];
      ue(u, t.leaf ? o(g) : g), c += Ke(u);
    }
    return c;
  }
  _adjustParentBBoxes(t, e, a) {
    for (let r = a; r >= 0; r--)
      ue(e[r], t);
  }
  _condense(t) {
    for (let e = t.length - 1, a; e >= 0; e--)
      t[e].children.length === 0 ? e > 0 ? (a = t[e - 1].children, a.splice(a.indexOf(t[e]), 1)) : this.clear() : Ti(t[e], this.toBBox);
  }
}
function Fh(s, t, e) {
  if (!e) return t.indexOf(s);
  for (let a = 0; a < t.length; a++)
    if (e(s, t[a])) return a;
  return -1;
}
function Ti(s, t) {
  le(s, 0, s.children.length, t, s);
}
function le(s, t, e, a, r) {
  r || (r = Ci(null)), r.minX = 1 / 0, r.minY = 1 / 0, r.maxX = -1 / 0, r.maxY = -1 / 0;
  for (let o = t; o < e; o++) {
    const l = s.children[o];
    ue(r, s.leaf ? a(l) : l);
  }
  return r;
}
function ue(s, t) {
  return s.minX = Math.min(s.minX, t.minX), s.minY = Math.min(s.minY, t.minY), s.maxX = Math.max(s.maxX, t.maxX), s.maxY = Math.max(s.maxY, t.maxY), s;
}
function Zh(s, t) {
  return s.minX - t.minX;
}
function Uh(s, t) {
  return s.minY - t.minY;
}
function Js(s) {
  return (s.maxX - s.minX) * (s.maxY - s.minY);
}
function Ke(s) {
  return s.maxX - s.minX + (s.maxY - s.minY);
}
function qh(s, t) {
  return (Math.max(t.maxX, s.maxX) - Math.min(t.minX, s.minX)) * (Math.max(t.maxY, s.maxY) - Math.min(t.minY, s.minY));
}
function jh(s, t) {
  const e = Math.max(s.minX, t.minX), a = Math.max(s.minY, t.minY), r = Math.min(s.maxX, t.maxX), o = Math.min(s.maxY, t.maxY);
  return Math.max(0, r - e) * Math.max(0, o - a);
}
function Qs(s, t) {
  return s.minX <= t.minX && s.minY <= t.minY && t.maxX <= s.maxX && t.maxY <= s.maxY;
}
function $e(s, t) {
  return t.minX <= s.maxX && t.minY <= s.maxY && t.maxX >= s.minX && t.maxY >= s.minY;
}
function Ci(s) {
  return {
    children: s,
    height: 1,
    leaf: !0,
    minX: 1 / 0,
    minY: 1 / 0,
    maxX: -1 / 0,
    maxY: -1 / 0
  };
}
function Ya(s, t, e, a, r) {
  const o = [t, e];
  for (; o.length; ) {
    if (e = o.pop(), t = o.pop(), e - t <= a) continue;
    const l = t + Math.ceil((e - t) / a / 2) * a;
    xr(s, l, t, e, r), o.push(t, l, l, e);
  }
}
const Dt = class Dt {
  /**地图事件控制类 */
  constructor(t) {
    this.rbush = new Pr(), this._listenCbs = /* @__PURE__ */ Object.create(null), this._allMapEvents = /* @__PURE__ */ new Map(), this._allRbush = [], this.perEvents = [], this.cbMapEvent = (e) => {
      let { cb: a, cbs: r } = e.event;
      if (a) {
        a(e);
        return;
      }
      if (r) {
        r[e.type]?.(e);
        return;
      }
      (this._listenCbs[e.type] || []).map((l) => l(e));
    }, this.resetRbush = () => {
      this.rbush && this.rbush.clear(), this._eventSwitch(!1), this._allRbush = [], this._allMapEvents.forEach((e) => {
        e.forEach((a) => {
          this.transformRbush(a);
        });
      }), this.rbush.load(this._allRbush), this._eventSwitch(!0);
    }, this.triggerEvent = (e) => {
      let a = [];
      this._allMapEvents.forEach((c) => {
        a = a.concat(c);
      });
      let r = document.querySelector("#map").style;
      if (r.cursor = Dt.ifInitCursor ? "default" : r.cursor, a.length === 0) return;
      let { curEvents: o, enterEvents: l, leaveEvents: u } = this.getEventsByRange(e);
      l.forEach((c) => this.doCbByEventType(c, "mouseenter")), u.forEach((c) => this.doCbByEventType(c, "mouseleave")), this.perEvents = o, o.length != 0 && (Dt.ifInitCursor = !1, r.cursor = "pointer", o.forEach((c) => this.doCbByEventType(c, e.type)));
    }, this.map = t, this._eventSwitch(!0), this.map.on("moveend", this.resetRbush), this.map.on("zoomend", this.resetRbush);
  }
  /**地图销毁必须调用此方法，否则事件指针会异常 */
  static destory() {
    Dt.ifInit = !0;
  }
  static initCursor() {
    Dt.ifInitCursor = !0;
  }
  /** 事件开关 
   * @param flag true开启地图事件监听 false关闭地图事件监听
  */
  _eventSwitch(t) {
    Dt.ifInit && (Dt.ifInit = !1, this.map.on("mousemove", () => {
      Dt.ifInitCursor = !0;
    })), ["click", "dblclick", "mousemove", "mousedown", "mouseup", "rightclick"].map((a) => {
      this.map[t ? "on" : "off"](a, this.triggerEvent);
    });
  }
  /**统一监听该类的指定事件 */
  on(t, e) {
    (this._listenCbs[t] = this._listenCbs[t] || []).push(e);
  }
  /**统一关闭指定事件的监听 */
  off(t, e) {
    let a = this._listenCbs[t] = this._listenCbs[t] || [];
    e ? ti(a, e) : this._listenCbs[t] = [];
  }
  /**清空之前设置的统一监听事件 */
  clear() {
    this._listenCbs = /* @__PURE__ */ Object.create(null);
  }
  /** 
   * @param evs 事件集合
   * @param key 事件key
   * 设置key 事件 会覆盖原来的事件 
   * 不覆盖使用 pushEventByKey
   *  */
  setEventsByKey(t, e) {
    this._allMapEvents.set(e, t.filter((a) => !a.ifHide)), this._allRbush = [], this.rbush.clear(), this._allMapEvents.forEach((a) => {
      a.forEach((r) => this.handleTransform(r));
    }), this.rbush.load(this._allRbush);
  }
  /**
   * 清除所有事件
   */
  clearAllEvents() {
    this._allMapEvents = /* @__PURE__ */ new Map(), this._allRbush = [], this.rbush.clear();
  }
  /**
   * 清除指定类型事件
   * @param key
   */
  clearEventsByKey(t) {
    this.setEventsByKey([], t);
  }
  /**
   * 添加一个事件
   * 尽量使用setEventsByKey 
   * 或者pushEventByKey数组 而不是for 一个个push
   * 不然每次for循环push都会重新构造rbush
   *  */
  pushEventByKey(t, e) {
    this._allMapEvents.has(t) || this._allMapEvents.set(t, []);
    const a = this._allMapEvents.get(t);
    Array.isArray(e) ? a.push(...e) : a.push(e), this.setEventsByKey(a, t);
  }
  /** 添加事件 */
  handleTransform(t) {
    this.transformEvent(t), this.transformRbush(t);
  }
  /** 转换添加事件 */
  transformEvent(t) {
    t.ifHide !== !0 && (t.latlng, t.latlngs, t.type, t.info, t.cb);
  }
  /** 转为Rbush数据格式 */
  transformRbush(t) {
    if (t.ifHide === !0) return;
    let { range: e = [5, 5], latlng: a, latlngs: r = [], left: o = 0, top: l = 0 } = t;
    a && a.length === 2 && (r = [...r, a]), r.forEach((u) => {
      const [c, d] = u;
      let [g, m] = mt(this.map, u), p = {
        minX: g - e[0] + o,
        minY: m - e[1] + l,
        maxX: g + e[0] + o,
        maxY: m + e[1] + l,
        data: t
      };
      this._allRbush.push(p);
    });
  }
  /**获取指针触发范围内的事件 */
  getEventsByRange(t) {
    let e, a, r, o, l, u, c = this.map.getZoom();
    if (t.latlng) {
      let M = t;
      ({ lng: e, lat: a } = M.latlng), { x: r, y: o } = M.containerPoint, { pageX: l, pageY: u } = M.originalEvent;
    } else {
      let M = t;
      ({ lng: e, lat: a } = M.lnglat), { x: r, y: o } = M.pixel, { pageX: l, pageY: u } = M.originEvent;
    }
    let d = { latlng: [a, e], page: [l, u], point: [r, o] }, g = [], m = [], p = this.perEvents;
    return t.type == "click" && console.time("start"), this.rbush.search({ minX: r, minY: o, maxX: r, maxY: o }).forEach((M) => {
      let w = M.data, { latlng: P, latlngs: E = [], range: A = [5, 5], left: T = 0, top: G = 0, minZoom: R = 1, maxZoom: z = 50 } = M.data;
      if (R > c || z < c) return;
      P && P.length === 2 && (E = [...E, P]);
      let [Z, X] = mt(this.map, P), F = this.genEventResponse(P, [Z, X], w, d);
      g.push(F);
      let Y = p.find(
        (Q) => Q.position.latlng[0] === F.position.latlng[0] && Q.position.latlng[1] === F.position.latlng[1]
      );
      Y ? ti(p, Y) : m.push(F);
    }), t.type == "click" && console.timeEnd("start"), { curEvents: g, enterEvents: m, leaveEvents: p };
  }
  /**通过事件类型执行回调函数*/
  doCbByEventType(t, e) {
    let a = t.event.type;
    Array.isArray(a) || (a = [a]), a.includes(e) && (t.type = e, this.cbMapEvent(t));
  }
  /**生成地图事件响应对象 
   * @param latlng 该事件对象的地图坐标
   * @param point 该事件对象的地图像素坐标
   * @param event 地图事件
   * @param cursor 鼠标位置信息
  */
  genEventResponse(t, e, a, r) {
    let o = e[0] + r.page[0] - r.point[0], l = e[1] + r.page[1] - r.point[1];
    return { position: { latlng: t, page: [o, l], point: e }, cursor: r, event: a, info: a.info ?? {}, type: "unset" };
  }
};
Dt.ifInitCursor = !0, Dt.ifInit = !0;
let Me = Dt;
class Vt {
  constructor(t, e) {
    if (this.canvas = document.createElement("canvas"), this.ctx = this.canvas.getContext("2d"), this.width = 0, this.height = 0, this.options = {
      pane: "canvas"
    }, this.flagAnimation = 0, this._redraw = () => {
      console.log("##########--------MapCanvasLayer=>_redraw--------##########"), this.map && (this.resetCanvas(), this.renderFixedData(), this.renderAnimation());
    }, this.map = t, Object.assign(this.options, e), t instanceof V.Map) {
      this.type = 0;
      let a = this.layer = new V.Layer(this.options);
      this.layer.onAdd = () => (this.onAdd(), a);
    } else t instanceof AMap.Map && (this.type = 1, e = Object.assign({
      zooms: [3, 18],
      alwaysRender: !1,
      //缩放过程中是否重绘，复杂绘制建议设为false
      zIndex: 200
    }, e), this.layer = new AMap.CustomLayer(this.canvas, e));
    this.initCanvas(), this.onAdd();
  }
  /**移除图层 */
  onRemove() {
    const { flagAnimation: t } = this;
    return this._eventSwitch(!1), t && cancelAnimationFrame(t), this._onAmapRemove(), this._onLeafletRemove(), this;
  }
  /** 清空并重新设置画布 */
  resetCanvas() {
    const { canvas: t, map: e } = this;
    if (e instanceof V.Map) {
      var a = e.containerPointToLayerPoint([0, 0]);
      V.DomUtil.setPosition(t, a);
    }
    const { w: r, h: o } = yi(e);
    t.style.width = r + "px", t.style.height = o + "px", this.width = t.width = r, this.height = t.height = o;
  }
  /**添加或关闭地图特定的监听事件(_eventSwitch事件后自动调用) */
  addMapEvents(t, e) {
  }
  /**绘制静态数据推荐使用此方法(固定的图) */
  renderFixedData() {
  }
  /** 推荐使用此方法绘制动态图(跟随鼠标拖动，移动时需要立刻绘制时)
   ** 动画图层绘制前的画布清空、计算等均在此方法中自行计算 
   ** 与renderFixedData本质是一样的
   */
  renderAnimation() {
  }
  /** */
  on(t, e) {
    this.map.on(t, (a) => {
      e();
    });
  }
  /** */
  off(t, e) {
    this.map.off(t, (a) => {
      e();
    });
  }
  /**初始化canvas */
  initCanvas() {
    const { canvas: t, map: e, type: a, options: r, layer: o } = this;
    t.className = `sl-layer ${r.className || "sl-canvas-map"}`, t.style.zIndex = `${r.zIndex || 100}`, t.style.transformOrigin = "50% 50%", this.initLeafletCanvas();
  }
  /** 将图层添加到map实例中显示 */
  onAdd() {
    this._onAmapAdd(), this._eventSwitch(!0);
    let t = this.layer;
    return t.render = this._redraw, this;
  }
  /**基础的监听事件   
  * @param flag true开启重绘事件监听 false 关闭重绘事件监听
  **/
  _eventSwitch(t = !0) {
    let e = this.map, a = t ? "on" : "off";
    this.addLeafletEvent(t), this.addMapEvents(e, a);
  }
  /**------------------------------高德地图的实现------------------------------*/
  _onAmapAdd() {
    const { map: t, layer: e, type: a } = this;
    a === 1 && e.setMap(t);
  }
  _onAmapRemove() {
    const { map: t, layer: e, type: a } = this;
    a === 1 && t.remove(e);
  }
  /**------------------------------Leaflet地图的实现------------------------------*/
  /**初始化画布并添加到Pane中 */
  initLeafletCanvas() {
    const { canvas: t, map: e, type: a, options: r } = this;
    if (a || !(e instanceof V.Map)) return;
    let o = r.pane || "overlayPane", l = e.getPane(o) || e.createPane(o);
    l.appendChild(t), l.style.pointerEvents = "none";
    let u = e.options.zoomAnimation && V.Browser.any3d;
    V.DomUtil.addClass(t, "leaflet-zoom-" + (u ? "animated" : "hide")), V.extend(t, {
      onselectstart: V.Util.falseFn,
      onmousemove: V.Util.falseFn,
      onload: V.bind(this._onCanvasLoad, this)
    });
  }
  /**移除 */
  _onLeafletRemove() {
    let { map: t, layer: e, options: a, type: r } = this;
    if (r == 0) {
      let o = a.pane;
      o && t.getPane(o)?.removeChild(this.canvas), e.remove();
    }
  }
  addLeafletEvent(t = !0) {
    let e = this.map;
    if (e instanceof V.Map) {
      requestAnimationFrame(() => this._reset());
      let a = t ? "on" : "off";
      e[a]("viewreset", this._reset, this), e[a]("resize", this._reset, this), e[a]("moveend", this._reset, this), e.options.zoomAnimation && V.Browser.any3d && e[a]("zoomanim", this._animateZoom, this);
    }
  }
  /**重设画布,并重新渲染*/
  _reset() {
    this.resetCanvas(), this._redraw();
  }
  /**缩放动画 */
  _animateZoom(t) {
    let e = this.map;
    var a = e.getZoomScale(t.zoom), r = e._getCenterOffset(t.center)._multiplyBy(-a).subtract(e._getMapPanePos());
    V.DomUtil.setTransform(this.canvas, r, a);
  }
  _onCanvasLoad() {
    this.layer instanceof V.Layer && this.layer.fire("load");
  }
}
var is = { exports: {} }, Wh = is.exports, Ka;
function Hh() {
  return Ka || (Ka = 1, (function(s, t) {
    (function(e, a) {
      s.exports = a();
    })(Wh, function() {
      function e(m) {
        var p = [];
        return m.AMapUI && p.push(a(m.AMapUI)), m.Loca && p.push(r(m.Loca)), Promise.all(p);
      }
      function a(m) {
        return new Promise(function(p, y) {
          var M = [];
          if (m.plugins) for (var w = 0; w < m.plugins.length; w += 1) l.AMapUI.plugins.indexOf(m.plugins[w]) == -1 && M.push(m.plugins[w]);
          if (u.AMapUI === o.failed) y("前次请求 AMapUI 失败");
          else if (u.AMapUI === o.notload) {
            u.AMapUI = o.loading, l.AMapUI.version = m.version || l.AMapUI.version, w = l.AMapUI.version;
            var P = document.body || document.head, E = document.createElement("script");
            E.type = "text/javascript", E.src = "https://webapi.amap.com/ui/" + w + "/main.js", E.onerror = function(A) {
              u.AMapUI = o.failed, y("请求 AMapUI 失败");
            }, E.onload = function() {
              if (u.AMapUI = o.loaded, M.length) window.AMapUI.loadUI(M, function() {
                for (var A = 0, T = M.length; A < T; A++) {
                  var G = M[A].split("/").slice(-1)[0];
                  window.AMapUI[G] = arguments[A];
                }
                for (p(); c.AMapUI.length; ) c.AMapUI.splice(0, 1)[0]();
              });
              else for (p(); c.AMapUI.length; ) c.AMapUI.splice(0, 1)[0]();
            }, P.appendChild(E);
          } else u.AMapUI === o.loaded ? m.version && m.version !== l.AMapUI.version ? y("不允许多个版本 AMapUI 混用") : M.length ? window.AMapUI.loadUI(M, function() {
            for (var A = 0, T = M.length; A < T; A++) {
              var G = M[A].split("/").slice(-1)[0];
              window.AMapUI[G] = arguments[A];
            }
            p();
          }) : p() : m.version && m.version !== l.AMapUI.version ? y("不允许多个版本 AMapUI 混用") : c.AMapUI.push(function(A) {
            A ? y(A) : M.length ? window.AMapUI.loadUI(M, function() {
              for (var T = 0, G = M.length; T < G; T++) {
                var R = M[T].split("/").slice(-1)[0];
                window.AMapUI[R] = arguments[T];
              }
              p();
            }) : p();
          });
        });
      }
      function r(m) {
        return new Promise(function(p, y) {
          if (u.Loca === o.failed) y("前次请求 Loca 失败");
          else if (u.Loca === o.notload) {
            u.Loca = o.loading, l.Loca.version = m.version || l.Loca.version;
            var M = l.Loca.version, w = l.AMap.version.startsWith("2"), P = M.startsWith("2");
            if (w && !P || !w && P) y("JSAPI 与 Loca 版本不对应！！");
            else {
              w = l.key, P = document.body || document.head;
              var E = document.createElement("script");
              E.type = "text/javascript", E.src = "https://webapi.amap.com/loca?v=" + M + "&key=" + w, E.onerror = function(A) {
                u.Loca = o.failed, y("请求 AMapUI 失败");
              }, E.onload = function() {
                for (u.Loca = o.loaded, p(); c.Loca.length; ) c.Loca.splice(0, 1)[0]();
              }, P.appendChild(E);
            }
          } else u.Loca === o.loaded ? m.version && m.version !== l.Loca.version ? y("不允许多个版本 Loca 混用") : p() : m.version && m.version !== l.Loca.version ? y("不允许多个版本 Loca 混用") : c.Loca.push(function(A) {
            A ? y(A) : y();
          });
        });
      }
      if (!window) throw Error("AMap JSAPI can only be used in Browser.");
      var o;
      (function(m) {
        m.notload = "notload", m.loading = "loading", m.loaded = "loaded", m.failed = "failed";
      })(o || (o = {}));
      var l = { key: "", AMap: { version: "1.4.15", plugins: [] }, AMapUI: { version: "1.1", plugins: [] }, Loca: { version: "1.3.2" } }, u = { AMap: o.notload, AMapUI: o.notload, Loca: o.notload }, c = { AMapUI: [], Loca: [] }, d = [], g = function(m) {
        typeof m == "function" && (u.AMap === o.loaded ? m(window.AMap) : d.push(m));
      };
      return { load: function(m) {
        return new Promise(function(p, y) {
          if (u.AMap == o.failed) y("");
          else if (u.AMap == o.notload) {
            var M = m.key, w = m.version, P = m.plugins;
            M ? (window.AMap && location.host !== "lbs.amap.com" && y("禁止多种API加载方式混用"), l.key = M, l.AMap.version = w || l.AMap.version, l.AMap.plugins = P || l.AMap.plugins, u.AMap = o.loading, w = document.body || document.head, window.___onAPILoaded = function(A) {
              if (delete window.___onAPILoaded, A) u.AMap = o.failed, y(A);
              else for (u.AMap = o.loaded, e(m).then(function() {
                p(window.AMap);
              }).catch(y); d.length; ) d.splice(0, 1)[0]();
            }, P = document.createElement("script"), P.type = "text/javascript", P.src = "https://webapi.amap.com/maps?callback=___onAPILoaded&v=" + l.AMap.version + "&key=" + M + "&plugin=" + l.AMap.plugins.join(","), P.onerror = function(A) {
              u.AMap = o.failed, y(A);
            }, w.appendChild(P)) : y("请填写key");
          } else if (u.AMap == o.loaded) if (m.key && m.key !== l.key) y("多个不一致的 key");
          else if (m.version && m.version !== l.AMap.version) y("不允许多个版本 JSAPI 混用");
          else {
            if (M = [], m.plugins) for (w = 0; w < m.plugins.length; w += 1) l.AMap.plugins.indexOf(m.plugins[w]) == -1 && M.push(m.plugins[w]);
            M.length ? window.AMap.plugin(M, function() {
              e(m).then(function() {
                p(window.AMap);
              }).catch(y);
            }) : e(m).then(function() {
              p(window.AMap);
            }).catch(y);
          }
          else if (m.key && m.key !== l.key) y("多个不一致的 key");
          else if (m.version && m.version !== l.AMap.version) y("不允许多个版本 JSAPI 混用");
          else {
            var E = [];
            if (m.plugins) for (w = 0; w < m.plugins.length; w += 1) l.AMap.plugins.indexOf(m.plugins[w]) == -1 && E.push(m.plugins[w]);
            g(function() {
              E.length ? window.AMap.plugin(E, function() {
                e(m).then(function() {
                  p(window.AMap);
                }).catch(y);
              }) : e(m).then(function() {
                p(window.AMap);
              }).catch(y);
            });
          }
        });
      }, reset: function() {
        delete window.AMap, delete window.AMapUI, delete window.Loca, l = { key: "", AMap: { version: "1.4.15", plugins: [] }, AMapUI: { version: "1.1", plugins: [] }, Loca: { version: "1.3.2" } }, u = {
          AMap: o.notload,
          AMapUI: o.notload,
          Loca: o.notload
        }, c = { AMap: [], AMapUI: [], Loca: [] };
      } };
    });
  })(is)), is.exports;
}
var Xh = Hh(), tn = { exports: {} };
function Vh(s) {
  s("EPSG:4326", "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees"), s("EPSG:4269", "+title=NAD83 (long/lat) +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees"), s("EPSG:3857", "+title=WGS 84 / Pseudo-Mercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs");
  for (var t = 1; t <= 60; ++t)
    s("EPSG:" + (32600 + t), "+proj=utm +zone=" + t + " +datum=WGS84 +units=m"), s("EPSG:" + (32700 + t), "+proj=utm +zone=" + t + " +south +datum=WGS84 +units=m");
  s("EPSG:5041", "+title=WGS 84 / UPS North (E,N) +proj=stere +lat_0=90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m"), s("EPSG:5042", "+title=WGS 84 / UPS South (E,N) +proj=stere +lat_0=-90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m"), s.WGS84 = s["EPSG:4326"], s["EPSG:3785"] = s["EPSG:3857"], s.GOOGLE = s["EPSG:3857"], s["EPSG:900913"] = s["EPSG:3857"], s["EPSG:102113"] = s["EPSG:3857"];
}
var pi = 1, vi = 2, zi = 3, Yh = 4, hn = 5, $a = 6378137, Kh = 6356752314e-3, Ja = 0.0066943799901413165, me = 484813681109536e-20, I = Math.PI / 2, $h = 0.16666666666666666, Jh = 0.04722222222222222, Qh = 0.022156084656084655, O = 1e-10, ot = 0.017453292519943295, Lt = 57.29577951308232, tt = Math.PI / 4, we = Math.PI * 2, ut = 3.14159265359, Tt = {};
Tt.greenwich = 0;
Tt.lisbon = -9.131906111111;
Tt.paris = 2.337229166667;
Tt.bogota = -74.080916666667;
Tt.madrid = -3.687938888889;
Tt.rome = 12.452333333333;
Tt.bern = 7.439583333333;
Tt.jakarta = 106.807719444444;
Tt.ferro = -17.666666666667;
Tt.brussels = 4.367975;
Tt.stockholm = 18.058277777778;
Tt.athens = 23.7163375;
Tt.oslo = 10.722916666667;
const tl = {
  mm: { to_meter: 1e-3 },
  cm: { to_meter: 0.01 },
  ft: { to_meter: 0.3048 },
  "us-ft": { to_meter: 1200 / 3937 },
  fath: { to_meter: 1.8288 },
  kmi: { to_meter: 1852 },
  "us-ch": { to_meter: 20.1168402336805 },
  "us-mi": { to_meter: 1609.34721869444 },
  km: { to_meter: 1e3 },
  "ind-ft": { to_meter: 0.30479841 },
  "ind-yd": { to_meter: 0.91439523 },
  mi: { to_meter: 1609.344 },
  yd: { to_meter: 0.9144 },
  ch: { to_meter: 20.1168 },
  link: { to_meter: 0.201168 },
  dm: { to_meter: 0.1 },
  in: { to_meter: 0.0254 },
  "ind-ch": { to_meter: 20.11669506 },
  "us-in": { to_meter: 0.025400050800101 },
  "us-yd": { to_meter: 0.914401828803658 }
};
var Qa = /[\s_\-\/\(\)]/g;
function hi(s, t) {
  if (s[t])
    return s[t];
  for (var e = Object.keys(s), a = t.toLowerCase().replace(Qa, ""), r = -1, o, l; ++r < e.length; )
    if (o = e[r], l = o.toLowerCase().replace(Qa, ""), l === a)
      return s[o];
}
function ln(s) {
  var t = {}, e = s.split("+").map(function(u) {
    return u.trim();
  }).filter(function(u) {
    return u;
  }).reduce(function(u, c) {
    var d = c.split("=");
    return d.push(!0), u[d[0].toLowerCase()] = d[1], u;
  }, {}), a, r, o, l = {
    proj: "projName",
    datum: "datumCode",
    rf: function(u) {
      t.rf = parseFloat(u);
    },
    lat_0: function(u) {
      t.lat0 = u * ot;
    },
    lat_1: function(u) {
      t.lat1 = u * ot;
    },
    lat_2: function(u) {
      t.lat2 = u * ot;
    },
    lat_ts: function(u) {
      t.lat_ts = u * ot;
    },
    lon_0: function(u) {
      t.long0 = u * ot;
    },
    lon_1: function(u) {
      t.long1 = u * ot;
    },
    lon_2: function(u) {
      t.long2 = u * ot;
    },
    alpha: function(u) {
      t.alpha = parseFloat(u) * ot;
    },
    gamma: function(u) {
      t.rectified_grid_angle = parseFloat(u) * ot;
    },
    lonc: function(u) {
      t.longc = u * ot;
    },
    x_0: function(u) {
      t.x0 = parseFloat(u);
    },
    y_0: function(u) {
      t.y0 = parseFloat(u);
    },
    k_0: function(u) {
      t.k0 = parseFloat(u);
    },
    k: function(u) {
      t.k0 = parseFloat(u);
    },
    a: function(u) {
      t.a = parseFloat(u);
    },
    b: function(u) {
      t.b = parseFloat(u);
    },
    r: function(u) {
      t.a = t.b = parseFloat(u);
    },
    r_a: function() {
      t.R_A = !0;
    },
    zone: function(u) {
      t.zone = parseInt(u, 10);
    },
    south: function() {
      t.utmSouth = !0;
    },
    towgs84: function(u) {
      t.datum_params = u.split(",").map(function(c) {
        return parseFloat(c);
      });
    },
    to_meter: function(u) {
      t.to_meter = parseFloat(u);
    },
    units: function(u) {
      t.units = u;
      var c = hi(tl, u);
      c && (t.to_meter = c.to_meter);
    },
    from_greenwich: function(u) {
      t.from_greenwich = u * ot;
    },
    pm: function(u) {
      var c = hi(Tt, u);
      t.from_greenwich = (c || parseFloat(u)) * ot;
    },
    nadgrids: function(u) {
      u === "@null" ? t.datumCode = "none" : t.nadgrids = u;
    },
    axis: function(u) {
      var c = "ewnsud";
      u.length === 3 && c.indexOf(u.substr(0, 1)) !== -1 && c.indexOf(u.substr(1, 1)) !== -1 && c.indexOf(u.substr(2, 1)) !== -1 && (t.axis = u);
    },
    approx: function() {
      t.approx = !0;
    },
    over: function() {
      t.over = !0;
    }
  };
  for (a in e)
    r = e[a], a in l ? (o = l[a], typeof o == "function" ? o(r) : t[o] = r) : t[a] = r;
  return typeof t.datumCode == "string" && t.datumCode !== "WGS84" && (t.datumCode = t.datumCode.toLowerCase()), t.projStr = s, t;
}
class br {
  static getId(t) {
    const e = t.find((a) => Array.isArray(a) && a[0] === "ID");
    return e && e.length >= 3 ? {
      authority: e[1],
      code: parseInt(e[2], 10)
    } : null;
  }
  static convertUnit(t, e = "unit") {
    if (!t || t.length < 3)
      return { type: e, name: "unknown", conversion_factor: null };
    const a = t[1], r = parseFloat(t[2]) || null, o = t.find((u) => Array.isArray(u) && u[0] === "ID"), l = o ? {
      authority: o[1],
      code: parseInt(o[2], 10)
    } : null;
    return {
      type: e,
      name: a,
      conversion_factor: r,
      id: l
    };
  }
  static convertAxis(t) {
    const e = t[1] || "Unknown";
    let a;
    const r = e.match(/^\((.)\)$/);
    if (r) {
      const d = r[1].toUpperCase();
      if (d === "E") a = "east";
      else if (d === "N") a = "north";
      else if (d === "U") a = "up";
      else throw new Error(`Unknown axis abbreviation: ${d}`);
    } else
      a = t[2] ? t[2].toLowerCase() : "unknown";
    const o = t.find((d) => Array.isArray(d) && d[0] === "ORDER"), l = o ? parseInt(o[1], 10) : null, u = t.find(
      (d) => Array.isArray(d) && (d[0] === "LENGTHUNIT" || d[0] === "ANGLEUNIT" || d[0] === "SCALEUNIT")
    ), c = this.convertUnit(u);
    return {
      name: e,
      direction: a,
      // Use the valid PROJJSON direction value
      unit: c,
      order: l
    };
  }
  static extractAxes(t) {
    return t.filter((e) => Array.isArray(e) && e[0] === "AXIS").map((e) => this.convertAxis(e)).sort((e, a) => (e.order || 0) - (a.order || 0));
  }
  static convert(t, e = {}) {
    switch (t[0]) {
      case "PROJCRS":
        e.type = "ProjectedCRS", e.name = t[1], e.base_crs = t.find((p) => Array.isArray(p) && p[0] === "BASEGEOGCRS") ? this.convert(t.find((p) => Array.isArray(p) && p[0] === "BASEGEOGCRS")) : null, e.conversion = t.find((p) => Array.isArray(p) && p[0] === "CONVERSION") ? this.convert(t.find((p) => Array.isArray(p) && p[0] === "CONVERSION")) : null;
        const a = t.find((p) => Array.isArray(p) && p[0] === "CS");
        a && (e.coordinate_system = {
          type: a[1],
          axis: this.extractAxes(t)
        });
        const r = t.find((p) => Array.isArray(p) && p[0] === "LENGTHUNIT");
        if (r) {
          const p = this.convertUnit(r);
          e.coordinate_system.unit = p;
        }
        e.id = this.getId(t);
        break;
      case "BASEGEOGCRS":
      case "GEOGCRS":
        e.type = "GeographicCRS", e.name = t[1];
        const o = t.find(
          (p) => Array.isArray(p) && (p[0] === "DATUM" || p[0] === "ENSEMBLE")
        );
        if (o) {
          const p = this.convert(o);
          o[0] === "ENSEMBLE" ? e.datum_ensemble = p : e.datum = p;
          const y = t.find((M) => Array.isArray(M) && M[0] === "PRIMEM");
          y && y[1] !== "Greenwich" && (p.prime_meridian = {
            name: y[1],
            longitude: parseFloat(y[2])
          });
        }
        e.coordinate_system = {
          type: "ellipsoidal",
          axis: this.extractAxes(t)
        }, e.id = this.getId(t);
        break;
      case "DATUM":
        e.type = "GeodeticReferenceFrame", e.name = t[1], e.ellipsoid = t.find((p) => Array.isArray(p) && p[0] === "ELLIPSOID") ? this.convert(t.find((p) => Array.isArray(p) && p[0] === "ELLIPSOID")) : null;
        break;
      case "ENSEMBLE":
        e.type = "DatumEnsemble", e.name = t[1], e.members = t.filter((p) => Array.isArray(p) && p[0] === "MEMBER").map((p) => ({
          type: "DatumEnsembleMember",
          name: p[1],
          id: this.getId(p)
          // Extract ID as { authority, code }
        }));
        const l = t.find((p) => Array.isArray(p) && p[0] === "ENSEMBLEACCURACY");
        l && (e.accuracy = parseFloat(l[1]));
        const u = t.find((p) => Array.isArray(p) && p[0] === "ELLIPSOID");
        u && (e.ellipsoid = this.convert(u)), e.id = this.getId(t);
        break;
      case "ELLIPSOID":
        e.type = "Ellipsoid", e.name = t[1], e.semi_major_axis = parseFloat(t[2]), e.inverse_flattening = parseFloat(t[3]), t.find((p) => Array.isArray(p) && p[0] === "LENGTHUNIT") && this.convert(t.find((p) => Array.isArray(p) && p[0] === "LENGTHUNIT"), e);
        break;
      case "CONVERSION":
        e.type = "Conversion", e.name = t[1], e.method = t.find((p) => Array.isArray(p) && p[0] === "METHOD") ? this.convert(t.find((p) => Array.isArray(p) && p[0] === "METHOD")) : null, e.parameters = t.filter((p) => Array.isArray(p) && p[0] === "PARAMETER").map((p) => this.convert(p));
        break;
      case "METHOD":
        e.type = "Method", e.name = t[1], e.id = this.getId(t);
        break;
      case "PARAMETER":
        e.type = "Parameter", e.name = t[1], e.value = parseFloat(t[2]), e.unit = this.convertUnit(
          t.find(
            (p) => Array.isArray(p) && (p[0] === "LENGTHUNIT" || p[0] === "ANGLEUNIT" || p[0] === "SCALEUNIT")
          )
        ), e.id = this.getId(t);
        break;
      case "BOUNDCRS":
        e.type = "BoundCRS";
        const c = t.find((p) => Array.isArray(p) && p[0] === "SOURCECRS");
        if (c) {
          const p = c.find((y) => Array.isArray(y));
          e.source_crs = p ? this.convert(p) : null;
        }
        const d = t.find((p) => Array.isArray(p) && p[0] === "TARGETCRS");
        if (d) {
          const p = d.find((y) => Array.isArray(y));
          e.target_crs = p ? this.convert(p) : null;
        }
        const g = t.find((p) => Array.isArray(p) && p[0] === "ABRIDGEDTRANSFORMATION");
        g ? e.transformation = this.convert(g) : e.transformation = null;
        break;
      case "ABRIDGEDTRANSFORMATION":
        if (e.type = "Transformation", e.name = t[1], e.method = t.find((p) => Array.isArray(p) && p[0] === "METHOD") ? this.convert(t.find((p) => Array.isArray(p) && p[0] === "METHOD")) : null, e.parameters = t.filter((p) => Array.isArray(p) && (p[0] === "PARAMETER" || p[0] === "PARAMETERFILE")).map((p) => {
          if (p[0] === "PARAMETER")
            return this.convert(p);
          if (p[0] === "PARAMETERFILE")
            return {
              name: p[1],
              value: p[2],
              id: {
                authority: "EPSG",
                code: 8656
              }
            };
        }), e.parameters.length === 7) {
          const p = e.parameters[6];
          p.name === "Scale difference" && (p.value = Math.round((p.value - 1) * 1e12) / 1e6);
        }
        e.id = this.getId(t);
        break;
      case "AXIS":
        e.coordinate_system || (e.coordinate_system = { type: "unspecified", axis: [] }), e.coordinate_system.axis.push(this.convertAxis(t));
        break;
      case "LENGTHUNIT":
        const m = this.convertUnit(t, "LinearUnit");
        e.coordinate_system && e.coordinate_system.axis && e.coordinate_system.axis.forEach((p) => {
          p.unit || (p.unit = m);
        }), m.conversion_factor && m.conversion_factor !== 1 && e.semi_major_axis && (e.semi_major_axis = {
          value: e.semi_major_axis,
          unit: m
        });
        break;
      default:
        e.keyword = t[0];
        break;
    }
    return e;
  }
}
class il extends br {
  static convert(t, e = {}) {
    return super.convert(t, e), e.coordinate_system && e.coordinate_system.subtype === "Cartesian" && delete e.coordinate_system, e.usage && delete e.usage, e;
  }
}
class el extends br {
  static convert(t, e = {}) {
    super.convert(t, e);
    const a = t.find((o) => Array.isArray(o) && o[0] === "CS");
    a && (e.coordinate_system = {
      subtype: a[1],
      axis: this.extractAxes(t)
    });
    const r = t.find((o) => Array.isArray(o) && o[0] === "USAGE");
    if (r) {
      const o = r.find((c) => Array.isArray(c) && c[0] === "SCOPE"), l = r.find((c) => Array.isArray(c) && c[0] === "AREA"), u = r.find((c) => Array.isArray(c) && c[0] === "BBOX");
      e.usage = {}, o && (e.usage.scope = o[1]), l && (e.usage.area = l[1]), u && (e.usage.bbox = u.slice(1));
    }
    return e;
  }
}
function sl(s) {
  return s.find((t) => Array.isArray(t) && t[0] === "USAGE") ? "2019" : (s.find((t) => Array.isArray(t) && t[0] === "CS") || s[0] === "BOUNDCRS" || s[0] === "PROJCRS" || s[0] === "GEOGCRS", "2015");
}
function nl(s) {
  return (sl(s) === "2019" ? el : il).convert(s);
}
function al(s) {
  const t = s.toUpperCase();
  return t.includes("PROJCRS") || t.includes("GEOGCRS") || t.includes("BOUNDCRS") || t.includes("VERTCRS") || t.includes("LENGTHUNIT") || t.includes("ANGLEUNIT") || t.includes("SCALEUNIT") ? "WKT2" : (t.includes("PROJCS") || t.includes("GEOGCS") || t.includes("LOCAL_CS") || t.includes("VERT_CS") || t.includes("UNIT"), "WKT1");
}
var xe = 1, Er = 2, Sr = 3, os = 4, Ar = 5, vn = -1, rl = /\s/, ol = /[A-Za-z]/, hl = /[A-Za-z84_]/, ps = /[,\]]/, Lr = /[\d\.E\-\+]/;
function ii(s) {
  if (typeof s != "string")
    throw new Error("not a string");
  this.text = s.trim(), this.level = 0, this.place = 0, this.root = null, this.stack = [], this.currentObject = null, this.state = xe;
}
ii.prototype.readCharicter = function() {
  var s = this.text[this.place++];
  if (this.state !== os)
    for (; rl.test(s); ) {
      if (this.place >= this.text.length)
        return;
      s = this.text[this.place++];
    }
  switch (this.state) {
    case xe:
      return this.neutral(s);
    case Er:
      return this.keyword(s);
    case os:
      return this.quoted(s);
    case Ar:
      return this.afterquote(s);
    case Sr:
      return this.number(s);
    case vn:
      return;
  }
};
ii.prototype.afterquote = function(s) {
  if (s === '"') {
    this.word += '"', this.state = os;
    return;
  }
  if (ps.test(s)) {
    this.word = this.word.trim(), this.afterItem(s);
    return;
  }
  throw new Error(`havn't handled "` + s + '" in afterquote yet, index ' + this.place);
};
ii.prototype.afterItem = function(s) {
  if (s === ",") {
    this.word !== null && this.currentObject.push(this.word), this.word = null, this.state = xe;
    return;
  }
  if (s === "]") {
    this.level--, this.word !== null && (this.currentObject.push(this.word), this.word = null), this.state = xe, this.currentObject = this.stack.pop(), this.currentObject || (this.state = vn);
    return;
  }
};
ii.prototype.number = function(s) {
  if (Lr.test(s)) {
    this.word += s;
    return;
  }
  if (ps.test(s)) {
    this.word = parseFloat(this.word), this.afterItem(s);
    return;
  }
  throw new Error(`havn't handled "` + s + '" in number yet, index ' + this.place);
};
ii.prototype.quoted = function(s) {
  if (s === '"') {
    this.state = Ar;
    return;
  }
  this.word += s;
};
ii.prototype.keyword = function(s) {
  if (hl.test(s)) {
    this.word += s;
    return;
  }
  if (s === "[") {
    var t = [];
    t.push(this.word), this.level++, this.root === null ? this.root = t : this.currentObject.push(t), this.stack.push(this.currentObject), this.currentObject = t, this.state = xe;
    return;
  }
  if (ps.test(s)) {
    this.afterItem(s);
    return;
  }
  throw new Error(`havn't handled "` + s + '" in keyword yet, index ' + this.place);
};
ii.prototype.neutral = function(s) {
  if (ol.test(s)) {
    this.word = s, this.state = Er;
    return;
  }
  if (s === '"') {
    this.word = "", this.state = os;
    return;
  }
  if (Lr.test(s)) {
    this.word = s, this.state = Sr;
    return;
  }
  if (ps.test(s)) {
    this.afterItem(s);
    return;
  }
  throw new Error(`havn't handled "` + s + '" in neutral yet, index ' + this.place);
};
ii.prototype.output = function() {
  for (; this.place < this.text.length; )
    this.readCharicter();
  if (this.state === vn)
    return this.root;
  throw new Error('unable to parse string "' + this.text + '". State is ' + this.state);
};
function ll(s) {
  var t = new ii(s);
  return t.output();
}
function en(s, t, e) {
  Array.isArray(t) && (e.unshift(t), t = null);
  var a = t ? {} : s, r = e.reduce(function(o, l) {
    return Gi(l, o), o;
  }, a);
  t && (s[t] = r);
}
function Gi(s, t) {
  if (!Array.isArray(s)) {
    t[s] = !0;
    return;
  }
  var e = s.shift();
  if (e === "PARAMETER" && (e = s.shift()), s.length === 1) {
    if (Array.isArray(s[0])) {
      t[e] = {}, Gi(s[0], t[e]);
      return;
    }
    t[e] = s[0];
    return;
  }
  if (!s.length) {
    t[e] = !0;
    return;
  }
  if (e === "TOWGS84") {
    t[e] = s;
    return;
  }
  if (e === "AXIS") {
    e in t || (t[e] = []), t[e].push(s);
    return;
  }
  Array.isArray(e) || (t[e] = {});
  var a;
  switch (e) {
    case "UNIT":
    case "PRIMEM":
    case "VERT_DATUM":
      t[e] = {
        name: s[0].toLowerCase(),
        convert: s[1]
      }, s.length === 3 && Gi(s[2], t[e]);
      return;
    case "SPHEROID":
    case "ELLIPSOID":
      t[e] = {
        name: s[0],
        a: s[1],
        rf: s[2]
      }, s.length === 4 && Gi(s[3], t[e]);
      return;
    case "EDATUM":
    case "ENGINEERINGDATUM":
    case "LOCAL_DATUM":
    case "DATUM":
    case "VERT_CS":
    case "VERTCRS":
    case "VERTICALCRS":
      s[0] = ["name", s[0]], en(t, e, s);
      return;
    case "COMPD_CS":
    case "COMPOUNDCRS":
    case "FITTED_CS":
    // the followings are the crs defined in
    // https://github.com/proj4js/proj4js/blob/1da4ed0b865d0fcb51c136090569210cdcc9019e/lib/parseCode.js#L11
    case "PROJECTEDCRS":
    case "PROJCRS":
    case "GEOGCS":
    case "GEOCCS":
    case "PROJCS":
    case "LOCAL_CS":
    case "GEODCRS":
    case "GEODETICCRS":
    case "GEODETICDATUM":
    case "ENGCRS":
    case "ENGINEERINGCRS":
      s[0] = ["name", s[0]], en(t, e, s), t[e].type = e;
      return;
    default:
      for (a = -1; ++a < s.length; )
        if (!Array.isArray(s[a]))
          return Gi(s, t[e]);
      return en(t, e, s);
  }
}
var ul = 0.017453292519943295;
function Bt(s) {
  return s * ul;
}
function Tr(s) {
  const t = (s.projName || "").toLowerCase().replace(/_/g, " ");
  !s.long0 && s.longc && (t === "albers conic equal area" || t === "lambert azimuthal equal area") && (s.long0 = s.longc), !s.lat_ts && s.lat1 && (t === "stereographic south pole" || t === "polar stereographic (variant b)") ? (s.lat0 = Bt(s.lat1 > 0 ? 90 : -90), s.lat_ts = s.lat1, delete s.lat1) : !s.lat_ts && s.lat0 && (t === "polar stereographic" || t === "polar stereographic (variant a)") && (s.lat_ts = s.lat0, s.lat0 = Bt(s.lat0 > 0 ? 90 : -90), delete s.lat1);
}
function tr(s) {
  let t = { units: null, to_meter: void 0 };
  return typeof s == "string" ? (t.units = s.toLowerCase(), t.units === "metre" && (t.units = "meter"), t.units === "meter" && (t.to_meter = 1)) : s && s.name && (t.units = s.name.toLowerCase(), t.units === "metre" && (t.units = "meter"), t.to_meter = s.conversion_factor), t;
}
function ir(s) {
  return typeof s == "object" ? s.value * s.unit.conversion_factor : s;
}
function er(s, t) {
  s.ellipsoid.radius ? (t.a = s.ellipsoid.radius, t.rf = 0) : (t.a = ir(s.ellipsoid.semi_major_axis), s.ellipsoid.inverse_flattening !== void 0 ? t.rf = s.ellipsoid.inverse_flattening : s.ellipsoid.semi_major_axis !== void 0 && s.ellipsoid.semi_minor_axis !== void 0 && (t.rf = t.a / (t.a - ir(s.ellipsoid.semi_minor_axis))));
}
function hs(s, t = {}) {
  return !s || typeof s != "object" ? s : s.type === "BoundCRS" ? (hs(s.source_crs, t), s.transformation && (s.transformation.method && s.transformation.method.name === "NTv2" ? t.nadgrids = s.transformation.parameters[0].value : t.datum_params = s.transformation.parameters.map((e) => e.value)), t) : (Object.keys(s).forEach((e) => {
    const a = s[e];
    if (a !== null)
      switch (e) {
        case "name":
          if (t.srsCode)
            break;
          t.name = a, t.srsCode = a;
          break;
        case "type":
          a === "GeographicCRS" ? t.projName = "longlat" : a === "ProjectedCRS" && s.conversion && s.conversion.method && (t.projName = s.conversion.method.name);
          break;
        case "datum":
        case "datum_ensemble":
          a.ellipsoid && (t.ellps = a.ellipsoid.name, er(a, t)), a.prime_meridian && (t.from_greenwich = a.prime_meridian.longitude * Math.PI / 180);
          break;
        case "ellipsoid":
          t.ellps = a.name, er(a, t);
          break;
        case "prime_meridian":
          t.long0 = (a.longitude || 0) * Math.PI / 180;
          break;
        case "coordinate_system":
          if (a.axis) {
            if (t.axis = a.axis.map((r) => {
              const o = r.direction;
              if (o === "east") return "e";
              if (o === "north") return "n";
              if (o === "west") return "w";
              if (o === "south") return "s";
              throw new Error(`Unknown axis direction: ${o}`);
            }).join("") + "u", a.unit) {
              const { units: r, to_meter: o } = tr(a.unit);
              t.units = r, t.to_meter = o;
            } else if (a.axis[0] && a.axis[0].unit) {
              const { units: r, to_meter: o } = tr(a.axis[0].unit);
              t.units = r, t.to_meter = o;
            }
          }
          break;
        case "id":
          a.authority && a.code && (t.title = a.authority + ":" + a.code);
          break;
        case "conversion":
          a.method && a.method.name && (t.projName = a.method.name), a.parameters && a.parameters.forEach((r) => {
            const o = r.name.toLowerCase().replace(/\s+/g, "_"), l = r.value;
            r.unit && r.unit.conversion_factor ? t[o] = l * r.unit.conversion_factor : r.unit === "degree" ? t[o] = l * Math.PI / 180 : t[o] = l;
          });
          break;
        case "unit":
          a.name && (t.units = a.name.toLowerCase(), t.units === "metre" && (t.units = "meter")), a.conversion_factor && (t.to_meter = a.conversion_factor);
          break;
        case "base_crs":
          hs(a, t), t.datumCode = a.id ? a.id.authority + "_" + a.id.code : a.name;
          break;
      }
  }), t.latitude_of_false_origin !== void 0 && (t.lat0 = t.latitude_of_false_origin), t.longitude_of_false_origin !== void 0 && (t.long0 = t.longitude_of_false_origin), t.latitude_of_standard_parallel !== void 0 && (t.lat0 = t.latitude_of_standard_parallel, t.lat1 = t.latitude_of_standard_parallel), t.latitude_of_1st_standard_parallel !== void 0 && (t.lat1 = t.latitude_of_1st_standard_parallel), t.latitude_of_2nd_standard_parallel !== void 0 && (t.lat2 = t.latitude_of_2nd_standard_parallel), t.latitude_of_projection_centre !== void 0 && (t.lat0 = t.latitude_of_projection_centre), t.longitude_of_projection_centre !== void 0 && (t.longc = t.longitude_of_projection_centre), t.easting_at_false_origin !== void 0 && (t.x0 = t.easting_at_false_origin), t.northing_at_false_origin !== void 0 && (t.y0 = t.northing_at_false_origin), t.latitude_of_natural_origin !== void 0 && (t.lat0 = t.latitude_of_natural_origin), t.longitude_of_natural_origin !== void 0 && (t.long0 = t.longitude_of_natural_origin), t.longitude_of_origin !== void 0 && (t.long0 = t.longitude_of_origin), t.false_easting !== void 0 && (t.x0 = t.false_easting), t.easting_at_projection_centre && (t.x0 = t.easting_at_projection_centre), t.false_northing !== void 0 && (t.y0 = t.false_northing), t.northing_at_projection_centre && (t.y0 = t.northing_at_projection_centre), t.standard_parallel_1 !== void 0 && (t.lat1 = t.standard_parallel_1), t.standard_parallel_2 !== void 0 && (t.lat2 = t.standard_parallel_2), t.scale_factor_at_natural_origin !== void 0 && (t.k0 = t.scale_factor_at_natural_origin), t.scale_factor_at_projection_centre !== void 0 && (t.k0 = t.scale_factor_at_projection_centre), t.scale_factor_on_pseudo_standard_parallel !== void 0 && (t.k0 = t.scale_factor_on_pseudo_standard_parallel), t.azimuth !== void 0 && (t.alpha = t.azimuth), t.azimuth_at_projection_centre !== void 0 && (t.alpha = t.azimuth_at_projection_centre), t.angle_from_rectified_to_skew_grid && (t.rectified_grid_angle = t.angle_from_rectified_to_skew_grid), Tr(t), t);
}
var cl = [
  "PROJECTEDCRS",
  "PROJCRS",
  "GEOGCS",
  "GEOCCS",
  "PROJCS",
  "LOCAL_CS",
  "GEODCRS",
  "GEODETICCRS",
  "GEODETICDATUM",
  "ENGCRS",
  "ENGINEERINGCRS"
];
function fl(s, t) {
  var e = t[0], a = t[1];
  !(e in s) && a in s && (s[e] = s[a], t.length === 3 && (s[e] = t[2](s[e])));
}
function Cr(s) {
  for (var t = Object.keys(s), e = 0, a = t.length; e < a; ++e) {
    var r = t[e];
    cl.indexOf(r) !== -1 && dl(s[r]), typeof s[r] == "object" && Cr(s[r]);
  }
}
function dl(s) {
  if (s.AUTHORITY) {
    var t = Object.keys(s.AUTHORITY)[0];
    t && t in s.AUTHORITY && (s.title = t + ":" + s.AUTHORITY[t]);
  }
  if (s.type === "GEOGCS" ? s.projName = "longlat" : s.type === "LOCAL_CS" ? (s.projName = "identity", s.local = !0) : typeof s.PROJECTION == "object" ? s.projName = Object.keys(s.PROJECTION)[0] : s.projName = s.PROJECTION, s.AXIS) {
    for (var e = "", a = 0, r = s.AXIS.length; a < r; ++a) {
      var o = [s.AXIS[a][0].toLowerCase(), s.AXIS[a][1].toLowerCase()];
      o[0].indexOf("north") !== -1 || (o[0] === "y" || o[0] === "lat") && o[1] === "north" ? e += "n" : o[0].indexOf("south") !== -1 || (o[0] === "y" || o[0] === "lat") && o[1] === "south" ? e += "s" : o[0].indexOf("east") !== -1 || (o[0] === "x" || o[0] === "lon") && o[1] === "east" ? e += "e" : (o[0].indexOf("west") !== -1 || (o[0] === "x" || o[0] === "lon") && o[1] === "west") && (e += "w");
    }
    e.length === 2 && (e += "u"), e.length === 3 && (s.axis = e);
  }
  s.UNIT && (s.units = s.UNIT.name.toLowerCase(), s.units === "metre" && (s.units = "meter"), s.UNIT.convert && (s.type === "GEOGCS" ? s.DATUM && s.DATUM.SPHEROID && (s.to_meter = s.UNIT.convert * s.DATUM.SPHEROID.a) : s.to_meter = s.UNIT.convert));
  var l = s.GEOGCS;
  s.type === "GEOGCS" && (l = s), l && (l.DATUM ? s.datumCode = l.DATUM.name.toLowerCase() : s.datumCode = l.name.toLowerCase(), s.datumCode.slice(0, 2) === "d_" && (s.datumCode = s.datumCode.slice(2)), s.datumCode === "new_zealand_1949" && (s.datumCode = "nzgd49"), (s.datumCode === "wgs_1984" || s.datumCode === "world_geodetic_system_1984") && (s.PROJECTION === "Mercator_Auxiliary_Sphere" && (s.sphere = !0), s.datumCode = "wgs84"), s.datumCode === "belge_1972" && (s.datumCode = "rnb72"), l.DATUM && l.DATUM.SPHEROID && (s.ellps = l.DATUM.SPHEROID.name.replace("_19", "").replace(/[Cc]larke\_18/, "clrk"), s.ellps.toLowerCase().slice(0, 13) === "international" && (s.ellps = "intl"), s.a = l.DATUM.SPHEROID.a, s.rf = parseFloat(l.DATUM.SPHEROID.rf, 10)), l.DATUM && l.DATUM.TOWGS84 && (s.datum_params = l.DATUM.TOWGS84), ~s.datumCode.indexOf("osgb_1936") && (s.datumCode = "osgb36"), ~s.datumCode.indexOf("osni_1952") && (s.datumCode = "osni52"), (~s.datumCode.indexOf("tm65") || ~s.datumCode.indexOf("geodetic_datum_of_1965")) && (s.datumCode = "ire65"), s.datumCode === "ch1903+" && (s.datumCode = "ch1903"), ~s.datumCode.indexOf("israel") && (s.datumCode = "isr93")), s.b && !isFinite(s.b) && (s.b = s.a), s.rectified_grid_angle && (s.rectified_grid_angle = Bt(s.rectified_grid_angle));
  function u(g) {
    var m = s.to_meter || 1;
    return g * m;
  }
  var c = function(g) {
    return fl(s, g);
  }, d = [
    ["standard_parallel_1", "Standard_Parallel_1"],
    ["standard_parallel_1", "Latitude of 1st standard parallel"],
    ["standard_parallel_2", "Standard_Parallel_2"],
    ["standard_parallel_2", "Latitude of 2nd standard parallel"],
    ["false_easting", "False_Easting"],
    ["false_easting", "False easting"],
    ["false-easting", "Easting at false origin"],
    ["false_northing", "False_Northing"],
    ["false_northing", "False northing"],
    ["false_northing", "Northing at false origin"],
    ["central_meridian", "Central_Meridian"],
    ["central_meridian", "Longitude of natural origin"],
    ["central_meridian", "Longitude of false origin"],
    ["latitude_of_origin", "Latitude_Of_Origin"],
    ["latitude_of_origin", "Central_Parallel"],
    ["latitude_of_origin", "Latitude of natural origin"],
    ["latitude_of_origin", "Latitude of false origin"],
    ["scale_factor", "Scale_Factor"],
    ["k0", "scale_factor"],
    ["latitude_of_center", "Latitude_Of_Center"],
    ["latitude_of_center", "Latitude_of_center"],
    ["lat0", "latitude_of_center", Bt],
    ["longitude_of_center", "Longitude_Of_Center"],
    ["longitude_of_center", "Longitude_of_center"],
    ["longc", "longitude_of_center", Bt],
    ["x0", "false_easting", u],
    ["y0", "false_northing", u],
    ["long0", "central_meridian", Bt],
    ["lat0", "latitude_of_origin", Bt],
    ["lat0", "standard_parallel_1", Bt],
    ["lat1", "standard_parallel_1", Bt],
    ["lat2", "standard_parallel_2", Bt],
    ["azimuth", "Azimuth"],
    ["alpha", "azimuth", Bt],
    ["srsCode", "name"]
  ];
  d.forEach(c), Tr(s);
}
function ls(s) {
  if (typeof s == "object")
    return hs(s);
  const t = al(s);
  var e = ll(s);
  if (t === "WKT2") {
    const o = nl(e);
    return hs(o);
  }
  var a = e[0], r = {};
  return Gi(e, r), Cr(r), r[a];
}
function vt(s) {
  var t = this;
  if (arguments.length === 2) {
    var e = arguments[1];
    typeof e == "string" ? e.charAt(0) === "+" ? vt[
      /** @type {string} */
      s
    ] = ln(arguments[1]) : vt[
      /** @type {string} */
      s
    ] = ls(arguments[1]) : e && typeof e == "object" && !("projName" in e) ? vt[
      /** @type {string} */
      s
    ] = ls(arguments[1]) : (vt[
      /** @type {string} */
      s
    ] = e, e || delete vt[
      /** @type {string} */
      s
    ]);
  } else if (arguments.length === 1) {
    if (Array.isArray(s))
      return s.map(function(a) {
        return Array.isArray(a) ? vt.apply(t, a) : vt(a);
      });
    if (typeof s == "string") {
      if (s in vt)
        return vt[s];
    } else "EPSG" in s ? vt["EPSG:" + s.EPSG] = s : "ESRI" in s ? vt["ESRI:" + s.ESRI] = s : "IAU2000" in s ? vt["IAU2000:" + s.IAU2000] = s : console.log(s);
    return;
  }
}
Vh(vt);
function _l(s) {
  return typeof s == "string";
}
function ml(s) {
  return s in vt;
}
function gl(s) {
  return s.indexOf("+") !== 0 && s.indexOf("[") !== -1 || typeof s == "object" && !("srsCode" in s);
}
var sr = ["3857", "900913", "3785", "102113"];
function pl(s) {
  if (s.title)
    return s.title.toLowerCase().indexOf("epsg:") === 0 && sr.indexOf(s.title.substr(5)) > -1;
  var t = hi(s, "authority");
  if (t) {
    var e = hi(t, "epsg");
    return e && sr.indexOf(e) > -1;
  }
}
function vl(s) {
  var t = hi(s, "extension");
  if (t)
    return hi(t, "proj4");
}
function yl(s) {
  return s[0] === "+";
}
function Ml(s) {
  if (_l(s)) {
    if (ml(s))
      return vt[s];
    if (gl(s)) {
      var t = ls(s);
      if (pl(t))
        return vt["EPSG:3857"];
      var e = vl(t);
      return e ? ln(e) : t;
    }
    if (yl(s))
      return ln(s);
  } else return "projName" in s ? s : ls(s);
}
function nr(s, t) {
  s = s || {};
  var e, a;
  if (!t)
    return s;
  for (a in t)
    e = t[a], e !== void 0 && (s[a] = e);
  return s;
}
function Xt(s, t, e) {
  var a = s * t;
  return e / Math.sqrt(1 - a * a);
}
function Se(s) {
  return s < 0 ? -1 : 1;
}
function N(s, t) {
  return t || Math.abs(s) <= ut ? s : s - Se(s) * we;
}
function Zt(s, t, e) {
  var a = s * e, r = 0.5 * s;
  return a = Math.pow((1 - a) / (1 + a), r), Math.tan(0.5 * (I - t)) / a;
}
function Pe(s, t) {
  for (var e = 0.5 * s, a, r, o = I - 2 * Math.atan(t), l = 0; l <= 15; l++)
    if (a = s * Math.sin(o), r = I - 2 * Math.atan(t * Math.pow((1 - a) / (1 + a), e)) - o, o += r, Math.abs(r) <= 1e-10)
      return o;
  return -9999;
}
function wl() {
  var s = this.b / this.a;
  this.es = 1 - s * s, "x0" in this || (this.x0 = 0), "y0" in this || (this.y0 = 0), this.e = Math.sqrt(this.es), this.lat_ts ? this.sphere ? this.k0 = Math.cos(this.lat_ts) : this.k0 = Xt(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts)) : this.k0 || (this.k ? this.k0 = this.k : this.k0 = 1);
}
function xl(s) {
  var t = s.x, e = s.y;
  if (e * Lt > 90 && e * Lt < -90 && t * Lt > 180 && t * Lt < -180)
    return null;
  var a, r;
  if (Math.abs(Math.abs(e) - I) <= O)
    return null;
  if (this.sphere)
    a = this.x0 + this.a * this.k0 * N(t - this.long0, this.over), r = this.y0 + this.a * this.k0 * Math.log(Math.tan(tt + 0.5 * e));
  else {
    var o = Math.sin(e), l = Zt(this.e, e, o);
    a = this.x0 + this.a * this.k0 * N(t - this.long0, this.over), r = this.y0 - this.a * this.k0 * Math.log(l);
  }
  return s.x = a, s.y = r, s;
}
function Pl(s) {
  var t = s.x - this.x0, e = s.y - this.y0, a, r;
  if (this.sphere)
    r = I - 2 * Math.atan(Math.exp(-e / (this.a * this.k0)));
  else {
    var o = Math.exp(-e / (this.a * this.k0));
    if (r = Pe(this.e, o), r === -9999)
      return null;
  }
  return a = N(this.long0 + t / (this.a * this.k0), this.over), s.x = a, s.y = r, s;
}
var bl = ["Mercator", "Popular Visualisation Pseudo Mercator", "Mercator_1SP", "Mercator_Auxiliary_Sphere", "Mercator_Variant_A", "merc"];
const El = {
  init: wl,
  forward: xl,
  inverse: Pl,
  names: bl
};
function Sl() {
}
function ar(s) {
  return s;
}
var Ir = ["longlat", "identity"];
const Al = {
  init: Sl,
  forward: ar,
  inverse: ar,
  names: Ir
};
var Ll = [El, Al], gi = {}, Oi = [];
function Gr(s, t) {
  var e = Oi.length;
  return s.names ? (Oi[e] = s, s.names.forEach(function(a) {
    gi[a.toLowerCase()] = e;
  }), this) : (console.log(t), !0);
}
function Or(s) {
  return s.replace(/[-\(\)\s]+/g, " ").trim().replace(/ /g, "_");
}
function Tl(s) {
  if (!s)
    return !1;
  var t = s.toLowerCase();
  if (typeof gi[t] < "u" && Oi[gi[t]] || (t = Or(t), t in gi && Oi[gi[t]]))
    return Oi[gi[t]];
}
function Cl() {
  Ll.forEach(Gr);
}
const Il = {
  start: Cl,
  add: Gr,
  get: Tl
};
var Nr = {
  MERIT: {
    a: 6378137,
    rf: 298.257,
    ellipseName: "MERIT 1983"
  },
  SGS85: {
    a: 6378136,
    rf: 298.257,
    ellipseName: "Soviet Geodetic System 85"
  },
  GRS80: {
    a: 6378137,
    rf: 298.257222101,
    ellipseName: "GRS 1980(IUGG, 1980)"
  },
  IAU76: {
    a: 6378140,
    rf: 298.257,
    ellipseName: "IAU 1976"
  },
  airy: {
    a: 6377563396e-3,
    b: 635625691e-2,
    ellipseName: "Airy 1830"
  },
  APL4: {
    a: 6378137,
    rf: 298.25,
    ellipseName: "Appl. Physics. 1965"
  },
  NWL9D: {
    a: 6378145,
    rf: 298.25,
    ellipseName: "Naval Weapons Lab., 1965"
  },
  mod_airy: {
    a: 6377340189e-3,
    b: 6356034446e-3,
    ellipseName: "Modified Airy"
  },
  andrae: {
    a: 637710443e-2,
    rf: 300,
    ellipseName: "Andrae 1876 (Den., Iclnd.)"
  },
  aust_SA: {
    a: 6378160,
    rf: 298.25,
    ellipseName: "Australian Natl & S. Amer. 1969"
  },
  GRS67: {
    a: 6378160,
    rf: 298.247167427,
    ellipseName: "GRS 67(IUGG 1967)"
  },
  bessel: {
    a: 6377397155e-3,
    rf: 299.1528128,
    ellipseName: "Bessel 1841"
  },
  bess_nam: {
    a: 6377483865e-3,
    rf: 299.1528128,
    ellipseName: "Bessel 1841 (Namibia)"
  },
  clrk66: {
    a: 63782064e-1,
    b: 63565838e-1,
    ellipseName: "Clarke 1866"
  },
  clrk80: {
    a: 6378249145e-3,
    rf: 293.4663,
    ellipseName: "Clarke 1880 mod."
  },
  clrk80ign: {
    a: 63782492e-1,
    b: 6356515,
    rf: 293.4660213,
    ellipseName: "Clarke 1880 (IGN)"
  },
  clrk58: {
    a: 6378293645208759e-9,
    rf: 294.2606763692654,
    ellipseName: "Clarke 1858"
  },
  CPM: {
    a: 63757387e-1,
    rf: 334.29,
    ellipseName: "Comm. des Poids et Mesures 1799"
  },
  delmbr: {
    a: 6376428,
    rf: 311.5,
    ellipseName: "Delambre 1810 (Belgium)"
  },
  engelis: {
    a: 637813605e-2,
    rf: 298.2566,
    ellipseName: "Engelis 1985"
  },
  evrst30: {
    a: 6377276345e-3,
    rf: 300.8017,
    ellipseName: "Everest 1830"
  },
  evrst48: {
    a: 6377304063e-3,
    rf: 300.8017,
    ellipseName: "Everest 1948"
  },
  evrst56: {
    a: 6377301243e-3,
    rf: 300.8017,
    ellipseName: "Everest 1956"
  },
  evrst69: {
    a: 6377295664e-3,
    rf: 300.8017,
    ellipseName: "Everest 1969"
  },
  evrstSS: {
    a: 6377298556e-3,
    rf: 300.8017,
    ellipseName: "Everest (Sabah & Sarawak)"
  },
  fschr60: {
    a: 6378166,
    rf: 298.3,
    ellipseName: "Fischer (Mercury Datum) 1960"
  },
  fschr60m: {
    a: 6378155,
    rf: 298.3,
    ellipseName: "Fischer 1960"
  },
  fschr68: {
    a: 6378150,
    rf: 298.3,
    ellipseName: "Fischer 1968"
  },
  helmert: {
    a: 6378200,
    rf: 298.3,
    ellipseName: "Helmert 1906"
  },
  hough: {
    a: 6378270,
    rf: 297,
    ellipseName: "Hough"
  },
  intl: {
    a: 6378388,
    rf: 297,
    ellipseName: "International 1909 (Hayford)"
  },
  kaula: {
    a: 6378163,
    rf: 298.24,
    ellipseName: "Kaula 1961"
  },
  lerch: {
    a: 6378139,
    rf: 298.257,
    ellipseName: "Lerch 1979"
  },
  mprts: {
    a: 6397300,
    rf: 191,
    ellipseName: "Maupertius 1738"
  },
  new_intl: {
    a: 63781575e-1,
    b: 63567722e-1,
    ellipseName: "New International 1967"
  },
  plessis: {
    a: 6376523,
    rf: 6355863,
    ellipseName: "Plessis 1817 (France)"
  },
  krass: {
    a: 6378245,
    rf: 298.3,
    ellipseName: "Krassovsky, 1942"
  },
  SEasia: {
    a: 6378155,
    b: 63567733205e-4,
    ellipseName: "Southeast Asia"
  },
  walbeck: {
    a: 6376896,
    b: 63558348467e-4,
    ellipseName: "Walbeck"
  },
  WGS60: {
    a: 6378165,
    rf: 298.3,
    ellipseName: "WGS 60"
  },
  WGS66: {
    a: 6378145,
    rf: 298.25,
    ellipseName: "WGS 66"
  },
  WGS7: {
    a: 6378135,
    rf: 298.26,
    ellipseName: "WGS 72"
  },
  WGS84: {
    a: 6378137,
    rf: 298.257223563,
    ellipseName: "WGS 84"
  },
  sphere: {
    a: 6370997,
    b: 6370997,
    ellipseName: "Normal Sphere (r=6370997)"
  }
};
const Gl = Nr.WGS84;
function Ol(s, t, e, a) {
  var r = s * s, o = t * t, l = (r - o) / r, u = 0;
  a ? (s *= 1 - l * ($h + l * (Jh + l * Qh)), r = s * s, l = 0) : u = Math.sqrt(l);
  var c = (r - o) / o;
  return {
    es: l,
    e: u,
    ep2: c
  };
}
function Nl(s, t, e, a, r) {
  if (!s) {
    var o = hi(Nr, a);
    o || (o = Gl), s = o.a, t = o.b, e = o.rf;
  }
  return e && !t && (t = (1 - 1 / e) * s), (e === 0 || Math.abs(s - t) < O) && (r = !0, t = s), {
    a: s,
    b: t,
    rf: e,
    sphere: r
  };
}
var es = {
  wgs84: {
    towgs84: "0,0,0",
    ellipse: "WGS84",
    datumName: "WGS84"
  },
  ch1903: {
    towgs84: "674.374,15.056,405.346",
    ellipse: "bessel",
    datumName: "swiss"
  },
  ggrs87: {
    towgs84: "-199.87,74.79,246.62",
    ellipse: "GRS80",
    datumName: "Greek_Geodetic_Reference_System_1987"
  },
  nad83: {
    towgs84: "0,0,0",
    ellipse: "GRS80",
    datumName: "North_American_Datum_1983"
  },
  nad27: {
    nadgrids: "@conus,@alaska,@ntv2_0.gsb,@ntv1_can.dat",
    ellipse: "clrk66",
    datumName: "North_American_Datum_1927"
  },
  potsdam: {
    towgs84: "598.1,73.7,418.2,0.202,0.045,-2.455,6.7",
    ellipse: "bessel",
    datumName: "Potsdam Rauenberg 1950 DHDN"
  },
  carthage: {
    towgs84: "-263.0,6.0,431.0",
    ellipse: "clark80",
    datumName: "Carthage 1934 Tunisia"
  },
  hermannskogel: {
    towgs84: "577.326,90.129,463.919,5.137,1.474,5.297,2.4232",
    ellipse: "bessel",
    datumName: "Hermannskogel"
  },
  mgi: {
    towgs84: "577.326,90.129,463.919,5.137,1.474,5.297,2.4232",
    ellipse: "bessel",
    datumName: "Militar-Geographische Institut"
  },
  osni52: {
    towgs84: "482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",
    ellipse: "airy",
    datumName: "Irish National"
  },
  ire65: {
    towgs84: "482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",
    ellipse: "mod_airy",
    datumName: "Ireland 1965"
  },
  rassadiran: {
    towgs84: "-133.63,-157.5,-158.62",
    ellipse: "intl",
    datumName: "Rassadiran"
  },
  nzgd49: {
    towgs84: "59.47,-5.04,187.44,0.47,-0.1,1.024,-4.5993",
    ellipse: "intl",
    datumName: "New Zealand Geodetic Datum 1949"
  },
  osgb36: {
    towgs84: "446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894",
    ellipse: "airy",
    datumName: "Ordnance Survey of Great Britain 1936"
  },
  s_jtsk: {
    towgs84: "589,76,480",
    ellipse: "bessel",
    datumName: "S-JTSK (Ferro)"
  },
  beduaram: {
    towgs84: "-106,-87,188",
    ellipse: "clrk80",
    datumName: "Beduaram"
  },
  gunung_segara: {
    towgs84: "-403,684,41",
    ellipse: "bessel",
    datumName: "Gunung Segara Jakarta"
  },
  rnb72: {
    towgs84: "106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1",
    ellipse: "intl",
    datumName: "Reseau National Belge 1972"
  },
  EPSG_5451: {
    towgs84: "6.41,-49.05,-11.28,1.5657,0.5242,6.9718,-5.7649"
  },
  IGNF_LURESG: {
    towgs84: "-192.986,13.673,-39.309,-0.4099,-2.9332,2.6881,0.43"
  },
  EPSG_4614: {
    towgs84: "-119.4248,-303.65872,-11.00061,1.164298,0.174458,1.096259,3.657065"
  },
  EPSG_4615: {
    towgs84: "-494.088,-312.129,279.877,-1.423,-1.013,1.59,-0.748"
  },
  ESRI_37241: {
    towgs84: "-76.822,257.457,-12.817,2.136,-0.033,-2.392,-0.031"
  },
  ESRI_37249: {
    towgs84: "-440.296,58.548,296.265,1.128,10.202,4.559,-0.438"
  },
  ESRI_37245: {
    towgs84: "-511.151,-181.269,139.609,1.05,2.703,1.798,3.071"
  },
  EPSG_4178: {
    towgs84: "24.9,-126.4,-93.2,-0.063,-0.247,-0.041,1.01"
  },
  EPSG_4622: {
    towgs84: "-472.29,-5.63,-304.12,0.4362,-0.8374,0.2563,1.8984"
  },
  EPSG_4625: {
    towgs84: "126.93,547.94,130.41,-2.7867,5.1612,-0.8584,13.8227"
  },
  EPSG_5252: {
    towgs84: "0.023,0.036,-0.068,0.00176,0.00912,-0.01136,0.00439"
  },
  EPSG_4314: {
    towgs84: "597.1,71.4,412.1,0.894,0.068,-1.563,7.58"
  },
  EPSG_4282: {
    towgs84: "-178.3,-316.7,-131.5,5.278,6.077,10.979,19.166"
  },
  EPSG_4231: {
    towgs84: "-83.11,-97.38,-117.22,0.0276,-0.2167,0.2147,0.1218"
  },
  EPSG_4274: {
    towgs84: "-230.994,102.591,25.199,0.633,-0.239,0.9,1.95"
  },
  EPSG_4134: {
    towgs84: "-180.624,-225.516,173.919,-0.81,-1.898,8.336,16.71006"
  },
  EPSG_4254: {
    towgs84: "18.38,192.45,96.82,0.056,-0.142,-0.2,-0.0013"
  },
  EPSG_4159: {
    towgs84: "-194.513,-63.978,-25.759,-3.4027,3.756,-3.352,-0.9175"
  },
  EPSG_4687: {
    towgs84: "0.072,-0.507,-0.245,0.0183,-0.0003,0.007,-0.0093"
  },
  EPSG_4227: {
    towgs84: "-83.58,-397.54,458.78,-17.595,-2.847,4.256,3.225"
  },
  EPSG_4746: {
    towgs84: "599.4,72.4,419.2,-0.062,-0.022,-2.723,6.46"
  },
  EPSG_4745: {
    towgs84: "612.4,77,440.2,-0.054,0.057,-2.797,2.55"
  },
  EPSG_6311: {
    towgs84: "8.846,-4.394,-1.122,-0.00237,-0.146528,0.130428,0.783926"
  },
  EPSG_4289: {
    towgs84: "565.7381,50.4018,465.2904,-1.91514,1.60363,-9.09546,4.07244"
  },
  EPSG_4230: {
    towgs84: "-68.863,-134.888,-111.49,-0.53,-0.14,0.57,-3.4"
  },
  EPSG_4154: {
    towgs84: "-123.02,-158.95,-168.47"
  },
  EPSG_4156: {
    towgs84: "570.8,85.7,462.8,4.998,1.587,5.261,3.56"
  },
  EPSG_4299: {
    towgs84: "482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15"
  },
  EPSG_4179: {
    towgs84: "33.4,-146.6,-76.3,-0.359,-0.053,0.844,-0.84"
  },
  EPSG_4313: {
    towgs84: "-106.8686,52.2978,-103.7239,0.3366,-0.457,1.8422,-1.2747"
  },
  EPSG_4194: {
    towgs84: "163.511,127.533,-159.789"
  },
  EPSG_4195: {
    towgs84: "105,326,-102.5"
  },
  EPSG_4196: {
    towgs84: "-45,417,-3.5"
  },
  EPSG_4611: {
    towgs84: "-162.619,-276.959,-161.764,0.067753,-2.243649,-1.158827,-1.094246"
  },
  EPSG_4633: {
    towgs84: "137.092,131.66,91.475,-1.9436,-11.5993,-4.3321,-7.4824"
  },
  EPSG_4641: {
    towgs84: "-408.809,366.856,-412.987,1.8842,-0.5308,2.1655,-121.0993"
  },
  EPSG_4643: {
    towgs84: "-480.26,-438.32,-643.429,16.3119,20.1721,-4.0349,-111.7002"
  },
  EPSG_4300: {
    towgs84: "482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15"
  },
  EPSG_4188: {
    towgs84: "482.5,-130.6,564.6,-1.042,-0.214,-0.631,8.15"
  },
  EPSG_4660: {
    towgs84: "982.6087,552.753,-540.873,32.39344,-153.25684,-96.2266,16.805"
  },
  EPSG_4662: {
    towgs84: "97.295,-263.247,310.882,-1.5999,0.8386,3.1409,13.3259"
  },
  EPSG_3906: {
    towgs84: "577.88891,165.22205,391.18289,4.9145,-0.94729,-13.05098,7.78664"
  },
  EPSG_4307: {
    towgs84: "-209.3622,-87.8162,404.6198,0.0046,3.4784,0.5805,-1.4547"
  },
  EPSG_6892: {
    towgs84: "-76.269,-16.683,68.562,-6.275,10.536,-4.286,-13.686"
  },
  EPSG_4690: {
    towgs84: "221.597,152.441,176.523,2.403,1.3893,0.884,11.4648"
  },
  EPSG_4691: {
    towgs84: "218.769,150.75,176.75,3.5231,2.0037,1.288,10.9817"
  },
  EPSG_4629: {
    towgs84: "72.51,345.411,79.241,-1.5862,-0.8826,-0.5495,1.3653"
  },
  EPSG_4630: {
    towgs84: "165.804,216.213,180.26,-0.6251,-0.4515,-0.0721,7.4111"
  },
  EPSG_4692: {
    towgs84: "217.109,86.452,23.711,0.0183,-0.0003,0.007,-0.0093"
  },
  EPSG_9333: {
    towgs84: "0,0,0,-8.393,0.749,-10.276,0"
  },
  EPSG_9059: {
    towgs84: "0,0,0"
  },
  EPSG_4312: {
    towgs84: "601.705,84.263,485.227,4.7354,1.3145,5.393,-2.3887"
  },
  EPSG_4123: {
    towgs84: "-96.062,-82.428,-121.753,4.801,0.345,-1.376,1.496"
  },
  EPSG_4309: {
    towgs84: "-124.45,183.74,44.64,-0.4384,0.5446,-0.9706,-2.1365"
  },
  ESRI_104106: {
    towgs84: "-283.088,-70.693,117.445,-1.157,0.059,-0.652,-4.058"
  },
  EPSG_4281: {
    towgs84: "-219.247,-73.802,269.529"
  },
  EPSG_4322: {
    towgs84: "0,0,4.5"
  },
  EPSG_4324: {
    towgs84: "0,0,1.9"
  },
  EPSG_4284: {
    towgs84: "43.822,-108.842,-119.585,1.455,-0.761,0.737,0.549"
  },
  EPSG_4277: {
    towgs84: "446.448,-125.157,542.06,0.15,0.247,0.842,-20.489"
  },
  EPSG_4207: {
    towgs84: "-282.1,-72.2,120,-1.529,0.145,-0.89,-4.46"
  },
  EPSG_4688: {
    towgs84: "347.175,1077.618,2623.677,33.9058,-70.6776,9.4013,186.0647"
  },
  EPSG_4689: {
    towgs84: "410.793,54.542,80.501,-2.5596,-2.3517,-0.6594,17.3218"
  },
  EPSG_4720: {
    towgs84: "0,0,4.5"
  },
  EPSG_4273: {
    towgs84: "278.3,93,474.5,7.889,0.05,-6.61,6.21"
  },
  EPSG_4240: {
    towgs84: "204.64,834.74,293.8"
  },
  EPSG_4817: {
    towgs84: "278.3,93,474.5,7.889,0.05,-6.61,6.21"
  },
  ESRI_104131: {
    towgs84: "426.62,142.62,460.09,4.98,4.49,-12.42,-17.1"
  },
  EPSG_4265: {
    towgs84: "-104.1,-49.1,-9.9,0.971,-2.917,0.714,-11.68"
  },
  EPSG_4263: {
    towgs84: "-111.92,-87.85,114.5,1.875,0.202,0.219,0.032"
  },
  EPSG_4298: {
    towgs84: "-689.5937,623.84046,-65.93566,-0.02331,1.17094,-0.80054,5.88536"
  },
  EPSG_4270: {
    towgs84: "-253.4392,-148.452,386.5267,0.15605,0.43,-0.1013,-0.0424"
  },
  EPSG_4229: {
    towgs84: "-121.8,98.1,-10.7"
  },
  EPSG_4220: {
    towgs84: "-55.5,-348,-229.2"
  },
  EPSG_4214: {
    towgs84: "12.646,-155.176,-80.863"
  },
  EPSG_4232: {
    towgs84: "-345,3,223"
  },
  EPSG_4238: {
    towgs84: "-1.977,-13.06,-9.993,0.364,0.254,0.689,-1.037"
  },
  EPSG_4168: {
    towgs84: "-170,33,326"
  },
  EPSG_4131: {
    towgs84: "199,931,318.9"
  },
  EPSG_4152: {
    towgs84: "-0.9102,2.0141,0.5602,0.029039,0.010065,0.010101,0"
  },
  EPSG_5228: {
    towgs84: "572.213,85.334,461.94,4.9732,1.529,5.2484,3.5378"
  },
  EPSG_8351: {
    towgs84: "485.021,169.465,483.839,7.786342,4.397554,4.102655,0"
  },
  EPSG_4683: {
    towgs84: "-127.62,-67.24,-47.04,-3.068,4.903,1.578,-1.06"
  },
  EPSG_4133: {
    towgs84: "0,0,0"
  },
  EPSG_7373: {
    towgs84: "0.819,-0.5762,-1.6446,-0.00378,-0.03317,0.00318,0.0693"
  },
  EPSG_9075: {
    towgs84: "-0.9102,2.0141,0.5602,0.029039,0.010065,0.010101,0"
  },
  EPSG_9072: {
    towgs84: "-0.9102,2.0141,0.5602,0.029039,0.010065,0.010101,0"
  },
  EPSG_9294: {
    towgs84: "1.16835,-1.42001,-2.24431,-0.00822,-0.05508,0.01818,0.23388"
  },
  EPSG_4212: {
    towgs84: "-267.434,173.496,181.814,-13.4704,8.7154,7.3926,14.7492"
  },
  EPSG_4191: {
    towgs84: "-44.183,-0.58,-38.489,2.3867,2.7072,-3.5196,-8.2703"
  },
  EPSG_4237: {
    towgs84: "52.684,-71.194,-13.975,-0.312,-0.1063,-0.3729,1.0191"
  },
  EPSG_4740: {
    towgs84: "-1.08,-0.27,-0.9"
  },
  EPSG_4124: {
    towgs84: "419.3836,99.3335,591.3451,0.850389,1.817277,-7.862238,-0.99496"
  },
  EPSG_5681: {
    towgs84: "584.9636,107.7175,413.8067,1.1155,0.2824,-3.1384,7.9922"
  },
  EPSG_4141: {
    towgs84: "23.772,17.49,17.859,-0.3132,-1.85274,1.67299,-5.4262"
  },
  EPSG_4204: {
    towgs84: "-85.645,-273.077,-79.708,2.289,-1.421,2.532,3.194"
  },
  EPSG_4319: {
    towgs84: "226.702,-193.337,-35.371,-2.229,-4.391,9.238,0.9798"
  },
  EPSG_4200: {
    towgs84: "24.82,-131.21,-82.66"
  },
  EPSG_4130: {
    towgs84: "0,0,0"
  },
  EPSG_4127: {
    towgs84: "-82.875,-57.097,-156.768,-2.158,1.524,-0.982,-0.359"
  },
  EPSG_4149: {
    towgs84: "674.374,15.056,405.346"
  },
  EPSG_4617: {
    towgs84: "-0.991,1.9072,0.5129,1.25033e-7,4.6785e-8,5.6529e-8,0"
  },
  EPSG_4663: {
    towgs84: "-210.502,-66.902,-48.476,2.094,-15.067,-5.817,0.485"
  },
  EPSG_4664: {
    towgs84: "-211.939,137.626,58.3,-0.089,0.251,0.079,0.384"
  },
  EPSG_4665: {
    towgs84: "-105.854,165.589,-38.312,-0.003,-0.026,0.024,-0.048"
  },
  EPSG_4666: {
    towgs84: "631.392,-66.551,481.442,1.09,-4.445,-4.487,-4.43"
  },
  EPSG_4756: {
    towgs84: "-192.873,-39.382,-111.202,-0.00205,-0.0005,0.00335,0.0188"
  },
  EPSG_4723: {
    towgs84: "-179.483,-69.379,-27.584,-7.862,8.163,6.042,-13.925"
  },
  EPSG_4726: {
    towgs84: "8.853,-52.644,180.304,-0.393,-2.323,2.96,-24.081"
  },
  EPSG_4267: {
    towgs84: "-8.0,160.0,176.0"
  },
  EPSG_5365: {
    towgs84: "-0.16959,0.35312,0.51846,0.03385,-0.16325,0.03446,0.03693"
  },
  EPSG_4218: {
    towgs84: "304.5,306.5,-318.1"
  },
  EPSG_4242: {
    towgs84: "-33.722,153.789,94.959,-8.581,-4.478,4.54,8.95"
  },
  EPSG_4216: {
    towgs84: "-292.295,248.758,429.447,4.9971,2.99,6.6906,1.0289"
  },
  ESRI_104105: {
    towgs84: "631.392,-66.551,481.442,1.09,-4.445,-4.487,-4.43"
  },
  ESRI_104129: {
    towgs84: "0,0,0"
  },
  EPSG_4673: {
    towgs84: "174.05,-25.49,112.57"
  },
  EPSG_4202: {
    towgs84: "-124,-60,154"
  },
  EPSG_4203: {
    towgs84: "-117.763,-51.51,139.061,0.292,0.443,0.277,-0.191"
  },
  EPSG_3819: {
    towgs84: "595.48,121.69,515.35,4.115,-2.9383,0.853,-3.408"
  },
  EPSG_8694: {
    towgs84: "-93.799,-132.737,-219.073,-1.844,0.648,-6.37,-0.169"
  },
  EPSG_4145: {
    towgs84: "275.57,676.78,229.6"
  },
  EPSG_4283: {
    towgs84: "61.55,-10.87,-40.19,39.4924,32.7221,32.8979,-9.994"
  },
  EPSG_4317: {
    towgs84: "2.3287,-147.0425,-92.0802,-0.3092483,0.32482185,0.49729934,5.68906266"
  },
  EPSG_4272: {
    towgs84: "59.47,-5.04,187.44,0.47,-0.1,1.024,-4.5993"
  },
  EPSG_4248: {
    towgs84: "-307.7,265.3,-363.5"
  },
  EPSG_5561: {
    towgs84: "24,-121,-76"
  },
  EPSG_5233: {
    towgs84: "-0.293,766.95,87.713,0.195704,1.695068,3.473016,-0.039338"
  },
  ESRI_104130: {
    towgs84: "-86,-98,-119"
  },
  ESRI_104102: {
    towgs84: "682,-203,480"
  },
  ESRI_37207: {
    towgs84: "7,-10,-26"
  },
  EPSG_4675: {
    towgs84: "59.935,118.4,-10.871"
  },
  ESRI_104109: {
    towgs84: "-89.121,-348.182,260.871"
  },
  ESRI_104112: {
    towgs84: "-185.583,-230.096,281.361"
  },
  ESRI_104113: {
    towgs84: "25.1,-275.6,222.6"
  },
  IGNF_WGS72G: {
    towgs84: "0,12,6"
  },
  IGNF_NTFG: {
    towgs84: "-168,-60,320"
  },
  IGNF_EFATE57G: {
    towgs84: "-127,-769,472"
  },
  IGNF_PGP50G: {
    towgs84: "324.8,153.6,172.1"
  },
  IGNF_REUN47G: {
    towgs84: "94,-948,-1262"
  },
  IGNF_CSG67G: {
    towgs84: "-186,230,110"
  },
  IGNF_GUAD48G: {
    towgs84: "-467,-16,-300"
  },
  IGNF_TAHI51G: {
    towgs84: "162,117,154"
  },
  IGNF_TAHAAG: {
    towgs84: "65,342,77"
  },
  IGNF_NUKU72G: {
    towgs84: "84,274,65"
  },
  IGNF_PETRELS72G: {
    towgs84: "365,194,166"
  },
  IGNF_WALL78G: {
    towgs84: "253,-133,-127"
  },
  IGNF_MAYO50G: {
    towgs84: "-382,-59,-262"
  },
  IGNF_TANNAG: {
    towgs84: "-139,-967,436"
  },
  IGNF_IGN72G: {
    towgs84: "-13,-348,292"
  },
  IGNF_ATIGG: {
    towgs84: "1118,23,66"
  },
  IGNF_FANGA84G: {
    towgs84: "150.57,158.33,118.32"
  },
  IGNF_RUSAT84G: {
    towgs84: "202.13,174.6,-15.74"
  },
  IGNF_KAUE70G: {
    towgs84: "126.74,300.1,-75.49"
  },
  IGNF_MOP90G: {
    towgs84: "-10.8,-1.8,12.77"
  },
  IGNF_MHPF67G: {
    towgs84: "338.08,212.58,-296.17"
  },
  IGNF_TAHI79G: {
    towgs84: "160.61,116.05,153.69"
  },
  IGNF_ANAA92G: {
    towgs84: "1.5,3.84,4.81"
  },
  IGNF_MARQUI72G: {
    towgs84: "330.91,-13.92,58.56"
  },
  IGNF_APAT86G: {
    towgs84: "143.6,197.82,74.05"
  },
  IGNF_TUBU69G: {
    towgs84: "237.17,171.61,-77.84"
  },
  IGNF_STPM50G: {
    towgs84: "11.363,424.148,373.13"
  },
  EPSG_4150: {
    towgs84: "674.374,15.056,405.346"
  },
  EPSG_4754: {
    towgs84: "-208.4058,-109.8777,-2.5764"
  },
  ESRI_104101: {
    towgs84: "374,150,588"
  },
  EPSG_4693: {
    towgs84: "0,-0.15,0.68"
  },
  EPSG_6207: {
    towgs84: "293.17,726.18,245.36"
  },
  EPSG_4153: {
    towgs84: "-133.63,-157.5,-158.62"
  },
  EPSG_4132: {
    towgs84: "-241.54,-163.64,396.06"
  },
  EPSG_4221: {
    towgs84: "-154.5,150.7,100.4"
  },
  EPSG_4266: {
    towgs84: "-80.7,-132.5,41.1"
  },
  EPSG_4193: {
    towgs84: "-70.9,-151.8,-41.4"
  },
  EPSG_5340: {
    towgs84: "-0.41,0.46,-0.35"
  },
  EPSG_4246: {
    towgs84: "-294.7,-200.1,525.5"
  },
  EPSG_4318: {
    towgs84: "-3.2,-5.7,2.8"
  },
  EPSG_4121: {
    towgs84: "-199.87,74.79,246.62"
  },
  EPSG_4223: {
    towgs84: "-260.1,5.5,432.2"
  },
  EPSG_4158: {
    towgs84: "-0.465,372.095,171.736"
  },
  EPSG_4285: {
    towgs84: "-128.16,-282.42,21.93"
  },
  EPSG_4613: {
    towgs84: "-404.78,685.68,45.47"
  },
  EPSG_4607: {
    towgs84: "195.671,332.517,274.607"
  },
  EPSG_4475: {
    towgs84: "-381.788,-57.501,-256.673"
  },
  EPSG_4208: {
    towgs84: "-157.84,308.54,-146.6"
  },
  EPSG_4743: {
    towgs84: "70.995,-335.916,262.898"
  },
  EPSG_4710: {
    towgs84: "-323.65,551.39,-491.22"
  },
  EPSG_7881: {
    towgs84: "-0.077,0.079,0.086"
  },
  EPSG_4682: {
    towgs84: "283.729,735.942,261.143"
  },
  EPSG_4739: {
    towgs84: "-156,-271,-189"
  },
  EPSG_4679: {
    towgs84: "-80.01,253.26,291.19"
  },
  EPSG_4750: {
    towgs84: "-56.263,16.136,-22.856"
  },
  EPSG_4644: {
    towgs84: "-10.18,-350.43,291.37"
  },
  EPSG_4695: {
    towgs84: "-103.746,-9.614,-255.95"
  },
  EPSG_4292: {
    towgs84: "-355,21,72"
  },
  EPSG_4302: {
    towgs84: "-61.702,284.488,472.052"
  },
  EPSG_4143: {
    towgs84: "-124.76,53,466.79"
  },
  EPSG_4606: {
    towgs84: "-153,153,307"
  },
  EPSG_4699: {
    towgs84: "-770.1,158.4,-498.2"
  },
  EPSG_4247: {
    towgs84: "-273.5,110.6,-357.9"
  },
  EPSG_4160: {
    towgs84: "8.88,184.86,106.69"
  },
  EPSG_4161: {
    towgs84: "-233.43,6.65,173.64"
  },
  EPSG_9251: {
    towgs84: "-9.5,122.9,138.2"
  },
  EPSG_9253: {
    towgs84: "-78.1,101.6,133.3"
  },
  EPSG_4297: {
    towgs84: "-198.383,-240.517,-107.909"
  },
  EPSG_4269: {
    towgs84: "0,0,0"
  },
  EPSG_4301: {
    towgs84: "-147,506,687"
  },
  EPSG_4618: {
    towgs84: "-59,-11,-52"
  },
  EPSG_4612: {
    towgs84: "0,0,0"
  },
  EPSG_4678: {
    towgs84: "44.585,-131.212,-39.544"
  },
  EPSG_4250: {
    towgs84: "-130,29,364"
  },
  EPSG_4144: {
    towgs84: "214,804,268"
  },
  EPSG_4147: {
    towgs84: "-17.51,-108.32,-62.39"
  },
  EPSG_4259: {
    towgs84: "-254.1,-5.36,-100.29"
  },
  EPSG_4164: {
    towgs84: "-76,-138,67"
  },
  EPSG_4211: {
    towgs84: "-378.873,676.002,-46.255"
  },
  EPSG_4182: {
    towgs84: "-422.651,-172.995,84.02"
  },
  EPSG_4224: {
    towgs84: "-143.87,243.37,-33.52"
  },
  EPSG_4225: {
    towgs84: "-205.57,168.77,-4.12"
  },
  EPSG_5527: {
    towgs84: "-67.35,3.88,-38.22"
  },
  EPSG_4752: {
    towgs84: "98,390,-22"
  },
  EPSG_4310: {
    towgs84: "-30,190,89"
  },
  EPSG_9248: {
    towgs84: "-192.26,65.72,132.08"
  },
  EPSG_4680: {
    towgs84: "124.5,-63.5,-281"
  },
  EPSG_4701: {
    towgs84: "-79.9,-158,-168.9"
  },
  EPSG_4706: {
    towgs84: "-146.21,112.63,4.05"
  },
  EPSG_4805: {
    towgs84: "682,-203,480"
  },
  EPSG_4201: {
    towgs84: "-165,-11,206"
  },
  EPSG_4210: {
    towgs84: "-157,-2,-299"
  },
  EPSG_4183: {
    towgs84: "-104,167,-38"
  },
  EPSG_4139: {
    towgs84: "11,72,-101"
  },
  EPSG_4668: {
    towgs84: "-86,-98,-119"
  },
  EPSG_4717: {
    towgs84: "-2,151,181"
  },
  EPSG_4732: {
    towgs84: "102,52,-38"
  },
  EPSG_4280: {
    towgs84: "-377,681,-50"
  },
  EPSG_4209: {
    towgs84: "-138,-105,-289"
  },
  EPSG_4261: {
    towgs84: "31,146,47"
  },
  EPSG_4658: {
    towgs84: "-73,46,-86"
  },
  EPSG_4721: {
    towgs84: "265.025,384.929,-194.046"
  },
  EPSG_4222: {
    towgs84: "-136,-108,-292"
  },
  EPSG_4601: {
    towgs84: "-255,-15,71"
  },
  EPSG_4602: {
    towgs84: "725,685,536"
  },
  EPSG_4603: {
    towgs84: "72,213.7,93"
  },
  EPSG_4605: {
    towgs84: "9,183,236"
  },
  EPSG_4621: {
    towgs84: "137,248,-430"
  },
  EPSG_4657: {
    towgs84: "-28,199,5"
  },
  EPSG_4316: {
    towgs84: "103.25,-100.4,-307.19"
  },
  EPSG_4642: {
    towgs84: "-13,-348,292"
  },
  EPSG_4698: {
    towgs84: "145,-187,103"
  },
  EPSG_4192: {
    towgs84: "-206.1,-174.7,-87.7"
  },
  EPSG_4311: {
    towgs84: "-265,120,-358"
  },
  EPSG_4135: {
    towgs84: "58,-283,-182"
  },
  ESRI_104138: {
    towgs84: "198,-226,-347"
  },
  EPSG_4245: {
    towgs84: "-11,851,5"
  },
  EPSG_4142: {
    towgs84: "-125,53,467"
  },
  EPSG_4213: {
    towgs84: "-106,-87,188"
  },
  EPSG_4253: {
    towgs84: "-133,-77,-51"
  },
  EPSG_4129: {
    towgs84: "-132,-110,-335"
  },
  EPSG_4713: {
    towgs84: "-77,-128,142"
  },
  EPSG_4239: {
    towgs84: "217,823,299"
  },
  EPSG_4146: {
    towgs84: "295,736,257"
  },
  EPSG_4155: {
    towgs84: "-83,37,124"
  },
  EPSG_4165: {
    towgs84: "-173,253,27"
  },
  EPSG_4672: {
    towgs84: "175,-38,113"
  },
  EPSG_4236: {
    towgs84: "-637,-549,-203"
  },
  EPSG_4251: {
    towgs84: "-90,40,88"
  },
  EPSG_4271: {
    towgs84: "-2,374,172"
  },
  EPSG_4175: {
    towgs84: "-88,4,101"
  },
  EPSG_4716: {
    towgs84: "298,-304,-375"
  },
  EPSG_4315: {
    towgs84: "-23,259,-9"
  },
  EPSG_4744: {
    towgs84: "-242.2,-144.9,370.3"
  },
  EPSG_4244: {
    towgs84: "-97,787,86"
  },
  EPSG_4293: {
    towgs84: "616,97,-251"
  },
  EPSG_4714: {
    towgs84: "-127,-769,472"
  },
  EPSG_4736: {
    towgs84: "260,12,-147"
  },
  EPSG_6883: {
    towgs84: "-235,-110,393"
  },
  EPSG_6894: {
    towgs84: "-63,176,185"
  },
  EPSG_4205: {
    towgs84: "-43,-163,45"
  },
  EPSG_4256: {
    towgs84: "41,-220,-134"
  },
  EPSG_4262: {
    towgs84: "639,405,60"
  },
  EPSG_4604: {
    towgs84: "174,359,365"
  },
  EPSG_4169: {
    towgs84: "-115,118,426"
  },
  EPSG_4620: {
    towgs84: "-106,-129,165"
  },
  EPSG_4184: {
    towgs84: "-203,141,53"
  },
  EPSG_4616: {
    towgs84: "-289,-124,60"
  },
  EPSG_9403: {
    towgs84: "-307,-92,127"
  },
  EPSG_4684: {
    towgs84: "-133,-321,50"
  },
  EPSG_4708: {
    towgs84: "-491,-22,435"
  },
  EPSG_4707: {
    towgs84: "114,-116,-333"
  },
  EPSG_4709: {
    towgs84: "145,75,-272"
  },
  EPSG_4712: {
    towgs84: "-205,107,53"
  },
  EPSG_4711: {
    towgs84: "124,-234,-25"
  },
  EPSG_4718: {
    towgs84: "230,-199,-752"
  },
  EPSG_4719: {
    towgs84: "211,147,111"
  },
  EPSG_4724: {
    towgs84: "208,-435,-229"
  },
  EPSG_4725: {
    towgs84: "189,-79,-202"
  },
  EPSG_4735: {
    towgs84: "647,1777,-1124"
  },
  EPSG_4722: {
    towgs84: "-794,119,-298"
  },
  EPSG_4728: {
    towgs84: "-307,-92,127"
  },
  EPSG_4734: {
    towgs84: "-632,438,-609"
  },
  EPSG_4727: {
    towgs84: "912,-58,1227"
  },
  EPSG_4729: {
    towgs84: "185,165,42"
  },
  EPSG_4730: {
    towgs84: "170,42,84"
  },
  EPSG_4733: {
    towgs84: "276,-57,149"
  },
  ESRI_37218: {
    towgs84: "230,-199,-752"
  },
  ESRI_37240: {
    towgs84: "-7,215,225"
  },
  ESRI_37221: {
    towgs84: "252,-209,-751"
  },
  ESRI_4305: {
    towgs84: "-123,-206,219"
  },
  ESRI_104139: {
    towgs84: "-73,-247,227"
  },
  EPSG_4748: {
    towgs84: "51,391,-36"
  },
  EPSG_4219: {
    towgs84: "-384,664,-48"
  },
  EPSG_4255: {
    towgs84: "-333,-222,114"
  },
  EPSG_4257: {
    towgs84: "-587.8,519.75,145.76"
  },
  EPSG_4646: {
    towgs84: "-963,510,-359"
  },
  EPSG_6881: {
    towgs84: "-24,-203,268"
  },
  EPSG_6882: {
    towgs84: "-183,-15,273"
  },
  EPSG_4715: {
    towgs84: "-104,-129,239"
  },
  IGNF_RGF93GDD: {
    towgs84: "0,0,0"
  },
  IGNF_RGM04GDD: {
    towgs84: "0,0,0"
  },
  IGNF_RGSPM06GDD: {
    towgs84: "0,0,0"
  },
  IGNF_RGTAAF07GDD: {
    towgs84: "0,0,0"
  },
  IGNF_RGFG95GDD: {
    towgs84: "0,0,0"
  },
  IGNF_RGNCG: {
    towgs84: "0,0,0"
  },
  IGNF_RGPFGDD: {
    towgs84: "0,0,0"
  },
  IGNF_ETRS89G: {
    towgs84: "0,0,0"
  },
  IGNF_RGR92GDD: {
    towgs84: "0,0,0"
  },
  EPSG_4173: {
    towgs84: "0,0,0"
  },
  EPSG_4180: {
    towgs84: "0,0,0"
  },
  EPSG_4619: {
    towgs84: "0,0,0"
  },
  EPSG_4667: {
    towgs84: "0,0,0"
  },
  EPSG_4075: {
    towgs84: "0,0,0"
  },
  EPSG_6706: {
    towgs84: "0,0,0"
  },
  EPSG_7798: {
    towgs84: "0,0,0"
  },
  EPSG_4661: {
    towgs84: "0,0,0"
  },
  EPSG_4669: {
    towgs84: "0,0,0"
  },
  EPSG_8685: {
    towgs84: "0,0,0"
  },
  EPSG_4151: {
    towgs84: "0,0,0"
  },
  EPSG_9702: {
    towgs84: "0,0,0"
  },
  EPSG_4758: {
    towgs84: "0,0,0"
  },
  EPSG_4761: {
    towgs84: "0,0,0"
  },
  EPSG_4765: {
    towgs84: "0,0,0"
  },
  EPSG_8997: {
    towgs84: "0,0,0"
  },
  EPSG_4023: {
    towgs84: "0,0,0"
  },
  EPSG_4670: {
    towgs84: "0,0,0"
  },
  EPSG_4694: {
    towgs84: "0,0,0"
  },
  EPSG_4148: {
    towgs84: "0,0,0"
  },
  EPSG_4163: {
    towgs84: "0,0,0"
  },
  EPSG_4167: {
    towgs84: "0,0,0"
  },
  EPSG_4189: {
    towgs84: "0,0,0"
  },
  EPSG_4190: {
    towgs84: "0,0,0"
  },
  EPSG_4176: {
    towgs84: "0,0,0"
  },
  EPSG_4659: {
    towgs84: "0,0,0"
  },
  EPSG_3824: {
    towgs84: "0,0,0"
  },
  EPSG_3889: {
    towgs84: "0,0,0"
  },
  EPSG_4046: {
    towgs84: "0,0,0"
  },
  EPSG_4081: {
    towgs84: "0,0,0"
  },
  EPSG_4558: {
    towgs84: "0,0,0"
  },
  EPSG_4483: {
    towgs84: "0,0,0"
  },
  EPSG_5013: {
    towgs84: "0,0,0"
  },
  EPSG_5264: {
    towgs84: "0,0,0"
  },
  EPSG_5324: {
    towgs84: "0,0,0"
  },
  EPSG_5354: {
    towgs84: "0,0,0"
  },
  EPSG_5371: {
    towgs84: "0,0,0"
  },
  EPSG_5373: {
    towgs84: "0,0,0"
  },
  EPSG_5381: {
    towgs84: "0,0,0"
  },
  EPSG_5393: {
    towgs84: "0,0,0"
  },
  EPSG_5489: {
    towgs84: "0,0,0"
  },
  EPSG_5593: {
    towgs84: "0,0,0"
  },
  EPSG_6135: {
    towgs84: "0,0,0"
  },
  EPSG_6365: {
    towgs84: "0,0,0"
  },
  EPSG_5246: {
    towgs84: "0,0,0"
  },
  EPSG_7886: {
    towgs84: "0,0,0"
  },
  EPSG_8431: {
    towgs84: "0,0,0"
  },
  EPSG_8427: {
    towgs84: "0,0,0"
  },
  EPSG_8699: {
    towgs84: "0,0,0"
  },
  EPSG_8818: {
    towgs84: "0,0,0"
  },
  EPSG_4757: {
    towgs84: "0,0,0"
  },
  EPSG_9140: {
    towgs84: "0,0,0"
  },
  EPSG_8086: {
    towgs84: "0,0,0"
  },
  EPSG_4686: {
    towgs84: "0,0,0"
  },
  EPSG_4737: {
    towgs84: "0,0,0"
  },
  EPSG_4702: {
    towgs84: "0,0,0"
  },
  EPSG_4747: {
    towgs84: "0,0,0"
  },
  EPSG_4749: {
    towgs84: "0,0,0"
  },
  EPSG_4674: {
    towgs84: "0,0,0"
  },
  EPSG_4755: {
    towgs84: "0,0,0"
  },
  EPSG_4759: {
    towgs84: "0,0,0"
  },
  EPSG_4762: {
    towgs84: "0,0,0"
  },
  EPSG_4763: {
    towgs84: "0,0,0"
  },
  EPSG_4764: {
    towgs84: "0,0,0"
  },
  EPSG_4166: {
    towgs84: "0,0,0"
  },
  EPSG_4170: {
    towgs84: "0,0,0"
  },
  EPSG_5546: {
    towgs84: "0,0,0"
  },
  EPSG_7844: {
    towgs84: "0,0,0"
  },
  EPSG_4818: {
    towgs84: "589,76,480"
  }
};
for (var Rl in es) {
  var sn = es[Rl];
  sn.datumName && (es[sn.datumName] = sn);
}
function kl(s, t, e, a, r, o, l) {
  var u = {};
  return s === void 0 || s === "none" ? u.datum_type = hn : u.datum_type = Yh, t && (u.datum_params = t.map(parseFloat), (u.datum_params[0] !== 0 || u.datum_params[1] !== 0 || u.datum_params[2] !== 0) && (u.datum_type = pi), u.datum_params.length > 3 && (u.datum_params[3] !== 0 || u.datum_params[4] !== 0 || u.datum_params[5] !== 0 || u.datum_params[6] !== 0) && (u.datum_type = vi, u.datum_params[3] *= me, u.datum_params[4] *= me, u.datum_params[5] *= me, u.datum_params[6] = u.datum_params[6] / 1e6 + 1)), l && (u.datum_type = zi, u.grids = l), u.a = e, u.b = a, u.es = r, u.ep2 = o, u;
}
var yn = {};
function zl(s, t, e) {
  return t instanceof ArrayBuffer ? Bl(s, t, e) : { ready: Dl(s, t) };
}
function Bl(s, t, e) {
  var a = !0;
  e !== void 0 && e.includeErrorFields === !1 && (a = !1);
  var r = new DataView(t), o = Ul(r), l = ql(r, o), u = jl(r, l, o, a), c = { header: l, subgrids: u };
  return yn[s] = c, c;
}
async function Dl(s, t) {
  for (var e = [], a = await t.getImageCount(), r = a - 1; r >= 0; r--) {
    var o = await t.getImage(r), l = await o.readRasters(), u = l, c = [o.getWidth(), o.getHeight()], d = o.getBoundingBox().map(rr), g = [o.fileDirectory.ModelPixelScale[0], o.fileDirectory.ModelPixelScale[1]].map(rr), m = d[0] + (c[0] - 1) * g[0], p = d[3] - (c[1] - 1) * g[1], y = u[0], M = u[1], w = [];
    for (let A = c[1] - 1; A >= 0; A--)
      for (let T = c[0] - 1; T >= 0; T--) {
        var P = A * c[0] + T;
        w.push([-ri(M[P]), ri(y[P])]);
      }
    e.push({
      del: g,
      lim: c,
      ll: [-m, p],
      cvs: w
    });
  }
  var E = {
    header: {
      nSubgrids: a
    },
    subgrids: e
  };
  return yn[s] = E, E;
}
function Fl(s) {
  if (s === void 0)
    return null;
  var t = s.split(",");
  return t.map(Zl);
}
function Zl(s) {
  if (s.length === 0)
    return null;
  var t = s[0] === "@";
  return t && (s = s.slice(1)), s === "null" ? { name: "null", mandatory: !t, grid: null, isNull: !0 } : {
    name: s,
    mandatory: !t,
    grid: yn[s] || null,
    isNull: !1
  };
}
function rr(s) {
  return s * Math.PI / 180;
}
function ri(s) {
  return s / 3600 * Math.PI / 180;
}
function Ul(s) {
  var t = s.getInt32(8, !1);
  return t === 11 ? !1 : (t = s.getInt32(8, !0), t !== 11 && console.warn("Failed to detect nadgrid endian-ness, defaulting to little-endian"), !0);
}
function ql(s, t) {
  return {
    nFields: s.getInt32(8, t),
    nSubgridFields: s.getInt32(24, t),
    nSubgrids: s.getInt32(40, t),
    shiftType: un(s, 56, 64).trim(),
    fromSemiMajorAxis: s.getFloat64(120, t),
    fromSemiMinorAxis: s.getFloat64(136, t),
    toSemiMajorAxis: s.getFloat64(152, t),
    toSemiMinorAxis: s.getFloat64(168, t)
  };
}
function un(s, t, e) {
  return String.fromCharCode.apply(null, new Uint8Array(s.buffer.slice(t, e)));
}
function jl(s, t, e, a) {
  for (var r = 176, o = [], l = 0; l < t.nSubgrids; l++) {
    var u = Hl(s, r, e), c = Xl(s, r, u, e, a), d = Math.round(
      1 + (u.upperLongitude - u.lowerLongitude) / u.longitudeInterval
    ), g = Math.round(
      1 + (u.upperLatitude - u.lowerLatitude) / u.latitudeInterval
    );
    o.push({
      ll: [ri(u.lowerLongitude), ri(u.lowerLatitude)],
      del: [ri(u.longitudeInterval), ri(u.latitudeInterval)],
      lim: [d, g],
      count: u.gridNodeCount,
      cvs: Wl(c)
    });
    var m = 16;
    a === !1 && (m = 8), r += 176 + u.gridNodeCount * m;
  }
  return o;
}
function Wl(s) {
  return s.map(function(t) {
    return [ri(t.longitudeShift), ri(t.latitudeShift)];
  });
}
function Hl(s, t, e) {
  return {
    name: un(s, t + 8, t + 16).trim(),
    parent: un(s, t + 24, t + 24 + 8).trim(),
    lowerLatitude: s.getFloat64(t + 72, e),
    upperLatitude: s.getFloat64(t + 88, e),
    lowerLongitude: s.getFloat64(t + 104, e),
    upperLongitude: s.getFloat64(t + 120, e),
    latitudeInterval: s.getFloat64(t + 136, e),
    longitudeInterval: s.getFloat64(t + 152, e),
    gridNodeCount: s.getInt32(t + 168, e)
  };
}
function Xl(s, t, e, a, r) {
  var o = t + 176, l = 16;
  r === !1 && (l = 8);
  for (var u = [], c = 0; c < e.gridNodeCount; c++) {
    var d = {
      latitudeShift: s.getFloat32(o + c * l, a),
      longitudeShift: s.getFloat32(o + c * l + 4, a)
    };
    r !== !1 && (d.latitudeAccuracy = s.getFloat32(o + c * l + 8, a), d.longitudeAccuracy = s.getFloat32(o + c * l + 12, a)), u.push(d);
  }
  return u;
}
function Rt(s, t) {
  if (!(this instanceof Rt))
    return new Rt(s);
  this.forward = null, this.inverse = null, this.init = null, this.name, this.names = null, this.title, t = t || function(d) {
    if (d)
      throw d;
  };
  var e = Ml(s);
  if (typeof e != "object") {
    t("Could not parse to valid json: " + s);
    return;
  }
  var a = Rt.projections.get(e.projName);
  if (!a) {
    t("Could not get projection name from: " + s);
    return;
  }
  if (e.datumCode && e.datumCode !== "none") {
    var r = hi(es, e.datumCode);
    r && (e.datum_params = e.datum_params || (r.towgs84 ? r.towgs84.split(",") : null), e.ellps = r.ellipse, e.datumName = r.datumName ? r.datumName : e.datumCode);
  }
  e.k0 = e.k0 || 1, e.axis = e.axis || "enu", e.ellps = e.ellps || "wgs84", e.lat1 = e.lat1 || e.lat0;
  var o = Nl(e.a, e.b, e.rf, e.ellps, e.sphere), l = Ol(o.a, o.b, o.rf, e.R_A), u = Fl(e.nadgrids), c = e.datum || kl(
    e.datumCode,
    e.datum_params,
    o.a,
    o.b,
    l.es,
    l.ep2,
    u
  );
  nr(this, e), nr(this, a), this.a = o.a, this.b = o.b, this.rf = o.rf, this.sphere = o.sphere, this.es = l.es, this.e = l.e, this.ep2 = l.ep2, this.datum = c, "init" in this && typeof this.init == "function" && this.init(), t(null, this);
}
Rt.projections = Il;
Rt.projections.start();
function Vl(s, t) {
  return s.datum_type !== t.datum_type || s.a !== t.a || Math.abs(s.es - t.es) > 5e-11 ? !1 : s.datum_type === pi ? s.datum_params[0] === t.datum_params[0] && s.datum_params[1] === t.datum_params[1] && s.datum_params[2] === t.datum_params[2] : s.datum_type === vi ? s.datum_params[0] === t.datum_params[0] && s.datum_params[1] === t.datum_params[1] && s.datum_params[2] === t.datum_params[2] && s.datum_params[3] === t.datum_params[3] && s.datum_params[4] === t.datum_params[4] && s.datum_params[5] === t.datum_params[5] && s.datum_params[6] === t.datum_params[6] : !0;
}
function Rr(s, t, e) {
  var a = s.x, r = s.y, o = s.z ? s.z : 0, l, u, c, d;
  if (r < -I && r > -1.001 * I)
    r = -I;
  else if (r > I && r < 1.001 * I)
    r = I;
  else {
    if (r < -I)
      return { x: -1 / 0, y: -1 / 0, z: s.z };
    if (r > I)
      return { x: 1 / 0, y: 1 / 0, z: s.z };
  }
  return a > Math.PI && (a -= 2 * Math.PI), u = Math.sin(r), d = Math.cos(r), c = u * u, l = e / Math.sqrt(1 - t * c), {
    x: (l + o) * d * Math.cos(a),
    y: (l + o) * d * Math.sin(a),
    z: (l * (1 - t) + o) * u
  };
}
function kr(s, t, e, a) {
  var r = 1e-12, o = r * r, l = 30, u, c, d, g, m, p, y, M, w, P, E, A, T, G = s.x, R = s.y, z = s.z ? s.z : 0, Z, X, F;
  if (u = Math.sqrt(G * G + R * R), c = Math.sqrt(G * G + R * R + z * z), u / e < r) {
    if (Z = 0, c / e < r)
      return X = I, F = -a, {
        x: s.x,
        y: s.y,
        z: s.z
      };
  } else
    Z = Math.atan2(R, G);
  d = z / c, g = u / c, m = 1 / Math.sqrt(1 - t * (2 - t) * g * g), M = g * (1 - t) * m, w = d * m, T = 0;
  do
    T++, y = e / Math.sqrt(1 - t * w * w), F = u * M + z * w - y * (1 - t * w * w), p = t * y / (y + F), m = 1 / Math.sqrt(1 - p * (2 - p) * g * g), P = g * (1 - p) * m, E = d * m, A = E * M - P * w, M = P, w = E;
  while (A * A > o && T < l);
  return X = Math.atan(E / Math.abs(P)), {
    x: Z,
    y: X,
    z: F
  };
}
function Yl(s, t, e) {
  if (t === pi)
    return {
      x: s.x + e[0],
      y: s.y + e[1],
      z: s.z + e[2]
    };
  if (t === vi) {
    var a = e[0], r = e[1], o = e[2], l = e[3], u = e[4], c = e[5], d = e[6];
    return {
      x: d * (s.x - c * s.y + u * s.z) + a,
      y: d * (c * s.x + s.y - l * s.z) + r,
      z: d * (-u * s.x + l * s.y + s.z) + o
    };
  }
}
function Kl(s, t, e) {
  if (t === pi)
    return {
      x: s.x - e[0],
      y: s.y - e[1],
      z: s.z - e[2]
    };
  if (t === vi) {
    var a = e[0], r = e[1], o = e[2], l = e[3], u = e[4], c = e[5], d = e[6], g = (s.x - a) / d, m = (s.y - r) / d, p = (s.z - o) / d;
    return {
      x: g + c * m - u * p,
      y: -c * g + m + l * p,
      z: u * g - l * m + p
    };
  }
}
function Je(s) {
  return s === pi || s === vi;
}
function $l(s, t, e) {
  if (Vl(s, t) || s.datum_type === hn || t.datum_type === hn)
    return e;
  var a = s.a, r = s.es;
  if (s.datum_type === zi) {
    var o = or(s, !1, e);
    if (o !== 0)
      return;
    a = $a, r = Ja;
  }
  var l = t.a, u = t.b, c = t.es;
  if (t.datum_type === zi && (l = $a, u = Kh, c = Ja), r === c && a === l && !Je(s.datum_type) && !Je(t.datum_type))
    return e;
  if (e = Rr(e, r, a), Je(s.datum_type) && (e = Yl(e, s.datum_type, s.datum_params)), Je(t.datum_type) && (e = Kl(e, t.datum_type, t.datum_params)), e = kr(e, c, l, u), t.datum_type === zi) {
    var d = or(t, !0, e);
    if (d !== 0)
      return;
  }
  return e;
}
function or(s, t, e) {
  if (s.grids === null || s.grids.length === 0)
    return console.log("Grid shift grids not found"), -1;
  var a = { x: -e.x, y: e.y }, r = { x: Number.NaN, y: Number.NaN }, o = [];
  t:
    for (var l = 0; l < s.grids.length; l++) {
      var u = s.grids[l];
      if (o.push(u.name), u.isNull) {
        r = a;
        break;
      }
      if (u.grid === null) {
        if (u.mandatory)
          return console.log("Unable to find mandatory grid '" + u.name + "'"), -1;
        continue;
      }
      for (var c = u.grid.subgrids, d = 0, g = c.length; d < g; d++) {
        var m = c[d], p = (Math.abs(m.del[1]) + Math.abs(m.del[0])) / 1e4, y = m.ll[0] - p, M = m.ll[1] - p, w = m.ll[0] + (m.lim[0] - 1) * m.del[0] + p, P = m.ll[1] + (m.lim[1] - 1) * m.del[1] + p;
        if (!(M > a.y || y > a.x || P < a.y || w < a.x) && (r = Jl(a, t, m), !isNaN(r.x)))
          break t;
      }
    }
  return isNaN(r.x) ? (console.log("Failed to find a grid shift table for location '" + -a.x * Lt + " " + a.y * Lt + " tried: '" + o + "'"), -1) : (e.x = -r.x, e.y = r.y, 0);
}
function Jl(s, t, e) {
  var a = { x: Number.NaN, y: Number.NaN };
  if (isNaN(s.x))
    return a;
  var r = { x: s.x, y: s.y };
  r.x -= e.ll[0], r.y -= e.ll[1], r.x = N(r.x - Math.PI) + Math.PI;
  var o = hr(r, e);
  if (t) {
    if (isNaN(o.x))
      return a;
    o.x = r.x - o.x, o.y = r.y - o.y;
    var l = 9, u = 1e-12, c, d;
    do {
      if (d = hr(o, e), isNaN(d.x)) {
        console.log("Inverse grid shift iteration failed, presumably at grid edge.  Using first approximation.");
        break;
      }
      c = { x: r.x - (d.x + o.x), y: r.y - (d.y + o.y) }, o.x += c.x, o.y += c.y;
    } while (l-- && Math.abs(c.x) > u && Math.abs(c.y) > u);
    if (l < 0)
      return console.log("Inverse grid shift iterator failed to converge."), a;
    a.x = N(o.x + e.ll[0]), a.y = o.y + e.ll[1];
  } else
    isNaN(o.x) || (a.x = s.x + o.x, a.y = s.y + o.y);
  return a;
}
function hr(s, t) {
  var e = { x: s.x / t.del[0], y: s.y / t.del[1] }, a = { x: Math.floor(e.x), y: Math.floor(e.y) }, r = { x: e.x - 1 * a.x, y: e.y - 1 * a.y }, o = { x: Number.NaN, y: Number.NaN }, l;
  if (a.x < 0 || a.x >= t.lim[0] || a.y < 0 || a.y >= t.lim[1])
    return o;
  l = a.y * t.lim[0] + a.x;
  var u = { x: t.cvs[l][0], y: t.cvs[l][1] };
  l++;
  var c = { x: t.cvs[l][0], y: t.cvs[l][1] };
  l += t.lim[0];
  var d = { x: t.cvs[l][0], y: t.cvs[l][1] };
  l--;
  var g = { x: t.cvs[l][0], y: t.cvs[l][1] }, m = r.x * r.y, p = r.x * (1 - r.y), y = (1 - r.x) * (1 - r.y), M = (1 - r.x) * r.y;
  return o.x = y * u.x + p * c.x + M * g.x + m * d.x, o.y = y * u.y + p * c.y + M * g.y + m * d.y, o;
}
function lr(s, t, e) {
  var a = e.x, r = e.y, o = e.z || 0, l, u, c, d = {};
  for (c = 0; c < 3; c++)
    if (!(t && c === 2 && e.z === void 0))
      switch (c === 0 ? (l = a, "ew".indexOf(s.axis[c]) !== -1 ? u = "x" : u = "y") : c === 1 ? (l = r, "ns".indexOf(s.axis[c]) !== -1 ? u = "y" : u = "x") : (l = o, u = "z"), s.axis[c]) {
        case "e":
          d[u] = l;
          break;
        case "w":
          d[u] = -l;
          break;
        case "n":
          d[u] = l;
          break;
        case "s":
          d[u] = -l;
          break;
        case "u":
          e[u] !== void 0 && (d.z = l);
          break;
        case "d":
          e[u] !== void 0 && (d.z = -l);
          break;
        default:
          return null;
      }
  return d;
}
function zr(s) {
  var t = {
    x: s[0],
    y: s[1]
  };
  return s.length > 2 && (t.z = s[2]), s.length > 3 && (t.m = s[3]), t;
}
function Ql(s) {
  ur(s.x), ur(s.y);
}
function ur(s) {
  if (typeof Number.isFinite == "function") {
    if (Number.isFinite(s))
      return;
    throw new TypeError("coordinates must be finite numbers");
  }
  if (typeof s != "number" || s !== s || !isFinite(s))
    throw new TypeError("coordinates must be finite numbers");
}
function tu(s, t) {
  return (s.datum.datum_type === pi || s.datum.datum_type === vi || s.datum.datum_type === zi) && t.datumCode !== "WGS84" || (t.datum.datum_type === pi || t.datum.datum_type === vi || t.datum.datum_type === zi) && s.datumCode !== "WGS84";
}
function us(s, t, e, a) {
  var r;
  Array.isArray(e) ? e = zr(e) : e = {
    x: e.x,
    y: e.y,
    z: e.z,
    m: e.m
  };
  var o = e.z !== void 0;
  if (Ql(e), s.datum && t.datum && tu(s, t) && (r = new Rt("WGS84"), e = us(s, r, e, a), s = r), a && s.axis !== "enu" && (e = lr(s, !1, e)), s.projName === "longlat")
    e = {
      x: e.x * ot,
      y: e.y * ot,
      z: e.z || 0
    };
  else if (s.to_meter && (e = {
    x: e.x * s.to_meter,
    y: e.y * s.to_meter,
    z: e.z || 0
  }), e = s.inverse(e), !e)
    return;
  if (s.from_greenwich && (e.x += s.from_greenwich), e = $l(s.datum, t.datum, e), !!e)
    return e = /** @type {import('./core').InterfaceCoordinates} */
    e, t.from_greenwich && (e = {
      x: e.x - t.from_greenwich,
      y: e.y,
      z: e.z || 0
    }), t.projName === "longlat" ? e = {
      x: e.x * Lt,
      y: e.y * Lt,
      z: e.z || 0
    } : (e = t.forward(e), t.to_meter && (e = {
      x: e.x / t.to_meter,
      y: e.y / t.to_meter,
      z: e.z || 0
    })), a && t.axis !== "enu" ? lr(t, !0, e) : (e && !o && delete e.z, e);
}
var cr = Rt("WGS84");
function nn(s, t, e, a) {
  var r, o, l;
  return Array.isArray(e) ? (r = us(s, t, e, a) || { x: NaN, y: NaN }, e.length > 2 ? typeof s.name < "u" && s.name === "geocent" || typeof t.name < "u" && t.name === "geocent" ? typeof r.z == "number" ? (
    /** @type {T} */
    [r.x, r.y, r.z].concat(e.slice(3))
  ) : (
    /** @type {T} */
    [r.x, r.y, e[2]].concat(e.slice(3))
  ) : (
    /** @type {T} */
    [r.x, r.y].concat(e.slice(2))
  ) : (
    /** @type {T} */
    [r.x, r.y]
  )) : (o = us(s, t, e, a), l = Object.keys(e), l.length === 2 || l.forEach(function(u) {
    if (typeof s.name < "u" && s.name === "geocent" || typeof t.name < "u" && t.name === "geocent") {
      if (u === "x" || u === "y" || u === "z")
        return;
    } else if (u === "x" || u === "y")
      return;
    o[u] = e[u];
  }), /** @type {T} */
  o);
}
function Qe(s) {
  return s instanceof Rt ? s : typeof s == "object" && "oProj" in s ? s.oProj : Rt(
    /** @type {string | PROJJSONDefinition} */
    s
  );
}
function iu(s, t, e) {
  var a, r, o = !1, l;
  return typeof t > "u" ? (r = Qe(s), a = cr, o = !0) : (typeof /** @type {?} */
  t.x < "u" || Array.isArray(t)) && (e = /** @type {T} */
  /** @type {?} */
  t, r = Qe(s), a = cr, o = !0), a || (a = Qe(s)), r || (r = Qe(
    /** @type {string | PROJJSONDefinition | proj } */
    t
  )), e ? nn(a, r, e) : (l = {
    /**
     * @template {TemplateCoordinates} T
     * @param {T} coords
     * @param {boolean=} enforceAxis
     * @returns {T}
     */
    forward: function(u, c) {
      return nn(a, r, u, c);
    },
    /**
     * @template {TemplateCoordinates} T
     * @param {T} coords
     * @param {boolean=} enforceAxis
     * @returns {T}
     */
    inverse: function(u, c) {
      return nn(r, a, u, c);
    }
  }, o && (l.oProj = r), l);
}
var fr = 6, Br = "AJSAJS", Dr = "AFAFAF", Ni = 65, St = 73, Nt = 79, ce = 86, fe = 90;
const eu = {
  forward: Fr,
  inverse: su,
  toPoint: Zr
};
function Fr(s, t) {
  return t = t || 5, ru(nu({
    lat: s[1],
    lon: s[0]
  }), t);
}
function su(s) {
  var t = Mn(qr(s.toUpperCase()));
  return t.lat && t.lon ? [t.lon, t.lat, t.lon, t.lat] : [t.left, t.bottom, t.right, t.top];
}
function Zr(s) {
  var t = Mn(qr(s.toUpperCase()));
  return t.lat && t.lon ? [t.lon, t.lat] : [(t.left + t.right) / 2, (t.top + t.bottom) / 2];
}
function an(s) {
  return s * (Math.PI / 180);
}
function dr(s) {
  return 180 * (s / Math.PI);
}
function nu(s) {
  var t = s.lat, e = s.lon, a = 6378137, r = 669438e-8, o = 0.9996, l, u, c, d, g, m, p, y = an(t), M = an(e), w, P;
  P = Math.floor((e + 180) / 6) + 1, e === 180 && (P = 60), t >= 56 && t < 64 && e >= 3 && e < 12 && (P = 32), t >= 72 && t < 84 && (e >= 0 && e < 9 ? P = 31 : e >= 9 && e < 21 ? P = 33 : e >= 21 && e < 33 ? P = 35 : e >= 33 && e < 42 && (P = 37)), l = (P - 1) * 6 - 180 + 3, w = an(l), u = r / (1 - r), c = a / Math.sqrt(1 - r * Math.sin(y) * Math.sin(y)), d = Math.tan(y) * Math.tan(y), g = u * Math.cos(y) * Math.cos(y), m = Math.cos(y) * (M - w), p = a * ((1 - r / 4 - 3 * r * r / 64 - 5 * r * r * r / 256) * y - (3 * r / 8 + 3 * r * r / 32 + 45 * r * r * r / 1024) * Math.sin(2 * y) + (15 * r * r / 256 + 45 * r * r * r / 1024) * Math.sin(4 * y) - 35 * r * r * r / 3072 * Math.sin(6 * y));
  var E = o * c * (m + (1 - d + g) * m * m * m / 6 + (5 - 18 * d + d * d + 72 * g - 58 * u) * m * m * m * m * m / 120) + 5e5, A = o * (p + c * Math.tan(y) * (m * m / 2 + (5 - d + 9 * g + 4 * g * g) * m * m * m * m / 24 + (61 - 58 * d + d * d + 600 * g - 330 * u) * m * m * m * m * m * m / 720));
  return t < 0 && (A += 1e7), {
    northing: Math.round(A),
    easting: Math.round(E),
    zoneNumber: P,
    zoneLetter: au(t)
  };
}
function Mn(s) {
  var t = s.northing, e = s.easting, a = s.zoneLetter, r = s.zoneNumber;
  if (r < 0 || r > 60)
    return null;
  var o = 0.9996, l = 6378137, u = 669438e-8, c, d = (1 - Math.sqrt(1 - u)) / (1 + Math.sqrt(1 - u)), g, m, p, y, M, w, P, E, A, T = e - 5e5, G = t;
  a < "N" && (G -= 1e7), P = (r - 1) * 6 - 180 + 3, c = u / (1 - u), w = G / o, E = w / (l * (1 - u / 4 - 3 * u * u / 64 - 5 * u * u * u / 256)), A = E + (3 * d / 2 - 27 * d * d * d / 32) * Math.sin(2 * E) + (21 * d * d / 16 - 55 * d * d * d * d / 32) * Math.sin(4 * E) + 151 * d * d * d / 96 * Math.sin(6 * E), g = l / Math.sqrt(1 - u * Math.sin(A) * Math.sin(A)), m = Math.tan(A) * Math.tan(A), p = c * Math.cos(A) * Math.cos(A), y = l * (1 - u) / Math.pow(1 - u * Math.sin(A) * Math.sin(A), 1.5), M = T / (g * o);
  var R = A - g * Math.tan(A) / y * (M * M / 2 - (5 + 3 * m + 10 * p - 4 * p * p - 9 * c) * M * M * M * M / 24 + (61 + 90 * m + 298 * p + 45 * m * m - 252 * c - 3 * p * p) * M * M * M * M * M * M / 720);
  R = dr(R);
  var z = (M - (1 + 2 * m + p) * M * M * M / 6 + (5 - 2 * p + 28 * m - 3 * p * p + 8 * c + 24 * m * m) * M * M * M * M * M / 120) / Math.cos(A);
  z = P + dr(z);
  var Z;
  if (s.accuracy) {
    var X = Mn({
      northing: s.northing + s.accuracy,
      easting: s.easting + s.accuracy,
      zoneLetter: s.zoneLetter,
      zoneNumber: s.zoneNumber
    });
    Z = {
      top: X.lat,
      right: X.lon,
      bottom: R,
      left: z
    };
  } else
    Z = {
      lat: R,
      lon: z
    };
  return Z;
}
function au(s) {
  var t = "Z";
  return 84 >= s && s >= 72 ? t = "X" : 72 > s && s >= 64 ? t = "W" : 64 > s && s >= 56 ? t = "V" : 56 > s && s >= 48 ? t = "U" : 48 > s && s >= 40 ? t = "T" : 40 > s && s >= 32 ? t = "S" : 32 > s && s >= 24 ? t = "R" : 24 > s && s >= 16 ? t = "Q" : 16 > s && s >= 8 ? t = "P" : 8 > s && s >= 0 ? t = "N" : 0 > s && s >= -8 ? t = "M" : -8 > s && s >= -16 ? t = "L" : -16 > s && s >= -24 ? t = "K" : -24 > s && s >= -32 ? t = "J" : -32 > s && s >= -40 ? t = "H" : -40 > s && s >= -48 ? t = "G" : -48 > s && s >= -56 ? t = "F" : -56 > s && s >= -64 ? t = "E" : -64 > s && s >= -72 ? t = "D" : -72 > s && s >= -80 && (t = "C"), t;
}
function ru(s, t) {
  var e = "00000" + s.easting, a = "00000" + s.northing;
  return s.zoneNumber + s.zoneLetter + ou(s.easting, s.northing, s.zoneNumber) + e.substr(e.length - 5, t) + a.substr(a.length - 5, t);
}
function ou(s, t, e) {
  var a = Ur(e), r = Math.floor(s / 1e5), o = Math.floor(t / 1e5) % 20;
  return hu(r, o, a);
}
function Ur(s) {
  var t = s % fr;
  return t === 0 && (t = fr), t;
}
function hu(s, t, e) {
  var a = e - 1, r = Br.charCodeAt(a), o = Dr.charCodeAt(a), l = r + s - 1, u = o + t, c = !1;
  l > fe && (l = l - fe + Ni - 1, c = !0), (l === St || r < St && l > St || (l > St || r < St) && c) && l++, (l === Nt || r < Nt && l > Nt || (l > Nt || r < Nt) && c) && (l++, l === St && l++), l > fe && (l = l - fe + Ni - 1), u > ce ? (u = u - ce + Ni - 1, c = !0) : c = !1, (u === St || o < St && u > St || (u > St || o < St) && c) && u++, (u === Nt || o < Nt && u > Nt || (u > Nt || o < Nt) && c) && (u++, u === St && u++), u > ce && (u = u - ce + Ni - 1);
  var d = String.fromCharCode(l) + String.fromCharCode(u);
  return d;
}
function qr(s) {
  if (s && s.length === 0)
    throw "MGRSPoint coverting from nothing";
  for (var t = s.length, e = null, a = "", r, o = 0; !/[A-Z]/.test(r = s.charAt(o)); ) {
    if (o >= 2)
      throw "MGRSPoint bad conversion from: " + s;
    a += r, o++;
  }
  var l = parseInt(a, 10);
  if (o === 0 || o + 3 > t)
    throw "MGRSPoint bad conversion from: " + s;
  var u = s.charAt(o++);
  if (u <= "A" || u === "B" || u === "Y" || u >= "Z" || u === "I" || u === "O")
    throw "MGRSPoint zone letter " + u + " not handled: " + s;
  e = s.substring(o, o += 2);
  for (var c = Ur(l), d = lu(e.charAt(0), c), g = uu(e.charAt(1), c); g < cu(u); )
    g += 2e6;
  var m = t - o;
  if (m % 2 !== 0)
    throw `MGRSPoint has to have an even number 
of digits after the zone letter and two 100km letters - front 
half for easting meters, second half for 
northing meters` + s;
  var p = m / 2, y = 0, M = 0, w, P, E, A, T;
  return p > 0 && (w = 1e5 / Math.pow(10, p), P = s.substring(o, o + p), y = parseFloat(P) * w, E = s.substring(o + p), M = parseFloat(E) * w), A = y + d, T = M + g, {
    easting: A,
    northing: T,
    zoneLetter: u,
    zoneNumber: l,
    accuracy: w
  };
}
function lu(s, t) {
  for (var e = Br.charCodeAt(t - 1), a = 1e5, r = !1; e !== s.charCodeAt(0); ) {
    if (e++, e === St && e++, e === Nt && e++, e > fe) {
      if (r)
        throw "Bad character: " + s;
      e = Ni, r = !0;
    }
    a += 1e5;
  }
  return a;
}
function uu(s, t) {
  if (s > "V")
    throw "MGRSPoint given invalid Northing " + s;
  for (var e = Dr.charCodeAt(t - 1), a = 0, r = !1; e !== s.charCodeAt(0); ) {
    if (e++, e === St && e++, e === Nt && e++, e > ce) {
      if (r)
        throw "Bad character: " + s;
      e = Ni, r = !0;
    }
    a += 1e5;
  }
  return a;
}
function cu(s) {
  var t;
  switch (s) {
    case "C":
      t = 11e5;
      break;
    case "D":
      t = 2e6;
      break;
    case "E":
      t = 28e5;
      break;
    case "F":
      t = 37e5;
      break;
    case "G":
      t = 46e5;
      break;
    case "H":
      t = 55e5;
      break;
    case "J":
      t = 64e5;
      break;
    case "K":
      t = 73e5;
      break;
    case "L":
      t = 82e5;
      break;
    case "M":
      t = 91e5;
      break;
    case "N":
      t = 0;
      break;
    case "P":
      t = 8e5;
      break;
    case "Q":
      t = 17e5;
      break;
    case "R":
      t = 26e5;
      break;
    case "S":
      t = 35e5;
      break;
    case "T":
      t = 44e5;
      break;
    case "U":
      t = 53e5;
      break;
    case "V":
      t = 62e5;
      break;
    case "W":
      t = 7e6;
      break;
    case "X":
      t = 79e5;
      break;
    default:
      t = -1;
  }
  if (t >= 0)
    return t;
  throw "Invalid zone letter: " + s;
}
function Fi(s, t, e) {
  if (!(this instanceof Fi))
    return new Fi(s, t, e);
  if (Array.isArray(s))
    this.x = s[0], this.y = s[1], this.z = s[2] || 0;
  else if (typeof s == "object")
    this.x = s.x, this.y = s.y, this.z = s.z || 0;
  else if (typeof s == "string" && typeof t > "u") {
    var a = s.split(",");
    this.x = parseFloat(a[0]), this.y = parseFloat(a[1]), this.z = parseFloat(a[2]) || 0;
  } else
    this.x = s, this.y = t, this.z = e || 0;
  console.warn("proj4.Point will be removed in version 3, use proj4.toPoint");
}
Fi.fromMGRS = function(s) {
  return new Fi(Zr(s));
};
Fi.prototype.toMGRS = function(s) {
  return Fr([this.x, this.y], s);
};
var fu = 1, du = 0.25, _r = 0.046875, mr = 0.01953125, gr = 0.01068115234375, _u = 0.75, mu = 0.46875, gu = 0.013020833333333334, pu = 0.007120768229166667, vu = 0.3645833333333333, yu = 0.005696614583333333, Mu = 0.3076171875;
function wn(s) {
  var t = [];
  t[0] = fu - s * (du + s * (_r + s * (mr + s * gr))), t[1] = s * (_u - s * (_r + s * (mr + s * gr)));
  var e = s * s;
  return t[2] = e * (mu - s * (gu + s * pu)), e *= s, t[3] = e * (vu - s * yu), t[4] = e * s * Mu, t;
}
function Zi(s, t, e, a) {
  return e *= t, t *= t, a[0] * s - e * (a[1] + t * (a[2] + t * (a[3] + t * a[4])));
}
var wu = 20;
function xn(s, t, e) {
  for (var a = 1 / (1 - t), r = s, o = wu; o; --o) {
    var l = Math.sin(r), u = 1 - t * l * l;
    if (u = (Zi(r, l, Math.cos(r), e) - s) * (u * Math.sqrt(u)) * a, r -= u, Math.abs(u) < O)
      return r;
  }
  return r;
}
function xu() {
  this.x0 = this.x0 !== void 0 ? this.x0 : 0, this.y0 = this.y0 !== void 0 ? this.y0 : 0, this.long0 = this.long0 !== void 0 ? this.long0 : 0, this.lat0 = this.lat0 !== void 0 ? this.lat0 : 0, this.es && (this.en = wn(this.es), this.ml0 = Zi(this.lat0, Math.sin(this.lat0), Math.cos(this.lat0), this.en));
}
function Pu(s) {
  var t = s.x, e = s.y, a = N(t - this.long0, this.over), r, o, l, u = Math.sin(e), c = Math.cos(e);
  if (this.es) {
    var g = c * a, m = Math.pow(g, 2), p = this.ep2 * Math.pow(c, 2), y = Math.pow(p, 2), M = Math.abs(c) > O ? Math.tan(e) : 0, w = Math.pow(M, 2), P = Math.pow(w, 2);
    r = 1 - this.es * Math.pow(u, 2), g = g / Math.sqrt(r);
    var E = Zi(e, u, c, this.en);
    o = this.a * (this.k0 * g * (1 + m / 6 * (1 - w + p + m / 20 * (5 - 18 * w + P + 14 * p - 58 * w * p + m / 42 * (61 + 179 * P - P * w - 479 * w))))) + this.x0, l = this.a * (this.k0 * (E - this.ml0 + u * a * g / 2 * (1 + m / 12 * (5 - w + 9 * p + 4 * y + m / 30 * (61 + P - 58 * w + 270 * p - 330 * w * p + m / 56 * (1385 + 543 * P - P * w - 3111 * w)))))) + this.y0;
  } else {
    var d = c * Math.sin(a);
    if (Math.abs(Math.abs(d) - 1) < O)
      return 93;
    if (o = 0.5 * this.a * this.k0 * Math.log((1 + d) / (1 - d)) + this.x0, l = c * Math.cos(a) / Math.sqrt(1 - Math.pow(d, 2)), d = Math.abs(l), d >= 1) {
      if (d - 1 > O)
        return 93;
      l = 0;
    } else
      l = Math.acos(l);
    e < 0 && (l = -l), l = this.a * this.k0 * (l - this.lat0) + this.y0;
  }
  return s.x = o, s.y = l, s;
}
function bu(s) {
  var t, e, a, r, o = (s.x - this.x0) * (1 / this.a), l = (s.y - this.y0) * (1 / this.a);
  if (this.es)
    if (t = this.ml0 + l / this.k0, e = xn(t, this.es, this.en), Math.abs(e) < I) {
      var m = Math.sin(e), p = Math.cos(e), y = Math.abs(p) > O ? Math.tan(e) : 0, M = this.ep2 * Math.pow(p, 2), w = Math.pow(M, 2), P = Math.pow(y, 2), E = Math.pow(P, 2);
      t = 1 - this.es * Math.pow(m, 2);
      var A = o * Math.sqrt(t) / this.k0, T = Math.pow(A, 2);
      t = t * y, a = e - t * T / (1 - this.es) * 0.5 * (1 - T / 12 * (5 + 3 * P - 9 * M * P + M - 4 * w - T / 30 * (61 + 90 * P - 252 * M * P + 45 * E + 46 * M - T / 56 * (1385 + 3633 * P + 4095 * E + 1574 * E * P)))), r = N(this.long0 + A * (1 - T / 6 * (1 + 2 * P + M - T / 20 * (5 + 28 * P + 24 * E + 8 * M * P + 6 * M - T / 42 * (61 + 662 * P + 1320 * E + 720 * E * P)))) / p, this.over);
    } else
      a = I * Se(l), r = 0;
  else {
    var u = Math.exp(o / this.k0), c = 0.5 * (u - 1 / u), d = this.lat0 + l / this.k0, g = Math.cos(d);
    t = Math.sqrt((1 - Math.pow(g, 2)) / (1 + Math.pow(c, 2))), a = Math.asin(t), l < 0 && (a = -a), c === 0 && g === 0 ? r = 0 : r = N(Math.atan2(c, g) + this.long0, this.over);
  }
  return s.x = r, s.y = a, s;
}
var Eu = ["Fast_Transverse_Mercator", "Fast Transverse Mercator"];
const ss = {
  init: xu,
  forward: Pu,
  inverse: bu,
  names: Eu
};
function jr(s) {
  var t = Math.exp(s);
  return t = (t - 1 / t) / 2, t;
}
function At(s, t) {
  s = Math.abs(s), t = Math.abs(t);
  var e = Math.max(s, t), a = Math.min(s, t) / (e || 1);
  return e * Math.sqrt(1 + Math.pow(a, 2));
}
function Su(s) {
  var t = 1 + s, e = t - 1;
  return e === 0 ? s : s * Math.log(t) / e;
}
function Au(s) {
  var t = Math.abs(s);
  return t = Su(t * (1 + t / (At(1, t) + 1))), s < 0 ? -t : t;
}
function Pn(s, t) {
  for (var e = 2 * Math.cos(2 * t), a = s.length - 1, r = s[a], o = 0, l; --a >= 0; )
    l = -o + e * r + s[a], o = r, r = l;
  return t + l * Math.sin(2 * t);
}
function Lu(s, t) {
  for (var e = 2 * Math.cos(t), a = s.length - 1, r = s[a], o = 0, l; --a >= 0; )
    l = -o + e * r + s[a], o = r, r = l;
  return Math.sin(t) * l;
}
function Tu(s) {
  var t = Math.exp(s);
  return t = (t + 1 / t) / 2, t;
}
function Wr(s, t, e) {
  for (var a = Math.sin(t), r = Math.cos(t), o = jr(e), l = Tu(e), u = 2 * r * l, c = -2 * a * o, d = s.length - 1, g = s[d], m = 0, p = 0, y = 0, M, w; --d >= 0; )
    M = p, w = m, p = g, m = y, g = -M + u * p - c * m + s[d], y = -w + c * p + u * m;
  return u = a * l, c = r * o, [u * g - c * y, u * y + c * g];
}
function Cu() {
  if (!this.approx && (isNaN(this.es) || this.es <= 0))
    throw new Error('Incorrect elliptical usage. Try using the +approx option in the proj string, or PROJECTION["Fast_Transverse_Mercator"] in the WKT.');
  this.approx && (ss.init.apply(this), this.forward = ss.forward, this.inverse = ss.inverse), this.x0 = this.x0 !== void 0 ? this.x0 : 0, this.y0 = this.y0 !== void 0 ? this.y0 : 0, this.long0 = this.long0 !== void 0 ? this.long0 : 0, this.lat0 = this.lat0 !== void 0 ? this.lat0 : 0, this.cgb = [], this.cbg = [], this.utg = [], this.gtu = [];
  var s = this.es / (1 + Math.sqrt(1 - this.es)), t = s / (2 - s), e = t;
  this.cgb[0] = t * (2 + t * (-2 / 3 + t * (-2 + t * (116 / 45 + t * (26 / 45 + t * (-2854 / 675)))))), this.cbg[0] = t * (-2 + t * (2 / 3 + t * (4 / 3 + t * (-82 / 45 + t * (32 / 45 + t * (4642 / 4725)))))), e = e * t, this.cgb[1] = e * (7 / 3 + t * (-8 / 5 + t * (-227 / 45 + t * (2704 / 315 + t * (2323 / 945))))), this.cbg[1] = e * (5 / 3 + t * (-16 / 15 + t * (-13 / 9 + t * (904 / 315 + t * (-1522 / 945))))), e = e * t, this.cgb[2] = e * (56 / 15 + t * (-136 / 35 + t * (-1262 / 105 + t * (73814 / 2835)))), this.cbg[2] = e * (-26 / 15 + t * (34 / 21 + t * (8 / 5 + t * (-12686 / 2835)))), e = e * t, this.cgb[3] = e * (4279 / 630 + t * (-332 / 35 + t * (-399572 / 14175))), this.cbg[3] = e * (1237 / 630 + t * (-12 / 5 + t * (-24832 / 14175))), e = e * t, this.cgb[4] = e * (4174 / 315 + t * (-144838 / 6237)), this.cbg[4] = e * (-734 / 315 + t * (109598 / 31185)), e = e * t, this.cgb[5] = e * (601676 / 22275), this.cbg[5] = e * (444337 / 155925), e = Math.pow(t, 2), this.Qn = this.k0 / (1 + t) * (1 + e * (1 / 4 + e * (1 / 64 + e / 256))), this.utg[0] = t * (-0.5 + t * (2 / 3 + t * (-37 / 96 + t * (1 / 360 + t * (81 / 512 + t * (-96199 / 604800)))))), this.gtu[0] = t * (0.5 + t * (-2 / 3 + t * (5 / 16 + t * (41 / 180 + t * (-127 / 288 + t * (7891 / 37800)))))), this.utg[1] = e * (-1 / 48 + t * (-1 / 15 + t * (437 / 1440 + t * (-46 / 105 + t * (1118711 / 3870720))))), this.gtu[1] = e * (13 / 48 + t * (-3 / 5 + t * (557 / 1440 + t * (281 / 630 + t * (-1983433 / 1935360))))), e = e * t, this.utg[2] = e * (-17 / 480 + t * (37 / 840 + t * (209 / 4480 + t * (-5569 / 90720)))), this.gtu[2] = e * (61 / 240 + t * (-103 / 140 + t * (15061 / 26880 + t * (167603 / 181440)))), e = e * t, this.utg[3] = e * (-4397 / 161280 + t * (11 / 504 + t * (830251 / 7257600))), this.gtu[3] = e * (49561 / 161280 + t * (-179 / 168 + t * (6601661 / 7257600))), e = e * t, this.utg[4] = e * (-4583 / 161280 + t * (108847 / 3991680)), this.gtu[4] = e * (34729 / 80640 + t * (-3418889 / 1995840)), e = e * t, this.utg[5] = e * (-20648693 / 638668800), this.gtu[5] = e * (212378941 / 319334400);
  var a = Pn(this.cbg, this.lat0);
  this.Zb = -this.Qn * (a + Lu(this.gtu, 2 * a));
}
function Iu(s) {
  var t = N(s.x - this.long0, this.over), e = s.y;
  e = Pn(this.cbg, e);
  var a = Math.sin(e), r = Math.cos(e), o = Math.sin(t), l = Math.cos(t);
  e = Math.atan2(a, l * r), t = Math.atan2(o * r, At(a, r * l)), t = Au(Math.tan(t));
  var u = Wr(this.gtu, 2 * e, 2 * t);
  e = e + u[0], t = t + u[1];
  var c, d;
  return Math.abs(t) <= 2.623395162778 ? (c = this.a * (this.Qn * t) + this.x0, d = this.a * (this.Qn * e + this.Zb) + this.y0) : (c = 1 / 0, d = 1 / 0), s.x = c, s.y = d, s;
}
function Gu(s) {
  var t = (s.x - this.x0) * (1 / this.a), e = (s.y - this.y0) * (1 / this.a);
  e = (e - this.Zb) / this.Qn, t = t / this.Qn;
  var a, r;
  if (Math.abs(t) <= 2.623395162778) {
    var o = Wr(this.utg, 2 * e, 2 * t);
    e = e + o[0], t = t + o[1], t = Math.atan(jr(t));
    var l = Math.sin(e), u = Math.cos(e), c = Math.sin(t), d = Math.cos(t);
    e = Math.atan2(l * d, At(c, d * u)), t = Math.atan2(c, d * u), a = N(t + this.long0, this.over), r = Pn(this.cgb, e);
  } else
    a = 1 / 0, r = 1 / 0;
  return s.x = a, s.y = r, s;
}
var Ou = ["Extended_Transverse_Mercator", "Extended Transverse Mercator", "etmerc", "Transverse_Mercator", "Transverse Mercator", "Gauss Kruger", "Gauss_Kruger", "tmerc"];
const ns = {
  init: Cu,
  forward: Iu,
  inverse: Gu,
  names: Ou
};
function Nu(s, t) {
  if (s === void 0) {
    if (s = Math.floor((N(t) + Math.PI) * 30 / Math.PI) + 1, s < 0)
      return 0;
    if (s > 60)
      return 60;
  }
  return s;
}
var Ru = "etmerc";
function ku() {
  var s = Nu(this.zone, this.long0);
  if (s === void 0)
    throw new Error("unknown utm zone");
  this.lat0 = 0, this.long0 = (6 * Math.abs(s) - 183) * ot, this.x0 = 5e5, this.y0 = this.utmSouth ? 1e7 : 0, this.k0 = 0.9996, ns.init.apply(this), this.forward = ns.forward, this.inverse = ns.inverse;
}
var zu = ["Universal Transverse Mercator System", "utm"];
const Bu = {
  init: ku,
  names: zu,
  dependsOn: Ru
};
function bn(s, t) {
  return Math.pow((1 - s) / (1 + s), t);
}
var Du = 20;
function Fu() {
  var s = Math.sin(this.lat0), t = Math.cos(this.lat0);
  t *= t, this.rc = Math.sqrt(1 - this.es) / (1 - this.es * s * s), this.C = Math.sqrt(1 + this.es * t * t / (1 - this.es)), this.phic0 = Math.asin(s / this.C), this.ratexp = 0.5 * this.C * this.e, this.K = Math.tan(0.5 * this.phic0 + tt) / (Math.pow(Math.tan(0.5 * this.lat0 + tt), this.C) * bn(this.e * s, this.ratexp));
}
function Zu(s) {
  var t = s.x, e = s.y;
  return s.y = 2 * Math.atan(this.K * Math.pow(Math.tan(0.5 * e + tt), this.C) * bn(this.e * Math.sin(e), this.ratexp)) - I, s.x = this.C * t, s;
}
function Uu(s) {
  for (var t = 1e-14, e = s.x / this.C, a = s.y, r = Math.pow(Math.tan(0.5 * a + tt) / this.K, 1 / this.C), o = Du; o > 0 && (a = 2 * Math.atan(r * bn(this.e * Math.sin(s.y), -0.5 * this.e)) - I, !(Math.abs(a - s.y) < t)); --o)
    s.y = a;
  return o ? (s.x = e, s.y = a, s) : null;
}
const En = {
  init: Fu,
  forward: Zu,
  inverse: Uu
};
function qu() {
  En.init.apply(this), this.rc && (this.sinc0 = Math.sin(this.phic0), this.cosc0 = Math.cos(this.phic0), this.R2 = 2 * this.rc, this.title || (this.title = "Oblique Stereographic Alternative"));
}
function ju(s) {
  var t, e, a, r;
  return s.x = N(s.x - this.long0, this.over), En.forward.apply(this, [s]), t = Math.sin(s.y), e = Math.cos(s.y), a = Math.cos(s.x), r = this.k0 * this.R2 / (1 + this.sinc0 * t + this.cosc0 * e * a), s.x = r * e * Math.sin(s.x), s.y = r * (this.cosc0 * t - this.sinc0 * e * a), s.x = this.a * s.x + this.x0, s.y = this.a * s.y + this.y0, s;
}
function Wu(s) {
  var t, e, a, r, o;
  if (s.x = (s.x - this.x0) / this.a, s.y = (s.y - this.y0) / this.a, s.x /= this.k0, s.y /= this.k0, o = At(s.x, s.y)) {
    var l = 2 * Math.atan2(o, this.R2);
    t = Math.sin(l), e = Math.cos(l), r = Math.asin(e * this.sinc0 + s.y * t * this.cosc0 / o), a = Math.atan2(s.x * t, o * this.cosc0 * e - s.y * this.sinc0 * t);
  } else
    r = this.phic0, a = 0;
  return s.x = a, s.y = r, En.inverse.apply(this, [s]), s.x = N(s.x + this.long0, this.over), s;
}
var Hu = ["Stereographic_North_Pole", "Oblique_Stereographic", "sterea", "Oblique Stereographic Alternative", "Double_Stereographic"];
const Xu = {
  init: qu,
  forward: ju,
  inverse: Wu,
  names: Hu
};
function Sn(s, t, e) {
  return t *= e, Math.tan(0.5 * (I + s)) * Math.pow((1 - t) / (1 + t), 0.5 * e);
}
function Vu() {
  this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, this.lat0 = this.lat0 || 0, this.long0 = this.long0 || 0, this.coslat0 = Math.cos(this.lat0), this.sinlat0 = Math.sin(this.lat0), this.sphere ? this.k0 === 1 && !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= O && (this.k0 = 0.5 * (1 + Se(this.lat0) * Math.sin(this.lat_ts))) : (Math.abs(this.coslat0) <= O && (this.lat0 > 0 ? this.con = 1 : this.con = -1), this.cons = Math.sqrt(Math.pow(1 + this.e, 1 + this.e) * Math.pow(1 - this.e, 1 - this.e)), this.k0 === 1 && !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= O && Math.abs(Math.cos(this.lat_ts)) > O && (this.k0 = 0.5 * this.cons * Xt(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts)) / Zt(this.e, this.con * this.lat_ts, this.con * Math.sin(this.lat_ts))), this.ms1 = Xt(this.e, this.sinlat0, this.coslat0), this.X0 = 2 * Math.atan(Sn(this.lat0, this.sinlat0, this.e)) - I, this.cosX0 = Math.cos(this.X0), this.sinX0 = Math.sin(this.X0));
}
function Yu(s) {
  var t = s.x, e = s.y, a = Math.sin(e), r = Math.cos(e), o, l, u, c, d, g, m = N(t - this.long0, this.over);
  return Math.abs(Math.abs(t - this.long0) - Math.PI) <= O && Math.abs(e + this.lat0) <= O ? (s.x = NaN, s.y = NaN, s) : this.sphere ? (o = 2 * this.k0 / (1 + this.sinlat0 * a + this.coslat0 * r * Math.cos(m)), s.x = this.a * o * r * Math.sin(m) + this.x0, s.y = this.a * o * (this.coslat0 * a - this.sinlat0 * r * Math.cos(m)) + this.y0, s) : (l = 2 * Math.atan(Sn(e, a, this.e)) - I, c = Math.cos(l), u = Math.sin(l), Math.abs(this.coslat0) <= O ? (d = Zt(this.e, e * this.con, this.con * a), g = 2 * this.a * this.k0 * d / this.cons, s.x = this.x0 + g * Math.sin(t - this.long0), s.y = this.y0 - this.con * g * Math.cos(t - this.long0), s) : (Math.abs(this.sinlat0) < O ? (o = 2 * this.a * this.k0 / (1 + c * Math.cos(m)), s.y = o * u) : (o = 2 * this.a * this.k0 * this.ms1 / (this.cosX0 * (1 + this.sinX0 * u + this.cosX0 * c * Math.cos(m))), s.y = o * (this.cosX0 * u - this.sinX0 * c * Math.cos(m)) + this.y0), s.x = o * c * Math.sin(m) + this.x0, s));
}
function Ku(s) {
  s.x -= this.x0, s.y -= this.y0;
  var t, e, a, r, o, l = Math.sqrt(s.x * s.x + s.y * s.y);
  if (this.sphere) {
    var u = 2 * Math.atan(l / (2 * this.a * this.k0));
    return t = this.long0, e = this.lat0, l <= O ? (s.x = t, s.y = e, s) : (e = Math.asin(Math.cos(u) * this.sinlat0 + s.y * Math.sin(u) * this.coslat0 / l), Math.abs(this.coslat0) < O ? this.lat0 > 0 ? t = N(this.long0 + Math.atan2(s.x, -1 * s.y), this.over) : t = N(this.long0 + Math.atan2(s.x, s.y), this.over) : t = N(this.long0 + Math.atan2(s.x * Math.sin(u), l * this.coslat0 * Math.cos(u) - s.y * this.sinlat0 * Math.sin(u)), this.over), s.x = t, s.y = e, s);
  } else if (Math.abs(this.coslat0) <= O) {
    if (l <= O)
      return e = this.lat0, t = this.long0, s.x = t, s.y = e, s;
    s.x *= this.con, s.y *= this.con, a = l * this.cons / (2 * this.a * this.k0), e = this.con * Pe(this.e, a), t = this.con * N(this.con * this.long0 + Math.atan2(s.x, -1 * s.y), this.over);
  } else
    r = 2 * Math.atan(l * this.cosX0 / (2 * this.a * this.k0 * this.ms1)), t = this.long0, l <= O ? o = this.X0 : (o = Math.asin(Math.cos(r) * this.sinX0 + s.y * Math.sin(r) * this.cosX0 / l), t = N(this.long0 + Math.atan2(s.x * Math.sin(r), l * this.cosX0 * Math.cos(r) - s.y * this.sinX0 * Math.sin(r)), this.over)), e = -1 * Pe(this.e, Math.tan(0.5 * (I + o)));
  return s.x = t, s.y = e, s;
}
var $u = ["stere", "Stereographic_South_Pole", "Polar_Stereographic_variant_A", "Polar_Stereographic_variant_B", "Polar_Stereographic"];
const Ju = {
  init: Vu,
  forward: Yu,
  inverse: Ku,
  names: $u,
  ssfn_: Sn
};
function Qu() {
  var s = this.lat0;
  this.lambda0 = this.long0;
  var t = Math.sin(s), e = this.a, a = this.rf, r = 1 / a, o = 2 * r - Math.pow(r, 2), l = this.e = Math.sqrt(o);
  this.R = this.k0 * e * Math.sqrt(1 - o) / (1 - o * Math.pow(t, 2)), this.alpha = Math.sqrt(1 + o / (1 - o) * Math.pow(Math.cos(s), 4)), this.b0 = Math.asin(t / this.alpha);
  var u = Math.log(Math.tan(Math.PI / 4 + this.b0 / 2)), c = Math.log(Math.tan(Math.PI / 4 + s / 2)), d = Math.log((1 + l * t) / (1 - l * t));
  this.K = u - this.alpha * c + this.alpha * l / 2 * d;
}
function tc(s) {
  var t = Math.log(Math.tan(Math.PI / 4 - s.y / 2)), e = this.e / 2 * Math.log((1 + this.e * Math.sin(s.y)) / (1 - this.e * Math.sin(s.y))), a = -this.alpha * (t + e) + this.K, r = 2 * (Math.atan(Math.exp(a)) - Math.PI / 4), o = this.alpha * (s.x - this.lambda0), l = Math.atan(Math.sin(o) / (Math.sin(this.b0) * Math.tan(r) + Math.cos(this.b0) * Math.cos(o))), u = Math.asin(Math.cos(this.b0) * Math.sin(r) - Math.sin(this.b0) * Math.cos(r) * Math.cos(o));
  return s.y = this.R / 2 * Math.log((1 + Math.sin(u)) / (1 - Math.sin(u))) + this.y0, s.x = this.R * l + this.x0, s;
}
function ic(s) {
  for (var t = s.x - this.x0, e = s.y - this.y0, a = t / this.R, r = 2 * (Math.atan(Math.exp(e / this.R)) - Math.PI / 4), o = Math.asin(Math.cos(this.b0) * Math.sin(r) + Math.sin(this.b0) * Math.cos(r) * Math.cos(a)), l = Math.atan(Math.sin(a) / (Math.cos(this.b0) * Math.cos(a) - Math.sin(this.b0) * Math.tan(r))), u = this.lambda0 + l / this.alpha, c = 0, d = o, g = -1e3, m = 0; Math.abs(d - g) > 1e-7; ) {
    if (++m > 20)
      return;
    c = 1 / this.alpha * (Math.log(Math.tan(Math.PI / 4 + o / 2)) - this.K) + this.e * Math.log(Math.tan(Math.PI / 4 + Math.asin(this.e * Math.sin(d)) / 2)), g = d, d = 2 * Math.atan(Math.exp(c)) - Math.PI / 2;
  }
  return s.x = u, s.y = d, s;
}
var ec = ["somerc"];
const sc = {
  init: Qu,
  forward: tc,
  inverse: ic,
  names: ec
};
var Ii = 1e-7;
function nc(s) {
  var t = ["Hotine_Oblique_Mercator", "Hotine_Oblique_Mercator_variant_A", "Hotine_Oblique_Mercator_Azimuth_Natural_Origin"], e = typeof s.projName == "object" ? Object.keys(s.projName)[0] : s.projName;
  return "no_uoff" in s || "no_off" in s || t.indexOf(e) !== -1 || t.indexOf(Or(e)) !== -1;
}
function ac() {
  var s, t, e, a, r, o, l, u, c, d, g = 0, m, p = 0, y = 0, M = 0, w = 0, P = 0, E = 0;
  this.no_off = nc(this), this.no_rot = "no_rot" in this;
  var A = !1;
  "alpha" in this && (A = !0);
  var T = !1;
  if ("rectified_grid_angle" in this && (T = !0), A && (E = this.alpha), T && (g = this.rectified_grid_angle), A || T)
    p = this.longc;
  else if (y = this.long1, w = this.lat1, M = this.long2, P = this.lat2, Math.abs(w - P) <= Ii || (s = Math.abs(w)) <= Ii || Math.abs(s - I) <= Ii || Math.abs(Math.abs(this.lat0) - I) <= Ii || Math.abs(Math.abs(P) - I) <= Ii)
    throw new Error();
  var G = 1 - this.es;
  t = Math.sqrt(G), Math.abs(this.lat0) > O ? (u = Math.sin(this.lat0), e = Math.cos(this.lat0), s = 1 - this.es * u * u, this.B = e * e, this.B = Math.sqrt(1 + this.es * this.B * this.B / G), this.A = this.B * this.k0 * t / s, a = this.B * t / (e * Math.sqrt(s)), r = a * a - 1, r <= 0 ? r = 0 : (r = Math.sqrt(r), this.lat0 < 0 && (r = -r)), this.E = r += a, this.E *= Math.pow(Zt(this.e, this.lat0, u), this.B)) : (this.B = 1 / t, this.A = this.k0, this.E = a = r = 1), A || T ? (A ? (m = Math.asin(Math.sin(E) / a), T || (g = E)) : (m = g, E = Math.asin(a * Math.sin(m))), this.lam0 = p - Math.asin(0.5 * (r - 1 / r) * Math.tan(m)) / this.B) : (o = Math.pow(Zt(this.e, w, Math.sin(w)), this.B), l = Math.pow(Zt(this.e, P, Math.sin(P)), this.B), r = this.E / o, c = (l - o) / (l + o), d = this.E * this.E, d = (d - l * o) / (d + l * o), s = y - M, s < -Math.PI ? M -= we : s > Math.PI && (M += we), this.lam0 = N(0.5 * (y + M) - Math.atan(d * Math.tan(0.5 * this.B * (y - M)) / c) / this.B, this.over), m = Math.atan(2 * Math.sin(this.B * N(y - this.lam0, this.over)) / (r - 1 / r)), g = E = Math.asin(a * Math.sin(m))), this.singam = Math.sin(m), this.cosgam = Math.cos(m), this.sinrot = Math.sin(g), this.cosrot = Math.cos(g), this.rB = 1 / this.B, this.ArB = this.A * this.rB, this.BrA = 1 / this.ArB, this.no_off ? this.u_0 = 0 : (this.u_0 = Math.abs(this.ArB * Math.atan(Math.sqrt(a * a - 1) / Math.cos(E))), this.lat0 < 0 && (this.u_0 = -this.u_0)), r = 0.5 * m, this.v_pole_n = this.ArB * Math.log(Math.tan(tt - r)), this.v_pole_s = this.ArB * Math.log(Math.tan(tt + r));
}
function rc(s) {
  var t = {}, e, a, r, o, l, u, c, d;
  if (s.x = s.x - this.lam0, Math.abs(Math.abs(s.y) - I) > O) {
    if (l = this.E / Math.pow(Zt(this.e, s.y, Math.sin(s.y)), this.B), u = 1 / l, e = 0.5 * (l - u), a = 0.5 * (l + u), o = Math.sin(this.B * s.x), r = (e * this.singam - o * this.cosgam) / a, Math.abs(Math.abs(r) - 1) < O)
      throw new Error();
    d = 0.5 * this.ArB * Math.log((1 - r) / (1 + r)), u = Math.cos(this.B * s.x), Math.abs(u) < Ii ? c = this.A * s.x : c = this.ArB * Math.atan2(e * this.cosgam + o * this.singam, u);
  } else
    d = s.y > 0 ? this.v_pole_n : this.v_pole_s, c = this.ArB * s.y;
  return this.no_rot ? (t.x = c, t.y = d) : (c -= this.u_0, t.x = d * this.cosrot + c * this.sinrot, t.y = c * this.cosrot - d * this.sinrot), t.x = this.a * t.x + this.x0, t.y = this.a * t.y + this.y0, t;
}
function oc(s) {
  var t, e, a, r, o, l, u, c = {};
  if (s.x = (s.x - this.x0) * (1 / this.a), s.y = (s.y - this.y0) * (1 / this.a), this.no_rot ? (e = s.y, t = s.x) : (e = s.x * this.cosrot - s.y * this.sinrot, t = s.y * this.cosrot + s.x * this.sinrot + this.u_0), a = Math.exp(-this.BrA * e), r = 0.5 * (a - 1 / a), o = 0.5 * (a + 1 / a), l = Math.sin(this.BrA * t), u = (l * this.cosgam + r * this.singam) / o, Math.abs(Math.abs(u) - 1) < O)
    c.x = 0, c.y = u < 0 ? -I : I;
  else {
    if (c.y = this.E / Math.sqrt((1 + u) / (1 - u)), c.y = Pe(this.e, Math.pow(c.y, 1 / this.B)), c.y === 1 / 0)
      throw new Error();
    c.x = -this.rB * Math.atan2(r * this.cosgam - l * this.singam, Math.cos(this.BrA * t));
  }
  return c.x += this.lam0, c;
}
var hc = ["Hotine_Oblique_Mercator", "Hotine Oblique Mercator", "Hotine_Oblique_Mercator_variant_A", "Hotine_Oblique_Mercator_Variant_B", "Hotine_Oblique_Mercator_Azimuth_Natural_Origin", "Hotine_Oblique_Mercator_Two_Point_Natural_Origin", "Hotine_Oblique_Mercator_Azimuth_Center", "Oblique_Mercator", "omerc"];
const lc = {
  init: ac,
  forward: rc,
  inverse: oc,
  names: hc
};
function uc() {
  if (this.lat2 || (this.lat2 = this.lat1), this.k0 || (this.k0 = 1), this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, !(Math.abs(this.lat1 + this.lat2) < O)) {
    var s = this.b / this.a;
    this.e = Math.sqrt(1 - s * s);
    var t = Math.sin(this.lat1), e = Math.cos(this.lat1), a = Xt(this.e, t, e), r = Zt(this.e, this.lat1, t), o = Math.sin(this.lat2), l = Math.cos(this.lat2), u = Xt(this.e, o, l), c = Zt(this.e, this.lat2, o), d = Math.abs(Math.abs(this.lat0) - I) < O ? 0 : Zt(this.e, this.lat0, Math.sin(this.lat0));
    Math.abs(this.lat1 - this.lat2) > O ? this.ns = Math.log(a / u) / Math.log(r / c) : this.ns = t, isNaN(this.ns) && (this.ns = t), this.f0 = a / (this.ns * Math.pow(r, this.ns)), this.rh = this.a * this.f0 * Math.pow(d, this.ns), this.title || (this.title = "Lambert Conformal Conic");
  }
}
function cc(s) {
  var t = s.x, e = s.y;
  Math.abs(2 * Math.abs(e) - Math.PI) <= O && (e = Se(e) * (I - 2 * O));
  var a = Math.abs(Math.abs(e) - I), r, o;
  if (a > O)
    r = Zt(this.e, e, Math.sin(e)), o = this.a * this.f0 * Math.pow(r, this.ns);
  else {
    if (a = e * this.ns, a <= 0)
      return null;
    o = 0;
  }
  var l = this.ns * N(t - this.long0, this.over);
  return s.x = this.k0 * (o * Math.sin(l)) + this.x0, s.y = this.k0 * (this.rh - o * Math.cos(l)) + this.y0, s;
}
function fc(s) {
  var t, e, a, r, o, l = (s.x - this.x0) / this.k0, u = this.rh - (s.y - this.y0) / this.k0;
  this.ns > 0 ? (t = Math.sqrt(l * l + u * u), e = 1) : (t = -Math.sqrt(l * l + u * u), e = -1);
  var c = 0;
  if (t !== 0 && (c = Math.atan2(e * l, e * u)), t !== 0 || this.ns > 0) {
    if (e = 1 / this.ns, a = Math.pow(t / (this.a * this.f0), e), r = Pe(this.e, a), r === -9999)
      return null;
  } else
    r = -I;
  return o = N(c / this.ns + this.long0, this.over), s.x = o, s.y = r, s;
}
var dc = [
  "Lambert Tangential Conformal Conic Projection",
  "Lambert_Conformal_Conic",
  "Lambert_Conformal_Conic_1SP",
  "Lambert_Conformal_Conic_2SP",
  "lcc",
  "Lambert Conic Conformal (1SP)",
  "Lambert Conic Conformal (2SP)"
];
const _c = {
  init: uc,
  forward: cc,
  inverse: fc,
  names: dc
};
function mc() {
  this.a = 6377397155e-3, this.es = 0.006674372230614, this.e = Math.sqrt(this.es), this.lat0 || (this.lat0 = 0.863937979737193), this.long0 || (this.long0 = 0.7417649320975901 - 0.308341501185665), this.k0 || (this.k0 = 0.9999), this.s45 = 0.785398163397448, this.s90 = 2 * this.s45, this.fi0 = this.lat0, this.e2 = this.es, this.e = Math.sqrt(this.e2), this.alfa = Math.sqrt(1 + this.e2 * Math.pow(Math.cos(this.fi0), 4) / (1 - this.e2)), this.uq = 1.04216856380474, this.u0 = Math.asin(Math.sin(this.fi0) / this.alfa), this.g = Math.pow((1 + this.e * Math.sin(this.fi0)) / (1 - this.e * Math.sin(this.fi0)), this.alfa * this.e / 2), this.k = Math.tan(this.u0 / 2 + this.s45) / Math.pow(Math.tan(this.fi0 / 2 + this.s45), this.alfa) * this.g, this.k1 = this.k0, this.n0 = this.a * Math.sqrt(1 - this.e2) / (1 - this.e2 * Math.pow(Math.sin(this.fi0), 2)), this.s0 = 1.37008346281555, this.n = Math.sin(this.s0), this.ro0 = this.k1 * this.n0 / Math.tan(this.s0), this.ad = this.s90 - this.uq;
}
function gc(s) {
  var t, e, a, r, o, l, u, c = s.x, d = s.y, g = N(c - this.long0, this.over);
  return t = Math.pow((1 + this.e * Math.sin(d)) / (1 - this.e * Math.sin(d)), this.alfa * this.e / 2), e = 2 * (Math.atan(this.k * Math.pow(Math.tan(d / 2 + this.s45), this.alfa) / t) - this.s45), a = -g * this.alfa, r = Math.asin(Math.cos(this.ad) * Math.sin(e) + Math.sin(this.ad) * Math.cos(e) * Math.cos(a)), o = Math.asin(Math.cos(e) * Math.sin(a) / Math.cos(r)), l = this.n * o, u = this.ro0 * Math.pow(Math.tan(this.s0 / 2 + this.s45), this.n) / Math.pow(Math.tan(r / 2 + this.s45), this.n), s.y = u * Math.cos(l) / 1, s.x = u * Math.sin(l) / 1, this.czech || (s.y *= -1, s.x *= -1), s;
}
function pc(s) {
  var t, e, a, r, o, l, u, c, d = s.x;
  s.x = s.y, s.y = d, this.czech || (s.y *= -1, s.x *= -1), l = Math.sqrt(s.x * s.x + s.y * s.y), o = Math.atan2(s.y, s.x), r = o / Math.sin(this.s0), a = 2 * (Math.atan(Math.pow(this.ro0 / l, 1 / this.n) * Math.tan(this.s0 / 2 + this.s45)) - this.s45), t = Math.asin(Math.cos(this.ad) * Math.sin(a) - Math.sin(this.ad) * Math.cos(a) * Math.cos(r)), e = Math.asin(Math.cos(a) * Math.sin(r) / Math.cos(t)), s.x = this.long0 - e / this.alfa, u = t, c = 0;
  var g = 0;
  do
    s.y = 2 * (Math.atan(Math.pow(this.k, -1 / this.alfa) * Math.pow(Math.tan(t / 2 + this.s45), 1 / this.alfa) * Math.pow((1 + this.e * Math.sin(u)) / (1 - this.e * Math.sin(u)), this.e / 2)) - this.s45), Math.abs(u - s.y) < 1e-10 && (c = 1), u = s.y, g += 1;
  while (c === 0 && g < 15);
  return g >= 15 ? null : s;
}
var vc = ["Krovak", "krovak"];
const yc = {
  init: mc,
  forward: gc,
  inverse: pc,
  names: vc
};
function xt(s, t, e, a, r) {
  return s * r - t * Math.sin(2 * r) + e * Math.sin(4 * r) - a * Math.sin(6 * r);
}
function Ae(s) {
  return 1 - 0.25 * s * (1 + s / 16 * (3 + 1.25 * s));
}
function Le(s) {
  return 0.375 * s * (1 + 0.25 * s * (1 + 0.46875 * s));
}
function Te(s) {
  return 0.05859375 * s * s * (1 + 0.75 * s);
}
function Ce(s) {
  return s * s * s * (35 / 3072);
}
function An(s, t, e) {
  var a = t * e;
  return s / Math.sqrt(1 - a * a);
}
function ui(s) {
  return Math.abs(s) < I ? s : s - Se(s) * Math.PI;
}
function cs(s, t, e, a, r) {
  var o, l;
  o = s / t;
  for (var u = 0; u < 15; u++)
    if (l = (s - (t * o - e * Math.sin(2 * o) + a * Math.sin(4 * o) - r * Math.sin(6 * o))) / (t - 2 * e * Math.cos(2 * o) + 4 * a * Math.cos(4 * o) - 6 * r * Math.cos(6 * o)), o += l, Math.abs(l) <= 1e-10)
      return o;
  return NaN;
}
function Mc() {
  this.sphere || (this.e0 = Ae(this.es), this.e1 = Le(this.es), this.e2 = Te(this.es), this.e3 = Ce(this.es), this.ml0 = this.a * xt(this.e0, this.e1, this.e2, this.e3, this.lat0));
}
function wc(s) {
  var t, e, a = s.x, r = s.y;
  if (a = N(a - this.long0, this.over), this.sphere)
    t = this.a * Math.asin(Math.cos(r) * Math.sin(a)), e = this.a * (Math.atan2(Math.tan(r), Math.cos(a)) - this.lat0);
  else {
    var o = Math.sin(r), l = Math.cos(r), u = An(this.a, this.e, o), c = Math.tan(r) * Math.tan(r), d = a * Math.cos(r), g = d * d, m = this.es * l * l / (1 - this.es), p = this.a * xt(this.e0, this.e1, this.e2, this.e3, r);
    t = u * d * (1 - g * c * (1 / 6 - (8 - c + 8 * m) * g / 120)), e = p - this.ml0 + u * o / l * g * (0.5 + (5 - c + 6 * m) * g / 24);
  }
  return s.x = t + this.x0, s.y = e + this.y0, s;
}
function xc(s) {
  s.x -= this.x0, s.y -= this.y0;
  var t = s.x / this.a, e = s.y / this.a, a, r;
  if (this.sphere) {
    var o = e + this.lat0;
    a = Math.asin(Math.sin(o) * Math.cos(t)), r = Math.atan2(Math.tan(t), Math.cos(o));
  } else {
    var l = this.ml0 / this.a + e, u = cs(l, this.e0, this.e1, this.e2, this.e3);
    if (Math.abs(Math.abs(u) - I) <= O)
      return s.x = this.long0, s.y = I, e < 0 && (s.y *= -1), s;
    var c = An(this.a, this.e, Math.sin(u)), d = c * c * c / this.a / this.a * (1 - this.es), g = Math.pow(Math.tan(u), 2), m = t * this.a / c, p = m * m;
    a = u - c * Math.tan(u) / d * m * m * (0.5 - (1 + 3 * g) * m * m / 24), r = m * (1 - p * (g / 3 + (1 + 3 * g) * g * p / 15)) / Math.cos(u);
  }
  return s.x = N(r + this.long0, this.over), s.y = ui(a), s;
}
var Pc = ["Cassini", "Cassini_Soldner", "cass"];
const bc = {
  init: Mc,
  forward: wc,
  inverse: xc,
  names: Pc
};
function oi(s, t) {
  var e;
  return s > 1e-7 ? (e = s * t, (1 - s * s) * (t / (1 - e * e) - 0.5 / s * Math.log((1 - e) / (1 + e)))) : 2 * t;
}
var cn = 1, fn = 2, dn = 3, as = 4;
function Ec() {
  var s = Math.abs(this.lat0);
  if (Math.abs(s - I) < O ? this.mode = this.lat0 < 0 ? cn : fn : Math.abs(s) < O ? this.mode = dn : this.mode = as, this.es > 0) {
    var t;
    switch (this.qp = oi(this.e, 1), this.mmf = 0.5 / (1 - this.es), this.apa = Nc(this.es), this.mode) {
      case fn:
        this.dd = 1;
        break;
      case cn:
        this.dd = 1;
        break;
      case dn:
        this.rq = Math.sqrt(0.5 * this.qp), this.dd = 1 / this.rq, this.xmf = 1, this.ymf = 0.5 * this.qp;
        break;
      case as:
        this.rq = Math.sqrt(0.5 * this.qp), t = Math.sin(this.lat0), this.sinb1 = oi(this.e, t) / this.qp, this.cosb1 = Math.sqrt(1 - this.sinb1 * this.sinb1), this.dd = Math.cos(this.lat0) / (Math.sqrt(1 - this.es * t * t) * this.rq * this.cosb1), this.ymf = (this.xmf = this.rq) / this.dd, this.xmf *= this.dd;
        break;
    }
  } else
    this.mode === as && (this.sinph0 = Math.sin(this.lat0), this.cosph0 = Math.cos(this.lat0));
}
function Sc(s) {
  var t, e, a, r, o, l, u, c, d, g, m = s.x, p = s.y;
  if (m = N(m - this.long0, this.over), this.sphere) {
    if (o = Math.sin(p), g = Math.cos(p), a = Math.cos(m), this.mode === this.OBLIQ || this.mode === this.EQUIT) {
      if (e = this.mode === this.EQUIT ? 1 + g * a : 1 + this.sinph0 * o + this.cosph0 * g * a, e <= O)
        return null;
      e = Math.sqrt(2 / e), t = e * g * Math.sin(m), e *= this.mode === this.EQUIT ? o : this.cosph0 * o - this.sinph0 * g * a;
    } else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
      if (this.mode === this.N_POLE && (a = -a), Math.abs(p + this.lat0) < O)
        return null;
      e = tt - p * 0.5, e = 2 * (this.mode === this.S_POLE ? Math.cos(e) : Math.sin(e)), t = e * Math.sin(m), e *= a;
    }
  } else {
    switch (u = 0, c = 0, d = 0, a = Math.cos(m), r = Math.sin(m), o = Math.sin(p), l = oi(this.e, o), (this.mode === this.OBLIQ || this.mode === this.EQUIT) && (u = l / this.qp, c = Math.sqrt(1 - u * u)), this.mode) {
      case this.OBLIQ:
        d = 1 + this.sinb1 * u + this.cosb1 * c * a;
        break;
      case this.EQUIT:
        d = 1 + c * a;
        break;
      case this.N_POLE:
        d = I + p, l = this.qp - l;
        break;
      case this.S_POLE:
        d = p - I, l = this.qp + l;
        break;
    }
    if (Math.abs(d) < O)
      return null;
    switch (this.mode) {
      case this.OBLIQ:
      case this.EQUIT:
        d = Math.sqrt(2 / d), this.mode === this.OBLIQ ? e = this.ymf * d * (this.cosb1 * u - this.sinb1 * c * a) : e = (d = Math.sqrt(2 / (1 + c * a))) * u * this.ymf, t = this.xmf * d * c * r;
        break;
      case this.N_POLE:
      case this.S_POLE:
        l >= 0 ? (t = (d = Math.sqrt(l)) * r, e = a * (this.mode === this.S_POLE ? d : -d)) : t = e = 0;
        break;
    }
  }
  return s.x = this.a * t + this.x0, s.y = this.a * e + this.y0, s;
}
function Ac(s) {
  s.x -= this.x0, s.y -= this.y0;
  var t = s.x / this.a, e = s.y / this.a, a, r, o, l, u, c, d;
  if (this.sphere) {
    var g = 0, m, p = 0;
    if (m = Math.sqrt(t * t + e * e), r = m * 0.5, r > 1)
      return null;
    switch (r = 2 * Math.asin(r), (this.mode === this.OBLIQ || this.mode === this.EQUIT) && (p = Math.sin(r), g = Math.cos(r)), this.mode) {
      case this.EQUIT:
        r = Math.abs(m) <= O ? 0 : Math.asin(e * p / m), t *= p, e = g * m;
        break;
      case this.OBLIQ:
        r = Math.abs(m) <= O ? this.lat0 : Math.asin(g * this.sinph0 + e * p * this.cosph0 / m), t *= p * this.cosph0, e = (g - Math.sin(r) * this.sinph0) * m;
        break;
      case this.N_POLE:
        e = -e, r = I - r;
        break;
      case this.S_POLE:
        r -= I;
        break;
    }
    a = e === 0 && (this.mode === this.EQUIT || this.mode === this.OBLIQ) ? 0 : Math.atan2(t, e);
  } else {
    if (d = 0, this.mode === this.OBLIQ || this.mode === this.EQUIT) {
      if (t /= this.dd, e *= this.dd, c = Math.sqrt(t * t + e * e), c < O)
        return s.x = this.long0, s.y = this.lat0, s;
      l = 2 * Math.asin(0.5 * c / this.rq), o = Math.cos(l), t *= l = Math.sin(l), this.mode === this.OBLIQ ? (d = o * this.sinb1 + e * l * this.cosb1 / c, u = this.qp * d, e = c * this.cosb1 * o - e * this.sinb1 * l) : (d = e * l / c, u = this.qp * d, e = c * o);
    } else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
      if (this.mode === this.N_POLE && (e = -e), u = t * t + e * e, !u)
        return s.x = this.long0, s.y = this.lat0, s;
      d = 1 - u / this.qp, this.mode === this.S_POLE && (d = -d);
    }
    a = Math.atan2(t, e), r = Rc(Math.asin(d), this.apa);
  }
  return s.x = N(this.long0 + a, this.over), s.y = r, s;
}
var Lc = 0.3333333333333333, Tc = 0.17222222222222222, Cc = 0.10257936507936508, Ic = 0.06388888888888888, Gc = 0.0664021164021164, Oc = 0.016415012942191543;
function Nc(s) {
  var t, e = [];
  return e[0] = s * Lc, t = s * s, e[0] += t * Tc, e[1] = t * Ic, t *= s, e[0] += t * Cc, e[1] += t * Gc, e[2] = t * Oc, e;
}
function Rc(s, t) {
  var e = s + s;
  return s + t[0] * Math.sin(e) + t[1] * Math.sin(e + e) + t[2] * Math.sin(e + e + e);
}
var kc = ["Lambert Azimuthal Equal Area", "Lambert_Azimuthal_Equal_Area", "laea"];
const zc = {
  init: Ec,
  forward: Sc,
  inverse: Ac,
  names: kc,
  S_POLE: cn,
  N_POLE: fn,
  EQUIT: dn,
  OBLIQ: as
};
function li(s) {
  return Math.abs(s) > 1 && (s = s > 1 ? 1 : -1), Math.asin(s);
}
function Bc() {
  Math.abs(this.lat1 + this.lat2) < O || (this.temp = this.b / this.a, this.es = 1 - Math.pow(this.temp, 2), this.e3 = Math.sqrt(this.es), this.sin_po = Math.sin(this.lat1), this.cos_po = Math.cos(this.lat1), this.t1 = this.sin_po, this.con = this.sin_po, this.ms1 = Xt(this.e3, this.sin_po, this.cos_po), this.qs1 = oi(this.e3, this.sin_po), this.sin_po = Math.sin(this.lat2), this.cos_po = Math.cos(this.lat2), this.t2 = this.sin_po, this.ms2 = Xt(this.e3, this.sin_po, this.cos_po), this.qs2 = oi(this.e3, this.sin_po), this.sin_po = Math.sin(this.lat0), this.cos_po = Math.cos(this.lat0), this.t3 = this.sin_po, this.qs0 = oi(this.e3, this.sin_po), Math.abs(this.lat1 - this.lat2) > O ? this.ns0 = (this.ms1 * this.ms1 - this.ms2 * this.ms2) / (this.qs2 - this.qs1) : this.ns0 = this.con, this.c = this.ms1 * this.ms1 + this.ns0 * this.qs1, this.rh = this.a * Math.sqrt(this.c - this.ns0 * this.qs0) / this.ns0);
}
function Dc(s) {
  var t = s.x, e = s.y;
  this.sin_phi = Math.sin(e), this.cos_phi = Math.cos(e);
  var a = oi(this.e3, this.sin_phi), r = this.a * Math.sqrt(this.c - this.ns0 * a) / this.ns0, o = this.ns0 * N(t - this.long0, this.over), l = r * Math.sin(o) + this.x0, u = this.rh - r * Math.cos(o) + this.y0;
  return s.x = l, s.y = u, s;
}
function Fc(s) {
  var t, e, a, r, o, l;
  return s.x -= this.x0, s.y = this.rh - s.y + this.y0, this.ns0 >= 0 ? (t = Math.sqrt(s.x * s.x + s.y * s.y), a = 1) : (t = -Math.sqrt(s.x * s.x + s.y * s.y), a = -1), r = 0, t !== 0 && (r = Math.atan2(a * s.x, a * s.y)), a = t * this.ns0 / this.a, this.sphere ? l = Math.asin((this.c - a * a) / (2 * this.ns0)) : (e = (this.c - a * a) / this.ns0, l = this.phi1z(this.e3, e)), o = N(r / this.ns0 + this.long0, this.over), s.x = o, s.y = l, s;
}
function Zc(s, t) {
  var e, a, r, o, l, u = li(0.5 * t);
  if (s < O)
    return u;
  for (var c = s * s, d = 1; d <= 25; d++)
    if (e = Math.sin(u), a = Math.cos(u), r = s * e, o = 1 - r * r, l = 0.5 * o * o / a * (t / (1 - c) - e / o + 0.5 / s * Math.log((1 - r) / (1 + r))), u = u + l, Math.abs(l) <= 1e-7)
      return u;
  return null;
}
var Uc = ["Albers_Conic_Equal_Area", "Albers_Equal_Area", "Albers", "aea"];
const qc = {
  init: Bc,
  forward: Dc,
  inverse: Fc,
  names: Uc,
  phi1z: Zc
};
function jc() {
  this.sin_p14 = Math.sin(this.lat0), this.cos_p14 = Math.cos(this.lat0), this.infinity_dist = 1e3 * this.a, this.rc = 1;
}
function Wc(s) {
  var t, e, a, r, o, l, u, c, d = s.x, g = s.y;
  return a = N(d - this.long0, this.over), t = Math.sin(g), e = Math.cos(g), r = Math.cos(a), l = this.sin_p14 * t + this.cos_p14 * e * r, o = 1, l > 0 || Math.abs(l) <= O ? (u = this.x0 + this.a * o * e * Math.sin(a) / l, c = this.y0 + this.a * o * (this.cos_p14 * t - this.sin_p14 * e * r) / l) : (u = this.x0 + this.infinity_dist * e * Math.sin(a), c = this.y0 + this.infinity_dist * (this.cos_p14 * t - this.sin_p14 * e * r)), s.x = u, s.y = c, s;
}
function Hc(s) {
  var t, e, a, r, o, l;
  return s.x = (s.x - this.x0) / this.a, s.y = (s.y - this.y0) / this.a, s.x /= this.k0, s.y /= this.k0, (t = Math.sqrt(s.x * s.x + s.y * s.y)) ? (r = Math.atan2(t, this.rc), e = Math.sin(r), a = Math.cos(r), l = li(a * this.sin_p14 + s.y * e * this.cos_p14 / t), o = Math.atan2(s.x * e, t * this.cos_p14 * a - s.y * this.sin_p14 * e), o = N(this.long0 + o, this.over)) : (l = this.phic0, o = 0), s.x = o, s.y = l, s;
}
var Xc = ["gnom"];
const Vc = {
  init: jc,
  forward: Wc,
  inverse: Hc,
  names: Xc
};
function Yc(s, t) {
  var e = 1 - (1 - s * s) / (2 * s) * Math.log((1 - s) / (1 + s));
  if (Math.abs(Math.abs(t) - e) < 1e-6)
    return t < 0 ? -1 * I : I;
  for (var a = Math.asin(0.5 * t), r, o, l, u, c = 0; c < 30; c++)
    if (o = Math.sin(a), l = Math.cos(a), u = s * o, r = Math.pow(1 - u * u, 2) / (2 * l) * (t / (1 - s * s) - o / (1 - u * u) + 0.5 / s * Math.log((1 - u) / (1 + u))), a += r, Math.abs(r) <= 1e-10)
      return a;
  return NaN;
}
function Kc() {
  this.sphere || (this.k0 = Xt(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts)));
}
function $c(s) {
  var t = s.x, e = s.y, a, r, o = N(t - this.long0, this.over);
  if (this.sphere)
    a = this.x0 + this.a * o * Math.cos(this.lat_ts), r = this.y0 + this.a * Math.sin(e) / Math.cos(this.lat_ts);
  else {
    var l = oi(this.e, Math.sin(e));
    a = this.x0 + this.a * this.k0 * o, r = this.y0 + this.a * l * 0.5 / this.k0;
  }
  return s.x = a, s.y = r, s;
}
function Jc(s) {
  s.x -= this.x0, s.y -= this.y0;
  var t, e;
  return this.sphere ? (t = N(this.long0 + s.x / this.a / Math.cos(this.lat_ts), this.over), e = Math.asin(s.y / this.a * Math.cos(this.lat_ts))) : (e = Yc(this.e, 2 * s.y * this.k0 / this.a), t = N(this.long0 + s.x / (this.a * this.k0), this.over)), s.x = t, s.y = e, s;
}
var Qc = ["cea"];
const tf = {
  init: Kc,
  forward: $c,
  inverse: Jc,
  names: Qc
};
function ef() {
  this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, this.lat0 = this.lat0 || 0, this.long0 = this.long0 || 0, this.lat_ts = this.lat_ts || 0, this.title = this.title || "Equidistant Cylindrical (Plate Carre)", this.rc = Math.cos(this.lat_ts);
}
function sf(s) {
  var t = s.x, e = s.y, a = N(t - this.long0, this.over), r = ui(e - this.lat0);
  return s.x = this.x0 + this.a * a * this.rc, s.y = this.y0 + this.a * r, s;
}
function nf(s) {
  var t = s.x, e = s.y;
  return s.x = N(this.long0 + (t - this.x0) / (this.a * this.rc), this.over), s.y = ui(this.lat0 + (e - this.y0) / this.a), s;
}
var af = ["Equirectangular", "Equidistant_Cylindrical", "Equidistant_Cylindrical_Spherical", "eqc"];
const rf = {
  init: ef,
  forward: sf,
  inverse: nf,
  names: af
};
var pr = 20;
function of() {
  this.temp = this.b / this.a, this.es = 1 - Math.pow(this.temp, 2), this.e = Math.sqrt(this.es), this.e0 = Ae(this.es), this.e1 = Le(this.es), this.e2 = Te(this.es), this.e3 = Ce(this.es), this.ml0 = this.a * xt(this.e0, this.e1, this.e2, this.e3, this.lat0);
}
function hf(s) {
  var t = s.x, e = s.y, a, r, o, l = N(t - this.long0, this.over);
  if (o = l * Math.sin(e), this.sphere)
    Math.abs(e) <= O ? (a = this.a * l, r = -1 * this.a * this.lat0) : (a = this.a * Math.sin(o) / Math.tan(e), r = this.a * (ui(e - this.lat0) + (1 - Math.cos(o)) / Math.tan(e)));
  else if (Math.abs(e) <= O)
    a = this.a * l, r = -1 * this.ml0;
  else {
    var u = An(this.a, this.e, Math.sin(e)) / Math.tan(e);
    a = u * Math.sin(o), r = this.a * xt(this.e0, this.e1, this.e2, this.e3, e) - this.ml0 + u * (1 - Math.cos(o));
  }
  return s.x = a + this.x0, s.y = r + this.y0, s;
}
function lf(s) {
  var t, e, a, r, o, l, u, c, d;
  if (a = s.x - this.x0, r = s.y - this.y0, this.sphere)
    if (Math.abs(r + this.a * this.lat0) <= O)
      t = N(a / this.a + this.long0, this.over), e = 0;
    else {
      l = this.lat0 + r / this.a, u = a * a / this.a / this.a + l * l, c = l;
      var g;
      for (o = pr; o; --o)
        if (g = Math.tan(c), d = -1 * (l * (c * g + 1) - c - 0.5 * (c * c + u) * g) / ((c - l) / g - 1), c += d, Math.abs(d) <= O) {
          e = c;
          break;
        }
      t = N(this.long0 + Math.asin(a * Math.tan(c) / this.a) / Math.sin(e), this.over);
    }
  else if (Math.abs(r + this.ml0) <= O)
    e = 0, t = N(this.long0 + a / this.a, this.over);
  else {
    l = (this.ml0 + r) / this.a, u = a * a / this.a / this.a + l * l, c = l;
    var m, p, y, M, w;
    for (o = pr; o; --o)
      if (w = this.e * Math.sin(c), m = Math.sqrt(1 - w * w) * Math.tan(c), p = this.a * xt(this.e0, this.e1, this.e2, this.e3, c), y = this.e0 - 2 * this.e1 * Math.cos(2 * c) + 4 * this.e2 * Math.cos(4 * c) - 6 * this.e3 * Math.cos(6 * c), M = p / this.a, d = (l * (m * M + 1) - M - 0.5 * m * (M * M + u)) / (this.es * Math.sin(2 * c) * (M * M + u - 2 * l * M) / (4 * m) + (l - M) * (m * y - 2 / Math.sin(2 * c)) - y), c -= d, Math.abs(d) <= O) {
        e = c;
        break;
      }
    m = Math.sqrt(1 - this.es * Math.pow(Math.sin(e), 2)) * Math.tan(e), t = N(this.long0 + Math.asin(a * m / this.a) / Math.sin(e), this.over);
  }
  return s.x = t, s.y = e, s;
}
var uf = ["Polyconic", "American_Polyconic", "poly"];
const cf = {
  init: of,
  forward: hf,
  inverse: lf,
  names: uf
};
function ff() {
  this.A = [], this.A[1] = 0.6399175073, this.A[2] = -0.1358797613, this.A[3] = 0.063294409, this.A[4] = -0.02526853, this.A[5] = 0.0117879, this.A[6] = -55161e-7, this.A[7] = 26906e-7, this.A[8] = -1333e-6, this.A[9] = 67e-5, this.A[10] = -34e-5, this.B_re = [], this.B_im = [], this.B_re[1] = 0.7557853228, this.B_im[1] = 0, this.B_re[2] = 0.249204646, this.B_im[2] = 3371507e-9, this.B_re[3] = -1541739e-9, this.B_im[3] = 0.04105856, this.B_re[4] = -0.10162907, this.B_im[4] = 0.01727609, this.B_re[5] = -0.26623489, this.B_im[5] = -0.36249218, this.B_re[6] = -0.6870983, this.B_im[6] = -1.1651967, this.C_re = [], this.C_im = [], this.C_re[1] = 1.3231270439, this.C_im[1] = 0, this.C_re[2] = -0.577245789, this.C_im[2] = -7809598e-9, this.C_re[3] = 0.508307513, this.C_im[3] = -0.112208952, this.C_re[4] = -0.15094762, this.C_im[4] = 0.18200602, this.C_re[5] = 1.01418179, this.C_im[5] = 1.64497696, this.C_re[6] = 1.9660549, this.C_im[6] = 2.5127645, this.D = [], this.D[1] = 1.5627014243, this.D[2] = 0.5185406398, this.D[3] = -0.03333098, this.D[4] = -0.1052906, this.D[5] = -0.0368594, this.D[6] = 7317e-6, this.D[7] = 0.0122, this.D[8] = 394e-5, this.D[9] = -13e-4;
}
function df(s) {
  var t, e = s.x, a = s.y, r = a - this.lat0, o = e - this.long0, l = r / me * 1e-5, u = o, c = 1, d = 0;
  for (t = 1; t <= 10; t++)
    c = c * l, d = d + this.A[t] * c;
  var g = d, m = u, p = 1, y = 0, M, w, P = 0, E = 0;
  for (t = 1; t <= 6; t++)
    M = p * g - y * m, w = y * g + p * m, p = M, y = w, P = P + this.B_re[t] * p - this.B_im[t] * y, E = E + this.B_im[t] * p + this.B_re[t] * y;
  return s.x = E * this.a + this.x0, s.y = P * this.a + this.y0, s;
}
function _f(s) {
  var t, e = s.x, a = s.y, r = e - this.x0, o = a - this.y0, l = o / this.a, u = r / this.a, c = 1, d = 0, g, m, p = 0, y = 0;
  for (t = 1; t <= 6; t++)
    g = c * l - d * u, m = d * l + c * u, c = g, d = m, p = p + this.C_re[t] * c - this.C_im[t] * d, y = y + this.C_im[t] * c + this.C_re[t] * d;
  for (var M = 0; M < this.iterations; M++) {
    var w = p, P = y, E, A, T = l, G = u;
    for (t = 2; t <= 6; t++)
      E = w * p - P * y, A = P * p + w * y, w = E, P = A, T = T + (t - 1) * (this.B_re[t] * w - this.B_im[t] * P), G = G + (t - 1) * (this.B_im[t] * w + this.B_re[t] * P);
    w = 1, P = 0;
    var R = this.B_re[1], z = this.B_im[1];
    for (t = 2; t <= 6; t++)
      E = w * p - P * y, A = P * p + w * y, w = E, P = A, R = R + t * (this.B_re[t] * w - this.B_im[t] * P), z = z + t * (this.B_im[t] * w + this.B_re[t] * P);
    var Z = R * R + z * z;
    p = (T * R + G * z) / Z, y = (G * R - T * z) / Z;
  }
  var X = p, F = y, Y = 1, Q = 0;
  for (t = 1; t <= 9; t++)
    Y = Y * X, Q = Q + this.D[t] * Y;
  var _t = this.lat0 + Q * me * 1e5, ei = this.long0 + F;
  return s.x = ei, s.y = _t, s;
}
var mf = ["New_Zealand_Map_Grid", "nzmg"];
const gf = {
  init: ff,
  forward: df,
  inverse: _f,
  names: mf
};
function pf() {
}
function vf(s) {
  var t = s.x, e = s.y, a = N(t - this.long0, this.over), r = this.x0 + this.a * a, o = this.y0 + this.a * Math.log(Math.tan(Math.PI / 4 + e / 2.5)) * 1.25;
  return s.x = r, s.y = o, s;
}
function yf(s) {
  s.x -= this.x0, s.y -= this.y0;
  var t = N(this.long0 + s.x / this.a, this.over), e = 2.5 * (Math.atan(Math.exp(0.8 * s.y / this.a)) - Math.PI / 4);
  return s.x = t, s.y = e, s;
}
var Mf = ["Miller_Cylindrical", "mill"];
const wf = {
  init: pf,
  forward: vf,
  inverse: yf,
  names: Mf
};
var xf = 20;
function Pf() {
  this.sphere ? (this.n = 1, this.m = 0, this.es = 0, this.C_y = Math.sqrt((this.m + 1) / this.n), this.C_x = this.C_y / (this.m + 1)) : this.en = wn(this.es);
}
function bf(s) {
  var t, e, a = s.x, r = s.y;
  if (a = N(a - this.long0, this.over), this.sphere) {
    if (!this.m)
      r = this.n !== 1 ? Math.asin(this.n * Math.sin(r)) : r;
    else
      for (var o = this.n * Math.sin(r), l = xf; l; --l) {
        var u = (this.m * r + Math.sin(r) - o) / (this.m + Math.cos(r));
        if (r -= u, Math.abs(u) < O)
          break;
      }
    t = this.a * this.C_x * a * (this.m + Math.cos(r)), e = this.a * this.C_y * r;
  } else {
    var c = Math.sin(r), d = Math.cos(r);
    e = this.a * Zi(r, c, d, this.en), t = this.a * a * d / Math.sqrt(1 - this.es * c * c);
  }
  return s.x = t, s.y = e, s;
}
function Ef(s) {
  var t, e, a, r;
  return s.x -= this.x0, a = s.x / this.a, s.y -= this.y0, t = s.y / this.a, this.sphere ? (t /= this.C_y, a = a / (this.C_x * (this.m + Math.cos(t))), this.m ? t = li((this.m * t + Math.sin(t)) / this.n) : this.n !== 1 && (t = li(Math.sin(t) / this.n)), a = N(a + this.long0, this.over), t = ui(t)) : (t = xn(s.y / this.a, this.es, this.en), r = Math.abs(t), r < I ? (r = Math.sin(t), e = this.long0 + s.x * Math.sqrt(1 - this.es * r * r) / (this.a * Math.cos(t)), a = N(e, this.over)) : r - O < I && (a = this.long0)), s.x = a, s.y = t, s;
}
var Sf = ["Sinusoidal", "sinu"];
const Af = {
  init: Pf,
  forward: bf,
  inverse: Ef,
  names: Sf
};
function Lf() {
  this.x0 = this.x0 !== void 0 ? this.x0 : 0, this.y0 = this.y0 !== void 0 ? this.y0 : 0, this.long0 = this.long0 !== void 0 ? this.long0 : 0;
}
function Tf(s) {
  for (var t = s.x, e = s.y, a = N(t - this.long0, this.over), r = e, o = Math.PI * Math.sin(e); ; ) {
    var l = -(r + Math.sin(r) - o) / (1 + Math.cos(r));
    if (r += l, Math.abs(l) < O)
      break;
  }
  r /= 2, Math.PI / 2 - Math.abs(e) < O && (a = 0);
  var u = 0.900316316158 * this.a * a * Math.cos(r) + this.x0, c = 1.4142135623731 * this.a * Math.sin(r) + this.y0;
  return s.x = u, s.y = c, s;
}
function Cf(s) {
  var t, e;
  s.x -= this.x0, s.y -= this.y0, e = s.y / (1.4142135623731 * this.a), Math.abs(e) > 0.999999999999 && (e = 0.999999999999), t = Math.asin(e);
  var a = N(this.long0 + s.x / (0.900316316158 * this.a * Math.cos(t)), this.over);
  a < -Math.PI && (a = -Math.PI), a > Math.PI && (a = Math.PI), e = (2 * t + Math.sin(2 * t)) / Math.PI, Math.abs(e) > 1 && (e = 1);
  var r = Math.asin(e);
  return s.x = a, s.y = r, s;
}
var If = ["Mollweide", "moll"];
const Gf = {
  init: Lf,
  forward: Tf,
  inverse: Cf,
  names: If
};
function Of() {
  Math.abs(this.lat1 + this.lat2) < O || (this.lat2 = this.lat2 || this.lat1, this.temp = this.b / this.a, this.es = 1 - Math.pow(this.temp, 2), this.e = Math.sqrt(this.es), this.e0 = Ae(this.es), this.e1 = Le(this.es), this.e2 = Te(this.es), this.e3 = Ce(this.es), this.sin_phi = Math.sin(this.lat1), this.cos_phi = Math.cos(this.lat1), this.ms1 = Xt(this.e, this.sin_phi, this.cos_phi), this.ml1 = xt(this.e0, this.e1, this.e2, this.e3, this.lat1), Math.abs(this.lat1 - this.lat2) < O ? this.ns = this.sin_phi : (this.sin_phi = Math.sin(this.lat2), this.cos_phi = Math.cos(this.lat2), this.ms2 = Xt(this.e, this.sin_phi, this.cos_phi), this.ml2 = xt(this.e0, this.e1, this.e2, this.e3, this.lat2), this.ns = (this.ms1 - this.ms2) / (this.ml2 - this.ml1)), this.g = this.ml1 + this.ms1 / this.ns, this.ml0 = xt(this.e0, this.e1, this.e2, this.e3, this.lat0), this.rh = this.a * (this.g - this.ml0));
}
function Nf(s) {
  var t = s.x, e = s.y, a;
  if (this.sphere)
    a = this.a * (this.g - e);
  else {
    var r = xt(this.e0, this.e1, this.e2, this.e3, e);
    a = this.a * (this.g - r);
  }
  var o = this.ns * N(t - this.long0, this.over), l = this.x0 + a * Math.sin(o), u = this.y0 + this.rh - a * Math.cos(o);
  return s.x = l, s.y = u, s;
}
function Rf(s) {
  s.x -= this.x0, s.y = this.rh - s.y + this.y0;
  var t, e, a, r;
  this.ns >= 0 ? (e = Math.sqrt(s.x * s.x + s.y * s.y), t = 1) : (e = -Math.sqrt(s.x * s.x + s.y * s.y), t = -1);
  var o = 0;
  if (e !== 0 && (o = Math.atan2(t * s.x, t * s.y)), this.sphere)
    return r = N(this.long0 + o / this.ns, this.over), a = ui(this.g - e / this.a), s.x = r, s.y = a, s;
  var l = this.g - e / this.a;
  return a = cs(l, this.e0, this.e1, this.e2, this.e3), r = N(this.long0 + o / this.ns, this.over), s.x = r, s.y = a, s;
}
var kf = ["Equidistant_Conic", "eqdc"];
const zf = {
  init: Of,
  forward: Nf,
  inverse: Rf,
  names: kf
};
function Bf() {
  this.R = this.a;
}
function Df(s) {
  var t = s.x, e = s.y, a = N(t - this.long0, this.over), r, o;
  Math.abs(e) <= O && (r = this.x0 + this.R * a, o = this.y0);
  var l = li(2 * Math.abs(e / Math.PI));
  (Math.abs(a) <= O || Math.abs(Math.abs(e) - I) <= O) && (r = this.x0, e >= 0 ? o = this.y0 + Math.PI * this.R * Math.tan(0.5 * l) : o = this.y0 + Math.PI * this.R * -Math.tan(0.5 * l));
  var u = 0.5 * Math.abs(Math.PI / a - a / Math.PI), c = u * u, d = Math.sin(l), g = Math.cos(l), m = g / (d + g - 1), p = m * m, y = m * (2 / d - 1), M = y * y, w = Math.PI * this.R * (u * (m - M) + Math.sqrt(c * (m - M) * (m - M) - (M + c) * (p - M))) / (M + c);
  a < 0 && (w = -w), r = this.x0 + w;
  var P = c + m;
  return w = Math.PI * this.R * (y * P - u * Math.sqrt((M + c) * (c + 1) - P * P)) / (M + c), e >= 0 ? o = this.y0 + w : o = this.y0 - w, s.x = r, s.y = o, s;
}
function Ff(s) {
  var t, e, a, r, o, l, u, c, d, g, m, p, y;
  return s.x -= this.x0, s.y -= this.y0, m = Math.PI * this.R, a = s.x / m, r = s.y / m, o = a * a + r * r, l = -Math.abs(r) * (1 + o), u = l - 2 * r * r + a * a, c = -2 * l + 1 + 2 * r * r + o * o, y = r * r / c + (2 * u * u * u / c / c / c - 9 * l * u / c / c) / 27, d = (l - u * u / 3 / c) / c, g = 2 * Math.sqrt(-d / 3), m = 3 * y / d / g, Math.abs(m) > 1 && (m >= 0 ? m = 1 : m = -1), p = Math.acos(m) / 3, s.y >= 0 ? e = (-g * Math.cos(p + Math.PI / 3) - u / 3 / c) * Math.PI : e = -(-g * Math.cos(p + Math.PI / 3) - u / 3 / c) * Math.PI, Math.abs(a) < O ? t = this.long0 : t = N(this.long0 + Math.PI * (o - 1 + Math.sqrt(1 + 2 * (a * a - r * r) + o * o)) / 2 / a, this.over), s.x = t, s.y = e, s;
}
var Zf = ["Van_der_Grinten_I", "VanDerGrinten", "Van_der_Grinten", "vandg"];
const Uf = {
  init: Bf,
  forward: Df,
  inverse: Ff,
  names: Zf
};
function qf(s, t, e, a, r, o) {
  const l = a - t, u = Math.atan((1 - o) * Math.tan(s)), c = Math.atan((1 - o) * Math.tan(e)), d = Math.sin(u), g = Math.cos(u), m = Math.sin(c), p = Math.cos(c);
  let y = l, M, w = 100, P, E, A, T, G, R, z, Z, X, F, Y, Q, _t, ei;
  do {
    if (P = Math.sin(y), E = Math.cos(y), A = Math.sqrt(
      p * P * (p * P) + (g * m - d * p * E) * (g * m - d * p * E)
    ), A === 0)
      return { azi1: 0, s12: 0 };
    T = d * m + g * p * E, G = Math.atan2(A, T), R = g * p * P / A, z = 1 - R * R, Z = z !== 0 ? T - 2 * d * m / z : 0, X = o / 16 * z * (4 + o * (4 - 3 * z)), M = y, y = l + (1 - X) * o * R * (G + X * A * (Z + X * T * (-1 + 2 * Z * Z)));
  } while (Math.abs(y - M) > 1e-12 && --w > 0);
  return w === 0 ? { azi1: NaN, s12: NaN } : (F = z * (r * r - r * (1 - o) * (r * (1 - o))) / (r * (1 - o) * (r * (1 - o))), Y = 1 + F / 16384 * (4096 + F * (-768 + F * (320 - 175 * F))), Q = F / 1024 * (256 + F * (-128 + F * (74 - 47 * F))), _t = Q * A * (Z + Q / 4 * (T * (-1 + 2 * Z * Z) - Q / 6 * Z * (-3 + 4 * A * A) * (-3 + 4 * Z * Z))), ei = r * (1 - o) * Y * (G - _t), { azi1: Math.atan2(p * P, g * m - d * p * E), s12: ei });
}
function jf(s, t, e, a, r, o) {
  const l = Math.atan((1 - o) * Math.tan(s)), u = Math.sin(l), c = Math.cos(l), d = Math.sin(e), g = Math.cos(e), m = Math.atan2(u, c * g), p = c * d, y = 1 - p * p, M = y * (r * r - r * (1 - o) * (r * (1 - o))) / (r * (1 - o) * (r * (1 - o))), w = 1 + M / 16384 * (4096 + M * (-768 + M * (320 - 175 * M))), P = M / 1024 * (256 + M * (-128 + M * (74 - 47 * M)));
  let E = a / (r * (1 - o) * w), A, T = 100, G, R, z, Z;
  do
    G = Math.cos(2 * m + E), R = Math.sin(E), z = Math.cos(E), Z = P * R * (G + P / 4 * (z * (-1 + 2 * G * G) - P / 6 * G * (-3 + 4 * R * R) * (-3 + 4 * G * G))), A = E, E = a / (r * (1 - o) * w) + Z;
  while (Math.abs(E - A) > 1e-12 && --T > 0);
  if (T === 0)
    return { lat2: NaN, lon2: NaN };
  const X = u * R - c * z * g, F = Math.atan2(
    u * z + c * R * g,
    (1 - o) * Math.sqrt(p * p + X * X)
  ), Y = Math.atan2(
    R * d,
    c * z - u * R * g
  ), Q = o / 16 * y * (4 + o * (4 - 3 * y)), _t = Y - (1 - Q) * o * p * (E + Q * R * (G + Q * z * (-1 + 2 * G * G))), ei = t + _t;
  return { lat2: F, lon2: ei };
}
function Wf() {
  this.sin_p12 = Math.sin(this.lat0), this.cos_p12 = Math.cos(this.lat0), this.f = this.es / (1 + Math.sqrt(1 - this.es));
}
function Hf(s) {
  var t = s.x, e = s.y, a = Math.sin(s.y), r = Math.cos(s.y), o = N(t - this.long0, this.over), l, u, c, d, g, m, p, y, M, w, P;
  return this.sphere ? Math.abs(this.sin_p12 - 1) <= O ? (s.x = this.x0 + this.a * (I - e) * Math.sin(o), s.y = this.y0 - this.a * (I - e) * Math.cos(o), s) : Math.abs(this.sin_p12 + 1) <= O ? (s.x = this.x0 + this.a * (I + e) * Math.sin(o), s.y = this.y0 + this.a * (I + e) * Math.cos(o), s) : (M = this.sin_p12 * a + this.cos_p12 * r * Math.cos(o), p = Math.acos(M), y = p ? p / Math.sin(p) : 1, s.x = this.x0 + this.a * y * r * Math.sin(o), s.y = this.y0 + this.a * y * (this.cos_p12 * a - this.sin_p12 * r * Math.cos(o)), s) : (l = Ae(this.es), u = Le(this.es), c = Te(this.es), d = Ce(this.es), Math.abs(this.sin_p12 - 1) <= O ? (g = this.a * xt(l, u, c, d, I), m = this.a * xt(l, u, c, d, e), s.x = this.x0 + (g - m) * Math.sin(o), s.y = this.y0 - (g - m) * Math.cos(o), s) : Math.abs(this.sin_p12 + 1) <= O ? (g = this.a * xt(l, u, c, d, I), m = this.a * xt(l, u, c, d, e), s.x = this.x0 + (g + m) * Math.sin(o), s.y = this.y0 + (g + m) * Math.cos(o), s) : Math.abs(t) < O && Math.abs(e - this.lat0) < O ? (s.x = s.y = 0, s) : (w = qf(this.lat0, this.long0, e, t, this.a, this.f), P = w.azi1, s.x = w.s12 * Math.sin(P), s.y = w.s12 * Math.cos(P), s));
}
function Xf(s) {
  s.x -= this.x0, s.y -= this.y0;
  var t, e, a, r, o, l, u, c, d, g, m, p, y, M, w, P;
  return this.sphere ? (t = Math.sqrt(s.x * s.x + s.y * s.y), t > 2 * I * this.a ? void 0 : (e = t / this.a, a = Math.sin(e), r = Math.cos(e), o = this.long0, Math.abs(t) <= O ? l = this.lat0 : (l = li(r * this.sin_p12 + s.y * a * this.cos_p12 / t), u = Math.abs(this.lat0) - I, Math.abs(u) <= O ? this.lat0 >= 0 ? o = N(this.long0 + Math.atan2(s.x, -s.y), this.over) : o = N(this.long0 - Math.atan2(-s.x, s.y), this.over) : o = N(this.long0 + Math.atan2(s.x * a, t * this.cos_p12 * r - s.y * this.sin_p12 * a), this.over)), s.x = o, s.y = l, s)) : (c = Ae(this.es), d = Le(this.es), g = Te(this.es), m = Ce(this.es), Math.abs(this.sin_p12 - 1) <= O ? (p = this.a * xt(c, d, g, m, I), t = Math.sqrt(s.x * s.x + s.y * s.y), y = p - t, l = cs(y / this.a, c, d, g, m), o = N(this.long0 + Math.atan2(s.x, -1 * s.y), this.over), s.x = o, s.y = l, s) : Math.abs(this.sin_p12 + 1) <= O ? (p = this.a * xt(c, d, g, m, I), t = Math.sqrt(s.x * s.x + s.y * s.y), y = t - p, l = cs(y / this.a, c, d, g, m), o = N(this.long0 + Math.atan2(s.x, s.y), this.over), s.x = o, s.y = l, s) : (M = Math.atan2(s.x, s.y), w = Math.sqrt(s.x * s.x + s.y * s.y), P = jf(this.lat0, this.long0, M, w, this.a, this.f), s.x = P.lon2, s.y = P.lat2, s));
}
var Vf = ["Azimuthal_Equidistant", "aeqd"];
const Yf = {
  init: Wf,
  forward: Hf,
  inverse: Xf,
  names: Vf
};
function Kf() {
  this.sin_p14 = Math.sin(this.lat0 || 0), this.cos_p14 = Math.cos(this.lat0 || 0);
}
function $f(s) {
  var t, e, a, r, o, l, u, c, d = s.x, g = s.y;
  return a = N(d - (this.long0 || 0), this.over), t = Math.sin(g), e = Math.cos(g), r = Math.cos(a), l = this.sin_p14 * t + this.cos_p14 * e * r, o = 1, (l > 0 || Math.abs(l) <= O) && (u = this.a * o * e * Math.sin(a), c = (this.y0 || 0) + this.a * o * (this.cos_p14 * t - this.sin_p14 * e * r)), s.x = u, s.y = c, s;
}
function Jf(s) {
  var t, e, a, r, o, l, u, c, d;
  return s.x -= this.x0 || 0, s.y -= this.y0 || 0, t = Math.sqrt(s.x * s.x + s.y * s.y), e = li(t / this.a), a = Math.sin(e), r = Math.cos(e), c = this.long0 || 0, d = this.lat0 || 0, l = c, Math.abs(t) <= O ? (u = d, s.x = l, s.y = u, s) : (u = li(r * this.sin_p14 + s.y * a * this.cos_p14 / t), o = Math.abs(d) - I, Math.abs(o) <= O ? (d >= 0 ? l = N(c + Math.atan2(s.x, -s.y), this.over) : l = N(c - Math.atan2(-s.x, s.y), this.over), s.x = l, s.y = u, s) : (l = N(c + Math.atan2(s.x * a, t * this.cos_p14 * r - s.y * this.sin_p14 * a), this.over), s.x = l, s.y = u, s));
}
var Qf = ["ortho"];
const td = {
  init: Kf,
  forward: $f,
  inverse: Jf,
  names: Qf
};
var rt = {
  FRONT: 1,
  RIGHT: 2,
  BACK: 3,
  LEFT: 4,
  TOP: 5,
  BOTTOM: 6
}, it = {
  AREA_0: 1,
  AREA_1: 2,
  AREA_2: 3,
  AREA_3: 4
};
function id() {
  this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, this.lat0 = this.lat0 || 0, this.long0 = this.long0 || 0, this.lat_ts = this.lat_ts || 0, this.title = this.title || "Quadrilateralized Spherical Cube", this.lat0 >= I - tt / 2 ? this.face = rt.TOP : this.lat0 <= -(I - tt / 2) ? this.face = rt.BOTTOM : Math.abs(this.long0) <= tt ? this.face = rt.FRONT : Math.abs(this.long0) <= I + tt ? this.face = this.long0 > 0 ? rt.RIGHT : rt.LEFT : this.face = rt.BACK, this.es !== 0 && (this.one_minus_f = 1 - (this.a - this.b) / this.a, this.one_minus_f_squared = this.one_minus_f * this.one_minus_f);
}
function ed(s) {
  var t = { x: 0, y: 0 }, e, a, r, o, l, u, c = { value: 0 };
  if (s.x -= this.long0, this.es !== 0 ? e = Math.atan(this.one_minus_f_squared * Math.tan(s.y)) : e = s.y, a = s.x, this.face === rt.TOP)
    o = I - e, a >= tt && a <= I + tt ? (c.value = it.AREA_0, r = a - I) : a > I + tt || a <= -(I + tt) ? (c.value = it.AREA_1, r = a > 0 ? a - ut : a + ut) : a > -(I + tt) && a <= -tt ? (c.value = it.AREA_2, r = a + I) : (c.value = it.AREA_3, r = a);
  else if (this.face === rt.BOTTOM)
    o = I + e, a >= tt && a <= I + tt ? (c.value = it.AREA_0, r = -a + I) : a < tt && a >= -tt ? (c.value = it.AREA_1, r = -a) : a < -tt && a >= -(I + tt) ? (c.value = it.AREA_2, r = -a - I) : (c.value = it.AREA_3, r = a > 0 ? -a + ut : -a - ut);
  else {
    var d, g, m, p, y, M, w;
    this.face === rt.RIGHT ? a = Bi(a, +I) : this.face === rt.BACK ? a = Bi(a, +ut) : this.face === rt.LEFT && (a = Bi(a, -I)), p = Math.sin(e), y = Math.cos(e), M = Math.sin(a), w = Math.cos(a), d = y * w, g = y * M, m = p, this.face === rt.FRONT ? (o = Math.acos(d), r = ts(o, m, g, c)) : this.face === rt.RIGHT ? (o = Math.acos(g), r = ts(o, m, -d, c)) : this.face === rt.BACK ? (o = Math.acos(-d), r = ts(o, m, -g, c)) : this.face === rt.LEFT ? (o = Math.acos(-g), r = ts(o, m, d, c)) : (o = r = 0, c.value = it.AREA_0);
  }
  return u = Math.atan(12 / ut * (r + Math.acos(Math.sin(r) * Math.cos(tt)) - I)), l = Math.sqrt((1 - Math.cos(o)) / (Math.cos(u) * Math.cos(u)) / (1 - Math.cos(Math.atan(1 / Math.cos(r))))), c.value === it.AREA_1 ? u += I : c.value === it.AREA_2 ? u += ut : c.value === it.AREA_3 && (u += 1.5 * ut), t.x = l * Math.cos(u), t.y = l * Math.sin(u), t.x = t.x * this.a + this.x0, t.y = t.y * this.a + this.y0, s.x = t.x, s.y = t.y, s;
}
function sd(s) {
  var t = { lam: 0, phi: 0 }, e, a, r, o, l, u, c, d, g, m = { value: 0 };
  if (s.x = (s.x - this.x0) / this.a, s.y = (s.y - this.y0) / this.a, a = Math.atan(Math.sqrt(s.x * s.x + s.y * s.y)), e = Math.atan2(s.y, s.x), s.x >= 0 && s.x >= Math.abs(s.y) ? m.value = it.AREA_0 : s.y >= 0 && s.y >= Math.abs(s.x) ? (m.value = it.AREA_1, e -= I) : s.x < 0 && -s.x >= Math.abs(s.y) ? (m.value = it.AREA_2, e = e < 0 ? e + ut : e - ut) : (m.value = it.AREA_3, e += I), g = ut / 12 * Math.tan(e), l = Math.sin(g) / (Math.cos(g) - 1 / Math.sqrt(2)), u = Math.atan(l), r = Math.cos(e), o = Math.tan(a), c = 1 - r * r * o * o * (1 - Math.cos(Math.atan(1 / Math.cos(u)))), c < -1 ? c = -1 : c > 1 && (c = 1), this.face === rt.TOP)
    d = Math.acos(c), t.phi = I - d, m.value === it.AREA_0 ? t.lam = u + I : m.value === it.AREA_1 ? t.lam = u < 0 ? u + ut : u - ut : m.value === it.AREA_2 ? t.lam = u - I : t.lam = u;
  else if (this.face === rt.BOTTOM)
    d = Math.acos(c), t.phi = d - I, m.value === it.AREA_0 ? t.lam = -u + I : m.value === it.AREA_1 ? t.lam = -u : m.value === it.AREA_2 ? t.lam = -u - I : t.lam = u < 0 ? -u - ut : -u + ut;
  else {
    var p, y, M;
    p = c, g = p * p, g >= 1 ? M = 0 : M = Math.sqrt(1 - g) * Math.sin(u), g += M * M, g >= 1 ? y = 0 : y = Math.sqrt(1 - g), m.value === it.AREA_1 ? (g = y, y = -M, M = g) : m.value === it.AREA_2 ? (y = -y, M = -M) : m.value === it.AREA_3 && (g = y, y = M, M = -g), this.face === rt.RIGHT ? (g = p, p = -y, y = g) : this.face === rt.BACK ? (p = -p, y = -y) : this.face === rt.LEFT && (g = p, p = y, y = -g), t.phi = Math.acos(-M) - I, t.lam = Math.atan2(y, p), this.face === rt.RIGHT ? t.lam = Bi(t.lam, -I) : this.face === rt.BACK ? t.lam = Bi(t.lam, -ut) : this.face === rt.LEFT && (t.lam = Bi(t.lam, +I));
  }
  if (this.es !== 0) {
    var w, P, E;
    w = t.phi < 0 ? 1 : 0, P = Math.tan(t.phi), E = this.b / Math.sqrt(P * P + this.one_minus_f_squared), t.phi = Math.atan(Math.sqrt(this.a * this.a - E * E) / (this.one_minus_f * E)), w && (t.phi = -t.phi);
  }
  return t.lam += this.long0, s.x = t.lam, s.y = t.phi, s;
}
function ts(s, t, e, a) {
  var r;
  return s < O ? (a.value = it.AREA_0, r = 0) : (r = Math.atan2(t, e), Math.abs(r) <= tt ? a.value = it.AREA_0 : r > tt && r <= I + tt ? (a.value = it.AREA_1, r -= I) : r > I + tt || r <= -(I + tt) ? (a.value = it.AREA_2, r = r >= 0 ? r - ut : r + ut) : (a.value = it.AREA_3, r += I)), r;
}
function Bi(s, t) {
  var e = s + t;
  return e < -ut ? e += we : e > +ut && (e -= we), e;
}
var nd = ["Quadrilateralized Spherical Cube", "Quadrilateralized_Spherical_Cube", "qsc"];
const ad = {
  init: id,
  forward: ed,
  inverse: sd,
  names: nd
};
var _n = [
  [1, 22199e-21, -715515e-10, 31103e-10],
  [0.9986, -482243e-9, -24897e-9, -13309e-10],
  [0.9954, -83103e-8, -448605e-10, -986701e-12],
  [0.99, -135364e-8, -59661e-9, 36777e-10],
  [0.9822, -167442e-8, -449547e-11, -572411e-11],
  [0.973, -214868e-8, -903571e-10, 18736e-12],
  [0.96, -305085e-8, -900761e-10, 164917e-11],
  [0.9427, -382792e-8, -653386e-10, -26154e-10],
  [0.9216, -467746e-8, -10457e-8, 481243e-11],
  [0.8962, -536223e-8, -323831e-10, -543432e-11],
  [0.8679, -609363e-8, -113898e-9, 332484e-11],
  [0.835, -698325e-8, -640253e-10, 934959e-12],
  [0.7986, -755338e-8, -500009e-10, 935324e-12],
  [0.7597, -798324e-8, -35971e-9, -227626e-11],
  [0.7186, -851367e-8, -701149e-10, -86303e-10],
  [0.6732, -986209e-8, -199569e-9, 191974e-10],
  [0.6213, -0.010418, 883923e-10, 624051e-11],
  [0.5722, -906601e-8, 182e-6, 624051e-11],
  [0.5322, -677797e-8, 275608e-9, 624051e-11]
], de = [
  [-520417e-23, 0.0124, 121431e-23, -845284e-16],
  [0.062, 0.0124, -126793e-14, 422642e-15],
  [0.124, 0.0124, 507171e-14, -160604e-14],
  [0.186, 0.0123999, -190189e-13, 600152e-14],
  [0.248, 0.0124002, 710039e-13, -224e-10],
  [0.31, 0.0123992, -264997e-12, 835986e-13],
  [0.372, 0.0124029, 988983e-12, -311994e-12],
  [0.434, 0.0123893, -369093e-11, -435621e-12],
  [0.4958, 0.0123198, -102252e-10, -345523e-12],
  [0.5571, 0.0121916, -154081e-10, -582288e-12],
  [0.6176, 0.0119938, -241424e-10, -525327e-12],
  [0.6769, 0.011713, -320223e-10, -516405e-12],
  [0.7346, 0.0113541, -397684e-10, -609052e-12],
  [0.7903, 0.0109107, -489042e-10, -104739e-11],
  [0.8435, 0.0103431, -64615e-9, -140374e-14],
  [0.8936, 969686e-8, -64636e-9, -8547e-9],
  [0.9394, 840947e-8, -192841e-9, -42106e-10],
  [0.9761, 616527e-8, -256e-6, -42106e-10],
  [1, 328947e-8, -319159e-9, -42106e-10]
], Hr = 0.8487, Xr = 1.3523, Vr = Lt / 5, rd = 1 / Vr, Ri = 18, fs = function(s, t) {
  return s[0] + t * (s[1] + t * (s[2] + t * s[3]));
}, od = function(s, t) {
  return s[1] + t * (2 * s[2] + t * 3 * s[3]);
};
function hd(s, t, e, a) {
  for (var r = t; a; --a) {
    var o = s(r);
    if (r -= o, Math.abs(o) < e)
      break;
  }
  return r;
}
function ld() {
  this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, this.long0 = this.long0 || 0, this.es = 0, this.title = this.title || "Robinson";
}
function ud(s) {
  var t = N(s.x - this.long0, this.over), e = Math.abs(s.y), a = Math.floor(e * Vr);
  a < 0 ? a = 0 : a >= Ri && (a = Ri - 1), e = Lt * (e - rd * a);
  var r = {
    x: fs(_n[a], e) * t,
    y: fs(de[a], e)
  };
  return s.y < 0 && (r.y = -r.y), r.x = r.x * this.a * Hr + this.x0, r.y = r.y * this.a * Xr + this.y0, r;
}
function cd(s) {
  var t = {
    x: (s.x - this.x0) / (this.a * Hr),
    y: Math.abs(s.y - this.y0) / (this.a * Xr)
  };
  if (t.y >= 1)
    t.x /= _n[Ri][0], t.y = s.y < 0 ? -I : I;
  else {
    var e = Math.floor(t.y * Ri);
    for (e < 0 ? e = 0 : e >= Ri && (e = Ri - 1); ; )
      if (de[e][0] > t.y)
        --e;
      else if (de[e + 1][0] <= t.y)
        ++e;
      else
        break;
    var a = de[e], r = 5 * (t.y - a[0]) / (de[e + 1][0] - a[0]);
    r = hd(function(o) {
      return (fs(a, o) - t.y) / od(a, o);
    }, r, O, 100), t.x /= fs(_n[e], r), t.y = (5 * e + r) * ot, s.y < 0 && (t.y = -t.y);
  }
  return t.x = N(t.x + this.long0, this.over), t;
}
var fd = ["Robinson", "robin"];
const dd = {
  init: ld,
  forward: ud,
  inverse: cd,
  names: fd
};
function _d() {
  this.name = "geocent";
}
function md(s) {
  var t = Rr(s, this.es, this.a);
  return t;
}
function gd(s) {
  var t = kr(s, this.es, this.a, this.b);
  return t;
}
var pd = ["Geocentric", "geocentric", "geocent", "Geocent"];
const vd = {
  init: _d,
  forward: md,
  inverse: gd,
  names: pd
};
var yt = {
  N_POLE: 0,
  S_POLE: 1,
  EQUIT: 2,
  OBLIQ: 3
}, ae = {
  h: { def: 1e5, num: !0 },
  // default is Karman line, no default in PROJ.7
  azi: { def: 0, num: !0, degrees: !0 },
  // default is North
  tilt: { def: 0, num: !0, degrees: !0 },
  // default is Nadir
  long0: { def: 0, num: !0 },
  // default is Greenwich, conversion to rad is automatic
  lat0: { def: 0, num: !0 }
  // default is Equator, conversion to rad is automatic
};
function yd() {
  if (Object.keys(ae).forEach((function(e) {
    if (typeof this[e] > "u")
      this[e] = ae[e].def;
    else {
      if (ae[e].num && isNaN(this[e]))
        throw new Error("Invalid parameter value, must be numeric " + e + " = " + this[e]);
      ae[e].num && (this[e] = parseFloat(this[e]));
    }
    ae[e].degrees && (this[e] = this[e] * ot);
  }).bind(this)), Math.abs(Math.abs(this.lat0) - I) < O ? this.mode = this.lat0 < 0 ? yt.S_POLE : yt.N_POLE : Math.abs(this.lat0) < O ? this.mode = yt.EQUIT : (this.mode = yt.OBLIQ, this.sinph0 = Math.sin(this.lat0), this.cosph0 = Math.cos(this.lat0)), this.pn1 = this.h / this.a, this.pn1 <= 0 || this.pn1 > 1e10)
    throw new Error("Invalid height");
  this.p = 1 + this.pn1, this.rp = 1 / this.p, this.h1 = 1 / this.pn1, this.pfact = (this.p + 1) * this.h1, this.es = 0;
  var s = this.tilt, t = this.azi;
  this.cg = Math.cos(t), this.sg = Math.sin(t), this.cw = Math.cos(s), this.sw = Math.sin(s);
}
function Md(s) {
  s.x -= this.long0;
  var t = Math.sin(s.y), e = Math.cos(s.y), a = Math.cos(s.x), r, o;
  switch (this.mode) {
    case yt.OBLIQ:
      o = this.sinph0 * t + this.cosph0 * e * a;
      break;
    case yt.EQUIT:
      o = e * a;
      break;
    case yt.S_POLE:
      o = -t;
      break;
    case yt.N_POLE:
      o = t;
      break;
  }
  switch (o = this.pn1 / (this.p - o), r = o * e * Math.sin(s.x), this.mode) {
    case yt.OBLIQ:
      o *= this.cosph0 * t - this.sinph0 * e * a;
      break;
    case yt.EQUIT:
      o *= t;
      break;
    case yt.N_POLE:
      o *= -(e * a);
      break;
    case yt.S_POLE:
      o *= e * a;
      break;
  }
  var l, u;
  return l = o * this.cg + r * this.sg, u = 1 / (l * this.sw * this.h1 + this.cw), r = (r * this.cg - o * this.sg) * this.cw * u, o = l * u, s.x = r * this.a, s.y = o * this.a, s;
}
function wd(s) {
  s.x /= this.a, s.y /= this.a;
  var t = { x: s.x, y: s.y }, e, a, r;
  r = 1 / (this.pn1 - s.y * this.sw), e = this.pn1 * s.x * r, a = this.pn1 * s.y * this.cw * r, s.x = e * this.cg + a * this.sg, s.y = a * this.cg - e * this.sg;
  var o = At(s.x, s.y);
  if (Math.abs(o) < O)
    t.x = 0, t.y = s.y;
  else {
    var l, u;
    switch (u = 1 - o * o * this.pfact, u = (this.p - Math.sqrt(u)) / (this.pn1 / o + o / this.pn1), l = Math.sqrt(1 - u * u), this.mode) {
      case yt.OBLIQ:
        t.y = Math.asin(l * this.sinph0 + s.y * u * this.cosph0 / o), s.y = (l - this.sinph0 * Math.sin(t.y)) * o, s.x *= u * this.cosph0;
        break;
      case yt.EQUIT:
        t.y = Math.asin(s.y * u / o), s.y = l * o, s.x *= u;
        break;
      case yt.N_POLE:
        t.y = Math.asin(l), s.y = -s.y;
        break;
      case yt.S_POLE:
        t.y = -Math.asin(l);
        break;
    }
    t.x = Math.atan2(s.x, s.y);
  }
  return s.x = t.x + this.long0, s.y = t.y, s;
}
var xd = ["Tilted_Perspective", "tpers"];
const Pd = {
  init: yd,
  forward: Md,
  inverse: wd,
  names: xd
};
function bd() {
  if (this.flip_axis = this.sweep === "x" ? 1 : 0, this.h = Number(this.h), this.radius_g_1 = this.h / this.a, this.radius_g_1 <= 0 || this.radius_g_1 > 1e10)
    throw new Error();
  if (this.radius_g = 1 + this.radius_g_1, this.C = this.radius_g * this.radius_g - 1, this.es !== 0) {
    var s = 1 - this.es, t = 1 / s;
    this.radius_p = Math.sqrt(s), this.radius_p2 = s, this.radius_p_inv2 = t, this.shape = "ellipse";
  } else
    this.radius_p = 1, this.radius_p2 = 1, this.radius_p_inv2 = 1, this.shape = "sphere";
  this.title || (this.title = "Geostationary Satellite View");
}
function Ed(s) {
  var t = s.x, e = s.y, a, r, o, l;
  if (t = t - this.long0, this.shape === "ellipse") {
    e = Math.atan(this.radius_p2 * Math.tan(e));
    var u = this.radius_p / At(this.radius_p * Math.cos(e), Math.sin(e));
    if (r = u * Math.cos(t) * Math.cos(e), o = u * Math.sin(t) * Math.cos(e), l = u * Math.sin(e), (this.radius_g - r) * r - o * o - l * l * this.radius_p_inv2 < 0)
      return s.x = Number.NaN, s.y = Number.NaN, s;
    a = this.radius_g - r, this.flip_axis ? (s.x = this.radius_g_1 * Math.atan(o / At(l, a)), s.y = this.radius_g_1 * Math.atan(l / a)) : (s.x = this.radius_g_1 * Math.atan(o / a), s.y = this.radius_g_1 * Math.atan(l / At(o, a)));
  } else this.shape === "sphere" && (a = Math.cos(e), r = Math.cos(t) * a, o = Math.sin(t) * a, l = Math.sin(e), a = this.radius_g - r, this.flip_axis ? (s.x = this.radius_g_1 * Math.atan(o / At(l, a)), s.y = this.radius_g_1 * Math.atan(l / a)) : (s.x = this.radius_g_1 * Math.atan(o / a), s.y = this.radius_g_1 * Math.atan(l / At(o, a))));
  return s.x = s.x * this.a, s.y = s.y * this.a, s;
}
function Sd(s) {
  var t = -1, e = 0, a = 0, r, o, l, u;
  if (s.x = s.x / this.a, s.y = s.y / this.a, this.shape === "ellipse") {
    this.flip_axis ? (a = Math.tan(s.y / this.radius_g_1), e = Math.tan(s.x / this.radius_g_1) * At(1, a)) : (e = Math.tan(s.x / this.radius_g_1), a = Math.tan(s.y / this.radius_g_1) * At(1, e));
    var c = a / this.radius_p;
    if (r = e * e + c * c + t * t, o = 2 * this.radius_g * t, l = o * o - 4 * r * this.C, l < 0)
      return s.x = Number.NaN, s.y = Number.NaN, s;
    u = (-o - Math.sqrt(l)) / (2 * r), t = this.radius_g + u * t, e *= u, a *= u, s.x = Math.atan2(e, t), s.y = Math.atan(a * Math.cos(s.x) / t), s.y = Math.atan(this.radius_p_inv2 * Math.tan(s.y));
  } else if (this.shape === "sphere") {
    if (this.flip_axis ? (a = Math.tan(s.y / this.radius_g_1), e = Math.tan(s.x / this.radius_g_1) * Math.sqrt(1 + a * a)) : (e = Math.tan(s.x / this.radius_g_1), a = Math.tan(s.y / this.radius_g_1) * Math.sqrt(1 + e * e)), r = e * e + a * a + t * t, o = 2 * this.radius_g * t, l = o * o - 4 * r * this.C, l < 0)
      return s.x = Number.NaN, s.y = Number.NaN, s;
    u = (-o - Math.sqrt(l)) / (2 * r), t = this.radius_g + u * t, e *= u, a *= u, s.x = Math.atan2(e, t), s.y = Math.atan(a * Math.cos(s.x) / t);
  }
  return s.x = s.x + this.long0, s;
}
var Ad = ["Geostationary Satellite View", "Geostationary_Satellite", "geos"];
const Ld = {
  init: bd,
  forward: Ed,
  inverse: Sd,
  names: Ad
};
var ge = 1.340264, pe = -0.081106, ve = 893e-6, ye = 3796e-6, ds = Math.sqrt(3) / 2;
function Td() {
  this.es = 0, this.long0 = this.long0 !== void 0 ? this.long0 : 0, this.x0 = this.x0 !== void 0 ? this.x0 : 0, this.y0 = this.y0 !== void 0 ? this.y0 : 0;
}
function Cd(s) {
  var t = N(s.x - this.long0, this.over), e = s.y, a = Math.asin(ds * Math.sin(e)), r = a * a, o = r * r * r;
  return s.x = t * Math.cos(a) / (ds * (ge + 3 * pe * r + o * (7 * ve + 9 * ye * r))), s.y = a * (ge + pe * r + o * (ve + ye * r)), s.x = this.a * s.x + this.x0, s.y = this.a * s.y + this.y0, s;
}
function Id(s) {
  s.x = (s.x - this.x0) / this.a, s.y = (s.y - this.y0) / this.a;
  var t = 1e-9, e = 12, a = s.y, r, o, l, u, c, d;
  for (d = 0; d < e && (r = a * a, o = r * r * r, l = a * (ge + pe * r + o * (ve + ye * r)) - s.y, u = ge + 3 * pe * r + o * (7 * ve + 9 * ye * r), a -= c = l / u, !(Math.abs(c) < t)); ++d)
    ;
  return r = a * a, o = r * r * r, s.x = ds * s.x * (ge + 3 * pe * r + o * (7 * ve + 9 * ye * r)) / Math.cos(a), s.y = Math.asin(Math.sin(a) / ds), s.x = N(s.x + this.long0, this.over), s;
}
var Gd = ["eqearth", "Equal Earth", "Equal_Earth"];
const Od = {
  init: Td,
  forward: Cd,
  inverse: Id,
  names: Gd
};
var be = 1e-10;
function Nd() {
  var s;
  if (this.phi1 = this.lat1, Math.abs(this.phi1) < be)
    throw new Error();
  this.es ? (this.en = wn(this.es), this.m1 = Zi(
    this.phi1,
    this.am1 = Math.sin(this.phi1),
    s = Math.cos(this.phi1),
    this.en
  ), this.am1 = s / (Math.sqrt(1 - this.es * this.am1 * this.am1) * this.am1), this.inverse = kd, this.forward = Rd) : (Math.abs(this.phi1) + be >= I ? this.cphi1 = 0 : this.cphi1 = 1 / Math.tan(this.phi1), this.inverse = Bd, this.forward = zd);
}
function Rd(s) {
  var t = N(s.x - (this.long0 || 0), this.over), e = s.y, a, r, o;
  return a = this.am1 + this.m1 - Zi(e, r = Math.sin(e), o = Math.cos(e), this.en), r = o * t / (a * Math.sqrt(1 - this.es * r * r)), s.x = a * Math.sin(r), s.y = this.am1 - a * Math.cos(r), s.x = this.a * s.x + (this.x0 || 0), s.y = this.a * s.y + (this.y0 || 0), s;
}
function kd(s) {
  s.x = (s.x - (this.x0 || 0)) / this.a, s.y = (s.y - (this.y0 || 0)) / this.a;
  var t, e, a, r;
  if (e = At(s.x, s.y = this.am1 - s.y), r = xn(this.am1 + this.m1 - e, this.es, this.en), (t = Math.abs(r)) < I)
    t = Math.sin(r), a = e * Math.atan2(s.x, s.y) * Math.sqrt(1 - this.es * t * t) / Math.cos(r);
  else if (Math.abs(t - I) <= be)
    a = 0;
  else
    throw new Error();
  return s.x = N(a + (this.long0 || 0), this.over), s.y = ui(r), s;
}
function zd(s) {
  var t = N(s.x - (this.long0 || 0), this.over), e = s.y, a, r;
  return r = this.cphi1 + this.phi1 - e, Math.abs(r) > be ? (s.x = r * Math.sin(a = t * Math.cos(e) / r), s.y = this.cphi1 - r * Math.cos(a)) : s.x = s.y = 0, s.x = this.a * s.x + (this.x0 || 0), s.y = this.a * s.y + (this.y0 || 0), s;
}
function Bd(s) {
  s.x = (s.x - (this.x0 || 0)) / this.a, s.y = (s.y - (this.y0 || 0)) / this.a;
  var t, e, a = At(s.x, s.y = this.cphi1 - s.y);
  if (e = this.cphi1 + this.phi1 - a, Math.abs(e) > I)
    throw new Error();
  return Math.abs(Math.abs(e) - I) <= be ? t = 0 : t = a * Math.atan2(s.x, s.y) / Math.cos(e), s.x = N(t + (this.long0 || 0), this.over), s.y = ui(e), s;
}
var Dd = ["bonne", "Bonne (Werner lat_1=90)"];
const Fd = {
  init: Nd,
  names: Dd
}, vr = {
  OBLIQUE: {
    forward: Wd,
    inverse: Xd
  },
  TRANSVERSE: {
    forward: Hd,
    inverse: Vd
  }
}, _s = {
  ROTATE: {
    o_alpha: "oAlpha",
    o_lon_c: "oLongC",
    o_lat_c: "oLatC"
  },
  NEW_POLE: {
    o_lat_p: "oLatP",
    o_lon_p: "oLongP"
  },
  NEW_EQUATOR: {
    o_lon_1: "oLong1",
    o_lat_1: "oLat1",
    o_lon_2: "oLong2",
    o_lat_2: "oLat2"
  }
};
function Zd() {
  if (this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, this.long0 = this.long0 || 0, this.title = this.title || "General Oblique Transformation", this.isIdentity = Ir.includes(this.o_proj), !this.o_proj)
    throw new Error("Missing parameter: o_proj");
  if (this.o_proj === "ob_tran")
    throw new Error("Invalid value for o_proj: " + this.o_proj);
  const s = this.projStr.replace("+proj=ob_tran", "").replace("+o_proj=", "+proj=").trim(), t = Rt(s);
  if (!t)
    throw new Error("Invalid parameter: o_proj. Unknown projection " + this.o_proj);
  t.long0 = 0, this.obliqueProjection = t;
  let e;
  const a = Object.keys(_s), r = (u) => {
    if (typeof this[u] > "u")
      return;
    const c = parseFloat(this[u]) * ot;
    if (isNaN(c))
      throw new Error("Invalid value for " + u + ": " + this[u]);
    return c;
  };
  for (let u = 0; u < a.length; u++) {
    const c = a[u], d = _s[c], g = Object.entries(d);
    if (g.some(
      ([p]) => typeof this[p] < "u"
    )) {
      e = d;
      for (let p = 0; p < g.length; p++) {
        const [y, M] = g[p], w = r(y);
        if (typeof w > "u")
          throw new Error("Missing parameter: " + y + ".");
        this[M] = w;
      }
      break;
    }
  }
  if (!e)
    throw new Error("No valid parameters provided for ob_tran projection.");
  const { lamp: o, phip: l } = jd(this, e);
  this.lamp = o, Math.abs(l) > O ? (this.cphip = Math.cos(l), this.sphip = Math.sin(l), this.projectionType = vr.OBLIQUE) : this.projectionType = vr.TRANSVERSE;
}
function Ud(s) {
  return this.projectionType.forward(this, s);
}
function qd(s) {
  return this.projectionType.inverse(this, s);
}
function jd(s, t) {
  let e, a;
  if (t === _s.ROTATE) {
    let r = s.oLongC, o = s.oLatC, l = s.oAlpha;
    if (Math.abs(Math.abs(o) - I) <= O)
      throw new Error("Invalid value for o_lat_c: " + s.o_lat_c + " should be < 90°");
    a = r + Math.atan2(-1 * Math.cos(l), -1 * Math.sin(l) * Math.sin(o)), e = Math.asin(Math.cos(o) * Math.sin(l));
  } else if (t === _s.NEW_POLE)
    a = s.oLongP, e = s.oLatP;
  else {
    let r = s.oLong1, o = s.oLat1, l = s.oLong2, u = s.oLat2, c = Math.abs(o);
    if (Math.abs(o) > I - O)
      throw new Error("Invalid value for o_lat_1: " + s.o_lat_1 + " should be < 90°");
    if (Math.abs(u) > I - O)
      throw new Error("Invalid value for o_lat_2: " + s.o_lat_2 + " should be < 90°");
    if (Math.abs(o - u) < O)
      throw new Error("Invalid value for o_lat_1 and o_lat_2: o_lat_1 should be different from o_lat_2");
    if (c < O)
      throw new Error("Invalid value for o_lat_1: o_lat_1 should be different from zero");
    a = Math.atan2(
      Math.cos(o) * Math.sin(u) * Math.cos(r) - Math.sin(o) * Math.cos(u) * Math.cos(l),
      Math.sin(o) * Math.cos(u) * Math.sin(l) - Math.cos(o) * Math.sin(u) * Math.sin(r)
    ), e = Math.atan(-1 * Math.cos(a - r) / Math.tan(o));
  }
  return { lamp: a, phip: e };
}
function Wd(s, t) {
  let { x: e, y: a } = t;
  e += s.long0;
  const r = Math.cos(e), o = Math.sin(a), l = Math.cos(a);
  t.x = N(
    Math.atan2(
      l * Math.sin(e),
      s.sphip * l * r + s.cphip * o
    ) + s.lamp
  ), t.y = Math.asin(
    s.sphip * o - s.cphip * l * r
  );
  const u = s.obliqueProjection.forward(t);
  return s.isIdentity && (u.x *= Lt, u.y *= Lt), u;
}
function Hd(s, t) {
  let { x: e, y: a } = t;
  e += s.long0;
  const r = Math.cos(a), o = Math.cos(e);
  t.x = N(
    Math.atan2(
      r * Math.sin(e),
      Math.sin(a)
    ) + s.lamp
  ), t.y = Math.asin(-1 * r * o);
  const l = s.obliqueProjection.forward(t);
  return s.isIdentity && (l.x *= Lt, l.y *= Lt), l;
}
function Xd(s, t) {
  s.isIdentity && (t.x *= ot, t.y *= ot);
  const e = s.obliqueProjection.inverse(t);
  let { x: a, y: r } = e;
  if (a < Number.MAX_VALUE) {
    a -= s.lamp;
    const o = Math.cos(a), l = Math.sin(r), u = Math.cos(r);
    t.x = Math.atan2(
      u * Math.sin(a),
      s.sphip * u * o - s.cphip * l
    ), t.y = Math.asin(
      s.sphip * l + s.cphip * u * o
    );
  }
  return t.x = N(t.x + s.long0), t;
}
function Vd(s, t) {
  s.isIdentity && (t.x *= ot, t.y *= ot);
  const e = s.obliqueProjection.inverse(t);
  let { x: a, y: r } = e;
  if (a < Number.MAX_VALUE) {
    const o = Math.cos(r);
    a -= s.lamp, t.x = Math.atan2(
      o * Math.sin(a),
      -1 * Math.sin(r)
    ), t.y = Math.asin(
      o * Math.cos(a)
    );
  }
  return t.x = N(t.x + s.long0), t;
}
var Yd = ["General Oblique Transformation", "General_Oblique_Transformation", "ob_tran"];
const Kd = {
  init: Zd,
  forward: Ud,
  inverse: qd,
  names: Yd
};
function $d(s) {
  s.Proj.projections.add(ss), s.Proj.projections.add(ns), s.Proj.projections.add(Bu), s.Proj.projections.add(Xu), s.Proj.projections.add(Ju), s.Proj.projections.add(sc), s.Proj.projections.add(lc), s.Proj.projections.add(_c), s.Proj.projections.add(yc), s.Proj.projections.add(bc), s.Proj.projections.add(zc), s.Proj.projections.add(qc), s.Proj.projections.add(Vc), s.Proj.projections.add(tf), s.Proj.projections.add(rf), s.Proj.projections.add(cf), s.Proj.projections.add(gf), s.Proj.projections.add(wf), s.Proj.projections.add(Af), s.Proj.projections.add(Gf), s.Proj.projections.add(zf), s.Proj.projections.add(Uf), s.Proj.projections.add(Yf), s.Proj.projections.add(td), s.Proj.projections.add(ad), s.Proj.projections.add(dd), s.Proj.projections.add(vd), s.Proj.projections.add(Pd), s.Proj.projections.add(Ld), s.Proj.projections.add(Od), s.Proj.projections.add(Fd), s.Proj.projections.add(Kd);
}
const Yr = Object.assign(iu, {
  defaultDatum: "WGS84",
  Proj: Rt,
  WGS84: new Rt("WGS84"),
  Point: Fi,
  toPoint: zr,
  defs: vt,
  nadgrid: zl,
  transform: us,
  mgrs: eu,
  version: "__VERSION__"
});
$d(Yr);
const Jd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Yr
}, Symbol.toStringTag, { value: "Module" })), Qd = /* @__PURE__ */ Ih(Jd);
var yr;
function t0() {
  return yr || (yr = 1, (function(s) {
    (function(t) {
      var e, a;
      e = Mr(), a = Qd, s.exports = t(e, a);
    })(function(t, e) {
      return e.__esModule && e.default && (e = e.default), t.Proj = {}, t.Proj._isProj4Obj = function(a) {
        return typeof a.inverse < "u" && typeof a.forward < "u";
      }, t.Proj.Projection = t.Class.extend({
        initialize: function(a, r, o) {
          var l = t.Proj._isProj4Obj(a);
          this._proj = l ? a : this._projFromCodeDef(a, r), this.bounds = l ? r : o;
        },
        project: function(a) {
          var r = this._proj.forward([a.lng, a.lat]);
          return new t.Point(r[0], r[1]);
        },
        unproject: function(a, r) {
          var o = this._proj.inverse([a.x, a.y]);
          return new t.LatLng(o[1], o[0], r);
        },
        _projFromCodeDef: function(a, r) {
          if (r)
            e.defs(a, r);
          else if (e.defs[a] === void 0) {
            var o = a.split(":");
            if (o.length > 3 && (a = o[o.length - 3] + ":" + o[o.length - 1]), e.defs[a] === void 0)
              throw "No projection definition for code " + a;
          }
          return e(a);
        }
      }), t.Proj.CRS = t.Class.extend({
        includes: t.CRS,
        options: {
          transformation: new t.Transformation(1, 0, -1, 0)
        },
        initialize: function(a, r, o) {
          var l, u, c, d;
          if (t.Proj._isProj4Obj(a) ? (u = a, l = u.srsCode, d = r || {}, this.projection = new t.Proj.Projection(u, d.bounds)) : (l = a, c = r, d = o || {}, this.projection = new t.Proj.Projection(l, c, d.bounds)), t.Util.setOptions(this, d), this.code = l, this.transformation = this.options.transformation, this.options.origin && (this.transformation = new t.Transformation(
            1,
            -this.options.origin[0],
            -1,
            this.options.origin[1]
          )), this.options.scales)
            this._scales = this.options.scales;
          else if (this.options.resolutions) {
            this._scales = [];
            for (var g = this.options.resolutions.length - 1; g >= 0; g--)
              this.options.resolutions[g] && (this._scales[g] = 1 / this.options.resolutions[g]);
          }
          this.infinite = !this.options.bounds;
        },
        scale: function(a) {
          var r = Math.floor(a), o, l, u, c;
          return a === r ? this._scales[a] : (o = this._scales[r], l = this._scales[r + 1], u = l - o, c = a - r, o + u * c);
        },
        zoom: function(a) {
          var r = this._closestElement(this._scales, a), o = this._scales.indexOf(r), l, u, c;
          return a === r ? o : r === void 0 ? -1 / 0 : (u = o + 1, l = this._scales[u], l === void 0 ? 1 / 0 : (c = l - r, (a - r) / c + o));
        },
        distance: t.CRS.Earth.distance,
        R: t.CRS.Earth.R,
        /* Get the closest lowest element in an array */
        _closestElement: function(a, r) {
          for (var o, l = a.length; l--; )
            a[l] <= r && (o === void 0 || o < a[l]) && (o = a[l]);
          return o;
        }
      }), t.Proj.GeoJSON = t.GeoJSON.extend({
        initialize: function(a, r) {
          this._callLevel = 0, t.GeoJSON.prototype.initialize.call(this, a, r);
        },
        addData: function(a) {
          var r;
          a && (a.crs && a.crs.type === "name" ? r = new t.Proj.CRS(a.crs.properties.name) : a.crs && a.crs.type && (r = new t.Proj.CRS(a.crs.type + ":" + a.crs.properties.code)), r !== void 0 && (this.options.coordsToLatLng = function(o) {
            var l = t.point(o[0], o[1]);
            return r.projection.unproject(l);
          })), this._callLevel++;
          try {
            t.GeoJSON.prototype.addData.call(this, a);
          } finally {
            this._callLevel--, this._callLevel === 0 && delete this.options.coordsToLatLng;
          }
        }
      }), t.Proj.geoJson = function(a, r) {
        return new t.Proj.GeoJSON(a, r);
      }, t.Proj.ImageOverlay = t.ImageOverlay.extend({
        initialize: function(a, r, o) {
          t.ImageOverlay.prototype.initialize.call(this, a, null, o), this._projectedBounds = r;
        },
        // Danger ahead: Overriding internal methods in Leaflet.
        // Decided to do this rather than making a copy of L.ImageOverlay
        // and doing very tiny modifications to it.
        // Future will tell if this was wise or not.
        _animateZoom: function(a) {
          var r = this._map.getZoomScale(a.zoom), o = t.point(this._projectedBounds.min.x, this._projectedBounds.max.y), l = this._projectedToNewLayerPoint(o, a.zoom, a.center);
          t.DomUtil.setTransform(this._image, l, r);
        },
        _reset: function() {
          var a = this._map.getZoom(), r = this._map.getPixelOrigin(), o = t.bounds(
            this._transform(this._projectedBounds.min, a)._subtract(r),
            this._transform(this._projectedBounds.max, a)._subtract(r)
          ), l = o.getSize();
          t.DomUtil.setPosition(this._image, o.min), this._image.style.width = l.x + "px", this._image.style.height = l.y + "px";
        },
        _projectedToNewLayerPoint: function(a, r, o) {
          var l = this._map.getSize()._divideBy(2), u = this._map.project(o, r)._subtract(l)._round(), c = u.add(this._map._getMapPanePos());
          return this._transform(a, r)._subtract(c);
        },
        _transform: function(a, r) {
          var o = this._map.options.crs, l = o.transformation, u = o.scale(r);
          return l.transform(a, u);
        }
      }), t.Proj.imageOverlay = function(a, r, o) {
        return new t.Proj.ImageOverlay(a, r, o);
      }, t.Proj;
    });
  })(tn)), tn.exports;
}
t0();
(function(s, t) {
  V.GridLayer.include({
    _setZoomTransform: function(e, a, r) {
      var o = a;
      o != null && this.options && (this.options.corrdType == "gcj02" ? o = rn(a.lng, a.lat) : this.options.corrdType == "bd09" && (o = Ha(a.lng, a.lat)));
      var l = this._map.getZoomScale(r, e.zoom), u = e.origin.multiplyBy(l).subtract(this._map._getNewPixelOrigin(o, r)).round();
      V.Browser.any3d ? V.DomUtil.setTransform(e.el, u, l) : V.DomUtil.setPosition(e.el, u);
    },
    _getTiledPixelBounds: function(e) {
      var a = e;
      a != null && this.options && (this.options.corrdType == "gcj02" ? a = rn(e.lng, e.lat) : this.options.corrdType == "bd09" && (a = Ha(e.lng, e.lat)));
      var r = this._map, o = r._animatingZoom ? Math.max(r._animateToZoom, r.getZoom()) : r.getZoom(), l = r.getZoomScale(o, this._tileZoom), u = r.project(a, this._tileZoom).floor(), c = r.getSize().divideBy(l * 2);
      return new V.Bounds(u.subtract(c), u.add(c));
    }
  });
})();
var mn = /* @__PURE__ */ ((s) => (s.tianDiTuNormalMap = "TianDiTu.Normal.Map", s.tianDiTuNormalAnnotion = "TianDiTu.Normal.Annotion", s.tianDiTuSatelliteMap = "TianDiTu.Satellite.Map", s.tianDiTuSatelliteAnnotion = "TianDiTu.Satellite.Annotion", s.tianDiTuTerrainMap = "TianDiTu.Terrain.Map", s.tianDiTuTerrainAnnotion = "TianDiTu.Terrain.Annotion", s.gaoDeNormalMap = "GaoDe.Normal.Map", s.gaoDeSatelliteMap = "GaoDe.Satellite.Map", s.gaoDeSatelliteAnnotion = "GaoDe.Satellite.Annotion", s.baiDuNormalMap = "Baidu.Normal.Map", s.baiDuSatelliteMap = "Baidu.Satellite.Map", s.baiDuSatelliteAnnotion = "Baidu.Satellite.Annotion", s.googleNormalMap = "Google.Normal.Map", s.googleSatelliteMap = "Google.Satellite.Map", s.googleSatelliteAnnotion = "Google.Satellite.Annotion", s.geoqNormalMap = "Geoq.Normal.Map", s.geoqNormalPurplishBlue = "Geoq.Normal.PurplishBlue", s.geoqNormalGray = "Geoq.Normal.Gray", s.geoqNormalWarm = "Geoq.Normal.Warm", s.geoqThemeHydro = "Geoq.Theme.Hydro", s.oSMNormalMap = "OSM.Normal.Map", s))(mn || {});
class i0 {
  constructor(t, e) {
    this.setMapProvider(t, e);
  }
  /**将图层添加到map显示在页面 */
  addTo(t) {
    return t ? (this.map = t, this.mapLayer?.addTo(this.map), this) : this;
  }
  /**从map中移除当前图层 */
  remove() {
    return this.mapLayer?.remove(), this;
  }
  /**变更当前图层并添加到map中 */
  changeMap(t, e) {
    return this.remove(), this.setMapProvider(t, e), this.addTo(this.map), this;
  }
  /**设置map的地图来源，名称，类型 */
  setMapProvider(t, e) {
    e = e || {};
    let a = t.split("."), r = a[0], o = a[1], l = a[2], u = re[r][o][l];
    e.subdomains = re[r].Subdomains, e.key = e.key || re[r].key, e.corrdType = this.getCorrdType(r), "tms" in re[r] && (e.tms = re[r].tms), this.mapLayer = new V.TileLayer(u, e);
  }
  /**获取坐标转换类型*/
  getCorrdType(t) {
    var e = "wgs84";
    switch (t) {
      case "Geoq":
      case "GaoDe":
      case "Google":
        e = "gcj02";
        break;
      case "Baidu":
        e = "bd09";
        break;
      case "OSM":
      case "TianDiTu":
        e = "wgs84";
        break;
    }
    return e;
  }
}
const re = {
  TianDiTu: {
    Normal: {
      Map: "//t{s}.tianditu.com/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk={key}",
      Annotion: "//t{s}.tianditu.com/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk={key}",
      AnnotionEn: "//t{s}.tianditu.com/DataServer?T=eva_w&X={x}&Y={y}&L={z}&tk={key}"
    },
    Satellite: {
      Map: "//t{s}.tianditu.com/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk={key}",
      Annotion: "//t{s}.tianditu.com/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk={key}"
    },
    Terrain: {
      Map: "//t{s}.tianditu.com/DataServer?T=ter_w&X={x}&Y={y}&L={z}&tk={key}",
      Annotion: "//t{s}.tianditu.com/DataServer?T=cta_w&X={x}&Y={y}&L={z}&tk={key}"
    },
    // Subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    Subdomains: ["1"],
    key: "a9e2dd65c94fab979c9d897ff7098a4c"
  },
  GaoDe: {
    Normal: {
      Map: "//webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
    },
    Satellite: {
      Map: "//webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
      Annotion: "//webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}"
    },
    Subdomains: ["1", "2", "3", "4"]
  },
  Google: {
    Normal: {
      Map: "//www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
    },
    Satellite: {
      Map: "//www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}",
      Annotion: "//www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}"
    },
    Subdomains: []
  },
  Geoq: {
    Normal: {
      Map: "//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}",
      PurplishBlue: "//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
      Gray: "//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}",
      Warm: "//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}"
    },
    Theme: {
      Hydro: "//thematic.geoq.cn/arcgis/rest/services/ThematicMaps/WorldHydroMap/MapServer/tile/{z}/{y}/{x}"
    },
    Subdomains: []
  },
  OSM: {
    Normal: {
      Map: "//{s}.tile.osm.org/{z}/{x}/{y}.png"
    },
    Subdomains: ["a", "b", "c"]
  },
  Baidu: {
    Normal: {
      Map: "//online{s}.map.bdimg.com/onlinelabel/qt=tile&x={x}&y={y}&z={z}"
    },
    Satellite: {
      Map: "//online{s}.map.bdimg.com/starpic/?qt=satepc&u=x={x}&y={y}&z={z};v=009;type=sate&fm=46&app=webearth2&v=009&udt=20231212",
      Annotion: "//online{s}.map.bdimg.com/starpic/?qt=satepc&u=x={x}&y={y}&z={z};v=009;type=sate&fm=46&app=webearth2&v=009&udt=20231212"
    },
    Subdomains: "0123456789",
    tms: !0
  }
};
class _0 {
  constructor(t, e = {}) {
    this.curs = /* @__PURE__ */ Object.create(null), this.ele = t;
  }
  get map() {
    return this._map;
  }
  /**初始实例化地图
   * @param options 地图初始化参数
   */
  async init(t = {}) {
    const { type: e } = t, a = this.ele;
    e === "A" ? this._map = await this.initAmap(a, t) : (this._map = await this.initLeaflet(a, t), this.showMap([mn.tianDiTuNormalMap, mn.tianDiTuNormalAnnotion]));
  }
  /**设置合适的视图范围 */
  setFitView(t) {
    return this._map && zh(this._map, t), this;
  }
  /**获取地图边界 */
  getBound() {
    return gn(this._map);
  }
  /**
   * 设置地图中心
   * @param center 中心 latlng顺序
   * @param zoom 
   * @param offset 中心 但需要偏移固定像素
   */
  setCenter(t, e, a) {
    kh(this._map, t, e, a);
  }
  /**显示指定的网络图层 */
  showMap(t = []) {
    const { map: e, curs: a } = this;
    if (e && e instanceof V.Map) {
      t[0].split(".")[0];
      let r = e.getCenter(), o = e.getZoom();
      e._resetView(r, o, !0), t?.forEach((l) => {
        if (a[l]) return;
        let u = new i0(l);
        u.addTo(e), a[l] = u;
      });
      for (const l in a) {
        let u = l;
        t.includes(u) || (a[u].remove(), Reflect.deleteProperty(a, l));
      }
    }
    return this;
  }
  /**---------------leaflet地图的相关方法------------------- */
  initLeaflet(t, e) {
    const { zoom: a = 11, minZoom: r = 2, maxZoom: o = 20, center: [l, u] = [22.68471, 114.12027], dragging: c = !0, zoomControl: d = !1, attributionControl: g = !1, doubleClickZoom: m = !1, closePopupOnClick: p = !1 } = e;
    let y = {
      dragging: c,
      zoomControl: d,
      zoom: a,
      minZoom: r,
      maxZoom: o,
      center: V.latLng(l, u),
      attributionControl: g,
      doubleClickZoom: m,
      crs: V.CRS.EPSG3857,
      closePopupOnClick: p
      //点击地图不关闭弹出层
    }, M = new V.Map(t, y);
    return Promise.resolve(M);
  }
  /**---------------高德地图的相关方法------------------- */
  async initAmap(t, e) {
    const { zoom: a = 11, minZoom: r = 2, maxZoom: o = 20, center: [l, u] = [22.68471, 114.12027], dragging: c = !0, zoomControl: d = !1, attributionControl: g = !1, doubleClickZoom: m = !1, closePopupOnClick: p = !1, showLabel: y = !0 } = e;
    return Xh.load({
      key: "87e1b1e9aa88724f69208972546fdd57",
      // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "1.4.15",
      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ["Map3D"]
      //插件列表
    }).then(() => new AMap.Map(t, {
      // mask: mask,
      center: [u, l],
      disableSocket: !0,
      viewMode: "2D",
      mapStyle: "amap://styles/dfd45346264e1fa2bb3b796f36cab42a",
      skyColor: "#A3CCFF",
      lang: "zh_cn",
      //设置地图语言类型
      labelzIndex: 130,
      pitch: 40,
      zoom: a,
      zooms: [r, o],
      dragEnable: c,
      doubleClickZoom: m,
      keyboardEnable: !1,
      isHotspot: !1,
      showLabel: y,
      layers: []
    }));
  }
}
const e0 = "/assets/images/direction-arrow.png";
class s0 {
  constructor(t, e, a) {
    this.map = t, this.ctx = e, this.animeLineOpt = a, this.defaultOption = {
      lineWidth: 16,
      // 默认每帧移动.5px
      speed: 0.5,
      imgUrl: e0,
      partialHeight: 16,
      partialSpace: 2,
      partialWidth: 16,
      fillColor: "rgb(41, 152, 137)",
      strokeColor: "rgb(179, 218, 255)",
      degree: 1
    }, this.allLines = [], this.offset = 0, this.allPoints = [], this.animeLineOpt = Object.assign({}, this.defaultOption, this.animeLineOpt), this.initResource();
  }
  get imgUrl() {
    return this.animeLineOpt.imgUrl;
  }
  get patternBound() {
    return [this.animeLineOpt.partialWidth, this.animeLineOpt.partialHeight];
  }
  initResource() {
    Di.loadImg([this.imgUrl]);
  }
  setAllLines(t) {
    this.allLines = t, this.update();
  }
  update() {
    this.allPoints = this.allLines.map((t) => {
      const { latlngs: e = [], latlng: a = [] } = t;
      return a.length && e.push(a), pn(this.map, e);
    }), this.draw();
  }
  visiblePoint(t, e) {
    const [a, r] = t, [o, l] = e;
    return a < 0 || r < 0 ? !1 : !(a > o || r > l);
  }
  /**
   * 线段连线方向
   * @param point1
   * @param point2
   * @returns
   */
  directionLine(t, e) {
    const [a, r] = t, [o, l] = e;
    return a == o && r > l ? "top" : a == o && r < l ? "bottom" : r == l && a > o ? "left" : r == l && a < o ? "right" : a > o && r > l ? "topleft" : a > o && r < l ? "bottomleft" : a < o && r > l ? "topright" : a < o && r < l ? "bottomright" : "undefined";
  }
  /**
   * 不在画布范围内修改起始点 减少生成过多粒子
   * @returns
   */
  validLine(t) {
    const { width: e, height: a } = this.ctx.canvas, r = this.visiblePoint(t[0], [e, a]), o = this.visiblePoint(t[1], [e, a]), l = this.directionLine(t[0], t[1]);
    let [u, c] = t[0], [d, g] = t[1];
    if (!r || !o)
      if (c == g) {
        if (c < 0 || c > a)
          return !1;
        if (r && !o)
          d = l == "right" ? e : 0;
        else if (o && !r)
          u = l == "right" ? 0 : e;
        else {
          if (l == "right" && (u >= e || d <= 0) || l == "left" && (u <= 0 || d >= e))
            return !1;
          u = l == "right" ? 0 : e, d = l == "right" ? e : 0;
        }
      } else if (u == d) {
        if (u < 0 || u > e)
          return !1;
        if (r && !o)
          g = l == "top" ? 0 : a;
        else if (o && !r)
          c = l == "top" ? a : 0;
        else {
          if (l == "top" && (c <= 0 || g >= a) || l == "bottom" && (c >= a || g <= 0))
            return !1;
          c = l == "top" ? a : 0, g = l == "top" ? 0 : a;
        }
      } else {
        const m = (g - c) / (d - u), p = c - m * u, y = -p / m, M = (a - p) / m, w = p, P = m * e + p;
        if (r)
          switch (l) {
            case "topleft":
              [d, g] = y >= 0 && y <= e ? [y, 0] : [0, w];
              break;
            case "topright":
              [d, g] = y >= 0 && y <= e ? [y, 0] : [e, P];
              break;
            case "bottomleft":
              [d, g] = M >= 0 && M <= e ? [M, a] : [0, w];
              break;
            case "bottomright":
              [d, g] = M >= 0 && M <= e ? [M, a] : [e, P];
              break;
            default:
              return !1;
          }
        else if (o)
          switch (l) {
            case "topleft":
              [u, c] = M >= 0 && M <= e ? [M, a] : [e, P];
              break;
            case "topright":
              [u, c] = M >= 0 && M <= e ? [M, a] : [0, w];
              break;
            case "bottomleft":
              [u, c] = y >= 0 && y <= e ? [y, 0] : [e, P];
              break;
            case "bottomright":
              [u, c] = y >= 0 && y <= e ? [y, 0] : [0, w];
              break;
            default:
              return !1;
          }
        else {
          switch (l) {
            case "topleft":
              if (u <= 0 || c <= 0 || d >= e || g >= a)
                return !1;
              [u, c] = M >= 0 && M <= e ? [M, a] : [e, P], [d, g] = y >= 0 && y <= e ? [y, 0] : [0, w];
              break;
            case "topright":
              if (u >= e || c <= 0 || d <= 0 || g >= a)
                return !1;
              [u, c] = M >= 0 && M <= e ? [M, a] : [0, w], [d, g] = y >= 0 && y <= e ? [y, 0] : [e, P];
              break;
            case "bottomleft":
              if (u <= 0 || c >= a || d >= e || g <= 0)
                return !1;
              [u, c] = y >= 0 && y <= e ? [y, 0] : [e, P], [d, g] = M >= 0 && M <= e ? [M, a] : [0, w];
              break;
            case "bottomright":
              if (u >= e || c >= a || d <= 0 || g <= 0)
                return !1;
              [u, c] = y >= 0 && y <= e ? [y, 0] : [0, w], [d, g] = M >= 0 && M <= e ? [M, a] : [e, P];
              break;
            default:
              return !1;
          }
          if (!this.visiblePoint([u, c], [e, a]) || !this.visiblePoint([d, g], [e, a]))
            return !1;
        }
      }
    return [[u, c], [d, g]];
  }
  /**
   * 获取二次贝塞尔曲线划分任意点位置
   * @param {number} t 当前百分比
   * @param {Array} p1 起点坐标
   * @param {Array} cp 控制点
   * @param {Array} p2 终点坐标
   */
  getQuadraticBezierPoint(t, e, a, r) {
    const [o, l] = e, [u, c] = a, [d, g] = r;
    let m = (1 - t) * (1 - t) * o + 2 * t * (1 - t) * u + t * t * d, p = (1 - t) * (1 - t) * l + 2 * t * (1 - t) * c + t * t * g;
    return [m, p];
  }
  draw() {
    const t = this, { ctx: e, animeLineOpt: a } = t, { isBezier: r, degree: o = 1, speed: l, partialWidth: u, partialSpace: c } = a;
    e.save(), this.patternPathInit(), e.lineCap = "round", e.lineWidth = a.lineWidth;
    for (let d = 0; d < this.allPoints.length; d++) {
      let g = this.getValidPoints(this.allPoints[d]);
      if (r)
        for (let m = 1; m < this.allPoints[d].length; m++) {
          const p = [];
          let y = this.allPoints[d][m - 1], M = this.allPoints[d][m];
          const w = ht.getBezierCtrlPoint(y, M, o), P = 50, E = Math.sqrt(Math.pow(y[0] - M[0], 2) + Math.pow(y[1] - M[1], 2)), A = Math.floor(P * (E / this.ctx.canvas.width)) || 1;
          for (let G = 0; G <= A; G++) {
            const R = this.getQuadraticBezierPoint(G / A, y, w, M);
            p.push(R);
          }
          let T = this.getValidPoints(p);
          if (!(T.length < 2))
            for (let G = 0; G < T.length; G += 2)
              this.drawPath([T[G], T[G + 1]]);
        }
      else {
        if (g.length < 2) continue;
        for (let m = 0; m < g.length; m += 2)
          this.drawPath([g[m], g[m + 1]]);
      }
    }
    e.restore(), this.offset += l, this.offset >= u + c && (this.offset = 0);
  }
  getValidPoints(t) {
    let e = [], a = t[0];
    for (let r = 1; r < t.length; r++) {
      const o = this.validLine([a, t[r]]);
      a = t[r], o && e.push(o[0], o[1]);
    }
    return e;
  }
  drawPath(t) {
    const e = this, { ctx: a, animeLineOpt: r } = e, { speed: o = 0.1, partialWidth: l } = r;
    let u = t[0];
    a.save(), a.beginPath(), a.translate(u[0], u[1]), a.moveTo(0, 0);
    for (let c = 1; c < t.length; c++) {
      const d = t[c];
      if (u = t[c - 1], a.lineTo(d[0] - u[0], d[1] - u[1]), c > 0) {
        a.save();
        const g = Math.atan2(d[1] - u[1], d[0] - u[0]);
        a.rotate(g), a.translate(this.offset + o, 0), a.stroke(), a.translate(-this.offset - o, 0), a.restore(), a.beginPath(), a.translate(-u[0], -u[1]), a.translate(d[0], d[1]), u = d, a.moveTo(0, 0);
      }
    }
    a.restore();
  }
  patternPathInit() {
    const t = this.createPattern();
    if (!t) {
      this.ctx.strokeStyle = this.animeLineOpt.strokeColor, this.ctx.fillStyle = this.animeLineOpt.fillColor;
      return;
    }
    this.ctx.strokeStyle = t;
  }
  createPattern() {
    const { strokeColor: t, fillColor: e, partialSpace: a } = this.animeLineOpt, r = Di.ImageCache[this.imgUrl];
    if (!r) return null;
    const [o, l] = this.patternBound, u = document.createElement("canvas"), c = u.getContext("2d");
    u.width = o, u.height = l + a, c.fillStyle = e, c.fillRect(0, 0, o, l + a), c.drawImage(r, 0, a, o, l);
    const d = c.createPattern(u, "repeat"), g = new DOMMatrix();
    return g.rotateSelf(90), g.translateSelf(o / 2, (l + a) / 2), d.setTransform(g), d;
  }
}
class n0 {
  constructor(t, e) {
    this.map = t, this.ctx = e, this.radarDefault = { animeId: "0", angle: [0, 90], currentAngle: 0, ifClockwise: !0, time: 3, gridDensity: 8, arcDash: [100, 500], colorDash: ["#FF0000", "#00FF00"], dashDensity: 3, colorSector: "#00FF00", colorText: "#FFFF00", colorGrid: "#49EFEF66", colorRadar: "#00FFFF", sectorAngle: 30, sizeFix: [0, 0], latlng: [0, 0] }, this.allRadars = [];
  }
  get zoom() {
    return this.map.getZoom();
  }
  /**重设雷达绘制类 */
  setAllRadars(t) {
    return this.allRadars = t.filter((e) => e).map((e) => Object.assign({}, this.radarDefault, e)), this;
  }
  /**添加雷达绘制类 */
  addRadar(t) {
    return this.allRadars.push(Object.assign({}, this.radarDefault, t)), this;
  }
  /**开始绘制所有雷达静态部分 */
  drawRadarStatic() {
    const t = this, { zoom: e } = this;
    t.allRadars.forEach((a) => {
      const { maxZoom: r = 50, minZoom: o = 0 } = a;
      e < o || e > r || (this.updatePoint(a), t.drawGrid(a), t.drawDashArc(a), t.drawCustomDashArc(a), t.drawOutline(a), t.drawOutlineUnit(a), t.drawBackground(a), t.drawText(a), t.drawScanRange(a));
    });
  }
  /**开始绘制所有雷达动态扫描部分 */
  drawRadarAmi(t) {
    const e = this.pertime && t ? t - this.pertime : 16.666666666666668, a = this.zoom;
    this.pertime = t, this.allRadars.forEach((r) => {
      const { maxZoom: o = 50, minZoom: l = 0 } = r;
      a < l || a > o || (this.updatePoint(r), this.updateAngle(r, e), this.drawScan(r));
    });
  }
  /**更新所有雷达位置和大小 */
  updatePoint(t) {
    const { map: e } = this;
    t.radius = on(e, t)[0], t.center = mt(e, t.latlng);
  }
  /**绘制雷达网格 */
  drawGrid(t) {
    const { ctx: e } = this, { center: a, radius: r, gridDensity: o, colorGrid: l } = t, [u, c] = a;
    e.save(), e.beginPath(), e.arc(u, c, r, 0, Math.PI * 2), e.clip();
    const d = Math.max(Math.floor(r / o), 30), g = r / d + 1 | 0, m = d * g - r, [p, y] = [u - r - m, c - r - m], M = r * 2 + m;
    for (let w = 1; w < g * 2; w++) {
      const [P, E] = [p + w * d, y], [A, T] = [p, y + w * d];
      ht.drawLine(
        {
          points: [[P, E], [P, E + M]],
          colorLine: l
        },
        e
      ), ht.drawLine(
        {
          points: [[A, T], [A + M, T]],
          colorLine: l
        },
        e
      );
    }
    e.restore();
  }
  /**虚线圈到中心点距离 */
  drawDashArc(t) {
    const { ctx: e } = this, { center: a, radius: r, colorRadar: o, dashDensity: l, arcDash: u } = t, [c, d] = a, g = t.sizeFix;
    if (u.length > 0) return;
    const m = r / l, p = Number(Math.round(g[0] / l));
    e.save(), e.setLineDash([2, 5]), e.strokeStyle = o, e.fillStyle = o, e.textAlign = "center";
    for (let y = 1; y <= Math.floor(r / m); y++) {
      e.beginPath();
      const M = m * y;
      e.arc(c, d, M, 0, Math.PI * 2), e.stroke(), r >= 50 && e.fillText(`${p * y > g[0] ? g[0] : p * y}m`, c, d + M - 5);
    }
    e.restore();
  }
  /**绘制自定义的虚线圈 */
  drawCustomDashArc(t) {
    const { ctx: e } = this, { center: a, radius: r, colorDash: o, arcDash: l = [] } = t, [u, c] = a;
    if (l.length == 0) return;
    const d = t.sizeFix, g = r / d[0];
    e.save(), e.setLineDash([2, 5]);
    const m = this.caculateColorChange(o, l.length);
    e.textAlign = "center", l.forEach((p, y) => {
      if (p >= r) return;
      const M = g * p;
      e.fillStyle = e.strokeStyle = `rgb(
            ${m[y][0]},
            ${m[y][1]},
            ${m[y][2]})`, e.beginPath(), e.arc(u, c, M, 0, Math.PI * 2), e.stroke(), r >= 50 && e.fillText(`${p > d[0] ? d[0] : p}m`, u, c + M - 5);
    }), e.restore();
  }
  /**绘制轮廓 */
  drawOutline(t) {
    const { ctx: e } = this, { center: a, radius: r, colorRadar: o } = t, [l, u] = a;
    e.save(), e.beginPath(), e.lineWidth = r < 100 ? 1 : 2, e.strokeStyle = o, e.arc(l, u, r, 0, Math.PI * 2), e.stroke(), e.restore();
  }
  /**绘制边缘单元 */
  drawOutlineUnit(t) {
    const { ctx: e } = this, { center: a, radius: r, colorRadar: o } = t, [l, u] = a, c = r >= 100, d = 1, g = c ? 4 : r < 50 ? 1 : 3;
    e.save(), e.strokeStyle = o, e.lineWidth = d, e.translate(l, u);
    for (let m = 0; m < 360; m++) {
      let p = m % 5 == 0 ? g * 2 : g;
      if (!c && m % 5 !== 0) continue;
      e.beginPath(), e.rotate(m * Math.PI / 180);
      const y = [r, 0], M = [r + p, 0];
      e.moveTo(...y), e.lineTo(...M), e.stroke(), e.rotate(-m * Math.PI / 180);
    }
    e.restore();
  }
  /**雷达背景蒙版 中间泛白*/
  drawBackground(t) {
    const { ctx: e } = this, { center: a, radius: r } = t, [o, l] = a;
    e.save(), e.restore();
  }
  /**绘制文字描述 */
  drawText(t) {
    const { ctx: e } = this, { center: a, radius: r, colorText: o } = t, [l, u] = a;
    if (r < 100) return;
    const c = 20, d = [
      ["90°", "E"],
      ["180°", "S"],
      ["270°", "W"],
      ["360°", "N"]
    ], g = [
      [
        [r - c / 2, 4],
        [r + c, 4]
      ],
      [
        [0, r - c / 2 - 5],
        [0, r + c + 4]
      ],
      [
        [-r + c / 2 + 4, 4],
        [-r - c, 4]
      ],
      [
        [0, -r + c / 2 + 4],
        [0, -r - c + 4]
      ]
    ];
    e.save(), e.font = "12px Droid Sans bold", e.fillStyle = o, e.textAlign = "center", e.translate(l, u), d.forEach((m, p) => {
      const [y, M] = m, [w, P] = g[p];
      e.fillText(y, w[0], w[1]), e.fillText(M, P[0], P[1]);
    }), e.restore();
  }
  /**绘制扫描范围 */
  drawScanRange(t) {
    const { ctx: e } = this, { angle: a, center: r, radius: o, colorRadar: l } = t, [u, c] = r;
    e.save(), e.translate(u, c), a.forEach((d) => {
      const g = (d - 90) % 360 * Math.PI / 180;
      e.rotate(g), ht.drawLine({ points: [[0, 0], [o, 0]], colorLine: l }, e), e.rotate(-g);
    }), e.restore();
  }
  /**更新动态当前角度 */
  updateAngle(t, e) {
    let { angle: [a, r], currentAngle: o, ifClockwise: l, time: u } = t;
    a -= 90, r -= 90;
    let c = o + (r - a) * e / 1e3 / u * (l ? 1 : -1);
    l && c >= r ? c = a + c % r : !l && c <= a && (c = r - (a - c) % 360), t.currentAngle = c;
  }
  /**绘制扫描部分(动态) */
  drawScan(t) {
    const { ctx: e } = this, { center: a, radius: r, currentAngle: o, colorSector: l } = t, [u, c] = a;
    e.save();
    const d = o % 360 * Math.PI / 180, g = r * Math.cos(d), m = r * Math.sin(d);
    ht.drawLine({
      points: [
        [u, c],
        [u + g, c + m]
      ],
      colorLine: l
    }), this.drawSector(t), e.restore();
  }
  /**
   * 绘制扇形区域
   * @param sectorDeg 扇形渐变角度
   * @returns
   */
  drawSector(t) {
    let { ctx: e } = this, { angle: [a, r], center: o, radius: l, ifClockwise: u, currentAngle: c, colorSector: d, sectorAngle: g } = t, [m, p] = o;
    a -= 90, r -= 90, e.save();
    let y = 50;
    const M = g % 360 * Math.PI / 180, w = u ? 1 : -1;
    let P = M / y * w;
    const E = c % 360 * Math.PI / 180, A = a % 360 * Math.PI / 180, T = r % 360 * Math.PI / 180;
    let G = E - w * M, R = E;
    for (let z = 0; z < y; z++) {
      e.beginPath(), e.moveTo(m, p);
      const Z = G * 180 / Math.PI, X = Math.floor(1 / y * 255);
      u && Z % 360 >= a || !u && Z % 360 <= r ? e.arc(m, p, l, G, R, !u) : e.arc(m, p, l, u ? A : T, R, !u), e.fillStyle = `${d}${X.toString(16).padStart(2, "0")}`, e.fill(), G += P;
    }
    e.restore();
  }
  /**计算colors 渐变颜色 */
  caculateColorChange(t, e) {
    const a = t.length, r = a <= e ? e / (a - 1) : 1, o = t.map((u, c) => {
      let d = parseInt(u.slice(1, 3), 16), g = parseInt(u.slice(3, 5), 16), m = parseInt(u.slice(5, 7), 16);
      return [d, g, m];
    });
    if (t.length < 2) return new Array(e).fill(0).map(() => o[0]);
    const l = [];
    for (let u = 0; u < e; u++) {
      const c = Math.floor(u / r), [d, g, m] = o[c], [p, y, M] = o[c + 1], w = u % r / r, P = Math.floor(d + (p - d) * w), E = Math.floor(g + (y - g) * w), A = Math.floor(m + (M - m) * w);
      l.push([P, E, A]);
    }
    return l;
  }
}
class Ee extends Vt {
  constructor(t, e) {
    super(t, e), this._draw = new gs(t, this.canvas);
  }
  /**地图事件引起的重绘绘制 */
  renderFixedData() {
    this.resetCanvas(), this.drawMapAll();
  }
  /**绘制所有需要绘制的类 */
  drawMapAll() {
    return this._draw.drawMapAll(), this;
  }
  /**设置原点 */
  setAllArcs(t) {
    return this._draw.setAllArcs(t), this;
  }
  /**设置线数据 */
  setAllLines(t) {
    return this._draw.setAllLines(t), this;
  }
  /**设置贝塞尔曲线数据 */
  setAllBezierLines(t) {
    return this._draw.setAllBezierLines(t), this;
  }
  /**设置多边形数据 */
  setAllRects(t) {
    return this._draw.setAllRects(t), this;
  }
  /**设置文本数据 */
  setAllTexts(t) {
    return this._draw.setAllTexts(t), this;
  }
  /**设置图片数据 */
  setAllImgs(t) {
    return this._draw.setAllImgs(t), this;
  }
  /**设置gif数据 */
  setAllGifs(t) {
    return this._draw.setAllGifs(t), this;
  }
  /**增加原点 */
  addArc(t) {
    return this._draw.addArc(t), this;
  }
  /**增加线 */
  addLine(t) {
    return this._draw.addLine(t), this;
  }
  /**增加贝塞尔曲线 */
  addBezierLine(t) {
    return this._draw.addBezierLine(t), this;
  }
  /**增加多边形 */
  addRect(t) {
    return this._draw.addRect(t), this;
  }
  /**增加文本 */
  addText(t) {
    return this._draw.addText(t), this;
  }
  /**增加图片 */
  addImg(t) {
    return this._draw.addImg(t), this;
  }
  /**删除指定圆点 */
  delArc(t) {
    return this._draw.delArc(t), this;
  }
  /**删除指定线 */
  delLine(t) {
    return this._draw.delLine(t), this;
  }
  /**删除指定贝塞尔曲线 */
  delBezierLine(t) {
    return this._draw.delBezierLine(t), this;
  }
  /**删除指定多边形 */
  delRect(t) {
    return this._draw.delRect(t), this;
  }
  /**删除指定多边形 */
  delText(t) {
    return this._draw.delText(t), this;
  }
  /**删除指定Img */
  delImg(t) {
    return this._draw.delImg(t), this;
  }
  /**清空
   * @param type 不填清空所有内容数据
   */
  delAll(t = "all") {
    return this._draw.delAll(t), this;
  }
}
function a0(s) {
  return s.length = 0, s;
}
function Kr(s) {
  return Array.isArray ? Array.isArray(s) : Object.prototype.toString.call(s) === "[object Array]";
}
function r0(s) {
  return Kr(s) && s.length > 0;
}
function o0(s, t, e) {
  if (Kr(s) && r0(t) && e !== void 0) {
    let a = s.slice(0, e + 1), r = s.slice(e + 1);
    a0(s), a.forEach((o) => s.push(o)), t.forEach((o) => s.push(o)), r.forEach((o) => s.push(o));
  }
  return s;
}
class m0 extends Vt {
  constructor(t, e) {
    super(t, e), this.options = {
      pane: "canvas",
      className: "plot"
    }, this.editArc = {
      latlng: [0, 0],
      colorFill: "#fff",
      colorLine: "#2C9B8A",
      size: 4
    }, this.plotList = [], this.plotAni = { latLngs: [], type: "polygon", ifEdit: !0 }, this.eventClick = (a) => {
      this.eventClickTimer = setTimeout(() => {
        let r = this.plotAni.latLngs.length, o = this.plotAni.type;
        const { latlng: l } = ki(a, this.type);
        (o === "polygon" || o === "line" || r < 2) && this.plotAni.latLngs.push([l.lat, l.lng]), (o === "rect" || o === "circle") && this.plotAni.latLngs.length >= 2 ? this.eventDblclick() : this._redraw(), this.cbPointChange && this.cbPointChange(this.plotAni);
      }, 50);
    }, this.eventMousemove = (a) => {
      const { latlng: r } = ki(a, this.type);
      this.curPoint = [r.lat, r.lng], this.renderAnimation();
    }, this.eventDblclick = () => {
      this.eventClickTimer && (clearTimeout(this.eventClickTimer), this.eventClickTimer = null), !(this.plotAni.type === "polygon" && this.plotAni.latLngs.length < 3) && (this.close(), this.curPoint = void 0, this._redraw());
    }, this.ctrMapDraw = new gs(t, this.canvas), this.ctrMapAniDraw = new Ee(t, Object.assign({}, this.options, { className: this.options.className + " ani" })), this.ctrEvent = new Me(t), Object.assign(this.options, e);
  }
  /**开启新增的绘制 */
  open(t) {
    let e = this.plotList.length - 1 > 0 ? this.plotList.length - 1 : 0;
    this.eventSwitch(!0);
    let a = this.plotList.find((r) => r.ifEdit);
    if (a || this.plotAni === this.plotList[e] && this.plotAni.ifEdit) {
      let r = a || this.plotAni;
      return this.plotAni = r, r.latLngs = [], r.type = t, r.ifEdit = !0, this.plotAni;
    }
    return this.plotList[e] && this.plotList[e].latLngs.length > 0 && e++, this.plotList[e] = this.plotAni = { latLngs: [], type: t, ifEdit: !0 }, this.renderAnimation(), this.plotAni;
  }
  /**关闭绘制 */
  close() {
    return this.eventSwitch(!1), this;
  }
  /**保存标绘 */
  savePlot() {
    if (this.plotAni) {
      let t = this.plotAni;
      t.ifEdit = !1, this.plotAni = void 0, this.redraw();
    }
    return this;
  }
  /**删除标绘 */
  delPlot(t) {
    return t = t || this.plotAni, this.plotList = this.plotList.filter((e) => e !== t), this._redraw(), this;
  }
  /**设置所有区域数据 */
  setPlotList(t) {
    return this.plotList = t, this.renderFixedData(), this;
  }
  /**设置编辑区域数据 */
  setEditPlot(t) {
    let e = this.plotList.find((a) => a === t);
    return e && (e.ifEdit = !0), this.eventSwitch(!1), this._redraw(), this;
  }
  /**重绘 */
  redraw() {
    return this._redraw(), this;
  }
  renderFixedData() {
    this.map && (this.ctrMapDraw.delAll(), this.ctrMapDraw.reSetCanvas(), this.plotList.forEach((t, e) => {
      t.latLngs.length > 0 && !t.ifEdit && t.ifHide !== !0 && this.drawPlot(this.ctrMapDraw, t, t.type);
    }), this.ctrMapDraw.drawMapAll());
  }
  renderAnimation() {
    this.map && this.genAniPlot();
  }
  /**生成动态绘制图层 */
  genAniPlot() {
    this.ctrMapAniDraw.delAll(), this.ctrMapAniDraw.resetCanvas(), this.ctrEvent.clearAllEvents();
    let t = this.plotList.find((e) => e.ifEdit);
    if (t) {
      this.plotAni = t;
      let e = { ...t }, a = t.latLngs;
      this.curPoint && (e.type === "circle" && a.length < 2 || e.type !== "circle") && (e.latLngs = [...a, this.curPoint]), this.drawPlot(this.ctrMapAniDraw, e, e.type), this.openMouseEdit(e), this.ctrMapAniDraw.drawMapAll();
      return;
    }
  }
  /**绘制标绘 */
  drawPlot(t, e, a) {
    let r = Object.assign({}, this.options, e);
    r.colorFill = r.colorFill, r.colorLine = r.colorLine || r.colorFill;
    let o;
    switch (a) {
      case "line":
        r = r, t.addLine({ ...r, latlngs: r.latLngs });
        break;
      case "polygon":
        r = r, o = r.latLngs;
        let u = { ...r, latlngs: o };
        t.addRect(u);
        break;
      case "circle":
        if (r = r, r.latLngs.length == 0) break;
        let c = r.latLngs[0], d = r.latLngs[1], g = r?.rail || 0;
        if (!d) {
          let [w, P] = c, E = wr(this.map, g, [[w, P]]);
          r.latLngs[1] = [c[0], P + E];
        }
        let m = this.calcRadius(r.latLngs);
        t.addArc({ ...r, size: m, latlng: c });
        break;
      case "rect":
        r = r, o = this.calcRect(r.latLngs);
        let p = { ...r, latlngs: o };
        t.addRect(p);
        break;
      case "point":
        if (o = r.latLngs, !o || o.length == 0) break;
        const { url: y, size: M = [16, 16] } = r = r;
        y && t.addImg({ ...r, latlng: o[0], size: M });
        break;
    }
    let l = { text: r.name || "", colorFill: "#2C9B8A", widthLine: 2, colorLine: "#FFFFFF", ifShadow: !0, latlng: this.calcCenter(r.latLngs, a) };
    t.addText(l);
  }
  /**各个点的平均值计算中心点 */
  calcCenter(t, e) {
    let a = t.length;
    if (a < 2 || e === "circle" || e == "point") return t[0] || [0, 0];
    if (e == "line") {
      let o = 0, l = 0, u = 0;
      for (let g = 0; g < t.length - 1; g++) {
        const [m, p] = t[g], [y, M] = t[g + 1], w = Math.sqrt(Math.pow(y - m, 2) + Math.pow(M - p, 2));
        o += w;
        const P = (m + y) / 2, E = (p + M) / 2;
        l += P * w, u += E * w;
      }
      const c = l / o, d = u / o;
      return [c, d];
    }
    let r = t.reduce((o, l) => [o[0] + l[0], o[1] + l[1]], [0, 0]);
    return r = [r[0] / a, r[1] / a], r;
  }
  /**直接最大最小计算中心点 */
  calcCenter2(t) {
    if (t.length < 2) return t[0] || [0, 0];
    let a = t.reduce((c, d) => {
      let [g, m, p, y] = c;
      return [
        g > d[0] ? g : d[0],
        m < d[0] ? m : d[0],
        p > d[1] ? p : d[1],
        y < d[1] ? y : d[1]
      ];
    }, [-1 / 0, 1 / 0, -1 / 0, 1 / 0]), [r, o, l, u] = a;
    return [(r + o) / 2, (l + u) / 2];
  }
  /**计算多边形的重心*/
  calcCenter3(t) {
    let e = 0, a = 0, r = 0;
    for (let l = 0; l < t.length; l++) {
      const u = (l + 1) % t.length, c = t[l][0] * t[u][1] - t[u][0] * t[l][1];
      r += c, e += (t[l][0] + t[u][0]) * c, a += (t[l][1] + t[u][1]) * c;
    }
    return r *= 3, [e / r, a / r];
  }
  /**计算矩形的四个点 */
  calcRect(t) {
    if (t.length < 2) return t;
    let e = [], a = t[0], r = t[1];
    return e.push(a), e.push([a[0], r[1]]), e.push(r), e.push([r[0], a[1]]), e;
  }
  /**计算圆的半径 */
  calcRadius(t) {
    if (t.length < 2) return 0;
    let e = mt(this.map, t[0]), a = mt(this.map, t[1]), r = Math.abs(e[0] - a[0]), o = Math.abs(e[1] - a[1]);
    return Math.sqrt(r * r + o * o);
  }
  /**开启鼠标编辑功能 */
  openMouseEdit(t) {
    switch (t.type) {
      case "point":
        return this.setPointEdit(t);
      case "line":
        return this.setLineEditPoint(t);
      case "polygon":
        return this.setPolygonEditPoint(t);
      case "circle":
        return this.setCircleEditPoint(t);
      case "rect":
        return this.setRectEditPoint(t);
    }
  }
  /**设置圆的编辑点 */
  setCircleEditPoint(t) {
    let { latLngs: e } = t, a = [];
    for (let o = 0, l = e.length; o < l; o++) {
      let u = e[o];
      this.addEvent(u, o, t, a, !1);
    }
    let r = { ...this.options, latlngs: t.latLngs };
    this.ctrMapAniDraw.addLine(r), this.ctrEvent.setEventsByKey(a, "circleEdit");
  }
  /**设置多边形的编辑点 */
  setPolygonEditPoint(t) {
    let { latLngs: e } = t, a = [];
    for (let r = 0, o = e.length; r < o; r++) {
      let l = e[r];
      if (this.addEvent(l, r, t, a, !1), !this.curPoint) {
        let u = r + 1 == o ? 0 : r + 1, c = e[u], d = mt(this.map, l), g = mt(this.map, c), m = (d[0] + g[0]) / 2, p = (d[1] + g[1]) / 2, y = Ft(this.map, [m, p]);
        this.addEvent(y, r, t, a, !0);
      }
    }
    this.ctrEvent.setEventsByKey(a, "polygonEdit");
  }
  /**点标绘仍可编辑移动位置 */
  setPointEdit(t) {
    let { latLngs: e } = t;
    if (!e) return;
    let a = [];
    this.addEvent(e[0], 0, t, a), this.ctrEvent.setEventsByKey(a, "pointEdit");
  }
  /**设置线段的编辑点 */
  setLineEditPoint(t) {
    let { latLngs: e } = t, a = [];
    for (let r = 0, o = e.length; r < o; r++) {
      let l = e[r];
      this.addEvent(l, r, t, a, !1);
    }
    this.ctrEvent.setEventsByKey(a, "lineEdit");
  }
  /**设置矩形的编辑点 */
  setRectEditPoint(t) {
    let { latLngs: e } = t, a = this.calcRect(e), r = [];
    for (let o = 0, l = a.length; o < l; o++) {
      let u = a[o];
      this.addEvent(u, o, t, r, !1);
    }
    this.ctrEvent.setEventsByKey(r, "rectEdit");
  }
  /**添加响应事件 
   * @param latLng 经纬度
   * @param i 索引
   * @param plotInfo 绘制信息
   * @param eves 事件
   * @param ifVirtual 是否为虚拟点
  */
  addEvent(t, e, a, r, o) {
    const l = this, { map: u } = l;
    let c = { ...this.editArc, latlng: t }, { latLngs: d, type: g } = a;
    o && (c.size = 3, c.fillAlpha = 0.9), this.ctrMapAniDraw.addArc(c), r.push({
      latlng: t,
      type: "mousedown",
      cb: (m) => {
        Va(u, "dragEnable", !1), o && (o0(a.latLngs, [t], e), this.cbPointChange && this.cbPointChange(this.plotAni)), this._redraw();
        let p = (M) => {
          const { latlng: w } = ki(M, this.type);
          if (g === "polygon" || g === "circle" || g === "point" || g === "line")
            t[0] = w.lat, t[1] = w.lng;
          else if (g === "rect") {
            let P = this.calcRect(d), E = (e + 2) % 4, A = [w.lat, w.lng], T = P[E];
            this.plotAni.latLngs = [A, T].filter((G) => !!G);
          }
          this.renderAnimation();
        }, y = () => {
          this.map.off("mousemove", p), this.map.off("mouseup", y), Va(u, "dragEnable", !0), this.cbPointChange && this.cbPointChange(this.plotAni), this._redraw();
        };
        this.map.on("mousemove", p), this.map.on("mouseup", y);
      }
    });
  }
  /**事件开关方法 
  * @param flag true开启 false关闭
  */
  eventSwitch(t) {
    let e = t ? "on" : "off";
    t && this.eventSwitch(!1), this.map[e]("click", this.eventClick), this.map[e]("dblclick", this.eventDblclick), this.map[e]("mousemove", this.eventMousemove);
  }
  /**移除所有的监听函数 */
  clearCb() {
    this.cbPointAdd = void 0, this.cbPointMove = void 0, this.cbPointChange = void 0;
  }
  /**添加新增点位时的监听函数 */
  addCbPointChange(t) {
    return this.cbPointChange = t, this;
  }
  /**添加新增点位时的监听函数 */
  addCbPointAdd(t) {
    return this.cbPointAdd = t, this;
  }
  /**添加新增点位时的监听函数 */
  addCbPointMove(t) {
    return this.cbPointMove = t, this;
  }
}
class g0 extends Vt {
  /** 测绘类，传入Amap或者调用addTo */
  constructor(t, e) {
    super(t, e), this.options = {
      pane: "canvas",
      className: "range",
      colorLine: "#364A7D",
      colorArc: "#FFF",
      colorArcStart: "#415880",
      colorFont: " #333333"
    }, this.lnglats = [], this.ifDrag = !1, this.eventDrag = (a) => {
      this.ifDrag = !0;
    }, this.eventDragend = (a) => {
      this.ifDrag = !1;
    }, this.eventClick = (a) => {
      console.log(a), this.eventClickTimer = setTimeout(() => {
        const { latlng: r } = ki(a, this.type);
        let o = new V.LatLng(r.lat, r.lng);
        this.lnglats[this.lnglats.length - 1].push(o), this.renderFixedData(), this.renderAnimation();
      }, 100);
    }, this.eventMousemove = (a) => {
      if (this.ifDrag) return;
      const { latlng: r } = ki(a, this.type);
      this.lnglat = new V.LatLng(r.lat, r.lng), this.renderAnimation();
    }, this.eventDblclick = () => {
      this.eventClickTimer && (clearTimeout(this.eventClickTimer), this.eventClickTimer = null), this.close(), this.lnglat = void 0, this.renderFixedData(), this.renderAnimation();
    }, Object.assign(this.options, e), this.ctrMapDraw = new gs(t, this.canvas), this.ctrMapAniDraw = new Ee(t, Object.assign({}, this.options, { className: this.options.className + " ani" })), this.ctrEvent = new Me(t);
  }
  setOptions(t) {
    return Object.assign(this.options, t), this._redraw(), this;
  }
  /** 启用测距功能 */
  open() {
    let t = this.lnglats.length;
    return this.lnglats[t] && this.lnglats[t].length > 0 && t++, this.lnglats[t] = [], this.eventSwitch(!0), this;
  }
  /** 关闭测距功能 */
  close(t = !0) {
    this.eventSwitch(!1), t && this.endCb?.();
  }
  onEnd(t) {
    this.endCb = t;
  }
  /** 缓存绘图数据（对于引进确定的数据进行缓存） */
  renderFixedData() {
    this.ctrMapDraw.reSetCanvas(), this.ctrEvent.clearEventsByKey("range");
    let t = [], e = this.lnglats.length, a = [], r = [], o = [], l = [], u = this.options;
    for (let c = 0; c < e; c++) {
      let d = this.lnglats[c], g = [], m = 0;
      for (let w = 0, P = d.length; w < P; w++) {
        let E = d[w], A = [E.lat, E.lng], T = "起点";
        if (g.push(A), w == 0) {
          let G = { latlng: g[0], size: 3, colorFill: u.colorArcStart, colorLine: u.colorLine };
          r.push(G), o.push({ text: T, latlng: A, colorFill: u.colorFont, py: -12, px: 5, textAlign: "right", panel: { colorFill: "#fff", fillAlpha: 0.8, colorLine: "#90A4A4", widthLine: 1 } });
        } else {
          let G = d[w - 1], R = 5, z = rs([G.lat, G.lng], [E.lat, E.lng], 0), Z = Xa(this.map, [G.lat, G.lng], [E.lat, E.lng]);
          m += z, T = (z > 1852 ? (z / 1852).toFixed(2) + " nm" : z.toFixed(0) + " m") + "/" + Z.toFixed(2) + "°", w == P - 1 && (c < e - 1 || this.lnglat === void 0) && (T = T + ";" + (m > 1852 ? (m / 1852).toFixed(2) + " nm" : m.toFixed(0) + " m"), R = 20, l.push({
            latlng: A,
            posX: 17,
            posY: 34,
            left: 20,
            size: [16, 16],
            sizeo: [16, 16],
            type: "click",
            url: "/assets/icons/icon-16.png"
          }), t.push({
            latlng: A,
            range: [8, 8],
            type: "click",
            left: 20,
            cb: () => {
              this.lnglats.splice(c, 1), this._redraw();
            }
          })), o.push({
            text: T,
            colorFill: u.colorFont,
            latlng: A,
            py: -12,
            px: 5,
            textAlign: "right",
            panel: {
              pr: R,
              colorFill: "#fff",
              fillAlpha: 0.8,
              colorLine: "#90A4A4",
              widthLine: 1
            }
          });
        }
      }
      let p = [...g];
      p.shift();
      let y = { latlngs: p, size: 3, colorFill: u.colorArc, colorLine: u.colorLine }, M = { latlngs: g, colorLine: u.colorLine };
      a.push(M), r.push(y);
    }
    this.ctrEvent.setEventsByKey(t, "range"), this.ctrMapDraw.setAllImgs(l), this.ctrMapDraw.setAllLines(a), this.ctrMapDraw.setAllArcs(r), this.ctrMapDraw.setAllTexts(o), this.ctrMapDraw.drawMapAll();
  }
  renderAnimation() {
    this.map && this.genAniLineDate();
  }
  /** 动画虚线绘制 */
  genAniLineDate() {
    let t = this.ctrMapAniDraw;
    t.setAllTexts([]).setAllLines([]);
    let e = this.lnglats.length, a = this.lnglats[e - 1] || [];
    if (this.lnglat && this.lnglat.lat !== void 0 && a.length > 0) {
      let r = a[a.length - 1], o = rs([this.lnglat.lat, this.lnglat.lng], [r.lat, r.lng], 0), l = Xa(this.map, [r.lat, r.lng], [this.lnglat.lat, this.lnglat.lng]), u = (o > 1852 ? (o / 1852).toFixed(2) + " nm" : o.toFixed(0) + " m") + "/" + l.toFixed(2) + "°";
      t.setAllLines([{ latlngs: [[this.lnglat.lat, this.lnglat.lng], [r.lat, r.lng]], dash: [3, 3], colorLine: "#364A7D" }]), t.setAllTexts([{ latlng: [this.lnglat.lat, this.lnglat.lng], text: u, colorFill: "#FFFFFF" }]);
    }
    t.drawMapAll();
  }
  /** 绘制文本信息  flag标识该条线已经绘制完成 */
  drawEndTextImg(t, e) {
    let { latlng: a, panel: r, text: o = "text" } = t, l = mt(this.map, a), u = document.createElement("canvas").getContext("2d");
    ht.setCtxPara(u, t);
    let c = u.measureText(o), d = c.width, g = c.actualBoundingBoxAscent, m = c.actualBoundingBoxDescent, p = l[0] - d / 2, y = l[1] - (g - m) / 2, w = p + d + 5 + 16 / 2, P = y - (g - m) / 2, E = Ft(this.map, [w, P]);
    return this.ctrEvent.pushEventByKey("text", {
      latlng: E,
      point: [w, P],
      range: [10, 10],
      type: "click",
      cb: () => {
        this.lnglats.splice(e, 1), this._redraw();
      }
    }), {
      latlng: E,
      url: "/assets/images/icon/com_close_red.png",
      size: [16, 16]
    };
  }
  /**事件开关方法 
          * @param flag true开启 false关闭
  */
  eventSwitch(t) {
    let e = t ? "on" : "off";
    t && this.eventSwitch(!1), this.map[e]("drag", this.eventDrag), this.map[e]("dragend", this.eventDragend), this.map[e]("click", this.eventClick), this.map[e]("dblclick", this.eventDblclick), this.map[e]("mousemove", this.eventMousemove);
  }
}
class p0 {
  /**轨迹绘制类 */
  constructor(t, e) {
    this.options = {
      pane: "canvas",
      ifLine: !0,
      ifArc: !0,
      arcInterval: 1,
      className: "track",
      zIndex: 100,
      sizeArc: 3,
      colorArc: "#FFFFFF",
      colorArcFill: "#D9AF3B",
      widthLine: 1,
      colorLine: "#525b65",
      textEnd: "终点",
      textStart: "起点",
      colorTextEnd: "#D85151",
      colorTextStart: "#8D4CC3",
      colorArcStart: "#8D4CC3",
      colorArcEnd: "#D85151"
    }, this.allTracks = [], this.earlyTime = 0, this.intervalTime = 20, this.time = 0, this.cbs = /* @__PURE__ */ Object.create(null), this.map = t, Object.assign(this.options, e);
    let a = this.options.zIndex + 1;
    this.layerDraw = new Ee(t, this.options), this.layerAniDraw = new Ee(t, Object.assign({}, this.options, { zIndex: a, className: "track ani" })), this.allEvents = new Me(t);
  }
  /**zoom变化 重设arc数据 */
  onRemove() {
    this.layerDraw.onRemove(), this.layerAniDraw.onRemove();
  }
  /**设置添加轨迹数据(并重新绘制) */
  setTracks(t) {
    const e = this, { allTracks: a } = e;
    t.forEach((r) => {
      const o = a.find((l) => l.id === r.id);
      o ? o.data.push(...r.data) : a.push(r);
    }), e.earlyTime = 1 / 0, a.forEach((r) => {
      const o = r.data, l = o.length, u = o[l - 1];
      u && (e.earlyTime = Math.min(e.earlyTime, u.timeStamp));
    }), this.setAniImage([]);
  }
  /**获取指定时间各轨迹点的位置信息集合 */
  getInfosByTime(t) {
    const e = this, { allTracks: a } = e, r = [];
    return e.time = t.getTime() / 1e3, this.getNextTrack(), a.forEach((o) => {
      const l = o.data;
      let u = this.getInfoByTime(e.time, l), c = Object.assign({}, { orginData: o.orginData }, u);
      r.push(c);
    }), this._drawTracks(), r;
  }
  /**获取下一时间段的数据 */
  getNextTrack() {
    let { earlyTime: t, intervalTime: e, time: a } = this;
    !t || a - t < e || (this.earlyTime = 0, console.log("获取下一段数据"), this.trigger("next"));
  }
  /**设置轨迹上的动点船 */
  setAniImage(t, e = []) {
    const { layerAniDraw: a } = this;
    a.resetCanvas(), a.setAllImgs(t), a.setAllTexts(e), a.drawMapAll();
  }
  /**添加点击圆点时的监听函数 */
  addCbClickPoint(t) {
    return this.cbClickPoint = t, this._drawTracks(), this;
  }
  /**设置轨迹的显示和隐藏 */
  setOpt(t) {
    Object.assign(this.options, t), this._drawTracks();
  }
  /**绘制轨迹数据 */
  _drawTracks() {
    const t = this, { layerDraw: e, layerAniDraw: a, allEvents: r, allTracks: o, options: l, time: u } = t, { ifArc: c, ifLine: d } = l;
    if (e.resetCanvas(), e.setAllLines([]), e.setAllArcs([]), e.setAllTexts([]), r.clearEventsByKey("track"), !d) {
      e.drawMapAll();
      return;
    }
    let g = [];
    for (const m in o)
      if (Object.prototype.hasOwnProperty.call(o, m)) {
        const p = o[m];
        t.drawHistoryTrack(p), t.addPointEvent(p, g);
      }
    r.setEventsByKey(g, "track"), e.drawMapAll();
  }
  /**单条轨迹绘制 （并给点添加事件）*/
  drawHistoryTrack(t) {
    this.drawLine(t), this.drawArc(t), this.drawStartEnd(t);
  }
  /**绘制轨迹线 */
  drawLine(t) {
    let { widthLine: e, colorLine: a } = this.options, { data: r } = t, o = this.time, l = [];
    for (let c = 0; c < r.length; c++) {
      let d = r[c];
      if (l.push([d.lat, d.lng]), d.timeStamp > o && c > 1) break;
    }
    let u = {
      latlngs: l,
      widthLine: e,
      colorLine: a,
      minZoom: 10
    };
    this.layerDraw.addLine(u);
  }
  /**绘制轨迹点 */
  drawArc(t) {
    let { sizeArc: e, colorArcFill: a, colorArc: r, arcInterval: o = 0, ifArc: l } = this.options, { data: u } = t;
    if (!l) return;
    let c = 0, d = u.map((m, p) => {
      if (o < 1e3 && p % (o + 1) === 0) return [m.lat, m.lng];
      if (o >= 1e3 && (m.timeStamp - c) / o > 1)
        return c = m.timeStamp, [m.lat, m.lng];
    }).filter((m) => m), g = Object.assign(
      {},
      {
        size: e,
        colorFill: a,
        latlngs: d,
        colorLine: r,
        minZoom: 10
      }
    );
    this.layerDraw.addArc(g);
  }
  /**实现移除数组第一个和最后一个元素得到新的数组 */
  removeFirstLast(t) {
    let e = t.length;
    return e <= 2 ? [] : t.slice(1, e - 1);
  }
  /**绘制轨迹起点终点 */
  drawStartEnd(t) {
  }
  /**添加轨迹点事件*/
  addPointEvent(t, e) {
    if (!this.cbClickPoint) return;
    let a = t.data.map((r) => [r.lat, r.lng]);
    e.push({
      type: ["click"],
      latlng: [90, 180],
      minZoom: 10,
      latlngs: a,
      info: t,
      range: [3, 3],
      cb: (r) => {
        this.cbClickPoint && this.cbClickPoint(r);
      }
    });
  }
  /**获得指定时间的位置信息 */
  getInfoByTime(t, e) {
    let a = e.length, r = e[0], o = e[a - 1];
    if (t <= r.timeStamp)
      r = r, o = e[1] || r;
    else if (t >= o.timeStamp)
      o = o, r = e[a - 2] || o;
    else
      for (let l = 0; l < a; l++) {
        r = e[l], o = e[l + 1];
        let u = r.timeStamp, c = o.timeStamp;
        if (u <= t && c >= t)
          break;
      }
    return this.computeDate(r, o, t);
  }
  /**计算位置信息 */
  computeDate(t, e, a) {
    let { lat: r, lng: o, timeStamp: l, course: u, speed: c } = t, { lat: d, lng: g, timeStamp: m } = e;
    if (t == e)
      return { lat: r, lng: o, SPEED: c, time: new Date(a * 1e3), rotate: u, speed: 0 };
    let p = 90 - Math.atan2(d - r, g - o) * 180 / Math.PI, y = l, M = m, P = (a - y) / (M - y);
    P = P > 1 ? 1 : P < 0 ? 0 : P;
    let E = d - r, A = g - o, T = r + E * P, G = o + A * P, R = Math.sqrt(E / (M - y) * E / (M - y) + A / (M - y) * A / (M - y));
    return { lat: T, lng: G, time: new Date(a * 1e3), rotate: p, speed: R, SPEED: c };
  }
  /**移除所有的监听函数 */
  clearCb() {
    this.cbClickPoint = void 0;
  }
  /** */
  on(t, e) {
    this.cbs[t] = e;
  }
  /** */
  trigger(t) {
    this.cbs[t] && this.cbs[t]();
  }
}
const h0 = `importScripts();\r
/**全局变量  */\r
/**主线程传过来的数据(此线程处理单个数据由1个元素组成的数据) */\r
var data;\r
/**绘图用的离屏的画布OffscreenCanvas上下文 */\r
var offCtx;\r
/**执行任务的id */\r
var taskId;\r
/** */\r
self.addEventListener('message', function (ev) {\r
    data = ev.data;\r
    let id = data.id;\r
    // 创建一个 OffscreenCanvas，并获取其渲染上下文\r
    const offscreenCanvas = new OffscreenCanvas(data.width, data.height);\r
    offCtx = offscreenCanvas.getContext('2d');\r
    computeData();\r
    let bitMap = offscreenCanvas.transferToImageBitmap();\r
    self.postMessage({workerId: data.id , data:bitMap});\r
}, false);\r
/**计算并构建数据 */\r
function computeData() {\r
    let columns = this.interpolateField();\r
    this.genMosaic(columns);\r
}\r
/**生成可视区范围数据\r
 * @param bounds  可视区域的像素范围\r
*/\r
function interpolateField() {\r
    // width 可视区宽度  height 可视区高度 lat起始纬度 lng起始经度 latd单个像素纬度差 lngd单个像素经度差\r
    let { width, height, lng, lngd, lats } = data, columns = [];\r
    for (let y = 0; y < height; y += 2) {\r
        //[number, number, number][]\r
        let column = [];\r
        for (let x = 0; x < width; x += 2) {\r
            //得到可视区X , Y 点对应地图上的经纬度\r
            let cLat = lats[y], cLng = lng + x * lngd;\r
            // let {lat:cLat,lng:cLng} = containerPointToLatLng([x,y])\r
            /**是否是有效数字 */\r
            if (isFinite(cLng)) {\r
                //获得指定经纬度的信息 [ u数据 , v数据 , 平均值 ]\r
                var wind = interpolate(cLng, cLat);\r
                if (wind) column[x + 1] = column[x] = wind;\r
            }\r
        }\r
        columns[y + 1] = columns[y] = column;\r
    }\r
    return columns;\r
}\r
/**获得指定经纬度的数据信息\r
* @param lng 经度number\r
* @param lat 纬度number\r
* @return [ 计算得到的开始值S , 计算的到的结束值E, sqrt(S*S+E*E) ]\r
*/\r
function interpolate(lng, lat) {\r
    let { lat0, latΔ, lng0, lngΔ, grid } = data;\r
    if (!grid) return null;\r
    /** 该经度属于nx的第几个 */\r
    let i = floorMod(lng - lng0, 360) / lngΔ;\r
    /** 该纬度属于ny的第几个 */\r
    let j = (lat0 - lat) / latΔ;\r
    let fx = Math.floor(i),\r
        nx = fx + 1,\r
        fy = Math.floor(j),\r
        ny = fy + 1;\r
    let row;\r
    /** Y轴第fy个数据 赋值并且不为undefined */\r
    if (row = grid[fy]) {\r
        let g00 = row[fx], g10 = row[nx];\r
        if (isValue(g00) && isValue(g10) && (row = grid[ny])) {\r
            //X轴第fy+1个数据\r
            var g01 = row[fx], g11 = row[nx];\r
            if (isValue(g01) && isValue(g11)) {\r
                return bilinearInterpolateVector(i - fx, j - fy, g00, g10, g01, g11);\r
            }\r
        }\r
    }\r
    return null;\r
}\r
/**根据网格数据构建虚拟数值\r
* @param x 指定经度的X数值相对最近的低位整数坐标的差值 [0,1)\r
* @param y 指定纬度的Y数值相对最近的低位整数坐标的差值 [0,1)\r
* @param g00 该经纬度所在的网格的左上角的数据\r
* @param g10 该经纬度所在的网格的右上角的数据\r
* @param g01 该经纬度所在的网格的左下角的数据\r
* @param g11 该经纬度所在的网格的右下角的数据\r
* @returns [ 计算得到的开始值S , 计算的到的结束值E, 平均速度 ]\r
*/\r
function bilinearInterpolateVector(x, y, g00, g10, g01, g11) {\r
    /**右侧(下一个)的影响权重 */\r
    let invalid = data.invalid, rx = 1 - x, ry = 1 - y, u, v;\r
    let a = rx * ry,\r
        b = x * ry,\r
        c = rx * y,\r
        d = x * y;\r
    if (g00[0] === invalid || g10[0] === invalid || g01[0] === invalid || g11[0] === invalid) u = invalid;\r
    if (u === invalid ) return [invalid];\r
    u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;\r
    return [u];\r
}\r
/**生成马赛克类型图 */\r
function genMosaic(datas) {\r
    let ctx = offCtx;\r
    //根据点位创建颜色深度不一的黑色遮罩\r
    ctx.globalAlpha = 0.35;\r
    let { width, height, invalid } = data;\r
    for (let i = 0, len = height; i < len; i++) {\r
        for (let j = 0, len = width; j < len; j++) {\r
            let p = datas[i][j] || [], value = p[0];\r
            if (value === invalid || value === undefined || value === null) continue;\r
            ctx.fillStyle = this.getColorByValue(value);\r
            ctx.fillRect(j, i, 1, 1);\r
        }\r
    }\r
}\r
/**获取该值所在的颜色 */\r
function getColorByValue(value) {\r
    let colors = data.mosaicColor || [], values = data.mosaicValue || [];\r
    for (let i = 0, len = values.length; i < len; i++) {\r
        let p = values[i];\r
        if (value < p) return colors[i];\r
    }\r
    return colors[colors.length - 1];\r
}\r
/**是否是空数据 */\r
function isNull(value) {\r
    return value === invalid || value === undefined || value === null || isNaN(value);\r
}\r
/**判断是否为有效数据 */\r
function isValue(x) {\r
    return x !== null && x !== undefined;\r
}\r
/**针对经纬度特殊的取余数方法\r
 * 小于等于n的数字若a小于0，返回 2n+a ， -365  => 2n-365 \r
*/\r
function floorMod(a, n) {\r
    return a - n * Math.floor(a / n);\r
}`;
class l0 {
  constructor(t, e) {
    this.cb = e;
    const a = new Blob([h0], { type: "text/javascript" }), r = URL.createObjectURL(a), o = this.worker = new Worker(r, { type: "classic" });
    o.onmessage = (l) => {
      console.log(l), this.cb?.(l.data);
    }, o.onerror = (l) => {
      console.error(["ERROR: Line ", l.lineno, " in ", l.filename, ": ", l.message].join(""));
    };
  }
  /**发送信息给子线程 */
  post(t) {
    return this.worker.postMessage(t), this;
  }
  /**线程处理后返回数据处理 */
  then(t) {
    return this.cb = t, this;
  }
}
class $r extends Vt {
  constructor(t, e) {
    super(t, e), this.dataLength = 1, this.worker = new l0("grid-worker1", (a) => this.workerCb(a)), this.workerId = 0;
  }
  /**将线程绘制的图像绘制出来 */
  workerCb(t) {
    t.workerId && this.workerId - 1 !== t.workerId || (this.resetCanvas(), this.ctx.drawImage(t.data, 0, 0));
  }
  /**设置网格数据 */
  _setDatas(t) {
    if (!t || t.length === 0) {
      this.gridXY = [];
      return;
    }
    let { lo1: e = 0, la1: a = 0, dx: r = 0, dy: o = 0 } = t[0]?.header || {};
    this.lng0 = e, this.lat0 = a, this.lngΔ = r, this.latΔ = o, this.invalid = null, this.builder(t);
  }
  /**采用线程调取生成可视区网格数据 */
  interpolateFieldByWorker(t) {
    let [e, a] = Ft(this.map, [0, 0]), [, r] = Ft(this.map, [1, t.height]), o = [];
    for (let l = 0; l <= t.height; l++) o[l] = Ft(this.map, [0, l])[0];
    this.worker.post({
      id: this.workerId++,
      width: t.width,
      height: t.height,
      lats: o,
      lat: e,
      lng: a,
      lat0: this.lat0,
      lng0: this.lng0,
      latΔ: this.latΔ,
      lngΔ: this.lngΔ,
      lngd: r - a,
      invalid: this.invalid,
      grid: this.gridXY,
      mosaicColor: this.options.mosaicColor,
      mosaicValue: this.options.mosaicValue
    });
  }
  /**grid数据，以及获得指定经纬度数据的方法interpolate
   * @param bounds 可视区域的像素范围
  */
  interpolateField(t) {
    var e = [];
    for (let r = t.x, o = t.height; r < o; r += 2) {
      let l = [];
      for (let u = t.x; u <= t.width; u += 2) {
        let [c, d] = Ft(this.map, [u, r]);
        if (isFinite(d)) {
          var a = this.interpolate(d, c);
          a && (l[u + 1] = l[u] = a);
        }
      }
      e[r + 1] = e[r] = l;
    }
    this.boundsDatas = e, this.genMosaic(e);
  }
  /**获取视图范围内的(指定像素间隔的数据) */
  getViewBoundsGrid(t, e = 2) {
    var a = [];
    for (let o = t.x, l = t.height; o < l; o += e) {
      let u = [];
      for (let c = t.x; c <= t.width; c += e) {
        let [d, g] = Ft(this.map, [c, o]);
        if (isFinite(g)) {
          var r = this.interpolate(g, d);
          r && (u[c + 1] = u[c] = r);
        }
      }
      a[o + 1] = a[o] = u;
    }
    return this.boundsDatas = a, a;
  }
  /**构建网格数据gridXY: [开始的数据,结束的数据] [x序号] [y序号] 
   * @param data 一维数据
   * @param nx 列数
   * @param ny 行数
   * @returns 三维网格数据
   */
  builder(t) {
    let { nx: e = 0, ny: a = 0, dx: r = 0 } = t[0]?.header || {}, o = 1, l = Math.floor(e * r) >= 360, u = [], c = t[0].data || [], d = t[1]?.data || [], g = 0;
    for (var m = 0; m < a; m++) {
      let y = [];
      c[m], d[m];
      for (var p = 0; p < e; p++, g++) {
        let M = c[g], w = d[g];
        M = M === this.invalid || w === void 0 ? M : M * o, w = w === this.invalid || w === void 0 ? w : w * o, y[p] = [M, w];
      }
      l && y.push(y[0]), u[m] = y;
    }
    return this.gridXY = u, u;
  }
  /**获得指定经纬度的数据信息
  * @param lng 经度
  * @param lat 纬度
  * @return [ 计算得到的开始值S , 计算的到的结束值E, sqrt(S*S+E*E) ]
  */
  interpolate(t, e) {
    if (!this.gridXY) return null;
    let a = this.gridXY, r = this.lng0, o = this.lngΔ, l = this.latΔ, u = this.lat0, c = this.floorMod(t - r, 360) / o, d = (u - e) / l, g = Math.floor(c), m = g + 1, p = Math.floor(d), y = p + 1;
    var M;
    if (M = a[p]) {
      let E = M[g], A = M[m];
      if (this.isValue(E) && this.isValue(A) && (M = a[y])) {
        var w = M[g], P = M[m];
        if (this.isValue(w) && this.isValue(P))
          return this.bilinearInterpolateVector(c - g, d - p, E, A, w, P);
      }
    }
    return null;
  }
  /**根据网格数据构建虚拟数值
  * @param x 指定经度的X数值相对最近的低位整数坐标的差值 [0,1)
  * @param y 指定纬度的Y数值相对最近的低位整数坐标的差值 [0,1)
  * @param g00 该经纬度所在的网格的左上角的风速信息
  * @param g10 该经纬度所在的网格的右上角的风速信息
  * @param g01 该经纬度所在的网格的左下角的风速信息
  * @param g11 该经纬度所在的网格的右下角的风速信息
  * @returns [ 计算得到的开始值S , 计算的到的结束值E, 平均速度 ]
  */
  bilinearInterpolateVector(t, e, a, r, o, l) {
    let u = 1 - t, c = 1 - e, d = u * c, g = t * c, m = u * e, p = t * e, y = a[0] * d + r[0] * g + o[0] * m + l[0] * p, M = a[1] * d + r[1] * g + o[1] * m + l[1] * p;
    return [y, M, Math.sqrt(y * y + M * M)];
  }
  /**针对经纬度特殊的取余数方法
   * 小于等于n的数字若a小于0，返回 2n+a ， -365  => 2n-365 
  */
  floorMod(t, e) {
    return t - e * Math.floor(t / e);
  }
  /**判断是否为有效数据 */
  isValue(t) {
    return t != null;
  }
  /**此处无数据数据 */
  isNull(t) {
    return this.invalid === t[0] && this.invalid === t[1];
  }
  /**生成马赛克类型图 */
  genMosaic(t) {
    let e = this.ctx, a = this.width, r = this.height;
    e.globalAlpha = 0.35;
    for (let o = 0, l = r; o < l; o++)
      for (let u = 0, c = a; u < c; u++) {
        let d = t[o][u] || [], g = d[2];
        e.fillStyle = this.getColorByValue(g), e.fillRect(u, o, 1, 1);
      }
  }
  /**生成黑白遮罩，以便构建渐变图 */
  genShade(t) {
    let e = this.options;
    this.shadowElement || (this.shadowElement = this.genShadowRadius(1, 0)), !this.gradientElement && e.gradient && (this.gradientElement = this.genGradient(e.gradient));
    let a = this.ctx, r = this.width, o = this.height, l = 0, u = e.gradientMax || -1;
    e.gradientRadius;
    for (let d = 0, g = o; d < g; d++)
      for (let m = 0, p = r; m < p; m++) {
        let y = t[d][m], M = y[2];
        a.globalAlpha = Math.min(Math.max(M / u, l), 1), a.drawImage(this.shadowElement, m, d);
      }
    let c = a.getImageData(0, 0, this.width, this.height);
    return this._colorize(c.data, this.gradient), a.putImageData(c, 0, 0), this;
  }
  /**获取该值所在的颜色 */
  getColorByValue(t) {
    if (t === this.invalid || t === void 0 || t === null) return "rgba(0,0,0,0)";
    let e = this.options, a = e.mosaicColor || [], r = e.mosaicValue || [];
    for (let o = 0, l = r.length; o < l; o++) {
      let u = r[o];
      if (t < u) return a[o];
    }
    return a[a.length - 1];
  }
  /**生成单个的阴影半径(圆形) 
   * @param r 半径
   * @param blur 模糊度
  */
  genShadowRadius(t, e = 15) {
    let a = ht.createCanvas(), r = a.getContext("2d"), o = t + e;
    return a.width = a.height = o * 2, r.shadowOffsetX = r.shadowOffsetY = o * 2, r.shadowBlur = e, r.shadowColor = "black", r.beginPath(), r.arc(-o, -o, t, 0, Math.PI * 2, !0), r.closePath(), r.fill(), a;
  }
  /**构建渐变色 */
  genGradient(t) {
    let e = ht.createCanvas(), a = e.getContext("2d"), r = a.createLinearGradient(0, 0, 0, 256);
    e.width = 1, e.height = 256;
    for (var o in t) r.addColorStop(+o, t[o]);
    return a.fillStyle = r, a.fillRect(0, 0, 10, 256), this.gradient = a.getImageData(0, 0, 1, 256).data, e;
  }
  /**填充颜色 */
  _colorize(t, e) {
    for (var a = 0, r = t.length, o; a < r; a += 4)
      o = t[a + 3] * 4, o && (t[a] = e[o], t[a + 1] = e[o + 1], t[a + 2] = e[o + 2]);
  }
}
class v0 extends $r {
  constructor(t, e) {
    super(t, e), this.iconResolver = (a) => {
      const o = [(a < 0.3 ? 0 : a < 1.6 ? 1 : a < 3.4 ? 2 : a < 5.5 ? 3 : a < 8 ? 4 : a < 10.8 ? 5 : a < 13.9 ? 6 : a < 17.2 ? 7 : a < 20.8 ? 8 : a < 24.5 ? 9 : a < 28.5 ? 10 : a < 32.7 ? 11 : 12) + 2, 1], { url: l, size: u, sizeo: c } = this.options;
      return {
        url: l,
        size: u,
        sizeo: c,
        posX: o[0] * (u[0] + 1),
        posY: o[1] * (u[1] + 1)
      };
    }, this.options = {
      url: "/assets/icons/icon-28.png",
      size: [28, 28],
      sizeo: [28, 28],
      zooMsize: [
        [6, 6],
        [6, 6],
        [6, 6],
        [6, 6],
        [8, 8],
        [8, 8],
        //0-5
        [12, 12],
        [16, 16],
        [22, 22],
        [28, 28],
        [28, 28],
        [28, 28],
        //6-11
        [32, 32],
        [32, 32],
        [32, 32],
        [32, 32],
        [32, 32],
        [32, 32],
        [32, 32],
        [32, 32],
        [32, 32],
        [32, 32],
        [32, 32],
        [32, 32]
      ],
      pane: "windPane"
    }, this.draw = new gs(this.map, this.canvas), this.options = { ...this.options, ...e };
  }
  /**设置图标解析器 */
  setIconResolver(t) {
    return this.iconResolver = t, this;
  }
  /**设置风速风向数据 */
  setData(t) {
    this._setDatas(t), this.renderFixedData();
  }
  /**获取视图范围内的(指定像素间隔的数据) */
  getViewBoundsGridWind(t, e = 2) {
    var a = [];
    let [r, o] = mt(this.map, [0, 0]), l = o % e, u = r % e;
    for (let d = l, g = t.height; d < g; d += e)
      for (let m = u; m <= t.width; m += e) {
        let [p, y] = Ft(this.map, [m, d]);
        if (isFinite(y)) {
          var c = this.interpolate(y, p);
          c && a.push({ latlng: [p, y], speed: c[0], direction: c[1] });
        }
      }
    return a;
  }
  /**根据风力等级获取图片裁剪地址 x,y */
  renderAnimation() {
  }
  renderFixedData() {
    var t = yi(this.map);
    let e = this.getViewBoundsGridWind({ x: 10, y: 10, width: t.w, height: t.h }, 60), a = this.options, r = 1, o = [];
    for (let l = 0; l < e.length; ) {
      const u = e[l];
      l = l + r;
      const c = this.iconResolver(u.speed);
      o.push({
        url: c.url,
        size: c.size || a.size,
        sizeo: c.sizeo,
        posX: c.posX,
        posY: c.posY,
        latlng: u.latlng,
        rotate: u.direction
      });
    }
    this.draw.setAllImgs(o), this.draw.drawMapAll();
  }
}
class y0 extends $r {
  constructor(t, e) {
    super(t, e), this.boundsDatas = [];
  }
  setOptions(t) {
    Object.assign(this.options, t);
  }
  /**设置渲染数据 */
  setData(t) {
    this._setDatas(t), this.renderStart();
  }
  getInfoByLngLat(t, e) {
    return this.interpolate(t, e);
  }
  /**渲染开始 */
  renderStart() {
    const { w: t, h: e } = yi(this.map);
    this.interpolateFieldByWorker({ x: 0, y: 0, width: t, height: e });
  }
  renderFixedData() {
    this.renderStart();
  }
}
class u0 {
  constructor(t) {
    this.options = {
      minVelocity: 0,
      maxVelocity: 1,
      velocityScale: 1,
      particleAge: 90,
      lineWidth: 1,
      particleMultiplier: 1 / 300,
      frameRate: 30,
      defualtColorScale: [
        "rgb(36,104, 180)",
        "rgb(60,157, 194)",
        "rgb(128,205,193 )",
        "rgb(151,218,168 )",
        "rgb(198,231,181)",
        "rgb(238,247,217)",
        "rgb(255,238,159)",
        "rgb(252,217,125)",
        "rgb(255,182,100)",
        "rgb(252,150,75)",
        "rgb(250,112,52)",
        "rgb(245,64,32)",
        "rgb(237,45,28)",
        "rgb(220,24,32)",
        "rgb(180,0,35)"
      ],
      data: []
    }, this.PARTICLE_REDUCTION = Math.pow(window.devicePixelRatio, 1 / 3) || 1.6, this.OPACITY = 0.97, this.NULL_WIND_VECTOR = [NaN, NaN, null], this.grid = [], this.allThreatIds = [], this.canvas = t.canvas, this.setOptions(t);
  }
  /**设置自身参数 */
  setOptions(t) {
    t = Object.assign(this.options, t), this.map = t.map, this.MIN_VELOCITY_INTENSITY = t.minVelocity, this.MAX_VELOCITY_INTENSITY = t.maxVelocity, this.VELOCITY_SCALE = t.velocityScale * (Math.pow(window.devicePixelRatio, 1 / 3) || 1), this.MAX_PARTICLE_AGE = t.particleAge, this.PARTICLE_LINE_WIDTH = t.lineWidth, this.PARTICLE_MULTIPLIER = t.particleMultiplier, this.FRAME_RATE = t.frameRate, this.FRAME_TIME = 1e3 / this.FRAME_RATE, this.OPACITY = 0.98, this.colorScale = t.colorScale || t.defualtColorScale, this.NULL_WIND_VECTOR = [NaN, NaN, null], this.gridData = t.data, t.hasOwnProperty("opacity") && (this.OPACITY = +t.opacity);
  }
  /**设置数据 */
  setData(t) {
    this.gridData = t;
  }
  /**停止运行 */
  stop() {
    this.field && this.field.release(), this.animationLoop && cancelAnimationFrame(this.animationLoop);
  }
  /**开始运行
   * @param width 画布宽度
   * @param height 画布高度
   * @param extent 可视的经纬度范围
   */
  start(t, e, a) {
    this.stop(), console.time("start");
    var r = {
      south: this.deg2rad(a[0][1]),
      north: this.deg2rad(a[1][1]),
      east: this.deg2rad(a[1][0]),
      west: this.deg2rad(a[0][0]),
      width: t,
      height: e
    };
    let o = {
      x: 0,
      y: 0,
      xMax: t,
      yMax: e - 1,
      width: t,
      height: e
    };
    this.buildGrid(this.gridData), this.interpolateField(o, r), console.timeEnd("start");
  }
  /**构建网格数据 */
  buildGrid(t) {
    t.length < 2 && console.log("Windy Error: data must have at least two components (u,v)");
    let e = this.createBuilder(t);
    var a = e.header;
    this.lng0 = a.lo1, this.lat0 = a.la1;
    let r = this.Δlng = a.dx;
    this.Δlat = a.dy;
    let o = a.nx, l = a.ny, u = new Date(a.refTime);
    u.setHours(u.getHours() + a.forecastTime);
    let c = this.grid = [];
    for (var d = 0, g = Math.floor(o * r) >= 360, m = 0; m < l; m++) {
      for (var p = [], y = 0; y < o; y++, d++)
        p[y] = e.data(d);
      g && p.push(p[0]), c[m] = p;
    }
  }
  /**创建构造器 */
  createBuilder(t) {
    let e = t[0], a = t[1];
    t[2];
    let r = e.data, o = a.data;
    return {
      header: e?.header,
      data: function(l) {
        return [r[l], o[l]];
      }
    };
  }
  /**grid 数据，以及获得指定经纬度数据的方法interpolate
   * @param bounds  可视区域的像素范围
   * @param extent  数据地图的经纬度范围
   */
  interpolateField(t, e) {
    var a = (e.south - e.north) * (e.west - e.east), r = this.VELOCITY_SCALE * Math.pow(a, 0.4) * 0.01, o = [];
    t.x, this.allThreatIds.forEach((u) => {
      cancelIdleCallback(u);
    }), this.allThreatIds = [];
    for (let u = t.x, c = t.width; u < c; u += 2) {
      let d = [];
      const g = requestIdleCallback(() => {
        for (let p = t.y; p <= t.yMax; p += 2) {
          let [y, M] = Ft(this.map, [u, p]);
          if (isFinite(M)) {
            var m = this.interpolate(M, y);
            m && (m = this.distort(M, y, u, p, r, m), d[p + 1] = d[p] = m);
          }
        }
        o[u + 1] = o[u] = d;
      });
      this.allThreatIds.push(g);
    }
    let l = this.field = new c0(o, t, this.NULL_WIND_VECTOR);
    this.animate(t, l);
  }
  /**获得指定经纬度的数据信息
   * @param lng 经度
   * @param lat 纬度
   * @return [ 计算得到的开始值S , 计算的到的结束值E, sqrt(S*S+E*E) ]
   */
  interpolate(t, e) {
    if (!this.grid) return null;
    let a = this.grid, r = this.lng0, o = this.Δlng, l = this.Δlat, u = this.lat0, c = this.floorMod(t - r, 360) / o, d = (u - e) / l, g = Math.floor(c), m = g + 1, p = Math.floor(d), y = p + 1;
    var M;
    if (M = a[p]) {
      let E = M[g], A = M[m];
      if (this.isValue(E) && this.isValue(A) && (M = a[y])) {
        var w = M[g], P = M[m];
        if (this.isValue(w) && this.isValue(P))
          return this.bilinearInterpolateVector(c - g, d - p, E, A, w, P);
      }
    }
    return null;
  }
  /**根据网格数据构建虚拟数值
   * @param x 指定经度的X数值相对最近的低位整数坐标的差值 [0,1)
   * @param y 指定纬度的Y数值相对最近的低位整数坐标的差值 [0,1)
   * @param g00 该经纬度所在的网格的左上角的风速信息
   * @param g10 该经纬度所在的网格的右上角的风速信息
   * @param g01 该经纬度所在的网格的左下角的风速信息
   * @param g11 该经纬度所在的网格的右下角的风速信息
   * @returns [ 计算得到的开始值S , 计算的到的结束值E, 平均速度 ]
   */
  bilinearInterpolateVector(t, e, a, r, o, l) {
    let u = 1 - t, c = 1 - e, d = u * c, g = t * c, m = u * e, p = t * e, y = a[0] * d + r[0] * g + o[0] * m + l[0] * p, M = a[1] * d + r[1] * g + o[1] * m + l[1] * p;
    return [y, M, Math.sqrt(y * y + M * M)];
  }
  /**根据地图的缩放级别调整粒子的大小
   * @param λ 经度
   * @param φ 纬度
   * @param x 像素点X
   * @param y 像素点Y
   * @param scale 风速刻度
   * @param wind 风速信息 [计算得到的开始值S , 计算的到的结束值E, sqrt(S*S+E*E) ]
   * @returns
   */
  distort(t, e, a, r, o, l) {
    let u = l[0] * o, c = l[1] * o, d = this.distortion(t, e, a, r);
    return l[0] = d[0] * u + d[2] * c, l[1] = d[1] * u + d[3] * c, l;
  }
  /**单个经纬度值跨越的像素点数量级
   * @param lng 经度
   * @param lat 纬度
   * @param x 像素点X
   * @param y 像素点Y
   * @returns
   */
  distortion(t, e, a, r) {
    let o = 5, l = t < 0 ? o : -o, u = e < 0 ? o : -o, c = this.project(e, t + l), d = this.project(e + u, t);
    var g = Math.cos(e / 360 * 2 * Math.PI);
    return [
      (c[0] - a) / l / g,
      0,
      //(pλ[1] - y) / hλ / k,
      0,
      //(pφ[0] - x) / hφ,
      (d[1] - r) / u
    ];
  }
  /**根据经纬度获得像素点 */
  project(t, e) {
    let [a, r] = mt(this.map, [t, e]);
    return [a, r];
  }
  /**动画 */
  animate(t, e) {
    var a = this.colorScale, r = a.map(function() {
      return [];
    }), o = Math.round(t.width * t.height * this.PARTICLE_MULTIPLIER);
    this.isMobile() && (o *= this.PARTICLE_REDUCTION);
    var l = `rgba(0, 0, 0, ${this.OPACITY})`;
    let u = [];
    for (var c = 0; c < o; c++)
      u.push(
        e.randomize({
          age: Math.floor(Math.random() * this.MAX_PARTICLE_AGE) + 0,
          x: 0,
          y: 0
        })
      );
    let d = () => {
      r.forEach((M) => {
        M.length = 0;
      }), u.forEach((M) => {
        M.age > this.MAX_PARTICLE_AGE && (e.randomize(M).age = 0);
        let w = M.x, P = M.y, E = e.run(w, P), A = E[2];
        if (A === null)
          M.age = this.MAX_PARTICLE_AGE;
        else {
          let T = w + E[0], G = P + E[1];
          if (e.run(T, G)[2] !== null) {
            M.xt = T, M.yt = G;
            let R = this.windColorIndexBySpeed(A);
            r[R].push(M);
          } else
            M.x = T, M.y = G;
        }
        M.age += 1;
      });
    };
    var g = this.canvas.getContext("2d");
    g.lineWidth = this.PARTICLE_LINE_WIDTH, g.globalAlpha = 0.6;
    let m = () => {
      g.globalCompositeOperation = "destination-over", g.fillStyle = "rgba(0, 0, 0, 0.15)", g.fillRect(t.x, t.y, t.width, t.height), g.globalCompositeOperation = "destination-in", g.fillStyle = l, g.fillRect(t.x, t.y, t.width, t.height), g.globalCompositeOperation = "lighter", g.globalAlpha = this.OPACITY === 0 ? 0 : this.OPACITY * 0.9, r.forEach((M, w) => {
        M.length > 0 && (g.beginPath(), g.strokeStyle = a[w], M.forEach((P) => {
          g.moveTo(P.x, P.y), g.lineTo(P.xt, P.yt), P.x = P.xt, P.y = P.yt;
        }), g.stroke());
      });
    };
    var p = Date.now();
    let y = () => {
      this.animationLoop = requestAnimationFrame(y);
      var M = Date.now(), w = M - p;
      w > this.FRAME_TIME && (p = M - w % this.FRAME_TIME, d(), m());
    };
    y();
  }
  /**根据风速得到所属颜色层级 */
  windColorIndexBySpeed(t) {
    let e = this.colorScale.length, a = this.MIN_VELOCITY_INTENSITY, r = this.MAX_VELOCITY_INTENSITY;
    return Math.max(0, Math.min(e - 1, Math.round((t - a) / (r - a) * (e - 1))));
  }
  /**将经纬度转换为弧度  180 = Math.PI */
  deg2rad(t) {
    return t / 180 * Math.PI;
  }
  /**针对经纬度特殊的取余数方法
   * 小于等于n的数字若a小于0，返回 2n+a ， -365  => 2n-365
   */
  floorMod(t, e) {
    return t - e * Math.floor(t / e);
  }
  isValue(t) {
    return t != null;
  }
  /**判断是否是移动端 */
  isMobile() {
    return /android|blackberry|iemobile|ipad|iphone|ipod|opera mini|webos/i.test(navigator.userAgent);
  }
}
class c0 {
  constructor(t, e, a) {
    this.columns = t, this.bounds = e, this.NULL_WIND_VECTOR = a || [NaN, NaN, null];
  }
  /**释放内存 */
  release() {
    this.columns = [];
  }
  /**获取随机的  x , y 有数据的点(一个糟糕的未完成方法)*/
  randomize(t) {
    let e, a, r = 0;
    do
      e = Math.round(Math.floor(Math.random() * this.bounds.width) + this.bounds.x), a = Math.round(Math.floor(Math.random() * this.bounds.height) + this.bounds.y);
    while (this.run(e, a)[2] === null && r++ < 30);
    return t.x = e, t.y = a, t;
  }
  /**获取指定像素点的数据 */
  run(t, e) {
    var a = this.columns[Math.round(t)];
    return a && a[Math.round(e)] || this.NULL_WIND_VECTOR;
  }
}
class M0 extends Vt {
  constructor(t, e) {
    super(t, e), this.options = {
      pane: "overlayPane",
      displayValues: !0,
      unit: "m/s",
      angleConvention: "bearingCCW",
      emptyString: "No velocity data",
      maxVelocity: 15,
      colorScale: null
    }, this.windy = null, Object.assign(this.options, e);
  }
  /**设置配置项 */
  setOptions(t) {
    let e = this.options = Object.assign(this.options, t);
    this.windy && (this.windy.setOptions(e), e.hasOwnProperty("data") && this.windy.setData(e.data));
  }
  /**设置数据并绘制canvas
   * data[0] 为X轴经度longitude方向的数据
   * data[1] 为Y轴纬度latitude方向的数据
   */
  setData(t) {
    if (this.options.data = t, this.windy)
      this.windy.setData(t);
    else {
      if (this.initWindy(), !t || t.length <= 0) {
        this.windy?.stop(), this.resetCanvas();
        return;
      }
      this.startWindy();
    }
  }
  /**添加鼠标点击时的回调函数 */
  addCbMouseClick(t) {
    this.cbClick = t;
  }
  /*------------------------------------ PRIVATE ------------------------------------------*/
  renderFixedData() {
    let t = this.options.data;
    t && t.length > 0 && this.windy && (this.windy.stop(), this.startWindy());
  }
  /**添加或关闭地图特定的监听事件(_eventSwitch事件后自动调用) */
  addMapEvents(t, e) {
    t[e]("zoomstart", this.stopWindy, this), t[e]("dragstart", this.stopWindy, this), t[e]("click", this.onMouseClick, this);
  }
  /**初始化windy对象 */
  initWindy() {
    var t = Object.assign({
      canvas: this.canvas,
      map: this.map
    }, this.options);
    this.windy = new u0(t), this.canvas.classList.add("velocity-overlay");
  }
  /**开始动画 */
  startWindy() {
    const t = yi(this.map), { lngLeft: e, latTop: a, lngRight: r, latBottom: o } = gn(this.map);
    var l = [e, o], u = [r, a];
    this.windy?.start(
      t.w,
      t.h,
      [l, u]
    );
  }
  /**停止动画 */
  stopWindy() {
    this.windy && this.windy.stop();
  }
  /**鼠标点击事件监听 */
  onMouseClick(t) {
    if (!this.windy) return;
    var e = this;
    const { containerPoint: a } = ki(t, this.type);
    var [r, o] = Ft(this.map, [a.x, a.y]), l = this.windy.interpolate(o, r);
    let u = 0, c = 0;
    l && !isNaN(l[0]) && !isNaN(l[1]) && l[2] && (u = e.vectorToDegrees(l[0], l[1], this.options.angleConvention), c = e.vectorToSpeed(l[0], l[1], this.options.unit)), this.cbClick?.(u, c), console.log(u, c);
  }
  vectorToDegrees(t, e, a) {
    a.endsWith("CCW") && (e = e > 0 ? e = -e : Math.abs(e));
    var r = Math.sqrt(Math.pow(t, 2) + Math.pow(e, 2)), o = Math.atan2(t / r, e / r), l = o * 180 / Math.PI + 180;
    return (a === "bearingCW" || a === "meteoCCW") && (l += 180, l >= 360 && (l -= 360)), l;
  }
  /**将m/s 转换为指定单位的速度 */
  vectorToSpeed(t, e, a) {
    var r = Math.sqrt(Math.pow(t, 2) + Math.pow(e, 2));
    switch (a) {
      case "k/h":
        return this.meterSec2kilometerHour(r);
      case "kt":
        return this.meterSec2Knots(r);
      default:
        return r;
    }
  }
  meterSec2Knots(t) {
    return t / 0.514;
  }
  meterSec2kilometerHour(t) {
    return t * 3.6;
  }
}
class w0 extends Vt {
  constructor(t, e) {
    super(t, e), this._allHeats = [], this.heatDatas = [], this.options = {
      pane: "canvas",
      className: "heat",
      radius: 20,
      blur: 10,
      minOpacity: 0.1,
      gradientIndex: 1,
      ifTip: !0,
      tipX: 80,
      tipY: 20,
      gradient: {
        0.2: "blue",
        0.4: "cyan",
        0.6: "lime",
        0.8: "yellow",
        1: "red"
      }
    }, this.setOptions(e);
  }
  renderAnimation() {
    this.heatDatas = this.computeHeatData(), this.resetCanvas(), this.drawByheatData(), this.options && this.options.ifTip && this._addGradient(this.computeZoomGradient());
  }
  /**重置[纬度，经度]集合*/
  setAllHeats(t) {
    return this._allHeats = t, this._redraw();
  }
  /**添加[纬度，经度],并重绘*/
  addHeat(t) {
    return this._allHeats.push(t), this._redraw();
  }
  delHeat(t) {
    return ti(this._allHeats, t), this._redraw();
  }
  /**更新配置 */
  setOptions(t) {
    return V.setOptions(this, t), this._updateOptions(), this._redraw();
  }
  _updateOptions() {
    this.genShadowRadius(this.options.radius, this.options.blur), this.options.gradient && this.genGradient(this.options.gradient);
  }
  /**计算热力图数据 */
  computeHeatData() {
    let t = this.map;
    if (!t)
      return [];
    let e = this._r, a = yi(t), r = V.point([a.w, a.h]), o = new V.Bounds(V.point([-e, -e]), r.add([e, e])), l = this.computeZoomGradient(), u = 1 / l, c = e / 2, d = [], g = t?._getMapPanePos?.() || { x: 0, y: 0 }, m = g.x % c, p = g.y % c, y, M, w, P, E, A, T, G;
    for (y = 0, M = this._allHeats.length; y < M; y++) {
      let Z = this._allHeats[y], X = mt(this.map, Z.latlng);
      if (o.contains(X)) {
        P = Math.floor((X[0] - m) / c) + 2, E = Math.floor((X[1] - p) / c) + 2;
        var R = Z.weight !== void 0 ? Z.weight : 1;
        G = R * u, d[E] = d[E] || [], w = d[E][P], w ? (w[0] = (w[0] * w[2] + X[0] * G) / (w[2] + G), w[1] = (w[1] * w[2] + X[1] * G) / (w[2] + G), w[2] += G) : d[E][P] = [X[0], X[1], G];
      }
    }
    let z = [];
    for (y = 0, M = d.length; y < M; y++)
      if (d[y])
        for (A = 0, T = d[y].length; A < T; A++)
          w = d[y][A], w && z.push([
            Math.round(w[0]),
            Math.round(w[1]),
            Math.min(w[2], 1)
          ]);
    return z;
  }
  /**计算最高变色需要的数值 */
  computeZoomGradient() {
    let t = this.options.gradientIndex, e = this.map.getZoom();
    return Math.pow(2, Math.min(12, Math.atan(Math.PI / 8 / e) * 100 * t | 0));
  }
  /**添加等级标识 */
  _addGradient(t) {
    let e = this.ctx, a = this.options.tipX, r = this.options.tipY;
    e.globalAlpha = 0.5, e.drawImage(this._gradEl, a, r, 20, 128), e.fillText("0", a + 25, r), e.fillText(t, a + 25, r + 128);
  }
  /**根据数据重绘制热力图 */
  drawByheatData() {
    let t = this.ctx;
    this._circleShadow || this.genShadowRadius(this.options.radius), this._grad || this.genGradient(this.options.gradient);
    let e = this.options.minOpacity || 0.05;
    for (var a = 0, r = this.heatDatas.length, o; a < r; a++)
      o = this.heatDatas[a], t.globalAlpha = Math.min(Math.max(o[2], e), 1), t.drawImage(this._circleShadow, o[0] - this._r, o[1] - this._r);
    var l = t.getImageData(0, 0, this.width, this.height);
    return this._colorize(l.data, this._grad), t.putImageData(l, 0, 0), this;
  }
  /**生成单个的阴影半径 */
  genShadowRadius(t, e = 15) {
    let a = this._circleShadow = ht.createCanvas(), r = a.getContext("2d"), o = this._r = t + e;
    a.width = a.height = o * 2, r.shadowOffsetX = r.shadowOffsetY = o * 2, r.shadowBlur = e, r.shadowColor = "black", r.beginPath(), r.arc(-o, -o, t, 0, Math.PI * 2, !0), r.closePath(), r.fill();
  }
  /**创建渐变色 */
  genGradient(t) {
    let e = this._gradEl = ht.createCanvas(), a = e.getContext("2d"), r = a.createLinearGradient(0, 0, 0, 256);
    e.width = 1, e.height = 256;
    for (var o in t)
      r.addColorStop(+o, t[o]);
    return a.fillStyle = r, a.fillRect(0, 0, 10, 256), this._grad = a.getImageData(0, 0, 1, 256).data, this;
  }
  /**填充颜色 */
  _colorize(t, e) {
    for (var a = 0, r = t.length, o; a < r; a += 4)
      o = t[a + 3] * 4, o && (t[a] = e[o], t[a + 1] = e[o + 1], t[a + 2] = e[o + 2]);
  }
}
class x0 extends Vt {
  constructor(t, e) {
    super(t, e), this.isDrag = !1, this.arrowLine = new s0(t, this.ctx, e);
  }
  setAllLines(t) {
    this.arrowLine.setAllLines(t);
  }
  renderFixedData() {
    this.arrowLine.update();
  }
  renderAnimation(t) {
    this.resetCanvas(), this.arrowLine.draw(), this.flagAnimation && cancelAnimationFrame(this.flagAnimation), this.flagAnimation = requestAnimationFrame((e) => {
      this.isDrag || this.renderAnimation(e);
    });
  }
  /**拖拽不允许更新动画 */
  addMapEvents(t, e) {
    t[e]("dragstart", this.drawEnd, this), t[e]("movestart", this.drawEnd, this), t[e]("moveend", this.drawStart, this);
  }
  drawStart() {
    this.isDrag = !1;
  }
  drawEnd() {
    this.isDrag = !0;
  }
}
class P0 extends Ee {
  constructor(t, e) {
    super(t, e), this.rbush = new Pr(), this.rbushData = [], this.bigDataImgs = [], this._renderBigDataImgs = [], this.resetRbush = () => {
      this.rbush && this.rbush.clear(), this.rbushData = [], this.bigDataImgs.forEach((a) => {
        this.transformRbush(a);
      }), this.rbush.load(this.rbushData);
    }, this.bigDataOption = e;
  }
  get renderBigDataList() {
    return this._renderBigDataImgs;
  }
  /**绘制大量图标 rbush筛选重叠优化 */
  setbigDataImgs(t) {
    this.rbush.clear(), this.rbushData = [], this.bigDataImgs = t, this.rbushData = t.map((e) => (this._draw.transformImageSize(e), this.transformRbush(e))), this.rbush.load(this.rbushData);
  }
  /**
   * 将画布划分为多个矩形
   * 矩形内限制最大重叠图形，超出不绘制
   */
  handleOverlapImage() {
    const t = this, { canvas: e, rbush: a, ctx: r, _draw: o, map: l } = t, u = l.getZoom(), { width: c, height: d } = e, { minBound: g = [c, d], maxCount: m } = this.getZoomOption(u), [p, y] = g, M = /* @__PURE__ */ new Set();
    for (let w = 0; w < c; w += p / 2)
      for (let P = 0; P < d; P += y / 2) {
        const E = [w + p / 2, P + y / 2];
        a.search({
          minX: E[0] - p / 2,
          minY: E[1] - y / 2,
          maxX: E[0] + p / 2,
          maxY: E[1] + y / 2
        }).forEach((T, G) => {
          const { data: R } = T;
          (G < m || m == -1) && !M.has(R) && (o.transformXY(R), M.add(R), Di.drawImg(R, r), this._renderBigDataImgs.push(R));
        });
      }
  }
  /**
   * 根据图层缩放 获取配置
   * @param zoom
   * @returns
   */
  getZoomOption(t) {
    const e = this, { bigDataOption: a } = e, { zoomOption: r } = a;
    if (r[t]) return r[t];
    const o = Object.keys(r).map((u) => Number(u)).sort((u, c) => Number(u) - Number(c)), l = o.length;
    for (let u = 0; u < l - 1; u++)
      if (t > o[u] && t < o[u + 1])
        return r[o[u]];
    return r[o[l - 1]];
  }
  /**图片转化为rbush数据格式 */
  transformRbush(t) {
    const { latlng: e, size: a = [0, 0], left: r = 0, top: o = 0 } = t;
    let l = a[0], u = a[1], [c, d] = mt(this.map, e);
    return {
      minX: c - l / 2 + r,
      minY: d - u / 2 + o,
      maxX: c + l / 2 + r,
      maxY: d + u / 2 + o,
      data: t
    };
  }
  /**绘制所有需要绘制的类 */
  drawMapAll() {
    return console.time("start"), this._renderBigDataImgs = [], this._draw.drawMapAll(), this.handleOverlapImage(), console.timeEnd("start"), this;
  }
}
function f0(s, t = 2, e = 0) {
  let a = s * Math.pow(10, t);
  return a = e == 0 ? Math.round(a) : e == 1 ? Math.floor(a) : Math.ceil(a), a / Math.pow(10, t);
}
function d0(s, t, e, a) {
  const [r, o] = t, [l, u] = a, [c, d] = e, g = s;
  let m = (1 - g) * (1 - g) * r + 2 * g * (1 - g) * l + g * g * c, p = (1 - g) * (1 - g) * o + 2 * g * (1 - g) * u + g * g * d;
  return [m, p];
}
class b0 extends Vt {
  constructor(t, e) {
    super(t, e), this.isDrag = !1, this._allParticle = [];
  }
  /**设置所有粒子数据 */
  setAllParticles(t) {
    this._allParticle = t, this._redraw();
  }
  renderAnimation(t) {
    this.resetCanvas(), this._allParticle.forEach((e) => {
      e.curPoints = [], e.curve = [];
      let a = e.points = pn(this.map, e.latlngs) || [];
      for (let r = 0, o = a.length; r < o - 1; r++) {
        const l = a[r], u = a[r + 1];
        let c = ht.getBezierCtrlPoint(l, u, e.degree);
        e.curve.push(c);
      }
    }), this._drawParticles(), this.flagAnimation && cancelAnimationFrame(this.flagAnimation), this.flagAnimation = requestAnimationFrame((e) => {
      this.isDrag || this.renderAnimation(e);
    });
  }
  _animat() {
    this.flagAnimation = requestAnimationFrame(() => {
      this._animat();
    }), this._drawParticles();
  }
  /**绘制粒子效果 */
  _drawParticles() {
    let t = this._allParticle, e = this.ctx;
    e.globalCompositeOperation = "source-over", t.forEach((a) => {
      a.showParticle !== !1 && (e.strokeStyle = a.colorParticle || "white", e.fillStyle = a.colorParticle || "white", e.shadowColor = a.colorParticle || "white", e.shadowBlur = 5, this.genCurBezierPoints(a), this.drawParticle(a));
    });
  }
  /**获取当前贝塞尔曲线的粒子点位 */
  genCurBezierPoints(t) {
    let { points: e = [], index: a = 0, dense: r = 1 } = t, o = a + 1;
    if (e.length < 2) return;
    o >= e.length && (a = 0, o = 1, t.index = 0, t.curPoints = void 0, t.age = 0);
    let l = t.curPoints, u = e[a], c = e[o], d = u, g = c, m = t.curve[a];
    (!l || l.length < 2) && (l = [d, d]);
    let p = g[0] - d[0], y = g[1] - d[1], M = Math.sqrt(p * p + y * y), w = 1 / (r * M), P = t.speed || 1e-3;
    P = P > 0.1 ? P / M : P;
    let E = t.length || 0.03, A = (E > 0.1 ? E : E * M) * r, T = (t.age || 0) + P, G = [];
    T = T > 1 ? 1 : T;
    for (let R = 0; R < A; R++) {
      let z = T - w * R;
      if (z < 0)
        break;
      z = z > 0 ? z : 0;
      let Z = d0(z, d, g, m);
      G.push(Z);
    }
    T == 1 && (t.index = ++a, T = 0), t.age = T, t.curPoints = G;
  }
  /**绘制粒子 */
  drawParticle(t) {
    var e = this.ctx;
    let a = t.curPoints || [];
    for (let r = 0, o = a.length; r < o; r++) {
      let l = a[r], u = (1 - r / o) * (1 / 2);
      e.globalAlpha = r == 0 ? 1 : u, e.beginPath(), e.arc(l[0], l[1], 1, 0, 2 * Math.PI, !1), e.stroke(), e.fill();
    }
  }
  /**拖拽不允许更新动画 */
  addMapEvents(t, e) {
    t[e]("dragstart", this.drawEnd, this), t[e]("movestart", this.drawEnd, this), t[e]("moveend", this.drawStart, this);
  }
  drawStart() {
    console.log("drawStart"), this.isDrag = !1;
  }
  drawEnd() {
    console.log("drawEnd"), this.isDrag = !0;
  }
}
class E0 extends Vt {
  constructor(t, e) {
    super(t, e), this.isDrag = !1, this.canvasRadar = new n0(t, this.ctx);
  }
  /**重设雷达绘制类 */
  setAllRadars(t) {
    return this.canvasRadar.setAllRadars(t), this;
  }
  /**添加雷达绘制类 */
  addRadar(t) {
    return this.canvasRadar.addRadar(t), this;
  }
  renderFixedData() {
  }
  renderAnimation(t) {
    this.resetCanvas(), this.canvasRadar.drawRadarStatic(), this.canvasRadar.drawRadarAmi(t), this.flagAnimation && cancelAnimationFrame(this.flagAnimation), this.flagAnimation = requestAnimationFrame((e) => {
      this.isDrag || this.renderAnimation(e);
    });
  }
  /**拖拽不允许更新动画 */
  addMapEvents(t, e) {
    t[e]("dragstart", this.drawEnd, this), t[e]("movestart", this.drawEnd, this), t[e]("moveend", this.drawStart, this);
  }
  drawStart() {
    console.log("drawStart"), this.isDrag = !1;
  }
  drawEnd() {
    console.log("drawEnd"), this.isDrag = !0;
  }
}
class S0 extends Vt {
  constructor(t, e) {
    super(t, e), this.options = {}, this.info = { zoom: 0 }, this.mapType = ms(this.map), this.setLatlng = (a) => {
      const r = this.getLatLngFromEvent(a);
      r && (this.latLng = { lat: r[0], lng: r[1] }, this.info.lat = this.getLatlng(r[0], !1), this.info.lng = this.getLatlng(r[1], !0), this.cb && this.cb(this.info));
    }, Object.assign(this.options, {
      precision: 4,
      pointerEvents: "none"
    }, e), this.eventSwitch(!0);
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
    let e = t ? "on" : "off";
    t && this.eventSwitch(!1), this.map[e]("mousemove", (a) => this.setLatlng(a)), this.map[e]("zoomend", () => this.setZoomAndScale());
  }
  getLatlng(t, e) {
    let a = "N";
    if (t < 0 && (a = "S"), e) {
      for (a = "E"; t < 0; )
        t = t + 360;
      t = t % 360, t > 180 && (a = "W", t = 360 - t);
    }
    if (t = Math.abs(t), !this.options.ifTran) return f0(t, this.options.precision ?? 5) + "°" + a;
    let r = t % 1 * 60, o = (r % 1 * 60).toFixed(2), l = Math.floor(t);
    return r = Math.floor(r), `${l}°${r}'${o}"${a}`;
  }
  setZoomAndScale() {
    if (!this.map) return;
    this.info.zoom = this.getZoom();
    const t = gn(this.map);
    let e = yi(this.map).w, a = Math.abs(t.lngRight - t.lngLeft), r = (t.latTop + t.latBottom) / 2, o = rs([r, 0], [r, a], this.mapType);
    o = o / e * 50;
    let l = "";
    o > 2e3 ? (o = o / 1852, l = " nm") : l = " m";
    let u = o, c = 1;
    for (; u > 10; )
      c = c * 10, u = Math.ceil(u / 10);
    u = Math.ceil(u) * c, this.info.width = 50 * u / o + "px", this.info.scale = u + l, this.cb && this.cb(this.info);
  }
  getZoom() {
    const t = this.map;
    return typeof t.getZoom == "function" ? t.getZoom() : 0;
  }
  getLatLngFromEvent(t) {
    if (!t) return null;
    if (t.latlng) {
      const { lat: e, lng: a } = t.latlng;
      return [e, a];
    }
    if (t.lnglat) {
      const { lat: e, lng: a } = t.lnglat;
      return [e, a];
    }
    return null;
  }
}
export {
  gs as MapCanvasDraw,
  Me as MapCanvasEvent,
  Vt as MapCanvasLayer,
  x0 as MapPluginArrowLine,
  P0 as MapPluginBigData,
  S0 as MapPluginControl,
  Ee as MapPluginDraw,
  M0 as MapPluginFlow,
  y0 as MapPluginGrid,
  $r as MapPluginGridBase,
  w0 as MapPluginHeat,
  b0 as MapPluginPartial,
  m0 as MapPluginPlot,
  E0 as MapPluginRadar,
  g0 as MapPluginRange,
  p0 as MapPluginTrack,
  v0 as MapPluginWind,
  ht as SLUCanvas,
  bh as SLUCanvasGif,
  Di as SLUCanvasImg,
  Ch as SLUCanvasText,
  _0 as SLUMap,
  u0 as VelocityWindy
};
