import { Layer } from "leaflet";
import type { LeafletMouseEvent } from "leaflet";
import type { MapMouseEvent as MaplibreMouseEvent, CustomLayerInterface } from 'maplibre-gl';
import { Map as MaplibreMap } from 'maplibre-gl';
import * as L from "leaflet";
import type { EventType } from "../canvas";
import type { AMapMapsEvent } from "../map";
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
declare function tsMapisLeaflet(map: AMAP.Map | L.Map | MaplibreMap): map is L.Map;
/**判断地图是否是高德 */
declare function tsMapisAmap(map: AMAP.Map | L.Map | MaplibreMap): map is AMAP.Map;
/**判断地图是否是MapLibre */
declare function tsMapisMapLibre(map: AMAP.Map | L.Map | MaplibreMap): map is MaplibreMap;
/**判断地图是否是百度 */
declare function tsMapisBaidu(map: AMAP.Map | L.Map | MaplibreMap): map is L.Map;
/**判断地图事件是否是Leaflet
 * @param e 地图事件
 */
declare function tsEventisLeaflet(e: AMapMapsEvent | LeafletMouseEvent | MaplibreMouseEvent): e is LeafletMouseEvent;
/**判断地图事件是否是高德
 * @param e 地图事件
 */
declare function tsEventisAmap(e: AMapMapsEvent | LeafletMouseEvent | MaplibreMouseEvent): e is AMapMapsEvent;
/**判断地图事件是否是MapLibre
 * @param e 地图事件
 */
declare function tsEventisMapLibre(e: AMapMapsEvent | LeafletMouseEvent | MaplibreMouseEvent): e is MaplibreMouseEvent;
/**判断地图图层是否是Leaflet
 * @param e 地图图层
 */
declare function tsLayerisLeaflet(e: Layer | AMAP.CustomLayer | CustomLayerInterface): e is Layer;
/**判断地图图层是否是高德
 * @param e 地图图层
 */
declare function tsLayerisAmap(e: Layer | AMAP.CustomLayer | CustomLayerInterface): e is AMAP.CustomLayer;
/**判断地图图层是否是maplibre
 * @param e 地图图层
 */
declare function tsLayerisMapLibre(e: Layer | AMAP.CustomLayer | CustomLayerInterface): e is CustomLayerInterface;
/**判断对象的key是否是对象的属性名
 * @param obj 对象
 * @param key 键
 */
declare function tsisKeyOf<T extends object>(obj: T, key: PropertyKey): key is keyof T;
/**判断参数是否是地图事件类型
 * @param type 参数
 */
declare function tsisMapEventType(type: string): asserts type is EventType;
export { tsIfPlainObject, tsIfTwoArr, tsIfOneArrTwoLen, tsMapisLeaflet, tsMapisAmap, tsMapisBaidu, tsMapisMapLibre, tsEventisLeaflet, tsEventisAmap, tsEventisMapLibre, tsLayerisLeaflet, tsLayerisAmap, tsLayerisMapLibre, tsisKeyOf, tsisMapEventType, tsMapisLeaflet as um_tsMapisLeaflet, tsMapisAmap as um_tsMapisAmap, tsMapisBaidu as um_tsMapisBaidu, tsMapisMapLibre as um_tsMapisMapLibre, tsEventisLeaflet as um_tsEventisLeaflet, tsEventisAmap as um_tsEventisAmap, tsEventisMapLibre as um_tsEventisMapLibre, tsLayerisLeaflet as um_tsLayerisLeaflet, tsLayerisAmap as um_tsLayerisAmap, tsLayerisMapLibre as um_tsLayerisMapLibre, tsIfOneArrTwoLen as um_tsIfOneArrTwoLen, tsisKeyOf as um_tsIsKeyOf, tsisMapEventType as um_tsIsMapEventType, };
