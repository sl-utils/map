import { CRS, Map as LMap, LatLng, LeafletMouseEvent, MapOptions, latLng } from "leaflet";
import * as AMapLoader from '@amap/amap-jsapi-loader';
import { MapNameType, SLULeafletNetMap } from '../leaflet';
import { u_mapGetBounds, u_mapGetDistance, u_mapGetLatLngByEvent, u_mapGetLatLngByPoint, u_mapGetLatlngByValue, u_mapGetMapSize, u_mapGetPointByLatlng, u_mapSetFitBounds, u_mapSetViewCenter, u_mapTogcj02gps84, u_mapTogps84gcj02, u_tsIsKeyOf, u_tsMapisAmap, u_tsMapisLeaflet, u_tsMapisMapLibre } from "../utils/slu-map";
import { AMapMapsEvent, MapBounds, MapControlInfo, MapLatLng, OptMap } from "@sl-utils/map";
import { Map as MaplibreMap, LngLat as MaplibreLngLat, MapMouseEvent as MaplibreMouseEvent } from 'maplibre-gl';
declare var AMap: any;
/**地图
 * @constructor
 * @param ele 地图容器元素
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
    public async init(options: Partial<OptMap> = {}): Promise<void> {
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
     * @param latlngs 纬度经度数组
     * @returns SLUMap实例
     */
    public setFitView(latlngs: [number, number][]): SLUMap {
        if (this._map) {
            u_mapSetFitBounds(this._map, latlngs);
        }
        return this
    }
    /**
     * 设置地图中心
     * @param center 中心 latlng顺序
     * @param zoom 缩放级别
     * @param offset 中心 但需要偏移固定像素
     */
    public setCenter(center: [number, number], zoom: number, offset?: [number, number]): void {
        u_mapSetViewCenter(this._map, center, zoom, offset);
    }
    /**获取地图边界
     * @returns 地图边界信息
     */
    public getBound(): MapBounds {
        return u_mapGetBounds(this._map);
    }
    /**获取地图中心
     * @returns 地图中心
     */
    public getCenter(): LatLng | AMAP.LngLat | MaplibreLngLat {
        const center = this.map.getCenter();
        if (u_tsMapisAmap(this.map)) {
            const { lat, lng } = u_mapTogcj02gps84(center.lng, center.lat);
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
        return u_mapGetMapSize(this._map);
    }
    /**显示指定的网络图层
     * @param names @default [] 网络图层名称数组
     * @returns SLUMap实例
     */
    public showMap(names: Array<MapNameType> = []): SLUMap {
        const { map, curs } = this;
        if (map && u_tsMapisLeaflet(map)) {
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
                if (!u_tsIsKeyOf(curs, key)) continue;
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
        this.controlInfo.lat = u_mapGetLatlngByValue(latlng.lat, false, ifDMS);
        this.controlInfo.lng = u_mapGetLatlngByValue(latlng.lng, true, ifDMS);
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
        this.controlInfo.lat = u_mapGetLatlngByValue(lat, false, ifDMS);
        this.controlInfo.lng = u_mapGetLatlngByValue(lng, true, ifDMS);
        this.setZoomAndScale();
        return this.controlInfo;
    }
    /**---------------leaflet地图的相关方法------------------- */
    /**初始化leaflet地图
     * @param ele 地图容器元素
     * @param opt 地图初始化参数
     * @returns LMap实例
     */
    private initLeaflet(ele: string, opt: Partial<OptMap>): Promise<LMap> {
        const { zoom = 11, minZoom = 2, maxZoom = 20, center: [lat, lng] = [22.68471, 114.12027], dragging = true, zoomControl = false, attributionControl = false, doubleClickZoom = false, closePopupOnClick = false } = opt;
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
    private async initMaplibre(ele: string, opt: Partial<OptMap>): Promise<MaplibreMap> {
        const { style, zoom = 11, minZoom = 2, maxZoom = 20, center: [lat, lng] = [22.68471, 114.12027], dragging = true, attributionControl = false, doubleClickZoom = false } = opt;
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
        if (u_tsMapisMapLibre(map)) {
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
    private async initAmap(ele: string, opt: Partial<OptMap>): Promise<AMAP.Map> {
        const { zoom = 11, minZoom = 2, maxZoom = 20, center = [22.68471, 114.12027], dragging = true, zoomControl = false, attributionControl = false, doubleClickZoom = false, closePopupOnClick = false, showLabel = true } = opt;
        const { lat, lng } = u_mapTogps84gcj02(center[1], center[0]);
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
        const latlng = u_mapGetLatLngByEvent(e);
        if (!latlng) return;
        const [lat, lng] = latlng;
        this.latLng.lat = lat;
        this.latLng.lng = lng;
        this.controlInfo.lat = u_mapGetLatlngByValue(lat, false, this.ifDMS);
        this.controlInfo.lng = u_mapGetLatlngByValue(lng, true, this.ifDMS);
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
        const [x, y] = u_mapGetPointByLatlng(this.map, [averLat, averLng]);
        const point: [number, number] = [x + 50, y];
        const targetLatLng = u_mapGetLatLngByPoint(this.map, point);
        /**计算距离中心点 50px 对应的实际距离（米） */
        let dis = u_mapGetDistance([averLat, averLng], targetLatLng, this.map);
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

