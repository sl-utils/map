import { OptCanvas, CanvasArc, CanvasPolygon, CanvasLine, CanvasRect } from "@sl-utils/map";
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
    for (let i = 0; i < points.length; i++) {
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
    fig = Object.assign({}, this.ctxFig, fig);
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
