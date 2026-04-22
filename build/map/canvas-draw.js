import { u_mapGetMapSize as o, u_arrItemDel as i, u_mapGetPointsByLatlngs as _, u_mapGetPointByLatlng as d, u_mapGetSizeByMap as h } from "../utils/slu-map.js";
import { SLUCanvas as r } from "../canvas/slu-canvas.js";
import { SLUCanvasGif as p } from "../canvas/slu-canvas-gif.js";
import { SLUCanvasImg as u } from "../canvas/slu-canvas-img.js";
import { SLUCanvasText as m } from "../canvas/slu-canvas-text.js";
class w {
  constructor(t, s) {
    this._allArcs = [], this._allLines = [], this._allBLins = [], this._allRects = [], this._allTexts = [], this._allImgs = [], this._allGifs = [], this.map = t, this.canvas = s, this.ctx = s.getContext("2d");
  }
  /**当前地图缩放层级 */
  get zoom() {
    return this.map.getZoom();
  }
  /**清空并重新设置画布 */
  reSetCanvas() {
    let { canvas: t, map: s, ctx: e } = this;
    const { w: a, h: l } = o(s);
    t.style.width = a + "px", t.style.height = l + "px", t.width = a, t.height = l;
  }
  /**绘制所有需要绘制的类(按drawIndex顺序) */
  drawMapAll() {
    this.reSetCanvas(), this.drawByIndex();
  }
  /**绘制通过index */
  drawByIndex() {
    let t = this, { ctx: s, zoom: e } = t, a = t._allRects.map((l) => ({ ...l, mold: "R" }));
    a = a.concat(t._allLines.map((l) => ({ ...l, mold: "L" }))), a = a.concat(t._allBLins.map((l) => ({ ...l, mold: "B" }))), a = a.concat(t._allArcs.map((l) => ({ ...l, mold: "A" }))), a = a.concat(t._allTexts.map((l) => ({ ...l, mold: "T" }))), a = a.concat(t._allImgs.map((l) => ({ ...l, mold: "I" }))), a = a.concat(t._allGifs.map((l) => ({ ...l, mold: "G" }))), a.sort((l, n) => (l.index || 0) - (n.index || 0)), t._allTexts.length && m.openDrawText(), a.forEach((l, n) => {
      let { minZoom: c = 0, maxZoom: g = 50, overlap: f } = l;
      if (e >= c && e <= g)
        switch (t.transformXY(l), l.mold) {
          case "A":
            t.transformArcSize(l), r.drawArc(l, s);
            break;
          case "L":
            r.drawLine(l, s);
            break;
          case "B":
            r.drawBezierLine(l, s);
            break;
          case "R":
            r.drawPolygon(l, s);
            break;
          case "T":
            m.drawText(l, s);
            break;
          case "I":
            t.transformImageSize(l), u.drawImg(l, s);
            break;
          case "G":
            t.transformImageSize(l), t.gif = t.gif || new p(), t.gif.loadGIF(l, s);
            break;
        }
    });
  }
  /**设置圆点
   * @param arcs 圆点集合
   * @returns MapCanvasDraw实例
   */
  setAllArcs(t) {
    return this._allArcs = t, this;
  }
  /**设置线数据
   * @param lines 线集合
   * @returns MapCanvasDraw实例
   */
  setAllLines(t) {
    return this._allLines = t, this;
  }
  /**设置贝塞尔曲线数据
   * @param lines 贝塞尔曲线集合
   * @returns MapCanvasDraw实例
   */
  setAllBezierLines(t) {
    return this._allBLins = t, this;
  }
  /**设置多边形数据
   * @param rects 多边形集合
   * @returns MapCanvasDraw实例
   */
  setAllRects(t) {
    return this._allRects = t, this;
  }
  /**设置文本数据
   * @param texts 文本集合
   * @returns MapCanvasDraw实例
   */
  setAllTexts(t) {
    return this._allTexts = t, this;
  }
  /**设置图片数据
   * @param imgs 图片集合
   * @returns MapCanvasDraw实例
   */
  setAllImgs(t) {
    return this._allImgs = t, this;
  }
  /**设置图片数据
   * @param gifs Gif集合
   * @returns MapCanvasDraw实例
   */
  setAllGifs(t) {
    return this._allGifs = t, this;
  }
  /**增加圆点
   * @param arc 圆点
   * @returns MapCanvasDraw实例
   */
  addArc(t) {
    return !t.latlngs && !t.latlng ? this : (this._allArcs.push(t), this);
  }
  /**增加线
   * @param line 线
   * @returns MapCanvasDraw实例
   */
  addLine(t) {
    return t.latlngs ? (this._allLines.push(t), this) : this;
  }
  /**增加贝塞尔曲线
   * @param line 贝塞尔曲线
   * @returns MapCanvasDraw实例
   */
  addBezierLine(t) {
    return t.latlngs ? (this._allBLins.push(t), this) : this;
  }
  /**增加多边形
   * @param rect 多边形
   * @returns MapCanvasDraw实例
   */
  addRect(t) {
    return t.latlngs ? (this._allRects.push(t), this) : this;
  }
  /**增加文本
   * @param text 文本
   * @returns MapCanvasDraw实例
   */
  addText(t) {
    return !t.latlngs && !t.latlng ? this : (this._allTexts.push(t), this);
  }
  /**增加图片
   * @param img 图片
   * @returns MapCanvasDraw实例
   */
  addImg(t) {
    return !t.latlngs && !t.latlng ? this : (this._allImgs.push(t), this);
  }
  /**删除指定圆点
   * @param arc 圆点
   * @returns MapCanvasDraw实例
   */
  delArc(t) {
    return i(this._allArcs, t), this;
  }
  /**删除指定线
   * @param line 线
   * @returns MapCanvasDraw实例
   */
  delLine(t) {
    return i(this._allLines, t), this;
  }
  /**删除指定贝塞尔曲线
   * @param line 贝塞尔曲线
   * @returns MapCanvasDraw实例
   */
  delBezierLine(t) {
    return i(this._allBLins, t), this;
  }
  /**删除指定多边形
   * @param rect 多边形
   * @returns MapCanvasDraw实例
   */
  delRect(t) {
    return i(this._allRects, t), this;
  }
  /**删除指定文本
   * @param text 文本
   * @returns MapCanvasDraw实例
   */
  delText(t) {
    return i(this._allTexts, t), this;
  }
  /**删除指定Img
   * @param img 图片
   * @returns MapCanvasDraw实例
   */
  delImg(t) {
    return i(this._allImgs, t), this;
  }
  /**清空
   * @param type @default 'all' ,不填清空所有内容数据
   * @returns MapCanvasDraw实例
   */
  delAll(t = "all") {
    const s = this;
    switch (t) {
      case "arc":
        s._allArcs.length = 0;
        break;
      case "line":
        s._allLines.length = 0;
        break;
      case "bezier":
        s._allBLins.length = 0;
        break;
      case "rect":
        s._allRects.length = 0;
        break;
      case "img":
        s._allImgs.length = 0;
        break;
      case "gif":
        s._allGifs.length = 0;
        break;
      case "text":
        s._allTexts.length = 0;
        break;
      case "all":
        s._allArcs.length = 0, s._allLines.length = 0, s._allBLins.length = 0, s._allRects.length = 0, s._allImgs.length = 0, s._allGifs.length = 0, s._allTexts.length = 0;
    }
    return s;
  }
  /**将对象上经纬度数据(latlngs,latlng)变换为像素XY的数据(points,point)
   * latlngs为undefined,points也为undefined
   * latlng为undefined,point为[0,0]
   * @param info 对象
   */
  transformXY(t) {
    t.points = _(this.map, t.latlngs), t.point = d(this.map, t.latlng);
  }
  /**设置图片的大小
   * @param img 图片
   */
  transformImageSize(t) {
    let [s, e] = h(this.map, t);
    t.size = [s, e];
  }
  /**设置圆点的大小
   * @param arc 圆点
   */
  transformArcSize(t) {
    let [s, e] = h(this.map, t);
    t.size = s;
  }
}
export {
  w as MapCanvasDraw
};
