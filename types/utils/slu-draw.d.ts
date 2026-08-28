import { CanvasPosition } from "../canvas";
import { MDataParticle } from "../plugins";
import type { MapArc, MapImage, MapLine, MapRect, MapText } from "../map";
import * as L from "leaflet";
import { Map as MaplibreMap } from 'maplibre-gl';
/**标绘绘制84坐标系(leaflet/maplibre-gl)转换为火星坐标系(高德)
 * @param map 地图实例
 * @param plot 标绘数据(修改latlnglatlngs原始坐标)
 */
declare function convertgps84Togcj02(map: L.Map | AMAP.Map | MaplibreMap, plot: MapArc | MapLine | MapRect | MapText | MapImage | MapArc[] | MapLine[] | MapRect[] | MapText[] | MapImage[] | (MDataParticle & CanvasPosition)[]): void;
export { convertgps84Togcj02 as um_drawConvertgps84Togcj02, };
