import { AMapMapsEvent, MapMouseEvent, MapPosition, MapEventType, MapSize, MapBounds, MapLatLng } from "../types";
import * as L from "leaflet";
import { LeafletMouseEvent, Layer } from "leaflet";
import { Map as MaplibreMap, MapMouseEvent as MaplibreMouseEvent, CustomLayerInterface } from 'maplibre-gl';
/** 百度转84
 * @params lng 经度
 * @params lat 纬度
 * @returns 84坐标
 */
declare function tobd09gps84(lng: number, lat: number): MapLatLng;
/** 火星转84
 * @params lng 经度
 * @params lat 纬度
 * @returns 84坐标
 */
declare function togcj02gps84(lng: number, lat: number): MapLatLng;
/** 84转百度
 * @params lng 经度
 * @params lat 纬度
 * @returns 百度坐标
 */
declare function togps84bd09(lng: number, lat: number): MapLatLng;
/** 84转火星
 * @params lng 经度
 * @params lat 纬度
 * @returns 火星坐标
 */
declare function togps84gcj02(lng: number, lat: number): MapLatLng;
/** 火星转百度
 * @params lng 经度
 * @params lat 纬度
 * @returns 百度坐标
 */
declare function togcj02bd09(lng: number, lat: number): MapLatLng;
/** 百度转火星
 * @params lng 经度
 * @params lat 纬度
 * @returns 火星坐标
 */
declare function tobd09cj02(bd_lng: number, bd_lat: number): MapLatLng;
/** 测算两点与Y轴形成的角度大小（Y轴方向 ↑ ）
* @param map 当前的地图
* @param latLngA 第一个点的[纬度，经度]
* @param latLngB 第二个点的[纬度，经度]
* @returns 两点与正北方的角度
*/
declare function getAngle(map: AMAP.Map | L.Map | MaplibreMap, latLngA: [number, number], latLngB: [number, number]): number;
/**
 * 获取地图边界
 * @params map 地图实例
 * @returns 地图边界
 *  */
declare function getBounds(map: AMAP.Map | L.Map | MaplibreMap): MapBounds;
/**获取距离distance在地球上的纬度跨度
 * @param distance 距离(米)
*/
declare function getDiffLatitude(distance: number | string): number;
/**获取两点间的距离
 * @param latLngA A点的[纬度，经度]
 * @param latLngB B点的[纬度，经度]
 * @param map 地图实例
 * @returns 两点间的距离(米)
 */
declare function getDistance(latLngA: [number, number], latLngB: [number, number], map: L.Map | AMAP.Map | MaplibreMap): number;
/** 将坐标系转换为经纬度数
 * @param map 地图实例
 * @param point 像素点位
 * @returns latlng [lat,lng]
 */
declare function getLatLngByPoint(map: AMAP.Map | L.Map | MaplibreMap, point: [number, number] | undefined): [number, number];
/** 获取指定间隔距离的经度差值
 * @param map 地图实例
 * @param 间隔距离 @default 100
 * @param 纬度点位集合(纬度不同，相同距离经度变化差值不一样)
 */
declare function getLngDiffByDistance(map: AMAP.Map | L.Map | MaplibreMap, distance: number, latLng: [number, number][]): number;
/** 得到坐标系点位
 * @param map 当前的地图
 * @param latlng [纬度,经度]
 * @returns latlng有效时返回 [x,y] , 无效时返回 [-1000, -1000]
 */
declare function getPointByLatlng(map: AMAP.Map | L.Map | MaplibreMap, latlng: [number, number] | undefined): [number, number];
/** 将经纬度数组转换为坐标系
 * @param map 当前的地图
 * @param latlngs [纬度,经度][]
 * @returns latlngs有效时返回 [x,y][]
 */
declare function getPointsByLatlngs(map: AMAP.Map | L.Map | MaplibreMap, latlngs: [number, number][] | undefined): [number, number][];
/**
 * 经纬度数组 转 屏幕像素坐标
 * @param map 当前的地图
 * @param latlngs [纬度,经度][]
 * @param zoom 缩放级别
 */
declare function getProjectedPointByLatlng(map: AMAP.Map | L.Map | MaplibreMap, lng: number, lat: number, zoom: number): [number, number];
/** 将经纬度数组转换为坐标系
 * @param map 当前的地图
 * @param latlngs [经度,纬度][]
 * @param zoom 缩放级别
 * @returns latlngs有效时返回 [x,y][]
 */
declare function getProjectedPointByLatlngs(map: AMAP.Map | L.Map | MaplibreMap, latlngs: [number, number][] | undefined, zoom: number): [number, number][];
/**对大小进行解析设置
 * @param map  当前的地图
 * @param info 大小信息和位置信息
 * @returns [x轴的像素大小 number,y轴的像素大小 number]
 */
declare function getSizeByMap(map: AMAP.Map | L.Map | MaplibreMap, info: MapPosition & MapSize): [number, number];
/**获取地图实例的大小宽高
 * @param map 地图实例
 * @returns { w: number, h: number }
 */
declare function getMapSize(map: AMAP.Map | L.Map | MaplibreMap): {
    w: number;
    h: number;
};
/**
* 转化为通用地图事件
* @param e LeafletMouseEvent | AMap.MouseEventArgs | MaplibreMouseEvent
* @param map 地图实例
* @returns MapMouseEvent
*/
declare function getMapMouseEvent(e: LeafletMouseEvent | AMapMapsEvent | MaplibreMouseEvent, map: L.Map | AMAP.Map | MaplibreMap): MapMouseEvent;
/**设置地图状态
*   showIndoorMap: boolean; // 是否在有矢量底图的时候自动展示室内地图，PC默认true,移动端默认false
*   resizeEnable: boolean; //是否监控地图容器尺寸变化，默认值为false
*   dragEnable: boolean; // 地图是否可通过鼠标拖拽平移，默认为true
*   keyboardEnable: boolean; //地图是否可通过键盘控制，默认为true
*   doubleClickZoom: boolean; // 地图是否可通过双击鼠标放大地图，默认为true
*   zoomEnable: boolean; //地图是否可缩放，默认值为true
*   rotateEnable: boolean; // 地图是否可旋转，3D视图默认为true，2D视图默认false
*/
declare function setMapStatus(map: AMAP.Map | L.Map | MaplibreMap, key: 'dragEnable', flag: boolean): void;
/**
 * 设置地图中心
 * @param map 地图实例
 * @param center 中心 latlng顺序
 * @param zoom 缩放级别
 * @param offset 中心 但需要偏移固定像素
 */
declare function setViewCenter(map: L.Map | AMAP.Map | MaplibreMap, center: [number, number], zoom: number, offset?: [number, number]): void;
/**
 * 设置地图最合适缩放位置中心
 * @param map 地图实例
 * @param allPoints 大于等于2个点
 */
declare function setFitBounds(map: L.Map | AMAP.Map | MaplibreMap, allPoints: [number, number][]): void;
/**
 * 设置地图最合适缩放位置中心
 * @param map 地图实例
 * @param southwest 地图左下
 * @param northeast 地图右上
 */
declare function setFitBounds(map: L.Map | AMAP.Map | MaplibreMap, southwest: [number, number], northeast: [number, number]): void;
/**将数值转换为经纬度字符串
 * @param value 数值
 * @param ifLng 是否是经度
 * @param ifDMS 是否是DMS度分秒格式，否则显示度格式，默认精度为5
 * @returns 经纬度字符串
 */
declare function getLatlngByValue(value: number, ifLng: boolean, ifDMS?: boolean): string;
/**根据地图事件获取经纬度
 * @param e 事件
 * @returns 经纬度[lat, lng]
 */
declare function getLatLngByEvent(e: LeafletMouseEvent | AMapMapsEvent | MaplibreMouseEvent): [number, number] | null;
/**移除数组指定item，会改变原数组，不改变引用地址
 * @param arr 要操作的数组
 * @param item 要移除的对象或某个对象key属性的值
 * @param key 用于比较的key属性
*/
declare function delItem<T>(arr: T[] | undefined, item: T, key?: keyof T): T[];
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
declare function tsisMapEventType(type: string): asserts type is MapEventType;
export { delItem as u_arrItemDel, tobd09gps84 as u_mapTobd09gps84, togcj02gps84 as u_mapTogcj02gps84, togps84bd09 as u_mapTogps84bd09, togps84gcj02 as u_mapTogps84gcj02, togcj02bd09 as u_mapTogcj02bd09, tobd09cj02 as u_mapTobd09cj02, getAngle as u_mapGetAngle, getBounds as u_mapGetBounds, getDiffLatitude as u_mapGetDiffLatitude, getDistance as u_mapGetDistance, getLatLngByPoint as u_mapGetLatLngByPoint, getLngDiffByDistance as u_mapGetLngDiffByDistance, getPointByLatlng as u_mapGetPointByLatlng, getPointsByLatlngs as u_mapGetPointsByLatlngs, getProjectedPointByLatlng as u_mapGetProjectedPointByLatlng, getProjectedPointByLatlngs as u_mapGetProjectedPointByLatlngs, getSizeByMap as u_mapGetSizeByMap, getMapSize as u_mapGetMapSize, setMapStatus as u_mapSetMapStatus, getMapMouseEvent as u_mapGetMapMouseEvent, setFitBounds as u_mapSetFitBounds, setViewCenter as u_mapSetViewCenter, getLatlngByValue as u_mapGetLatlngByValue, getLatLngByEvent as u_mapGetLatLngByEvent, tsMapisLeaflet as u_tsMapisLeaflet, tsMapisAmap as u_tsMapisAmap, tsMapisBaidu as u_tsMapisBaidu, tsMapisMapLibre as u_tsMapisMapLibre, tsEventisLeaflet as u_tsEventisLeaflet, tsEventisAmap as u_tsEventisAmap, tsEventisMapLibre as u_tsEventisMapLibre, tsLayerisLeaflet as u_tsLayerisLeaflet, tsLayerisAmap as u_tsLayerisAmap, tsLayerisMapLibre as u_tsLayerisMapLibre, tsIfOneArrTwoLen as u_tsIfOneArrTwoLen, tsisKeyOf as u_tsIsKeyOf, tsisMapEventType as u_tsIsMapEventType, };
