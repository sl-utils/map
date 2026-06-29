import { CanvasPosition, DataMapParticle, MapArc, MapImage, MapLine, MapRect, MapText } from "../types";
import { u_mapTogps84gcj02, u_tsMapisAmap } from "./slu-map";
import * as L from "leaflet";
import { Map as MaplibreMap } from 'maplibre-gl';

/**标绘绘制84坐标系(leaflet/maplibre-gl)转换为火星坐标系(高德)
 * @param map 地图实例
 * @param plot 标绘数据(修改latlnglatlngs原始坐标)
 */
function convertgps84Togcj02(map: L.Map | AMAP.Map | MaplibreMap, plot: MapArc | MapLine | MapRect | MapText | MapImage | MapArc[] | MapLine[] | MapRect[] | MapText[] | MapImage[] | (DataMapParticle & CanvasPosition)[]): void {
    if (!u_tsMapisAmap(map)) return;
    if (!Array.isArray(plot)) plot = [plot];
    if (!plot.length) return;
    for (const p of plot) {
        if ('lnglat' in p && p.lnglat?.length) {
            const { lat, lng } = u_mapTogps84gcj02(p.lnglat[0], p.lnglat[1]);
            p.lnglat = [lng, lat];
        }
        if ('lnglats' in p && p.lnglats?.length) {
            p.lnglats = p.lnglats.map((lnglat) => {
                const { lat, lng } = u_mapTogps84gcj02(lnglat[0], lnglat[1]);
                return [lng, lat];
            });
        }
    }
}
export {
    convertgps84Togcj02 as u_drawConvertgps84Togcj02,
}