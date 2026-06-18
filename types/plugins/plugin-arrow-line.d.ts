import { OptMapPluginArrowLine, MapLine } from "../types";
import { MapCanvasLayer, SLUMap } from "../map";
import { Map as MaplibreMap } from 'maplibre-gl';
/**
 * 地图canvas动态箭头线插件
 * @extends MapCanvasLayer
 * @constructor
 * @param {SLUMap} sluMap
 * @param {OptMapPluginArrowLine} arrowLineOption
 */
export declare class MapPluginArrowLine extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: OptMapPluginArrowLine);
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
