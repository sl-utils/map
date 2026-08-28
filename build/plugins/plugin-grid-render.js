import { MapCanvasLayer } from "../map";
import { SLUWorker } from "../utils/slu-worker";
import { um_deepMergeOpt, um_getLngLatByPoint, um_getMapSize } from "../utils";
export class MapPluginGridRender extends MapCanvasLayer {
    constructor(sluMap, options, mask) {
        super(sluMap.map, options);
        this.worker = new SLUWorker("grid-render-worker", (d) => this.workerCb(d));
        this.workerId = 0;
        this.options = {
            pane: "wavePane",
            zIndex: 200,
            mosaicColor: ["#337FFC", "#32AAFC", "#31D6FC", "#72E9C7", "#E0F16B", "#E4E35F",
                "#FFCC00", "#FF6600", "#FF0000", "#B03060",],
            mosaicValue: [0.5, 1, 2, 3, 4, 5, 7, 9, 12, 15]
        };
        this.options = um_deepMergeOpt(this.options, options);
        this.mask = mask;
        this.offCanvas = document.createElement("canvas");
        this.offCtx = this.offCanvas.getContext("2d", { alpha: true, desynchronized: true });
    }
    setData(datas) {
        if (!datas || datas.length === 0) {
            this.gridData = new Float32Array(0);
            this.gridMask = new Uint8Array(0);
        }
        else {
            const header = datas[0].header;
            this.lng0 = header.lo1;
            this.lat0 = header.la1;
            this.lngΔ = header.dx;
            this.latΔ = header.dy;
            this.nx = header.nx;
            this.ny = header.ny;
            const raw = datas[0].data;
            const grid = new Float32Array(raw.length);
            const mask = new Uint8Array(raw.length);
            for (let i = 0, len = raw.length; i < len; i++) {
                const v = raw[i];
                if (v == null || Number.isNaN(v) || !Number.isFinite(v)) {
                    mask[i] = 0;
                    grid[i] = 0;
                }
                else {
                    mask[i] = 1;
                    grid[i] = v;
                }
            }
            this.gridData = grid;
            this.gridMask = mask;
        }
        this.render();
    }
    render() {
        const { w, h } = um_getMapSize(this.map);
        const samplingRate = this.getSamplingRate();
        const geoStep = this.getGeoStep();
        const geoCols = Math.ceil(w / geoStep) + 1;
        const geoRows = Math.ceil(h / geoStep) + 1;
        const lngLatBuffer = new Float32Array(geoCols * geoRows * 2);
        let ptr = 0;
        for (let gy = 0; gy < geoRows; gy++) {
            const py = Math.min(h, gy * geoStep);
            for (let gx = 0; gx < geoCols; gx++) {
                const px = Math.min(w, gx * geoStep);
                const lnglat = um_getLngLatByPoint(this.map, [px, py]);
                lngLatBuffer[ptr++] = lnglat[0];
                lngLatBuffer[ptr++] = lnglat[1];
            }
        }
        this.worker.post({
            id: this.workerId++,
            width: Math.floor(w),
            height: Math.floor(h),
            invalid: null,
            samplingRate,
            geoStep,
            geoCols,
            geoRows,
            lngLatBuffer,
            grid: this.gridData,
            mask: this.gridMask,
            nx: this.nx,
            ny: this.ny,
            lng0: this.lng0,
            lat0: this.lat0,
            lngΔ: this.lngΔ,
            latΔ: this.latΔ,
            mosaicValue: this.options.mosaicValue,
            mosaicColor: this.options.mosaicColor
        }, [
            lngLatBuffer.buffer
        ]);
    }
    workerCb(res) {
        if ((this.workerId - 1) !== res.workerId) {
            return;
        }
        const { w, h } = um_getMapSize(this.map);
        this.offCanvas.width = w;
        this.offCanvas.height = h;
        this.offCtx.clearRect(0, 0, w, h);
        this.offCtx.drawImage(res.data, 0, 0);
        if (this.mask) {
            const bbox = this.getBBox();
            const zoom = this.map.getZoom();
            const maskCanvas = this.mask.getMask(bbox, zoom, w, h);
            this.offCtx.save();
            this.offCtx.globalCompositeOperation = "destination-out";
            this.offCtx.drawImage(maskCanvas, 0, 0);
            this.offCtx.restore();
        }
        this.resetCanvas();
        this.ctx.drawImage(this.offCanvas, 0, 0);
    }
    getSamplingRate() {
        const zoom = this.map.getZoom();
        return 1;
    }
    getGeoStep() {
        const zoom = this.map.getZoom();
        if (zoom >= 8)
            return 4;
        if (zoom >= 6)
            return 6;
        if (zoom >= 4)
            return 8;
        return 12;
    }
    getBBox() {
        const b = this.map.getBounds();
        if (b.getWest) {
            return [
                b.getWest(),
                b.getSouth(),
                b.getEast(),
                b.getNorth()
            ];
        }
        return [
            b.getSouthWest().lng,
            b.getSouthWest().lat,
            b.getNorthEast().lng,
            b.getNorthEast().lat
        ];
    }
    addMapEvents(map, key) {
        const render = () => this.render();
        map[key]("moveend", render);
        map[key]("zoomend", render);
    }
}
//# sourceMappingURL=plugin-grid-render.js.map