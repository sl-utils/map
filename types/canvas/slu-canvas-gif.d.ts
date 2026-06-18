import { CanvasGif } from "../types";
/**canvas绘制gif工具类 */
export declare class SLUCanvasGif {
    constructor();
    /** 用来拿 imagedata 的工具人*/
    private canvasTool;
    /** 工具人的 getContext('2d')不能初始化，否则可能出现空白帧*/
    private ctx;
    private gifInfo;
    private LAST_DISPOSA_METHOD;
    /**当前帧的下标*/
    private CURRENT_FRAME_INDEX;
    private TRANSPARENCY;
    private CTX;
    /**缓存的数据 */
    private gifCache;
    /**存放动画id用于停止之前绘制的动画 */
    private aniIds;
    private opts;
    private timeId;
    /**加载gif并进行缓存 , 避免重复请求 url */
    loadGIF(opt: CanvasGif, ctx: CanvasRenderingContext2D): Promise<void>;
    private fetchGIF;
    /**解析数据流头部并设置工具canvas的宽高 */
    private parseHeader;
    /**解析内容块 */
    private parseBlock;
    /**播放gif */
    private playGif;
    /**绘制每一帧 */
    private drawFrame;
    /**关闭之前的定时动画 */
    private stopGif;
    private parseExt;
    private pushFrame;
    private parseImg;
    /**读取数据块 */
    private readSubBlocks;
    /**解码LZW编码 */
    private lzwDecode;
    /** */
    private doImg;
    /**数字转换为对应的位然后变为长度为7的boolean数组
     * @param bite number
     */
    private byteToBitArr;
    /**boolean数组转换为对应的数字
     * @param ba boolean[]
     */
    private bitsToNum;
    /**获取全局颜色列表
     * @param size 全局颜色列表大小
     */
    private parseCT;
}
