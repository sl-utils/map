import { MapCanvasLayer, SLUMap } from "../map";
import { Map as MaplibreMap } from 'maplibre-gl';
import type { MapLine, MOptPluginArrowLine } from "../map";
/**
 * 地图 Canvas 动态箭头线插件
 *
 * 用于在地图上绘制带有动态箭头的线段，支持贝塞尔曲线、自定义箭头样式和动画效果。
 * 常用于表示流向、风向、航线等方向性数据。
 *
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap SLUMap 地图实例
 * @param options 箭头线配置项
 *
 * @example
 * ```typescript
 * import { SLUMap, MapPluginArrowLine } from '@sl-utils/map';
 *
 * const map = new SLUMap('map');
 * await map.init({ type: 'L' });
 *
 * // 创建箭头线插件
 * const arrowLine = new MapPluginArrowLine(map, {
 *   fillColor: '#FF6600',
 *   strokeColor: '#FF0000',
 *   lineWidth: 2,
 *   speed: 1,
 *   partialWidth: 8,
 *   partialHeight: 12,
 *   partialSpace: 20
 * });
 *
 * // 设置箭头线数据
 * arrowLine.setAllLines([
 *   {
 *     lnglats: [[114.12, 22.68], [114.15, 22.70], [114.18, 22.72]],
 *     colorLine: '#FF0000',
 *     widthLine: 2
 *   },
 *   {
 *     lnglats: [[114.20, 22.75], [114.25, 22.80]],
 *     colorLine: '#00FF00',
 *     widthLine: 3,
 *     isBezier: true,
 *     degree: 0.5
 *   }
 * ]);
 *
 * // 移除图层
 * arrowLine.onRemove();
 * ```
 */
export declare class MapPluginArrowLine extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: MOptPluginArrowLine);
    /**箭头线实例 */
    private arrowLine;
    /**设置所有线数据
     * @param lines 箭头线数据
     */
    setAllLines(lines: MapLine[]): void;
    /**
     * 图层是否在移动 高德默认每次渲染更新像素坐标
     * leaflet 图层移动不更新像素坐标 高德 图层移动更新像素坐标
     * 高德地图移动画布和地图同步偏移，leaflet画布固定 地图偏移 的区别
     * 所以防止leaflet移动过程二次偏移 以及高德移动过程坐标未更新导致画布和容器相对位置发生偏移
     * */
    private isDrag;
    /**渲染静态图层 */
    protected renderFixedData(): void;
    /**渲染动态数据
     * @param time 时间戳
     */
    protected renderAnimation(time?: number): void;
    /**控制地图监听事件 拖拽不允许更新动画
     * @param map 地图实例
     * @param key 事件类型
     */
    protected addMapEvents(map: L.Map | AMAP.Map | MaplibreMap, key: "on" | "off"): void;
    /**拖拽结束，开始绘制 */
    private drawStart;
    /**拖拽开始，结束绘制 */
    private drawEnd;
}
