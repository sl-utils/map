"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapPluginBigData = void 0;
const rbush_1 = __importDefault(require("rbush"));
const plugin_draw_1 = require("./plugin-draw");
const canvas_1 = require("../canvas");
const slu_map_1 = require("../utils/slu-map");
const utils_1 = require("../utils");
class MapPluginBigData extends plugin_draw_1.MapPluginDraw {
    constructor(sluMap, options) {
        super(sluMap, options);
        this.rbush = new rbush_1.default();
        this.rbush_search = Object.create({});
        this.rbushData = [];
        this.bigDataImgs = [];
        this._renderBigDataImgs = [];
        this.resetRbush = () => {
            if (this.rbush)
                this.rbush.clear();
            this.rbushData.length = 0;
            this.bigDataImgs.forEach((el) => {
                this.transformRbush(el);
            });
            this.rbush.load(this.rbushData);
        };
        this.bigDataOption = options;
    }
    get renderBigDataList() {
        return this._renderBigDataImgs;
    }
    setbigDataImgs(imgs) {
        this.rbush.clear();
        this.rbushData.length = 0;
        (0, utils_1.u_drawConvertgps84Togcj02)(this.map, imgs);
        this.bigDataImgs = imgs;
        this.rbushData = imgs.map((el) => {
            this._draw.transformImageSize(el);
            return this.transformRbush(el);
        });
        this.rbush.load(this.rbushData);
        this.drawMapAll();
    }
    handleOverlapImage() {
        const that = this, { canvas, rbush, ctx, _draw, map } = that, zoom = map.getZoom(), { width, height } = canvas, { minBound = [width, height], maxCount } = this.getZoomOption(zoom), [boundWidth, boundHeight] = minBound;
        const drawCached = new Set();
        for (let i = 0; i < width; i += boundWidth / 2) {
            for (let j = 0; j < height; j += boundHeight / 2) {
                const center = [i + boundWidth / 2, j + boundHeight / 2];
                const search = this.rbush_search;
                search.maxX = center[0] + boundWidth / 2, search.minX = center[0] - boundWidth / 2,
                    search.maxY = center[1] + boundHeight / 2, search.minY = center[1] - boundHeight / 2;
                const rects = rbush.search(search);
                rects.forEach((el, idx) => {
                    const { data } = el;
                    if ((idx < maxCount || maxCount == -1) && !drawCached.has(data)) {
                        _draw.transformXY(data);
                        drawCached.add(data);
                        canvas_1.SLUCanvasImg.drawImg(data, ctx);
                        this._renderBigDataImgs.push(data);
                    }
                });
            }
        }
    }
    getZoomOption(zoom) {
        const that = this, { bigDataOption } = that, { zoomOption } = bigDataOption;
        if (zoomOption[zoom])
            return zoomOption[zoom];
        const zooms = Object.keys(zoomOption)
            .map((el) => Number(el))
            .sort((a, b) => Number(a) - Number(b));
        const len = zooms.length;
        for (let i = 0, len = zooms.length - 1; i < len; i++) {
            if (zoom > zooms[i] && zoom < zooms[i + 1]) {
                return zoomOption[zooms[i]];
            }
        }
        return zoomOption[zooms[len - 1]];
    }
    transformRbush(img) {
        const { latlng, size = [0, 0], left = 0, top = 0 } = img;
        let sizeX = size[0], sizeY = size[1];
        let [x, y] = (0, slu_map_1.u_mapGetPointByLatlng)(this.map, latlng);
        return {
            minX: x - sizeX / 2 + left,
            minY: y - sizeY / 2 + top,
            maxX: x + sizeX / 2 + left,
            maxY: y + sizeY / 2 + top,
            data: img,
            latlng: latlng
        };
    }
    drawMapAll() {
        console.time("start");
        this._renderBigDataImgs.length = 0;
        this._draw.drawMapAll();
        this.handleOverlapImage();
        console.timeEnd("start");
        return this;
    }
}
exports.MapPluginBigData = MapPluginBigData;
//# sourceMappingURL=plugin-big-data.js.map