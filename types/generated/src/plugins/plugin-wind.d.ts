import { OptMapPluginWind, DataMapGrid, GridBounds, DataMapWind, Image } from "../types";
import { SLUMap } from "../map";
import { MapPluginGridBase } from "./grid/plugin-grid-base";
/**风速风向插件
 * @extends MapPluginGridBase
 * @constructor
 * @param sluMap 地图实例
 * @param options 配置
 */
export declare class MapPluginWind extends MapPluginGridBase {
    constructor(sluMap: SLUMap, options: OptMapPluginWind);
    /**根据风速返回图标配置
     * @param speed 风速
     * @returns 图标配置
     */
    private iconResolver;
    /**绘制实例 */
    private draw;
    /**基础配置 */
    options: OptMapPluginWind;
    /**设置图标解析器
     * @param resolver 图标解析器
     * @returns MapPluginWind实例
     */
    setIconResolver(resolver: (speed: number) => Image): MapPluginWind;
    /**设置风速风向数据
     * @param data 风速风向数据
     */
    setData(data: DataMapGrid[]): void;
    /**获取视图范围内的(指定像素间隔的数据)
     * @param bounds 视图范围
     * @param pixelInterval @default 2 像素间隔
     * @returns 风速风向数据
     */
    protected getViewBoundsGridWind(bounds: GridBounds, pixelInterval?: number): DataMapWind[];
    /**根据风力等级获取图片裁剪地址 x,y */
    protected renderAnimation(): void;
    /**渲染静态图层 */
    protected renderFixedData(): void;
}
