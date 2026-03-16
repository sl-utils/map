import { u_mapGetMapSize as _, u_arrItemDel as i, u_mapGetPointsByLatlngs as d, u_mapGetPointByLatlng as g, u_mapGetSizeByMap as m } from "../utils/slu-map.js";
import { SLUCanvas as n } from "../canvas/slu-canvas.js";
import { SLUCanvasGif as p } from "../canvas/slu-canvas-gif.js";
import { SLUCanvasImg as u } from "../canvas/slu-canvas-img.js";
import { SLUCanvasText as L } from "../canvas/slu-canvas-text.js";
class b {
  constructor(t, s) {
    this._allArcs = [], this._allLines = [], this._allBLins = [], this._allRects = [], this._allTexts = [], this._allImgs = [], this._allGifs = [], this.map = t, this.canvas = s, this.ctx = s.getContext("2d");
  }
  get zoom() {
    return this.map.getZoom();
  }
  /** 清空并重新设置画布 */
  reSetCanvas() {
    let { canvas: t, map: s, ctx: e } = this;
    const { w: r, h: l } = _(s);
    t.style.width = r + "px", t.style.height = l + "px", t.width = r, t.height = l;
  }
  /**绘制所有需要绘制的类(按drawIndex顺序) */
  drawMapAll() {
    this.reSetCanvas(), this.drawByIndex();
  }
  /**绘制通过index */
  async drawByIndex() {
    let t = [], s = this, { ctx: e, zoom: r } = s, l = s._allRects.map((a) => ({ ...a, mold: "R" }));
    l = l.concat(s._allLines.map((a) => ({ ...a, mold: "L" }))), l = l.concat(s._allBLins.map((a) => ({ ...a, mold: "B" }))), l = l.concat(s._allArcs.map((a) => ({ ...a, mold: "A" }))), l = l.concat(s._allTexts.map((a) => ({ ...a, mold: "T" }))), l = l.concat(s._allImgs.map((a) => ({ ...a, mold: "I" }))), l = l.concat(s._allGifs.map((a) => ({ ...a, mold: "G" }))), l.sort((a, h) => (a.index || 0) - (h.index || 0)), l.forEach((a, h) => {
      let { minZoom: c = 0, maxZoom: o = 50, overlap: x } = a;
      if (r >= c && r <= o)
        switch (s.transformXY(a), a.mold) {
          case "A":
            s.transformArcSize(a), n.drawArc(a, e);
            break;
          case "L":
            n.drawLine(a, e);
            break;
          case "B":
            n.drawBezierLine(a, e);
            break;
          case "R":
            n.drawPolygon(a, e);
            break;
          case "T":
            L.drawText(a, t, e);
            break;
          case "I":
            s.transformImageSize(a), u.drawImg(a, e);
            break;
          case "G":
            s.transformImageSize(a), s.gif = s.gif || new p(), s.gif.loadGIF(a, e);
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
    return i(this._allArcs, t), this;
  }
  /**删除指定线 */
  delLine(t) {
    return i(this._allLines, t), this;
  }
  /**删除指定贝塞尔曲线 */
  delBezierLine(t) {
    return i(this._allBLins, t), this;
  }
  /**删除指定多边形 */
  delRect(t) {
    return i(this._allRects, t), this;
  }
  /**删除指定文本 */
  delText(t) {
    return i(this._allTexts, t), this;
  }
  /**删除指定Img */
  delImg(t) {
    return i(this._allImgs, t), this;
  }
  /**清空
   * @param type 不填清空所有内容数据
   */
  delAll(t = "all") {
    const s = this;
    switch (t) {
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
  transformXY(t) {
    t.points = d(this.map, t.latlngs), t.point = g(this.map, t.latlng);
  }
  /**设置固定大小的图片 */
  transformImageSize(t) {
    let [s, e] = m(this.map, t);
    t.size = [s, e];
  }
  transformArcSize(t) {
    let [s, e] = m(this.map, t);
    t.size = s;
  }
}
export {
  b as MapCanvasDraw
};
