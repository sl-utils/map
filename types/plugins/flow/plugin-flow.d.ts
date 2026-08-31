import { MapType } from "../../utils";
import { MapCanvasLayer, SLMap, type MOptCanvasLayer } from "../../map";
/**
 * 流体动画插件（风速风向洋流动图）
 *
 * 用于在地图上渲染风场、洋流等流体动画效果，基于粒子系统实现。
 * 支持自定义粒子颜色、速度、寿命等参数，可显示鼠标点击位置的风速风向信息。
 *
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap SLMap 地图实例
 * @param options 流体动画配置
 *
 * @example
 * ```typescript
 * import { SLMap, MapPluginFlow } from '@sl-utils/map';
 *
 * const map = new SLMap('map');
 * await map.init({ type: 'L' });
 *
 * // 创建流体动画插件
 * const flow = new MapPluginFlow(map, {
 *   displayValues: true,      // 显示数值
 *   maxVelocity: 15,          // 最大速度
 *   unit: 'm/s',              // 速度单位
 *   angleConvention: 'bearingCCW',  // 角度约定
 *   emptyString: 'No velocity data',
 *   particleAge: 90,          // 粒子寿命
 *   velocityScale: 0.005,     // 速度缩放
 *   colorScale: [             // 颜色刻度
 *     'rgb(36,104,180)',
 *     'rgb(60,157,194)',
 *     'rgb(128,205,193)',
 *     'rgb(151,218,168)',
 *     'rgb(198,231,181)',
 *     'rgb(238,247,217)',
 *     'rgb(255,238,159)',
 *     'rgb(252,217,125)',
 *     'rgb(255,182,100)',
 *     'rgb(252,150,75)',
 *     'rgb(250,112,52)',
 *     'rgb(245,64,32)',
 *     'rgb(237,45,28)',
 *     'rgb(220,24,32)',
 *     'rgb(180,0,35)'
 *   ]
 * });
 *
 * // 设置风场数据
 * flow.setData([
 *   {
 *     header: {
 *       refTime: '2023-01-01T00:00:00Z',
 *       lo1: 100, la1: 20, lo2: 130, la2: 40,
 *       nx: 61, ny: 41, dx: 0.5, dy: 0.5,
 *       type: 'X', unit: 'm/s', forecastTime: 0
 *     },
 *     data: [/* U 风速数据 *\/]
 *   },
 *   {
 *     header: {
 *       refTime: '2023-01-01T00:00:00Z',
 *       lo1: 100, la1: 20, lo2: 130, la2: 40,
 *       nx: 61, ny: 41, dx: 0.5, dy: 0.5,
 *       type: 'Y', unit: 'm/s', forecastTime: 0
 *     },
 *     data: [/* V 风速数据 *\/]
 *   }
 * ]);
 *
 * // 监听鼠标点击事件
 * flow.addCbMouseClick((degrees, speed) => {
 *   console.log(`风向: ${degrees}°, 风速: ${speed} m/s`);
 * });
 *
 * // 移除图层
 * flow.onRemove();
 * ```
 */
export declare class MapPluginFlow extends MapCanvasLayer {
    constructor(sluMap: SLMap, options?: MOptPluginFlow);
    /**基础配置项 */
    options: MOptPluginFlow;
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
    setData(datas: MDataVeloctiyWind[]): void;
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
    protected addMapEvents(map: MapType, key: "on" | "off"): void;
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
/**速度风场头部信息 */
export interface VelocityHeader {
    /**参考时间 */
    refTime: string;
    /**起始纬度 */
    la1: number;
    /**起始经度 */
    lo1: number;
    /**结束纬度 */
    la2: number;
    /**结束经度 */
    lo2: number;
    /**网格列数 */
    nx: number;
    /**网格行数 */
    ny: number;
    /**经度间隔 */
    dx: number;
    /**纬度间隔 */
    dy: number;
    /**数据类型 */
    type: "X" | "Y" | "Z";
    /**单位 */
    unit: string;
    /**预报时间 */
    forecastTime: number;
}
/**速度风场数据 */
export interface MDataVeloctiyWind {
    /**头部信息 */
    header: VelocityHeader;
    /**数据数组 */
    data: number[];
}
/**流向插件配置 */
export type MOptPluginFlow = MOptCanvasLayer & {
    /**是否显示数值 */
    displayValues: boolean;
    /**速度缩放 */
    velocityScale?: number;
    /**粒子寿命 */
    particleAge?: number;
    /**最大速度 */
    maxVelocity: number;
    /**速度单位 */
    unit: 'm/s' | 'k/h' | 'kt';
    /**角度约定 */
    angleConvention: "bearingCCW" | "bearingCW" | "meteoCCW" | "meteoCW";
    /**空值显示文本 */
    emptyString: string;
    /**颜色刻度 */
    colorScale?: any;
    /**流向数据 */
    data?: MDataVeloctiyWind[];
};
