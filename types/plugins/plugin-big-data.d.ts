import { MapPluginDraw } from "./plugin-draw";
import { SLUMap } from "../map";
import { OptBigData, MapImage, MapImageEvent } from "../types";
/**大数据绘制 优化处理
 * @extends MapPluginDraw
 * @param sluMap 地图实例
 * @param options 大数据绘制选项
 * 划分网格 同网格内设置最大图标数量
 * 超出不绘制 减少画布渲染次数
 */
export declare class MapPluginBigData extends MapPluginDraw {
    constructor(sluMap: SLUMap, options: OptBigData);
    /**R树搜索 绘制 */
    private rbush;
    /**R树搜索 矩形 */
    private readonly rbush_search;
    /**R树搜索 数据 */
    private rbushData;
    /**大数据绘制图标 */
    private bigDataImgs;
    /**已渲染的图标 用于事件添加 */
    private _renderBigDataImgs;
    /**大数据绘制选项 */
    private bigDataOption;
    /**大数据绘制图标 用于事件添加 */
    get renderBigDataList(): MapImageEvent[];
    /**绘制大量图标 rbush筛选重叠优化
     * @param imgs 图标数组
     */
    setbigDataImgs(imgs: MapImage[]): void;
    /**重设rbush */
    private resetRbush;
    /**
     * 将画布划分为多个矩形
     * 矩形内限制最大重叠图形，超出不绘制
     */
    private handleOverlapImage;
    /**
     * 根据图层缩放 获取配置
     * @param zoom
     * @returns { maxCount: number; minBound?: [number, number]; }
     */
    private getZoomOption;
    /**图片转化为rbush数据格式
     * @param img 图标
     * @returns rbush数据格式
     */
    private transformRbush;
    /**绘制所有需要绘制的类
     * @returns MapPluginBigData实例
     */
    drawMapAll(): this;
}
