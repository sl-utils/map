import { MapCanvasLayer, SLUMap } from "../map";
import type { MapText, MapImage, MOptCanvas } from "../map";
import type { CanvasTextPanel } from "../canvas";
/**
 * 测距插件
 *
 * 用于在地图上进行距离测量，支持多点测距、实时距离显示、方位角计算等。
 * 支持多条测距线同时存在，可删除单条测距线。
 *
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap SLUMap 地图实例
 * @param options 测距配置
 *
 * @example
 * ```typescript
 * import { SLUMap, MapPluginRange } from '@sl-utils/map';
 *
 * const map = new SLUMap('map');
 * await map.init({ type: 'L' });
 *
 * // 创建测距插件
 * const range = new MapPluginRange(map, {
 *   colorLine: '#364A7D',
 *   colorArc: '#FFF',
 *   colorArcStart: '#415880',
 *   colorFont: '#333333',
 *   textPanel: {
 *     radius: 3,
 *     pl: 2, pr: 2, pt: 2, pb: 2,
 *     colorFill: '#fff',
 *     fillAlpha: 0.8,
 *     colorLine: '#90A4A4',
 *     widthLine: 1
 *   }
 * });
 *
 * // 开启测距模式
 * range.open();
 *
 * // 监听测距结束
 * range.onEnd(() => {
 *   console.log('测距结束');
 * });
 *
 * // 关闭测距模式
 * range.close();
 *
 * // 移除图层
 * range.onRemove();
 * ```
 */
export declare class MapPluginRange extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: MOptPluginRange);
    /**默认配置 */
    options: MOptPluginRange;
    /** 地图事件控制管理对象 */
    private ctrEvent;
    /** 地图基础绘制类 */
    private ctrMapDraw;
    /** 动画绘制类 */
    private ctrMapAniDraw;
    /** 所有的已确定的经纬度 (绘制确定的点线)[多条测距线]*/
    private lnglatLists;
    /** 鼠标当前所在的经纬度(绘制虚线) */
    private lnglat?;
    /** 是否正在拖动地图 */
    private ifDrag;
    /** 单击事件 */
    private flagTimeout;
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
/**范围标注插件配置 */
export interface MOptPluginRange extends MOptCanvas {
    /**线条颜色 */
    colorLine?: string;
    /**圆弧颜色 */
    colorArc?: string;
    /**起始圆弧颜色 */
    colorArcStart?: string;
    /**字体颜色 */
    colorFont?: string;
    /**语言类型 */
    lang?: 'cn' | 'en';
    /**文本面板配置 */
    textPanel?: CanvasTextPanel;
}
