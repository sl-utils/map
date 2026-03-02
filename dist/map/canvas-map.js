"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLUMap = void 0;
const leaflet_1 = require("leaflet");
const AMapLoader = require("@amap/amap-jsapi-loader");
const leaflet_2 = require("../leaflet");
class SLUMap {
    constructor(ele, options = {}) {
        this.curs = Object.create(null);
        this.createMap(ele, options);
    }
    showMap(names = []) {
        const { map, curs } = this;
        if (map && map instanceof leaflet_1.Map) {
            let mapSource = names[0].split('.')[0];
            let center = map.getCenter();
            let zoom = map.getZoom();
            map.options.crs = mapSource === 'Baidu' ? leaflet_2.SLCRS.Baidu : leaflet_1.CRS.EPSG3857;
            map._resetView(center, zoom, true);
            names?.forEach(name => {
                if (curs[name])
                    return;
                let net = new leaflet_2.SLULeafletNetMap(name);
                net.addTo(map);
                curs[name] = net;
            });
            for (const key in curs) {
                let name = key;
                let flag = names.includes(name);
                if (flag)
                    continue;
                curs[name].remove();
                Reflect.deleteProperty(curs, key);
            }
        }
        return this;
    }
    async createMap(ele, options) {
        const { type } = options;
        let map;
        switch (type) {
            case "A":
                this.map = await this.initAmap(ele, options);
                break;
            default:
                this.map = await this.initLeaflet(ele, options);
                this.showMap([leaflet_2.SLEMap.tianDiTuNormalMap, leaflet_2.SLEMap.tianDiTuNormalAnnotion]);
                break;
        }
    }
    initLeaflet(ele, opt) {
        const { zoom = 11, minZoom = 2, maxZoom = 20, center: [lat, lng] = [22.68471, 114.12027], dragging = true, zoomControl = false, attributionControl = false, doubleClickZoom = false, closePopupOnClick = false } = opt;
        let param = {
            dragging,
            zoomControl,
            zoom,
            minZoom,
            maxZoom,
            center: (0, leaflet_1.latLng)(lat, lng),
            attributionControl,
            doubleClickZoom,
            crs: leaflet_1.CRS.EPSG3857,
            closePopupOnClick,
        };
        let map = new leaflet_1.Map(ele, param);
        return Promise.resolve(map);
    }
    async initAmap(ele, opt) {
        const { zoom = 11, minZoom = 2, maxZoom = 20, center: [lat, lng] = [22.68471, 114.12027], dragging = true, zoomControl = false, attributionControl = false, doubleClickZoom = false, closePopupOnClick = false, showLabel = true } = opt;
        return AMapLoader.load({
            "key": "87e1b1e9aa88724f69208972546fdd57",
            "version": "1.4.15",
            "plugins": ["Map3D"]
        }).then(() => {
            let map = new AMap.Map(ele, {
                center: [lng, lat],
                disableSocket: true,
                viewMode: '2D',
                mapStyle: 'amap://styles/dfd45346264e1fa2bb3b796f36cab42a',
                skyColor: "#A3CCFF",
                lang: 'zh_cn',
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
        });
    }
}
exports.SLUMap = SLUMap;
//# sourceMappingURL=canvas-map.js.map