import { OptMapCanvas, OptMapPluginRadar } from "../types";
import { MapCanvasLayer, SLUMap } from "../map";
import { Map as MaplibreMap } from 'maplibre-gl';
/**雷达绘制插件
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap 地图实例
 * @param options 雷达绘制配置
 * */
export declare class MapPluginRadar extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: AMAP.CustomLayerOption | OptMapCanvas);
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
    setAllRadars(radars: OptMapPluginRadar[]): MapPluginRadar;
    /**添加雷达绘制类
     * @param radar 雷达绘制数据
     * @returns MapPluginRadar实例
     */
    addRadar(radar: OptMapPluginRadar): MapPluginRadar;
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
    protected addMapEvents(map: L.Map | AMAP.Map | MaplibreMap, key: 'on' | 'off'): void;
    /**拖拽结束，开始绘制 */
    private drawStart;
    /**拖拽开始，结束绘制 */
    private drawEnd;
}
