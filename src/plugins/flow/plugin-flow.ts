import { MapEventType, MapType, um_deepMergeOpt, um_getBounds, um_getLngLatByPoint, um_getMapMouseEvent, um_getMapSize } from "../../utils";
import { MapCanvasLayer, SLMap , type MOptCanvasLayer } from "../../map";
import { PluginVelocity } from "./plugin-velocity";

/**
 * 流体动画插件（风速风向洋流动图）
 *
 * 用于在地图上渲染风场、洋流等流体动画效果，基于粒子系统实现。
 * 支持自定义粒子颜色、速度、寿命等参数，可显示鼠标点击位置的风速风向信息。
 *
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap SLMap 地图实例
 * @param options 流体动画配置
 *
 * @example
 * ```typescript
 * import { SLMap, MapPluginFlow } from '@sl-utils/map';
 *
 * const map = new SLMap('map');
 * await map.init({ type: 'L' });
 *
 * // 创建流体动画插件
 * const flow = new MapPluginFlow(map, {
 *   displayValues: true,      // 显示数值
 *   maxVelocity: 15,          // 最大速度
 *   unit: 'm/s',              // 速度单位
 *   angleConvention: 'bearingCCW',  // 角度约定
 *   emptyString: 'No velocity data',
 *   particleAge: 90,          // 粒子寿命
 *   velocityScale: 0.005,     // 速度缩放
 *   colorScale: [             // 颜色刻度
 *     'rgb(36,104,180)',
 *     'rgb(60,157,194)',
 *     'rgb(128,205,193)',
 *     'rgb(151,218,168)',
 *     'rgb(198,231,181)',
 *     'rgb(238,247,217)',
 *     'rgb(255,238,159)',
 *     'rgb(252,217,125)',
 *     'rgb(255,182,100)',
 *     'rgb(252,150,75)',
 *     'rgb(250,112,52)',
 *     'rgb(245,64,32)',
 *     'rgb(237,45,28)',
 *     'rgb(220,24,32)',
 *     'rgb(180,0,35)'
 *   ]
 * });
 *
 * // 设置风场数据
 * flow.setData([
 *   {
 *     header: {
 *       refTime: '2023-01-01T00:00:00Z',
 *       lo1: 100, la1: 20, lo2: 130, la2: 40,
 *       nx: 61, ny: 41, dx: 0.5, dy: 0.5,
 *       type: 'X', unit: 'm/s', forecastTime: 0
 *     },
 *     data: [/* U 风速数据 *\/]
 *   },
 *   {
 *     header: {
 *       refTime: '2023-01-01T00:00:00Z',
 *       lo1: 100, la1: 20, lo2: 130, la2: 40,
 *       nx: 61, ny: 41, dx: 0.5, dy: 0.5,
 *       type: 'Y', unit: 'm/s', forecastTime: 0
 *     },
 *     data: [/* V 风速数据 *\/]
 *   }
 * ]);
 *
 * // 监听鼠标点击事件
 * flow.addCbMouseClick((degrees, speed) => {
 *   console.log(`风向: ${degrees}°, 风速: ${speed} m/s`);
 * });
 *
 * // 移除图层
 * flow.onRemove();
 * ```
 */
export class MapPluginFlow extends MapCanvasLayer {
    constructor(sluMap: SLMap, options?: MOptPluginFlow) {
        super(sluMap.map, options);
        if (options) this.options = um_deepMergeOpt(this.options, options);
    }
    /**基础配置项 */
    public options: MOptPluginFlow = {
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
    public setData(datas: MDataVeloctiyWind[]): void {
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
    /**移除插件 */
    public onRemove(): MapCanvasLayer {
        this.stopWindy();
        this.windy = null;
        return super.onRemove();
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
            this.stopWindy();
            this.startWindy();
        }
    }
    /**添加或关闭地图特定的监听事件(_eventSwitch事件后自动调用) 
     * @param map 地图实例
     * @param key 事件类型
    */
    protected addMapEvents(map: MapType, key: "on" | "off"): void {
        const stop = () => this.stopWindy();
        const click = (e: MapEventType) => this.onMouseClick(e);
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
        const size = um_getMapSize(this.map);
        const { lngLeft, latTop, lngRight, latBottom } = um_getBounds(this.map);
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
    private onMouseClick(e: MapEventType): void {
        if (!this.windy) return;
        const self = this;
        const { containerPoint } = um_getMapMouseEvent(e, this.map);
        const [lng, lat] = um_getLngLatByPoint(this.map, [containerPoint.x, containerPoint.y]);
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

/**速度风场头部信息 */
export interface VelocityHeader {
    /**参考时间 */
    refTime: string;
    /**起始纬度 */
    la1: number;
    /**起始经度 */
    lo1: number;
    /**结束纬度 */
    la2: number;
    /**结束经度 */
    lo2: number;
    /**网格列数 */
    nx: number;
    /**网格行数 */
    ny: number;
    /**经度间隔 */
    dx: number;
    /**纬度间隔 */
    dy: number;
    /**数据类型 */
    type: "X" | "Y" | "Z";
    /**单位 */
    unit: string;
    /**预报时间 */
    forecastTime: number;
}

/**速度风场数据 */
export interface MDataVeloctiyWind {
    /**头部信息 */
    header: VelocityHeader;
    /**数据数组 */
    data: number[];
}

/**流向插件配置 */
export type MOptPluginFlow = MOptCanvasLayer & {
    /**是否显示数值 */
    displayValues: boolean;
    /**速度缩放 */
    velocityScale?: number;
    /**粒子寿命 */
    particleAge?: number;
    /**最大速度 */
    maxVelocity: number;
    /**速度单位 */
    unit: 'm/s' | 'k/h' | 'kt';
    /**角度约定 */
    angleConvention: "bearingCCW" | "bearingCW" | "meteoCCW" | "meteoCW";
    /**空值显示文本 */
    emptyString: string;
    /**颜色刻度 */
    colorScale?: any;
    /**流向数据 */
    data?: MDataVeloctiyWind[];
}