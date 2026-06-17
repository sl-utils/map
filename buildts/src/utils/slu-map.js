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
exports.u_arrItemDel = delItem;
exports.u_mapTobd09gps84 = tobd09gps84;
exports.u_mapTogcj02gps84 = togcj02gps84;
exports.u_mapTogps84bd09 = togps84bd09;
exports.u_mapTogps84gcj02 = togps84gcj02;
exports.u_mapTogcj02bd09 = togcj02bd09;
exports.u_mapTobd09cj02 = tobd09cj02;
exports.u_mapGetAngle = getAngle;
exports.u_mapGetBounds = getBounds;
exports.u_mapGetDiffLatitude = getDiffLatitude;
exports.u_mapGetDistance = getDistance;
exports.u_mapGetLatLngByPoint = getLatLngByPoint;
exports.u_mapGetLngDiffByDistance = getLngDiffByDistance;
exports.u_mapGetPointByLatlng = getPointByLatlng;
exports.u_mapGetPointsByLatlngs = getPointsByLatlngs;
exports.u_mapGetProjectedPointByLatlng = getProjectedPointByLatlng;
exports.u_mapGetProjectedPointByLatlngs = getProjectedPointByLatlngs;
exports.u_mapGetSizeByMap = getSizeByMap;
exports.u_mapGetMapSize = getMapSize;
exports.u_mapSetMapStatus = setMapStatus;
exports.u_mapGetMapMouseEvent = getMapMouseEvent;
exports.u_mapSetFitBounds = setFitBounds;
exports.u_mapSetViewCenter = setViewCenter;
exports.u_mapGetLatlngByValue = getLatlngByValue;
exports.u_mapGetLatLngByEvent = getLatLngByEvent;
exports.u_tsMapisLeaflet = tsMapisLeaflet;
exports.u_tsMapisAmap = tsMapisAmap;
exports.u_tsMapisBaidu = tsMapisBaidu;
exports.u_tsMapisMapLibre = tsMapisMapLibre;
exports.u_tsEventisLeaflet = tsEventisLeaflet;
exports.u_tsEventisAmap = tsEventisAmap;
exports.u_tsEventisMapLibre = tsEventisMapLibre;
exports.u_tsLayerisLeaflet = tsLayerisLeaflet;
exports.u_tsLayerisAmap = tsLayerisAmap;
exports.u_tsLayerisMapLibre = tsLayerisMapLibre;
exports.u_tsIfOneArrTwoLen = tsIfOneArrTwoLen;
exports.u_tsIsKeyOf = tsisKeyOf;
exports.u_tsIsMapEventType = tsisMapEventType;
const L = __importStar(require("leaflet"));
const leaflet_1 = require("leaflet");
const slu_math_1 = require("./slu-math");
const maplibre_gl_1 = require("maplibre-gl");
const a = 6378245.0;
const pi = 3.1415926535897932384626;
const ee = 0.00669342162296594323;
const x_pi = pi * 3000.0 / 180.0;
const R = 6378137;
function tobd09gps84(lng, lat) {
    const gcj02 = tobd09cj02(lng, lat);
    const map84 = togcj02gps84(gcj02.lng, gcj02.lat);
    return map84;
}
function togcj02gps84(lng, lat) {
    const coord = transform(lng, lat);
    const lontitude = lng * 2 - coord.lng;
    const latitude = lat * 2 - coord.lat;
    const newCoord = {
        lng: lontitude,
        lat: latitude
    };
    return newCoord;
}
function togps84bd09(lng, lat) {
    const gcj02 = togps84gcj02(lng, lat);
    const bd09 = togcj02bd09(gcj02.lng, gcj02.lat);
    return bd09;
}
function togps84gcj02(lng, lat) {
    let dLat = transformLat(lng - 105.0, lat - 35.0);
    let dLng = transformLng(lng - 105.0, lat - 35.0);
    const radLat = lat / 180.0 * pi;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
    const mgLat = lat + dLat;
    const mgLng = lng + dLng;
    const newCoord = {
        lng: mgLng,
        lat: mgLat
    };
    return newCoord;
}
function togcj02bd09(lng, lat) {
    const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_pi);
    const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_pi);
    const bd_lng = z * Math.cos(theta) + 0.0065;
    const bd_lat = z * Math.sin(theta) + 0.006;
    const newCoord = {
        lng: bd_lng,
        lat: bd_lat
    };
    return newCoord;
}
function tobd09cj02(bd_lng, bd_lat) {
    const x = bd_lng - 0.0065;
    const y = bd_lat - 0.006;
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    const gg_lng = z * Math.cos(theta);
    const gg_lat = z * Math.sin(theta);
    const newCoord = {
        lng: gg_lng,
        lat: gg_lat
    };
    return newCoord;
}
function transform(lng, lat) {
    let dLat = transformLat(lng - 105.0, lat - 35.0);
    let dLng = transformLng(lng - 105.0, lat - 35.0);
    const radLat = lat / 180.0 * pi;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
    const mgLat = lat + dLat;
    const mgLng = lng + dLng;
    const newCoord = {
        lng: mgLng,
        lat: mgLat
    };
    return newCoord;
}
function transformLat(x, y) {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    return ret;
}
function transformLng(x, y) {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
    return ret;
}
function getAngle(map, latLngA, latLngB) {
    let [y0, x0] = getPointByLatlng(map, latLngA), [y1, x1] = getPointByLatlng(map, latLngB);
    let θ = Math.atan2(x1 - x0, y1 - y0);
    θ = θ * 180 / Math.PI;
    θ = (90 + θ) < 0 ? 450 + θ : 90 + θ;
    return θ;
}
function getBounds(map) {
    if (tsMapisLeaflet(map)) {
        let bounds = map.getBounds();
        return {
            lngLeft: bounds.getSouthWest().lng,
            latTop: bounds.getNorthEast().lat,
            lngRight: bounds.getNorthEast().lng,
            latBottom: bounds.getSouthWest().lat
        };
    }
    else if (tsMapisAmap(map)) {
        let { southwest, northeast } = map.getBounds();
        const { lat: swLat, lng: swLng } = togcj02gps84(southwest.lng, southwest.lat);
        const { lat: neLat, lng: neLng } = togcj02gps84(northeast.lng, northeast.lat);
        return {
            lngLeft: swLng,
            latTop: neLat,
            lngRight: neLng,
            latBottom: swLat
        };
    }
    else if (tsMapisMapLibre(map)) {
        const bounds = map.getBounds();
        return {
            lngLeft: bounds.getWest(),
            lngRight: bounds.getEast(),
            latBottom: bounds.getSouth(),
            latTop: bounds.getNorth()
        };
    }
    throw new Error('百度地图暂时不支持！');
}
function getDiffLatitude(distance) {
    let d = Number(distance);
    const delta_lat = 2 * Math.asin(d / (2 * R));
    return delta_lat * (180 / Math.PI);
}
function getDistance(latLngA, latLngB, map) {
    let [latA, lngA] = latLngA, [latB, lngB] = latLngB, dis = 0;
    if (tsMapisLeaflet(map)) {
        dis = L.latLng(latLngA).distanceTo(latLngB);
    }
    else if (tsMapisAmap(map)) {
        dis = AMap.GeometryUtil.distance([lngA, latA], [lngB, latB]);
    }
    else if (tsMapisMapLibre(map)) {
        const lngLatA = new maplibre_gl_1.LngLat(latLngA[1], latLngA[0]);
        const lngLatB = new maplibre_gl_1.LngLat(latLngB[1], latLngB[0]);
        dis = lngLatA.distanceTo(lngLatB);
    }
    else {
        dis = 0;
    }
    return dis;
}
function getLatLngByPoint(map, point) {
    if (!point)
        return [0, 0];
    let p;
    if (tsMapisLeaflet(map)) {
        p = map.containerPointToLatLng(point);
    }
    else if (tsMapisMapLibre(map)) {
        p = map.unproject(point);
    }
    else {
        p = map.containerToLngLat(new AMap.Pixel(point[0], point[1]));
    }
    return [p.lat, p.lng];
}
function getLngDiffByDistance(map, distance = 100, latLng) {
    if (latLng.length === 0) {
        return 0;
    }
    let lng = 0.00001, lat = latLng.map(e => e[0]).reduce((s, v) => s + v) / latLng.length;
    let positionA = [lat, 100], positionB = [lat, 100 + lng];
    let xMeasure = getDistance(positionA, positionB, map);
    return distance / xMeasure * lng;
}
function getPointByLatlng(map, latlng) {
    if (!latlng)
        return [-1000, -1000];
    let [lat = 90, lng = 180] = latlng, p;
    if (isNaN(lat) || isNaN(lng))
        return [-1000, -1000];
    if (tsMapisLeaflet(map)) {
        p = map.latLngToContainerPoint([lat, lng]);
    }
    else if (tsMapisAmap(map)) {
        p = map.lngLatToContainer([lng, lat]);
    }
    else if (tsMapisMapLibre(map)) {
        p = map.project([lng, lat]);
    }
    else {
        throw new Error('百度地图暂时不支持！');
    }
    return [p.x, p.y];
}
function getPointsByLatlngs(map, latlngs) {
    return latlngs?.map(e => getPointByLatlng(map, e)) || [];
}
function getProjectedPointByLatlng(map, lng, lat, zoom) {
    if (tsMapisLeaflet(map)) {
        const p = map.project(L.latLng(lat, lng), zoom);
        return [p.x, p.y];
    }
    else {
        return project(lng, lat, zoom);
    }
}
;
function project(lng, lat, zoom) {
    const tileSize = 256;
    const scale = tileSize * Math.pow(2, zoom);
    const x = (lng + 180) / 360 * scale;
    const sinLat = Math.sin(lat * Math.PI / 180);
    const y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale;
    return [x, y];
}
function getProjectedPointByLatlngs(map, latlngs, zoom) {
    return latlngs?.map(e => getProjectedPointByLatlng(map, e[0], e[1], zoom)) || [];
}
function getSizeByMap(map, info) {
    let { sizeFix, latlng, size = [0, 0] } = info;
    if (!sizeFix || !latlng) {
        Array.isArray(size) || (size = [size, size]);
        return size;
    }
    let sizes = Array.isArray(sizeFix) ? sizeFix : [sizeFix, sizeFix];
    let [x, y] = latlng;
    let lngDiff = getLngDiffByDistance(map, sizes[1], [latlng]);
    let [x0, y0] = getPointByLatlng(map, [x, y]);
    let [x1, y1] = getPointByLatlng(map, [x, y + lngDiff]);
    let xd = Math.abs(x1 - x0), yd = (xd * sizes[1]) / sizes[0];
    return [xd, yd];
}
function getMapSize(map) {
    let w, h;
    if (tsMapisMapLibre(map)) {
        const mapCanvas = map.getCanvas();
        const rect = mapCanvas.getBoundingClientRect();
        w = rect.width, h = rect.height;
    }
    else {
        let size = map.getSize();
        let { x, y, width, height } = size;
        w = x || width, h = y || height;
    }
    return { w, h };
}
function getMapMouseEvent(e, map) {
    let latlng, point, page, originalEvent, type;
    tsisMapEventType(e.type);
    type = e.type;
    if (tsMapisLeaflet(map) && tsEventisLeaflet(e)) {
        const { latlng: Llatlng, originalEvent: LorginalEvent, containerPoint } = e;
        const { lat, lng } = Llatlng;
        latlng = { lat, lng };
        const { x, y } = containerPoint;
        point = { x, y };
        originalEvent = LorginalEvent;
    }
    else if (tsMapisAmap(map) && tsEventisAmap(e)) {
        const { pixel, originEvent, lnglat } = e;
        const { lat, lng } = lnglat;
        latlng = { lat, lng };
        const { x, y } = pixel;
        point = { x, y };
        originalEvent = originEvent;
    }
    else if (tsMapisMapLibre(map) && tsEventisMapLibre(e)) {
        const { lat, lng } = e.lngLat;
        latlng = { lat, lng };
        point = e.point;
        originalEvent = e.originalEvent;
    }
    else {
        throw new Error('百度地图暂时不支持！');
    }
    return {
        type,
        latlng,
        containerPoint: point,
        orginDOMEvent: originalEvent,
        orginMapEvent: e
    };
}
function setMapStatus(map, key, flag) {
    switch (key) {
        case 'dragEnable':
            if (tsMapisLeaflet(map)) {
                flag ? map.dragging.enable() : map.dragging.disable();
            }
            else if (tsMapisAmap(map)) {
                map.setStatus({ dragEnable: flag });
            }
            else if (tsMapisMapLibre(map)) {
                flag ? map.dragPan.enable() : map.dragPan.disable();
            }
            ;
            break;
    }
}
function setViewCenter(map, center, zoom, offset) {
    if (offset) {
        const centerPixel = getPointByLatlng(map, center);
        center = getLatLngByPoint(map, [centerPixel[0] + offset[0], centerPixel[1] + offset[1]]);
    }
    if (tsMapisLeaflet(map)) {
        map.setView(center, zoom);
    }
    else if (tsMapisAmap(map) || tsMapisMapLibre(map)) {
        const [lat, lng] = center;
        const { lat: lat02, lng: lng02 } = togps84gcj02(lng, lat);
        const mapcenter = [lng02, lat02];
        map.setCenter(mapcenter);
        map.setZoom(zoom);
    }
    else {
        throw new Error('百度地图暂时不支持！');
    }
}
function setFitBounds(map, point, point2) {
    let southwest, northeast;
    if (point.length == 0 || !point)
        return;
    if (tsIfTwoArr(point)) {
        let maxLat = Math.max(...point.map((e) => e[0])), minLat = Math.min(...point.map((e) => e[0])), maxLng = Math.max(...point.map((e) => e[1])), minLng = Math.min(...point.map((e) => e[1]));
        southwest = [minLat, minLng];
        northeast = [maxLat, maxLng];
    }
    else {
        southwest = point;
        northeast = point2 || point;
    }
    if (tsMapisLeaflet(map)) {
        map.fitBounds([southwest, northeast]);
    }
    else if (tsMapisAmap(map)) {
        const { lat: swLat, lng: swLng } = togps84gcj02(southwest[1], southwest[0]);
        const { lat: neLat, lng: neLng } = togps84gcj02(northeast[1], northeast[0]);
        const bounds = new AMap.Bounds([swLng, swLat], [neLng, neLat]);
        const [zoom, center] = map.getFitZoomAndCenterByBounds(bounds);
        map.setZoomAndCenter(zoom, center);
    }
    else if (tsMapisMapLibre(map)) {
        const bounds = [
            [southwest[1], southwest[0]],
            [northeast[1], northeast[0]]
        ];
        map.fitBounds(bounds, { padding: 100, duration: 0 });
    }
}
function getLatlngByValue(value, ifLng, ifDMS) {
    let unit = "N";
    if (value < 0)
        unit = "S";
    if (ifLng) {
        unit = "E";
        while (value < 0) {
            value = value + 360;
        }
        value = value % 360;
        if (value > 180) {
            unit = 'W';
            value = 360 - value;
        }
    }
    value = Math.abs(value);
    if (!ifDMS)
        return (0, slu_math_1.u_mathGetPoint)(value, 5) + '°' + unit;
    let f = value % 1 * 60;
    let m = (f % 1 * 60).toFixed(2);
    let d = Math.floor(value);
    f = Math.floor(f);
    return `${d}°${f}'${m}"${unit}`;
}
function getLatLngByEvent(e) {
    if (!e)
        return null;
    if (tsEventisLeaflet(e)) {
        const { lat, lng } = e.latlng;
        return [lat, lng];
    }
    else if (tsEventisAmap(e)) {
        const { lat, lng } = e.lnglat;
        return [lat, lng];
    }
    else if (tsEventisMapLibre(e)) {
        const { lat, lng } = e.lngLat;
        return [lat, lng];
    }
    return null;
}
function delItem(arr, item, key) {
    if (Array.isArray(arr) && arr.length > 0) {
        let index;
        if (key) {
            index = arr.findIndex(e => e == item || e[key] == item[key]);
        }
        else {
            index = arr.findIndex(e => e == item);
        }
        index >= 0 && arr.splice(index, 1);
    }
    return arr || [];
}
function tsIfTwoArr(value) {
    return value && Array.isArray(value[0]);
}
function tsIfOneArrTwoLen(value) {
    return !!(value && Array.isArray(value) && value.length == 2);
}
function tsMapisLeaflet(map) {
    try {
        return map instanceof L.Map;
    }
    catch (e) {
        return false;
    }
}
function tsMapisAmap(map) {
    try {
        return map instanceof AMap.Map;
    }
    catch (e) {
        return false;
    }
}
function tsMapisMapLibre(map) {
    try {
        return map instanceof maplibre_gl_1.Map;
    }
    catch (e) {
        return false;
    }
}
function tsMapisBaidu(map) {
    try {
        return false;
    }
    catch (e) {
        return false;
    }
}
function tsEventisLeaflet(e) {
    return e && 'latlng' in e && 'containerPoint' in e;
}
function tsEventisAmap(e) {
    return e && 'lnglat' in e && 'pixel' in e;
}
function tsEventisMapLibre(e) {
    return e && 'lngLat' in e && 'point' in e;
}
function tsLayerisLeaflet(e) {
    return e instanceof leaflet_1.Layer;
}
function tsLayerisAmap(e) {
    return e instanceof AMap.CustomLayer;
}
function tsLayerisMapLibre(e) {
    return e && typeof e === 'object' && 'id' in e && 'render' in e && 'type' in e;
}
function tsisKeyOf(obj, key) {
    return key in obj;
}
function tsisMapEventType(type) {
    if (!(['unset', 'click', 'dblclick', 'mousemove', 'mousedown', 'mouseup', 'mouseleave', 'mouseenter', 'rightclick'].includes(type))) {
        throw new Error(`Invalid MapEventType: ${type}`);
    }
}
//# sourceMappingURL=slu-map.js.map