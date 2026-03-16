import { u_TextSplitMultilineText as C } from "../utils/txt.js";
import { SLUCanvas as k } from "./slu-canvas.js";
class D {
  /**绘制文本（包含重叠处理）
   * @param info 文本信息
   * @param textRects 已绘制文本
   * @param ctx 画布
  */
  static drawText(r, n = [], t = this.ctx) {
    let { text: h = "", maxWidth: x = 0, font: e = t.font, ifHide: i } = r;
    if (i === !0 || !h) return null;
    this.ctx = t, k.setCtxPara(t, r);
    const p = this.wordWrap(h, x, e), o = this.calcTextRect(p, r), a = this.avoidOverlap(r, o, n);
    this.renderTexts(r, p, o, n, a, t);
  }
  /**对文本换行计算,按规则得到多行文本 
   * @param text 文本
   * @param ctx 画布
   * @param max 最大宽度
   * @param font 字体
  */
  static wordWrap(r, n, t, h = this.ctx) {
    let x = r.split(`
`).filter((i) => i != "");
    if (n <= 0) return x;
    let e = [];
    return x.forEach((i) => {
      e.push(...C(h, i, t, n, !0, (p) => [p.lastIndexOf(",") + 1]));
    }), e;
  }
  /**计算得到文本框(无论是否绘制背景框都需要计算)
   * @param texts 文本组
   * @param info 文本配置
   * @param ctx 画布
   */
  static calcTextRect(r, n, t = this.ctx) {
    let { point: h = [20, 20], panel: x = {}, lineHeight: e, textAlign: i, px: p = 0, py: o = 0 } = n, a = 0, d = 0, [c, m] = h, { actualBoundingBoxDescent: g = 0 } = t.measureText("M");
    d = (e || g) * r.length, a = Math.max(...r.map((b) => t.measureText(b).width));
    const { pl: f = 0, pr: u = f, pt: y = 0, pb: v = y } = x;
    let T = a + f + u, w = d + y + v;
    return i === "center" && (c -= T / 2), i === "right" && (c -= T), {
      x: c + p,
      y: m + o,
      width: T,
      height: w
    };
  }
  /**八个方向查找空隙 
  * @param rect 文本范围
  * @param rects 已存在的文本范围
  * @returns [X轴偏移量,Y轴偏移量,状态控制标识 0-7:方位 8:正常显示 9:不显示 ]
  */
  static avoidOverlap(r, n, t) {
    const { x: h, y: x, width: e = 0, height: i = 0 } = n, { overlap: p, textAlign: o } = r, { type: a = "show", querySpace: d = 1, maxDistance: c = 200, minSpacing: m = 0 } = p || {};
    if (a === "show") return [0, 0, 8];
    let g = this.isTextOverlap(n, t);
    if (a === "hide")
      return g ? [0, 0, 9] : [0, 0, 8];
    if (g)
      for (let f = 0; f <= c; f += d)
        for (let u = 0; u < 8; u++) {
          const y = u % 4 === 0 ? 0 : u < 4 ? 1 : -1, v = u == 2 || u == 6 ? 0 : u < 2 || u > 6 ? -1 : 1;
          let T = f * y - (y < 0 ? e : 0), w = f * v - (v < 0 ? i : 0);
          if (!this.isTextOverlap({ x: h + T, y: x + w, width: e, height: i }, t, m))
            return [T, w, u];
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
  static renderTexts(r, n, t, h, x, e) {
    const [i, p, o] = x, { panel: a = {}, overlap: d = {}, textAlign: c = "center", px: m = 0, py: g = 0, point: f = [0, 0] } = r, { pl: u = 0, pt: y = 0, pb: v = y, pr: T = u } = a, { line: w } = d, { width: M = 0, height: b = 0 } = t, [O, R] = f;
    if (o !== 9) {
      if (t.x += i, t.y += p, h.push({ ...t }), i != 0 || p != 0 && w) {
        let { x: s, y: l } = t;
        switch (o) {
          case 0:
            s = s, l = l + b;
            break;
          case 1:
            s = s, l = l + b;
            break;
          case 2:
            s = s, l = l;
            break;
          case 3:
            s = s, l = l;
            break;
          case 4:
            s = s, l = l;
            break;
          case 5:
            s = s + M, l = l;
            break;
          case 6:
            s = s + M, l = l;
            break;
          case 7:
            s = s + M, l = l + b;
            break;
        }
        k.drawLine({ ...w, points: [[O, R], [s, l]] }, e);
      }
      a && k.drawRect(
        {
          point: [t.x, t.y],
          width: t.width,
          height: t.height,
          radius: a.radius,
          ...a
        },
        e
      ), k.setCtxPara(e, r), this.renderMultiText(n, [t.x + u, t.y + y], r, e), k.setCtxPara(e);
    }
  }
  /**绘制多行文本*/
  static renderMultiText(r, n, t, h) {
    let [x, e] = n;
    const { lineHeight: i, ifShadow: p } = t;
    let { actualBoundingBoxDescent: o } = h.measureText("M");
    r.forEach((a) => {
      let d = i && i > o ? (i - o) / 2 : 0, c = i || o;
      p && h.strokeText(a, x, e + d), h.fillText(a, x, e + d), e += c;
    });
  }
  /**文本是否重叠 */
  static isTextOverlap(r, n, t = 0) {
    for (const h of n) {
      const { x, y: e, width: i = 0, height: p = 0 } = r, { x: o, y: a = 0, width: d = 0, height: c = 0 } = h;
      if (!(o > x + i + t || o + d + t < x || a > e + p + t || a + c + t < e))
        return !0;
    }
    return !1;
  }
}
export {
  D as SLUCanvasText
};
