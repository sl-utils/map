import { u_mapGetPointsByLatlngs } from "../utils/slu-map";
import { SLUCanvas } from "../canvas/slu-canvas";
import { SLUCanvasImg } from "../canvas/slu-canvas-img";

const ARROW_URL = "/assets/images/direction-arrow.png";
export class MapCanvasArrowLine {
  constructor(private map: AMAP.Map | L.Map, private ctx: CanvasRenderingContext2D, public animeLineOpt?: SLPMap.ArrowLine) {
    this.animeLineOpt = Object.assign({}, this.defaultOption, this.animeLineOpt);
    this.initResource();
  }
  private readonly defaultOption: SLPMap.ArrowLine = {
    lineWidth: 16,
    // 默认每帧移动.5px
    speed: 0.5,
    imgUrl: ARROW_URL,
    partialHeight: 16,
    partialSpace: 2,
    partialWidth: 16,
    fillColor: 'rgb(41, 152, 137)',
    strokeColor: 'rgb(179, 218, 255)',
    degree: 1,
  };
  private get imgUrl() {
    return this.animeLineOpt.imgUrl;
  }
  private get patternBound() {
    return [this.animeLineOpt.partialWidth, this.animeLineOpt.partialHeight];
  }

  private initResource() {
    SLUCanvasImg.loadImg([this.imgUrl]);
  }
  private allLines: MapLine[] = [];
  /**每组线的动画偏移变量暂存 */
  private offset: number = 0;
  private allPoints: [number, number][][] = [];
  public setAllLines(lines: MapLine[]) {
    this.allLines = lines;
    this.update();
  }
  public update() {
    this.allPoints = this.allLines.map((line) => {
      const { latlngs = [], latlng = [] } = line;
      if (latlng.length) {
        latlngs.push(latlng);
      }
      return u_mapGetPointsByLatlngs(this.map, latlngs);
    });
    this.draw();
  }
  private visiblePoint(point: [number, number], range: [number, number]) {
    const [x, y] = point,
      [w, h] = range;
    if (x < 0 || y < 0) {
      return false;
    } else if (x > w || y > h) {
      return false;
    }
    return true;
  }

  /**
   * 线段连线方向
   * @param point1
   * @param point2
   * @returns
   */
  private directionLine(point1: [number, number], point2: [number, number]) {
    const [x1, y1] = point1;
    const [x2, y2] = point2;
    if (x1 == x2 && y1 > y2) return "top";
    if (x1 == x2 && y1 < y2) return "bottom";
    if (y1 == y2 && x1 > x2) return "left";
    if (y1 == y2 && x1 < x2) return "right";
    if (x1 > x2 && y1 > y2) return "topleft";
    if (x1 > x2 && y1 < y2) return "bottomleft";
    if (x1 < x2 && y1 > y2) return "topright";
    if (x1 < x2 && y1 < y2) return "bottomright";
    return "undefined";
  }
  /**
   * 不在画布范围内修改起始点 减少生成过多粒子
   * @returns
   */
  private validLine(points: [[number, number], [number, number]]): false | [[number, number], [number, number]] {
    const { width, height } = this.ctx.canvas;
    // 起始点在画布内
    const pv1 = this.visiblePoint(points[0], [width, height]);
    // 终止点在画布内
    const pv2 = this.visiblePoint(points[1], [width, height]);
    /**起始点到终止点的方向 */
    const dir = this.directionLine(points[0], points[1]);
    let [x1, y1] = points[0];
    let [x2, y2] = points[1];
    if (!pv1 || !pv2) {
      // 处理边界
      if (y1 == y2) {
        if (y1 < 0 || y1 > height) {
          return false;
        }
        // canvas width 与y 轴交点
        if (pv1 && !pv2) {
          // p1 合法 p2 超边界
          x2 = dir == "right" ? width : 0;
        } else if (pv2 && !pv1) {
          // p2 合法 p1超边界
          x1 = dir == "right" ? 0 : width;
        } else {
          // 都非法
          if ((dir == "right" && (x1 >= width || x2 <= 0)) || (dir == "left" && (x1 <= 0 || x2 >= width))) {
            return false;
          }
          x1 = dir == "right" ? 0 : width;
          x2 = dir == "right" ? width : 0;
        }
      } else if (x1 == x2) {
        if (x1 < 0 || x1 > width) {
          return false;
        }
        // canvas width 与x 轴交点
        if (pv1 && !pv2) {
          // p1 合法 p2 超边界
          y2 = dir == "top" ? 0 : height;
        } else if (pv2 && !pv1) {
          // p2 合法 p1超边界
          y1 = dir == "top" ? height : 0;
        } else {
          // 都非法
          if ((dir == "top" && (y1 <= 0 || y2 >= height)) || (dir == "bottom" && (y1 >= height || y2 <= 0))) {
            return false;
          }
          y1 = dir == "top" ? height : 0;
          y2 = dir == "top" ? 0 : height;
        }
      } else {
        /**起始点构成的直线 */
        const k = (y2 - y1) / (x2 - x1);
        /**y轴交点 */
        const b = y1 - k * x1;
        // 与上边界 (y = 0) 交点
        const xIntersectTop = -b / k;
        // 与下边界 (y = height) 交点
        const xIntersectBottom = (height - b) / k;
        // 与左边界 (x = 0) 交点
        const yIntersectLeft = b;
        // 与右边界 (x = width) 交点
        const yIntersectRight = k * width + b;
        if (pv1) {
          // 起始点在画布内连线
          switch (dir) {
            case "topleft":
              // 要么和y=0直线交点 要么和 x=0 的垂线交点
              [x2, y2] = xIntersectTop >= 0 && xIntersectTop <= width ? [xIntersectTop, 0] : [0, yIntersectLeft];
              break;
            case "topright":
              // 要么和y=height直线交点 要么和 x=width 的垂线交点
              [x2, y2] = xIntersectTop >= 0 && xIntersectTop <= width ? [xIntersectTop, 0] : [width, yIntersectRight];
              break;
            case "bottomleft":
              // 要么和y=height直线交点 要么和 x=0 的垂线交点
              [x2, y2] = xIntersectBottom >= 0 && xIntersectBottom <= width ? [xIntersectBottom, height] : [0, yIntersectLeft];
              break;
            case "bottomright":
              // 要么和y=0直线交点 要么和 x=width 的垂线交点
              [x2, y2] = xIntersectBottom >= 0 && xIntersectBottom <= width ? [xIntersectBottom, height] : [width, yIntersectRight];
              break;
            default:
              return false;
          }
        } else if (pv2) {
          // 终止点在画布内连线
          switch (dir) {
            case "topleft":
              // 要么和y=0直线交点 要么和 x=width 的垂线交点
              [x1, y1] = xIntersectBottom >= 0 && xIntersectBottom <= width ? [xIntersectBottom, height] : [width, yIntersectRight];
              break;
            case "topright":
              // 要么和y=height直线交点 要么和 x=0 的垂线交点
              [x1, y1] = xIntersectBottom >= 0 && xIntersectBottom <= width ? [xIntersectBottom, height] : [0, yIntersectLeft];
              break;
            case "bottomleft":
              // 要么和y=height直线交点 要么和 x=width 的垂线交点
              [x1, y1] = xIntersectTop >= 0 && xIntersectTop <= width ? [xIntersectTop, 0] : [width, yIntersectRight];
              break;
            case "bottomright":
              // 要么和y=0直线交点 要么和 x=0 的垂线交点
              [x1, y1] = xIntersectTop >= 0 && xIntersectTop <= width ? [xIntersectTop, 0] : [0, yIntersectLeft];
              break;
            default:
              return false;
          }
        } else {
          // 都不在画布内 需判断中间点
          // 计算是否合法与画布交点
          // 需排除延长线的交点
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
          // 中间线的交点也需要在画布内
          if (!this.visiblePoint([x1, y1], [width, height]) || !this.visiblePoint([x2, y2], [width, height])) {
            return false;
          }
        }
      }
    }
    return [[x1, y1], [x2, y2]]
  }
  /**
   * 获取二次贝塞尔曲线划分任意点位置
   * @param {number} t 当前百分比
   * @param {Array} p1 起点坐标
   * @param {Array} cp 控制点
   * @param {Array} p2 终点坐标
   */
  private getQuadraticBezierPoint(t: number, p1: [number, number], cp: [number, number], p2: [number, number]): [number, number] {
    const [x1, y1] = p1;
    const [cx, cy] = cp;
    const [x2, y2] = p2;
    let x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2;
    let y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
    return [x, y];
  }
  public draw() {
    const that = this,
      { ctx, animeLineOpt } = that,
      { isBezier, degree = 1, speed, partialWidth, partialSpace } = animeLineOpt;
    ctx.save();
    this.patternPathInit();
    ctx.lineCap = "round";
    ctx.lineWidth = animeLineOpt.lineWidth;
    for (let i = 0; i < this.allPoints.length; i++) {
      let validPoints = this.getValidPoints(this.allPoints[i]);
      if (isBezier) {
        for (let j = 1; j < this.allPoints[i].length; j++) {
          const bezierPoints: [number, number][] = [];
          let prev = this.allPoints[i][j - 1];
          let cur = this.allPoints[i][j];
          const ctrl = SLUCanvas.getBezierCtrlPoint(prev, cur, degree);
          const maxSlice = 50;
          const lineLen = Math.sqrt(Math.pow(prev[0] - cur[0], 2) + Math.pow(prev[1] - cur[1], 2));
          const sliceCount = Math.floor(maxSlice * (lineLen / this.ctx.canvas.width)) || 1;
          for (let i = 0; i <= sliceCount; i++) {
            const bezierP = this.getQuadraticBezierPoint(i / sliceCount, prev, ctrl, cur);
            bezierPoints.push(bezierP);
          }
          let validPoints = this.getValidPoints(bezierPoints);
          if (validPoints.length < 2) continue;
          for (let i = 0; i < validPoints.length; i += 2) {
            this.drawPath([validPoints[i], validPoints[i + 1]]);
          }
        }
      } else {
        if (validPoints.length < 2) continue;
        for (let i = 0; i < validPoints.length; i += 2) {
          this.drawPath([validPoints[i], validPoints[i + 1]]);
        }
      }
    }
    ctx.restore();
    this.offset += speed;
    this.offset >= partialWidth + partialSpace ? (this.offset = 0) : null;
  }
  private getValidPoints(points: [number, number][]) {
    let validPoints = [];
    let prev = points[0];
    for (let j = 1; j < points.length; j++) {
      const validPoint = this.validLine([prev, points[j]]);
      prev = points[j];
      if (validPoint) {
        validPoints.push(validPoint[0], validPoint[1]);
      }
    }
    return validPoints;
  }
  private drawPath(points: [number, number][]) {
    const that = this,
      { ctx, animeLineOpt } = that,
      { speed = 0.1, partialWidth } = animeLineOpt;
    let prev = points[0];
    ctx.save();
    ctx.beginPath();
    ctx.translate(prev[0], prev[1]);
    ctx.moveTo(0, 0);
    for (let j = 1; j < points.length; j++) {
      const cur = points[j];
      prev = points[j - 1];
      ctx.lineTo(cur[0] - prev[0], cur[1] - prev[1]);
      if (j > 0) {
        ctx.save();
        const degree = Math.atan2(cur[1] - prev[1], cur[0] - prev[0]);
        ctx.rotate(degree);
        // 改变全局画布原点进行移动 图案相对位置都是画布的左上角
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
  private patternPathInit() {
    const pattern = this.createPattern();
    if (!pattern) {
      this.ctx.strokeStyle = this.animeLineOpt.strokeColor;
      this.ctx.fillStyle = this.animeLineOpt.fillColor;
      return;
    }
    this.ctx.strokeStyle = pattern;
  }
  private createPattern() {
    const {strokeColor, fillColor, partialSpace} = this.animeLineOpt
    const img = SLUCanvasImg.ImageCache[this.imgUrl];
    if (!img) return null;
    const [width, height] = this.patternBound;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    //  图案组成动画通过统一把线条方向改为平行x轴方向，当前素材箭头是正上 导致需要对图案翻转90度以及取高度为offset偏移归零点
    canvas.width = width;
    canvas.height = height + partialSpace;
    ctx.fillStyle =  fillColor;
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
