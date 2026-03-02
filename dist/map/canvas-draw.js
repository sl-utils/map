"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapCanvasDraw = void 0;
const slu_map_1 = require("../utils/slu-map");
const canvas_1 = require("../canvas");
class MapCanvasDraw {
    constructor(map, canvas) {
        this._allArcs = [];
        this._allLines = [];
        this._allBLins = [];
        this._allRects = [];
        this._allTexts = [];
        this._allImgs = [];
        this._allGifs = [];
        this.map = map;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }
    get zoom() {
        return this.map.getZoom();
    }
    reSetCanvas() {
        let { canvas, map, ctx } = this;
        const { w, h } = (0, slu_map_1.u_mapGetMapSize)(map);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        canvas.width = w;
        canvas.height = h;
    }
    drawMapAll() {
        this.reSetCanvas();
        this.drawByIndex();
    }
    async drawByIndex() {
        let textRects = [], that = this, { ctx, zoom } = that, all = that._allRects.map((e) => ({ ...e, mold: 'R' }));
        all = all.concat(that._allLines.map((e) => ({ ...e, mold: 'L' })));
        all = all.concat(that._allBLins.map((e) => ({ ...e, mold: 'B' })));
        all = all.concat(that._allArcs.map((e) => ({ ...e, mold: 'A' })));
        all = all.concat(that._allTexts.map((e) => ({ ...e, mold: 'T' })));
        all = all.concat(that._allImgs.map((e) => ({ ...e, mold: 'I' })));
        all = all.concat(that._allGifs.map((e) => ({ ...e, mold: 'G' })));
        all.sort((a, b) => (a.index || 0) - (b.index || 0));
        all.forEach((e, index) => {
            let { minZoom = 0, maxZoom = 50, overlap } = e;
            if (zoom >= minZoom && zoom <= maxZoom) {
                that.transformXY(e);
                switch (e.mold) {
                    case 'A':
                        that.transformArcSize(e);
                        canvas_1.SLUCanvas.drawArc(e, ctx);
                        break;
                    case 'L':
                        canvas_1.SLUCanvas.drawLine(e, ctx);
                        break;
                    case 'B':
                        canvas_1.SLUCanvas.drawBezierLine(e, ctx);
                        break;
                    case 'R':
                        canvas_1.SLUCanvas.drawPolygon(e, ctx);
                        break;
                    case 'T':
                        canvas_1.SLUCanvasText.drawText(e, textRects, ctx);
                        break;
                    case 'I':
                        that.transformImageSize(e);
                        canvas_1.SLUCanvasImg.drawImg(e, ctx);
                        break;
                    case 'G':
                        that.transformImageSize(e);
                        that.gif = that.gif || new canvas_1.SLUCanvasGif();
                        that.gif.loadGIF(e, ctx);
                        break;
                }
            }
        });
    }
    setAllArcs(arcs) {
        this._allArcs = arcs;
        return this;
    }
    setAllLines(lines) {
        this._allLines = lines;
        return this;
    }
    setAllBezierLines(lines) {
        this._allBLins = lines;
        return this;
    }
    setAllRects(rects) {
        this._allRects = rects;
        return this;
    }
    setAllTexts(texts) {
        this._allTexts = texts;
        return this;
    }
    setAllImgs(imgs) {
        this._allImgs = imgs;
        return this;
    }
    setAllGifs(gifs) {
        this._allGifs = gifs;
        return this;
    }
    addArc(arc) {
        if (!arc.latlngs && !arc.latlng)
            return this;
        this._allArcs.push(arc);
        return this;
    }
    addLine(line) {
        if (!line.latlngs)
            return this;
        this._allLines.push(line);
        return this;
    }
    addBezierLine(line) {
        if (!line.latlngs)
            return this;
        this._allBLins.push(line);
        return this;
    }
    addRect(rect) {
        if (!rect.latlngs)
            return this;
        this._allRects.push(rect);
        return this;
    }
    addText(text) {
        if (!text.latlngs && !text.latlng)
            return this;
        this._allTexts.push(text);
        return this;
    }
    addImg(img) {
        if (!img.latlngs && !img.latlng)
            return this;
        this._allImgs.push(img);
        return this;
    }
    delArc(arc) {
        (0, slu_map_1.u_arrItemDel)(this._allArcs, arc);
        return this;
    }
    delLine(line) {
        (0, slu_map_1.u_arrItemDel)(this._allLines, line);
        return this;
    }
    delBezierLine(line) {
        (0, slu_map_1.u_arrItemDel)(this._allBLins, line);
        return this;
    }
    delRect(rect) {
        (0, slu_map_1.u_arrItemDel)(this._allRects, rect);
        return this;
    }
    delText(text) {
        (0, slu_map_1.u_arrItemDel)(this._allTexts, text);
        return this;
    }
    delImg(img) {
        (0, slu_map_1.u_arrItemDel)(this._allImgs, img);
        return this;
    }
    delAll(type = 'all') {
        const that = this;
        switch (type) {
            case 'arc':
                that._allArcs = [];
                break;
            case 'line':
                that._allLines = [];
                break;
            case 'bezier':
                that._allBLins = [];
                break;
            case 'rect':
                that._allRects = [];
                break;
            case 'img':
                that._allImgs = [];
                break;
            case 'gif':
                that._allGifs = [];
                break;
            case 'text':
                that._allTexts = [];
                break;
            case 'all':
                that._allArcs = [];
                that._allLines = [];
                that._allBLins = [];
                that._allRects = [];
                that._allImgs = [];
                that._allGifs = [];
                that._allTexts = [];
        }
        return that;
    }
    transformXY(info) {
        info.points = (0, slu_map_1.u_mapGetPointsByLatlngs)(this.map, info.latlngs);
        info.point = (0, slu_map_1.u_mapGetPointByLatlng)(this.map, info.latlng);
    }
    transformImageSize(img) {
        let [x, y] = (0, slu_map_1.u_mapGetSizeByMap)(this.map, img);
        img.size = [x, y];
    }
    transformArcSize(arc) {
        let [x, y] = (0, slu_map_1.u_mapGetSizeByMap)(this.map, arc);
        arc.size = x;
    }
}
exports.MapCanvasDraw = MapCanvasDraw;
//# sourceMappingURL=canvas-draw.js.map