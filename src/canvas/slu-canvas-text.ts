
import { u_TextSplitMultilineText } from '../utils/txt';
import { SLUCanvas } from './slu-canvas';
/**画布绘制文本工具类 */
export class SLUCanvasText {
  private static ctx: CanvasRenderingContext2D;
  /**绘制文本（包含重叠处理）
   * @param info 文本信息
   * @param textRects 已绘制文本
   * @param ctx 画布
  */
  public static drawText(
    info: SLTCanvas.Text,
    textRects: SLTCanvas.TextRect[] = [],
    ctx: CanvasRenderingContext2D = this.ctx
  ): void {
    let { text = '', maxWidth = 0, font = ctx.font, ifHide } = info;
    if (ifHide === true || !text) return null;
    this.ctx = ctx;
    /**字体配置决定meas的值，所以计算前需要设置配置 */
    SLUCanvas.setCtxPara(ctx, info);
    const texts = this.wordWrap(text, maxWidth, font);
    const textRect = this.calcTextRect(texts, info);
    const ctr = this.avoidOverlap(info, textRect, textRects);
    this.renderTexts(info, texts, textRect, textRects, ctr, ctx);
  }
  /**对文本换行计算,按规则得到多行文本 
   * @param text 文本
   * @param ctx 画布
   * @param max 最大宽度
   * @param font 字体
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
   */
  private static calcTextRect(texts: string[], info: SLTCanvas.Text, ctx: CanvasRenderingContext2D = this.ctx): SLTCanvas.TextRect {
    let { point = [20, 20], panel = {}, lineHeight, textAlign, px = 0, py = 0 } = info;
    let w = 0, h = 0, [x0, y0] = point;
    let { actualBoundingBoxDescent = 0 } = ctx.measureText('M');
    h = (lineHeight || actualBoundingBoxDescent) * texts.length;
    w = Math.max(...texts.map(text => ctx.measureText(text).width));
    const { pl = 0, pr = pl, pt = 0, pb = pt } = panel;
    let width = w + pl + pr, height = h + pt + pb;
    if (textAlign === 'center') x0 -= width / 2;
    if (textAlign === 'right') x0 -= width;
    let textRect: SLTCanvas.TextRect = {
      x: x0 + px,
      y: y0 + py,
      width: width,
      height: height
    };
    return textRect;
  }
  /**八个方向查找空隙 
* @param rect 文本范围
* @param rects 已存在的文本范围
* @returns [X轴偏移量,Y轴偏移量,状态控制标识 0-7:方位 8:正常显示 9:不显示 ]
*/
  private static avoidOverlap(info: SLTCanvas.Text, rect: SLTCanvas.TextRect, rects: SLTCanvas.TextRect[]): [number, number, number] {
    const { x, y, width = 0, height = 0 } = rect, { overlap, textAlign } = info, { type = "show", querySpace = 1, maxDistance = 200, minSpacing = 0 } = overlap || {};
    if (type === 'show') return [0, 0, 8];
    let ifOverlap = this.isTextOverlap(rect, rects);
    if (type === 'hide') {
      if (ifOverlap) return [0, 0, 9]
      return [0, 0, 8]
    }
    if (!ifOverlap) {
      return [0, 0, 8];
    } else {
      let flag: boolean = false;
      for (let total = 0; total <= maxDistance; total += querySpace) {
        for (let dir = 0; dir < 8; dir++) {
          /**根据移动方向确定xy的偏移量 dir : 0 上 4下 1-3 右 5-7左 */
          const dirX = dir % 4 === 0 ? 0 : dir < 4 ? 1 : -1, dirY = (dir == 2 || dir == 6) ? 0 : dir < 2 || dir > 6 ? -1 : 1;
          /**不同方位偏移量算法不一样 */
          let px = total * dirX - (dirX < 0 ? width : 0), py = total * dirY - (dirY < 0 ? height : 0);
          // if (!flag) {
          //   let w = textAlign == 'center' ? width/2 : 0;
          //   /**先左右上下移动文本框的宽度或者一半 */
          // }

          if (!this.isTextOverlap({ x: x + px, y: y + py, width, height }, rects, minSpacing)) {
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
   * @param textRects 已绘制文本框
   * @param ctr 偏移控制
   */
  private static renderTexts(info: SLTCanvas.Text, texts: string[], rect: SLTCanvas.TextRect, textRects: SLTCanvas.TextRect[], ctr: [number, number, number], ctx: CanvasRenderingContext2D) {
    const [px, py, status] = ctr,
      { panel = {}, overlap = {}, textAlign = 'center', px: upx = 0, py: upy = 0, point = [0, 0] } = info,
      { pl = 0, pt = 0, pb = pt, pr = pl } = panel,
      { line } = overlap,
      { width = 0, height = 0 } = rect,
      [x0, y0] = point;
    if (status === 9) return;
    rect.x += px, rect.y += py;
    textRects.push({ ...rect });
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
    if (panel) {
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
  /**绘制多行文本*/
  public static renderMultiText(texts: string[], start: number[], info: SLTCanvas.Text, ctx: CanvasRenderingContext2D) {
    let [x, y] = start;
    const { lineHeight, ifShadow } = info;
    let { actualBoundingBoxDescent } = ctx.measureText('M');
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
  /**文本是否重叠 */
  private static isTextOverlap(rect: SLTCanvas.TextRect, rects: SLTCanvas.TextRect[], minSpacing: number = 0) {
    for (const eRect of rects) {
      const { x, y, width = 0, height = 0 } = rect;
      const { x: ex, y: ey = 0, width: ew = 0, height: eh = 0 } = eRect;
      if (!(ex > x + width + minSpacing || ex + ew + minSpacing < x || ey > y + height + minSpacing || ey + eh + minSpacing < y)) {
        return true;
      }
    }
    return false;
  }
}