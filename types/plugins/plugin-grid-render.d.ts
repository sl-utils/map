import { MapCanvasLayer, SLMap } from "../map";
import { MapType } from "../utils";
import { MDataGrid, MOptGrid } from "./grid/plugin-grid-base";
import { PluginCoastlineMask } from "./plugin-coastline-mask";
/**
 * 色斑图插件（CPU 栅格填色）
 *
 * 用于渲染海浪、风场、流场等栅格数据，支持 Worker 异步计算颜色和海岸线 Mask 裁剪。
 * 适用于海洋气象数据的可视化展示。
 *
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap SLMap 地图实例
 * @param options 配置项
 * @param mask 海岸线 Mask（可选，用于裁剪陆地区域）
 *
 * @example
 * ```typescript
 * import { SLMap, MapPluginGridRender, PluginCoastlineMask } from '@sl-utils/map';
 *
 * const map = new SLMap('map');
 * await map.init({ type: 'L' });
 *
 * // 加载海岸线数据
 * const low = await (await fetch('./assets/json/coast_low.json')).json();
 * const mid = await (await fetch('./assets/json/coast_mid.json')).json();
 * const high = await (await fetch('./assets/json/coast_high.json')).json();
 *
 * // 创建海岸线 Mask
 * const mask = new PluginCoastlineMask(
 *   [
 *     { minZoom: 0, maxZoom: 4, data: low },
 *     { minZoom: 5, maxZoom: 7, data: mid },
 *     { minZoom: 8, maxZoom: 20, data: high }
 *   ],
 *   map.map
 * );
 *
 * // 创建色斑图插件
 * const gridRender = new MapPluginGridRender(map, {
 *   zIndex: 120,
 *   mosaicColor: [
 *     '#337FFC', '#32AAFC', '#31D6FC', '#72E9C7',
 *     '#E0F16B', '#E4E35F', '#FFCC00', '#FF6600',
 *     '#FF0000', '#B03060'
 *   ],
 *   mosaicValue: [0.5, 1, 2, 3, 4, 5, 7, 9, 12, 15],
 *   pane: 'wavePane'
 * }, mask);
 *
 * // 加载并设置栅格数据
 * const waveData = await (await fetch('./json/wave-global.json')).json();
 * gridRender.setData(waveData);
 *
 * // 移除图层
 * gridRender.onRemove();
 * ```
 */
export declare class MapPluginGridRender extends MapCanvasLayer {
    constructor(sluMap: SLMap, options: Partial<MOptGrid>, mask?: PluginCoastlineMask);
    /**Worker线程:栅格插值-颜色计算-ImageBitmap生成 */
    private worker;
    /**worker任务ID-用于丢弃旧帧 */
    private workerId;
    /**海岸线mask */
    private mask?;
    /**离屏canvas */
    private offCanvas;
    /**离屏canvas ctx */
    private offCtx;
    /**栅格值 Float32Array:内存占用低,Worker传输快 */
    private gridData;
    /**栅格有效性mask 0:无效值; 1:有效值 */
    private gridMask;
    /**经度方向格点数 */
    private nx;
    /**纬度方向格点数 */
    private ny;
    /**起始经度 */
    private lng0;
    /**起始纬度 */
    private lat0;
    /**经度步长 */
    private lngΔ;
    /**纬度步长 */
    private latΔ;
    /**默认配置 */
    readonly options: MOptGrid;
    /**设置栅格数据
     * @param datas 栅格数据源
     */
    setData(datas: MDataGrid[]): void;
    /**渲染 */
    private render;
    /** worker回调
     * @param res worker结果
     */
    private workerCb;
    /**动态像素采样 越大：CPU越低，越模糊
     * @returns 像素采样率
     */
    private getSamplingRate;
    /**经纬度采样步长 越大：CPU越低，经纬度误差越大
     * @returns 经纬度采样步长
     */
    private getGeoStep;
    /**获取当前地图bbox
     * @returns bbox
     */
    private getBBox;
    /**控制地图监听事件
     * @param map 地图实例
     * @param key 事件类型
     */
    protected addMapEvents(map: MapType, key: "on" | "off"): void;
}
export interface GridRenderWorkerInfo {
    id: number;
    width: number;
    height: number;
    invalid?: null;
    samplingRate?: number;
    geoStep: number;
    geoCols: number;
    geoRows: number;
    lngLatBuffer: Float32Array;
    grid: Float32Array;
    mask: Uint8Array;
    nx: number;
    ny: number;
    lng0: number;
    lat0: number;
    lngΔ: number;
    latΔ: number;
    mosaicValue: number[];
    mosaicColor: string[];
}
