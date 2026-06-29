import { AMapMapsEvent, MapMouseEvent, MapPosition, MapEventType, MapSize, MapBounds, MapLatLng } from "../types";
import * as L from "leaflet";
import { LeafletMouseEvent, Layer, LatLngBoundsExpression } from "leaflet";
import { Map as MaplibreMap, MapMouseEvent as MaplibreMouseEvent, LngLat as MaplibreLngLat, CustomLayerInterface, Point as MaplibrePoint } from 'maplibre-gl';
declare var AMap: any;
const a = 6378245.0;
const pi = 3.1415926535897932384626;
const ee = 0.00669342162296594323;
const x_pi = pi * 3000.0 / 180.0;
/**地球半径 */
const R = 6378137;
/** 百度转84
 * @params lng 经度
 * @params lat 纬度
 * @returns 84坐标
 */
function tobd09gps84(lng: number, lat: number): MapLatLng {
    const gcj02 = tobd09cj02(lng, lat);
    const map84 = togcj02gps84(gcj02.lng, gcj02.lat);
    return map84;
}
/** 火星转84
 * @params lng 经度
 * @params lat 纬度
 * @returns 84坐标
 */
function togcj02gps84(lng: number, lat: number): MapLatLng {
    const coord = transform(lng, lat);
    const lontitude = lng * 2 - coord.lng;
    const latitude = lat * 2 - coord.lat;
    const newCoord = {
        lng: lontitude,
        lat: latitude
    };
    return newCoord;
}
/** 84转百度
 * @params lng 经度
 * @params lat 纬度
 * @returns 百度坐标
 */
function togps84bd09(lng: number, lat: number): MapLatLng {
    const gcj02 = togps84gcj02(lng, lat);
    const bd09 = togcj02bd09(gcj02.lng, gcj02.lat);
    return bd09;
}
/** 84转火星
 * @params lng 经度
 * @params lat 纬度
 * @returns 火星坐标
 */
function togps84gcj02(lng: number, lat: number): MapLatLng {
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
/** 火星转百度
 * @params lng 经度
 * @params lat 纬度
 * @returns 百度坐标
 */
function togcj02bd09(lng: number, lat: number): MapLatLng {
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
/** 百度转火星
 * @params lng 经度
 * @params lat 纬度
 * @returns 火星坐标
 */
function tobd09cj02(bd_lng: number, bd_lat: number): MapLatLng {
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
/** 转换坐标： WGS-84转为 GCJ-02
 * @params lng 经度
 * @params lat 纬度
 * @returns 转换后的坐标
 */
function transform(lng: number, lat: number): MapLatLng {
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
/** 纬度偏移计算
 * @params x 经度
 * @params y 纬度
 * @returns 纬度偏移量
 */
function transformLat(x: number, y: number): number {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    return ret;
}
/** 经度偏移计算
 * @params x 经度
 * @params y 纬度
 * @returns 经度偏移量
 */
function transformLng(x: number, y: number): number {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
    return ret;
}

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
        const { lat: swLat, lng: swLng } = togcj02gps84(southwest.lng, southwest.lat);
        const { lat: neLat, lng: neLng } = togcj02gps84(northeast.lng, northeast.lat);
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
    type = e.type as MapEventType;
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
        const { lat: lat02, lng: lng02 } = togps84gcj02(lng, lat);
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
        const { lat: swLat, lng: swLng } = togps84gcj02(southwest[0], southwest[1]);
        const { lat: neLat, lng: neLng } = togps84gcj02(northeast[0], northeast[1]);
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

/**移除数组指定item，会改变原数组，不改变引用地址
 * @param arr 要操作的数组
 * @param item 要移除的对象或某个对象key属性的值
 * @param key 用于比较的key属性
*/
function delItem<T>(arr: T[] | undefined, item: T, key?: keyof T): T[] {
    if (Array.isArray(arr) && arr.length > 0) {
        let index;
        if (key) {
            index = arr.findIndex(e => e == item || e[key] == item[key])
        } else {
            index = arr.findIndex(e => e == item);
        }
        index >= 0 && arr.splice(index, 1);
    }
    return arr || [];
}

/**
 * 用于深度合并同类型的配置：入参类型一致,不改变原对象,返回合并后的新对象
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的新对象
 */
function deepMergeOpt<T>(target: T, source: T): T {
    const result = { ...target };
    for (const key in source) {
        const sourceValue = source[key];
        if (sourceValue === undefined) {
            continue;
        }
        const targetValue = result[key];
        if (tsIfPlainObject(targetValue) && tsIfPlainObject(sourceValue)) {
            result[key] = deepMergeOpt(targetValue, sourceValue);
        } else {
            result[key] = sourceValue;
        }
    }
    return result;
}
/**判断参数是否是纯对象
 * @param value 参数
 */
function tsIfPlainObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
/**判断参数是否是二维数组 */
function tsIfTwoArr(value: [number, number] | [number, number][]): value is [number, number][] {
    return value && Array.isArray(value[0]);
}
/**判断参数是否是长度为2的一维数组
 * @param value 参数
 */
function tsIfOneArrTwoLen(value: number | [number, number]): value is [number, number] {
    return !!(value && Array.isArray(value) && value.length == 2);
}
/**判断地图是否是Leaflet */
function tsMapisLeaflet(map: AMAP.Map | L.Map | MaplibreMap): map is L.Map {
    try {
        return map instanceof L.Map
    } catch (e) {
        return false
    }
}
/**判断地图是否是高德 */
function tsMapisAmap(map: AMAP.Map | L.Map | MaplibreMap): map is AMAP.Map {
    try {
        return map instanceof AMap.Map
    } catch (e) {
        return false
    }
}
/**判断地图是否是MapLibre */
function tsMapisMapLibre(map: AMAP.Map | L.Map | MaplibreMap): map is MaplibreMap {
    try {
        return map instanceof MaplibreMap;
    } catch (e) {
        return false;
    }
}
/**判断地图是否是百度 */
function tsMapisBaidu(map: AMAP.Map | L.Map | MaplibreMap): map is L.Map {
    try {
        return false
    } catch (e) {
        return false
    }
}
/**判断地图事件是否是Leaflet
 * @param e 地图事件
 */
function tsEventisLeaflet(e: AMapMapsEvent | LeafletMouseEvent | MaplibreMouseEvent): e is LeafletMouseEvent {
    return e && 'latlng' in e && 'containerPoint' in e;
}
/**判断地图事件是否是高德
 * @param e 地图事件
 */
function tsEventisAmap(e: AMapMapsEvent | LeafletMouseEvent | MaplibreMouseEvent): e is AMapMapsEvent {
    return e && 'lnglat' in e && 'pixel' in e;
}
/**判断地图事件是否是MapLibre
 * @param e 地图事件
 */
function tsEventisMapLibre(e: AMapMapsEvent | LeafletMouseEvent | MaplibreMouseEvent): e is MaplibreMouseEvent {
    return e && 'lngLat' in e && 'point' in e;
}
/**判断地图图层是否是Leaflet
 * @param e 地图图层
 */
function tsLayerisLeaflet(e: Layer | AMAP.CustomLayer | CustomLayerInterface): e is Layer {
    return e instanceof Layer
}
/**判断地图图层是否是高德
 * @param e 地图图层
 */
function tsLayerisAmap(e: Layer | AMAP.CustomLayer | CustomLayerInterface): e is AMAP.CustomLayer {
    return e instanceof AMap.CustomLayer
}
/**判断地图图层是否是maplibre
 * @param e 地图图层
 */
function tsLayerisMapLibre(e: Layer | AMAP.CustomLayer | CustomLayerInterface): e is CustomLayerInterface {
    return e && typeof e === 'object' && 'id' in e && 'render' in e && 'type' in e;
}
/**判断对象的key是否是对象的属性名
 * @param obj 对象
 * @param key 键
 */
function tsisKeyOf<T extends object>(obj: T, key: PropertyKey): key is keyof T {
    return key in obj;
}
/**判断参数是否是地图事件类型
 * @param type 参数
 */
function tsisMapEventType(type: string): asserts type is MapEventType {
    if (!(['unset', 'click', 'dblclick', 'mousemove', 'mousedown', 'mouseup', 'mouseleave', 'mouseenter', 'rightclick'].includes(type))) {
        throw new Error(`Invalid MapEventType: ${type}`);
    }
}

export {
    delItem as u_arrItemDel,
    tobd09gps84 as u_mapTobd09gps84,
    togcj02gps84 as u_mapTogcj02gps84,
    togps84bd09 as u_mapTogps84bd09,
    togps84gcj02 as u_mapTogps84gcj02,
    togcj02bd09 as u_mapTogcj02bd09,
    tobd09cj02 as u_mapTobd09cj02,
    getAngle as u_mapGetAngle,
    getBounds as u_mapGetBounds,
    getDiffLatitude as u_mapGetDiffLatitude,
    getDistance as u_mapGetDistance,
    getLngLatByPoint as u_mapGetLngLatByPoint,
    getLngDiffByDistance as u_mapGetLngDiffByDistance,
    getPointByLnglat as u_mapGetPointByLnglat,
    getPointsByLnglats as u_mapGetPointsByLnglats,
    getProjectedPointByLnglat as u_mapGetProjectedPointByLnglat,
    getProjectedPointByLnglats as u_mapGetProjectedPointByLnglats,
    getSizeByMap as u_mapGetSizeByMap,
    getMapSize as u_mapGetMapSize,
    setMapStatus as u_mapSetMapStatus,
    getMapMouseEvent as u_mapGetMapMouseEvent,
    setFitBounds as u_mapSetFitBounds,
    setViewCenter as u_mapSetViewCenter,
    getLnglatByValue as u_mapGetLnglatByValue,
    getLngLatByEvent as u_mapGetLngLatByEvent,
    deepMergeOpt as u_deepMergeOpt,

    tsMapisLeaflet as u_tsMapisLeaflet,
    tsMapisAmap as u_tsMapisAmap,
    tsMapisBaidu as u_tsMapisBaidu,
    tsMapisMapLibre as u_tsMapisMapLibre,
    tsEventisLeaflet as u_tsEventisLeaflet,
    tsEventisAmap as u_tsEventisAmap,
    tsEventisMapLibre as u_tsEventisMapLibre,
    tsLayerisLeaflet as u_tsLayerisLeaflet,
    tsLayerisAmap as u_tsLayerisAmap,
    tsLayerisMapLibre as u_tsLayerisMapLibre,
    tsIfOneArrTwoLen as u_tsIfOneArrTwoLen,
    tsisKeyOf as u_tsIsKeyOf,
    tsisMapEventType as u_tsIsMapEventType,
};
