import { _MapL, _MapM, _MapLLayer } from "./slu-map-util";
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
        return map instanceof _MapL;
    }
    catch (e) {
        return false;
    }
}
function tsMapisAmap(map) {
    try {
        return typeof AMap !== "undefined" && map instanceof AMap.Map;
    }
    catch (e) {
        return false;
    }
}
function tsMapisMapLibre(map) {
    try {
        return map instanceof _MapM;
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
    return e instanceof _MapLLayer;
}
function tsLayerisAmap(e) {
    return typeof AMap !== "undefined" && e instanceof AMap.CustomLayer;
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
export { tsIfPlainObject as um_tsIfPlainObject, tsIfTwoArr as um_tsIfTwoArr, tsMapisLeaflet as um_tsMapisLeaflet, tsMapisAmap as um_tsMapisAmap, tsMapisBaidu as um_tsMapisBaidu, tsMapisMapLibre as um_tsMapisMapLibre, tsEventisLeaflet as um_tsEventisLeaflet, tsEventisAmap as um_tsEventisAmap, tsEventisMapLibre as um_tsEventisMapLibre, tsLayerisLeaflet as um_tsLayerisLeaflet, tsLayerisAmap as um_tsLayerisAmap, tsLayerisMapLibre as um_tsLayerisMapLibre, tsIfOneArrTwoLen as um_tsIfOneArrTwoLen, tsisKeyOf as um_tsIsKeyOf, tsisMapEventType as um_tsIsMapEventType, };
//# sourceMappingURL=slu-type-guard.js.map