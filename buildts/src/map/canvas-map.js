"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLUMap = void 0;
const leaflet_1 = require("leaflet");
const AMapLoader = __importStar(require("@amap/amap-jsapi-loader"));
const leaflet_2 = require("../leaflet");
const slu_map_1 = require("../utils/slu-map");
const maplibre_gl_1 = require("maplibre-gl");
class SLUMap {
    constructor(ele) {
        this.controlInfo = Object.create({});
        this.ifDMS = true;
        this.curs = Object.create(null);
        this.setLatlng = (e) => {
            const latlng = (0, slu_map_1.u_mapGetLatLngByEvent)(e);
            if (!latlng)
                return;
            const [lat, lng] = latlng;
            this.latLng.lat = lat;
            this.latLng.lng = lng;
            this.controlInfo.lat = (0, slu_map_1.u_mapGetLatlngByValue)(lat, false, this.ifDMS);
            this.controlInfo.lng = (0, slu_map_1.u_mapGetLatlngByValue)(lng, true, this.ifDMS);
            if (this.controlCb)
                this.controlCb(this.controlInfo);
        };
        this.ele = ele;
    }
    get map() {
        return this._map;
    }
    async init(options = {}) {
        const { type } = options, ele = this.ele;
        switch (type) {
            case "A":
                this._map = await this.initAmap(ele, options);
                break;
            case "M":
                this._map = await this.initMaplibre(ele, options);
                break;
            default:
                this._map = await this.initLeaflet(ele, options);
                this.showMap([leaflet_2.MapNameType.tianDiTuNormalMap, leaflet_2.MapNameType.tianDiTuNormalAnnotion]);
                break;
        }
    }
    setFitView(latlngs) {
        if (this._map) {
            (0, slu_map_1.u_mapSetFitBounds)(this._map, latlngs);
        }
        return this;
    }
    setCenter(center, zoom, offset) {
        (0, slu_map_1.u_mapSetViewCenter)(this._map, center, zoom, offset);
    }
    getBound() {
        return (0, slu_map_1.u_mapGetBounds)(this._map);
    }
    getCenter() {
        const center = this.map.getCenter();
        if ((0, slu_map_1.u_tsMapisAmap)(this.map)) {
            const { lat, lng } = (0, slu_map_1.u_mapTogcj02gps84)(center.lng, center.lat);
            return new AMap.LngLat(lng, lat);
        }
        return center;
    }
    getZoom() {
        return this.map.getZoom();
    }
    getSize() {
        return (0, slu_map_1.u_mapGetMapSize)(this._map);
    }
    showMap(names = []) {
        const { map, curs } = this;
        if (map && (0, slu_map_1.u_tsMapisLeaflet)(map)) {
            let mapSource = names[0].split('.')[0];
            let center = map.getCenter();
            let zoom = map.getZoom();
            map.setView(center, zoom, { animate: false });
            names?.forEach(name => {
                if (curs[name])
                    return;
                let net = new leaflet_2.SLULeafletNetMap(name);
                net.addTo(map);
                curs[name] = net;
            });
            for (const key of Object.keys(curs)) {
                if (!(0, slu_map_1.u_tsIsKeyOf)(curs, key))
                    continue;
                let name = key;
                let flag = names.includes(name);
                if (flag)
                    continue;
                curs[name]?.remove();
                Reflect.deleteProperty(curs, key);
            }
        }
        return this;
    }
    openControl(ifDMS = true) {
        this.eventSwitch(true);
        const latlng = this.latLng = this.getCenter();
        this.ifDMS = ifDMS;
        this.controlInfo.lat = (0, slu_map_1.u_mapGetLatlngByValue)(latlng.lat, false, ifDMS);
        this.controlInfo.lng = (0, slu_map_1.u_mapGetLatlngByValue)(latlng.lng, true, ifDMS);
        this.setZoomAndScale();
        return this.controlInfo;
    }
    closeControl() {
        this.eventSwitch(false);
    }
    onControlUpdate(cb) {
        this.controlCb = cb;
    }
    changeLatlngFormat(ifDMS) {
        this.ifDMS = ifDMS;
        const { lat, lng } = this.latLng;
        this.controlInfo.lat = (0, slu_map_1.u_mapGetLatlngByValue)(lat, false, ifDMS);
        this.controlInfo.lng = (0, slu_map_1.u_mapGetLatlngByValue)(lng, true, ifDMS);
        this.setZoomAndScale();
        return this.controlInfo;
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
    async initMaplibre(ele, opt) {
        const { style, zoom = 11, minZoom = 2, maxZoom = 20, center: [lat, lng] = [22.68471, 114.12027], dragging = true, attributionControl = false, doubleClickZoom = false } = opt;
        let map = new maplibre_gl_1.Map({
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
    changeLanguage(ifEn) {
        const map = this.map;
        if ((0, slu_map_1.u_tsMapisMapLibre)(map)) {
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
                    }
                    catch (e) { }
                }
            });
        }
    }
    async initAmap(ele, opt) {
        const { zoom = 11, minZoom = 2, maxZoom = 20, center = [22.68471, 114.12027], dragging = true, zoomControl = false, attributionControl = false, doubleClickZoom = false, closePopupOnClick = false, showLabel = true } = opt;
        const { lat, lng } = (0, slu_map_1.u_mapTogps84gcj02)(center[1], center[0]);
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
    eventSwitch(flag) {
        let key = flag ? 'on' : 'off';
        if (flag)
            this.eventSwitch(false);
        this.map[key]('mousemove', (e) => this.setLatlng(e));
        this.map[key]('zoomend', () => this.setZoomAndScale());
        this.map[key]('moveend', () => this.setScale());
    }
    setZoomAndScale() {
        if (!this.map)
            return;
        let zoom = this.getZoom();
        zoom = Number.isInteger(zoom) ? zoom : Number(zoom.toFixed(2));
        this.controlInfo.zoom = zoom;
        this.setScale();
    }
    setScale() {
        if (!this.map)
            return;
        const { lat: averLat, lng: averLng } = this.getCenter();
        const [x, y] = (0, slu_map_1.u_mapGetPointByLatlng)(this.map, [averLat, averLng]);
        const point = [x + 50, y];
        const targetLatLng = (0, slu_map_1.u_mapGetLatLngByPoint)(this.map, point);
        let dis = (0, slu_map_1.u_mapGetDistance)([averLat, averLng], targetLatLng, this.map);
        let text = '';
        if (dis > 2000) {
            dis = dis / 1852;
            text = 'nm';
        }
        else {
            text = 'm';
        }
        const num = this.getScaleNum(dis);
        this.controlInfo.width = Math.round(50 * num / dis) + 'px';
        this.controlInfo.scale = Math.round(num) + text;
        if (this.controlCb)
            this.controlCb(this.controlInfo);
    }
    getScaleNum(num) {
        if (num < 1)
            return 1;
        if (num <= 10)
            return Math.ceil(num / 2) * 2;
        const power = Math.pow(10, Math.floor(Math.log10(num)));
        let leading = num / power;
        if (leading <= 2)
            return Math.ceil(leading * 2) / 2 * power;
        if (leading <= 5)
            return Math.ceil(leading) * power;
        return Math.ceil(leading / 5) * 5 * power;
    }
}
exports.SLUMap = SLUMap;
//# sourceMappingURL=canvas-map.js.map