import type { MapLatLng } from "../map";
import { CanvasPosition } from "../canvas";
import { MDataParticle } from "../plugins";
import type { MapArc, MapImage, MapLine, MapRect, MapText } from "../map";
import { MapType } from "./";
/**百度转84
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
/**标绘绘制84坐标系(leaflet/maplibre-gl)转换为火星坐标系(高德)
 * @param map 地图实例
 * @param plot 标绘数据(修改latlnglatlngs原始坐标)
 */
declare function convertgps84Togcj02(map: MapType, plot: MapArc | MapLine | MapRect | MapText | MapImage | MapArc[] | MapLine[] | MapRect[] | MapText[] | MapImage[] | (MDataParticle & CanvasPosition)[]): void;
export { tobd09gps84 as um_tobd09gps84, togcj02gps84 as um_togcj02gps84, togps84bd09 as um_togps84bd09, togps84gcj02 as um_togps84gcj02, togcj02bd09 as um_togcj02bd09, tobd09cj02 as um_tobd09cj02, convertgps84Togcj02 as um_drawConvertgps84Togcj02, };
