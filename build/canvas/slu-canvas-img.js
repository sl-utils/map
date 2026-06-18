export class SLUCanvasImg {
    static loadImg(urls = ['/assets/images/map/map_selected.png']) {
        urls.forEach((url) => this.getImgPromise(url));
    }
    static async drawImg(img, ctx) {
        if (img.ifHide === true)
            return;
        let { point, points = [], size = [0, 0], url, sizeo, posX = 0, posY = 0, left = 0, top = 0, rotate = 0, alpha = 1 } = img;
        let sizeX = size[0], sizeY = size[1], sizeOX = sizeo && sizeo[0], sizeOY = sizeo && sizeo[1], drawX = -sizeX / 2 + left, drawY = -sizeY / 2 + top;
        let imgEle = this.ImageCache[url] || (await this.getImgPromise(url));
        if (point)
            points.length ? points.push(point) : (points = [point]);
        const rad = (rotate * Math.PI) / 180, cos = Math.cos(rad), sin = Math.sin(rad);
        ctx.globalAlpha = alpha;
        for (let i = 0, len = points.length; i < len; i++) {
            const [x, y] = points[i];
            ctx.save();
            ctx.setTransform(cos, sin, -sin, cos, x, y);
            if (sizeOX && sizeOY) {
                ctx.drawImage(imgEle, posX, posY, sizeOX, sizeOY, drawX, drawY, sizeX, sizeY);
            }
            else {
                ctx.drawImage(imgEle, drawX, drawY, sizeX, sizeY);
            }
            ctx.restore();
        }
    }
    static getImgPromise(url) {
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
SLUCanvasImg.ImageCache = Object.create(null);
//# sourceMappingURL=slu-canvas-img.js.map