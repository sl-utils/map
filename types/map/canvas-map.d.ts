import { MapNameType } from '../leaflet';
import { _MapMStyle, MapType } from "../utils";
/**
 * SLMap 地图核心类
 *
 * 封装了 Leaflet、高德、MapLibre 三种地图引擎，提供统一的 API 接口。
 * 支持地图初始化、视图控制、坐标转换、比例尺计算等功能。
 *
 * @constructor
 * @param ele 地图容器元素 ID
 *
 * @example
 * ```typescript
 * import { SLMap } from '@sl-utils/map';
 *
 * // 创建地图实例
 * const map = new SLMap('map');
 *
 * // 初始化 Leaflet 地图（默认）
 * await map.init({
 *   type: 'L',
 *   center: [114.12, 22.68],
 *   zoom: 11,
 *   minZoom: 2,
 *   maxZoom: 20
 * });
 *
 * // 或初始化高德地图
 * await map.init({
 *   type: 'A',
 *   center: [114.12, 22.68],
 *   zoom: 11
 * });
 *
 * // 或初始化 MapLibre 地图
 * await map.init({
 *   type: 'M',
 *   center: [114.12, 22.68],
 *   zoom: 11,
 *   style: 'https://tiles.openfreemap.org/styles/bright'
 * });
 *
 * // 设置地图中心
 * map.setCenter([114.15, 22.70], 12);
 *
 * // 设置合适的视图范围
 * map.setFitView([
 *   [114.12, 22.68],
 *   [114.15, 22.70],
 *   [114.18, 22.72]
 * ]);
 *
 * // 获取地图边界
 * const bounds = map.getBound();
 * console.log(`经度范围: ${bounds.lngLeft} - ${bounds.lngRight}`);
 * console.log(`纬度范围: ${bounds.latBottom} - ${bounds.latTop}`);
 *
 * // 获取地图中心
 * const center = map.getCenter();
 * console.log(`中心: ${center.lng}, ${center.lat}`);
 *
 * // 获取缩放级别
 * const zoom = map.getZoom();
 *
 * // 显示网络图层（仅 Leaflet）
 * map.showMap([
 *   MapNameType.tianDiTuNormalMap,
 *   MapNameType.tianDiTuNormalAnnotion
 * ]);
 *
 * // 打开地图控件
 * const controlInfo = map.openControl(true);
 * map.onControlUpdate((info) => {
 *   console.log(`鼠标位置: ${info.lng}, ${info.lat}`);
 *   console.log(`缩放级别: ${info.zoom}`);
 *   console.log(`比例尺: ${info.scale}`);
 * });
 *
 * // 切换中英文（仅 MapLibre）
 * map.changeLanguage(true);
 *
 * // 关闭地图控件
 * map.closeControl();
 * ```
 */
export declare class SLMap {
    constructor(ele: string);
    /**地图容器元素 */
    private ele;
    /**地图实例 */
    private _map;
    /**地图实例 */
    get map(): MapType;
    /**地图控件更新时的回调 */
    private controlCb?;
    /**地图控件信息 */
    private controlInfo;
    /**当前鼠标所在经纬度 */
    private latLng;
    /**鼠标所在经纬度是否使用度分秒格式 */
    private ifDMS;
    /**当前正在显示的网络图层 */
    private curs;
    /**初始实例化地图
     * @param options @default {} 地图初始化参数
     */
    init(options?: Partial<MOpt>): Promise<void>;
    /**设置合适的视图范围
     * @param lnglats [经度,纬度][]
     * @returns SLUMap实例
     */
    setFitView(lnglats: [number, number][]): SLMap;
    /**
     * 设置地图中心
     * @param center 中心 [lng,lat]顺序
     * @param zoom 缩放级别
     * @param offset 中心 但需要偏移固定像素
     */
    setCenter(center: [number, number], zoom: number, offset?: [number, number]): void;
    /**获取地图边界
     * @returns 地图边界信息
     */
    getBound(): MapBounds;
    /**获取地图中心
     * @returns 地图中心
     */
    getCenter(): MapLatLng;
    /**获取地图缩放级别
     * @returns 地图缩放级别
     */
    getZoom(): number;
    /**获取地图大小
     * @returns 地图大小{ w: number; h: number }
     */
    getSize(): {
        w: number;
        h: number;
    };
    /**显示指定的网络图层
     * @param names @default [] 网络图层名称数组
     * @returns SLUMap实例
     */
    showMap(names?: Array<MapNameType>): SLMap;
    /**打开地图控件
     * @param ifDMS @default true 是否使用度分秒格式，否则显示度格式，默认精度为5
     * @returns 地图控件信息
     */
    openControl(ifDMS?: boolean): MapControlInfo;
    /**关闭地图控件 */
    closeControl(): void;
    /**地图控件更新时触发
     * @param cb 回调函数
     */
    onControlUpdate(cb: (info: MapControlInfo) => void): void;
    /**切换控件经纬度格式
     * @param ifDMS 是否使用度分秒格式，否则显示度格式，默认精度为5
     * @returns 地图控件信息
     */
    changeLatlngFormat(ifDMS: boolean): MapControlInfo;
    /**切换中英文 仅对maplibre地图生效
     * @param ifEn 是否切换英文
     */
    changeLanguage(ifEn: boolean): void;
    /**--------------地图控件的相关方法------------------- */
    /**监听事件开关
     * @param flag 开启或关闭事件
     */
    private eventSwitch;
    /**设置经纬度信息
     * @param e 鼠标事件
     */
    private setLatlng;
    /**设置地图层级和比例尺 */
    private setZoomAndScale;
    /**设置地图比例尺 */
    private setScale;
    /**取整比例尺
     * @param num 距离（米）
     * @returns 取整后的比例尺（米）
     */
    private getScaleNum;
}
/**地图配置项 */
export interface MOpt {
    /**地图的类型 @param L leaflet插件 @param A 高德地图 @param B 百度地图 @param M maplibre地图 @default L */
    type: 'L' | 'A' | 'B' | 'M';
    /**地图中心点 [lng, lat] @default [114.12027, 22.68471] */
    center: [number, number];
    /**地图初始层级 @default 11 */
    zoom: number;
    /**最小层级 @default 2 */
    minZoom: number;
    /**最大层级 @default 20 */
    maxZoom: number;
    /**是否启用拖拽功能 @default true */
    dragging: boolean;
    /**是否显示层级控制器 @default false */
    zoomControl: boolean;
    /**是否显示属性控制器 @default false */
    attributionControl: boolean;
    /**是否启用双击放大层级 @default false */
    doubleClickZoom: boolean;
    /**是否点击关闭弹窗 @default false */
    closePopupOnClick: boolean;
    /**是否显示标签(省会、地名等)，仅适用于高德地图 @default true */
    showLabel: boolean;
    /**maplibre地图样式，支持url或json自定义样式 */
    style?: string | _MapMStyle;
}
/**地图边界信息 */
export interface MapBounds {
    /**最小经度 */
    lngLeft: number;
    /**最大纬度 */
    latTop: number;
    /**最大经度 */
    lngRight: number;
    /**最小纬度 */
    latBottom: number;
}
/**地图控件信息 */
export interface MapControlInfo {
    /**纬度 */
    lat?: string;
    /**经度 */
    lng?: string;
    /**层级 */
    zoom?: number;
    /**比例尺 */
    scale?: string;
    /**比例尺对应像素宽度 */
    width?: string;
}
/**地图上的经纬度对象 */
export interface MapLatLng {
    /**纬度 */
    lat: number;
    /**经度 */
    lng: number;
}
