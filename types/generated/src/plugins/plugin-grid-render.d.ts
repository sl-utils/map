import { MapCanvasLayer, SLUMap } from "../map";
import { DataMapGrid, OptMapGrid } from "../types";
import { Map as MaplibreMap } from "maplibre-gl";
import { PluginCoastlineMask } from "./plugin-coastline-mask";
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
export declare class MapPluginGridRender extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options: Partial<OptMapGrid>, mask?: PluginCoastlineMask);
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
    readonly options: OptMapGrid;
    /**设置栅格数据
     * @param datas 栅格数据源
     */
    setData(datas: DataMapGrid[]): void;
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
    protected addMapEvents(map: L.Map | AMAP.Map | MaplibreMap, key: "on" | "off"): void;
}
