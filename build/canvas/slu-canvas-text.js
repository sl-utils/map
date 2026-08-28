import { um_textSplitMultilineText } from '../utils/txt';
import { SLUCanvas } from './slu-canvas';
export class SLUCanvasText {
    static openDrawText() {
        this.grid.clear();
    }
    static drawText(info, ctx = this.ctx) {
        let { text = '', maxWidth = 0, font = ctx.font, ifHide } = info;
        if (ifHide === true || !text)
            return;
        this.ctx = ctx;
        SLUCanvas.setCtxPara(ctx, info);
        const texts = this.wordWrap(text, maxWidth, font);
        const textRect = this.calcTextRect(texts, info);
        const ctr = this.avoidOverlap(info, textRect);
        this.renderTexts(info, texts, textRect, ctr, ctx);
    }
    static getTextMetrics(ctx, text) {
        const key = ctx.font + '|' + text;
        let metrics = this.textMetricsCache.get(key);
        if (metrics)
            return metrics;
        metrics = ctx.measureText(text);
        if (this.textMetricsCache.size >= this.MAX_CACHE_SIZE) {
            const firstKey = this.textMetricsCache.keys().next().value;
            this.textMetricsCache.delete(firstKey);
        }
        this.textMetricsCache.set(key, metrics);
        return metrics;
    }
    static wordWrap(text, max, font, ctx = this.ctx) {
        let strs = text.split('\n').filter(e => e != '');
        if (max <= 0)
            return strs;
        let texts = [];
        strs.forEach((text) => {
            texts.push(...um_textSplitMultilineText(ctx, text, font, max, true, (str) => {
                return [str.lastIndexOf(',') + 1];
            }));
        });
        return texts;
    }
    static calcTextRect(texts, info, ctx = this.ctx) {
        let { point = [20, 20], panel = {}, lineHeight, textAlign, px = 0, py = 0 } = info;
        let w = 0, h = 0, [x0, y0] = point;
        let { actualBoundingBoxDescent = 0 } = this.getTextMetrics(ctx, 'M');
        h = (lineHeight || actualBoundingBoxDescent) * texts.length;
        w = Math.max(...texts.map(text => this.getTextMetrics(ctx, text).width));
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
    static avoidOverlap(info, rect) {
        const { x, y, width = 0, height = 0 } = rect, { overlap, textAlign } = info, { type = "show", querySpace = 1, maxDistance = 200, minSpacing = 0 } = overlap || {};
        if (type === 'show')
            return [0, 0, 8];
        let ifOverlap = this.isTextOverlap(rect, minSpacing);
        if (type === 'hide') {
            if (ifOverlap)
                return [0, 0, 9];
            return [0, 0, 8];
        }
        if (!ifOverlap) {
            return [0, 0, 8];
        }
        else {
            const dirs = [0, 4, 2, 6, 1, 3, 5, 7];
            const DIR_MAP = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
            const testRect = { x: 0, y: 0, width, height };
            for (let total = querySpace; total <= maxDistance; total += querySpace) {
                for (let i = 0, len = dirs.length; i < len; i++) {
                    const dir = dirs[i];
                    const [dirX, dirY] = DIR_MAP[dir];
                    let px = total * dirX, py = total * dirY;
                    testRect.x = x + px, testRect.y = y + py;
                    if (!this.isTextOverlap(testRect, minSpacing)) {
                        return [px, py, dir];
                    }
                }
            }
        }
        return [0, 0, 9];
    }
    static renderTexts(info, texts, rect, ctr, ctx) {
        const [px, py, status] = ctr, { panel = {}, overlap = {}, textAlign = 'center', px: upx = 0, py: upy = 0, point = [0, 0] } = info, { pl = 0, pt = 0, pb = pt, pr = pl } = panel, { line } = overlap, { width = 0, height = 0 } = rect, [x0, y0] = point;
        if (status === 9)
            return;
        rect.x += px, rect.y += py;
        this.addRect(rect);
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
            SLUCanvas.drawLine({ ...line, points: [[x0, y0], [x1, y1]] }, ctx);
        }
        if (panel && Object.keys(panel).length > 0) {
            SLUCanvas.drawRect({
                point: [rect.x, rect.y],
                width: rect.width,
                height: rect.height,
                radius: panel.radius,
                ...panel,
            }, ctx);
        }
        SLUCanvas.setCtxPara(ctx, info);
        this.renderMultiText(texts, [rect.x + pl, rect.y + pt], info, ctx);
        SLUCanvas.setCtxPara(ctx);
    }
    static renderMultiText(texts, start, info, ctx) {
        let [x, y] = start;
        const { lineHeight, ifShadow } = info;
        let { actualBoundingBoxDescent } = this.getTextMetrics(ctx, 'M');
        texts.forEach(text => {
            let fontTop = lineHeight && lineHeight > actualBoundingBoxDescent ? (lineHeight - actualBoundingBoxDescent) / 2 : 0;
            let dH = lineHeight || actualBoundingBoxDescent;
            if (ifShadow)
                ctx.strokeText(text, x, y + fontTop);
            ctx.fillText(text, x, y + fontTop);
            y += dH;
        });
    }
    static isTextOverlap(rect, minSpacing = 0) {
        const nearbyRects = this.getNearbyRects(rect);
        const { x, y, width = 0, height = 0 } = rect;
        for (const eRect of nearbyRects) {
            if (rect === eRect)
                continue;
            const { x: ex, y: ey = 0, width: ew = 0, height: eh = 0 } = eRect;
            if (!(ex > x + width + minSpacing || ex + ew + minSpacing < x || ey > y + height + minSpacing || ey + eh + minSpacing < y)) {
                return true;
            }
        }
        return false;
    }
    static addRect(rect) {
        const { x, y, width, height } = rect;
        const startX = Math.floor(x / this.GRID_SIZE), endX = Math.floor((x + width) / this.GRID_SIZE);
        const startY = Math.floor(y / this.GRID_SIZE), endY = Math.floor((y + height) / this.GRID_SIZE);
        for (let gx = startX; gx <= endX; gx++) {
            for (let gy = startY; gy <= endY; gy++) {
                const key = `${gx}_${gy}`;
                let cell = this.grid.get(key);
                if (!cell) {
                    this.grid.set(key, [rect]);
                }
                else {
                    cell.push(rect);
                }
            }
        }
    }
    static getNearbyRects(rect) {
        const gx = Math.floor(rect.x / this.GRID_SIZE), gy = Math.floor(rect.y / this.GRID_SIZE);
        let result = [];
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const key = `${gx + dx}_${gy + dy}`;
                const cell = this.grid.get(key);
                if (cell) {
                    result.push(...cell);
                }
            }
        }
        return result;
    }
}
SLUCanvasText.textMetricsCache = new Map();
SLUCanvasText.MAX_CACHE_SIZE = 1000;
SLUCanvasText.GRID_SIZE = 100;
SLUCanvasText.grid = new Map();
//# sourceMappingURL=slu-canvas-text.js.map