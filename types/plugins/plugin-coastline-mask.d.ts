import { Map as LMap } from 'leaflet';
import { Map as MaplibreMap } from 'maplibre-gl';
import { BBox, DataCoastline } from '../types';
/**海岸线Mask生成器: bbox裁剪、自动按zoom切换海岸线精度
 * @constructor
 * @param sources 海岸线数据源
 * @param map 地图实例
 * 适用于：
 * - 风浪流裁剪
 * - 海洋粒子遮罩
 * - 海岸线mask
 * - 气象海洋渲染
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
