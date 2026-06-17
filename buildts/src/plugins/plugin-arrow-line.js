"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapPluginArrowLine = void 0;
const map_1 = require("../map");
const utils_1 = require("../utils");
class MapPluginArrowLine extends map_1.MapCanvasLayer {
    constructor(sluMap, options) {
        super(sluMap.map, options);
        this.isDrag = false;
        this.arrowLine = new map_1.MapCanvasArrowLine(sluMap.map, this.ctx, options);
    }
    setAllLines(lines) {
        (0, utils_1.u_drawConvertgps84Togcj02)(this.map, lines);
        this.arrowLine.setAllLines(lines);
    }
    renderFixedData() {
        this.arrowLine.update();
    }
    renderAnimation(time) {
        this.resetCanvas();
        this.arrowLine.draw();
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
exports.MapPluginArrowLine = MapPluginArrowLine;
//# sourceMappingURL=plugin-arrow-line.js.map