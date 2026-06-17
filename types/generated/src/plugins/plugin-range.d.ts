import { MapCanvasLayer, SLUMap } from "../map";
import { OptMapPluginRange, MapText, MapImage } from "../types";
/**测绘类
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap 地图实例
 * @param options 测绘配置
 */
export declare class MapPluginRange extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: OptMapPluginRange);
    /**默认配置 */
    options: OptMapPluginRange;
    /** 地图事件控制管理对象 */
    private ctrEvent;
    /** 地图基础绘制类 */
    private ctrMapDraw;
    /** 动画绘制类 */
    private ctrMapAniDraw;
    /** 所有的已确定的经纬度 (绘制确定的点线)*/
    private lnglats;
    /** 鼠标当前所在的经纬度(绘制虚线) */
    private lnglat?;
    /** 是否正在拖动地图 */
    private ifDrag;
    /** 单击事件 */
    private eventClickTimer;
    /** 启用测距功能
     * @returns MapPluginRange实例
     */
    open(): MapPluginRange;
    /** 关闭测距功能
     * @param flag @default true 是否关闭事件监听
     */
    close(flag?: boolean): void;
    /** 测距结束回调函数 */
    endCb?: () => void;
    /** 测距结束回调函数 */
    onEnd(cb: () => void): void;
    /** 缓存绘图数据（对于引进确定的数据进行缓存） */
    protected renderFixedData(): void;
    /** 渲染动画 */
    protected renderAnimation(): void;
    /** 动画虚线绘制 */
    private genAniLineDate;
    /** 绘制文本信息  flag标识该条线已经绘制完成
     * @param info 文本信息
     * @param lineId 线索引
     * @returns MapImage实例
     */
    protected drawEndTextImg(info: MapText, lineId: number): MapImage;
    /**控制地图监听事件
   * @param map 地图实例
   * @param key 事件类型
   */
    private eventSwitch;
    /** 拖动事件 */
    private eventDrag;
    /** 拖动结束事件 */
    private eventDragend;
    /** 单击事件
     * @param e 事件对象
     */
    private eventClick;
    /** 鼠标移动事件
     * @param e 事件对象
     */
    private eventMousemove;
    /** 双击关闭事件 */
    private eventDblclick;
}
