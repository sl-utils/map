import { CRS, Map as LMap, LatLng, LeafletMouseEvent, MapOptions, latLng } from "leaflet";
import * as AMapLoader from '@amap/amap-jsapi-loader';
import { MapNameType, SLULeafletNetMap } from '../leaflet';
import { um_getBounds, um_getDistance, um_getLngLatByEvent, um_getLngLatByPoint, um_getLnglatByValue, um_getMapSize, um_getPointByLnglat, um_setFitBounds, um_setViewCenter, um_togcj02gps84, um_togps84gcj02, um_tsIsKeyOf, um_tsMapisAmap, um_tsMapisLeaflet, um_tsMapisMapLibre } from "../utils";
import { type CustomLayerInterface, type StyleSpecification, Map as MaplibreMap, type LngLat as MaplibreLngLat, type MapMouseEvent as MaplibreMouseEvent } from 'maplibre-gl';
import { AMapMapsEvent } from ".";
declare var AMap: any;
/**
 * SLUMap 地图核心类
 *
 * 封装了 Leaflet、高德、MapLibre 三种地图引擎，提供统一的 API 接口。
 * 支持地图初始化、视图控制、坐标转换、比例尺计算等功能。
 *
 * @constructor
 * @param ele 地图容器元素 ID
 *
 * @example
 * ```typescript
 * import { SLUMap } from '@sl-utils/map';
 *
 * // 创建地图实例
 * const map = new SLUMap('map');
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
export class SLUMap {
    constructor(ele: string) {
        this.ele = ele;
    }
    /**地图容器元素 */
    private ele: string;
    /**地图实例 */
    private _map: LMap | AMAP.Map | MaplibreMap;
    /**地图实例 */
    public get map(): LMap | AMAP.Map | MaplibreMap {
        return this._map
    }
    /**地图控件更新时的回调 */
    private controlCb?: (info: MapControlInfo) => void;
    /**地图控件信息 */
    private controlInfo: MapControlInfo = Object.create({});
    /**当前鼠标所在经纬度 */
    private latLng: MapLatLng;
    /**鼠标所在经纬度是否使用度分秒格式 */
    private ifDMS: boolean = true;
    /**当前正在显示的网络图层 */
    private curs: Partial<{ [key in MapNameType]: SLULeafletNetMap | undefined }> = Object.create(null);
    /**初始实例化地图
     * @param options @default {} 地图初始化参数
     */
    public async init(options: Partial<MOpt> = {}): Promise<void> {
        const { type } = options, ele = this.ele;
        switch (type) {
            case "A": this._map = await this.initAmap(ele, options); break;
            case "M": this._map = await this.initMaplibre(ele, options); break;
            default: this._map = await this.initLeaflet(ele, options);
                this.showMap([MapNameType.tianDiTuNormalMap, MapNameType.tianDiTuNormalAnnotion]);
                break;
        }
    }
    /**设置合适的视图范围
     * @param lnglats [经度,纬度][]
     * @returns SLUMap实例
     */
    public setFitView(lnglats: [number, number][]): SLUMap {
        if (this._map) {
            um_setFitBounds(this._map, lnglats);
        }
        return this
    }
    /**
     * 设置地图中心
     * @param center 中心 [lng,lat]顺序
     * @param zoom 缩放级别
     * @param offset 中心 但需要偏移固定像素
     */
    public setCenter(center: [number, number], zoom: number, offset?: [number, number]): void {
        um_setViewCenter(this._map, center, zoom, offset);
    }
    /**获取地图边界
     * @returns 地图边界信息
     */
    public getBound(): MapBounds {
        return um_getBounds(this._map);
    }
    /**获取地图中心
     * @returns 地图中心
     */
    public getCenter(): LatLng | AMAP.LngLat | MaplibreLngLat {
        const center = this.map.getCenter();
        if (um_tsMapisAmap(this.map)) {
            const { lat, lng } = um_togcj02gps84(center.lng, center.lat);
            return new AMap.LngLat(lng, lat);
        }
        return center;
    }
    /**获取地图缩放级别
     * @returns 地图缩放级别
     */
    public getZoom(): number {
        return this.map.getZoom();
    }
    /**获取地图大小
     * @returns 地图大小{ w: number; h: number }
     */
    public getSize(): { w: number; h: number } {
        return um_getMapSize(this._map);
    }
    /**显示指定的网络图层
     * @param names @default [] 网络图层名称数组
     * @returns SLUMap实例
     */
    public showMap(names: Array<MapNameType> = []): SLUMap {
        const { map, curs } = this;
        if (map && um_tsMapisLeaflet(map)) {
            let mapSource: string = names[0].split('.')[0]
            let center = map.getCenter();
            let zoom = map.getZoom();
            //百度图层暂时不添加
            // map.options.crs = mapSource === 'Baidu' ? SLCRS.Baidu : CRS.EPSG3857; 
            map.setView(center, zoom, { animate: false });
            names?.forEach(name => {
                if (curs[name]) return;
                let net = new SLULeafletNetMap(name)
                net.addTo(map);
                curs[name] = net;
            });
            for (const key of Object.keys(curs)) {
                if (!um_tsIsKeyOf(curs, key)) continue;
                let name: MapNameType = key;
                let flag = names.includes(name);
                if (flag) continue;
                curs[name]?.remove();
                Reflect.deleteProperty(curs, key)
            }
        }
        return this
    }
    /**打开地图控件
     * @param ifDMS @default true 是否使用度分秒格式，否则显示度格式，默认精度为5
     * @returns 地图控件信息
     */
    public openControl(ifDMS: boolean = true): MapControlInfo {
        this.eventSwitch(true);
        const latlng = this.latLng = this.getCenter();
        this.ifDMS = ifDMS;
        this.controlInfo.lat = um_getLnglatByValue(latlng.lat, false, ifDMS);
        this.controlInfo.lng = um_getLnglatByValue(latlng.lng, true, ifDMS);
        this.setZoomAndScale();
        return this.controlInfo;
    }
    /**关闭地图控件 */
    public closeControl(): void {
        this.eventSwitch(false);
    }
    /**地图控件更新时触发
     * @param cb 回调函数
     */
    public onControlUpdate(cb: (info: MapControlInfo) => void): void {
        this.controlCb = cb;
    }
    /**切换控件经纬度格式
     * @param ifDMS 是否使用度分秒格式，否则显示度格式，默认精度为5
     * @returns 地图控件信息
     */
    public changeLatlngFormat(ifDMS: boolean): MapControlInfo {
        this.ifDMS = ifDMS;
        const { lat, lng } = this.latLng;
        this.controlInfo.lat = um_getLnglatByValue(lat, false, ifDMS);
        this.controlInfo.lng = um_getLnglatByValue(lng, true, ifDMS);
        this.setZoomAndScale();
        return this.controlInfo;
    }
    /**---------------leaflet地图的相关方法------------------- */
    /**初始化leaflet地图
     * @param ele 地图容器元素
     * @param opt 地图初始化参数
     * @returns LMap实例
     */
    private initLeaflet(ele: string, opt: Partial<MOpt>): Promise<LMap> {
        const { zoom = 11, minZoom = 2, maxZoom = 20, center: [lng, lat] = [114.12027, 22.68471], dragging = true, zoomControl = false, attributionControl = false, doubleClickZoom = false, closePopupOnClick = false } = opt;
        let param: MapOptions = {
            dragging,
            zoomControl,
            zoom,
            minZoom,
            maxZoom,
            center: latLng(lat, lng),
            attributionControl,
            doubleClickZoom,
            crs: CRS.EPSG3857,
            closePopupOnClick,//点击地图不关闭弹出层
        };
        let map = new LMap(ele, param);
        return Promise.resolve(map)
    }
    /**---------------maplibre地图的相关方法------------------- */
    /**初始化maplibre地图
     * @param ele 地图容器元素
     * @param opt 地图初始化参数
     * @returns maplibregl.Map实例
     */
    private async initMaplibre(ele: string, opt: Partial<MOpt>): Promise<MaplibreMap> {
        const { style = 'https://tiles.openfreemap.org/styles/bright', zoom = 11, minZoom = 2, maxZoom = 20, center: [lng, lat] = [114.12027, 22.68471], dragging = true, attributionControl = false, doubleClickZoom = false } = opt;
        let map = new MaplibreMap({
            container: ele,
            style,
            center: [lng, lat],
            zoom,
            minZoom,
            maxZoom,
            antialias: true,
            dragRotate: dragging,
            touchZoomRotate: false,
            doubleClickZoom,
            attributionControl: attributionControl ? undefined : false
        });
        map.on('style.load', () => { this.changeLanguage(false); });
        return Promise.resolve(map);
    }
    /**切换中英文 仅对maplibre地图生效
     * @param ifEn 是否切换英文
     */
    public changeLanguage(ifEn: boolean): void {
        const map = this.map;
        if (um_tsMapisMapLibre(map)) {
            const layers = map.getStyle().layers || [];
            const lang = ifEn ? 'en' : 'zh-Hans';
            layers.forEach((layer) => {
                if (layer.type === 'symbol' && layer.layout && 'text-field' in layer.layout) {
                    try {
                        const text = ['get', `name:${lang}`];
                        const textField = [
                            'case',
                            ['==', text, '台湾'], '台湾省',
                            ['==', text, 'Taiwan'], 'TaiWan Province',
                            text
                        ];
                        map.setLayoutProperty(layer.id, 'text-field', textField);
                    } catch (e) { }
                }
            });
        }
    }
    /**---------------高德地图的相关方法------------------- */
    /**初始化高德地图
     * @param ele 地图容器元素
     * @param opt 地图初始化参数
     * @returns AMap实例
     */
    private async initAmap(ele: string, opt: Partial<MOpt>): Promise<AMAP.Map> {
        const { zoom = 11, minZoom = 2, maxZoom = 20, center = [114.12027, 22.68471], dragging = true, zoomControl = false, attributionControl = false, doubleClickZoom = false, closePopupOnClick = false, showLabel = true } = opt;
        const { lat, lng } = um_togps84gcj02(center[0], center[1]);
        return AMapLoader.load({
            "key": "87e1b1e9aa88724f69208972546fdd57",   // 申请好的Web端开发者Key，首次调用 load 时必填
            "version": "1.4.15",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
            "plugins": ["Map3D"]  //插件列表
        }).then(() => {
            // initAMapUI();
            let map = new AMap.Map(ele, {
                // mask: mask,
                center: [lng, lat],
                disableSocket: true,
                viewMode: '2D',
                mapStyle: 'amap://styles/dfd45346264e1fa2bb3b796f36cab42a',
                skyColor: "#A3CCFF",
                lang: 'zh_cn',  //设置地图语言类型
                labelzIndex: 130,
                pitch: 40,
                zoom: zoom,
                zooms: [minZoom, maxZoom],
                dragEnable: dragging,
                doubleClickZoom: doubleClickZoom,
                keyboardEnable: false,
                isHotspot: false,
                showLabel,
                layers: [],
            });
            return map;
        })
    }
    /**--------------地图控件的相关方法------------------- */
    /**监听事件开关
     * @param flag 开启或关闭事件
     */
    private eventSwitch(flag: boolean): void {
        let key: 'on' | 'off' = flag ? 'on' : 'off';
        /**开启事件前需关闭事件防止多次添加 */
        if (flag) this.eventSwitch(false);
        this.map[key]('mousemove', (e) => this.setLatlng(e));
        this.map[key]('zoomend', () => this.setZoomAndScale());
        this.map[key]('moveend', () => this.setScale());
    }
    /**设置经纬度信息
     * @param e 鼠标事件
     */
    private setLatlng = (e: LeafletMouseEvent | AMapMapsEvent | MaplibreMouseEvent): void => {
        const lnglat = um_getLngLatByEvent(e);
        if (!lnglat) return;
        const [lng, lat] = lnglat;
        this.latLng.lat = lat;
        this.latLng.lng = lng;
        this.controlInfo.lat = um_getLnglatByValue(lat, false, this.ifDMS);
        this.controlInfo.lng = um_getLnglatByValue(lng, true, this.ifDMS);
        if (this.controlCb) this.controlCb(this.controlInfo);
    }
    /**设置地图层级和比例尺 */
    private setZoomAndScale(): void {
        if (!this.map) return;
        let zoom = this.getZoom();
        zoom = Number.isInteger(zoom) ? zoom : Number(zoom.toFixed(2));
        this.controlInfo.zoom = zoom;
        this.setScale();
    }
    /**设置地图比例尺 */
    private setScale(): void {
        if (!this.map) return;
        const { lat: averLat, lng: averLng } = this.getCenter();
        const [x, y] = um_getPointByLnglat(this.map, [averLng, averLat]);
        const point: [number, number] = [x + 50, y];
        const targetLngLat = um_getLngLatByPoint(this.map, point);
        /**计算距离中心点 50px 对应的实际距离（米） */
        let dis = um_getDistance([averLng, averLat], targetLngLat, this.map);
        let text = '';
        if (dis > 2000) {
            dis = dis / 1852;
            text = 'nm';
        } else {
            text = 'm';
        }
        const num = this.getScaleNum(dis);
        this.controlInfo.width = Math.round(50 * num / dis) + 'px';
        this.controlInfo.scale = Math.round(num) + text;
        if (this.controlCb) this.controlCb(this.controlInfo);
    }
    /**取整比例尺
     * @param num 距离（米）
     * @returns 取整后的比例尺（米）
     */
    private getScaleNum(num: number): number {
        if (num < 1) return 1;
        if (num <= 10) return Math.ceil(num / 2) * 2;
        const power = Math.pow(10, Math.floor(Math.log10(num)));
        let leading = num / power;
        if (leading <= 2) return Math.ceil(leading * 2) / 2 * power;
        if (leading <= 5) return Math.ceil(leading) * power;
        return Math.ceil(leading / 5) * 5 * power;
    }
}

// =============== 类型约束 ===============

/**地图配置项 */
export interface MOpt {
    /**地图的类型 @param L leaflet插件 @param A 高德地图 @param B 百度地图 @param M maplibre地图 @default L */
    type: 'L' | 'A' | 'B' | 'M',
    /**地图中心点 [lng, lat] @default [114.12027, 22.68471] */
    center: [number, number],
    /**地图初始层级 @default 11 */
    zoom: number,
    /**最小层级 @default 2 */
    minZoom: number,
    /**最大层级 @default 20 */
    maxZoom: number,
    /**是否启用拖拽功能 @default true */
    dragging: boolean,
    /**是否显示层级控制器 @default false */
    zoomControl: boolean,
    /**是否显示属性控制器 @default false */
    attributionControl: boolean,
    /**是否启用双击放大层级 @default false */
    doubleClickZoom: boolean,
    /**是否点击关闭弹窗 @default false */
    closePopupOnClick: boolean,
    /**是否显示标签(省会、地名等)，仅适用于高德地图 @default true */
    showLabel: boolean,
    /**maplibre地图样式，支持url或json自定义样式 */
    style?: string | StyleSpecification,
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