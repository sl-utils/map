"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLUCanvasText = void 0;
const txt_1 = require("../utils/txt");
const slu_canvas_1 = require("./slu-canvas");
class SLUCanvasText {
    static drawText(info, textRects = [], ctx = this.ctx) {
        let { text = '', maxWidth = 0, font = ctx.font, ifHide } = info;
        if (ifHide === true || !text)
            return null;
        this.ctx = ctx;
        slu_canvas_1.SLUCanvas.setCtxPara(ctx, info);
        const texts = this.wordWrap(text, maxWidth, font);
        const textRect = this.calcTextRect(texts, info);
        const ctr = this.avoidOverlap(info, textRect, textRects);
        this.renderTexts(info, texts, textRect, textRects, ctr, ctx);
    }
    static wordWrap(text, max, font, ctx = this.ctx) {
        let strs = text.split('\n').filter(e => e != '');
        if (max <= 0)
            return strs;
        let texts = [];
        strs.forEach((text) => {
            texts.push(...(0, txt_1.u_TextSplitMultilineText)(ctx, text, font, max, true, (str) => {
                return [str.lastIndexOf(',') + 1];
            }));
        });
        return texts;
    }
    static calcTextRect(texts, info, ctx = this.ctx) {
        let { point = [20, 20], panel = {}, lineHeight, textAlign, px = 0, py = 0 } = info;
        let w = 0, h = 0, [x0, y0] = point;
        let { actualBoundingBoxDescent = 0 } = ctx.measureText('M');
        h = (lineHeight || actualBoundingBoxDescent) * texts.length;
        w = Math.max(...texts.map(text => ctx.measureText(text).width));
        const { pl = 0, pr = pl, pt = 0, pb = pt } = panel;
        let width = w + pl + pr, height = h + pt + pb;
        if (textAlign === 'center')
            x0 -= width / 2;
        if (textAlign === 'right')
            x0 -= width;
        let textRect = {
            x: x0 + px,
            y: y0 + py,
            width: width,
            height: height
        };
        return textRect;
    }
    static avoidOverlap(info, rect, rects) {
        const { x, y, width = 0, height = 0 } = rect, { overlap, textAlign } = info, { type = "show", querySpace = 1, maxDistance = 200, minSpacing = 0 } = overlap || {};
        if (type === 'show')
            return [0, 0, 8];
        let ifOverlap = this.isTextOverlap(rect, rects);
        if (type === 'hide') {
            if (ifOverlap)
                return [0, 0, 9];
            return [0, 0, 8];
        }
        if (!ifOverlap) {
            return [0, 0, 8];
        }
        else {
            let flag = false;
            for (let total = 0; total <= maxDistance; total += querySpace) {
                for (let dir = 0; dir < 8; dir++) {
                    const dirX = dir % 4 === 0 ? 0 : dir < 4 ? 1 : -1, dirY = (dir == 2 || dir == 6) ? 0 : dir < 2 || dir > 6 ? -1 : 1;
                    let px = total * dirX - (dirX < 0 ? width : 0), py = total * dirY - (dirY < 0 ? height : 0);
                    if (!this.isTextOverlap({ x: x + px, y: y + py, width, height }, rects, minSpacing)) {
                        return [px, py, dir];
                    }
                }
            }
        }
        return [0, 0, 9];
    }
    static renderTexts(info, texts, rect, textRects, ctr, ctx) {
        const [px, py, status] = ctr, { panel = {}, overlap = {}, textAlign = 'center', px: upx = 0, py: upy = 0, point = [0, 0] } = info, { pl = 0, pt = 0, pb = pt, pr = pl } = panel, { line } = overlap, { width = 0, height = 0 } = rect, [x0, y0] = point;
        if (status === 9)
            return;
        rect.x += px, rect.y += py;
        textRects.push({ ...rect });
        if (px != 0 || py != 0 && line) {
            let { x: x1, y: y1 } = rect;
            switch (status) {
                case 0:
                    x1 = x1, y1 = y1 + height;
                    break;
                case 1:
                    x1 = x1, y1 = y1 + height;
                    break;
                case 2:
                    x1 = x1, y1 = y1;
                    break;
                case 3:
                    x1 = x1, y1 = y1;
                    break;
                case 4:
                    x1 = x1, y1 = y1;
                    break;
                case 5:
                    x1 = x1 + width, y1 = y1;
                    break;
                case 6:
                    x1 = x1 + width, y1 = y1;
                    break;
                case 7:
                    x1 = x1 + width, y1 = y1 + height;
                    break;
            }
            slu_canvas_1.SLUCanvas.drawLine({ ...line, points: [[x0, y0], [x1, y1]] }, ctx);
        }
        if (panel) {
            slu_canvas_1.SLUCanvas.drawRect({
                point: [rect.x, rect.y],
                width: rect.width,
                height: rect.height,
                radius: panel.radius,
                ...panel,
            }, ctx);
        }
        slu_canvas_1.SLUCanvas.setCtxPara(ctx, info);
        this.renderMultiText(texts, [rect.x + pl, rect.y + pt], info, ctx);
        slu_canvas_1.SLUCanvas.setCtxPara(ctx);
    }
    static renderMultiText(texts, start, info, ctx) {
        let [x, y] = start;
        const { lineHeight, ifShadow } = info;
        let { actualBoundingBoxDescent } = ctx.measureText('M');
        texts.forEach(text => {
            let fontTop = lineHeight && lineHeight > actualBoundingBoxDescent ? (lineHeight - actualBoundingBoxDescent) / 2 : 0;
            let dH = lineHeight || actualBoundingBoxDescent;
            if (ifShadow)
                ctx.strokeText(text, x, y + fontTop);
            ctx.fillText(text, x, y + fontTop);
            y += dH;
        });
    }
    static isTextOverlap(rect, rects, minSpacing = 0) {
        for (const eRect of rects) {
            const { x, y, width = 0, height = 0 } = rect;
            const { x: ex, y: ey = 0, width: ew = 0, height: eh = 0 } = eRect;
            if (!(ex > x + width + minSpacing || ex + ew + minSpacing < x || ey > y + height + minSpacing || ey + eh + minSpacing < y)) {
                return true;
            }
        }
        return false;
    }
}
exports.SLUCanvasText = SLUCanvasText;
//# sourceMappingURL=slu-canvas-text.js.map