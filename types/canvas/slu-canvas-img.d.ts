import { CanvasImage } from "../types";
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
