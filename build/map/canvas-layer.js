import { Browser, DomUtil, Layer, Util, bind, extend } from "leaflet";
import { u_mapGetMapSize, u_tsLayerisAmap, u_tsLayerisLeaflet, u_tsLayerisMapLibre, u_tsMapisAmap, u_tsMapisLeaflet, u_tsMapisMapLibre } from "../utils/slu-map";
export class MapCanvasLayer {
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
            if (!this.map)
                return;
            this.resetCanvas();
            this.renderFixedData();
            this.renderAnimation();
        };
        this.map = map;
        Object.assign(this.options, opt);
        this.initCanvas();
        if (u_tsMapisLeaflet(map)) {
            this._initLeaflet();
        }
        else if (u_tsMapisAmap(map)) {
            this._initAMap();
        }
        else if (u_tsMapisMapLibre(map)) {
            this._initMapLibreAsync();
        }
    }
    onRemove() {
        this._eventSwitch(false);
        if (this.flagAnimation)
            cancelAnimationFrame(this.flagAnimation);
        this._onAmapRemove();
        this._onLeafletRemove();
        this._onMapLibreRemove();
        return this;
    }
    resetCanvas() {
        const { canvas, map } = this;
        if (u_tsMapisLeaflet(map)) {
            const topLeft = map.containerPointToLayerPoint([0, 0]);
            DomUtil.setPosition(canvas, topLeft);
        }
        const { w, h } = u_mapGetMapSize(map);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        this.width = canvas.width = w;
        this.height = canvas.height = h;
    }
    addMapEvents(map, key) { }
    ;
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
        const { canvas, options } = this;
        canvas.className = `sl-layer ${options.className || 'sl-canvas-map'}`;
        canvas.style['zIndex'] = `${options.zIndex || 100}`;
        canvas.style['transformOrigin'] = '50% 50%';
        this.initLeafletCanvas();
    }
    onAdd() {
        this._onAmapAdd();
        this._onMapLibreAdd();
        this._eventSwitch(true);
        return this;
    }
    _eventSwitch(flag = true) {
        let map = this.map;
        let key = flag ? 'on' : 'off';
        this.addLeafletEvent(flag);
        this.addMaplibreEvent(flag);
        this.addMapEvents(map, key);
    }
    _initAMap() {
        const opt = Object.assign({
            zooms: [3, 18],
            alwaysRender: false,
            zIndex: 200,
            render: () => this._redraw()
        }, this.options);
        this.layer = new AMap.CustomLayer(this.canvas, opt);
        this.onAdd();
    }
    _onAmapAdd() {
        const { map, layer } = this;
        if (u_tsMapisAmap(map) && u_tsLayerisAmap(layer)) {
            layer.setMap(map);
            layer.render = this._redraw;
        }
    }
    _onAmapRemove() {
        const { map, layer } = this;
        if (u_tsMapisAmap(map) && u_tsLayerisAmap(layer)) {
            map.remove(layer);
        }
    }
    _initLeaflet() {
        const layer = this.layer = new Layer(this.options);
        this.layer.onAdd = () => { this.onAdd(); return layer; };
        this.onAdd();
    }
    initLeafletCanvas() {
        const { canvas, map, options } = this;
        if (!u_tsMapisLeaflet(map))
            return;
        let pane = options.pane || 'overlayPane', paneEle = map.getPane(pane) || map.createPane(pane);
        paneEle.appendChild(canvas);
        paneEle.style.pointerEvents = 'none';
        let animated = map.options.zoomAnimation && Browser.any3d;
        DomUtil.addClass(canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));
        extend(canvas, {
            onselectstart: Util.falseFn,
            onmousemove: Util.falseFn,
            onload: bind(this._onCanvasLoad, this),
        });
    }
    _onLeafletRemove() {
        let { map, layer, options } = this;
        if (u_tsMapisLeaflet(map) && u_tsLayerisLeaflet(layer)) {
            let pane = options.pane;
            pane && map.getPane(pane)?.removeChild(this.canvas);
            layer.remove();
        }
    }
    addLeafletEvent(flag = true) {
        const map = this.map;
        if (u_tsMapisLeaflet(map)) {
            requestAnimationFrame(() => this._reset());
            const key = flag ? 'on' : 'off';
            map[key]('viewreset', this._reset, this);
            map[key]('resize', this._reset, this);
            map[key]('moveend', this._reset, this);
            if (map.options.zoomAnimation && Browser.any3d) {
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
        const scale = map.getZoomScale(e.zoom), offset = map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(map._getMapPanePos());
        DomUtil.setTransform(this.canvas, offset, scale);
    }
    _onCanvasLoad() {
        if (u_tsLayerisLeaflet(this.layer))
            this.layer.fire('load');
    }
    _initMapLibreAsync() {
        const map = this.map;
        if (u_tsMapisMapLibre(map)) {
            const isReady = map.loaded?.() || map.isStyleLoaded?.() || !!map.getStyle?.();
            if (isReady) {
                this._initMapLibre();
                this.onAdd();
            }
            else {
                map.once('load', () => {
                    this._initMapLibre();
                    this.onAdd();
                });
            }
        }
    }
    _initMapLibre() {
        const map = this.map;
        if (u_tsMapisMapLibre(map)) {
            const layerId = `slu-canvas-${Math.random().toString(36).slice(2)}`;
            const customLayer = {
                id: layerId,
                type: 'custom',
                renderingMode: '2d',
                onAdd: () => this._onMapLibreAdd(),
                onRemove: () => this._onMapLibreRemove(),
                render: () => { }
            };
            if (!map.getLayer(layerId)) {
                map.addLayer(customLayer);
            }
            this.layer = customLayer;
        }
    }
    _onMapLibreAdd() {
        const map = this.map;
        if (u_tsMapisMapLibre(map)) {
            const container = map.getCanvasContainer();
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.zIndex = String(this.options.zIndex || 100);
            container.appendChild(this.canvas);
        }
    }
    _onMapLibreRemove() {
        if (u_tsMapisMapLibre(this.map) && u_tsLayerisMapLibre(this.layer)) {
            if (this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
            if (this.layer?.id && this.map.getLayer(this.layer.id)) {
                this.map.removeLayer(this.layer.id);
            }
        }
    }
    addMaplibreEvent(flag = true) {
        const map = this.map;
        if (u_tsMapisMapLibre(map)) {
            requestAnimationFrame(() => this._reset());
            const key = flag ? 'on' : 'off';
            map[key]('resize', () => this._reset());
            map[key]('move', () => this._reset());
            map[key]('zoom', () => this._reset());
            map[key]('moveend', () => this._reset());
        }
        ;
    }
}
//# sourceMappingURL=canvas-layer.js.map