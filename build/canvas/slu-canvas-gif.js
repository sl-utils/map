class N {
  constructor() {
    this.canvasTool = document.createElement("canvas"), this.LAST_DISPOSA_METHOD = null, this.CURRENT_FRAME_INDEX = -1, this.TRANSPARENCY = null, this.gifCache = {}, this.aniIds = {}, this.opts = [];
  }
  /**加载gif并进行缓存 , 避免重复请求 url */
  async loadGIF(e, a) {
    let { url: s } = e, t = this.gifCache[s];
    if (this.CTX = a, t)
      t.status === 1 ? (this.opts.push(e), clearTimeout(this.timeId), this.timeId = setTimeout(() => {
        console.log(this.opts);
        let h = this.opts;
        this.opts = [], h.forEach((n) => this.loadGIF(n, this.CTX));
      }, 100)) : t.status === 2 && (this.stopGif(e), this.playGif(e));
    else {
      this.gifCache[s] = { status: 0, data: null, frameList: [] }, t = this.gifCache[s];
      try {
        t.status = 1;
        const h = await this.fetchGIF(s), n = new F(h);
        t.status = 2, this.parseHeader(s, n), this.parseBlock(e, n);
      } catch (h) {
        console.error("Error loading GIF:", h);
      }
    }
  }
  fetchGIF(e) {
    return new Promise((a, s) => {
      const t = new XMLHttpRequest();
      t.open("GET", e, !0), "overrideMimeType" in t && t.overrideMimeType("text/plain; charset=x-user-defined"), t.onload = () => {
        if (t.status === 200) {
          const h = t.response;
          h.toString().indexOf("ArrayBuffer") > 0 ? a(new Uint8Array(h)) : a(h);
        } else
          s(new Error("XHR Error - Response"));
      }, t.onerror = () => {
        s(new Error("XHR Error"));
      }, t.send();
    });
  }
  /**解析数据流头部并设置工具canvas的宽高 */
  parseHeader(e, a) {
    let s = a, t = this.gifInfo = /* @__PURE__ */ Object.create(null), h = this.canvasTool;
    if (t.sig = s.read(3), t.ver = s.read(3), t.sig !== "GIF") throw new Error("Not a GIF file.");
    t.width = s.readUnsigned(), t.height = s.readUnsigned();
    let n = this.byteToBitArr(s.readByte());
    t.gctFlag = !!n.shift(), t.colorRes = this.bitsToNum(n.splice(0, 3)), t.sorted = !!n.shift(), t.gctSize = this.bitsToNum(n.splice(0, 3)), t.bgColor = s.readByte(), t.pixelAspectRatio = s.readByte(), t.gctFlag && (t.gct = this.parseCT(1 << t.gctSize + 1, a)), h.width = t.width, h.height = t.height, h.style.width = t.width + "px", h.style.height = t.height + "px", h.getContext("2d").setTransform(1, 0, 0, 1, 0, 0);
  }
  /**解析内容块 */
  parseBlock(e, a) {
    let s = /* @__PURE__ */ Object.create(null), t = a;
    switch (s.sentinel = t.readByte(), String.fromCharCode(s.sentinel)) {
      // For ease of matching
      case "!":
        s.type = "ext", this.parseExt(s, a, e.url);
        break;
      case ",":
        s.type = "img", this.parseImg(s, a, e.url);
        break;
      case ";":
        s.type = "eof", this.playGif(e);
        break;
      default:
        throw new Error("Unknown block: 0x" + s.sentinel.toString(16));
    }
    s.type !== "eof" && this.parseBlock(e, a);
  }
  /**播放gif */
  playGif(e, a = 0) {
    const s = this, { delay: t = 0 } = e, { frameList: h } = s.gifCache[e.url], n = h.length;
    let d;
    const o = (r) => {
      d === void 0 && (d = r), r - (d || r) >= t && (d = r, a++, a >= n && (a = 0)), s.drawFrame(e, a), s.aniIds[e.id] = requestAnimationFrame(o);
    };
    s.aniIds[e.id] = requestAnimationFrame(o);
  }
  /**绘制每一帧 */
  drawFrame(e, a) {
    const s = this, t = s.CTX;
    let { point: h, points: n = [], size: d = [100, 100], url: o, sizeo: r, posX: i = 0, posY: l = 0, left: f = 0, top: c = 0, rotate: p = 0, alpha: u = 1, delay: g } = e, { frameList: E } = s.gifCache[e.url];
    s.canvasTool.getContext("2d").putImageData(E[a].data, 0, 0);
    let I = s.canvasTool, T = d[0], y = d[1], w = r && r[0], C = r && r[1];
    h && (n = [...n, h]);
    for (let A = 0; A < n.length; A++) {
      const S = n[A], x = S[0], R = S[1];
      p = p * Math.PI / 180, t.globalAlpha = u, t.setTransform(1, 0, 0, 1, x, R), t.rotate(p), w && C ? t.drawImage(I, i, l, w, C, -T / 2 + f, -y / 2 + c, T, y) : t.drawImage(I, -T / 2 + f, -y / 2 + c, T, y), t.rotate(-p), t.setTransform(1, 0, 0, 1, 0, 0);
    }
  }
  /**关闭之前的定时动画 */
  stopGif(e) {
    const a = this, s = a.aniIds[e.id];
    s && (cancelAnimationFrame(s), a.aniIds[e.id] = null);
  }
  // 解析
  parseExt(e, a, s) {
    let t = a, h = (i) => {
      t.readByte();
      var l = this.byteToBitArr(t.readByte());
      i.reserved = l.splice(0, 3), i.disposalMethod = this.bitsToNum(l.splice(0, 3)), this.LAST_DISPOSA_METHOD = i.disposalMethod, i.userInput = l.shift(), i.transparencyGiven = l.shift(), i.delayTime = t.readUnsigned(), i.transparencyIndex = t.readByte(), i.terminator = t.readByte(), this.pushFrame(i.delayTime, s), this.TRANSPARENCY = i.transparencyGiven ? i.transparencyIndex : null;
    }, n = (i) => {
      i.comment = this.readSubBlocks(a);
    }, d = (i) => {
      t.readByte(), i.ptHeader = t.readBytes(12), i.ptData = this.readSubBlocks(a);
    }, o = (i) => {
      var l = function(c) {
        t.readByte(), c.unknown = t.readByte(), c.iterations = t.readUnsigned(), c.terminator = t.readByte();
      }, f = (c) => {
        c.appData = this.readSubBlocks(a);
      };
      t.readByte(), i.identifier = t.read(8), i.authCode = t.read(3), i.identifier === "NETSCAPE" ? l(i) : f(i);
    }, r = (i) => {
      i.data = this.readSubBlocks(a);
    };
    switch (e.label = t.readByte(), e.label) {
      case 249:
        e.extType = "gce", h(e);
        break;
      case 254:
        e.extType = "com", n(e);
        break;
      case 1:
        e.extType = "pte", d(e);
        break;
      case 255:
        e.extType = "app", o(e);
        break;
      default:
        e.extType = "unknown", r(e);
        break;
    }
  }
  pushFrame(e, a) {
    let s = this.gifCache[a].frameList;
    this.ctx && s.push({
      delay: e,
      data: this.ctx.getImageData(0, 0, this.gifInfo.width, this.gifInfo.height)
    });
  }
  parseImg(e, a, s) {
    let t = a;
    function h(o, r) {
      let i = new Array(o.length);
      const l = o.length / r;
      function f(I, T) {
        const y = o.slice(T * r, (T + 1) * r);
        i.splice.apply(i, [I * r, r].concat(y));
      }
      const c = [0, 4, 2, 1], p = [8, 8, 4, 2];
      let u = 0;
      for (var g = 0; g < 4; g++)
        for (var E = c[g]; E < l; E += p[g])
          f(E, u), u++;
      return i;
    }
    e.leftPos = t.readUnsigned(), e.topPos = t.readUnsigned(), e.width = t.readUnsigned(), e.height = t.readUnsigned();
    let n = this.byteToBitArr(t.readByte());
    e.lctFlag = n.shift(), e.interlaced = n.shift(), e.sorted = n.shift(), e.reserved = n.splice(0, 2), e.lctSize = this.bitsToNum(n.splice(0, 3)), e.lctFlag && (e.lct = this.parseCT(1 << e.lctSize + 1, a)), e.lzwMinCodeSize = t.readByte();
    const d = this.readSubBlocks(a);
    e.pixels = this.lzwDecode(e.lzwMinCodeSize, d), e.interlaced && (e.pixels = h(e.pixels, e.width)), this.doImg(e, s);
  }
  /**读取数据块 */
  readSubBlocks(e) {
    let a, s = e, t = "";
    do
      a = s.readByte(), t += s.read(a);
    while (a !== 0);
    return t;
  }
  /**解码LZW编码 */
  lzwDecode(e, a) {
    let s = 0;
    function t(c) {
      let p = 0;
      for (let u = 0; u < c; u++)
        a.charCodeAt(s >> 3) & 1 << (s & 7) && (p |= 1 << u), s++;
      return p;
    }
    let h = [], n = 1 << e, d = n + 1, o = e + 1, r = [];
    function i() {
      r = [], o = e + 1;
      for (let c = 0; c < n; c++)
        r[c] = [c];
      r[n] = [], r[d] = null;
    }
    let l = null, f = null;
    for (; ; ) {
      if (f = l, l = t(o), l === n) {
        i();
        continue;
      }
      if (l === d)
        break;
      if (l < r.length)
        f !== n && r.push(r[f].concat(r[l][0]));
      else {
        if (l !== r.length)
          throw new Error("Invalid LZW code.");
        r.push(r[f].concat(r[f][0]));
      }
      h.push.apply(h, r[l]), r.length === 1 << o && o < 12 && o++;
    }
    return h;
  }
  /** */
  doImg(e, a) {
    let s = this.ctx, t = this.canvasTool, h = this.gifInfo, n = this.gifCache[a].frameList;
    this.ctx || (s = this.ctx = t.getContext("2d"));
    const d = n.length, o = e.lctFlag ? e.lct : h.gct;
    d > 0 && (this.LAST_DISPOSA_METHOD === 3 ? this.CURRENT_FRAME_INDEX !== null && this.CURRENT_FRAME_INDEX > -1 ? s.putImageData(n[this.CURRENT_FRAME_INDEX].data, 0, 0) : s.clearRect(0, 0, t.width, t.height) : this.CURRENT_FRAME_INDEX = d - 1, this.LAST_DISPOSA_METHOD === 2 && s.clearRect(0, 0, t.width, t.height));
    let r = s.getImageData(e.leftPos, e.topPos, e.width, e.height);
    e.pixels.forEach((i, l) => {
      i !== this.TRANSPARENCY && (r.data[l * 4 + 0] = o[i][0], r.data[l * 4 + 1] = o[i][1], r.data[l * 4 + 2] = o[i][2], r.data[l * 4 + 3] = 255);
    }), s.putImageData(r, e.leftPos, e.topPos);
  }
  /**数字转换为对应的位然后变为长度为7的boolean数组
   * @param bite number 
   */
  byteToBitArr(e) {
    let a = [];
    for (let s = 7; s >= 0; s--)
      a.push(!!(e & 1 << s));
    return a;
  }
  /**boolean数组转换为对应的数字
   * @param ba boolean[]
   */
  bitsToNum(e) {
    return e.reduce(function(a, s) {
      return a * 2 + Number(s);
    }, 0);
  }
  /**获取全局颜色列表
   * @param size 全局颜色列表大小
   */
  parseCT(e, a) {
    let s = [];
    for (let t = 0; t < e; t++)
      s.push(a.readBytes(3));
    return s;
  }
}
class F {
  constructor(e) {
    this.pos = 0, this.data = e, this.len = e.length, this.pos = 0;
  }
  /**读取一字节（8位）的数据 */
  readByte() {
    if (this.pos >= this.data.length)
      throw new Error("Attempted to read past end of stream.");
    return this.data instanceof Uint8Array ? this.data[this.pos++] : this.data.charCodeAt(this.pos++) & 255;
  }
  /**读取指定长度的数据 */
  readBytes(e) {
    let a = [];
    for (let s = 0; s < e; s++)
      a.push(this.readByte());
    return a;
  }
  /**获取指定长度字符串 */
  read(e) {
    let a = "";
    for (let s = 0; s < e; s++)
      a += String.fromCharCode(this.readByte());
    return a;
  }
  /**读取无符号数据2字节 最大：255<<8 + 255 */
  readUnsigned() {
    let e = this.readBytes(2);
    return (e[1] << 8) + e[0];
  }
}
export {
  N as SLUCanvasGif
};
