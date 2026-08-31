import type { MOptCanvasLayer } from "../map";
import { Image } from "../canvas";
import { SLMap } from "../map";
import { MapPluginGridBase, MDataGrid, GridBounds } from "./grid/plugin-grid-base";
/**
 * 风速风向插件
 *
 * 用于在地图上渲染风速风向数据，通过图标展示风力等级和风向。
 * 支持自定义图标解析器和不同层级的图标大小配置。
 *
 * @extends MapPluginGridBase
 * @constructor
 * @param sluMap SLMap 地图实例
 * @param options 风场配置
 *
 * @example
 * ```typescript
 * import { SLMap, MapPluginWind } from '@sl-utils/map';
 *
 * const map = new SLMap('map');
 * await map.init({ type: 'L' });
 *
 * // 创建风场插件
 * const wind = new MapPluginWind(map, {
 *   url: '/assets/icons/icon-28.png',
 *   size: [28, 28],
 *   sizeo: [28, 28],
 *   pane: 'windPane'
 * });
 *
 * // 设置风速风向数据
 * wind.setData([
 *   {
 *     header: {
 *       lo1: 100, la1: 20, lo2: 130, la2: 40,
 *       nx: 61, ny: 41, dx: 0.5, dy: 0.5
 *     },
 *     data: [/* U 风速数据 *\/]
 *   },
 *   {
 *     header: {
 *       lo1: 100, la1: 20, lo2: 130, la2: 40,
 *       nx: 61, ny: 41, dx: 0.5, dy: 0.5
 *     },
 *     data: [/* V 风速数据 *\/]
 *   }
 * ]);
 *
 * // 自定义图标解析器
 * wind.setIconResolver((speed) => {
 *   const level = speed < 3.4 ? 0 : speed < 8.0 ? 1 : speed < 13.9 ? 2 : 3;
 *   return {
 *     url: '/assets/icons/wind-icons.png',
 *     size: [28, 28],
 *     sizeo: [28, 28],
 *     posX: level * 28,
 *     posY: 0
 *   };
 * });
 *
 * // 移除图层
 * wind.onRemove();
 * ```
 */
export declare class MapPluginWind extends MapPluginGridBase {
    constructor(sluMap: SLMap, options: MOptPluginWind);
    /**根据风速返回图标配置
     * @param speed 风速
     * @returns 图标配置
     */
    private iconResolver;
    /**绘制实例 */
    private draw;
    /**基础配置 */
    options: MOptPluginWind;
    /**设置图标解析器
     * @param resolver 图标解析器
     * @returns MapPluginWind实例
     */
    setIconResolver(resolver: (speed: number) => Image): MapPluginWind;
    /**设置风速风向数据
     * @param data 风速风向数据
     */
    setData(data: MDataGrid[]): void;
    /**获取视图范围内的(指定像素间隔的数据)
     * @param bounds 视图范围
     * @param pixelInterval @default 2 像素间隔
     * @returns 风速风向数据
     */
    protected getViewBoundsGridWind(bounds: GridBounds, pixelInterval?: number): MDataWind[];
    /**根据风力等级获取图片裁剪地址 x,y */
    protected renderAnimation(): void;
    /**渲染静态图层 */
    protected renderFixedData(): void;
}
/**风场数据点 */
export interface MDataWind {
    /**经纬度 [lng, lat] */
    lnglat: [number, number];
    /**风速 */
    speed: number;
    /**风向 */
    direction: number;
}
/**风速风向插件配置 */
export type MOptPluginWind = MOptCanvasLayer & {
    /**风场数据路径 */
    url?: string;
    /**渲染大小 */
    size?: [number, number];
    /**原图大小 */
    sizeo?: [number, number];
    /**不同层级的大小配置 */
    zooMsize?: [number, number][];
};
