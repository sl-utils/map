"use strict";
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
exports.u_mapGetSizeByMap = getSizeByMap;
exports.u_mapGetMapSize = getMapSize;
exports.u_mapSetMapStatus = setMapStatus;
exports.u_mapGetMapMouseEvent = getMapMouseEvent;
exports.u_mapSetFitBounds = setFitBounds;
exports.u_mapSetViewCenter = setViewCenter;
exports.u_mapGetMapType = getMapType;
const L = require("leaflet");
const a = 6378245.0;
const pi = 3.1415926535897932384626;
const ee = 0.00669342162296594323;
const x_pi = pi * 3000.0 / 180.0;
const R = 6378137;
function tobd09gps84(lng, lat) {
    var gcj02 = tobd09cj02(lng, lat);
    var map84 = togcj02gps84(gcj02.lng, gcj02.lat);
    return map84;
}
function togcj02gps84(lng, lat) {
    var coord = transform(lng, lat);
    var lontitude = lng * 2 - coord.lng;
    var latitude = lat * 2 - coord.lat;
    var newCoord = {
        lng: lontitude,
        lat: latitude
    };
    return newCoord;
}
function togps84bd09(lng, lat) {
    var gcj02 = togps84gcj02(lng, lat);
    var bd09 = togcj02bd09(gcj02.lng, gcj02.lat);
    return bd09;
}
function togps84gcj02(lng, lat) {
    var dLat = transformLat(lng - 105.0, lat - 35.0);
    var dLng = transformLng(lng - 105.0, lat - 35.0);
    var radLat = lat / 180.0 * pi;
    var magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
    var mgLat = lat + dLat;
    var mgLng = lng + dLng;
    var newCoord = {
        lng: mgLng,
        lat: mgLat
    };
    return newCoord;
}
function togcj02bd09(lng, lat) {
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_pi);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_pi);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    var newCoord = {
        lng: bd_lng,
        lat: bd_lat
    };
    return newCoord;
}
function tobd09cj02(bd_lng, bd_lat) {
    var x = bd_lng - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    var newCoord = {
        lng: gg_lng,
        lat: gg_lat
    };
    return newCoord;
}
function transform(lng, lat) {
    var dLat = transformLat(lng - 105.0, lat - 35.0);
    var dLng = transformLng(lng - 105.0, lat - 35.0);
    var radLat = lat / 180.0 * pi;
    var magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
    var mgLat = lat + dLat;
    var mgLng = lng + dLng;
    var newCoord = {
        lng: mgLng,
        lat: mgLat
    };
    return newCoord;
}
function transformLat(x, y) {
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    return ret;
}
function transformLng(x, y) {
    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
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
    const mapType = getMapType(map);
    if (mapType == 0) {
        let bounds = map.getBounds();
        return {
            lngLeft: bounds.getSouthWest().lng,
            latTop: bounds.getNorthEast().lat,
            lngRight: bounds.getNorthEast().lng,
            latBottom: bounds.getSouthWest().lat
        };
    }
    else if (mapType == 1) {
        let { southwest, northeast } = map.getBounds();
        return {
            lngLeft: southwest.lng,
            latTop: northeast.lat,
            lngRight: northeast.lng,
            latBottom: southwest.lat
        };
    }
    throw new Error('百度地图暂时不支持！');
}
function getDiffLatitude(distance) {
    let d = Number(distance);
    const delta_lat = 2 * Math.asin(d / (2 * R));
    return delta_lat * (180 / Math.PI);
}
function getDistance(latLngA, latLngB, type = 0) {
    let [latA, lngA] = latLngA, [latB, lngB] = latLngB, dis = 0;
    if (type && AMap && AMap.GeometryUtil) {
        dis = AMap.GeometryUtil.distance([lngA, latA], [lngB, latB]);
    }
    else {
        dis = L.latLng(latLngA).distanceTo(latLngB);
    }
    return dis;
}
function getLatLngByPoint(map, point) {
    if (!point)
        return [0, 0];
    let p;
    if (map instanceof L.Map) {
        p = map.containerPointToLatLng(point);
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
    let type = map instanceof L.Map ? 0 : 1;
    let lng = 0.00001, lat = latLng.map(e => e[0]).reduce((s, v) => s + v) / latLng.length;
    let positionA = [lat, 100], positionB = [lat, 100 + lng];
    let xMeasure = getDistance(positionA, positionB, type);
    return distance / xMeasure * lng;
}
function getPointByLatlng(map, latlng) {
    if (!latlng)
        return [-1000, -1000];
    let [lat = 90, lng = 180] = latlng, p;
    if (isNaN(lat) || isNaN(lng))
        return [-1000, -1000];
    if (map.latLngToContainerPoint) {
        p = map.latLngToContainerPoint([lat, lng]);
    }
    else {
        p = map.lngLatToContainer([lng, lat]);
    }
    return [p.x, p.y];
}
function getPointsByLatlngs(map, latlngs) {
    return latlngs?.map(e => getPointByLatlng(map, e)) || [];
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
    let size = map.getSize();
    let { x, y, width, height } = size;
    return {
        w: x || width,
        h: y || height
    };
}
function getMapMouseEvent(e, mapType) {
    let latlng, point, page, originalEvent, type;
    type = e.type;
    if (mapType == 0) {
        const { latlng: Llatlng, originalEvent: LorginalEvent, containerPoint } = e = e;
        const { lat, lng } = Llatlng;
        latlng = { lat, lng };
        const { x, y } = containerPoint;
        point = { x, y };
        originalEvent = LorginalEvent;
    }
    else if (mapType == 1) {
        const { pixel, originEvent, lnglat } = e = e;
        const { lat, lng } = lnglat;
        latlng = { lat, lng };
        const { x, y } = pixel;
        point = { x, y };
        originalEvent = originEvent;
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
    let _map = map;
    const amap = _map.setStatus ? _map : undefined, lmap = _map.dragging ? _map : undefined;
    switch (key) {
        case 'dragEnable':
            if (lmap) {
                flag ? lmap.dragging.enable() : lmap.dragging.disable();
            }
            else if (amap) {
                amap.setStatus({ dragEnable: flag });
            }
            ;
            break;
    }
}
function getMapType(map) {
    if (map instanceof L.Map) {
        return 0;
    }
    else if (map instanceof AMap.Map) {
        return 1;
    }
    else {
        return 2;
    }
}
function setViewCenter(map, center, zoom, offset) {
    const mapType = getMapType(map);
    if (offset) {
        const centerPixel = getPointByLatlng(map, center);
        center = getLatLngByPoint(map, [centerPixel[0] + offset[0], centerPixel[1] + offset[1]]);
    }
    if (mapType == 0) {
        map = map;
        map.setView(center, zoom);
    }
    else if (mapType == 1) {
        map = map;
        map.setCenter(center.reverse());
        map.setZoom(zoom);
    }
    else {
        throw new Error('百度地图暂时不支持！');
    }
}
function setFitBounds(map, point, point2) {
    const mapType = getMapType(map);
    let southwest, northeast;
    if (point.length == 0 || !point)
        return;
    if (uc_tsIfTwoArr(point)) {
        let maxLat = Math.max(...point.map((e) => e[0])), minLat = Math.min(...point.map((e) => e[0])), maxLng = Math.max(...point.map((e) => e[1])), minLng = Math.min(...point.map((e) => e[1]));
        southwest = [minLat, minLng];
        northeast = [maxLat, maxLng];
    }
    else {
        southwest = point;
        northeast = point2;
    }
    if (mapType == 0) {
        map = map;
        map.fitBounds([southwest, northeast]);
    }
    else if (mapType == 1) {
        map = map;
        const bounds = new AMap.Bounds(southwest.reverse(), northeast.reverse());
        const [zoom, center] = map.getFitZoomAndCenterByBounds(bounds);
        map.setZoomAndCenter(zoom, center);
    }
}
function uc_tsIfTwoArr(value) {
    return value && Array.isArray(value[0]);
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
//# sourceMappingURL=slu-map.js.map