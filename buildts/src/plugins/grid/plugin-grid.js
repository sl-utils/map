"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapPluginGrid = void 0;
const plugin_grid_base_1 = require("./plugin-grid-base");
const slu_map_1 = require("../../utils/slu-map");
class MapPluginGrid extends plugin_grid_base_1.MapPluginGridBase {
    constructor(sluMap, options) {
        super(sluMap.map, options);
        this.boundsDatas = [];
    }
    setData(datas) {
        this._setDatas(datas);
        this.renderStart();
    }
    getInfoByLngLat(lng, lat) {
        return this.interpolate(lng, lat);
    }
    renderStart() {
        const { w, h } = (0, slu_map_1.u_mapGetMapSize)(this.map);
        this.interpolateFieldByWorker({ x: 0, y: 0, width: w, height: h });
    }
    renderFixedData() {
        this.renderStart();
    }
}
exports.MapPluginGrid = MapPluginGrid;
//# sourceMappingURL=plugin-grid.js.map