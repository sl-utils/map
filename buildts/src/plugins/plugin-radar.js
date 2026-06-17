"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapPluginRadar = void 0;
const map_1 = require("../map");
const utils_1 = require("../utils");
class MapPluginRadar extends map_1.MapCanvasLayer {
    constructor(sluMap, options) {
        super(sluMap.map, options);
        this.isDrag = false;
        this.canvasRadar = new map_1.MapCanvasRadar(sluMap.map, this.ctx);
    }
    setAllRadars(radars) {
        (0, utils_1.u_drawConvertgps84Togcj02)(this.map, radars);
        this.canvasRadar.setAllRadars(radars);
        return this;
    }
    addRadar(radar) {
        this.canvasRadar.addRadar(radar);
        return this;
    }
    renderFixedData() {
    }
    renderAnimation(time) {
        this.resetCanvas();
        this.canvasRadar.drawRadarStatic();
        this.canvasRadar.drawRadarAmi(time);
        this.flagAnimation && cancelAnimationFrame(this.flagAnimation);
        this.flagAnimation = requestAnimationFrame((time) => {
            if (this.isDrag)
                return;
            this.renderAnimation(time);
        });
    }
    addMapEvents(map, key) {
        const end = () => this.drawEnd();
        const start = () => this.drawStart();
        map[key]("dragstart", end);
        map[key]('dragend', start);
    }
    drawStart() {
        this.isDrag = false;
    }
    drawEnd() {
        this.isDrag = true;
    }
}
exports.MapPluginRadar = MapPluginRadar;
//# sourceMappingURL=plugin-radar.js.map