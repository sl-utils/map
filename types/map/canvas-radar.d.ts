import { Map as LMap } from 'leaflet';
import { Map as MaplibreMap } from 'maplibre-gl';
import type { MapShow, MapPoint, SizeFix_, MapEvent } from ".";
/**地图canvas绘制雷达类
 * @constructor
 * @param map 地图实例
 * @param ctx 画布上下文
 */
export declare class MapCanvasRadar {
    private map;
    private ctx;
    constructor(map: AMAP.Map | LMap | MaplibreMap, ctx: CanvasRenderingContext2D);
    /**当前地图缩放层级 */
    private get zoom();
    /**上一动画时间(毫秒) */
    private pertime;
    /**雷达的默认设置 */
    private options;
    /**所有的雷达数据 */
    private allRadars;
    /**重设雷达绘制类
     * @param radars 雷达数据集合
     * @returns MapCanvasRadar实例
     */
    setAllRadars(radars: MOptPluginRadar[]): MapCanvasRadar;
    /**添加雷达绘制类
     * @param radar 雷达数据
     * @returns MapCanvasRadar实例
     */
    addRadar(radar: MOptPluginRadar): MapCanvasRadar;
    /**开始绘制所有雷达静态部分 */
    drawRadarStatic(): void;
    /**开始绘制所有雷达动态扫描部分
     * @param time 当前时间(毫秒)
     */
    drawRadarAmi(time?: number): void;
    /**更新所有雷达位置和大小
     * @param radar 雷达数据
     */
    private updatePoint;
    /**绘制雷达网格
     * @param radar 雷达数据
     */
    private drawGrid;
    /**虚线圈到中心点距离
     * @param radar 雷达数据
     */
    private drawDashArc;
    /**绘制自定义的虚线圈
     * @param radar 雷达数据
     */
    private drawCustomDashArc;
    /**绘制轮廓
     * @param radar 雷达数据
     */
    private drawOutline;
    /**绘制边缘单元
     * @param radar 雷达数据
     */
    private drawOutlineUnit;
    /**雷达背景蒙版 中间泛白
     * @param radar 雷达数据
     */
    private drawBackground;
    /**绘制文字描述
     * @param radar 雷达数据
     */
    private drawText;
    /**绘制扫描范围
     * @param radar 雷达数据
     */
    private drawScanRange;
    /**更新动态当前角度
     * @param radar 雷达数据
     * @param diffTime 时间差
     */
    private updateAngle;
    /**绘制扫描部分(动态)
     * @param radar 雷达数据
     */
    private drawScan;
    /**
     * 绘制扇形区域
     * @param sectorDeg 扇形渐变角度
     */
    private drawSector;
    /**计算colors 渐变颜色
     * @param colors 颜色数组
     * @param total 总颜色数
     * @returns 渐变颜色数组
     */
    private caculateColorChange;
}
/**雷达插件配置 @template I 标识雷达携带的info的类型 */
export interface MOptPluginRadar<I = any> extends MapShow, MapPoint, SizeFix_ {
    /**动画唯一标识 */
    animeId: string;
    /**角度范围 [start, end] */
    angle?: [number, number];
    /**是否顺时针旋转 */
    ifClockwise?: boolean;
    /**旋转时间(毫秒) */
    time?: number;
    /**当前角度 */
    currentAngle?: number;
    /**扇形角度 */
    sectorAngle?: number;
    /**扇形颜色 */
    colorSector?: string;
    /**网格颜色 */
    colorGrid?: string;
    /**文本颜色 */
    colorText?: string;
    /**雷达颜色 */
    colorRadar?: string;
    /**虚线颜色 */
    colorDash?: string[];
    /**圆弧虚线配置 */
    arcDash?: number[];
    /**网格密度 */
    gridDensity?: number;
    /**虚线密度 */
    dashDensity?: number;
    /**是否隐藏 */
    ifHide?: boolean;
    /**半径 */
    radius?: number;
    /**中心点 */
    center?: [number, number];
    /**自定义信息 */
    info?: I;
}
/**雷达扫描事件类型 @template I 标识雷达携带的info的类型 */
export type MapRadarScanEvent<I = any> = MOptPluginRadar<I> & MapEvent<MapEvent, I>;
