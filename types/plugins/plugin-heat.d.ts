import { MapCanvasLayer, SLUMap } from "../map";
import { OptMapPluginHeat, DataMapHeat } from "../types";
/**热力图图层  传入经纬度坐标[],也可传入系数 [纬度,经度,系数?]
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap 地图实例
 * @param options 热力图配置
*/
export declare class MapPluginHeat extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: OptMapPluginHeat);
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
    options: OptMapPluginHeat;
    /**渲染动态数据 */
    protected renderAnimation(): void;
    /**重置[经度,纬度]集合
     * @param heats 热力数据集合
    */
    setAllHeats(heats: DataMapHeat[]): void;
    /**添加[经度,纬度],并重绘
     * @param heat 热力数据
    */
    addHeat(heat: DataMapHeat): void;
    /**删除[经度,纬度],并重绘
     * @param heat 热力数据
    */
    delHeat(heat: DataMapHeat): void;
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
