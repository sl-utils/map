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
/**canvas全局合成操作类型，用于控制canvas绘制时的像素混合模式 */
type GlobalCompositeOperationSelf = 'color' | 'color-burn' | 'color-dodge' | 'copy' | 'darken' | 'destination-atop' | 'destination-in' | 'destination-out' | 'destination-over' | 'difference' | 'exclusion' | 'hard-light' | 'hue' | 'lighten' | 'lighter' | 'luminosity' | 'multiply' | 'overlay' | 'saturation' | 'screen' | 'soft-light' | 'source-atop' | 'source-in' | 'source-out' | 'source-over' | 'xor';
/**canvas渲染的通用配置项 */
export interface OptCanvas {
    /**透明度 @default 1 */
    alpha?: number;
    /**填充的颜色透明度 @default 1 */
    fillAlpha?: number;
    /**填充的颜色(字体的颜色) @default '#EE3434' */
    colorFill?: string | CanvasGradient | CanvasPattern;
    /**线条的颜色 @default '#FFFFFF' */
    colorLine?: string | CanvasGradient | CanvasPattern;
    /**模糊阴影颜色 @default '#000000' */
    shadowColor?: string;
    /**模糊范围大小 @default 0 */
    shadowBlur?: number;
    /**线宽(文本阴影) @default 1 */
    widthLine?: number;
    /**虚线配置，[线长,间隔长] @default [10, 0] */
    dash?: [number, number];
    /**虚线偏移量 @default 0 */
    dashOff?: number;
    /**文本字体，设置字体大小和字体种类 @default '14px serif' */
    font?: string;
    /**文本水平对齐方式，指定文本的(中心|左侧|右侧)渲染在指定位置 */
    textAlign?: CanvasTextAlign;
    /**文字垂直方向的对齐方式 @default 'top' */
    textBaseline?: CanvasTextBaseline;
    /**全局合成操作，控制绘制内容与已有内容的混合方式 @default 'source-over' */
    globalCompositeOperation?: GlobalCompositeOperationSelf;
    /**为true时元素隐藏不绘制 @default false */
    ifHide?: boolean;
}
/**圆点绘制配置 */
interface Arc<I = any> extends OptCanvas {
    /**圆半径 */
    size?: number;
    /**自定义信息，通过该信息可决定其他情况 */
    info?: I;
}
/**矩形渲染配置 */
export interface Rect<I = any> extends OptCanvas {
    /**矩形宽 */
    width?: number;
    /**矩形高 */
    height?: number;
    /**矩形圆角，可为单个值或四个角的数组 */
    radius?: number | number[];
    /**自定义信息，通过该信息可决定其他情况 */
    info?: I;
}
/**多边形渲染配置 */
interface Polygon<I = any> extends OptCanvas {
    /**自定义信息，通过该信息可决定其他情况 */
    info?: I;
}
/**线渲染配置 */
interface Line<I = any> extends OptCanvas {
    /**贝塞尔曲线的曲度，数值越大越弯曲 */
    degree?: number;
    /**自定义信息，通过该信息可决定其他情况 */
    info?: I;
}
/**canvas渲染的圆点类 @template I 标识圆点携带的info的类型 */
export type CanvasArc<I = any> = Arc<I> & CanvasPosition;
/**canvas渲染的矩形类 @template I 标识矩形携带的info的类型 */
export type CanvasRect<I = any> = Rect<I> & CanvasPosition;
/**canvas渲染的多边形类 @template I 标识多边形携带的info的类型 */
export type CanvasPolygon<I = any> = Polygon<I> & CanvasPosition;
/**canvas渲染的线条类 @template I 标识线条携带的info的类型 */
export type CanvasLine<I = any> = Line<I> & Points;
/**单点位位置信息 */
interface Point {
    /**映射到canvas上的位置 [x, y] */
    point: [number, number];
    /**映射到canvas上的多个位置 [x, y][] */
    points?: [number, number][];
}
/**多点位位置信息 */
interface Points {
    /**映射到canvas上的位置 [x, y] */
    point?: [number, number];
    /**映射到canvas上的多个位置 [x, y][] */
    points: [number, number][];
}
/**canvas上的位置信息，支持单点或多点 */
export type CanvasPosition = Point | Points;
/**事件类型 */
export type EventType = 'unset' | 'click' | 'dblclick' | 'mousemove' | 'mousedown' | 'mouseup' | 'mouseleave' | 'mouseenter' | 'rightclick';
export interface CanvasCursorPosition {
    point: [number, number];
    page: [number, number];
}
export interface CanvasEventResponse<T = CanvasEvent, I = any> {
    type: EventType;
    position: CanvasCursorPosition;
    event: T;
    info?: I;
}
export interface CanvasEvent<T extends CanvasEvent = any, I = any> {
    type: EventType | EventType[];
    cb?: (e: CanvasEventResponse<T, I>) => void;
    cbs?: {
        [key in EventType]: (e: CanvasEventResponse<T, I>) => void;
    };
    range?: [number, number];
    left?: number;
    top?: number;
    ifHide?: boolean;
    info?: I;
}
export {};
