import { type LeafletMouseEvent, type LatLngBoundsExpression } from "leaflet";
import type { MapMouseEvent as MaplibreMouseEvent, Point as MaplibrePoint } from 'maplibre-gl';
import type { EventType } from "../canvas";
import type { MapBounds, MapMouseEvent, MapPosition, MapSize } from "../map";
import type { AMapMapsEvent, MapLatLng } from "../map";
import * as L from "leaflet";
import { LngLat as MaplibreLngLat, Map as MaplibreMap } from 'maplibre-gl';
import { um_togcj02gps84, um_togps84gcj02 } from "./slu-coord";
import { tsMapisLeaflet, tsMapisAmap, tsMapisMapLibre, tsEventisLeaflet, tsEventisAmap, tsEventisMapLibre, tsIfTwoArr, tsisMapEventType } from "./slu-type-guard";
declare var AMap: any;
/**地球半径 */
const R = 6378137;

/** 测算两点与Y轴形成的角度大小（Y轴方向 ↑ ）
* @param map 当前的地图
* @param lnglatA 第一个点的[经度,纬度]
* @param lnglatB 第二个点的[经度,纬度]
* @returns 两点与正北方的角度
*/
function getAngle(map: AMAP.Map | L.Map | MaplibreMap, lnglatA: [number, number], lnglatB: [number, number]): number {
    let [y0, x0] = getPointByLnglat(map, lnglatA),
        [y1, x1] = getPointByLnglat(map, lnglatB);
    let θ = Math.atan2(x1 - x0, y1 - y0);
    θ = θ * 180 / Math.PI;
    θ = (90 + θ) < 0 ? 450 + θ : 90 + θ;
    return θ
}
/**
 * 获取地图边界
 * @params map 地图实例
 * @returns 地图边界
 *  */
function getBounds(map: AMAP.Map | L.Map | MaplibreMap): MapBounds {
    if (tsMapisLeaflet(map)) {
        let bounds = map.getBounds();
        return {
            lngLeft: bounds.getSouthWest().lng,
            latTop: bounds.getNorthEast().lat,
            lngRight: bounds.getNorthEast().lng,
            latBottom: bounds.getSouthWest().lat
        }
    } else if (tsMapisAmap(map)) {
        let { southwest, northeast } = map.getBounds();
        const { lat: swLat, lng: swLng } = um_togcj02gps84(southwest.lng, southwest.lat);
        const { lat: neLat, lng: neLng } = um_togcj02gps84(northeast.lng, northeast.lat);
        return {
            lngLeft: swLng,
            latTop: neLat,
            lngRight: neLng,
            latBottom: swLat
        }
    } else if (tsMapisMapLibre(map)) {
        const bounds = map.getBounds();
        return {
            lngLeft: bounds.getWest(),
            lngRight: bounds.getEast(),
            latBottom: bounds.getSouth(),
            latTop: bounds.getNorth()
        };
    }
    throw new Error('百度地图暂时不支持！')
}
/**获取距离distance在地球上的纬度跨度
 * @param distance 距离(米)
*/
function getDiffLatitude(distance: number | string): number {
    let d = Number(distance);
    const delta_lat = 2 * Math.asin(d / (2 * R)); // 两点间的纬度差值
    return delta_lat * (180 / Math.PI); // 将弧度转换为角度
}
/**获取两点间的距离
 * @param lnglatA A点的[经度,纬度]
 * @param lnglatB B点的[经度,纬度]
 * @param map 地图实例
 * @returns 两点间的距离(米)
 */
function getDistance(lnglatA: [number, number], lnglatB: [number, number], map: L.Map | AMAP.Map | MaplibreMap): number {
    let [lngA, latA] = lnglatA, [lngB, latB] = lnglatB, dis = 0;
    if (tsMapisLeaflet(map)) {
        dis = L.latLng([latA, lngA]).distanceTo([latB, lngB]);
    } else if (tsMapisAmap(map)) {
        dis = AMap.GeometryUtil.distance(lnglatA, lnglatB)
    } else if (tsMapisMapLibre(map)) {
        const lngLatA = new MaplibreLngLat(lngA, latA);
        const lngLatB = new MaplibreLngLat(lngB, latB);
        dis = lngLatA.distanceTo(lngLatB);
    } else {
        dis = 0;
    }
    return dis;
}
/** 将坐标系转换为经纬度数
 * @param map 地图实例
 * @param point 像素点位
 * @returns lnglat [lng,lat]
 */
function getLngLatByPoint(map: AMAP.Map | L.Map | MaplibreMap, point: [number, number] | undefined): [number, number] {
    if (!point) return [0, 0];
    let p: L.LatLng | AMAP.LngLat | MaplibreLngLat;
    if (tsMapisLeaflet(map)) {
        p = map.containerPointToLatLng(point)
    } else if (tsMapisMapLibre(map)) {
        p = map.unproject(point);
    } else {
        p = map.containerToLngLat(new AMap.Pixel(point[0], point[1]));
    }
    return [p.lng, p.lat]
}
/** 获取指定间隔距离的经度差值
 * @param map 地图实例
 * @param 间隔距离 @default 100
 * @param 纬度点位集合(纬度不同，相同距离经度变化差值不一样)
 */
function getLngDiffByDistance(map: AMAP.Map | L.Map | MaplibreMap, distance: number = 100, lnglats: [number, number][]): number {
    if (lnglats.length === 0) { return 0; }
    let lng = 0.00001, lat = lnglats.map(e => e[1]).reduce((s, v) => s + v) / lnglats.length;
    let positionA: [number, number] = [100, lat],
        positionB: [number, number] = [100 + lng, lat];
    let xMeasure = getDistance(positionA, positionB, map);
    return distance / xMeasure * lng
}
/** 得到坐标系点位
 * @param map 当前的地图
 * @param lnglat [经度,纬度]
 * @returns lnglat有效时返回 [x,y] , 无效时返回 [-1000, -1000]
 */
function getPointByLnglat(map: AMAP.Map | L.Map | MaplibreMap, lnglat: [number, number] | undefined): [number, number] {
    if (!lnglat) return [-1000, -1000];
    let [lng = 180, lat = 90] = lnglat, p: AMAP.Pixel | L.Point | MaplibrePoint;
    if (isNaN(lat) || isNaN(lng)) return [-1000, -1000];
    if (tsMapisLeaflet(map)) {
        p = map.latLngToContainerPoint([lat, lng]);
    } else if (tsMapisAmap(map)) {
        p = map.lngLatToContainer([lng, lat]);
    } else if (tsMapisMapLibre(map)) {
        p = map.project([lng, lat]);
    } else {
        throw new Error('百度地图暂时不支持！')
    }
    return [p.x, p.y]
}
/** 将经纬度数组转换为坐标系
 * @param map 当前的地图
 * @param lnglats [经度,纬度][]
 * @returns lnglats有效时返回 [x,y][]
 */
function getPointsByLnglats(map: AMAP.Map | L.Map | MaplibreMap, lnglats: [number, number][] | undefined): [number, number][] {
    return lnglats?.map(e => getPointByLnglat(map, e)) || [];
}
/**
 * 经纬度数组 转 屏幕像素坐标
 * @param map 当前的地图
 * @param lng 经度
 * @param lat 纬度
 * @param zoom 缩放级别
 */
function getProjectedPointByLnglat(map: AMAP.Map | L.Map | MaplibreMap, lng: number, lat: number, zoom: number): [number, number] {
    if (tsMapisLeaflet(map)) {
        const p = map.project(L.latLng(lat, lng), zoom);
        return [p.x, p.y];
    } else {
        return project(lng, lat, zoom);
    }
};
/**经纬度转指定级别像素 */
function project(lng: number, lat: number, zoom: number): [number, number] {
    const tileSize = 256;
    const scale = tileSize * Math.pow(2, zoom);
    const x = (lng + 180) / 360 * scale;
    const sinLat = Math.sin(lat * Math.PI / 180);
    const y = (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale;
    return [x, y];
}
/** 将经纬度数组转换为坐标系
 * @param map 当前的地图
 * @param lnglats [经度,纬度][]
 * @param zoom 缩放级别
 * @returns latlngs有效时返回 [x,y][]
 */
function getProjectedPointByLnglats(map: AMAP.Map | L.Map | MaplibreMap, lnglats: [number, number][] | undefined, zoom: number): [number, number][] {
    return lnglats?.map(e => getProjectedPointByLnglat(map, e[0], e[1], zoom)) || [];
}
/**对大小进行解析设置
 * @param map  当前的地图
 * @param info 大小信息和位置信息
 * @returns [x轴的像素大小 number,y轴的像素大小 number]
 */
function getSizeByMap(map: AMAP.Map | L.Map | MaplibreMap, info: MapPosition & MapSize): [number, number] {
    let { sizeFix, lnglat, size = [0, 0] } = info;
    if (!sizeFix || !lnglat) {
        Array.isArray(size) || (size = [size, size]);
        return size;
    }
    let sizes: [number, number] = Array.isArray(sizeFix) ? sizeFix : [sizeFix, sizeFix];
    let [x, y] = lnglat;
    let lngDiff = getLngDiffByDistance(map, sizes[1], [lnglat]);
    /**获取同纬度下，经度变化指定sizeFix后像素点的差值 */
    let [x0, y0] = getPointByLnglat(map, [x, y]);
    let [x1, y1] = getPointByLnglat(map, [x + lngDiff, y]);
    let xd = Math.abs(x1 - x0), yd = (xd * sizes[1]) / sizes[0];
    return [xd, yd];
}
/**获取地图实例的大小宽高
 * @param map 地图实例
 * @returns { w: number, h: number }
 */
function getMapSize(map: AMAP.Map | L.Map | MaplibreMap): { w: number, h: number } {
    let w: number, h: number;
    if (tsMapisMapLibre(map)) {
        const mapCanvas = map.getCanvas();
        const rect = mapCanvas.getBoundingClientRect();
        w = rect.width, h = rect.height;
    } else {
        let size: any = map.getSize();
        let { x, y, width, height } = size;
        w = x || width, h = y || height;
    }
    return { w, h };
}
/**
* 转化为通用地图事件
* @param e LeafletMouseEvent | AMap.MouseEventArgs | MaplibreMouseEvent
* @param map 地图实例
* @returns MapMouseEvent
*/
function getMapMouseEvent(e: LeafletMouseEvent | AMapMapsEvent | MaplibreMouseEvent, map: L.Map | AMAP.Map | MaplibreMap): MapMouseEvent {
    let latlng, point, page, originalEvent, type;
    tsisMapEventType(e.type as string)
    type = e.type as EventType;
    if (tsMapisLeaflet(map) && tsEventisLeaflet(e)) {
        const { latlng: Llatlng, originalEvent: LorginalEvent, containerPoint } = e;
        const { lat, lng } = Llatlng;
        latlng = { lat, lng };
        const { x, y } = containerPoint;
        point = { x, y };
        originalEvent = LorginalEvent;
    } else if (tsMapisAmap(map) && tsEventisAmap(e)) {
        const { pixel, originEvent, lnglat } = e;
        const { lat, lng } = lnglat;
        latlng = { lat, lng };
        const { x, y } = pixel;
        point = { x, y };
        originalEvent = originEvent;
    } else if (tsMapisMapLibre(map) && tsEventisMapLibre(e)) {
        const { lat, lng } = e.lngLat;
        latlng = { lat, lng };
        point = e.point;
        originalEvent = e.originalEvent;
    } else {
        throw new Error('百度地图暂时不支持！')
    }
    return {
        type,
        latlng,
        containerPoint: point,
        orginDOMEvent: originalEvent,
        orginMapEvent: e
    }
}
/**设置地图状态
*   showIndoorMap: boolean; // 是否在有矢量底图的时候自动展示室内地图，PC默认true,移动端默认false
*   resizeEnable: boolean; //是否监控地图容器尺寸变化，默认值为false
*   dragEnable: boolean; // 地图是否可通过鼠标拖拽平移，默认为true
*   keyboardEnable: boolean; //地图是否可通过键盘控制，默认为true
*   doubleClickZoom: boolean; // 地图是否可通过双击鼠标放大地图，默认为true
*   zoomEnable: boolean; //地图是否可缩放，默认值为true
*   rotateEnable: boolean; // 地图是否可旋转，3D视图默认为true，2D视图默认false
*/
function setMapStatus(map: AMAP.Map | L.Map | MaplibreMap, key: 'dragEnable', flag: boolean) {
    switch (key) {
        case 'dragEnable': if (tsMapisLeaflet(map)) {
            flag ? map.dragging.enable() : map.dragging.disable()
        } else if (tsMapisAmap(map)) {
            map.setStatus({ dragEnable: flag })
        } else if (tsMapisMapLibre(map)) {
            flag ? map.dragPan.enable() : map.dragPan.disable();
        }; break;
    }
}
/**
 * 设置地图中心
 * @param map 地图实例
 * @param center 中心 [lng,lat]顺序
 * @param zoom 缩放级别
 * @param offset 中心 但需要偏移固定像素
 */
function setViewCenter(map: L.Map | AMAP.Map | MaplibreMap, center: [number, number], zoom: number, offset?: [number, number]): void {
    if (offset) {
        const centerPixel = getPointByLnglat(map, center);
        center = getLngLatByPoint(map, [centerPixel[0] + offset[0], centerPixel[1] + offset[1]])
    }
    if (tsMapisLeaflet(map)) {
        map.setView([center[1], center[0]], zoom);
    } else if (tsMapisAmap(map)) {
        const [lng, lat] = center;
        /**84转火星 */
        const { lat: lat02, lng: lng02 } = um_togps84gcj02(lng, lat);
        const mapcenter: [number, number] = [lng02, lat02];
        map.setCenter(mapcenter);
        map.setZoom(zoom);
    } else if (tsMapisMapLibre(map)) {
        map.setCenter(center);
        map.setZoom(zoom);
    } else {
        throw new Error('百度地图暂时不支持！')
    }
}
/**
 * 设置地图最合适缩放位置中心
 * @param map 地图实例
 * @param allPoints 大于等于2个点
 */
function setFitBounds(map: L.Map | AMAP.Map | MaplibreMap, allPoints: [number, number][]): void;
/**
 * 设置地图最合适缩放位置中心
 * @param map 地图实例
 * @param southwest 地图左下
 * @param northeast 地图右上
 */
function setFitBounds(map: L.Map | AMAP.Map | MaplibreMap, southwest: [number, number], northeast: [number, number]): void;
/**
 * 设置地图最合适缩放位置中心
 * @param map 地图实例
 * @param point 点
 * @param point2 点2
 */
function setFitBounds(map: L.Map | AMAP.Map | MaplibreMap, point: [number, number] | [number, number][], point2?: [number, number]): void {
    let southwest: [number, number], northeast: [number, number];
    if (point.length == 0 || !point) return;
    if (tsIfTwoArr(point)) {
        // 传入坐标数组
        let maxLat = Math.max(...point.map((e) => e[1])),
            minLat = Math.min(...point.map((e) => e[1])),
            maxLng = Math.max(...point.map((e) => e[0])),
            minLng = Math.min(...point.map((e) => e[0]));
        southwest = [minLng, minLat];
        northeast = [maxLng, maxLat];
    } else {
        southwest = point;
        northeast = point2 || point;
    }
    if (tsMapisLeaflet(map)) {
        const bounds: LatLngBoundsExpression = [[southwest[1], southwest[0]], [northeast[1], northeast[0]]];
        map.fitBounds(bounds);
    } else if (tsMapisAmap(map)) {
        /**84转火星 */
        const { lat: swLat, lng: swLng } = um_togps84gcj02(southwest[0], southwest[1]);
        const { lat: neLat, lng: neLng } = um_togps84gcj02(northeast[0], northeast[1]);
        const bounds = new AMap.Bounds([swLng, swLat], [neLng, neLat]);
        const [zoom, center] = map.getFitZoomAndCenterByBounds(bounds);
        map.setZoomAndCenter(zoom, center);
    } else if (tsMapisMapLibre(map)) {
        map.fitBounds([southwest, northeast], { padding: 100, duration: 0 });
    }
}

/**将数值转换为经纬度字符串
 * @param value 数值
 * @param ifLng 是否是经度
 * @param ifDMS 是否是DMS度分秒格式，否则显示度格式，默认精度为5
 * @returns 经纬度字符串
 */
function getLnglatByValue(value: number, ifLng: boolean, ifDMS?: boolean): string {
    let unit = "N";
    if (value < 0) unit = "S"
    if (ifLng) {
        unit = "E";
        while (value < 0) { value = value + 360 }
        value = value % 360;
        if (value > 180) {
            unit = 'W'; value = 360 - value
        }
    }
    value = Math.abs(value)
    if (!ifDMS) return Math.round(value * Math.pow(10, 5)) / Math.pow(10, 5) + '°' + unit;
    let f = value % 1 * 60
    let m = (f % 1 * 60).toFixed(2)
    let d = Math.floor(value);
    f = Math.floor(f);
    return `${d}°${f}'${m}"${unit}`
}
/**根据地图事件获取经纬度
 * @param e 事件
 * @returns 经纬度[lng, lat]
 */
function getLngLatByEvent(e: LeafletMouseEvent | AMapMapsEvent | MaplibreMouseEvent): [number, number] | null {
    if (!e) return null;
    if (tsEventisLeaflet(e)) {
        const { lat, lng } = e.latlng;
        return [lng, lat];
    } else if (tsEventisAmap(e)) {
        const { lat, lng } = e.lnglat;
        return [lng, lat];
    } else if (tsEventisMapLibre(e)) {
        const { lat, lng } = e.lngLat;
        return [lng, lat];
    }
    return null;
}

export {
    getAngle,
    getBounds,
    getDiffLatitude,
    getDistance,
    getLngLatByPoint,
    getLngDiffByDistance,
    getPointByLnglat,
    getPointsByLnglats,
    getProjectedPointByLnglat,
    getProjectedPointByLnglats,
    getSizeByMap,
    getMapSize,
    setMapStatus,
    getMapMouseEvent,
    setFitBounds,
    setViewCenter,
    getLnglatByValue,
    getLngLatByEvent,
    // 保持 um_ 前缀的兼容导出
    getAngle as um_getAngle,
    getBounds as um_getBounds,
    getDiffLatitude as um_getDiffLatitude,
    getDistance as um_getDistance,
    getLngLatByPoint as um_getLngLatByPoint,
    getLngDiffByDistance as um_getLngDiffByDistance,
    getPointByLnglat as um_getPointByLnglat,
    getPointsByLnglats as um_getPointsByLnglats,
    getProjectedPointByLnglat as um_getProjectedPointByLnglat,
    getProjectedPointByLnglats as um_getProjectedPointByLnglats,
    getSizeByMap as um_getSizeByMap,
    getMapSize as um_getMapSize,
    setMapStatus as um_setMapStatus,
    getMapMouseEvent as um_getMapMouseEvent,
    setFitBounds as um_setFitBounds,
    setViewCenter as um_setViewCenter,
    getLnglatByValue as um_getLnglatByValue,
    getLngLatByEvent as um_getLngLatByEvent,
};
