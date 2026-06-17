import { MapCanvasLayer, SLUMap } from "../map";
import { OptMapCanvas, DataMapParticle, CanvasPosition } from "../types";
import { Map as MaplibreMap } from 'maplibre-gl';
/**用于绘制地图上的粒子效果
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap 地图实例
 * @param options 地图初始化参数
 */
export declare class MapPluginPartial extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: OptMapCanvas);
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
    setAllParticles(particles: (DataMapParticle & CanvasPosition)[]): void;
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
    /**绘制粒子
     * @param particle 粒子数据
     */
    private drawParticle;
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
