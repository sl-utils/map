const gn = class gn {
  /**canvas画布的工具类*/
  constructor() {
  }
  /**绘制小圆点 */
  static drawArc(i, s = this.ctx) {
    if (i.ifHide === !0) return this;
    let { point: a, points: o = [], size: h = 10 } = i;
    a && (o = [...o, a]), this.setCtxPara(s, i);
    for (let l = 0, u = o.length; l < u; l++) {
      s.beginPath();
      const f = o[l];
      s.arc(f[0], f[1], h, 0, 2 * Math.PI, !1), s.stroke(), s.globalAlpha = i.fillAlpha == null ? 1 : i.fillAlpha, s.fill();
    }
    return this.setCtxPara(s), this;
  }
  /**绘制矩形 */
  static drawRect(i, s = this.ctx) {
    if (i.ifHide === !0) return this;
    let { point: a, points: o = [a], width: h = 0, height: l = 0, radius: u = [0, 0, 0, 0] } = i;
    this.setCtxPara(s, i);
    for (let f = 0; f < o.length; f++) {
      let [_, v] = o[f] || [0, 0];
      s.beginPath(), s.roundRect(_, v, h, l, u), s.stroke(), s.globalAlpha = i.fillAlpha == null ? 1 : i.fillAlpha, s.fill(), s.closePath();
    }
    return this.setCtxPara(s), this;
  }
  /**画绘制多边形*/
  static drawPolygon(i, s = this.ctx) {
    let { points: a = [] } = i;
    if (i.ifHide === !0 || a.length < 2) return this;
    this.setCtxPara(s, i);
    for (let o = 0, h = a.length; o < h; o++) {
      let [l, u] = a[o];
      o == 0 ? (s.beginPath(), s.moveTo(l, u)) : o == h - 1 ? (s.lineTo(l, u), s.closePath(), s.globalAlpha = i.fillAlpha == null ? 1 : i.fillAlpha, s.fill(), s.lineWidth > 0 && (s.globalAlpha = i.alpha || 1, s.stroke())) : s.lineTo(l, u);
    }
    return this.setCtxPara(s), this;
  }
  /**画线*/
  static drawLine(i, s = this.ctx) {
    if (i.ifHide === !0) return this;
    let { points: a = [] } = i;
    if (a.length < 2) return this;
    this.setCtxPara(s, i);
    let o = a[0] || [];
    i.widthLine, s.beginPath(), s.moveTo(o[0], o[1]);
    for (let h = 1, l = a.length; h < l; h++) {
      let u = a[h];
      s.lineTo(u[0], u[1]);
    }
    return s.stroke(), this.setCtxPara(s), this;
  }
  /**画贝塞尔曲线*/
  static drawBezierLine(i, s = this.ctx) {
    if (i.ifHide === !0) return this;
    let { points: a = [] } = i;
    if (a.length < 2) return this;
    this.setCtxPara(s, i);
    let o = a[0], h = i.degree;
    s.beginPath(), s.moveTo(o[0], o[1]);
    for (let l = 1, u = a.length; l < u; l++) {
      let f = a[l - 1], _ = a[l], v = this.getBezierCtrlPoint(f, _, h);
      s.quadraticCurveTo(v[0], v[1], _[0], _[1]);
    }
    return s.stroke(), this.setCtxPara(s), this;
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
  static getBezierCtrlPoint(i, s, a = 1) {
    const o = i, h = s, l = [(o[0] + h[0]) / 2, (o[1] + h[1]) / 2], u = a;
    let f = l[0] - o[0], _ = l[1] - o[1], v = Math.sqrt(f * f + _ * _), m = Math.PI / 2 - Math.asin(_ / v), p = u * Math.cos(m) * v, M = u * Math.sin(m) * v * f / Math.abs(f);
    return p = isNaN(p) ? 0 : p, M = isNaN(M) ? 0 : M, [l[0] + p, l[1] - M];
  }
  /**设置画布的相关配置
   * @param fig 画布属性配置
   * @param ctx 2D画布渲染上下文
   */
  static setCtxPara(i, s = {}) {
    return this.ctx = i, this.deletePara(s), s = Object.assign({}, this.ctxFig, s), i.globalAlpha = s.alpha, i.globalCompositeOperation = s.globalCompositeOperation, i.fillStyle = s.colorFill, i.strokeStyle = s.colorLine, i.lineWidth = s.widthLine, i.shadowColor = s.shadowColor, i.shadowBlur = s.shadowBlur, i.font = s.font, i.textBaseline = s.textBaseline, i.setLineDash(s.dash), i.lineDashOffset = s.dashOff, i;
  }
  /**移除掉值为 undefined 或 null 的属性，方便赋值 */
  static deletePara(i = {}) {
    for (const s in i)
      if (Object.prototype.hasOwnProperty.call(i, s)) {
        const a = i[s];
        a == null && Reflect.deleteProperty(i, s);
      }
  }
};
gn.ctxFig = {
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
let kt = gn;
class lh {
  constructor() {
    this.canvasTool = document.createElement("canvas"), this.LAST_DISPOSA_METHOD = null, this.CURRENT_FRAME_INDEX = -1, this.TRANSPARENCY = null, this.gifCache = {}, this.aniIds = {}, this.opts = [];
  }
  /**加载gif并进行缓存 , 避免重复请求 url */
  async loadGIF(i, s) {
    let { url: a } = i, o = this.gifCache[a];
    if (this.CTX = s, o)
      o.status === 1 ? (this.opts.push(i), clearTimeout(this.timeId), this.timeId = setTimeout(() => {
        console.log(this.opts);
        let h = this.opts;
        this.opts = [], h.forEach((l) => this.loadGIF(l, this.CTX));
      }, 100)) : o.status === 2 && (this.stopGif(i), this.playGif(i));
    else {
      this.gifCache[a] = { status: 0, data: null, frameList: [] }, o = this.gifCache[a];
      try {
        o.status = 1;
        const h = await this.fetchGIF(a), l = new uh(h);
        o.status = 2, this.parseHeader(a, l), this.parseBlock(i, l);
      } catch (h) {
        console.error("Error loading GIF:", h);
      }
    }
  }
  fetchGIF(i) {
    return new Promise((s, a) => {
      const o = new XMLHttpRequest();
      o.open("GET", i, !0), "overrideMimeType" in o && o.overrideMimeType("text/plain; charset=x-user-defined"), o.onload = () => {
        if (o.status === 200) {
          const h = o.response;
          h.toString().indexOf("ArrayBuffer") > 0 ? s(new Uint8Array(h)) : s(h);
        } else
          a(new Error("XHR Error - Response"));
      }, o.onerror = () => {
        a(new Error("XHR Error"));
      }, o.send();
    });
  }
  /**解析数据流头部并设置工具canvas的宽高 */
  parseHeader(i, s) {
    let a = s, o = this.gifInfo = /* @__PURE__ */ Object.create(null), h = this.canvasTool;
    if (o.sig = a.read(3), o.ver = a.read(3), o.sig !== "GIF") throw new Error("Not a GIF file.");
    o.width = a.readUnsigned(), o.height = a.readUnsigned();
    let l = this.byteToBitArr(a.readByte());
    o.gctFlag = !!l.shift(), o.colorRes = this.bitsToNum(l.splice(0, 3)), o.sorted = !!l.shift(), o.gctSize = this.bitsToNum(l.splice(0, 3)), o.bgColor = a.readByte(), o.pixelAspectRatio = a.readByte(), o.gctFlag && (o.gct = this.parseCT(1 << o.gctSize + 1, s)), h.width = o.width, h.height = o.height, h.style.width = o.width + "px", h.style.height = o.height + "px", h.getContext("2d").setTransform(1, 0, 0, 1, 0, 0);
  }
  /**解析内容块 */
  parseBlock(i, s) {
    let a = /* @__PURE__ */ Object.create(null), o = s;
    switch (a.sentinel = o.readByte(), String.fromCharCode(a.sentinel)) {
      // For ease of matching
      case "!":
        a.type = "ext", this.parseExt(a, s, i.url);
        break;
      case ",":
        a.type = "img", this.parseImg(a, s, i.url);
        break;
      case ";":
        a.type = "eof", this.playGif(i);
        break;
      default:
        throw new Error("Unknown block: 0x" + a.sentinel.toString(16));
    }
    a.type !== "eof" && this.parseBlock(i, s);
  }
  /**播放gif */
  playGif(i, s = 0) {
    const a = this, { delay: o = 0 } = i, { frameList: h } = a.gifCache[i.url], l = h.length;
    let u;
    const f = (_) => {
      u === void 0 && (u = _), _ - (u || _) >= o && (u = _, s++, s >= l && (s = 0)), a.drawFrame(i, s), a.aniIds[i.id] = requestAnimationFrame(f);
    };
    a.aniIds[i.id] = requestAnimationFrame(f);
  }
  /**绘制每一帧 */
  drawFrame(i, s) {
    const a = this, o = a.CTX;
    let { point: h, points: l = [], size: u = [100, 100], url: f, sizeo: _, posX: v = 0, posY: m = 0, left: p = 0, top: M = 0, rotate: w = 0, alpha: x = 1, delay: S } = i, { frameList: E } = a.gifCache[i.url];
    a.canvasTool.getContext("2d").putImageData(E[s].data, 0, 0);
    let C = a.canvasTool, G = u[0], z = u[1], B = _ && _[0], D = _ && _[1];
    h && (l = [...l, h]);
    for (let W = 0; W < l.length; W++) {
      const et = l[W], Z = et[0], X = et[1];
      w = w * Math.PI / 180, o.globalAlpha = x, o.setTransform(1, 0, 0, 1, Z, X), o.rotate(w), B && D ? o.drawImage(C, v, m, B, D, -G / 2 + p, -z / 2 + M, G, z) : o.drawImage(C, -G / 2 + p, -z / 2 + M, G, z), o.rotate(-w), o.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
  /**关闭之前的定时动画 */
  stopGif(i) {
    const s = this, a = s.aniIds[i.id];
    a && (cancelAnimationFrame(a), s.aniIds[i.id] = null);
  }
  // 解析
  parseExt(i, s, a) {
    let o = s, h = (v) => {
      o.readByte();
      var m = this.byteToBitArr(o.readByte());
      v.reserved = m.splice(0, 3), v.disposalMethod = this.bitsToNum(m.splice(0, 3)), this.LAST_DISPOSA_METHOD = v.disposalMethod, v.userInput = m.shift(), v.transparencyGiven = m.shift(), v.delayTime = o.readUnsigned(), v.transparencyIndex = o.readByte(), v.terminator = o.readByte(), this.pushFrame(v.delayTime, a), this.TRANSPARENCY = v.transparencyGiven ? v.transparencyIndex : null;
    }, l = (v) => {
      v.comment = this.readSubBlocks(s);
    }, u = (v) => {
      o.readByte(), v.ptHeader = o.readBytes(12), v.ptData = this.readSubBlocks(s);
    }, f = (v) => {
      var m = function(M) {
        o.readByte(), M.unknown = o.readByte(), M.iterations = o.readUnsigned(), M.terminator = o.readByte();
      }, p = (M) => {
        M.appData = this.readSubBlocks(s);
      };
      o.readByte(), v.identifier = o.read(8), v.authCode = o.read(3), v.identifier === "NETSCAPE" ? m(v) : p(v);
    }, _ = (v) => {
      v.data = this.readSubBlocks(s);
    };
    switch (i.label = o.readByte(), i.label) {
      case 249:
        i.extType = "gce", h(i);
        break;
      case 254:
        i.extType = "com", l(i);
        break;
      case 1:
        i.extType = "pte", u(i);
        break;
      case 255:
        i.extType = "app", f(i);
        break;
      default:
        i.extType = "unknown", _(i);
        break;
    }
  }
  pushFrame(i, s) {
    let a = this.gifCache[s].frameList;
    this.ctx && a.push({
      delay: i,
      data: this.ctx.getImageData(0, 0, this.gifInfo.width, this.gifInfo.height)
    });
  }
  parseImg(i, s, a) {
    let o = s;
    function h(f, _) {
      let v = new Array(f.length);
      const m = f.length / _;
      function p(C, G) {
        const z = f.slice(G * _, (G + 1) * _);
        v.splice.apply(v, [C * _, _].concat(z));
      }
      const M = [0, 4, 2, 1], w = [8, 8, 4, 2];
      let x = 0;
      for (var S = 0; S < 4; S++)
        for (var E = M[S]; E < m; E += w[S])
          p(E, x), x++;
      return v;
    }
    i.leftPos = o.readUnsigned(), i.topPos = o.readUnsigned(), i.width = o.readUnsigned(), i.height = o.readUnsigned();
    let l = this.byteToBitArr(o.readByte());
    i.lctFlag = l.shift(), i.interlaced = l.shift(), i.sorted = l.shift(), i.reserved = l.splice(0, 2), i.lctSize = this.bitsToNum(l.splice(0, 3)), i.lctFlag && (i.lct = this.parseCT(1 << i.lctSize + 1, s)), i.lzwMinCodeSize = o.readByte();
    const u = this.readSubBlocks(s);
    i.pixels = this.lzwDecode(i.lzwMinCodeSize, u), i.interlaced && (i.pixels = h(i.pixels, i.width)), this.doImg(i, a);
  }
  /**读取数据块 */
  readSubBlocks(i) {
    let s, a = i, o = "";
    do
      s = a.readByte(), o += a.read(s);
    while (s !== 0);
    return o;
  }
  /**解码LZW编码 */
  lzwDecode(i, s) {
    let a = 0;
    function o(M) {
      let w = 0;
      for (let x = 0; x < M; x++)
        s.charCodeAt(a >> 3) & 1 << (a & 7) && (w |= 1 << x), a++;
      return w;
    }
    let h = [], l = 1 << i, u = l + 1, f = i + 1, _ = [];
    function v() {
      _ = [], f = i + 1;
      for (let M = 0; M < l; M++)
        _[M] = [M];
      _[l] = [], _[u] = null;
    }
    let m = null, p = null;
    for (; ; ) {
      if (p = m, m = o(f), m === l) {
        v();
        continue;
      }
      if (m === u)
        break;
      if (m < _.length)
        p !== l && _.push(_[p].concat(_[m][0]));
      else {
        if (m !== _.length)
          throw new Error("Invalid LZW code.");
        _.push(_[p].concat(_[p][0]));
      }
      h.push.apply(h, _[m]), _.length === 1 << f && f < 12 && f++;
    }
    return h;
  }
  /** */
  doImg(i, s) {
    let a = this.ctx, o = this.canvasTool, h = this.gifInfo, l = this.gifCache[s].frameList;
    this.ctx || (a = this.ctx = o.getContext("2d"));
    const u = l.length, f = i.lctFlag ? i.lct : h.gct;
    u > 0 && (this.LAST_DISPOSA_METHOD === 3 ? this.CURRENT_FRAME_INDEX !== null && this.CURRENT_FRAME_INDEX > -1 ? a.putImageData(l[this.CURRENT_FRAME_INDEX].data, 0, 0) : a.clearRect(0, 0, o.width, o.height) : this.CURRENT_FRAME_INDEX = u - 1, this.LAST_DISPOSA_METHOD === 2 && a.clearRect(0, 0, o.width, o.height));
    let _ = a.getImageData(i.leftPos, i.topPos, i.width, i.height);
    i.pixels.forEach((v, m) => {
      v !== this.TRANSPARENCY && (_.data[m * 4 + 0] = f[v][0], _.data[m * 4 + 1] = f[v][1], _.data[m * 4 + 2] = f[v][2], _.data[m * 4 + 3] = 255);
    }), a.putImageData(_, i.leftPos, i.topPos);
  }
  /**数字转换为对应的位然后变为长度为7的boolean数组
   * @param bite number 
   */
  byteToBitArr(i) {
    let s = [];
    for (let a = 7; a >= 0; a--)
      s.push(!!(i & 1 << a));
    return s;
  }
  /**boolean数组转换为对应的数字
   * @param ba boolean[]
   */
  bitsToNum(i) {
    return i.reduce(function(s, a) {
      return s * 2 + Number(a);
    }, 0);
  }
  /**获取全局颜色列表
   * @param size 全局颜色列表大小
   */
  parseCT(i, s) {
    let a = [];
    for (let o = 0; o < i; o++)
      a.push(s.readBytes(3));
    return a;
  }
}
class uh {
  constructor(i) {
    this.pos = 0, this.data = i, this.len = i.length, this.pos = 0;
  }
  /**读取一字节（8位）的数据 */
  readByte() {
    if (this.pos >= this.data.length)
      throw new Error("Attempted to read past end of stream.");
    return this.data instanceof Uint8Array ? this.data[this.pos++] : this.data.charCodeAt(this.pos++) & 255;
  }
  /**读取指定长度的数据 */
  readBytes(i) {
    let s = [];
    for (let a = 0; a < i; a++)
      s.push(this.readByte());
    return s;
  }
  /**获取指定长度字符串 */
  read(i) {
    let s = "";
    for (let a = 0; a < i; a++)
      s += String.fromCharCode(this.readByte());
    return s;
  }
  /**读取无符号数据2字节 最大：255<<8 + 255 */
  readUnsigned() {
    let i = this.readBytes(2);
    return (i[1] << 8) + i[0];
  }
}
const pn = class pn {
  /**加载需要提前加载的异步图片，保证图片层级正确 */
  static loadImg(i = ["/assets/images/map/map_selected.png"]) {
    i.forEach((s) => this.getImgPromise(s));
  }
  /**绘制图片,默认图片中心点 */
  static async drawImg(i, s) {
    if (i.ifHide === !0) return;
    let { point: a, points: o = [], size: h = [0, 0], url: l, sizeo: u, posX: f = 0, posY: _ = 0, left: v = 0, top: m = 0, rotate: p = 0, alpha: M = 1 } = i, w = h[0], x = h[1], S = u && u[0], E = u && u[1], C = this.ImageCache[l] || await this.getImgPromise(l);
    a && (o = [...o, a]);
    for (let G = 0; G < o.length; G++) {
      const z = o[G], B = z[0], D = z[1];
      p = p * Math.PI / 180, s.globalAlpha = M, s.setTransform(1, 0, 0, 1, B, D), s.rotate(p), S && E ? s.drawImage(C, f, _, S, E, -w / 2 + v, -x / 2 + m, w, x) : s.drawImage(C, -w / 2 + v, -x / 2 + m, w, x), s.rotate(-p), s.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
  /**根据图片路径地址，获取图片后缓存 , 避免重复请求
  * @param url 图片路径
  */
  static getImgPromise(i) {
    let s = this.ImageCache[i];
    return s ? Promise.resolve(s) : new Promise((a, o) => {
      let h = new Image();
      h.onload = () => {
        this.ImageCache[i] = h, a(h);
      }, h.src = `${i}`;
    });
  }
};
pn.ImageCache = /* @__PURE__ */ Object.create(null);
let Vs = pn;
const Ji = /* @__PURE__ */ new Map(), ee = /* @__PURE__ */ new Map(), La = /* @__PURE__ */ new Map();
function ch(e, i, s, a, o) {
  let h = 0;
  const l = {};
  for (const f of e) {
    const _ = s.get(f) ?? o;
    h += _, l[f] = (l[f] ?? 0) + 1;
  }
  const u = i - h;
  for (const f of Object.keys(l)) {
    const _ = l[f], v = s.get(f) ?? o, m = v * _ / h, p = u * m * a / _, M = v + p;
    s.set(f, M);
  }
}
function fh(e, i) {
  const s = /* @__PURE__ */ new Map();
  let a = 0;
  for (const f of "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,.-+=?") {
    const _ = e.measureText(f).width;
    s.set(f, _), a += _;
  }
  const o = a / s.size, h = 3, l = (i / o + h) / (h + 1), u = s.keys();
  for (const f of u)
    s.set(f, (s.get(f) ?? o) * l);
  return s;
}
function le(e, i, s, a) {
  const o = ee.get(s);
  if (a && o !== void 0 && o.count > 2e4) {
    let u = La.get(s);
    if (u === void 0 && (u = fh(e, o.size), La.set(s, u)), o.count > 5e5) {
      let _ = 0;
      for (const v of i)
        _ += u.get(v) ?? o.size;
      return _ * 1.01;
    }
    const f = e.measureText(i);
    return ch(i, f.width, u, Math.max(0.05, 1 - o.count / 2e5), o.size), ee.set(s, {
      count: o.count + i.length,
      size: o.size
    }), f.width;
  }
  const h = e.measureText(i), l = h.width / i.length;
  if ((o?.count ?? 0) > 2e4)
    return h.width;
  if (o === void 0)
    ee.set(s, {
      count: i.length,
      size: l
    });
  else {
    const u = l - o.size, f = i.length / (o.count + i.length), _ = o.size + u * f;
    ee.set(s, {
      count: o.count + i.length,
      size: _
    });
  }
  return h.width;
}
function dh(e, i, s, a, o, h, l, u) {
  if (i.length <= 1) return i.length;
  if (o < s) return -1;
  let f = Math.floor(s / o * h), _ = le(e, i.slice(0, Math.max(0, f)), a, l);
  const v = u?.(i);
  if (_ !== s) if (_ < s) {
    for (; _ < s; )
      f++, _ = le(e, i.slice(0, Math.max(0, f)), a, l);
    f--;
  } else
    for (; _ > s; ) {
      const m = v !== void 0 ? 0 : i.lastIndexOf(" ", f - 1);
      m > 0 ? f = m : f--, _ = le(e, i.slice(0, Math.max(0, f)), a, l);
    }
  if (i[f] !== " ") {
    let m = 0;
    if (v === void 0)
      m = i.lastIndexOf(" ", f);
    else
      for (const p of v) {
        if (p > f) break;
        m = p;
      }
    m > 0 && (f = m);
  }
  return f;
}
function _h(e, i, s, a, o, h) {
  const l = `${i}_${s}_${a}px`, u = Ji.get(l);
  if (u !== void 0) return u;
  if (a <= 0)
    return [];
  let f = [];
  const _ = i.split(`
`), v = ee.get(s), m = v === void 0 ? i.length : a / v.size * 1.5, p = v !== void 0 && v.count > 2e4;
  for (let M of _) {
    let w = le(e, M.slice(0, Math.max(0, m)), s, p), x = Math.min(M.length, m);
    if (w <= a)
      f.push(M);
    else {
      for (; w > a; ) {
        const S = dh(e, M, a, s, w, x, p, h), E = M.slice(0, Math.max(0, S));
        M = M.slice(E.length), f.push(E), w = le(e, M.slice(0, Math.max(0, m)), s, p), x = Math.min(M.length, m);
      }
      w > 0 && f.push(M);
    }
  }
  return f = f.map((M, w) => w === 0 ? M.trimEnd() : M.trim()), Ji.set(l, f), Ji.size > 500 && Ji.delete(Ji.keys().next().value), f;
}
class mh {
  /**绘制文本（包含重叠处理）
   * @param info 文本信息
   * @param textRects 已绘制文本
   * @param ctx 画布
  */
  static drawText(i, s = [], a = this.ctx) {
    let { text: o = "", maxWidth: h = 0, font: l = a.font, ifHide: u } = i;
    if (u === !0 || !o) return null;
    this.ctx = a, kt.setCtxPara(a, i);
    const f = this.wordWrap(o, h, l), _ = this.calcTextRect(f, i), v = this.avoidOverlap(i, _, s);
    this.renderTexts(i, f, _, s, v, a);
  }
  /**对文本换行计算,按规则得到多行文本 
   * @param text 文本
   * @param ctx 画布
   * @param max 最大宽度
   * @param font 字体
  */
  static wordWrap(i, s, a, o = this.ctx) {
    let h = i.split(`
`).filter((u) => u != "");
    if (s <= 0) return h;
    let l = [];
    return h.forEach((u) => {
      l.push(..._h(o, u, a, s, !0, (f) => [f.lastIndexOf(",") + 1]));
    }), l;
  }
  /**计算得到文本框(无论是否绘制背景框都需要计算)
   * @param texts 文本组
   * @param info 文本配置
   * @param ctx 画布
   */
  static calcTextRect(i, s, a = this.ctx) {
    let { point: o = [20, 20], panel: h = {}, lineHeight: l, textAlign: u, px: f = 0, py: _ = 0 } = s, v = 0, m = 0, [p, M] = o, { actualBoundingBoxDescent: w = 0 } = a.measureText("M");
    m = (l || w) * i.length, v = Math.max(...i.map((D) => a.measureText(D).width));
    const { pl: x = 0, pr: S = x, pt: E = 0, pb: C = E } = h;
    let G = v + x + S, z = m + E + C;
    return u === "center" && (p -= G / 2), u === "right" && (p -= G), {
      x: p + f,
      y: M + _,
      width: G,
      height: z
    };
  }
  /**八个方向查找空隙 
  * @param rect 文本范围
  * @param rects 已存在的文本范围
  * @returns [X轴偏移量,Y轴偏移量,状态控制标识 0-7:方位 8:正常显示 9:不显示 ]
  */
  static avoidOverlap(i, s, a) {
    const { x: o, y: h, width: l = 0, height: u = 0 } = s, { overlap: f, textAlign: _ } = i, { type: v = "show", querySpace: m = 1, maxDistance: p = 200, minSpacing: M = 0 } = f || {};
    if (v === "show") return [0, 0, 8];
    let w = this.isTextOverlap(s, a);
    if (v === "hide")
      return w ? [0, 0, 9] : [0, 0, 8];
    if (w)
      for (let x = 0; x <= p; x += m)
        for (let S = 0; S < 8; S++) {
          const E = S % 4 === 0 ? 0 : S < 4 ? 1 : -1, C = S == 2 || S == 6 ? 0 : S < 2 || S > 6 ? -1 : 1;
          let G = x * E - (E < 0 ? l : 0), z = x * C - (C < 0 ? u : 0);
          if (!this.isTextOverlap({ x: o + G, y: h + z, width: l, height: u }, a, M))
            return [G, z, S];
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
  static renderTexts(i, s, a, o, h, l) {
    const [u, f, _] = h, { panel: v = {}, overlap: m = {}, textAlign: p = "center", px: M = 0, py: w = 0, point: x = [0, 0] } = i, { pl: S = 0, pt: E = 0, pb: C = E, pr: G = S } = v, { line: z } = m, { width: B = 0, height: D = 0 } = a, [W, et] = x;
    if (_ !== 9) {
      if (a.x += u, a.y += f, o.push({ ...a }), u != 0 || f != 0 && z) {
        let { x: Z, y: X } = a;
        switch (_) {
          case 0:
            Z = Z, X = X + D;
            break;
          case 1:
            Z = Z, X = X + D;
            break;
          case 2:
            Z = Z, X = X;
            break;
          case 3:
            Z = Z, X = X;
            break;
          case 4:
            Z = Z, X = X;
            break;
          case 5:
            Z = Z + B, X = X;
            break;
          case 6:
            Z = Z + B, X = X;
            break;
          case 7:
            Z = Z + B, X = X + D;
            break;
        }
        kt.drawLine({ ...z, points: [[W, et], [Z, X]] }, l);
      }
      v && kt.drawRect(
        {
          point: [a.x, a.y],
          width: a.width,
          height: a.height,
          radius: v.radius,
          ...v
        },
        l
      ), kt.setCtxPara(l, i), this.renderMultiText(s, [a.x + S, a.y + E], i, l), kt.setCtxPara(l);
    }
  }
  /**绘制多行文本*/
  static renderMultiText(i, s, a, o) {
    let [h, l] = s;
    const { lineHeight: u, ifShadow: f } = a;
    let { actualBoundingBoxDescent: _ } = o.measureText("M");
    i.forEach((v) => {
      let m = u && u > _ ? (u - _) / 2 : 0, p = u || _;
      f && o.strokeText(v, h, l + m), o.fillText(v, h, l + m), l += p;
    });
  }
  /**文本是否重叠 */
  static isTextOverlap(i, s, a = 0) {
    for (const o of s) {
      const { x: h, y: l, width: u = 0, height: f = 0 } = i, { x: _, y: v = 0, width: m = 0, height: p = 0 } = o;
      if (!(_ > h + u + a || _ + m + a < h || v > l + f + a || v + p + a < l))
        return !0;
    }
    return !1;
  }
}
function gh(e) {
  if (Object.prototype.hasOwnProperty.call(e, "__esModule")) return e;
  var i = e.default;
  if (typeof i == "function") {
    var s = function a() {
      var o = !1;
      try {
        o = this instanceof a;
      } catch {
      }
      return o ? Reflect.construct(i, arguments, this.constructor) : i.apply(this, arguments);
    };
    s.prototype = i.prototype;
  } else s = {};
  return Object.defineProperty(s, "__esModule", { value: !0 }), Object.keys(e).forEach(function(a) {
    var o = Object.getOwnPropertyDescriptor(e, a);
    Object.defineProperty(s, a, o.get ? o : {
      enumerable: !0,
      get: function() {
        return e[a];
      }
    });
  }), s;
}
var se = { exports: {} };
var ph = se.exports, Ca;
function hr() {
  return Ca || (Ca = 1, (function(e, i) {
    (function(s, a) {
      a(i);
    })(ph, (function(s) {
      var a = "1.9.4";
      function o(t) {
        var n, r, c, d;
        for (r = 1, c = arguments.length; r < c; r++) {
          d = arguments[r];
          for (n in d)
            t[n] = d[n];
        }
        return t;
      }
      var h = Object.create || /* @__PURE__ */ (function() {
        function t() {
        }
        return function(n) {
          return t.prototype = n, new t();
        };
      })();
      function l(t, n) {
        var r = Array.prototype.slice;
        if (t.bind)
          return t.bind.apply(t, r.call(arguments, 1));
        var c = r.call(arguments, 2);
        return function() {
          return t.apply(n, c.length ? c.concat(r.call(arguments)) : arguments);
        };
      }
      var u = 0;
      function f(t) {
        return "_leaflet_id" in t || (t._leaflet_id = ++u), t._leaflet_id;
      }
      function _(t, n, r) {
        var c, d, g, y;
        return y = function() {
          c = !1, d && (g.apply(r, d), d = !1);
        }, g = function() {
          c ? d = arguments : (t.apply(r, arguments), setTimeout(y, n), c = !0);
        }, g;
      }
      function v(t, n, r) {
        var c = n[1], d = n[0], g = c - d;
        return t === c && r ? t : ((t - d) % g + g) % g + d;
      }
      function m() {
        return !1;
      }
      function p(t, n) {
        if (n === !1)
          return t;
        var r = Math.pow(10, n === void 0 ? 6 : n);
        return Math.round(t * r) / r;
      }
      function M(t) {
        return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
      }
      function w(t) {
        return M(t).split(/\s+/);
      }
      function x(t, n) {
        Object.prototype.hasOwnProperty.call(t, "options") || (t.options = t.options ? h(t.options) : {});
        for (var r in n)
          t.options[r] = n[r];
        return t.options;
      }
      function S(t, n, r) {
        var c = [];
        for (var d in t)
          c.push(encodeURIComponent(r ? d.toUpperCase() : d) + "=" + encodeURIComponent(t[d]));
        return (!n || n.indexOf("?") === -1 ? "?" : "&") + c.join("&");
      }
      var E = /\{ *([\w_ -]+) *\}/g;
      function C(t, n) {
        return t.replace(E, function(r, c) {
          var d = n[c];
          if (d === void 0)
            throw new Error("No value provided for variable " + r);
          return typeof d == "function" && (d = d(n)), d;
        });
      }
      var G = Array.isArray || function(t) {
        return Object.prototype.toString.call(t) === "[object Array]";
      };
      function z(t, n) {
        for (var r = 0; r < t.length; r++)
          if (t[r] === n)
            return r;
        return -1;
      }
      var B = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
      function D(t) {
        return window["webkit" + t] || window["moz" + t] || window["ms" + t];
      }
      var W = 0;
      function et(t) {
        var n = +/* @__PURE__ */ new Date(), r = Math.max(0, 16 - (n - W));
        return W = n + r, window.setTimeout(t, r);
      }
      var Z = window.requestAnimationFrame || D("RequestAnimationFrame") || et, X = window.cancelAnimationFrame || D("CancelAnimationFrame") || D("CancelRequestAnimationFrame") || function(t) {
        window.clearTimeout(t);
      };
      function $(t, n, r) {
        if (r && Z === et)
          t.call(n);
        else
          return Z.call(window, l(t, n));
      }
      function dt(t) {
        t && X.call(window, t);
      }
      var Jt = {
        __proto__: null,
        extend: o,
        create: h,
        bind: l,
        get lastId() {
          return u;
        },
        stamp: f,
        throttle: _,
        wrapNum: v,
        falseFn: m,
        formatNum: p,
        trim: M,
        splitWords: w,
        setOptions: x,
        getParamString: S,
        template: C,
        isArray: G,
        indexOf: z,
        emptyImageUrl: B,
        requestFn: Z,
        cancelFn: X,
        requestAnimFrame: $,
        cancelAnimFrame: dt
      };
      function Zt() {
      }
      Zt.extend = function(t) {
        var n = function() {
          x(this), this.initialize && this.initialize.apply(this, arguments), this.callInitHooks();
        }, r = n.__super__ = this.prototype, c = h(r);
        c.constructor = n, n.prototype = c;
        for (var d in this)
          Object.prototype.hasOwnProperty.call(this, d) && d !== "prototype" && d !== "__super__" && (n[d] = this[d]);
        return t.statics && o(n, t.statics), t.includes && (Br(t.includes), o.apply(null, [c].concat(t.includes))), o(c, t), delete c.statics, delete c.includes, c.options && (c.options = r.options ? h(r.options) : {}, o(c.options, t.options)), c._initHooks = [], c.callInitHooks = function() {
          if (!this._initHooksCalled) {
            r.callInitHooks && r.callInitHooks.call(this), this._initHooksCalled = !0;
            for (var g = 0, y = c._initHooks.length; g < y; g++)
              c._initHooks[g].call(this);
          }
        }, n;
      }, Zt.include = function(t) {
        var n = this.prototype.options;
        return o(this.prototype, t), t.options && (this.prototype.options = n, this.mergeOptions(t.options)), this;
      }, Zt.mergeOptions = function(t) {
        return o(this.prototype.options, t), this;
      }, Zt.addInitHook = function(t) {
        var n = Array.prototype.slice.call(arguments, 1), r = typeof t == "function" ? t : function() {
          this[t].apply(this, n);
        };
        return this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(r), this;
      };
      function Br(t) {
        if (!(typeof L > "u" || !L || !L.Mixin)) {
          t = G(t) ? t : [t];
          for (var n = 0; n < t.length; n++)
            t[n] === L.Mixin.Events && console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.", new Error().stack);
        }
      }
      var At = {
        /* @method on(type: String, fn: Function, context?: Object): this
         * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
         *
         * @alternative
         * @method on(eventMap: Object): this
         * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
         */
        on: function(t, n, r) {
          if (typeof t == "object")
            for (var c in t)
              this._on(c, t[c], n);
          else {
            t = w(t);
            for (var d = 0, g = t.length; d < g; d++)
              this._on(t[d], n, r);
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
        off: function(t, n, r) {
          if (!arguments.length)
            delete this._events;
          else if (typeof t == "object")
            for (var c in t)
              this._off(c, t[c], n);
          else {
            t = w(t);
            for (var d = arguments.length === 1, g = 0, y = t.length; g < y; g++)
              d ? this._off(t[g]) : this._off(t[g], n, r);
          }
          return this;
        },
        // attach listener (without syntactic sugar now)
        _on: function(t, n, r, c) {
          if (typeof n != "function") {
            console.warn("wrong listener type: " + typeof n);
            return;
          }
          if (this._listens(t, n, r) === !1) {
            r === this && (r = void 0);
            var d = { fn: n, ctx: r };
            c && (d.once = !0), this._events = this._events || {}, this._events[t] = this._events[t] || [], this._events[t].push(d);
          }
        },
        _off: function(t, n, r) {
          var c, d, g;
          if (this._events && (c = this._events[t], !!c)) {
            if (arguments.length === 1) {
              if (this._firingCount)
                for (d = 0, g = c.length; d < g; d++)
                  c[d].fn = m;
              delete this._events[t];
              return;
            }
            if (typeof n != "function") {
              console.warn("wrong listener type: " + typeof n);
              return;
            }
            var y = this._listens(t, n, r);
            if (y !== !1) {
              var P = c[y];
              this._firingCount && (P.fn = m, this._events[t] = c = c.slice()), c.splice(y, 1);
            }
          }
        },
        // @method fire(type: String, data?: Object, propagate?: Boolean): this
        // Fires an event of the specified type. You can optionally provide a data
        // object — the first argument of the listener function will contain its
        // properties. The event can optionally be propagated to event parents.
        fire: function(t, n, r) {
          if (!this.listens(t, r))
            return this;
          var c = o({}, n, {
            type: t,
            target: this,
            sourceTarget: n && n.sourceTarget || this
          });
          if (this._events) {
            var d = this._events[t];
            if (d) {
              this._firingCount = this._firingCount + 1 || 1;
              for (var g = 0, y = d.length; g < y; g++) {
                var P = d[g], b = P.fn;
                P.once && this.off(t, b, P.ctx), b.call(P.ctx || this, c);
              }
              this._firingCount--;
            }
          }
          return r && this._propagateEvent(c), this;
        },
        // @method listens(type: String, propagate?: Boolean): Boolean
        // @method listens(type: String, fn: Function, context?: Object, propagate?: Boolean): Boolean
        // Returns `true` if a particular event type has any listeners attached to it.
        // The verification can optionally be propagated, it will return `true` if parents have the listener attached to it.
        listens: function(t, n, r, c) {
          typeof t != "string" && console.warn('"string" type argument expected');
          var d = n;
          typeof n != "function" && (c = !!n, d = void 0, r = void 0);
          var g = this._events && this._events[t];
          if (g && g.length && this._listens(t, d, r) !== !1)
            return !0;
          if (c) {
            for (var y in this._eventParents)
              if (this._eventParents[y].listens(t, n, r, c))
                return !0;
          }
          return !1;
        },
        // returns the index (number) or false
        _listens: function(t, n, r) {
          if (!this._events)
            return !1;
          var c = this._events[t] || [];
          if (!n)
            return !!c.length;
          r === this && (r = void 0);
          for (var d = 0, g = c.length; d < g; d++)
            if (c[d].fn === n && c[d].ctx === r)
              return d;
          return !1;
        },
        // @method once(…): this
        // Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
        once: function(t, n, r) {
          if (typeof t == "object")
            for (var c in t)
              this._on(c, t[c], n, !0);
          else {
            t = w(t);
            for (var d = 0, g = t.length; d < g; d++)
              this._on(t[d], n, r, !0);
          }
          return this;
        },
        // @method addEventParent(obj: Evented): this
        // Adds an event parent - an `Evented` that will receive propagated events
        addEventParent: function(t) {
          return this._eventParents = this._eventParents || {}, this._eventParents[f(t)] = t, this;
        },
        // @method removeEventParent(obj: Evented): this
        // Removes an event parent, so it will stop receiving propagated events
        removeEventParent: function(t) {
          return this._eventParents && delete this._eventParents[f(t)], this;
        },
        _propagateEvent: function(t) {
          for (var n in this._eventParents)
            this._eventParents[n].fire(t.type, o({
              layer: t.target,
              propagatedFrom: t.target
            }, t), !0);
        }
      };
      At.addEventListener = At.on, At.removeEventListener = At.clearAllEventListeners = At.off, At.addOneTimeEventListener = At.once, At.fireEvent = At.fire, At.hasEventListeners = At.listens;
      var Bi = Zt.extend(At);
      function U(t, n, r) {
        this.x = r ? Math.round(t) : t, this.y = r ? Math.round(n) : n;
      }
      var vn = Math.trunc || function(t) {
        return t > 0 ? Math.floor(t) : Math.ceil(t);
      };
      U.prototype = {
        // @method clone(): Point
        // Returns a copy of the current point.
        clone: function() {
          return new U(this.x, this.y);
        },
        // @method add(otherPoint: Point): Point
        // Returns the result of addition of the current and the given points.
        add: function(t) {
          return this.clone()._add(F(t));
        },
        _add: function(t) {
          return this.x += t.x, this.y += t.y, this;
        },
        // @method subtract(otherPoint: Point): Point
        // Returns the result of subtraction of the given point from the current.
        subtract: function(t) {
          return this.clone()._subtract(F(t));
        },
        _subtract: function(t) {
          return this.x -= t.x, this.y -= t.y, this;
        },
        // @method divideBy(num: Number): Point
        // Returns the result of division of the current point by the given number.
        divideBy: function(t) {
          return this.clone()._divideBy(t);
        },
        _divideBy: function(t) {
          return this.x /= t, this.y /= t, this;
        },
        // @method multiplyBy(num: Number): Point
        // Returns the result of multiplication of the current point by the given number.
        multiplyBy: function(t) {
          return this.clone()._multiplyBy(t);
        },
        _multiplyBy: function(t) {
          return this.x *= t, this.y *= t, this;
        },
        // @method scaleBy(scale: Point): Point
        // Multiply each coordinate of the current point by each coordinate of
        // `scale`. In linear algebra terms, multiply the point by the
        // [scaling matrix](https://en.wikipedia.org/wiki/Scaling_%28geometry%29#Matrix_representation)
        // defined by `scale`.
        scaleBy: function(t) {
          return new U(this.x * t.x, this.y * t.y);
        },
        // @method unscaleBy(scale: Point): Point
        // Inverse of `scaleBy`. Divide each coordinate of the current point by
        // each coordinate of `scale`.
        unscaleBy: function(t) {
          return new U(this.x / t.x, this.y / t.y);
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
          return this.x = vn(this.x), this.y = vn(this.y), this;
        },
        // @method distanceTo(otherPoint: Point): Number
        // Returns the cartesian distance between the current and the given points.
        distanceTo: function(t) {
          t = F(t);
          var n = t.x - this.x, r = t.y - this.y;
          return Math.sqrt(n * n + r * r);
        },
        // @method equals(otherPoint: Point): Boolean
        // Returns `true` if the given point has the same coordinates.
        equals: function(t) {
          return t = F(t), t.x === this.x && t.y === this.y;
        },
        // @method contains(otherPoint: Point): Boolean
        // Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
        contains: function(t) {
          return t = F(t), Math.abs(t.x) <= Math.abs(this.x) && Math.abs(t.y) <= Math.abs(this.y);
        },
        // @method toString(): String
        // Returns a string representation of the point for debugging purposes.
        toString: function() {
          return "Point(" + p(this.x) + ", " + p(this.y) + ")";
        }
      };
      function F(t, n, r) {
        return t instanceof U ? t : G(t) ? new U(t[0], t[1]) : t == null ? t : typeof t == "object" && "x" in t && "y" in t ? new U(t.x, t.y) : new U(t, n, r);
      }
      function nt(t, n) {
        if (t)
          for (var r = n ? [t, n] : t, c = 0, d = r.length; c < d; c++)
            this.extend(r[c]);
      }
      nt.prototype = {
        // @method extend(point: Point): this
        // Extends the bounds to contain the given point.
        // @alternative
        // @method extend(otherBounds: Bounds): this
        // Extend the bounds to contain the given bounds
        extend: function(t) {
          var n, r;
          if (!t)
            return this;
          if (t instanceof U || typeof t[0] == "number" || "x" in t)
            n = r = F(t);
          else if (t = wt(t), n = t.min, r = t.max, !n || !r)
            return this;
          return !this.min && !this.max ? (this.min = n.clone(), this.max = r.clone()) : (this.min.x = Math.min(n.x, this.min.x), this.max.x = Math.max(r.x, this.max.x), this.min.y = Math.min(n.y, this.min.y), this.max.y = Math.max(r.y, this.max.y)), this;
        },
        // @method getCenter(round?: Boolean): Point
        // Returns the center point of the bounds.
        getCenter: function(t) {
          return F(
            (this.min.x + this.max.x) / 2,
            (this.min.y + this.max.y) / 2,
            t
          );
        },
        // @method getBottomLeft(): Point
        // Returns the bottom-left point of the bounds.
        getBottomLeft: function() {
          return F(this.min.x, this.max.y);
        },
        // @method getTopRight(): Point
        // Returns the top-right point of the bounds.
        getTopRight: function() {
          return F(this.max.x, this.min.y);
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
        contains: function(t) {
          var n, r;
          return typeof t[0] == "number" || t instanceof U ? t = F(t) : t = wt(t), t instanceof nt ? (n = t.min, r = t.max) : n = r = t, n.x >= this.min.x && r.x <= this.max.x && n.y >= this.min.y && r.y <= this.max.y;
        },
        // @method intersects(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds
        // intersect if they have at least one point in common.
        intersects: function(t) {
          t = wt(t);
          var n = this.min, r = this.max, c = t.min, d = t.max, g = d.x >= n.x && c.x <= r.x, y = d.y >= n.y && c.y <= r.y;
          return g && y;
        },
        // @method overlaps(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds
        // overlap if their intersection is an area.
        overlaps: function(t) {
          t = wt(t);
          var n = this.min, r = this.max, c = t.min, d = t.max, g = d.x > n.x && c.x < r.x, y = d.y > n.y && c.y < r.y;
          return g && y;
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
        pad: function(t) {
          var n = this.min, r = this.max, c = Math.abs(n.x - r.x) * t, d = Math.abs(n.y - r.y) * t;
          return wt(
            F(n.x - c, n.y - d),
            F(r.x + c, r.y + d)
          );
        },
        // @method equals(otherBounds: Bounds): Boolean
        // Returns `true` if the rectangle is equivalent to the given bounds.
        equals: function(t) {
          return t ? (t = wt(t), this.min.equals(t.getTopLeft()) && this.max.equals(t.getBottomRight())) : !1;
        }
      };
      function wt(t, n) {
        return !t || t instanceof nt ? t : new nt(t, n);
      }
      function xt(t, n) {
        if (t)
          for (var r = n ? [t, n] : t, c = 0, d = r.length; c < d; c++)
            this.extend(r[c]);
      }
      xt.prototype = {
        // @method extend(latlng: LatLng): this
        // Extend the bounds to contain the given point
        // @alternative
        // @method extend(otherBounds: LatLngBounds): this
        // Extend the bounds to contain the given bounds
        extend: function(t) {
          var n = this._southWest, r = this._northEast, c, d;
          if (t instanceof tt)
            c = t, d = t;
          else if (t instanceof xt) {
            if (c = t._southWest, d = t._northEast, !c || !d)
              return this;
          } else
            return t ? this.extend(Y(t) || ut(t)) : this;
          return !n && !r ? (this._southWest = new tt(c.lat, c.lng), this._northEast = new tt(d.lat, d.lng)) : (n.lat = Math.min(c.lat, n.lat), n.lng = Math.min(c.lng, n.lng), r.lat = Math.max(d.lat, r.lat), r.lng = Math.max(d.lng, r.lng)), this;
        },
        // @method pad(bufferRatio: Number): LatLngBounds
        // Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
        // For example, a ratio of 0.5 extends the bounds by 50% in each direction.
        // Negative values will retract the bounds.
        pad: function(t) {
          var n = this._southWest, r = this._northEast, c = Math.abs(n.lat - r.lat) * t, d = Math.abs(n.lng - r.lng) * t;
          return new xt(
            new tt(n.lat - c, n.lng - d),
            new tt(r.lat + c, r.lng + d)
          );
        },
        // @method getCenter(): LatLng
        // Returns the center point of the bounds.
        getCenter: function() {
          return new tt(
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
          return new tt(this.getNorth(), this.getWest());
        },
        // @method getSouthEast(): LatLng
        // Returns the south-east point of the bounds.
        getSouthEast: function() {
          return new tt(this.getSouth(), this.getEast());
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
        contains: function(t) {
          typeof t[0] == "number" || t instanceof tt || "lat" in t ? t = Y(t) : t = ut(t);
          var n = this._southWest, r = this._northEast, c, d;
          return t instanceof xt ? (c = t.getSouthWest(), d = t.getNorthEast()) : c = d = t, c.lat >= n.lat && d.lat <= r.lat && c.lng >= n.lng && d.lng <= r.lng;
        },
        // @method intersects(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
        intersects: function(t) {
          t = ut(t);
          var n = this._southWest, r = this._northEast, c = t.getSouthWest(), d = t.getNorthEast(), g = d.lat >= n.lat && c.lat <= r.lat, y = d.lng >= n.lng && c.lng <= r.lng;
          return g && y;
        },
        // @method overlaps(otherBounds: LatLngBounds): Boolean
        // Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
        overlaps: function(t) {
          t = ut(t);
          var n = this._southWest, r = this._northEast, c = t.getSouthWest(), d = t.getNorthEast(), g = d.lat > n.lat && c.lat < r.lat, y = d.lng > n.lng && c.lng < r.lng;
          return g && y;
        },
        // @method toBBoxString(): String
        // Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
        toBBoxString: function() {
          return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(",");
        },
        // @method equals(otherBounds: LatLngBounds, maxMargin?: Number): Boolean
        // Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds. The margin of error can be overridden by setting `maxMargin` to a small number.
        equals: function(t, n) {
          return t ? (t = ut(t), this._southWest.equals(t.getSouthWest(), n) && this._northEast.equals(t.getNorthEast(), n)) : !1;
        },
        // @method isValid(): Boolean
        // Returns `true` if the bounds are properly initialized.
        isValid: function() {
          return !!(this._southWest && this._northEast);
        }
      };
      function ut(t, n) {
        return t instanceof xt ? t : new xt(t, n);
      }
      function tt(t, n, r) {
        if (isNaN(t) || isNaN(n))
          throw new Error("Invalid LatLng object: (" + t + ", " + n + ")");
        this.lat = +t, this.lng = +n, r !== void 0 && (this.alt = +r);
      }
      tt.prototype = {
        // @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
        // Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
        equals: function(t, n) {
          if (!t)
            return !1;
          t = Y(t);
          var r = Math.max(
            Math.abs(this.lat - t.lat),
            Math.abs(this.lng - t.lng)
          );
          return r <= (n === void 0 ? 1e-9 : n);
        },
        // @method toString(): String
        // Returns a string representation of the point (for debugging purposes).
        toString: function(t) {
          return "LatLng(" + p(this.lat, t) + ", " + p(this.lng, t) + ")";
        },
        // @method distanceTo(otherLatLng: LatLng): Number
        // Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
        distanceTo: function(t) {
          return Qt.distance(this, Y(t));
        },
        // @method wrap(): LatLng
        // Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
        wrap: function() {
          return Qt.wrapLatLng(this);
        },
        // @method toBounds(sizeInMeters: Number): LatLngBounds
        // Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
        toBounds: function(t) {
          var n = 180 * t / 40075017, r = n / Math.cos(Math.PI / 180 * this.lat);
          return ut(
            [this.lat - n, this.lng - r],
            [this.lat + n, this.lng + r]
          );
        },
        clone: function() {
          return new tt(this.lat, this.lng, this.alt);
        }
      };
      function Y(t, n, r) {
        return t instanceof tt ? t : G(t) && typeof t[0] != "object" ? t.length === 3 ? new tt(t[0], t[1], t[2]) : t.length === 2 ? new tt(t[0], t[1]) : null : t == null ? t : typeof t == "object" && "lat" in t ? new tt(t.lat, "lng" in t ? t.lng : t.lon, t.alt) : n === void 0 ? null : new tt(t, n, r);
      }
      var Wt = {
        // @method latLngToPoint(latlng: LatLng, zoom: Number): Point
        // Projects geographical coordinates into pixel coordinates for a given zoom.
        latLngToPoint: function(t, n) {
          var r = this.projection.project(t), c = this.scale(n);
          return this.transformation._transform(r, c);
        },
        // @method pointToLatLng(point: Point, zoom: Number): LatLng
        // The inverse of `latLngToPoint`. Projects pixel coordinates on a given
        // zoom into geographical coordinates.
        pointToLatLng: function(t, n) {
          var r = this.scale(n), c = this.transformation.untransform(t, r);
          return this.projection.unproject(c);
        },
        // @method project(latlng: LatLng): Point
        // Projects geographical coordinates into coordinates in units accepted for
        // this CRS (e.g. meters for EPSG:3857, for passing it to WMS services).
        project: function(t) {
          return this.projection.project(t);
        },
        // @method unproject(point: Point): LatLng
        // Given a projected coordinate returns the corresponding LatLng.
        // The inverse of `project`.
        unproject: function(t) {
          return this.projection.unproject(t);
        },
        // @method scale(zoom: Number): Number
        // Returns the scale used when transforming projected coordinates into
        // pixel coordinates for a particular zoom. For example, it returns
        // `256 * 2^zoom` for Mercator-based CRS.
        scale: function(t) {
          return 256 * Math.pow(2, t);
        },
        // @method zoom(scale: Number): Number
        // Inverse of `scale()`, returns the zoom level corresponding to a scale
        // factor of `scale`.
        zoom: function(t) {
          return Math.log(t / 256) / Math.LN2;
        },
        // @method getProjectedBounds(zoom: Number): Bounds
        // Returns the projection's bounds scaled and transformed for the provided `zoom`.
        getProjectedBounds: function(t) {
          if (this.infinite)
            return null;
          var n = this.projection.bounds, r = this.scale(t), c = this.transformation.transform(n.min, r), d = this.transformation.transform(n.max, r);
          return new nt(c, d);
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
        wrapLatLng: function(t) {
          var n = this.wrapLng ? v(t.lng, this.wrapLng, !0) : t.lng, r = this.wrapLat ? v(t.lat, this.wrapLat, !0) : t.lat, c = t.alt;
          return new tt(r, n, c);
        },
        // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
        // Returns a `LatLngBounds` with the same size as the given one, ensuring
        // that its center is within the CRS's bounds.
        // Only accepts actual `L.LatLngBounds` instances, not arrays.
        wrapLatLngBounds: function(t) {
          var n = t.getCenter(), r = this.wrapLatLng(n), c = n.lat - r.lat, d = n.lng - r.lng;
          if (c === 0 && d === 0)
            return t;
          var g = t.getSouthWest(), y = t.getNorthEast(), P = new tt(g.lat - c, g.lng - d), b = new tt(y.lat - c, y.lng - d);
          return new xt(P, b);
        }
      }, Qt = o({}, Wt, {
        wrapLng: [-180, 180],
        // Mean Earth Radius, as recommended for use by
        // the International Union of Geodesy and Geophysics,
        // see https://rosettacode.org/wiki/Haversine_formula
        R: 6371e3,
        // distance between two geographical points using spherical law of cosines approximation
        distance: function(t, n) {
          var r = Math.PI / 180, c = t.lat * r, d = n.lat * r, g = Math.sin((n.lat - t.lat) * r / 2), y = Math.sin((n.lng - t.lng) * r / 2), P = g * g + Math.cos(c) * Math.cos(d) * y * y, b = 2 * Math.atan2(Math.sqrt(P), Math.sqrt(1 - P));
          return this.R * b;
        }
      }), yn = 6378137, hs = {
        R: yn,
        MAX_LATITUDE: 85.0511287798,
        project: function(t) {
          var n = Math.PI / 180, r = this.MAX_LATITUDE, c = Math.max(Math.min(r, t.lat), -r), d = Math.sin(c * n);
          return new U(
            this.R * t.lng * n,
            this.R * Math.log((1 + d) / (1 - d)) / 2
          );
        },
        unproject: function(t) {
          var n = 180 / Math.PI;
          return new tt(
            (2 * Math.atan(Math.exp(t.y / this.R)) - Math.PI / 2) * n,
            t.x * n / this.R
          );
        },
        bounds: (function() {
          var t = yn * Math.PI;
          return new nt([-t, -t], [t, t]);
        })()
      };
      function ls(t, n, r, c) {
        if (G(t)) {
          this._a = t[0], this._b = t[1], this._c = t[2], this._d = t[3];
          return;
        }
        this._a = t, this._b = n, this._c = r, this._d = c;
      }
      ls.prototype = {
        // @method transform(point: Point, scale?: Number): Point
        // Returns a transformed point, optionally multiplied by the given scale.
        // Only accepts actual `L.Point` instances, not arrays.
        transform: function(t, n) {
          return this._transform(t.clone(), n);
        },
        // destructive transform (faster)
        _transform: function(t, n) {
          return n = n || 1, t.x = n * (this._a * t.x + this._b), t.y = n * (this._c * t.y + this._d), t;
        },
        // @method untransform(point: Point, scale?: Number): Point
        // Returns the reverse transformation of the given point, optionally divided
        // by the given scale. Only accepts actual `L.Point` instances, not arrays.
        untransform: function(t, n) {
          return n = n || 1, new U(
            (t.x / n - this._b) / this._a,
            (t.y / n - this._d) / this._c
          );
        }
      };
      function ki(t, n, r, c) {
        return new ls(t, n, r, c);
      }
      var us = o({}, Qt, {
        code: "EPSG:3857",
        projection: hs,
        transformation: (function() {
          var t = 0.5 / (Math.PI * hs.R);
          return ki(t, 0.5, -t, 0.5);
        })()
      }), kr = o({}, us, {
        code: "EPSG:900913"
      });
      function Mn(t) {
        return document.createElementNS("http://www.w3.org/2000/svg", t);
      }
      function wn(t, n) {
        var r = "", c, d, g, y, P, b;
        for (c = 0, g = t.length; c < g; c++) {
          for (P = t[c], d = 0, y = P.length; d < y; d++)
            b = P[d], r += (d ? "L" : "M") + b.x + " " + b.y;
          r += n ? R.svg ? "z" : "x" : "";
        }
        return r || "M0 0";
      }
      var cs = document.documentElement.style, be = "ActiveXObject" in window, Dr = be && !document.addEventListener, xn = "msLaunchUri" in navigator && !("documentMode" in document), fs = Ft("webkit"), Pn = Ft("android"), bn = Ft("android 2") || Ft("android 3"), Zr = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10), Fr = Pn && Ft("Google") && Zr < 537 && !("AudioNode" in window), ds = !!window.opera, Sn = !xn && Ft("chrome"), En = Ft("gecko") && !fs && !ds && !be, Ur = !Sn && Ft("safari"), Tn = Ft("phantom"), An = "OTransition" in cs, qr = navigator.platform.indexOf("Win") === 0, Ln = be && "transition" in cs, _s = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !bn, Cn = "MozPerspective" in cs, jr = !window.L_DISABLE_3D && (Ln || _s || Cn) && !An && !Tn, Di = typeof orientation < "u" || Ft("mobile"), Hr = Di && fs, Wr = Di && _s, In = !window.PointerEvent && window.MSPointerEvent, Gn = !!(window.PointerEvent || In), Nn = "ontouchstart" in window || !!window.TouchEvent, Xr = !window.L_NO_TOUCH && (Nn || Gn), Yr = Di && ds, Vr = Di && En, Kr = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1, $r = (function() {
        var t = !1;
        try {
          var n = Object.defineProperty({}, "passive", {
            get: function() {
              t = !0;
            }
          });
          window.addEventListener("testPassiveEventSupport", m, n), window.removeEventListener("testPassiveEventSupport", m, n);
        } catch {
        }
        return t;
      })(), Jr = (function() {
        return !!document.createElement("canvas").getContext;
      })(), ms = !!(document.createElementNS && Mn("svg").createSVGRect), Qr = !!ms && (function() {
        var t = document.createElement("div");
        return t.innerHTML = "<svg/>", (t.firstChild && t.firstChild.namespaceURI) === "http://www.w3.org/2000/svg";
      })(), to = !ms && (function() {
        try {
          var t = document.createElement("div");
          t.innerHTML = '<v:shape adj="1"/>';
          var n = t.firstChild;
          return n.style.behavior = "url(#default#VML)", n && typeof n.adj == "object";
        } catch {
          return !1;
        }
      })(), io = navigator.platform.indexOf("Mac") === 0, eo = navigator.platform.indexOf("Linux") === 0;
      function Ft(t) {
        return navigator.userAgent.toLowerCase().indexOf(t) >= 0;
      }
      var R = {
        ie: be,
        ielt9: Dr,
        edge: xn,
        webkit: fs,
        android: Pn,
        android23: bn,
        androidStock: Fr,
        opera: ds,
        chrome: Sn,
        gecko: En,
        safari: Ur,
        phantom: Tn,
        opera12: An,
        win: qr,
        ie3d: Ln,
        webkit3d: _s,
        gecko3d: Cn,
        any3d: jr,
        mobile: Di,
        mobileWebkit: Hr,
        mobileWebkit3d: Wr,
        msPointer: In,
        pointer: Gn,
        touch: Xr,
        touchNative: Nn,
        mobileOpera: Yr,
        mobileGecko: Vr,
        retina: Kr,
        passiveEvents: $r,
        canvas: Jr,
        svg: ms,
        vml: to,
        inlineSvg: Qr,
        mac: io,
        linux: eo
      }, On = R.msPointer ? "MSPointerDown" : "pointerdown", zn = R.msPointer ? "MSPointerMove" : "pointermove", Rn = R.msPointer ? "MSPointerUp" : "pointerup", Bn = R.msPointer ? "MSPointerCancel" : "pointercancel", gs = {
        touchstart: On,
        touchmove: zn,
        touchend: Rn,
        touchcancel: Bn
      }, kn = {
        touchstart: ho,
        touchmove: Se,
        touchend: Se,
        touchcancel: Se
      }, gi = {}, Dn = !1;
      function so(t, n, r) {
        return n === "touchstart" && oo(), kn[n] ? (r = kn[n].bind(this, r), t.addEventListener(gs[n], r, !1), r) : (console.warn("wrong event specified:", n), m);
      }
      function no(t, n, r) {
        if (!gs[n]) {
          console.warn("wrong event specified:", n);
          return;
        }
        t.removeEventListener(gs[n], r, !1);
      }
      function ao(t) {
        gi[t.pointerId] = t;
      }
      function ro(t) {
        gi[t.pointerId] && (gi[t.pointerId] = t);
      }
      function Zn(t) {
        delete gi[t.pointerId];
      }
      function oo() {
        Dn || (document.addEventListener(On, ao, !0), document.addEventListener(zn, ro, !0), document.addEventListener(Rn, Zn, !0), document.addEventListener(Bn, Zn, !0), Dn = !0);
      }
      function Se(t, n) {
        if (n.pointerType !== (n.MSPOINTER_TYPE_MOUSE || "mouse")) {
          n.touches = [];
          for (var r in gi)
            n.touches.push(gi[r]);
          n.changedTouches = [n], t(n);
        }
      }
      function ho(t, n) {
        n.MSPOINTER_TYPE_TOUCH && n.pointerType === n.MSPOINTER_TYPE_TOUCH && mt(n), Se(t, n);
      }
      function lo(t) {
        var n = {}, r, c;
        for (c in t)
          r = t[c], n[c] = r && r.bind ? r.bind(t) : r;
        return t = n, n.type = "dblclick", n.detail = 2, n.isTrusted = !1, n._simulated = !0, n;
      }
      var uo = 200;
      function co(t, n) {
        t.addEventListener("dblclick", n);
        var r = 0, c;
        function d(g) {
          if (g.detail !== 1) {
            c = g.detail;
            return;
          }
          if (!(g.pointerType === "mouse" || g.sourceCapabilities && !g.sourceCapabilities.firesTouchEvents)) {
            var y = Hn(g);
            if (!(y.some(function(b) {
              return b instanceof HTMLLabelElement && b.attributes.for;
            }) && !y.some(function(b) {
              return b instanceof HTMLInputElement || b instanceof HTMLSelectElement;
            }))) {
              var P = Date.now();
              P - r <= uo ? (c++, c === 2 && n(lo(g))) : c = 1, r = P;
            }
          }
        }
        return t.addEventListener("click", d), {
          dblclick: n,
          simDblclick: d
        };
      }
      function fo(t, n) {
        t.removeEventListener("dblclick", n.dblclick), t.removeEventListener("click", n.simDblclick);
      }
      var ps = Ae(
        ["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]
      ), Zi = Ae(
        ["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]
      ), Fn = Zi === "webkitTransition" || Zi === "OTransition" ? Zi + "End" : "transitionend";
      function Un(t) {
        return typeof t == "string" ? document.getElementById(t) : t;
      }
      function Fi(t, n) {
        var r = t.style[n] || t.currentStyle && t.currentStyle[n];
        if ((!r || r === "auto") && document.defaultView) {
          var c = document.defaultView.getComputedStyle(t, null);
          r = c ? c[n] : null;
        }
        return r === "auto" ? null : r;
      }
      function K(t, n, r) {
        var c = document.createElement(t);
        return c.className = n || "", r && r.appendChild(c), c;
      }
      function at(t) {
        var n = t.parentNode;
        n && n.removeChild(t);
      }
      function Ee(t) {
        for (; t.firstChild; )
          t.removeChild(t.firstChild);
      }
      function pi(t) {
        var n = t.parentNode;
        n && n.lastChild !== t && n.appendChild(t);
      }
      function vi(t) {
        var n = t.parentNode;
        n && n.firstChild !== t && n.insertBefore(t, n.firstChild);
      }
      function vs(t, n) {
        if (t.classList !== void 0)
          return t.classList.contains(n);
        var r = Te(t);
        return r.length > 0 && new RegExp("(^|\\s)" + n + "(\\s|$)").test(r);
      }
      function j(t, n) {
        if (t.classList !== void 0)
          for (var r = w(n), c = 0, d = r.length; c < d; c++)
            t.classList.add(r[c]);
        else if (!vs(t, n)) {
          var g = Te(t);
          ys(t, (g ? g + " " : "") + n);
        }
      }
      function ht(t, n) {
        t.classList !== void 0 ? t.classList.remove(n) : ys(t, M((" " + Te(t) + " ").replace(" " + n + " ", " ")));
      }
      function ys(t, n) {
        t.className.baseVal === void 0 ? t.className = n : t.className.baseVal = n;
      }
      function Te(t) {
        return t.correspondingElement && (t = t.correspondingElement), t.className.baseVal === void 0 ? t.className : t.className.baseVal;
      }
      function Lt(t, n) {
        "opacity" in t.style ? t.style.opacity = n : "filter" in t.style && _o(t, n);
      }
      function _o(t, n) {
        var r = !1, c = "DXImageTransform.Microsoft.Alpha";
        try {
          r = t.filters.item(c);
        } catch {
          if (n === 1)
            return;
        }
        n = Math.round(n * 100), r ? (r.Enabled = n !== 100, r.Opacity = n) : t.style.filter += " progid:" + c + "(opacity=" + n + ")";
      }
      function Ae(t) {
        for (var n = document.documentElement.style, r = 0; r < t.length; r++)
          if (t[r] in n)
            return t[r];
        return !1;
      }
      function hi(t, n, r) {
        var c = n || new U(0, 0);
        t.style[ps] = (R.ie3d ? "translate(" + c.x + "px," + c.y + "px)" : "translate3d(" + c.x + "px," + c.y + "px,0)") + (r ? " scale(" + r + ")" : "");
      }
      function ct(t, n) {
        t._leaflet_pos = n, R.any3d ? hi(t, n) : (t.style.left = n.x + "px", t.style.top = n.y + "px");
      }
      function li(t) {
        return t._leaflet_pos || new U(0, 0);
      }
      var Ui, qi, Ms;
      if ("onselectstart" in document)
        Ui = function() {
          q(window, "selectstart", mt);
        }, qi = function() {
          st(window, "selectstart", mt);
        };
      else {
        var ji = Ae(
          ["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]
        );
        Ui = function() {
          if (ji) {
            var t = document.documentElement.style;
            Ms = t[ji], t[ji] = "none";
          }
        }, qi = function() {
          ji && (document.documentElement.style[ji] = Ms, Ms = void 0);
        };
      }
      function ws() {
        q(window, "dragstart", mt);
      }
      function xs() {
        st(window, "dragstart", mt);
      }
      var Le, Ps;
      function bs(t) {
        for (; t.tabIndex === -1; )
          t = t.parentNode;
        t.style && (Ce(), Le = t, Ps = t.style.outlineStyle, t.style.outlineStyle = "none", q(window, "keydown", Ce));
      }
      function Ce() {
        Le && (Le.style.outlineStyle = Ps, Le = void 0, Ps = void 0, st(window, "keydown", Ce));
      }
      function qn(t) {
        do
          t = t.parentNode;
        while ((!t.offsetWidth || !t.offsetHeight) && t !== document.body);
        return t;
      }
      function Ss(t) {
        var n = t.getBoundingClientRect();
        return {
          x: n.width / t.offsetWidth || 1,
          y: n.height / t.offsetHeight || 1,
          boundingClientRect: n
        };
      }
      var mo = {
        __proto__: null,
        TRANSFORM: ps,
        TRANSITION: Zi,
        TRANSITION_END: Fn,
        get: Un,
        getStyle: Fi,
        create: K,
        remove: at,
        empty: Ee,
        toFront: pi,
        toBack: vi,
        hasClass: vs,
        addClass: j,
        removeClass: ht,
        setClass: ys,
        getClass: Te,
        setOpacity: Lt,
        testProp: Ae,
        setTransform: hi,
        setPosition: ct,
        getPosition: li,
        get disableTextSelection() {
          return Ui;
        },
        get enableTextSelection() {
          return qi;
        },
        disableImageDrag: ws,
        enableImageDrag: xs,
        preventOutline: bs,
        restoreOutline: Ce,
        getSizedParentNode: qn,
        getScale: Ss
      };
      function q(t, n, r, c) {
        if (n && typeof n == "object")
          for (var d in n)
            Ts(t, d, n[d], r);
        else {
          n = w(n);
          for (var g = 0, y = n.length; g < y; g++)
            Ts(t, n[g], r, c);
        }
        return this;
      }
      var Ut = "_leaflet_events";
      function st(t, n, r, c) {
        if (arguments.length === 1)
          jn(t), delete t[Ut];
        else if (n && typeof n == "object")
          for (var d in n)
            As(t, d, n[d], r);
        else if (n = w(n), arguments.length === 2)
          jn(t, function(P) {
            return z(n, P) !== -1;
          });
        else
          for (var g = 0, y = n.length; g < y; g++)
            As(t, n[g], r, c);
        return this;
      }
      function jn(t, n) {
        for (var r in t[Ut]) {
          var c = r.split(/\d/)[0];
          (!n || n(c)) && As(t, c, null, null, r);
        }
      }
      var Es = {
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        wheel: !("onwheel" in window) && "mousewheel"
      };
      function Ts(t, n, r, c) {
        var d = n + f(r) + (c ? "_" + f(c) : "");
        if (t[Ut] && t[Ut][d])
          return this;
        var g = function(P) {
          return r.call(c || t, P || window.event);
        }, y = g;
        !R.touchNative && R.pointer && n.indexOf("touch") === 0 ? g = so(t, n, g) : R.touch && n === "dblclick" ? g = co(t, g) : "addEventListener" in t ? n === "touchstart" || n === "touchmove" || n === "wheel" || n === "mousewheel" ? t.addEventListener(Es[n] || n, g, R.passiveEvents ? { passive: !1 } : !1) : n === "mouseenter" || n === "mouseleave" ? (g = function(P) {
          P = P || window.event, Cs(t, P) && y(P);
        }, t.addEventListener(Es[n], g, !1)) : t.addEventListener(n, y, !1) : t.attachEvent("on" + n, g), t[Ut] = t[Ut] || {}, t[Ut][d] = g;
      }
      function As(t, n, r, c, d) {
        d = d || n + f(r) + (c ? "_" + f(c) : "");
        var g = t[Ut] && t[Ut][d];
        if (!g)
          return this;
        !R.touchNative && R.pointer && n.indexOf("touch") === 0 ? no(t, n, g) : R.touch && n === "dblclick" ? fo(t, g) : "removeEventListener" in t ? t.removeEventListener(Es[n] || n, g, !1) : t.detachEvent("on" + n, g), t[Ut][d] = null;
      }
      function ui(t) {
        return t.stopPropagation ? t.stopPropagation() : t.originalEvent ? t.originalEvent._stopped = !0 : t.cancelBubble = !0, this;
      }
      function Ls(t) {
        return Ts(t, "wheel", ui), this;
      }
      function Hi(t) {
        return q(t, "mousedown touchstart dblclick contextmenu", ui), t._leaflet_disable_click = !0, this;
      }
      function mt(t) {
        return t.preventDefault ? t.preventDefault() : t.returnValue = !1, this;
      }
      function ci(t) {
        return mt(t), ui(t), this;
      }
      function Hn(t) {
        if (t.composedPath)
          return t.composedPath();
        for (var n = [], r = t.target; r; )
          n.push(r), r = r.parentNode;
        return n;
      }
      function Wn(t, n) {
        if (!n)
          return new U(t.clientX, t.clientY);
        var r = Ss(n), c = r.boundingClientRect;
        return new U(
          // offset.left/top values are in page scale (like clientX/Y),
          // whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
          (t.clientX - c.left) / r.x - n.clientLeft,
          (t.clientY - c.top) / r.y - n.clientTop
        );
      }
      var go = R.linux && R.chrome ? window.devicePixelRatio : R.mac ? window.devicePixelRatio * 3 : window.devicePixelRatio > 0 ? 2 * window.devicePixelRatio : 1;
      function Xn(t) {
        return R.edge ? t.wheelDeltaY / 2 : (
          // Don't trust window-geometry-based delta
          t.deltaY && t.deltaMode === 0 ? -t.deltaY / go : (
            // Pixels
            t.deltaY && t.deltaMode === 1 ? -t.deltaY * 20 : (
              // Lines
              t.deltaY && t.deltaMode === 2 ? -t.deltaY * 60 : (
                // Pages
                t.deltaX || t.deltaZ ? 0 : (
                  // Skip horizontal/depth wheel events
                  t.wheelDelta ? (t.wheelDeltaY || t.wheelDelta) / 2 : (
                    // Legacy IE pixels
                    t.detail && Math.abs(t.detail) < 32765 ? -t.detail * 20 : (
                      // Legacy Moz lines
                      t.detail ? t.detail / -32765 * 60 : (
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
      function Cs(t, n) {
        var r = n.relatedTarget;
        if (!r)
          return !0;
        try {
          for (; r && r !== t; )
            r = r.parentNode;
        } catch {
          return !1;
        }
        return r !== t;
      }
      var po = {
        __proto__: null,
        on: q,
        off: st,
        stopPropagation: ui,
        disableScrollPropagation: Ls,
        disableClickPropagation: Hi,
        preventDefault: mt,
        stop: ci,
        getPropagationPath: Hn,
        getMousePosition: Wn,
        getWheelDelta: Xn,
        isExternalTarget: Cs,
        addListener: q,
        removeListener: st
      }, Yn = Bi.extend({
        // @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
        // Run an animation of a given element to a new position, optionally setting
        // duration in seconds (`0.25` by default) and easing linearity factor (3rd
        // argument of the [cubic bezier curve](https://cubic-bezier.com/#0,0,.5,1),
        // `0.5` by default).
        run: function(t, n, r, c) {
          this.stop(), this._el = t, this._inProgress = !0, this._duration = r || 0.25, this._easeOutPower = 1 / Math.max(c || 0.5, 0.2), this._startPos = li(t), this._offset = n.subtract(this._startPos), this._startTime = +/* @__PURE__ */ new Date(), this.fire("start"), this._animate();
        },
        // @method stop()
        // Stops the animation (if currently running).
        stop: function() {
          this._inProgress && (this._step(!0), this._complete());
        },
        _animate: function() {
          this._animId = $(this._animate, this), this._step();
        },
        _step: function(t) {
          var n = +/* @__PURE__ */ new Date() - this._startTime, r = this._duration * 1e3;
          n < r ? this._runFrame(this._easeOut(n / r), t) : (this._runFrame(1), this._complete());
        },
        _runFrame: function(t, n) {
          var r = this._startPos.add(this._offset.multiplyBy(t));
          n && r._round(), ct(this._el, r), this.fire("step");
        },
        _complete: function() {
          dt(this._animId), this._inProgress = !1, this.fire("end");
        },
        _easeOut: function(t) {
          return 1 - Math.pow(1 - t, this._easeOutPower);
        }
      }), V = Bi.extend({
        options: {
          // @section Map State Options
          // @option crs: CRS = L.CRS.EPSG3857
          // The [Coordinate Reference System](#crs) to use. Don't change this if you're not
          // sure what it means.
          crs: us,
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
        initialize: function(t, n) {
          n = x(this, n), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._sizeChanged = !0, this._initContainer(t), this._initLayout(), this._onResize = l(this._onResize, this), this._initEvents(), n.maxBounds && this.setMaxBounds(n.maxBounds), n.zoom !== void 0 && (this._zoom = this._limitZoom(n.zoom)), n.center && n.zoom !== void 0 && this.setView(Y(n.center), n.zoom, { reset: !0 }), this.callInitHooks(), this._zoomAnimated = Zi && R.any3d && !R.mobileOpera && this.options.zoomAnimation, this._zoomAnimated && (this._createAnimProxy(), q(this._proxy, Fn, this._catchTransitionEnd, this)), this._addLayers(this.options.layers);
        },
        // @section Methods for modifying map state
        // @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
        // Sets the view of the map (geographical center and zoom) with the given
        // animation options.
        setView: function(t, n, r) {
          if (n = n === void 0 ? this._zoom : this._limitZoom(n), t = this._limitCenter(Y(t), n, this.options.maxBounds), r = r || {}, this._stop(), this._loaded && !r.reset && r !== !0) {
            r.animate !== void 0 && (r.zoom = o({ animate: r.animate }, r.zoom), r.pan = o({ animate: r.animate, duration: r.duration }, r.pan));
            var c = this._zoom !== n ? this._tryAnimatedZoom && this._tryAnimatedZoom(t, n, r.zoom) : this._tryAnimatedPan(t, r.pan);
            if (c)
              return clearTimeout(this._sizeTimer), this;
          }
          return this._resetView(t, n, r.pan && r.pan.noMoveStart), this;
        },
        // @method setZoom(zoom: Number, options?: Zoom/pan options): this
        // Sets the zoom of the map.
        setZoom: function(t, n) {
          return this._loaded ? this.setView(this.getCenter(), t, { zoom: n }) : (this._zoom = t, this);
        },
        // @method zoomIn(delta?: Number, options?: Zoom options): this
        // Increases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
        zoomIn: function(t, n) {
          return t = t || (R.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom + t, n);
        },
        // @method zoomOut(delta?: Number, options?: Zoom options): this
        // Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
        zoomOut: function(t, n) {
          return t = t || (R.any3d ? this.options.zoomDelta : 1), this.setZoom(this._zoom - t, n);
        },
        // @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
        // Zooms the map while keeping a specified geographical point on the map
        // stationary (e.g. used internally for scroll zoom and double-click zoom).
        // @alternative
        // @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
        // Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
        setZoomAround: function(t, n, r) {
          var c = this.getZoomScale(n), d = this.getSize().divideBy(2), g = t instanceof U ? t : this.latLngToContainerPoint(t), y = g.subtract(d).multiplyBy(1 - 1 / c), P = this.containerPointToLatLng(d.add(y));
          return this.setView(P, n, { zoom: r });
        },
        _getBoundsCenterZoom: function(t, n) {
          n = n || {}, t = t.getBounds ? t.getBounds() : ut(t);
          var r = F(n.paddingTopLeft || n.padding || [0, 0]), c = F(n.paddingBottomRight || n.padding || [0, 0]), d = this.getBoundsZoom(t, !1, r.add(c));
          if (d = typeof n.maxZoom == "number" ? Math.min(n.maxZoom, d) : d, d === 1 / 0)
            return {
              center: t.getCenter(),
              zoom: d
            };
          var g = c.subtract(r).divideBy(2), y = this.project(t.getSouthWest(), d), P = this.project(t.getNorthEast(), d), b = this.unproject(y.add(P).divideBy(2).add(g), d);
          return {
            center: b,
            zoom: d
          };
        },
        // @method fitBounds(bounds: LatLngBounds, options?: fitBounds options): this
        // Sets a map view that contains the given geographical bounds with the
        // maximum zoom level possible.
        fitBounds: function(t, n) {
          if (t = ut(t), !t.isValid())
            throw new Error("Bounds are not valid.");
          var r = this._getBoundsCenterZoom(t, n);
          return this.setView(r.center, r.zoom, n);
        },
        // @method fitWorld(options?: fitBounds options): this
        // Sets a map view that mostly contains the whole world with the maximum
        // zoom level possible.
        fitWorld: function(t) {
          return this.fitBounds([[-90, -180], [90, 180]], t);
        },
        // @method panTo(latlng: LatLng, options?: Pan options): this
        // Pans the map to a given center.
        panTo: function(t, n) {
          return this.setView(t, this._zoom, { pan: n });
        },
        // @method panBy(offset: Point, options?: Pan options): this
        // Pans the map by a given number of pixels (animated).
        panBy: function(t, n) {
          if (t = F(t).round(), n = n || {}, !t.x && !t.y)
            return this.fire("moveend");
          if (n.animate !== !0 && !this.getSize().contains(t))
            return this._resetView(this.unproject(this.project(this.getCenter()).add(t)), this.getZoom()), this;
          if (this._panAnim || (this._panAnim = new Yn(), this._panAnim.on({
            step: this._onPanTransitionStep,
            end: this._onPanTransitionEnd
          }, this)), n.noMoveStart || this.fire("movestart"), n.animate !== !1) {
            j(this._mapPane, "leaflet-pan-anim");
            var r = this._getMapPanePos().subtract(t).round();
            this._panAnim.run(this._mapPane, r, n.duration || 0.25, n.easeLinearity);
          } else
            this._rawPanBy(t), this.fire("move").fire("moveend");
          return this;
        },
        // @method flyTo(latlng: LatLng, zoom?: Number, options?: Zoom/pan options): this
        // Sets the view of the map (geographical center and zoom) performing a smooth
        // pan-zoom animation.
        flyTo: function(t, n, r) {
          if (r = r || {}, r.animate === !1 || !R.any3d)
            return this.setView(t, n, r);
          this._stop();
          var c = this.project(this.getCenter()), d = this.project(t), g = this.getSize(), y = this._zoom;
          t = Y(t), n = n === void 0 ? y : n;
          var P = Math.max(g.x, g.y), b = P * this.getZoomScale(y, n), T = d.distanceTo(c) || 1, O = 1.42, k = O * O;
          function H(ft) {
            var Ue = ft ? -1 : 1, ah = ft ? b : P, rh = b * b - P * P + Ue * k * k * T * T, oh = 2 * ah * k * T, Fs = rh / oh, Aa = Math.sqrt(Fs * Fs + 1) - Fs, hh = Aa < 1e-9 ? -18 : Math.log(Aa);
            return hh;
          }
          function yt(ft) {
            return (Math.exp(ft) - Math.exp(-ft)) / 2;
          }
          function _t(ft) {
            return (Math.exp(ft) + Math.exp(-ft)) / 2;
          }
          function It(ft) {
            return yt(ft) / _t(ft);
          }
          var Pt = H(0);
          function bi(ft) {
            return P * (_t(Pt) / _t(Pt + O * ft));
          }
          function ih(ft) {
            return P * (_t(Pt) * It(Pt + O * ft) - yt(Pt)) / k;
          }
          function eh(ft) {
            return 1 - Math.pow(1 - ft, 1.5);
          }
          var sh = Date.now(), Ea = (H(1) - Pt) / O, nh = r.duration ? 1e3 * r.duration : 1e3 * Ea * 0.8;
          function Ta() {
            var ft = (Date.now() - sh) / nh, Ue = eh(ft) * Ea;
            ft <= 1 ? (this._flyToFrame = $(Ta, this), this._move(
              this.unproject(c.add(d.subtract(c).multiplyBy(ih(Ue) / T)), y),
              this.getScaleZoom(P / bi(Ue), y),
              { flyTo: !0 }
            )) : this._move(t, n)._moveEnd(!0);
          }
          return this._moveStart(!0, r.noMoveStart), Ta.call(this), this;
        },
        // @method flyToBounds(bounds: LatLngBounds, options?: fitBounds options): this
        // Sets the view of the map with a smooth animation like [`flyTo`](#map-flyto),
        // but takes a bounds parameter like [`fitBounds`](#map-fitbounds).
        flyToBounds: function(t, n) {
          var r = this._getBoundsCenterZoom(t, n);
          return this.flyTo(r.center, r.zoom, n);
        },
        // @method setMaxBounds(bounds: LatLngBounds): this
        // Restricts the map view to the given bounds (see the [maxBounds](#map-maxbounds) option).
        setMaxBounds: function(t) {
          return t = ut(t), this.listens("moveend", this._panInsideMaxBounds) && this.off("moveend", this._panInsideMaxBounds), t.isValid() ? (this.options.maxBounds = t, this._loaded && this._panInsideMaxBounds(), this.on("moveend", this._panInsideMaxBounds)) : (this.options.maxBounds = null, this);
        },
        // @method setMinZoom(zoom: Number): this
        // Sets the lower limit for the available zoom levels (see the [minZoom](#map-minzoom) option).
        setMinZoom: function(t) {
          var n = this.options.minZoom;
          return this.options.minZoom = t, this._loaded && n !== t && (this.fire("zoomlevelschange"), this.getZoom() < this.options.minZoom) ? this.setZoom(t) : this;
        },
        // @method setMaxZoom(zoom: Number): this
        // Sets the upper limit for the available zoom levels (see the [maxZoom](#map-maxzoom) option).
        setMaxZoom: function(t) {
          var n = this.options.maxZoom;
          return this.options.maxZoom = t, this._loaded && n !== t && (this.fire("zoomlevelschange"), this.getZoom() > this.options.maxZoom) ? this.setZoom(t) : this;
        },
        // @method panInsideBounds(bounds: LatLngBounds, options?: Pan options): this
        // Pans the map to the closest view that would lie inside the given bounds (if it's not already), controlling the animation using the options specific, if any.
        panInsideBounds: function(t, n) {
          this._enforcingBounds = !0;
          var r = this.getCenter(), c = this._limitCenter(r, this._zoom, ut(t));
          return r.equals(c) || this.panTo(c, n), this._enforcingBounds = !1, this;
        },
        // @method panInside(latlng: LatLng, options?: padding options): this
        // Pans the map the minimum amount to make the `latlng` visible. Use
        // padding options to fit the display to more restricted bounds.
        // If `latlng` is already within the (optionally padded) display bounds,
        // the map will not be panned.
        panInside: function(t, n) {
          n = n || {};
          var r = F(n.paddingTopLeft || n.padding || [0, 0]), c = F(n.paddingBottomRight || n.padding || [0, 0]), d = this.project(this.getCenter()), g = this.project(t), y = this.getPixelBounds(), P = wt([y.min.add(r), y.max.subtract(c)]), b = P.getSize();
          if (!P.contains(g)) {
            this._enforcingBounds = !0;
            var T = g.subtract(P.getCenter()), O = P.extend(g).getSize().subtract(b);
            d.x += T.x < 0 ? -O.x : O.x, d.y += T.y < 0 ? -O.y : O.y, this.panTo(this.unproject(d), n), this._enforcingBounds = !1;
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
        invalidateSize: function(t) {
          if (!this._loaded)
            return this;
          t = o({
            animate: !1,
            pan: !0
          }, t === !0 ? { animate: !0 } : t);
          var n = this.getSize();
          this._sizeChanged = !0, this._lastCenter = null;
          var r = this.getSize(), c = n.divideBy(2).round(), d = r.divideBy(2).round(), g = c.subtract(d);
          return !g.x && !g.y ? this : (t.animate && t.pan ? this.panBy(g) : (t.pan && this._rawPanBy(g), this.fire("move"), t.debounceMoveend ? (clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(l(this.fire, this, "moveend"), 200)) : this.fire("moveend")), this.fire("resize", {
            oldSize: n,
            newSize: r
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
        locate: function(t) {
          if (t = this._locateOptions = o({
            timeout: 1e4,
            watch: !1
            // setView: false
            // maxZoom: <Number>
            // maximumAge: 0
            // enableHighAccuracy: false
          }, t), !("geolocation" in navigator))
            return this._handleGeolocationError({
              code: 0,
              message: "Geolocation not supported."
            }), this;
          var n = l(this._handleGeolocationResponse, this), r = l(this._handleGeolocationError, this);
          return t.watch ? this._locationWatchId = navigator.geolocation.watchPosition(n, r, t) : navigator.geolocation.getCurrentPosition(n, r, t), this;
        },
        // @method stopLocate(): this
        // Stops watching location previously initiated by `map.locate({watch: true})`
        // and aborts resetting the map view if map.locate was called with
        // `{setView: true}`.
        stopLocate: function() {
          return navigator.geolocation && navigator.geolocation.clearWatch && navigator.geolocation.clearWatch(this._locationWatchId), this._locateOptions && (this._locateOptions.setView = !1), this;
        },
        _handleGeolocationError: function(t) {
          if (this._container._leaflet_id) {
            var n = t.code, r = t.message || (n === 1 ? "permission denied" : n === 2 ? "position unavailable" : "timeout");
            this._locateOptions.setView && !this._loaded && this.fitWorld(), this.fire("locationerror", {
              code: n,
              message: "Geolocation error: " + r + "."
            });
          }
        },
        _handleGeolocationResponse: function(t) {
          if (this._container._leaflet_id) {
            var n = t.coords.latitude, r = t.coords.longitude, c = new tt(n, r), d = c.toBounds(t.coords.accuracy * 2), g = this._locateOptions;
            if (g.setView) {
              var y = this.getBoundsZoom(d);
              this.setView(c, g.maxZoom ? Math.min(y, g.maxZoom) : y);
            }
            var P = {
              latlng: c,
              bounds: d,
              timestamp: t.timestamp
            };
            for (var b in t.coords)
              typeof t.coords[b] == "number" && (P[b] = t.coords[b]);
            this.fire("locationfound", P);
          }
        },
        // TODO Appropriate docs section?
        // @section Other Methods
        // @method addHandler(name: String, HandlerClass: Function): this
        // Adds a new `Handler` to the map, given its name and constructor function.
        addHandler: function(t, n) {
          if (!n)
            return this;
          var r = this[t] = new n(this);
          return this._handlers.push(r), this.options[t] && r.enable(), this;
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
          this._locationWatchId !== void 0 && this.stopLocate(), this._stop(), at(this._mapPane), this._clearControlPos && this._clearControlPos(), this._resizeRequest && (dt(this._resizeRequest), this._resizeRequest = null), this._clearHandlers(), this._loaded && this.fire("unload");
          var t;
          for (t in this._layers)
            this._layers[t].remove();
          for (t in this._panes)
            at(this._panes[t]);
          return this._layers = [], this._panes = [], delete this._mapPane, delete this._renderer, this;
        },
        // @section Other Methods
        // @method createPane(name: String, container?: HTMLElement): HTMLElement
        // Creates a new [map pane](#map-pane) with the given name if it doesn't exist already,
        // then returns it. The pane is created as a child of `container`, or
        // as a child of the main map pane if not set.
        createPane: function(t, n) {
          var r = "leaflet-pane" + (t ? " leaflet-" + t.replace("Pane", "") + "-pane" : ""), c = K("div", r, n || this._mapPane);
          return t && (this._panes[t] = c), c;
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
          var t = this.getPixelBounds(), n = this.unproject(t.getBottomLeft()), r = this.unproject(t.getTopRight());
          return new xt(n, r);
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
        getBoundsZoom: function(t, n, r) {
          t = ut(t), r = F(r || [0, 0]);
          var c = this.getZoom() || 0, d = this.getMinZoom(), g = this.getMaxZoom(), y = t.getNorthWest(), P = t.getSouthEast(), b = this.getSize().subtract(r), T = wt(this.project(P, c), this.project(y, c)).getSize(), O = R.any3d ? this.options.zoomSnap : 1, k = b.x / T.x, H = b.y / T.y, yt = n ? Math.max(k, H) : Math.min(k, H);
          return c = this.getScaleZoom(yt, c), O && (c = Math.round(c / (O / 100)) * (O / 100), c = n ? Math.ceil(c / O) * O : Math.floor(c / O) * O), Math.max(d, Math.min(g, c));
        },
        // @method getSize(): Point
        // Returns the current size of the map container (in pixels).
        getSize: function() {
          return (!this._size || this._sizeChanged) && (this._size = new U(
            this._container.clientWidth || 0,
            this._container.clientHeight || 0
          ), this._sizeChanged = !1), this._size.clone();
        },
        // @method getPixelBounds(): Bounds
        // Returns the bounds of the current map view in projected pixel
        // coordinates (sometimes useful in layer and overlay implementations).
        getPixelBounds: function(t, n) {
          var r = this._getTopLeftPoint(t, n);
          return new nt(r, r.add(this.getSize()));
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
        getPixelWorldBounds: function(t) {
          return this.options.crs.getProjectedBounds(t === void 0 ? this.getZoom() : t);
        },
        // @section Other Methods
        // @method getPane(pane: String|HTMLElement): HTMLElement
        // Returns a [map pane](#map-pane), given its name or its HTML element (its identity).
        getPane: function(t) {
          return typeof t == "string" ? this._panes[t] : t;
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
        getZoomScale: function(t, n) {
          var r = this.options.crs;
          return n = n === void 0 ? this._zoom : n, r.scale(t) / r.scale(n);
        },
        // @method getScaleZoom(scale: Number, fromZoom: Number): Number
        // Returns the zoom level that the map would end up at, if it is at `fromZoom`
        // level and everything is scaled by a factor of `scale`. Inverse of
        // [`getZoomScale`](#map-getZoomScale).
        getScaleZoom: function(t, n) {
          var r = this.options.crs;
          n = n === void 0 ? this._zoom : n;
          var c = r.zoom(t * r.scale(n));
          return isNaN(c) ? 1 / 0 : c;
        },
        // @method project(latlng: LatLng, zoom: Number): Point
        // Projects a geographical coordinate `LatLng` according to the projection
        // of the map's CRS, then scales it according to `zoom` and the CRS's
        // `Transformation`. The result is pixel coordinate relative to
        // the CRS origin.
        project: function(t, n) {
          return n = n === void 0 ? this._zoom : n, this.options.crs.latLngToPoint(Y(t), n);
        },
        // @method unproject(point: Point, zoom: Number): LatLng
        // Inverse of [`project`](#map-project).
        unproject: function(t, n) {
          return n = n === void 0 ? this._zoom : n, this.options.crs.pointToLatLng(F(t), n);
        },
        // @method layerPointToLatLng(point: Point): LatLng
        // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
        // returns the corresponding geographical coordinate (for the current zoom level).
        layerPointToLatLng: function(t) {
          var n = F(t).add(this.getPixelOrigin());
          return this.unproject(n);
        },
        // @method latLngToLayerPoint(latlng: LatLng): Point
        // Given a geographical coordinate, returns the corresponding pixel coordinate
        // relative to the [origin pixel](#map-getpixelorigin).
        latLngToLayerPoint: function(t) {
          var n = this.project(Y(t))._round();
          return n._subtract(this.getPixelOrigin());
        },
        // @method wrapLatLng(latlng: LatLng): LatLng
        // Returns a `LatLng` where `lat` and `lng` has been wrapped according to the
        // map's CRS's `wrapLat` and `wrapLng` properties, if they are outside the
        // CRS's bounds.
        // By default this means longitude is wrapped around the dateline so its
        // value is between -180 and +180 degrees.
        wrapLatLng: function(t) {
          return this.options.crs.wrapLatLng(Y(t));
        },
        // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
        // Returns a `LatLngBounds` with the same size as the given one, ensuring that
        // its center is within the CRS's bounds.
        // By default this means the center longitude is wrapped around the dateline so its
        // value is between -180 and +180 degrees, and the majority of the bounds
        // overlaps the CRS's bounds.
        wrapLatLngBounds: function(t) {
          return this.options.crs.wrapLatLngBounds(ut(t));
        },
        // @method distance(latlng1: LatLng, latlng2: LatLng): Number
        // Returns the distance between two geographical coordinates according to
        // the map's CRS. By default this measures distance in meters.
        distance: function(t, n) {
          return this.options.crs.distance(Y(t), Y(n));
        },
        // @method containerPointToLayerPoint(point: Point): Point
        // Given a pixel coordinate relative to the map container, returns the corresponding
        // pixel coordinate relative to the [origin pixel](#map-getpixelorigin).
        containerPointToLayerPoint: function(t) {
          return F(t).subtract(this._getMapPanePos());
        },
        // @method layerPointToContainerPoint(point: Point): Point
        // Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
        // returns the corresponding pixel coordinate relative to the map container.
        layerPointToContainerPoint: function(t) {
          return F(t).add(this._getMapPanePos());
        },
        // @method containerPointToLatLng(point: Point): LatLng
        // Given a pixel coordinate relative to the map container, returns
        // the corresponding geographical coordinate (for the current zoom level).
        containerPointToLatLng: function(t) {
          var n = this.containerPointToLayerPoint(F(t));
          return this.layerPointToLatLng(n);
        },
        // @method latLngToContainerPoint(latlng: LatLng): Point
        // Given a geographical coordinate, returns the corresponding pixel coordinate
        // relative to the map container.
        latLngToContainerPoint: function(t) {
          return this.layerPointToContainerPoint(this.latLngToLayerPoint(Y(t)));
        },
        // @method mouseEventToContainerPoint(ev: MouseEvent): Point
        // Given a MouseEvent object, returns the pixel coordinate relative to the
        // map container where the event took place.
        mouseEventToContainerPoint: function(t) {
          return Wn(t, this._container);
        },
        // @method mouseEventToLayerPoint(ev: MouseEvent): Point
        // Given a MouseEvent object, returns the pixel coordinate relative to
        // the [origin pixel](#map-getpixelorigin) where the event took place.
        mouseEventToLayerPoint: function(t) {
          return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(t));
        },
        // @method mouseEventToLatLng(ev: MouseEvent): LatLng
        // Given a MouseEvent object, returns geographical coordinate where the
        // event took place.
        mouseEventToLatLng: function(t) {
          return this.layerPointToLatLng(this.mouseEventToLayerPoint(t));
        },
        // map initialization methods
        _initContainer: function(t) {
          var n = this._container = Un(t);
          if (n) {
            if (n._leaflet_id)
              throw new Error("Map container is already initialized.");
          } else throw new Error("Map container not found.");
          q(n, "scroll", this._onScroll, this), this._containerId = f(n);
        },
        _initLayout: function() {
          var t = this._container;
          this._fadeAnimated = this.options.fadeAnimation && R.any3d, j(t, "leaflet-container" + (R.touch ? " leaflet-touch" : "") + (R.retina ? " leaflet-retina" : "") + (R.ielt9 ? " leaflet-oldie" : "") + (R.safari ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));
          var n = Fi(t, "position");
          n !== "absolute" && n !== "relative" && n !== "fixed" && n !== "sticky" && (t.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos();
        },
        _initPanes: function() {
          var t = this._panes = {};
          this._paneRenderers = {}, this._mapPane = this.createPane("mapPane", this._container), ct(this._mapPane, new U(0, 0)), this.createPane("tilePane"), this.createPane("overlayPane"), this.createPane("shadowPane"), this.createPane("markerPane"), this.createPane("tooltipPane"), this.createPane("popupPane"), this.options.markerZoomAnimation || (j(t.markerPane, "leaflet-zoom-hide"), j(t.shadowPane, "leaflet-zoom-hide"));
        },
        // private methods that modify map state
        // @section Map state change events
        _resetView: function(t, n, r) {
          ct(this._mapPane, new U(0, 0));
          var c = !this._loaded;
          this._loaded = !0, n = this._limitZoom(n), this.fire("viewprereset");
          var d = this._zoom !== n;
          this._moveStart(d, r)._move(t, n)._moveEnd(d), this.fire("viewreset"), c && this.fire("load");
        },
        _moveStart: function(t, n) {
          return t && this.fire("zoomstart"), n || this.fire("movestart"), this;
        },
        _move: function(t, n, r, c) {
          n === void 0 && (n = this._zoom);
          var d = this._zoom !== n;
          return this._zoom = n, this._lastCenter = t, this._pixelOrigin = this._getNewPixelOrigin(t), c ? r && r.pinch && this.fire("zoom", r) : ((d || r && r.pinch) && this.fire("zoom", r), this.fire("move", r)), this;
        },
        _moveEnd: function(t) {
          return t && this.fire("zoomend"), this.fire("moveend");
        },
        _stop: function() {
          return dt(this._flyToFrame), this._panAnim && this._panAnim.stop(), this;
        },
        _rawPanBy: function(t) {
          ct(this._mapPane, this._getMapPanePos().subtract(t));
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
        _initEvents: function(t) {
          this._targets = {}, this._targets[f(this._container)] = this;
          var n = t ? st : q;
          n(this._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress keydown keyup", this._handleDOMEvent, this), this.options.trackResize && n(window, "resize", this._onResize, this), R.any3d && this.options.transform3DLimit && (t ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
        },
        _onResize: function() {
          dt(this._resizeRequest), this._resizeRequest = $(
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
          var t = this._getMapPanePos();
          Math.max(Math.abs(t.x), Math.abs(t.y)) >= this.options.transform3DLimit && this._resetView(this.getCenter(), this.getZoom());
        },
        _findEventTargets: function(t, n) {
          for (var r = [], c, d = n === "mouseout" || n === "mouseover", g = t.target || t.srcElement, y = !1; g; ) {
            if (c = this._targets[f(g)], c && (n === "click" || n === "preclick") && this._draggableMoved(c)) {
              y = !0;
              break;
            }
            if (c && c.listens(n, !0) && (d && !Cs(g, t) || (r.push(c), d)) || g === this._container)
              break;
            g = g.parentNode;
          }
          return !r.length && !y && !d && this.listens(n, !0) && (r = [this]), r;
        },
        _isClickDisabled: function(t) {
          for (; t && t !== this._container; ) {
            if (t._leaflet_disable_click)
              return !0;
            t = t.parentNode;
          }
        },
        _handleDOMEvent: function(t) {
          var n = t.target || t.srcElement;
          if (!(!this._loaded || n._leaflet_disable_events || t.type === "click" && this._isClickDisabled(n))) {
            var r = t.type;
            r === "mousedown" && bs(n), this._fireDOMEvent(t, r);
          }
        },
        _mouseEvents: ["click", "dblclick", "mouseover", "mouseout", "contextmenu"],
        _fireDOMEvent: function(t, n, r) {
          if (t.type === "click") {
            var c = o({}, t);
            c.type = "preclick", this._fireDOMEvent(c, c.type, r);
          }
          var d = this._findEventTargets(t, n);
          if (r) {
            for (var g = [], y = 0; y < r.length; y++)
              r[y].listens(n, !0) && g.push(r[y]);
            d = g.concat(d);
          }
          if (d.length) {
            n === "contextmenu" && mt(t);
            var P = d[0], b = {
              originalEvent: t
            };
            if (t.type !== "keypress" && t.type !== "keydown" && t.type !== "keyup") {
              var T = P.getLatLng && (!P._radius || P._radius <= 10);
              b.containerPoint = T ? this.latLngToContainerPoint(P.getLatLng()) : this.mouseEventToContainerPoint(t), b.layerPoint = this.containerPointToLayerPoint(b.containerPoint), b.latlng = T ? P.getLatLng() : this.layerPointToLatLng(b.layerPoint);
            }
            for (y = 0; y < d.length; y++)
              if (d[y].fire(n, b, !0), b.originalEvent._stopped || d[y].options.bubblingMouseEvents === !1 && z(this._mouseEvents, n) !== -1)
                return;
          }
        },
        _draggableMoved: function(t) {
          return t = t.dragging && t.dragging.enabled() ? t : this, t.dragging && t.dragging.moved() || this.boxZoom && this.boxZoom.moved();
        },
        _clearHandlers: function() {
          for (var t = 0, n = this._handlers.length; t < n; t++)
            this._handlers[t].disable();
        },
        // @section Other Methods
        // @method whenReady(fn: Function, context?: Object): this
        // Runs the given function `fn` when the map gets initialized with
        // a view (center and zoom) and at least one layer, or immediately
        // if it's already initialized, optionally passing a function context.
        whenReady: function(t, n) {
          return this._loaded ? t.call(n || this, { target: this }) : this.on("load", t, n), this;
        },
        // private methods for getting map state
        _getMapPanePos: function() {
          return li(this._mapPane) || new U(0, 0);
        },
        _moved: function() {
          var t = this._getMapPanePos();
          return t && !t.equals([0, 0]);
        },
        _getTopLeftPoint: function(t, n) {
          var r = t && n !== void 0 ? this._getNewPixelOrigin(t, n) : this.getPixelOrigin();
          return r.subtract(this._getMapPanePos());
        },
        _getNewPixelOrigin: function(t, n) {
          var r = this.getSize()._divideBy(2);
          return this.project(t, n)._subtract(r)._add(this._getMapPanePos())._round();
        },
        _latLngToNewLayerPoint: function(t, n, r) {
          var c = this._getNewPixelOrigin(r, n);
          return this.project(t, n)._subtract(c);
        },
        _latLngBoundsToNewLayerBounds: function(t, n, r) {
          var c = this._getNewPixelOrigin(r, n);
          return wt([
            this.project(t.getSouthWest(), n)._subtract(c),
            this.project(t.getNorthWest(), n)._subtract(c),
            this.project(t.getSouthEast(), n)._subtract(c),
            this.project(t.getNorthEast(), n)._subtract(c)
          ]);
        },
        // layer point of the current center
        _getCenterLayerPoint: function() {
          return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
        },
        // offset of the specified place to the current center in pixels
        _getCenterOffset: function(t) {
          return this.latLngToLayerPoint(t).subtract(this._getCenterLayerPoint());
        },
        // adjust center for view to get inside bounds
        _limitCenter: function(t, n, r) {
          if (!r)
            return t;
          var c = this.project(t, n), d = this.getSize().divideBy(2), g = new nt(c.subtract(d), c.add(d)), y = this._getBoundsOffset(g, r, n);
          return Math.abs(y.x) <= 1 && Math.abs(y.y) <= 1 ? t : this.unproject(c.add(y), n);
        },
        // adjust offset for view to get inside bounds
        _limitOffset: function(t, n) {
          if (!n)
            return t;
          var r = this.getPixelBounds(), c = new nt(r.min.add(t), r.max.add(t));
          return t.add(this._getBoundsOffset(c, n));
        },
        // returns offset needed for pxBounds to get inside maxBounds at a specified zoom
        _getBoundsOffset: function(t, n, r) {
          var c = wt(
            this.project(n.getNorthEast(), r),
            this.project(n.getSouthWest(), r)
          ), d = c.min.subtract(t.min), g = c.max.subtract(t.max), y = this._rebound(d.x, -g.x), P = this._rebound(d.y, -g.y);
          return new U(y, P);
        },
        _rebound: function(t, n) {
          return t + n > 0 ? Math.round(t - n) / 2 : Math.max(0, Math.ceil(t)) - Math.max(0, Math.floor(n));
        },
        _limitZoom: function(t) {
          var n = this.getMinZoom(), r = this.getMaxZoom(), c = R.any3d ? this.options.zoomSnap : 1;
          return c && (t = Math.round(t / c) * c), Math.max(n, Math.min(r, t));
        },
        _onPanTransitionStep: function() {
          this.fire("move");
        },
        _onPanTransitionEnd: function() {
          ht(this._mapPane, "leaflet-pan-anim"), this.fire("moveend");
        },
        _tryAnimatedPan: function(t, n) {
          var r = this._getCenterOffset(t)._trunc();
          return (n && n.animate) !== !0 && !this.getSize().contains(r) ? !1 : (this.panBy(r, n), !0);
        },
        _createAnimProxy: function() {
          var t = this._proxy = K("div", "leaflet-proxy leaflet-zoom-animated");
          this._panes.mapPane.appendChild(t), this.on("zoomanim", function(n) {
            var r = ps, c = this._proxy.style[r];
            hi(this._proxy, this.project(n.center, n.zoom), this.getZoomScale(n.zoom, 1)), c === this._proxy.style[r] && this._animatingZoom && this._onZoomTransitionEnd();
          }, this), this.on("load moveend", this._animMoveEnd, this), this._on("unload", this._destroyAnimProxy, this);
        },
        _destroyAnimProxy: function() {
          at(this._proxy), this.off("load moveend", this._animMoveEnd, this), delete this._proxy;
        },
        _animMoveEnd: function() {
          var t = this.getCenter(), n = this.getZoom();
          hi(this._proxy, this.project(t, n), this.getZoomScale(n, 1));
        },
        _catchTransitionEnd: function(t) {
          this._animatingZoom && t.propertyName.indexOf("transform") >= 0 && this._onZoomTransitionEnd();
        },
        _nothingToAnimate: function() {
          return !this._container.getElementsByClassName("leaflet-zoom-animated").length;
        },
        _tryAnimatedZoom: function(t, n, r) {
          if (this._animatingZoom)
            return !0;
          if (r = r || {}, !this._zoomAnimated || r.animate === !1 || this._nothingToAnimate() || Math.abs(n - this._zoom) > this.options.zoomAnimationThreshold)
            return !1;
          var c = this.getZoomScale(n), d = this._getCenterOffset(t)._divideBy(1 - 1 / c);
          return r.animate !== !0 && !this.getSize().contains(d) ? !1 : ($(function() {
            this._moveStart(!0, r.noMoveStart || !1)._animateZoom(t, n, !0);
          }, this), !0);
        },
        _animateZoom: function(t, n, r, c) {
          this._mapPane && (r && (this._animatingZoom = !0, this._animateToCenter = t, this._animateToZoom = n, j(this._mapPane, "leaflet-zoom-anim")), this.fire("zoomanim", {
            center: t,
            zoom: n,
            noUpdate: c
          }), this._tempFireZoomEvent || (this._tempFireZoomEvent = this._zoom !== this._animateToZoom), this._move(this._animateToCenter, this._animateToZoom, void 0, !0), setTimeout(l(this._onZoomTransitionEnd, this), 250));
        },
        _onZoomTransitionEnd: function() {
          this._animatingZoom && (this._mapPane && ht(this._mapPane, "leaflet-zoom-anim"), this._animatingZoom = !1, this._move(this._animateToCenter, this._animateToZoom, void 0, !0), this._tempFireZoomEvent && this.fire("zoom"), delete this._tempFireZoomEvent, this.fire("move"), this._moveEnd(!0));
        }
      });
      function vo(t, n) {
        return new V(t, n);
      }
      var Ot = Zt.extend({
        // @section
        // @aka Control Options
        options: {
          // @option position: String = 'topright'
          // The position of the control (one of the map corners). Possible values are `'topleft'`,
          // `'topright'`, `'bottomleft'` or `'bottomright'`
          position: "topright"
        },
        initialize: function(t) {
          x(this, t);
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
        setPosition: function(t) {
          var n = this._map;
          return n && n.removeControl(this), this.options.position = t, n && n.addControl(this), this;
        },
        // @method getContainer: HTMLElement
        // Returns the HTMLElement that contains the control.
        getContainer: function() {
          return this._container;
        },
        // @method addTo(map: Map): this
        // Adds the control to the given map.
        addTo: function(t) {
          this.remove(), this._map = t;
          var n = this._container = this.onAdd(t), r = this.getPosition(), c = t._controlCorners[r];
          return j(n, "leaflet-control"), r.indexOf("bottom") !== -1 ? c.insertBefore(n, c.firstChild) : c.appendChild(n), this._map.on("unload", this.remove, this), this;
        },
        // @method remove: this
        // Removes the control from the map it is currently active on.
        remove: function() {
          return this._map ? (at(this._container), this.onRemove && this.onRemove(this._map), this._map.off("unload", this.remove, this), this._map = null, this) : this;
        },
        _refocusOnMap: function(t) {
          this._map && t && t.screenX > 0 && t.screenY > 0 && this._map.getContainer().focus();
        }
      }), Wi = function(t) {
        return new Ot(t);
      };
      V.include({
        // @method addControl(control: Control): this
        // Adds the given control to the map
        addControl: function(t) {
          return t.addTo(this), this;
        },
        // @method removeControl(control: Control): this
        // Removes the given control from the map
        removeControl: function(t) {
          return t.remove(), this;
        },
        _initControlPos: function() {
          var t = this._controlCorners = {}, n = "leaflet-", r = this._controlContainer = K("div", n + "control-container", this._container);
          function c(d, g) {
            var y = n + d + " " + n + g;
            t[d + g] = K("div", y, r);
          }
          c("top", "left"), c("top", "right"), c("bottom", "left"), c("bottom", "right");
        },
        _clearControlPos: function() {
          for (var t in this._controlCorners)
            at(this._controlCorners[t]);
          at(this._controlContainer), delete this._controlCorners, delete this._controlContainer;
        }
      });
      var Vn = Ot.extend({
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
          sortFunction: function(t, n, r, c) {
            return r < c ? -1 : c < r ? 1 : 0;
          }
        },
        initialize: function(t, n, r) {
          x(this, r), this._layerControlInputs = [], this._layers = [], this._lastZIndex = 0, this._handlingClick = !1, this._preventClick = !1;
          for (var c in t)
            this._addLayer(t[c], c);
          for (c in n)
            this._addLayer(n[c], c, !0);
        },
        onAdd: function(t) {
          this._initLayout(), this._update(), this._map = t, t.on("zoomend", this._checkDisabledLayers, this);
          for (var n = 0; n < this._layers.length; n++)
            this._layers[n].layer.on("add remove", this._onLayerChange, this);
          return this._container;
        },
        addTo: function(t) {
          return Ot.prototype.addTo.call(this, t), this._expandIfNotCollapsed();
        },
        onRemove: function() {
          this._map.off("zoomend", this._checkDisabledLayers, this);
          for (var t = 0; t < this._layers.length; t++)
            this._layers[t].layer.off("add remove", this._onLayerChange, this);
        },
        // @method addBaseLayer(layer: Layer, name: String): this
        // Adds a base layer (radio button entry) with the given name to the control.
        addBaseLayer: function(t, n) {
          return this._addLayer(t, n), this._map ? this._update() : this;
        },
        // @method addOverlay(layer: Layer, name: String): this
        // Adds an overlay (checkbox entry) with the given name to the control.
        addOverlay: function(t, n) {
          return this._addLayer(t, n, !0), this._map ? this._update() : this;
        },
        // @method removeLayer(layer: Layer): this
        // Remove the given layer from the control.
        removeLayer: function(t) {
          t.off("add remove", this._onLayerChange, this);
          var n = this._getLayer(f(t));
          return n && this._layers.splice(this._layers.indexOf(n), 1), this._map ? this._update() : this;
        },
        // @method expand(): this
        // Expand the control container if collapsed.
        expand: function() {
          j(this._container, "leaflet-control-layers-expanded"), this._section.style.height = null;
          var t = this._map.getSize().y - (this._container.offsetTop + 50);
          return t < this._section.clientHeight ? (j(this._section, "leaflet-control-layers-scrollbar"), this._section.style.height = t + "px") : ht(this._section, "leaflet-control-layers-scrollbar"), this._checkDisabledLayers(), this;
        },
        // @method collapse(): this
        // Collapse the control container if expanded.
        collapse: function() {
          return ht(this._container, "leaflet-control-layers-expanded"), this;
        },
        _initLayout: function() {
          var t = "leaflet-control-layers", n = this._container = K("div", t), r = this.options.collapsed;
          n.setAttribute("aria-haspopup", !0), Hi(n), Ls(n);
          var c = this._section = K("section", t + "-list");
          r && (this._map.on("click", this.collapse, this), q(n, {
            mouseenter: this._expandSafely,
            mouseleave: this.collapse
          }, this));
          var d = this._layersLink = K("a", t + "-toggle", n);
          d.href = "#", d.title = "Layers", d.setAttribute("role", "button"), q(d, {
            keydown: function(g) {
              g.keyCode === 13 && this._expandSafely();
            },
            // Certain screen readers intercept the key event and instead send a click event
            click: function(g) {
              mt(g), this._expandSafely();
            }
          }, this), r || this.expand(), this._baseLayersList = K("div", t + "-base", c), this._separator = K("div", t + "-separator", c), this._overlaysList = K("div", t + "-overlays", c), n.appendChild(c);
        },
        _getLayer: function(t) {
          for (var n = 0; n < this._layers.length; n++)
            if (this._layers[n] && f(this._layers[n].layer) === t)
              return this._layers[n];
        },
        _addLayer: function(t, n, r) {
          this._map && t.on("add remove", this._onLayerChange, this), this._layers.push({
            layer: t,
            name: n,
            overlay: r
          }), this.options.sortLayers && this._layers.sort(l(function(c, d) {
            return this.options.sortFunction(c.layer, d.layer, c.name, d.name);
          }, this)), this.options.autoZIndex && t.setZIndex && (this._lastZIndex++, t.setZIndex(this._lastZIndex)), this._expandIfNotCollapsed();
        },
        _update: function() {
          if (!this._container)
            return this;
          Ee(this._baseLayersList), Ee(this._overlaysList), this._layerControlInputs = [];
          var t, n, r, c, d = 0;
          for (r = 0; r < this._layers.length; r++)
            c = this._layers[r], this._addItem(c), n = n || c.overlay, t = t || !c.overlay, d += c.overlay ? 0 : 1;
          return this.options.hideSingleBase && (t = t && d > 1, this._baseLayersList.style.display = t ? "" : "none"), this._separator.style.display = n && t ? "" : "none", this;
        },
        _onLayerChange: function(t) {
          this._handlingClick || this._update();
          var n = this._getLayer(f(t.target)), r = n.overlay ? t.type === "add" ? "overlayadd" : "overlayremove" : t.type === "add" ? "baselayerchange" : null;
          r && this._map.fire(r, n);
        },
        // IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see https://stackoverflow.com/a/119079)
        _createRadioElement: function(t, n) {
          var r = '<input type="radio" class="leaflet-control-layers-selector" name="' + t + '"' + (n ? ' checked="checked"' : "") + "/>", c = document.createElement("div");
          return c.innerHTML = r, c.firstChild;
        },
        _addItem: function(t) {
          var n = document.createElement("label"), r = this._map.hasLayer(t.layer), c;
          t.overlay ? (c = document.createElement("input"), c.type = "checkbox", c.className = "leaflet-control-layers-selector", c.defaultChecked = r) : c = this._createRadioElement("leaflet-base-layers_" + f(this), r), this._layerControlInputs.push(c), c.layerId = f(t.layer), q(c, "click", this._onInputClick, this);
          var d = document.createElement("span");
          d.innerHTML = " " + t.name;
          var g = document.createElement("span");
          n.appendChild(g), g.appendChild(c), g.appendChild(d);
          var y = t.overlay ? this._overlaysList : this._baseLayersList;
          return y.appendChild(n), this._checkDisabledLayers(), n;
        },
        _onInputClick: function() {
          if (!this._preventClick) {
            var t = this._layerControlInputs, n, r, c = [], d = [];
            this._handlingClick = !0;
            for (var g = t.length - 1; g >= 0; g--)
              n = t[g], r = this._getLayer(n.layerId).layer, n.checked ? c.push(r) : n.checked || d.push(r);
            for (g = 0; g < d.length; g++)
              this._map.hasLayer(d[g]) && this._map.removeLayer(d[g]);
            for (g = 0; g < c.length; g++)
              this._map.hasLayer(c[g]) || this._map.addLayer(c[g]);
            this._handlingClick = !1, this._refocusOnMap();
          }
        },
        _checkDisabledLayers: function() {
          for (var t = this._layerControlInputs, n, r, c = this._map.getZoom(), d = t.length - 1; d >= 0; d--)
            n = t[d], r = this._getLayer(n.layerId).layer, n.disabled = r.options.minZoom !== void 0 && c < r.options.minZoom || r.options.maxZoom !== void 0 && c > r.options.maxZoom;
        },
        _expandIfNotCollapsed: function() {
          return this._map && !this.options.collapsed && this.expand(), this;
        },
        _expandSafely: function() {
          var t = this._section;
          this._preventClick = !0, q(t, "click", mt), this.expand();
          var n = this;
          setTimeout(function() {
            st(t, "click", mt), n._preventClick = !1;
          });
        }
      }), yo = function(t, n, r) {
        return new Vn(t, n, r);
      }, Is = Ot.extend({
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
        onAdd: function(t) {
          var n = "leaflet-control-zoom", r = K("div", n + " leaflet-bar"), c = this.options;
          return this._zoomInButton = this._createButton(
            c.zoomInText,
            c.zoomInTitle,
            n + "-in",
            r,
            this._zoomIn
          ), this._zoomOutButton = this._createButton(
            c.zoomOutText,
            c.zoomOutTitle,
            n + "-out",
            r,
            this._zoomOut
          ), this._updateDisabled(), t.on("zoomend zoomlevelschange", this._updateDisabled, this), r;
        },
        onRemove: function(t) {
          t.off("zoomend zoomlevelschange", this._updateDisabled, this);
        },
        disable: function() {
          return this._disabled = !0, this._updateDisabled(), this;
        },
        enable: function() {
          return this._disabled = !1, this._updateDisabled(), this;
        },
        _zoomIn: function(t) {
          !this._disabled && this._map._zoom < this._map.getMaxZoom() && this._map.zoomIn(this._map.options.zoomDelta * (t.shiftKey ? 3 : 1));
        },
        _zoomOut: function(t) {
          !this._disabled && this._map._zoom > this._map.getMinZoom() && this._map.zoomOut(this._map.options.zoomDelta * (t.shiftKey ? 3 : 1));
        },
        _createButton: function(t, n, r, c, d) {
          var g = K("a", r, c);
          return g.innerHTML = t, g.href = "#", g.title = n, g.setAttribute("role", "button"), g.setAttribute("aria-label", n), Hi(g), q(g, "click", ci), q(g, "click", d, this), q(g, "click", this._refocusOnMap, this), g;
        },
        _updateDisabled: function() {
          var t = this._map, n = "leaflet-disabled";
          ht(this._zoomInButton, n), ht(this._zoomOutButton, n), this._zoomInButton.setAttribute("aria-disabled", "false"), this._zoomOutButton.setAttribute("aria-disabled", "false"), (this._disabled || t._zoom === t.getMinZoom()) && (j(this._zoomOutButton, n), this._zoomOutButton.setAttribute("aria-disabled", "true")), (this._disabled || t._zoom === t.getMaxZoom()) && (j(this._zoomInButton, n), this._zoomInButton.setAttribute("aria-disabled", "true"));
        }
      });
      V.mergeOptions({
        zoomControl: !0
      }), V.addInitHook(function() {
        this.options.zoomControl && (this.zoomControl = new Is(), this.addControl(this.zoomControl));
      });
      var Mo = function(t) {
        return new Is(t);
      }, Kn = Ot.extend({
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
        onAdd: function(t) {
          var n = "leaflet-control-scale", r = K("div", n), c = this.options;
          return this._addScales(c, n + "-line", r), t.on(c.updateWhenIdle ? "moveend" : "move", this._update, this), t.whenReady(this._update, this), r;
        },
        onRemove: function(t) {
          t.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
        },
        _addScales: function(t, n, r) {
          t.metric && (this._mScale = K("div", n, r)), t.imperial && (this._iScale = K("div", n, r));
        },
        _update: function() {
          var t = this._map, n = t.getSize().y / 2, r = t.distance(
            t.containerPointToLatLng([0, n]),
            t.containerPointToLatLng([this.options.maxWidth, n])
          );
          this._updateScales(r);
        },
        _updateScales: function(t) {
          this.options.metric && t && this._updateMetric(t), this.options.imperial && t && this._updateImperial(t);
        },
        _updateMetric: function(t) {
          var n = this._getRoundNum(t), r = n < 1e3 ? n + " m" : n / 1e3 + " km";
          this._updateScale(this._mScale, r, n / t);
        },
        _updateImperial: function(t) {
          var n = t * 3.2808399, r, c, d;
          n > 5280 ? (r = n / 5280, c = this._getRoundNum(r), this._updateScale(this._iScale, c + " mi", c / r)) : (d = this._getRoundNum(n), this._updateScale(this._iScale, d + " ft", d / n));
        },
        _updateScale: function(t, n, r) {
          t.style.width = Math.round(this.options.maxWidth * r) + "px", t.innerHTML = n;
        },
        _getRoundNum: function(t) {
          var n = Math.pow(10, (Math.floor(t) + "").length - 1), r = t / n;
          return r = r >= 10 ? 10 : r >= 5 ? 5 : r >= 3 ? 3 : r >= 2 ? 2 : 1, n * r;
        }
      }), wo = function(t) {
        return new Kn(t);
      }, xo = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>', Gs = Ot.extend({
        // @section
        // @aka Control.Attribution options
        options: {
          position: "bottomright",
          // @option prefix: String|false = 'Leaflet'
          // The HTML text shown before the attributions. Pass `false` to disable.
          prefix: '<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">' + (R.inlineSvg ? xo + " " : "") + "Leaflet</a>"
        },
        initialize: function(t) {
          x(this, t), this._attributions = {};
        },
        onAdd: function(t) {
          t.attributionControl = this, this._container = K("div", "leaflet-control-attribution"), Hi(this._container);
          for (var n in t._layers)
            t._layers[n].getAttribution && this.addAttribution(t._layers[n].getAttribution());
          return this._update(), t.on("layeradd", this._addAttribution, this), this._container;
        },
        onRemove: function(t) {
          t.off("layeradd", this._addAttribution, this);
        },
        _addAttribution: function(t) {
          t.layer.getAttribution && (this.addAttribution(t.layer.getAttribution()), t.layer.once("remove", function() {
            this.removeAttribution(t.layer.getAttribution());
          }, this));
        },
        // @method setPrefix(prefix: String|false): this
        // The HTML text shown before the attributions. Pass `false` to disable.
        setPrefix: function(t) {
          return this.options.prefix = t, this._update(), this;
        },
        // @method addAttribution(text: String): this
        // Adds an attribution text (e.g. `'&copy; OpenStreetMap contributors'`).
        addAttribution: function(t) {
          return t ? (this._attributions[t] || (this._attributions[t] = 0), this._attributions[t]++, this._update(), this) : this;
        },
        // @method removeAttribution(text: String): this
        // Removes an attribution text.
        removeAttribution: function(t) {
          return t ? (this._attributions[t] && (this._attributions[t]--, this._update()), this) : this;
        },
        _update: function() {
          if (this._map) {
            var t = [];
            for (var n in this._attributions)
              this._attributions[n] && t.push(n);
            var r = [];
            this.options.prefix && r.push(this.options.prefix), t.length && r.push(t.join(", ")), this._container.innerHTML = r.join(' <span aria-hidden="true">|</span> ');
          }
        }
      });
      V.mergeOptions({
        attributionControl: !0
      }), V.addInitHook(function() {
        this.options.attributionControl && new Gs().addTo(this);
      });
      var Po = function(t) {
        return new Gs(t);
      };
      Ot.Layers = Vn, Ot.Zoom = Is, Ot.Scale = Kn, Ot.Attribution = Gs, Wi.layers = yo, Wi.zoom = Mo, Wi.scale = wo, Wi.attribution = Po;
      var qt = Zt.extend({
        initialize: function(t) {
          this._map = t;
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
      qt.addTo = function(t, n) {
        return t.addHandler(n, this), this;
      };
      var bo = { Events: At }, $n = R.touch ? "touchstart mousedown" : "mousedown", ti = Bi.extend({
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
        initialize: function(t, n, r, c) {
          x(this, c), this._element = t, this._dragStartTarget = n || t, this._preventOutline = r;
        },
        // @method enable()
        // Enables the dragging ability
        enable: function() {
          this._enabled || (q(this._dragStartTarget, $n, this._onDown, this), this._enabled = !0);
        },
        // @method disable()
        // Disables the dragging ability
        disable: function() {
          this._enabled && (ti._dragging === this && this.finishDrag(!0), st(this._dragStartTarget, $n, this._onDown, this), this._enabled = !1, this._moved = !1);
        },
        _onDown: function(t) {
          if (this._enabled && (this._moved = !1, !vs(this._element, "leaflet-zoom-anim"))) {
            if (t.touches && t.touches.length !== 1) {
              ti._dragging === this && this.finishDrag();
              return;
            }
            if (!(ti._dragging || t.shiftKey || t.which !== 1 && t.button !== 1 && !t.touches) && (ti._dragging = this, this._preventOutline && bs(this._element), ws(), Ui(), !this._moving)) {
              this.fire("down");
              var n = t.touches ? t.touches[0] : t, r = qn(this._element);
              this._startPoint = new U(n.clientX, n.clientY), this._startPos = li(this._element), this._parentScale = Ss(r);
              var c = t.type === "mousedown";
              q(document, c ? "mousemove" : "touchmove", this._onMove, this), q(document, c ? "mouseup" : "touchend touchcancel", this._onUp, this);
            }
          }
        },
        _onMove: function(t) {
          if (this._enabled) {
            if (t.touches && t.touches.length > 1) {
              this._moved = !0;
              return;
            }
            var n = t.touches && t.touches.length === 1 ? t.touches[0] : t, r = new U(n.clientX, n.clientY)._subtract(this._startPoint);
            !r.x && !r.y || Math.abs(r.x) + Math.abs(r.y) < this.options.clickTolerance || (r.x /= this._parentScale.x, r.y /= this._parentScale.y, mt(t), this._moved || (this.fire("dragstart"), this._moved = !0, j(document.body, "leaflet-dragging"), this._lastTarget = t.target || t.srcElement, window.SVGElementInstance && this._lastTarget instanceof window.SVGElementInstance && (this._lastTarget = this._lastTarget.correspondingUseElement), j(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(r), this._moving = !0, this._lastEvent = t, this._updatePosition());
          }
        },
        _updatePosition: function() {
          var t = { originalEvent: this._lastEvent };
          this.fire("predrag", t), ct(this._element, this._newPos), this.fire("drag", t);
        },
        _onUp: function() {
          this._enabled && this.finishDrag();
        },
        finishDrag: function(t) {
          ht(document.body, "leaflet-dragging"), this._lastTarget && (ht(this._lastTarget, "leaflet-drag-target"), this._lastTarget = null), st(document, "mousemove touchmove", this._onMove, this), st(document, "mouseup touchend touchcancel", this._onUp, this), xs(), qi();
          var n = this._moved && this._moving;
          this._moving = !1, ti._dragging = !1, n && this.fire("dragend", {
            noInertia: t,
            distance: this._newPos.distanceTo(this._startPos)
          });
        }
      });
      function Jn(t, n, r) {
        var c, d = [1, 4, 2, 8], g, y, P, b, T, O, k, H;
        for (g = 0, O = t.length; g < O; g++)
          t[g]._code = fi(t[g], n);
        for (P = 0; P < 4; P++) {
          for (k = d[P], c = [], g = 0, O = t.length, y = O - 1; g < O; y = g++)
            b = t[g], T = t[y], b._code & k ? T._code & k || (H = Ie(T, b, k, n, r), H._code = fi(H, n), c.push(H)) : (T._code & k && (H = Ie(T, b, k, n, r), H._code = fi(H, n), c.push(H)), c.push(b));
          t = c;
        }
        return t;
      }
      function Qn(t, n) {
        var r, c, d, g, y, P, b, T, O;
        if (!t || t.length === 0)
          throw new Error("latlngs not passed");
        Ct(t) || (console.warn("latlngs are not flat! Only the first ring will be used"), t = t[0]);
        var k = Y([0, 0]), H = ut(t), yt = H.getNorthWest().distanceTo(H.getSouthWest()) * H.getNorthEast().distanceTo(H.getNorthWest());
        yt < 1700 && (k = Ns(t));
        var _t = t.length, It = [];
        for (r = 0; r < _t; r++) {
          var Pt = Y(t[r]);
          It.push(n.project(Y([Pt.lat - k.lat, Pt.lng - k.lng])));
        }
        for (P = b = T = 0, r = 0, c = _t - 1; r < _t; c = r++)
          d = It[r], g = It[c], y = d.y * g.x - g.y * d.x, b += (d.x + g.x) * y, T += (d.y + g.y) * y, P += y * 3;
        P === 0 ? O = It[0] : O = [b / P, T / P];
        var bi = n.unproject(F(O));
        return Y([bi.lat + k.lat, bi.lng + k.lng]);
      }
      function Ns(t) {
        for (var n = 0, r = 0, c = 0, d = 0; d < t.length; d++) {
          var g = Y(t[d]);
          n += g.lat, r += g.lng, c++;
        }
        return Y([n / c, r / c]);
      }
      var So = {
        __proto__: null,
        clipPolygon: Jn,
        polygonCenter: Qn,
        centroid: Ns
      };
      function ta(t, n) {
        if (!n || !t.length)
          return t.slice();
        var r = n * n;
        return t = Ao(t, r), t = To(t, r), t;
      }
      function ia(t, n, r) {
        return Math.sqrt(Xi(t, n, r, !0));
      }
      function Eo(t, n, r) {
        return Xi(t, n, r);
      }
      function To(t, n) {
        var r = t.length, c = typeof Uint8Array < "u" ? Uint8Array : Array, d = new c(r);
        d[0] = d[r - 1] = 1, Os(t, d, n, 0, r - 1);
        var g, y = [];
        for (g = 0; g < r; g++)
          d[g] && y.push(t[g]);
        return y;
      }
      function Os(t, n, r, c, d) {
        var g = 0, y, P, b;
        for (P = c + 1; P <= d - 1; P++)
          b = Xi(t[P], t[c], t[d], !0), b > g && (y = P, g = b);
        g > r && (n[y] = 1, Os(t, n, r, c, y), Os(t, n, r, y, d));
      }
      function Ao(t, n) {
        for (var r = [t[0]], c = 1, d = 0, g = t.length; c < g; c++)
          Lo(t[c], t[d]) > n && (r.push(t[c]), d = c);
        return d < g - 1 && r.push(t[g - 1]), r;
      }
      var ea;
      function sa(t, n, r, c, d) {
        var g = c ? ea : fi(t, r), y = fi(n, r), P, b, T;
        for (ea = y; ; ) {
          if (!(g | y))
            return [t, n];
          if (g & y)
            return !1;
          P = g || y, b = Ie(t, n, P, r, d), T = fi(b, r), P === g ? (t = b, g = T) : (n = b, y = T);
        }
      }
      function Ie(t, n, r, c, d) {
        var g = n.x - t.x, y = n.y - t.y, P = c.min, b = c.max, T, O;
        return r & 8 ? (T = t.x + g * (b.y - t.y) / y, O = b.y) : r & 4 ? (T = t.x + g * (P.y - t.y) / y, O = P.y) : r & 2 ? (T = b.x, O = t.y + y * (b.x - t.x) / g) : r & 1 && (T = P.x, O = t.y + y * (P.x - t.x) / g), new U(T, O, d);
      }
      function fi(t, n) {
        var r = 0;
        return t.x < n.min.x ? r |= 1 : t.x > n.max.x && (r |= 2), t.y < n.min.y ? r |= 4 : t.y > n.max.y && (r |= 8), r;
      }
      function Lo(t, n) {
        var r = n.x - t.x, c = n.y - t.y;
        return r * r + c * c;
      }
      function Xi(t, n, r, c) {
        var d = n.x, g = n.y, y = r.x - d, P = r.y - g, b = y * y + P * P, T;
        return b > 0 && (T = ((t.x - d) * y + (t.y - g) * P) / b, T > 1 ? (d = r.x, g = r.y) : T > 0 && (d += y * T, g += P * T)), y = t.x - d, P = t.y - g, c ? y * y + P * P : new U(d, g);
      }
      function Ct(t) {
        return !G(t[0]) || typeof t[0][0] != "object" && typeof t[0][0] < "u";
      }
      function na(t) {
        return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."), Ct(t);
      }
      function aa(t, n) {
        var r, c, d, g, y, P, b, T;
        if (!t || t.length === 0)
          throw new Error("latlngs not passed");
        Ct(t) || (console.warn("latlngs are not flat! Only the first ring will be used"), t = t[0]);
        var O = Y([0, 0]), k = ut(t), H = k.getNorthWest().distanceTo(k.getSouthWest()) * k.getNorthEast().distanceTo(k.getNorthWest());
        H < 1700 && (O = Ns(t));
        var yt = t.length, _t = [];
        for (r = 0; r < yt; r++) {
          var It = Y(t[r]);
          _t.push(n.project(Y([It.lat - O.lat, It.lng - O.lng])));
        }
        for (r = 0, c = 0; r < yt - 1; r++)
          c += _t[r].distanceTo(_t[r + 1]) / 2;
        if (c === 0)
          T = _t[0];
        else
          for (r = 0, g = 0; r < yt - 1; r++)
            if (y = _t[r], P = _t[r + 1], d = y.distanceTo(P), g += d, g > c) {
              b = (g - c) / d, T = [
                P.x - b * (P.x - y.x),
                P.y - b * (P.y - y.y)
              ];
              break;
            }
        var Pt = n.unproject(F(T));
        return Y([Pt.lat + O.lat, Pt.lng + O.lng]);
      }
      var Co = {
        __proto__: null,
        simplify: ta,
        pointToSegmentDistance: ia,
        closestPointOnSegment: Eo,
        clipSegment: sa,
        _getEdgeIntersection: Ie,
        _getBitCode: fi,
        _sqClosestPointOnSegment: Xi,
        isFlat: Ct,
        _flat: na,
        polylineCenter: aa
      }, zs = {
        project: function(t) {
          return new U(t.lng, t.lat);
        },
        unproject: function(t) {
          return new tt(t.y, t.x);
        },
        bounds: new nt([-180, -90], [180, 90])
      }, Rs = {
        R: 6378137,
        R_MINOR: 6356752314245179e-9,
        bounds: new nt([-2003750834279e-5, -1549657073972e-5], [2003750834279e-5, 1876465623138e-5]),
        project: function(t) {
          var n = Math.PI / 180, r = this.R, c = t.lat * n, d = this.R_MINOR / r, g = Math.sqrt(1 - d * d), y = g * Math.sin(c), P = Math.tan(Math.PI / 4 - c / 2) / Math.pow((1 - y) / (1 + y), g / 2);
          return c = -r * Math.log(Math.max(P, 1e-10)), new U(t.lng * n * r, c);
        },
        unproject: function(t) {
          for (var n = 180 / Math.PI, r = this.R, c = this.R_MINOR / r, d = Math.sqrt(1 - c * c), g = Math.exp(-t.y / r), y = Math.PI / 2 - 2 * Math.atan(g), P = 0, b = 0.1, T; P < 15 && Math.abs(b) > 1e-7; P++)
            T = d * Math.sin(y), T = Math.pow((1 - T) / (1 + T), d / 2), b = Math.PI / 2 - 2 * Math.atan(g * T) - y, y += b;
          return new tt(y * n, t.x * n / r);
        }
      }, Io = {
        __proto__: null,
        LonLat: zs,
        Mercator: Rs,
        SphericalMercator: hs
      }, Go = o({}, Qt, {
        code: "EPSG:3395",
        projection: Rs,
        transformation: (function() {
          var t = 0.5 / (Math.PI * Rs.R);
          return ki(t, 0.5, -t, 0.5);
        })()
      }), ra = o({}, Qt, {
        code: "EPSG:4326",
        projection: zs,
        transformation: ki(1 / 180, 1, -1 / 180, 0.5)
      }), No = o({}, Wt, {
        projection: zs,
        transformation: ki(1, 0, -1, 0),
        scale: function(t) {
          return Math.pow(2, t);
        },
        zoom: function(t) {
          return Math.log(t) / Math.LN2;
        },
        distance: function(t, n) {
          var r = n.lng - t.lng, c = n.lat - t.lat;
          return Math.sqrt(r * r + c * c);
        },
        infinite: !0
      });
      Wt.Earth = Qt, Wt.EPSG3395 = Go, Wt.EPSG3857 = us, Wt.EPSG900913 = kr, Wt.EPSG4326 = ra, Wt.Simple = No;
      var zt = Bi.extend({
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
        addTo: function(t) {
          return t.addLayer(this), this;
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
        removeFrom: function(t) {
          return t && t.removeLayer(this), this;
        },
        // @method getPane(name? : String): HTMLElement
        // Returns the `HTMLElement` representing the named pane on the map. If `name` is omitted, returns the pane for this layer.
        getPane: function(t) {
          return this._map.getPane(t ? this.options[t] || t : this.options.pane);
        },
        addInteractiveTarget: function(t) {
          return this._map._targets[f(t)] = this, this;
        },
        removeInteractiveTarget: function(t) {
          return delete this._map._targets[f(t)], this;
        },
        // @method getAttribution: String
        // Used by the `attribution control`, returns the [attribution option](#gridlayer-attribution).
        getAttribution: function() {
          return this.options.attribution;
        },
        _layerAdd: function(t) {
          var n = t.target;
          if (n.hasLayer(this)) {
            if (this._map = n, this._zoomAnimated = n._zoomAnimated, this.getEvents) {
              var r = this.getEvents();
              n.on(r, this), this.once("remove", function() {
                n.off(r, this);
              }, this);
            }
            this.onAdd(n), this.fire("add"), n.fire("layeradd", { layer: this });
          }
        }
      });
      V.include({
        // @method addLayer(layer: Layer): this
        // Adds the given layer to the map
        addLayer: function(t) {
          if (!t._layerAdd)
            throw new Error("The provided object is not a Layer.");
          var n = f(t);
          return this._layers[n] ? this : (this._layers[n] = t, t._mapToAdd = this, t.beforeAdd && t.beforeAdd(this), this.whenReady(t._layerAdd, t), this);
        },
        // @method removeLayer(layer: Layer): this
        // Removes the given layer from the map.
        removeLayer: function(t) {
          var n = f(t);
          return this._layers[n] ? (this._loaded && t.onRemove(this), delete this._layers[n], this._loaded && (this.fire("layerremove", { layer: t }), t.fire("remove")), t._map = t._mapToAdd = null, this) : this;
        },
        // @method hasLayer(layer: Layer): Boolean
        // Returns `true` if the given layer is currently added to the map
        hasLayer: function(t) {
          return f(t) in this._layers;
        },
        /* @method eachLayer(fn: Function, context?: Object): this
         * Iterates over the layers of the map, optionally specifying context of the iterator function.
         * ```
         * map.eachLayer(function(layer){
         *     layer.bindPopup('Hello');
         * });
         * ```
         */
        eachLayer: function(t, n) {
          for (var r in this._layers)
            t.call(n, this._layers[r]);
          return this;
        },
        _addLayers: function(t) {
          t = t ? G(t) ? t : [t] : [];
          for (var n = 0, r = t.length; n < r; n++)
            this.addLayer(t[n]);
        },
        _addZoomLimit: function(t) {
          (!isNaN(t.options.maxZoom) || !isNaN(t.options.minZoom)) && (this._zoomBoundLayers[f(t)] = t, this._updateZoomLevels());
        },
        _removeZoomLimit: function(t) {
          var n = f(t);
          this._zoomBoundLayers[n] && (delete this._zoomBoundLayers[n], this._updateZoomLevels());
        },
        _updateZoomLevels: function() {
          var t = 1 / 0, n = -1 / 0, r = this._getZoomSpan();
          for (var c in this._zoomBoundLayers) {
            var d = this._zoomBoundLayers[c].options;
            t = d.minZoom === void 0 ? t : Math.min(t, d.minZoom), n = d.maxZoom === void 0 ? n : Math.max(n, d.maxZoom);
          }
          this._layersMaxZoom = n === -1 / 0 ? void 0 : n, this._layersMinZoom = t === 1 / 0 ? void 0 : t, r !== this._getZoomSpan() && this.fire("zoomlevelschange"), this.options.maxZoom === void 0 && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom && this.setZoom(this._layersMaxZoom), this.options.minZoom === void 0 && this._layersMinZoom && this.getZoom() < this._layersMinZoom && this.setZoom(this._layersMinZoom);
        }
      });
      var yi = zt.extend({
        initialize: function(t, n) {
          x(this, n), this._layers = {};
          var r, c;
          if (t)
            for (r = 0, c = t.length; r < c; r++)
              this.addLayer(t[r]);
        },
        // @method addLayer(layer: Layer): this
        // Adds the given layer to the group.
        addLayer: function(t) {
          var n = this.getLayerId(t);
          return this._layers[n] = t, this._map && this._map.addLayer(t), this;
        },
        // @method removeLayer(layer: Layer): this
        // Removes the given layer from the group.
        // @alternative
        // @method removeLayer(id: Number): this
        // Removes the layer with the given internal ID from the group.
        removeLayer: function(t) {
          var n = t in this._layers ? t : this.getLayerId(t);
          return this._map && this._layers[n] && this._map.removeLayer(this._layers[n]), delete this._layers[n], this;
        },
        // @method hasLayer(layer: Layer): Boolean
        // Returns `true` if the given layer is currently added to the group.
        // @alternative
        // @method hasLayer(id: Number): Boolean
        // Returns `true` if the given internal ID is currently added to the group.
        hasLayer: function(t) {
          var n = typeof t == "number" ? t : this.getLayerId(t);
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
        invoke: function(t) {
          var n = Array.prototype.slice.call(arguments, 1), r, c;
          for (r in this._layers)
            c = this._layers[r], c[t] && c[t].apply(c, n);
          return this;
        },
        onAdd: function(t) {
          this.eachLayer(t.addLayer, t);
        },
        onRemove: function(t) {
          this.eachLayer(t.removeLayer, t);
        },
        // @method eachLayer(fn: Function, context?: Object): this
        // Iterates over the layers of the group, optionally specifying context of the iterator function.
        // ```js
        // group.eachLayer(function (layer) {
        // 	layer.bindPopup('Hello');
        // });
        // ```
        eachLayer: function(t, n) {
          for (var r in this._layers)
            t.call(n, this._layers[r]);
          return this;
        },
        // @method getLayer(id: Number): Layer
        // Returns the layer with the given internal ID.
        getLayer: function(t) {
          return this._layers[t];
        },
        // @method getLayers(): Layer[]
        // Returns an array of all the layers added to the group.
        getLayers: function() {
          var t = [];
          return this.eachLayer(t.push, t), t;
        },
        // @method setZIndex(zIndex: Number): this
        // Calls `setZIndex` on every layer contained in this group, passing the z-index.
        setZIndex: function(t) {
          return this.invoke("setZIndex", t);
        },
        // @method getLayerId(layer: Layer): Number
        // Returns the internal ID for a layer
        getLayerId: function(t) {
          return f(t);
        }
      }), Oo = function(t, n) {
        return new yi(t, n);
      }, Xt = yi.extend({
        addLayer: function(t) {
          return this.hasLayer(t) ? this : (t.addEventParent(this), yi.prototype.addLayer.call(this, t), this.fire("layeradd", { layer: t }));
        },
        removeLayer: function(t) {
          return this.hasLayer(t) ? (t in this._layers && (t = this._layers[t]), t.removeEventParent(this), yi.prototype.removeLayer.call(this, t), this.fire("layerremove", { layer: t })) : this;
        },
        // @method setStyle(style: Path options): this
        // Sets the given path options to each layer of the group that has a `setStyle` method.
        setStyle: function(t) {
          return this.invoke("setStyle", t);
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
          var t = new xt();
          for (var n in this._layers) {
            var r = this._layers[n];
            t.extend(r.getBounds ? r.getBounds() : r.getLatLng());
          }
          return t;
        }
      }), zo = function(t, n) {
        return new Xt(t, n);
      }, Mi = Zt.extend({
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
        initialize: function(t) {
          x(this, t);
        },
        // @method createIcon(oldIcon?: HTMLElement): HTMLElement
        // Called internally when the icon has to be shown, returns a `<img>` HTML element
        // styled according to the options.
        createIcon: function(t) {
          return this._createIcon("icon", t);
        },
        // @method createShadow(oldIcon?: HTMLElement): HTMLElement
        // As `createIcon`, but for the shadow beneath it.
        createShadow: function(t) {
          return this._createIcon("shadow", t);
        },
        _createIcon: function(t, n) {
          var r = this._getIconUrl(t);
          if (!r) {
            if (t === "icon")
              throw new Error("iconUrl not set in Icon options (see the docs).");
            return null;
          }
          var c = this._createImg(r, n && n.tagName === "IMG" ? n : null);
          return this._setIconStyles(c, t), (this.options.crossOrigin || this.options.crossOrigin === "") && (c.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), c;
        },
        _setIconStyles: function(t, n) {
          var r = this.options, c = r[n + "Size"];
          typeof c == "number" && (c = [c, c]);
          var d = F(c), g = F(n === "shadow" && r.shadowAnchor || r.iconAnchor || d && d.divideBy(2, !0));
          t.className = "leaflet-marker-" + n + " " + (r.className || ""), g && (t.style.marginLeft = -g.x + "px", t.style.marginTop = -g.y + "px"), d && (t.style.width = d.x + "px", t.style.height = d.y + "px");
        },
        _createImg: function(t, n) {
          return n = n || document.createElement("img"), n.src = t, n;
        },
        _getIconUrl: function(t) {
          return R.retina && this.options[t + "RetinaUrl"] || this.options[t + "Url"];
        }
      });
      function Ro(t) {
        return new Mi(t);
      }
      var Yi = Mi.extend({
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
        _getIconUrl: function(t) {
          return typeof Yi.imagePath != "string" && (Yi.imagePath = this._detectIconPath()), (this.options.imagePath || Yi.imagePath) + Mi.prototype._getIconUrl.call(this, t);
        },
        _stripUrl: function(t) {
          var n = function(r, c, d) {
            var g = c.exec(r);
            return g && g[d];
          };
          return t = n(t, /^url\((['"])?(.+)\1\)$/, 2), t && n(t, /^(.*)marker-icon\.png$/, 1);
        },
        _detectIconPath: function() {
          var t = K("div", "leaflet-default-icon-path", document.body), n = Fi(t, "background-image") || Fi(t, "backgroundImage");
          if (document.body.removeChild(t), n = this._stripUrl(n), n)
            return n;
          var r = document.querySelector('link[href$="leaflet.css"]');
          return r ? r.href.substring(0, r.href.length - 11 - 1) : "";
        }
      }), oa = qt.extend({
        initialize: function(t) {
          this._marker = t;
        },
        addHooks: function() {
          var t = this._marker._icon;
          this._draggable || (this._draggable = new ti(t, t, !0)), this._draggable.on({
            dragstart: this._onDragStart,
            predrag: this._onPreDrag,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this).enable(), j(t, "leaflet-marker-draggable");
        },
        removeHooks: function() {
          this._draggable.off({
            dragstart: this._onDragStart,
            predrag: this._onPreDrag,
            drag: this._onDrag,
            dragend: this._onDragEnd
          }, this).disable(), this._marker._icon && ht(this._marker._icon, "leaflet-marker-draggable");
        },
        moved: function() {
          return this._draggable && this._draggable._moved;
        },
        _adjustPan: function(t) {
          var n = this._marker, r = n._map, c = this._marker.options.autoPanSpeed, d = this._marker.options.autoPanPadding, g = li(n._icon), y = r.getPixelBounds(), P = r.getPixelOrigin(), b = wt(
            y.min._subtract(P).add(d),
            y.max._subtract(P).subtract(d)
          );
          if (!b.contains(g)) {
            var T = F(
              (Math.max(b.max.x, g.x) - b.max.x) / (y.max.x - b.max.x) - (Math.min(b.min.x, g.x) - b.min.x) / (y.min.x - b.min.x),
              (Math.max(b.max.y, g.y) - b.max.y) / (y.max.y - b.max.y) - (Math.min(b.min.y, g.y) - b.min.y) / (y.min.y - b.min.y)
            ).multiplyBy(c);
            r.panBy(T, { animate: !1 }), this._draggable._newPos._add(T), this._draggable._startPos._add(T), ct(n._icon, this._draggable._newPos), this._onDrag(t), this._panRequest = $(this._adjustPan.bind(this, t));
          }
        },
        _onDragStart: function() {
          this._oldLatLng = this._marker.getLatLng(), this._marker.closePopup && this._marker.closePopup(), this._marker.fire("movestart").fire("dragstart");
        },
        _onPreDrag: function(t) {
          this._marker.options.autoPan && (dt(this._panRequest), this._panRequest = $(this._adjustPan.bind(this, t)));
        },
        _onDrag: function(t) {
          var n = this._marker, r = n._shadow, c = li(n._icon), d = n._map.layerPointToLatLng(c);
          r && ct(r, c), n._latlng = d, t.latlng = d, t.oldLatLng = this._oldLatLng, n.fire("move", t).fire("drag", t);
        },
        _onDragEnd: function(t) {
          dt(this._panRequest), delete this._oldLatLng, this._marker.fire("moveend").fire("dragend", t);
        }
      }), Ge = zt.extend({
        // @section
        // @aka Marker options
        options: {
          // @option icon: Icon = *
          // Icon instance to use for rendering the marker.
          // See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
          // If not specified, a common instance of `L.Icon.Default` is used.
          icon: new Yi(),
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
        initialize: function(t, n) {
          x(this, n), this._latlng = Y(t);
        },
        onAdd: function(t) {
          this._zoomAnimated = this._zoomAnimated && t.options.markerZoomAnimation, this._zoomAnimated && t.on("zoomanim", this._animateZoom, this), this._initIcon(), this.update();
        },
        onRemove: function(t) {
          this.dragging && this.dragging.enabled() && (this.options.draggable = !0, this.dragging.removeHooks()), delete this.dragging, this._zoomAnimated && t.off("zoomanim", this._animateZoom, this), this._removeIcon(), this._removeShadow();
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
        setLatLng: function(t) {
          var n = this._latlng;
          return this._latlng = Y(t), this.update(), this.fire("move", { oldLatLng: n, latlng: this._latlng });
        },
        // @method setZIndexOffset(offset: Number): this
        // Changes the [zIndex offset](#marker-zindexoffset) of the marker.
        setZIndexOffset: function(t) {
          return this.options.zIndexOffset = t, this.update();
        },
        // @method getIcon: Icon
        // Returns the current icon used by the marker
        getIcon: function() {
          return this.options.icon;
        },
        // @method setIcon(icon: Icon): this
        // Changes the marker icon.
        setIcon: function(t) {
          return this.options.icon = t, this._map && (this._initIcon(), this.update()), this._popup && this.bindPopup(this._popup, this._popup.options), this;
        },
        getElement: function() {
          return this._icon;
        },
        update: function() {
          if (this._icon && this._map) {
            var t = this._map.latLngToLayerPoint(this._latlng).round();
            this._setPos(t);
          }
          return this;
        },
        _initIcon: function() {
          var t = this.options, n = "leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide"), r = t.icon.createIcon(this._icon), c = !1;
          r !== this._icon && (this._icon && this._removeIcon(), c = !0, t.title && (r.title = t.title), r.tagName === "IMG" && (r.alt = t.alt || "")), j(r, n), t.keyboard && (r.tabIndex = "0", r.setAttribute("role", "button")), this._icon = r, t.riseOnHover && this.on({
            mouseover: this._bringToFront,
            mouseout: this._resetZIndex
          }), this.options.autoPanOnFocus && q(r, "focus", this._panOnFocus, this);
          var d = t.icon.createShadow(this._shadow), g = !1;
          d !== this._shadow && (this._removeShadow(), g = !0), d && (j(d, n), d.alt = ""), this._shadow = d, t.opacity < 1 && this._updateOpacity(), c && this.getPane().appendChild(this._icon), this._initInteraction(), d && g && this.getPane(t.shadowPane).appendChild(this._shadow);
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
        _setPos: function(t) {
          this._icon && ct(this._icon, t), this._shadow && ct(this._shadow, t), this._zIndex = t.y + this.options.zIndexOffset, this._resetZIndex();
        },
        _updateZIndex: function(t) {
          this._icon && (this._icon.style.zIndex = this._zIndex + t);
        },
        _animateZoom: function(t) {
          var n = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center).round();
          this._setPos(n);
        },
        _initInteraction: function() {
          if (this.options.interactive && (j(this._icon, "leaflet-interactive"), this.addInteractiveTarget(this._icon), oa)) {
            var t = this.options.draggable;
            this.dragging && (t = this.dragging.enabled(), this.dragging.disable()), this.dragging = new oa(this), t && this.dragging.enable();
          }
        },
        // @method setOpacity(opacity: Number): this
        // Changes the opacity of the marker.
        setOpacity: function(t) {
          return this.options.opacity = t, this._map && this._updateOpacity(), this;
        },
        _updateOpacity: function() {
          var t = this.options.opacity;
          this._icon && Lt(this._icon, t), this._shadow && Lt(this._shadow, t);
        },
        _bringToFront: function() {
          this._updateZIndex(this.options.riseOffset);
        },
        _resetZIndex: function() {
          this._updateZIndex(0);
        },
        _panOnFocus: function() {
          var t = this._map;
          if (t) {
            var n = this.options.icon.options, r = n.iconSize ? F(n.iconSize) : F(0, 0), c = n.iconAnchor ? F(n.iconAnchor) : F(0, 0);
            t.panInside(this._latlng, {
              paddingTopLeft: c,
              paddingBottomRight: r.subtract(c)
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
      function Bo(t, n) {
        return new Ge(t, n);
      }
      var ii = zt.extend({
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
        beforeAdd: function(t) {
          this._renderer = t.getRenderer(this);
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
        setStyle: function(t) {
          return x(this, t), this._renderer && (this._renderer._updateStyle(this), this.options.stroke && t && Object.prototype.hasOwnProperty.call(t, "weight") && this._updateBounds()), this;
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
      }), Ne = ii.extend({
        // @section
        // @aka CircleMarker options
        options: {
          fill: !0,
          // @option radius: Number = 10
          // Radius of the circle marker, in pixels
          radius: 10
        },
        initialize: function(t, n) {
          x(this, n), this._latlng = Y(t), this._radius = this.options.radius;
        },
        // @method setLatLng(latLng: LatLng): this
        // Sets the position of a circle marker to a new location.
        setLatLng: function(t) {
          var n = this._latlng;
          return this._latlng = Y(t), this.redraw(), this.fire("move", { oldLatLng: n, latlng: this._latlng });
        },
        // @method getLatLng(): LatLng
        // Returns the current geographical position of the circle marker
        getLatLng: function() {
          return this._latlng;
        },
        // @method setRadius(radius: Number): this
        // Sets the radius of a circle marker. Units are in pixels.
        setRadius: function(t) {
          return this.options.radius = this._radius = t, this.redraw();
        },
        // @method getRadius(): Number
        // Returns the current radius of the circle
        getRadius: function() {
          return this._radius;
        },
        setStyle: function(t) {
          var n = t && t.radius || this._radius;
          return ii.prototype.setStyle.call(this, t), this.setRadius(n), this;
        },
        _project: function() {
          this._point = this._map.latLngToLayerPoint(this._latlng), this._updateBounds();
        },
        _updateBounds: function() {
          var t = this._radius, n = this._radiusY || t, r = this._clickTolerance(), c = [t + r, n + r];
          this._pxBounds = new nt(this._point.subtract(c), this._point.add(c));
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
        _containsPoint: function(t) {
          return t.distanceTo(this._point) <= this._radius + this._clickTolerance();
        }
      });
      function ko(t, n) {
        return new Ne(t, n);
      }
      var Bs = Ne.extend({
        initialize: function(t, n, r) {
          if (typeof n == "number" && (n = o({}, r, { radius: n })), x(this, n), this._latlng = Y(t), isNaN(this.options.radius))
            throw new Error("Circle radius cannot be NaN");
          this._mRadius = this.options.radius;
        },
        // @method setRadius(radius: Number): this
        // Sets the radius of a circle. Units are in meters.
        setRadius: function(t) {
          return this._mRadius = t, this.redraw();
        },
        // @method getRadius(): Number
        // Returns the current radius of a circle. Units are in meters.
        getRadius: function() {
          return this._mRadius;
        },
        // @method getBounds(): LatLngBounds
        // Returns the `LatLngBounds` of the path.
        getBounds: function() {
          var t = [this._radius, this._radiusY || this._radius];
          return new xt(
            this._map.layerPointToLatLng(this._point.subtract(t)),
            this._map.layerPointToLatLng(this._point.add(t))
          );
        },
        setStyle: ii.prototype.setStyle,
        _project: function() {
          var t = this._latlng.lng, n = this._latlng.lat, r = this._map, c = r.options.crs;
          if (c.distance === Qt.distance) {
            var d = Math.PI / 180, g = this._mRadius / Qt.R / d, y = r.project([n + g, t]), P = r.project([n - g, t]), b = y.add(P).divideBy(2), T = r.unproject(b).lat, O = Math.acos((Math.cos(g * d) - Math.sin(n * d) * Math.sin(T * d)) / (Math.cos(n * d) * Math.cos(T * d))) / d;
            (isNaN(O) || O === 0) && (O = g / Math.cos(Math.PI / 180 * n)), this._point = b.subtract(r.getPixelOrigin()), this._radius = isNaN(O) ? 0 : b.x - r.project([T, t - O]).x, this._radiusY = b.y - y.y;
          } else {
            var k = c.unproject(c.project(this._latlng).subtract([this._mRadius, 0]));
            this._point = r.latLngToLayerPoint(this._latlng), this._radius = this._point.x - r.latLngToLayerPoint(k).x;
          }
          this._updateBounds();
        }
      });
      function Do(t, n, r) {
        return new Bs(t, n, r);
      }
      var Yt = ii.extend({
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
        initialize: function(t, n) {
          x(this, n), this._setLatLngs(t);
        },
        // @method getLatLngs(): LatLng[]
        // Returns an array of the points in the path, or nested arrays of points in case of multi-polyline.
        getLatLngs: function() {
          return this._latlngs;
        },
        // @method setLatLngs(latlngs: LatLng[]): this
        // Replaces all the points in the polyline with the given array of geographical points.
        setLatLngs: function(t) {
          return this._setLatLngs(t), this.redraw();
        },
        // @method isEmpty(): Boolean
        // Returns `true` if the Polyline has no LatLngs.
        isEmpty: function() {
          return !this._latlngs.length;
        },
        // @method closestLayerPoint(p: Point): Point
        // Returns the point closest to `p` on the Polyline.
        closestLayerPoint: function(t) {
          for (var n = 1 / 0, r = null, c = Xi, d, g, y = 0, P = this._parts.length; y < P; y++)
            for (var b = this._parts[y], T = 1, O = b.length; T < O; T++) {
              d = b[T - 1], g = b[T];
              var k = c(t, d, g, !0);
              k < n && (n = k, r = c(t, d, g));
            }
          return r && (r.distance = Math.sqrt(n)), r;
        },
        // @method getCenter(): LatLng
        // Returns the center ([centroid](https://en.wikipedia.org/wiki/Centroid)) of the polyline.
        getCenter: function() {
          if (!this._map)
            throw new Error("Must add layer to map before using getCenter()");
          return aa(this._defaultShape(), this._map.options.crs);
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
        addLatLng: function(t, n) {
          return n = n || this._defaultShape(), t = Y(t), n.push(t), this._bounds.extend(t), this.redraw();
        },
        _setLatLngs: function(t) {
          this._bounds = new xt(), this._latlngs = this._convertLatLngs(t);
        },
        _defaultShape: function() {
          return Ct(this._latlngs) ? this._latlngs : this._latlngs[0];
        },
        // recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
        _convertLatLngs: function(t) {
          for (var n = [], r = Ct(t), c = 0, d = t.length; c < d; c++)
            r ? (n[c] = Y(t[c]), this._bounds.extend(n[c])) : n[c] = this._convertLatLngs(t[c]);
          return n;
        },
        _project: function() {
          var t = new nt();
          this._rings = [], this._projectLatlngs(this._latlngs, this._rings, t), this._bounds.isValid() && t.isValid() && (this._rawPxBounds = t, this._updateBounds());
        },
        _updateBounds: function() {
          var t = this._clickTolerance(), n = new U(t, t);
          this._rawPxBounds && (this._pxBounds = new nt([
            this._rawPxBounds.min.subtract(n),
            this._rawPxBounds.max.add(n)
          ]));
        },
        // recursively turns latlngs into a set of rings with projected coordinates
        _projectLatlngs: function(t, n, r) {
          var c = t[0] instanceof tt, d = t.length, g, y;
          if (c) {
            for (y = [], g = 0; g < d; g++)
              y[g] = this._map.latLngToLayerPoint(t[g]), r.extend(y[g]);
            n.push(y);
          } else
            for (g = 0; g < d; g++)
              this._projectLatlngs(t[g], n, r);
        },
        // clip polyline by renderer bounds so that we have less to render for performance
        _clipPoints: function() {
          var t = this._renderer._bounds;
          if (this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(t))) {
            if (this.options.noClip) {
              this._parts = this._rings;
              return;
            }
            var n = this._parts, r, c, d, g, y, P, b;
            for (r = 0, d = 0, g = this._rings.length; r < g; r++)
              for (b = this._rings[r], c = 0, y = b.length; c < y - 1; c++)
                P = sa(b[c], b[c + 1], t, c, !0), P && (n[d] = n[d] || [], n[d].push(P[0]), (P[1] !== b[c + 1] || c === y - 2) && (n[d].push(P[1]), d++));
          }
        },
        // simplify each clipped part of the polyline for performance
        _simplifyPoints: function() {
          for (var t = this._parts, n = this.options.smoothFactor, r = 0, c = t.length; r < c; r++)
            t[r] = ta(t[r], n);
        },
        _update: function() {
          this._map && (this._clipPoints(), this._simplifyPoints(), this._updatePath());
        },
        _updatePath: function() {
          this._renderer._updatePoly(this);
        },
        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: function(t, n) {
          var r, c, d, g, y, P, b = this._clickTolerance();
          if (!this._pxBounds || !this._pxBounds.contains(t))
            return !1;
          for (r = 0, g = this._parts.length; r < g; r++)
            for (P = this._parts[r], c = 0, y = P.length, d = y - 1; c < y; d = c++)
              if (!(!n && c === 0) && ia(t, P[d], P[c]) <= b)
                return !0;
          return !1;
        }
      });
      function Zo(t, n) {
        return new Yt(t, n);
      }
      Yt._flat = na;
      var wi = Yt.extend({
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
          return Qn(this._defaultShape(), this._map.options.crs);
        },
        _convertLatLngs: function(t) {
          var n = Yt.prototype._convertLatLngs.call(this, t), r = n.length;
          return r >= 2 && n[0] instanceof tt && n[0].equals(n[r - 1]) && n.pop(), n;
        },
        _setLatLngs: function(t) {
          Yt.prototype._setLatLngs.call(this, t), Ct(this._latlngs) && (this._latlngs = [this._latlngs]);
        },
        _defaultShape: function() {
          return Ct(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
        },
        _clipPoints: function() {
          var t = this._renderer._bounds, n = this.options.weight, r = new U(n, n);
          if (t = new nt(t.min.subtract(r), t.max.add(r)), this._parts = [], !(!this._pxBounds || !this._pxBounds.intersects(t))) {
            if (this.options.noClip) {
              this._parts = this._rings;
              return;
            }
            for (var c = 0, d = this._rings.length, g; c < d; c++)
              g = Jn(this._rings[c], t, !0), g.length && this._parts.push(g);
          }
        },
        _updatePath: function() {
          this._renderer._updatePoly(this, !0);
        },
        // Needed by the `Canvas` renderer for interactivity
        _containsPoint: function(t) {
          var n = !1, r, c, d, g, y, P, b, T;
          if (!this._pxBounds || !this._pxBounds.contains(t))
            return !1;
          for (g = 0, b = this._parts.length; g < b; g++)
            for (r = this._parts[g], y = 0, T = r.length, P = T - 1; y < T; P = y++)
              c = r[y], d = r[P], c.y > t.y != d.y > t.y && t.x < (d.x - c.x) * (t.y - c.y) / (d.y - c.y) + c.x && (n = !n);
          return n || Yt.prototype._containsPoint.call(this, t, !0);
        }
      });
      function Fo(t, n) {
        return new wi(t, n);
      }
      var Vt = Xt.extend({
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
        initialize: function(t, n) {
          x(this, n), this._layers = {}, t && this.addData(t);
        },
        // @method addData( <GeoJSON> data ): this
        // Adds a GeoJSON object to the layer.
        addData: function(t) {
          var n = G(t) ? t : t.features, r, c, d;
          if (n) {
            for (r = 0, c = n.length; r < c; r++)
              d = n[r], (d.geometries || d.geometry || d.features || d.coordinates) && this.addData(d);
            return this;
          }
          var g = this.options;
          if (g.filter && !g.filter(t))
            return this;
          var y = Oe(t, g);
          return y ? (y.feature = Be(t), y.defaultOptions = y.options, this.resetStyle(y), g.onEachFeature && g.onEachFeature(t, y), this.addLayer(y)) : this;
        },
        // @method resetStyle( <Path> layer? ): this
        // Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
        // If `layer` is omitted, the style of all features in the current layer is reset.
        resetStyle: function(t) {
          return t === void 0 ? this.eachLayer(this.resetStyle, this) : (t.options = o({}, t.defaultOptions), this._setLayerStyle(t, this.options.style), this);
        },
        // @method setStyle( <Function> style ): this
        // Changes styles of GeoJSON vector layers with the given style function.
        setStyle: function(t) {
          return this.eachLayer(function(n) {
            this._setLayerStyle(n, t);
          }, this);
        },
        _setLayerStyle: function(t, n) {
          t.setStyle && (typeof n == "function" && (n = n(t.feature)), t.setStyle(n));
        }
      });
      function Oe(t, n) {
        var r = t.type === "Feature" ? t.geometry : t, c = r ? r.coordinates : null, d = [], g = n && n.pointToLayer, y = n && n.coordsToLatLng || ks, P, b, T, O;
        if (!c && !r)
          return null;
        switch (r.type) {
          case "Point":
            return P = y(c), ha(g, t, P, n);
          case "MultiPoint":
            for (T = 0, O = c.length; T < O; T++)
              P = y(c[T]), d.push(ha(g, t, P, n));
            return new Xt(d);
          case "LineString":
          case "MultiLineString":
            return b = ze(c, r.type === "LineString" ? 0 : 1, y), new Yt(b, n);
          case "Polygon":
          case "MultiPolygon":
            return b = ze(c, r.type === "Polygon" ? 1 : 2, y), new wi(b, n);
          case "GeometryCollection":
            for (T = 0, O = r.geometries.length; T < O; T++) {
              var k = Oe({
                geometry: r.geometries[T],
                type: "Feature",
                properties: t.properties
              }, n);
              k && d.push(k);
            }
            return new Xt(d);
          case "FeatureCollection":
            for (T = 0, O = r.features.length; T < O; T++) {
              var H = Oe(r.features[T], n);
              H && d.push(H);
            }
            return new Xt(d);
          default:
            throw new Error("Invalid GeoJSON object.");
        }
      }
      function ha(t, n, r, c) {
        return t ? t(n, r) : new Ge(r, c && c.markersInheritOptions && c);
      }
      function ks(t) {
        return new tt(t[1], t[0], t[2]);
      }
      function ze(t, n, r) {
        for (var c = [], d = 0, g = t.length, y; d < g; d++)
          y = n ? ze(t[d], n - 1, r) : (r || ks)(t[d]), c.push(y);
        return c;
      }
      function Ds(t, n) {
        return t = Y(t), t.alt !== void 0 ? [p(t.lng, n), p(t.lat, n), p(t.alt, n)] : [p(t.lng, n), p(t.lat, n)];
      }
      function Re(t, n, r, c) {
        for (var d = [], g = 0, y = t.length; g < y; g++)
          d.push(n ? Re(t[g], Ct(t[g]) ? 0 : n - 1, r, c) : Ds(t[g], c));
        return !n && r && d.length > 0 && d.push(d[0].slice()), d;
      }
      function xi(t, n) {
        return t.feature ? o({}, t.feature, { geometry: n }) : Be(n);
      }
      function Be(t) {
        return t.type === "Feature" || t.type === "FeatureCollection" ? t : {
          type: "Feature",
          properties: {},
          geometry: t
        };
      }
      var Zs = {
        toGeoJSON: function(t) {
          return xi(this, {
            type: "Point",
            coordinates: Ds(this.getLatLng(), t)
          });
        }
      };
      Ge.include(Zs), Bs.include(Zs), Ne.include(Zs), Yt.include({
        toGeoJSON: function(t) {
          var n = !Ct(this._latlngs), r = Re(this._latlngs, n ? 1 : 0, !1, t);
          return xi(this, {
            type: (n ? "Multi" : "") + "LineString",
            coordinates: r
          });
        }
      }), wi.include({
        toGeoJSON: function(t) {
          var n = !Ct(this._latlngs), r = n && !Ct(this._latlngs[0]), c = Re(this._latlngs, r ? 2 : n ? 1 : 0, !0, t);
          return n || (c = [c]), xi(this, {
            type: (r ? "Multi" : "") + "Polygon",
            coordinates: c
          });
        }
      }), yi.include({
        toMultiPoint: function(t) {
          var n = [];
          return this.eachLayer(function(r) {
            n.push(r.toGeoJSON(t).geometry.coordinates);
          }), xi(this, {
            type: "MultiPoint",
            coordinates: n
          });
        },
        // @method toGeoJSON(precision?: Number|false): Object
        // Coordinates values are rounded with [`formatNum`](#util-formatnum) function with given `precision`.
        // Returns a [`GeoJSON`](https://en.wikipedia.org/wiki/GeoJSON) representation of the layer group (as a GeoJSON `FeatureCollection`, `GeometryCollection`, or `MultiPoint`).
        toGeoJSON: function(t) {
          var n = this.feature && this.feature.geometry && this.feature.geometry.type;
          if (n === "MultiPoint")
            return this.toMultiPoint(t);
          var r = n === "GeometryCollection", c = [];
          return this.eachLayer(function(d) {
            if (d.toGeoJSON) {
              var g = d.toGeoJSON(t);
              if (r)
                c.push(g.geometry);
              else {
                var y = Be(g);
                y.type === "FeatureCollection" ? c.push.apply(c, y.features) : c.push(y);
              }
            }
          }), r ? xi(this, {
            geometries: c,
            type: "GeometryCollection"
          }) : {
            type: "FeatureCollection",
            features: c
          };
        }
      });
      function la(t, n) {
        return new Vt(t, n);
      }
      var Uo = la, ke = zt.extend({
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
        initialize: function(t, n, r) {
          this._url = t, this._bounds = ut(n), x(this, r);
        },
        onAdd: function() {
          this._image || (this._initImage(), this.options.opacity < 1 && this._updateOpacity()), this.options.interactive && (j(this._image, "leaflet-interactive"), this.addInteractiveTarget(this._image)), this.getPane().appendChild(this._image), this._reset();
        },
        onRemove: function() {
          at(this._image), this.options.interactive && this.removeInteractiveTarget(this._image);
        },
        // @method setOpacity(opacity: Number): this
        // Sets the opacity of the overlay.
        setOpacity: function(t) {
          return this.options.opacity = t, this._image && this._updateOpacity(), this;
        },
        setStyle: function(t) {
          return t.opacity && this.setOpacity(t.opacity), this;
        },
        // @method bringToFront(): this
        // Brings the layer to the top of all overlays.
        bringToFront: function() {
          return this._map && pi(this._image), this;
        },
        // @method bringToBack(): this
        // Brings the layer to the bottom of all overlays.
        bringToBack: function() {
          return this._map && vi(this._image), this;
        },
        // @method setUrl(url: String): this
        // Changes the URL of the image.
        setUrl: function(t) {
          return this._url = t, this._image && (this._image.src = t), this;
        },
        // @method setBounds(bounds: LatLngBounds): this
        // Update the bounds that this ImageOverlay covers
        setBounds: function(t) {
          return this._bounds = ut(t), this._map && this._reset(), this;
        },
        getEvents: function() {
          var t = {
            zoom: this._reset,
            viewreset: this._reset
          };
          return this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
        },
        // @method setZIndex(value: Number): this
        // Changes the [zIndex](#imageoverlay-zindex) of the image overlay.
        setZIndex: function(t) {
          return this.options.zIndex = t, this._updateZIndex(), this;
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
          var t = this._url.tagName === "IMG", n = this._image = t ? this._url : K("img");
          if (j(n, "leaflet-image-layer"), this._zoomAnimated && j(n, "leaflet-zoom-animated"), this.options.className && j(n, this.options.className), n.onselectstart = m, n.onmousemove = m, n.onload = l(this.fire, this, "load"), n.onerror = l(this._overlayOnError, this, "error"), (this.options.crossOrigin || this.options.crossOrigin === "") && (n.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), this.options.zIndex && this._updateZIndex(), t) {
            this._url = n.src;
            return;
          }
          n.src = this._url, n.alt = this.options.alt;
        },
        _animateZoom: function(t) {
          var n = this._map.getZoomScale(t.zoom), r = this._map._latLngBoundsToNewLayerBounds(this._bounds, t.zoom, t.center).min;
          hi(this._image, r, n);
        },
        _reset: function() {
          var t = this._image, n = new nt(
            this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
            this._map.latLngToLayerPoint(this._bounds.getSouthEast())
          ), r = n.getSize();
          ct(t, n.min), t.style.width = r.x + "px", t.style.height = r.y + "px";
        },
        _updateOpacity: function() {
          Lt(this._image, this.options.opacity);
        },
        _updateZIndex: function() {
          this._image && this.options.zIndex !== void 0 && this.options.zIndex !== null && (this._image.style.zIndex = this.options.zIndex);
        },
        _overlayOnError: function() {
          this.fire("error");
          var t = this.options.errorOverlayUrl;
          t && this._url !== t && (this._url = t, this._image.src = t);
        },
        // @method getCenter(): LatLng
        // Returns the center of the ImageOverlay.
        getCenter: function() {
          return this._bounds.getCenter();
        }
      }), qo = function(t, n, r) {
        return new ke(t, n, r);
      }, ua = ke.extend({
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
          var t = this._url.tagName === "VIDEO", n = this._image = t ? this._url : K("video");
          if (j(n, "leaflet-image-layer"), this._zoomAnimated && j(n, "leaflet-zoom-animated"), this.options.className && j(n, this.options.className), n.onselectstart = m, n.onmousemove = m, n.onloadeddata = l(this.fire, this, "load"), t) {
            for (var r = n.getElementsByTagName("source"), c = [], d = 0; d < r.length; d++)
              c.push(r[d].src);
            this._url = r.length > 0 ? c : [n.src];
            return;
          }
          G(this._url) || (this._url = [this._url]), !this.options.keepAspectRatio && Object.prototype.hasOwnProperty.call(n.style, "objectFit") && (n.style.objectFit = "fill"), n.autoplay = !!this.options.autoplay, n.loop = !!this.options.loop, n.muted = !!this.options.muted, n.playsInline = !!this.options.playsInline;
          for (var g = 0; g < this._url.length; g++) {
            var y = K("source");
            y.src = this._url[g], n.appendChild(y);
          }
        }
        // @method getElement(): HTMLVideoElement
        // Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
        // used by this overlay.
      });
      function jo(t, n, r) {
        return new ua(t, n, r);
      }
      var ca = ke.extend({
        _initImage: function() {
          var t = this._image = this._url;
          j(t, "leaflet-image-layer"), this._zoomAnimated && j(t, "leaflet-zoom-animated"), this.options.className && j(t, this.options.className), t.onselectstart = m, t.onmousemove = m;
        }
        // @method getElement(): SVGElement
        // Returns the instance of [`SVGElement`](https://developer.mozilla.org/docs/Web/API/SVGElement)
        // used by this overlay.
      });
      function Ho(t, n, r) {
        return new ca(t, n, r);
      }
      var jt = zt.extend({
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
        initialize: function(t, n) {
          t && (t instanceof tt || G(t)) ? (this._latlng = Y(t), x(this, n)) : (x(this, t), this._source = n), this.options.content && (this._content = this.options.content);
        },
        // @method openOn(map: Map): this
        // Adds the overlay to the map.
        // Alternative to `map.openPopup(popup)`/`.openTooltip(tooltip)`.
        openOn: function(t) {
          return t = arguments.length ? t : this._source._map, t.hasLayer(this) || t.addLayer(this), this;
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
        toggle: function(t) {
          return this._map ? this.close() : (arguments.length ? this._source = t : t = this._source, this._prepareOpen(), this.openOn(t._map)), this;
        },
        onAdd: function(t) {
          this._zoomAnimated = t._zoomAnimated, this._container || this._initLayout(), t._fadeAnimated && Lt(this._container, 0), clearTimeout(this._removeTimeout), this.getPane().appendChild(this._container), this.update(), t._fadeAnimated && Lt(this._container, 1), this.bringToFront(), this.options.interactive && (j(this._container, "leaflet-interactive"), this.addInteractiveTarget(this._container));
        },
        onRemove: function(t) {
          t._fadeAnimated ? (Lt(this._container, 0), this._removeTimeout = setTimeout(l(at, void 0, this._container), 200)) : at(this._container), this.options.interactive && (ht(this._container, "leaflet-interactive"), this.removeInteractiveTarget(this._container));
        },
        // @namespace DivOverlay
        // @method getLatLng: LatLng
        // Returns the geographical point of the overlay.
        getLatLng: function() {
          return this._latlng;
        },
        // @method setLatLng(latlng: LatLng): this
        // Sets the geographical point where the overlay will open.
        setLatLng: function(t) {
          return this._latlng = Y(t), this._map && (this._updatePosition(), this._adjustPan()), this;
        },
        // @method getContent: String|HTMLElement
        // Returns the content of the overlay.
        getContent: function() {
          return this._content;
        },
        // @method setContent(htmlContent: String|HTMLElement|Function): this
        // Sets the HTML content of the overlay. If a function is passed the source layer will be passed to the function.
        // The function should return a `String` or `HTMLElement` to be used in the overlay.
        setContent: function(t) {
          return this._content = t, this.update(), this;
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
          var t = {
            zoom: this._updatePosition,
            viewreset: this._updatePosition
          };
          return this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
        },
        // @method isOpen: Boolean
        // Returns `true` when the overlay is visible on the map.
        isOpen: function() {
          return !!this._map && this._map.hasLayer(this);
        },
        // @method bringToFront: this
        // Brings this overlay in front of other overlays (in the same map pane).
        bringToFront: function() {
          return this._map && pi(this._container), this;
        },
        // @method bringToBack: this
        // Brings this overlay to the back of other overlays (in the same map pane).
        bringToBack: function() {
          return this._map && vi(this._container), this;
        },
        // prepare bound overlay to open: update latlng pos / content source (for FeatureGroup)
        _prepareOpen: function(t) {
          var n = this._source;
          if (!n._map)
            return !1;
          if (n instanceof Xt) {
            n = null;
            var r = this._source._layers;
            for (var c in r)
              if (r[c]._map) {
                n = r[c];
                break;
              }
            if (!n)
              return !1;
            this._source = n;
          }
          if (!t)
            if (n.getCenter)
              t = n.getCenter();
            else if (n.getLatLng)
              t = n.getLatLng();
            else if (n.getBounds)
              t = n.getBounds().getCenter();
            else
              throw new Error("Unable to get source layer LatLng.");
          return this.setLatLng(t), this._map && this.update(), !0;
        },
        _updateContent: function() {
          if (this._content) {
            var t = this._contentNode, n = typeof this._content == "function" ? this._content(this._source || this) : this._content;
            if (typeof n == "string")
              t.innerHTML = n;
            else {
              for (; t.hasChildNodes(); )
                t.removeChild(t.firstChild);
              t.appendChild(n);
            }
            this.fire("contentupdate");
          }
        },
        _updatePosition: function() {
          if (this._map) {
            var t = this._map.latLngToLayerPoint(this._latlng), n = F(this.options.offset), r = this._getAnchor();
            this._zoomAnimated ? ct(this._container, t.add(r)) : n = n.add(t).add(r);
            var c = this._containerBottom = -n.y, d = this._containerLeft = -Math.round(this._containerWidth / 2) + n.x;
            this._container.style.bottom = c + "px", this._container.style.left = d + "px";
          }
        },
        _getAnchor: function() {
          return [0, 0];
        }
      });
      V.include({
        _initOverlay: function(t, n, r, c) {
          var d = n;
          return d instanceof t || (d = new t(c).setContent(n)), r && d.setLatLng(r), d;
        }
      }), zt.include({
        _initOverlay: function(t, n, r, c) {
          var d = r;
          return d instanceof t ? (x(d, c), d._source = this) : (d = n && !c ? n : new t(c, this), d.setContent(r)), d;
        }
      });
      var De = jt.extend({
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
        openOn: function(t) {
          return t = arguments.length ? t : this._source._map, !t.hasLayer(this) && t._popup && t._popup.options.autoClose && t.removeLayer(t._popup), t._popup = this, jt.prototype.openOn.call(this, t);
        },
        onAdd: function(t) {
          jt.prototype.onAdd.call(this, t), t.fire("popupopen", { popup: this }), this._source && (this._source.fire("popupopen", { popup: this }, !0), this._source instanceof ii || this._source.on("preclick", ui));
        },
        onRemove: function(t) {
          jt.prototype.onRemove.call(this, t), t.fire("popupclose", { popup: this }), this._source && (this._source.fire("popupclose", { popup: this }, !0), this._source instanceof ii || this._source.off("preclick", ui));
        },
        getEvents: function() {
          var t = jt.prototype.getEvents.call(this);
          return (this.options.closeOnClick !== void 0 ? this.options.closeOnClick : this._map.options.closePopupOnClick) && (t.preclick = this.close), this.options.keepInView && (t.moveend = this._adjustPan), t;
        },
        _initLayout: function() {
          var t = "leaflet-popup", n = this._container = K(
            "div",
            t + " " + (this.options.className || "") + " leaflet-zoom-animated"
          ), r = this._wrapper = K("div", t + "-content-wrapper", n);
          if (this._contentNode = K("div", t + "-content", r), Hi(n), Ls(this._contentNode), q(n, "contextmenu", ui), this._tipContainer = K("div", t + "-tip-container", n), this._tip = K("div", t + "-tip", this._tipContainer), this.options.closeButton) {
            var c = this._closeButton = K("a", t + "-close-button", n);
            c.setAttribute("role", "button"), c.setAttribute("aria-label", "Close popup"), c.href = "#close", c.innerHTML = '<span aria-hidden="true">&#215;</span>', q(c, "click", function(d) {
              mt(d), this.close();
            }, this);
          }
        },
        _updateLayout: function() {
          var t = this._contentNode, n = t.style;
          n.width = "", n.whiteSpace = "nowrap";
          var r = t.offsetWidth;
          r = Math.min(r, this.options.maxWidth), r = Math.max(r, this.options.minWidth), n.width = r + 1 + "px", n.whiteSpace = "", n.height = "";
          var c = t.offsetHeight, d = this.options.maxHeight, g = "leaflet-popup-scrolled";
          d && c > d ? (n.height = d + "px", j(t, g)) : ht(t, g), this._containerWidth = this._container.offsetWidth;
        },
        _animateZoom: function(t) {
          var n = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center), r = this._getAnchor();
          ct(this._container, n.add(r));
        },
        _adjustPan: function() {
          if (this.options.autoPan) {
            if (this._map._panAnim && this._map._panAnim.stop(), this._autopanning) {
              this._autopanning = !1;
              return;
            }
            var t = this._map, n = parseInt(Fi(this._container, "marginBottom"), 10) || 0, r = this._container.offsetHeight + n, c = this._containerWidth, d = new U(this._containerLeft, -r - this._containerBottom);
            d._add(li(this._container));
            var g = t.layerPointToContainerPoint(d), y = F(this.options.autoPanPadding), P = F(this.options.autoPanPaddingTopLeft || y), b = F(this.options.autoPanPaddingBottomRight || y), T = t.getSize(), O = 0, k = 0;
            g.x + c + b.x > T.x && (O = g.x + c - T.x + b.x), g.x - O - P.x < 0 && (O = g.x - P.x), g.y + r + b.y > T.y && (k = g.y + r - T.y + b.y), g.y - k - P.y < 0 && (k = g.y - P.y), (O || k) && (this.options.keepInView && (this._autopanning = !0), t.fire("autopanstart").panBy([O, k]));
          }
        },
        _getAnchor: function() {
          return F(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
        }
      }), Wo = function(t, n) {
        return new De(t, n);
      };
      V.mergeOptions({
        closePopupOnClick: !0
      }), V.include({
        // @method openPopup(popup: Popup): this
        // Opens the specified popup while closing the previously opened (to make sure only one is opened at one time for usability).
        // @alternative
        // @method openPopup(content: String|HTMLElement, latlng: LatLng, options?: Popup options): this
        // Creates a popup with the specified content and options and opens it in the given point on a map.
        openPopup: function(t, n, r) {
          return this._initOverlay(De, t, n, r).openOn(this), this;
        },
        // @method closePopup(popup?: Popup): this
        // Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
        closePopup: function(t) {
          return t = arguments.length ? t : this._popup, t && t.close(), this;
        }
      }), zt.include({
        // @method bindPopup(content: String|HTMLElement|Function|Popup, options?: Popup options): this
        // Binds a popup to the layer with the passed `content` and sets up the
        // necessary event listeners. If a `Function` is passed it will receive
        // the layer as the first argument and should return a `String` or `HTMLElement`.
        bindPopup: function(t, n) {
          return this._popup = this._initOverlay(De, this._popup, t, n), this._popupHandlersAdded || (this.on({
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
        openPopup: function(t) {
          return this._popup && (this instanceof Xt || (this._popup._source = this), this._popup._prepareOpen(t || this._latlng) && this._popup.openOn(this._map)), this;
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
        setPopupContent: function(t) {
          return this._popup && this._popup.setContent(t), this;
        },
        // @method getPopup(): Popup
        // Returns the popup bound to this layer.
        getPopup: function() {
          return this._popup;
        },
        _openPopup: function(t) {
          if (!(!this._popup || !this._map)) {
            ci(t);
            var n = t.layer || t.target;
            if (this._popup._source === n && !(n instanceof ii)) {
              this._map.hasLayer(this._popup) ? this.closePopup() : this.openPopup(t.latlng);
              return;
            }
            this._popup._source = n, this.openPopup(t.latlng);
          }
        },
        _movePopup: function(t) {
          this._popup.setLatLng(t.latlng);
        },
        _onKeyPress: function(t) {
          t.originalEvent.keyCode === 13 && this._openPopup(t);
        }
      });
      var Ze = jt.extend({
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
        onAdd: function(t) {
          jt.prototype.onAdd.call(this, t), this.setOpacity(this.options.opacity), t.fire("tooltipopen", { tooltip: this }), this._source && (this.addEventParent(this._source), this._source.fire("tooltipopen", { tooltip: this }, !0));
        },
        onRemove: function(t) {
          jt.prototype.onRemove.call(this, t), t.fire("tooltipclose", { tooltip: this }), this._source && (this.removeEventParent(this._source), this._source.fire("tooltipclose", { tooltip: this }, !0));
        },
        getEvents: function() {
          var t = jt.prototype.getEvents.call(this);
          return this.options.permanent || (t.preclick = this.close), t;
        },
        _initLayout: function() {
          var t = "leaflet-tooltip", n = t + " " + (this.options.className || "") + " leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");
          this._contentNode = this._container = K("div", n), this._container.setAttribute("role", "tooltip"), this._container.setAttribute("id", "leaflet-tooltip-" + f(this));
        },
        _updateLayout: function() {
        },
        _adjustPan: function() {
        },
        _setPosition: function(t) {
          var n, r, c = this._map, d = this._container, g = c.latLngToContainerPoint(c.getCenter()), y = c.layerPointToContainerPoint(t), P = this.options.direction, b = d.offsetWidth, T = d.offsetHeight, O = F(this.options.offset), k = this._getAnchor();
          P === "top" ? (n = b / 2, r = T) : P === "bottom" ? (n = b / 2, r = 0) : P === "center" ? (n = b / 2, r = T / 2) : P === "right" ? (n = 0, r = T / 2) : P === "left" ? (n = b, r = T / 2) : y.x < g.x ? (P = "right", n = 0, r = T / 2) : (P = "left", n = b + (O.x + k.x) * 2, r = T / 2), t = t.subtract(F(n, r, !0)).add(O).add(k), ht(d, "leaflet-tooltip-right"), ht(d, "leaflet-tooltip-left"), ht(d, "leaflet-tooltip-top"), ht(d, "leaflet-tooltip-bottom"), j(d, "leaflet-tooltip-" + P), ct(d, t);
        },
        _updatePosition: function() {
          var t = this._map.latLngToLayerPoint(this._latlng);
          this._setPosition(t);
        },
        setOpacity: function(t) {
          this.options.opacity = t, this._container && Lt(this._container, t);
        },
        _animateZoom: function(t) {
          var n = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center);
          this._setPosition(n);
        },
        _getAnchor: function() {
          return F(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
        }
      }), Xo = function(t, n) {
        return new Ze(t, n);
      };
      V.include({
        // @method openTooltip(tooltip: Tooltip): this
        // Opens the specified tooltip.
        // @alternative
        // @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
        // Creates a tooltip with the specified content and options and open it.
        openTooltip: function(t, n, r) {
          return this._initOverlay(Ze, t, n, r).openOn(this), this;
        },
        // @method closeTooltip(tooltip: Tooltip): this
        // Closes the tooltip given as parameter.
        closeTooltip: function(t) {
          return t.close(), this;
        }
      }), zt.include({
        // @method bindTooltip(content: String|HTMLElement|Function|Tooltip, options?: Tooltip options): this
        // Binds a tooltip to the layer with the passed `content` and sets up the
        // necessary event listeners. If a `Function` is passed it will receive
        // the layer as the first argument and should return a `String` or `HTMLElement`.
        bindTooltip: function(t, n) {
          return this._tooltip && this.isTooltipOpen() && this.unbindTooltip(), this._tooltip = this._initOverlay(Ze, this._tooltip, t, n), this._initTooltipInteractions(), this._tooltip.options.permanent && this._map && this._map.hasLayer(this) && this.openTooltip(), this;
        },
        // @method unbindTooltip(): this
        // Removes the tooltip previously bound with `bindTooltip`.
        unbindTooltip: function() {
          return this._tooltip && (this._initTooltipInteractions(!0), this.closeTooltip(), this._tooltip = null), this;
        },
        _initTooltipInteractions: function(t) {
          if (!(!t && this._tooltipHandlersAdded)) {
            var n = t ? "off" : "on", r = {
              remove: this.closeTooltip,
              move: this._moveTooltip
            };
            this._tooltip.options.permanent ? r.add = this._openTooltip : (r.mouseover = this._openTooltip, r.mouseout = this.closeTooltip, r.click = this._openTooltip, this._map ? this._addFocusListeners() : r.add = this._addFocusListeners), this._tooltip.options.sticky && (r.mousemove = this._moveTooltip), this[n](r), this._tooltipHandlersAdded = !t;
          }
        },
        // @method openTooltip(latlng?: LatLng): this
        // Opens the bound tooltip at the specified `latlng` or at the default tooltip anchor if no `latlng` is passed.
        openTooltip: function(t) {
          return this._tooltip && (this instanceof Xt || (this._tooltip._source = this), this._tooltip._prepareOpen(t) && (this._tooltip.openOn(this._map), this.getElement ? this._setAriaDescribedByOnLayer(this) : this.eachLayer && this.eachLayer(this._setAriaDescribedByOnLayer, this))), this;
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
        setTooltipContent: function(t) {
          return this._tooltip && this._tooltip.setContent(t), this;
        },
        // @method getTooltip(): Tooltip
        // Returns the tooltip bound to this layer.
        getTooltip: function() {
          return this._tooltip;
        },
        _addFocusListeners: function() {
          this.getElement ? this._addFocusListenersOnLayer(this) : this.eachLayer && this.eachLayer(this._addFocusListenersOnLayer, this);
        },
        _addFocusListenersOnLayer: function(t) {
          var n = typeof t.getElement == "function" && t.getElement();
          n && (q(n, "focus", function() {
            this._tooltip._source = t, this.openTooltip();
          }, this), q(n, "blur", this.closeTooltip, this));
        },
        _setAriaDescribedByOnLayer: function(t) {
          var n = typeof t.getElement == "function" && t.getElement();
          n && n.setAttribute("aria-describedby", this._tooltip._container.id);
        },
        _openTooltip: function(t) {
          if (!(!this._tooltip || !this._map)) {
            if (this._map.dragging && this._map.dragging.moving() && !this._openOnceFlag) {
              this._openOnceFlag = !0;
              var n = this;
              this._map.once("moveend", function() {
                n._openOnceFlag = !1, n._openTooltip(t);
              });
              return;
            }
            this._tooltip._source = t.layer || t.target, this.openTooltip(this._tooltip.options.sticky ? t.latlng : void 0);
          }
        },
        _moveTooltip: function(t) {
          var n = t.latlng, r, c;
          this._tooltip.options.sticky && t.originalEvent && (r = this._map.mouseEventToContainerPoint(t.originalEvent), c = this._map.containerPointToLayerPoint(r), n = this._map.layerPointToLatLng(c)), this._tooltip.setLatLng(n);
        }
      });
      var fa = Mi.extend({
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
        createIcon: function(t) {
          var n = t && t.tagName === "DIV" ? t : document.createElement("div"), r = this.options;
          if (r.html instanceof Element ? (Ee(n), n.appendChild(r.html)) : n.innerHTML = r.html !== !1 ? r.html : "", r.bgPos) {
            var c = F(r.bgPos);
            n.style.backgroundPosition = -c.x + "px " + -c.y + "px";
          }
          return this._setIconStyles(n, "icon"), n;
        },
        createShadow: function() {
          return null;
        }
      });
      function Yo(t) {
        return new fa(t);
      }
      Mi.Default = Yi;
      var Vi = zt.extend({
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
          updateWhenIdle: R.mobile,
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
        initialize: function(t) {
          x(this, t);
        },
        onAdd: function() {
          this._initContainer(), this._levels = {}, this._tiles = {}, this._resetView();
        },
        beforeAdd: function(t) {
          t._addZoomLimit(this);
        },
        onRemove: function(t) {
          this._removeAllTiles(), at(this._container), t._removeZoomLimit(this), this._container = null, this._tileZoom = void 0;
        },
        // @method bringToFront: this
        // Brings the tile layer to the top of all tile layers.
        bringToFront: function() {
          return this._map && (pi(this._container), this._setAutoZIndex(Math.max)), this;
        },
        // @method bringToBack: this
        // Brings the tile layer to the bottom of all tile layers.
        bringToBack: function() {
          return this._map && (vi(this._container), this._setAutoZIndex(Math.min)), this;
        },
        // @method getContainer: HTMLElement
        // Returns the HTML element that contains the tiles for this layer.
        getContainer: function() {
          return this._container;
        },
        // @method setOpacity(opacity: Number): this
        // Changes the [opacity](#gridlayer-opacity) of the grid layer.
        setOpacity: function(t) {
          return this.options.opacity = t, this._updateOpacity(), this;
        },
        // @method setZIndex(zIndex: Number): this
        // Changes the [zIndex](#gridlayer-zindex) of the grid layer.
        setZIndex: function(t) {
          return this.options.zIndex = t, this._updateZIndex(), this;
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
            var t = this._clampZoom(this._map.getZoom());
            t !== this._tileZoom && (this._tileZoom = t, this._updateLevels()), this._update();
          }
          return this;
        },
        getEvents: function() {
          var t = {
            viewprereset: this._invalidateAll,
            viewreset: this._resetView,
            zoom: this._resetView,
            moveend: this._onMoveEnd
          };
          return this.options.updateWhenIdle || (this._onMove || (this._onMove = _(this._onMoveEnd, this.options.updateInterval, this)), t.move = this._onMove), this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
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
          var t = this.options.tileSize;
          return t instanceof U ? t : new U(t, t);
        },
        _updateZIndex: function() {
          this._container && this.options.zIndex !== void 0 && this.options.zIndex !== null && (this._container.style.zIndex = this.options.zIndex);
        },
        _setAutoZIndex: function(t) {
          for (var n = this.getPane().children, r = -t(-1 / 0, 1 / 0), c = 0, d = n.length, g; c < d; c++)
            g = n[c].style.zIndex, n[c] !== this._container && g && (r = t(r, +g));
          isFinite(r) && (this.options.zIndex = r + t(-1, 1), this._updateZIndex());
        },
        _updateOpacity: function() {
          if (this._map && !R.ielt9) {
            Lt(this._container, this.options.opacity);
            var t = +/* @__PURE__ */ new Date(), n = !1, r = !1;
            for (var c in this._tiles) {
              var d = this._tiles[c];
              if (!(!d.current || !d.loaded)) {
                var g = Math.min(1, (t - d.loaded) / 200);
                Lt(d.el, g), g < 1 ? n = !0 : (d.active ? r = !0 : this._onOpaqueTile(d), d.active = !0);
              }
            }
            r && !this._noPrune && this._pruneTiles(), n && (dt(this._fadeFrame), this._fadeFrame = $(this._updateOpacity, this));
          }
        },
        _onOpaqueTile: m,
        _initContainer: function() {
          this._container || (this._container = K("div", "leaflet-layer " + (this.options.className || "")), this._updateZIndex(), this.options.opacity < 1 && this._updateOpacity(), this.getPane().appendChild(this._container));
        },
        _updateLevels: function() {
          var t = this._tileZoom, n = this.options.maxZoom;
          if (t !== void 0) {
            for (var r in this._levels)
              r = Number(r), this._levels[r].el.children.length || r === t ? (this._levels[r].el.style.zIndex = n - Math.abs(t - r), this._onUpdateLevel(r)) : (at(this._levels[r].el), this._removeTilesAtZoom(r), this._onRemoveLevel(r), delete this._levels[r]);
            var c = this._levels[t], d = this._map;
            return c || (c = this._levels[t] = {}, c.el = K("div", "leaflet-tile-container leaflet-zoom-animated", this._container), c.el.style.zIndex = n, c.origin = d.project(d.unproject(d.getPixelOrigin()), t).round(), c.zoom = t, this._setZoomTransform(c, d.getCenter(), d.getZoom()), m(c.el.offsetWidth), this._onCreateLevel(c)), this._level = c, c;
          }
        },
        _onUpdateLevel: m,
        _onRemoveLevel: m,
        _onCreateLevel: m,
        _pruneTiles: function() {
          if (this._map) {
            var t, n, r = this._map.getZoom();
            if (r > this.options.maxZoom || r < this.options.minZoom) {
              this._removeAllTiles();
              return;
            }
            for (t in this._tiles)
              n = this._tiles[t], n.retain = n.current;
            for (t in this._tiles)
              if (n = this._tiles[t], n.current && !n.active) {
                var c = n.coords;
                this._retainParent(c.x, c.y, c.z, c.z - 5) || this._retainChildren(c.x, c.y, c.z, c.z + 2);
              }
            for (t in this._tiles)
              this._tiles[t].retain || this._removeTile(t);
          }
        },
        _removeTilesAtZoom: function(t) {
          for (var n in this._tiles)
            this._tiles[n].coords.z === t && this._removeTile(n);
        },
        _removeAllTiles: function() {
          for (var t in this._tiles)
            this._removeTile(t);
        },
        _invalidateAll: function() {
          for (var t in this._levels)
            at(this._levels[t].el), this._onRemoveLevel(Number(t)), delete this._levels[t];
          this._removeAllTiles(), this._tileZoom = void 0;
        },
        _retainParent: function(t, n, r, c) {
          var d = Math.floor(t / 2), g = Math.floor(n / 2), y = r - 1, P = new U(+d, +g);
          P.z = +y;
          var b = this._tileCoordsToKey(P), T = this._tiles[b];
          return T && T.active ? (T.retain = !0, !0) : (T && T.loaded && (T.retain = !0), y > c ? this._retainParent(d, g, y, c) : !1);
        },
        _retainChildren: function(t, n, r, c) {
          for (var d = 2 * t; d < 2 * t + 2; d++)
            for (var g = 2 * n; g < 2 * n + 2; g++) {
              var y = new U(d, g);
              y.z = r + 1;
              var P = this._tileCoordsToKey(y), b = this._tiles[P];
              if (b && b.active) {
                b.retain = !0;
                continue;
              } else b && b.loaded && (b.retain = !0);
              r + 1 < c && this._retainChildren(d, g, r + 1, c);
            }
        },
        _resetView: function(t) {
          var n = t && (t.pinch || t.flyTo);
          this._setView(this._map.getCenter(), this._map.getZoom(), n, n);
        },
        _animateZoom: function(t) {
          this._setView(t.center, t.zoom, !0, t.noUpdate);
        },
        _clampZoom: function(t) {
          var n = this.options;
          return n.minNativeZoom !== void 0 && t < n.minNativeZoom ? n.minNativeZoom : n.maxNativeZoom !== void 0 && n.maxNativeZoom < t ? n.maxNativeZoom : t;
        },
        _setView: function(t, n, r, c) {
          var d = Math.round(n);
          this.options.maxZoom !== void 0 && d > this.options.maxZoom || this.options.minZoom !== void 0 && d < this.options.minZoom ? d = void 0 : d = this._clampZoom(d);
          var g = this.options.updateWhenZooming && d !== this._tileZoom;
          (!c || g) && (this._tileZoom = d, this._abortLoading && this._abortLoading(), this._updateLevels(), this._resetGrid(), d !== void 0 && this._update(t), r || this._pruneTiles(), this._noPrune = !!r), this._setZoomTransforms(t, n);
        },
        _setZoomTransforms: function(t, n) {
          for (var r in this._levels)
            this._setZoomTransform(this._levels[r], t, n);
        },
        _setZoomTransform: function(t, n, r) {
          var c = this._map.getZoomScale(r, t.zoom), d = t.origin.multiplyBy(c).subtract(this._map._getNewPixelOrigin(n, r)).round();
          R.any3d ? hi(t.el, d, c) : ct(t.el, d);
        },
        _resetGrid: function() {
          var t = this._map, n = t.options.crs, r = this._tileSize = this.getTileSize(), c = this._tileZoom, d = this._map.getPixelWorldBounds(this._tileZoom);
          d && (this._globalTileRange = this._pxBoundsToTileRange(d)), this._wrapX = n.wrapLng && !this.options.noWrap && [
            Math.floor(t.project([0, n.wrapLng[0]], c).x / r.x),
            Math.ceil(t.project([0, n.wrapLng[1]], c).x / r.y)
          ], this._wrapY = n.wrapLat && !this.options.noWrap && [
            Math.floor(t.project([n.wrapLat[0], 0], c).y / r.x),
            Math.ceil(t.project([n.wrapLat[1], 0], c).y / r.y)
          ];
        },
        _onMoveEnd: function() {
          !this._map || this._map._animatingZoom || this._update();
        },
        _getTiledPixelBounds: function(t) {
          var n = this._map, r = n._animatingZoom ? Math.max(n._animateToZoom, n.getZoom()) : n.getZoom(), c = n.getZoomScale(r, this._tileZoom), d = n.project(t, this._tileZoom).floor(), g = n.getSize().divideBy(c * 2);
          return new nt(d.subtract(g), d.add(g));
        },
        // Private method to load tiles in the grid's active zoom level according to map bounds
        _update: function(t) {
          var n = this._map;
          if (n) {
            var r = this._clampZoom(n.getZoom());
            if (t === void 0 && (t = n.getCenter()), this._tileZoom !== void 0) {
              var c = this._getTiledPixelBounds(t), d = this._pxBoundsToTileRange(c), g = d.getCenter(), y = [], P = this.options.keepBuffer, b = new nt(
                d.getBottomLeft().subtract([P, -P]),
                d.getTopRight().add([P, -P])
              );
              if (!(isFinite(d.min.x) && isFinite(d.min.y) && isFinite(d.max.x) && isFinite(d.max.y)))
                throw new Error("Attempted to load an infinite number of tiles");
              for (var T in this._tiles) {
                var O = this._tiles[T].coords;
                (O.z !== this._tileZoom || !b.contains(new U(O.x, O.y))) && (this._tiles[T].current = !1);
              }
              if (Math.abs(r - this._tileZoom) > 1) {
                this._setView(t, r);
                return;
              }
              for (var k = d.min.y; k <= d.max.y; k++)
                for (var H = d.min.x; H <= d.max.x; H++) {
                  var yt = new U(H, k);
                  if (yt.z = this._tileZoom, !!this._isValidTile(yt)) {
                    var _t = this._tiles[this._tileCoordsToKey(yt)];
                    _t ? _t.current = !0 : y.push(yt);
                  }
                }
              if (y.sort(function(Pt, bi) {
                return Pt.distanceTo(g) - bi.distanceTo(g);
              }), y.length !== 0) {
                this._loading || (this._loading = !0, this.fire("loading"));
                var It = document.createDocumentFragment();
                for (H = 0; H < y.length; H++)
                  this._addTile(y[H], It);
                this._level.el.appendChild(It);
              }
            }
          }
        },
        _isValidTile: function(t) {
          var n = this._map.options.crs;
          if (!n.infinite) {
            var r = this._globalTileRange;
            if (!n.wrapLng && (t.x < r.min.x || t.x > r.max.x) || !n.wrapLat && (t.y < r.min.y || t.y > r.max.y))
              return !1;
          }
          if (!this.options.bounds)
            return !0;
          var c = this._tileCoordsToBounds(t);
          return ut(this.options.bounds).overlaps(c);
        },
        _keyToBounds: function(t) {
          return this._tileCoordsToBounds(this._keyToTileCoords(t));
        },
        _tileCoordsToNwSe: function(t) {
          var n = this._map, r = this.getTileSize(), c = t.scaleBy(r), d = c.add(r), g = n.unproject(c, t.z), y = n.unproject(d, t.z);
          return [g, y];
        },
        // converts tile coordinates to its geographical bounds
        _tileCoordsToBounds: function(t) {
          var n = this._tileCoordsToNwSe(t), r = new xt(n[0], n[1]);
          return this.options.noWrap || (r = this._map.wrapLatLngBounds(r)), r;
        },
        // converts tile coordinates to key for the tile cache
        _tileCoordsToKey: function(t) {
          return t.x + ":" + t.y + ":" + t.z;
        },
        // converts tile cache key to coordinates
        _keyToTileCoords: function(t) {
          var n = t.split(":"), r = new U(+n[0], +n[1]);
          return r.z = +n[2], r;
        },
        _removeTile: function(t) {
          var n = this._tiles[t];
          n && (at(n.el), delete this._tiles[t], this.fire("tileunload", {
            tile: n.el,
            coords: this._keyToTileCoords(t)
          }));
        },
        _initTile: function(t) {
          j(t, "leaflet-tile");
          var n = this.getTileSize();
          t.style.width = n.x + "px", t.style.height = n.y + "px", t.onselectstart = m, t.onmousemove = m, R.ielt9 && this.options.opacity < 1 && Lt(t, this.options.opacity);
        },
        _addTile: function(t, n) {
          var r = this._getTilePos(t), c = this._tileCoordsToKey(t), d = this.createTile(this._wrapCoords(t), l(this._tileReady, this, t));
          this._initTile(d), this.createTile.length < 2 && $(l(this._tileReady, this, t, null, d)), ct(d, r), this._tiles[c] = {
            el: d,
            coords: t,
            current: !0
          }, n.appendChild(d), this.fire("tileloadstart", {
            tile: d,
            coords: t
          });
        },
        _tileReady: function(t, n, r) {
          n && this.fire("tileerror", {
            error: n,
            tile: r,
            coords: t
          });
          var c = this._tileCoordsToKey(t);
          r = this._tiles[c], r && (r.loaded = +/* @__PURE__ */ new Date(), this._map._fadeAnimated ? (Lt(r.el, 0), dt(this._fadeFrame), this._fadeFrame = $(this._updateOpacity, this)) : (r.active = !0, this._pruneTiles()), n || (j(r.el, "leaflet-tile-loaded"), this.fire("tileload", {
            tile: r.el,
            coords: t
          })), this._noTilesToLoad() && (this._loading = !1, this.fire("load"), R.ielt9 || !this._map._fadeAnimated ? $(this._pruneTiles, this) : setTimeout(l(this._pruneTiles, this), 250)));
        },
        _getTilePos: function(t) {
          return t.scaleBy(this.getTileSize()).subtract(this._level.origin);
        },
        _wrapCoords: function(t) {
          var n = new U(
            this._wrapX ? v(t.x, this._wrapX) : t.x,
            this._wrapY ? v(t.y, this._wrapY) : t.y
          );
          return n.z = t.z, n;
        },
        _pxBoundsToTileRange: function(t) {
          var n = this.getTileSize();
          return new nt(
            t.min.unscaleBy(n).floor(),
            t.max.unscaleBy(n).ceil().subtract([1, 1])
          );
        },
        _noTilesToLoad: function() {
          for (var t in this._tiles)
            if (!this._tiles[t].loaded)
              return !1;
          return !0;
        }
      });
      function Vo(t) {
        return new Vi(t);
      }
      var Pi = Vi.extend({
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
        initialize: function(t, n) {
          this._url = t, n = x(this, n), n.detectRetina && R.retina && n.maxZoom > 0 ? (n.tileSize = Math.floor(n.tileSize / 2), n.zoomReverse ? (n.zoomOffset--, n.minZoom = Math.min(n.maxZoom, n.minZoom + 1)) : (n.zoomOffset++, n.maxZoom = Math.max(n.minZoom, n.maxZoom - 1)), n.minZoom = Math.max(0, n.minZoom)) : n.zoomReverse ? n.minZoom = Math.min(n.maxZoom, n.minZoom) : n.maxZoom = Math.max(n.minZoom, n.maxZoom), typeof n.subdomains == "string" && (n.subdomains = n.subdomains.split("")), this.on("tileunload", this._onTileRemove);
        },
        // @method setUrl(url: String, noRedraw?: Boolean): this
        // Updates the layer's URL template and redraws it (unless `noRedraw` is set to `true`).
        // If the URL does not change, the layer will not be redrawn unless
        // the noRedraw parameter is set to false.
        setUrl: function(t, n) {
          return this._url === t && n === void 0 && (n = !0), this._url = t, n || this.redraw(), this;
        },
        // @method createTile(coords: Object, done?: Function): HTMLElement
        // Called only internally, overrides GridLayer's [`createTile()`](#gridlayer-createtile)
        // to return an `<img>` HTML element with the appropriate image URL given `coords`. The `done`
        // callback is called when the tile has been loaded.
        createTile: function(t, n) {
          var r = document.createElement("img");
          return q(r, "load", l(this._tileOnLoad, this, n, r)), q(r, "error", l(this._tileOnError, this, n, r)), (this.options.crossOrigin || this.options.crossOrigin === "") && (r.crossOrigin = this.options.crossOrigin === !0 ? "" : this.options.crossOrigin), typeof this.options.referrerPolicy == "string" && (r.referrerPolicy = this.options.referrerPolicy), r.alt = "", r.src = this.getTileUrl(t), r;
        },
        // @section Extension methods
        // @uninheritable
        // Layers extending `TileLayer` might reimplement the following method.
        // @method getTileUrl(coords: Object): String
        // Called only internally, returns the URL for a tile given its coordinates.
        // Classes extending `TileLayer` can override this function to provide custom tile URL naming schemes.
        getTileUrl: function(t) {
          var n = {
            r: R.retina ? "@2x" : "",
            s: this._getSubdomain(t),
            x: t.x,
            y: t.y,
            z: this._getZoomForUrl()
          };
          if (this._map && !this._map.options.crs.infinite) {
            var r = this._globalTileRange.max.y - t.y;
            this.options.tms && (n.y = r), n["-y"] = r;
          }
          return C(this._url, o(n, this.options));
        },
        _tileOnLoad: function(t, n) {
          R.ielt9 ? setTimeout(l(t, this, null, n), 0) : t(null, n);
        },
        _tileOnError: function(t, n, r) {
          var c = this.options.errorTileUrl;
          c && n.getAttribute("src") !== c && (n.src = c), t(r, n);
        },
        _onTileRemove: function(t) {
          t.tile.onload = null;
        },
        _getZoomForUrl: function() {
          var t = this._tileZoom, n = this.options.maxZoom, r = this.options.zoomReverse, c = this.options.zoomOffset;
          return r && (t = n - t), t + c;
        },
        _getSubdomain: function(t) {
          var n = Math.abs(t.x + t.y) % this.options.subdomains.length;
          return this.options.subdomains[n];
        },
        // stops loading all tiles in the background layer
        _abortLoading: function() {
          var t, n;
          for (t in this._tiles)
            if (this._tiles[t].coords.z !== this._tileZoom && (n = this._tiles[t].el, n.onload = m, n.onerror = m, !n.complete)) {
              n.src = B;
              var r = this._tiles[t].coords;
              at(n), delete this._tiles[t], this.fire("tileabort", {
                tile: n,
                coords: r
              });
            }
        },
        _removeTile: function(t) {
          var n = this._tiles[t];
          if (n)
            return n.el.setAttribute("src", B), Vi.prototype._removeTile.call(this, t);
        },
        _tileReady: function(t, n, r) {
          if (!(!this._map || r && r.getAttribute("src") === B))
            return Vi.prototype._tileReady.call(this, t, n, r);
        }
      });
      function da(t, n) {
        return new Pi(t, n);
      }
      var _a = Pi.extend({
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
        initialize: function(t, n) {
          this._url = t;
          var r = o({}, this.defaultWmsParams);
          for (var c in n)
            c in this.options || (r[c] = n[c]);
          n = x(this, n);
          var d = n.detectRetina && R.retina ? 2 : 1, g = this.getTileSize();
          r.width = g.x * d, r.height = g.y * d, this.wmsParams = r;
        },
        onAdd: function(t) {
          this._crs = this.options.crs || t.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version);
          var n = this._wmsVersion >= 1.3 ? "crs" : "srs";
          this.wmsParams[n] = this._crs.code, Pi.prototype.onAdd.call(this, t);
        },
        getTileUrl: function(t) {
          var n = this._tileCoordsToNwSe(t), r = this._crs, c = wt(r.project(n[0]), r.project(n[1])), d = c.min, g = c.max, y = (this._wmsVersion >= 1.3 && this._crs === ra ? [d.y, d.x, g.y, g.x] : [d.x, d.y, g.x, g.y]).join(","), P = Pi.prototype.getTileUrl.call(this, t);
          return P + S(this.wmsParams, P, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + y;
        },
        // @method setParams(params: Object, noRedraw?: Boolean): this
        // Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
        setParams: function(t, n) {
          return o(this.wmsParams, t), n || this.redraw(), this;
        }
      });
      function Ko(t, n) {
        return new _a(t, n);
      }
      Pi.WMS = _a, da.wms = Ko;
      var Kt = zt.extend({
        // @section
        // @aka Renderer options
        options: {
          // @option padding: Number = 0.1
          // How much to extend the clip area around the map view (relative to its size)
          // e.g. 0.1 would be 10% of map view in each direction
          padding: 0.1
        },
        initialize: function(t) {
          x(this, t), f(this), this._layers = this._layers || {};
        },
        onAdd: function() {
          this._container || (this._initContainer(), j(this._container, "leaflet-zoom-animated")), this.getPane().appendChild(this._container), this._update(), this.on("update", this._updatePaths, this);
        },
        onRemove: function() {
          this.off("update", this._updatePaths, this), this._destroyContainer();
        },
        getEvents: function() {
          var t = {
            viewreset: this._reset,
            zoom: this._onZoom,
            moveend: this._update,
            zoomend: this._onZoomEnd
          };
          return this._zoomAnimated && (t.zoomanim = this._onAnimZoom), t;
        },
        _onAnimZoom: function(t) {
          this._updateTransform(t.center, t.zoom);
        },
        _onZoom: function() {
          this._updateTransform(this._map.getCenter(), this._map.getZoom());
        },
        _updateTransform: function(t, n) {
          var r = this._map.getZoomScale(n, this._zoom), c = this._map.getSize().multiplyBy(0.5 + this.options.padding), d = this._map.project(this._center, n), g = c.multiplyBy(-r).add(d).subtract(this._map._getNewPixelOrigin(t, n));
          R.any3d ? hi(this._container, g, r) : ct(this._container, g);
        },
        _reset: function() {
          this._update(), this._updateTransform(this._center, this._zoom);
          for (var t in this._layers)
            this._layers[t]._reset();
        },
        _onZoomEnd: function() {
          for (var t in this._layers)
            this._layers[t]._project();
        },
        _updatePaths: function() {
          for (var t in this._layers)
            this._layers[t]._update();
        },
        _update: function() {
          var t = this.options.padding, n = this._map.getSize(), r = this._map.containerPointToLayerPoint(n.multiplyBy(-t)).round();
          this._bounds = new nt(r, r.add(n.multiplyBy(1 + t * 2)).round()), this._center = this._map.getCenter(), this._zoom = this._map.getZoom();
        }
      }), ma = Kt.extend({
        // @section
        // @aka Canvas options
        options: {
          // @option tolerance: Number = 0
          // How much to extend the click tolerance around a path/object on the map.
          tolerance: 0
        },
        getEvents: function() {
          var t = Kt.prototype.getEvents.call(this);
          return t.viewprereset = this._onViewPreReset, t;
        },
        _onViewPreReset: function() {
          this._postponeUpdatePaths = !0;
        },
        onAdd: function() {
          Kt.prototype.onAdd.call(this), this._draw();
        },
        _initContainer: function() {
          var t = this._container = document.createElement("canvas");
          q(t, "mousemove", this._onMouseMove, this), q(t, "click dblclick mousedown mouseup contextmenu", this._onClick, this), q(t, "mouseout", this._handleMouseOut, this), t._leaflet_disable_events = !0, this._ctx = t.getContext("2d");
        },
        _destroyContainer: function() {
          dt(this._redrawRequest), delete this._ctx, at(this._container), st(this._container), delete this._container;
        },
        _updatePaths: function() {
          if (!this._postponeUpdatePaths) {
            var t;
            this._redrawBounds = null;
            for (var n in this._layers)
              t = this._layers[n], t._update();
            this._redraw();
          }
        },
        _update: function() {
          if (!(this._map._animatingZoom && this._bounds)) {
            Kt.prototype._update.call(this);
            var t = this._bounds, n = this._container, r = t.getSize(), c = R.retina ? 2 : 1;
            ct(n, t.min), n.width = c * r.x, n.height = c * r.y, n.style.width = r.x + "px", n.style.height = r.y + "px", R.retina && this._ctx.scale(2, 2), this._ctx.translate(-t.min.x, -t.min.y), this.fire("update");
          }
        },
        _reset: function() {
          Kt.prototype._reset.call(this), this._postponeUpdatePaths && (this._postponeUpdatePaths = !1, this._updatePaths());
        },
        _initPath: function(t) {
          this._updateDashArray(t), this._layers[f(t)] = t;
          var n = t._order = {
            layer: t,
            prev: this._drawLast,
            next: null
          };
          this._drawLast && (this._drawLast.next = n), this._drawLast = n, this._drawFirst = this._drawFirst || this._drawLast;
        },
        _addPath: function(t) {
          this._requestRedraw(t);
        },
        _removePath: function(t) {
          var n = t._order, r = n.next, c = n.prev;
          r ? r.prev = c : this._drawLast = c, c ? c.next = r : this._drawFirst = r, delete t._order, delete this._layers[f(t)], this._requestRedraw(t);
        },
        _updatePath: function(t) {
          this._extendRedrawBounds(t), t._project(), t._update(), this._requestRedraw(t);
        },
        _updateStyle: function(t) {
          this._updateDashArray(t), this._requestRedraw(t);
        },
        _updateDashArray: function(t) {
          if (typeof t.options.dashArray == "string") {
            var n = t.options.dashArray.split(/[, ]+/), r = [], c, d;
            for (d = 0; d < n.length; d++) {
              if (c = Number(n[d]), isNaN(c))
                return;
              r.push(c);
            }
            t.options._dashArray = r;
          } else
            t.options._dashArray = t.options.dashArray;
        },
        _requestRedraw: function(t) {
          this._map && (this._extendRedrawBounds(t), this._redrawRequest = this._redrawRequest || $(this._redraw, this));
        },
        _extendRedrawBounds: function(t) {
          if (t._pxBounds) {
            var n = (t.options.weight || 0) + 1;
            this._redrawBounds = this._redrawBounds || new nt(), this._redrawBounds.extend(t._pxBounds.min.subtract([n, n])), this._redrawBounds.extend(t._pxBounds.max.add([n, n]));
          }
        },
        _redraw: function() {
          this._redrawRequest = null, this._redrawBounds && (this._redrawBounds.min._floor(), this._redrawBounds.max._ceil()), this._clear(), this._draw(), this._redrawBounds = null;
        },
        _clear: function() {
          var t = this._redrawBounds;
          if (t) {
            var n = t.getSize();
            this._ctx.clearRect(t.min.x, t.min.y, n.x, n.y);
          } else
            this._ctx.save(), this._ctx.setTransform(1, 0, 0, 1, 0, 0), this._ctx.clearRect(0, 0, this._container.width, this._container.height), this._ctx.restore();
        },
        _draw: function() {
          var t, n = this._redrawBounds;
          if (this._ctx.save(), n) {
            var r = n.getSize();
            this._ctx.beginPath(), this._ctx.rect(n.min.x, n.min.y, r.x, r.y), this._ctx.clip();
          }
          this._drawing = !0;
          for (var c = this._drawFirst; c; c = c.next)
            t = c.layer, (!n || t._pxBounds && t._pxBounds.intersects(n)) && t._updatePath();
          this._drawing = !1, this._ctx.restore();
        },
        _updatePoly: function(t, n) {
          if (this._drawing) {
            var r, c, d, g, y = t._parts, P = y.length, b = this._ctx;
            if (P) {
              for (b.beginPath(), r = 0; r < P; r++) {
                for (c = 0, d = y[r].length; c < d; c++)
                  g = y[r][c], b[c ? "lineTo" : "moveTo"](g.x, g.y);
                n && b.closePath();
              }
              this._fillStroke(b, t);
            }
          }
        },
        _updateCircle: function(t) {
          if (!(!this._drawing || t._empty())) {
            var n = t._point, r = this._ctx, c = Math.max(Math.round(t._radius), 1), d = (Math.max(Math.round(t._radiusY), 1) || c) / c;
            d !== 1 && (r.save(), r.scale(1, d)), r.beginPath(), r.arc(n.x, n.y / d, c, 0, Math.PI * 2, !1), d !== 1 && r.restore(), this._fillStroke(r, t);
          }
        },
        _fillStroke: function(t, n) {
          var r = n.options;
          r.fill && (t.globalAlpha = r.fillOpacity, t.fillStyle = r.fillColor || r.color, t.fill(r.fillRule || "evenodd")), r.stroke && r.weight !== 0 && (t.setLineDash && t.setLineDash(n.options && n.options._dashArray || []), t.globalAlpha = r.opacity, t.lineWidth = r.weight, t.strokeStyle = r.color, t.lineCap = r.lineCap, t.lineJoin = r.lineJoin, t.stroke());
        },
        // Canvas obviously doesn't have mouse events for individual drawn objects,
        // so we emulate that by calculating what's under the mouse on mousemove/click manually
        _onClick: function(t) {
          for (var n = this._map.mouseEventToLayerPoint(t), r, c, d = this._drawFirst; d; d = d.next)
            r = d.layer, r.options.interactive && r._containsPoint(n) && (!(t.type === "click" || t.type === "preclick") || !this._map._draggableMoved(r)) && (c = r);
          this._fireEvent(c ? [c] : !1, t);
        },
        _onMouseMove: function(t) {
          if (!(!this._map || this._map.dragging.moving() || this._map._animatingZoom)) {
            var n = this._map.mouseEventToLayerPoint(t);
            this._handleMouseHover(t, n);
          }
        },
        _handleMouseOut: function(t) {
          var n = this._hoveredLayer;
          n && (ht(this._container, "leaflet-interactive"), this._fireEvent([n], t, "mouseout"), this._hoveredLayer = null, this._mouseHoverThrottled = !1);
        },
        _handleMouseHover: function(t, n) {
          if (!this._mouseHoverThrottled) {
            for (var r, c, d = this._drawFirst; d; d = d.next)
              r = d.layer, r.options.interactive && r._containsPoint(n) && (c = r);
            c !== this._hoveredLayer && (this._handleMouseOut(t), c && (j(this._container, "leaflet-interactive"), this._fireEvent([c], t, "mouseover"), this._hoveredLayer = c)), this._fireEvent(this._hoveredLayer ? [this._hoveredLayer] : !1, t), this._mouseHoverThrottled = !0, setTimeout(l(function() {
              this._mouseHoverThrottled = !1;
            }, this), 32);
          }
        },
        _fireEvent: function(t, n, r) {
          this._map._fireDOMEvent(n, r || n.type, t);
        },
        _bringToFront: function(t) {
          var n = t._order;
          if (n) {
            var r = n.next, c = n.prev;
            if (r)
              r.prev = c;
            else
              return;
            c ? c.next = r : r && (this._drawFirst = r), n.prev = this._drawLast, this._drawLast.next = n, n.next = null, this._drawLast = n, this._requestRedraw(t);
          }
        },
        _bringToBack: function(t) {
          var n = t._order;
          if (n) {
            var r = n.next, c = n.prev;
            if (c)
              c.next = r;
            else
              return;
            r ? r.prev = c : c && (this._drawLast = c), n.prev = null, n.next = this._drawFirst, this._drawFirst.prev = n, this._drawFirst = n, this._requestRedraw(t);
          }
        }
      });
      function ga(t) {
        return R.canvas ? new ma(t) : null;
      }
      var Ki = (function() {
        try {
          return document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"), function(t) {
            return document.createElement("<lvml:" + t + ' class="lvml">');
          };
        } catch {
        }
        return function(t) {
          return document.createElement("<" + t + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
        };
      })(), $o = {
        _initContainer: function() {
          this._container = K("div", "leaflet-vml-container");
        },
        _update: function() {
          this._map._animatingZoom || (Kt.prototype._update.call(this), this.fire("update"));
        },
        _initPath: function(t) {
          var n = t._container = Ki("shape");
          j(n, "leaflet-vml-shape " + (this.options.className || "")), n.coordsize = "1 1", t._path = Ki("path"), n.appendChild(t._path), this._updateStyle(t), this._layers[f(t)] = t;
        },
        _addPath: function(t) {
          var n = t._container;
          this._container.appendChild(n), t.options.interactive && t.addInteractiveTarget(n);
        },
        _removePath: function(t) {
          var n = t._container;
          at(n), t.removeInteractiveTarget(n), delete this._layers[f(t)];
        },
        _updateStyle: function(t) {
          var n = t._stroke, r = t._fill, c = t.options, d = t._container;
          d.stroked = !!c.stroke, d.filled = !!c.fill, c.stroke ? (n || (n = t._stroke = Ki("stroke")), d.appendChild(n), n.weight = c.weight + "px", n.color = c.color, n.opacity = c.opacity, c.dashArray ? n.dashStyle = G(c.dashArray) ? c.dashArray.join(" ") : c.dashArray.replace(/( *, *)/g, " ") : n.dashStyle = "", n.endcap = c.lineCap.replace("butt", "flat"), n.joinstyle = c.lineJoin) : n && (d.removeChild(n), t._stroke = null), c.fill ? (r || (r = t._fill = Ki("fill")), d.appendChild(r), r.color = c.fillColor || c.color, r.opacity = c.fillOpacity) : r && (d.removeChild(r), t._fill = null);
        },
        _updateCircle: function(t) {
          var n = t._point.round(), r = Math.round(t._radius), c = Math.round(t._radiusY || r);
          this._setPath(t, t._empty() ? "M0 0" : "AL " + n.x + "," + n.y + " " + r + "," + c + " 0," + 65535 * 360);
        },
        _setPath: function(t, n) {
          t._path.v = n;
        },
        _bringToFront: function(t) {
          pi(t._container);
        },
        _bringToBack: function(t) {
          vi(t._container);
        }
      }, Fe = R.vml ? Ki : Mn, $i = Kt.extend({
        _initContainer: function() {
          this._container = Fe("svg"), this._container.setAttribute("pointer-events", "none"), this._rootGroup = Fe("g"), this._container.appendChild(this._rootGroup);
        },
        _destroyContainer: function() {
          at(this._container), st(this._container), delete this._container, delete this._rootGroup, delete this._svgSize;
        },
        _update: function() {
          if (!(this._map._animatingZoom && this._bounds)) {
            Kt.prototype._update.call(this);
            var t = this._bounds, n = t.getSize(), r = this._container;
            (!this._svgSize || !this._svgSize.equals(n)) && (this._svgSize = n, r.setAttribute("width", n.x), r.setAttribute("height", n.y)), ct(r, t.min), r.setAttribute("viewBox", [t.min.x, t.min.y, n.x, n.y].join(" ")), this.fire("update");
          }
        },
        // methods below are called by vector layers implementations
        _initPath: function(t) {
          var n = t._path = Fe("path");
          t.options.className && j(n, t.options.className), t.options.interactive && j(n, "leaflet-interactive"), this._updateStyle(t), this._layers[f(t)] = t;
        },
        _addPath: function(t) {
          this._rootGroup || this._initContainer(), this._rootGroup.appendChild(t._path), t.addInteractiveTarget(t._path);
        },
        _removePath: function(t) {
          at(t._path), t.removeInteractiveTarget(t._path), delete this._layers[f(t)];
        },
        _updatePath: function(t) {
          t._project(), t._update();
        },
        _updateStyle: function(t) {
          var n = t._path, r = t.options;
          n && (r.stroke ? (n.setAttribute("stroke", r.color), n.setAttribute("stroke-opacity", r.opacity), n.setAttribute("stroke-width", r.weight), n.setAttribute("stroke-linecap", r.lineCap), n.setAttribute("stroke-linejoin", r.lineJoin), r.dashArray ? n.setAttribute("stroke-dasharray", r.dashArray) : n.removeAttribute("stroke-dasharray"), r.dashOffset ? n.setAttribute("stroke-dashoffset", r.dashOffset) : n.removeAttribute("stroke-dashoffset")) : n.setAttribute("stroke", "none"), r.fill ? (n.setAttribute("fill", r.fillColor || r.color), n.setAttribute("fill-opacity", r.fillOpacity), n.setAttribute("fill-rule", r.fillRule || "evenodd")) : n.setAttribute("fill", "none"));
        },
        _updatePoly: function(t, n) {
          this._setPath(t, wn(t._parts, n));
        },
        _updateCircle: function(t) {
          var n = t._point, r = Math.max(Math.round(t._radius), 1), c = Math.max(Math.round(t._radiusY), 1) || r, d = "a" + r + "," + c + " 0 1,0 ", g = t._empty() ? "M0 0" : "M" + (n.x - r) + "," + n.y + d + r * 2 + ",0 " + d + -r * 2 + ",0 ";
          this._setPath(t, g);
        },
        _setPath: function(t, n) {
          t._path.setAttribute("d", n);
        },
        // SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
        _bringToFront: function(t) {
          pi(t._path);
        },
        _bringToBack: function(t) {
          vi(t._path);
        }
      });
      R.vml && $i.include($o);
      function pa(t) {
        return R.svg || R.vml ? new $i(t) : null;
      }
      V.include({
        // @namespace Map; @method getRenderer(layer: Path): Renderer
        // Returns the instance of `Renderer` that should be used to render the given
        // `Path`. It will ensure that the `renderer` options of the map and paths
        // are respected, and that the renderers do exist on the map.
        getRenderer: function(t) {
          var n = t.options.renderer || this._getPaneRenderer(t.options.pane) || this.options.renderer || this._renderer;
          return n || (n = this._renderer = this._createRenderer()), this.hasLayer(n) || this.addLayer(n), n;
        },
        _getPaneRenderer: function(t) {
          if (t === "overlayPane" || t === void 0)
            return !1;
          var n = this._paneRenderers[t];
          return n === void 0 && (n = this._createRenderer({ pane: t }), this._paneRenderers[t] = n), n;
        },
        _createRenderer: function(t) {
          return this.options.preferCanvas && ga(t) || pa(t);
        }
      });
      var va = wi.extend({
        initialize: function(t, n) {
          wi.prototype.initialize.call(this, this._boundsToLatLngs(t), n);
        },
        // @method setBounds(latLngBounds: LatLngBounds): this
        // Redraws the rectangle with the passed bounds.
        setBounds: function(t) {
          return this.setLatLngs(this._boundsToLatLngs(t));
        },
        _boundsToLatLngs: function(t) {
          return t = ut(t), [
            t.getSouthWest(),
            t.getNorthWest(),
            t.getNorthEast(),
            t.getSouthEast()
          ];
        }
      });
      function Jo(t, n) {
        return new va(t, n);
      }
      $i.create = Fe, $i.pointsToPath = wn, Vt.geometryToLayer = Oe, Vt.coordsToLatLng = ks, Vt.coordsToLatLngs = ze, Vt.latLngToCoords = Ds, Vt.latLngsToCoords = Re, Vt.getFeature = xi, Vt.asFeature = Be, V.mergeOptions({
        // @option boxZoom: Boolean = true
        // Whether the map can be zoomed to a rectangular area specified by
        // dragging the mouse while pressing the shift key.
        boxZoom: !0
      });
      var ya = qt.extend({
        initialize: function(t) {
          this._map = t, this._container = t._container, this._pane = t._panes.overlayPane, this._resetStateTimeout = 0, t.on("unload", this._destroy, this);
        },
        addHooks: function() {
          q(this._container, "mousedown", this._onMouseDown, this);
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
        _onMouseDown: function(t) {
          if (!t.shiftKey || t.which !== 1 && t.button !== 1)
            return !1;
          this._clearDeferredResetState(), this._resetState(), Ui(), ws(), this._startPoint = this._map.mouseEventToContainerPoint(t), q(document, {
            contextmenu: ci,
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
            keydown: this._onKeyDown
          }, this);
        },
        _onMouseMove: function(t) {
          this._moved || (this._moved = !0, this._box = K("div", "leaflet-zoom-box", this._container), j(this._container, "leaflet-crosshair"), this._map.fire("boxzoomstart")), this._point = this._map.mouseEventToContainerPoint(t);
          var n = new nt(this._point, this._startPoint), r = n.getSize();
          ct(this._box, n.min), this._box.style.width = r.x + "px", this._box.style.height = r.y + "px";
        },
        _finish: function() {
          this._moved && (at(this._box), ht(this._container, "leaflet-crosshair")), qi(), xs(), st(document, {
            contextmenu: ci,
            mousemove: this._onMouseMove,
            mouseup: this._onMouseUp,
            keydown: this._onKeyDown
          }, this);
        },
        _onMouseUp: function(t) {
          if (!(t.which !== 1 && t.button !== 1) && (this._finish(), !!this._moved)) {
            this._clearDeferredResetState(), this._resetStateTimeout = setTimeout(l(this._resetState, this), 0);
            var n = new xt(
              this._map.containerPointToLatLng(this._startPoint),
              this._map.containerPointToLatLng(this._point)
            );
            this._map.fitBounds(n).fire("boxzoomend", { boxZoomBounds: n });
          }
        },
        _onKeyDown: function(t) {
          t.keyCode === 27 && (this._finish(), this._clearDeferredResetState(), this._resetState());
        }
      });
      V.addInitHook("addHandler", "boxZoom", ya), V.mergeOptions({
        // @option doubleClickZoom: Boolean|String = true
        // Whether the map can be zoomed in by double clicking on it and
        // zoomed out by double clicking while holding shift. If passed
        // `'center'`, double-click zoom will zoom to the center of the
        //  view regardless of where the mouse was.
        doubleClickZoom: !0
      });
      var Ma = qt.extend({
        addHooks: function() {
          this._map.on("dblclick", this._onDoubleClick, this);
        },
        removeHooks: function() {
          this._map.off("dblclick", this._onDoubleClick, this);
        },
        _onDoubleClick: function(t) {
          var n = this._map, r = n.getZoom(), c = n.options.zoomDelta, d = t.originalEvent.shiftKey ? r - c : r + c;
          n.options.doubleClickZoom === "center" ? n.setZoom(d) : n.setZoomAround(t.containerPoint, d);
        }
      });
      V.addInitHook("addHandler", "doubleClickZoom", Ma), V.mergeOptions({
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
      var wa = qt.extend({
        addHooks: function() {
          if (!this._draggable) {
            var t = this._map;
            this._draggable = new ti(t._mapPane, t._container), this._draggable.on({
              dragstart: this._onDragStart,
              drag: this._onDrag,
              dragend: this._onDragEnd
            }, this), this._draggable.on("predrag", this._onPreDragLimit, this), t.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDragWrap, this), t.on("zoomend", this._onZoomEnd, this), t.whenReady(this._onZoomEnd, this));
          }
          j(this._map._container, "leaflet-grab leaflet-touch-drag"), this._draggable.enable(), this._positions = [], this._times = [];
        },
        removeHooks: function() {
          ht(this._map._container, "leaflet-grab"), ht(this._map._container, "leaflet-touch-drag"), this._draggable.disable();
        },
        moved: function() {
          return this._draggable && this._draggable._moved;
        },
        moving: function() {
          return this._draggable && this._draggable._moving;
        },
        _onDragStart: function() {
          var t = this._map;
          if (t._stop(), this._map.options.maxBounds && this._map.options.maxBoundsViscosity) {
            var n = ut(this._map.options.maxBounds);
            this._offsetLimit = wt(
              this._map.latLngToContainerPoint(n.getNorthWest()).multiplyBy(-1),
              this._map.latLngToContainerPoint(n.getSouthEast()).multiplyBy(-1).add(this._map.getSize())
            ), this._viscosity = Math.min(1, Math.max(0, this._map.options.maxBoundsViscosity));
          } else
            this._offsetLimit = null;
          t.fire("movestart").fire("dragstart"), t.options.inertia && (this._positions = [], this._times = []);
        },
        _onDrag: function(t) {
          if (this._map.options.inertia) {
            var n = this._lastTime = +/* @__PURE__ */ new Date(), r = this._lastPos = this._draggable._absPos || this._draggable._newPos;
            this._positions.push(r), this._times.push(n), this._prunePositions(n);
          }
          this._map.fire("move", t).fire("drag", t);
        },
        _prunePositions: function(t) {
          for (; this._positions.length > 1 && t - this._times[0] > 50; )
            this._positions.shift(), this._times.shift();
        },
        _onZoomEnd: function() {
          var t = this._map.getSize().divideBy(2), n = this._map.latLngToLayerPoint([0, 0]);
          this._initialWorldOffset = n.subtract(t).x, this._worldWidth = this._map.getPixelWorldBounds().getSize().x;
        },
        _viscousLimit: function(t, n) {
          return t - (t - n) * this._viscosity;
        },
        _onPreDragLimit: function() {
          if (!(!this._viscosity || !this._offsetLimit)) {
            var t = this._draggable._newPos.subtract(this._draggable._startPos), n = this._offsetLimit;
            t.x < n.min.x && (t.x = this._viscousLimit(t.x, n.min.x)), t.y < n.min.y && (t.y = this._viscousLimit(t.y, n.min.y)), t.x > n.max.x && (t.x = this._viscousLimit(t.x, n.max.x)), t.y > n.max.y && (t.y = this._viscousLimit(t.y, n.max.y)), this._draggable._newPos = this._draggable._startPos.add(t);
          }
        },
        _onPreDragWrap: function() {
          var t = this._worldWidth, n = Math.round(t / 2), r = this._initialWorldOffset, c = this._draggable._newPos.x, d = (c - n + r) % t + n - r, g = (c + n + r) % t - n - r, y = Math.abs(d + r) < Math.abs(g + r) ? d : g;
          this._draggable._absPos = this._draggable._newPos.clone(), this._draggable._newPos.x = y;
        },
        _onDragEnd: function(t) {
          var n = this._map, r = n.options, c = !r.inertia || t.noInertia || this._times.length < 2;
          if (n.fire("dragend", t), c)
            n.fire("moveend");
          else {
            this._prunePositions(+/* @__PURE__ */ new Date());
            var d = this._lastPos.subtract(this._positions[0]), g = (this._lastTime - this._times[0]) / 1e3, y = r.easeLinearity, P = d.multiplyBy(y / g), b = P.distanceTo([0, 0]), T = Math.min(r.inertiaMaxSpeed, b), O = P.multiplyBy(T / b), k = T / (r.inertiaDeceleration * y), H = O.multiplyBy(-k / 2).round();
            !H.x && !H.y ? n.fire("moveend") : (H = n._limitOffset(H, n.options.maxBounds), $(function() {
              n.panBy(H, {
                duration: k,
                easeLinearity: y,
                noMoveStart: !0,
                animate: !0
              });
            }));
          }
        }
      });
      V.addInitHook("addHandler", "dragging", wa), V.mergeOptions({
        // @option keyboard: Boolean = true
        // Makes the map focusable and allows users to navigate the map with keyboard
        // arrows and `+`/`-` keys.
        keyboard: !0,
        // @option keyboardPanDelta: Number = 80
        // Amount of pixels to pan when pressing an arrow key.
        keyboardPanDelta: 80
      });
      var xa = qt.extend({
        keyCodes: {
          left: [37],
          right: [39],
          down: [40],
          up: [38],
          zoomIn: [187, 107, 61, 171],
          zoomOut: [189, 109, 54, 173]
        },
        initialize: function(t) {
          this._map = t, this._setPanDelta(t.options.keyboardPanDelta), this._setZoomDelta(t.options.zoomDelta);
        },
        addHooks: function() {
          var t = this._map._container;
          t.tabIndex <= 0 && (t.tabIndex = "0"), q(t, {
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
            var t = document.body, n = document.documentElement, r = t.scrollTop || n.scrollTop, c = t.scrollLeft || n.scrollLeft;
            this._map._container.focus(), window.scrollTo(c, r);
          }
        },
        _onFocus: function() {
          this._focused = !0, this._map.fire("focus");
        },
        _onBlur: function() {
          this._focused = !1, this._map.fire("blur");
        },
        _setPanDelta: function(t) {
          var n = this._panKeys = {}, r = this.keyCodes, c, d;
          for (c = 0, d = r.left.length; c < d; c++)
            n[r.left[c]] = [-1 * t, 0];
          for (c = 0, d = r.right.length; c < d; c++)
            n[r.right[c]] = [t, 0];
          for (c = 0, d = r.down.length; c < d; c++)
            n[r.down[c]] = [0, t];
          for (c = 0, d = r.up.length; c < d; c++)
            n[r.up[c]] = [0, -1 * t];
        },
        _setZoomDelta: function(t) {
          var n = this._zoomKeys = {}, r = this.keyCodes, c, d;
          for (c = 0, d = r.zoomIn.length; c < d; c++)
            n[r.zoomIn[c]] = t;
          for (c = 0, d = r.zoomOut.length; c < d; c++)
            n[r.zoomOut[c]] = -t;
        },
        _addHooks: function() {
          q(document, "keydown", this._onKeyDown, this);
        },
        _removeHooks: function() {
          st(document, "keydown", this._onKeyDown, this);
        },
        _onKeyDown: function(t) {
          if (!(t.altKey || t.ctrlKey || t.metaKey)) {
            var n = t.keyCode, r = this._map, c;
            if (n in this._panKeys) {
              if (!r._panAnim || !r._panAnim._inProgress)
                if (c = this._panKeys[n], t.shiftKey && (c = F(c).multiplyBy(3)), r.options.maxBounds && (c = r._limitOffset(F(c), r.options.maxBounds)), r.options.worldCopyJump) {
                  var d = r.wrapLatLng(r.unproject(r.project(r.getCenter()).add(c)));
                  r.panTo(d);
                } else
                  r.panBy(c);
            } else if (n in this._zoomKeys)
              r.setZoom(r.getZoom() + (t.shiftKey ? 3 : 1) * this._zoomKeys[n]);
            else if (n === 27 && r._popup && r._popup.options.closeOnEscapeKey)
              r.closePopup();
            else
              return;
            ci(t);
          }
        }
      });
      V.addInitHook("addHandler", "keyboard", xa), V.mergeOptions({
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
      var Pa = qt.extend({
        addHooks: function() {
          q(this._map._container, "wheel", this._onWheelScroll, this), this._delta = 0;
        },
        removeHooks: function() {
          st(this._map._container, "wheel", this._onWheelScroll, this);
        },
        _onWheelScroll: function(t) {
          var n = Xn(t), r = this._map.options.wheelDebounceTime;
          this._delta += n, this._lastMousePos = this._map.mouseEventToContainerPoint(t), this._startTime || (this._startTime = +/* @__PURE__ */ new Date());
          var c = Math.max(r - (+/* @__PURE__ */ new Date() - this._startTime), 0);
          clearTimeout(this._timer), this._timer = setTimeout(l(this._performZoom, this), c), ci(t);
        },
        _performZoom: function() {
          var t = this._map, n = t.getZoom(), r = this._map.options.zoomSnap || 0;
          t._stop();
          var c = this._delta / (this._map.options.wheelPxPerZoomLevel * 4), d = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(c)))) / Math.LN2, g = r ? Math.ceil(d / r) * r : d, y = t._limitZoom(n + (this._delta > 0 ? g : -g)) - n;
          this._delta = 0, this._startTime = null, y && (t.options.scrollWheelZoom === "center" ? t.setZoom(n + y) : t.setZoomAround(this._lastMousePos, n + y));
        }
      });
      V.addInitHook("addHandler", "scrollWheelZoom", Pa);
      var Qo = 600;
      V.mergeOptions({
        // @section Touch interaction options
        // @option tapHold: Boolean
        // Enables simulation of `contextmenu` event, default is `true` for mobile Safari.
        tapHold: R.touchNative && R.safari && R.mobile,
        // @option tapTolerance: Number = 15
        // The max number of pixels a user can shift his finger during touch
        // for it to be considered a valid tap.
        tapTolerance: 15
      });
      var ba = qt.extend({
        addHooks: function() {
          q(this._map._container, "touchstart", this._onDown, this);
        },
        removeHooks: function() {
          st(this._map._container, "touchstart", this._onDown, this);
        },
        _onDown: function(t) {
          if (clearTimeout(this._holdTimeout), t.touches.length === 1) {
            var n = t.touches[0];
            this._startPos = this._newPos = new U(n.clientX, n.clientY), this._holdTimeout = setTimeout(l(function() {
              this._cancel(), this._isTapValid() && (q(document, "touchend", mt), q(document, "touchend touchcancel", this._cancelClickPrevent), this._simulateEvent("contextmenu", n));
            }, this), Qo), q(document, "touchend touchcancel contextmenu", this._cancel, this), q(document, "touchmove", this._onMove, this);
          }
        },
        _cancelClickPrevent: function t() {
          st(document, "touchend", mt), st(document, "touchend touchcancel", t);
        },
        _cancel: function() {
          clearTimeout(this._holdTimeout), st(document, "touchend touchcancel contextmenu", this._cancel, this), st(document, "touchmove", this._onMove, this);
        },
        _onMove: function(t) {
          var n = t.touches[0];
          this._newPos = new U(n.clientX, n.clientY);
        },
        _isTapValid: function() {
          return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
        },
        _simulateEvent: function(t, n) {
          var r = new MouseEvent(t, {
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
          r._simulated = !0, n.target.dispatchEvent(r);
        }
      });
      V.addInitHook("addHandler", "tapHold", ba), V.mergeOptions({
        // @section Touch interaction options
        // @option touchZoom: Boolean|String = *
        // Whether the map can be zoomed by touch-dragging with two fingers. If
        // passed `'center'`, it will zoom to the center of the view regardless of
        // where the touch events (fingers) were. Enabled for touch-capable web
        // browsers.
        touchZoom: R.touch,
        // @option bounceAtZoomLimits: Boolean = true
        // Set it to false if you don't want the map to zoom beyond min/max zoom
        // and then bounce back when pinch-zooming.
        bounceAtZoomLimits: !0
      });
      var Sa = qt.extend({
        addHooks: function() {
          j(this._map._container, "leaflet-touch-zoom"), q(this._map._container, "touchstart", this._onTouchStart, this);
        },
        removeHooks: function() {
          ht(this._map._container, "leaflet-touch-zoom"), st(this._map._container, "touchstart", this._onTouchStart, this);
        },
        _onTouchStart: function(t) {
          var n = this._map;
          if (!(!t.touches || t.touches.length !== 2 || n._animatingZoom || this._zooming)) {
            var r = n.mouseEventToContainerPoint(t.touches[0]), c = n.mouseEventToContainerPoint(t.touches[1]);
            this._centerPoint = n.getSize()._divideBy(2), this._startLatLng = n.containerPointToLatLng(this._centerPoint), n.options.touchZoom !== "center" && (this._pinchStartLatLng = n.containerPointToLatLng(r.add(c)._divideBy(2))), this._startDist = r.distanceTo(c), this._startZoom = n.getZoom(), this._moved = !1, this._zooming = !0, n._stop(), q(document, "touchmove", this._onTouchMove, this), q(document, "touchend touchcancel", this._onTouchEnd, this), mt(t);
          }
        },
        _onTouchMove: function(t) {
          if (!(!t.touches || t.touches.length !== 2 || !this._zooming)) {
            var n = this._map, r = n.mouseEventToContainerPoint(t.touches[0]), c = n.mouseEventToContainerPoint(t.touches[1]), d = r.distanceTo(c) / this._startDist;
            if (this._zoom = n.getScaleZoom(d, this._startZoom), !n.options.bounceAtZoomLimits && (this._zoom < n.getMinZoom() && d < 1 || this._zoom > n.getMaxZoom() && d > 1) && (this._zoom = n._limitZoom(this._zoom)), n.options.touchZoom === "center") {
              if (this._center = this._startLatLng, d === 1)
                return;
            } else {
              var g = r._add(c)._divideBy(2)._subtract(this._centerPoint);
              if (d === 1 && g.x === 0 && g.y === 0)
                return;
              this._center = n.unproject(n.project(this._pinchStartLatLng, this._zoom).subtract(g), this._zoom);
            }
            this._moved || (n._moveStart(!0, !1), this._moved = !0), dt(this._animRequest);
            var y = l(n._move, n, this._center, this._zoom, { pinch: !0, round: !1 }, void 0);
            this._animRequest = $(y, this, !0), mt(t);
          }
        },
        _onTouchEnd: function() {
          if (!this._moved || !this._zooming) {
            this._zooming = !1;
            return;
          }
          this._zooming = !1, dt(this._animRequest), st(document, "touchmove", this._onTouchMove, this), st(document, "touchend touchcancel", this._onTouchEnd, this), this._map.options.zoomAnimation ? this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), !0, this._map.options.zoomSnap) : this._map._resetView(this._center, this._map._limitZoom(this._zoom));
        }
      });
      V.addInitHook("addHandler", "touchZoom", Sa), V.BoxZoom = ya, V.DoubleClickZoom = Ma, V.Drag = wa, V.Keyboard = xa, V.ScrollWheelZoom = Pa, V.TapHold = ba, V.TouchZoom = Sa, s.Bounds = nt, s.Browser = R, s.CRS = Wt, s.Canvas = ma, s.Circle = Bs, s.CircleMarker = Ne, s.Class = Zt, s.Control = Ot, s.DivIcon = fa, s.DivOverlay = jt, s.DomEvent = po, s.DomUtil = mo, s.Draggable = ti, s.Evented = Bi, s.FeatureGroup = Xt, s.GeoJSON = Vt, s.GridLayer = Vi, s.Handler = qt, s.Icon = Mi, s.ImageOverlay = ke, s.LatLng = tt, s.LatLngBounds = xt, s.Layer = zt, s.LayerGroup = yi, s.LineUtil = Co, s.Map = V, s.Marker = Ge, s.Mixin = bo, s.Path = ii, s.Point = U, s.PolyUtil = So, s.Polygon = wi, s.Polyline = Yt, s.Popup = De, s.PosAnimation = Yn, s.Projection = Io, s.Rectangle = va, s.Renderer = Kt, s.SVG = $i, s.SVGOverlay = ca, s.TileLayer = Pi, s.Tooltip = Ze, s.Transformation = ls, s.Util = Jt, s.VideoOverlay = ua, s.bind = l, s.bounds = wt, s.canvas = ga, s.circle = Do, s.circleMarker = ko, s.control = Wi, s.divIcon = Yo, s.extend = o, s.featureGroup = zo, s.geoJSON = la, s.geoJson = Uo, s.gridLayer = Vo, s.icon = Ro, s.imageOverlay = qo, s.latLng = Y, s.latLngBounds = ut, s.layerGroup = Oo, s.map = vo, s.marker = Bo, s.point = F, s.polygon = Fo, s.polyline = Zo, s.popup = Wo, s.rectangle = Jo, s.setOptions = x, s.stamp = f, s.svg = pa, s.svgOverlay = Ho, s.tileLayer = da, s.tooltip = Xo, s.transformation = ki, s.version = a, s.videoOverlay = jo;
      var th = window.L;
      s.noConflict = function() {
        return window.L = th, this;
      }, window.L = s;
    }));
  })(se, se.exports)), se.exports;
}
var it = hr();
const Ia = 6378245, vt = 3.141592653589793, Ga = 0.006693421622965943, Na = vt * 3e3 / 180;
function Oa(e, i) {
  var s = Ks(e, i), a = vh(s.lng, s.lat);
  return a;
}
function Ks(e, i) {
  var s = yh(e - 105, i - 35), a = Mh(e - 105, i - 35), o = i / 180 * vt, h = Math.sin(o);
  h = 1 - Ga * h * h;
  var l = Math.sqrt(h);
  s = s * 180 / (Ia * (1 - Ga) / (h * l) * vt), a = a * 180 / (Ia / l * Math.cos(o) * vt);
  var u = i + s, f = e + a, _ = {
    lng: f,
    lat: u
  };
  return _;
}
function vh(e, i) {
  var s = Math.sqrt(e * e + i * i) + 2e-5 * Math.sin(i * Na), a = Math.atan2(i, e) + 3e-6 * Math.cos(e * Na), o = s * Math.cos(a) + 65e-4, h = s * Math.sin(a) + 6e-3, l = {
    lng: o,
    lat: h
  };
  return l;
}
function yh(e, i) {
  var s = -100 + 2 * e + 3 * i + 0.2 * i * i + 0.1 * e * i + 0.2 * Math.sqrt(Math.abs(e));
  return s += (20 * Math.sin(6 * e * vt) + 20 * Math.sin(2 * e * vt)) * 2 / 3, s += (20 * Math.sin(i * vt) + 40 * Math.sin(i / 3 * vt)) * 2 / 3, s += (160 * Math.sin(i / 12 * vt) + 320 * Math.sin(i * vt / 30)) * 2 / 3, s;
}
function Mh(e, i) {
  var s = 300 + e + 2 * i + 0.1 * e * e + 0.1 * e * i + 0.1 * Math.sqrt(Math.abs(e));
  return s += (20 * Math.sin(6 * e * vt) + 20 * Math.sin(2 * e * vt)) * 2 / 3, s += (20 * Math.sin(e * vt) + 40 * Math.sin(e / 3 * vt)) * 2 / 3, s += (150 * Math.sin(e / 12 * vt) + 300 * Math.sin(e / 30 * vt)) * 2 / 3, s;
}
function wh(e, i, s = 0) {
  let [a, o] = e, [h, l] = i, u = 0;
  return s && AMap && AMap.GeometryUtil ? u = AMap.GeometryUtil.distance([o, a], [l, h]) : u = it.latLng(e).distanceTo(i), u;
}
function xh(e, i = 100, s) {
  if (s.length === 0)
    return 0;
  let a = e instanceof it.Map ? 0 : 1, o = 1e-5, h = s.map((_) => _[0]).reduce((_, v) => _ + v) / s.length, l = [h, 100], u = [h, 100 + o], f = wh(l, u, a);
  return i / f * o;
}
function Oi(e, i) {
  if (!i) return [-1e3, -1e3];
  let [s = 90, a = 180] = i, o;
  return isNaN(s) || isNaN(a) ? [-1e3, -1e3] : (e.latLngToContainerPoint ? o = e.latLngToContainerPoint([s, a]) : o = e.lngLatToContainer([a, s]), [o.x, o.y]);
}
function Ph(e, i) {
  return i?.map((s) => Oi(e, s)) || [];
}
function za(e, i) {
  let { sizeFix: s, latlng: a, size: o = [0, 0] } = i;
  if (!s || !a)
    return Array.isArray(o) || (o = [o, o]), o;
  let h = Array.isArray(s) ? s : [s, s], [l, u] = a, f = xh(e, h[1], [a]), [_, v] = Oi(e, [l, u]), [m, p] = Oi(e, [l, u + f]), M = Math.abs(m - _), w = M * h[1] / h[0];
  return [M, w];
}
function lr(e) {
  let i = e.getSize(), { x: s, y: a, width: o, height: h } = i;
  return {
    w: s || o,
    h: a || h
  };
}
function ei(e, i, s) {
  if (Array.isArray(e) && e.length > 0) {
    let a;
    a = e.findIndex((o) => o == i), a >= 0 && e.splice(a, 1);
  }
  return e || [];
}
class Ud {
  constructor(i, s) {
    this._allArcs = [], this._allLines = [], this._allBLins = [], this._allRects = [], this._allTexts = [], this._allImgs = [], this._allGifs = [], this.map = i, this.canvas = s, this.ctx = s.getContext("2d");
  }
  get zoom() {
    return this.map.getZoom();
  }
  /** 清空并重新设置画布 */
  reSetCanvas() {
    let { canvas: i, map: s, ctx: a } = this;
    const { w: o, h } = lr(s);
    i.style.width = o + "px", i.style.height = h + "px", i.width = o, i.height = h;
  }
  /**绘制所有需要绘制的类(按drawIndex顺序) */
  drawMapAll() {
    this.reSetCanvas(), this.drawByIndex();
  }
  /**绘制通过index */
  async drawByIndex() {
    let i = [], s = this, { ctx: a, zoom: o } = s, h = s._allRects.map((l) => ({ ...l, mold: "R" }));
    h = h.concat(s._allLines.map((l) => ({ ...l, mold: "L" }))), h = h.concat(s._allBLins.map((l) => ({ ...l, mold: "B" }))), h = h.concat(s._allArcs.map((l) => ({ ...l, mold: "A" }))), h = h.concat(s._allTexts.map((l) => ({ ...l, mold: "T" }))), h = h.concat(s._allImgs.map((l) => ({ ...l, mold: "I" }))), h = h.concat(s._allGifs.map((l) => ({ ...l, mold: "G" }))), h.sort((l, u) => (l.index || 0) - (u.index || 0)), h.forEach((l, u) => {
      let { minZoom: f = 0, maxZoom: _ = 50, overlap: v } = l;
      if (o >= f && o <= _)
        switch (s.transformXY(l), l.mold) {
          case "A":
            s.transformArcSize(l), kt.drawArc(l, a);
            break;
          case "L":
            kt.drawLine(l, a);
            break;
          case "B":
            kt.drawBezierLine(l, a);
            break;
          case "R":
            kt.drawPolygon(l, a);
            break;
          case "T":
            mh.drawText(l, i, a);
            break;
          case "I":
            s.transformImageSize(l), Vs.drawImg(l, a);
            break;
          case "G":
            s.transformImageSize(l), s.gif = s.gif || new lh(), s.gif.loadGIF(l, a);
            break;
        }
    });
  }
  /**设置原点 */
  setAllArcs(i) {
    return this._allArcs = i, this;
  }
  /**设置线数据 */
  setAllLines(i) {
    return this._allLines = i, this;
  }
  /**设置贝塞尔曲线数据 */
  setAllBezierLines(i) {
    return this._allBLins = i, this;
  }
  /**设置多边形数据 */
  setAllRects(i) {
    return this._allRects = i, this;
  }
  /**设置文本数据 */
  setAllTexts(i) {
    return this._allTexts = i, this;
  }
  /**设置图片数据 */
  setAllImgs(i) {
    return this._allImgs = i, this;
  }
  /**设置图片数据 */
  setAllGifs(i) {
    return this._allGifs = i, this;
  }
  /**增加原点 */
  addArc(i) {
    return !i.latlngs && !i.latlng ? this : (this._allArcs.push(i), this);
  }
  /**增加线 */
  addLine(i) {
    return i.latlngs ? (this._allLines.push(i), this) : this;
  }
  /**增加贝塞尔曲线 */
  addBezierLine(i) {
    return i.latlngs ? (this._allBLins.push(i), this) : this;
  }
  /**增加多边形 */
  addRect(i) {
    return i.latlngs ? (this._allRects.push(i), this) : this;
  }
  /**增加文本 */
  addText(i) {
    return !i.latlngs && !i.latlng ? this : (this._allTexts.push(i), this);
  }
  /**增加图片 */
  addImg(i) {
    return !i.latlngs && !i.latlng ? this : (this._allImgs.push(i), this);
  }
  /**删除指定圆点 */
  delArc(i) {
    return ei(this._allArcs, i), this;
  }
  /**删除指定线 */
  delLine(i) {
    return ei(this._allLines, i), this;
  }
  /**删除指定贝塞尔曲线 */
  delBezierLine(i) {
    return ei(this._allBLins, i), this;
  }
  /**删除指定多边形 */
  delRect(i) {
    return ei(this._allRects, i), this;
  }
  /**删除指定文本 */
  delText(i) {
    return ei(this._allTexts, i), this;
  }
  /**删除指定Img */
  delImg(i) {
    return ei(this._allImgs, i), this;
  }
  /**清空
   * @param type 不填清空所有内容数据
   */
  delAll(i = "all") {
    const s = this;
    switch (i) {
      case "arc":
        s._allArcs = [];
        break;
      case "line":
        s._allLines = [];
        break;
      case "bezier":
        s._allBLins = [];
        break;
      case "rect":
        s._allRects = [];
        break;
      case "img":
        s._allImgs = [];
        break;
      case "gif":
        s._allGifs = [];
        break;
      case "text":
        s._allTexts = [];
        break;
      case "all":
        s._allArcs = [], s._allLines = [], s._allBLins = [], s._allRects = [], s._allImgs = [], s._allGifs = [], s._allTexts = [];
    }
    return s;
  }
  /**将对象上经纬度数据(latlngs,latlng)变换为像素XY的数据(points,point)
   * latlngs为undefined,points也为undefined
   * latlng为undefined,point为[0,0]
   */
  transformXY(i) {
    i.points = Ph(this.map, i.latlngs), i.point = Oi(this.map, i.latlng);
  }
  /**设置固定大小的图片 */
  transformImageSize(i) {
    let [s, a] = za(this.map, i);
    i.size = [s, a];
  }
  transformArcSize(i) {
    let [s, a] = za(this.map, i);
    i.size = s;
  }
}
function ur(e, i, s = 0, a = e.length - 1, o = bh) {
  for (; a > s; ) {
    if (a - s > 600) {
      const f = a - s + 1, _ = i - s + 1, v = Math.log(f), m = 0.5 * Math.exp(2 * v / 3), p = 0.5 * Math.sqrt(v * m * (f - m) / f) * (_ - f / 2 < 0 ? -1 : 1), M = Math.max(s, Math.floor(i - _ * m / f + p)), w = Math.min(a, Math.floor(i + (f - _) * m / f + p));
      ur(e, i, M, w, o);
    }
    const h = e[i];
    let l = s, u = a;
    for (Qi(e, s, i), o(e[a], h) > 0 && Qi(e, s, a); l < u; ) {
      for (Qi(e, l, u), l++, u--; o(e[l], h) < 0; ) l++;
      for (; o(e[u], h) > 0; ) u--;
    }
    o(e[s], h) === 0 ? Qi(e, s, u) : (u++, Qi(e, u, a)), u <= i && (s = u + 1), i <= u && (a = u - 1);
  }
}
function Qi(e, i, s) {
  const a = e[i];
  e[i] = e[s], e[s] = a;
}
function bh(e, i) {
  return e < i ? -1 : e > i ? 1 : 0;
}
class Sh {
  constructor(i = 9) {
    this._maxEntries = Math.max(4, i), this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4)), this.clear();
  }
  all() {
    return this._all(this.data, []);
  }
  search(i) {
    let s = this.data;
    const a = [];
    if (!je(i, s)) return a;
    const o = this.toBBox, h = [];
    for (; s; ) {
      for (let l = 0; l < s.children.length; l++) {
        const u = s.children[l], f = s.leaf ? o(u) : u;
        je(i, f) && (s.leaf ? a.push(u) : qs(i, f) ? this._all(u, a) : h.push(u));
      }
      s = h.pop();
    }
    return a;
  }
  collides(i) {
    let s = this.data;
    if (!je(i, s)) return !1;
    const a = [];
    for (; s; ) {
      for (let o = 0; o < s.children.length; o++) {
        const h = s.children[o], l = s.leaf ? this.toBBox(h) : h;
        if (je(i, l)) {
          if (s.leaf || qs(i, l)) return !0;
          a.push(h);
        }
      }
      s = a.pop();
    }
    return !1;
  }
  load(i) {
    if (!(i && i.length)) return this;
    if (i.length < this._minEntries) {
      for (let a = 0; a < i.length; a++)
        this.insert(i[a]);
      return this;
    }
    let s = this._build(i.slice(), 0, i.length - 1, 0);
    if (!this.data.children.length)
      this.data = s;
    else if (this.data.height === s.height)
      this._splitRoot(this.data, s);
    else {
      if (this.data.height < s.height) {
        const a = this.data;
        this.data = s, s = a;
      }
      this._insert(s, this.data.height - s.height - 1, !0);
    }
    return this;
  }
  insert(i) {
    return i && this._insert(i, this.data.height - 1), this;
  }
  clear() {
    return this.data = Ei([]), this;
  }
  remove(i, s) {
    if (!i) return this;
    let a = this.data;
    const o = this.toBBox(i), h = [], l = [];
    let u, f, _;
    for (; a || h.length; ) {
      if (a || (a = h.pop(), f = h[h.length - 1], u = l.pop(), _ = !0), a.leaf) {
        const v = Eh(i, a.children, s);
        if (v !== -1)
          return a.children.splice(v, 1), h.push(a), this._condense(h), this;
      }
      !_ && !a.leaf && qs(a, o) ? (h.push(a), l.push(u), u = 0, f = a, a = a.children[0]) : f ? (u++, a = f.children[u], _ = !1) : a = null;
    }
    return this;
  }
  toBBox(i) {
    return i;
  }
  compareMinX(i, s) {
    return i.minX - s.minX;
  }
  compareMinY(i, s) {
    return i.minY - s.minY;
  }
  toJSON() {
    return this.data;
  }
  fromJSON(i) {
    return this.data = i, this;
  }
  _all(i, s) {
    const a = [];
    for (; i; )
      i.leaf ? s.push(...i.children) : a.push(...i.children), i = a.pop();
    return s;
  }
  _build(i, s, a, o) {
    const h = a - s + 1;
    let l = this._maxEntries, u;
    if (h <= l)
      return u = Ei(i.slice(s, a + 1)), Si(u, this.toBBox), u;
    o || (o = Math.ceil(Math.log(h) / Math.log(l)), l = Math.ceil(h / Math.pow(l, o - 1))), u = Ei([]), u.leaf = !1, u.height = o;
    const f = Math.ceil(h / l), _ = f * Math.ceil(Math.sqrt(l));
    Ra(i, s, a, _, this.compareMinX);
    for (let v = s; v <= a; v += _) {
      const m = Math.min(v + _ - 1, a);
      Ra(i, v, m, f, this.compareMinY);
      for (let p = v; p <= m; p += f) {
        const M = Math.min(p + f - 1, m);
        u.children.push(this._build(i, p, M, o - 1));
      }
    }
    return Si(u, this.toBBox), u;
  }
  _chooseSubtree(i, s, a, o) {
    for (; o.push(s), !(s.leaf || o.length - 1 === a); ) {
      let h = 1 / 0, l = 1 / 0, u;
      for (let f = 0; f < s.children.length; f++) {
        const _ = s.children[f], v = Us(_), m = Lh(i, _) - v;
        m < l ? (l = m, h = v < h ? v : h, u = _) : m === l && v < h && (h = v, u = _);
      }
      s = u || s.children[0];
    }
    return s;
  }
  _insert(i, s, a) {
    const o = a ? i : this.toBBox(i), h = [], l = this._chooseSubtree(o, this.data, s, h);
    for (l.children.push(i), ae(l, o); s >= 0 && h[s].children.length > this._maxEntries; )
      this._split(h, s), s--;
    this._adjustParentBBoxes(o, h, s);
  }
  // split overflowed node into two
  _split(i, s) {
    const a = i[s], o = a.children.length, h = this._minEntries;
    this._chooseSplitAxis(a, h, o);
    const l = this._chooseSplitIndex(a, h, o), u = Ei(a.children.splice(l, a.children.length - l));
    u.height = a.height, u.leaf = a.leaf, Si(a, this.toBBox), Si(u, this.toBBox), s ? i[s - 1].children.push(u) : this._splitRoot(a, u);
  }
  _splitRoot(i, s) {
    this.data = Ei([i, s]), this.data.height = i.height + 1, this.data.leaf = !1, Si(this.data, this.toBBox);
  }
  _chooseSplitIndex(i, s, a) {
    let o, h = 1 / 0, l = 1 / 0;
    for (let u = s; u <= a - s; u++) {
      const f = ne(i, 0, u, this.toBBox), _ = ne(i, u, a, this.toBBox), v = Ch(f, _), m = Us(f) + Us(_);
      v < h ? (h = v, o = u, l = m < l ? m : l) : v === h && m < l && (l = m, o = u);
    }
    return o || a - s;
  }
  // sorts node children by the best axis for split
  _chooseSplitAxis(i, s, a) {
    const o = i.leaf ? this.compareMinX : Th, h = i.leaf ? this.compareMinY : Ah, l = this._allDistMargin(i, s, a, o), u = this._allDistMargin(i, s, a, h);
    l < u && i.children.sort(o);
  }
  // total margin of all possible split distributions where each node is at least m full
  _allDistMargin(i, s, a, o) {
    i.children.sort(o);
    const h = this.toBBox, l = ne(i, 0, s, h), u = ne(i, a - s, a, h);
    let f = qe(l) + qe(u);
    for (let _ = s; _ < a - s; _++) {
      const v = i.children[_];
      ae(l, i.leaf ? h(v) : v), f += qe(l);
    }
    for (let _ = a - s - 1; _ >= s; _--) {
      const v = i.children[_];
      ae(u, i.leaf ? h(v) : v), f += qe(u);
    }
    return f;
  }
  _adjustParentBBoxes(i, s, a) {
    for (let o = a; o >= 0; o--)
      ae(s[o], i);
  }
  _condense(i) {
    for (let s = i.length - 1, a; s >= 0; s--)
      i[s].children.length === 0 ? s > 0 ? (a = i[s - 1].children, a.splice(a.indexOf(i[s]), 1)) : this.clear() : Si(i[s], this.toBBox);
  }
}
function Eh(e, i, s) {
  if (!s) return i.indexOf(e);
  for (let a = 0; a < i.length; a++)
    if (s(e, i[a])) return a;
  return -1;
}
function Si(e, i) {
  ne(e, 0, e.children.length, i, e);
}
function ne(e, i, s, a, o) {
  o || (o = Ei(null)), o.minX = 1 / 0, o.minY = 1 / 0, o.maxX = -1 / 0, o.maxY = -1 / 0;
  for (let h = i; h < s; h++) {
    const l = e.children[h];
    ae(o, e.leaf ? a(l) : l);
  }
  return o;
}
function ae(e, i) {
  return e.minX = Math.min(e.minX, i.minX), e.minY = Math.min(e.minY, i.minY), e.maxX = Math.max(e.maxX, i.maxX), e.maxY = Math.max(e.maxY, i.maxY), e;
}
function Th(e, i) {
  return e.minX - i.minX;
}
function Ah(e, i) {
  return e.minY - i.minY;
}
function Us(e) {
  return (e.maxX - e.minX) * (e.maxY - e.minY);
}
function qe(e) {
  return e.maxX - e.minX + (e.maxY - e.minY);
}
function Lh(e, i) {
  return (Math.max(i.maxX, e.maxX) - Math.min(i.minX, e.minX)) * (Math.max(i.maxY, e.maxY) - Math.min(i.minY, e.minY));
}
function Ch(e, i) {
  const s = Math.max(e.minX, i.minX), a = Math.max(e.minY, i.minY), o = Math.min(e.maxX, i.maxX), h = Math.min(e.maxY, i.maxY);
  return Math.max(0, o - s) * Math.max(0, h - a);
}
function qs(e, i) {
  return e.minX <= i.minX && e.minY <= i.minY && i.maxX <= e.maxX && i.maxY <= e.maxY;
}
function je(e, i) {
  return i.minX <= e.maxX && i.minY <= e.maxY && i.maxX >= e.minX && i.maxY >= e.minY;
}
function Ei(e) {
  return {
    children: e,
    height: 1,
    leaf: !0,
    minX: 1 / 0,
    minY: 1 / 0,
    maxX: -1 / 0,
    maxY: -1 / 0
  };
}
function Ra(e, i, s, a, o) {
  const h = [i, s];
  for (; h.length; ) {
    if (s = h.pop(), i = h.pop(), s - i <= a) continue;
    const l = i + Math.ceil((s - i) / a / 2) * a;
    ur(e, l, i, s, o), h.push(i, l, l, s);
  }
}
const Bt = class Bt {
  /**地图事件控制类 */
  constructor(i) {
    this.rbush = new Sh(), this._listenCbs = /* @__PURE__ */ Object.create(null), this._allMapEvents = /* @__PURE__ */ new Map(), this._allRbush = [], this.perEvents = [], this.cbMapEvent = (s) => {
      let { cb: a, cbs: o } = s.event;
      if (a) {
        a(s);
        return;
      }
      if (o) {
        o[s.type]?.(s);
        return;
      }
      (this._listenCbs[s.type] || []).map((l) => l(s));
    }, this.resetRbush = () => {
      this.rbush && this.rbush.clear(), this._eventSwitch(!1), this._allRbush = [], this._allMapEvents.forEach((s) => {
        s.forEach((a) => {
          this.transformRbush(a);
        });
      }), this.rbush.load(this._allRbush), this._eventSwitch(!0);
    }, this.triggerEvent = (s) => {
      let a = [];
      this._allMapEvents.forEach((f) => {
        a = a.concat(f);
      });
      let o = document.querySelector("#map").style;
      if (o.cursor = Bt.ifInitCursor ? "default" : o.cursor, a.length === 0) return;
      let { curEvents: h, enterEvents: l, leaveEvents: u } = this.getEventsByRange(s);
      l.forEach((f) => this.doCbByEventType(f, "mouseenter")), u.forEach((f) => this.doCbByEventType(f, "mouseleave")), this.perEvents = h, h.length != 0 && (Bt.ifInitCursor = !1, o.cursor = "pointer", h.forEach((f) => this.doCbByEventType(f, s.type)));
    }, this.map = i, this._eventSwitch(!0), this.map.on("moveend", this.resetRbush), this.map.on("zoomend", this.resetRbush);
  }
  /**地图销毁必须调用此方法，否则事件指针会异常 */
  static destory() {
    Bt.ifInit = !0;
  }
  static initCursor() {
    Bt.ifInitCursor = !0;
  }
  /** 事件开关 
   * @param flag true开启地图事件监听 false关闭地图事件监听
  */
  _eventSwitch(i) {
    Bt.ifInit && (Bt.ifInit = !1, this.map.on("mousemove", () => {
      Bt.ifInitCursor = !0;
    })), ["click", "dblclick", "mousemove", "mousedown", "mouseup", "rightclick"].map((a) => {
      this.map[i ? "on" : "off"](a, this.triggerEvent);
    });
  }
  /**统一监听该类的指定事件 */
  on(i, s) {
    (this._listenCbs[i] = this._listenCbs[i] || []).push(s);
  }
  /**统一关闭指定事件的监听 */
  off(i, s) {
    let a = this._listenCbs[i] = this._listenCbs[i] || [];
    s ? ei(a, s) : this._listenCbs[i] = [];
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
  setEventsByKey(i, s) {
    this._allMapEvents.set(s, i.filter((a) => !a.ifHide)), this._allRbush = [], this.rbush.clear(), this._allMapEvents.forEach((a) => {
      a.forEach((o) => this.handleTransform(o));
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
  clearEventsByKey(i) {
    this.setEventsByKey([], i);
  }
  /**
   * 添加一个事件
   * 尽量使用setEventsByKey 
   * 或者pushEventByKey数组 而不是for 一个个push
   * 不然每次for循环push都会重新构造rbush
   *  */
  pushEventByKey(i, s) {
    this._allMapEvents.has(i) || this._allMapEvents.set(i, []);
    const a = this._allMapEvents.get(i);
    Array.isArray(s) ? a.push(...s) : a.push(s), this.setEventsByKey(a, i);
  }
  /** 添加事件 */
  handleTransform(i) {
    this.transformEvent(i), this.transformRbush(i);
  }
  /** 转换添加事件 */
  transformEvent(i) {
    i.ifHide !== !0 && (i.latlng, i.latlngs, i.type, i.info, i.cb);
  }
  /** 转为Rbush数据格式 */
  transformRbush(i) {
    if (i.ifHide === !0) return;
    let { range: s = [5, 5], latlng: a, latlngs: o = [], left: h = 0, top: l = 0 } = i;
    a && a.length === 2 && (o = [...o, a]), o.forEach((u) => {
      const [f, _] = u;
      let [v, m] = Oi(this.map, u), p = {
        minX: v - s[0] + h,
        minY: m - s[1] + l,
        maxX: v + s[0] + h,
        maxY: m + s[1] + l,
        data: i
      };
      this._allRbush.push(p);
    });
  }
  /**获取指针触发范围内的事件 */
  getEventsByRange(i) {
    let s, a, o, h, l, u, f = this.map.getZoom();
    if (i.latlng) {
      let w = i;
      ({ lng: s, lat: a } = w.latlng), { x: o, y: h } = w.containerPoint, { pageX: l, pageY: u } = w.originalEvent;
    } else {
      let w = i;
      ({ lng: s, lat: a } = w.lnglat), { x: o, y: h } = w.pixel, { pageX: l, pageY: u } = w.originEvent;
    }
    let _ = { latlng: [a, s], page: [l, u], point: [o, h] }, v = [], m = [], p = this.perEvents;
    return i.type == "click" && console.time("start"), this.rbush.search({ minX: o, minY: h, maxX: o, maxY: h }).forEach((w) => {
      let x = w.data, { latlng: S, latlngs: E = [], range: C = [5, 5], left: G = 0, top: z = 0, minZoom: B = 1, maxZoom: D = 50 } = w.data;
      if (B > f || D < f) return;
      S && S.length === 2 && (E = [...E, S]);
      let [W, et] = Oi(this.map, S), Z = this.genEventResponse(S, [W, et], x, _);
      v.push(Z);
      let X = p.find(
        ($) => $.position.latlng[0] === Z.position.latlng[0] && $.position.latlng[1] === Z.position.latlng[1]
      );
      X ? ei(p, X) : m.push(Z);
    }), i.type == "click" && console.timeEnd("start"), { curEvents: v, enterEvents: m, leaveEvents: p };
  }
  /**通过事件类型执行回调函数*/
  doCbByEventType(i, s) {
    let a = i.event.type;
    Array.isArray(a) || (a = [a]), a.includes(s) && (i.type = s, this.cbMapEvent(i));
  }
  /**生成地图事件响应对象 
   * @param latlng 该事件对象的地图坐标
   * @param point 该事件对象的地图像素坐标
   * @param event 地图事件
   * @param cursor 鼠标位置信息
  */
  genEventResponse(i, s, a, o) {
    let h = s[0] + o.page[0] - o.point[0], l = s[1] + o.page[1] - o.point[1];
    return { position: { latlng: i, page: [h, l], point: s }, cursor: o, event: a, info: a.info ?? {}, type: "unset" };
  }
};
Bt.ifInitCursor = !0, Bt.ifInit = !0;
let Ba = Bt;
class qd {
  constructor(i, s) {
    if (this.canvas = document.createElement("canvas"), this.ctx = this.canvas.getContext("2d"), this.width = 0, this.height = 0, this.options = {
      pane: "canvas"
    }, this.flagAnimation = 0, this._redraw = () => {
      console.log("##########--------MapCanvasLayer=>_redraw--------##########"), this.map && (this.resetCanvas(), this.renderFixedData(), this.renderAnimation());
    }, this.map = i, Object.assign(this.options, s), i instanceof it.Map) {
      this.type = 0;
      let a = this.layer = new it.Layer(this.options);
      this.layer.onAdd = () => (this.onAdd(), a);
    } else i instanceof AMap.Map && (this.type = 1, s = Object.assign({
      zooms: [3, 18],
      alwaysRender: !1,
      //缩放过程中是否重绘，复杂绘制建议设为false
      zIndex: 200
    }, s), this.layer = new AMap.CustomLayer(this.canvas, s));
    this.initCanvas(), this.onAdd();
  }
  /**移除图层 */
  onRemove() {
    const { flagAnimation: i } = this;
    return this._eventSwitch(!1), i && cancelAnimationFrame(i), this._onAmapRemove(), this._onLeafletRemove(), this;
  }
  /** 清空并重新设置画布 */
  resetCanvas() {
    const { canvas: i, map: s } = this;
    if (s instanceof it.Map) {
      var a = s.containerPointToLayerPoint([0, 0]);
      it.DomUtil.setPosition(i, a);
    }
    const { w: o, h } = lr(s);
    i.style.width = o + "px", i.style.height = h + "px", this.width = i.width = o, this.height = i.height = h;
  }
  /**添加或关闭地图特定的监听事件(_eventSwitch事件后自动调用) */
  addMapEvents(i, s) {
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
  on(i, s) {
    this.map.on(i, (a) => {
      s();
    });
  }
  /** */
  off(i, s) {
    this.map.off(i, (a) => {
      s();
    });
  }
  /**初始化canvas */
  initCanvas() {
    const { canvas: i, map: s, type: a, options: o, layer: h } = this;
    i.className = `sl-layer ${o.className || "sl-canvas-map"}`, i.style.zIndex = `${o.zIndex || 100}`, i.style.transformOrigin = "50% 50%", this.initLeafletCanvas();
  }
  /** 将图层添加到map实例中显示 */
  onAdd() {
    this._onAmapAdd(), this._eventSwitch(!0);
    let i = this.layer;
    return i.render = this._redraw, this;
  }
  /**基础的监听事件   
  * @param flag true开启重绘事件监听 false 关闭重绘事件监听
  **/
  _eventSwitch(i = !0) {
    let s = this.map, a = i ? "on" : "off";
    this.addLeafletEvent(i), this.addMapEvents(s, a);
  }
  /**------------------------------高德地图的实现------------------------------*/
  _onAmapAdd() {
    const { map: i, layer: s, type: a } = this;
    a === 1 && s.setMap(i);
  }
  _onAmapRemove() {
    const { map: i, layer: s, type: a } = this;
    a === 1 && i.remove(s);
  }
  /**------------------------------Leaflet地图的实现------------------------------*/
  /**初始化画布并添加到Pane中 */
  initLeafletCanvas() {
    const { canvas: i, map: s, type: a, options: o } = this;
    if (a || !(s instanceof it.Map)) return;
    let h = o.pane || "overlayPane", l = s.getPane(h) || s.createPane(h);
    l.appendChild(i), l.style.pointerEvents = "none";
    let u = s.options.zoomAnimation && it.Browser.any3d;
    it.DomUtil.addClass(i, "leaflet-zoom-" + (u ? "animated" : "hide")), it.extend(i, {
      onselectstart: it.Util.falseFn,
      onmousemove: it.Util.falseFn,
      onload: it.bind(this._onCanvasLoad, this)
    });
  }
  /**移除 */
  _onLeafletRemove() {
    let { map: i, layer: s, options: a, type: o } = this;
    if (o == 0) {
      let h = a.pane;
      h && i.getPane(h)?.removeChild(this.canvas), s.remove();
    }
  }
  addLeafletEvent(i = !0) {
    let s = this.map;
    if (s instanceof it.Map) {
      requestAnimationFrame(() => this._reset());
      let a = i ? "on" : "off";
      s[a]("viewreset", this._reset, this), s[a]("resize", this._reset, this), s[a]("moveend", this._reset, this), s.options.zoomAnimation && it.Browser.any3d && s[a]("zoomanim", this._animateZoom, this);
    }
  }
  /**重设画布,并重新渲染*/
  _reset() {
    this.resetCanvas(), this._redraw();
  }
  /**缩放动画 */
  _animateZoom(i) {
    let s = this.map;
    var a = s.getZoomScale(i.zoom), o = s._getCenterOffset(i.center)._multiplyBy(-a).subtract(s._getMapPanePos());
    it.DomUtil.setTransform(this.canvas, o, a);
  }
  _onCanvasLoad() {
    this.layer instanceof it.Layer && this.layer.fire("load");
  }
}
var Ye = { exports: {} }, Ih = Ye.exports, ka;
function Gh() {
  return ka || (ka = 1, (function(e, i) {
    (function(s, a) {
      e.exports = a();
    })(Ih, function() {
      function s(m) {
        var p = [];
        return m.AMapUI && p.push(a(m.AMapUI)), m.Loca && p.push(o(m.Loca)), Promise.all(p);
      }
      function a(m) {
        return new Promise(function(p, M) {
          var w = [];
          if (m.plugins) for (var x = 0; x < m.plugins.length; x += 1) l.AMapUI.plugins.indexOf(m.plugins[x]) == -1 && w.push(m.plugins[x]);
          if (u.AMapUI === h.failed) M("前次请求 AMapUI 失败");
          else if (u.AMapUI === h.notload) {
            u.AMapUI = h.loading, l.AMapUI.version = m.version || l.AMapUI.version, x = l.AMapUI.version;
            var S = document.body || document.head, E = document.createElement("script");
            E.type = "text/javascript", E.src = "https://webapi.amap.com/ui/" + x + "/main.js", E.onerror = function(C) {
              u.AMapUI = h.failed, M("请求 AMapUI 失败");
            }, E.onload = function() {
              if (u.AMapUI = h.loaded, w.length) window.AMapUI.loadUI(w, function() {
                for (var C = 0, G = w.length; C < G; C++) {
                  var z = w[C].split("/").slice(-1)[0];
                  window.AMapUI[z] = arguments[C];
                }
                for (p(); f.AMapUI.length; ) f.AMapUI.splice(0, 1)[0]();
              });
              else for (p(); f.AMapUI.length; ) f.AMapUI.splice(0, 1)[0]();
            }, S.appendChild(E);
          } else u.AMapUI === h.loaded ? m.version && m.version !== l.AMapUI.version ? M("不允许多个版本 AMapUI 混用") : w.length ? window.AMapUI.loadUI(w, function() {
            for (var C = 0, G = w.length; C < G; C++) {
              var z = w[C].split("/").slice(-1)[0];
              window.AMapUI[z] = arguments[C];
            }
            p();
          }) : p() : m.version && m.version !== l.AMapUI.version ? M("不允许多个版本 AMapUI 混用") : f.AMapUI.push(function(C) {
            C ? M(C) : w.length ? window.AMapUI.loadUI(w, function() {
              for (var G = 0, z = w.length; G < z; G++) {
                var B = w[G].split("/").slice(-1)[0];
                window.AMapUI[B] = arguments[G];
              }
              p();
            }) : p();
          });
        });
      }
      function o(m) {
        return new Promise(function(p, M) {
          if (u.Loca === h.failed) M("前次请求 Loca 失败");
          else if (u.Loca === h.notload) {
            u.Loca = h.loading, l.Loca.version = m.version || l.Loca.version;
            var w = l.Loca.version, x = l.AMap.version.startsWith("2"), S = w.startsWith("2");
            if (x && !S || !x && S) M("JSAPI 与 Loca 版本不对应！！");
            else {
              x = l.key, S = document.body || document.head;
              var E = document.createElement("script");
              E.type = "text/javascript", E.src = "https://webapi.amap.com/loca?v=" + w + "&key=" + x, E.onerror = function(C) {
                u.Loca = h.failed, M("请求 AMapUI 失败");
              }, E.onload = function() {
                for (u.Loca = h.loaded, p(); f.Loca.length; ) f.Loca.splice(0, 1)[0]();
              }, S.appendChild(E);
            }
          } else u.Loca === h.loaded ? m.version && m.version !== l.Loca.version ? M("不允许多个版本 Loca 混用") : p() : m.version && m.version !== l.Loca.version ? M("不允许多个版本 Loca 混用") : f.Loca.push(function(C) {
            C ? M(C) : M();
          });
        });
      }
      if (!window) throw Error("AMap JSAPI can only be used in Browser.");
      var h;
      (function(m) {
        m.notload = "notload", m.loading = "loading", m.loaded = "loaded", m.failed = "failed";
      })(h || (h = {}));
      var l = { key: "", AMap: { version: "1.4.15", plugins: [] }, AMapUI: { version: "1.1", plugins: [] }, Loca: { version: "1.3.2" } }, u = { AMap: h.notload, AMapUI: h.notload, Loca: h.notload }, f = { AMapUI: [], Loca: [] }, _ = [], v = function(m) {
        typeof m == "function" && (u.AMap === h.loaded ? m(window.AMap) : _.push(m));
      };
      return { load: function(m) {
        return new Promise(function(p, M) {
          if (u.AMap == h.failed) M("");
          else if (u.AMap == h.notload) {
            var w = m.key, x = m.version, S = m.plugins;
            w ? (window.AMap && location.host !== "lbs.amap.com" && M("禁止多种API加载方式混用"), l.key = w, l.AMap.version = x || l.AMap.version, l.AMap.plugins = S || l.AMap.plugins, u.AMap = h.loading, x = document.body || document.head, window.___onAPILoaded = function(C) {
              if (delete window.___onAPILoaded, C) u.AMap = h.failed, M(C);
              else for (u.AMap = h.loaded, s(m).then(function() {
                p(window.AMap);
              }).catch(M); _.length; ) _.splice(0, 1)[0]();
            }, S = document.createElement("script"), S.type = "text/javascript", S.src = "https://webapi.amap.com/maps?callback=___onAPILoaded&v=" + l.AMap.version + "&key=" + w + "&plugin=" + l.AMap.plugins.join(","), S.onerror = function(C) {
              u.AMap = h.failed, M(C);
            }, x.appendChild(S)) : M("请填写key");
          } else if (u.AMap == h.loaded) if (m.key && m.key !== l.key) M("多个不一致的 key");
          else if (m.version && m.version !== l.AMap.version) M("不允许多个版本 JSAPI 混用");
          else {
            if (w = [], m.plugins) for (x = 0; x < m.plugins.length; x += 1) l.AMap.plugins.indexOf(m.plugins[x]) == -1 && w.push(m.plugins[x]);
            w.length ? window.AMap.plugin(w, function() {
              s(m).then(function() {
                p(window.AMap);
              }).catch(M);
            }) : s(m).then(function() {
              p(window.AMap);
            }).catch(M);
          }
          else if (m.key && m.key !== l.key) M("多个不一致的 key");
          else if (m.version && m.version !== l.AMap.version) M("不允许多个版本 JSAPI 混用");
          else {
            var E = [];
            if (m.plugins) for (x = 0; x < m.plugins.length; x += 1) l.AMap.plugins.indexOf(m.plugins[x]) == -1 && E.push(m.plugins[x]);
            v(function() {
              E.length ? window.AMap.plugin(E, function() {
                s(m).then(function() {
                  p(window.AMap);
                }).catch(M);
              }) : s(m).then(function() {
                p(window.AMap);
              }).catch(M);
            });
          }
        });
      }, reset: function() {
        delete window.AMap, delete window.AMapUI, delete window.Loca, l = { key: "", AMap: { version: "1.4.15", plugins: [] }, AMapUI: { version: "1.1", plugins: [] }, Loca: { version: "1.3.2" } }, u = {
          AMap: h.notload,
          AMapUI: h.notload,
          Loca: h.notload
        }, f = { AMap: [], AMapUI: [], Loca: [] };
      } };
    });
  })(Ye)), Ye.exports;
}
var Nh = Gh(), js = { exports: {} };
function Oh(e) {
  e("EPSG:4326", "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees"), e("EPSG:4269", "+title=NAD83 (long/lat) +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees"), e("EPSG:3857", "+title=WGS 84 / Pseudo-Mercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs");
  for (var i = 1; i <= 60; ++i)
    e("EPSG:" + (32600 + i), "+proj=utm +zone=" + i + " +datum=WGS84 +units=m"), e("EPSG:" + (32700 + i), "+proj=utm +zone=" + i + " +south +datum=WGS84 +units=m");
  e("EPSG:5041", "+title=WGS 84 / UPS North (E,N) +proj=stere +lat_0=90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m"), e("EPSG:5042", "+title=WGS 84 / UPS South (E,N) +proj=stere +lat_0=-90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +datum=WGS84 +units=m"), e.WGS84 = e["EPSG:4326"], e["EPSG:3785"] = e["EPSG:3857"], e.GOOGLE = e["EPSG:3857"], e["EPSG:900913"] = e["EPSG:3857"], e["EPSG:102113"] = e["EPSG:3857"];
}
var _i = 1, mi = 2, Gi = 3, zh = 4, $s = 5, Da = 6378137, Rh = 6356752314e-3, Za = 0.0066943799901413165, ue = 484813681109536e-20, A = Math.PI / 2, Bh = 0.16666666666666666, kh = 0.04722222222222222, Dh = 0.022156084656084655, I = 1e-10, ot = 0.017453292519943295, Et = 57.29577951308232, J = Math.PI / 4, me = Math.PI * 2, lt = 3.14159265359, Tt = {};
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
const Zh = {
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
var Fa = /[\s_\-\/\(\)]/g;
function ai(e, i) {
  if (e[i])
    return e[i];
  for (var s = Object.keys(e), a = i.toLowerCase().replace(Fa, ""), o = -1, h, l; ++o < s.length; )
    if (h = s[o], l = h.toLowerCase().replace(Fa, ""), l === a)
      return e[h];
}
function Js(e) {
  var i = {}, s = e.split("+").map(function(u) {
    return u.trim();
  }).filter(function(u) {
    return u;
  }).reduce(function(u, f) {
    var _ = f.split("=");
    return _.push(!0), u[_[0].toLowerCase()] = _[1], u;
  }, {}), a, o, h, l = {
    proj: "projName",
    datum: "datumCode",
    rf: function(u) {
      i.rf = parseFloat(u);
    },
    lat_0: function(u) {
      i.lat0 = u * ot;
    },
    lat_1: function(u) {
      i.lat1 = u * ot;
    },
    lat_2: function(u) {
      i.lat2 = u * ot;
    },
    lat_ts: function(u) {
      i.lat_ts = u * ot;
    },
    lon_0: function(u) {
      i.long0 = u * ot;
    },
    lon_1: function(u) {
      i.long1 = u * ot;
    },
    lon_2: function(u) {
      i.long2 = u * ot;
    },
    alpha: function(u) {
      i.alpha = parseFloat(u) * ot;
    },
    gamma: function(u) {
      i.rectified_grid_angle = parseFloat(u) * ot;
    },
    lonc: function(u) {
      i.longc = u * ot;
    },
    x_0: function(u) {
      i.x0 = parseFloat(u);
    },
    y_0: function(u) {
      i.y0 = parseFloat(u);
    },
    k_0: function(u) {
      i.k0 = parseFloat(u);
    },
    k: function(u) {
      i.k0 = parseFloat(u);
    },
    a: function(u) {
      i.a = parseFloat(u);
    },
    b: function(u) {
      i.b = parseFloat(u);
    },
    r: function(u) {
      i.a = i.b = parseFloat(u);
    },
    r_a: function() {
      i.R_A = !0;
    },
    zone: function(u) {
      i.zone = parseInt(u, 10);
    },
    south: function() {
      i.utmSouth = !0;
    },
    towgs84: function(u) {
      i.datum_params = u.split(",").map(function(f) {
        return parseFloat(f);
      });
    },
    to_meter: function(u) {
      i.to_meter = parseFloat(u);
    },
    units: function(u) {
      i.units = u;
      var f = ai(Zh, u);
      f && (i.to_meter = f.to_meter);
    },
    from_greenwich: function(u) {
      i.from_greenwich = u * ot;
    },
    pm: function(u) {
      var f = ai(Tt, u);
      i.from_greenwich = (f || parseFloat(u)) * ot;
    },
    nadgrids: function(u) {
      u === "@null" ? i.datumCode = "none" : i.nadgrids = u;
    },
    axis: function(u) {
      var f = "ewnsud";
      u.length === 3 && f.indexOf(u.substr(0, 1)) !== -1 && f.indexOf(u.substr(1, 1)) !== -1 && f.indexOf(u.substr(2, 1)) !== -1 && (i.axis = u);
    },
    approx: function() {
      i.approx = !0;
    },
    over: function() {
      i.over = !0;
    }
  };
  for (a in s)
    o = s[a], a in l ? (h = l[a], typeof h == "function" ? h(o) : i[h] = o) : i[a] = o;
  return typeof i.datumCode == "string" && i.datumCode !== "WGS84" && (i.datumCode = i.datumCode.toLowerCase()), i.projStr = e, i;
}
class cr {
  static getId(i) {
    const s = i.find((a) => Array.isArray(a) && a[0] === "ID");
    return s && s.length >= 3 ? {
      authority: s[1],
      code: parseInt(s[2], 10)
    } : null;
  }
  static convertUnit(i, s = "unit") {
    if (!i || i.length < 3)
      return { type: s, name: "unknown", conversion_factor: null };
    const a = i[1], o = parseFloat(i[2]) || null, h = i.find((u) => Array.isArray(u) && u[0] === "ID"), l = h ? {
      authority: h[1],
      code: parseInt(h[2], 10)
    } : null;
    return {
      type: s,
      name: a,
      conversion_factor: o,
      id: l
    };
  }
  static convertAxis(i) {
    const s = i[1] || "Unknown";
    let a;
    const o = s.match(/^\((.)\)$/);
    if (o) {
      const _ = o[1].toUpperCase();
      if (_ === "E") a = "east";
      else if (_ === "N") a = "north";
      else if (_ === "U") a = "up";
      else throw new Error(`Unknown axis abbreviation: ${_}`);
    } else
      a = i[2] ? i[2].toLowerCase() : "unknown";
    const h = i.find((_) => Array.isArray(_) && _[0] === "ORDER"), l = h ? parseInt(h[1], 10) : null, u = i.find(
      (_) => Array.isArray(_) && (_[0] === "LENGTHUNIT" || _[0] === "ANGLEUNIT" || _[0] === "SCALEUNIT")
    ), f = this.convertUnit(u);
    return {
      name: s,
      direction: a,
      // Use the valid PROJJSON direction value
      unit: f,
      order: l
    };
  }
  static extractAxes(i) {
    return i.filter((s) => Array.isArray(s) && s[0] === "AXIS").map((s) => this.convertAxis(s)).sort((s, a) => (s.order || 0) - (a.order || 0));
  }
  static convert(i, s = {}) {
    switch (i[0]) {
      case "PROJCRS":
        s.type = "ProjectedCRS", s.name = i[1], s.base_crs = i.find((p) => Array.isArray(p) && p[0] === "BASEGEOGCRS") ? this.convert(i.find((p) => Array.isArray(p) && p[0] === "BASEGEOGCRS")) : null, s.conversion = i.find((p) => Array.isArray(p) && p[0] === "CONVERSION") ? this.convert(i.find((p) => Array.isArray(p) && p[0] === "CONVERSION")) : null;
        const a = i.find((p) => Array.isArray(p) && p[0] === "CS");
        a && (s.coordinate_system = {
          type: a[1],
          axis: this.extractAxes(i)
        });
        const o = i.find((p) => Array.isArray(p) && p[0] === "LENGTHUNIT");
        if (o) {
          const p = this.convertUnit(o);
          s.coordinate_system.unit = p;
        }
        s.id = this.getId(i);
        break;
      case "BASEGEOGCRS":
      case "GEOGCRS":
        s.type = "GeographicCRS", s.name = i[1];
        const h = i.find(
          (p) => Array.isArray(p) && (p[0] === "DATUM" || p[0] === "ENSEMBLE")
        );
        if (h) {
          const p = this.convert(h);
          h[0] === "ENSEMBLE" ? s.datum_ensemble = p : s.datum = p;
          const M = i.find((w) => Array.isArray(w) && w[0] === "PRIMEM");
          M && M[1] !== "Greenwich" && (p.prime_meridian = {
            name: M[1],
            longitude: parseFloat(M[2])
          });
        }
        s.coordinate_system = {
          type: "ellipsoidal",
          axis: this.extractAxes(i)
        }, s.id = this.getId(i);
        break;
      case "DATUM":
        s.type = "GeodeticReferenceFrame", s.name = i[1], s.ellipsoid = i.find((p) => Array.isArray(p) && p[0] === "ELLIPSOID") ? this.convert(i.find((p) => Array.isArray(p) && p[0] === "ELLIPSOID")) : null;
        break;
      case "ENSEMBLE":
        s.type = "DatumEnsemble", s.name = i[1], s.members = i.filter((p) => Array.isArray(p) && p[0] === "MEMBER").map((p) => ({
          type: "DatumEnsembleMember",
          name: p[1],
          id: this.getId(p)
          // Extract ID as { authority, code }
        }));
        const l = i.find((p) => Array.isArray(p) && p[0] === "ENSEMBLEACCURACY");
        l && (s.accuracy = parseFloat(l[1]));
        const u = i.find((p) => Array.isArray(p) && p[0] === "ELLIPSOID");
        u && (s.ellipsoid = this.convert(u)), s.id = this.getId(i);
        break;
      case "ELLIPSOID":
        s.type = "Ellipsoid", s.name = i[1], s.semi_major_axis = parseFloat(i[2]), s.inverse_flattening = parseFloat(i[3]), i.find((p) => Array.isArray(p) && p[0] === "LENGTHUNIT") && this.convert(i.find((p) => Array.isArray(p) && p[0] === "LENGTHUNIT"), s);
        break;
      case "CONVERSION":
        s.type = "Conversion", s.name = i[1], s.method = i.find((p) => Array.isArray(p) && p[0] === "METHOD") ? this.convert(i.find((p) => Array.isArray(p) && p[0] === "METHOD")) : null, s.parameters = i.filter((p) => Array.isArray(p) && p[0] === "PARAMETER").map((p) => this.convert(p));
        break;
      case "METHOD":
        s.type = "Method", s.name = i[1], s.id = this.getId(i);
        break;
      case "PARAMETER":
        s.type = "Parameter", s.name = i[1], s.value = parseFloat(i[2]), s.unit = this.convertUnit(
          i.find(
            (p) => Array.isArray(p) && (p[0] === "LENGTHUNIT" || p[0] === "ANGLEUNIT" || p[0] === "SCALEUNIT")
          )
        ), s.id = this.getId(i);
        break;
      case "BOUNDCRS":
        s.type = "BoundCRS";
        const f = i.find((p) => Array.isArray(p) && p[0] === "SOURCECRS");
        if (f) {
          const p = f.find((M) => Array.isArray(M));
          s.source_crs = p ? this.convert(p) : null;
        }
        const _ = i.find((p) => Array.isArray(p) && p[0] === "TARGETCRS");
        if (_) {
          const p = _.find((M) => Array.isArray(M));
          s.target_crs = p ? this.convert(p) : null;
        }
        const v = i.find((p) => Array.isArray(p) && p[0] === "ABRIDGEDTRANSFORMATION");
        v ? s.transformation = this.convert(v) : s.transformation = null;
        break;
      case "ABRIDGEDTRANSFORMATION":
        if (s.type = "Transformation", s.name = i[1], s.method = i.find((p) => Array.isArray(p) && p[0] === "METHOD") ? this.convert(i.find((p) => Array.isArray(p) && p[0] === "METHOD")) : null, s.parameters = i.filter((p) => Array.isArray(p) && (p[0] === "PARAMETER" || p[0] === "PARAMETERFILE")).map((p) => {
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
        }), s.parameters.length === 7) {
          const p = s.parameters[6];
          p.name === "Scale difference" && (p.value = Math.round((p.value - 1) * 1e12) / 1e6);
        }
        s.id = this.getId(i);
        break;
      case "AXIS":
        s.coordinate_system || (s.coordinate_system = { type: "unspecified", axis: [] }), s.coordinate_system.axis.push(this.convertAxis(i));
        break;
      case "LENGTHUNIT":
        const m = this.convertUnit(i, "LinearUnit");
        s.coordinate_system && s.coordinate_system.axis && s.coordinate_system.axis.forEach((p) => {
          p.unit || (p.unit = m);
        }), m.conversion_factor && m.conversion_factor !== 1 && s.semi_major_axis && (s.semi_major_axis = {
          value: s.semi_major_axis,
          unit: m
        });
        break;
      default:
        s.keyword = i[0];
        break;
    }
    return s;
  }
}
class Fh extends cr {
  static convert(i, s = {}) {
    return super.convert(i, s), s.coordinate_system && s.coordinate_system.subtype === "Cartesian" && delete s.coordinate_system, s.usage && delete s.usage, s;
  }
}
class Uh extends cr {
  static convert(i, s = {}) {
    super.convert(i, s);
    const a = i.find((h) => Array.isArray(h) && h[0] === "CS");
    a && (s.coordinate_system = {
      subtype: a[1],
      axis: this.extractAxes(i)
    });
    const o = i.find((h) => Array.isArray(h) && h[0] === "USAGE");
    if (o) {
      const h = o.find((f) => Array.isArray(f) && f[0] === "SCOPE"), l = o.find((f) => Array.isArray(f) && f[0] === "AREA"), u = o.find((f) => Array.isArray(f) && f[0] === "BBOX");
      s.usage = {}, h && (s.usage.scope = h[1]), l && (s.usage.area = l[1]), u && (s.usage.bbox = u.slice(1));
    }
    return s;
  }
}
function qh(e) {
  return e.find((i) => Array.isArray(i) && i[0] === "USAGE") ? "2019" : (e.find((i) => Array.isArray(i) && i[0] === "CS") || e[0] === "BOUNDCRS" || e[0] === "PROJCRS" || e[0] === "GEOGCRS", "2015");
}
function jh(e) {
  return (qh(e) === "2019" ? Uh : Fh).convert(e);
}
function Hh(e) {
  const i = e.toUpperCase();
  return i.includes("PROJCRS") || i.includes("GEOGCRS") || i.includes("BOUNDCRS") || i.includes("VERTCRS") || i.includes("LENGTHUNIT") || i.includes("ANGLEUNIT") || i.includes("SCALEUNIT") ? "WKT2" : (i.includes("PROJCS") || i.includes("GEOGCS") || i.includes("LOCAL_CS") || i.includes("VERT_CS") || i.includes("UNIT"), "WKT1");
}
var ge = 1, fr = 2, dr = 3, Qe = 4, _r = 5, rn = -1, Wh = /\s/, Xh = /[A-Za-z]/, Yh = /[A-Za-z84_]/, os = /[,\]]/, mr = /[\d\.E\-\+]/;
function $t(e) {
  if (typeof e != "string")
    throw new Error("not a string");
  this.text = e.trim(), this.level = 0, this.place = 0, this.root = null, this.stack = [], this.currentObject = null, this.state = ge;
}
$t.prototype.readCharicter = function() {
  var e = this.text[this.place++];
  if (this.state !== Qe)
    for (; Wh.test(e); ) {
      if (this.place >= this.text.length)
        return;
      e = this.text[this.place++];
    }
  switch (this.state) {
    case ge:
      return this.neutral(e);
    case fr:
      return this.keyword(e);
    case Qe:
      return this.quoted(e);
    case _r:
      return this.afterquote(e);
    case dr:
      return this.number(e);
    case rn:
      return;
  }
};
$t.prototype.afterquote = function(e) {
  if (e === '"') {
    this.word += '"', this.state = Qe;
    return;
  }
  if (os.test(e)) {
    this.word = this.word.trim(), this.afterItem(e);
    return;
  }
  throw new Error(`havn't handled "` + e + '" in afterquote yet, index ' + this.place);
};
$t.prototype.afterItem = function(e) {
  if (e === ",") {
    this.word !== null && this.currentObject.push(this.word), this.word = null, this.state = ge;
    return;
  }
  if (e === "]") {
    this.level--, this.word !== null && (this.currentObject.push(this.word), this.word = null), this.state = ge, this.currentObject = this.stack.pop(), this.currentObject || (this.state = rn);
    return;
  }
};
$t.prototype.number = function(e) {
  if (mr.test(e)) {
    this.word += e;
    return;
  }
  if (os.test(e)) {
    this.word = parseFloat(this.word), this.afterItem(e);
    return;
  }
  throw new Error(`havn't handled "` + e + '" in number yet, index ' + this.place);
};
$t.prototype.quoted = function(e) {
  if (e === '"') {
    this.state = _r;
    return;
  }
  this.word += e;
};
$t.prototype.keyword = function(e) {
  if (Yh.test(e)) {
    this.word += e;
    return;
  }
  if (e === "[") {
    var i = [];
    i.push(this.word), this.level++, this.root === null ? this.root = i : this.currentObject.push(i), this.stack.push(this.currentObject), this.currentObject = i, this.state = ge;
    return;
  }
  if (os.test(e)) {
    this.afterItem(e);
    return;
  }
  throw new Error(`havn't handled "` + e + '" in keyword yet, index ' + this.place);
};
$t.prototype.neutral = function(e) {
  if (Xh.test(e)) {
    this.word = e, this.state = fr;
    return;
  }
  if (e === '"') {
    this.word = "", this.state = Qe;
    return;
  }
  if (mr.test(e)) {
    this.word = e, this.state = dr;
    return;
  }
  if (os.test(e)) {
    this.afterItem(e);
    return;
  }
  throw new Error(`havn't handled "` + e + '" in neutral yet, index ' + this.place);
};
$t.prototype.output = function() {
  for (; this.place < this.text.length; )
    this.readCharicter();
  if (this.state === rn)
    return this.root;
  throw new Error('unable to parse string "' + this.text + '". State is ' + this.state);
};
function Vh(e) {
  var i = new $t(e);
  return i.output();
}
function Hs(e, i, s) {
  Array.isArray(i) && (s.unshift(i), i = null);
  var a = i ? {} : e, o = s.reduce(function(h, l) {
    return Ai(l, h), h;
  }, a);
  i && (e[i] = o);
}
function Ai(e, i) {
  if (!Array.isArray(e)) {
    i[e] = !0;
    return;
  }
  var s = e.shift();
  if (s === "PARAMETER" && (s = e.shift()), e.length === 1) {
    if (Array.isArray(e[0])) {
      i[s] = {}, Ai(e[0], i[s]);
      return;
    }
    i[s] = e[0];
    return;
  }
  if (!e.length) {
    i[s] = !0;
    return;
  }
  if (s === "TOWGS84") {
    i[s] = e;
    return;
  }
  if (s === "AXIS") {
    s in i || (i[s] = []), i[s].push(e);
    return;
  }
  Array.isArray(s) || (i[s] = {});
  var a;
  switch (s) {
    case "UNIT":
    case "PRIMEM":
    case "VERT_DATUM":
      i[s] = {
        name: e[0].toLowerCase(),
        convert: e[1]
      }, e.length === 3 && Ai(e[2], i[s]);
      return;
    case "SPHEROID":
    case "ELLIPSOID":
      i[s] = {
        name: e[0],
        a: e[1],
        rf: e[2]
      }, e.length === 4 && Ai(e[3], i[s]);
      return;
    case "EDATUM":
    case "ENGINEERINGDATUM":
    case "LOCAL_DATUM":
    case "DATUM":
    case "VERT_CS":
    case "VERTCRS":
    case "VERTICALCRS":
      e[0] = ["name", e[0]], Hs(i, s, e);
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
      e[0] = ["name", e[0]], Hs(i, s, e), i[s].type = s;
      return;
    default:
      for (a = -1; ++a < e.length; )
        if (!Array.isArray(e[a]))
          return Ai(e, i[s]);
      return Hs(i, s, e);
  }
}
var Kh = 0.017453292519943295;
function Rt(e) {
  return e * Kh;
}
function gr(e) {
  const i = (e.projName || "").toLowerCase().replace(/_/g, " ");
  !e.long0 && e.longc && (i === "albers conic equal area" || i === "lambert azimuthal equal area") && (e.long0 = e.longc), !e.lat_ts && e.lat1 && (i === "stereographic south pole" || i === "polar stereographic (variant b)") ? (e.lat0 = Rt(e.lat1 > 0 ? 90 : -90), e.lat_ts = e.lat1, delete e.lat1) : !e.lat_ts && e.lat0 && (i === "polar stereographic" || i === "polar stereographic (variant a)") && (e.lat_ts = e.lat0, e.lat0 = Rt(e.lat0 > 0 ? 90 : -90), delete e.lat1);
}
function Ua(e) {
  let i = { units: null, to_meter: void 0 };
  return typeof e == "string" ? (i.units = e.toLowerCase(), i.units === "metre" && (i.units = "meter"), i.units === "meter" && (i.to_meter = 1)) : e && e.name && (i.units = e.name.toLowerCase(), i.units === "metre" && (i.units = "meter"), i.to_meter = e.conversion_factor), i;
}
function qa(e) {
  return typeof e == "object" ? e.value * e.unit.conversion_factor : e;
}
function ja(e, i) {
  e.ellipsoid.radius ? (i.a = e.ellipsoid.radius, i.rf = 0) : (i.a = qa(e.ellipsoid.semi_major_axis), e.ellipsoid.inverse_flattening !== void 0 ? i.rf = e.ellipsoid.inverse_flattening : e.ellipsoid.semi_major_axis !== void 0 && e.ellipsoid.semi_minor_axis !== void 0 && (i.rf = i.a / (i.a - qa(e.ellipsoid.semi_minor_axis))));
}
function ts(e, i = {}) {
  return !e || typeof e != "object" ? e : e.type === "BoundCRS" ? (ts(e.source_crs, i), e.transformation && (e.transformation.method && e.transformation.method.name === "NTv2" ? i.nadgrids = e.transformation.parameters[0].value : i.datum_params = e.transformation.parameters.map((s) => s.value)), i) : (Object.keys(e).forEach((s) => {
    const a = e[s];
    if (a !== null)
      switch (s) {
        case "name":
          if (i.srsCode)
            break;
          i.name = a, i.srsCode = a;
          break;
        case "type":
          a === "GeographicCRS" ? i.projName = "longlat" : a === "ProjectedCRS" && e.conversion && e.conversion.method && (i.projName = e.conversion.method.name);
          break;
        case "datum":
        case "datum_ensemble":
          a.ellipsoid && (i.ellps = a.ellipsoid.name, ja(a, i)), a.prime_meridian && (i.from_greenwich = a.prime_meridian.longitude * Math.PI / 180);
          break;
        case "ellipsoid":
          i.ellps = a.name, ja(a, i);
          break;
        case "prime_meridian":
          i.long0 = (a.longitude || 0) * Math.PI / 180;
          break;
        case "coordinate_system":
          if (a.axis) {
            if (i.axis = a.axis.map((o) => {
              const h = o.direction;
              if (h === "east") return "e";
              if (h === "north") return "n";
              if (h === "west") return "w";
              if (h === "south") return "s";
              throw new Error(`Unknown axis direction: ${h}`);
            }).join("") + "u", a.unit) {
              const { units: o, to_meter: h } = Ua(a.unit);
              i.units = o, i.to_meter = h;
            } else if (a.axis[0] && a.axis[0].unit) {
              const { units: o, to_meter: h } = Ua(a.axis[0].unit);
              i.units = o, i.to_meter = h;
            }
          }
          break;
        case "id":
          a.authority && a.code && (i.title = a.authority + ":" + a.code);
          break;
        case "conversion":
          a.method && a.method.name && (i.projName = a.method.name), a.parameters && a.parameters.forEach((o) => {
            const h = o.name.toLowerCase().replace(/\s+/g, "_"), l = o.value;
            o.unit && o.unit.conversion_factor ? i[h] = l * o.unit.conversion_factor : o.unit === "degree" ? i[h] = l * Math.PI / 180 : i[h] = l;
          });
          break;
        case "unit":
          a.name && (i.units = a.name.toLowerCase(), i.units === "metre" && (i.units = "meter")), a.conversion_factor && (i.to_meter = a.conversion_factor);
          break;
        case "base_crs":
          ts(a, i), i.datumCode = a.id ? a.id.authority + "_" + a.id.code : a.name;
          break;
      }
  }), i.latitude_of_false_origin !== void 0 && (i.lat0 = i.latitude_of_false_origin), i.longitude_of_false_origin !== void 0 && (i.long0 = i.longitude_of_false_origin), i.latitude_of_standard_parallel !== void 0 && (i.lat0 = i.latitude_of_standard_parallel, i.lat1 = i.latitude_of_standard_parallel), i.latitude_of_1st_standard_parallel !== void 0 && (i.lat1 = i.latitude_of_1st_standard_parallel), i.latitude_of_2nd_standard_parallel !== void 0 && (i.lat2 = i.latitude_of_2nd_standard_parallel), i.latitude_of_projection_centre !== void 0 && (i.lat0 = i.latitude_of_projection_centre), i.longitude_of_projection_centre !== void 0 && (i.longc = i.longitude_of_projection_centre), i.easting_at_false_origin !== void 0 && (i.x0 = i.easting_at_false_origin), i.northing_at_false_origin !== void 0 && (i.y0 = i.northing_at_false_origin), i.latitude_of_natural_origin !== void 0 && (i.lat0 = i.latitude_of_natural_origin), i.longitude_of_natural_origin !== void 0 && (i.long0 = i.longitude_of_natural_origin), i.longitude_of_origin !== void 0 && (i.long0 = i.longitude_of_origin), i.false_easting !== void 0 && (i.x0 = i.false_easting), i.easting_at_projection_centre && (i.x0 = i.easting_at_projection_centre), i.false_northing !== void 0 && (i.y0 = i.false_northing), i.northing_at_projection_centre && (i.y0 = i.northing_at_projection_centre), i.standard_parallel_1 !== void 0 && (i.lat1 = i.standard_parallel_1), i.standard_parallel_2 !== void 0 && (i.lat2 = i.standard_parallel_2), i.scale_factor_at_natural_origin !== void 0 && (i.k0 = i.scale_factor_at_natural_origin), i.scale_factor_at_projection_centre !== void 0 && (i.k0 = i.scale_factor_at_projection_centre), i.scale_factor_on_pseudo_standard_parallel !== void 0 && (i.k0 = i.scale_factor_on_pseudo_standard_parallel), i.azimuth !== void 0 && (i.alpha = i.azimuth), i.azimuth_at_projection_centre !== void 0 && (i.alpha = i.azimuth_at_projection_centre), i.angle_from_rectified_to_skew_grid && (i.rectified_grid_angle = i.angle_from_rectified_to_skew_grid), gr(i), i);
}
var $h = [
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
function Jh(e, i) {
  var s = i[0], a = i[1];
  !(s in e) && a in e && (e[s] = e[a], i.length === 3 && (e[s] = i[2](e[s])));
}
function pr(e) {
  for (var i = Object.keys(e), s = 0, a = i.length; s < a; ++s) {
    var o = i[s];
    $h.indexOf(o) !== -1 && Qh(e[o]), typeof e[o] == "object" && pr(e[o]);
  }
}
function Qh(e) {
  if (e.AUTHORITY) {
    var i = Object.keys(e.AUTHORITY)[0];
    i && i in e.AUTHORITY && (e.title = i + ":" + e.AUTHORITY[i]);
  }
  if (e.type === "GEOGCS" ? e.projName = "longlat" : e.type === "LOCAL_CS" ? (e.projName = "identity", e.local = !0) : typeof e.PROJECTION == "object" ? e.projName = Object.keys(e.PROJECTION)[0] : e.projName = e.PROJECTION, e.AXIS) {
    for (var s = "", a = 0, o = e.AXIS.length; a < o; ++a) {
      var h = [e.AXIS[a][0].toLowerCase(), e.AXIS[a][1].toLowerCase()];
      h[0].indexOf("north") !== -1 || (h[0] === "y" || h[0] === "lat") && h[1] === "north" ? s += "n" : h[0].indexOf("south") !== -1 || (h[0] === "y" || h[0] === "lat") && h[1] === "south" ? s += "s" : h[0].indexOf("east") !== -1 || (h[0] === "x" || h[0] === "lon") && h[1] === "east" ? s += "e" : (h[0].indexOf("west") !== -1 || (h[0] === "x" || h[0] === "lon") && h[1] === "west") && (s += "w");
    }
    s.length === 2 && (s += "u"), s.length === 3 && (e.axis = s);
  }
  e.UNIT && (e.units = e.UNIT.name.toLowerCase(), e.units === "metre" && (e.units = "meter"), e.UNIT.convert && (e.type === "GEOGCS" ? e.DATUM && e.DATUM.SPHEROID && (e.to_meter = e.UNIT.convert * e.DATUM.SPHEROID.a) : e.to_meter = e.UNIT.convert));
  var l = e.GEOGCS;
  e.type === "GEOGCS" && (l = e), l && (l.DATUM ? e.datumCode = l.DATUM.name.toLowerCase() : e.datumCode = l.name.toLowerCase(), e.datumCode.slice(0, 2) === "d_" && (e.datumCode = e.datumCode.slice(2)), e.datumCode === "new_zealand_1949" && (e.datumCode = "nzgd49"), (e.datumCode === "wgs_1984" || e.datumCode === "world_geodetic_system_1984") && (e.PROJECTION === "Mercator_Auxiliary_Sphere" && (e.sphere = !0), e.datumCode = "wgs84"), e.datumCode === "belge_1972" && (e.datumCode = "rnb72"), l.DATUM && l.DATUM.SPHEROID && (e.ellps = l.DATUM.SPHEROID.name.replace("_19", "").replace(/[Cc]larke\_18/, "clrk"), e.ellps.toLowerCase().slice(0, 13) === "international" && (e.ellps = "intl"), e.a = l.DATUM.SPHEROID.a, e.rf = parseFloat(l.DATUM.SPHEROID.rf, 10)), l.DATUM && l.DATUM.TOWGS84 && (e.datum_params = l.DATUM.TOWGS84), ~e.datumCode.indexOf("osgb_1936") && (e.datumCode = "osgb36"), ~e.datumCode.indexOf("osni_1952") && (e.datumCode = "osni52"), (~e.datumCode.indexOf("tm65") || ~e.datumCode.indexOf("geodetic_datum_of_1965")) && (e.datumCode = "ire65"), e.datumCode === "ch1903+" && (e.datumCode = "ch1903"), ~e.datumCode.indexOf("israel") && (e.datumCode = "isr93")), e.b && !isFinite(e.b) && (e.b = e.a), e.rectified_grid_angle && (e.rectified_grid_angle = Rt(e.rectified_grid_angle));
  function u(v) {
    var m = e.to_meter || 1;
    return v * m;
  }
  var f = function(v) {
    return Jh(e, v);
  }, _ = [
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
    ["lat0", "latitude_of_center", Rt],
    ["longitude_of_center", "Longitude_Of_Center"],
    ["longitude_of_center", "Longitude_of_center"],
    ["longc", "longitude_of_center", Rt],
    ["x0", "false_easting", u],
    ["y0", "false_northing", u],
    ["long0", "central_meridian", Rt],
    ["lat0", "latitude_of_origin", Rt],
    ["lat0", "standard_parallel_1", Rt],
    ["lat1", "standard_parallel_1", Rt],
    ["lat2", "standard_parallel_2", Rt],
    ["azimuth", "Azimuth"],
    ["alpha", "azimuth", Rt],
    ["srsCode", "name"]
  ];
  _.forEach(f), gr(e);
}
function is(e) {
  if (typeof e == "object")
    return ts(e);
  const i = Hh(e);
  var s = Vh(e);
  if (i === "WKT2") {
    const h = jh(s);
    return ts(h);
  }
  var a = s[0], o = {};
  return Ai(s, o), pr(o), o[a];
}
function gt(e) {
  var i = this;
  if (arguments.length === 2) {
    var s = arguments[1];
    typeof s == "string" ? s.charAt(0) === "+" ? gt[
      /** @type {string} */
      e
    ] = Js(arguments[1]) : gt[
      /** @type {string} */
      e
    ] = is(arguments[1]) : s && typeof s == "object" && !("projName" in s) ? gt[
      /** @type {string} */
      e
    ] = is(arguments[1]) : (gt[
      /** @type {string} */
      e
    ] = s, s || delete gt[
      /** @type {string} */
      e
    ]);
  } else if (arguments.length === 1) {
    if (Array.isArray(e))
      return e.map(function(a) {
        return Array.isArray(a) ? gt.apply(i, a) : gt(a);
      });
    if (typeof e == "string") {
      if (e in gt)
        return gt[e];
    } else "EPSG" in e ? gt["EPSG:" + e.EPSG] = e : "ESRI" in e ? gt["ESRI:" + e.ESRI] = e : "IAU2000" in e ? gt["IAU2000:" + e.IAU2000] = e : console.log(e);
    return;
  }
}
Oh(gt);
function tl(e) {
  return typeof e == "string";
}
function il(e) {
  return e in gt;
}
function el(e) {
  return e.indexOf("+") !== 0 && e.indexOf("[") !== -1 || typeof e == "object" && !("srsCode" in e);
}
var Ha = ["3857", "900913", "3785", "102113"];
function sl(e) {
  if (e.title)
    return e.title.toLowerCase().indexOf("epsg:") === 0 && Ha.indexOf(e.title.substr(5)) > -1;
  var i = ai(e, "authority");
  if (i) {
    var s = ai(i, "epsg");
    return s && Ha.indexOf(s) > -1;
  }
}
function nl(e) {
  var i = ai(e, "extension");
  if (i)
    return ai(i, "proj4");
}
function al(e) {
  return e[0] === "+";
}
function rl(e) {
  if (tl(e)) {
    if (il(e))
      return gt[e];
    if (el(e)) {
      var i = is(e);
      if (sl(i))
        return gt["EPSG:3857"];
      var s = nl(i);
      return s ? Js(s) : i;
    }
    if (al(e))
      return Js(e);
  } else return "projName" in e ? e : is(e);
}
function Wa(e, i) {
  e = e || {};
  var s, a;
  if (!i)
    return e;
  for (a in i)
    s = i[a], s !== void 0 && (e[a] = s);
  return e;
}
function Ht(e, i, s) {
  var a = e * i;
  return s / Math.sqrt(1 - a * a);
}
function ye(e) {
  return e < 0 ? -1 : 1;
}
function N(e, i) {
  return i || Math.abs(e) <= lt ? e : e - ye(e) * me;
}
function Dt(e, i, s) {
  var a = e * s, o = 0.5 * e;
  return a = Math.pow((1 - a) / (1 + a), o), Math.tan(0.5 * (A - i)) / a;
}
function pe(e, i) {
  for (var s = 0.5 * e, a, o, h = A - 2 * Math.atan(i), l = 0; l <= 15; l++)
    if (a = e * Math.sin(h), o = A - 2 * Math.atan(i * Math.pow((1 - a) / (1 + a), s)) - h, h += o, Math.abs(o) <= 1e-10)
      return h;
  return -9999;
}
function ol() {
  var e = this.b / this.a;
  this.es = 1 - e * e, "x0" in this || (this.x0 = 0), "y0" in this || (this.y0 = 0), this.e = Math.sqrt(this.es), this.lat_ts ? this.sphere ? this.k0 = Math.cos(this.lat_ts) : this.k0 = Ht(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts)) : this.k0 || (this.k ? this.k0 = this.k : this.k0 = 1);
}
function hl(e) {
  var i = e.x, s = e.y;
  if (s * Et > 90 && s * Et < -90 && i * Et > 180 && i * Et < -180)
    return null;
  var a, o;
  if (Math.abs(Math.abs(s) - A) <= I)
    return null;
  if (this.sphere)
    a = this.x0 + this.a * this.k0 * N(i - this.long0, this.over), o = this.y0 + this.a * this.k0 * Math.log(Math.tan(J + 0.5 * s));
  else {
    var h = Math.sin(s), l = Dt(this.e, s, h);
    a = this.x0 + this.a * this.k0 * N(i - this.long0, this.over), o = this.y0 - this.a * this.k0 * Math.log(l);
  }
  return e.x = a, e.y = o, e;
}
function ll(e) {
  var i = e.x - this.x0, s = e.y - this.y0, a, o;
  if (this.sphere)
    o = A - 2 * Math.atan(Math.exp(-s / (this.a * this.k0)));
  else {
    var h = Math.exp(-s / (this.a * this.k0));
    if (o = pe(this.e, h), o === -9999)
      return null;
  }
  return a = N(this.long0 + i / (this.a * this.k0), this.over), e.x = a, e.y = o, e;
}
var ul = ["Mercator", "Popular Visualisation Pseudo Mercator", "Mercator_1SP", "Mercator_Auxiliary_Sphere", "Mercator_Variant_A", "merc"];
const cl = {
  init: ol,
  forward: hl,
  inverse: ll,
  names: ul
};
function fl() {
}
function Xa(e) {
  return e;
}
var vr = ["longlat", "identity"];
const dl = {
  init: fl,
  forward: Xa,
  inverse: Xa,
  names: vr
};
var _l = [cl, dl], di = {}, Li = [];
function yr(e, i) {
  var s = Li.length;
  return e.names ? (Li[s] = e, e.names.forEach(function(a) {
    di[a.toLowerCase()] = s;
  }), this) : (console.log(i), !0);
}
function Mr(e) {
  return e.replace(/[-\(\)\s]+/g, " ").trim().replace(/ /g, "_");
}
function ml(e) {
  if (!e)
    return !1;
  var i = e.toLowerCase();
  if (typeof di[i] < "u" && Li[di[i]] || (i = Mr(i), i in di && Li[di[i]]))
    return Li[di[i]];
}
function gl() {
  _l.forEach(yr);
}
const pl = {
  start: gl,
  add: yr,
  get: ml
};
var wr = {
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
const vl = wr.WGS84;
function yl(e, i, s, a) {
  var o = e * e, h = i * i, l = (o - h) / o, u = 0;
  a ? (e *= 1 - l * (Bh + l * (kh + l * Dh)), o = e * e, l = 0) : u = Math.sqrt(l);
  var f = (o - h) / h;
  return {
    es: l,
    e: u,
    ep2: f
  };
}
function Ml(e, i, s, a, o) {
  if (!e) {
    var h = ai(wr, a);
    h || (h = vl), e = h.a, i = h.b, s = h.rf;
  }
  return s && !i && (i = (1 - 1 / s) * e), (s === 0 || Math.abs(e - i) < I) && (o = !0, i = e), {
    a: e,
    b: i,
    rf: s,
    sphere: o
  };
}
var Ve = {
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
for (var wl in Ve) {
  var Ws = Ve[wl];
  Ws.datumName && (Ve[Ws.datumName] = Ws);
}
function xl(e, i, s, a, o, h, l) {
  var u = {};
  return e === void 0 || e === "none" ? u.datum_type = $s : u.datum_type = zh, i && (u.datum_params = i.map(parseFloat), (u.datum_params[0] !== 0 || u.datum_params[1] !== 0 || u.datum_params[2] !== 0) && (u.datum_type = _i), u.datum_params.length > 3 && (u.datum_params[3] !== 0 || u.datum_params[4] !== 0 || u.datum_params[5] !== 0 || u.datum_params[6] !== 0) && (u.datum_type = mi, u.datum_params[3] *= ue, u.datum_params[4] *= ue, u.datum_params[5] *= ue, u.datum_params[6] = u.datum_params[6] / 1e6 + 1)), l && (u.datum_type = Gi, u.grids = l), u.a = s, u.b = a, u.es = o, u.ep2 = h, u;
}
var on = {};
function Pl(e, i, s) {
  return i instanceof ArrayBuffer ? bl(e, i, s) : { ready: Sl(e, i) };
}
function bl(e, i, s) {
  var a = !0;
  s !== void 0 && s.includeErrorFields === !1 && (a = !1);
  var o = new DataView(i), h = Al(o), l = Ll(o, h), u = Cl(o, l, h, a), f = { header: l, subgrids: u };
  return on[e] = f, f;
}
async function Sl(e, i) {
  for (var s = [], a = await i.getImageCount(), o = a - 1; o >= 0; o--) {
    var h = await i.getImage(o), l = await h.readRasters(), u = l, f = [h.getWidth(), h.getHeight()], _ = h.getBoundingBox().map(Ya), v = [h.fileDirectory.ModelPixelScale[0], h.fileDirectory.ModelPixelScale[1]].map(Ya), m = _[0] + (f[0] - 1) * v[0], p = _[3] - (f[1] - 1) * v[1], M = u[0], w = u[1], x = [];
    for (let C = f[1] - 1; C >= 0; C--)
      for (let G = f[0] - 1; G >= 0; G--) {
        var S = C * f[0] + G;
        x.push([-si(w[S]), si(M[S])]);
      }
    s.push({
      del: v,
      lim: f,
      ll: [-m, p],
      cvs: x
    });
  }
  var E = {
    header: {
      nSubgrids: a
    },
    subgrids: s
  };
  return on[e] = E, E;
}
function El(e) {
  if (e === void 0)
    return null;
  var i = e.split(",");
  return i.map(Tl);
}
function Tl(e) {
  if (e.length === 0)
    return null;
  var i = e[0] === "@";
  return i && (e = e.slice(1)), e === "null" ? { name: "null", mandatory: !i, grid: null, isNull: !0 } : {
    name: e,
    mandatory: !i,
    grid: on[e] || null,
    isNull: !1
  };
}
function Ya(e) {
  return e * Math.PI / 180;
}
function si(e) {
  return e / 3600 * Math.PI / 180;
}
function Al(e) {
  var i = e.getInt32(8, !1);
  return i === 11 ? !1 : (i = e.getInt32(8, !0), i !== 11 && console.warn("Failed to detect nadgrid endian-ness, defaulting to little-endian"), !0);
}
function Ll(e, i) {
  return {
    nFields: e.getInt32(8, i),
    nSubgridFields: e.getInt32(24, i),
    nSubgrids: e.getInt32(40, i),
    shiftType: Qs(e, 56, 64).trim(),
    fromSemiMajorAxis: e.getFloat64(120, i),
    fromSemiMinorAxis: e.getFloat64(136, i),
    toSemiMajorAxis: e.getFloat64(152, i),
    toSemiMinorAxis: e.getFloat64(168, i)
  };
}
function Qs(e, i, s) {
  return String.fromCharCode.apply(null, new Uint8Array(e.buffer.slice(i, s)));
}
function Cl(e, i, s, a) {
  for (var o = 176, h = [], l = 0; l < i.nSubgrids; l++) {
    var u = Gl(e, o, s), f = Nl(e, o, u, s, a), _ = Math.round(
      1 + (u.upperLongitude - u.lowerLongitude) / u.longitudeInterval
    ), v = Math.round(
      1 + (u.upperLatitude - u.lowerLatitude) / u.latitudeInterval
    );
    h.push({
      ll: [si(u.lowerLongitude), si(u.lowerLatitude)],
      del: [si(u.longitudeInterval), si(u.latitudeInterval)],
      lim: [_, v],
      count: u.gridNodeCount,
      cvs: Il(f)
    });
    var m = 16;
    a === !1 && (m = 8), o += 176 + u.gridNodeCount * m;
  }
  return h;
}
function Il(e) {
  return e.map(function(i) {
    return [si(i.longitudeShift), si(i.latitudeShift)];
  });
}
function Gl(e, i, s) {
  return {
    name: Qs(e, i + 8, i + 16).trim(),
    parent: Qs(e, i + 24, i + 24 + 8).trim(),
    lowerLatitude: e.getFloat64(i + 72, s),
    upperLatitude: e.getFloat64(i + 88, s),
    lowerLongitude: e.getFloat64(i + 104, s),
    upperLongitude: e.getFloat64(i + 120, s),
    latitudeInterval: e.getFloat64(i + 136, s),
    longitudeInterval: e.getFloat64(i + 152, s),
    gridNodeCount: e.getInt32(i + 168, s)
  };
}
function Nl(e, i, s, a, o) {
  var h = i + 176, l = 16;
  o === !1 && (l = 8);
  for (var u = [], f = 0; f < s.gridNodeCount; f++) {
    var _ = {
      latitudeShift: e.getFloat32(h + f * l, a),
      longitudeShift: e.getFloat32(h + f * l + 4, a)
    };
    o !== !1 && (_.latitudeAccuracy = e.getFloat32(h + f * l + 8, a), _.longitudeAccuracy = e.getFloat32(h + f * l + 12, a)), u.push(_);
  }
  return u;
}
function Nt(e, i) {
  if (!(this instanceof Nt))
    return new Nt(e);
  this.forward = null, this.inverse = null, this.init = null, this.name, this.names = null, this.title, i = i || function(_) {
    if (_)
      throw _;
  };
  var s = rl(e);
  if (typeof s != "object") {
    i("Could not parse to valid json: " + e);
    return;
  }
  var a = Nt.projections.get(s.projName);
  if (!a) {
    i("Could not get projection name from: " + e);
    return;
  }
  if (s.datumCode && s.datumCode !== "none") {
    var o = ai(Ve, s.datumCode);
    o && (s.datum_params = s.datum_params || (o.towgs84 ? o.towgs84.split(",") : null), s.ellps = o.ellipse, s.datumName = o.datumName ? o.datumName : s.datumCode);
  }
  s.k0 = s.k0 || 1, s.axis = s.axis || "enu", s.ellps = s.ellps || "wgs84", s.lat1 = s.lat1 || s.lat0;
  var h = Ml(s.a, s.b, s.rf, s.ellps, s.sphere), l = yl(h.a, h.b, h.rf, s.R_A), u = El(s.nadgrids), f = s.datum || xl(
    s.datumCode,
    s.datum_params,
    h.a,
    h.b,
    l.es,
    l.ep2,
    u
  );
  Wa(this, s), Wa(this, a), this.a = h.a, this.b = h.b, this.rf = h.rf, this.sphere = h.sphere, this.es = l.es, this.e = l.e, this.ep2 = l.ep2, this.datum = f, "init" in this && typeof this.init == "function" && this.init(), i(null, this);
}
Nt.projections = pl;
Nt.projections.start();
function Ol(e, i) {
  return e.datum_type !== i.datum_type || e.a !== i.a || Math.abs(e.es - i.es) > 5e-11 ? !1 : e.datum_type === _i ? e.datum_params[0] === i.datum_params[0] && e.datum_params[1] === i.datum_params[1] && e.datum_params[2] === i.datum_params[2] : e.datum_type === mi ? e.datum_params[0] === i.datum_params[0] && e.datum_params[1] === i.datum_params[1] && e.datum_params[2] === i.datum_params[2] && e.datum_params[3] === i.datum_params[3] && e.datum_params[4] === i.datum_params[4] && e.datum_params[5] === i.datum_params[5] && e.datum_params[6] === i.datum_params[6] : !0;
}
function xr(e, i, s) {
  var a = e.x, o = e.y, h = e.z ? e.z : 0, l, u, f, _;
  if (o < -A && o > -1.001 * A)
    o = -A;
  else if (o > A && o < 1.001 * A)
    o = A;
  else {
    if (o < -A)
      return { x: -1 / 0, y: -1 / 0, z: e.z };
    if (o > A)
      return { x: 1 / 0, y: 1 / 0, z: e.z };
  }
  return a > Math.PI && (a -= 2 * Math.PI), u = Math.sin(o), _ = Math.cos(o), f = u * u, l = s / Math.sqrt(1 - i * f), {
    x: (l + h) * _ * Math.cos(a),
    y: (l + h) * _ * Math.sin(a),
    z: (l * (1 - i) + h) * u
  };
}
function Pr(e, i, s, a) {
  var o = 1e-12, h = o * o, l = 30, u, f, _, v, m, p, M, w, x, S, E, C, G, z = e.x, B = e.y, D = e.z ? e.z : 0, W, et, Z;
  if (u = Math.sqrt(z * z + B * B), f = Math.sqrt(z * z + B * B + D * D), u / s < o) {
    if (W = 0, f / s < o)
      return et = A, Z = -a, {
        x: e.x,
        y: e.y,
        z: e.z
      };
  } else
    W = Math.atan2(B, z);
  _ = D / f, v = u / f, m = 1 / Math.sqrt(1 - i * (2 - i) * v * v), w = v * (1 - i) * m, x = _ * m, G = 0;
  do
    G++, M = s / Math.sqrt(1 - i * x * x), Z = u * w + D * x - M * (1 - i * x * x), p = i * M / (M + Z), m = 1 / Math.sqrt(1 - p * (2 - p) * v * v), S = v * (1 - p) * m, E = _ * m, C = E * w - S * x, w = S, x = E;
  while (C * C > h && G < l);
  return et = Math.atan(E / Math.abs(S)), {
    x: W,
    y: et,
    z: Z
  };
}
function zl(e, i, s) {
  if (i === _i)
    return {
      x: e.x + s[0],
      y: e.y + s[1],
      z: e.z + s[2]
    };
  if (i === mi) {
    var a = s[0], o = s[1], h = s[2], l = s[3], u = s[4], f = s[5], _ = s[6];
    return {
      x: _ * (e.x - f * e.y + u * e.z) + a,
      y: _ * (f * e.x + e.y - l * e.z) + o,
      z: _ * (-u * e.x + l * e.y + e.z) + h
    };
  }
}
function Rl(e, i, s) {
  if (i === _i)
    return {
      x: e.x - s[0],
      y: e.y - s[1],
      z: e.z - s[2]
    };
  if (i === mi) {
    var a = s[0], o = s[1], h = s[2], l = s[3], u = s[4], f = s[5], _ = s[6], v = (e.x - a) / _, m = (e.y - o) / _, p = (e.z - h) / _;
    return {
      x: v + f * m - u * p,
      y: -f * v + m + l * p,
      z: u * v - l * m + p
    };
  }
}
function He(e) {
  return e === _i || e === mi;
}
function Bl(e, i, s) {
  if (Ol(e, i) || e.datum_type === $s || i.datum_type === $s)
    return s;
  var a = e.a, o = e.es;
  if (e.datum_type === Gi) {
    var h = Va(e, !1, s);
    if (h !== 0)
      return;
    a = Da, o = Za;
  }
  var l = i.a, u = i.b, f = i.es;
  if (i.datum_type === Gi && (l = Da, u = Rh, f = Za), o === f && a === l && !He(e.datum_type) && !He(i.datum_type))
    return s;
  if (s = xr(s, o, a), He(e.datum_type) && (s = zl(s, e.datum_type, e.datum_params)), He(i.datum_type) && (s = Rl(s, i.datum_type, i.datum_params)), s = Pr(s, f, l, u), i.datum_type === Gi) {
    var _ = Va(i, !0, s);
    if (_ !== 0)
      return;
  }
  return s;
}
function Va(e, i, s) {
  if (e.grids === null || e.grids.length === 0)
    return console.log("Grid shift grids not found"), -1;
  var a = { x: -s.x, y: s.y }, o = { x: Number.NaN, y: Number.NaN }, h = [];
  t:
    for (var l = 0; l < e.grids.length; l++) {
      var u = e.grids[l];
      if (h.push(u.name), u.isNull) {
        o = a;
        break;
      }
      if (u.grid === null) {
        if (u.mandatory)
          return console.log("Unable to find mandatory grid '" + u.name + "'"), -1;
        continue;
      }
      for (var f = u.grid.subgrids, _ = 0, v = f.length; _ < v; _++) {
        var m = f[_], p = (Math.abs(m.del[1]) + Math.abs(m.del[0])) / 1e4, M = m.ll[0] - p, w = m.ll[1] - p, x = m.ll[0] + (m.lim[0] - 1) * m.del[0] + p, S = m.ll[1] + (m.lim[1] - 1) * m.del[1] + p;
        if (!(w > a.y || M > a.x || S < a.y || x < a.x) && (o = kl(a, i, m), !isNaN(o.x)))
          break t;
      }
    }
  return isNaN(o.x) ? (console.log("Failed to find a grid shift table for location '" + -a.x * Et + " " + a.y * Et + " tried: '" + h + "'"), -1) : (s.x = -o.x, s.y = o.y, 0);
}
function kl(e, i, s) {
  var a = { x: Number.NaN, y: Number.NaN };
  if (isNaN(e.x))
    return a;
  var o = { x: e.x, y: e.y };
  o.x -= s.ll[0], o.y -= s.ll[1], o.x = N(o.x - Math.PI) + Math.PI;
  var h = Ka(o, s);
  if (i) {
    if (isNaN(h.x))
      return a;
    h.x = o.x - h.x, h.y = o.y - h.y;
    var l = 9, u = 1e-12, f, _;
    do {
      if (_ = Ka(h, s), isNaN(_.x)) {
        console.log("Inverse grid shift iteration failed, presumably at grid edge.  Using first approximation.");
        break;
      }
      f = { x: o.x - (_.x + h.x), y: o.y - (_.y + h.y) }, h.x += f.x, h.y += f.y;
    } while (l-- && Math.abs(f.x) > u && Math.abs(f.y) > u);
    if (l < 0)
      return console.log("Inverse grid shift iterator failed to converge."), a;
    a.x = N(h.x + s.ll[0]), a.y = h.y + s.ll[1];
  } else
    isNaN(h.x) || (a.x = e.x + h.x, a.y = e.y + h.y);
  return a;
}
function Ka(e, i) {
  var s = { x: e.x / i.del[0], y: e.y / i.del[1] }, a = { x: Math.floor(s.x), y: Math.floor(s.y) }, o = { x: s.x - 1 * a.x, y: s.y - 1 * a.y }, h = { x: Number.NaN, y: Number.NaN }, l;
  if (a.x < 0 || a.x >= i.lim[0] || a.y < 0 || a.y >= i.lim[1])
    return h;
  l = a.y * i.lim[0] + a.x;
  var u = { x: i.cvs[l][0], y: i.cvs[l][1] };
  l++;
  var f = { x: i.cvs[l][0], y: i.cvs[l][1] };
  l += i.lim[0];
  var _ = { x: i.cvs[l][0], y: i.cvs[l][1] };
  l--;
  var v = { x: i.cvs[l][0], y: i.cvs[l][1] }, m = o.x * o.y, p = o.x * (1 - o.y), M = (1 - o.x) * (1 - o.y), w = (1 - o.x) * o.y;
  return h.x = M * u.x + p * f.x + w * v.x + m * _.x, h.y = M * u.y + p * f.y + w * v.y + m * _.y, h;
}
function $a(e, i, s) {
  var a = s.x, o = s.y, h = s.z || 0, l, u, f, _ = {};
  for (f = 0; f < 3; f++)
    if (!(i && f === 2 && s.z === void 0))
      switch (f === 0 ? (l = a, "ew".indexOf(e.axis[f]) !== -1 ? u = "x" : u = "y") : f === 1 ? (l = o, "ns".indexOf(e.axis[f]) !== -1 ? u = "y" : u = "x") : (l = h, u = "z"), e.axis[f]) {
        case "e":
          _[u] = l;
          break;
        case "w":
          _[u] = -l;
          break;
        case "n":
          _[u] = l;
          break;
        case "s":
          _[u] = -l;
          break;
        case "u":
          s[u] !== void 0 && (_.z = l);
          break;
        case "d":
          s[u] !== void 0 && (_.z = -l);
          break;
        default:
          return null;
      }
  return _;
}
function br(e) {
  var i = {
    x: e[0],
    y: e[1]
  };
  return e.length > 2 && (i.z = e[2]), e.length > 3 && (i.m = e[3]), i;
}
function Dl(e) {
  Ja(e.x), Ja(e.y);
}
function Ja(e) {
  if (typeof Number.isFinite == "function") {
    if (Number.isFinite(e))
      return;
    throw new TypeError("coordinates must be finite numbers");
  }
  if (typeof e != "number" || e !== e || !isFinite(e))
    throw new TypeError("coordinates must be finite numbers");
}
function Zl(e, i) {
  return (e.datum.datum_type === _i || e.datum.datum_type === mi || e.datum.datum_type === Gi) && i.datumCode !== "WGS84" || (i.datum.datum_type === _i || i.datum.datum_type === mi || i.datum.datum_type === Gi) && e.datumCode !== "WGS84";
}
function es(e, i, s, a) {
  var o;
  Array.isArray(s) ? s = br(s) : s = {
    x: s.x,
    y: s.y,
    z: s.z,
    m: s.m
  };
  var h = s.z !== void 0;
  if (Dl(s), e.datum && i.datum && Zl(e, i) && (o = new Nt("WGS84"), s = es(e, o, s, a), e = o), a && e.axis !== "enu" && (s = $a(e, !1, s)), e.projName === "longlat")
    s = {
      x: s.x * ot,
      y: s.y * ot,
      z: s.z || 0
    };
  else if (e.to_meter && (s = {
    x: s.x * e.to_meter,
    y: s.y * e.to_meter,
    z: s.z || 0
  }), s = e.inverse(s), !s)
    return;
  if (e.from_greenwich && (s.x += e.from_greenwich), s = Bl(e.datum, i.datum, s), !!s)
    return s = /** @type {import('./core').InterfaceCoordinates} */
    s, i.from_greenwich && (s = {
      x: s.x - i.from_greenwich,
      y: s.y,
      z: s.z || 0
    }), i.projName === "longlat" ? s = {
      x: s.x * Et,
      y: s.y * Et,
      z: s.z || 0
    } : (s = i.forward(s), i.to_meter && (s = {
      x: s.x / i.to_meter,
      y: s.y / i.to_meter,
      z: s.z || 0
    })), a && i.axis !== "enu" ? $a(i, !0, s) : (s && !h && delete s.z, s);
}
var Qa = Nt("WGS84");
function Xs(e, i, s, a) {
  var o, h, l;
  return Array.isArray(s) ? (o = es(e, i, s, a) || { x: NaN, y: NaN }, s.length > 2 ? typeof e.name < "u" && e.name === "geocent" || typeof i.name < "u" && i.name === "geocent" ? typeof o.z == "number" ? (
    /** @type {T} */
    [o.x, o.y, o.z].concat(s.slice(3))
  ) : (
    /** @type {T} */
    [o.x, o.y, s[2]].concat(s.slice(3))
  ) : (
    /** @type {T} */
    [o.x, o.y].concat(s.slice(2))
  ) : (
    /** @type {T} */
    [o.x, o.y]
  )) : (h = es(e, i, s, a), l = Object.keys(s), l.length === 2 || l.forEach(function(u) {
    if (typeof e.name < "u" && e.name === "geocent" || typeof i.name < "u" && i.name === "geocent") {
      if (u === "x" || u === "y" || u === "z")
        return;
    } else if (u === "x" || u === "y")
      return;
    h[u] = s[u];
  }), /** @type {T} */
  h);
}
function We(e) {
  return e instanceof Nt ? e : typeof e == "object" && "oProj" in e ? e.oProj : Nt(
    /** @type {string | PROJJSONDefinition} */
    e
  );
}
function Fl(e, i, s) {
  var a, o, h = !1, l;
  return typeof i > "u" ? (o = We(e), a = Qa, h = !0) : (typeof /** @type {?} */
  i.x < "u" || Array.isArray(i)) && (s = /** @type {T} */
  /** @type {?} */
  i, o = We(e), a = Qa, h = !0), a || (a = We(e)), o || (o = We(
    /** @type {string | PROJJSONDefinition | proj } */
    i
  )), s ? Xs(a, o, s) : (l = {
    /**
     * @template {TemplateCoordinates} T
     * @param {T} coords
     * @param {boolean=} enforceAxis
     * @returns {T}
     */
    forward: function(u, f) {
      return Xs(a, o, u, f);
    },
    /**
     * @template {TemplateCoordinates} T
     * @param {T} coords
     * @param {boolean=} enforceAxis
     * @returns {T}
     */
    inverse: function(u, f) {
      return Xs(o, a, u, f);
    }
  }, h && (l.oProj = o), l);
}
var tr = 6, Sr = "AJSAJS", Er = "AFAFAF", Ci = 65, bt = 73, Gt = 79, re = 86, oe = 90;
const Ul = {
  forward: Tr,
  inverse: ql,
  toPoint: Ar
};
function Tr(e, i) {
  return i = i || 5, Wl(jl({
    lat: e[1],
    lon: e[0]
  }), i);
}
function ql(e) {
  var i = hn(Cr(e.toUpperCase()));
  return i.lat && i.lon ? [i.lon, i.lat, i.lon, i.lat] : [i.left, i.bottom, i.right, i.top];
}
function Ar(e) {
  var i = hn(Cr(e.toUpperCase()));
  return i.lat && i.lon ? [i.lon, i.lat] : [(i.left + i.right) / 2, (i.top + i.bottom) / 2];
}
function Ys(e) {
  return e * (Math.PI / 180);
}
function ir(e) {
  return 180 * (e / Math.PI);
}
function jl(e) {
  var i = e.lat, s = e.lon, a = 6378137, o = 669438e-8, h = 0.9996, l, u, f, _, v, m, p, M = Ys(i), w = Ys(s), x, S;
  S = Math.floor((s + 180) / 6) + 1, s === 180 && (S = 60), i >= 56 && i < 64 && s >= 3 && s < 12 && (S = 32), i >= 72 && i < 84 && (s >= 0 && s < 9 ? S = 31 : s >= 9 && s < 21 ? S = 33 : s >= 21 && s < 33 ? S = 35 : s >= 33 && s < 42 && (S = 37)), l = (S - 1) * 6 - 180 + 3, x = Ys(l), u = o / (1 - o), f = a / Math.sqrt(1 - o * Math.sin(M) * Math.sin(M)), _ = Math.tan(M) * Math.tan(M), v = u * Math.cos(M) * Math.cos(M), m = Math.cos(M) * (w - x), p = a * ((1 - o / 4 - 3 * o * o / 64 - 5 * o * o * o / 256) * M - (3 * o / 8 + 3 * o * o / 32 + 45 * o * o * o / 1024) * Math.sin(2 * M) + (15 * o * o / 256 + 45 * o * o * o / 1024) * Math.sin(4 * M) - 35 * o * o * o / 3072 * Math.sin(6 * M));
  var E = h * f * (m + (1 - _ + v) * m * m * m / 6 + (5 - 18 * _ + _ * _ + 72 * v - 58 * u) * m * m * m * m * m / 120) + 5e5, C = h * (p + f * Math.tan(M) * (m * m / 2 + (5 - _ + 9 * v + 4 * v * v) * m * m * m * m / 24 + (61 - 58 * _ + _ * _ + 600 * v - 330 * u) * m * m * m * m * m * m / 720));
  return i < 0 && (C += 1e7), {
    northing: Math.round(C),
    easting: Math.round(E),
    zoneNumber: S,
    zoneLetter: Hl(i)
  };
}
function hn(e) {
  var i = e.northing, s = e.easting, a = e.zoneLetter, o = e.zoneNumber;
  if (o < 0 || o > 60)
    return null;
  var h = 0.9996, l = 6378137, u = 669438e-8, f, _ = (1 - Math.sqrt(1 - u)) / (1 + Math.sqrt(1 - u)), v, m, p, M, w, x, S, E, C, G = s - 5e5, z = i;
  a < "N" && (z -= 1e7), S = (o - 1) * 6 - 180 + 3, f = u / (1 - u), x = z / h, E = x / (l * (1 - u / 4 - 3 * u * u / 64 - 5 * u * u * u / 256)), C = E + (3 * _ / 2 - 27 * _ * _ * _ / 32) * Math.sin(2 * E) + (21 * _ * _ / 16 - 55 * _ * _ * _ * _ / 32) * Math.sin(4 * E) + 151 * _ * _ * _ / 96 * Math.sin(6 * E), v = l / Math.sqrt(1 - u * Math.sin(C) * Math.sin(C)), m = Math.tan(C) * Math.tan(C), p = f * Math.cos(C) * Math.cos(C), M = l * (1 - u) / Math.pow(1 - u * Math.sin(C) * Math.sin(C), 1.5), w = G / (v * h);
  var B = C - v * Math.tan(C) / M * (w * w / 2 - (5 + 3 * m + 10 * p - 4 * p * p - 9 * f) * w * w * w * w / 24 + (61 + 90 * m + 298 * p + 45 * m * m - 252 * f - 3 * p * p) * w * w * w * w * w * w / 720);
  B = ir(B);
  var D = (w - (1 + 2 * m + p) * w * w * w / 6 + (5 - 2 * p + 28 * m - 3 * p * p + 8 * f + 24 * m * m) * w * w * w * w * w / 120) / Math.cos(C);
  D = S + ir(D);
  var W;
  if (e.accuracy) {
    var et = hn({
      northing: e.northing + e.accuracy,
      easting: e.easting + e.accuracy,
      zoneLetter: e.zoneLetter,
      zoneNumber: e.zoneNumber
    });
    W = {
      top: et.lat,
      right: et.lon,
      bottom: B,
      left: D
    };
  } else
    W = {
      lat: B,
      lon: D
    };
  return W;
}
function Hl(e) {
  var i = "Z";
  return 84 >= e && e >= 72 ? i = "X" : 72 > e && e >= 64 ? i = "W" : 64 > e && e >= 56 ? i = "V" : 56 > e && e >= 48 ? i = "U" : 48 > e && e >= 40 ? i = "T" : 40 > e && e >= 32 ? i = "S" : 32 > e && e >= 24 ? i = "R" : 24 > e && e >= 16 ? i = "Q" : 16 > e && e >= 8 ? i = "P" : 8 > e && e >= 0 ? i = "N" : 0 > e && e >= -8 ? i = "M" : -8 > e && e >= -16 ? i = "L" : -16 > e && e >= -24 ? i = "K" : -24 > e && e >= -32 ? i = "J" : -32 > e && e >= -40 ? i = "H" : -40 > e && e >= -48 ? i = "G" : -48 > e && e >= -56 ? i = "F" : -56 > e && e >= -64 ? i = "E" : -64 > e && e >= -72 ? i = "D" : -72 > e && e >= -80 && (i = "C"), i;
}
function Wl(e, i) {
  var s = "00000" + e.easting, a = "00000" + e.northing;
  return e.zoneNumber + e.zoneLetter + Xl(e.easting, e.northing, e.zoneNumber) + s.substr(s.length - 5, i) + a.substr(a.length - 5, i);
}
function Xl(e, i, s) {
  var a = Lr(s), o = Math.floor(e / 1e5), h = Math.floor(i / 1e5) % 20;
  return Yl(o, h, a);
}
function Lr(e) {
  var i = e % tr;
  return i === 0 && (i = tr), i;
}
function Yl(e, i, s) {
  var a = s - 1, o = Sr.charCodeAt(a), h = Er.charCodeAt(a), l = o + e - 1, u = h + i, f = !1;
  l > oe && (l = l - oe + Ci - 1, f = !0), (l === bt || o < bt && l > bt || (l > bt || o < bt) && f) && l++, (l === Gt || o < Gt && l > Gt || (l > Gt || o < Gt) && f) && (l++, l === bt && l++), l > oe && (l = l - oe + Ci - 1), u > re ? (u = u - re + Ci - 1, f = !0) : f = !1, (u === bt || h < bt && u > bt || (u > bt || h < bt) && f) && u++, (u === Gt || h < Gt && u > Gt || (u > Gt || h < Gt) && f) && (u++, u === bt && u++), u > re && (u = u - re + Ci - 1);
  var _ = String.fromCharCode(l) + String.fromCharCode(u);
  return _;
}
function Cr(e) {
  if (e && e.length === 0)
    throw "MGRSPoint coverting from nothing";
  for (var i = e.length, s = null, a = "", o, h = 0; !/[A-Z]/.test(o = e.charAt(h)); ) {
    if (h >= 2)
      throw "MGRSPoint bad conversion from: " + e;
    a += o, h++;
  }
  var l = parseInt(a, 10);
  if (h === 0 || h + 3 > i)
    throw "MGRSPoint bad conversion from: " + e;
  var u = e.charAt(h++);
  if (u <= "A" || u === "B" || u === "Y" || u >= "Z" || u === "I" || u === "O")
    throw "MGRSPoint zone letter " + u + " not handled: " + e;
  s = e.substring(h, h += 2);
  for (var f = Lr(l), _ = Vl(s.charAt(0), f), v = Kl(s.charAt(1), f); v < $l(u); )
    v += 2e6;
  var m = i - h;
  if (m % 2 !== 0)
    throw `MGRSPoint has to have an even number 
of digits after the zone letter and two 100km letters - front 
half for easting meters, second half for 
northing meters` + e;
  var p = m / 2, M = 0, w = 0, x, S, E, C, G;
  return p > 0 && (x = 1e5 / Math.pow(10, p), S = e.substring(h, h + p), M = parseFloat(S) * x, E = e.substring(h + p), w = parseFloat(E) * x), C = M + _, G = w + v, {
    easting: C,
    northing: G,
    zoneLetter: u,
    zoneNumber: l,
    accuracy: x
  };
}
function Vl(e, i) {
  for (var s = Sr.charCodeAt(i - 1), a = 1e5, o = !1; s !== e.charCodeAt(0); ) {
    if (s++, s === bt && s++, s === Gt && s++, s > oe) {
      if (o)
        throw "Bad character: " + e;
      s = Ci, o = !0;
    }
    a += 1e5;
  }
  return a;
}
function Kl(e, i) {
  if (e > "V")
    throw "MGRSPoint given invalid Northing " + e;
  for (var s = Er.charCodeAt(i - 1), a = 0, o = !1; s !== e.charCodeAt(0); ) {
    if (s++, s === bt && s++, s === Gt && s++, s > re) {
      if (o)
        throw "Bad character: " + e;
      s = Ci, o = !0;
    }
    a += 1e5;
  }
  return a;
}
function $l(e) {
  var i;
  switch (e) {
    case "C":
      i = 11e5;
      break;
    case "D":
      i = 2e6;
      break;
    case "E":
      i = 28e5;
      break;
    case "F":
      i = 37e5;
      break;
    case "G":
      i = 46e5;
      break;
    case "H":
      i = 55e5;
      break;
    case "J":
      i = 64e5;
      break;
    case "K":
      i = 73e5;
      break;
    case "L":
      i = 82e5;
      break;
    case "M":
      i = 91e5;
      break;
    case "N":
      i = 0;
      break;
    case "P":
      i = 8e5;
      break;
    case "Q":
      i = 17e5;
      break;
    case "R":
      i = 26e5;
      break;
    case "S":
      i = 35e5;
      break;
    case "T":
      i = 44e5;
      break;
    case "U":
      i = 53e5;
      break;
    case "V":
      i = 62e5;
      break;
    case "W":
      i = 7e6;
      break;
    case "X":
      i = 79e5;
      break;
    default:
      i = -1;
  }
  if (i >= 0)
    return i;
  throw "Invalid zone letter: " + e;
}
function zi(e, i, s) {
  if (!(this instanceof zi))
    return new zi(e, i, s);
  if (Array.isArray(e))
    this.x = e[0], this.y = e[1], this.z = e[2] || 0;
  else if (typeof e == "object")
    this.x = e.x, this.y = e.y, this.z = e.z || 0;
  else if (typeof e == "string" && typeof i > "u") {
    var a = e.split(",");
    this.x = parseFloat(a[0]), this.y = parseFloat(a[1]), this.z = parseFloat(a[2]) || 0;
  } else
    this.x = e, this.y = i, this.z = s || 0;
  console.warn("proj4.Point will be removed in version 3, use proj4.toPoint");
}
zi.fromMGRS = function(e) {
  return new zi(Ar(e));
};
zi.prototype.toMGRS = function(e) {
  return Tr([this.x, this.y], e);
};
var Jl = 1, Ql = 0.25, er = 0.046875, sr = 0.01953125, nr = 0.01068115234375, tu = 0.75, iu = 0.46875, eu = 0.013020833333333334, su = 0.007120768229166667, nu = 0.3645833333333333, au = 0.005696614583333333, ru = 0.3076171875;
function ln(e) {
  var i = [];
  i[0] = Jl - e * (Ql + e * (er + e * (sr + e * nr))), i[1] = e * (tu - e * (er + e * (sr + e * nr)));
  var s = e * e;
  return i[2] = s * (iu - e * (eu + e * su)), s *= e, i[3] = s * (nu - e * au), i[4] = s * e * ru, i;
}
function Ri(e, i, s, a) {
  return s *= i, i *= i, a[0] * e - s * (a[1] + i * (a[2] + i * (a[3] + i * a[4])));
}
var ou = 20;
function un(e, i, s) {
  for (var a = 1 / (1 - i), o = e, h = ou; h; --h) {
    var l = Math.sin(o), u = 1 - i * l * l;
    if (u = (Ri(o, l, Math.cos(o), s) - e) * (u * Math.sqrt(u)) * a, o -= u, Math.abs(u) < I)
      return o;
  }
  return o;
}
function hu() {
  this.x0 = this.x0 !== void 0 ? this.x0 : 0, this.y0 = this.y0 !== void 0 ? this.y0 : 0, this.long0 = this.long0 !== void 0 ? this.long0 : 0, this.lat0 = this.lat0 !== void 0 ? this.lat0 : 0, this.es && (this.en = ln(this.es), this.ml0 = Ri(this.lat0, Math.sin(this.lat0), Math.cos(this.lat0), this.en));
}
function lu(e) {
  var i = e.x, s = e.y, a = N(i - this.long0, this.over), o, h, l, u = Math.sin(s), f = Math.cos(s);
  if (this.es) {
    var v = f * a, m = Math.pow(v, 2), p = this.ep2 * Math.pow(f, 2), M = Math.pow(p, 2), w = Math.abs(f) > I ? Math.tan(s) : 0, x = Math.pow(w, 2), S = Math.pow(x, 2);
    o = 1 - this.es * Math.pow(u, 2), v = v / Math.sqrt(o);
    var E = Ri(s, u, f, this.en);
    h = this.a * (this.k0 * v * (1 + m / 6 * (1 - x + p + m / 20 * (5 - 18 * x + S + 14 * p - 58 * x * p + m / 42 * (61 + 179 * S - S * x - 479 * x))))) + this.x0, l = this.a * (this.k0 * (E - this.ml0 + u * a * v / 2 * (1 + m / 12 * (5 - x + 9 * p + 4 * M + m / 30 * (61 + S - 58 * x + 270 * p - 330 * x * p + m / 56 * (1385 + 543 * S - S * x - 3111 * x)))))) + this.y0;
  } else {
    var _ = f * Math.sin(a);
    if (Math.abs(Math.abs(_) - 1) < I)
      return 93;
    if (h = 0.5 * this.a * this.k0 * Math.log((1 + _) / (1 - _)) + this.x0, l = f * Math.cos(a) / Math.sqrt(1 - Math.pow(_, 2)), _ = Math.abs(l), _ >= 1) {
      if (_ - 1 > I)
        return 93;
      l = 0;
    } else
      l = Math.acos(l);
    s < 0 && (l = -l), l = this.a * this.k0 * (l - this.lat0) + this.y0;
  }
  return e.x = h, e.y = l, e;
}
function uu(e) {
  var i, s, a, o, h = (e.x - this.x0) * (1 / this.a), l = (e.y - this.y0) * (1 / this.a);
  if (this.es)
    if (i = this.ml0 + l / this.k0, s = un(i, this.es, this.en), Math.abs(s) < A) {
      var m = Math.sin(s), p = Math.cos(s), M = Math.abs(p) > I ? Math.tan(s) : 0, w = this.ep2 * Math.pow(p, 2), x = Math.pow(w, 2), S = Math.pow(M, 2), E = Math.pow(S, 2);
      i = 1 - this.es * Math.pow(m, 2);
      var C = h * Math.sqrt(i) / this.k0, G = Math.pow(C, 2);
      i = i * M, a = s - i * G / (1 - this.es) * 0.5 * (1 - G / 12 * (5 + 3 * S - 9 * w * S + w - 4 * x - G / 30 * (61 + 90 * S - 252 * w * S + 45 * E + 46 * w - G / 56 * (1385 + 3633 * S + 4095 * E + 1574 * E * S)))), o = N(this.long0 + C * (1 - G / 6 * (1 + 2 * S + w - G / 20 * (5 + 28 * S + 24 * E + 8 * w * S + 6 * w - G / 42 * (61 + 662 * S + 1320 * E + 720 * E * S)))) / p, this.over);
    } else
      a = A * ye(l), o = 0;
  else {
    var u = Math.exp(h / this.k0), f = 0.5 * (u - 1 / u), _ = this.lat0 + l / this.k0, v = Math.cos(_);
    i = Math.sqrt((1 - Math.pow(v, 2)) / (1 + Math.pow(f, 2))), a = Math.asin(i), l < 0 && (a = -a), f === 0 && v === 0 ? o = 0 : o = N(Math.atan2(f, v) + this.long0, this.over);
  }
  return e.x = o, e.y = a, e;
}
var cu = ["Fast_Transverse_Mercator", "Fast Transverse Mercator"];
const Ke = {
  init: hu,
  forward: lu,
  inverse: uu,
  names: cu
};
function Ir(e) {
  var i = Math.exp(e);
  return i = (i - 1 / i) / 2, i;
}
function St(e, i) {
  e = Math.abs(e), i = Math.abs(i);
  var s = Math.max(e, i), a = Math.min(e, i) / (s || 1);
  return s * Math.sqrt(1 + Math.pow(a, 2));
}
function fu(e) {
  var i = 1 + e, s = i - 1;
  return s === 0 ? e : e * Math.log(i) / s;
}
function du(e) {
  var i = Math.abs(e);
  return i = fu(i * (1 + i / (St(1, i) + 1))), e < 0 ? -i : i;
}
function cn(e, i) {
  for (var s = 2 * Math.cos(2 * i), a = e.length - 1, o = e[a], h = 0, l; --a >= 0; )
    l = -h + s * o + e[a], h = o, o = l;
  return i + l * Math.sin(2 * i);
}
function _u(e, i) {
  for (var s = 2 * Math.cos(i), a = e.length - 1, o = e[a], h = 0, l; --a >= 0; )
    l = -h + s * o + e[a], h = o, o = l;
  return Math.sin(i) * l;
}
function mu(e) {
  var i = Math.exp(e);
  return i = (i + 1 / i) / 2, i;
}
function Gr(e, i, s) {
  for (var a = Math.sin(i), o = Math.cos(i), h = Ir(s), l = mu(s), u = 2 * o * l, f = -2 * a * h, _ = e.length - 1, v = e[_], m = 0, p = 0, M = 0, w, x; --_ >= 0; )
    w = p, x = m, p = v, m = M, v = -w + u * p - f * m + e[_], M = -x + f * p + u * m;
  return u = a * l, f = o * h, [u * v - f * M, u * M + f * v];
}
function gu() {
  if (!this.approx && (isNaN(this.es) || this.es <= 0))
    throw new Error('Incorrect elliptical usage. Try using the +approx option in the proj string, or PROJECTION["Fast_Transverse_Mercator"] in the WKT.');
  this.approx && (Ke.init.apply(this), this.forward = Ke.forward, this.inverse = Ke.inverse), this.x0 = this.x0 !== void 0 ? this.x0 : 0, this.y0 = this.y0 !== void 0 ? this.y0 : 0, this.long0 = this.long0 !== void 0 ? this.long0 : 0, this.lat0 = this.lat0 !== void 0 ? this.lat0 : 0, this.cgb = [], this.cbg = [], this.utg = [], this.gtu = [];
  var e = this.es / (1 + Math.sqrt(1 - this.es)), i = e / (2 - e), s = i;
  this.cgb[0] = i * (2 + i * (-2 / 3 + i * (-2 + i * (116 / 45 + i * (26 / 45 + i * (-2854 / 675)))))), this.cbg[0] = i * (-2 + i * (2 / 3 + i * (4 / 3 + i * (-82 / 45 + i * (32 / 45 + i * (4642 / 4725)))))), s = s * i, this.cgb[1] = s * (7 / 3 + i * (-8 / 5 + i * (-227 / 45 + i * (2704 / 315 + i * (2323 / 945))))), this.cbg[1] = s * (5 / 3 + i * (-16 / 15 + i * (-13 / 9 + i * (904 / 315 + i * (-1522 / 945))))), s = s * i, this.cgb[2] = s * (56 / 15 + i * (-136 / 35 + i * (-1262 / 105 + i * (73814 / 2835)))), this.cbg[2] = s * (-26 / 15 + i * (34 / 21 + i * (8 / 5 + i * (-12686 / 2835)))), s = s * i, this.cgb[3] = s * (4279 / 630 + i * (-332 / 35 + i * (-399572 / 14175))), this.cbg[3] = s * (1237 / 630 + i * (-12 / 5 + i * (-24832 / 14175))), s = s * i, this.cgb[4] = s * (4174 / 315 + i * (-144838 / 6237)), this.cbg[4] = s * (-734 / 315 + i * (109598 / 31185)), s = s * i, this.cgb[5] = s * (601676 / 22275), this.cbg[5] = s * (444337 / 155925), s = Math.pow(i, 2), this.Qn = this.k0 / (1 + i) * (1 + s * (1 / 4 + s * (1 / 64 + s / 256))), this.utg[0] = i * (-0.5 + i * (2 / 3 + i * (-37 / 96 + i * (1 / 360 + i * (81 / 512 + i * (-96199 / 604800)))))), this.gtu[0] = i * (0.5 + i * (-2 / 3 + i * (5 / 16 + i * (41 / 180 + i * (-127 / 288 + i * (7891 / 37800)))))), this.utg[1] = s * (-1 / 48 + i * (-1 / 15 + i * (437 / 1440 + i * (-46 / 105 + i * (1118711 / 3870720))))), this.gtu[1] = s * (13 / 48 + i * (-3 / 5 + i * (557 / 1440 + i * (281 / 630 + i * (-1983433 / 1935360))))), s = s * i, this.utg[2] = s * (-17 / 480 + i * (37 / 840 + i * (209 / 4480 + i * (-5569 / 90720)))), this.gtu[2] = s * (61 / 240 + i * (-103 / 140 + i * (15061 / 26880 + i * (167603 / 181440)))), s = s * i, this.utg[3] = s * (-4397 / 161280 + i * (11 / 504 + i * (830251 / 7257600))), this.gtu[3] = s * (49561 / 161280 + i * (-179 / 168 + i * (6601661 / 7257600))), s = s * i, this.utg[4] = s * (-4583 / 161280 + i * (108847 / 3991680)), this.gtu[4] = s * (34729 / 80640 + i * (-3418889 / 1995840)), s = s * i, this.utg[5] = s * (-20648693 / 638668800), this.gtu[5] = s * (212378941 / 319334400);
  var a = cn(this.cbg, this.lat0);
  this.Zb = -this.Qn * (a + _u(this.gtu, 2 * a));
}
function pu(e) {
  var i = N(e.x - this.long0, this.over), s = e.y;
  s = cn(this.cbg, s);
  var a = Math.sin(s), o = Math.cos(s), h = Math.sin(i), l = Math.cos(i);
  s = Math.atan2(a, l * o), i = Math.atan2(h * o, St(a, o * l)), i = du(Math.tan(i));
  var u = Gr(this.gtu, 2 * s, 2 * i);
  s = s + u[0], i = i + u[1];
  var f, _;
  return Math.abs(i) <= 2.623395162778 ? (f = this.a * (this.Qn * i) + this.x0, _ = this.a * (this.Qn * s + this.Zb) + this.y0) : (f = 1 / 0, _ = 1 / 0), e.x = f, e.y = _, e;
}
function vu(e) {
  var i = (e.x - this.x0) * (1 / this.a), s = (e.y - this.y0) * (1 / this.a);
  s = (s - this.Zb) / this.Qn, i = i / this.Qn;
  var a, o;
  if (Math.abs(i) <= 2.623395162778) {
    var h = Gr(this.utg, 2 * s, 2 * i);
    s = s + h[0], i = i + h[1], i = Math.atan(Ir(i));
    var l = Math.sin(s), u = Math.cos(s), f = Math.sin(i), _ = Math.cos(i);
    s = Math.atan2(l * _, St(f, _ * u)), i = Math.atan2(f, _ * u), a = N(i + this.long0, this.over), o = cn(this.cgb, s);
  } else
    a = 1 / 0, o = 1 / 0;
  return e.x = a, e.y = o, e;
}
var yu = ["Extended_Transverse_Mercator", "Extended Transverse Mercator", "etmerc", "Transverse_Mercator", "Transverse Mercator", "Gauss Kruger", "Gauss_Kruger", "tmerc"];
const $e = {
  init: gu,
  forward: pu,
  inverse: vu,
  names: yu
};
function Mu(e, i) {
  if (e === void 0) {
    if (e = Math.floor((N(i) + Math.PI) * 30 / Math.PI) + 1, e < 0)
      return 0;
    if (e > 60)
      return 60;
  }
  return e;
}
var wu = "etmerc";
function xu() {
  var e = Mu(this.zone, this.long0);
  if (e === void 0)
    throw new Error("unknown utm zone");
  this.lat0 = 0, this.long0 = (6 * Math.abs(e) - 183) * ot, this.x0 = 5e5, this.y0 = this.utmSouth ? 1e7 : 0, this.k0 = 0.9996, $e.init.apply(this), this.forward = $e.forward, this.inverse = $e.inverse;
}
var Pu = ["Universal Transverse Mercator System", "utm"];
const bu = {
  init: xu,
  names: Pu,
  dependsOn: wu
};
function fn(e, i) {
  return Math.pow((1 - e) / (1 + e), i);
}
var Su = 20;
function Eu() {
  var e = Math.sin(this.lat0), i = Math.cos(this.lat0);
  i *= i, this.rc = Math.sqrt(1 - this.es) / (1 - this.es * e * e), this.C = Math.sqrt(1 + this.es * i * i / (1 - this.es)), this.phic0 = Math.asin(e / this.C), this.ratexp = 0.5 * this.C * this.e, this.K = Math.tan(0.5 * this.phic0 + J) / (Math.pow(Math.tan(0.5 * this.lat0 + J), this.C) * fn(this.e * e, this.ratexp));
}
function Tu(e) {
  var i = e.x, s = e.y;
  return e.y = 2 * Math.atan(this.K * Math.pow(Math.tan(0.5 * s + J), this.C) * fn(this.e * Math.sin(s), this.ratexp)) - A, e.x = this.C * i, e;
}
function Au(e) {
  for (var i = 1e-14, s = e.x / this.C, a = e.y, o = Math.pow(Math.tan(0.5 * a + J) / this.K, 1 / this.C), h = Su; h > 0 && (a = 2 * Math.atan(o * fn(this.e * Math.sin(e.y), -0.5 * this.e)) - A, !(Math.abs(a - e.y) < i)); --h)
    e.y = a;
  return h ? (e.x = s, e.y = a, e) : null;
}
const dn = {
  init: Eu,
  forward: Tu,
  inverse: Au
};
function Lu() {
  dn.init.apply(this), this.rc && (this.sinc0 = Math.sin(this.phic0), this.cosc0 = Math.cos(this.phic0), this.R2 = 2 * this.rc, this.title || (this.title = "Oblique Stereographic Alternative"));
}
function Cu(e) {
  var i, s, a, o;
  return e.x = N(e.x - this.long0, this.over), dn.forward.apply(this, [e]), i = Math.sin(e.y), s = Math.cos(e.y), a = Math.cos(e.x), o = this.k0 * this.R2 / (1 + this.sinc0 * i + this.cosc0 * s * a), e.x = o * s * Math.sin(e.x), e.y = o * (this.cosc0 * i - this.sinc0 * s * a), e.x = this.a * e.x + this.x0, e.y = this.a * e.y + this.y0, e;
}
function Iu(e) {
  var i, s, a, o, h;
  if (e.x = (e.x - this.x0) / this.a, e.y = (e.y - this.y0) / this.a, e.x /= this.k0, e.y /= this.k0, h = St(e.x, e.y)) {
    var l = 2 * Math.atan2(h, this.R2);
    i = Math.sin(l), s = Math.cos(l), o = Math.asin(s * this.sinc0 + e.y * i * this.cosc0 / h), a = Math.atan2(e.x * i, h * this.cosc0 * s - e.y * this.sinc0 * i);
  } else
    o = this.phic0, a = 0;
  return e.x = a, e.y = o, dn.inverse.apply(this, [e]), e.x = N(e.x + this.long0, this.over), e;
}
var Gu = ["Stereographic_North_Pole", "Oblique_Stereographic", "sterea", "Oblique Stereographic Alternative", "Double_Stereographic"];
const Nu = {
  init: Lu,
  forward: Cu,
  inverse: Iu,
  names: Gu
};
function _n(e, i, s) {
  return i *= s, Math.tan(0.5 * (A + e)) * Math.pow((1 - i) / (1 + i), 0.5 * s);
}
function Ou() {
  this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, this.lat0 = this.lat0 || 0, this.long0 = this.long0 || 0, this.coslat0 = Math.cos(this.lat0), this.sinlat0 = Math.sin(this.lat0), this.sphere ? this.k0 === 1 && !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= I && (this.k0 = 0.5 * (1 + ye(this.lat0) * Math.sin(this.lat_ts))) : (Math.abs(this.coslat0) <= I && (this.lat0 > 0 ? this.con = 1 : this.con = -1), this.cons = Math.sqrt(Math.pow(1 + this.e, 1 + this.e) * Math.pow(1 - this.e, 1 - this.e)), this.k0 === 1 && !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= I && Math.abs(Math.cos(this.lat_ts)) > I && (this.k0 = 0.5 * this.cons * Ht(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts)) / Dt(this.e, this.con * this.lat_ts, this.con * Math.sin(this.lat_ts))), this.ms1 = Ht(this.e, this.sinlat0, this.coslat0), this.X0 = 2 * Math.atan(_n(this.lat0, this.sinlat0, this.e)) - A, this.cosX0 = Math.cos(this.X0), this.sinX0 = Math.sin(this.X0));
}
function zu(e) {
  var i = e.x, s = e.y, a = Math.sin(s), o = Math.cos(s), h, l, u, f, _, v, m = N(i - this.long0, this.over);
  return Math.abs(Math.abs(i - this.long0) - Math.PI) <= I && Math.abs(s + this.lat0) <= I ? (e.x = NaN, e.y = NaN, e) : this.sphere ? (h = 2 * this.k0 / (1 + this.sinlat0 * a + this.coslat0 * o * Math.cos(m)), e.x = this.a * h * o * Math.sin(m) + this.x0, e.y = this.a * h * (this.coslat0 * a - this.sinlat0 * o * Math.cos(m)) + this.y0, e) : (l = 2 * Math.atan(_n(s, a, this.e)) - A, f = Math.cos(l), u = Math.sin(l), Math.abs(this.coslat0) <= I ? (_ = Dt(this.e, s * this.con, this.con * a), v = 2 * this.a * this.k0 * _ / this.cons, e.x = this.x0 + v * Math.sin(i - this.long0), e.y = this.y0 - this.con * v * Math.cos(i - this.long0), e) : (Math.abs(this.sinlat0) < I ? (h = 2 * this.a * this.k0 / (1 + f * Math.cos(m)), e.y = h * u) : (h = 2 * this.a * this.k0 * this.ms1 / (this.cosX0 * (1 + this.sinX0 * u + this.cosX0 * f * Math.cos(m))), e.y = h * (this.cosX0 * u - this.sinX0 * f * Math.cos(m)) + this.y0), e.x = h * f * Math.sin(m) + this.x0, e));
}
function Ru(e) {
  e.x -= this.x0, e.y -= this.y0;
  var i, s, a, o, h, l = Math.sqrt(e.x * e.x + e.y * e.y);
  if (this.sphere) {
    var u = 2 * Math.atan(l / (2 * this.a * this.k0));
    return i = this.long0, s = this.lat0, l <= I ? (e.x = i, e.y = s, e) : (s = Math.asin(Math.cos(u) * this.sinlat0 + e.y * Math.sin(u) * this.coslat0 / l), Math.abs(this.coslat0) < I ? this.lat0 > 0 ? i = N(this.long0 + Math.atan2(e.x, -1 * e.y), this.over) : i = N(this.long0 + Math.atan2(e.x, e.y), this.over) : i = N(this.long0 + Math.atan2(e.x * Math.sin(u), l * this.coslat0 * Math.cos(u) - e.y * this.sinlat0 * Math.sin(u)), this.over), e.x = i, e.y = s, e);
  } else if (Math.abs(this.coslat0) <= I) {
    if (l <= I)
      return s = this.lat0, i = this.long0, e.x = i, e.y = s, e;
    e.x *= this.con, e.y *= this.con, a = l * this.cons / (2 * this.a * this.k0), s = this.con * pe(this.e, a), i = this.con * N(this.con * this.long0 + Math.atan2(e.x, -1 * e.y), this.over);
  } else
    o = 2 * Math.atan(l * this.cosX0 / (2 * this.a * this.k0 * this.ms1)), i = this.long0, l <= I ? h = this.X0 : (h = Math.asin(Math.cos(o) * this.sinX0 + e.y * Math.sin(o) * this.cosX0 / l), i = N(this.long0 + Math.atan2(e.x * Math.sin(o), l * this.cosX0 * Math.cos(o) - e.y * this.sinX0 * Math.sin(o)), this.over)), s = -1 * pe(this.e, Math.tan(0.5 * (A + h)));
  return e.x = i, e.y = s, e;
}
var Bu = ["stere", "Stereographic_South_Pole", "Polar_Stereographic_variant_A", "Polar_Stereographic_variant_B", "Polar_Stereographic"];
const ku = {
  init: Ou,
  forward: zu,
  inverse: Ru,
  names: Bu,
  ssfn_: _n
};
function Du() {
  var e = this.lat0;
  this.lambda0 = this.long0;
  var i = Math.sin(e), s = this.a, a = this.rf, o = 1 / a, h = 2 * o - Math.pow(o, 2), l = this.e = Math.sqrt(h);
  this.R = this.k0 * s * Math.sqrt(1 - h) / (1 - h * Math.pow(i, 2)), this.alpha = Math.sqrt(1 + h / (1 - h) * Math.pow(Math.cos(e), 4)), this.b0 = Math.asin(i / this.alpha);
  var u = Math.log(Math.tan(Math.PI / 4 + this.b0 / 2)), f = Math.log(Math.tan(Math.PI / 4 + e / 2)), _ = Math.log((1 + l * i) / (1 - l * i));
  this.K = u - this.alpha * f + this.alpha * l / 2 * _;
}
function Zu(e) {
  var i = Math.log(Math.tan(Math.PI / 4 - e.y / 2)), s = this.e / 2 * Math.log((1 + this.e * Math.sin(e.y)) / (1 - this.e * Math.sin(e.y))), a = -this.alpha * (i + s) + this.K, o = 2 * (Math.atan(Math.exp(a)) - Math.PI / 4), h = this.alpha * (e.x - this.lambda0), l = Math.atan(Math.sin(h) / (Math.sin(this.b0) * Math.tan(o) + Math.cos(this.b0) * Math.cos(h))), u = Math.asin(Math.cos(this.b0) * Math.sin(o) - Math.sin(this.b0) * Math.cos(o) * Math.cos(h));
  return e.y = this.R / 2 * Math.log((1 + Math.sin(u)) / (1 - Math.sin(u))) + this.y0, e.x = this.R * l + this.x0, e;
}
function Fu(e) {
  for (var i = e.x - this.x0, s = e.y - this.y0, a = i / this.R, o = 2 * (Math.atan(Math.exp(s / this.R)) - Math.PI / 4), h = Math.asin(Math.cos(this.b0) * Math.sin(o) + Math.sin(this.b0) * Math.cos(o) * Math.cos(a)), l = Math.atan(Math.sin(a) / (Math.cos(this.b0) * Math.cos(a) - Math.sin(this.b0) * Math.tan(o))), u = this.lambda0 + l / this.alpha, f = 0, _ = h, v = -1e3, m = 0; Math.abs(_ - v) > 1e-7; ) {
    if (++m > 20)
      return;
    f = 1 / this.alpha * (Math.log(Math.tan(Math.PI / 4 + h / 2)) - this.K) + this.e * Math.log(Math.tan(Math.PI / 4 + Math.asin(this.e * Math.sin(_)) / 2)), v = _, _ = 2 * Math.atan(Math.exp(f)) - Math.PI / 2;
  }
  return e.x = u, e.y = _, e;
}
var Uu = ["somerc"];
const qu = {
  init: Du,
  forward: Zu,
  inverse: Fu,
  names: Uu
};
var Ti = 1e-7;
function ju(e) {
  var i = ["Hotine_Oblique_Mercator", "Hotine_Oblique_Mercator_variant_A", "Hotine_Oblique_Mercator_Azimuth_Natural_Origin"], s = typeof e.projName == "object" ? Object.keys(e.projName)[0] : e.projName;
  return "no_uoff" in e || "no_off" in e || i.indexOf(s) !== -1 || i.indexOf(Mr(s)) !== -1;
}
function Hu() {
  var e, i, s, a, o, h, l, u, f, _, v = 0, m, p = 0, M = 0, w = 0, x = 0, S = 0, E = 0;
  this.no_off = ju(this), this.no_rot = "no_rot" in this;
  var C = !1;
  "alpha" in this && (C = !0);
  var G = !1;
  if ("rectified_grid_angle" in this && (G = !0), C && (E = this.alpha), G && (v = this.rectified_grid_angle), C || G)
    p = this.longc;
  else if (M = this.long1, x = this.lat1, w = this.long2, S = this.lat2, Math.abs(x - S) <= Ti || (e = Math.abs(x)) <= Ti || Math.abs(e - A) <= Ti || Math.abs(Math.abs(this.lat0) - A) <= Ti || Math.abs(Math.abs(S) - A) <= Ti)
    throw new Error();
  var z = 1 - this.es;
  i = Math.sqrt(z), Math.abs(this.lat0) > I ? (u = Math.sin(this.lat0), s = Math.cos(this.lat0), e = 1 - this.es * u * u, this.B = s * s, this.B = Math.sqrt(1 + this.es * this.B * this.B / z), this.A = this.B * this.k0 * i / e, a = this.B * i / (s * Math.sqrt(e)), o = a * a - 1, o <= 0 ? o = 0 : (o = Math.sqrt(o), this.lat0 < 0 && (o = -o)), this.E = o += a, this.E *= Math.pow(Dt(this.e, this.lat0, u), this.B)) : (this.B = 1 / i, this.A = this.k0, this.E = a = o = 1), C || G ? (C ? (m = Math.asin(Math.sin(E) / a), G || (v = E)) : (m = v, E = Math.asin(a * Math.sin(m))), this.lam0 = p - Math.asin(0.5 * (o - 1 / o) * Math.tan(m)) / this.B) : (h = Math.pow(Dt(this.e, x, Math.sin(x)), this.B), l = Math.pow(Dt(this.e, S, Math.sin(S)), this.B), o = this.E / h, f = (l - h) / (l + h), _ = this.E * this.E, _ = (_ - l * h) / (_ + l * h), e = M - w, e < -Math.PI ? w -= me : e > Math.PI && (w += me), this.lam0 = N(0.5 * (M + w) - Math.atan(_ * Math.tan(0.5 * this.B * (M - w)) / f) / this.B, this.over), m = Math.atan(2 * Math.sin(this.B * N(M - this.lam0, this.over)) / (o - 1 / o)), v = E = Math.asin(a * Math.sin(m))), this.singam = Math.sin(m), this.cosgam = Math.cos(m), this.sinrot = Math.sin(v), this.cosrot = Math.cos(v), this.rB = 1 / this.B, this.ArB = this.A * this.rB, this.BrA = 1 / this.ArB, this.no_off ? this.u_0 = 0 : (this.u_0 = Math.abs(this.ArB * Math.atan(Math.sqrt(a * a - 1) / Math.cos(E))), this.lat0 < 0 && (this.u_0 = -this.u_0)), o = 0.5 * m, this.v_pole_n = this.ArB * Math.log(Math.tan(J - o)), this.v_pole_s = this.ArB * Math.log(Math.tan(J + o));
}
function Wu(e) {
  var i = {}, s, a, o, h, l, u, f, _;
  if (e.x = e.x - this.lam0, Math.abs(Math.abs(e.y) - A) > I) {
    if (l = this.E / Math.pow(Dt(this.e, e.y, Math.sin(e.y)), this.B), u = 1 / l, s = 0.5 * (l - u), a = 0.5 * (l + u), h = Math.sin(this.B * e.x), o = (s * this.singam - h * this.cosgam) / a, Math.abs(Math.abs(o) - 1) < I)
      throw new Error();
    _ = 0.5 * this.ArB * Math.log((1 - o) / (1 + o)), u = Math.cos(this.B * e.x), Math.abs(u) < Ti ? f = this.A * e.x : f = this.ArB * Math.atan2(s * this.cosgam + h * this.singam, u);
  } else
    _ = e.y > 0 ? this.v_pole_n : this.v_pole_s, f = this.ArB * e.y;
  return this.no_rot ? (i.x = f, i.y = _) : (f -= this.u_0, i.x = _ * this.cosrot + f * this.sinrot, i.y = f * this.cosrot - _ * this.sinrot), i.x = this.a * i.x + this.x0, i.y = this.a * i.y + this.y0, i;
}
function Xu(e) {
  var i, s, a, o, h, l, u, f = {};
  if (e.x = (e.x - this.x0) * (1 / this.a), e.y = (e.y - this.y0) * (1 / this.a), this.no_rot ? (s = e.y, i = e.x) : (s = e.x * this.cosrot - e.y * this.sinrot, i = e.y * this.cosrot + e.x * this.sinrot + this.u_0), a = Math.exp(-this.BrA * s), o = 0.5 * (a - 1 / a), h = 0.5 * (a + 1 / a), l = Math.sin(this.BrA * i), u = (l * this.cosgam + o * this.singam) / h, Math.abs(Math.abs(u) - 1) < I)
    f.x = 0, f.y = u < 0 ? -A : A;
  else {
    if (f.y = this.E / Math.sqrt((1 + u) / (1 - u)), f.y = pe(this.e, Math.pow(f.y, 1 / this.B)), f.y === 1 / 0)
      throw new Error();
    f.x = -this.rB * Math.atan2(o * this.cosgam - l * this.singam, Math.cos(this.BrA * i));
  }
  return f.x += this.lam0, f;
}
var Yu = ["Hotine_Oblique_Mercator", "Hotine Oblique Mercator", "Hotine_Oblique_Mercator_variant_A", "Hotine_Oblique_Mercator_Variant_B", "Hotine_Oblique_Mercator_Azimuth_Natural_Origin", "Hotine_Oblique_Mercator_Two_Point_Natural_Origin", "Hotine_Oblique_Mercator_Azimuth_Center", "Oblique_Mercator", "omerc"];
const Vu = {
  init: Hu,
  forward: Wu,
  inverse: Xu,
  names: Yu
};
function Ku() {
  if (this.lat2 || (this.lat2 = this.lat1), this.k0 || (this.k0 = 1), this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, !(Math.abs(this.lat1 + this.lat2) < I)) {
    var e = this.b / this.a;
    this.e = Math.sqrt(1 - e * e);
    var i = Math.sin(this.lat1), s = Math.cos(this.lat1), a = Ht(this.e, i, s), o = Dt(this.e, this.lat1, i), h = Math.sin(this.lat2), l = Math.cos(this.lat2), u = Ht(this.e, h, l), f = Dt(this.e, this.lat2, h), _ = Math.abs(Math.abs(this.lat0) - A) < I ? 0 : Dt(this.e, this.lat0, Math.sin(this.lat0));
    Math.abs(this.lat1 - this.lat2) > I ? this.ns = Math.log(a / u) / Math.log(o / f) : this.ns = i, isNaN(this.ns) && (this.ns = i), this.f0 = a / (this.ns * Math.pow(o, this.ns)), this.rh = this.a * this.f0 * Math.pow(_, this.ns), this.title || (this.title = "Lambert Conformal Conic");
  }
}
function $u(e) {
  var i = e.x, s = e.y;
  Math.abs(2 * Math.abs(s) - Math.PI) <= I && (s = ye(s) * (A - 2 * I));
  var a = Math.abs(Math.abs(s) - A), o, h;
  if (a > I)
    o = Dt(this.e, s, Math.sin(s)), h = this.a * this.f0 * Math.pow(o, this.ns);
  else {
    if (a = s * this.ns, a <= 0)
      return null;
    h = 0;
  }
  var l = this.ns * N(i - this.long0, this.over);
  return e.x = this.k0 * (h * Math.sin(l)) + this.x0, e.y = this.k0 * (this.rh - h * Math.cos(l)) + this.y0, e;
}
function Ju(e) {
  var i, s, a, o, h, l = (e.x - this.x0) / this.k0, u = this.rh - (e.y - this.y0) / this.k0;
  this.ns > 0 ? (i = Math.sqrt(l * l + u * u), s = 1) : (i = -Math.sqrt(l * l + u * u), s = -1);
  var f = 0;
  if (i !== 0 && (f = Math.atan2(s * l, s * u)), i !== 0 || this.ns > 0) {
    if (s = 1 / this.ns, a = Math.pow(i / (this.a * this.f0), s), o = pe(this.e, a), o === -9999)
      return null;
  } else
    o = -A;
  return h = N(f / this.ns + this.long0, this.over), e.x = h, e.y = o, e;
}
var Qu = [
  "Lambert Tangential Conformal Conic Projection",
  "Lambert_Conformal_Conic",
  "Lambert_Conformal_Conic_1SP",
  "Lambert_Conformal_Conic_2SP",
  "lcc",
  "Lambert Conic Conformal (1SP)",
  "Lambert Conic Conformal (2SP)"
];
const tc = {
  init: Ku,
  forward: $u,
  inverse: Ju,
  names: Qu
};
function ic() {
  this.a = 6377397155e-3, this.es = 0.006674372230614, this.e = Math.sqrt(this.es), this.lat0 || (this.lat0 = 0.863937979737193), this.long0 || (this.long0 = 0.7417649320975901 - 0.308341501185665), this.k0 || (this.k0 = 0.9999), this.s45 = 0.785398163397448, this.s90 = 2 * this.s45, this.fi0 = this.lat0, this.e2 = this.es, this.e = Math.sqrt(this.e2), this.alfa = Math.sqrt(1 + this.e2 * Math.pow(Math.cos(this.fi0), 4) / (1 - this.e2)), this.uq = 1.04216856380474, this.u0 = Math.asin(Math.sin(this.fi0) / this.alfa), this.g = Math.pow((1 + this.e * Math.sin(this.fi0)) / (1 - this.e * Math.sin(this.fi0)), this.alfa * this.e / 2), this.k = Math.tan(this.u0 / 2 + this.s45) / Math.pow(Math.tan(this.fi0 / 2 + this.s45), this.alfa) * this.g, this.k1 = this.k0, this.n0 = this.a * Math.sqrt(1 - this.e2) / (1 - this.e2 * Math.pow(Math.sin(this.fi0), 2)), this.s0 = 1.37008346281555, this.n = Math.sin(this.s0), this.ro0 = this.k1 * this.n0 / Math.tan(this.s0), this.ad = this.s90 - this.uq;
}
function ec(e) {
  var i, s, a, o, h, l, u, f = e.x, _ = e.y, v = N(f - this.long0, this.over);
  return i = Math.pow((1 + this.e * Math.sin(_)) / (1 - this.e * Math.sin(_)), this.alfa * this.e / 2), s = 2 * (Math.atan(this.k * Math.pow(Math.tan(_ / 2 + this.s45), this.alfa) / i) - this.s45), a = -v * this.alfa, o = Math.asin(Math.cos(this.ad) * Math.sin(s) + Math.sin(this.ad) * Math.cos(s) * Math.cos(a)), h = Math.asin(Math.cos(s) * Math.sin(a) / Math.cos(o)), l = this.n * h, u = this.ro0 * Math.pow(Math.tan(this.s0 / 2 + this.s45), this.n) / Math.pow(Math.tan(o / 2 + this.s45), this.n), e.y = u * Math.cos(l) / 1, e.x = u * Math.sin(l) / 1, this.czech || (e.y *= -1, e.x *= -1), e;
}
function sc(e) {
  var i, s, a, o, h, l, u, f, _ = e.x;
  e.x = e.y, e.y = _, this.czech || (e.y *= -1, e.x *= -1), l = Math.sqrt(e.x * e.x + e.y * e.y), h = Math.atan2(e.y, e.x), o = h / Math.sin(this.s0), a = 2 * (Math.atan(Math.pow(this.ro0 / l, 1 / this.n) * Math.tan(this.s0 / 2 + this.s45)) - this.s45), i = Math.asin(Math.cos(this.ad) * Math.sin(a) - Math.sin(this.ad) * Math.cos(a) * Math.cos(o)), s = Math.asin(Math.cos(a) * Math.sin(o) / Math.cos(i)), e.x = this.long0 - s / this.alfa, u = i, f = 0;
  var v = 0;
  do
    e.y = 2 * (Math.atan(Math.pow(this.k, -1 / this.alfa) * Math.pow(Math.tan(i / 2 + this.s45), 1 / this.alfa) * Math.pow((1 + this.e * Math.sin(u)) / (1 - this.e * Math.sin(u)), this.e / 2)) - this.s45), Math.abs(u - e.y) < 1e-10 && (f = 1), u = e.y, v += 1;
  while (f === 0 && v < 15);
  return v >= 15 ? null : e;
}
var nc = ["Krovak", "krovak"];
const ac = {
  init: ic,
  forward: ec,
  inverse: sc,
  names: nc
};
function Mt(e, i, s, a, o) {
  return e * o - i * Math.sin(2 * o) + s * Math.sin(4 * o) - a * Math.sin(6 * o);
}
function Me(e) {
  return 1 - 0.25 * e * (1 + e / 16 * (3 + 1.25 * e));
}
function we(e) {
  return 0.375 * e * (1 + 0.25 * e * (1 + 0.46875 * e));
}
function xe(e) {
  return 0.05859375 * e * e * (1 + 0.75 * e);
}
function Pe(e) {
  return e * e * e * (35 / 3072);
}
function mn(e, i, s) {
  var a = i * s;
  return e / Math.sqrt(1 - a * a);
}
function oi(e) {
  return Math.abs(e) < A ? e : e - ye(e) * Math.PI;
}
function ss(e, i, s, a, o) {
  var h, l;
  h = e / i;
  for (var u = 0; u < 15; u++)
    if (l = (e - (i * h - s * Math.sin(2 * h) + a * Math.sin(4 * h) - o * Math.sin(6 * h))) / (i - 2 * s * Math.cos(2 * h) + 4 * a * Math.cos(4 * h) - 6 * o * Math.cos(6 * h)), h += l, Math.abs(l) <= 1e-10)
      return h;
  return NaN;
}
function rc() {
  this.sphere || (this.e0 = Me(this.es), this.e1 = we(this.es), this.e2 = xe(this.es), this.e3 = Pe(this.es), this.ml0 = this.a * Mt(this.e0, this.e1, this.e2, this.e3, this.lat0));
}
function oc(e) {
  var i, s, a = e.x, o = e.y;
  if (a = N(a - this.long0, this.over), this.sphere)
    i = this.a * Math.asin(Math.cos(o) * Math.sin(a)), s = this.a * (Math.atan2(Math.tan(o), Math.cos(a)) - this.lat0);
  else {
    var h = Math.sin(o), l = Math.cos(o), u = mn(this.a, this.e, h), f = Math.tan(o) * Math.tan(o), _ = a * Math.cos(o), v = _ * _, m = this.es * l * l / (1 - this.es), p = this.a * Mt(this.e0, this.e1, this.e2, this.e3, o);
    i = u * _ * (1 - v * f * (1 / 6 - (8 - f + 8 * m) * v / 120)), s = p - this.ml0 + u * h / l * v * (0.5 + (5 - f + 6 * m) * v / 24);
  }
  return e.x = i + this.x0, e.y = s + this.y0, e;
}
function hc(e) {
  e.x -= this.x0, e.y -= this.y0;
  var i = e.x / this.a, s = e.y / this.a, a, o;
  if (this.sphere) {
    var h = s + this.lat0;
    a = Math.asin(Math.sin(h) * Math.cos(i)), o = Math.atan2(Math.tan(i), Math.cos(h));
  } else {
    var l = this.ml0 / this.a + s, u = ss(l, this.e0, this.e1, this.e2, this.e3);
    if (Math.abs(Math.abs(u) - A) <= I)
      return e.x = this.long0, e.y = A, s < 0 && (e.y *= -1), e;
    var f = mn(this.a, this.e, Math.sin(u)), _ = f * f * f / this.a / this.a * (1 - this.es), v = Math.pow(Math.tan(u), 2), m = i * this.a / f, p = m * m;
    a = u - f * Math.tan(u) / _ * m * m * (0.5 - (1 + 3 * v) * m * m / 24), o = m * (1 - p * (v / 3 + (1 + 3 * v) * v * p / 15)) / Math.cos(u);
  }
  return e.x = N(o + this.long0, this.over), e.y = oi(a), e;
}
var lc = ["Cassini", "Cassini_Soldner", "cass"];
const uc = {
  init: rc,
  forward: oc,
  inverse: hc,
  names: lc
};
function ni(e, i) {
  var s;
  return e > 1e-7 ? (s = e * i, (1 - e * e) * (i / (1 - s * s) - 0.5 / e * Math.log((1 - s) / (1 + s)))) : 2 * i;
}
var tn = 1, en = 2, sn = 3, Je = 4;
function cc() {
  var e = Math.abs(this.lat0);
  if (Math.abs(e - A) < I ? this.mode = this.lat0 < 0 ? tn : en : Math.abs(e) < I ? this.mode = sn : this.mode = Je, this.es > 0) {
    var i;
    switch (this.qp = ni(this.e, 1), this.mmf = 0.5 / (1 - this.es), this.apa = Mc(this.es), this.mode) {
      case en:
        this.dd = 1;
        break;
      case tn:
        this.dd = 1;
        break;
      case sn:
        this.rq = Math.sqrt(0.5 * this.qp), this.dd = 1 / this.rq, this.xmf = 1, this.ymf = 0.5 * this.qp;
        break;
      case Je:
        this.rq = Math.sqrt(0.5 * this.qp), i = Math.sin(this.lat0), this.sinb1 = ni(this.e, i) / this.qp, this.cosb1 = Math.sqrt(1 - this.sinb1 * this.sinb1), this.dd = Math.cos(this.lat0) / (Math.sqrt(1 - this.es * i * i) * this.rq * this.cosb1), this.ymf = (this.xmf = this.rq) / this.dd, this.xmf *= this.dd;
        break;
    }
  } else
    this.mode === Je && (this.sinph0 = Math.sin(this.lat0), this.cosph0 = Math.cos(this.lat0));
}
function fc(e) {
  var i, s, a, o, h, l, u, f, _, v, m = e.x, p = e.y;
  if (m = N(m - this.long0, this.over), this.sphere) {
    if (h = Math.sin(p), v = Math.cos(p), a = Math.cos(m), this.mode === this.OBLIQ || this.mode === this.EQUIT) {
      if (s = this.mode === this.EQUIT ? 1 + v * a : 1 + this.sinph0 * h + this.cosph0 * v * a, s <= I)
        return null;
      s = Math.sqrt(2 / s), i = s * v * Math.sin(m), s *= this.mode === this.EQUIT ? h : this.cosph0 * h - this.sinph0 * v * a;
    } else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
      if (this.mode === this.N_POLE && (a = -a), Math.abs(p + this.lat0) < I)
        return null;
      s = J - p * 0.5, s = 2 * (this.mode === this.S_POLE ? Math.cos(s) : Math.sin(s)), i = s * Math.sin(m), s *= a;
    }
  } else {
    switch (u = 0, f = 0, _ = 0, a = Math.cos(m), o = Math.sin(m), h = Math.sin(p), l = ni(this.e, h), (this.mode === this.OBLIQ || this.mode === this.EQUIT) && (u = l / this.qp, f = Math.sqrt(1 - u * u)), this.mode) {
      case this.OBLIQ:
        _ = 1 + this.sinb1 * u + this.cosb1 * f * a;
        break;
      case this.EQUIT:
        _ = 1 + f * a;
        break;
      case this.N_POLE:
        _ = A + p, l = this.qp - l;
        break;
      case this.S_POLE:
        _ = p - A, l = this.qp + l;
        break;
    }
    if (Math.abs(_) < I)
      return null;
    switch (this.mode) {
      case this.OBLIQ:
      case this.EQUIT:
        _ = Math.sqrt(2 / _), this.mode === this.OBLIQ ? s = this.ymf * _ * (this.cosb1 * u - this.sinb1 * f * a) : s = (_ = Math.sqrt(2 / (1 + f * a))) * u * this.ymf, i = this.xmf * _ * f * o;
        break;
      case this.N_POLE:
      case this.S_POLE:
        l >= 0 ? (i = (_ = Math.sqrt(l)) * o, s = a * (this.mode === this.S_POLE ? _ : -_)) : i = s = 0;
        break;
    }
  }
  return e.x = this.a * i + this.x0, e.y = this.a * s + this.y0, e;
}
function dc(e) {
  e.x -= this.x0, e.y -= this.y0;
  var i = e.x / this.a, s = e.y / this.a, a, o, h, l, u, f, _;
  if (this.sphere) {
    var v = 0, m, p = 0;
    if (m = Math.sqrt(i * i + s * s), o = m * 0.5, o > 1)
      return null;
    switch (o = 2 * Math.asin(o), (this.mode === this.OBLIQ || this.mode === this.EQUIT) && (p = Math.sin(o), v = Math.cos(o)), this.mode) {
      case this.EQUIT:
        o = Math.abs(m) <= I ? 0 : Math.asin(s * p / m), i *= p, s = v * m;
        break;
      case this.OBLIQ:
        o = Math.abs(m) <= I ? this.lat0 : Math.asin(v * this.sinph0 + s * p * this.cosph0 / m), i *= p * this.cosph0, s = (v - Math.sin(o) * this.sinph0) * m;
        break;
      case this.N_POLE:
        s = -s, o = A - o;
        break;
      case this.S_POLE:
        o -= A;
        break;
    }
    a = s === 0 && (this.mode === this.EQUIT || this.mode === this.OBLIQ) ? 0 : Math.atan2(i, s);
  } else {
    if (_ = 0, this.mode === this.OBLIQ || this.mode === this.EQUIT) {
      if (i /= this.dd, s *= this.dd, f = Math.sqrt(i * i + s * s), f < I)
        return e.x = this.long0, e.y = this.lat0, e;
      l = 2 * Math.asin(0.5 * f / this.rq), h = Math.cos(l), i *= l = Math.sin(l), this.mode === this.OBLIQ ? (_ = h * this.sinb1 + s * l * this.cosb1 / f, u = this.qp * _, s = f * this.cosb1 * h - s * this.sinb1 * l) : (_ = s * l / f, u = this.qp * _, s = f * h);
    } else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
      if (this.mode === this.N_POLE && (s = -s), u = i * i + s * s, !u)
        return e.x = this.long0, e.y = this.lat0, e;
      _ = 1 - u / this.qp, this.mode === this.S_POLE && (_ = -_);
    }
    a = Math.atan2(i, s), o = wc(Math.asin(_), this.apa);
  }
  return e.x = N(this.long0 + a, this.over), e.y = o, e;
}
var _c = 0.3333333333333333, mc = 0.17222222222222222, gc = 0.10257936507936508, pc = 0.06388888888888888, vc = 0.0664021164021164, yc = 0.016415012942191543;
function Mc(e) {
  var i, s = [];
  return s[0] = e * _c, i = e * e, s[0] += i * mc, s[1] = i * pc, i *= e, s[0] += i * gc, s[1] += i * vc, s[2] = i * yc, s;
}
function wc(e, i) {
  var s = e + e;
  return e + i[0] * Math.sin(s) + i[1] * Math.sin(s + s) + i[2] * Math.sin(s + s + s);
}
var xc = ["Lambert Azimuthal Equal Area", "Lambert_Azimuthal_Equal_Area", "laea"];
const Pc = {
  init: cc,
  forward: fc,
  inverse: dc,
  names: xc,
  S_POLE: tn,
  N_POLE: en,
  EQUIT: sn,
  OBLIQ: Je
};
function ri(e) {
  return Math.abs(e) > 1 && (e = e > 1 ? 1 : -1), Math.asin(e);
}
function bc() {
  Math.abs(this.lat1 + this.lat2) < I || (this.temp = this.b / this.a, this.es = 1 - Math.pow(this.temp, 2), this.e3 = Math.sqrt(this.es), this.sin_po = Math.sin(this.lat1), this.cos_po = Math.cos(this.lat1), this.t1 = this.sin_po, this.con = this.sin_po, this.ms1 = Ht(this.e3, this.sin_po, this.cos_po), this.qs1 = ni(this.e3, this.sin_po), this.sin_po = Math.sin(this.lat2), this.cos_po = Math.cos(this.lat2), this.t2 = this.sin_po, this.ms2 = Ht(this.e3, this.sin_po, this.cos_po), this.qs2 = ni(this.e3, this.sin_po), this.sin_po = Math.sin(this.lat0), this.cos_po = Math.cos(this.lat0), this.t3 = this.sin_po, this.qs0 = ni(this.e3, this.sin_po), Math.abs(this.lat1 - this.lat2) > I ? this.ns0 = (this.ms1 * this.ms1 - this.ms2 * this.ms2) / (this.qs2 - this.qs1) : this.ns0 = this.con, this.c = this.ms1 * this.ms1 + this.ns0 * this.qs1, this.rh = this.a * Math.sqrt(this.c - this.ns0 * this.qs0) / this.ns0);
}
function Sc(e) {
  var i = e.x, s = e.y;
  this.sin_phi = Math.sin(s), this.cos_phi = Math.cos(s);
  var a = ni(this.e3, this.sin_phi), o = this.a * Math.sqrt(this.c - this.ns0 * a) / this.ns0, h = this.ns0 * N(i - this.long0, this.over), l = o * Math.sin(h) + this.x0, u = this.rh - o * Math.cos(h) + this.y0;
  return e.x = l, e.y = u, e;
}
function Ec(e) {
  var i, s, a, o, h, l;
  return e.x -= this.x0, e.y = this.rh - e.y + this.y0, this.ns0 >= 0 ? (i = Math.sqrt(e.x * e.x + e.y * e.y), a = 1) : (i = -Math.sqrt(e.x * e.x + e.y * e.y), a = -1), o = 0, i !== 0 && (o = Math.atan2(a * e.x, a * e.y)), a = i * this.ns0 / this.a, this.sphere ? l = Math.asin((this.c - a * a) / (2 * this.ns0)) : (s = (this.c - a * a) / this.ns0, l = this.phi1z(this.e3, s)), h = N(o / this.ns0 + this.long0, this.over), e.x = h, e.y = l, e;
}
function Tc(e, i) {
  var s, a, o, h, l, u = ri(0.5 * i);
  if (e < I)
    return u;
  for (var f = e * e, _ = 1; _ <= 25; _++)
    if (s = Math.sin(u), a = Math.cos(u), o = e * s, h = 1 - o * o, l = 0.5 * h * h / a * (i / (1 - f) - s / h + 0.5 / e * Math.log((1 - o) / (1 + o))), u = u + l, Math.abs(l) <= 1e-7)
      return u;
  return null;
}
var Ac = ["Albers_Conic_Equal_Area", "Albers_Equal_Area", "Albers", "aea"];
const Lc = {
  init: bc,
  forward: Sc,
  inverse: Ec,
  names: Ac,
  phi1z: Tc
};
function Cc() {
  this.sin_p14 = Math.sin(this.lat0), this.cos_p14 = Math.cos(this.lat0), this.infinity_dist = 1e3 * this.a, this.rc = 1;
}
function Ic(e) {
  var i, s, a, o, h, l, u, f, _ = e.x, v = e.y;
  return a = N(_ - this.long0, this.over), i = Math.sin(v), s = Math.cos(v), o = Math.cos(a), l = this.sin_p14 * i + this.cos_p14 * s * o, h = 1, l > 0 || Math.abs(l) <= I ? (u = this.x0 + this.a * h * s * Math.sin(a) / l, f = this.y0 + this.a * h * (this.cos_p14 * i - this.sin_p14 * s * o) / l) : (u = this.x0 + this.infinity_dist * s * Math.sin(a), f = this.y0 + this.infinity_dist * (this.cos_p14 * i - this.sin_p14 * s * o)), e.x = u, e.y = f, e;
}
function Gc(e) {
  var i, s, a, o, h, l;
  return e.x = (e.x - this.x0) / this.a, e.y = (e.y - this.y0) / this.a, e.x /= this.k0, e.y /= this.k0, (i = Math.sqrt(e.x * e.x + e.y * e.y)) ? (o = Math.atan2(i, this.rc), s = Math.sin(o), a = Math.cos(o), l = ri(a * this.sin_p14 + e.y * s * this.cos_p14 / i), h = Math.atan2(e.x * s, i * this.cos_p14 * a - e.y * this.sin_p14 * s), h = N(this.long0 + h, this.over)) : (l = this.phic0, h = 0), e.x = h, e.y = l, e;
}
var Nc = ["gnom"];
const Oc = {
  init: Cc,
  forward: Ic,
  inverse: Gc,
  names: Nc
};
function zc(e, i) {
  var s = 1 - (1 - e * e) / (2 * e) * Math.log((1 - e) / (1 + e));
  if (Math.abs(Math.abs(i) - s) < 1e-6)
    return i < 0 ? -1 * A : A;
  for (var a = Math.asin(0.5 * i), o, h, l, u, f = 0; f < 30; f++)
    if (h = Math.sin(a), l = Math.cos(a), u = e * h, o = Math.pow(1 - u * u, 2) / (2 * l) * (i / (1 - e * e) - h / (1 - u * u) + 0.5 / e * Math.log((1 - u) / (1 + u))), a += o, Math.abs(o) <= 1e-10)
      return a;
  return NaN;
}
function Rc() {
  this.sphere || (this.k0 = Ht(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts)));
}
function Bc(e) {
  var i = e.x, s = e.y, a, o, h = N(i - this.long0, this.over);
  if (this.sphere)
    a = this.x0 + this.a * h * Math.cos(this.lat_ts), o = this.y0 + this.a * Math.sin(s) / Math.cos(this.lat_ts);
  else {
    var l = ni(this.e, Math.sin(s));
    a = this.x0 + this.a * this.k0 * h, o = this.y0 + this.a * l * 0.5 / this.k0;
  }
  return e.x = a, e.y = o, e;
}
function kc(e) {
  e.x -= this.x0, e.y -= this.y0;
  var i, s;
  return this.sphere ? (i = N(this.long0 + e.x / this.a / Math.cos(this.lat_ts), this.over), s = Math.asin(e.y / this.a * Math.cos(this.lat_ts))) : (s = zc(this.e, 2 * e.y * this.k0 / this.a), i = N(this.long0 + e.x / (this.a * this.k0), this.over)), e.x = i, e.y = s, e;
}
var Dc = ["cea"];
const Zc = {
  init: Rc,
  forward: Bc,
  inverse: kc,
  names: Dc
};
function Fc() {
  this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, this.lat0 = this.lat0 || 0, this.long0 = this.long0 || 0, this.lat_ts = this.lat_ts || 0, this.title = this.title || "Equidistant Cylindrical (Plate Carre)", this.rc = Math.cos(this.lat_ts);
}
function Uc(e) {
  var i = e.x, s = e.y, a = N(i - this.long0, this.over), o = oi(s - this.lat0);
  return e.x = this.x0 + this.a * a * this.rc, e.y = this.y0 + this.a * o, e;
}
function qc(e) {
  var i = e.x, s = e.y;
  return e.x = N(this.long0 + (i - this.x0) / (this.a * this.rc), this.over), e.y = oi(this.lat0 + (s - this.y0) / this.a), e;
}
var jc = ["Equirectangular", "Equidistant_Cylindrical", "Equidistant_Cylindrical_Spherical", "eqc"];
const Hc = {
  init: Fc,
  forward: Uc,
  inverse: qc,
  names: jc
};
var ar = 20;
function Wc() {
  this.temp = this.b / this.a, this.es = 1 - Math.pow(this.temp, 2), this.e = Math.sqrt(this.es), this.e0 = Me(this.es), this.e1 = we(this.es), this.e2 = xe(this.es), this.e3 = Pe(this.es), this.ml0 = this.a * Mt(this.e0, this.e1, this.e2, this.e3, this.lat0);
}
function Xc(e) {
  var i = e.x, s = e.y, a, o, h, l = N(i - this.long0, this.over);
  if (h = l * Math.sin(s), this.sphere)
    Math.abs(s) <= I ? (a = this.a * l, o = -1 * this.a * this.lat0) : (a = this.a * Math.sin(h) / Math.tan(s), o = this.a * (oi(s - this.lat0) + (1 - Math.cos(h)) / Math.tan(s)));
  else if (Math.abs(s) <= I)
    a = this.a * l, o = -1 * this.ml0;
  else {
    var u = mn(this.a, this.e, Math.sin(s)) / Math.tan(s);
    a = u * Math.sin(h), o = this.a * Mt(this.e0, this.e1, this.e2, this.e3, s) - this.ml0 + u * (1 - Math.cos(h));
  }
  return e.x = a + this.x0, e.y = o + this.y0, e;
}
function Yc(e) {
  var i, s, a, o, h, l, u, f, _;
  if (a = e.x - this.x0, o = e.y - this.y0, this.sphere)
    if (Math.abs(o + this.a * this.lat0) <= I)
      i = N(a / this.a + this.long0, this.over), s = 0;
    else {
      l = this.lat0 + o / this.a, u = a * a / this.a / this.a + l * l, f = l;
      var v;
      for (h = ar; h; --h)
        if (v = Math.tan(f), _ = -1 * (l * (f * v + 1) - f - 0.5 * (f * f + u) * v) / ((f - l) / v - 1), f += _, Math.abs(_) <= I) {
          s = f;
          break;
        }
      i = N(this.long0 + Math.asin(a * Math.tan(f) / this.a) / Math.sin(s), this.over);
    }
  else if (Math.abs(o + this.ml0) <= I)
    s = 0, i = N(this.long0 + a / this.a, this.over);
  else {
    l = (this.ml0 + o) / this.a, u = a * a / this.a / this.a + l * l, f = l;
    var m, p, M, w, x;
    for (h = ar; h; --h)
      if (x = this.e * Math.sin(f), m = Math.sqrt(1 - x * x) * Math.tan(f), p = this.a * Mt(this.e0, this.e1, this.e2, this.e3, f), M = this.e0 - 2 * this.e1 * Math.cos(2 * f) + 4 * this.e2 * Math.cos(4 * f) - 6 * this.e3 * Math.cos(6 * f), w = p / this.a, _ = (l * (m * w + 1) - w - 0.5 * m * (w * w + u)) / (this.es * Math.sin(2 * f) * (w * w + u - 2 * l * w) / (4 * m) + (l - w) * (m * M - 2 / Math.sin(2 * f)) - M), f -= _, Math.abs(_) <= I) {
        s = f;
        break;
      }
    m = Math.sqrt(1 - this.es * Math.pow(Math.sin(s), 2)) * Math.tan(s), i = N(this.long0 + Math.asin(a * m / this.a) / Math.sin(s), this.over);
  }
  return e.x = i, e.y = s, e;
}
var Vc = ["Polyconic", "American_Polyconic", "poly"];
const Kc = {
  init: Wc,
  forward: Xc,
  inverse: Yc,
  names: Vc
};
function $c() {
  this.A = [], this.A[1] = 0.6399175073, this.A[2] = -0.1358797613, this.A[3] = 0.063294409, this.A[4] = -0.02526853, this.A[5] = 0.0117879, this.A[6] = -55161e-7, this.A[7] = 26906e-7, this.A[8] = -1333e-6, this.A[9] = 67e-5, this.A[10] = -34e-5, this.B_re = [], this.B_im = [], this.B_re[1] = 0.7557853228, this.B_im[1] = 0, this.B_re[2] = 0.249204646, this.B_im[2] = 3371507e-9, this.B_re[3] = -1541739e-9, this.B_im[3] = 0.04105856, this.B_re[4] = -0.10162907, this.B_im[4] = 0.01727609, this.B_re[5] = -0.26623489, this.B_im[5] = -0.36249218, this.B_re[6] = -0.6870983, this.B_im[6] = -1.1651967, this.C_re = [], this.C_im = [], this.C_re[1] = 1.3231270439, this.C_im[1] = 0, this.C_re[2] = -0.577245789, this.C_im[2] = -7809598e-9, this.C_re[3] = 0.508307513, this.C_im[3] = -0.112208952, this.C_re[4] = -0.15094762, this.C_im[4] = 0.18200602, this.C_re[5] = 1.01418179, this.C_im[5] = 1.64497696, this.C_re[6] = 1.9660549, this.C_im[6] = 2.5127645, this.D = [], this.D[1] = 1.5627014243, this.D[2] = 0.5185406398, this.D[3] = -0.03333098, this.D[4] = -0.1052906, this.D[5] = -0.0368594, this.D[6] = 7317e-6, this.D[7] = 0.0122, this.D[8] = 394e-5, this.D[9] = -13e-4;
}
function Jc(e) {
  var i, s = e.x, a = e.y, o = a - this.lat0, h = s - this.long0, l = o / ue * 1e-5, u = h, f = 1, _ = 0;
  for (i = 1; i <= 10; i++)
    f = f * l, _ = _ + this.A[i] * f;
  var v = _, m = u, p = 1, M = 0, w, x, S = 0, E = 0;
  for (i = 1; i <= 6; i++)
    w = p * v - M * m, x = M * v + p * m, p = w, M = x, S = S + this.B_re[i] * p - this.B_im[i] * M, E = E + this.B_im[i] * p + this.B_re[i] * M;
  return e.x = E * this.a + this.x0, e.y = S * this.a + this.y0, e;
}
function Qc(e) {
  var i, s = e.x, a = e.y, o = s - this.x0, h = a - this.y0, l = h / this.a, u = o / this.a, f = 1, _ = 0, v, m, p = 0, M = 0;
  for (i = 1; i <= 6; i++)
    v = f * l - _ * u, m = _ * l + f * u, f = v, _ = m, p = p + this.C_re[i] * f - this.C_im[i] * _, M = M + this.C_im[i] * f + this.C_re[i] * _;
  for (var w = 0; w < this.iterations; w++) {
    var x = p, S = M, E, C, G = l, z = u;
    for (i = 2; i <= 6; i++)
      E = x * p - S * M, C = S * p + x * M, x = E, S = C, G = G + (i - 1) * (this.B_re[i] * x - this.B_im[i] * S), z = z + (i - 1) * (this.B_im[i] * x + this.B_re[i] * S);
    x = 1, S = 0;
    var B = this.B_re[1], D = this.B_im[1];
    for (i = 2; i <= 6; i++)
      E = x * p - S * M, C = S * p + x * M, x = E, S = C, B = B + i * (this.B_re[i] * x - this.B_im[i] * S), D = D + i * (this.B_im[i] * x + this.B_re[i] * S);
    var W = B * B + D * D;
    p = (G * B + z * D) / W, M = (z * B - G * D) / W;
  }
  var et = p, Z = M, X = 1, $ = 0;
  for (i = 1; i <= 9; i++)
    X = X * et, $ = $ + this.D[i] * X;
  var dt = this.lat0 + $ * ue * 1e5, Jt = this.long0 + Z;
  return e.x = Jt, e.y = dt, e;
}
var tf = ["New_Zealand_Map_Grid", "nzmg"];
const ef = {
  init: $c,
  forward: Jc,
  inverse: Qc,
  names: tf
};
function sf() {
}
function nf(e) {
  var i = e.x, s = e.y, a = N(i - this.long0, this.over), o = this.x0 + this.a * a, h = this.y0 + this.a * Math.log(Math.tan(Math.PI / 4 + s / 2.5)) * 1.25;
  return e.x = o, e.y = h, e;
}
function af(e) {
  e.x -= this.x0, e.y -= this.y0;
  var i = N(this.long0 + e.x / this.a, this.over), s = 2.5 * (Math.atan(Math.exp(0.8 * e.y / this.a)) - Math.PI / 4);
  return e.x = i, e.y = s, e;
}
var rf = ["Miller_Cylindrical", "mill"];
const of = {
  init: sf,
  forward: nf,
  inverse: af,
  names: rf
};
var hf = 20;
function lf() {
  this.sphere ? (this.n = 1, this.m = 0, this.es = 0, this.C_y = Math.sqrt((this.m + 1) / this.n), this.C_x = this.C_y / (this.m + 1)) : this.en = ln(this.es);
}
function uf(e) {
  var i, s, a = e.x, o = e.y;
  if (a = N(a - this.long0, this.over), this.sphere) {
    if (!this.m)
      o = this.n !== 1 ? Math.asin(this.n * Math.sin(o)) : o;
    else
      for (var h = this.n * Math.sin(o), l = hf; l; --l) {
        var u = (this.m * o + Math.sin(o) - h) / (this.m + Math.cos(o));
        if (o -= u, Math.abs(u) < I)
          break;
      }
    i = this.a * this.C_x * a * (this.m + Math.cos(o)), s = this.a * this.C_y * o;
  } else {
    var f = Math.sin(o), _ = Math.cos(o);
    s = this.a * Ri(o, f, _, this.en), i = this.a * a * _ / Math.sqrt(1 - this.es * f * f);
  }
  return e.x = i, e.y = s, e;
}
function cf(e) {
  var i, s, a, o;
  return e.x -= this.x0, a = e.x / this.a, e.y -= this.y0, i = e.y / this.a, this.sphere ? (i /= this.C_y, a = a / (this.C_x * (this.m + Math.cos(i))), this.m ? i = ri((this.m * i + Math.sin(i)) / this.n) : this.n !== 1 && (i = ri(Math.sin(i) / this.n)), a = N(a + this.long0, this.over), i = oi(i)) : (i = un(e.y / this.a, this.es, this.en), o = Math.abs(i), o < A ? (o = Math.sin(i), s = this.long0 + e.x * Math.sqrt(1 - this.es * o * o) / (this.a * Math.cos(i)), a = N(s, this.over)) : o - I < A && (a = this.long0)), e.x = a, e.y = i, e;
}
var ff = ["Sinusoidal", "sinu"];
const df = {
  init: lf,
  forward: uf,
  inverse: cf,
  names: ff
};
function _f() {
  this.x0 = this.x0 !== void 0 ? this.x0 : 0, this.y0 = this.y0 !== void 0 ? this.y0 : 0, this.long0 = this.long0 !== void 0 ? this.long0 : 0;
}
function mf(e) {
  for (var i = e.x, s = e.y, a = N(i - this.long0, this.over), o = s, h = Math.PI * Math.sin(s); ; ) {
    var l = -(o + Math.sin(o) - h) / (1 + Math.cos(o));
    if (o += l, Math.abs(l) < I)
      break;
  }
  o /= 2, Math.PI / 2 - Math.abs(s) < I && (a = 0);
  var u = 0.900316316158 * this.a * a * Math.cos(o) + this.x0, f = 1.4142135623731 * this.a * Math.sin(o) + this.y0;
  return e.x = u, e.y = f, e;
}
function gf(e) {
  var i, s;
  e.x -= this.x0, e.y -= this.y0, s = e.y / (1.4142135623731 * this.a), Math.abs(s) > 0.999999999999 && (s = 0.999999999999), i = Math.asin(s);
  var a = N(this.long0 + e.x / (0.900316316158 * this.a * Math.cos(i)), this.over);
  a < -Math.PI && (a = -Math.PI), a > Math.PI && (a = Math.PI), s = (2 * i + Math.sin(2 * i)) / Math.PI, Math.abs(s) > 1 && (s = 1);
  var o = Math.asin(s);
  return e.x = a, e.y = o, e;
}
var pf = ["Mollweide", "moll"];
const vf = {
  init: _f,
  forward: mf,
  inverse: gf,
  names: pf
};
function yf() {
  Math.abs(this.lat1 + this.lat2) < I || (this.lat2 = this.lat2 || this.lat1, this.temp = this.b / this.a, this.es = 1 - Math.pow(this.temp, 2), this.e = Math.sqrt(this.es), this.e0 = Me(this.es), this.e1 = we(this.es), this.e2 = xe(this.es), this.e3 = Pe(this.es), this.sin_phi = Math.sin(this.lat1), this.cos_phi = Math.cos(this.lat1), this.ms1 = Ht(this.e, this.sin_phi, this.cos_phi), this.ml1 = Mt(this.e0, this.e1, this.e2, this.e3, this.lat1), Math.abs(this.lat1 - this.lat2) < I ? this.ns = this.sin_phi : (this.sin_phi = Math.sin(this.lat2), this.cos_phi = Math.cos(this.lat2), this.ms2 = Ht(this.e, this.sin_phi, this.cos_phi), this.ml2 = Mt(this.e0, this.e1, this.e2, this.e3, this.lat2), this.ns = (this.ms1 - this.ms2) / (this.ml2 - this.ml1)), this.g = this.ml1 + this.ms1 / this.ns, this.ml0 = Mt(this.e0, this.e1, this.e2, this.e3, this.lat0), this.rh = this.a * (this.g - this.ml0));
}
function Mf(e) {
  var i = e.x, s = e.y, a;
  if (this.sphere)
    a = this.a * (this.g - s);
  else {
    var o = Mt(this.e0, this.e1, this.e2, this.e3, s);
    a = this.a * (this.g - o);
  }
  var h = this.ns * N(i - this.long0, this.over), l = this.x0 + a * Math.sin(h), u = this.y0 + this.rh - a * Math.cos(h);
  return e.x = l, e.y = u, e;
}
function wf(e) {
  e.x -= this.x0, e.y = this.rh - e.y + this.y0;
  var i, s, a, o;
  this.ns >= 0 ? (s = Math.sqrt(e.x * e.x + e.y * e.y), i = 1) : (s = -Math.sqrt(e.x * e.x + e.y * e.y), i = -1);
  var h = 0;
  if (s !== 0 && (h = Math.atan2(i * e.x, i * e.y)), this.sphere)
    return o = N(this.long0 + h / this.ns, this.over), a = oi(this.g - s / this.a), e.x = o, e.y = a, e;
  var l = this.g - s / this.a;
  return a = ss(l, this.e0, this.e1, this.e2, this.e3), o = N(this.long0 + h / this.ns, this.over), e.x = o, e.y = a, e;
}
var xf = ["Equidistant_Conic", "eqdc"];
const Pf = {
  init: yf,
  forward: Mf,
  inverse: wf,
  names: xf
};
function bf() {
  this.R = this.a;
}
function Sf(e) {
  var i = e.x, s = e.y, a = N(i - this.long0, this.over), o, h;
  Math.abs(s) <= I && (o = this.x0 + this.R * a, h = this.y0);
  var l = ri(2 * Math.abs(s / Math.PI));
  (Math.abs(a) <= I || Math.abs(Math.abs(s) - A) <= I) && (o = this.x0, s >= 0 ? h = this.y0 + Math.PI * this.R * Math.tan(0.5 * l) : h = this.y0 + Math.PI * this.R * -Math.tan(0.5 * l));
  var u = 0.5 * Math.abs(Math.PI / a - a / Math.PI), f = u * u, _ = Math.sin(l), v = Math.cos(l), m = v / (_ + v - 1), p = m * m, M = m * (2 / _ - 1), w = M * M, x = Math.PI * this.R * (u * (m - w) + Math.sqrt(f * (m - w) * (m - w) - (w + f) * (p - w))) / (w + f);
  a < 0 && (x = -x), o = this.x0 + x;
  var S = f + m;
  return x = Math.PI * this.R * (M * S - u * Math.sqrt((w + f) * (f + 1) - S * S)) / (w + f), s >= 0 ? h = this.y0 + x : h = this.y0 - x, e.x = o, e.y = h, e;
}
function Ef(e) {
  var i, s, a, o, h, l, u, f, _, v, m, p, M;
  return e.x -= this.x0, e.y -= this.y0, m = Math.PI * this.R, a = e.x / m, o = e.y / m, h = a * a + o * o, l = -Math.abs(o) * (1 + h), u = l - 2 * o * o + a * a, f = -2 * l + 1 + 2 * o * o + h * h, M = o * o / f + (2 * u * u * u / f / f / f - 9 * l * u / f / f) / 27, _ = (l - u * u / 3 / f) / f, v = 2 * Math.sqrt(-_ / 3), m = 3 * M / _ / v, Math.abs(m) > 1 && (m >= 0 ? m = 1 : m = -1), p = Math.acos(m) / 3, e.y >= 0 ? s = (-v * Math.cos(p + Math.PI / 3) - u / 3 / f) * Math.PI : s = -(-v * Math.cos(p + Math.PI / 3) - u / 3 / f) * Math.PI, Math.abs(a) < I ? i = this.long0 : i = N(this.long0 + Math.PI * (h - 1 + Math.sqrt(1 + 2 * (a * a - o * o) + h * h)) / 2 / a, this.over), e.x = i, e.y = s, e;
}
var Tf = ["Van_der_Grinten_I", "VanDerGrinten", "Van_der_Grinten", "vandg"];
const Af = {
  init: bf,
  forward: Sf,
  inverse: Ef,
  names: Tf
};
function Lf(e, i, s, a, o, h) {
  const l = a - i, u = Math.atan((1 - h) * Math.tan(e)), f = Math.atan((1 - h) * Math.tan(s)), _ = Math.sin(u), v = Math.cos(u), m = Math.sin(f), p = Math.cos(f);
  let M = l, w, x = 100, S, E, C, G, z, B, D, W, et, Z, X, $, dt, Jt;
  do {
    if (S = Math.sin(M), E = Math.cos(M), C = Math.sqrt(
      p * S * (p * S) + (v * m - _ * p * E) * (v * m - _ * p * E)
    ), C === 0)
      return { azi1: 0, s12: 0 };
    G = _ * m + v * p * E, z = Math.atan2(C, G), B = v * p * S / C, D = 1 - B * B, W = D !== 0 ? G - 2 * _ * m / D : 0, et = h / 16 * D * (4 + h * (4 - 3 * D)), w = M, M = l + (1 - et) * h * B * (z + et * C * (W + et * G * (-1 + 2 * W * W)));
  } while (Math.abs(M - w) > 1e-12 && --x > 0);
  return x === 0 ? { azi1: NaN, s12: NaN } : (Z = D * (o * o - o * (1 - h) * (o * (1 - h))) / (o * (1 - h) * (o * (1 - h))), X = 1 + Z / 16384 * (4096 + Z * (-768 + Z * (320 - 175 * Z))), $ = Z / 1024 * (256 + Z * (-128 + Z * (74 - 47 * Z))), dt = $ * C * (W + $ / 4 * (G * (-1 + 2 * W * W) - $ / 6 * W * (-3 + 4 * C * C) * (-3 + 4 * W * W))), Jt = o * (1 - h) * X * (z - dt), { azi1: Math.atan2(p * S, v * m - _ * p * E), s12: Jt });
}
function Cf(e, i, s, a, o, h) {
  const l = Math.atan((1 - h) * Math.tan(e)), u = Math.sin(l), f = Math.cos(l), _ = Math.sin(s), v = Math.cos(s), m = Math.atan2(u, f * v), p = f * _, M = 1 - p * p, w = M * (o * o - o * (1 - h) * (o * (1 - h))) / (o * (1 - h) * (o * (1 - h))), x = 1 + w / 16384 * (4096 + w * (-768 + w * (320 - 175 * w))), S = w / 1024 * (256 + w * (-128 + w * (74 - 47 * w)));
  let E = a / (o * (1 - h) * x), C, G = 100, z, B, D, W;
  do
    z = Math.cos(2 * m + E), B = Math.sin(E), D = Math.cos(E), W = S * B * (z + S / 4 * (D * (-1 + 2 * z * z) - S / 6 * z * (-3 + 4 * B * B) * (-3 + 4 * z * z))), C = E, E = a / (o * (1 - h) * x) + W;
  while (Math.abs(E - C) > 1e-12 && --G > 0);
  if (G === 0)
    return { lat2: NaN, lon2: NaN };
  const et = u * B - f * D * v, Z = Math.atan2(
    u * D + f * B * v,
    (1 - h) * Math.sqrt(p * p + et * et)
  ), X = Math.atan2(
    B * _,
    f * D - u * B * v
  ), $ = h / 16 * M * (4 + h * (4 - 3 * M)), dt = X - (1 - $) * h * p * (E + $ * B * (z + $ * D * (-1 + 2 * z * z))), Jt = i + dt;
  return { lat2: Z, lon2: Jt };
}
function If() {
  this.sin_p12 = Math.sin(this.lat0), this.cos_p12 = Math.cos(this.lat0), this.f = this.es / (1 + Math.sqrt(1 - this.es));
}
function Gf(e) {
  var i = e.x, s = e.y, a = Math.sin(e.y), o = Math.cos(e.y), h = N(i - this.long0, this.over), l, u, f, _, v, m, p, M, w, x, S;
  return this.sphere ? Math.abs(this.sin_p12 - 1) <= I ? (e.x = this.x0 + this.a * (A - s) * Math.sin(h), e.y = this.y0 - this.a * (A - s) * Math.cos(h), e) : Math.abs(this.sin_p12 + 1) <= I ? (e.x = this.x0 + this.a * (A + s) * Math.sin(h), e.y = this.y0 + this.a * (A + s) * Math.cos(h), e) : (w = this.sin_p12 * a + this.cos_p12 * o * Math.cos(h), p = Math.acos(w), M = p ? p / Math.sin(p) : 1, e.x = this.x0 + this.a * M * o * Math.sin(h), e.y = this.y0 + this.a * M * (this.cos_p12 * a - this.sin_p12 * o * Math.cos(h)), e) : (l = Me(this.es), u = we(this.es), f = xe(this.es), _ = Pe(this.es), Math.abs(this.sin_p12 - 1) <= I ? (v = this.a * Mt(l, u, f, _, A), m = this.a * Mt(l, u, f, _, s), e.x = this.x0 + (v - m) * Math.sin(h), e.y = this.y0 - (v - m) * Math.cos(h), e) : Math.abs(this.sin_p12 + 1) <= I ? (v = this.a * Mt(l, u, f, _, A), m = this.a * Mt(l, u, f, _, s), e.x = this.x0 + (v + m) * Math.sin(h), e.y = this.y0 + (v + m) * Math.cos(h), e) : Math.abs(i) < I && Math.abs(s - this.lat0) < I ? (e.x = e.y = 0, e) : (x = Lf(this.lat0, this.long0, s, i, this.a, this.f), S = x.azi1, e.x = x.s12 * Math.sin(S), e.y = x.s12 * Math.cos(S), e));
}
function Nf(e) {
  e.x -= this.x0, e.y -= this.y0;
  var i, s, a, o, h, l, u, f, _, v, m, p, M, w, x, S;
  return this.sphere ? (i = Math.sqrt(e.x * e.x + e.y * e.y), i > 2 * A * this.a ? void 0 : (s = i / this.a, a = Math.sin(s), o = Math.cos(s), h = this.long0, Math.abs(i) <= I ? l = this.lat0 : (l = ri(o * this.sin_p12 + e.y * a * this.cos_p12 / i), u = Math.abs(this.lat0) - A, Math.abs(u) <= I ? this.lat0 >= 0 ? h = N(this.long0 + Math.atan2(e.x, -e.y), this.over) : h = N(this.long0 - Math.atan2(-e.x, e.y), this.over) : h = N(this.long0 + Math.atan2(e.x * a, i * this.cos_p12 * o - e.y * this.sin_p12 * a), this.over)), e.x = h, e.y = l, e)) : (f = Me(this.es), _ = we(this.es), v = xe(this.es), m = Pe(this.es), Math.abs(this.sin_p12 - 1) <= I ? (p = this.a * Mt(f, _, v, m, A), i = Math.sqrt(e.x * e.x + e.y * e.y), M = p - i, l = ss(M / this.a, f, _, v, m), h = N(this.long0 + Math.atan2(e.x, -1 * e.y), this.over), e.x = h, e.y = l, e) : Math.abs(this.sin_p12 + 1) <= I ? (p = this.a * Mt(f, _, v, m, A), i = Math.sqrt(e.x * e.x + e.y * e.y), M = i - p, l = ss(M / this.a, f, _, v, m), h = N(this.long0 + Math.atan2(e.x, e.y), this.over), e.x = h, e.y = l, e) : (w = Math.atan2(e.x, e.y), x = Math.sqrt(e.x * e.x + e.y * e.y), S = Cf(this.lat0, this.long0, w, x, this.a, this.f), e.x = S.lon2, e.y = S.lat2, e));
}
var Of = ["Azimuthal_Equidistant", "aeqd"];
const zf = {
  init: If,
  forward: Gf,
  inverse: Nf,
  names: Of
};
function Rf() {
  this.sin_p14 = Math.sin(this.lat0 || 0), this.cos_p14 = Math.cos(this.lat0 || 0);
}
function Bf(e) {
  var i, s, a, o, h, l, u, f, _ = e.x, v = e.y;
  return a = N(_ - (this.long0 || 0), this.over), i = Math.sin(v), s = Math.cos(v), o = Math.cos(a), l = this.sin_p14 * i + this.cos_p14 * s * o, h = 1, (l > 0 || Math.abs(l) <= I) && (u = this.a * h * s * Math.sin(a), f = (this.y0 || 0) + this.a * h * (this.cos_p14 * i - this.sin_p14 * s * o)), e.x = u, e.y = f, e;
}
function kf(e) {
  var i, s, a, o, h, l, u, f, _;
  return e.x -= this.x0 || 0, e.y -= this.y0 || 0, i = Math.sqrt(e.x * e.x + e.y * e.y), s = ri(i / this.a), a = Math.sin(s), o = Math.cos(s), f = this.long0 || 0, _ = this.lat0 || 0, l = f, Math.abs(i) <= I ? (u = _, e.x = l, e.y = u, e) : (u = ri(o * this.sin_p14 + e.y * a * this.cos_p14 / i), h = Math.abs(_) - A, Math.abs(h) <= I ? (_ >= 0 ? l = N(f + Math.atan2(e.x, -e.y), this.over) : l = N(f - Math.atan2(-e.x, e.y), this.over), e.x = l, e.y = u, e) : (l = N(f + Math.atan2(e.x * a, i * this.cos_p14 * o - e.y * this.sin_p14 * a), this.over), e.x = l, e.y = u, e));
}
var Df = ["ortho"];
const Zf = {
  init: Rf,
  forward: Bf,
  inverse: kf,
  names: Df
};
var rt = {
  FRONT: 1,
  RIGHT: 2,
  BACK: 3,
  LEFT: 4,
  TOP: 5,
  BOTTOM: 6
}, Q = {
  AREA_0: 1,
  AREA_1: 2,
  AREA_2: 3,
  AREA_3: 4
};
function Ff() {
  this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, this.lat0 = this.lat0 || 0, this.long0 = this.long0 || 0, this.lat_ts = this.lat_ts || 0, this.title = this.title || "Quadrilateralized Spherical Cube", this.lat0 >= A - J / 2 ? this.face = rt.TOP : this.lat0 <= -(A - J / 2) ? this.face = rt.BOTTOM : Math.abs(this.long0) <= J ? this.face = rt.FRONT : Math.abs(this.long0) <= A + J ? this.face = this.long0 > 0 ? rt.RIGHT : rt.LEFT : this.face = rt.BACK, this.es !== 0 && (this.one_minus_f = 1 - (this.a - this.b) / this.a, this.one_minus_f_squared = this.one_minus_f * this.one_minus_f);
}
function Uf(e) {
  var i = { x: 0, y: 0 }, s, a, o, h, l, u, f = { value: 0 };
  if (e.x -= this.long0, this.es !== 0 ? s = Math.atan(this.one_minus_f_squared * Math.tan(e.y)) : s = e.y, a = e.x, this.face === rt.TOP)
    h = A - s, a >= J && a <= A + J ? (f.value = Q.AREA_0, o = a - A) : a > A + J || a <= -(A + J) ? (f.value = Q.AREA_1, o = a > 0 ? a - lt : a + lt) : a > -(A + J) && a <= -J ? (f.value = Q.AREA_2, o = a + A) : (f.value = Q.AREA_3, o = a);
  else if (this.face === rt.BOTTOM)
    h = A + s, a >= J && a <= A + J ? (f.value = Q.AREA_0, o = -a + A) : a < J && a >= -J ? (f.value = Q.AREA_1, o = -a) : a < -J && a >= -(A + J) ? (f.value = Q.AREA_2, o = -a - A) : (f.value = Q.AREA_3, o = a > 0 ? -a + lt : -a - lt);
  else {
    var _, v, m, p, M, w, x;
    this.face === rt.RIGHT ? a = Ni(a, +A) : this.face === rt.BACK ? a = Ni(a, +lt) : this.face === rt.LEFT && (a = Ni(a, -A)), p = Math.sin(s), M = Math.cos(s), w = Math.sin(a), x = Math.cos(a), _ = M * x, v = M * w, m = p, this.face === rt.FRONT ? (h = Math.acos(_), o = Xe(h, m, v, f)) : this.face === rt.RIGHT ? (h = Math.acos(v), o = Xe(h, m, -_, f)) : this.face === rt.BACK ? (h = Math.acos(-_), o = Xe(h, m, -v, f)) : this.face === rt.LEFT ? (h = Math.acos(-v), o = Xe(h, m, _, f)) : (h = o = 0, f.value = Q.AREA_0);
  }
  return u = Math.atan(12 / lt * (o + Math.acos(Math.sin(o) * Math.cos(J)) - A)), l = Math.sqrt((1 - Math.cos(h)) / (Math.cos(u) * Math.cos(u)) / (1 - Math.cos(Math.atan(1 / Math.cos(o))))), f.value === Q.AREA_1 ? u += A : f.value === Q.AREA_2 ? u += lt : f.value === Q.AREA_3 && (u += 1.5 * lt), i.x = l * Math.cos(u), i.y = l * Math.sin(u), i.x = i.x * this.a + this.x0, i.y = i.y * this.a + this.y0, e.x = i.x, e.y = i.y, e;
}
function qf(e) {
  var i = { lam: 0, phi: 0 }, s, a, o, h, l, u, f, _, v, m = { value: 0 };
  if (e.x = (e.x - this.x0) / this.a, e.y = (e.y - this.y0) / this.a, a = Math.atan(Math.sqrt(e.x * e.x + e.y * e.y)), s = Math.atan2(e.y, e.x), e.x >= 0 && e.x >= Math.abs(e.y) ? m.value = Q.AREA_0 : e.y >= 0 && e.y >= Math.abs(e.x) ? (m.value = Q.AREA_1, s -= A) : e.x < 0 && -e.x >= Math.abs(e.y) ? (m.value = Q.AREA_2, s = s < 0 ? s + lt : s - lt) : (m.value = Q.AREA_3, s += A), v = lt / 12 * Math.tan(s), l = Math.sin(v) / (Math.cos(v) - 1 / Math.sqrt(2)), u = Math.atan(l), o = Math.cos(s), h = Math.tan(a), f = 1 - o * o * h * h * (1 - Math.cos(Math.atan(1 / Math.cos(u)))), f < -1 ? f = -1 : f > 1 && (f = 1), this.face === rt.TOP)
    _ = Math.acos(f), i.phi = A - _, m.value === Q.AREA_0 ? i.lam = u + A : m.value === Q.AREA_1 ? i.lam = u < 0 ? u + lt : u - lt : m.value === Q.AREA_2 ? i.lam = u - A : i.lam = u;
  else if (this.face === rt.BOTTOM)
    _ = Math.acos(f), i.phi = _ - A, m.value === Q.AREA_0 ? i.lam = -u + A : m.value === Q.AREA_1 ? i.lam = -u : m.value === Q.AREA_2 ? i.lam = -u - A : i.lam = u < 0 ? -u - lt : -u + lt;
  else {
    var p, M, w;
    p = f, v = p * p, v >= 1 ? w = 0 : w = Math.sqrt(1 - v) * Math.sin(u), v += w * w, v >= 1 ? M = 0 : M = Math.sqrt(1 - v), m.value === Q.AREA_1 ? (v = M, M = -w, w = v) : m.value === Q.AREA_2 ? (M = -M, w = -w) : m.value === Q.AREA_3 && (v = M, M = w, w = -v), this.face === rt.RIGHT ? (v = p, p = -M, M = v) : this.face === rt.BACK ? (p = -p, M = -M) : this.face === rt.LEFT && (v = p, p = M, M = -v), i.phi = Math.acos(-w) - A, i.lam = Math.atan2(M, p), this.face === rt.RIGHT ? i.lam = Ni(i.lam, -A) : this.face === rt.BACK ? i.lam = Ni(i.lam, -lt) : this.face === rt.LEFT && (i.lam = Ni(i.lam, +A));
  }
  if (this.es !== 0) {
    var x, S, E;
    x = i.phi < 0 ? 1 : 0, S = Math.tan(i.phi), E = this.b / Math.sqrt(S * S + this.one_minus_f_squared), i.phi = Math.atan(Math.sqrt(this.a * this.a - E * E) / (this.one_minus_f * E)), x && (i.phi = -i.phi);
  }
  return i.lam += this.long0, e.x = i.lam, e.y = i.phi, e;
}
function Xe(e, i, s, a) {
  var o;
  return e < I ? (a.value = Q.AREA_0, o = 0) : (o = Math.atan2(i, s), Math.abs(o) <= J ? a.value = Q.AREA_0 : o > J && o <= A + J ? (a.value = Q.AREA_1, o -= A) : o > A + J || o <= -(A + J) ? (a.value = Q.AREA_2, o = o >= 0 ? o - lt : o + lt) : (a.value = Q.AREA_3, o += A)), o;
}
function Ni(e, i) {
  var s = e + i;
  return s < -lt ? s += me : s > +lt && (s -= me), s;
}
var jf = ["Quadrilateralized Spherical Cube", "Quadrilateralized_Spherical_Cube", "qsc"];
const Hf = {
  init: Ff,
  forward: Uf,
  inverse: qf,
  names: jf
};
var nn = [
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
], he = [
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
], Nr = 0.8487, Or = 1.3523, zr = Et / 5, Wf = 1 / zr, Ii = 18, ns = function(e, i) {
  return e[0] + i * (e[1] + i * (e[2] + i * e[3]));
}, Xf = function(e, i) {
  return e[1] + i * (2 * e[2] + i * 3 * e[3]);
};
function Yf(e, i, s, a) {
  for (var o = i; a; --a) {
    var h = e(o);
    if (o -= h, Math.abs(h) < s)
      break;
  }
  return o;
}
function Vf() {
  this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, this.long0 = this.long0 || 0, this.es = 0, this.title = this.title || "Robinson";
}
function Kf(e) {
  var i = N(e.x - this.long0, this.over), s = Math.abs(e.y), a = Math.floor(s * zr);
  a < 0 ? a = 0 : a >= Ii && (a = Ii - 1), s = Et * (s - Wf * a);
  var o = {
    x: ns(nn[a], s) * i,
    y: ns(he[a], s)
  };
  return e.y < 0 && (o.y = -o.y), o.x = o.x * this.a * Nr + this.x0, o.y = o.y * this.a * Or + this.y0, o;
}
function $f(e) {
  var i = {
    x: (e.x - this.x0) / (this.a * Nr),
    y: Math.abs(e.y - this.y0) / (this.a * Or)
  };
  if (i.y >= 1)
    i.x /= nn[Ii][0], i.y = e.y < 0 ? -A : A;
  else {
    var s = Math.floor(i.y * Ii);
    for (s < 0 ? s = 0 : s >= Ii && (s = Ii - 1); ; )
      if (he[s][0] > i.y)
        --s;
      else if (he[s + 1][0] <= i.y)
        ++s;
      else
        break;
    var a = he[s], o = 5 * (i.y - a[0]) / (he[s + 1][0] - a[0]);
    o = Yf(function(h) {
      return (ns(a, h) - i.y) / Xf(a, h);
    }, o, I, 100), i.x /= ns(nn[s], o), i.y = (5 * s + o) * ot, e.y < 0 && (i.y = -i.y);
  }
  return i.x = N(i.x + this.long0, this.over), i;
}
var Jf = ["Robinson", "robin"];
const Qf = {
  init: Vf,
  forward: Kf,
  inverse: $f,
  names: Jf
};
function td() {
  this.name = "geocent";
}
function id(e) {
  var i = xr(e, this.es, this.a);
  return i;
}
function ed(e) {
  var i = Pr(e, this.es, this.a, this.b);
  return i;
}
var sd = ["Geocentric", "geocentric", "geocent", "Geocent"];
const nd = {
  init: td,
  forward: id,
  inverse: ed,
  names: sd
};
var pt = {
  N_POLE: 0,
  S_POLE: 1,
  EQUIT: 2,
  OBLIQ: 3
}, te = {
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
function ad() {
  if (Object.keys(te).forEach((function(s) {
    if (typeof this[s] > "u")
      this[s] = te[s].def;
    else {
      if (te[s].num && isNaN(this[s]))
        throw new Error("Invalid parameter value, must be numeric " + s + " = " + this[s]);
      te[s].num && (this[s] = parseFloat(this[s]));
    }
    te[s].degrees && (this[s] = this[s] * ot);
  }).bind(this)), Math.abs(Math.abs(this.lat0) - A) < I ? this.mode = this.lat0 < 0 ? pt.S_POLE : pt.N_POLE : Math.abs(this.lat0) < I ? this.mode = pt.EQUIT : (this.mode = pt.OBLIQ, this.sinph0 = Math.sin(this.lat0), this.cosph0 = Math.cos(this.lat0)), this.pn1 = this.h / this.a, this.pn1 <= 0 || this.pn1 > 1e10)
    throw new Error("Invalid height");
  this.p = 1 + this.pn1, this.rp = 1 / this.p, this.h1 = 1 / this.pn1, this.pfact = (this.p + 1) * this.h1, this.es = 0;
  var e = this.tilt, i = this.azi;
  this.cg = Math.cos(i), this.sg = Math.sin(i), this.cw = Math.cos(e), this.sw = Math.sin(e);
}
function rd(e) {
  e.x -= this.long0;
  var i = Math.sin(e.y), s = Math.cos(e.y), a = Math.cos(e.x), o, h;
  switch (this.mode) {
    case pt.OBLIQ:
      h = this.sinph0 * i + this.cosph0 * s * a;
      break;
    case pt.EQUIT:
      h = s * a;
      break;
    case pt.S_POLE:
      h = -i;
      break;
    case pt.N_POLE:
      h = i;
      break;
  }
  switch (h = this.pn1 / (this.p - h), o = h * s * Math.sin(e.x), this.mode) {
    case pt.OBLIQ:
      h *= this.cosph0 * i - this.sinph0 * s * a;
      break;
    case pt.EQUIT:
      h *= i;
      break;
    case pt.N_POLE:
      h *= -(s * a);
      break;
    case pt.S_POLE:
      h *= s * a;
      break;
  }
  var l, u;
  return l = h * this.cg + o * this.sg, u = 1 / (l * this.sw * this.h1 + this.cw), o = (o * this.cg - h * this.sg) * this.cw * u, h = l * u, e.x = o * this.a, e.y = h * this.a, e;
}
function od(e) {
  e.x /= this.a, e.y /= this.a;
  var i = { x: e.x, y: e.y }, s, a, o;
  o = 1 / (this.pn1 - e.y * this.sw), s = this.pn1 * e.x * o, a = this.pn1 * e.y * this.cw * o, e.x = s * this.cg + a * this.sg, e.y = a * this.cg - s * this.sg;
  var h = St(e.x, e.y);
  if (Math.abs(h) < I)
    i.x = 0, i.y = e.y;
  else {
    var l, u;
    switch (u = 1 - h * h * this.pfact, u = (this.p - Math.sqrt(u)) / (this.pn1 / h + h / this.pn1), l = Math.sqrt(1 - u * u), this.mode) {
      case pt.OBLIQ:
        i.y = Math.asin(l * this.sinph0 + e.y * u * this.cosph0 / h), e.y = (l - this.sinph0 * Math.sin(i.y)) * h, e.x *= u * this.cosph0;
        break;
      case pt.EQUIT:
        i.y = Math.asin(e.y * u / h), e.y = l * h, e.x *= u;
        break;
      case pt.N_POLE:
        i.y = Math.asin(l), e.y = -e.y;
        break;
      case pt.S_POLE:
        i.y = -Math.asin(l);
        break;
    }
    i.x = Math.atan2(e.x, e.y);
  }
  return e.x = i.x + this.long0, e.y = i.y, e;
}
var hd = ["Tilted_Perspective", "tpers"];
const ld = {
  init: ad,
  forward: rd,
  inverse: od,
  names: hd
};
function ud() {
  if (this.flip_axis = this.sweep === "x" ? 1 : 0, this.h = Number(this.h), this.radius_g_1 = this.h / this.a, this.radius_g_1 <= 0 || this.radius_g_1 > 1e10)
    throw new Error();
  if (this.radius_g = 1 + this.radius_g_1, this.C = this.radius_g * this.radius_g - 1, this.es !== 0) {
    var e = 1 - this.es, i = 1 / e;
    this.radius_p = Math.sqrt(e), this.radius_p2 = e, this.radius_p_inv2 = i, this.shape = "ellipse";
  } else
    this.radius_p = 1, this.radius_p2 = 1, this.radius_p_inv2 = 1, this.shape = "sphere";
  this.title || (this.title = "Geostationary Satellite View");
}
function cd(e) {
  var i = e.x, s = e.y, a, o, h, l;
  if (i = i - this.long0, this.shape === "ellipse") {
    s = Math.atan(this.radius_p2 * Math.tan(s));
    var u = this.radius_p / St(this.radius_p * Math.cos(s), Math.sin(s));
    if (o = u * Math.cos(i) * Math.cos(s), h = u * Math.sin(i) * Math.cos(s), l = u * Math.sin(s), (this.radius_g - o) * o - h * h - l * l * this.radius_p_inv2 < 0)
      return e.x = Number.NaN, e.y = Number.NaN, e;
    a = this.radius_g - o, this.flip_axis ? (e.x = this.radius_g_1 * Math.atan(h / St(l, a)), e.y = this.radius_g_1 * Math.atan(l / a)) : (e.x = this.radius_g_1 * Math.atan(h / a), e.y = this.radius_g_1 * Math.atan(l / St(h, a)));
  } else this.shape === "sphere" && (a = Math.cos(s), o = Math.cos(i) * a, h = Math.sin(i) * a, l = Math.sin(s), a = this.radius_g - o, this.flip_axis ? (e.x = this.radius_g_1 * Math.atan(h / St(l, a)), e.y = this.radius_g_1 * Math.atan(l / a)) : (e.x = this.radius_g_1 * Math.atan(h / a), e.y = this.radius_g_1 * Math.atan(l / St(h, a))));
  return e.x = e.x * this.a, e.y = e.y * this.a, e;
}
function fd(e) {
  var i = -1, s = 0, a = 0, o, h, l, u;
  if (e.x = e.x / this.a, e.y = e.y / this.a, this.shape === "ellipse") {
    this.flip_axis ? (a = Math.tan(e.y / this.radius_g_1), s = Math.tan(e.x / this.radius_g_1) * St(1, a)) : (s = Math.tan(e.x / this.radius_g_1), a = Math.tan(e.y / this.radius_g_1) * St(1, s));
    var f = a / this.radius_p;
    if (o = s * s + f * f + i * i, h = 2 * this.radius_g * i, l = h * h - 4 * o * this.C, l < 0)
      return e.x = Number.NaN, e.y = Number.NaN, e;
    u = (-h - Math.sqrt(l)) / (2 * o), i = this.radius_g + u * i, s *= u, a *= u, e.x = Math.atan2(s, i), e.y = Math.atan(a * Math.cos(e.x) / i), e.y = Math.atan(this.radius_p_inv2 * Math.tan(e.y));
  } else if (this.shape === "sphere") {
    if (this.flip_axis ? (a = Math.tan(e.y / this.radius_g_1), s = Math.tan(e.x / this.radius_g_1) * Math.sqrt(1 + a * a)) : (s = Math.tan(e.x / this.radius_g_1), a = Math.tan(e.y / this.radius_g_1) * Math.sqrt(1 + s * s)), o = s * s + a * a + i * i, h = 2 * this.radius_g * i, l = h * h - 4 * o * this.C, l < 0)
      return e.x = Number.NaN, e.y = Number.NaN, e;
    u = (-h - Math.sqrt(l)) / (2 * o), i = this.radius_g + u * i, s *= u, a *= u, e.x = Math.atan2(s, i), e.y = Math.atan(a * Math.cos(e.x) / i);
  }
  return e.x = e.x + this.long0, e;
}
var dd = ["Geostationary Satellite View", "Geostationary_Satellite", "geos"];
const _d = {
  init: ud,
  forward: cd,
  inverse: fd,
  names: dd
};
var ce = 1.340264, fe = -0.081106, de = 893e-6, _e = 3796e-6, as = Math.sqrt(3) / 2;
function md() {
  this.es = 0, this.long0 = this.long0 !== void 0 ? this.long0 : 0, this.x0 = this.x0 !== void 0 ? this.x0 : 0, this.y0 = this.y0 !== void 0 ? this.y0 : 0;
}
function gd(e) {
  var i = N(e.x - this.long0, this.over), s = e.y, a = Math.asin(as * Math.sin(s)), o = a * a, h = o * o * o;
  return e.x = i * Math.cos(a) / (as * (ce + 3 * fe * o + h * (7 * de + 9 * _e * o))), e.y = a * (ce + fe * o + h * (de + _e * o)), e.x = this.a * e.x + this.x0, e.y = this.a * e.y + this.y0, e;
}
function pd(e) {
  e.x = (e.x - this.x0) / this.a, e.y = (e.y - this.y0) / this.a;
  var i = 1e-9, s = 12, a = e.y, o, h, l, u, f, _;
  for (_ = 0; _ < s && (o = a * a, h = o * o * o, l = a * (ce + fe * o + h * (de + _e * o)) - e.y, u = ce + 3 * fe * o + h * (7 * de + 9 * _e * o), a -= f = l / u, !(Math.abs(f) < i)); ++_)
    ;
  return o = a * a, h = o * o * o, e.x = as * e.x * (ce + 3 * fe * o + h * (7 * de + 9 * _e * o)) / Math.cos(a), e.y = Math.asin(Math.sin(a) / as), e.x = N(e.x + this.long0, this.over), e;
}
var vd = ["eqearth", "Equal Earth", "Equal_Earth"];
const yd = {
  init: md,
  forward: gd,
  inverse: pd,
  names: vd
};
var ve = 1e-10;
function Md() {
  var e;
  if (this.phi1 = this.lat1, Math.abs(this.phi1) < ve)
    throw new Error();
  this.es ? (this.en = ln(this.es), this.m1 = Ri(
    this.phi1,
    this.am1 = Math.sin(this.phi1),
    e = Math.cos(this.phi1),
    this.en
  ), this.am1 = e / (Math.sqrt(1 - this.es * this.am1 * this.am1) * this.am1), this.inverse = xd, this.forward = wd) : (Math.abs(this.phi1) + ve >= A ? this.cphi1 = 0 : this.cphi1 = 1 / Math.tan(this.phi1), this.inverse = bd, this.forward = Pd);
}
function wd(e) {
  var i = N(e.x - (this.long0 || 0), this.over), s = e.y, a, o, h;
  return a = this.am1 + this.m1 - Ri(s, o = Math.sin(s), h = Math.cos(s), this.en), o = h * i / (a * Math.sqrt(1 - this.es * o * o)), e.x = a * Math.sin(o), e.y = this.am1 - a * Math.cos(o), e.x = this.a * e.x + (this.x0 || 0), e.y = this.a * e.y + (this.y0 || 0), e;
}
function xd(e) {
  e.x = (e.x - (this.x0 || 0)) / this.a, e.y = (e.y - (this.y0 || 0)) / this.a;
  var i, s, a, o;
  if (s = St(e.x, e.y = this.am1 - e.y), o = un(this.am1 + this.m1 - s, this.es, this.en), (i = Math.abs(o)) < A)
    i = Math.sin(o), a = s * Math.atan2(e.x, e.y) * Math.sqrt(1 - this.es * i * i) / Math.cos(o);
  else if (Math.abs(i - A) <= ve)
    a = 0;
  else
    throw new Error();
  return e.x = N(a + (this.long0 || 0), this.over), e.y = oi(o), e;
}
function Pd(e) {
  var i = N(e.x - (this.long0 || 0), this.over), s = e.y, a, o;
  return o = this.cphi1 + this.phi1 - s, Math.abs(o) > ve ? (e.x = o * Math.sin(a = i * Math.cos(s) / o), e.y = this.cphi1 - o * Math.cos(a)) : e.x = e.y = 0, e.x = this.a * e.x + (this.x0 || 0), e.y = this.a * e.y + (this.y0 || 0), e;
}
function bd(e) {
  e.x = (e.x - (this.x0 || 0)) / this.a, e.y = (e.y - (this.y0 || 0)) / this.a;
  var i, s, a = St(e.x, e.y = this.cphi1 - e.y);
  if (s = this.cphi1 + this.phi1 - a, Math.abs(s) > A)
    throw new Error();
  return Math.abs(Math.abs(s) - A) <= ve ? i = 0 : i = a * Math.atan2(e.x, e.y) / Math.cos(s), e.x = N(i + (this.long0 || 0), this.over), e.y = oi(s), e;
}
var Sd = ["bonne", "Bonne (Werner lat_1=90)"];
const Ed = {
  init: Md,
  names: Sd
}, rr = {
  OBLIQUE: {
    forward: Id,
    inverse: Nd
  },
  TRANSVERSE: {
    forward: Gd,
    inverse: Od
  }
}, rs = {
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
function Td() {
  if (this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, this.long0 = this.long0 || 0, this.title = this.title || "General Oblique Transformation", this.isIdentity = vr.includes(this.o_proj), !this.o_proj)
    throw new Error("Missing parameter: o_proj");
  if (this.o_proj === "ob_tran")
    throw new Error("Invalid value for o_proj: " + this.o_proj);
  const e = this.projStr.replace("+proj=ob_tran", "").replace("+o_proj=", "+proj=").trim(), i = Nt(e);
  if (!i)
    throw new Error("Invalid parameter: o_proj. Unknown projection " + this.o_proj);
  i.long0 = 0, this.obliqueProjection = i;
  let s;
  const a = Object.keys(rs), o = (u) => {
    if (typeof this[u] > "u")
      return;
    const f = parseFloat(this[u]) * ot;
    if (isNaN(f))
      throw new Error("Invalid value for " + u + ": " + this[u]);
    return f;
  };
  for (let u = 0; u < a.length; u++) {
    const f = a[u], _ = rs[f], v = Object.entries(_);
    if (v.some(
      ([p]) => typeof this[p] < "u"
    )) {
      s = _;
      for (let p = 0; p < v.length; p++) {
        const [M, w] = v[p], x = o(M);
        if (typeof x > "u")
          throw new Error("Missing parameter: " + M + ".");
        this[w] = x;
      }
      break;
    }
  }
  if (!s)
    throw new Error("No valid parameters provided for ob_tran projection.");
  const { lamp: h, phip: l } = Cd(this, s);
  this.lamp = h, Math.abs(l) > I ? (this.cphip = Math.cos(l), this.sphip = Math.sin(l), this.projectionType = rr.OBLIQUE) : this.projectionType = rr.TRANSVERSE;
}
function Ad(e) {
  return this.projectionType.forward(this, e);
}
function Ld(e) {
  return this.projectionType.inverse(this, e);
}
function Cd(e, i) {
  let s, a;
  if (i === rs.ROTATE) {
    let o = e.oLongC, h = e.oLatC, l = e.oAlpha;
    if (Math.abs(Math.abs(h) - A) <= I)
      throw new Error("Invalid value for o_lat_c: " + e.o_lat_c + " should be < 90°");
    a = o + Math.atan2(-1 * Math.cos(l), -1 * Math.sin(l) * Math.sin(h)), s = Math.asin(Math.cos(h) * Math.sin(l));
  } else if (i === rs.NEW_POLE)
    a = e.oLongP, s = e.oLatP;
  else {
    let o = e.oLong1, h = e.oLat1, l = e.oLong2, u = e.oLat2, f = Math.abs(h);
    if (Math.abs(h) > A - I)
      throw new Error("Invalid value for o_lat_1: " + e.o_lat_1 + " should be < 90°");
    if (Math.abs(u) > A - I)
      throw new Error("Invalid value for o_lat_2: " + e.o_lat_2 + " should be < 90°");
    if (Math.abs(h - u) < I)
      throw new Error("Invalid value for o_lat_1 and o_lat_2: o_lat_1 should be different from o_lat_2");
    if (f < I)
      throw new Error("Invalid value for o_lat_1: o_lat_1 should be different from zero");
    a = Math.atan2(
      Math.cos(h) * Math.sin(u) * Math.cos(o) - Math.sin(h) * Math.cos(u) * Math.cos(l),
      Math.sin(h) * Math.cos(u) * Math.sin(l) - Math.cos(h) * Math.sin(u) * Math.sin(o)
    ), s = Math.atan(-1 * Math.cos(a - o) / Math.tan(h));
  }
  return { lamp: a, phip: s };
}
function Id(e, i) {
  let { x: s, y: a } = i;
  s += e.long0;
  const o = Math.cos(s), h = Math.sin(a), l = Math.cos(a);
  i.x = N(
    Math.atan2(
      l * Math.sin(s),
      e.sphip * l * o + e.cphip * h
    ) + e.lamp
  ), i.y = Math.asin(
    e.sphip * h - e.cphip * l * o
  );
  const u = e.obliqueProjection.forward(i);
  return e.isIdentity && (u.x *= Et, u.y *= Et), u;
}
function Gd(e, i) {
  let { x: s, y: a } = i;
  s += e.long0;
  const o = Math.cos(a), h = Math.cos(s);
  i.x = N(
    Math.atan2(
      o * Math.sin(s),
      Math.sin(a)
    ) + e.lamp
  ), i.y = Math.asin(-1 * o * h);
  const l = e.obliqueProjection.forward(i);
  return e.isIdentity && (l.x *= Et, l.y *= Et), l;
}
function Nd(e, i) {
  e.isIdentity && (i.x *= ot, i.y *= ot);
  const s = e.obliqueProjection.inverse(i);
  let { x: a, y: o } = s;
  if (a < Number.MAX_VALUE) {
    a -= e.lamp;
    const h = Math.cos(a), l = Math.sin(o), u = Math.cos(o);
    i.x = Math.atan2(
      u * Math.sin(a),
      e.sphip * u * h - e.cphip * l
    ), i.y = Math.asin(
      e.sphip * l + e.cphip * u * h
    );
  }
  return i.x = N(i.x + e.long0), i;
}
function Od(e, i) {
  e.isIdentity && (i.x *= ot, i.y *= ot);
  const s = e.obliqueProjection.inverse(i);
  let { x: a, y: o } = s;
  if (a < Number.MAX_VALUE) {
    const h = Math.cos(o);
    a -= e.lamp, i.x = Math.atan2(
      h * Math.sin(a),
      -1 * Math.sin(o)
    ), i.y = Math.asin(
      h * Math.cos(a)
    );
  }
  return i.x = N(i.x + e.long0), i;
}
var zd = ["General Oblique Transformation", "General_Oblique_Transformation", "ob_tran"];
const Rd = {
  init: Td,
  forward: Ad,
  inverse: Ld,
  names: zd
};
function Bd(e) {
  e.Proj.projections.add(Ke), e.Proj.projections.add($e), e.Proj.projections.add(bu), e.Proj.projections.add(Nu), e.Proj.projections.add(ku), e.Proj.projections.add(qu), e.Proj.projections.add(Vu), e.Proj.projections.add(tc), e.Proj.projections.add(ac), e.Proj.projections.add(uc), e.Proj.projections.add(Pc), e.Proj.projections.add(Lc), e.Proj.projections.add(Oc), e.Proj.projections.add(Zc), e.Proj.projections.add(Hc), e.Proj.projections.add(Kc), e.Proj.projections.add(ef), e.Proj.projections.add(of), e.Proj.projections.add(df), e.Proj.projections.add(vf), e.Proj.projections.add(Pf), e.Proj.projections.add(Af), e.Proj.projections.add(zf), e.Proj.projections.add(Zf), e.Proj.projections.add(Hf), e.Proj.projections.add(Qf), e.Proj.projections.add(nd), e.Proj.projections.add(ld), e.Proj.projections.add(_d), e.Proj.projections.add(yd), e.Proj.projections.add(Ed), e.Proj.projections.add(Rd);
}
const Rr = Object.assign(Fl, {
  defaultDatum: "WGS84",
  Proj: Nt,
  WGS84: new Nt("WGS84"),
  Point: zi,
  toPoint: br,
  defs: gt,
  nadgrid: Pl,
  transform: es,
  mgrs: Ul,
  version: "__VERSION__"
});
Bd(Rr);
const kd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Rr
}, Symbol.toStringTag, { value: "Module" })), Dd = /* @__PURE__ */ gh(kd);
var or;
function Zd() {
  return or || (or = 1, (function(e) {
    (function(i) {
      var s, a;
      s = hr(), a = Dd, e.exports = i(s, a);
    })(function(i, s) {
      return s.__esModule && s.default && (s = s.default), i.Proj = {}, i.Proj._isProj4Obj = function(a) {
        return typeof a.inverse < "u" && typeof a.forward < "u";
      }, i.Proj.Projection = i.Class.extend({
        initialize: function(a, o, h) {
          var l = i.Proj._isProj4Obj(a);
          this._proj = l ? a : this._projFromCodeDef(a, o), this.bounds = l ? o : h;
        },
        project: function(a) {
          var o = this._proj.forward([a.lng, a.lat]);
          return new i.Point(o[0], o[1]);
        },
        unproject: function(a, o) {
          var h = this._proj.inverse([a.x, a.y]);
          return new i.LatLng(h[1], h[0], o);
        },
        _projFromCodeDef: function(a, o) {
          if (o)
            s.defs(a, o);
          else if (s.defs[a] === void 0) {
            var h = a.split(":");
            if (h.length > 3 && (a = h[h.length - 3] + ":" + h[h.length - 1]), s.defs[a] === void 0)
              throw "No projection definition for code " + a;
          }
          return s(a);
        }
      }), i.Proj.CRS = i.Class.extend({
        includes: i.CRS,
        options: {
          transformation: new i.Transformation(1, 0, -1, 0)
        },
        initialize: function(a, o, h) {
          var l, u, f, _;
          if (i.Proj._isProj4Obj(a) ? (u = a, l = u.srsCode, _ = o || {}, this.projection = new i.Proj.Projection(u, _.bounds)) : (l = a, f = o, _ = h || {}, this.projection = new i.Proj.Projection(l, f, _.bounds)), i.Util.setOptions(this, _), this.code = l, this.transformation = this.options.transformation, this.options.origin && (this.transformation = new i.Transformation(
            1,
            -this.options.origin[0],
            -1,
            this.options.origin[1]
          )), this.options.scales)
            this._scales = this.options.scales;
          else if (this.options.resolutions) {
            this._scales = [];
            for (var v = this.options.resolutions.length - 1; v >= 0; v--)
              this.options.resolutions[v] && (this._scales[v] = 1 / this.options.resolutions[v]);
          }
          this.infinite = !this.options.bounds;
        },
        scale: function(a) {
          var o = Math.floor(a), h, l, u, f;
          return a === o ? this._scales[a] : (h = this._scales[o], l = this._scales[o + 1], u = l - h, f = a - o, h + u * f);
        },
        zoom: function(a) {
          var o = this._closestElement(this._scales, a), h = this._scales.indexOf(o), l, u, f;
          return a === o ? h : o === void 0 ? -1 / 0 : (u = h + 1, l = this._scales[u], l === void 0 ? 1 / 0 : (f = l - o, (a - o) / f + h));
        },
        distance: i.CRS.Earth.distance,
        R: i.CRS.Earth.R,
        /* Get the closest lowest element in an array */
        _closestElement: function(a, o) {
          for (var h, l = a.length; l--; )
            a[l] <= o && (h === void 0 || h < a[l]) && (h = a[l]);
          return h;
        }
      }), i.Proj.GeoJSON = i.GeoJSON.extend({
        initialize: function(a, o) {
          this._callLevel = 0, i.GeoJSON.prototype.initialize.call(this, a, o);
        },
        addData: function(a) {
          var o;
          a && (a.crs && a.crs.type === "name" ? o = new i.Proj.CRS(a.crs.properties.name) : a.crs && a.crs.type && (o = new i.Proj.CRS(a.crs.type + ":" + a.crs.properties.code)), o !== void 0 && (this.options.coordsToLatLng = function(h) {
            var l = i.point(h[0], h[1]);
            return o.projection.unproject(l);
          })), this._callLevel++;
          try {
            i.GeoJSON.prototype.addData.call(this, a);
          } finally {
            this._callLevel--, this._callLevel === 0 && delete this.options.coordsToLatLng;
          }
        }
      }), i.Proj.geoJson = function(a, o) {
        return new i.Proj.GeoJSON(a, o);
      }, i.Proj.ImageOverlay = i.ImageOverlay.extend({
        initialize: function(a, o, h) {
          i.ImageOverlay.prototype.initialize.call(this, a, null, h), this._projectedBounds = o;
        },
        // Danger ahead: Overriding internal methods in Leaflet.
        // Decided to do this rather than making a copy of L.ImageOverlay
        // and doing very tiny modifications to it.
        // Future will tell if this was wise or not.
        _animateZoom: function(a) {
          var o = this._map.getZoomScale(a.zoom), h = i.point(this._projectedBounds.min.x, this._projectedBounds.max.y), l = this._projectedToNewLayerPoint(h, a.zoom, a.center);
          i.DomUtil.setTransform(this._image, l, o);
        },
        _reset: function() {
          var a = this._map.getZoom(), o = this._map.getPixelOrigin(), h = i.bounds(
            this._transform(this._projectedBounds.min, a)._subtract(o),
            this._transform(this._projectedBounds.max, a)._subtract(o)
          ), l = h.getSize();
          i.DomUtil.setPosition(this._image, h.min), this._image.style.width = l.x + "px", this._image.style.height = l.y + "px";
        },
        _projectedToNewLayerPoint: function(a, o, h) {
          var l = this._map.getSize()._divideBy(2), u = this._map.project(h, o)._subtract(l)._round(), f = u.add(this._map._getMapPanePos());
          return this._transform(a, o)._subtract(f);
        },
        _transform: function(a, o) {
          var h = this._map.options.crs, l = h.transformation, u = h.scale(o);
          return l.transform(a, u);
        }
      }), i.Proj.imageOverlay = function(a, o, h) {
        return new i.Proj.ImageOverlay(a, o, h);
      }, i.Proj;
    });
  })(js)), js.exports;
}
Zd();
(function(e, i) {
  it.GridLayer.include({
    _setZoomTransform: function(s, a, o) {
      var h = a;
      h != null && this.options && (this.options.corrdType == "gcj02" ? h = Ks(a.lng, a.lat) : this.options.corrdType == "bd09" && (h = Oa(a.lng, a.lat)));
      var l = this._map.getZoomScale(o, s.zoom), u = s.origin.multiplyBy(l).subtract(this._map._getNewPixelOrigin(h, o)).round();
      it.Browser.any3d ? it.DomUtil.setTransform(s.el, u, l) : it.DomUtil.setPosition(s.el, u);
    },
    _getTiledPixelBounds: function(s) {
      var a = s;
      a != null && this.options && (this.options.corrdType == "gcj02" ? a = Ks(s.lng, s.lat) : this.options.corrdType == "bd09" && (a = Oa(s.lng, s.lat)));
      var o = this._map, h = o._animatingZoom ? Math.max(o._animateToZoom, o.getZoom()) : o.getZoom(), l = o.getZoomScale(h, this._tileZoom), u = o.project(a, this._tileZoom).floor(), f = o.getSize().divideBy(l * 2);
      return new it.Bounds(u.subtract(f), u.add(f));
    }
  });
})();
var an = /* @__PURE__ */ ((e) => (e.tianDiTuNormalMap = "TianDiTu.Normal.Map", e.tianDiTuNormalAnnotion = "TianDiTu.Normal.Annotion", e.tianDiTuSatelliteMap = "TianDiTu.Satellite.Map", e.tianDiTuSatelliteAnnotion = "TianDiTu.Satellite.Annotion", e.tianDiTuTerrainMap = "TianDiTu.Terrain.Map", e.tianDiTuTerrainAnnotion = "TianDiTu.Terrain.Annotion", e.gaoDeNormalMap = "GaoDe.Normal.Map", e.gaoDeSatelliteMap = "GaoDe.Satellite.Map", e.gaoDeSatelliteAnnotion = "GaoDe.Satellite.Annotion", e.baiDuNormalMap = "Baidu.Normal.Map", e.baiDuSatelliteMap = "Baidu.Satellite.Map", e.baiDuSatelliteAnnotion = "Baidu.Satellite.Annotion", e.googleNormalMap = "Google.Normal.Map", e.googleSatelliteMap = "Google.Satellite.Map", e.googleSatelliteAnnotion = "Google.Satellite.Annotion", e.geoqNormalMap = "Geoq.Normal.Map", e.geoqNormalPurplishBlue = "Geoq.Normal.PurplishBlue", e.geoqNormalGray = "Geoq.Normal.Gray", e.geoqNormalWarm = "Geoq.Normal.Warm", e.geoqThemeHydro = "Geoq.Theme.Hydro", e.oSMNormalMap = "OSM.Normal.Map", e))(an || {});
class Fd {
  constructor(i, s) {
    this.setMapProvider(i, s);
  }
  /**将图层添加到map显示在页面 */
  addTo(i) {
    return i ? (this.map = i, this.mapLayer?.addTo(this.map), this) : this;
  }
  /**从map中移除当前图层 */
  remove() {
    return this.mapLayer?.remove(), this;
  }
  /**变更当前图层并添加到map中 */
  changeMap(i, s) {
    return this.remove(), this.setMapProvider(i, s), this.addTo(this.map), this;
  }
  /**设置map的地图来源，名称，类型 */
  setMapProvider(i, s) {
    s = s || {};
    let a = i.split("."), o = a[0], h = a[1], l = a[2], u = ie[o][h][l];
    s.subdomains = ie[o].Subdomains, s.key = s.key || ie[o].key, s.corrdType = this.getCorrdType(o), "tms" in ie[o] && (s.tms = ie[o].tms), this.mapLayer = new it.TileLayer(u, s);
  }
  /**获取坐标转换类型*/
  getCorrdType(i) {
    var s = "wgs84";
    switch (i) {
      case "Geoq":
      case "GaoDe":
      case "Google":
        s = "gcj02";
        break;
      case "Baidu":
        s = "bd09";
        break;
      case "OSM":
      case "TianDiTu":
        s = "wgs84";
        break;
    }
    return s;
  }
}
const ie = {
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
class jd {
  constructor(i, s = {}) {
    this.curs = /* @__PURE__ */ Object.create(null), this.createMap(i, s);
  }
  /**显示指定的网络图层 */
  showMap(i = []) {
    const { map: s, curs: a } = this;
    if (s && s instanceof it.Map) {
      i[0].split(".")[0];
      let o = s.getCenter(), h = s.getZoom();
      s._resetView(o, h, !0), i?.forEach((l) => {
        if (a[l]) return;
        let u = new Fd(l);
        u.addTo(s), a[l] = u;
      });
      for (const l in a) {
        let u = l;
        i.includes(u) || (a[u].remove(), Reflect.deleteProperty(a, l));
      }
    }
    return this;
  }
  async createMap(i, s) {
    const { type: a } = s;
    a === "A" ? this.map = await this.initAmap(i, s) : (this.map = await this.initLeaflet(i, s), this.showMap([an.tianDiTuNormalMap, an.tianDiTuNormalAnnotion]));
  }
  /**---------------leaflet地图的相关方法------------------- */
  initLeaflet(i, s) {
    const { zoom: a = 11, minZoom: o = 2, maxZoom: h = 20, center: [l, u] = [22.68471, 114.12027], dragging: f = !0, zoomControl: _ = !1, attributionControl: v = !1, doubleClickZoom: m = !1, closePopupOnClick: p = !1 } = s;
    let M = {
      dragging: f,
      zoomControl: _,
      zoom: a,
      minZoom: o,
      maxZoom: h,
      center: it.latLng(l, u),
      attributionControl: v,
      doubleClickZoom: m,
      crs: it.CRS.EPSG3857,
      closePopupOnClick: p
      //点击地图不关闭弹出层
    }, w = new it.Map(i, M);
    return Promise.resolve(w);
  }
  /**---------------高德地图的相关方法------------------- */
  async initAmap(i, s) {
    const { zoom: a = 11, minZoom: o = 2, maxZoom: h = 20, center: [l, u] = [22.68471, 114.12027], dragging: f = !0, zoomControl: _ = !1, attributionControl: v = !1, doubleClickZoom: m = !1, closePopupOnClick: p = !1, showLabel: M = !0 } = s;
    return Nh.load({
      key: "87e1b1e9aa88724f69208972546fdd57",
      // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "1.4.15",
      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ["Map3D"]
      //插件列表
    }).then(() => new AMap.Map(i, {
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
      zooms: [o, h],
      dragEnable: f,
      doubleClickZoom: m,
      keyboardEnable: !1,
      isHotspot: !1,
      showLabel: M,
      layers: []
    }));
  }
}
export {
  Ud as MapCanvasDraw,
  Ba as MapCanvasEvent,
  qd as MapCanvasLayer,
  kt as SLUCanvas,
  lh as SLUCanvasGif,
  Vs as SLUCanvasImg,
  mh as SLUCanvasText,
  jd as SLUMap
};
