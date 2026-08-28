import { Map as LMap } from 'leaflet';
import { Map as MaplibreMap } from 'maplibre-gl';
/**
 * 海岸线 Mask 生成器
 *
 * 用于根据海岸线数据生成遮罩，支持 bbox 裁剪和按 zoom 自动切换海岸线精度。
 * 常用于风浪流数据裁剪、海洋粒子遮罩、气象海洋渲染等场景。
 *
 * @constructor
 * @param sources 海岸线数据源数组，按精度分级
 * @param map 地图实例
 *
 * @example
 * ```typescript
 * import { SLUMap, PluginCoastlineMask, MapPluginGridRender } from '@sl-utils/map';
 *
 * const map = new SLUMap('map');
 * await map.init({ type: 'L' });
 *
 * // 加载不同精度的海岸线数据
 * const low = await (await fetch('./assets/json/coast_low.json')).json();   // 低精度 (zoom 0-4)
 * const mid = await (await fetch('./assets/json/coast_mid.json')).json();   // 中精度 (zoom 5-7)
 * const high = await (await fetch('./assets/json/coast_high.json')).json(); // 高精度 (zoom 8-20)
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
 * // 获取指定区域的 Mask Canvas
 * const bbox = [100, 20, 130, 40]; // [west, south, east, north]
 * const zoom = 8;
 * const width = 800;
 * const height = 600;
 * const maskCanvas = mask.getMask(bbox, zoom, width, height);
 *
 * // 使用 Mask 裁剪色斑图
 * const gridRender = new MapPluginGridRender(map, {
 *   mosaicColor: ['#337FFC', '#32AAFC', '#FF0000'],
 *   mosaicValue: [1, 5, 15]
 * }, mask);
 *
 * // 清除缓存
 * mask.clearCache();
 * ```
 */
export declare class PluginCoastlineMask {
    constructor(sources: DataCoastline[], map: AMAP.Map | LMap | MaplibreMap);
    /**地图实例 */
    private map;
    /**海岸线数据源 */
    private sources;
    /**canvas缓存 */
    private cacheCanvas;
    /**缓存key */
    private cacheKey;
    /**世界复制偏移(低zoom会出现世界复制，所以海岸线也需要同步复制) */
    private readonly worldOffsets;
    /**获取mask
     * @param bbox 经纬度bbox
     * @param zoom 缩放层级
     * @param width canvas宽度
     * @param height canvas高度
     * @returns mask canvas
     */
    getMask(bbox: BBox, zoom: number, width: number, height: number): HTMLCanvasElement;
    /**根据zoom选择海岸线数据
     * @param zoom 缩放层级
     * @returns 海岸线数据源
     */
    private pickSource;
    /**标准化经度 转换到：[-180, 180]
     * @param lng 经度
     * @returns 标准化后的经度
     */
    private normalizeLng;
    /**标准化bbox 如：[220, ... ,260]=>[-140, ... ,-100]
     * @param bbox 经纬度bbox
     * @returns 标准化后的经纬度bbox
     */
    private normalizeBBox;
    /**bbox裁剪GeoJSON
     * @param geojson GeoJSON数据
     * @param bbox 经纬度bbox
     * @returns 裁剪后的GeoJSON数据
    */
    private clipGeoJSON;
    /**构建mask canvas
     * @param width canvas宽度
     * @param height canvas高度
     * @param geojson GeoJSON数据
     * @returns mask canvas
     */
    private buildMaskCanvas;
    /**绘制polygon
     * @param ctx canvas上下文
     * @param coordinates polygon坐标
     */
    private drawPolygon;
    /**构建缓存key,带容差：避免拖动1px就重建
     * @param bbox 经纬度bbox
     * @param zoom 缩放级别
     * @param width canvas宽度
     * @param height canvas高度
     * @returns 缓存key
    */
    private buildCacheKey;
    /**清除缓存 */
    clearCache(): void;
}
/**边界框 */
export type BBox = [number, number, number, number];
/**海岸线数据 */
export interface DataCoastline {
    /**最小层级 */
    minZoom: number;
    /**最大层级 */
    maxZoom: number;
    /**GeoJSON数据 */
    data: GeoJSON.FeatureCollection;
}
