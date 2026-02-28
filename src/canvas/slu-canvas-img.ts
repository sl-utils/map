export class SLUCanvasImg {
    /**图片的缓存 */
    static readonly ImageCache: { [key: string]: HTMLImageElement } = Object.create(null);
    /**加载需要提前加载的异步图片，保证图片层级正确 */
    public static loadImg(urls: string[] = ['/assets/images/map/map_selected.png']) {
        urls.forEach((url) => this.getImgPromise(url));
    }
    /**绘制图片,默认图片中心点 */
    public static async drawImg(img: SLTCanvas.Image, ctx: CanvasRenderingContext2D): Promise<void> {
        if (img.ifHide === true) return;
        let { point, points = [], size = [0, 0], url, sizeo, posX = 0, posY = 0, left = 0, top = 0, rotate = 0, alpha = 1 } = img;
        let sizeX: number = size[0],
            sizeY: number = size[1],
            sizeOX = sizeo && sizeo[0],
            sizeOY = sizeo && sizeo[1];
        let imgEle = this.ImageCache[url] || (await this.getImgPromise(url));
        if (point) points = [...points, point];
        for (let i = 0; i < points.length; i++) {
            const e = points[i],
                x = e[0],
                y = e[1];
            rotate = (rotate * Math.PI) / 180;
            ctx.globalAlpha = alpha;
            ctx.setTransform(1, 0, 0, 1, x, y);
            ctx.rotate(rotate);
            if (sizeOX && sizeOY) {
                /**-sizeX/2 和-sizeY/2确定了图片的中心位置在x,y点 */
                ctx.drawImage(imgEle, posX, posY, sizeOX, sizeOY, -sizeX / 2 + left, -sizeY / 2 + top, sizeX, sizeY);
            } else {
                /**-sizeX/2 和-sizeY/2确定了图片的中心位置在x,y点 */
                ctx.drawImage(imgEle, -sizeX / 2 + left, -sizeY / 2 + top, sizeX, sizeY);
            }
            ctx.rotate(-rotate);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
    }
    /**根据图片路径地址，获取图片后缓存 , 避免重复请求
    * @param url 图片路径
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