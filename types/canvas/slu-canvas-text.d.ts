import { CanvasTxt } from "../types";
/**画布绘制文本工具类-绘制不重叠文本标签 */
export declare class SLUCanvasText {
    /**画布上下文 */
    private static ctx;
    /**文本测量缓存 */
    private static textMetricsCache;
    /**最大缓存大小 */
    private static MAX_CACHE_SIZE;
    /**网格大小 */
    private static GRID_SIZE;
    /**网格缓存 */
    private static grid;
    /**清除网格缓存 */
    static openDrawText(): void;
    /**绘制文本（包含重叠处理）-批量绘制前必须清除网格缓存 SLUCanvasText.openDrawText()【待优化】
     * @param info 文本信息
     * @param ctx 画布
    */
    static drawText(info: CanvasTxt, ctx?: CanvasRenderingContext2D): void;
    /**获取文本测量缓存
     * @param ctx 画布
     * @param text 文本
     * @returns 文本测量缓存 TextMetrics
    */
    private static getTextMetrics;
    /**对文本换行计算,按规则得到多行文本
     * @param text 文本
     * @param max 最大宽度
     * @param font 字体
     * @param ctx 画布
     * @returns 多行文本 string[]
    */
    private static wordWrap;
    /**计算得到文本框(无论是否绘制背景框都需要计算)
     * @param texts 文本组
     * @param info 文本配置
     * @param ctx 画布
     * @returns 文本框 CanvasTextRect
     */
    private static calcTextRect;
    /**八个方向查找空隙
     * @param info 文本配置
     * @param rect 文本范围
     * @returns [X轴偏移量,Y轴偏移量,状态控制标识 0-7:方位 8:正常显示 9:不显示 ]
     */
    private static avoidOverlap;
    /**绘制文本
     * @param info 文本配置
     * @param texts 文本字符串组
     * @param rect 文本框
     * @param ctr 偏移控制
     */
    private static renderTexts;
    /**绘制多行文本
     * @param texts 文本字符串组
     * @param start 起始坐标
     * @param info 文本配置
     * @param ctx 画布
    */
    static renderMultiText(texts: string[], start: number[], info: CanvasTxt, ctx: CanvasRenderingContext2D): void;
    /**文本是否重叠
     * @param rect 文本框
     * @param minSpacing 最小间距
     * @returns 是否重叠
     */
    private static isTextOverlap;
    /**添加文本框到网格缓存
     * @param rect 文本框
     */
    private static addRect;
    /**查附近 9 个格子
     * @param rect 文本框
     * @returns 附近 9 个格子的文本框
     */
    private static getNearbyRects;
}
