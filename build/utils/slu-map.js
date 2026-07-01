import * as L from "leaflet";
import { Layer } from "leaflet";
import { Map as MaplibreMap, LngLat as MaplibreLngLat } from 'maplibre-gl';
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
function getAngle(map, lnglatA, lnglatB) {
    let [y0, x0] = getPointByLnglat(map, lnglatA), [y1, x1] = getPointByLnglat(map, lnglatB);
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
function getDistance(lnglatA, lnglatB, map) {
    let [lngA, latA] = lnglatA, [lngB, latB] = lnglatB, dis = 0;
    if (tsMapisLeaflet(map)) {
        dis = L.latLng([latA, lngA]).distanceTo([latB, lngB]);
    }
    else if (tsMapisAmap(map)) {
        dis = AMap.GeometryUtil.distance(lnglatA, lnglatB);
    }
    else if (tsMapisMapLibre(map)) {
        const lngLatA = new MaplibreLngLat(lngA, latA);
        const lngLatB = new MaplibreLngLat(lngB, latB);
        dis = lngLatA.distanceTo(lngLatB);
    }
    else {
        dis = 0;
    }
    return dis;
}
function getLngLatByPoint(map, point) {
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
    return [p.lng, p.lat];
}
function getLngDiffByDistance(map, distance = 100, lnglats) {
    if (lnglats.length === 0) {
        return 0;
    }
    let lng = 0.00001, lat = lnglats.map(e => e[1]).reduce((s, v) => s + v) / lnglats.length;
    let positionA = [100, lat], positionB = [100 + lng, lat];
    let xMeasure = getDistance(positionA, positionB, map);
    return distance / xMeasure * lng;
}
function getPointByLnglat(map, lnglat) {
    if (!lnglat)
        return [-1000, -1000];
    let [lng = 180, lat = 90] = lnglat, p;
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
function getPointsByLnglats(map, lnglats) {
    return lnglats?.map(e => getPointByLnglat(map, e)) || [];
}
function getProjectedPointByLnglat(map, lng, lat, zoom) {
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
function getProjectedPointByLnglats(map, lnglats, zoom) {
    return lnglats?.map(e => getProjectedPointByLnglat(map, e[0], e[1], zoom)) || [];
}
function getSizeByMap(map, info) {
    let { sizeFix, lnglat, size = [0, 0] } = info;
    if (!sizeFix || !lnglat) {
        Array.isArray(size) || (size = [size, size]);
        return size;
    }
    let sizes = Array.isArray(sizeFix) ? sizeFix : [sizeFix, sizeFix];
    let [x, y] = lnglat;
    let lngDiff = getLngDiffByDistance(map, sizes[1], [lnglat]);
    let [x0, y0] = getPointByLnglat(map, [x, y]);
    let [x1, y1] = getPointByLnglat(map, [x + lngDiff, y]);
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
        const centerPixel = getPointByLnglat(map, center);
        center = getLngLatByPoint(map, [centerPixel[0] + offset[0], centerPixel[1] + offset[1]]);
    }
    if (tsMapisLeaflet(map)) {
        map.setView([center[1], center[0]], zoom);
    }
    else if (tsMapisAmap(map)) {
        const [lng, lat] = center;
        const { lat: lat02, lng: lng02 } = togps84gcj02(lng, lat);
        const mapcenter = [lng02, lat02];
        map.setCenter(mapcenter);
        map.setZoom(zoom);
    }
    else if (tsMapisMapLibre(map)) {
        map.setCenter(center);
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
        let maxLat = Math.max(...point.map((e) => e[1])), minLat = Math.min(...point.map((e) => e[1])), maxLng = Math.max(...point.map((e) => e[0])), minLng = Math.min(...point.map((e) => e[0]));
        southwest = [minLng, minLat];
        northeast = [maxLng, maxLat];
    }
    else {
        southwest = point;
        northeast = point2 || point;
    }
    if (tsMapisLeaflet(map)) {
        const bounds = [[southwest[1], southwest[0]], [northeast[1], northeast[0]]];
        map.fitBounds(bounds);
    }
    else if (tsMapisAmap(map)) {
        const { lat: swLat, lng: swLng } = togps84gcj02(southwest[0], southwest[1]);
        const { lat: neLat, lng: neLng } = togps84gcj02(northeast[0], northeast[1]);
        const bounds = new AMap.Bounds([swLng, swLat], [neLng, neLat]);
        const [zoom, center] = map.getFitZoomAndCenterByBounds(bounds);
        map.setZoomAndCenter(zoom, center);
    }
    else if (tsMapisMapLibre(map)) {
        map.fitBounds([southwest, northeast], { padding: 100, duration: 0 });
    }
}
function getLnglatByValue(value, ifLng, ifDMS) {
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
        return Math.round(value * Math.pow(10, 5)) / Math.pow(10, 5) + '°' + unit;
    let f = value % 1 * 60;
    let m = (f % 1 * 60).toFixed(2);
    let d = Math.floor(value);
    f = Math.floor(f);
    return `${d}°${f}'${m}"${unit}`;
}
function getLngLatByEvent(e) {
    if (!e)
        return null;
    if (tsEventisLeaflet(e)) {
        const { lat, lng } = e.latlng;
        return [lng, lat];
    }
    else if (tsEventisAmap(e)) {
        const { lat, lng } = e.lnglat;
        return [lng, lat];
    }
    else if (tsEventisMapLibre(e)) {
        const { lat, lng } = e.lngLat;
        return [lng, lat];
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
function deepMergeOpt(target, source) {
    const result = { ...target };
    for (const key in source) {
        const sourceValue = source[key];
        if (sourceValue === undefined) {
            continue;
        }
        const targetValue = result[key];
        if (tsIfPlainObject(targetValue) && tsIfPlainObject(sourceValue)) {
            result[key] = deepMergeOpt(targetValue, sourceValue);
        }
        else {
            result[key] = sourceValue;
        }
    }
    return result;
}
function tsIfPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
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
        return map instanceof MaplibreMap;
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
    return e instanceof Layer;
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
export { delItem as u_arrItemDel, tobd09gps84 as u_mapTobd09gps84, togcj02gps84 as u_mapTogcj02gps84, togps84bd09 as u_mapTogps84bd09, togps84gcj02 as u_mapTogps84gcj02, togcj02bd09 as u_mapTogcj02bd09, tobd09cj02 as u_mapTobd09cj02, getAngle as u_mapGetAngle, getBounds as u_mapGetBounds, getDiffLatitude as u_mapGetDiffLatitude, getDistance as u_mapGetDistance, getLngLatByPoint as u_mapGetLngLatByPoint, getLngDiffByDistance as u_mapGetLngDiffByDistance, getPointByLnglat as u_mapGetPointByLnglat, getPointsByLnglats as u_mapGetPointsByLnglats, getProjectedPointByLnglat as u_mapGetProjectedPointByLnglat, getProjectedPointByLnglats as u_mapGetProjectedPointByLnglats, getSizeByMap as u_mapGetSizeByMap, getMapSize as u_mapGetMapSize, setMapStatus as u_mapSetMapStatus, getMapMouseEvent as u_mapGetMapMouseEvent, setFitBounds as u_mapSetFitBounds, setViewCenter as u_mapSetViewCenter, getLnglatByValue as u_mapGetLnglatByValue, getLngLatByEvent as u_mapGetLngLatByEvent, deepMergeOpt as u_deepMergeOpt, tsMapisLeaflet as u_tsMapisLeaflet, tsMapisAmap as u_tsMapisAmap, tsMapisBaidu as u_tsMapisBaidu, tsMapisMapLibre as u_tsMapisMapLibre, tsEventisLeaflet as u_tsEventisLeaflet, tsEventisAmap as u_tsEventisAmap, tsEventisMapLibre as u_tsEventisMapLibre, tsLayerisLeaflet as u_tsLayerisLeaflet, tsLayerisAmap as u_tsLayerisAmap, tsLayerisMapLibre as u_tsLayerisMapLibre, tsIfOneArrTwoLen as u_tsIfOneArrTwoLen, tsisKeyOf as u_tsIsKeyOf, tsisMapEventType as u_tsIsMapEventType, };
//# sourceMappingURL=slu-map.js.map