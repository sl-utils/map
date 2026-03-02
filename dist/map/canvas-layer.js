"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapCanvasLayer = void 0;
const L = require("leaflet");
const slu_map_1 = require("../utils/slu-map");
class MapCanvasLayer {
    constructor(map, opt) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext("2d");
        this.width = 0;
        this.height = 0;
        this.options = {
            pane: 'canvas',
        };
        this.flagAnimation = 0;
        this._redraw = () => {
            console.log('##########--------MapCanvasLayer=>_redraw--------##########');
            if (!this.map)
                return;
            this.resetCanvas();
            this.renderFixedData();
            this.renderAnimation();
        };
        this.map = map;
        Object.assign(this.options, opt);
        if (map instanceof L.Map) {
            this.type = 0;
            let layer = this.layer = new L.Layer(this.options);
            this.layer.onAdd = () => { this.onAdd(); return layer; };
        }
        else if (map instanceof AMap.Map) {
            this.type = 1;
            opt = Object.assign({
                zooms: [3, 18],
                alwaysRender: false,
                zIndex: 200,
            }, opt);
            this.layer = new AMap.CustomLayer(this.canvas, opt);
        }
        this.initCanvas();
        this.onAdd();
    }
    onRemove() {
        const { flagAnimation } = this;
        this._eventSwitch(false);
        if (flagAnimation)
            cancelAnimationFrame(flagAnimation);
        this._onAmapRemove();
        this._onLeafletRemove();
        return this;
    }
    resetCanvas() {
        const { canvas, map } = this;
        if (map instanceof L.Map) {
            var topLeft = map.containerPointToLayerPoint([0, 0]);
            L.DomUtil.setPosition(canvas, topLeft);
        }
        const { w, h } = (0, slu_map_1.u_mapGetMapSize)(map);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        this.width = canvas.width = w;
        this.height = canvas.height = h;
    }
    addMapEvents(map, key) { }
    renderFixedData() { }
    ;
    renderAnimation() { }
    ;
    on(key, cb) {
        this.map.on(key, (e) => { cb(); });
    }
    off(key, cb) {
        this.map.off(key, (e) => { cb(); });
    }
    initCanvas() {
        const { canvas, map, type, options, layer } = this;
        canvas.className = `sl-layer ${options.className || 'sl-canvas-map'}`;
        canvas.style['zIndex'] = `${options.zIndex || 100}`;
        canvas.style['transformOrigin'] = '50% 50%';
        this.initLeafletCanvas();
    }
    onAdd() {
        this._onAmapAdd();
        this._eventSwitch(true);
        let layer = this.layer;
        layer['render'] = this._redraw;
        return this;
    }
    _eventSwitch(flag = true) {
        let map = this.map;
        let key = flag ? 'on' : 'off';
        this.addLeafletEvent(flag);
        this.addMapEvents(map, key);
    }
    _onAmapAdd() {
        const { map, layer, type } = this;
        if (type === 1) {
            layer.setMap(map);
        }
    }
    _onAmapRemove() {
        const { map, layer, type } = this;
        if (type === 1) {
            map.remove(layer);
        }
    }
    initLeafletCanvas() {
        const { canvas, map, type, options } = this;
        if (type || !(map instanceof L.Map))
            return;
        let pane = options.pane || 'overlayPane', paneEle = map.getPane(pane) || map.createPane(pane);
        paneEle.appendChild(canvas);
        paneEle.style.pointerEvents = 'none';
        let animated = map.options.zoomAnimation && L.Browser.any3d;
        L.DomUtil.addClass(canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));
        L.extend(canvas, {
            onselectstart: L.Util.falseFn,
            onmousemove: L.Util.falseFn,
            onload: L.bind(this._onCanvasLoad, this),
        });
    }
    _onLeafletRemove() {
        let { map, layer, options, type } = this;
        if (type == 0) {
            let pane = options.pane;
            pane && map.getPane(pane)?.removeChild(this.canvas);
            layer.remove();
        }
    }
    addLeafletEvent(flag = true) {
        let map = this.map;
        if (map instanceof L.Map) {
            requestAnimationFrame(() => this._reset());
            let key = flag ? 'on' : 'off';
            map[key]('viewreset', this._reset, this);
            map[key]('resize', this._reset, this);
            map[key]('moveend', this._reset, this);
            if (map.options.zoomAnimation && L.Browser.any3d) {
                map[key]('zoomanim', this._animateZoom, this);
            }
        }
        ;
    }
    _reset() {
        this.resetCanvas();
        this._redraw();
    }
    _animateZoom(e) {
        let map = this.map;
        var scale = map.getZoomScale(e.zoom), offset = map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(map._getMapPanePos());
        L.DomUtil.setTransform(this.canvas, offset, scale);
    }
    _onCanvasLoad() {
        if (this.layer instanceof L.Layer)
            this.layer.fire('load');
    }
}
exports.MapCanvasLayer = MapCanvasLayer;
//# sourceMappingURL=canvas-layer.js.map