import { MapCanvasLayer, SLUMap } from "../map";
import { OptMapPluginPlot, DataMapPlot, MapPlotType, OptMapPluginPlotBase } from "../types";
/**自定义标绘类
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap 地图实例
 * @param options 标绘配置
 */
export declare class MapPluginPlot extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: OptMapPluginPlot);
    /**标绘形状配置 */
    options: OptMapPluginPlotBase;
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
    plotAni?: DataMapPlot;
    /**记录当前鼠标纬经度 */
    private curPoint?;
    /** 单击事件 */
    private eventClickTimer;
    /**开启新增的绘制
     * @param type 标绘类型
     * @returns 新增的标绘实例
     */
    open(type: MapPlotType): DataMapPlot;
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
    delPlot(plot?: DataMapPlot): MapPluginPlot;
    /**设置所有区域数据
     * @param plotList 标绘集合
     * @returns MapPluginPlot实例
     */
    setPlotList(plotList: DataMapPlot[]): MapPluginPlot;
    /**设置编辑区域数据
     * @param plot 标绘实例
     * @returns MapPluginPlot实例
     */
    setEditPlot(plot: DataMapPlot): MapPluginPlot;
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
     * @param points 纬度经度点数组
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
     * @param latLngs 纬度经度点数组
     * @returns 矩形四个点[number, number]
     */
    private calcRect;
    /**计算圆的半径
     * @param latLngs 纬度经度点数组
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
     * @param latLng 经纬度
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
    addCbPointChange(cb: (plotAni: DataMapPlot) => void): MapPluginPlot;
    /**添加新增点位时的监听函数
     * @param cb 回调函数
     * @returns MapPluginPlot实例
     */
    addCbPointAdd(cb: (plotAni: DataMapPlot) => void): MapPluginPlot;
    /**添加新增点位时的监听函数
     * @param cb 回调函数
     * @returns MapPluginPlot实例
     */
    addCbPointMove(cb: (plotAni: DataMapPlot) => void): MapPluginPlot;
    /**标绘列表变化时的回调（新增/删除等） */
    private cbPlotListChange?;
    /**设置标绘列表变化时的监听函数
     * @param cb 回调函数，参数为最新的标绘列表
     * @returns MapPluginPlot实例
     */
    addCbPlotListChange(cb: (plotList: DataMapPlot[]) => void): MapPluginPlot;
}
