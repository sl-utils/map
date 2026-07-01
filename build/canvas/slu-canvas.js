import { u_deepMergeOpt } from "../utils";
export class SLUCanvas {
    constructor() { }
    static drawArc(arc, ctx = this.ctx) {
        if (arc.ifHide === true)
            return this;
        let { point, points = [], size = 10 } = arc;
        if (point) {
            points.length ? points.push(point) : points = [point];
        }
        this.setCtxPara(ctx, arc);
        for (let i = 0, len = points.length; i < len; i++) {
            ctx.beginPath();
            const [x, y] = points[i] || [0, 0];
            ctx.arc(x, y, size, 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.globalAlpha = arc.fillAlpha ?? 1;
            ctx.fill();
        }
        this.setCtxPara(ctx);
        return this;
    }
    static drawRect(rect, ctx = this.ctx) {
        if (rect.ifHide === true)
            return this;
        let { point, points = [], width = 0, height = 0, radius = [0, 0, 0, 0] } = rect;
        if (point) {
            points.length ? points.push(point) : points = [point];
        }
        this.setCtxPara(ctx, rect);
        for (let i = 0, len = points.length; i < len; i++) {
            const [x, y] = points[i] || [0, 0];
            ctx.beginPath();
            ctx['roundRect'](x, y, width, height, radius);
            ctx.stroke();
            ctx.globalAlpha = rect.fillAlpha ?? 1;
            ctx.fill();
            ctx.closePath();
        }
        this.setCtxPara(ctx);
        return this;
    }
    static drawPolygon(polygon, ctx = this.ctx) {
        const { points = [] } = polygon;
        if (polygon.ifHide === true || points.length < 2)
            return this;
        this.setCtxPara(ctx, polygon);
        for (let i = 0, len = points.length; i < len; i++) {
            const [x, y] = points[i] || [0, 0];
            if (i == 0) {
                ctx.beginPath();
                ctx.moveTo(x, y);
            }
            else if (i == len - 1) {
                ctx.lineTo(x, y);
                ctx.closePath();
                ctx.globalAlpha = polygon.fillAlpha ?? 1;
                ctx.fill();
                if (ctx.lineWidth > 0) {
                    ctx.globalAlpha = polygon.alpha ?? 1;
                    ctx.stroke();
                }
            }
            else {
                ctx.lineTo(x, y);
            }
        }
        this.setCtxPara(ctx);
        return this;
    }
    static drawLine(line, ctx = this.ctx) {
        if (line.ifHide === true)
            return this;
        const { points = [] } = line;
        if (points.length < 2)
            return this;
        this.setCtxPara(ctx, line);
        const [x0, y0] = points[0] || [0, 0], lineWidth = line.widthLine || 1;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        for (let i = 1, len = points.length; i < len; i++) {
            const [x, y] = points[i] || [0, 0];
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        this.setCtxPara(ctx);
        return this;
    }
    static drawBezierLine(line, ctx = this.ctx) {
        if (line.ifHide === true)
            return this;
        const { points = [] } = line;
        if (points.length < 2)
            return this;
        this.setCtxPara(ctx, line);
        const [x0, y0] = points[0] || [0, 0], degree = line.degree ?? 1;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        for (let i = 1, len = points.length; i < len; i++) {
            let [sx, sy] = points[i - 1], [ex, ey] = points[i];
            let [cpx, cpy] = this.getBezierCtrlPoint([sx, sy], [ex, ey], degree);
            ctx.quadraticCurveTo(cpx, cpy, ex, ey);
        }
        ctx.stroke();
        this.setCtxPara(ctx);
        return this;
    }
    static createCanvas() {
        return document.createElement('canvas');
    }
    static getBezierCtrlPoint(s, e, degree = 1) {
        const e0 = s, e1 = e, cx = (e0[0] + e1[0]) / 2, cy = (e0[1] + e1[1]) / 2, d = degree;
        let x = cx - e0[0], y = cy - e0[1];
        let len = Math.sqrt(x * x + y * y);
        if (len === 0)
            return [cx, cy];
        let angle = Math.PI / 2 - Math.asin(y / len);
        let xd = d * Math.cos(angle) * len, yd = (d * Math.sin(angle) * len * x) / Math.abs(x);
        xd = isNaN(xd) ? 0 : xd;
        yd = isNaN(yd) ? 0 : yd;
        let curve = [cx + xd, cy - yd];
        return curve;
    }
    static setCtxPara(ctx, fig = {}) {
        this.ctx = ctx;
        this.deletePara(fig);
        fig = u_deepMergeOpt(this.ctxFig, fig);
        ctx.globalAlpha = fig.alpha;
        ctx.globalCompositeOperation = fig.globalCompositeOperation;
        ctx.fillStyle = fig.colorFill;
        ctx.strokeStyle = fig.colorLine;
        ctx.lineWidth = fig.widthLine;
        ctx.shadowColor = fig.shadowColor;
        ctx.shadowBlur = fig.shadowBlur;
        ctx.font = fig.font;
        ctx.textBaseline = fig.textBaseline;
        ctx.setLineDash(fig.dash);
        ctx.lineDashOffset = fig.dashOff;
        return ctx;
    }
    static deletePara(obj = {}) {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const ele = obj[key];
                if (ele === undefined || ele === null) {
                    Reflect.deleteProperty(obj, key);
                }
            }
        }
    }
}
SLUCanvas.ctxFig = {
    alpha: 1,
    fillAlpha: 1,
    colorFill: '#EE3434',
    colorLine: '#FFFFFF',
    shadowColor: '#000000',
    shadowBlur: 0,
    widthLine: 1,
    dash: [10, 0],
    dashOff: 0,
    font: '14px serif',
    textBaseline: "top",
    globalCompositeOperation: 'source-over',
};
//# sourceMappingURL=slu-canvas.js.map