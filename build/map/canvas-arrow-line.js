import { u_deepMergeOpt, u_mapGetPointsByLnglats } from "../utils/slu-map";
import { SLUCanvas } from "../canvas/slu-canvas";
import { SLUCanvasImg } from "../canvas/slu-canvas-img";
const ARROW_URL = "/assets/images/direction-arrow.png";
export class MapCanvasArrowLine {
    constructor(map, ctx, opt) {
        this.map = map;
        this.ctx = ctx;
        this.options = {
            lineWidth: 16,
            speed: 0.5,
            partialHeight: 16,
            partialSpace: 2,
            partialWidth: 16,
            degree: 1,
            fillColor: 'rgb(41, 152, 137)',
            strokeColor: 'rgb(179, 218, 255)',
            imgUrl: ARROW_URL,
        };
        this.allLines = [];
        this.offset = 0;
        this.allPoints = [];
        this.opt = opt ? u_deepMergeOpt(this.options, opt) : this.options;
        this.initResource();
    }
    get imgUrl() {
        return this.opt.imgUrl;
    }
    get partialWidth() {
        return this.opt.partialWidth;
    }
    get partialHeight() {
        return this.opt.partialHeight;
    }
    get patternBound() {
        return [this.opt.partialWidth, this.opt.partialHeight];
    }
    initResource() {
        SLUCanvasImg.loadImg([this.imgUrl]);
    }
    setAllLines(lines) {
        this.allLines = lines;
        this.update();
    }
    update() {
        this.allPoints = this.allLines.map((line) => {
            const { lnglats = [], lnglat = [] } = line;
            if (lnglat.length) {
                lnglats.push(lnglat);
            }
            return u_mapGetPointsByLnglats(this.map, lnglats);
        });
        this.draw();
    }
    visiblePoint(point, range) {
        const [x, y] = point, [w, h] = range;
        if (x < 0 || y < 0) {
            return false;
        }
        else if (x > w || y > h) {
            return false;
        }
        return true;
    }
    directionLine(point1, point2) {
        const [x1, y1] = point1;
        const [x2, y2] = point2;
        if (x1 == x2 && y1 > y2)
            return "top";
        if (x1 == x2 && y1 < y2)
            return "bottom";
        if (y1 == y2 && x1 > x2)
            return "left";
        if (y1 == y2 && x1 < x2)
            return "right";
        if (x1 > x2 && y1 > y2)
            return "topleft";
        if (x1 > x2 && y1 < y2)
            return "bottomleft";
        if (x1 < x2 && y1 > y2)
            return "topright";
        if (x1 < x2 && y1 < y2)
            return "bottomright";
        return "undefined";
    }
    validLine(points) {
        const { width, height } = this.ctx.canvas;
        const pv1 = this.visiblePoint(points[0], [width, height]);
        const pv2 = this.visiblePoint(points[1], [width, height]);
        const dir = this.directionLine(points[0], points[1]);
        let [x1, y1] = points[0];
        let [x2, y2] = points[1];
        if (!pv1 || !pv2) {
            if (y1 == y2) {
                if (y1 < 0 || y1 > height) {
                    return false;
                }
                if (pv1 && !pv2) {
                    x2 = dir == "right" ? width : 0;
                }
                else if (pv2 && !pv1) {
                    x1 = dir == "right" ? 0 : width;
                }
                else {
                    if ((dir == "right" && (x1 >= width || x2 <= 0)) || (dir == "left" && (x1 <= 0 || x2 >= width))) {
                        return false;
                    }
                    x1 = dir == "right" ? 0 : width;
                    x2 = dir == "right" ? width : 0;
                }
            }
            else if (x1 == x2) {
                if (x1 < 0 || x1 > width) {
                    return false;
                }
                if (pv1 && !pv2) {
                    y2 = dir == "top" ? 0 : height;
                }
                else if (pv2 && !pv1) {
                    y1 = dir == "top" ? height : 0;
                }
                else {
                    if ((dir == "top" && (y1 <= 0 || y2 >= height)) || (dir == "bottom" && (y1 >= height || y2 <= 0))) {
                        return false;
                    }
                    y1 = dir == "top" ? height : 0;
                    y2 = dir == "top" ? 0 : height;
                }
            }
            else {
                const k = (y2 - y1) / (x2 - x1);
                const b = y1 - k * x1;
                const xIntersectTop = -b / k;
                const xIntersectBottom = (height - b) / k;
                const yIntersectLeft = b;
                const yIntersectRight = k * width + b;
                if (pv1) {
                    switch (dir) {
                        case "topleft":
                            [x2, y2] = xIntersectTop >= 0 && xIntersectTop <= width ? [xIntersectTop, 0] : [0, yIntersectLeft];
                            break;
                        case "topright":
                            [x2, y2] = xIntersectTop >= 0 && xIntersectTop <= width ? [xIntersectTop, 0] : [width, yIntersectRight];
                            break;
                        case "bottomleft":
                            [x2, y2] = xIntersectBottom >= 0 && xIntersectBottom <= width ? [xIntersectBottom, height] : [0, yIntersectLeft];
                            break;
                        case "bottomright":
                            [x2, y2] = xIntersectBottom >= 0 && xIntersectBottom <= width ? [xIntersectBottom, height] : [width, yIntersectRight];
                            break;
                        default:
                            return false;
                    }
                }
                else if (pv2) {
                    switch (dir) {
                        case "topleft":
                            [x1, y1] = xIntersectBottom >= 0 && xIntersectBottom <= width ? [xIntersectBottom, height] : [width, yIntersectRight];
                            break;
                        case "topright":
                            [x1, y1] = xIntersectBottom >= 0 && xIntersectBottom <= width ? [xIntersectBottom, height] : [0, yIntersectLeft];
                            break;
                        case "bottomleft":
                            [x1, y1] = xIntersectTop >= 0 && xIntersectTop <= width ? [xIntersectTop, 0] : [width, yIntersectRight];
                            break;
                        case "bottomright":
                            [x1, y1] = xIntersectTop >= 0 && xIntersectTop <= width ? [xIntersectTop, 0] : [0, yIntersectLeft];
                            break;
                        default:
                            return false;
                    }
                }
                else {
                    switch (dir) {
                        case "topleft":
                            if (x1 <= 0 || y1 <= 0 || x2 >= width || y2 >= height) {
                                return false;
                            }
                            [x1, y1] = xIntersectBottom >= 0 && xIntersectBottom <= width ? [xIntersectBottom, height] : [width, yIntersectRight];
                            [x2, y2] = xIntersectTop >= 0 && xIntersectTop <= width ? [xIntersectTop, 0] : [0, yIntersectLeft];
                            break;
                        case "topright":
                            if (x1 >= width || y1 <= 0 || x2 <= 0 || y2 >= height) {
                                return false;
                            }
                            [x1, y1] = xIntersectBottom >= 0 && xIntersectBottom <= width ? [xIntersectBottom, height] : [0, yIntersectLeft];
                            [x2, y2] = xIntersectTop >= 0 && xIntersectTop <= width ? [xIntersectTop, 0] : [width, yIntersectRight];
                            break;
                        case "bottomleft":
                            if (x1 <= 0 || y1 >= height || x2 >= width || y2 <= 0) {
                                return false;
                            }
                            [x1, y1] = xIntersectTop >= 0 && xIntersectTop <= width ? [xIntersectTop, 0] : [width, yIntersectRight];
                            [x2, y2] = xIntersectBottom >= 0 && xIntersectBottom <= width ? [xIntersectBottom, height] : [0, yIntersectLeft];
                            break;
                        case "bottomright":
                            if (x1 >= width || y1 >= height || x2 <= 0 || y2 <= 0) {
                                return false;
                            }
                            [x1, y1] = xIntersectTop >= 0 && xIntersectTop <= width ? [xIntersectTop, 0] : [0, yIntersectLeft];
                            [x2, y2] = xIntersectBottom >= 0 && xIntersectBottom <= width ? [xIntersectBottom, height] : [width, yIntersectRight];
                            break;
                        default:
                            return false;
                    }
                    if (!this.visiblePoint([x1, y1], [width, height]) || !this.visiblePoint([x2, y2], [width, height])) {
                        return false;
                    }
                }
            }
        }
        return [[x1, y1], [x2, y2]];
    }
    getQuadraticBezierPoint(t, p1, cp, p2) {
        const [x1, y1] = p1;
        const [cx, cy] = cp;
        const [x2, y2] = p2;
        let x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2;
        let y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
        return [x, y];
    }
    draw() {
        const that = this, { ctx, opt } = that, { isBezier, degree = 1, speed, partialWidth, partialSpace } = opt;
        ctx.save();
        this.patternPathInit();
        ctx.lineCap = "round";
        ctx.lineWidth = opt.lineWidth;
        for (let i = 0, len = this.allPoints.length; i < len; i++) {
            let validPoints = this.getValidPoints(this.allPoints[i]);
            if (isBezier) {
                for (let j = 1, len2 = this.allPoints[i].length; j < len2; j++) {
                    const bezierPoints = [];
                    let prev = this.allPoints[i][j - 1];
                    let cur = this.allPoints[i][j];
                    const ctrl = SLUCanvas.getBezierCtrlPoint(prev, cur, degree);
                    const maxSlice = 50;
                    const lineLen = Math.sqrt(Math.pow(prev[0] - cur[0], 2) + Math.pow(prev[1] - cur[1], 2));
                    const sliceCount = Math.floor(maxSlice * (lineLen / ctx.canvas.width)) || 1;
                    for (let i = 0; i <= sliceCount; i++) {
                        const bezierP = this.getQuadraticBezierPoint(i / sliceCount, prev, ctrl, cur);
                        bezierPoints.push(bezierP);
                    }
                    let validPoints = this.getValidPoints(bezierPoints);
                    if (validPoints.length < 2)
                        continue;
                    for (let i = 0, len3 = validPoints.length; i < len3; i += 2) {
                        this.drawPath([validPoints[i], validPoints[i + 1]]);
                    }
                }
            }
            else {
                if (validPoints.length < 2)
                    continue;
                for (let i = 0, len4 = validPoints.length; i < len4; i += 2) {
                    this.drawPath([validPoints[i], validPoints[i + 1]]);
                }
            }
        }
        ctx.restore();
        this.offset += speed;
        this.offset >= partialWidth + partialSpace ? (this.offset = 0) : null;
    }
    getValidPoints(points) {
        let validPoints = [];
        let prev = points[0];
        for (let j = 1, len = points.length; j < len; j++) {
            const validPoint = this.validLine([prev, points[j]]);
            prev = points[j];
            if (validPoint) {
                validPoints.push(validPoint[0], validPoint[1]);
            }
        }
        return validPoints;
    }
    drawPath(points) {
        const that = this, { ctx, opt } = that, { speed = 0.1, partialWidth } = opt;
        let prev = points[0];
        ctx.save();
        ctx.beginPath();
        ctx.translate(prev[0], prev[1]);
        ctx.moveTo(0, 0);
        for (let j = 1, len = points.length; j < len; j++) {
            const cur = points[j];
            prev = points[j - 1];
            ctx.lineTo(cur[0] - prev[0], cur[1] - prev[1]);
            if (j > 0) {
                ctx.save();
                const degree = Math.atan2(cur[1] - prev[1], cur[0] - prev[0]);
                ctx.rotate(degree);
                ctx.translate(this.offset + speed, 0);
                ctx.stroke();
                ctx.translate(-this.offset - speed, 0);
                ctx.restore();
                ctx.beginPath();
                ctx.translate(-prev[0], -prev[1]);
                ctx.translate(cur[0], cur[1]);
                prev = cur;
                ctx.moveTo(0, 0);
            }
        }
        ctx.restore();
    }
    patternPathInit() {
        const pattern = this.createPattern();
        if (!pattern) {
            this.ctx.strokeStyle = this.opt.strokeColor;
            this.ctx.fillStyle = this.opt.fillColor;
            return;
        }
        this.ctx.strokeStyle = pattern;
    }
    createPattern() {
        const { strokeColor, fillColor, partialSpace } = this.opt;
        const img = SLUCanvasImg.ImageCache[this.imgUrl];
        if (!img)
            return null;
        const [width, height] = this.patternBound;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height + partialSpace;
        ctx.fillStyle = fillColor;
        ctx.fillRect(0, 0, width, height + partialSpace);
        ctx.drawImage(img, 0, partialSpace, width, height);
        const pattern = ctx.createPattern(canvas, "repeat");
        const matrix = new DOMMatrix();
        matrix.rotateSelf(90);
        matrix.translateSelf(width / 2, (height + partialSpace) / 2);
        pattern.setTransform(matrix);
        return pattern;
    }
}
//# sourceMappingURL=canvas-arrow-line.js.map