import { CanvasImage } from "../types";
/**画布图片类，用于绘制图片到画布上（支持旋转、缩放、透明度、偏移、多点批量绘制） */
export class SLUCanvasImg {
    /**图片的缓存 */
    static readonly ImageCache: { [key: string]: HTMLImageElement } = Object.create(null);
    /**加载需要提前加载的异步图片，保证图片层级正确 
     * @param urls 图片路径数组
    */
    public static loadImg(urls: string[] = ['/assets/images/map/map_selected.png']): void {
        urls.forEach((url) => this.getImgPromise(url));
    }
    /**绘制图片,默认图片中心点
     * @param img 图片对象
     * @param ctx 画布上下文
     * @returns Promise<void>
     */
    public static async drawImg(img: CanvasImage, ctx: CanvasRenderingContext2D): Promise<void> {
        if (img.ifHide === true) return;
        let { point, points = [], size = [0, 0], url, sizeo, posX = 0, posY = 0, left = 0, top = 0, rotate = 0, alpha = 1 } = img;
        let sizeX: number = size[0], sizeY: number = size[1],
            sizeOX = sizeo && sizeo[0], sizeOY = sizeo && sizeo[1],
            drawX = -sizeX / 2 + left, drawY = -sizeY / 2 + top;
        let imgEle = this.ImageCache[url] || (await this.getImgPromise(url));
        if (point) points.length ? points.push(point) : (points = [point]);
        const rad = (rotate * Math.PI) / 180, cos = Math.cos(rad), sin = Math.sin(rad);
        ctx.globalAlpha = alpha;
        for (let i = 0, len = points.length; i < len; i++) {
            const [x, y] = points[i];
            ctx.save();
            ctx.setTransform(cos, sin, -sin, cos, x, y);
            if (sizeOX && sizeOY) {
                /**-sizeX/2 和-sizeY/2确定了图片的中心位置在x,y点 */
                ctx.drawImage(imgEle, posX, posY, sizeOX, sizeOY, drawX, drawY, sizeX, sizeY);
            } else {
                /**-sizeX/2 和-sizeY/2确定了图片的中心位置在x,y点 */
                ctx.drawImage(imgEle, drawX, drawY, sizeX, sizeY);
            }
            ctx.restore();
        }
    }
    /**根据图片路径地址，获取图片后缓存 , 避免重复请求
    * @param url 图片路径
    * @returns Promise<HTMLImageElement>
    */
    private static getImgPromise(url: string): Promise<HTMLImageElement> {
        let img = this.ImageCache[url];
        if (!img) {
            return new Promise((resolve, reject) => {
                let img = new Image();
                img.onload = () => {
                    this.ImageCache[url] = img;
                    resolve(img);
                };
                img.src = `${url}`;
            });
        }
        return Promise.resolve(img);
    }
}