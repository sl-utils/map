"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.u_drawConvertgps84Togcj02 = convertgps84Togcj02;
const slu_map_1 = require("./slu-map");
function convertgps84Togcj02(map, plot) {
    if (!(0, slu_map_1.u_tsMapisAmap)(map))
        return;
    if (!Array.isArray(plot))
        plot = [plot];
    if (!plot.length)
        return;
    for (const p of plot) {
        if ('latlng' in p && p.latlng?.length) {
            const { lat, lng } = (0, slu_map_1.u_mapTogps84gcj02)(p.latlng[1], p.latlng[0]);
            p.latlng = [lat, lng];
        }
        if ('latlngs' in p && p.latlngs?.length) {
            p.latlngs = p.latlngs.map((latlng) => {
                const { lat, lng } = (0, slu_map_1.u_mapTogps84gcj02)(latlng[1], latlng[0]);
                return [lat, lng];
            });
        }
    }
}
//# sourceMappingURL=slu-draw.js.map