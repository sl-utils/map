import * as L from "leaflet";
import { LngLat as MaplibreLngLat } from 'maplibre-gl';
import { um_togcj02gps84, um_togps84gcj02 } from "./slu-coord";
import { tsMapisLeaflet, tsMapisAmap, tsMapisMapLibre, tsEventisLeaflet, tsEventisAmap, tsEventisMapLibre, tsIfTwoArr, tsisMapEventType } from "./slu-type-guard";
const R = 6378137;
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
        const { lat: swLat, lng: swLng } = um_togcj02gps84(southwest.lng, southwest.lat);
        const { lat: neLat, lng: neLng } = um_togcj02gps84(northeast.lng, northeast.lat);
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
        const { lat: lat02, lng: lng02 } = um_togps84gcj02(lng, lat);
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
        const { lat: swLat, lng: swLng } = um_togps84gcj02(southwest[0], southwest[1]);
        const { lat: neLat, lng: neLng } = um_togps84gcj02(northeast[0], northeast[1]);
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
export { getAngle, getBounds, getDiffLatitude, getDistance, getLngLatByPoint, getLngDiffByDistance, getPointByLnglat, getPointsByLnglats, getProjectedPointByLnglat, getProjectedPointByLnglats, getSizeByMap, getMapSize, setMapStatus, getMapMouseEvent, setFitBounds, setViewCenter, getLnglatByValue, getLngLatByEvent, getAngle as um_getAngle, getBounds as um_getBounds, getDiffLatitude as um_getDiffLatitude, getDistance as um_getDistance, getLngLatByPoint as um_getLngLatByPoint, getLngDiffByDistance as um_getLngDiffByDistance, getPointByLnglat as um_getPointByLnglat, getPointsByLnglats as um_getPointsByLnglats, getProjectedPointByLnglat as um_getProjectedPointByLnglat, getProjectedPointByLnglats as um_getProjectedPointByLnglats, getSizeByMap as um_getSizeByMap, getMapSize as um_getMapSize, setMapStatus as um_setMapStatus, getMapMouseEvent as um_getMapMouseEvent, setFitBounds as um_setFitBounds, setViewCenter as um_setViewCenter, getLnglatByValue as um_getLnglatByValue, getLngLatByEvent as um_getLngLatByEvent, };
//# sourceMappingURL=slu-map-util.js.map