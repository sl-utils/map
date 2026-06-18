import { Map as LMap } from "leaflet";
import { OptMapCanvas } from "../types";
import { Map as MaplibreMap } from 'maplibre-gl';
/** 地图canvas基础图层类(基本所有插件都要继承此类) 删除永远比新增简单
 * @constructor
 * @param MAP 地图实例
 * @param opt 图层配置项
*/
export declare class MapCanvasLayer {
    constructor(MAP: LMap, opt?: OptMapCanvas);
    constructor(MAP: MaplibreMap, opt?: OptMapCanvas);
    constructor(MAP: AMAP.Map, opt?: AMAP.CustomLayerOption);
    constructor(MAP: AMAP.Map | LMap | MaplibreMap, opt?: AMAP.CustomLayerOption | OptMapCanvas);
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
    readonly options: OptMapCanvas;
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
