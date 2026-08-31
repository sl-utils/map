import { MapPluginDraw } from "./plugin-draw";
import { SLMap } from "../map";
import { MOptCanvasLayer } from "../map/canvas-layer";
import { MapImageEvent } from "../map/canvas-event";
import { MapImage } from "../map/canvas-draw";
/**
 * 大数据绘制插件
 *
 * 用于高效渲染大量图标数据，通过 R 树索引和网格划分优化渲染性能。
 * 支持按缩放级别配置最大显示数量，超出部分不绘制，减少画布渲染次数。
 *
 * @extends MapPluginDraw
 * @constructor
 * @param sluMap SLMap 地图实例
 * @param options 大数据绘制选项
 *
 * @example
 * ```typescript
 * import { SLMap, MapPluginBigData } from '@sl-utils/map';
 *
 * const map = new SLMap('map');
 * await map.init({ type: 'L' });
 *
 * // 创建大数据插件
 * const bigData = new MapPluginBigData(map, {
 *   zoomOption: {
 *     5: { maxCount: 100, minBound: [200, 200] },
 *     8: { maxCount: 200, minBound: [150, 150] },
 *     10: { maxCount: 500, minBound: [100, 100] },
 *     12: { maxCount: -1 }  // 不限制
 *   }
 * });
 *
 * // 设置大量图标数据
 * const imgs = Array.from({ length: 10000 }, (_, i) => ({
 *   lnglat: [114 + Math.random() * 10, 22 + Math.random() * 5],
 *   url: '/assets/icons/marker.png',
 *   size: [16, 16],
 *   info: { id: i, name: `Point ${i}` }
 * }));
 *
 * bigData.setbigDataImgs(imgs);
 *
 * // 获取渲染后的图标列表（用于事件处理）
 * const renderedList = bigData.renderBigDataList;
 * console.log(`渲染了 ${renderedList.length} 个图标`);
 *
 * // 移除图层
 * bigData.onRemove();
 * ```
 */
export declare class MapPluginBigData extends MapPluginDraw {
    constructor(sluMap: SLMap, options: MOptBigData);
    /**R树搜索 绘制 */
    private rbush;
    /**R树搜索 矩形 */
    private readonly rbush_search;
    /**R树搜索 数据 */
    private rbushData;
    /**大数据绘制图标 */
    private bigDataImgs;
    /**已渲染的图标 用于事件添加 */
    private _renderBigDataImgs;
    /**大数据绘制选项 */
    private bigDataOption;
    /**大数据绘制图标 用于事件添加 */
    get renderBigDataList(): MapImageEvent[];
    /**绘制大量图标 rbush筛选重叠优化
     * @param imgs 图标数组
     */
    setbigDataImgs(imgs: MapImage[]): void;
    /**重设rbush */
    private resetRbush;
    /**
     * 将画布划分为多个矩形
     * 矩形内限制最大重叠图形，超出不绘制
     */
    private handleOverlapImage;
    /**
     * 根据图层缩放 获取配置
     * @param zoom
     * @returns { maxCount: number; minBound?: [number, number]; }
     */
    private getZoomOption;
    /**图片转化为rbush数据格式
     * @param img 图标
     * @returns rbush数据格式
     */
    private transformRbush;
    /**绘制所有需要绘制的类
     * @returns MapPluginBigData实例
     */
    drawMapAll(): this;
}
/**大数据插件配置 */
export type MOptBigData = MOptCanvasLayer & {
    /**不同层级的配置 */
    zoomOption: {
        [key: number]: {
            /**最大数量 */
            maxCount: number;
            /**最小边界 */
            minBound?: [number, number];
        };
    };
};
