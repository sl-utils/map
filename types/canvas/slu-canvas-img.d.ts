import type { CanvasPosition } from "./slu-canvas";
/**画布图片类，用于绘制图片到画布上（支持旋转、缩放、透明度、偏移、多点批量绘制） */
export declare class SLUCanvasImg {
    /**图片的缓存 */
    static readonly ImageCache: {
        [key: string]: HTMLImageElement;
    };
    /**加载需要提前加载的异步图片，保证图片层级正确
     * @param urls 图片路径数组
    */
    static loadImg(urls?: string[]): void;
    /**绘制图片,默认图片中心点
     * @param img 图片对象
     * @param ctx 画布上下文
     * @returns Promise<void>
     */
    static drawImg(img: CanvasImage, ctx: CanvasRenderingContext2D): Promise<void>;
    /**根据图片路径地址，获取图片后缓存 , 避免重复请求
    * @param url 图片路径
    * @returns Promise<HTMLImageElement>
    */
    private static getImgPromise;
}
/**图片的基本配置 */
export interface Image<I = any> {
    /**图片唯一id */
    id?: string;
    /**图片路径 */
    url: string;
    /**图片大小(渲染的) */
    size?: [number, number];
    /**整图中截取的大小 */
    sizeo?: [number, number];
    /**整图中的位置X左边(css中的定位取正数) */
    posX?: number;
    /**整图中的位置Y上(css中的定位取正数) */
    posY?: number;
    /**图片中心左偏移位置大小(与position定位相同) */
    left?: number;
    /**图片中心上偏移位置大小(与position定位相同) */
    top?: number;
    /**图片旋转角度 */
    rotate?: number;
    /**透明度 */
    alpha?: number;
    /**为true时图片隐藏不绘制也象征着事件不响应 */
    ifHide?: boolean;
    /**绘制层级，大于0在上，小于0在下 */
    index?: number;
    /**自定义信息，通过该信息可决定图片是否显示或其他情况 */
    info?: I;
}
/**canvas渲染的图片类 @template I 标识该图片携带的info的类型，事件响应时将挂载在MapEventResponse的info上 */
export type CanvasImage<I = any> = Image<I> & CanvasPosition;
