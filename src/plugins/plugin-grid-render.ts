import { MapCanvasLayer, SLUMap } from "../map";
import { SLUWorker } from "../utils/slu-worker";
import { u_mapGetLatLngByPoint, u_mapGetMapSize } from "../utils/slu-map";
import { DataMapGrid, OptMapGrid, PluginCoastlineMask, GridRenderWorkerInfo } from "@sl-utils/map";
import { Map as MaplibreMap } from "maplibre-gl";

/**
 * 色斑图插件（CPU栅格填色）
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap - SLUMap实例
 * @param options - 配置项
 * @param mask - 海岸线Mask /可选
 *
 * 功能：
 * 1. 渲染海浪/风场/流场等栅格数据
 * 2. Worker异步计算颜色
 * 3. Canvas绘制
 * 4. 海岸线Mask裁剪
 *
 * 适用于：
 * - 海浪
 * - 海流
 * - 风场
 * - 温度场
 * - 盐度场
 * - 任意规则经纬度栅格
 */
export class MapPluginGridRender extends MapCanvasLayer {
  constructor(sluMap: SLUMap, options: Partial<OptMapGrid>, mask?: PluginCoastlineMask) {
    super(sluMap.map, options);
    Object.assign(this.options, options);
    this.mask = mask;
    /**离屏canvas: worker结果中转-mask裁剪-最终再绘制到主canvas */
    this.offCanvas = document.createElement("canvas");
    /**desynchronized:降低主线程阻塞,高频render时有帮助 */
    this.offCtx = this.offCanvas.getContext("2d", { alpha: true, desynchronized: true })!;
  }
  /**Worker线程:栅格插值-颜色计算-ImageBitmap生成 */
  private worker: SLUWorker<GridRenderWorkerInfo, { workerId: number; data: ImageBitmap; }> = new SLUWorker<GridRenderWorkerInfo, { workerId: number; data: ImageBitmap }>("gridRender", (d) => this.workerCb(d));
  /**worker任务ID-用于丢弃旧帧 */
  private workerId = 0;
  /**海岸线mask */
  private mask?: PluginCoastlineMask;
  /**离屏canvas */
  private offCanvas: HTMLCanvasElement;
  /**离屏canvas ctx */
  private offCtx: CanvasRenderingContext2D;
  /**栅格值 Float32Array:内存占用低,Worker传输快 */
  private gridData!: Float32Array;
  /**栅格有效性mask 0:无效值; 1:有效值 */
  private gridMask!: Uint8Array;
  /**经度方向格点数 */
  private nx!: number;
  /**纬度方向格点数 */
  private ny!: number;
  /**起始经度 */
  private lng0!: number;
  /**起始纬度 */
  private lat0!: number;
  /**经度步长 */
  private lngΔ!: number;
  /**纬度步长 */
  private latΔ!: number;
  /**默认配置 */
  public readonly options: OptMapGrid = {
    pane: "wavePane",
    zIndex: 200,
    mosaicColor: ["#337FFC", "#32AAFC", "#31D6FC", "#72E9C7", "#E0F16B", "#E4E35F",
      "#FFCC00", "#FF6600", "#FF0000", "#B03060",],
    mosaicValue: [0.5, 1, 2, 3, 4, 5, 7, 9, 12, 15]
  };
  /**设置栅格数据
   * @param datas 栅格数据源
   */
  public setData(datas: DataMapGrid[]): void {
    if (!datas || datas.length === 0) {
      this.gridData = new Float32Array(0);
      this.gridMask = new Uint8Array(0);
    } else {
      const header = datas[0].header;
      this.lng0 = header.lo1;
      this.lat0 = header.la1;
      this.lngΔ = header.dx;
      this.latΔ = header.dy;
      this.nx = header.nx;
      this.ny = header.ny;
      /**原始栅格数据     */
      const raw = datas[0].data;
      const grid = new Float32Array(raw.length);
      /**有效值mask */
      const mask = new Uint8Array(raw.length);
      for (let i = 0, len = raw.length; i < len; i++) {
        const v = raw[i];
        /**过滤无效值 */
        if (v == null || Number.isNaN(v) || !Number.isFinite(v)) {
          mask[i] = 0;
          grid[i] = 0;
        } else {
          mask[i] = 1;
          grid[i] = v;
        }
      }
      this.gridData = grid;
      this.gridMask = mask;
    }
    this.render();
  }
  /**渲染 */
  private render(): void {
    const { w, h } = u_mapGetMapSize(this.map);
    /** 像素采样率 越大:CPU越低,清晰度越差 */
    const samplingRate = this.getSamplingRate();
    /** 经纬度采样步长 用于降低：map.pointToLatLng调用次数 */
    const geoStep = this.getGeoStep();
    /**经纬度采样网格 */
    const geoCols = Math.ceil(w / geoStep) + 1;
    const geoRows = Math.ceil(h / geoStep) + 1;
    /**经纬度缓存 存储：[lng, lat, lng, lat...], 避免worker内频繁调用地图投影,降低CPU使用率 */
    const lngLatBuffer = new Float32Array(geoCols * geoRows * 2);
    let ptr = 0;
    /**预采样地图经纬度 */
    for (let gy = 0; gy < geoRows; gy++) {
      const py = Math.min(h, gy * geoStep);
      for (let gx = 0; gx < geoCols; gx++) {
        const px = Math.min(w, gx * geoStep);
        /**屏幕坐标 -> 经纬度 */
        const latlng = u_mapGetLatLngByPoint(this.map, [px, py]);
        lngLatBuffer[ptr++] = latlng[1];
        lngLatBuffer[ptr++] = latlng[0];
      }
    }
    this.worker.post({
      id: this.workerId++,
      width: Math.floor(w),
      height: Math.floor(h),
      invalid: null,
      samplingRate,
      geoStep,
      geoCols,
      geoRows,
      lngLatBuffer,
      grid: this.gridData,
      mask: this.gridMask,
      nx: this.nx,
      ny: this.ny,
      lng0: this.lng0,
      lat0: this.lat0,
      lngΔ: this.lngΔ,
      latΔ: this.latΔ,
      mosaicValue: this.options.mosaicValue,
      mosaicColor: this.options.mosaicColor
    }, [
      /**Transferable 零拷贝传输 */
      lngLatBuffer.buffer
    ]);
  }
  /** worker回调
   * @param res worker结果 
   */
  private workerCb(res: { workerId: number, data: ImageBitmap }): void {
    /**丢弃旧帧 防止快速拖动地图时worker结果乱序 */
    if ((this.workerId - 1) !== res.workerId) {
      return;
    }
    const { w, h } = u_mapGetMapSize(this.map);
    this.offCanvas.width = w;
    this.offCanvas.height = h;
    /**清空离屏canvas */
    this.offCtx.clearRect(0, 0, w, h);
    /**绘制worker结果 */
    this.offCtx.drawImage(res.data, 0, 0);
    /**海岸线裁剪 */
    if (this.mask) {
      const bbox = this.getBBox();
      const zoom = this.map.getZoom();
      const maskCanvas = this.mask.getMask(bbox, zoom, w, h);
      this.offCtx.save();
      /**destination-out:黑色区域被裁掉 */
      this.offCtx.globalCompositeOperation = "destination-out";
      this.offCtx.drawImage(maskCanvas, 0, 0);
      this.offCtx.restore();
    }
    /**重置主canvas */
    this.resetCanvas();
    /**绘制最终结果 */
    this.ctx.drawImage(this.offCanvas, 0, 0);
  }
  /**动态像素采样 越大：CPU越低，越模糊
   * @returns 像素采样率
   */
  private getSamplingRate(): number {
    const zoom = this.map.getZoom();
    // if (zoom <= 3) return 3;
    // if (zoom <= 5) return 2;
    return 1;
  }
  /**经纬度采样步长 越大：CPU越低，经纬度误差越大
   * @returns 经纬度采样步长
   */
  private getGeoStep(): number {
    const zoom = this.map.getZoom();
    if (zoom >= 8) return 4;
    if (zoom >= 6) return 6;
    if (zoom >= 4) return 8;
    return 12;
  }
  /**获取当前地图bbox
   * @returns bbox
   */
  private getBBox(): [number, number, number, number] {
    const b: any = this.map.getBounds();
    /**Leaflet / MapLibre     */
    if (b.getWest) {
      return [
        b.getWest(),
        b.getSouth(),
        b.getEast(),
        b.getNorth()
      ];
    }
    /**AMap */
    return [
      b.getSouthWest().lng,
      b.getSouthWest().lat,
      b.getNorthEast().lng,
      b.getNorthEast().lat
    ];
  }
  /**控制地图监听事件
   * @param map 地图实例
   * @param key 事件类型
   */
  protected addMapEvents(map: L.Map | AMAP.Map | MaplibreMap, key: "on" | "off"): void {
    const render = () => this.render();
    map[key]("moveend", render);
    map[key]("zoomend", render);
  }
}