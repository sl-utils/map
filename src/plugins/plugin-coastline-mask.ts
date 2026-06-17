import bboxClip from '@turf/bbox-clip';
import { u_mapGetPointByLatlng } from '../utils/slu-map';
import { Map as LMap } from 'leaflet';
import { Map as MaplibreMap } from 'maplibre-gl';
import { BBox, DataCoastline } from '../types';

type ClipGeometry = GeoJSON.LineString | GeoJSON.MultiLineString | GeoJSON.Polygon | GeoJSON.MultiPolygon;
const clipGeometryTypes: GeoJSON.GeoJsonTypes[] = ['LineString', 'MultiLineString', 'Polygon', 'MultiPolygon'];

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
export class PluginCoastlineMask {
    constructor(sources: DataCoastline[], map: AMAP.Map | LMap | MaplibreMap) {
        this.sources = sources;
        this.map = map;
    }
    /**地图实例 */
    private map: AMAP.Map | LMap | MaplibreMap;
    /**海岸线数据源 */
    private sources: DataCoastline[] = [];
    /**canvas缓存 */
    private cacheCanvas: HTMLCanvasElement | null = null;
    /**缓存key */
    private cacheKey = '';
    /**世界复制偏移(低zoom会出现世界复制，所以海岸线也需要同步复制) */
    private readonly worldOffsets = [-720, -360, 0, 360, 720];
    /**获取mask
     * @param bbox 经纬度bbox
     * @param zoom 缩放层级
     * @param width canvas宽度
     * @param height canvas高度
     * @returns mask canvas
     */
    public getMask(bbox: BBox, zoom: number, width: number, height: number): HTMLCanvasElement {
        const key = this.buildCacheKey(bbox, zoom, width, height);
        if (this.cacheKey === key && this.cacheCanvas) {
            return this.cacheCanvas;
        }
        const source = this.pickSource(zoom);
        const normalizedBBox = this.normalizeBBox(bbox);
        const clipped = this.clipGeoJSON(source.data, normalizedBBox);
        const canvas = this.buildMaskCanvas(width, height, clipped);
        this.cacheCanvas = canvas;
        this.cacheKey = key;
        return canvas;
    }
    /**根据zoom选择海岸线数据
     * @param zoom 缩放层级
     * @returns 海岸线数据源
     */
    private pickSource(zoom: number): DataCoastline {
        const len = this.sources.length;
        for (let i = 0; i < len; i++) {
            const source = this.sources[i];
            if (zoom >= source.minZoom && zoom <= source.maxZoom) {
                return source;
            }
        }
        /**默认返回最后一个 */
        return this.sources[len - 1];
    }
    /**标准化经度 转换到：[-180, 180]
     * @param lng 经度
     * @returns 标准化后的经度
     */
    private normalizeLng(lng: number): number {
        while (lng > 180) {
            lng -= 360;
        }
        while (lng < -180) {
            lng += 360;
        }
        return lng;
    }
    /**标准化bbox 如：[220, ... ,260]=>[-140, ... ,-100]
     * @param bbox 经纬度bbox
     * @returns 标准化后的经纬度bbox
     */
    private normalizeBBox(bbox: BBox): BBox {
        let [west, south, east, north] = bbox;
        west = this.normalizeLng(west);
        east = this.normalizeLng(east);
        return [west, south, east, north];
    }
    /**bbox裁剪GeoJSON
     * @param geojson GeoJSON数据
     * @param bbox 经纬度bbox
     * @returns 裁剪后的GeoJSON数据
    */
    private clipGeoJSON(geojson: GeoJSON.FeatureCollection, bbox: BBox): GeoJSON.FeatureCollection {
        const [west, south, east, north] = bbox;
        const result: GeoJSON.Feature[] = [];
        /**是否跨国际日期变更线 如：[170, ..., -170] */
        const bboxes: BBox[] = west > east ? [[west, south, 180, north], [-180, south, east, north]] : [bbox];
        const features = geojson.features;
        for (let i = 0, len = features.length; i < len; i++) {
            const feature = features[i];
            if (!feature.geometry) continue;
            if (!clipGeometryTypes.includes(feature.geometry.type)) continue;
            for (let j = 0, len2 = bboxes.length; j < len2; j++) {
                try {
                    const clipped = bboxClip(feature as GeoJSON.Feature<ClipGeometry>, bboxes[j]);
                    if (clipped && clipped.geometry) {
                        result.push(clipped);
                    }
                } catch (e) { }
            }
        }
        return { type: 'FeatureCollection', features: result };
    }
    /**构建mask canvas
     * @param width canvas宽度
     * @param height canvas高度
     * @param geojson GeoJSON数据
     * @returns mask canvas
     */
    private buildMaskCanvas(width: number, height: number, geojson: GeoJSON.FeatureCollection): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        /**陆地mask颜色 */
        ctx.fillStyle = '#000';
        /**关闭抗锯齿,减少CPU */
        ctx.imageSmoothingEnabled = false;
        ctx.beginPath();
        const features = geojson.features;
        for (let i = 0, len = features.length; i < len; i++) {
            const geom = features[i].geometry;
            if (!geom) continue;
            if (geom.type === 'Polygon') {
                this.drawPolygon(ctx, geom.coordinates);
            } else if (geom.type === 'MultiPolygon') {
                const polys = geom.coordinates;
                for (let j = 0, len2 = polys.length; j < len2; j++) {
                    this.drawPolygon(ctx, polys[j]);
                }
            }
        }
        /**evenodd:正确处理洞/岛屿 */
        ctx.fill('evenodd');
        return canvas;
    }
    /**绘制polygon
     * @param ctx canvas上下文
     * @param coordinates polygon坐标
     */
    private drawPolygon(ctx: CanvasRenderingContext2D, coordinates: number[][][]): void {
        const offsets = this.worldOffsets;
        /**ring:outer + holes */
        for (let r = 0, len = coordinates.length; r < len; r++) {
            const ring = coordinates[r];
            /**世界复制 */
            for (let o = 0, len2 = offsets.length; o < len2; o++) {
                const offset = offsets[o];
                let first = true;
                let prevLng = 0;
                /**防止跨日期变更线超长line */
                for (let i = 0, len3 = ring.length; i < len3; i++) {
                    const point = ring[i];
                    const lng = point[0] + offset;
                    const lat = point[1];
                    /**防止：179 -> -179 出现横跨全球的line */
                    if (i > 0 && Math.abs(lng - prevLng) > 180) {
                        first = true;
                    }
                    prevLng = lng;
                    const [x, y] = u_mapGetPointByLatlng(this.map, [lat, lng]);
                    if (first) {
                        ctx.moveTo(x, y);
                        first = false;
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
            }
        }
    }
    /**构建缓存key,带容差：避免拖动1px就重建 
     * @param bbox 经纬度bbox
     * @param zoom 缩放级别
     * @param width canvas宽度
     * @param height canvas高度
     * @returns 缓存key
    */
    private buildCacheKey(bbox: BBox, zoom: number, width: number, height: number): string {
        /**精度：2 ≈ 1km */
        const precision = 2;
        const bboxStr = bbox.map(v => v.toFixed(precision)).join(',');
        return (`${bboxStr}` + `|z${Math.floor(zoom)}` + `|${width}x${height}`);
    }
    /**清除缓存 */
    public clearCache(): void {
        this.cacheCanvas = null;
        this.cacheKey = '';
    }
}
