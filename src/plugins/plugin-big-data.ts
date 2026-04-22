import rbush, { BBox } from "rbush";
import { MapPluginDraw } from "./plugin-draw";
import { SLUCanvasImg, SLUCanvasText } from "../canvas";
import { u_mapGetPointByLatlng } from "../utils/slu-map";
import { SLUMap } from "../map";
import { OptMapCanvas, OptBigData, MapRbush, MapImage, MapImageEvent, MapImageRender } from "@sl-utils/map";
import RBush from "rbush";
import { u_drawConvertgps84Togcj02 } from "../utils";
/**大数据绘制 优化处理
 * @extends MapPluginDraw
 * @param sluMap 地图实例
 * @param options 大数据绘制选项
 * 划分网格 同网格内设置最大图标数量
 * 超出不绘制 减少画布渲染次数
 */
export class MapPluginBigData extends MapPluginDraw {
  constructor(sluMap: SLUMap, options: OptBigData) {
    super(sluMap, options);
    this.bigDataOption = options;
    // this.map.on('moveend', this.resetRbush);
    // this.map.on('zoomend', this.resetRbush);
  }
  /**R树搜索 绘制 */
  private rbush: RBush<MapRbush<MapImageRender>> = new rbush();
  /**R树搜索 矩形 */
  private readonly rbush_search: BBox = Object.create({});
  /**R树搜索 数据 */
  private rbushData: MapRbush[] = [];
  /**大数据绘制图标 */
  private bigDataImgs: MapImage[] = [];
  /**已渲染的图标 用于事件添加 */
  private _renderBigDataImgs: MapImageEvent[] = [];
  /**大数据绘制选项 */
  private bigDataOption: OptBigData;
  /**大数据绘制图标 用于事件添加 */
  get renderBigDataList(): MapImageEvent[] {
    return this._renderBigDataImgs;
  }
  /**绘制大量图标 rbush筛选重叠优化
   * @param imgs 图标数组
   */
  public setbigDataImgs(imgs: MapImage[]): void {
    this.rbush.clear();
    this.rbushData.length = 0;
    u_drawConvertgps84Togcj02(this.map, imgs);
    this.bigDataImgs = imgs;
    this.rbushData = imgs.map((el) => {
      this._draw.transformImageSize(el);
      return this.transformRbush(el);
    });
    // this._draw.setAllImgs(imgs)
    this.rbush.load(this.rbushData);
    this.drawMapAll();
  }
  /**重设rbush */
  private resetRbush = (): void => {
    if (this.rbush) this.rbush.clear();
    this.rbushData.length = 0;
    this.bigDataImgs.forEach((el) => {
      this.transformRbush(el);
    });
    this.rbush.load(this.rbushData);
  };
  /**
   * 将画布划分为多个矩形
   * 矩形内限制最大重叠图形，超出不绘制
   */
  private handleOverlapImage(): void {
    const that = this,
      { canvas, rbush, ctx, _draw, map } = that,
      zoom = map.getZoom(),
      { width, height } = canvas,
      { minBound = [width, height], maxCount } = this.getZoomOption(zoom),
      [boundWidth, boundHeight] = minBound;
    // 缓存已绘制的图片
    const drawCached = new Set();
    // SLUCanvasText.openDrawText();
    for (let i = 0; i < width; i += boundWidth / 2) {
      for (let j = 0; j < height; j += boundHeight / 2) {
        const center = [i + boundWidth / 2, j + boundHeight / 2];
        const search = this.rbush_search;
        search.maxX = center[0] + boundWidth / 2, search.minX = center[0] - boundWidth / 2,
          search.maxY = center[1] + boundHeight / 2, search.minY = center[1] - boundHeight / 2;
        const rects = rbush.search(search);
        rects.forEach((el, idx) => {
          const { data } = el;
          if ((idx < maxCount || maxCount == -1) && !drawCached.has(data)) {
            _draw.transformXY(data);
            drawCached.add(data);
            SLUCanvasImg.drawImg(data, ctx);
            // SLUCanvasText.drawText({ ...data, text: data.info.mmsi, overlap: { type: 'py' } }, ctx);
            this._renderBigDataImgs.push(data);
          }
        });
      }
    }
  }
  /**
   * 根据图层缩放 获取配置
   * @param zoom
   * @returns { maxCount: number; minBound?: [number, number]; }
   */
  private getZoomOption(zoom: number): { maxCount: number; minBound?: [number, number]; } {
    const that = this,
      { bigDataOption } = that,
      { zoomOption } = bigDataOption;
    if (zoomOption[zoom]) return zoomOption[zoom];
    // 增序
    const zooms = Object.keys(zoomOption)
      .map((el) => Number(el))
      .sort((a, b) => Number(a) - Number(b));
    const len = zooms.length;
    // 取前区域配置 若无取后区域配置
    for (let i = 0, len = zooms.length - 1; i < len; i++) {
      if (zoom > zooms[i] && zoom < zooms[i + 1]) {
        return zoomOption[zooms[i]];
      }
    }
    return zoomOption[zooms[len - 1]];
  }
  /**图片转化为rbush数据格式
   * @param img 图标
   * @returns rbush数据格式
   */
  private transformRbush(img: MapImage): MapRbush<MapImage> {
    const { latlng, size = [0, 0], left = 0, top = 0 } = img;
    let sizeX: number = size[0],
      sizeY: number = size[1];
    let [x, y] = u_mapGetPointByLatlng(this.map, latlng);
    return {
      minX: x - sizeX / 2 + left,
      minY: y - sizeY / 2 + top,
      maxX: x + sizeX / 2 + left,
      maxY: y + sizeY / 2 + top,
      data: img,
      latlng: latlng
    };
  }
  /**绘制所有需要绘制的类
   * @returns MapPluginBigData实例
   */
  public drawMapAll(): this {
    console.time("start");
    this._renderBigDataImgs.length = 0;
    this._draw.drawMapAll();
    this.handleOverlapImage();
    console.timeEnd("start");
    return this;
  }
}