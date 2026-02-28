import * as L from 'leaflet';
import { u_arrItemDel, u_mapGetMapSize, u_mapGetPointByLatlng, u_mapGetPointsByLatlngs, u_mapGetSizeByMap } from '../utils/slu-map'
import { SLUCanvas, SLUCanvasGif, SLUCanvasImg, SLUCanvasText } from '../canvas';

/** 地图canvas基础图形绘制类    点(arc) 线(line BezierLine) 多边形(rect) 图片(img)*/
export class MapCanvasDraw {
  constructor(map: AMAP.Map | L.Map, canvas: HTMLCanvasElement) {
    this.map = map;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }
  private canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected map: AMAP.Map | L.Map;
  private gif: SLUCanvasGif;
  /**所有的小圆数据 */
  protected _allArcs: MapArc[] = [];
  /**所有的线数据 */
  protected _allLines: MapLine[] = [];
  /**所有的贝塞尔曲线数据 */
  protected _allBLins: MapLine[] = [];
  /**所有的多边形数据 */
  protected _allRects: MapRect[] = [];
  /**所有的文本数据 */
  protected _allTexts: MapText[] = [];
  /**所有的图片数据 */
  protected _allImgs: MapImage[] = [];
  /**所有的Gif数据 */
  protected _allGifs: MapGif[] = [];
  protected get zoom(): number {
    return this.map.getZoom();
  }
  /** 清空并重新设置画布 */
  public reSetCanvas(): void {
    let { canvas, map, ctx } = this;
    const { w, h } = u_mapGetMapSize(map);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    //清除画布
    canvas.width = w;
    canvas.height = h;
  }
  /**绘制所有需要绘制的类(按drawIndex顺序) */
  public drawMapAll() {
    this.reSetCanvas();
    this.drawByIndex();
  }
  /**绘制通过index */
  protected async drawByIndex() {
    let textRects: SLTCanvas.TextRect[] = [], that = this, { ctx, zoom } = that,
      all: any[] = that._allRects.map((e) => ({ ...e, mold: 'R' }));
    all = all.concat(that._allLines.map((e) => ({ ...e, mold: 'L' })));
    all = all.concat(that._allBLins.map((e) => ({ ...e, mold: 'B' })));
    all = all.concat(that._allArcs.map((e) => ({ ...e, mold: 'A' })));
    all = all.concat(that._allTexts.map((e) => ({ ...e, mold: 'T' })));
    all = all.concat(that._allImgs.map((e) => ({ ...e, mold: 'I' })));
    all = all.concat(that._allGifs.map((e) => ({ ...e, mold: 'G' })));
    all.sort((a, b) => (a.index || 0) - (b.index || 0));
    all.forEach((e, index) => {
      let { minZoom = 0, maxZoom = 50, overlap } = e;
      if (zoom >= minZoom && zoom <= maxZoom) {
        that.transformXY(e);
        switch (e.mold) {
          case 'A':
            that.transformArcSize(e);
            SLUCanvas.drawArc(e, ctx);
            break;
          case 'L':
            SLUCanvas.drawLine(e, ctx);
            break;
          case 'B':
            SLUCanvas.drawBezierLine(e, ctx);
            break;
          case 'R':
            SLUCanvas.drawPolygon(e, ctx);
            break;
          case 'T':
            SLUCanvasText.drawText(e, textRects, ctx);
            break;
          case 'I':
            that.transformImageSize(e);
            SLUCanvasImg.drawImg(e, ctx);
            break;
          case 'G':
            that.transformImageSize(e);
            that.gif = that.gif || new SLUCanvasGif();
            that.gif.loadGIF(e, ctx);
            break;
        }
      }
    });
  }
  /**设置原点 */
  public setAllArcs(arcs: MapArc[]) {
    this._allArcs = arcs;
    return this;
  }
  /**设置线数据 */
  public setAllLines(lines: MapLine[]) {
    this._allLines = lines;
    return this;
  }
  /**设置贝塞尔曲线数据 */
  public setAllBezierLines(lines: MapLine[]) {
    this._allBLins = lines;
    return this;
  }
  /**设置多边形数据 */
  public setAllRects(rects: MapRect[]) {
    this._allRects = rects;
    return this;
  }
  /**设置文本数据 */
  public setAllTexts(texts: MapText[]) {
    this._allTexts = texts;
    return this;
  }
  /**设置图片数据 */
  public setAllImgs(imgs: MapImage[]) {
    this._allImgs = imgs;
    return this;
  }
  /**设置图片数据 */
  public setAllGifs(gifs: MapGif[]) {
    this._allGifs = gifs;
    return this;
  }
  /**增加原点 */
  public addArc(arc: MapArc) {
    if (!arc.latlngs && !arc.latlng) return this;
    this._allArcs.push(arc);
    return this;
  }
  /**增加线 */
  public addLine(line: MapLine) {
    if (!line.latlngs) return this;
    this._allLines.push(line);
    return this;
  }
  /**增加贝塞尔曲线 */
  public addBezierLine(line: MapLine) {
    if (!line.latlngs) return this;
    this._allBLins.push(line);
    return this;
  }
  /**增加多边形 */
  public addRect(rect: MapRect) {
    if (!rect.latlngs) return this;
    this._allRects.push(rect);
    return this;
  }
  /**增加文本 */
  public addText(text: MapText) {
    if (!text.latlngs && !text.latlng) return this;
    this._allTexts.push(text);
    return this;
  }
  /**增加图片 */
  public addImg(img: MapImage) {
    if (!img.latlngs && !img.latlng) return this;
    this._allImgs.push(img);
    return this;
  }
  /**删除指定圆点 */
  public delArc(arc: MapArc) {
    u_arrItemDel(this._allArcs, arc);
    return this;
  }
  /**删除指定线 */
  public delLine(line: MapLine) {
    u_arrItemDel(this._allLines, line);
    return this;
  }
  /**删除指定贝塞尔曲线 */
  public delBezierLine(line: MapLine) {
    u_arrItemDel(this._allBLins, line);
    return this;
  }
  /**删除指定多边形 */
  public delRect(rect: MapRect) {
    u_arrItemDel(this._allRects, rect);
    return this;
  }
  /**删除指定文本 */
  public delText(text: MapText) {
    u_arrItemDel(this._allTexts, text);
    return this;
  }
  /**删除指定Img */
  public delImg(img: MapImage) {
    u_arrItemDel(this._allImgs, img);
    return this;
  }
  /**清空
   * @param type 不填清空所有内容数据
   */
  public delAll(type: 'all' | 'text' | 'arc' | 'line' | 'bezier' | 'rect' | 'img' | 'gif' = 'all') {
    const that = this;
    switch (type) {
      case 'arc':
        that._allArcs = [];
        break;
      case 'line':
        that._allLines = [];
        break;
      case 'bezier':
        that._allBLins = [];
        break;
      case 'rect':
        that._allRects = [];
        break;
      case 'img':
        that._allImgs = [];
        break;
      case 'gif':
        that._allGifs = [];
        break;
      case 'text':
        that._allTexts = [];
        break;
      case 'all':
        that._allArcs = [];
        that._allLines = [];
        that._allBLins = [];
        that._allRects = [];
        that._allImgs = [];
        that._allGifs = [];
        that._allTexts = [];
    }
    return that;
  }
  /**将对象上经纬度数据(latlngs,latlng)变换为像素XY的数据(points,point)
   * latlngs为undefined,points也为undefined
   * latlng为undefined,point为[0,0]
   */
  public transformXY(info: MapPoint & SLTCanvas.Point) {
    info.points = u_mapGetPointsByLatlngs(this.map, info.latlngs);
    info.point = u_mapGetPointByLatlng(this.map, info.latlng);
  }
  /**设置固定大小的图片 */
  public transformImageSize(img: MapImage) {
    let [x, y] = u_mapGetSizeByMap(this.map, img)
    img.size = [x, y];
  }
  private transformArcSize(arc: MapArc) {
    let [x, y] = u_mapGetSizeByMap(this.map, arc);
    /**经度的差值为X故 */
    arc.size = x;
  }
}
