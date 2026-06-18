import { MapCanvasFixedHeat, MapCanvasLayer } from "../map";
export class MapPluginFixedHeat extends MapCanvasLayer {
    constructor(sluMap, options) {
        super(sluMap.map, options);
        this.fixedHeat = new MapCanvasFixedHeat(sluMap.map, this.ctx, options);
    }
    setData(data) {
        this.fixedHeat.setData(data);
    }
    renderFixedData() {
        this.fixedHeat.draw();
    }
}
//# sourceMappingURL=plugin-fixed-heat.js.map