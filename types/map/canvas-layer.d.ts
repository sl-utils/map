import { Map as LMap, LayerOptions } from "leaflet";
import { Map as MaplibreMap } from 'maplibre-gl';
import type { OptCanvas } from "../canvas";
import type { CustomLayerOption } from "../amap";
/**
 * 地图 Canvas 基础图层类
 *
 * 所有 Canvas 插件的基类，封装了 Leaflet、高德、MapLibre 三种地图引擎的图层实现。
 * 提供统一的 Canvas 生命周期管理、事件监听、重绘机制等。
 *
 * @constructor
 * @param MAP 地图实例
 * @param opt 图层配置项
 *
 * @example
 * ```typescript
 * // 通常不直接使用此类，而是继承它实现自定义插件
 * import { MapCanvasLayer, SLUMap } from '@sl-utils/map';
 *
 * // 自定义插件示例
 * class MyPlugin extends MapCanvasLayer {
 *   constructor(sluMap, options) {
 *     super(sluMap.map, options);
 *   }
 *
 *   // 静态数据绘制
 *   protected renderFixedData() {
 *     this.resetCanvas();
 *     const ctx = this.ctx;
 *     ctx.fillStyle = '#FF0000';
 *     ctx.fillRect(10, 10, 100, 100);
 *   }
 *
 *   // 动态数据绘制
 *   protected renderAnimation() {
 *     this.resetCanvas();
 *     // 动画逻辑...
 *     this.flagAnimation = requestAnimationFrame(() => {
 *       this.renderAnimation();
 *     });
 *   }
 *
 *   // 添加地图事件监听
 *   protected addMapEvents(map, key) {
 *     map[key]('moveend', () => this._redraw());
 *     map[key]('zoomend', () => this._redraw());
 *   }
 * }
 *
 * // 使用自定义插件
 * const map = new SLUMap('map');
 * await map.init({ type: 'L' });
 *
 * const plugin = new MyPlugin(map, {
 *   pane: 'canvas',
 *   className: 'my-plugin',
 *   zIndex: 100
 * });
 *
 * // 移除图层
 * plugin.onRemove();
 * ```
 */
export declare class MapCanvasLayer {
    constructor(MAP: LMap, opt?: MOptCanvas);
    constructor(MAP: MaplibreMap, opt?: MOptCanvas);
    constructor(MAP: AMAP.Map, opt?: AMAP.CustomLayerOption);
    constructor(MAP: AMAP.Map | LMap | MaplibreMap, opt?: AMAP.CustomLayerOption | MOptCanvas);
    /**地图实例*/
    readonly map: AMAP.Map | LMap | MaplibreMap;
    /**图层 */
    private layer;
    /**画布 */
    protected readonly canvas: HTMLCanvasElement;
    /**画布上下文 */
    protected readonly ctx: CanvasRenderingContext2D;
    /**画布宽度 */
    protected width: number;
    /**画布高度 */
    protected height: number;
    /**图层配置项 */
    readonly options: MOptCanvas;
    /**动画循环的id标识 */
    protected flagAnimation: number;
    /**移除图层 */
    onRemove(): MapCanvasLayer;
    /**清空并重新设置画布 */
    resetCanvas(): void;
    /**添加或关闭地图特定的监听事件(_eventSwitch事件后自动调用)
     * @param map 地图实例
     * @param key 事件类型
     */
    protected addMapEvents(map: AMAP.Map | LMap | MaplibreMap, key: 'on' | 'off'): void;
    /**绘制静态数据推荐使用此方法(固定的图) */
    protected renderFixedData(): void;
    /** 推荐使用此方法绘制动态图(跟随鼠标拖动，移动时需要立刻绘制时)
     ** 动画图层绘制前的画布清空、计算等均在此方法中自行计算
     ** 与renderFixedData本质是一样的
     */
    protected renderAnimation(): void;
    /**添加地图事件监听
     * @param key 事件类型
     * @param cb 事件回调函数
     */
    protected on(key: string, cb: Function): void;
    /**移除地图事件监听
     * @param key 事件类型
     * @param cb 事件回调函数
     */
    protected off(key: string, cb: Function): void;
    /**初始化canvas */
    private initCanvas;
    /**将图层添加到map实例中显示
     * @returns MapCanvasLayer实例
     */
    private onAdd;
    /**基础的监听事件
    * @param flag @default true
    *  true开启重绘事件监听; false关闭重绘事件监听
    **/
    private _eventSwitch;
    /**基础绘制 */
    /** 重绘(子类重写也无效)
     ** 清空之前的绘制
     ** ①高德地图渲染配置alwaysRender:true后拖动缩放会多次渲染
     */
    protected _redraw: () => void;
    /**------------------------------高德地图的实现------------------------------*/
    /**初始化高德地图的图层 */
    private _initAMap;
    /**将图层添加到map实例中显示 */
    private _onAmapAdd;
    /**移除图层 */
    private _onAmapRemove;
    /**------------------------------Leaflet地图的实现------------------------------*/
    /**初始化Leaflet地图的图层 */
    private _initLeaflet;
    /**初始化画布并添加到Pane中 */
    private initLeafletCanvas;
    /**移除图层 */
    private _onLeafletRemove;
    /**添加Leaflet地图事件监听
     *  @param flag @default true
     *  true开启重绘事件监听; false关闭重绘事件监听
     */
    private addLeafletEvent;
    /**重设画布,并重新渲染*/
    private _reset;
    /**缩放动画
     * @param e 缩放事件对象
     */
    private _animateZoom;
    /**画布加载完成 */
    private _onCanvasLoad;
    /**------------------------------MapLibre地图的实现------------------------------*/
    /**异步初始化MapLibre地图的图层 */
    private _initMapLibreAsync;
    /**添加MapLibre图层到地图上 */
    private _initMapLibre;
    /**将图层添加到容器 */
    private _onMapLibreAdd;
    /**移除图层 */
    private _onMapLibreRemove;
    /**添加MapLibre地图事件监听
     *  @param flag @default true
     *  true开启事件监听; false关闭事件监听
     */
    private addMaplibreEvent;
}
/**地图画布配置 */
export interface MOptCanvas extends OptCanvas, LayerOptions, CustomLayerOption {
    /**画布挂载的div节点名称 @default 'canvas'
     * map默认创建mapPane、tilePane、shadowPane、overlayPane、markerPane、tooltipPane、popupPane，
     * 不存在时CanvasLayer会调用创建方法。
     * 类名会去掉Pane，例如XPane和X都生成类名为leaflet-X-pane的div节点，但是属于不同的pane
     */
    pane?: string;
    /**画布的class名称 */
    className?: string;
    /**画布层级，默认100，最大400(受挂载的div影响，可修改) */
    zIndex?: number;
    /**zoom调整时是否开启缩放动画 @default true */
    zoomAnimation?: boolean;
}
