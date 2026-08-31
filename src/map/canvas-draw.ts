import { MapType, um_arrItemDel, um_getMapSize, um_getPointByLnglat, um_getPointsByLnglats, um_getSizeByMap } from '../utils'
import { SLUCanvas, SLUCanvasGif, SLUCanvasImg, SLUCanvasText } from '../canvas';
import type { CanvasGif, CanvasImage, CanvasPosition, CanvasTextPanel, OptCanvas, TextOverlap } from '../canvas';
import { um_drawConvertgps84Togcj02 } from '../utils';

/** 地图canvas基础图形绘制类
 * @constructor
 * @param map 地图实例
 * @param canvas 画布元素
 *  设置/新增/删除：点(arc) 线(line BezierLine) 多边形(rect) 图片(img) Gif(gif) 文本(text) 
 *  绘制：所有需要绘制的类(按drawIndex顺序)
 *  将对象上经纬度数据(lnglats,lnglat)变换为像素XY的数据(points,point)
 *  设置图片/圆点的大小
 */
export class MapCanvasDraw {
  constructor(map: MapType, canvas: HTMLCanvasElement) {
    this.map = map;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }
  /**画布 */
  private canvas: HTMLCanvasElement;
  /**画布上下文 */
  protected ctx: CanvasRenderingContext2D;
  /**地图实例 */
  protected map: MapType;
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
    const { w, h } = um_getMapSize(map);
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
    um_drawConvertgps84Togcj02(this.map, arcs);
    this._allArcs = arcs;
    return this;
  }
  /**设置线数据
   * @param lines 线集合
   * @returns MapCanvasDraw实例
   */
  public setAllLines(lines: MapLine[]): MapCanvasDraw {
    um_drawConvertgps84Togcj02(this.map, lines);
    this._allLines = lines;
    return this;
  }
  /**设置贝塞尔曲线数据
   * @param lines 贝塞尔曲线集合
   * @returns MapCanvasDraw实例
   */
  public setAllBezierLines(lines: MapLine[]): MapCanvasDraw {
    um_drawConvertgps84Togcj02(this.map, lines);
    this._allBLins = lines;
    return this;
  }
  /**设置多边形数据
   * @param rects 多边形集合
   * @returns MapCanvasDraw实例
   */
  public setAllRects(rects: MapRect[]): MapCanvasDraw {
    um_drawConvertgps84Togcj02(this.map, rects);
    this._allRects = rects;
    return this;
  }
  /**设置文本数据
   * @param texts 文本集合
   * @returns MapCanvasDraw实例
   */
  public setAllTexts(texts: MapText[]): MapCanvasDraw {
    um_drawConvertgps84Togcj02(this.map, texts);
    this._allTexts = texts;
    return this;
  }
  /**设置图片数据
   * @param imgs 图片集合
   * @returns MapCanvasDraw实例
   */
  public setAllImgs(imgs: MapImage[]): MapCanvasDraw {
    um_drawConvertgps84Togcj02(this.map, imgs);
    this._allImgs = imgs;
    return this;
  }
  /**设置图片数据
   * @param gifs Gif集合
   * @returns MapCanvasDraw实例
   */
  public setAllGifs(gifs: MapGif[]): MapCanvasDraw {
    um_drawConvertgps84Togcj02(this.map, gifs);
    this._allGifs = gifs;
    return this;
  }
  /**增加圆点
   * @param arc 圆点
   * @returns MapCanvasDraw实例
   */
  public addArc(arc: MapArc): MapCanvasDraw {
    if (!arc.lnglats && !arc.lnglat) return this;
    um_drawConvertgps84Togcj02(this.map, arc);
    this._allArcs.push(arc);
    return this;
  }
  /**增加线
   * @param line 线
   * @returns MapCanvasDraw实例
   */
  public addLine(line: MapLine): MapCanvasDraw {
    if (!line.lnglats) return this;
    um_drawConvertgps84Togcj02(this.map, line);
    this._allLines.push(line);
    return this;
  }
  /**增加贝塞尔曲线
   * @param line 贝塞尔曲线
   * @returns MapCanvasDraw实例
   */
  public addBezierLine(line: MapLine): MapCanvasDraw {
    if (!line.lnglats) return this;
    um_drawConvertgps84Togcj02(this.map, line);
    this._allBLins.push(line);
    return this;
  }
  /**增加多边形
   * @param rect 多边形
   * @returns MapCanvasDraw实例
   */
  public addRect(rect: MapRect): MapCanvasDraw {
    if (!rect.lnglats) return this;
    um_drawConvertgps84Togcj02(this.map, rect);
    this._allRects.push(rect);
    return this;
  }
  /**增加文本
   * @param text 文本
   * @returns MapCanvasDraw实例
   */
  public addText(text: MapText): MapCanvasDraw {
    if (!text.lnglats && !text.lnglat) return this;
    um_drawConvertgps84Togcj02(this.map, text);
    this._allTexts.push(text);
    return this;
  }
  /**增加图片
   * @param img 图片
   * @returns MapCanvasDraw实例
   */
  public addImg(img: MapImage): MapCanvasDraw {
    if (!img.lnglats && !img.lnglat) return this;
    um_drawConvertgps84Togcj02(this.map, img);
    this._allImgs.push(img);
    return this;
  }
  /**删除指定圆点
   * @param arc 圆点
   * @returns MapCanvasDraw实例
   */
  public delArc(arc: MapArc): MapCanvasDraw {
    um_arrItemDel(this._allArcs, arc);
    return this;
  }
  /**删除指定线
   * @param line 线
   * @returns MapCanvasDraw实例
   */
  public delLine(line: MapLine): MapCanvasDraw {
    um_arrItemDel(this._allLines, line);
    return this;
  }
  /**删除指定贝塞尔曲线
   * @param line 贝塞尔曲线
   * @returns MapCanvasDraw实例
   */
  public delBezierLine(line: MapLine): MapCanvasDraw {
    um_arrItemDel(this._allBLins, line);
    return this;
  }
  /**删除指定多边形
   * @param rect 多边形
   * @returns MapCanvasDraw实例
   */
  public delRect(rect: MapRect): MapCanvasDraw {
    um_arrItemDel(this._allRects, rect);
    return this;
  }
  /**删除指定文本
   * @param text 文本
   * @returns MapCanvasDraw实例
   */
  public delText(text: MapText): MapCanvasDraw {
    um_arrItemDel(this._allTexts, text);
    return this;
  }
  /**删除指定Img
   * @param img 图片
   * @returns MapCanvasDraw实例
   */
  public delImg(img: MapImage): MapCanvasDraw {
    um_arrItemDel(this._allImgs, img);
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
  /**将对象上经纬度数据(lnglats,lnglat)变换为像素XY的数据(points,point)
   * lnglats为undefined,points也为undefined
   * lnglat为undefined,point为[0,0]
   * @param info 对象
   */
  public transformXY(info: MapPosition & CanvasPosition): void {
    info.points = um_getPointsByLnglats(this.map, info.lnglats);
    info.point = um_getPointByLnglat(this.map, info.lnglat);
  }
  /**设置图片的大小
   * @param img 图片
   */
  public transformImageSize(img: MapImage): void {
    let [x, y] = um_getSizeByMap(this.map, img)
    img.size = [x, y];
  }
  /**设置圆点的大小
   * @param arc 圆点
   */
  private transformArcSize(arc: MapArc): void {
    let [x, y] = um_getSizeByMap(this.map, arc);
    /**经度的差值为X故 */
    arc.size = x;
  }
}

// =============== 类型约束 ===============

/**地图上的单点位信息 */
export interface MapPoint {
  /**单经纬度 [lng, lat] */
  lnglat: [number, number],
  /**经纬度集合 */
  lnglats?: [number, number][],
}

/**地图上的多点位信息 */
export interface MapPoints {
  /**经纬度集合 */
  lnglats: [number, number][],
  /**单经纬度 */
  lnglat?: [number, number],
}

/**地图上的大小配置(可选固定大小) */
interface Size_ {
  /**图片大小 */
  size: [number, number] | number
  /**固定的图片大小 */
  sizeFix?: [number, number] | number
}

/**地图上的固定大小配置(以米为单位) */
export interface SizeFix_ {
  /**图片大小 */
  size?: [number, number] | number
  /**固定的图片大小，以米为单位 */
  sizeFix: [number, number] | number
}

/**地图元素显示的相关配置 */
export interface MapShow {
  /**显示的最大地图级别(包含此级别) */
  maxZoom?: number,
  /**显示的最小地图级别(包含此级别) */
  minZoom?: number,
  /**绘制层级，类似z-index */
  index?: number,
}

/**地图上的图片(无事件) @template I 标识图片携带的info的类型 */
type CanavsImageNoPosition<I> = Omit<CanvasImage<I>, keyof CanvasPosition>;

/**地图上的位置数据，支持单点或多点 */
export type MapPosition = MapPoint | MapPoints;

/**地图上的大小配置，支持普通大小或固定大小 */
export type MapSize = Size_ | SizeFix_;

/**地图上的图片(无事件) @template I 标识图片携带的info的类型 */
export type MapImage<I = any> = CanavsImageNoPosition<I> & MapShow & MapPosition & MapSize;

/**地图上的Gif(无事件) @template I 标识Gif携带的info的类型 */
export type MapGif<I = any> = CanvasGif<I> & MapShow & MapPosition & MapSize;



/**地图文本基础配置 @template I 标识文本携带的info的类型 */
export interface MapTextBase<I = any> extends OptCanvas {
  /**文本内容 */
  text?: string;
  /**是否描边 */
  ifShadow?: boolean;
  /**水平偏移量 */
  px?: number;
  /**垂直偏移量 */
  py?: number;
  /**文本行间距 */
  lineHeight?: number;
  /**文本最大宽度 */
  maxWidth?: number;
  /**背景板配置 */
  panel?: CanvasTextPanel;
  /**文本重叠处理配置 */
  overlap?: TextOverlap;
  /**自定义信息 */
  info?: I;
}

/**不带事件的地图文本类 @template I 标识文本携带的info的类型 */
export type MapText<I = any> = MapTextBase<I> & MapShow & MapPosition;

/**不带事件的地图圆点类 */
export type MapArc = OptCanvas & MapShow & MapPosition & MapSize;

/**不带事件的地图矩形类 */
export type MapRect = OptCanvas & MapShow & MapPoints;

/**不带事件的地图多边形类 */
export type MapPolygon = OptCanvas & MapShow & MapPoints;

/**不带事件的地图线条类 */
export type MapLine = OptCanvas & MapShow & MapPoints;