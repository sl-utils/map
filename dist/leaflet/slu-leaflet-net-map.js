"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLULeafletNetMap = exports.SLEMap = void 0;
const L = require("leaflet");
require("proj4leaflet");
const slu_map_1 = require("../utils/slu-map");
'use strict';
(function (window, document) {
    L.GridLayer.include({
        _setZoomTransform: function (level, _center, zoom) {
            var center = _center;
            if (center != undefined && this.options) {
                if (this.options.corrdType == 'gcj02') {
                    center = (0, slu_map_1.u_mapTogps84gcj02)(_center.lng, _center.lat);
                }
                else if (this.options.corrdType == 'bd09') {
                    center = (0, slu_map_1.u_mapTogps84bd09)(_center.lng, _center.lat);
                }
            }
            var scale = this._map.getZoomScale(zoom, level.zoom), translate = level.origin.multiplyBy(scale)
                .subtract(this._map._getNewPixelOrigin(center, zoom)).round();
            if (L.Browser.any3d) {
                L.DomUtil.setTransform(level.el, translate, scale);
            }
            else {
                L.DomUtil.setPosition(level.el, translate);
            }
        },
        _getTiledPixelBounds: function (_center) {
            var center = _center;
            if (center != undefined && this.options) {
                if (this.options.corrdType == 'gcj02') {
                    center = (0, slu_map_1.u_mapTogps84gcj02)(_center.lng, _center.lat);
                }
                else if (this.options.corrdType == 'bd09') {
                    center = (0, slu_map_1.u_mapTogps84bd09)(_center.lng, _center.lat);
                }
            }
            var map = this._map, mapZoom = map._animatingZoom ? Math.max(map._animateToZoom, map.getZoom()) : map.getZoom(), scale = map.getZoomScale(mapZoom, this._tileZoom), pixelCenter = map.project(center, this._tileZoom).floor(), halfSize = map.getSize().divideBy(scale * 2);
            return new L.Bounds(pixelCenter.subtract(halfSize), pixelCenter.add(halfSize));
        }
    });
}(this, document));
var SLEMap;
(function (SLEMap) {
    SLEMap["tianDiTuNormalMap"] = "TianDiTu.Normal.Map";
    SLEMap["tianDiTuNormalAnnotion"] = "TianDiTu.Normal.Annotion";
    SLEMap["tianDiTuSatelliteMap"] = "TianDiTu.Satellite.Map";
    SLEMap["tianDiTuSatelliteAnnotion"] = "TianDiTu.Satellite.Annotion";
    SLEMap["tianDiTuTerrainMap"] = "TianDiTu.Terrain.Map";
    SLEMap["tianDiTuTerrainAnnotion"] = "TianDiTu.Terrain.Annotion";
    SLEMap["gaoDeNormalMap"] = "GaoDe.Normal.Map";
    SLEMap["gaoDeSatelliteMap"] = "GaoDe.Satellite.Map";
    SLEMap["gaoDeSatelliteAnnotion"] = "GaoDe.Satellite.Annotion";
    SLEMap["baiDuNormalMap"] = "Baidu.Normal.Map";
    SLEMap["baiDuSatelliteMap"] = "Baidu.Satellite.Map";
    SLEMap["baiDuSatelliteAnnotion"] = "Baidu.Satellite.Annotion";
    SLEMap["googleNormalMap"] = "Google.Normal.Map";
    SLEMap["googleSatelliteMap"] = "Google.Satellite.Map";
    SLEMap["googleSatelliteAnnotion"] = "Google.Satellite.Annotion";
    SLEMap["geoqNormalMap"] = "Geoq.Normal.Map";
    SLEMap["geoqNormalPurplishBlue"] = "Geoq.Normal.PurplishBlue";
    SLEMap["geoqNormalGray"] = "Geoq.Normal.Gray";
    SLEMap["geoqNormalWarm"] = "Geoq.Normal.Warm";
    SLEMap["geoqThemeHydro"] = "Geoq.Theme.Hydro";
    SLEMap["oSMNormalMap"] = "OSM.Normal.Map";
})(SLEMap || (exports.SLEMap = SLEMap = {}));
class SLULeafletNetMap {
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
        options = options || {};
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
        var zbName = "wgs84";
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
exports.SLULeafletNetMap = SLULeafletNetMap;
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