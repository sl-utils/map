import { u_arrItemDel, u_mapGetMapSize, u_mapGetPointByLatlng, u_mapGetPointsByLatlngs, u_mapGetSizeByMap } from '../utils/slu-map';
import { SLUCanvas, SLUCanvasGif, SLUCanvasImg, SLUCanvasText } from '../canvas';
import { u_drawConvertgps84Togcj02 } from '../utils';
export class MapCanvasDraw {
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
        const { w, h } = u_mapGetMapSize(map);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        canvas.width = w;
        canvas.height = h;
    }
    drawMapAll() {
        this.reSetCanvas();
        this.drawByIndex();
    }
    drawByIndex() {
        let that = this, { ctx, zoom } = that, all = that._allRects.map((e) => ({ ...e, mold: 'R' }));
        all = all.concat(that._allLines.map((e) => ({ ...e, mold: 'L' })));
        all = all.concat(that._allBLins.map((e) => ({ ...e, mold: 'B' })));
        all = all.concat(that._allArcs.map((e) => ({ ...e, mold: 'A' })));
        all = all.concat(that._allTexts.map((e) => ({ ...e, mold: 'T' })));
        all = all.concat(that._allImgs.map((e) => ({ ...e, mold: 'I' })));
        all = all.concat(that._allGifs.map((e) => ({ ...e, mold: 'G' })));
        all.sort((a, b) => (a.index || 0) - (b.index || 0));
        that._allTexts.length && SLUCanvasText.openDrawText();
        all.forEach((e, index) => {
            let { minZoom = 0, maxZoom = 50, overlap } = e;
            if (zoom >= minZoom && zoom <= maxZoom) {
                that.transformXY(e);
                switch (e.mold) {
                    case 'A':
                        that.transformArcSize(e);
                        SLUCanvas.drawArc(e, ctx);
                        break;
                    case 'L':
                        SLUCanvas.drawLine(e, ctx);
                        break;
                    case 'B':
                        SLUCanvas.drawBezierLine(e, ctx);
                        break;
                    case 'R':
                        SLUCanvas.drawPolygon(e, ctx);
                        break;
                    case 'T':
                        SLUCanvasText.drawText(e, ctx);
                        break;
                    case 'I':
                        that.transformImageSize(e);
                        SLUCanvasImg.drawImg(e, ctx);
                        break;
                    case 'G':
                        that.transformImageSize(e);
                        that.gif = that.gif || new SLUCanvasGif();
                        that.gif.loadGIF(e, ctx);
                        break;
                }
            }
        });
    }
    setAllArcs(arcs) {
        u_drawConvertgps84Togcj02(this.map, arcs);
        this._allArcs = arcs;
        return this;
    }
    setAllLines(lines) {
        u_drawConvertgps84Togcj02(this.map, lines);
        this._allLines = lines;
        return this;
    }
    setAllBezierLines(lines) {
        u_drawConvertgps84Togcj02(this.map, lines);
        this._allBLins = lines;
        return this;
    }
    setAllRects(rects) {
        u_drawConvertgps84Togcj02(this.map, rects);
        this._allRects = rects;
        return this;
    }
    setAllTexts(texts) {
        u_drawConvertgps84Togcj02(this.map, texts);
        this._allTexts = texts;
        return this;
    }
    setAllImgs(imgs) {
        u_drawConvertgps84Togcj02(this.map, imgs);
        this._allImgs = imgs;
        return this;
    }
    setAllGifs(gifs) {
        u_drawConvertgps84Togcj02(this.map, gifs);
        this._allGifs = gifs;
        return this;
    }
    addArc(arc) {
        if (!arc.latlngs && !arc.latlng)
            return this;
        u_drawConvertgps84Togcj02(this.map, arc);
        this._allArcs.push(arc);
        return this;
    }
    addLine(line) {
        if (!line.latlngs)
            return this;
        u_drawConvertgps84Togcj02(this.map, line);
        this._allLines.push(line);
        return this;
    }
    addBezierLine(line) {
        if (!line.latlngs)
            return this;
        u_drawConvertgps84Togcj02(this.map, line);
        this._allBLins.push(line);
        return this;
    }
    addRect(rect) {
        if (!rect.latlngs)
            return this;
        u_drawConvertgps84Togcj02(this.map, rect);
        this._allRects.push(rect);
        return this;
    }
    addText(text) {
        if (!text.latlngs && !text.latlng)
            return this;
        u_drawConvertgps84Togcj02(this.map, text);
        this._allTexts.push(text);
        return this;
    }
    addImg(img) {
        if (!img.latlngs && !img.latlng)
            return this;
        u_drawConvertgps84Togcj02(this.map, img);
        this._allImgs.push(img);
        return this;
    }
    delArc(arc) {
        u_arrItemDel(this._allArcs, arc);
        return this;
    }
    delLine(line) {
        u_arrItemDel(this._allLines, line);
        return this;
    }
    delBezierLine(line) {
        u_arrItemDel(this._allBLins, line);
        return this;
    }
    delRect(rect) {
        u_arrItemDel(this._allRects, rect);
        return this;
    }
    delText(text) {
        u_arrItemDel(this._allTexts, text);
        return this;
    }
    delImg(img) {
        u_arrItemDel(this._allImgs, img);
        return this;
    }
    delAll(type = 'all') {
        const that = this;
        switch (type) {
            case 'arc':
                that._allArcs.length = 0;
                break;
            case 'line':
                that._allLines.length = 0;
                break;
            case 'bezier':
                that._allBLins.length = 0;
                break;
            case 'rect':
                that._allRects.length = 0;
                break;
            case 'img':
                that._allImgs.length = 0;
                break;
            case 'gif':
                that._allGifs.length = 0;
                break;
            case 'text':
                that._allTexts.length = 0;
                break;
            case 'all':
                that._allArcs.length = 0;
                that._allLines.length = 0;
                that._allBLins.length = 0;
                that._allRects.length = 0;
                that._allImgs.length = 0;
                that._allGifs.length = 0;
                that._allTexts.length = 0;
        }
        return that;
    }
    transformXY(info) {
        info.points = u_mapGetPointsByLatlngs(this.map, info.latlngs);
        info.point = u_mapGetPointByLatlng(this.map, info.latlng);
    }
    transformImageSize(img) {
        let [x, y] = u_mapGetSizeByMap(this.map, img);
        img.size = [x, y];
    }
    transformArcSize(arc) {
        let [x, y] = u_mapGetSizeByMap(this.map, arc);
        arc.size = x;
    }
}
//# sourceMappingURL=canvas-draw.js.map