import { u_mapTogps84gcj02, u_tsMapisAmap } from "./slu-map";
function convertgps84Togcj02(map, plot) {
    if (!u_tsMapisAmap(map))
        return;
    if (!Array.isArray(plot))
        plot = [plot];
    if (!plot.length)
        return;
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
export { convertgps84Togcj02 as u_drawConvertgps84Togcj02, };
//# sourceMappingURL=slu-draw.js.map