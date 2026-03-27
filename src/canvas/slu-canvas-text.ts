
import { CanvasTextRect, CanvasTxt } from '@sl-utils/map';
import { u_TextSplitMultilineText } from '../utils/txt';
import { SLUCanvas } from './slu-canvas';
/**画布绘制文本工具类-绘制不重叠文本标签 */
export class SLUCanvasText {
  /**画布上下文 */
  private static ctx: CanvasRenderingContext2D;
  /**文本测量缓存 */
  private static textMetricsCache = new Map<string, TextMetrics>();
  /**最大缓存大小 */
  private static MAX_CACHE_SIZE = 1000;
  /**网格大小 */
  private static GRID_SIZE = 100;
  /**网格缓存 */
  private static grid = new Map<string, CanvasTextRect[]>();
  /**清除网格缓存 */
  public static openDrawText() {
    this.grid.clear();
  }
  /**绘制文本（包含重叠处理）-批量绘制前必须清除网格缓存 SLUCanvasText.openDrawText()【待优化】
   * @param info 文本信息
   * @param ctx 画布
  */
  public static drawText(info: CanvasTxt, ctx: CanvasRenderingContext2D = this.ctx): void {
    let { text = '', maxWidth = 0, font = ctx.font, ifHide } = info;
    if (ifHide === true || !text) return null;
    this.ctx = ctx;
    /**字体配置决定meas的值，所以计算前需要设置配置 */
    SLUCanvas.setCtxPara(ctx, info);
    const texts = this.wordWrap(text, maxWidth, font);
    const textRect = this.calcTextRect(texts, info);
    const ctr = this.avoidOverlap(info, textRect);
    this.renderTexts(info, texts, textRect, ctr, ctx);
  }
  /**获取文本测量缓存
   * @param ctx 画布
   * @param text 文本
   * @returns 文本测量缓存 TextMetrics
  */
  private static getTextMetrics(ctx: CanvasRenderingContext2D, text: string): TextMetrics {
    const key = ctx.font + '|' + text;
    let metrics = this.textMetricsCache.get(key);
    if (metrics) return metrics;
    metrics = ctx.measureText(text);
    /**控制缓存大小（防止内存爆） */
    if (this.textMetricsCache.size >= this.MAX_CACHE_SIZE) {
      const firstKey = this.textMetricsCache.keys().next().value;
      this.textMetricsCache.delete(firstKey);
    }
    this.textMetricsCache.set(key, metrics);
    return metrics;
  }
  /**对文本换行计算,按规则得到多行文本 
   * @param text 文本
   * @param max 最大宽度
   * @param font 字体
   * @param ctx 画布
   * @returns 多行文本 string[]
  */
  private static wordWrap(text: string, max: number, font: string, ctx: CanvasRenderingContext2D = this.ctx): string[] {
    /**强制分行分隔符 */
    let strs = text.split('\n').filter(e => e != '');
    if (max <= 0) return strs;
    let texts: string[] = [];
    strs.forEach((text) => {
      texts.push(...u_TextSplitMultilineText(ctx, text, font, max, true, (str) => {
        return [str.lastIndexOf(',') + 1]
      }))
    })
    return texts
  }
  /**计算得到文本框(无论是否绘制背景框都需要计算)
   * @param texts 文本组
   * @param info 文本配置
   * @param ctx 画布
   * @returns 文本框 CanvasTextRect
   */
  private static calcTextRect(texts: string[], info: CanvasTxt, ctx: CanvasRenderingContext2D = this.ctx): CanvasTextRect {
    let { point = [20, 20], panel = {}, lineHeight, textAlign, px = 0, py = 0 } = info;
    let w = 0, h = 0, [x0, y0] = point;
    let { actualBoundingBoxDescent = 0 } = this.getTextMetrics(ctx, 'M');
    h = (lineHeight || actualBoundingBoxDescent) * texts.length;
    w = Math.max(...texts.map(text => this.getTextMetrics(ctx, text).width));
    const { pl = 0, pr = pl, pt = 0, pb = pt } = panel;
    let width = w + pl + pr, height = h + pt + pb;
    if (textAlign === 'center') x0 -= width / 2;
    if (textAlign === 'right') x0 -= width;
    let textRect: CanvasTextRect = {
      x: x0 + px,
      y: y0 + py,
      width: width,
      height: height
    };
    return textRect;
  }
  /**八个方向查找空隙 
   * @param info 文本配置
   * @param rect 文本范围
   * @returns [X轴偏移量,Y轴偏移量,状态控制标识 0-7:方位 8:正常显示 9:不显示 ]
   */
  private static avoidOverlap(info: CanvasTxt, rect: CanvasTextRect): [number, number, number] {
    const { x, y, width = 0, height = 0 } = rect, { overlap, textAlign } = info, { type = "show", querySpace = 1, maxDistance = 200, minSpacing = 0 } = overlap || {};
    if (type === 'show') return [0, 0, 8];
    let ifOverlap = this.isTextOverlap(rect, minSpacing);
    if (type === 'hide') {
      if (ifOverlap) return [0, 0, 9]
      return [0, 0, 8]
    }
    if (!ifOverlap) {
      return [0, 0, 8];
    } else {
      /** 上 下 右 左 斜角 顺序排放 */
      const dirs = [0, 4, 2, 6, 1, 3, 5, 7];
      /** 方位映射 上 右上 右 右下 下 左下 左 左上 */
      const DIR_MAP = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
      const testRect = { x: 0, y: 0, width, height };
      for (let total = querySpace; total <= maxDistance; total += querySpace) {
        for (let i = 0; i < dirs.length; i++) {
          const dir = dirs[i];
          const [dirX, dirY] = DIR_MAP[dir];
          let px = total * dirX, py = total * dirY;
          testRect.x = x + px, testRect.y = y + py;
          if (!this.isTextOverlap(testRect, minSpacing)) {
            return [px, py, dir]
          }
        }
      }
    }
    return [0, 0, 9];
  }
  /**绘制文本
   * @param info 文本配置
   * @param texts 文本字符串组
   * @param rect 文本框
   * @param ctr 偏移控制
   */
  private static renderTexts(info: CanvasTxt, texts: string[], rect: CanvasTextRect, ctr: [number, number, number], ctx: CanvasRenderingContext2D): void {
    const [px, py, status] = ctr,
      { panel = {}, overlap = {}, textAlign = 'center', px: upx = 0, py: upy = 0, point = [0, 0] } = info,
      { pl = 0, pt = 0, pb = pt, pr = pl } = panel,
      { line } = overlap,
      { width = 0, height = 0 } = rect,
      [x0, y0] = point;
    if (status === 9) return;
    rect.x += px, rect.y += py;
    this.addRect(rect);
    if (px != 0 || py != 0 && line) {
      //status 0正上 1右上 2右 3右下 4正下 5左下 6左 7左上
      let { x: x1, y: y1 } = rect;
      switch (status) {
        case 0: x1 = x1, y1 = y1 + height; break;
        case 1: x1 = x1, y1 = y1 + height; break;
        case 2: x1 = x1, y1 = y1; break;
        case 3: x1 = x1, y1 = y1; break;
        case 4: x1 = x1, y1 = y1; break;
        case 5: x1 = x1 + width, y1 = y1; break;
        case 6: x1 = x1 + width, y1 = y1; break;
        case 7: x1 = x1 + width, y1 = y1 + height; break;
      }
      SLUCanvas.drawLine({ ...line, points: [[x0, y0], [x1, y1]] }, ctx);
    }
    if (panel && Object.keys(panel).length > 0) {
      SLUCanvas.drawRect(
        {
          point: [rect.x, rect.y],
          width: rect.width,
          height: rect.height,
          radius: panel.radius,
          ...panel,
        },
        ctx
      );
    }
    SLUCanvas.setCtxPara(ctx, info);
    this.renderMultiText(texts, [rect.x + pl, rect.y + pt], info, ctx);
    SLUCanvas.setCtxPara(ctx);
  }
  /**绘制多行文本
   * @param texts 文本字符串组
   * @param start 起始坐标
   * @param info 文本配置
   * @param ctx 画布
  */
  public static renderMultiText(texts: string[], start: number[], info: CanvasTxt, ctx: CanvasRenderingContext2D): void {
    let [x, y] = start;
    const { lineHeight, ifShadow } = info;
    let { actualBoundingBoxDescent } = this.getTextMetrics(ctx, 'M');
    texts.forEach(text => {
      /**文本居中 需偏移量 */
      let fontTop = lineHeight && lineHeight > actualBoundingBoxDescent ? (lineHeight - actualBoundingBoxDescent) / 2 : 0;
      /**行高 变化量 */
      let dH = lineHeight || actualBoundingBoxDescent;
      if (ifShadow) /**绘制描边 */ ctx.strokeText(text, x, y + fontTop);
      /**绘制文本 */
      ctx.fillText(text, x, y + fontTop);
      y += dH;
    })
  }
  /**文本是否重叠
   * @param rect 文本框
   * @param minSpacing 最小间距
   * @returns 是否重叠
   */
  private static isTextOverlap(rect: CanvasTextRect, minSpacing: number = 0): boolean {
    const nearbyRects = this.getNearbyRects(rect);
    for (const eRect of nearbyRects) {
      if (rect === eRect) continue;
      const { x, y, width = 0, height = 0 } = rect;
      const { x: ex, y: ey = 0, width: ew = 0, height: eh = 0 } = eRect;
      if (!(ex > x + width + minSpacing || ex + ew + minSpacing < x || ey > y + height + minSpacing || ey + eh + minSpacing < y)) {
        return true;
      }
    }
    return false;
  }
  /**添加文本框到网格缓存
   * @param rect 文本框
   */
  private static addRect(rect: CanvasTextRect): void {
    const { x, y, width, height } = rect;
    const startX = Math.floor(x / this.GRID_SIZE), endX = Math.floor((x + width) / this.GRID_SIZE);
    const startY = Math.floor(y / this.GRID_SIZE), endY = Math.floor((y + height) / this.GRID_SIZE);
    for (let gx = startX; gx <= endX; gx++) {
      for (let gy = startY; gy <= endY; gy++) {
        const key = `${gx}_${gy}`;
        let cell = this.grid.get(key);
        if (!cell) {
          this.grid.set(key, [rect]);
        } else {
          cell.push(rect);
        }
      }
    }
  }
  /**查附近 9 个格子
   * @param rect 文本框
   * @returns 附近 9 个格子的文本框
   */
  private static getNearbyRects(rect: CanvasTextRect): CanvasTextRect[] {
    const gx = Math.floor(rect.x / this.GRID_SIZE), gy = Math.floor(rect.y / this.GRID_SIZE);
    let result: CanvasTextRect[] = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = `${gx + dx}_${gy + dy}`;
        const cell = this.grid.get(key);
        if (cell) { result.push(...cell); }
      }
    }
    return result;
  }
}