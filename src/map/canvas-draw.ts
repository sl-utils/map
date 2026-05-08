import * as L from 'leaflet';
import { u_arrItemDel, u_mapGetMapSize, u_mapGetPointByLatlng, u_mapGetPointsByLatlngs, u_mapGetSizeByMap } from '../utils/slu-map'
import { SLUCanvas, SLUCanvasGif, SLUCanvasImg, SLUCanvasText } from '../canvas';
import { MapArc, MapLine, MapRect, MapText, MapImage, MapGif, CanvasPosition, MapPosition } from '@sl-utils/map';
import { Map as MaplibreMap } from 'maplibre-gl';
import { u_drawConvertgps84Togcj02 } from '../utils';

/** 地图canvas基础图形绘制类
 * @constructor
 * @param map 地图实例
 * @param canvas 画布元素
 *  设置/新增/删除：点(arc) 线(line BezierLine) 多边形(rect) 图片(img) Gif(gif) 文本(text) 
 *  绘制：所有需要绘制的类(按drawIndex顺序)
 *  将对象上经纬度数据(latlngs,latlng)变换为像素XY的数据(points,point)
 *  设置图片/圆点的大小
 */
export class MapCanvasDraw {
  constructor(map: AMAP.Map | L.Map | MaplibreMap, canvas: HTMLCanvasElement) {
    this.map = map;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }
  /**画布 */
  private canvas: HTMLCanvasElement;
  /**画布上下文 */
  protected ctx: CanvasRenderingContext2D;
  /**地图实例 */
  protected map: AMAP.Map | L.Map | MaplibreMap;
  /**Gif实例 */
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
  /**当前地图缩放层级 */
  protected get zoom(): number {
    return this.map.getZoom();
  }
  /**清空并重新设置画布 */
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
  public drawMapAll(): void {
    this.reSetCanvas();
    this.drawByIndex();
  }
  /**绘制通过index */
  protected drawByIndex(): void {
    let that = this, { ctx, zoom } = that,
      all: any[] = that._allRects.map((e) => ({ ...e, mold: 'R' }));
    all = all.concat(that._allLines.map((e) => ({ ...e, mold: 'L' })));
    all = all.concat(that._allBLins.map((e) => ({ ...e, mold: 'B' })));
    all = all.concat(that._allArcs.map((e) => ({ ...e, mold: 'A' })));
    all = all.concat(that._allTexts.map((e) => ({ ...e, mold: 'T' })));
    all = all.concat(that._allImgs.map((e) => ({ ...e, mold: 'I' })));
    all = all.concat(that._allGifs.map((e) => ({ ...e, mold: 'G' })));
    all.sort((a, b) => (a.index || 0) - (b.index || 0));
    that._allTexts.length && SLUCanvasText.openDrawText();
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
            SLUCanvasText.drawText(e, ctx);
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
  /**设置圆点
   * @param arcs 圆点集合
   * @returns MapCanvasDraw实例
   */
  public setAllArcs(arcs: MapArc[]): MapCanvasDraw {
    u_drawConvertgps84Togcj02(this.map, arcs);
    this._allArcs = arcs;
    return this;
  }
  /**设置线数据
   * @param lines 线集合
   * @returns MapCanvasDraw实例
   */
  public setAllLines(lines: MapLine[]): MapCanvasDraw {
    u_drawConvertgps84Togcj02(this.map, lines);
    this._allLines = lines;
    return this;
  }
  /**设置贝塞尔曲线数据
   * @param lines 贝塞尔曲线集合
   * @returns MapCanvasDraw实例
   */
  public setAllBezierLines(lines: MapLine[]): MapCanvasDraw {
    u_drawConvertgps84Togcj02(this.map, lines);
    this._allBLins = lines;
    return this;
  }
  /**设置多边形数据
   * @param rects 多边形集合
   * @returns MapCanvasDraw实例
   */
  public setAllRects(rects: MapRect[]): MapCanvasDraw {
    u_drawConvertgps84Togcj02(this.map, rects);
    this._allRects = rects;
    return this;
  }
  /**设置文本数据
   * @param texts 文本集合
   * @returns MapCanvasDraw实例
   */
  public setAllTexts(texts: MapText[]): MapCanvasDraw {
    u_drawConvertgps84Togcj02(this.map, texts);
    this._allTexts = texts;
    return this;
  }
  /**设置图片数据
   * @param imgs 图片集合
   * @returns MapCanvasDraw实例
   */
  public setAllImgs(imgs: MapImage[]): MapCanvasDraw {
    u_drawConvertgps84Togcj02(this.map, imgs);
    this._allImgs = imgs;
    return this;
  }
  /**设置图片数据
   * @param gifs Gif集合
   * @returns MapCanvasDraw实例
   */
  public setAllGifs(gifs: MapGif[]): MapCanvasDraw {
    u_drawConvertgps84Togcj02(this.map, gifs);
    this._allGifs = gifs;
    return this;
  }
  /**增加圆点
   * @param arc 圆点
   * @returns MapCanvasDraw实例
   */
  public addArc(arc: MapArc): MapCanvasDraw {
    if (!arc.latlngs && !arc.latlng) return this;
    u_drawConvertgps84Togcj02(this.map, arc);
    this._allArcs.push(arc);
    return this;
  }
  /**增加线
   * @param line 线
   * @returns MapCanvasDraw实例
   */
  public addLine(line: MapLine): MapCanvasDraw {
    if (!line.latlngs) return this;
    u_drawConvertgps84Togcj02(this.map, line);
    this._allLines.push(line);
    return this;
  }
  /**增加贝塞尔曲线
   * @param line 贝塞尔曲线
   * @returns MapCanvasDraw实例
   */
  public addBezierLine(line: MapLine): MapCanvasDraw {
    if (!line.latlngs) return this;
    u_drawConvertgps84Togcj02(this.map, line);
    this._allBLins.push(line);
    return this;
  }
  /**增加多边形
   * @param rect 多边形
   * @returns MapCanvasDraw实例
   */
  public addRect(rect: MapRect): MapCanvasDraw {
    if (!rect.latlngs) return this;
    u_drawConvertgps84Togcj02(this.map, rect);
    this._allRects.push(rect);
    return this;
  }
  /**增加文本
   * @param text 文本
   * @returns MapCanvasDraw实例
   */
  public addText(text: MapText): MapCanvasDraw {
    if (!text.latlngs && !text.latlng) return this;
    u_drawConvertgps84Togcj02(this.map, text);
    this._allTexts.push(text);
    return this;
  }
  /**增加图片
   * @param img 图片
   * @returns MapCanvasDraw实例
   */
  public addImg(img: MapImage): MapCanvasDraw {
    if (!img.latlngs && !img.latlng) return this;
    u_drawConvertgps84Togcj02(this.map, img);
    this._allImgs.push(img);
    return this;
  }
  /**删除指定圆点
   * @param arc 圆点
   * @returns MapCanvasDraw实例
   */
  public delArc(arc: MapArc): MapCanvasDraw {
    u_arrItemDel(this._allArcs, arc);
    return this;
  }
  /**删除指定线
   * @param line 线
   * @returns MapCanvasDraw实例
   */
  public delLine(line: MapLine): MapCanvasDraw {
    u_arrItemDel(this._allLines, line);
    return this;
  }
  /**删除指定贝塞尔曲线
   * @param line 贝塞尔曲线
   * @returns MapCanvasDraw实例
   */
  public delBezierLine(line: MapLine): MapCanvasDraw {
    u_arrItemDel(this._allBLins, line);
    return this;
  }
  /**删除指定多边形
   * @param rect 多边形
   * @returns MapCanvasDraw实例
   */
  public delRect(rect: MapRect): MapCanvasDraw {
    u_arrItemDel(this._allRects, rect);
    return this;
  }
  /**删除指定文本
   * @param text 文本
   * @returns MapCanvasDraw实例
   */
  public delText(text: MapText): MapCanvasDraw {
    u_arrItemDel(this._allTexts, text);
    return this;
  }
  /**删除指定Img
   * @param img 图片
   * @returns MapCanvasDraw实例
   */
  public delImg(img: MapImage): MapCanvasDraw {
    u_arrItemDel(this._allImgs, img);
    return this;
  }
  /**清空
   * @param type @default 'all' ,不填清空所有内容数据
   * @returns MapCanvasDraw实例
   */
  public delAll(type: 'all' | 'text' | 'arc' | 'line' | 'bezier' | 'rect' | 'img' | 'gif' = 'all'): MapCanvasDraw {
    const that = this;
    switch (type) {
      case 'arc':
        that._allArcs.length = 0;
        break;
      case 'line':
        that._allLines.length = 0;
        break;
      case 'bezier':
        that._allBLins.length = 0;
        break;
      case 'rect':
        that._allRects.length = 0;
        break;
      case 'img':
        that._allImgs.length = 0;
        break;
      case 'gif':
        that._allGifs.length = 0;
        break;
      case 'text':
        that._allTexts.length = 0;
        break;
      case 'all':
        that._allArcs.length = 0;
        that._allLines.length = 0;
        that._allBLins.length = 0;
        that._allRects.length = 0;
        that._allImgs.length = 0;
        that._allGifs.length = 0;
        that._allTexts.length = 0;
    }
    return that;
  }
  /**将对象上经纬度数据(latlngs,latlng)变换为像素XY的数据(points,point)
   * latlngs为undefined,points也为undefined
   * latlng为undefined,point为[0,0]
   * @param info 对象
   */
  public transformXY(info: MapPosition & CanvasPosition): void {
    info.points = u_mapGetPointsByLatlngs(this.map, info.latlngs);
    info.point = u_mapGetPointByLatlng(this.map, info.latlng);
  }
  /**设置图片的大小
   * @param img 图片
   */
  public transformImageSize(img: MapImage): void {
    let [x, y] = u_mapGetSizeByMap(this.map, img)
    img.size = [x, y];
  }
  /**设置圆点的大小
   * @param arc 圆点
   */
  private transformArcSize(arc: MapArc): void {
    let [x, y] = u_mapGetSizeByMap(this.map, arc);
    /**经度的差值为X故 */
    arc.size = x;
  }
}
