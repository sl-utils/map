"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.u_mathGetPoint = getPoint;
exports.u_mathGetBezierPointByPercent = getBezierPointByPercent;
function getPoint(num, point = 2, type = 0) {
    let res = num * Math.pow(10, point);
    res = type == 0 ? Math.round(res) : type == 1 ? Math.floor(res) : Math.ceil(res);
    return res / Math.pow(10, point);
}
function getBezierPointByPercent(percent, p1, p2, cp) {
    const [x1, y1] = p1, [cx, cy] = cp, [x2, y2] = p2, t = percent;
    let x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2;
    let y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
    return [x, y];
}
//# sourceMappingURL=slu-math.js.map