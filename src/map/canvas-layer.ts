import { MapLayerOptions, MapLayerType, MapType, um_createMapLayer, um_deepMergeOpt, um_getMapSize, um_tsLayerisAmap, um_tsLayerisLeaflet, um_tsLayerisMapLibre, um_tsMapisAmap, um_tsMapisLeaflet, um_tsMapisMapLibre } from "../utils";
import type { OptCanvas } from "../canvas";
/**
 * 地图 Canvas 基础图层类
 *
 * 所有 Canvas 插件的基类，封装了 Leaflet、高德、MapLibre 三种地图引擎的图层实现。
 * 提供统一的 Canvas 生命周期管理、事件监听、重绘机制等。
 *
 * @constructor
 * @param MAP 地图实例
 * @param opt 图层配置项
 *
 * @example
 * ```typescript
 * // 通常不直接使用此类，而是继承它实现自定义插件
 * import { MapCanvasLayer, SLMap } from '@sl-utils/map';
 *
 * // 自定义插件示例
 * class MyPlugin extends MapCanvasLayer {
 *   constructor(sluMap, options) {
 *     super(sluMap.map, options);
 *   }
 *
 *   // 静态数据绘制
 *   protected renderFixedData() {
 *     this.resetCanvas();
 *     const ctx = this.ctx;
 *     ctx.fillStyle = '#FF0000';
 *     ctx.fillRect(10, 10, 100, 100);
 *   }
 *
 *   // 动态数据绘制
 *   protected renderAnimation() {
 *     this.resetCanvas();
 *     // 动画逻辑...
 *     this.flagAnimation = requestAnimationFrame(() => {
 *       this.renderAnimation();
 *     });
 *   }
 *
 *   // 添加地图事件监听
 *   protected addMapEvents(map, key) {
 *     map[key]('moveend', () => this._redraw());
 *     map[key]('zoomend', () => this._redraw());
 *   }
 * }
 *
 * // 使用自定义插件
 * const map = new SLMap('map');
 * await map.init({ type: 'L' });
 *
 * const plugin = new MyPlugin(map, {
 *   pane: 'canvas',
 *   className: 'my-plugin',
 *   zIndex: 100
 * });
 * ```
 */
export class MapCanvasLayer {
    constructor(map: MapType, opt?: MOptCanvasLayer) {
        this.map = map;
        if (opt) this.options = um_deepMergeOpt(this.options, opt);
        this.initCanvas();
        if (um_tsMapisLeaflet(map)) {
            this._initLeaflet();
        } else if (um_tsMapisAmap(map)) {
            this._initAMap();
        } else if (um_tsMapisMapLibre(map)) {
            this._initMapLibreAsync();
        }
    }
    /**地图实例*/
    public readonly map!: MapType;
    /**图层 */
    private layer: MapLayerType;
    /**画布 */
    public readonly canvas: HTMLCanvasElement = document.createElement('canvas');
    /**画布上下文 */
    protected readonly ctx: CanvasRenderingContext2D = this.canvas.getContext("2d")!;
    /**画布宽度 */
    protected width: number = 0;
    /**画布高度 */
    protected height: number = 0;
    /**图层配置项 */
    public readonly options: MOptCanvasLayer = {
        pane: 'canvas',
        zoomAnimation: true,
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
        if (um_tsMapisLeaflet(map)) {
            const { x, y } = map.containerPointToLayerPoint([0, 0]);
            canvas.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
        const { w, h } = um_getMapSize(map);
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
    protected addMapEvents(map: MapType, key: 'on' | 'off'): void { };
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
        if (!um_tsMapisAmap(this.map)) return;
        const opt = um_deepMergeOpt({
            zooms: [3, 18],
            alwaysRender: false,//缩放过程中是否重绘，复杂绘制建议设为false
            zIndex: 200,
            render: () => this._redraw()
        }, this.options);
        this.layer = um_createMapLayer(this.map, this);
        this.onAdd();
    }
    /**将图层添加到map实例中显示 */
    private _onAmapAdd(): void {
        const { map, layer } = this;
        if (um_tsMapisAmap(map) && um_tsLayerisAmap(layer)) {
            layer.setMap(map);
            layer.render = this._redraw;
        }
    }
    /**移除图层 */
    private _onAmapRemove(): void {
        const { map, layer } = this;
        if (um_tsMapisAmap(map) && um_tsLayerisAmap(layer)) {
            map.remove(layer);
            // layer.destroy();
        }
    }
    /**------------------------------Leaflet地图的实现------------------------------*/
    /**初始化Leaflet地图的图层 */
    private _initLeaflet(): void {
        if (!um_tsMapisLeaflet(this.map)) return;
        const layer = this.layer = um_createMapLayer(this.map, this);
        layer.onAdd = () => { this.onAdd(); return layer };
        this.onAdd();
    }
    /**移除图层 */
    private _onLeafletRemove(): void {
        let { map, layer, options } = this;
        if (um_tsMapisLeaflet(map) && um_tsLayerisLeaflet(layer)) {
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
        if (um_tsMapisLeaflet(map)) {
            /**为了和高德保持一致，初始化后渲染一次 */
            requestAnimationFrame(() => this._reset());
            const key: 'on' | 'off' = flag ? 'on' : 'off';
            map[key]('viewreset', this._reset, this);
            map[key]('resize', this._reset, this);
            map[key]('moveend', this._reset, this);
        };
    }
    /**重设画布,并重新渲染*/
    private _reset(): void {
        this.resetCanvas();
        this._redraw();
    }
    /**画布加载完成 */
    public _onCanvasLoad(): void {
        if (um_tsLayerisLeaflet(this.layer)) this.layer.fire('load');
    }
    /**------------------------------MapLibre地图的实现------------------------------*/
    /**异步初始化MapLibre地图的图层 */
    private _initMapLibreAsync(): void {
        const map = this.map;
        if (um_tsMapisMapLibre(map)) {
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
        if (!um_tsMapisMapLibre(map)) return;
        const layer = this.layer = um_createMapLayer(map, this);
        layer.onAdd = () => this._onMapLibreAdd();
        layer.onRemove = () => this._onMapLibreRemove();
        layer.render = () => { };
    }
    /**将图层添加到容器 */
    private _onMapLibreAdd(): void {
        const map = this.map;
        if (um_tsMapisMapLibre(map)) {
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
        if (um_tsMapisMapLibre(this.map) && um_tsLayerisMapLibre(this.layer)) {
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
        if (um_tsMapisMapLibre(map)) {
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

// ===================== 类型约束 =====================

/**地图画布图层配置 */
export type MOptCanvasLayer = OptCanvas & MapLayerOptions & {
    /**画布挂载的div节点名称 @default 'canvas'
        * map默认创建mapPane、tilePane、shadowPane、overlayPane、markerPane、tooltipPane、popupPane，
        * 不存在时CanvasLayer会调用创建方法。
        * 类名会去掉Pane，例如XPane和X都生成类名为leaflet-X-pane的div节点，但是属于不同的pane
        */
    pane?: string;
    /**画布的class名称 */
    className?: string
    /**画布层级，默认100，最大400(受挂载的div影响，可修改) */
    zIndex?: number;
    /**zoom调整时是否开启缩放动画 @default true */
    zoomAnimation?: boolean;
};