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
        if ('latlng' in p && p.latlng?.length) {
            const { lat, lng } = u_mapTogps84gcj02(p.latlng[1], p.latlng[0]);
            p.latlng = [lat, lng];
        }
        if ('latlngs' in p && p.latlngs?.length) {
            p.latlngs = p.latlngs.map((latlng) => {
                const { lat, lng } = u_mapTogps84gcj02(latlng[1], latlng[0]);
                return [lat, lng];
            });
        }
    }
}
export {
    convertgps84Togcj02 as u_drawConvertgps84Togcj02,
}