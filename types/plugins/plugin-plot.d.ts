import { MapCanvasLayer, SLMap } from "../map";
import type { MapArc, MapText, MOptCanvasLayer } from "../map";
import type { CanvasImage } from "../canvas";
/**
 * 自定义标绘插件
 *
 * 用于在地图上绘制和编辑各种标绘图形，支持点、线、多边形、圆形、矩形等类型。
 * 支持鼠标交互绘制、拖拽编辑、新增/删除/移动点位等操作。
 *
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap SLMap 地图实例
 * @param options 标绘配置
 *
 * @example
 * ```typescript
 * import { SLMap, MapPluginPlot } from '@sl-utils/map';
 *
 * const map = new SLMap('map');
 * await map.init({ type: 'L' });
 *
 * // 创建标绘插件
 * const plot = new MapPluginPlot(map, {
 *   plotOpt: {
 *     pane: 'canvas',
 *     className: 'plot',
 *     colorFill: 'rgba(44, 155, 138, 0.3)',
 *     colorLine: '#2C9B8A',
 *     widthLine: 2
 *   },
 *   editOpt: {
 *     lnglat: [0, 0],
 *     colorFill: '#fff',
 *     colorLine: '#2C9B8A',
 *     size: 4
 *   },
 *   textOpt: {
 *     colorFill: '#2C9B8A',
 *     widthLine: 2,
 *     colorLine: '#FFFFFF',
 *     ifShadow: true
 *   }
 * });
 *
 * // 设置标绘列表
 * plot.setPlotList([
 *   {
 *     type: 'polygon',
 *     lngLats: [[114.12, 22.68], [114.15, 22.70], [114.18, 22.72]],
 *     name: '区域A',
 *     colorFill: 'rgba(255, 0, 0, 0.3)',
 *     colorLine: '#FF0000'
 *   },
 *   {
 *     type: 'circle',
 *     lngLats: [[114.20, 22.75], [114.22, 22.77]],
 *     name: '圆形区域',
 *     colorFill: 'rgba(0, 255, 0, 0.3)',
 *     colorLine: '#00FF00'
 *   }
 * ]);
 *
 * // 开始绘制新标绘
 * const newPlot = plot.open('polygon');
 *
 * // 监听点位变化
 * plot.addCbPointChange((plotAni) => {
 *   console.log('标绘数据变化:', plotAni);
 * });
 *
 * // 监听标绘列表变化
 * plot.addCbPlotListChange((plotList) => {
 *   console.log('标绘列表:', plotList);
 * });
 *
 * // 保存标绘
 * plot.savePlot();
 *
 * // 编辑已有标绘
 * plot.setEditPlot(newPlot);
 *
 * // 删除标绘
 * plot.delPlot(newPlot);
 *
 * // 关闭绘制模式
 * plot.close();
 *
 * // 移除图层
 * plot.onRemove();
 * ```
 */
export declare class MapPluginPlot extends MapCanvasLayer {
    constructor(sluMap: SLMap, options?: MOptPluginPlot);
    /**标绘形状配置 */
    options: MOptPluginPlotBase;
    /**动态绘制图层 */
    private ctrMapAniDraw;
    /**静态标绘图层 */
    private ctrMapDraw;
    /**图层事件控制器 */
    private ctrEvent;
    /**编辑圆点样式 */
    private editArc;
    /**标绘文字样式 */
    private plotText;
    /**所有的标绘集合 */
    private plotList;
    /**正在动态绘制的标(仅仅改变图形不会动态改变原始数据) */
    plotAni?: MDataPlot;
    /**记录当前鼠标经纬度 [lng, lat] */
    private curPoint?;
    /** 单击事件 */
    private eventClickTimer;
    /**开启新增的绘制
     * @param type 标绘类型
     * @returns 新增的标绘实例
     */
    open(type: MapPlotType): MDataPlot;
    /**关闭绘制
     * @returns MapPluginPlot实例
    */
    close(): MapPluginPlot;
    /**保存标绘
     * @returns MapPluginPlot实例
    */
    savePlot(): MapPluginPlot;
    /**删除标绘
     * @param plot 标绘实例
     * @returns MapPluginPlot实例
     */
    delPlot(plot?: MDataPlot): MapPluginPlot;
    /**设置所有区域数据
     * @param plotList 标绘集合
     * @returns MapPluginPlot实例
     */
    setPlotList(plotList: MDataPlot[]): MapPluginPlot;
    /**设置编辑区域数据
     * @param plot 标绘实例
     * @returns MapPluginPlot实例
     */
    setEditPlot(plot: MDataPlot): MapPluginPlot;
    /**重绘
     * @returns MapPluginPlot实例
     */
    redraw(): MapPluginPlot;
    /**渲染静态标绘图层 */
    protected renderFixedData(): void;
    /**渲染动态绘制图层 */
    protected renderAnimation(): void;
    /**创建标绘
     * @param type 标绘类型
     * @returns 标绘数据
     */
    private createPlot;
    /**生成动态绘制图层 */
    private genAniPlot;
    /**绘制标绘
     * @param layer 绘制图层
     * @param plotInfo 标绘数据
     * @param type 标绘类型
     */
    private drawPlot;
    /**各个点的平均值计算中心点
     * @param points [经度,纬度][]
     * @param type 标绘类型
     * @returns 中心点[number, number]
     */
    private calcCenter;
    /**直接最大最小计算中心点
     * @param points 纬度经度点数组
     * @returns 中心点[number, number]
     */
    private calcCenter2;
    /**计算多边形的重心
     * @param points 纬度经度点数组
     * @returns 中心点[number, number]
     */
    private calcCenter3;
    /**计算矩形的四个点
     * @param lnglats 经度纬度点数组
     * @returns 矩形四个点[number, number]
     */
    private calcRect;
    /**计算圆的半径
     * @param lnglats 经度纬度点数组
     * @returns 圆的半径
     */
    private calcRadius;
    /**开启鼠标编辑功能
     * @param plotInfo 标绘数据
     */
    private openMouseEdit;
    /**设置圆的编辑点
     * @param plotInfo 标绘数据
     */
    private setCircleEditPoint;
    /**设置多边形的编辑点
     * @param plotInfo 标绘数据
     */
    private setPolygonEditPoint;
    /**点标绘仍可编辑移动位置
     * @param plotInfo 标绘数据
     */
    private setPointEdit;
    /**设置线段的编辑点
     * @param plotInfo 标绘数据
     */
    private setLineEditPoint;
    /**设置矩形的编辑点
     * @param plotInfo 标绘数据
     */
    private setRectEditPoint;
    /**添加响应事件
     * @param lngLat 经纬度
     * @param i 索引
     * @param plotInfo 标绘数据
     * @param eves 事件
     * @param ifVirtual 是否为虚拟点
    */
    private addEvent;
    /**事件开关方法
    * @param flag true开启 false关闭
    */
    private eventSwitch;
    /**鼠标点击事件
     * @param e 鼠标事件对象
     */
    private eventClick;
    /**鼠标移动事件
     * @param e 鼠标事件对象
     */
    private eventMousemove;
    /**双击关闭事件 */
    private eventDblclick;
    /**移除所有的监听函数 */
    private clearCb;
    /**绘制时添加了新点位时的回调
     * @param plotAni 绘制的点位数据
    */
    private cbPointChange?;
    /**绘制时添加了新点位时的回调
     * @param plotAni 绘制的点位数据
    */
    private cbPointAdd?;
    /**绘制时移动已有点位时的回调
     * @param plotAni 绘制的点位数据
    */
    private cbPointMove?;
    /**添加新增点位时的监听函数
     * @param cb 回调函数
     * @returns MapPluginPlot实例
     */
    addCbPointChange(cb: (plotAni: MDataPlot) => void): MapPluginPlot;
    /**添加新增点位时的监听函数
     * @param cb 回调函数
     * @returns MapPluginPlot实例
     */
    addCbPointAdd(cb: (plotAni: MDataPlot) => void): MapPluginPlot;
    /**添加新增点位时的监听函数
     * @param cb 回调函数
     * @returns MapPluginPlot实例
     */
    addCbPointMove(cb: (plotAni: MDataPlot) => void): MapPluginPlot;
    /**标绘列表变化时的回调（新增/删除等） */
    private cbPlotListChange?;
    /**设置标绘列表变化时的监听函数
     * @param cb 回调函数，参数为最新的标绘列表
     * @returns MapPluginPlot实例
     */
    addCbPlotListChange(cb: (plotList: MDataPlot[]) => void): MapPluginPlot;
}
/**地图标绘类型 */
export type MapPlotType = 'point' | 'line' | 'polygon' | 'circle' | 'rect';
/**地图标绘详情类型 */
export type MapPlotDetailType = ({
    type: 'point';
    lngLats: [[number, number]] | [];
} & CanvasImage) | {
    type: 'circle';
    lngLats: [[number, number], [number, number]] | [[number, number]] | [];
    rail?: number;
} | {
    type: 'rect';
    lngLats: [[number, number], [number, number]] | [];
} | {
    type: 'line' | 'polygon';
    lngLats: [number, number][];
};
/**地图标绘数据 */
export type MDataPlot = MOptCanvasLayer & {
    /**标绘名称 */
    name?: string;
    /**是否隐藏 */
    ifHide?: boolean;
    /**是否可编辑 */
    ifEdit?: boolean;
} & MapPlotDetailType;
/**地图标绘插件基础配置 */
export type MOptPluginPlotBase = MOptCanvasLayer & {};
/**地图标绘插件编辑配置 */
export type MOptPluginPlotEdit = Partial<MapArc>;
/**地图标绘插件文本配置 */
export type MOptPluginPlotText = Partial<MapText>;
/**地图标绘插件配置 */
export interface MOptPluginPlot {
    /**标绘配置 */
    plotOpt?: MOptPluginPlotBase;
    /**编辑配置 */
    editOpt?: MOptPluginPlotEdit;
    /**文本配置 */
    textOpt?: MOptPluginPlotText;
}
