import * as L from "leaflet";
import 'proj4leaflet';
import { u_mapTogps84bd09, u_mapTogps84gcj02 } from "../utils/slu-map";
'use strict';
/**坐标转换关键代码(加载后GridLayer自行转换) */
(function (window, document) {
    L.GridLayer.include({
        _setZoomTransform: function (level: any, _center: { lng: number, lat: number }, zoom: number) {
            var center = _center;
            if (center != undefined && this.options) {
                if (this.options.corrdType == 'gcj02') {
                    center = u_mapTogps84gcj02(_center.lng, _center.lat);
                } else if (this.options.corrdType == 'bd09') {
                    center = u_mapTogps84bd09(_center.lng, _center.lat);
                }
            }
            var scale = this._map.getZoomScale(zoom, level.zoom),
                translate = level.origin.multiplyBy(scale)
                    .subtract(this._map._getNewPixelOrigin(center, zoom)).round();

            if (L.Browser.any3d) {
                L.DomUtil.setTransform(level.el, translate, scale);
            } else {
                L.DomUtil.setPosition(level.el, translate);
            }
        },
        _getTiledPixelBounds: function (_center: { lng: number, lat: number }) {
            var center = _center;
            if (center != undefined && this.options) {
                if (this.options.corrdType == 'gcj02') {
                    center = u_mapTogps84gcj02(_center.lng, _center.lat);
                } else if (this.options.corrdType == 'bd09') {
                    center = u_mapTogps84bd09(_center.lng, _center.lat);
                }
            }
            var map = this._map,
                mapZoom = map._animatingZoom ? Math.max(map._animateToZoom, map.getZoom()) : map.getZoom(),
                scale = map.getZoomScale(mapZoom, this._tileZoom),
                pixelCenter = map.project(center, this._tileZoom).floor(),
                halfSize = map.getSize().divideBy(scale * 2);
            return new L.Bounds(pixelCenter.subtract(halfSize), pixelCenter.add(halfSize));
        }
    })
}(this, document))
/**地图的名称
 * tianDiTu 天地图 gaoDe 高德 baiDu 百度 google 谷歌 
 * Normal 矢量地图 Satellite 卫星图
 * Map地图 Annotion地名
 */
export enum SLEMap {
    tianDiTuNormalMap = 'TianDiTu.Normal.Map',
    tianDiTuNormalAnnotion = 'TianDiTu.Normal.Annotion',
    tianDiTuSatelliteMap = 'TianDiTu.Satellite.Map',
    tianDiTuSatelliteAnnotion = 'TianDiTu.Satellite.Annotion',
    tianDiTuTerrainMap = 'TianDiTu.Terrain.Map',
    tianDiTuTerrainAnnotion = 'TianDiTu.Terrain.Annotion',
    /**gaoDe 高德*/
    gaoDeNormalMap = 'GaoDe.Normal.Map',
    gaoDeSatelliteMap = 'GaoDe.Satellite.Map',
    gaoDeSatelliteAnnotion = 'GaoDe.Satellite.Annotion',
    /**百度 */
    baiDuNormalMap = 'Baidu.Normal.Map',
    baiDuSatelliteMap = 'Baidu.Satellite.Map',
    baiDuSatelliteAnnotion = 'Baidu.Satellite.Annotion',
    /**谷歌 */
    googleNormalMap = 'Google.Normal.Map',
    googleSatelliteMap = 'Google.Satellite.Map',
    googleSatelliteAnnotion = 'Google.Satellite.Annotion',

    geoqNormalMap = 'Geoq.Normal.Map',
    geoqNormalPurplishBlue = 'Geoq.Normal.PurplishBlue',
    geoqNormalGray = 'Geoq.Normal.Gray',
    geoqNormalWarm = 'Geoq.Normal.Warm',
    geoqThemeHydro = 'Geoq.Theme.Hydro',

    oSMNormalMap = 'OSM.Normal.Map',
}
/**网络地图图层配置项 */
export interface SLPMapLeafletLayer extends L.TileLayerOptions {
    /**个人地图凭证token */
    key?: string;
    /**地图采用的坐标系信息(根据地图名称自动匹配) */
    corrdType?: string;
}
/**加载网络地图 并通过坐标转换使瓦片偏移解决地图偏移问题 
 * @param name 网络地图名称SLEMap
 * @param options 地图配置
 */
export class SLULeafletNetMap {
    constructor(name: SLEMap, options?: SLPMapLeafletLayer) {
        this.setMapProvider(name, options);
    }
    private map!: L.Map;
    /**地图图层 */
    private mapLayer!: L.Layer;
    /**将图层添加到map显示在页面 */
    public addTo(map: L.Map) {
        if (!map) return this;
        this.map = map;
        this.mapLayer?.addTo(this.map)
        return this;
    }
    /**从map中移除当前图层 */
    public remove() {
        this.mapLayer?.remove();
        return this;
    }
    /**变更当前图层并添加到map中 */
    public changeMap(name: SLEMap, options?: SLPMapLeafletLayer) {
        this.remove();
        this.setMapProvider(name, options);
        this.addTo(this.map);
        return this;
    }
    /**设置map的地图来源，名称，类型 */
    private setMapProvider(name: SLEMap, options?: SLPMapLeafletLayer) { // (type, Object)
        options = options || {}
        let parts = name.split('.'), mapSource = parts[0], mapName = parts[1], mapType = parts[2];
        let url = MAPINFO[mapSource][mapName][mapType];
        options.subdomains = MAPINFO[mapSource].Subdomains;
        options.key = options.key || MAPINFO[mapSource].key;
        options.corrdType = this.getCorrdType(mapSource);
        if ('tms' in MAPINFO[mapSource]) {
            options.tms = MAPINFO[mapSource]['tms']
        }
        this.mapLayer = new L.TileLayer(url, options);
    }
    /**获取坐标转换类型*/
    private getCorrdType(name: string) {
        var zbName = "wgs84"
        switch (name) {
            case "Geoq":
            case "GaoDe":
            case "Google":
                zbName = "gcj02";
                break;
            case "Baidu":
                zbName = "bd09";
                break;
            case "OSM":
            case "TianDiTu":
                zbName = "wgs84";
                break;
        }
        return zbName;
    }
}
/**地图信息 S子域 X经度 Y纬度 Z层级 */
const MAPINFO: any = {
    TianDiTu: {
        Normal: {
            Map: "//t{s}.tianditu.com/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk={key}",
            Annotion: "//t{s}.tianditu.com/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk={key}",
            AnnotionEn: "//t{s}.tianditu.com/DataServer?T=eva_w&X={x}&Y={y}&L={z}&tk={key}"
        },
        Satellite: {
            Map: "//t{s}.tianditu.com/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk={key}",
            Annotion: "//t{s}.tianditu.com/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk={key}"
        },
        Terrain: {
            Map: "//t{s}.tianditu.com/DataServer?T=ter_w&X={x}&Y={y}&L={z}&tk={key}",
            Annotion: "//t{s}.tianditu.com/DataServer?T=cta_w&X={x}&Y={y}&L={z}&tk={key}"
        },
        // Subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        Subdomains: ['1'],
        key: "a9e2dd65c94fab979c9d897ff7098a4c"
    },
    GaoDe: {
        Normal: {
            Map: '//webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
        },
        Satellite: {
            Map: '//webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
            Annotion: '//webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}'
        },
        Subdomains: ["1", "2", "3", "4"]
    },
    Google: {
        Normal: {
            Map: "//www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
        },
        Satellite: {
            Map: "//www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}",
            Annotion: "//www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}"
        },
        Subdomains: []
    },
    Geoq: {
        Normal: {
            Map: "//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}",
            PurplishBlue: "//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
            Gray: "//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}",
            Warm: "//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}",
        },
        Theme: {
            Hydro: "//thematic.geoq.cn/arcgis/rest/services/ThematicMaps/WorldHydroMap/MapServer/tile/{z}/{y}/{x}"
        },
        Subdomains: []
    },
    OSM: {
        Normal: {
            Map: "//{s}.tile.osm.org/{z}/{x}/{y}.png",
        },
        Subdomains: ['a', 'b', 'c']
    },
    Baidu: {
        Normal: {
            Map: '//online{s}.map.bdimg.com/onlinelabel/qt=tile&x={x}&y={y}&z={z}'
        },
        Satellite: {
            Map: '//online{s}.map.bdimg.com/starpic/?qt=satepc&u=x={x}&y={y}&z={z};v=009;type=sate&fm=46&app=webearth2&v=009&udt=20231212',
            Annotion: '//online{s}.map.bdimg.com/starpic/?qt=satepc&u=x={x}&y={y}&z={z};v=009;type=sate&fm=46&app=webearth2&v=009&udt=20231212'
        },
        Subdomains: '0123456789',
        tms: true
    }
}