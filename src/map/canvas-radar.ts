import { SLUCanvas } from "../canvas";
import { um_deepMergeOpt, um_getPointByLnglat, um_getSizeByMap, um_tsIfOneArrTwoLen } from "../utils";
import { Map as LMap } from 'leaflet';
import { Map as MaplibreMap } from 'maplibre-gl';
import type { MapShow, MapPoint, SizeFix_, MapEvent } from ".";

/**地图canvas绘制雷达类
 * @constructor
 * @param map 地图实例
 * @param ctx 画布上下文
 */
export class MapCanvasRadar {
    constructor(private map: AMAP.Map | LMap | MaplibreMap, private ctx: CanvasRenderingContext2D) { }
    /**当前地图缩放层级 */
    private get zoom(): number {
        return this.map.getZoom();
    }
    /**上一动画时间(毫秒) */
    private pertime: number;
    /**雷达的默认设置 */
    private options: MOptPluginRadar = {
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
        lnglat: [0, 0]
    };
    /**所有的雷达数据 */
    private allRadars: MOptPluginRadar[] = [];
    /**重设雷达绘制类
     * @param radars 雷达数据集合
     * @returns MapCanvasRadar实例
     */
    public setAllRadars(radars: MOptPluginRadar[]): MapCanvasRadar {
        this.allRadars = radars.filter(e => e).map(e => e = um_deepMergeOpt(this.options, e));
        return this;
    }
    /**添加雷达绘制类
     * @param radar 雷达数据
     * @returns MapCanvasRadar实例
     */
    public addRadar(radar: MOptPluginRadar): MapCanvasRadar {
        const newRadar = um_deepMergeOpt(this.options, radar);
        this.allRadars.push(newRadar);
        return this;
    }
    /**开始绘制所有雷达静态部分 */
    public drawRadarStatic(): void {
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
    /**开始绘制所有雷达动态扫描部分
     * @param time 当前时间(毫秒)
     */
    public drawRadarAmi(time?: number): void {
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
    /**更新所有雷达位置和大小
     * @param radar 雷达数据
     */
    private updatePoint(radar: MOptPluginRadar): void {
        const { map } = this;
        radar.radius = um_getSizeByMap(map, radar)[0];
        radar.center = um_getPointByLnglat(map, radar.lnglat);
    }
    /**绘制雷达网格
     * @param radar 雷达数据
     */
    private drawGrid(radar: MOptPluginRadar): void {
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
        for (let i = 1, len = total * 2; i < len; i++) {
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
    /**虚线圈到中心点距离
     * @param radar 雷达数据
     */
    private drawDashArc(radar: MOptPluginRadar): void {
        const { ctx } = this,
            { center, radius, colorRadar, dashDensity, arcDash } = radar,
            [x, y] = center;
        const sizeFix = radar.sizeFix;
        if (arcDash.length > 0 || !um_tsIfOneArrTwoLen(sizeFix)) return;
        // 虚线圆 间距px
        const diff = radius / dashDensity;
        /**虚线每圈间隔米数显示 */
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
    /**绘制自定义的虚线圈
     * @param radar 雷达数据
     */
    private drawCustomDashArc(radar: MOptPluginRadar): void {
        const { ctx } = this,
            { center, radius, colorDash, arcDash = [] } = radar,
            [x, y] = center;
        const sizeFix = radar.sizeFix;
        if (arcDash.length == 0 || !um_tsIfOneArrTwoLen(sizeFix)) return;
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
    /**绘制轮廓
     * @param radar 雷达数据
     */
    private drawOutline(radar: MOptPluginRadar): void {
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
    /**绘制边缘单元
     * @param radar 雷达数据
     */
    private drawOutlineUnit(radar: MOptPluginRadar): void {
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
    /**雷达背景蒙版 中间泛白
     * @param radar 雷达数据
     */
    private drawBackground(radar: MOptPluginRadar): void {
        const { ctx } = this,
            { center, radius } = radar,
            [x, y] = center;
        ctx.save();
        ctx.restore();
    }
    /**绘制文字描述
     * @param radar 雷达数据
     */
    private drawText(radar: MOptPluginRadar): void {
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
    /**绘制扫描范围
     * @param radar 雷达数据
     */
    private drawScanRange(radar: MOptPluginRadar): void {
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
    /**更新动态当前角度
     * @param radar 雷达数据
     * @param diffTime 时间差
     */
    private updateAngle(radar: MOptPluginRadar, diffTime: number): void {
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
    /**绘制扫描部分(动态)
     * @param radar 雷达数据
     */
    private drawScan(radar: MOptPluginRadar): void {
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
     */
    private drawSector(radar: MOptPluginRadar): void {
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
    /**计算colors 渐变颜色
     * @param colors 颜色数组
     * @param total 总颜色数
     * @returns 渐变颜色数组
     */
    private caculateColorChange(colors: string[], total: number): number[][] {
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

// =============== 类型约束 ===============

/**雷达插件配置 @template I 标识雷达携带的info的类型 */
export interface MOptPluginRadar<I = any> extends MapShow, MapPoint, SizeFix_ {
    /**动画唯一标识 */
    animeId: string
    /**角度范围 [start, end] */
    angle?: [number, number],
    /**是否顺时针旋转 */
    ifClockwise?: boolean
    /**旋转时间(毫秒) */
    time?: number
    /**当前角度 */
    currentAngle?: number
    /**扇形角度 */
    sectorAngle?: number;
    /**扇形颜色 */
    colorSector?: string;
    /**网格颜色 */
    colorGrid?: string;
    /**文本颜色 */
    colorText?: string;
    /**雷达颜色 */
    colorRadar?: string
    /**虚线颜色 */
    colorDash?: string[];
    /**圆弧虚线配置 */
    arcDash?: number[];
    /**网格密度 */
    gridDensity?: number;
    /**虚线密度 */
    dashDensity?: number;
    /**是否隐藏 */
    ifHide?: boolean
    /**半径 */
    radius?: number;
    /**中心点 */
    center?: [number, number]
    /**自定义信息 */
    info?: I
}

/**雷达扫描事件类型 @template I 标识雷达携带的info的类型 */
export type MapRadarScanEvent<I = any> = MOptPluginRadar<I> & MapEvent<MapEvent, I>;