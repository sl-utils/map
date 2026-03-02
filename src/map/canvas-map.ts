import { CRS, Map, latLng } from "leaflet";
import * as AMapLoader from '@amap/amap-jsapi-loader';
import { SLCRS, SLEMap, SLULeafletNetMap } from '../leaflet';
declare var AMap: any;

export class SLUMap {
    constructor(ele: string)
    constructor(ele: string)
    constructor(ele: string, options: Partial<SLSMapOpt> = {}) {
        this.createMap(ele, options)
    }

    private map: L.Map | AMAP.Map;
    /**当前正在显示的网络图层 */
    private curs: Partial<{ [key in SLEMap]: SLULeafletNetMap | undefined }> = Object.create(null);

    /**显示指定的网络图层 */
    public showMap(names: Array<SLEMap> = []): this {
        const { map, curs } = this;
        if (map && map instanceof Map) {
            let mapSource: string = names[0].split('.')[0]
            let center = map.getCenter();
            let zoom = map.getZoom();
            map.options.crs = mapSource === 'Baidu' ? SLCRS.Baidu : CRS.EPSG3857; // 根据图层坐标系设置
            (map as any)._resetView(center, zoom, true);
            names?.forEach(name => {
                if (curs[name]) return;
                let net = new SLULeafletNetMap(name)
                net.addTo(map);
                curs[name] = net;
            });
            for (const key in curs) {
                let name: SLEMap = key as SLEMap;
                let flag = names.includes(name);
                if (flag) continue;
                curs[name].remove();
                Reflect.deleteProperty(curs, key)
            }
        }
        return this
    }
    private async createMap(ele: string, options: Partial<SLSMapOpt>) {
        const { type } = options;
        let map: L.Map | AMAP.Map;
        switch (type) {
            case "A": this.map = await this.initAmap(ele, options); break;
            default: this.map = await this.initLeaflet(ele, options);
                this.showMap([SLEMap.tianDiTuNormalMap, SLEMap.tianDiTuNormalAnnotion]);
                break;
        }
    }
    /**---------------leaflet地图的相关方法------------------- */
    private initLeaflet(ele: string, opt: Partial<SLSMapOpt>) {
        const { zoom = 11, minZoom = 2, maxZoom = 20, center: [lat, lng] = [22.68471, 114.12027], dragging = true, zoomControl = false, attributionControl = false, doubleClickZoom = false, closePopupOnClick = false } = opt;
        let param: L.MapOptions = {
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
        let map = new Map(ele, param);
        return Promise.resolve(map)
    }
    /**---------------高德地图的相关方法------------------- */
    private async initAmap(ele: string, opt: Partial<SLSMapOpt>) {
        const { zoom = 11, minZoom = 2, maxZoom = 20, center: [lat, lng] = [22.68471, 114.12027], dragging = true, zoomControl = false, attributionControl = false, doubleClickZoom = false, closePopupOnClick = false, showLabel = true } = opt;
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
}

interface SLSMapOpt {
    /**地图的类型 @param L leaflet插件 @param A 高德地图 @param B 百度地图  @default L*/
    type: 'L' | 'A' | 'B',
    /**地图中心点 [lat,lng] @default [22.68471,114.12027] */
    center: [number, number],
    /**地图初始层级 @default 11*/
    zoom: number,
    /**最小层级 @default 2*/
    minZoom: number,
    /**最大层级 @default 20*/
    maxZoom: number,
    /**拖拽功能 @default true */
    dragging: boolean,
    /**显示层级控制器 @default false */
    zoomControl: boolean,
    /**显示属性控制器 @default false */
    attributionControl: boolean,
    /**双击放大层级 @default false */
    doubleClickZoom: boolean,
    /**点击关闭弹窗 @default false */
    closePopupOnClick: boolean,
    /**显示标签(省会、地名等) @param AMap @default true  */
    showLabel: boolean,
}