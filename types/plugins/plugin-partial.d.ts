import { type MapType } from "../utils";
import { MapCanvasLayer, type MOptCanvasLayer, type SLMap } from "../map";
import { CanvasPosition, CanvasLine } from "../canvas";
/**
 * 粒子效果插件
 *
 * 用于在地图上绘制流动的粒子效果，支持贝塞尔曲线路径、自定义粒子颜色和速度。
 * 常用于表示洋流、气流、航线等流动数据。
 *
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap SLMap 地图实例
 * @param options 粒子配置
 *
 * @example
 * ```typescript
 * import { SLMap, MapPluginPartial } from '@sl-utils/map';
 *
 * const map = new SLMap('map');
 * await map.init({ type: 'L' });
 *
 * // 创建粒子插件
 * const partial = new MapPluginPartial(map, {
 *   pane: 'canvas',
 *   zIndex: 150
 * });
 *
 * // 设置粒子数据
 * partial.setAllParticles([
 *   {
 *     lnglats: [
 *       [114.12, 22.68],
 *       [114.15, 22.70],
 *       [114.18, 22.72],
 *       [114.20, 22.75]
 *     ],
 *     colorParticle: '#00FFFF',
 *     speed: 0.002,        // 移动速度
 *     length: 0.05,        // 粒子长度占比
 *     dense: 1,            // 密度
 *     showParticle: true
 *   },
 *   {
 *     lnglats: [
 *       [114.25, 22.80],
 *       [114.30, 22.85],
 *       [114.35, 22.90]
 *     ],
 *     colorParticle: '#FF6600',
 *     speed: 0.003,
 *     length: 0.08,
 *     degree: 0.3,         // 贝塞尔曲线曲度
 *     showParticle: true
 *   }
 * ]);
 *
 * // 移除图层
 * partial.onRemove();
 * ```
 */
export declare class MapPluginPartial extends MapCanvasLayer {
    constructor(sluMap: SLMap, options?: MOptCanvasLayer);
    /**
     * 图层是否在移动 高德默认每次渲染更新像素坐标
     * leaflet 图层移动不更新像素坐标 高德 图层移动更新像素坐标
     * 高德地图移动画布和地图同步偏移，leaflet画布固定 地图偏移 的区别
     * 所以防止leaflet移动过程二次偏移 以及高德移动过程坐标未更新导致画布和容器相对位置发生偏移
     * */
    private isDrag;
    /**所有的粒子效果数据 */
    private _allParticle;
    /**设置所有粒子数据
     * @param particles 粒子数据
     */
    setAllParticles(particles: (MDataParticle & CanvasPosition)[]): void;
    /**渲染动态数据
     * @param time 时间戳
     */
    protected renderAnimation(time?: number): void;
    /**动画循环 */
    private _animat;
    /**绘制粒子效果 */
    private _drawParticles;
    /**获取当前贝塞尔曲线的粒子点位
     * @param particle 粒子数据
     */
    private genCurBezierPoints;
    /**获取二阶贝塞尔曲线指定百分比的点位置信息
    * @param t 当前百分比
    * @param p1 起点坐标
    * @param p2 终点坐标
    * @param cp 控制点
    */
    private getBezierPointByPercent;
    /**绘制粒子
     * @param particle 粒子数据
     */
    private drawParticle;
    /**控制地图监听事件 拖拽不允许更新动画
     * @param map 地图实例
     * @param key 事件类型
     */
    protected addMapEvents(map: MapType, key: "on" | "off"): void;
    /**拖拽结束，开始绘制 */
    private drawStart;
    /**拖拽开始，结束绘制 */
    private drawEnd;
}
/**粒子数据 */
export interface MDataParticle extends CanvasLine {
    /**经纬度集合 */
    lnglats?: [number, number][];
    /**曲线控制点 */
    curve?: [number, number][];
    /**移动速度 */
    speed?: number;
    /**粒子长度 */
    length?: number;
    /**密度 */
    dense?: number;
    /**当前点集合 */
    curPoints?: [number, number][];
    /**粒子年龄 */
    age?: number;
    /**索引 */
    index?: number;
    /**粒子颜色 */
    colorParticle?: string;
    /**是否显示粒子 */
    showParticle?: boolean;
}
