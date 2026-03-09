import * as L from "leaflet";
import { u_mapGetBounds, u_mapGetLatLngByPoint, u_mapGetMapMouseEvent, u_mapGetMapSize } from "../../utils/slu-map";
import { MapCanvasLayer } from "../../map";
import { VelocityWindy } from "./velocity-windy";
/**流体动画(风速风向洋流动图)leaflet-velocity.js*/
export class MapPluginFlow extends MapCanvasLayer {
    constructor(map: L.Map | AMAP.Map, options?: Partial<SLPMapVelocity>) {
        super(map, options);
        Object.assign(this.options, options);
    }
    /**配置项 */
    public options: SLPMapVelocity = {
        pane: "overlayPane",
        displayValues: true,
        unit: "m/s",
        angleConvention: "bearingCCW",
        emptyString: "No velocity data",
        maxVelocity: 15,
        colorScale: null,
    }
    private windy: VelocityWindy | null = null;
    private cbClick?: (degrees: number, speed: number) => void;
    /**设置配置项 */
    public setOptions(opt: SLPMapVelocity) {
        let options = this.options = Object.assign(this.options, opt);
        if (this.windy) {
            this.windy.setOptions(options);
            if (options.hasOwnProperty("data")) this.windy.setData(options.data);
        }
    }
    /**设置数据并绘制canvas
     * data[0] 为X轴经度longitude方向的数据
     * data[1] 为Y轴纬度latitude方向的数据
     */
    public setData(datas: SLDVeloctiyWind[]) {
        this.options.data = datas;
        if (this.windy) {
            this.windy.setData(datas);
        } else {
            this.initWindy();
            if (!datas || datas.length <= 0) {
                this.windy?.stop();
                this.resetCanvas();
                return
            };
            this.startWindy();
        }
    }
    /**添加鼠标点击时的回调函数 */
    public addCbMouseClick(cb: (degrees: number, speed: number) => void) {
        this.cbClick = cb;
    }
    /*------------------------------------ PRIVATE ------------------------------------------*/
    protected renderFixedData(): void {
        let datas = this.options.data;
        if (datas && datas.length > 0 && this.windy) {
            this.windy.stop();
            this.startWindy();
        }
    }
    /**添加或关闭地图特定的监听事件(_eventSwitch事件后自动调用) */
    protected addMapEvents(map: L.Map, key: "on" | "off"): void {
        map[key]("zoomstart", this.stopWindy, this);
        map[key]("dragstart", this.stopWindy, this);
        map[key]("click", this.onMouseClick, this);
    }
    /**初始化windy对象 */
    private initWindy() {
        var options = Object.assign({
            canvas: this.canvas,
            map: this.map
        }, this.options);
        this.windy = new VelocityWindy(options); // prepare context global var, start drawing
        this.canvas.classList.add("velocity-overlay");
    }
    /**开始动画 */
    private startWindy() {
        const size = u_mapGetMapSize(this.map);
        const { lngLeft, latTop, lngRight, latBottom } = u_mapGetBounds(this.map);
        var sw: [number, number] = [lngLeft, latBottom], ne: [number, number] = [lngRight, latTop];
        this.windy?.start(
            size.w, size.h,
            [sw, ne]
        );
    }
    /**停止动画 */
    private stopWindy() {
        if (this.windy) this.windy.stop();
    }
    /**鼠标点击事件监听 */
    private onMouseClick(e: L.LeafletMouseEvent | AMapMapsEvent) {
        if (!this.windy) return;
        var self = this;
        const { containerPoint } = u_mapGetMapMouseEvent(e, this.type);
        var [lat, lng] = u_mapGetLatLngByPoint(this.map, [containerPoint.x, containerPoint.y]);
        var gridValue = this.windy.interpolate(lng, lat);
        let degrees = 0, speed = 0;
        if (gridValue && !isNaN(gridValue[0]) && !isNaN(gridValue[1]) && gridValue[2]) {
            degrees = self.vectorToDegrees(gridValue[0], gridValue[1], this.options.angleConvention);
            speed = self.vectorToSpeed(gridValue[0], gridValue[1], this.options.unit);
        }
        this.cbClick?.(degrees, speed);
        console.log(degrees, speed)
    }
    private vectorToDegrees(uMs: number, vMs: number, angleConvention: string): number {
        // Default angle convention is CW
        if (angleConvention.endsWith("CCW")) {
            // vMs comes out upside-down..
            vMs = vMs > 0 ? vMs = -vMs : Math.abs(vMs);
        }
        var abs = Math.sqrt(Math.pow(uMs, 2) + Math.pow(vMs, 2));
        var dir = Math.atan2(uMs / abs, vMs / abs);
        var degrees = dir * 180 / Math.PI + 180;
        if (angleConvention === "bearingCW" || angleConvention === "meteoCCW") {
            degrees += 180;
            if (degrees >= 360) degrees -= 360;
        }
        return degrees;
    }
    /**将m/s 转换为指定单位的速度 */
    private vectorToSpeed(uMs: number, vMs: number, unit: string): number {
        var v = Math.sqrt(Math.pow(uMs, 2) + Math.pow(vMs, 2)); // Default is m/s
        switch (unit) {
            case "k/h": return this.meterSec2kilometerHour(v);
            case "kt": return this.meterSec2Knots(v);
            default: return v;
        };
    }
    private meterSec2Knots(meters: number): number {
        return meters / 0.514;
    }
    private meterSec2kilometerHour(meters: number): number {
        return meters * 3.6;
    }
}