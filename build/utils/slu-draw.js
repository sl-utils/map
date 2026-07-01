import { u_mapTogps84gcj02, u_tsMapisAmap } from "./slu-map";
function convertgps84Togcj02(map, plot) {
    if (!u_tsMapisAmap(map))
        return;
    if (!Array.isArray(plot))
        plot = [plot];
    if (!plot.length)
        return;
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
export { convertgps84Togcj02 as u_drawConvertgps84Togcj02, };
//# sourceMappingURL=slu-draw.js.map