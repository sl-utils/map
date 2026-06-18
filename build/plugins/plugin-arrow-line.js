import { MapCanvasArrowLine, MapCanvasLayer } from "../map";
import { u_drawConvertgps84Togcj02 } from "../utils";
export class MapPluginArrowLine extends MapCanvasLayer {
    constructor(sluMap, options) {
        super(sluMap.map, options);
        this.isDrag = false;
        this.arrowLine = new MapCanvasArrowLine(sluMap.map, this.ctx, options);
    }
    setAllLines(lines) {
        u_drawConvertgps84Togcj02(this.map, lines);
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
//# sourceMappingURL=plugin-arrow-line.js.map