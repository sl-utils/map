import type { EventType } from "../canvas";
import { _MapA, _MapAEvent, _MapL, _MapLEvent, _MapMEvent, _MapM, MapEventType, MapLayerType, MapType, _MapMLayer, _MapLLayer, _MapALayer } from "./slu-map-util";
/**判断参数是否是纯对象
 * @param value 参数
 */
declare function tsIfPlainObject(value: unknown): value is Record<string, unknown>;
/**判断参数是否是二维数组 */
declare function tsIfTwoArr(value: [number, number] | [number, number][]): value is [number, number][];
/**判断参数是否是长度为2的一维数组
 * @param value 参数
 */
declare function tsIfOneArrTwoLen(value: number | [number, number]): value is [number, number];
/**判断地图是否是Leaflet */
declare function tsMapisLeaflet(map: MapType): map is _MapL;
/**判断地图是否是高德 */
declare function tsMapisAmap(map: MapType): map is _MapA;
/**判断地图是否是MapLibre */
declare function tsMapisMapLibre(map: MapType): map is _MapM;
/**判断地图是否是百度 */
declare function tsMapisBaidu(map: MapType): map is _MapL;
/**判断地图事件是否是Leaflet
 * @param e 地图事件
 */
declare function tsEventisLeaflet(e: MapEventType): e is _MapLEvent;
/**判断地图事件是否是高德
 * @param e 地图事件
 */
declare function tsEventisAmap(e: MapEventType): e is _MapAEvent;
/**判断地图事件是否是MapLibre
 * @param e 地图事件
 */
declare function tsEventisMapLibre(e: MapEventType): e is _MapMEvent;
/**判断地图图层是否是Leaflet
 * @param e 地图图层
 */
declare function tsLayerisLeaflet(e: MapLayerType): e is _MapLLayer;
/**判断地图图层是否是高德
 * @param e 地图图层
 */
declare function tsLayerisAmap(e: MapLayerType): e is _MapALayer;
/**判断地图图层是否是maplibre
 * @param e 地图图层
 */
declare function tsLayerisMapLibre(e: MapLayerType): e is _MapMLayer;
/**判断对象的key是否是对象的属性名
 * @param obj 对象
 * @param key 键
 */
declare function tsisKeyOf<T extends object>(obj: T, key: PropertyKey): key is keyof T;
/**判断参数是否是地图事件类型
 * @param type 参数
 */
declare function tsisMapEventType(type: string): asserts type is EventType;
export { tsIfPlainObject as um_tsIfPlainObject, tsIfTwoArr as um_tsIfTwoArr, tsMapisLeaflet as um_tsMapisLeaflet, tsMapisAmap as um_tsMapisAmap, tsMapisBaidu as um_tsMapisBaidu, tsMapisMapLibre as um_tsMapisMapLibre, tsEventisLeaflet as um_tsEventisLeaflet, tsEventisAmap as um_tsEventisAmap, tsEventisMapLibre as um_tsEventisMapLibre, tsLayerisLeaflet as um_tsLayerisLeaflet, tsLayerisAmap as um_tsLayerisAmap, tsLayerisMapLibre as um_tsLayerisMapLibre, tsIfOneArrTwoLen as um_tsIfOneArrTwoLen, tsisKeyOf as um_tsIsKeyOf, tsisMapEventType as um_tsIsMapEventType, };
