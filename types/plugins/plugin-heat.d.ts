import { MapCanvasLayer, SLUMap } from "../map";
import type { MOptCanvas } from "../map/canvas-layer";
/**
 * 热力图图层插件
 *
 * 用于在地图上渲染热力图效果，支持动态数据更新和自定义渐变色。
 * 传入经纬度坐标数组，可选传入权重系数 [经度, 纬度, 权重?]。
 *
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap SLUMap 地图实例
 * @param options 热力图配置项
 *
 * @example
 * ```typescript
 * import { SLUMap, MapPluginHeat } from '@sl-utils/map';
 *
 * const map = new SLUMap('map');
 * await map.init({ type: 'L' });
 *
 * // 创建热力图插件
 * const heat = new MapPluginHeat(map, {
 *   radius: 30,
 *   blur: 15,
 *   gradient: {
 *     0.2: 'blue',
 *     0.4: 'cyan',
 *     0.6: 'lime',
 *     0.8: 'yellow',
 *     1.0: 'red'
 *   }
 * });
 *
 * // 设置热力数据
 * heat.setAllHeats([
 *   { lnglat: [114.12, 22.68], weight: 1 },
 *   { lnglat: [114.15, 22.70], weight: 2 },
 *   { lnglat: [114.18, 22.72], weight: 0.5 }
 * ]);
 *
 * // 添加单个热力点
 * heat.addHeat({ lnglat: [114.20, 22.75], weight: 3 });
 *
 * // 删除热力点
 * heat.delHeat({ lnglat: [114.12, 22.68] });
 *
 * // 移除图层
 * heat.onRemove();
 * ```
 */
export declare class MapPluginHeat extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: MOptPluginHeat);
    /**热力数据集合 */
    private _allHeats;
    /**计算后的热力图绘制数据 [位置x,位置y,权重W] */
    private heatDatas;
    /**用于绘制阴影，决定渲染颜色层级 */
    private _circleShadow;
    /**单点渲染半径（ 默认+blur 15 ） */
    private _r;
    /**渐变的二进制数据 */
    private _grad;
    /**渐变元素 */
    private _gradEl;
    /**默认配置 */
    options: MOptPluginHeat;
    /**渲染动态数据 */
    protected renderAnimation(): void;
    /**重置[经度,纬度]集合
     * @param heats 热力数据集合
    */
    setAllHeats(heats: MDataHeat[]): void;
    /**添加[经度,纬度],并重绘
     * @param heat 热力数据
    */
    addHeat(heat: MDataHeat): void;
    /**删除[经度,纬度],并重绘
     * @param heat 热力数据
    */
    delHeat(heat: MDataHeat): void;
    /**设置配置
     * @param options 热力图配置
     */
    private setOptions;
    /**更新配置 */
    private _updateOptions;
    /**计算热力图数据
     * @returns 热力图绘制数据 [位置x,位置y,权重W]
     */
    private computeHeatData;
    /**计算最高变色需要的数值
     * @returns 最高变色需要的数值
     */
    private computeZoomGradient;
    /**添加等级标识
     * @param num 等级标识
     */
    private _addGradient;
    /**根据数据重绘制热力图
     * @returns MapPluginHeat实例
     */
    private drawByheatData;
    /**生成单个的阴影半径
     * @param r 半径
     * @param blur @default 15 模糊半径
     */
    private genShadowRadius;
    /**创建渐变色
     * @param grad 渐变色
     * @returns MapPluginHeat实例
     */
    private genGradient;
    /**填充颜色
     * @param pixels 像素数据
     * @param gradient 渐变色
     */
    private _colorize;
}
/**热力图数据点 */
export interface MDataHeat {
    /**经纬度 [lng, lat] */
    lnglat: [number, number];
    /**权重值 */
    weight?: number;
}
/**热力图插件配置 */
export interface MOptPluginHeat extends MOptCanvas {
    /**热力图半径 @default 20 */
    radius?: number;
    /**模糊程度 @default 15 */
    blur?: number;
    /**热力图渐变颜色 */
    gradient?: any;
    /**最小透明度 @default 0.05 */
    minOpacity?: number;
    /**渐变索引 */
    gradientIndex?: number;
    /**是否显示提示 */
    ifTip?: boolean;
    /**提示框水平偏移 */
    tipX?: number;
    /**提示框垂直偏移 */
    tipY?: number;
}
