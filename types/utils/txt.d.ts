type BreakCallback = (str: string) => readonly number[];
/**
 * 切割多行文本
 * @param ctx 画布上下文
 * @param value 文本内容
 * @param fontStyle 字体样式
 * @param width 最大宽度
 * @param hyperWrappingAllowed 是否允许超文本模式
 * @param getBreakOpportunities 分割回调
 * @returns 切割后的文本数组
 */
declare function splitMultilineText(ctx: CanvasRenderingContext2D, value: string, fontStyle: string, width: number, hyperWrappingAllowed: boolean, getBreakOpportunities?: BreakCallback): readonly string[];
/**
 * 清空记录单字符像素长度缓存
 */
declare function clearMultilineCache(): void;
/**
 * 用于计算canvas measureText字符长度
 * 内部缓存其值增加计算速度
 */
export { splitMultilineText as u_TextSplitMultilineText, clearMultilineCache as u_TextClearMultilineCache, };
