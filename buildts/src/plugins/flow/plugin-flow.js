"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapPluginFlow = void 0;
const slu_map_1 = require("../../utils/slu-map");
const map_1 = require("../../map");
const plugin_velocity_1 = require("./plugin-velocity");
class MapPluginFlow extends map_1.MapCanvasLayer {
    constructor(sluMap, options) {
        super(sluMap.map, options);
        this.options = {
            pane: "overlayPane",
            displayValues: true,
            maxVelocity: 15,
            unit: "m/s",
            angleConvention: "bearingCCW",
            emptyString: "No velocity data",
            colorScale: null,
        };
        this.windy = null;
        Object.assign(this.options, options);
    }
    setData(datas) {
        this.options.data = datas;
        if (this.windy) {
            this.windy.stop();
        }
        if (!datas || datas.length <= 0) {
            this.windy = null;
            this.resetCanvas();
            return;
        }
        if (!this.windy) {
            this.initWindy();
        }
        else {
            this.windy.setData(datas);
        }
        this.startWindy();
    }
    addCbMouseClick(cb) {
        this.cbClick = cb;
    }
    renderFixedData() {
        let datas = this.options.data;
        if (datas && datas.length > 0 && this.windy) {
            this.windy.stop();
            this.startWindy();
        }
    }
    addMapEvents(map, key) {
        const stop = () => this.stopWindy();
        const click = (e) => this.onMouseClick(e);
        map[key]("zoomstart", stop);
        map[key]("dragstart", stop);
        map[key]("click", click);
    }
    initWindy() {
        const options = Object.assign({ canvas: this.canvas, map: this.map }, this.options);
        this.windy = new plugin_velocity_1.PluginVelocity(options);
        this.canvas.classList.add("velocity-overlay");
    }
    startWindy() {
        const size = (0, slu_map_1.u_mapGetMapSize)(this.map);
        const { lngLeft, latTop, lngRight, latBottom } = (0, slu_map_1.u_mapGetBounds)(this.map);
        const sw = [lngLeft, latBottom], ne = [lngRight, latTop];
        this.windy?.start(size.w, size.h, [sw, ne]);
    }
    stopWindy() {
        if (this.windy)
            this.windy.stop();
    }
    onMouseClick(e) {
        if (!this.windy)
            return;
        const self = this;
        const { containerPoint } = (0, slu_map_1.u_mapGetMapMouseEvent)(e, this.map);
        const [lat, lng] = (0, slu_map_1.u_mapGetLatLngByPoint)(this.map, [containerPoint.x, containerPoint.y]);
        const gridValue = this.windy.interpolate(lng, lat);
        let degrees = 0, speed = 0;
        if (gridValue && !isNaN(gridValue[0]) && !isNaN(gridValue[1]) && gridValue[2]) {
            degrees = self.vectorToDegrees(gridValue[0], gridValue[1], this.options.angleConvention);
            speed = self.vectorToSpeed(gridValue[0], gridValue[1], this.options.unit);
        }
        this.cbClick?.(degrees, speed);
    }
    vectorToDegrees(uMs, vMs, angleConvention) {
        if (angleConvention.endsWith("CCW")) {
            vMs = vMs > 0 ? vMs = -vMs : Math.abs(vMs);
        }
        const abs = Math.sqrt(Math.pow(uMs, 2) + Math.pow(vMs, 2));
        const dir = Math.atan2(uMs / abs, vMs / abs);
        let degrees = dir * 180 / Math.PI + 180;
        if (angleConvention === "bearingCW" || angleConvention === "meteoCCW") {
            degrees += 180;
            if (degrees >= 360)
                degrees -= 360;
        }
        return degrees;
    }
    vectorToSpeed(uMs, vMs, unit) {
        const v = Math.sqrt(Math.pow(uMs, 2) + Math.pow(vMs, 2));
        switch (unit) {
            case "k/h": return this.meterSec2kilometerHour(v);
            case "kt": return this.meterSec2Knots(v);
            default: return v;
        }
        ;
    }
    meterSec2Knots(meters) {
        return meters / 0.514;
    }
    meterSec2kilometerHour(meters) {
        return meters * 3.6;
    }
}
exports.MapPluginFlow = MapPluginFlow;
//# sourceMappingURL=plugin-flow.js.map