"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapPluginFixedHeat = void 0;
const map_1 = require("../map");
class MapPluginFixedHeat extends map_1.MapCanvasLayer {
    constructor(sluMap, options) {
        super(sluMap.map, options);
        this.fixedHeat = new map_1.MapCanvasFixedHeat(sluMap.map, this.ctx, options);
    }
    setData(data) {
        this.fixedHeat.setData(data);
    }
    renderFixedData() {
        this.fixedHeat.draw();
    }
}
exports.MapPluginFixedHeat = MapPluginFixedHeat;
//# sourceMappingURL=plugin-fixed-heat.js.map