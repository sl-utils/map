import { OptMapPluginArrowLine, MapLine } from "../types";
import { Map as MaplibreMap } from 'maplibre-gl';
/**地图canvas箭头线类
 * @constructor
 * @param map 地图实例
 * @param ctx 画布上下文
 * @param opts 动画线配置项
 */
export declare class MapCanvasArrowLine {
    private map;
    private ctx;
    constructor(map: AMAP.Map | L.Map | MaplibreMap, ctx: CanvasRenderingContext2D, opt?: OptMapPluginArrowLine);
    private opt;
    /**默认配置项 */
    private readonly options;
    /**(箭头)图片地址 */
    private get imgUrl();
    /**(箭头)图片宽度 */
    private get partialWidth();
    /**(箭头)图片高度 */
    private get partialHeight();
    /**边界 */
    private get patternBound();
    /**初始化资源加载图片 */
    private initResource;
    /**所有的线数据 */
    private allLines;
    /**每组线的动画偏移变量暂存 */
    private offset;
    /**所有的点数据 */
    private allPoints;
    /**设置所有线
     * @param lines 线集合
     */
    setAllLines(lines: MapLine[]): void;
    /**更新所有线的点并绘制 */
    update(): void;
    /**判断点是否在画布范围内
     * @param point 点
     * @param range 画布范围
     * @returns 是否在画布范围内
     */
    private visiblePoint;
    /** 线段连线方向
     * @param point1
     * @param point2
     * @returns 线段连线方向
     */
    private directionLine;
    /** 不在画布范围内修改起始点 减少生成过多粒子
     * @param points 线段点
     * @returns 修正后的线段点
     */
    private validLine;
    /**获取二次贝塞尔曲线划分任意点位置
     * @param {number} t 当前百分比
     * @param {Array} p1 起点坐标
     * @param {Array} cp 控制点
     * @param {Array} p2 终点坐标
     * @returns 二次贝塞尔曲线划分任意点位置
     */
    private getQuadraticBezierPoint;
    /**绘制箭头线 */
    draw(): void;
    /**获取修正后的线段点
     * @param points 线段点
     * @returns 修正后的线段点
     */
    private getValidPoints;
    /**绘制箭头线路径
     * @param points 线段点
     */
    private drawPath;
    /**初始化箭头线图案路径 */
    private patternPathInit;
    /**创建箭头线图案
     * @returns 箭头线图案
     */
    private createPattern;
}
