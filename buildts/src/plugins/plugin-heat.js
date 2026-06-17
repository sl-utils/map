"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapPluginHeat = void 0;
const map_1 = require("../map");
const L = __importStar(require("leaflet"));
const canvas_1 = require("../canvas");
const slu_map_1 = require("../utils/slu-map");
const utils_1 = require("../utils");
class MapPluginHeat extends map_1.MapCanvasLayer {
    constructor(sluMap, options) {
        super(sluMap.map, options);
        this._allHeats = [];
        this.heatDatas = [];
        this.options = {
            pane: 'canvas',
            className: 'heat',
            radius: 20,
            blur: 10,
            gradient: {
                0.2: 'blue',
                0.4: 'cyan',
                0.6: 'lime',
                0.8: 'yellow',
                1.0: 'red'
            },
            minOpacity: 0.1,
            gradientIndex: 1,
            ifTip: true,
            tipX: 80,
            tipY: 20,
        };
        this.setOptions(options);
    }
    renderAnimation() {
        this.heatDatas = this.computeHeatData();
        this.resetCanvas();
        this.drawByheatData();
        if (this.options && this.options.ifTip) {
            this._addGradient(this.computeZoomGradient().toString());
        }
    }
    setAllHeats(heats) {
        (0, utils_1.u_drawConvertgps84Togcj02)(this.map, heats);
        this._allHeats = heats;
        return this._redraw();
    }
    addHeat(heat) {
        this._allHeats.push(heat);
        return this._redraw();
    }
    delHeat(heat) {
        (0, slu_map_1.u_arrItemDel)(this._allHeats, heat);
        return this._redraw();
    }
    setOptions(options) {
        L.setOptions(this, options);
        this._updateOptions();
        return this._redraw();
    }
    _updateOptions() {
        this.genShadowRadius(this.options.radius, this.options.blur);
        if (this.options.gradient) {
            this.genGradient(this.options.gradient);
        }
    }
    computeHeatData() {
        let map = this.map;
        if (!map) {
            return [];
        }
        let r = this._r, size = (0, slu_map_1.u_mapGetMapSize)(map), sizePoint = L.point([size.w, size.h]), bounds = new L.Bounds(L.point([-r, -r]), sizePoint.add([r, r])), num = this.computeZoomGradient(), v = 1 / num, cellSize = r / 2, grid = [], panePos = map?._getMapPanePos?.() || { x: 0, y: 0 }, offsetX = panePos.x % cellSize, offsetY = panePos.y % cellSize, i, len, cell, x, y, j, len2, k;
        for (i = 0, len = this._allHeats.length; i < len; i++) {
            let heat = this._allHeats[i];
            let p = (0, slu_map_1.u_mapGetPointByLatlng)(this.map, heat.latlng);
            if (bounds.contains(p)) {
                x = Math.floor((p[0] - offsetX) / cellSize) + 2;
                y = Math.floor((p[1] - offsetY) / cellSize) + 2;
                const alt = heat.weight !== undefined ? heat.weight : 1;
                k = alt * v;
                grid[y] = grid[y] || [];
                cell = grid[y][x];
                if (!cell) {
                    grid[y][x] = [p[0], p[1], k];
                }
                else {
                    cell[0] = (cell[0] * cell[2] + p[0] * k) / (cell[2] + k);
                    cell[1] = (cell[1] * cell[2] + p[1] * k) / (cell[2] + k);
                    cell[2] += k;
                }
            }
        }
        let data = [];
        for (i = 0, len = grid.length; i < len; i++) {
            if (grid[i]) {
                for (j = 0, len2 = grid[i].length; j < len2; j++) {
                    cell = grid[i][j];
                    if (cell) {
                        data.push([
                            Math.round(cell[0]),
                            Math.round(cell[1]),
                            Math.min(cell[2], 1)
                        ]);
                    }
                }
            }
        }
        return data;
    }
    computeZoomGradient() {
        let gradientIndex = this.options.gradientIndex, zoom = this.map.getZoom(), num = Math.pow(2, Math.min(12, Math.atan(Math.PI / 8 / zoom) * 100 * gradientIndex | 0));
        return num;
    }
    _addGradient(num) {
        let ctx = this.ctx, x = this.options.tipX, y = this.options.tipY;
        ctx.globalAlpha = 0.5;
        ctx.drawImage(this._gradEl, x, y, 20, 128);
        ctx.fillText('0', x + 25, y);
        ctx.fillText(num, x + 25, y + 128);
    }
    drawByheatData() {
        let ctx = this.ctx;
        if (!this._circleShadow)
            this.genShadowRadius(this.options.radius);
        if (!this._grad)
            this.genGradient(this.options.gradient);
        let minOpacity = this.options.minOpacity || 0.05;
        for (let i = 0, len = this.heatDatas.length, p; i < len; i++) {
            p = this.heatDatas[i];
            ctx.globalAlpha = Math.min(Math.max(p[2], minOpacity), 1);
            ctx.drawImage(this._circleShadow, p[0] - this._r, p[1] - this._r);
        }
        const colored = ctx.getImageData(0, 0, this.width, this.height);
        this._colorize(colored.data, this._grad);
        ctx.putImageData(colored, 0, 0);
        return this;
    }
    genShadowRadius(r, blur = 15) {
        let circle = this._circleShadow = canvas_1.SLUCanvas.createCanvas(), ctx = circle.getContext('2d'), r2 = this._r = r + blur;
        circle.width = circle.height = r2 * 2;
        ctx.shadowOffsetX = ctx.shadowOffsetY = r2 * 2;
        ctx.shadowBlur = blur;
        ctx.shadowColor = 'black';
        ctx.beginPath();
        ctx.arc(-r2, -r2, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
    genGradient(grad) {
        let canvas = this._gradEl = canvas_1.SLUCanvas.createCanvas(), ctx = canvas.getContext('2d'), gradient = ctx.createLinearGradient(0, 0, 0, 256);
        canvas.width = 1;
        canvas.height = 256;
        for (let i in grad) {
            gradient.addColorStop(+i, grad[i]);
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 10, 256);
        this._grad = ctx.getImageData(0, 0, 1, 256).data;
        return this;
    }
    _colorize(pixels, gradient) {
        for (let i = 0, len = pixels.length, j; i < len; i += 4) {
            j = pixels[i + 3] * 4;
            if (j) {
                pixels[i] = gradient[j];
                pixels[i + 1] = gradient[j + 1];
                pixels[i + 2] = gradient[j + 2];
            }
        }
    }
}
exports.MapPluginHeat = MapPluginHeat;
//# sourceMappingURL=plugin-heat.js.map