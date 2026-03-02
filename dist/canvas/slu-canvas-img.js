"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLUCanvasImg = void 0;
class SLUCanvasImg {
    static loadImg(urls = ['/assets/images/map/map_selected.png']) {
        urls.forEach((url) => this.getImgPromise(url));
    }
    static async drawImg(img, ctx) {
        if (img.ifHide === true)
            return;
        let { point, points = [], size = [0, 0], url, sizeo, posX = 0, posY = 0, left = 0, top = 0, rotate = 0, alpha = 1 } = img;
        let sizeX = size[0], sizeY = size[1], sizeOX = sizeo && sizeo[0], sizeOY = sizeo && sizeo[1];
        let imgEle = this.ImageCache[url] || (await this.getImgPromise(url));
        if (point)
            points = [...points, point];
        for (let i = 0; i < points.length; i++) {
            const e = points[i], x = e[0], y = e[1];
            rotate = (rotate * Math.PI) / 180;
            ctx.globalAlpha = alpha;
            ctx.setTransform(1, 0, 0, 1, x, y);
            ctx.rotate(rotate);
            if (sizeOX && sizeOY) {
                ctx.drawImage(imgEle, posX, posY, sizeOX, sizeOY, -sizeX / 2 + left, -sizeY / 2 + top, sizeX, sizeY);
            }
            else {
                ctx.drawImage(imgEle, -sizeX / 2 + left, -sizeY / 2 + top, sizeX, sizeY);
            }
            ctx.rotate(-rotate);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
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
exports.SLUCanvasImg = SLUCanvasImg;
SLUCanvasImg.ImageCache = Object.create(null);
//# sourceMappingURL=slu-canvas-img.js.map