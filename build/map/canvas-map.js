import { MapNameType, SLULeafletNetMap } from '../leaflet';
import { um_getBounds, um_getDistance, um_getLngLatByEvent, um_getLngLatByPoint, um_getLnglatByValue, um_getMapInstance, um_getMapSize, um_getPointByLnglat, um_setFitBounds, um_setViewCenter, um_togcj02gps84, um_tsIsKeyOf, um_tsMapisAmap, um_tsMapisLeaflet, um_tsMapisMapLibre } from "../utils";
export class SLUMap {
    constructor(ele) {
        this.controlInfo = Object.create({});
        this.ifDMS = true;
        this.curs = Object.create(null);
        this.setLatlng = (e) => {
            const lnglat = um_getLngLatByEvent(e);
            if (!lnglat)
                return;
            const [lng, lat] = lnglat;
            this.latLng.lat = lat;
            this.latLng.lng = lng;
            this.controlInfo.lat = um_getLnglatByValue(lat, false, this.ifDMS);
            this.controlInfo.lng = um_getLnglatByValue(lng, true, this.ifDMS);
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
        this._map = await um_getMapInstance(type, ele, options);
        if (type === 'L') {
            this.showMap([MapNameType.tianDiTuNormalMap, MapNameType.tianDiTuNormalAnnotion]);
        }
        else if (type === 'M') {
            this.map.on('style.load', () => { this.changeLanguage(false); });
        }
    }
    setFitView(lnglats) {
        if (this._map) {
            um_setFitBounds(this._map, lnglats);
        }
        return this;
    }
    setCenter(center, zoom, offset) {
        um_setViewCenter(this._map, center, zoom, offset);
    }
    getBound() {
        return um_getBounds(this._map);
    }
    getCenter() {
        const center = this.map.getCenter();
        if (um_tsMapisAmap(this.map)) {
            const { lat, lng } = um_togcj02gps84(center.lng, center.lat);
            center.lng = lng;
            center.lat = lat;
        }
        return center;
    }
    getZoom() {
        return this.map.getZoom();
    }
    getSize() {
        return um_getMapSize(this._map);
    }
    showMap(names = []) {
        const { map, curs } = this;
        if (map && um_tsMapisLeaflet(map)) {
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
                if (!um_tsIsKeyOf(curs, key))
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
        this.controlInfo.lat = um_getLnglatByValue(latlng.lat, false, ifDMS);
        this.controlInfo.lng = um_getLnglatByValue(latlng.lng, true, ifDMS);
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
        this.controlInfo.lat = um_getLnglatByValue(lat, false, ifDMS);
        this.controlInfo.lng = um_getLnglatByValue(lng, true, ifDMS);
        this.setZoomAndScale();
        return this.controlInfo;
    }
    changeLanguage(ifEn) {
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
                    }
                    catch (e) { }
                }
            });
        }
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
        const [x, y] = um_getPointByLnglat(this.map, [averLng, averLat]);
        const point = [x + 50, y];
        const targetLngLat = um_getLngLatByPoint(this.map, point);
        let dis = um_getDistance([averLng, averLat], targetLngLat, this.map);
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