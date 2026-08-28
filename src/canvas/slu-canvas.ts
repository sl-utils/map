import { um_deepMergeOpt } from "../utils";
/** canvas画布的工具类
 * 创建画布、设置画布相关配置、获取贝塞尔曲线的控制点
 * 绘制小圆点、矩形、多边形、线、贝塞尔曲线
 */
export class SLUCanvas {
  constructor() { }
  /**画布上下文 */
  protected static ctx: CanvasRenderingContext2D;
  /**绘图的默认配置 */
  private static readonly ctxFig: OptCanvas = {
    alpha: 1,
    fillAlpha: 1,
    colorFill: '#EE3434',
    colorLine: '#FFFFFF',
    shadowColor: '#000000',
    shadowBlur: 0,
    widthLine: 1,
    dash: [10, 0],
    dashOff: 0,
    font: '14px serif',
    textBaseline: "top",
    globalCompositeOperation: 'source-over',
  };
  /**绘制小圆点
   * @param arc 圆数据
   * @param ctx 画布上下文
   * @returns SLUCanvas实例
   */
  public static drawArc(arc: CanvasArc, ctx: CanvasRenderingContext2D = this.ctx): SLUCanvas {
    if (arc.ifHide === true) return this;
    let { point, points = [], size = 10 } = arc;
    if (point) { points.length ? points.push(point) : points = [point]; }
    this.setCtxPara(ctx, arc);
    for (let i = 0, len = points.length; i < len; i++) {
      ctx.beginPath();
      const [x, y] = points[i] || [0, 0];
      ctx.arc(x, y, size, 0, 2 * Math.PI, false);
      ctx.stroke();
      ctx.globalAlpha = arc.fillAlpha ?? 1;
      ctx.fill();
    }
    this.setCtxPara(ctx);
    return this;
  }
  /**绘制矩形
   * @param rect 矩形数据
   * @param ctx 画布上下文
   * @returns SLUCanvas实例
   */
  public static drawRect(rect: CanvasRect, ctx: CanvasRenderingContext2D = this.ctx): SLUCanvas {
    if (rect.ifHide === true) return this;
    let { point, points = [], width = 0, height = 0, radius = [0, 0, 0, 0] } = rect;
    if (point) { points.length ? points.push(point) : points = [point]; }
    this.setCtxPara(ctx, rect);
    for (let i = 0, len = points.length; i < len; i++) {
      const [x, y] = points[i] || [0, 0];
      ctx.beginPath();
      ctx['roundRect'](x, y, width, height, radius);
      ctx.stroke();
      ctx.globalAlpha = rect.fillAlpha ?? 1;
      ctx.fill();
      ctx.closePath();
      // radius = 3;
      // x = x + 300;
      // ctx.beginPath();
      // ctx.moveTo(x + radius, y);
      // ctx.arcTo(x + width, y, x + width, y + height, radius);
      // ctx.arcTo(x + width, y + height, x, y + height, radius);
      // ctx.arcTo(x, y + height, x, y, radius);
      // ctx.arcTo(x, y, x + width, y, radius);
      // ctx.closePath();
      // ctx.stroke();
    }
    this.setCtxPara(ctx);
    return this;
  }
  /**绘制多边形
   * @param polygon 多边形数据
   * @param ctx 画布上下文
   * @returns SLUCanvas实例
   */
  public static drawPolygon(polygon: CanvasPolygon, ctx: CanvasRenderingContext2D = this.ctx): SLUCanvas {
    const { points = [] } = polygon;
    if (polygon.ifHide === true || points.length < 2) return this;
    this.setCtxPara(ctx, polygon);
    for (let i = 0, len = points.length; i < len; i++) {
      const [x, y] = points[i] || [0, 0];
      if (i == 0) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else if (i == len - 1) {
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.globalAlpha = polygon.fillAlpha ?? 1;
        ctx.fill();
        if (ctx.lineWidth > 0) {
          ctx.globalAlpha = polygon.alpha ?? 1;
          ctx.stroke();
        }
      } else {
        ctx.lineTo(x, y);
      }
    }
    this.setCtxPara(ctx);
    return this;
  }
  /**绘制线
   * @param line 线数据
   * @param ctx 画布上下文
   * @returns SLUCanvas实例
   */
  public static drawLine(line: CanvasLine, ctx: CanvasRenderingContext2D = this.ctx): SLUCanvas {
    if (line.ifHide === true) return this;
    const { points = [] } = line;
    if (points.length < 2) return this;
    this.setCtxPara(ctx, line);
    const [x0, y0] = points[0] || [0, 0], lineWidth = line.widthLine || 1;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    for (let i = 1, len = points.length; i < len; i++) {
      const [x, y] = points[i] || [0, 0];
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    this.setCtxPara(ctx);
    return this;
  }
  /**绘制贝塞尔曲线
   * @param line 贝塞尔曲线数据
   * @param ctx 画布上下文
   * @returns SLUCanvas实例
   */
  public static drawBezierLine(line: CanvasLine, ctx: CanvasRenderingContext2D = this.ctx): SLUCanvas {
    if (line.ifHide === true) return this;
    const { points = [] } = line;
    if (points.length < 2) return this;
    this.setCtxPara(ctx, line);
    const [x0, y0] = points[0] || [0, 0], degree = line.degree ?? 1;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    for (let i = 1, len = points.length; i < len; i++) {
      let [sx, sy] = points[i - 1], [ex, ey] = points[i];
      let [cpx, cpy] = this.getBezierCtrlPoint([sx, sy], [ex, ey], degree);
      ctx.quadraticCurveTo(cpx, cpy, ex, ey);
    }
    ctx.stroke();
    this.setCtxPara(ctx);
    return this;
  }
  /**创建一个画布
   * @returns 画布元素
   */
  public static createCanvas(): HTMLCanvasElement {
    return document.createElement('canvas');
  }
  /**获取贝塞尔曲线的控制点
   * @param s:起点
   * @param e:终点
   * @param degree：曲度等级（越大越弯曲）
   * @returns 控制点
   */
  public static getBezierCtrlPoint(s: [number, number], e: [number, number], degree: number = 1): [number, number] {
    const e0 = s, e1 = e, cx = (e0[0] + e1[0]) / 2, cy = (e0[1] + e1[1]) / 2, d = degree;
    let x = cx - e0[0], y = cy - e0[1];
    /**中点到起点间的距离 */
    let len = Math.sqrt(x * x + y * y);
    if (len === 0) return [cx, cy];
    /**角度 */
    let angle = Math.PI / 2 - Math.asin(y / len);
    let xd = d * Math.cos(angle) * len, yd = (d * Math.sin(angle) * len * x) / Math.abs(x);
    xd = isNaN(xd) ? 0 : xd;
    yd = isNaN(yd) ? 0 : yd;
    let curve: [number, number] = [cx + xd, cy - yd];
    return curve;
  }
  /**设置画布的相关配置
   * @param ctx 2D画布渲染上下文
   * @param fig 画布属性配置
   * @returns 2D画布渲染上下文
   */
  public static setCtxPara(ctx: CanvasRenderingContext2D, fig: OptCanvas = {}): CanvasRenderingContext2D {
    this.ctx = ctx;
    this.deletePara(fig);
    fig = um_deepMergeOpt(this.ctxFig, fig);
    ctx.globalAlpha = fig.alpha!;
    ctx.globalCompositeOperation = fig.globalCompositeOperation!;
    ctx.fillStyle = fig.colorFill!;
    ctx.strokeStyle = fig.colorLine!;
    ctx.lineWidth = fig.widthLine!;
    ctx.shadowColor = fig.shadowColor!;
    ctx.shadowBlur = fig.shadowBlur!;
    ctx.font = fig.font!;
    ctx.textBaseline = fig.textBaseline!;
    ctx.setLineDash(fig.dash!);
    ctx.lineDashOffset = fig.dashOff!;
    return ctx;
  }
  /**移除掉值为 undefined 或 null 的属性，方便赋值
   * @param obj 对象
   */
  private static deletePara(obj: any = {}): void {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const ele = obj[key];
        if (ele === undefined || ele === null) {
          Reflect.deleteProperty(obj, key);
        }
      }
    }
  }
}

// ==================== 类型约束 ====================

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
  cbs?: { [key in EventType]: (e: CanvasEventResponse<T, I>) => void };
  range?: [number, number];
  left?: number;
  top?: number;
  ifHide?: boolean;
  info?: I;
}