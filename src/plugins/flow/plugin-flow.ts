import * as L from "leaflet";
import { u_deepMergeOpt, u_mapGetBounds, u_mapGetLngLatByPoint, u_mapGetMapMouseEvent, u_mapGetMapSize } from "../../utils/slu-map";
import { MapCanvasLayer, SLUMap } from "../../map";
import { PluginVelocity } from "./plugin-velocity";
import { LeafletMouseEvent } from "leaflet";
import { Map as MaplibreMap, MapMouseEvent as MaplibreMouseEvent } from 'maplibre-gl';
import { AMapMapsEvent, DataMapVeloctiyWind, OptMapPluginFlow } from "../../types";
/**流体动画(风速风向洋流动图)leaflet-velocity.js
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap 地图实例
 * @param options 基础配置
*/
export class MapPluginFlow extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: OptMapPluginFlow) {
        super(sluMap.map, options);
        if (options) this.options = u_deepMergeOpt(this.options, options);
    }
    /**基础配置项 */
    public options: OptMapPluginFlow = {
        pane: "overlayPane",
        displayValues: true,
        maxVelocity: 15,
        unit: "m/s",
        angleConvention: "bearingCCW",
        emptyString: "No velocity data",
        colorScale: null,
    }
    /**运动粒子类对象 */
    private windy: PluginVelocity | null = null;
    /**鼠标点击时的回调函数
     * @param degrees 方向
     * @param speed 速度
     */
    private cbClick?: (degrees: number, speed: number) => void;
    /**设置数据并绘制canvas
     * @param datas 数据
     * data[0] 为X轴经度longitude方向的数据
     * data[1] 为Y轴纬度latitude方向的数据
     */
    public setData(datas: DataMapVeloctiyWind[]): void {
        this.options.data = datas;
        /**彻底停止旧的动画 */
        if (this.windy) {
            this.windy.stop();
        }
        if (!datas || datas.length <= 0) {
            this.windy = null;
            this.resetCanvas();
            return;
        }
        /**有数据时才重建或更新 */
        if (!this.windy) {
            this.initWindy();
        } else {
            this.windy.setData(datas);
        }
        this.startWindy();
    }
    /**添加鼠标点击时的回调函数
     * @param cb 回调函数
     * @param degrees 方向
     * @param speed 速度
     */
    public addCbMouseClick(cb: (degrees: number, speed: number) => void): void {
        this.cbClick = cb;
    }
    /*------------------------------------ PRIVATE ------------------------------------------*/
    /**渲染静态图层 */
    protected renderFixedData(): void {
        let datas = this.options.data;
        if (datas && datas.length > 0 && this.windy) {
            this.windy.stop();
            this.startWindy();
        }
    }
    /**添加或关闭地图特定的监听事件(_eventSwitch事件后自动调用) 
     * @param map 地图实例
     * @param key 事件类型
    */
    protected addMapEvents(map: L.Map | AMAP.Map | MaplibreMap, key: "on" | "off"): void {
        const stop = () => this.stopWindy();
        const click = (e: LeafletMouseEvent | AMapMapsEvent | MaplibreMouseEvent) => this.onMouseClick(e);
        map[key]("zoomstart", stop);
        map[key]("dragstart", stop);
        map[key]("click", click);
    }
    /**初始化windy对象 */
    private initWindy(): void {
        const options = Object.assign({ canvas: this.canvas, map: this.map }, this.options);
        this.windy = new PluginVelocity(options); // prepare context global var, start drawing
        this.canvas.classList.add("velocity-overlay");
    }
    /**开始动画 */
    private startWindy(): void {
        const size = u_mapGetMapSize(this.map);
        const { lngLeft, latTop, lngRight, latBottom } = u_mapGetBounds(this.map);
        const sw: [number, number] = [lngLeft, latBottom], ne: [number, number] = [lngRight, latTop];
        this.windy?.start(size.w, size.h, [sw, ne]);
    }
    /**停止动画 */
    private stopWindy(): void {
        if (this.windy) this.windy.stop();
    }
    /**鼠标点击事件监听
     * @param e 鼠标事件
     */
    private onMouseClick(e: LeafletMouseEvent | AMapMapsEvent | MaplibreMouseEvent): void {
        if (!this.windy) return;
        const self = this;
        const { containerPoint } = u_mapGetMapMouseEvent(e, this.map);
        const [lng, lat] = u_mapGetLngLatByPoint(this.map, [containerPoint.x, containerPoint.y]);
        const gridValue = this.windy.interpolate(lng, lat);
        let degrees = 0, speed = 0;
        if (gridValue && !isNaN(gridValue[0]) && !isNaN(gridValue[1]) && gridValue[2]) {
            degrees = self.vectorToDegrees(gridValue[0], gridValue[1], this.options.angleConvention);
            speed = self.vectorToSpeed(gridValue[0], gridValue[1], this.options.unit);
        }
        this.cbClick?.(degrees, speed);
    }
    /**将m/s转换为方向
     * @param uMs X轴速度
     * @param vMs Y轴速度
     * @param angleConvention 角度约定
     * @returns 方向
     */
    private vectorToDegrees(uMs: number, vMs: number, angleConvention: string): number {
        // Default angle convention is CW
        if (angleConvention.endsWith("CCW")) {
            // vMs comes out upside-down..
            vMs = vMs > 0 ? vMs = -vMs : Math.abs(vMs);
        }
        const abs = Math.sqrt(Math.pow(uMs, 2) + Math.pow(vMs, 2));
        const dir = Math.atan2(uMs / abs, vMs / abs);
        let degrees = dir * 180 / Math.PI + 180;
        if (angleConvention === "bearingCW" || angleConvention === "meteoCCW") {
            degrees += 180;
            if (degrees >= 360) degrees -= 360;
        }
        return degrees;
    }
    /**将m/s 转换为指定单位的速度
     * @param uMs X轴速度
     * @param vMs Y轴速度
     * @param unit 单位
     * @returns 速度
     */
    private vectorToSpeed(uMs: number, vMs: number, unit: string): number {
        const v = Math.sqrt(Math.pow(uMs, 2) + Math.pow(vMs, 2)); // Default is m/s
        switch (unit) {
            case "k/h": return this.meterSec2kilometerHour(v);
            case "kt": return this.meterSec2Knots(v);
            default: return v;
        };
    }
    /**将m/s转换为kn节
     * @param meters m/s
     * @returns knot节/s
     */
    private meterSec2Knots(meters: number): number {
        return meters / 0.514;
    }
    /**将m/s转换为km/h
     * @param meters m/s
     * @returns km/h
     */
    private meterSec2kilometerHour(meters: number): number {
        return meters * 3.6;
    }
}