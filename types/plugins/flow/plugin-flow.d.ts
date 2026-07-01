import * as L from "leaflet";
import { MapCanvasLayer, SLUMap } from "../../map";
import { Map as MaplibreMap } from 'maplibre-gl';
import { DataMapVeloctiyWind, OptMapPluginFlow } from "../../types";
/**流体动画(风速风向洋流动图)leaflet-velocity.js
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap 地图实例
 * @param options 基础配置
*/
export declare class MapPluginFlow extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: Partial<OptMapPluginFlow>);
    /**基础配置项 */
    options: OptMapPluginFlow;
    /**运动粒子类对象 */
    private windy;
    /**鼠标点击时的回调函数
     * @param degrees 方向
     * @param speed 速度
     */
    private cbClick?;
    /**设置数据并绘制canvas
     * @param datas 数据
     * data[0] 为X轴经度longitude方向的数据
     * data[1] 为Y轴纬度latitude方向的数据
     */
    setData(datas: DataMapVeloctiyWind[]): void;
    /**移除插件 */
    onRemove(): MapCanvasLayer;
    /**添加鼠标点击时的回调函数
     * @param cb 回调函数
     * @param degrees 方向
     * @param speed 速度
     */
    addCbMouseClick(cb: (degrees: number, speed: number) => void): void;
    /**渲染静态图层 */
    protected renderFixedData(): void;
    /**添加或关闭地图特定的监听事件(_eventSwitch事件后自动调用)
     * @param map 地图实例
     * @param key 事件类型
    */
    protected addMapEvents(map: L.Map | AMAP.Map | MaplibreMap, key: "on" | "off"): void;
    /**初始化windy对象 */
    private initWindy;
    /**开始动画 */
    private startWindy;
    /**停止动画 */
    private stopWindy;
    /**鼠标点击事件监听
     * @param e 鼠标事件
     */
    private onMouseClick;
    /**将m/s转换为方向
     * @param uMs X轴速度
     * @param vMs Y轴速度
     * @param angleConvention 角度约定
     * @returns 方向
     */
    private vectorToDegrees;
    /**将m/s 转换为指定单位的速度
     * @param uMs X轴速度
     * @param vMs Y轴速度
     * @param unit 单位
     * @returns 速度
     */
    private vectorToSpeed;
    /**将m/s转换为kn节
     * @param meters m/s
     * @returns knot节/s
     */
    private meterSec2Knots;
    /**将m/s转换为km/h
     * @param meters m/s
     * @returns km/h
     */
    private meterSec2kilometerHour;
}
