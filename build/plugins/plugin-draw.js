import { MapCanvasLayer, MapCanvasDraw } from "../map";
export class MapPluginDraw extends MapCanvasLayer {
    constructor(sluMap, options) {
        super(sluMap.map, options);
        this._draw = new MapCanvasDraw(sluMap.map, this.canvas);
    }
    renderFixedData() {
        this.resetCanvas();
        this.drawMapAll();
    }
    drawMapAll() {
        this._draw.drawMapAll();
        return this;
    }
    setAllArcs(arcs) {
        this._draw.setAllArcs(arcs);
        return this;
    }
    setAllLines(lines) {
        this._draw.setAllLines(lines);
        return this;
    }
    setAllBezierLines(lines) {
        this._draw.setAllBezierLines(lines);
        return this;
    }
    setAllRects(rects) {
        this._draw.setAllRects(rects);
        return this;
    }
    setAllTexts(texts) {
        this._draw.setAllTexts(texts);
        return this;
    }
    setAllImgs(imgs) {
        this._draw.setAllImgs(imgs);
        return this;
    }
    setAllGifs(gifs) {
        this._draw.setAllGifs(gifs);
        return this;
    }
    addArc(arc) {
        this._draw.addArc(arc);
        return this;
    }
    addLine(line) {
        this._draw.addLine(line);
        return this;
    }
    addBezierLine(line) {
        this._draw.addBezierLine(line);
        return this;
    }
    addRect(rect) {
        this._draw.addRect(rect);
        return this;
    }
    addText(text) {
        this._draw.addText(text);
        return this;
    }
    addImg(img) {
        this._draw.addImg(img);
        return this;
    }
    delArc(arc) {
        this._draw.delArc(arc);
        return this;
    }
    delLine(line) {
        this._draw.delLine(line);
        return this;
    }
    delBezierLine(line) {
        this._draw.delBezierLine(line);
        return this;
    }
    delRect(rect) {
        this._draw.delRect(rect);
        return this;
    }
    delText(text) {
        this._draw.delText(text);
        return this;
    }
    delImg(img) {
        this._draw.delImg(img);
        return this;
    }
    delAll(type = 'all') {
        this._draw.delAll(type);
        return this;
    }
}
//# sourceMappingURL=plugin-draw.js.map