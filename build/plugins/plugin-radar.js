import { MapCanvasLayer, MapCanvasRadar } from "../map";
import { um_drawConvertgps84Togcj02 } from "../utils";
export class MapPluginRadar extends MapCanvasLayer {
    constructor(sluMap, options) {
        super(sluMap.map, options);
        this.isDrag = false;
        this.canvasRadar = new MapCanvasRadar(sluMap.map, this.ctx);
    }
    setAllRadars(radars) {
        um_drawConvertgps84Togcj02(this.map, radars);
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
//# sourceMappingURL=plugin-radar.js.map