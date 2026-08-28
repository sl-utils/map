import { MapPluginDraw } from "./plugin-draw";
import { MapCanvasDraw, MapCanvasEvent, MapCanvasLayer } from "../map";
import { um_deepMergeOpt, um_getAngle, um_getDistance, um_getLngLatByPoint, um_getMapMouseEvent, um_getPointByLnglat } from "../utils";
import { SLUCanvas } from "../canvas";
export class MapPluginRange extends MapCanvasLayer {
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
            textPanel: {
                radius: 3,
                pl: 2,
                pr: 2,
                pt: 2,
                pb: 2,
                colorFill: '#fff',
                fillAlpha: 0.8,
                colorLine: '#90A4A4',
                widthLine: 1
            }
        };
        this.lnglatLists = [];
        this.ifDrag = false;
        this.flagTimeout = null;
        this.eventDrag = () => {
            this.ifDrag = true;
        };
        this.eventDragend = () => {
            this.ifDrag = false;
        };
        this.eventClick = (e) => {
            this.flagTimeout = setTimeout(() => {
                const { latlng: { lat, lng } } = um_getMapMouseEvent(e, this.map);
                const lnglats = this.lnglatLists[this.lnglatLists.length - 1] || [];
                lnglats.push([lng, lat]);
                this.renderFixedData();
                this.renderAnimation();
            }, 100);
        };
        this.eventMousemove = (e) => {
            if (this.ifDrag)
                return;
            const { latlng: { lat, lng } } = um_getMapMouseEvent(e, this.map);
            this.lnglat = [lng, lat];
            this.renderAnimation();
        };
        this.eventDblclick = () => {
            if (this.flagTimeout) {
                clearTimeout(this.flagTimeout);
                this.flagTimeout = null;
            }
            this.close();
            this.lnglat = undefined;
            this.renderFixedData();
            this.renderAnimation();
        };
        if (options)
            this.options = um_deepMergeOpt(this.options, options);
        this.ctrMapDraw = new MapCanvasDraw(map, this.canvas);
        const aniOpt = um_deepMergeOpt(this.options, { className: this.options.className + ' ani' });
        this.ctrMapAniDraw = new MapPluginDraw(sluMap, aniOpt);
        this.ctrEvent = new MapCanvasEvent(map);
    }
    open() {
        let i = this.lnglatLists.length;
        if (this.lnglatLists[i] && this.lnglatLists[i].length > 0)
            i++;
        this.lnglatLists[i] = [];
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
        const { lnglatLists, options } = this, { textPanel, colorFont, colorLine, colorArcStart, colorArc } = options;
        const lineLen = lnglatLists.length, lines = [], arcs = [], texts = [], imgs = [];
        for (let i = 0; i < lineLen; i++) {
            const lnglats = lnglatLists[i], lngLats = [];
            let allDis = 0;
            for (let j = 0, len = lnglats.length; j < len; j++) {
                let cur = lnglats[j], lnglat = cur, text = '起点';
                lngLats.push(lnglat);
                if (j == 0) {
                    let arc = { lnglat: lngLats[0], size: 3, colorFill: colorArcStart, colorLine: colorLine };
                    arcs.push(arc);
                    texts.push({ text, lnglat, colorFill: colorFont, py: -12, px: 5, textAlign: 'right', panel: textPanel });
                }
                else {
                    let per = lnglats[j - 1], pr = 5;
                    let distance = um_getDistance(per, cur, this.map);
                    let θ = um_getAngle(this.map, per, cur);
                    allDis += distance;
                    text = (distance > 1852 ? ((distance / 1852).toFixed(2) + ' nm') : (distance.toFixed(0) + ' m')) + '/' + θ.toFixed(2) + '°';
                    if (j == len - 1 && (i < lineLen - 1 || this.lnglat === undefined)) {
                        text = text + ';' + (allDis > 1852 ? ((allDis / 1852).toFixed(2) + ' nm') : (allDis.toFixed(0) + ' m'));
                        pr = 20;
                        imgs.push({
                            lnglat: lnglat,
                            posX: 17,
                            posY: 34,
                            left: 20,
                            size: [16, 16],
                            sizeo: [16, 16],
                            type: 'click',
                            url: '/assets/icons/icon-16.png',
                        });
                        eves.push({
                            lnglat: lnglat,
                            range: [8, 8],
                            type: 'click',
                            left: 20,
                            cb: () => {
                                this.lnglatLists.splice(i, 1);
                                this._redraw();
                            }
                        });
                    }
                    texts.push({
                        text, colorFill: colorFont, lnglat, py: -12, px: 5, textAlign: 'right', panel: textPanel
                    });
                }
            }
            let arcLnglats = [...lngLats];
            arcLnglats.shift();
            let arc = { lnglats: arcLnglats, size: 3, colorFill: colorArc, colorLine: colorLine };
            let line = { lnglats, colorLine: colorLine };
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
        const { ctrMapAniDraw: layer, lnglatLists, lnglat: [lng, lat] = [], options: { textPanel } } = this;
        layer.setAllTexts([]).setAllLines([]);
        const last = lnglatLists[lnglatLists.length - 1] || [];
        if (lng !== undefined && lat !== undefined && last.length > 0) {
            const end = last[last.length - 1], move = [lng, lat];
            let distance = um_getDistance(move, end, this.map);
            let θ = um_getAngle(this.map, end, move);
            let text = (distance > 1852 ? ((distance / 1852).toFixed(2) + ' nm') : (distance.toFixed(0) + ' m')) + '/' + θ.toFixed(2) + '°';
            layer.setAllLines([{ lnglats: [move, end], dash: [3, 3], colorLine: '#364A7D' }]);
            layer.setAllTexts([{ lnglat: move, text, colorFill: '#FFFFFF', panel: textPanel }]);
        }
        layer.drawMapAll();
    }
    drawEndTextImg(info, lineId) {
        let { lnglat, panel, text = 'text' } = info;
        let point = um_getPointByLnglat(this.map, lnglat);
        let ctx = document.createElement('canvas').getContext('2d');
        SLUCanvas.setCtxPara(ctx, info);
        let meas = ctx.measureText(text);
        let w = meas.width;
        let y1 = meas.actualBoundingBoxAscent;
        let y2 = meas.actualBoundingBoxDescent;
        let x0 = point[0] - w / 2;
        let y0 = point[1] - (y1 - y2) / 2;
        let size = 16;
        let px = x0 + w + 5 + size / 2, py = y0 - (y1 - y2) / 2;
        let mapLnglat = um_getLngLatByPoint(this.map, [px, py]);
        this.ctrEvent.pushEventByKey('text', {
            lnglat: mapLnglat,
            point: [px, py],
            range: [10, 10],
            type: 'click',
            cb: () => {
                this.lnglatLists.splice(lineId, 1);
                this._redraw();
            }
        });
        return {
            lnglat: mapLnglat,
            url: '/assets/images/icon/icon-16.png',
            size: [16, 16],
            posX: 16,
            posY: 16 * 2,
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
//# sourceMappingURL=plugin-range.js.map