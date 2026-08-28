import { MapPluginGridBase } from "./plugin-grid-base";
import { um_getMapSize } from "../../utils";
export class MapPluginGrid extends MapPluginGridBase {
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
        const { w, h } = um_getMapSize(this.map);
        this.interpolateFieldByWorker({ x: 0, y: 0, width: w, height: h });
    }
    renderFixedData() {
        this.renderStart();
    }
}
//# sourceMappingURL=plugin-grid.js.map