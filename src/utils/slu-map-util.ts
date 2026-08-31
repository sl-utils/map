import { um_togcj02gps84, um_togps84gcj02 } from "./slu-coord";
import { um_tsMapisLeaflet, um_tsMapisAmap, um_tsMapisMapLibre, um_tsEventisLeaflet, um_tsEventisAmap, um_tsEventisMapLibre, um_tsIfTwoArr, um_tsIsMapEventType } from "./slu-type-guard";
import type { AMapMapsEvent as _MapAEvent, MapBounds, MapCanvasLayer, MapLatLng, MapMouseEvent, MapPosition, MapSize, MOpt } from "../map";
import type { EventType } from "../canvas";
import { Layer as _MapLLayer, LayerOptions as _MapLLayerOptions, LeafletMouseEvent as _MapLEvent, type LatLngBoundsExpression, Map as _MapL, MapOptions, latLng, CRS, Browser, DomUtil, extend, Util, bind } from "leaflet";
import type { CustomLayerInterface as _MapMLayer, Point as MaplibrePoint, MapMouseEvent as _MapMEvent, StyleSpecification as _MapMStyle } from 'maplibre-gl';
import { LngLat as MaplibreLngLat, Map as _MapM } from 'maplibre-gl';
import type { CustomLayer as _MapALayer, CustomLayerOption as _MapALayerOptions, Map as _MapA } from "../amap";
import * as AMapLoader from '@amap/amap-jsapi-loader';
declare var AMap: any;
export { _MapL, _MapA, _MapM, _MapLLayer, _MapALayer, _MapMLayer, _MapLEvent, _MapAEvent, _MapMEvent, _MapLLayerOptions, _MapALayerOptions, _MapMStyle };
/**地图类型 */
export type MapType = _MapL | _MapA | _MapM;
/**地图图层选项类型 */
export type MapLayerOptions = _MapLLayerOptions | _MapALayerOptions | _MapMLayer;
/**地图图层类型 */
export type MapLayerType = _MapLLayer | _MapALayer | _MapMLayer;
/**地图事件类型 */
export type MapEventType = _MapLEvent | _MapAEvent | _MapMEvent;
/**地球半径 */
const R = 6378137;
/** 测算两点与Y轴形成的角度大小（Y轴方向 ↑ ）
* @param map 当前的地图
* @param lnglatA 第一个点的[经度,纬度]
* @param lnglatB 第二个点的[经度,纬度]
* @returns 两点与正北方的角度
*/
function getAngle(map: MapType, lnglatA: [number, number], lnglatB: [number, number]): number {
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
function getBounds(map: MapType): MapBounds {
    if (um_tsMapisLeaflet(map)) {
        let bounds = map.getBounds();
        return {
            lngLeft: bounds.getSouthWest().lng,
            latTop: bounds.getNorthEast().lat,
            lngRight: bounds.getNorthEast().lng,
            latBottom: bounds.getSouthWest().lat
        }
    } else if (um_tsMapisAmap(map)) {
        let { southwest, northeast } = map.getBounds();
        const { lat: swLat, lng: swLng } = um_togcj02gps84(southwest.lng, southwest.lat);
        const { lat: neLat, lng: neLng } = um_togcj02gps84(northeast.lng, northeast.lat);
        return {
            lngLeft: swLng,
            latTop: neLat,
            lngRight: neLng,
            latBottom: swLat
        }
    } else if (um_tsMapisMapLibre(map)) {
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
function getDistance(lnglatA: [number, number], lnglatB: [number, number], map: MapType): number {
    let [lngA, latA] = lnglatA, [lngB, latB] = lnglatB, dis = 0;
    if (um_tsMapisLeaflet(map)) {
        dis = latLng([latA, lngA]).distanceTo([latB, lngB]);
    } else if (um_tsMapisAmap(map)) {
        dis = AMap.GeometryUtil.distance(lnglatA, lnglatB)
    } else if (um_tsMapisMapLibre(map)) {
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
function getLngLatByPoint(map: MapType, point: [number, number] | undefined): [number, number] {
    if (!point) return [0, 0];
    let p: MapLatLng;
    if (um_tsMapisLeaflet(map)) {
        p = map.containerPointToLatLng(point)
    } else if (um_tsMapisMapLibre(map)) {
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
function getLngDiffByDistance(map: MapType, distance: number = 100, lnglats: [number, number][]): number {
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
function getPointByLnglat(map: MapType, lnglat: [number, number] | undefined): [number, number] {
    if (!lnglat) return [-1000, -1000];
    let [lng = 180, lat = 90] = lnglat, p: AMAP.Pixel | L.Point | MaplibrePoint;
    if (isNaN(lat) || isNaN(lng)) return [-1000, -1000];
    if (um_tsMapisLeaflet(map)) {
        p = map.latLngToContainerPoint([lat, lng]);
    } else if (um_tsMapisAmap(map)) {
        p = map.lngLatToContainer([lng, lat]);
    } else if (um_tsMapisMapLibre(map)) {
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
function getPointsByLnglats(map: MapType, lnglats: [number, number][] | undefined): [number, number][] {
    return lnglats?.map(e => getPointByLnglat(map, e)) || [];
}
/**
 * 经纬度数组 转 屏幕像素坐标
 * @param map 当前的地图
 * @param lng 经度
 * @param lat 纬度
 * @param zoom 缩放级别
 */
function getProjectedPointByLnglat(map: MapType, lng: number, lat: number, zoom: number): [number, number] {
    if (um_tsMapisLeaflet(map)) {
        const p = map.project(latLng(lat, lng), zoom);
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
function getProjectedPointByLnglats(map: MapType, lnglats: [number, number][] | undefined, zoom: number): [number, number][] {
    return lnglats?.map(e => getProjectedPointByLnglat(map, e[0], e[1], zoom)) || [];
}
/**对大小进行解析设置
 * @param map  当前的地图
 * @param info 大小信息和位置信息
 * @returns [x轴的像素大小 number,y轴的像素大小 number]
 */
function getSizeByMap(map: MapType, info: MapPosition & MapSize): [number, number] {
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
function getMapSize(map: MapType): { w: number, h: number } {
    let w: number, h: number;
    if (um_tsMapisMapLibre(map)) {
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
* @param e MapEventType
* @param map 地图实例
* @returns MapMouseEvent
*/
function getMapMouseEvent(e: MapEventType, map: MapType): MapMouseEvent {
    let latlng, point, page, originalEvent, type;
    um_tsIsMapEventType(e.type as string)
    type = e.type as EventType;
    if (um_tsMapisLeaflet(map) && um_tsEventisLeaflet(e)) {
        const { latlng: Llatlng, originalEvent: LorginalEvent, containerPoint } = e;
        const { lat, lng } = Llatlng;
        latlng = { lat, lng };
        const { x, y } = containerPoint;
        point = { x, y };
        originalEvent = LorginalEvent;
    } else if (um_tsMapisAmap(map) && um_tsEventisAmap(e)) {
        const { pixel, originEvent, lnglat } = e;
        const { lat, lng } = lnglat;
        latlng = { lat, lng };
        const { x, y } = pixel;
        point = { x, y };
        originalEvent = originEvent;
    } else if (um_tsMapisMapLibre(map) && um_tsEventisMapLibre(e)) {
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
function setMapStatus(map: MapType, key: 'dragEnable', flag: boolean) {
    switch (key) {
        case 'dragEnable': if (um_tsMapisLeaflet(map)) {
            flag ? map.dragging.enable() : map.dragging.disable()
        } else if (um_tsMapisAmap(map)) {
            map.setStatus({ dragEnable: flag })
        } else if (um_tsMapisMapLibre(map)) {
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
function setViewCenter(map: MapType, center: [number, number], zoom: number, offset?: [number, number]): void {
    if (offset) {
        const centerPixel = getPointByLnglat(map, center);
        center = getLngLatByPoint(map, [centerPixel[0] + offset[0], centerPixel[1] + offset[1]])
    }
    if (um_tsMapisLeaflet(map)) {
        map.setView([center[1], center[0]], zoom);
    } else if (um_tsMapisAmap(map)) {
        const [lng, lat] = center;
        /**84转火星 */
        const { lat: lat02, lng: lng02 } = um_togps84gcj02(lng, lat);
        const mapcenter: [number, number] = [lng02, lat02];
        map.setCenter(mapcenter);
        map.setZoom(zoom);
    } else if (um_tsMapisMapLibre(map)) {
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
function setFitBounds(map: MapType, allPoints: [number, number][]): void;
/**
 * 设置地图最合适缩放位置中心
 * @param map 地图实例
 * @param southwest 地图左下
 * @param northeast 地图右上
 */
function setFitBounds(map: MapType, southwest: [number, number], northeast: [number, number]): void;
/**
 * 设置地图最合适缩放位置中心
 * @param map 地图实例
 * @param point 点
 * @param point2 点2
 */
function setFitBounds(map: MapType, point: [number, number] | [number, number][], point2?: [number, number]): void {
    let southwest: [number, number], northeast: [number, number];
    if (point.length == 0 || !point) return;
    if (um_tsIfTwoArr(point)) {
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
    if (um_tsMapisLeaflet(map)) {
        const bounds: LatLngBoundsExpression = [[southwest[1], southwest[0]], [northeast[1], northeast[0]]];
        map.fitBounds(bounds);
    } else if (um_tsMapisAmap(map)) {
        /**84转火星 */
        const { lat: swLat, lng: swLng } = um_togps84gcj02(southwest[0], southwest[1]);
        const { lat: neLat, lng: neLng } = um_togps84gcj02(northeast[0], northeast[1]);
        const bounds = new AMap.Bounds([swLng, swLat], [neLng, neLat]);
        const [zoom, center] = map.getFitZoomAndCenterByBounds(bounds);
        map.setZoomAndCenter(zoom, center);
    } else if (um_tsMapisMapLibre(map)) {
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
function getLngLatByEvent(e: MapEventType): [number, number] | null {
    if (!e) return null;
    if (um_tsEventisLeaflet(e)) {
        const { lat, lng } = e.latlng;
        return [lng, lat];
    } else if (um_tsEventisAmap(e)) {
        const { lat, lng } = e.lnglat;
        return [lng, lat];
    } else if (um_tsEventisMapLibre(e)) {
        const { lat, lng } = e.lngLat;
        return [lng, lat];
    }
    return null;
}
/**创建地图图层
 * @param map 地图实例
 * @param layer 图层
 * @returns 图层
*/
function createMapLayer(map: _MapM, that: MapCanvasLayer): _MapMLayer;
function createMapLayer(map: _MapL, that: MapCanvasLayer): _MapLLayer;
function createMapLayer(map: _MapA, that: MapCanvasLayer): _MapALayer;
function createMapLayer(map: MapType, that: MapCanvasLayer): MapLayerType {
    let layer: MapLayerType
    const { canvas, options } = that;
    if (um_tsMapisLeaflet(map)) {
        let pane = options.pane || 'overlayPane', paneEle = map.getPane(pane) || map.createPane(pane);
        /**如果指定的pane不存在就自己创建(往map添加div Pane) */
        paneEle.appendChild(canvas);
        paneEle.style.pointerEvents = 'none';
        let animated = map.options.zoomAnimation && Browser.any3d;
        DomUtil.addClass(canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));
        extend(canvas, {
            onselectstart: Util.falseFn,
            onmousemove: Util.falseFn,
            onload: bind(that._onCanvasLoad, that),
        });
        layer = new _MapLLayer(options)
    } else if (um_tsMapisAmap(map)) {
        layer = new AMap.CustomLayer(canvas, options)
    } else if (um_tsMapisMapLibre(map)) {
        const layerId = `slu-canvas-${Math.random().toString(36).slice(2)}`;
        const customLayer: _MapMLayer = {
            id: layerId,
            type: 'custom',
            renderingMode: '2d',
            onAdd: null,
            onRemove: null,
            render: null
        };
        if (!map.getLayer(layerId)) {
            map.addLayer(customLayer);
        }
        layer = customLayer;
    }
    return layer;
}

/**根据类型获取地图实例
 * @param mapType 地图类型
 * @returns 地图实例类型
*/
async function getMapInstance(type: 'L' | 'A' | 'B' | 'M', ele: string, opt: Partial<MOpt>): Promise<MapType> {
    if (type == 'L') return await initLeaflet(ele, opt);
    if (type == 'A') return await initAmap(ele, opt);
    if (type == 'M') return await initMaplibre(ele, opt);
    if (type == 'B') return await initAmap(ele, opt);
    return null;
}
/**---------------leaflet地图的相关方法------------------- */
/**初始化leaflet地图
 * @param ele 地图容器元素
 * @param opt 地图初始化参数
 * @returns LMap实例
 */
async function initLeaflet(ele: string, opt: Partial<MOpt>): Promise<_MapL> {
    const { zoom = 11, minZoom = 2, maxZoom = 20, center: [lng, lat] = [114.12027, 22.68471], dragging = true, zoomControl = false, attributionControl = false, doubleClickZoom = false, closePopupOnClick = false } = opt;
    let param: MapOptions = {
        dragging,
        zoomControl,
        zoom,
        minZoom,
        maxZoom,
        center: latLng(lat, lng),
        attributionControl,
        doubleClickZoom,
        crs: CRS.EPSG3857,
        closePopupOnClick,//点击地图不关闭弹出层
    };
    let map = new _MapL(ele, param);
    return Promise.resolve(map)
}
/**---------------高德地图的相关方法------------------- */
/**初始化高德地图
 * @param ele 地图容器元素
 * @param opt 地图初始化参数
 * @returns AMap实例
 */
async function initAmap(ele: string, opt: Partial<MOpt>): Promise<AMAP.Map> {
    const { zoom = 11, minZoom = 2, maxZoom = 20, center = [114.12027, 22.68471], dragging = true, zoomControl = false, attributionControl = false, doubleClickZoom = false, closePopupOnClick = false, showLabel = true } = opt;
    const { lat, lng } = um_togps84gcj02(center[0], center[1]);
    return AMapLoader.load({
        "key": "87e1b1e9aa88724f69208972546fdd57",   // 申请好的Web端开发者Key，首次调用 load 时必填
        "version": "1.4.15",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        "plugins": ["Map3D"]  //插件列表
    }).then(() => {
        // initAMapUI();
        let map = new AMap.Map(ele, {
            // mask: mask,
            center: [lng, lat],
            disableSocket: true,
            viewMode: '2D',
            mapStyle: 'amap://styles/dfd45346264e1fa2bb3b796f36cab42a',
            skyColor: "#A3CCFF",
            lang: 'zh_cn',  //设置地图语言类型
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
    })
}
/**---------------maplibre地图的相关方法------------------- */
/**初始化maplibre地图
 * @param ele 地图容器元素
 * @param opt 地图初始化参数
 * @returns maplibregl.Map实例
 */
async function initMaplibre(ele: string, opt: Partial<MOpt>): Promise<_MapM> {
    const { style = 'https://tiles.openfreemap.org/styles/bright', zoom = 11, minZoom = 2, maxZoom = 20, center: [lng, lat] = [114.12027, 22.68471], dragging = true, attributionControl = false, doubleClickZoom = false } = opt;
    let map = new _MapM({
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
    return Promise.resolve(map);
}

export {
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
    createMapLayer as um_createMapLayer,
    getMapInstance as um_getMapInstance,
};
