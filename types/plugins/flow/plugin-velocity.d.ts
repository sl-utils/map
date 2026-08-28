import type { MDataVeloctiyWind } from "./plugin-flow";
/**
 * 运动粒子类
 *
 * 用于实现流体动画效果，通过粒子系统模拟风场、洋流等流体运动。
 * 支持自定义粒子颜色、速度、寿命等参数。
 *
 * @constructor
 * @param options 粒子配置
 *
 * @example
 * ```typescript
 * // 通常不直接使用此类，而是通过 MapPluginFlow 插件
 * import { SLUMap, MapPluginFlow } from '@sl-utils/map';
 *
 * const map = new SLUMap('map');
 * await map.init({ type: 'L' });
 *
 * // 创建流体动画插件（内部使用 PluginVelocity）
 * const flow = new MapPluginFlow(map, {
 *   maxVelocity: 15,
 *   particleAge: 90,
 *   velocityScale: 0.005,
 *   colorScale: [
 *     'rgb(36,104,180)',
 *     'rgb(60,157,194)',
 *     'rgb(128,205,193)',
 *     'rgb(255,238,159)',
 *     'rgb(255,182,100)',
 *     'rgb(245,64,32)',
 *     'rgb(180,0,35)'
 *   ]
 * });
 *
 * // 设置风场数据
 * flow.setData(windData);
 * ```
 */
export declare class PluginVelocity {
    constructor(options: Partial<MOptPluginVelocity>);
    /**基础配置项 */
    private options;
    /**地图实例 */
    private map;
    /**画布元素 */
    private canvas;
    /**粒子强度最低时的速度（米 / 秒） velocity at which particle intensity is minimum (m/s)*/
    private MIN_VELOCITY_INTENSITY;
    /**粒子强度最高时的速度（米 / 秒） velocity at which particle intensity is maximum (m/s)*/
    private MAX_VELOCITY_INTENSITY;
    /**风速刻度(内部与可视区面积相关联) scale for wind velocity (completely arbitrary--this value looks nice)*/
    private VELOCITY_SCALE;
    /**粒子生命周期内最大绘制帧数 max number of frames a particle is drawn before regeneration*/
    private MAX_PARTICLE_AGE;
    /**粒子线宽 line width of a drawn particle*/
    private PARTICLE_LINE_WIDTH;
    /**绘制粒子数量的比例（宽像素*高像素*此比例）*/
    private PARTICLE_MULTIPLIER;
    /**移动端粒子数量倍率 multiply particle count for mobiles by this amount*/
    private PARTICLE_REDUCTION;
    /**每秒播放帧数 */
    private FRAME_RATE;
    /**每帧播放时间 desired frames per second*/
    private FRAME_TIME;
    /**粒子透明度 */
    private OPACITY;
    /**粒子颜色等级 */
    private colorScale;
    /**无风状态下的单例 singleton for no wind in the form: [u, v, magnitude]*/
    private NULL_WIND_VECTOR;
    /**传过来的原始数据 */
    private gridData;
    /** [U数据,V数据][ x序号 ][ y轴序号 ]   */
    private grid;
    /**风场数据 */
    private field;
    /**数据起始经度 */
    private lng0;
    /**数据起始纬度 */
    private lat0;
    /**数据经度差值 数据经度间隔 (若全球数据中0.5经度间隔得到一个数据，则 dx = 1 * 0.5 )*/
    private Δlng;
    /**数据纬度差值 */
    private Δlat;
    /**动画循环 */
    private animationLoop?;
    /**所有粒子id */
    private allThreatIds;
    /**设置自身参数
     * @param options 配置项
     */
    setOptions(options: any): void;
    /**设置数据
     * @param data 数据
     */
    setData(data: MDataVeloctiyWind[]): void;
    /**停止运行 */
    stop(): void;
    /**开始运行
     * @param width 画布宽度
     * @param height 画布高度
     * @param extent 可视的经纬度范围
     */
    start(width: number, height: number, extent: [[number, number], [number, number]]): void;
    /**构建网格数据
     * @param data 数据
     */
    private buildGrid;
    /**创建构造器
     * @param data 数据
     */
    private createBuilder;
    /**grid 数据，以及获得指定经纬度数据的方法interpolate
     * @param bounds  可视区域的像素范围
     * @param extent  数据地图的经纬度范围
     */
    private interpolateField;
    /**获得指定经纬度的数据信息
     * @param lng 经度
     * @param lat 纬度
     * @return [ 计算得到的开始值S , 计算的到的结束值E, sqrt(S*S+E*E) ]
     */
    interpolate(lng: number, lat: number): null | [number, number, number];
    /**根据网格数据构建虚拟数值
     * @param x 指定经度的X数值相对最近的低位整数坐标的差值 [0,1)
     * @param y 指定纬度的Y数值相对最近的低位整数坐标的差值 [0,1)
     * @param g00 该经纬度所在的网格的左上角的风速信息
     * @param g10 该经纬度所在的网格的右上角的风速信息
     * @param g01 该经纬度所在的网格的左下角的风速信息
     * @param g11 该经纬度所在的网格的右下角的风速信息
     * @returns [ 计算得到的开始值S , 计算的到的结束值E, 平均速度 ]
     */
    private bilinearInterpolateVector;
    /**根据地图的缩放级别调整粒子的大小
     * @param lng 经度
     * @param lat 纬度
     * @param x 像素点X
     * @param y 像素点Y
     * @param scale 风速刻度
     * @param wind 风速信息 [计算得到的开始值S , 计算的到的结束值E, sqrt(S*S+E*E) ]
     * @returns 风速信息
     */
    private distort;
    /**粒子系统 经纬度速度 → 屏幕像素速度
     * 单个经纬度值跨越的像素点数量级
     * @param lng 经度
     * @param lat 纬度
     * @param x 像素点X
     * @param y 像素点Y
     * @returns [经度转 X 像素系数，0, 0, 纬度转 Y 像素系数]
     */
    private distortion;
    /**根据经纬度获得像素点
     * @param lat 纬度
     * @param lng 经度
     * @returns [像素点X, 像素点Y]
     */
    private project;
    /**动画
     * @param bounds 可视区域的像素范围
     * @param field 风场数据
     */
    private animate;
    /**根据风速得到所属颜色层级
     * @param m 风速
     * @returns 颜色层级
     */
    private windColorIndexBySpeed;
    /**将经纬度转换为弧度  180 = Math.PI
     * @param deg 经纬度
     * @returns 弧度
     */
    private deg2rad;
    /**针对经纬度特殊的取余数方法
     * 小于等于n的数字若a小于0，返回 2n+a ， -365  => 2n-365
     * @param a 数字
     * @param n 数字范围
     * @returns 取余数
     */
    private floorMod;
    /**判断是否是有效值
     * @param x 值
     * @returns 是否是有效值
     */
    private isValue;
    /**判断是否是移动端
     * @returns 是否是移动端
     */
    private isMobile;
}
/**风场边界 */
export interface WindBounds {
    /**起始X坐标 */
    x: number;
    /**起始Y坐标 */
    y: number;
    /**最大X坐标 */
    xMax: number;
    /**最大Y坐标 */
    yMax: number;
    /**宽度 */
    width: number;
    /**高度 */
    height: number;
}
/**风场地图边界 */
export interface WindMapBounds {
    /**南边界 */
    south: number;
    /**北边界 */
    north: number;
    /**东边界 */
    east: number;
    /**西边界 */
    west: number;
    /**宽度 */
    width: number;
    /**高度 */
    height: number;
}
/**风场粒子 */
export interface WindParticle {
    /**粒子年龄 */
    age: number;
    /**X坐标 */
    x: number;
    /**Y坐标 */
    y: number;
    /**目标X坐标 */
    xt?: number;
    /**目标Y坐标 */
    yt?: number;
}
/**风向量 */
export type WindVector = [number, number, number | null];
/**速度插件配置 */
export interface MOptPluginVelocity {
    /**最小速度 */
    minVelocity: number;
    /**最大速度 */
    maxVelocity: number;
    /**速度缩放 */
    velocityScale: number;
    /**粒子寿命 */
    particleAge: number;
    /**线宽 */
    lineWidth: number;
    /**粒子数量倍数 */
    particleMultiplier: number;
    /**帧率 */
    frameRate: number;
    /**默认颜色刻度 */
    defualtColorScale: string[];
    /**数据 */
    data: any[];
    /**画布 */
    canvas?: HTMLCanvasElement;
}
