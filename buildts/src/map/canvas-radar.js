"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapCanvasRadar = void 0;
const canvas_1 = require("../canvas");
const slu_map_1 = require("../utils/slu-map");
class MapCanvasRadar {
    constructor(map, ctx) {
        this.map = map;
        this.ctx = ctx;
        this.options = {
            animeId: '0',
            angle: [0, 90],
            ifClockwise: true,
            time: 3,
            currentAngle: 0,
            sectorAngle: 30,
            colorSector: '#00FF00',
            colorGrid: "#49EFEF66",
            colorText: '#FFFF00',
            colorRadar: "#00FFFF",
            colorDash: ["#FF0000", "#00FF00"],
            arcDash: [100, 500],
            gridDensity: 8,
            dashDensity: 3,
            sizeFix: [0, 0],
            latlng: [0, 0]
        };
        this.allRadars = [];
    }
    get zoom() {
        return this.map.getZoom();
    }
    setAllRadars(radars) {
        this.allRadars = radars.filter(e => e).map(e => Object.assign({}, this.options, e));
        return this;
    }
    addRadar(radar) {
        this.allRadars.push(Object.assign({}, this.options, radar));
        return this;
    }
    drawRadarStatic() {
        const that = this, { zoom } = this;
        that.allRadars.forEach(e => {
            const { maxZoom = 50, minZoom = 0 } = e;
            if (zoom < minZoom || zoom > maxZoom)
                return;
            this.updatePoint(e);
            that.drawGrid(e);
            that.drawDashArc(e);
            that.drawCustomDashArc(e);
            that.drawOutline(e);
            that.drawOutlineUnit(e);
            that.drawBackground(e);
            that.drawText(e);
            that.drawScanRange(e);
        });
    }
    drawRadarAmi(time) {
        const diffTime = (this.pertime && time) ? (time - this.pertime) : 1000 / 60, zoom = this.zoom;
        this.pertime = time;
        this.allRadars.forEach(radar => {
            const { maxZoom = 50, minZoom = 0 } = radar;
            if (zoom < minZoom || zoom > maxZoom)
                return;
            this.updatePoint(radar);
            this.updateAngle(radar, diffTime);
            this.drawScan(radar);
        });
    }
    updatePoint(radar) {
        const { map } = this;
        radar.radius = (0, slu_map_1.u_mapGetSizeByMap)(map, radar)[0];
        radar.center = (0, slu_map_1.u_mapGetPointByLatlng)(map, radar.latlng);
    }
    drawGrid(radar) {
        const { ctx } = this, { center, radius, gridDensity, colorGrid } = radar, [x, y] = center;
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.clip();
        const diff = Math.max(Math.floor(radius / gridDensity), 30);
        const total = (radius / diff + 1) | 0, d = (diff * total - radius), [leftTopX, leftTopY] = [x - radius - d, y - radius - d];
        const diameter = radius * 2 + d;
        for (let i = 1, len = total * 2; i < len; i++) {
            const [v0, v1] = [leftTopX + i * diff, leftTopY];
            const [h0, h1] = [leftTopX, leftTopY + i * diff];
            canvas_1.SLUCanvas.drawLine({
                points: [[v0, v1], [v0, v1 + diameter]],
                colorLine: colorGrid,
            }, ctx);
            canvas_1.SLUCanvas.drawLine({
                points: [[h0, h1], [h0 + diameter, h1]],
                colorLine: colorGrid,
            }, ctx);
        }
        ctx.restore();
    }
    drawDashArc(radar) {
        const { ctx } = this, { center, radius, colorRadar, dashDensity, arcDash } = radar, [x, y] = center;
        const sizeFix = radar.sizeFix;
        if (arcDash.length > 0 || !(0, slu_map_1.u_tsIfOneArrTwoLen)(sizeFix))
            return;
        const diff = radius / dashDensity;
        const diffMeter = Number(Math.round(sizeFix[0] / dashDensity));
        ctx.save();
        ctx.setLineDash([2, 5]);
        ctx.strokeStyle = colorRadar;
        ctx.fillStyle = colorRadar;
        ctx.textAlign = "center";
        for (let i = 1, len = Math.floor(radius / diff); i <= len; i++) {
            ctx.beginPath();
            const r = diff * i;
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.stroke();
            if (radius >= 50) {
                ctx.fillText(`${diffMeter * i > sizeFix[0] ? sizeFix[0] : diffMeter * i}m`, x, y + r - 5);
            }
        }
        ctx.restore();
    }
    drawCustomDashArc(radar) {
        const { ctx } = this, { center, radius, colorDash, arcDash = [] } = radar, [x, y] = center;
        const sizeFix = radar.sizeFix;
        if (arcDash.length == 0 || !(0, slu_map_1.u_tsIfOneArrTwoLen)(sizeFix))
            return;
        const pixelMeter = radius / sizeFix[0];
        ctx.save();
        ctx.setLineDash([2, 5]);
        const colors = this.caculateColorChange(colorDash, arcDash.length);
        ctx.textAlign = "center";
        arcDash.forEach((arc, idx) => {
            if (arc >= radius)
                return;
            const pixelR = pixelMeter * arc;
            ctx.fillStyle = ctx.strokeStyle = `rgb(
            ${colors[idx][0]},
            ${colors[idx][1]},
            ${colors[idx][2]})`;
            ctx.beginPath();
            ctx.arc(x, y, pixelR, 0, Math.PI * 2);
            ctx.stroke();
            if (radius >= 50) {
                ctx.fillText(`${arc > sizeFix[0] ? sizeFix[0] : arc}m`, x, y + pixelR - 5);
            }
        });
        ctx.restore();
    }
    drawOutline(radar) {
        const { ctx } = this, { center, radius, colorRadar } = radar, [x, y] = center;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = radius < 100 ? 1 : 2;
        ctx.strokeStyle = colorRadar;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
    drawOutlineUnit(radar) {
        const { ctx } = this, { center, radius, colorRadar } = radar, [x, y] = center;
        const showDetail = radius >= 100;
        const lineWidth = 1, lineHeight = showDetail ? 4 : radius < 50 ? 1 : 3;
        ctx.save();
        ctx.strokeStyle = colorRadar;
        ctx.lineWidth = lineWidth;
        ctx.translate(x, y);
        for (let i = 0; i < 360; i++) {
            let height = i % 5 == 0 ? lineHeight * 2 : lineHeight;
            if (!showDetail && i % 5 !== 0)
                continue;
            ctx.beginPath();
            ctx.rotate((i * Math.PI) / 180);
            const point = [radius, 0];
            const point2 = [radius + height, 0];
            ctx.moveTo(...point);
            ctx.lineTo(...point2);
            ctx.stroke();
            ctx.rotate((-i * Math.PI) / 180);
        }
        ctx.restore();
    }
    drawBackground(radar) {
        const { ctx } = this, { center, radius } = radar, [x, y] = center;
        ctx.save();
        ctx.restore();
    }
    drawText(radar) {
        const { ctx } = this, { center, radius, colorText } = radar, [x, y] = center;
        if (radius < 100)
            return;
        const textSpace = 20;
        const texts = [
            ["90°", "E"],
            ["180°", "S"],
            ["270°", "W"],
            ["360°", "N"],
        ];
        const points = [
            [
                [radius - textSpace / 2, 4],
                [radius + textSpace, 4],
            ],
            [
                [0, radius - textSpace / 2 - 5],
                [0, radius + textSpace + 4],
            ],
            [
                [-radius + textSpace / 2 + 4, 4],
                [-radius - textSpace, 4],
            ],
            [
                [0, -radius + textSpace / 2 + 4],
                [0, -radius - textSpace + 4],
            ],
        ];
        ctx.save();
        ctx.font = "12px Droid Sans bold";
        ctx.fillStyle = colorText;
        ctx.textAlign = "center";
        ctx.translate(x, y);
        texts.forEach((text, index) => {
            const [inText, outText] = text;
            const [point1, point2] = points[index];
            ctx.fillText(inText, point1[0], point1[1]);
            ctx.fillText(outText, point2[0], point2[1]);
        });
        ctx.restore();
    }
    drawScanRange(radar) {
        const { ctx } = this, { angle, center, radius, colorRadar } = radar, [x, y] = center;
        ctx.save();
        ctx.translate(x, y);
        angle.forEach((e) => {
            const deg = ((e - 90) % 360) * Math.PI / 180;
            ctx.rotate(deg);
            canvas_1.SLUCanvas.drawLine({ points: [[0, 0], [radius, 0],], colorLine: colorRadar, }, ctx);
            ctx.rotate(-deg);
        });
        ctx.restore();
    }
    updateAngle(radar, diffTime) {
        let { angle: [startAngle, endAngle], currentAngle, ifClockwise, time } = radar;
        startAngle -= 90;
        endAngle -= 90;
        let angle = currentAngle + (endAngle - startAngle) * diffTime / 1000 / time * (ifClockwise ? 1 : -1);
        if (ifClockwise && angle >= endAngle) {
            angle = startAngle + angle % endAngle;
        }
        else if (!ifClockwise && angle <= startAngle) {
            angle = endAngle - (startAngle - angle) % 360;
        }
        radar.currentAngle = angle;
    }
    drawScan(radar) {
        const { ctx } = this, { center, radius, currentAngle, colorSector } = radar, [x, y] = center;
        ctx.save();
        const arcAngle = (((currentAngle) % 360) * Math.PI) / 180;
        const scanX = radius * Math.cos(arcAngle);
        const scanY = radius * Math.sin(arcAngle);
        canvas_1.SLUCanvas.drawLine({
            points: [
                [x, y],
                [x + scanX, y + scanY],
            ],
            colorLine: colorSector,
        });
        this.drawSector(radar);
        ctx.restore();
    }
    drawSector(radar) {
        let { ctx } = this, { angle: [startAngle, endAngle], center, radius, ifClockwise, currentAngle, colorSector, sectorAngle } = radar, [centerX, centerY] = center;
        startAngle -= 90;
        endAngle -= 90;
        ctx.save();
        let blob = 50;
        const sectorRad = ((sectorAngle % 360) * Math.PI) / 180;
        const dir = ifClockwise ? 1 : -1;
        let diff = (sectorRad / blob) * dir;
        const arcRad = ((currentAngle % 360) * Math.PI) / 180;
        const startRad = ((startAngle % 360) * Math.PI) / 180;
        const endRad = ((endAngle % 360) * Math.PI) / 180;
        let angle1 = arcRad - dir * sectorRad;
        let angle2 = arcRad;
        for (let i = 0; i < blob; i++) {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            const sdeg = (angle1 * 180) / Math.PI;
            const transparency = Math.floor((1 / blob) * 255);
            if ((ifClockwise && sdeg % 360 >= startAngle) || (!ifClockwise && sdeg % 360 <= endAngle)) {
                ctx.arc(centerX, centerY, radius, angle1, angle2, !ifClockwise);
            }
            else {
                ctx.arc(centerX, centerY, radius, ifClockwise ? startRad : endRad, angle2, !ifClockwise);
            }
            ctx.fillStyle = `${colorSector}${transparency.toString(16).padStart(2, "0")}`;
            ctx.fill();
            angle1 += diff;
        }
        ctx.restore();
    }
    caculateColorChange(colors, total) {
        const len = colors.length;
        const step = len <= total ? total / (len - 1) : 1;
        const rgbs = colors.map((hex, idx) => {
            let r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
            return [r, g, b];
        });
        if (colors.length < 2)
            return new Array(total).fill(0).map(() => rgbs[0]);
        const dashRgb = [];
        for (let i = 0; i < total; i++) {
            const colorIdx = Math.floor(i / step);
            const [r0, g0, b0] = rgbs[colorIdx];
            const [r1, g1, b1] = rgbs[colorIdx + 1];
            const s = (i % step) / step;
            const r = Math.floor(r0 + (r1 - r0) * s);
            const g = Math.floor(g0 + (g1 - g0) * s);
            const b = Math.floor(b0 + (b1 - b0) * s);
            dashRgb.push([r, g, b]);
        }
        return dashRgb;
    }
}
exports.MapCanvasRadar = MapCanvasRadar;
//# sourceMappingURL=canvas-radar.js.map