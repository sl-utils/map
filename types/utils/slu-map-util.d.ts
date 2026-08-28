import { type LeafletMouseEvent } from "leaflet";
import type { MapMouseEvent as MaplibreMouseEvent } from 'maplibre-gl';
import type { MapBounds, MapMouseEvent, MapPosition, MapSize } from "../map";
import type { AMapMapsEvent } from "../map";
import * as L from "leaflet";
import { Map as MaplibreMap } from 'maplibre-gl';
/** 测算两点与Y轴形成的角度大小（Y轴方向 ↑ ）
* @param map 当前的地图
* @param lnglatA 第一个点的[经度,纬度]
* @param lnglatB 第二个点的[经度,纬度]
* @returns 两点与正北方的角度
*/
declare function getAngle(map: AMAP.Map | L.Map | MaplibreMap, lnglatA: [number, number], lnglatB: [number, number]): number;
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
 * @param lnglatA A点的[经度,纬度]
 * @param lnglatB B点的[经度,纬度]
 * @param map 地图实例
 * @returns 两点间的距离(米)
 */
declare function getDistance(lnglatA: [number, number], lnglatB: [number, number], map: L.Map | AMAP.Map | MaplibreMap): number;
/** 将坐标系转换为经纬度数
 * @param map 地图实例
 * @param point 像素点位
 * @returns lnglat [lng,lat]
 */
declare function getLngLatByPoint(map: AMAP.Map | L.Map | MaplibreMap, point: [number, number] | undefined): [number, number];
/** 获取指定间隔距离的经度差值
 * @param map 地图实例
 * @param 间隔距离 @default 100
 * @param 纬度点位集合(纬度不同，相同距离经度变化差值不一样)
 */
declare function getLngDiffByDistance(map: AMAP.Map | L.Map | MaplibreMap, distance: number, lnglats: [number, number][]): number;
/** 得到坐标系点位
 * @param map 当前的地图
 * @param lnglat [经度,纬度]
 * @returns lnglat有效时返回 [x,y] , 无效时返回 [-1000, -1000]
 */
declare function getPointByLnglat(map: AMAP.Map | L.Map | MaplibreMap, lnglat: [number, number] | undefined): [number, number];
/** 将经纬度数组转换为坐标系
 * @param map 当前的地图
 * @param lnglats [经度,纬度][]
 * @returns lnglats有效时返回 [x,y][]
 */
declare function getPointsByLnglats(map: AMAP.Map | L.Map | MaplibreMap, lnglats: [number, number][] | undefined): [number, number][];
/**
 * 经纬度数组 转 屏幕像素坐标
 * @param map 当前的地图
 * @param lng 经度
 * @param lat 纬度
 * @param zoom 缩放级别
 */
declare function getProjectedPointByLnglat(map: AMAP.Map | L.Map | MaplibreMap, lng: number, lat: number, zoom: number): [number, number];
/** 将经纬度数组转换为坐标系
 * @param map 当前的地图
 * @param lnglats [经度,纬度][]
 * @param zoom 缩放级别
 * @returns latlngs有效时返回 [x,y][]
 */
declare function getProjectedPointByLnglats(map: AMAP.Map | L.Map | MaplibreMap, lnglats: [number, number][] | undefined, zoom: number): [number, number][];
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
 * @param center 中心 [lng,lat]顺序
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
declare function getLnglatByValue(value: number, ifLng: boolean, ifDMS?: boolean): string;
/**根据地图事件获取经纬度
 * @param e 事件
 * @returns 经纬度[lng, lat]
 */
declare function getLngLatByEvent(e: LeafletMouseEvent | AMapMapsEvent | MaplibreMouseEvent): [number, number] | null;
export { getAngle, getBounds, getDiffLatitude, getDistance, getLngLatByPoint, getLngDiffByDistance, getPointByLnglat, getPointsByLnglats, getProjectedPointByLnglat, getProjectedPointByLnglats, getSizeByMap, getMapSize, setMapStatus, getMapMouseEvent, setFitBounds, setViewCenter, getLnglatByValue, getLngLatByEvent, getAngle as um_getAngle, getBounds as um_getBounds, getDiffLatitude as um_getDiffLatitude, getDistance as um_getDistance, getLngLatByPoint as um_getLngLatByPoint, getLngDiffByDistance as um_getLngDiffByDistance, getPointByLnglat as um_getPointByLnglat, getPointsByLnglats as um_getPointsByLnglats, getProjectedPointByLnglat as um_getProjectedPointByLnglat, getProjectedPointByLnglats as um_getProjectedPointByLnglats, getSizeByMap as um_getSizeByMap, getMapSize as um_getMapSize, setMapStatus as um_setMapStatus, getMapMouseEvent as um_getMapMouseEvent, setFitBounds as um_setFitBounds, setViewCenter as um_setViewCenter, getLnglatByValue as um_getLnglatByValue, getLngLatByEvent as um_getLngLatByEvent, };
