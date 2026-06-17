import { OptCanvas, CanvasArc, CanvasPolygon, CanvasLine, CanvasRect } from "../types";
/** canvas画布的工具类
 * 创建画布、设置画布相关配置、获取贝塞尔曲线的控制点
 * 绘制小圆点、矩形、多边形、线、贝塞尔曲线
 */
export declare class SLUCanvas {
    constructor();
    /**画布上下文 */
    protected static ctx: CanvasRenderingContext2D;
    /**绘图的默认配置 */
    private static readonly ctxFig;
    /**绘制小圆点
     * @param arc 圆数据
     * @param ctx 画布上下文
     * @returns SLUCanvas实例
     */
    static drawArc(arc: CanvasArc, ctx?: CanvasRenderingContext2D): SLUCanvas;
    /**绘制矩形
     * @param rect 矩形数据
     * @param ctx 画布上下文
     * @returns SLUCanvas实例
     */
    static drawRect(rect: CanvasRect, ctx?: CanvasRenderingContext2D): SLUCanvas;
    /**绘制多边形
     * @param polygon 多边形数据
     * @param ctx 画布上下文
     * @returns SLUCanvas实例
     */
    static drawPolygon(polygon: CanvasPolygon, ctx?: CanvasRenderingContext2D): SLUCanvas;
    /**绘制线
     * @param line 线数据
     * @param ctx 画布上下文
     * @returns SLUCanvas实例
     */
    static drawLine(line: CanvasLine, ctx?: CanvasRenderingContext2D): SLUCanvas;
    /**绘制贝塞尔曲线
     * @param line 贝塞尔曲线数据
     * @param ctx 画布上下文
     * @returns SLUCanvas实例
     */
    static drawBezierLine(line: CanvasLine, ctx?: CanvasRenderingContext2D): SLUCanvas;
    /**创建一个画布
     * @returns 画布元素
     */
    static createCanvas(): HTMLCanvasElement;
    /**获取贝塞尔曲线的控制点
     * @param s:起点
     * @param e:终点
     * @param degree：曲度等级（越大越弯曲）
     * @returns 控制点
     */
    static getBezierCtrlPoint(s: [number, number], e: [number, number], degree?: number): [number, number];
    /**设置画布的相关配置
     * @param ctx 2D画布渲染上下文
     * @param fig 画布属性配置
     * @returns 2D画布渲染上下文
     */
    static setCtxPara(ctx: CanvasRenderingContext2D, fig?: OptCanvas): CanvasRenderingContext2D;
    /**移除掉值为 undefined 或 null 的属性，方便赋值
     * @param obj 对象
     */
    private static deletePara;
}
