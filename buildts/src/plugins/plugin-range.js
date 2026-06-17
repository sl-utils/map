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
exports.MapPluginRange = void 0;
const L = __importStar(require("leaflet"));
const plugin_draw_1 = require("./plugin-draw");
const map_1 = require("../map");
const slu_map_1 = require("../utils/slu-map");
const canvas_1 = require("../canvas");
class MapPluginRange extends map_1.MapCanvasLayer {
    constructor(sluMap, options) {
        const map = sluMap.map;
        super(map, options);
        this.options = {
            pane: 'canvas',
            className: 'range',
            colorLine: '#364A7D',
            colorArc: '#FFF',
            colorArcStart: '#415880',
            colorFont: ' #333333',
        };
        this.lnglats = [];
        this.ifDrag = false;
        this.eventClickTimer = null;
        this.eventDrag = () => {
            this.ifDrag = true;
        };
        this.eventDragend = () => {
            this.ifDrag = false;
        };
        this.eventClick = (e) => {
            this.eventClickTimer = setTimeout(() => {
                const { latlng } = (0, slu_map_1.u_mapGetMapMouseEvent)(e, this.map);
                let lnglat = new L.LatLng(latlng.lat, latlng.lng);
                let lnglats = this.lnglats[this.lnglats.length - 1];
                lnglats.push(lnglat);
                this.renderFixedData();
                this.renderAnimation();
            }, 100);
        };
        this.eventMousemove = (e) => {
            if (this.ifDrag)
                return;
            const { latlng } = (0, slu_map_1.u_mapGetMapMouseEvent)(e, this.map);
            this.lnglat = new L.LatLng(latlng.lat, latlng.lng);
            this.renderAnimation();
        };
        this.eventDblclick = () => {
            if (this.eventClickTimer) {
                clearTimeout(this.eventClickTimer);
                this.eventClickTimer = null;
            }
            this.close();
            this.lnglat = undefined;
            this.renderFixedData();
            this.renderAnimation();
        };
        Object.assign(this.options, options);
        this.ctrMapDraw = new map_1.MapCanvasDraw(map, this.canvas);
        this.ctrMapAniDraw = new plugin_draw_1.MapPluginDraw(sluMap, Object.assign({}, this.options, { className: this.options.className + ' ani' }));
        this.ctrEvent = new map_1.MapCanvasEvent(map);
    }
    open() {
        let i = this.lnglats.length;
        if (this.lnglats[i] && this.lnglats[i].length > 0)
            i++;
        this.lnglats[i] = [];
        this.eventSwitch(true);
        return this;
    }
    close(flag = true) {
        this.eventSwitch(false);
        flag && this.endCb?.();
    }
    onEnd(cb) {
        this.endCb = cb;
    }
    renderFixedData() {
        this.ctrMapDraw.reSetCanvas();
        this.ctrEvent.clearEventsByKey('range');
        let eves = [];
        let lineLen = this.lnglats.length, lines = [], arcs = [], texts = [], imgs = [], opt = this.options;
        for (let i = 0; i < lineLen; i++) {
            let lnglats = this.lnglats[i], latlngs = [], all = 0;
            for (let j = 0, len = lnglats.length; j < len; j++) {
                let p = lnglats[j], latlng = [p.lat, p.lng], text = '起点';
                latlngs.push(latlng);
                if (j == 0) {
                    let arc = { latlng: latlngs[0], size: 3, colorFill: opt.colorArcStart, colorLine: opt.colorLine };
                    arcs.push(arc);
                    texts.push({ text, latlng, colorFill: opt.colorFont, py: -12, px: 5, textAlign: 'right', panel: { colorFill: '#fff', fillAlpha: 0.8, colorLine: '#90A4A4', widthLine: 1 } });
                }
                else {
                    let per = lnglats[j - 1], pr = 5;
                    let distance = (0, slu_map_1.u_mapGetDistance)([per.lat, per.lng], [p.lat, p.lng], this.map);
                    let θ = (0, slu_map_1.u_mapGetAngle)(this.map, [per.lat, per.lng], [p.lat, p.lng]);
                    all += distance;
                    text = (distance > 1852 ? ((distance / 1852).toFixed(2) + ' nm') : (distance.toFixed(0) + ' m')) + '/' + θ.toFixed(2) + '°';
                    if (j == len - 1 && (i < lineLen - 1 || this.lnglat === undefined)) {
                        text = text + ';' + (all > 1852 ? ((all / 1852).toFixed(2) + ' nm') : (all.toFixed(0) + ' m'));
                        pr = 20;
                        imgs.push({
                            latlng: latlng,
                            posX: 17,
                            posY: 34,
                            left: 20,
                            size: [16, 16],
                            sizeo: [16, 16],
                            type: 'click',
                            url: '/assets/icons/icon-16.png',
                        });
                        eves.push({
                            latlng: latlng,
                            range: [8, 8],
                            type: 'click',
                            left: 20,
                            cb: () => {
                                this.lnglats.splice(i, 1);
                                this._redraw();
                            }
                        });
                    }
                    texts.push({
                        text, colorFill: opt.colorFont, latlng, py: -12, px: 5, textAlign: 'right', panel: {
                            pr, colorFill: '#fff', fillAlpha: 0.8, colorLine: '#90A4A4', widthLine: 1
                        }
                    });
                }
            }
            let arcLatlngs = [...latlngs];
            arcLatlngs.shift();
            let arc = { latlngs: arcLatlngs, size: 3, colorFill: opt.colorArc, colorLine: opt.colorLine };
            let line = { latlngs, colorLine: opt.colorLine };
            lines.push(line);
            arcs.push(arc);
        }
        this.ctrEvent.setEventsByKey(eves, 'range');
        this.ctrMapDraw.setAllImgs(imgs);
        this.ctrMapDraw.setAllLines(lines);
        this.ctrMapDraw.setAllArcs(arcs);
        this.ctrMapDraw.setAllTexts(texts);
        this.ctrMapDraw.drawMapAll();
    }
    renderAnimation() {
        if (!this.map)
            return;
        this.genAniLineDate();
    }
    genAniLineDate() {
        let layer = this.ctrMapAniDraw;
        layer.setAllTexts([]).setAllLines([]);
        let lineLen = this.lnglats.length;
        let last = this.lnglats[lineLen - 1] || [];
        if (this.lnglat && this.lnglat.lat !== undefined && last.length > 0) {
            let p = last[last.length - 1];
            let distance = (0, slu_map_1.u_mapGetDistance)([this.lnglat.lat, this.lnglat.lng], [p.lat, p.lng], this.map);
            let θ = (0, slu_map_1.u_mapGetAngle)(this.map, [p.lat, p.lng], [this.lnglat.lat, this.lnglat.lng]);
            let text = (distance > 1852 ? ((distance / 1852).toFixed(2) + ' nm') : (distance.toFixed(0) + ' m')) + '/' + θ.toFixed(2) + '°';
            layer.setAllLines([{ latlngs: [[this.lnglat.lat, this.lnglat.lng], [p.lat, p.lng]], dash: [3, 3], colorLine: '#364A7D' }]);
            layer.setAllTexts([{ latlng: [this.lnglat.lat, this.lnglat.lng], text, colorFill: '#FFFFFF' }]);
        }
        layer.drawMapAll();
    }
    drawEndTextImg(info, lineId) {
        let { latlng, panel, text = 'text' } = info;
        let point = (0, slu_map_1.u_mapGetPointByLatlng)(this.map, latlng);
        let ctx = document.createElement('canvas').getContext('2d');
        canvas_1.SLUCanvas.setCtxPara(ctx, info);
        let meas = ctx.measureText(text);
        let w = meas.width;
        let y1 = meas.actualBoundingBoxAscent;
        let y2 = meas.actualBoundingBoxDescent;
        let x0 = point[0] - w / 2;
        let y0 = point[1] - (y1 - y2) / 2;
        let size = 16;
        let px = x0 + w + 5 + size / 2, py = y0 - (y1 - y2) / 2;
        let mapLatlng = (0, slu_map_1.u_mapGetLatLngByPoint)(this.map, [px, py]);
        this.ctrEvent.pushEventByKey('text', {
            latlng: mapLatlng,
            point: [px, py],
            range: [10, 10],
            type: 'click',
            cb: () => {
                this.lnglats.splice(lineId, 1);
                this._redraw();
            }
        });
        return {
            latlng: mapLatlng,
            url: '/assets/images/icon/com_close_red.png',
            size: [16, 16],
        };
    }
    eventSwitch(flag) {
        let key = flag ? 'on' : 'off';
        if (flag)
            this.eventSwitch(false);
        this.map[key]('drag', this.eventDrag);
        this.map[key]('dragend', this.eventDragend);
        this.map[key]('click', this.eventClick);
        this.map[key]('dblclick', this.eventDblclick);
        this.map[key]('mousemove', this.eventMousemove);
    }
}
exports.MapPluginRange = MapPluginRange;
//# sourceMappingURL=plugin-range.js.map