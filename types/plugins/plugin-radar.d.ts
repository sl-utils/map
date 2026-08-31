import { MapCanvasLayer, SLMap } from "../map";
import type { MOptCanvasLayer, MOptPluginRadar } from "../map";
import { MapType } from "../utils";
/**
 * 雷达绘制插件
 *
 * 用于在地图上绘制雷达扫描动画效果，支持自定义扫描范围、颜色、网格密度等。
 * 常用于气象雷达、监控范围展示等场景。
 *
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap SLMap 地图实例
 * @param options 雷达绘制配置
 *
 * @example
 * ```typescript
 * import { SLMap, MapPluginRadar } from '@sl-utils/map';
 *
 * const map = new SLMap('map');
 * await map.init({ type: 'L' });
 *
 * // 创建雷达插件
 * const radar = new MapPluginRadar(map);
 *
 * // 添加雷达数据
 * radar.setAllRadars([
 *   {
 *     animeId: 'radar1',
 *     lnglat: [114.12, 22.68],
 *     radius: 5000,  // 5km
 *     colorRadar: 'rgba(255, 0, 0, 0.3)',
 *     colorGrid: 'rgba(255, 255, 255, 0.2)',
 *     colorDash: ['rgba(255, 255, 255, 0.3)'],
 *     gridDensity: 5,
 *     dashDensity: 12,
 *     time: 3000,  // 3秒一圈
 *     ifClockwise: true
 *   }
 * ]);
 *
 * // 添加单个雷达
 * radar.addRadar({
 *   animeId: 'radar2',
 *   lnglat: [114.20, 22.75],
 *   radius: 3000,
 *   colorRadar: 'rgba(0, 255, 0, 0.3)',
 *   sectorAngle: 60,
 *   colorSector: 'rgba(0, 255, 0, 0.1)'
 * });
 *
 * // 移除图层
 * radar.onRemove();
 * ```
 */
export declare class MapPluginRadar extends MapCanvasLayer {
    constructor(sluMap: SLMap, options?: AMAP.CustomLayerOption | MOptCanvasLayer);
    /**动画所有状态 */
    private canvasRadar;
    /**
     * 图层是否在移动 高德默认每次渲染更新像素坐标
     * leaflet 图层移动不更新像素坐标 高德 图层移动更新像素坐标
     * 高德地图移动画布和地图同步偏移，leaflet画布固定 地图偏移 的区别
     * 所以防止leaflet移动过程二次偏移 以及高德移动过程坐标未更新导致画布和容器相对位置发生偏移
     * */
    private isDrag;
    /**重设雷达绘制类
     * @param radars 雷达绘制数据
     * @returns MapPluginRadar实例
     */
    setAllRadars(radars: MOptPluginRadar[]): MapPluginRadar;
    /**添加雷达绘制类
     * @param radar 雷达绘制数据
     * @returns MapPluginRadar实例
     */
    addRadar(radar: MOptPluginRadar): MapPluginRadar;
    /**渲染静态标绘图层 */
    protected renderFixedData(): void;
    /**渲染动画
     * @param time 时间戳
     */
    protected renderAnimation(time?: number): void;
    /**控制地图监听事件 拖拽不允许更新动画
   * @param map 地图实例
   * @param key 事件类型
   */
    protected addMapEvents(map: MapType, key: 'on' | 'off'): void;
    /**拖拽结束，开始绘制 */
    private drawStart;
    /**拖拽开始，结束绘制 */
    private drawEnd;
}
