import { Browser, DomUtil, Map as LMap, Layer, Util, ZoomAnimEvent, bind, extend } from "leaflet";
import { u_mapGetMapSize, u_tsLayerisAmap, u_tsLayerisLeaflet, u_tsLayerisMapLibre, u_tsMapisAmap, u_tsMapisLeaflet, u_tsMapisMapLibre } from "../utils/slu-map";
import { OptMapCanvas } from "@sl-utils/map";
import { Map as MaplibreMap, CustomLayerInterface } from 'maplibre-gl';
declare var AMap: any;
/** 地图canvas基础图层类(基本所有插件都要继承此类) 删除永远比新增简单 
 * @constructor
 * @param MAP 地图实例
 * @param opt 图层配置项
*/
export class MapCanvasLayer {
    constructor(MAP: LMap, opt?: OptMapCanvas)
    constructor(MAP: MaplibreMap, opt?: OptMapCanvas)
    constructor(MAP: AMAP.Map, opt?: AMAP.CustomLayerOption)
    constructor(MAP: AMAP.Map | LMap | MaplibreMap, opt?: AMAP.CustomLayerOption | OptMapCanvas)
    constructor(map: AMAP.Map | LMap | MaplibreMap, opt?: AMAP.CustomLayerOption | OptMapCanvas) {
        this.map = map;
        Object.assign(this.options, opt);
        this.initCanvas();
        if (u_tsMapisLeaflet(map)) {
            this._initLeaflet();
        } else if (u_tsMapisAmap(map)) {
            this._initAMap();
        } else if (u_tsMapisMapLibre(map)) {
            this._initMapLibreAsync();
        }
    }
    /**地图实例*/
    public readonly map!: AMAP.Map | LMap | MaplibreMap;
    /**图层 */
    private layer: Layer | AMAP.CustomLayer | CustomLayerInterface;
    /**画布 */
    protected readonly canvas: HTMLCanvasElement = document.createElement('canvas');
    /**画布上下文 */
    protected readonly ctx: CanvasRenderingContext2D = this.canvas.getContext("2d")!;
    /**画布宽度 */
    protected width: number = 0;
    /**画布高度 */
    protected height: number = 0;
    /**图层配置项 */
    public readonly options: OptMapCanvas = {
        pane: 'canvas',
    };
    /**动画循环的id标识 */
    protected flagAnimation: number = 0;
    /**移除图层 */
    public onRemove(): MapCanvasLayer {
        this._eventSwitch(false);
        if (this.flagAnimation) cancelAnimationFrame(this.flagAnimation);
        this._onAmapRemove();
        this._onLeafletRemove();
        this._onMapLibreRemove();
        return this;
    }
    /**清空并重新设置画布 */
    public resetCanvas(): void {
        const { canvas, map } = this;
        if (u_tsMapisLeaflet(map)) {
            const topLeft = map.containerPointToLayerPoint([0, 0]);
            DomUtil.setPosition(canvas, topLeft);
        }
        const { w, h } = u_mapGetMapSize(map);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        //清除画布
        this.width = canvas.width = w;
        this.height = canvas.height = h;
    }
    /**添加或关闭地图特定的监听事件(_eventSwitch事件后自动调用)
     * @param map 地图实例
     * @param key 事件类型
     */
    protected addMapEvents(map: AMAP.Map | LMap | MaplibreMap, key: 'on' | 'off'): void { };
    /**绘制静态数据推荐使用此方法(固定的图) */
    protected renderFixedData(): void { };
    /** 推荐使用此方法绘制动态图(跟随鼠标拖动，移动时需要立刻绘制时)
     ** 动画图层绘制前的画布清空、计算等均在此方法中自行计算 
     ** 与renderFixedData本质是一样的
     */
    protected renderAnimation(): void { };
    /**添加地图事件监听
     * @param key 事件类型
     * @param cb 事件回调函数
     */
    protected on(key: string, cb: Function): void {
        this.map.on(key, (e) => { cb() })
    }
    /**移除地图事件监听
     * @param key 事件类型
     * @param cb 事件回调函数
     */
    protected off(key: string, cb: Function): void {
        this.map.off(key, (e) => { cb() })
    }
    /**初始化canvas */
    private initCanvas(): void {
        const { canvas, options } = this;
        canvas.className = `sl-layer ${options.className || 'sl-canvas-map'}`;
        canvas.style['zIndex'] = `${options.zIndex || 100}`;
        canvas.style['transformOrigin'] = '50% 50%';
        this.initLeafletCanvas();
    }
    /**将图层添加到map实例中显示
     * @returns MapCanvasLayer实例
     */
    private onAdd(): MapCanvasLayer {
        this._onAmapAdd();
        this._onMapLibreAdd();
        this._eventSwitch(true);
        return this;
    }
    /**基础的监听事件   
    * @param flag @default true
    *  true开启重绘事件监听; false关闭重绘事件监听
    **/
    private _eventSwitch(flag: boolean = true): void {
        let map = this.map;
        let key: 'on' | 'off' = flag ? 'on' : 'off';
        this.addLeafletEvent(flag);
        this.addMaplibreEvent(flag);
        this.addMapEvents(map, key);
    }
    /**基础绘制 */
    /** 重绘(子类重写也无效)
     ** 清空之前的绘制
     ** ①高德地图渲染配置alwaysRender:true后拖动缩放会多次渲染
     */
    protected _redraw = (): void => {
        // console.log('##########--------MapCanvasLayer=>_redraw--------##########')
        if (!this.map) return;
        this.resetCanvas();
        this.renderFixedData();
        this.renderAnimation();
    };
    /**------------------------------高德地图的实现------------------------------*/
    /**初始化高德地图的图层 */
    private _initAMap(): void {
        const opt = Object.assign({
            zooms: [3, 18],
            alwaysRender: false,//缩放过程中是否重绘，复杂绘制建议设为false
            zIndex: 200,
            render: () => this._redraw()
        }, this.options);
        this.layer = new AMap.CustomLayer(this.canvas, opt);
        this.onAdd();
    }
    /**将图层添加到map实例中显示 */
    private _onAmapAdd(): void {
        const { map, layer } = this;
        if (u_tsMapisAmap(map) && u_tsLayerisAmap(layer)) {
            layer.setMap(map);
            layer.render = this._redraw;
        }
    }
    /**移除图层 */
    private _onAmapRemove(): void {
        const { map, layer } = this;
        if (u_tsMapisAmap(map) && u_tsLayerisAmap(layer)) {
            map.remove(layer);
            // layer.destroy();
        }
    }
    /**------------------------------Leaflet地图的实现------------------------------*/
    /**初始化Leaflet地图的图层 */
    private _initLeaflet(): void {
        const layer = this.layer = new Layer(this.options);
        this.layer.onAdd = () => { this.onAdd(); return layer };
        this.onAdd();
    }
    /**初始化画布并添加到Pane中 */
    private initLeafletCanvas(): void {
        const { canvas, map, options } = this;
        if (!u_tsMapisLeaflet(map)) return;
        let pane = options.pane || 'overlayPane', paneEle = map.getPane(pane) || map.createPane(pane);
        /**如果指定的pane不存在就自己创建(往map添加div Pane) */
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
    /**移除图层 */
    private _onLeafletRemove(): void {
        let { map, layer, options } = this;
        if (u_tsMapisLeaflet(map) && u_tsLayerisLeaflet(layer)) {
            let pane = options.pane;
            pane && map.getPane(pane)?.removeChild(this.canvas);
            layer.remove();
        }
    }
    /**添加Leaflet地图事件监听
     *  @param flag @default true
     *  true开启重绘事件监听; false关闭重绘事件监听
     */
    private addLeafletEvent(flag: boolean = true): void {
        const map = this.map;
        if (u_tsMapisLeaflet(map)) {
            /**为了和高德保持一致，初始化后渲染一次 */
            requestAnimationFrame(() => this._reset());
            const key: 'on' | 'off' = flag ? 'on' : 'off';
            map[key]('viewreset', this._reset, this);
            map[key]('resize', this._reset, this);
            map[key]('moveend', this._reset, this);
            if (map.options.zoomAnimation && Browser.any3d) {
                /**缩放动画 */
                map[key]('zoomanim', this._animateZoom, this);
            }
        };
    }
    /**重设画布,并重新渲染*/
    private _reset(): void {
        this.resetCanvas();
        this._redraw();
    }
    /**缩放动画
     * @param e 缩放事件对象
     */
    private _animateZoom(e: ZoomAnimEvent): void {
        let map: any = this.map;
        const scale = map.getZoomScale(e.zoom),
            offset = map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(map._getMapPanePos());
        DomUtil.setTransform(this.canvas, offset, scale);
    }
    /**画布加载完成 */
    private _onCanvasLoad(): void {
        if (u_tsLayerisLeaflet(this.layer)) this.layer.fire('load');
    }
    /**------------------------------MapLibre地图的实现------------------------------*/
    /**异步初始化MapLibre地图的图层 */
    private _initMapLibreAsync(): void {
        const map = this.map;
        if (u_tsMapisMapLibre(map)) {
            const isReady = map.loaded?.() || map.isStyleLoaded?.() || !!map.getStyle?.();
            if (isReady) {
                this._initMapLibre();
                this.onAdd();
            } else {
                map.once('load', () => {
                    this._initMapLibre();
                    this.onAdd();
                });
            }
        }
    }
    /**添加MapLibre图层到地图上 */
    private _initMapLibre(): void {
        const map = this.map;
        if (u_tsMapisMapLibre(map)) {
            const layerId = `slu-canvas-${Math.random().toString(36).slice(2)}`;
            const customLayer: CustomLayerInterface = {
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
    /**将图层添加到容器 */
    private _onMapLibreAdd(): void {
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
    /**移除图层 */
    private _onMapLibreRemove(): void {
        if (u_tsMapisMapLibre(this.map) && u_tsLayerisMapLibre(this.layer)) {
            if (this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
            if (this.layer?.id && this.map.getLayer(this.layer.id)) {
                this.map.removeLayer(this.layer.id);
            }
        }
    }
    /**添加MapLibre地图事件监听
     *  @param flag @default true
     *  true开启事件监听; false关闭事件监听
     */
    private addMaplibreEvent(flag: boolean = true): void {
        const map = this.map;
        if (u_tsMapisMapLibre(map)) {
            /**为了和高德保持一致，初始化后渲染一次 */
            requestAnimationFrame(() => this._reset());
            const key: 'on' | 'off' = flag ? 'on' : 'off';
            map[key]('resize', () => this._reset());
            map[key]('move', () => this._reset());
            map[key]('zoom', () => this._reset());
            map[key]('moveend', () => this._reset());
        };
    }
}