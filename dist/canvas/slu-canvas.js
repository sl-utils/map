"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLUCanvas = void 0;
class SLUCanvas {
    constructor() { }
    static drawArc(arc, ctx = this.ctx) {
        if (arc.ifHide === true)
            return this;
        let { point, points = [], size = 10 } = arc;
        if (point)
            points = [...points, point];
        this.setCtxPara(ctx, arc);
        for (let i = 0, len = points.length; i < len; i++) {
            ctx.beginPath();
            const e = points[i];
            ctx.arc(e[0], e[1], size, 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.globalAlpha = arc.fillAlpha == undefined ? 1 : arc.fillAlpha;
            ctx.fill();
        }
        this.setCtxPara(ctx);
        return this;
    }
    static drawRect(rect, ctx = this.ctx) {
        if (rect.ifHide === true)
            return this;
        let { point, points = [point], width = 0, height = 0, radius = [0, 0, 0, 0] } = rect;
        this.setCtxPara(ctx, rect);
        for (let i = 0; i < points.length; i++) {
            let [x, y] = points[i] || [0, 0];
            ctx.beginPath();
            ctx['roundRect'](x, y, width, height, radius);
            ctx.stroke();
            ctx.globalAlpha = rect.fillAlpha == undefined ? 1 : rect.fillAlpha;
            ctx.fill();
            ctx.closePath();
        }
        this.setCtxPara(ctx);
        return this;
    }
    static drawPolygon(rect, ctx = this.ctx) {
        let { points = [] } = rect;
        if (rect.ifHide === true || points.length < 2)
            return this;
        this.setCtxPara(ctx, rect);
        for (let i = 0, len = points.length; i < len; i++) {
            let [x, y] = points[i];
            if (i == 0) {
                ctx.beginPath();
                ctx.moveTo(x, y);
            }
            else if (i == len - 1) {
                ctx.lineTo(x, y);
                ctx.closePath();
                ctx.globalAlpha = rect.fillAlpha == undefined ? 1 : rect.fillAlpha;
                ctx.fill();
                if (ctx.lineWidth > 0) {
                    ctx.globalAlpha = rect.alpha || 1;
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
        let { points = [] } = line;
        if (points.length < 2)
            return this;
        this.setCtxPara(ctx, line);
        let s = points[0] || [], lineWidth = line.widthLine || 1;
        ctx.beginPath();
        ctx.moveTo(s[0], s[1]);
        for (let i = 1, len = points.length; i < len; i++) {
            let point = points[i];
            ctx.lineTo(point[0], point[1]);
        }
        ctx.stroke();
        this.setCtxPara(ctx);
        return this;
    }
    static drawBezierLine(line, ctx = this.ctx) {
        if (line.ifHide === true)
            return this;
        let { points = [] } = line;
        if (points.length < 2)
            return this;
        this.setCtxPara(ctx, line);
        let s = points[0], degree = line.degree;
        ctx.beginPath();
        ctx.moveTo(s[0], s[1]);
        for (let i = 1, len = points.length; i < len; i++) {
            let s = points[i - 1], e = points[i];
            let c = this.getBezierCtrlPoint(s, e, degree);
            ctx.quadraticCurveTo(c[0], c[1], e[0], e[1]);
        }
        ctx.stroke();
        this.setCtxPara(ctx);
        return this;
    }
    static createCanvas() {
        return document.createElement('canvas');
    }
    static getBezierCtrlPoint(s, e, degree = 1) {
        const e0 = s, e1 = e, c = [(e0[0] + e1[0]) / 2, (e0[1] + e1[1]) / 2], d = degree;
        let x = c[0] - e0[0], y = c[1] - e0[1];
        let len = Math.sqrt(x * x + y * y);
        let angle = Math.PI / 2 - Math.asin(y / len);
        let xd = d * Math.cos(angle) * len, yd = (d * Math.sin(angle) * len * x) / Math.abs(x);
        xd = isNaN(xd) ? 0 : xd;
        yd = isNaN(yd) ? 0 : yd;
        let curve = [c[0] + xd, c[1] - yd];
        return curve;
    }
    static setCtxPara(ctx, fig = {}) {
        this.ctx = ctx;
        this.deletePara(fig);
        fig = Object.assign({}, this.ctxFig, fig);
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
exports.SLUCanvas = SLUCanvas;
SLUCanvas.ctxFig = {
    alpha: 1,
    widthLine: 1,
    colorLine: '#FFFFFF',
    colorFill: '#EE3434',
    dash: [10, 0],
    dashOff: 0,
    fillAlpha: 1,
    font: '14px serif',
    textBaseline: "top",
    globalCompositeOperation: 'source-over',
    shadowBlur: 0,
    shadowColor: '#000000',
};
//# sourceMappingURL=slu-canvas.js.map