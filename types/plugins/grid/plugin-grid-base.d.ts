import { MapCanvasLayer, type MOptCanvasLayer } from "../../map";
import { MapType } from "../../utils";
/**
 * 网格插件基础类
 *
 * 用于处理和渲染网格数据，支持双线性插值、马赛克填色、渐变色等。
 * 是 MapPluginGrid、MapPluginWind 等插件的基类。
 *
 * @extends MapCanvasLayer
 * @constructor
 * @param map 地图实例
 * @param options 网格配置
 *
 * @example
 * ```typescript
 * // 通常不直接使用此类，而是使用其子类
 * import { SLMap, MapPluginGrid } from '@sl-utils/map';
 *
 * const map = new SLMap('map');
 * await map.init({ type: 'L' });
 *
 * // 创建网格插件（继承自 MapPluginGridBase）
 * const grid = new MapPluginGrid(map, {
 *   mosaicColor: [
 *     '#0000CD', '#0066ff', '#00B7ff', '#00E0FF',
 *     '#00FFFF', '#00FFCC', '#00FF99', '#00FF00',
 *     '#99FF00', '#CCFF00', '#FFFF00', '#FFCC00',
 *     '#FF9900', '#FF6600', '#FF0000', '#B03060'
 *   ],
 *   mosaicValue: [0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
 * });
 *
 * // 设置网格数据
 * grid.setData([
 *   {
 *     header: {
 *       lo1: 100, la1: 20, lo2: 130, la2: 40,
 *       nx: 61, ny: 41, dx: 0.5, dy: 0.5
 *     },
 *     data: [/* 网格数据 *\/]
 *   }
 * ]);
 *
 * // 获取指定经纬度的数据
 * const info = grid.getInfoByLngLat(114.12, 22.68);
 * if (info) {
 *   console.log(`值: ${info[2]}`);
 * }
 * ```
 */
export declare class MapPluginGridBase extends MapCanvasLayer {
    constructor(map: MapType, options: Partial<MOptGrid>);
    /**基础配置 */
    readonly options: MOptGrid;
    /**网格数据   数据 [X] [Y]  */
    protected gridXY?: [number, number][][];
    /**可视区网格数据 */
    protected boundsDatas?: [number, number, number][][];
    /**数据起始经度 */
    protected lng0: number;
    /**数据起始纬度 */
    protected lat0: number;
    /**数据经度差值 数据经度间隔 (若全球数据中0.5经度间隔得到一个数据，则 dx = 1 * 0.5 )*/
    protected lngΔ: number;
    /**数据纬度差值 */
    protected latΔ: number;
    /**单挑数据由几个数据组成 */
    protected dataLength: number;
    /**无数据值 */
    protected invalid: number | undefined | null;
    /**构建阴影的html */
    protected shadowElement?: HTMLCanvasElement;
    /**渐变图像的html */
    protected gradientElement?: HTMLCanvasElement;
    /**渐变数据 */
    protected gradient?: Uint8ClampedArray;
    /**启用新的线程 */
    private worker;
    /**线程id */
    private workerId;
    /**将线程绘制的图像绘制出来
     * @param data 线程绘制的图像
     */
    private workerCb;
    /**设置网格数据
     * @param datas 网格数据
     */
    _setDatas(datas: MDataGrid[]): void;
    /**采用线程调取生成可视区网格数据
     * @param bounds 可视区域的像素范围
     */
    protected interpolateFieldByWorker(bounds: GridBounds): void;
    /**grid数据，以及获得指定经纬度数据的方法interpolate
     * @param bounds 可视区域的像素范围
    */
    protected interpolateField(bounds: GridBounds): void;
    /**获取视图范围内的(指定像素间隔的数据)
     * @param bounds 可视区域的像素范围
     * @param pixelInterval @default 2 像素间隔
     * @returns 可视区域的网格数据
     */
    protected getViewBoundsGrid(bounds: GridBounds, pixelInterval?: number): [number, number, number][][];
    /**构建网格数据gridXY: [开始的数据,结束的数据] [x序号] [y序号]
     * @param grids 一维数据
     * @returns 三维网格数据
     */
    private builder;
    /**获得指定经纬度的数据信息
    * @param lng 经度
    * @param lat 纬度
    * @return [ 计算得到的开始值S , 计算的到的结束值E, sqrt(S*S+E*E) ]
    */
    protected interpolate(lng: number, lat: number): null | [number, number, number];
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
    /**针对经纬度特殊的取余数方法
     * 小于等于n的数字若a小于0，返回 2n+a ， -365  => 2n-365
     * @param a 待取余的数字
     * @param n 取余的除数
     * @returns 取余的结果
    */
    private floorMod;
    /**判断是否为有效数据
     * @param x 待判断的数字
     * @returns 是否为有效数据
     */
    private isValue;
    /**此处无数据数据
     * @param xy 待判断的经纬度
     * @returns 是否为无数据数据
     */
    private isNull;
    /**生成马赛克类型图
     * @param datas 网格数据
     */
    protected genMosaic(datas: [number, number, number][][]): void;
    /**生成黑白遮罩，以便构建渐变图
     * @param datas 网格数据
     * @returns MapPluginGridBase实例
     */
    protected genShade(datas: [number, number, number][][]): MapPluginGridBase;
    /**获取该值所在的颜色
     * @param value 待判断的数值
     * @returns 该数值对应的颜色
     */
    protected getColorByValue(value: number): string;
    /**生成单个的阴影半径(圆形)
     * @param r 半径
     * @param blur @default 15 模糊度
     * @returns 画布元素
    */
    protected genShadowRadius(r: number, blur?: number): HTMLCanvasElement;
    /**构建渐变色
     * @param grad 渐变颜色
     * @returns 画布元素
     */
    private genGradient;
    /**填充颜色
     * @param pixels 像素数据
     * @param gradient 渐变颜色
     */
    private _colorize;
}
/**网格数据头部 */
export interface MDataGridHeader {
    /**网格列数 */
    nx: number;
    /**网格行数 */
    ny: number;
    /**起始纬度 */
    la1: number;
    /**起始经度 */
    lo1: number;
    /**经度间隔 */
    dx: number;
    /**纬度间隔 */
    dy: number;
    /**结束纬度 */
    la2: number;
    /**结束经度 */
    lo2: number;
}
/**网格数据 */
export interface MDataGrid {
    /**网格列数 */
    nx?: number;
    /**网格行数 */
    ny?: number;
    /**经度间隔 */
    dx?: number;
    /**纬度间隔 */
    dy?: number;
    /**起始经度 */
    sx?: number;
    /**起始纬度 */
    sy?: number;
    /**无效值 */
    nodata?: number | undefined;
    /**缩放比例 */
    scale?: number;
    /**数据个数 */
    num?: number;
    /**网格头部信息 */
    header: MDataGridHeader;
    /**数据数组 */
    data: number[];
}
/**网格边界 */
export interface GridBounds {
    /**起始X坐标 */
    x: number;
    /**起始Y坐标 */
    y: number;
    /**宽度 */
    width: number;
    /**高度 */
    height: number;
}
/**Worker处理信息 */
export interface WorkerInfo {
    /**任务ID */
    id?: number;
    /**画布宽度 */
    width: number;
    /**画布高度 */
    height: number;
    /**纬度 */
    lat: number;
    /**经度 */
    lng: number;
    /**纬度数组 */
    lats: number[];
    /**经度增量 */
    lngd: number;
    /**起始纬度 */
    lat0: number;
    /**起始经度 */
    lng0: number;
    /**纬度增量 */
    latΔ: number;
    /**经度增量 */
    lngΔ: number;
    /**无效值 */
    invalid: number | undefined | null;
    /**网格数据 */
    grid: any;
    /**马赛克颜色 */
    mosaicColor?: string[];
    /**马赛克值 */
    mosaicValue?: number[];
}
/**网格插件配置 */
export type MOptGrid = MOptCanvasLayer & {
    /**马赛克颜色 */
    mosaicColor?: string[];
    /**马赛克值 */
    mosaicValue?: number[];
    /**渐变颜色 */
    gradient?: {
        [key: number]: string;
    };
    /**渐变最大值 */
    gradientMax?: number;
    /**渐变半径 */
    gradientRadius?: number;
};
