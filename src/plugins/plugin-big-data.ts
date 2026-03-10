import rbush from "rbush";
import { MapPluginDraw } from "./plugin-draw";
import { SLUCanvasImg } from "../canvas";
import { u_mapGetPointByLatlng } from "../utils/slu-map";
/**
 * 大数据绘制 优化处理
 * 划分网格 同网格内设置最大图标数量
 * 超出不绘制 减少画布渲染次数
 */
export class MapPluginBigData extends MapPluginDraw {
  constructor(map: L.Map | AMAP.Map, options: Partial<SLPMap.Canvas> & BigDataOption) {
    super(map, options);
    this.bigDataOption = options;
    // this.map.on('moveend', this.resetRbush);
    // this.map.on('zoomend', this.resetRbush);
  }
  /**R树搜索 绘制 */
  private rbush = new rbush();
  private rbushData: SLTRbush[] = [];
  /**大数据绘制图标 */
  private bigDataImgs: MapImage[] = [];
  /**已渲染的图标 用于事件添加 */
  private _renderBigDataImgs: MapImageEvent[] = [];
  private bigDataOption: BigDataOption;
  get renderBigDataList() {
    return this._renderBigDataImgs;
  }
  /**绘制大量图标 rbush筛选重叠优化 */
  public setbigDataImgs(imgs: MapImage[]) {
    this.rbush.clear();
    this.rbushData = [];
    this.bigDataImgs = imgs;
    this.rbushData = imgs.map((el) => {
      this._draw.transformImageSize(el);

      return this.transformRbush(el);
    });
    // this._draw.setAllImgs(imgs)
    this.rbush.load(this.rbushData);
  }
  /**重设rbush */
  private resetRbush = () => {
    if (this.rbush) this.rbush.clear();
    this.rbushData = [];
    this.bigDataImgs.forEach((el) => {
      this.transformRbush(el);
    });
    this.rbush.load(this.rbushData);
  };
  /**
   * 将画布划分为多个矩形
   * 矩形内限制最大重叠图形，超出不绘制
   */
  handleOverlapImage() {
    const that = this,
      { canvas, rbush, ctx, _draw, map } = that,
      zoom = map.getZoom(),
      { width, height } = canvas,
      { minBound = [width, height], maxCount } = this.getZoomOption(zoom),
      [boundWidth, boundHeight] = minBound;
    // 缓存已绘制的图片
    const drawCached = new Set();
    for (let i = 0; i < width; i += boundWidth / 2) {
      for (let j = 0; j < height; j += boundHeight / 2) {
        const center = [i + boundWidth / 2, j + boundHeight / 2];
        const rects = rbush.search({
          minX: center[0] - boundWidth / 2,
          minY: center[1] - boundHeight / 2,
          maxX: center[0] + boundWidth / 2,
          maxY: center[1] + boundHeight / 2,
        }) as SLTRbush<MapImageEvent>[];
        rects.forEach((el, idx) => {
          const { data } = el;
          if ((idx < maxCount || maxCount == -1) && !drawCached.has(data)) {
            _draw.transformXY(data as any);
            drawCached.add(data);
            SLUCanvasImg.drawImg(data as any, ctx);
            this._renderBigDataImgs.push(data);
          }
        });
      }
    }
  }
  /**
   * 根据图层缩放 获取配置
   * @param zoom
   * @returns
   */
  private getZoomOption(zoom: number) {
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
    for (let i = 0; i < len - 1; i++) {
      if (zoom > zooms[i] && zoom < zooms[i + 1]) {
        return zoomOption[zooms[i]];
      }
    }
    return zoomOption[zooms[len - 1]];
  }
  /**图片转化为rbush数据格式 */
  private transformRbush(img: MapImage): SLTRbush<MapImage> {
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
    };
  }
  /**绘制所有需要绘制的类 */
  public drawMapAll() {
    console.time("start");
    this._renderBigDataImgs = [];
    this._draw.drawMapAll();
    this.handleOverlapImage();
    console.timeEnd("start");
    return this;
  }
}