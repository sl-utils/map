import { MapCanvasLayer, MapCanvasRadar, SLUMap } from "../map";
import type { MOptCanvas, MOptPluginRadar } from "../map";
import { Map as MaplibreMap } from 'maplibre-gl';
import { um_drawConvertgps84Togcj02 } from "../utils";

/**
 * 雷达绘制插件
 *
 * 用于在地图上绘制雷达扫描动画效果，支持自定义扫描范围、颜色、网格密度等。
 * 常用于气象雷达、监控范围展示等场景。
 *
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap SLUMap 地图实例
 * @param options 雷达绘制配置
 *
 * @example
 * ```typescript
 * import { SLUMap, MapPluginRadar } from '@sl-utils/map';
 *
 * const map = new SLUMap('map');
 * await map.init({ type: 'L' });
 *
 * // 创建雷达插件
 * const radar = new MapPluginRadar(map);
 *
 * // 添加雷达数据
 * radar.setAllRadars([
 *   {
 *     animeId: 'radar1',
 *     lnglat: [114.12, 22.68],
 *     radius: 5000,  // 5km
 *     colorRadar: 'rgba(255, 0, 0, 0.3)',
 *     colorGrid: 'rgba(255, 255, 255, 0.2)',
 *     colorDash: ['rgba(255, 255, 255, 0.3)'],
 *     gridDensity: 5,
 *     dashDensity: 12,
 *     time: 3000,  // 3秒一圈
 *     ifClockwise: true
 *   }
 * ]);
 *
 * // 添加单个雷达
 * radar.addRadar({
 *   animeId: 'radar2',
 *   lnglat: [114.20, 22.75],
 *   radius: 3000,
 *   colorRadar: 'rgba(0, 255, 0, 0.3)',
 *   sectorAngle: 60,
 *   colorSector: 'rgba(0, 255, 0, 0.1)'
 * });
 *
 * // 移除图层
 * radar.onRemove();
 * ```
 */
export class MapPluginRadar extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: AMAP.CustomLayerOption | MOptCanvas) {
        super(sluMap.map, options);
        this.canvasRadar = new MapCanvasRadar(sluMap.map, this.ctx);
    }
    /**动画所有状态 */
    private canvasRadar: MapCanvasRadar;
    /**
     * 图层是否在移动 高德默认每次渲染更新像素坐标
     * leaflet 图层移动不更新像素坐标 高德 图层移动更新像素坐标
     * 高德地图移动画布和地图同步偏移，leaflet画布固定 地图偏移 的区别
     * 所以防止leaflet移动过程二次偏移 以及高德移动过程坐标未更新导致画布和容器相对位置发生偏移
     * */
    private isDrag: boolean = false;
    /**重设雷达绘制类
     * @param radars 雷达绘制数据
     * @returns MapPluginRadar实例
     */
    public setAllRadars(radars: MOptPluginRadar[]): MapPluginRadar {
        um_drawConvertgps84Togcj02(this.map, radars);
        this.canvasRadar.setAllRadars(radars)
        return this;
    }
    /**添加雷达绘制类
     * @param radar 雷达绘制数据
     * @returns MapPluginRadar实例
     */
    public addRadar(radar: MOptPluginRadar): MapPluginRadar {
        this.canvasRadar.addRadar(radar)
        return this;
    }
    /**渲染静态标绘图层 */
    protected override renderFixedData(): void {

    }
    /**渲染动画
     * @param time 时间戳
     */
    protected override renderAnimation(time?: number): void {
        this.resetCanvas();
        this.canvasRadar.drawRadarStatic();
        this.canvasRadar.drawRadarAmi(time)
        this.flagAnimation && cancelAnimationFrame(this.flagAnimation);
        this.flagAnimation = requestAnimationFrame((time) => {
            // leaflet图层和高德不同，拖动结束才更新像素坐标 因此不影响 但是需要传isMapMove的值
            if (this.isDrag) return;// 拖动过程不允许更新动画 否则出现偏移可能出问题（动画图层每次拖动都会触发重绘，防止像素坐标计算的时候出现快速的偏移）
            this.renderAnimation(time);
        });
    }
    /**控制地图监听事件 拖拽不允许更新动画
   * @param map 地图实例
   * @param key 事件类型
   */
    protected addMapEvents(map: L.Map | AMAP.Map | MaplibreMap, key: 'on' | 'off'): void {
        const end = () => this.drawEnd();
        const start = () => this.drawStart();
        map[key]("dragstart", end);
        map[key]('dragend', start);
        // map[key]("movestart", end);
        // map[key]("moveend", start);
    }
    /**拖拽结束，开始绘制 */
    private drawStart(): void {
        this.isDrag = false;
    }
    /**拖拽开始，结束绘制 */
    private drawEnd(): void {
        this.isDrag = true;
    }
}
