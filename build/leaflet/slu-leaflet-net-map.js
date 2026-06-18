import * as L from "leaflet";
import 'proj4leaflet';
import { u_mapTogps84bd09, u_mapTogps84gcj02 } from "../utils/slu-map";
'use strict';
(function (window, document) {
    L.GridLayer.include({
        _setZoomTransform: function (level, _center, zoom) {
            let center = _center;
            if (center != undefined && this.options) {
                if (this.options.corrdType == 'gcj02') {
                    center = u_mapTogps84gcj02(_center.lng, _center.lat);
                }
                else if (this.options.corrdType == 'bd09') {
                    center = u_mapTogps84bd09(_center.lng, _center.lat);
                }
            }
            const scale = this._map.getZoomScale(zoom, level.zoom), translate = level.origin.multiplyBy(scale)
                .subtract(this._map._getNewPixelOrigin(center, zoom)).round();
            if (L.Browser.any3d) {
                L.DomUtil.setTransform(level.el, translate, scale);
            }
            else {
                L.DomUtil.setPosition(level.el, translate);
            }
        },
        _getTiledPixelBounds: function (_center) {
            let center = _center;
            if (center != undefined && this.options) {
                if (this.options.corrdType == 'gcj02') {
                    center = u_mapTogps84gcj02(_center.lng, _center.lat);
                }
                else if (this.options.corrdType == 'bd09') {
                    center = u_mapTogps84bd09(_center.lng, _center.lat);
                }
            }
            const map = this._map, mapZoom = map._animatingZoom ? Math.max(map._animateToZoom, map.getZoom()) : map.getZoom(), scale = map.getZoomScale(mapZoom, this._tileZoom), pixelCenter = map.project(center, this._tileZoom).floor(), halfSize = map.getSize().divideBy(scale * 2);
            return new L.Bounds(pixelCenter.subtract(halfSize), pixelCenter.add(halfSize));
        }
    });
}(this, document));
export var MapNameType;
(function (MapNameType) {
    MapNameType["tianDiTuNormalMap"] = "TianDiTu.Normal.Map";
    MapNameType["tianDiTuNormalAnnotion"] = "TianDiTu.Normal.Annotion";
    MapNameType["tianDiTuSatelliteMap"] = "TianDiTu.Satellite.Map";
    MapNameType["tianDiTuSatelliteAnnotion"] = "TianDiTu.Satellite.Annotion";
    MapNameType["tianDiTuTerrainMap"] = "TianDiTu.Terrain.Map";
    MapNameType["tianDiTuTerrainAnnotion"] = "TianDiTu.Terrain.Annotion";
    MapNameType["gaoDeNormalMap"] = "GaoDe.Normal.Map";
    MapNameType["gaoDeSatelliteMap"] = "GaoDe.Satellite.Map";
    MapNameType["gaoDeSatelliteAnnotion"] = "GaoDe.Satellite.Annotion";
    MapNameType["baiDuNormalMap"] = "Baidu.Normal.Map";
    MapNameType["baiDuSatelliteMap"] = "Baidu.Satellite.Map";
    MapNameType["baiDuSatelliteAnnotion"] = "Baidu.Satellite.Annotion";
    MapNameType["googleNormalMap"] = "Google.Normal.Map";
    MapNameType["googleSatelliteMap"] = "Google.Satellite.Map";
    MapNameType["googleSatelliteAnnotion"] = "Google.Satellite.Annotion";
    MapNameType["geoqNormalMap"] = "Geoq.Normal.Map";
    MapNameType["geoqNormalPurplishBlue"] = "Geoq.Normal.PurplishBlue";
    MapNameType["geoqNormalGray"] = "Geoq.Normal.Gray";
    MapNameType["geoqNormalWarm"] = "Geoq.Normal.Warm";
    MapNameType["geoqThemeHydro"] = "Geoq.Theme.Hydro";
    MapNameType["oSMNormalMap"] = "OSM.Normal.Map";
})(MapNameType || (MapNameType = {}));
export class SLULeafletNetMap {
    constructor(name, options) {
        this.setMapProvider(name, options);
    }
    addTo(map) {
        if (!map)
            return this;
        this.map = map;
        this.mapLayer?.addTo(this.map);
        return this;
    }
    remove() {
        this.mapLayer?.remove();
        return this;
    }
    changeMap(name, options) {
        this.remove();
        this.setMapProvider(name, options);
        this.addTo(this.map);
        return this;
    }
    setMapProvider(name, options) {
        options = options || Object.assign({});
        let parts = name.split('.'), mapSource = parts[0], mapName = parts[1], mapType = parts[2];
        let url = MAPINFO[mapSource][mapName][mapType];
        options.subdomains = MAPINFO[mapSource].Subdomains;
        options.key = options.key || MAPINFO[mapSource].key;
        options.corrdType = this.getCorrdType(mapSource);
        if ('tms' in MAPINFO[mapSource]) {
            options.tms = MAPINFO[mapSource]['tms'];
        }
        this.mapLayer = new L.TileLayer(url, options);
    }
    getCorrdType(name) {
        let zbName = "wgs84";
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
const MAPINFO = {
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
};
//# sourceMappingURL=slu-leaflet-net-map.js.map