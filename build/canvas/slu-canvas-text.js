import { u_TextSplitMultilineText as C } from "../utils/txt.js";
import { SLUCanvas as E } from "./slu-canvas.js";
const b = class b {
  /**清除网格缓存 */
  static openDrawText() {
    this.grid.clear();
  }
  /**绘制文本（包含重叠处理）-批量绘制前必须清除网格缓存 SLUCanvasText.openDrawText()【待优化】
   * @param info 文本信息
   * @param ctx 画布
  */
  static drawText(e, i = this.ctx) {
    let { text: t = "", maxWidth: r = 0, font: s = i.font, ifHide: a } = e;
    if (a === !0 || !t) return null;
    this.ctx = i, E.setCtxPara(i, e);
    const h = this.wordWrap(t, r, s), n = this.calcTextRect(h, e), l = this.avoidOverlap(e, n);
    this.renderTexts(e, h, n, l, i);
  }
  /**获取文本测量缓存
   * @param ctx 画布
   * @param text 文本
   * @returns 文本测量缓存 TextMetrics
  */
  static getTextMetrics(e, i) {
    const t = e.font + "|" + i;
    let r = this.textMetricsCache.get(t);
    if (r) return r;
    if (r = e.measureText(i), this.textMetricsCache.size >= this.MAX_CACHE_SIZE) {
      const s = this.textMetricsCache.keys().next().value;
      this.textMetricsCache.delete(s);
    }
    return this.textMetricsCache.set(t, r), r;
  }
  /**对文本换行计算,按规则得到多行文本 
   * @param text 文本
   * @param max 最大宽度
   * @param font 字体
   * @param ctx 画布
   * @returns 多行文本 string[]
  */
  static wordWrap(e, i, t, r = this.ctx) {
    let s = e.split(`
`).filter((h) => h != "");
    if (i <= 0) return s;
    let a = [];
    return s.forEach((h) => {
      a.push(...C(r, h, t, i, !0, (n) => [n.lastIndexOf(",") + 1]));
    }), a;
  }
  /**计算得到文本框(无论是否绘制背景框都需要计算)
   * @param texts 文本组
   * @param info 文本配置
   * @param ctx 画布
   * @returns 文本框 CanvasTextRect
   */
  static calcTextRect(e, i, t = this.ctx) {
    let { point: r = [20, 20], panel: s = {}, lineHeight: a, textAlign: h, px: n = 0, py: l = 0 } = i, o = 0, d = 0, [p, f] = r, { actualBoundingBoxDescent: R = 0 } = this.getTextMetrics(t, "M");
    d = (a || R) * e.length, o = Math.max(...e.map((k) => this.getTextMetrics(t, k).width));
    const { pl: w = 0, pr: u = w, pt: y = 0, pb: I = y } = s;
    let g = o + w + u, M = d + y + I;
    return h === "center" && (p -= g / 2), h === "right" && (p -= g), {
      x: p + n,
      y: f + l,
      width: g,
      height: M
    };
  }
  /**八个方向查找空隙 
   * @param info 文本配置
   * @param rect 文本范围
   * @returns [X轴偏移量,Y轴偏移量,状态控制标识 0-7:方位 8:正常显示 9:不显示 ]
   */
  static avoidOverlap(e, i) {
    const { x: t, y: r, width: s = 0, height: a = 0 } = i, { overlap: h, textAlign: n } = e, { type: l = "show", querySpace: o = 1, maxDistance: d = 200, minSpacing: p = 0 } = h || {};
    if (l === "show") return [0, 0, 8];
    let f = this.isTextOverlap(i, p);
    if (l === "hide")
      return f ? [0, 0, 9] : [0, 0, 8];
    if (f) {
      const R = [0, 4, 2, 6, 1, 3, 5, 7], w = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]], u = { x: 0, y: 0, width: s, height: a };
      for (let y = o; y <= d; y += o)
        for (let I = 0, g = R.length; I < g; I++) {
          const M = R[I], [T, k] = w[M];
          let D = y * T, c = y * k;
          if (u.x = t + D, u.y = r + c, !this.isTextOverlap(u, p))
            return [D, c, M];
        }
    } else
      return [0, 0, 8];
    return [0, 0, 9];
  }
  /**绘制文本
   * @param info 文本配置
   * @param texts 文本字符串组
   * @param rect 文本框
   * @param ctr 偏移控制
   */
  static renderTexts(e, i, t, r, s) {
    const [a, h, n] = r, { panel: l = {}, overlap: o = {}, textAlign: d = "center", px: p = 0, py: f = 0, point: R = [0, 0] } = e, { pl: w = 0, pt: u = 0, pb: y = u, pr: I = w } = l, { line: g } = o, { width: M = 0, height: T = 0 } = t, [k, D] = R;
    if (n !== 9) {
      if (t.x += a, t.y += h, this.addRect(t), a != 0 || h != 0 && g) {
        let { x: c, y: x } = t;
        switch (n) {
          case 0:
            c = c, x = x + T;
            break;
          case 1:
            c = c, x = x + T;
            break;
          case 2:
            c = c, x = x;
            break;
          case 3:
            c = c, x = x;
            break;
          case 4:
            c = c, x = x;
            break;
          case 5:
            c = c + M, x = x;
            break;
          case 6:
            c = c + M, x = x;
            break;
          case 7:
            c = c + M, x = x + T;
            break;
        }
        E.drawLine({ ...g, points: [[k, D], [c, x]] }, s);
      }
      l && Object.keys(l).length > 0 && E.drawRect(
        {
          point: [t.x, t.y],
          width: t.width,
          height: t.height,
          radius: l.radius,
          ...l
        },
        s
      ), E.setCtxPara(s, e), this.renderMultiText(i, [t.x + w, t.y + u], e, s), E.setCtxPara(s);
    }
  }
  /**绘制多行文本
   * @param texts 文本字符串组
   * @param start 起始坐标
   * @param info 文本配置
   * @param ctx 画布
  */
  static renderMultiText(e, i, t, r) {
    let [s, a] = i;
    const { lineHeight: h, ifShadow: n } = t;
    let { actualBoundingBoxDescent: l } = this.getTextMetrics(r, "M");
    e.forEach((o) => {
      let d = h && h > l ? (h - l) / 2 : 0, p = h || l;
      n && r.strokeText(o, s, a + d), r.fillText(o, s, a + d), a += p;
    });
  }
  /**文本是否重叠
   * @param rect 文本框
   * @param minSpacing 最小间距
   * @returns 是否重叠
   */
  static isTextOverlap(e, i = 0) {
    const t = this.getNearbyRects(e), { x: r, y: s, width: a = 0, height: h = 0 } = e;
    for (const n of t) {
      if (e === n) continue;
      const { x: l, y: o = 0, width: d = 0, height: p = 0 } = n;
      if (!(l > r + a + i || l + d + i < r || o > s + h + i || o + p + i < s))
        return !0;
    }
    return !1;
  }
  /**添加文本框到网格缓存
   * @param rect 文本框
   */
  static addRect(e) {
    const { x: i, y: t, width: r, height: s } = e, a = Math.floor(i / this.GRID_SIZE), h = Math.floor((i + r) / this.GRID_SIZE), n = Math.floor(t / this.GRID_SIZE), l = Math.floor((t + s) / this.GRID_SIZE);
    for (let o = a; o <= h; o++)
      for (let d = n; d <= l; d++) {
        const p = `${o}_${d}`;
        let f = this.grid.get(p);
        f ? f.push(e) : this.grid.set(p, [e]);
      }
  }
  /**查附近 9 个格子
   * @param rect 文本框
   * @returns 附近 9 个格子的文本框
   */
  static getNearbyRects(e) {
    const i = Math.floor(e.x / this.GRID_SIZE), t = Math.floor(e.y / this.GRID_SIZE);
    let r = [];
    for (let s = -1; s <= 1; s++)
      for (let a = -1; a <= 1; a++) {
        const h = `${i + s}_${t + a}`, n = this.grid.get(h);
        n && r.push(...n);
      }
    return r;
  }
};
b.textMetricsCache = /* @__PURE__ */ new Map(), b.MAX_CACHE_SIZE = 1e3, b.GRID_SIZE = 100, b.grid = /* @__PURE__ */ new Map();
let _ = b;
export {
  _ as SLUCanvasText
};
