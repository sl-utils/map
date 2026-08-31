import type { EventType } from "../canvas";
import { _MapA, _MapAEvent, _MapL, _MapLEvent, _MapMEvent, _MapM, MapEventType, MapLayerType, MapType, _MapMLayer, _MapLLayer, _MapALayer } from "./slu-map-util";
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
function tsMapisLeaflet(map: MapType): map is _MapL {
    try {
        return map instanceof _MapL
    } catch (e) {
        return false
    }
}
/**判断地图是否是高德 */
function tsMapisAmap(map: MapType): map is _MapA {
    try {
        return typeof AMap !== "undefined" && map instanceof AMap.Map;
    } catch (e) {
        return false
    }
}
/**判断地图是否是MapLibre */
function tsMapisMapLibre(map: MapType): map is _MapM {
    try {
        return map instanceof _MapM;
    } catch (e) {
        return false
    }
}
/**判断地图是否是百度 */
function tsMapisBaidu(map: MapType): map is _MapL {
    try {
        return false
    } catch (e) {
        return false
    }
}
/**判断地图事件是否是Leaflet
 * @param e 地图事件
 */
function tsEventisLeaflet(e: MapEventType): e is _MapLEvent {
    return e && 'latlng' in e && 'containerPoint' in e;
}
/**判断地图事件是否是高德
 * @param e 地图事件
 */
function tsEventisAmap(e: MapEventType): e is _MapAEvent {
    return e && 'lnglat' in e && 'pixel' in e;
}
/**判断地图事件是否是MapLibre
 * @param e 地图事件
 */
function tsEventisMapLibre(e: MapEventType): e is _MapMEvent {
    return e && 'lngLat' in e && 'point' in e;
}
/**判断地图图层是否是Leaflet
 * @param e 地图图层
 */
function tsLayerisLeaflet(e: MapLayerType): e is _MapLLayer {
    return e instanceof _MapLLayer
}
/**判断地图图层是否是高德
 * @param e 地图图层
 */
function tsLayerisAmap(e: MapLayerType): e is _MapALayer {
    return typeof AMap !== "undefined" && e instanceof AMap.CustomLayer;
}
/**判断地图图层是否是maplibre
 * @param e 地图图层
 */
function tsLayerisMapLibre(e: MapLayerType): e is _MapMLayer {
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
    // 保持 um_ 前缀的兼容导出
    tsIfPlainObject as um_tsIfPlainObject,
    tsIfTwoArr as um_tsIfTwoArr,
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
