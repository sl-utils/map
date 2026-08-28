import { Layer } from "leaflet";
import type { LeafletMouseEvent } from "leaflet";
import type { MapMouseEvent as MaplibreMouseEvent, CustomLayerInterface } from 'maplibre-gl';
import { Map as MaplibreMap } from 'maplibre-gl';
import * as L from "leaflet";
import type { EventType } from "../canvas";
import type { AMapMapsEvent } from "../map";
declare var AMap: any;

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
        return false
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
function tsisMapEventType(type: string): asserts type is EventType {
    if (!(['unset', 'click', 'dblclick', 'mousemove', 'mousedown', 'mouseup', 'mouseleave', 'mouseenter', 'rightclick'].includes(type))) {
        throw new Error(`Invalid MapEventType: ${type}`);
    }
}

export {
    tsIfPlainObject,
    tsIfTwoArr,
    tsIfOneArrTwoLen,
    tsMapisLeaflet,
    tsMapisAmap,
    tsMapisBaidu,
    tsMapisMapLibre,
    tsEventisLeaflet,
    tsEventisAmap,
    tsEventisMapLibre,
    tsLayerisLeaflet,
    tsLayerisAmap,
    tsLayerisMapLibre,
    tsisKeyOf,
    tsisMapEventType,
    // 保持 um_ 前缀的兼容导出
    tsMapisLeaflet as um_tsMapisLeaflet,
    tsMapisAmap as um_tsMapisAmap,
    tsMapisBaidu as um_tsMapisBaidu,
    tsMapisMapLibre as um_tsMapisMapLibre,
    tsEventisLeaflet as um_tsEventisLeaflet,
    tsEventisAmap as um_tsEventisAmap,
    tsEventisMapLibre as um_tsEventisMapLibre,
    tsLayerisLeaflet as um_tsLayerisLeaflet,
    tsLayerisAmap as um_tsLayerisAmap,
    tsLayerisMapLibre as um_tsLayerisMapLibre,
    tsIfOneArrTwoLen as um_tsIfOneArrTwoLen,
    tsisKeyOf as um_tsIsKeyOf,
    tsisMapEventType as um_tsIsMapEventType,
};
