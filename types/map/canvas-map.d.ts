import { Map as LMap, LatLng } from "leaflet";
import { MapNameType } from '../leaflet';
import { MapBounds, MapControlInfo, OptMap } from "../types";
import { Map as MaplibreMap, LngLat as MaplibreLngLat } from 'maplibre-gl';
/**地图
 * @constructor
 * @param ele 地图容器元素
 */
export declare class SLUMap {
    constructor(ele: string);
    /**地图容器元素 */
    private ele;
    /**地图实例 */
    private _map;
    /**地图实例 */
    get map(): LMap | AMAP.Map | MaplibreMap;
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
    init(options?: Partial<OptMap>): Promise<void>;
    /**设置合适的视图范围
     * @param latlngs 纬度经度数组
     * @returns SLUMap实例
     */
    setFitView(latlngs: [number, number][]): SLUMap;
    /**
     * 设置地图中心
     * @param center 中心 latlng顺序
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
    getCenter(): LatLng | AMAP.LngLat | MaplibreLngLat;
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
    showMap(names?: Array<MapNameType>): SLUMap;
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
    /**---------------leaflet地图的相关方法------------------- */
    /**初始化leaflet地图
     * @param ele 地图容器元素
     * @param opt 地图初始化参数
     * @returns LMap实例
     */
    private initLeaflet;
    /**---------------maplibre地图的相关方法------------------- */
    /**初始化maplibre地图
     * @param ele 地图容器元素
     * @param opt 地图初始化参数
     * @returns maplibregl.Map实例
     */
    private initMaplibre;
    /**切换中英文 仅对maplibre地图生效
     * @param ifEn 是否切换英文
     */
    changeLanguage(ifEn: boolean): void;
    /**---------------高德地图的相关方法------------------- */
    /**初始化高德地图
     * @param ele 地图容器元素
     * @param opt 地图初始化参数
     * @returns AMap实例
     */
    private initAmap;
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
