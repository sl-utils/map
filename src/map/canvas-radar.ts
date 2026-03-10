import { SLUCanvas } from "../canvas";
import { u_mapGetPointByLatlng, u_mapGetSizeByMap } from "../utils/slu-map";


/**地图canvas绘制雷达类 */
export class MapCanvasRadar {
    constructor(private map: AMAP.Map | L.Map, private ctx: CanvasRenderingContext2D) { }
    private get zoom() {
        return this.map.getZoom();
    }
    /**上一动画时间(毫秒) */
    private pertime: number;
    /**雷达的默认设置 */
    private radarDefault: MapPluginRadarPara = { animeId: '0', angle: [0, 90], currentAngle: 0, ifClockwise: true, time: 3, gridDensity: 8, arcDash: [100, 500], colorDash: ["#FF0000", "#00FF00"], dashDensity: 3, colorSector: '#00FF00', colorText: '#FFFF00', colorGrid: "#49EFEF66", colorRadar: "#00FFFF", sectorAngle: 30, sizeFix: [0, 0], latlng: [0, 0] }
    /**所有的雷达数据 */
    private allRadars: MapPluginRadarPara[] = [];
    /**重设雷达绘制类 */
    public setAllRadars(radars: MapPluginRadarPara[]) {
        this.allRadars = radars.filter(e => e).map(e => Object.assign({}, this.radarDefault, e));
        return this;
    }
    /**添加雷达绘制类 */
    public addRadar(radar: MapPluginRadarPara) {
        this.allRadars.push(Object.assign({}, this.radarDefault, radar));
        return this;
    }
    /**开始绘制所有雷达静态部分 */
    public drawRadarStatic() {
        const that = this, { zoom } = this;
        that.allRadars.forEach(e => {
            const { maxZoom = 50, minZoom = 0 } = e;
            if (zoom < minZoom || zoom > maxZoom) return;
            this.updatePoint(e);
            that.drawGrid(e);
            that.drawDashArc(e);
            that.drawCustomDashArc(e);
            that.drawOutline(e);
            that.drawOutlineUnit(e);
            that.drawBackground(e);
            that.drawText(e);
            that.drawScanRange(e);
        })
    }
    /**开始绘制所有雷达动态扫描部分 */
    public drawRadarAmi(time?: number) {
        const diffTime = (this.pertime && time) ? (time - this.pertime) : 1000 / 60, zoom = this.zoom;
        this.pertime = time;
        this.allRadars.forEach(radar => {
            const { maxZoom = 50, minZoom = 0 } = radar;
            if (zoom < minZoom || zoom > maxZoom) return;
            this.updatePoint(radar);
            this.updateAngle(radar, diffTime)
            this.drawScan(radar);
        })
    }
    /**更新所有雷达位置和大小 */
    private updatePoint(radar: MapPluginRadarPara) {
        const { map } = this;
        radar.radius = u_mapGetSizeByMap(map, radar)[0];
        radar.center = u_mapGetPointByLatlng(map, radar.latlng);
    }
    /**绘制雷达网格 */
    private drawGrid(radar: MapPluginRadarPara) {
        const { ctx } = this, { center, radius, gridDensity, colorGrid } = radar, [x, y] = center;
        ctx.save();
        ctx.beginPath();
        /**剪切出圆形区域绘制网格 */
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.clip();
        /**每个单元间隔像素距离*/
        const diff = Math.max(Math.floor(radius / gridDensity), 30);
        /**确保分割线经过中心点 */
        const total = (radius / diff + 1) | 0, d = (diff * total - radius),
            [leftTopX, leftTopY] = [x - radius - d, y - radius - d];
        /**直径加补齐的偏差 */
        const diameter = radius * 2 + d;
        /**当前网格 */
        for (let i = 1; i < total * 2; i++) {
            // 垂直方向
            const [v0, v1]: [number, number] = [leftTopX + i * diff, leftTopY];
            // 水平方向
            const [h0, h1]: [number, number] = [leftTopX, leftTopY + i * diff];
            SLUCanvas.drawLine(
                {
                    points: [[v0, v1], [v0, v1 + diameter]],
                    colorLine: colorGrid,
                },
                ctx
            );
            SLUCanvas.drawLine(
                {
                    points: [[h0, h1], [h0 + diameter, h1]],
                    colorLine: colorGrid,
                },
                ctx
            );
        }
        ctx.restore();
    }
    /**虚线圈到中心点距离 */
    private drawDashArc(radar: MapPluginRadarPara) {
        const { ctx } = this,
            { center, radius, colorRadar, dashDensity, arcDash } = radar,
            [x, y] = center;
        const sizeFix = radar.sizeFix as [number, number];
        if (arcDash.length > 0) return;
        // 虚线圆 间距px
        const diff = radius / dashDensity;
        /**虚线每圈间隔米数显示 */
        const diffMeter = Number(Math.round(sizeFix[0] / dashDensity));
        ctx.save();
        ctx.setLineDash([2, 5]);
        ctx.strokeStyle = colorRadar;
        ctx.fillStyle = colorRadar;
        ctx.textAlign = "center";
        for (let i = 1; i <= Math.floor(radius / diff); i++) {
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
    /**绘制自定义的虚线圈 */
    private drawCustomDashArc(radar: MapPluginRadarPara) {
        const { ctx } = this,
            { center, radius, colorDash, arcDash = [] } = radar,
            [x, y] = center;
        if (arcDash.length == 0) return;
        const sizeFix = radar.sizeFix as [number, number];
        /**像素 m 之间比例 */
        const pixelMeter = radius / sizeFix[0];
        ctx.save();
        ctx.setLineDash([2, 5]);
        const colors = this.caculateColorChange(colorDash, arcDash.length);
        ctx.textAlign = "center";
        arcDash.forEach((arc, idx) => {
            if (arc >= radius) return;
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
    /**绘制轮廓 */
    private drawOutline(radar: MapPluginRadarPara) {
        const { ctx } = this,
            { center, radius, colorRadar } = radar,
            [x, y] = center;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = radius < 100 ? 1 : 2;
        ctx.strokeStyle = colorRadar;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
    /**绘制边缘单元 */
    private drawOutlineUnit(radar: MapPluginRadarPara) {
        const { ctx } = this,
            { center, radius, colorRadar } = radar,
            [x, y] = center;
        // 大于100像素才显示更多小刻度
        const showDetail = radius >= 100;
        /**线条宽度*/
        const lineWidth = 1,
            lineHeight = showDetail ? 4 : radius < 50 ? 1 : 3;
        ctx.save();
        ctx.strokeStyle = colorRadar;
        ctx.lineWidth = lineWidth;
        // 设置圆心为原点
        ctx.translate(x, y);
        for (let i = 0; i < 360; i++) {
            let height = i % 5 == 0 ? lineHeight * 2 : lineHeight;
            if (!showDetail && i % 5 !== 0) continue;
            ctx.beginPath();
            // 旋转
            ctx.rotate((i * Math.PI) / 180);
            const point: [number, number] = [radius, 0];
            const point2: [number, number] = [radius + height, 0];
            ctx.moveTo(...point);
            ctx.lineTo(...point2);
            ctx.stroke();
            ctx.rotate((-i * Math.PI) / 180);
        }
        ctx.restore();
    }
    /**雷达背景蒙版 中间泛白*/
    private drawBackground(radar: MapPluginRadarPara) {
        const { ctx } = this,
            { center, radius } = radar,
            [x, y] = center;
        ctx.save();
        ctx.restore();
    }
    /**绘制文字描述 */
    private drawText(radar: MapPluginRadarPara) {
        const { ctx } = this,
            { center, radius, colorText } = radar,
            [x, y] = center;
        if (radius < 100) return;
        const textSpace = 20;
        const texts: [string, string][] = [
            ["90°", "E"],
            ["180°", "S"],
            ["270°", "W"],
            ["360°", "N"],
        ];
        const points: [[number, number], [number, number]][] = [
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
    /**绘制扫描范围 */
    private drawScanRange(radar: MapPluginRadarPara) {
        const { ctx } = this,
            { angle, center, radius, colorRadar } = radar,
            [x, y] = center;
        ctx.save();
        ctx.translate(x, y);
        angle.forEach((e) => {
            const deg = ((e - 90) % 360) * Math.PI / 180;
            ctx.rotate(deg);
            SLUCanvas.drawLine({ points: [[0, 0], [radius, 0],], colorLine: colorRadar, }, ctx);
            ctx.rotate(-deg);
        });
        ctx.restore();
    }
    /**更新动态当前角度 */
    private updateAngle(radar: MapPluginRadarPara, diffTime: number) {
        let { angle: [startAngle, endAngle], currentAngle, ifClockwise, time } = radar;
        startAngle -= 90;
        endAngle -= 90;
        let angle = currentAngle + (endAngle - startAngle) * diffTime / 1000 / time * (ifClockwise ? 1 : -1);
        if (ifClockwise && angle >= endAngle) {
            /**恢复至初始 */
            angle = startAngle + angle % endAngle;
        } else if (!ifClockwise && angle <= startAngle) {
            angle = endAngle - (startAngle - angle) % 360;
        }
        radar.currentAngle = angle;
    }
    /**绘制扫描部分(动态) */
    private drawScan(radar: MapPluginRadarPara) {
        const { ctx } = this,
            { center, radius, currentAngle, colorSector } = radar,
            [x, y] = center;
        // 获取雷达半径对应实际像素
        ctx.save();
        /**弧度 */
        const arcAngle = (((currentAngle) % 360) * Math.PI) / 180;
        /**扫描线 */
        const scanX = radius * Math.cos(arcAngle);
        const scanY = radius * Math.sin(arcAngle);
        SLUCanvas.drawLine({
            points: [
                [x, y],
                [x + scanX, y + scanY],
            ],
            colorLine: colorSector,
        });
        /**扫描区域弧度 */
        this.drawSector(radar);
        ctx.restore();
    }
    /**
     * 绘制扇形区域
     * @param sectorDeg 扇形渐变角度
     * @returns
     */
    private drawSector(radar: MapPluginRadarPara) {
        let { ctx } = this,
            { angle: [startAngle, endAngle], center, radius, ifClockwise, currentAngle, colorSector, sectorAngle } = radar,
            [centerX, centerY] = center;
        startAngle -= 90;
        endAngle -= 90;
        ctx.save();
        // 分割扇形块数 越大渐变越明显 性能越差
        let blob = 50;
        /**扇形弧度 */
        const sectorRad = ((sectorAngle % 360) * Math.PI) / 180;
        const dir = ifClockwise ? 1 : -1;
        /**扇形颜色叠加 每次需要减去的角度 */
        let diff = (sectorRad / blob) * dir;
        /**当前扫描弧度 */
        const arcRad = ((currentAngle % 360) * Math.PI) / 180;
        const startRad = ((startAngle % 360) * Math.PI) / 180;
        const endRad = ((endAngle % 360) * Math.PI) / 180;
        let angle1 = arcRad - dir * sectorRad;
        let angle2 = arcRad;
        // 从透明度最低的地方开始绘制扇形
        for (let i = 0; i < blob; i++) {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            const sdeg = (angle1 * 180) / Math.PI;
            const transparency = Math.floor((1 / blob) * 255);
            // 边界外不绘制扇形
            if ((ifClockwise && sdeg % 360 >= startAngle) || (!ifClockwise && sdeg % 360 <= endAngle)) {
                ctx.arc(centerX, centerY, radius, angle1, angle2, !ifClockwise);
            } else {
                ctx.arc(centerX, centerY, radius, ifClockwise ? startRad : endRad, angle2, !ifClockwise);
            }
            ctx.fillStyle = `${colorSector}${transparency.toString(16).padStart(2, "0")}`;
            ctx.fill();
            angle1 += diff;
        }
        ctx.restore();
    }
    /**计算colors 渐变颜色 */
    private caculateColorChange(colors: string[], total: number) {
        const len = colors.length;
        /**每个colors之间过渡划分step个过渡阶段 */
        const step = len <= total ? total / (len - 1) : 1;
        const rgbs = colors.map((hex, idx) => {
            let r = parseInt(hex.slice(1, 3), 16),
                g = parseInt(hex.slice(3, 5), 16),
                b = parseInt(hex.slice(5, 7), 16);
            return [r, g, b];
        });
        if (colors.length < 2) return new Array(total).fill(0).map(() => rgbs[0]);
        const dashRgb: [number, number, number][] = [];
        for (let i = 0; i < total; i++) {
            /**实际对应颜色坐标 */
            const colorIdx = Math.floor(i / step);
            // 对应之间百分比
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