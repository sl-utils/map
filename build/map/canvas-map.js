import { CRS, Map as LMap, latLng } from "leaflet";
import * as AMapLoader from '@amap/amap-jsapi-loader';
import { MapNameType, SLULeafletNetMap } from '../leaflet';
import { u_mapGetBounds, u_mapGetDistance, u_mapGetLngLatByEvent, u_mapGetLngLatByPoint, u_mapGetLnglatByValue, u_mapGetMapSize, u_mapGetPointByLnglat, u_mapSetFitBounds, u_mapSetViewCenter, u_mapTogcj02gps84, u_mapTogps84gcj02, u_tsIsKeyOf, u_tsMapisAmap, u_tsMapisLeaflet, u_tsMapisMapLibre } from "../utils/slu-map";
import { Map as MaplibreMap } from 'maplibre-gl';
export class SLUMap {
    constructor(ele) {
        this.controlInfo = Object.create({});
        this.ifDMS = true;
        this.curs = Object.create(null);
        this.setLatlng = (e) => {
            const lnglat = u_mapGetLngLatByEvent(e);
            if (!lnglat)
                return;
            const [lng, lat] = lnglat;
            this.latLng.lat = lat;
            this.latLng.lng = lng;
            this.controlInfo.lat = u_mapGetLnglatByValue(lat, false, this.ifDMS);
            this.controlInfo.lng = u_mapGetLnglatByValue(lng, true, this.ifDMS);
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
                this.showMap([MapNameType.tianDiTuNormalMap, MapNameType.tianDiTuNormalAnnotion]);
                break;
        }
    }
    setFitView(lnglats) {
        if (this._map) {
            u_mapSetFitBounds(this._map, lnglats);
        }
        return this;
    }
    setCenter(center, zoom, offset) {
        u_mapSetViewCenter(this._map, center, zoom, offset);
    }
    getBound() {
        return u_mapGetBounds(this._map);
    }
    getCenter() {
        const center = this.map.getCenter();
        if (u_tsMapisAmap(this.map)) {
            const { lat, lng } = u_mapTogcj02gps84(center.lng, center.lat);
            return new AMap.LngLat(lng, lat);
        }
        return center;
    }
    getZoom() {
        return this.map.getZoom();
    }
    getSize() {
        return u_mapGetMapSize(this._map);
    }
    showMap(names = []) {
        const { map, curs } = this;
        if (map && u_tsMapisLeaflet(map)) {
            let mapSource = names[0].split('.')[0];
            let center = map.getCenter();
            let zoom = map.getZoom();
            map.setView(center, zoom, { animate: false });
            names?.forEach(name => {
                if (curs[name])
                    return;
                let net = new SLULeafletNetMap(name);
                net.addTo(map);
                curs[name] = net;
            });
            for (const key of Object.keys(curs)) {
                if (!u_tsIsKeyOf(curs, key))
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
        this.controlInfo.lat = u_mapGetLnglatByValue(latlng.lat, false, ifDMS);
        this.controlInfo.lng = u_mapGetLnglatByValue(latlng.lng, true, ifDMS);
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
        this.controlInfo.lat = u_mapGetLnglatByValue(lat, false, ifDMS);
        this.controlInfo.lng = u_mapGetLnglatByValue(lng, true, ifDMS);
        this.setZoomAndScale();
        return this.controlInfo;
    }
    initLeaflet(ele, opt) {
        const { zoom = 11, minZoom = 2, maxZoom = 20, center: [lng, lat] = [114.12027, 22.68471], dragging = true, zoomControl = false, attributionControl = false, doubleClickZoom = false, closePopupOnClick = false } = opt;
        let param = {
            dragging,
            zoomControl,
            zoom,
            minZoom,
            maxZoom,
            center: latLng(lat, lng),
            attributionControl,
            doubleClickZoom,
            crs: CRS.EPSG3857,
            closePopupOnClick,
        };
        let map = new LMap(ele, param);
        return Promise.resolve(map);
    }
    async initMaplibre(ele, opt) {
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
    changeLanguage(ifEn) {
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
                    }
                    catch (e) { }
                }
            });
        }
    }
    async initAmap(ele, opt) {
        const { zoom = 11, minZoom = 2, maxZoom = 20, center = [114.12027, 22.68471], dragging = true, zoomControl = false, attributionControl = false, doubleClickZoom = false, closePopupOnClick = false, showLabel = true } = opt;
        const { lat, lng } = u_mapTogps84gcj02(center[0], center[1]);
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
        const [x, y] = u_mapGetPointByLnglat(this.map, [averLng, averLat]);
        const point = [x + 50, y];
        const targetLngLat = u_mapGetLngLatByPoint(this.map, point);
        let dis = u_mapGetDistance([averLng, averLat], targetLngLat, this.map);
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
//# sourceMappingURL=canvas-map.js.map