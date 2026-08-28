import { um_togps84gcj02, um_tsMapisAmap } from "./";
function convertgps84Togcj02(map, plot) {
    if (!um_tsMapisAmap(map))
        return;
    if (!Array.isArray(plot))
        plot = [plot];
    if (!plot.length)
        return;
    for (const p of plot) {
        if ('lnglat' in p && p.lnglat?.length) {
            const { lat, lng } = um_togps84gcj02(p.lnglat[0], p.lnglat[1]);
            p.lnglat = [lng, lat];
        }
        if ('lnglats' in p && p.lnglats?.length) {
            p.lnglats = p.lnglats.map((lnglat) => {
                const { lat, lng } = um_togps84gcj02(lnglat[0], lnglat[1]);
                return [lng, lat];
            });
        }
    }
}
export { convertgps84Togcj02 as um_drawConvertgps84Togcj02, };
//# sourceMappingURL=slu-draw.js.map