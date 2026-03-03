declare module '@sl-utils/map' {
  /**leaflet 需要开发者在样式表中挂载leaflet样式 */
  export class SLUMap {
    constructor(ele: string,);
    map: AMAP.Map | L.Map
    /**初始实例化地图
      * @param options 地图初始化参数
      */
    public init(options?: Partial<SLPMapOpt>): Promise<void>
  }
  // 添加其他导出...
  export class MapCanvasDraw {
    constructor();
  }
  export class MapCanvasEvent {
    constructor();
  }

  /** 地图canvas基础图层类(基本所有插件都要继承此类) 删除永远比新增简单 */
  export class MapCanvasLayer {
    constructor(MAP: L.Map, opt?: MapCanvasPara)
    constructor(MAP: AMAP.Map, opt?: AMAP.CustomLayerOption)
    constructor(MAP: AMAP.Map | L.Map, opt?: AMAP.CustomLayerOption | MapCanvasPara)
    /**开发自己设置项目使用了的地图插件类型Leaflet(0)、高德(1)、百度(2),防止网络加载的第三方插件再使用instanceof是为define*/
    protected readonly type: 0 | 1 | 2;
    protected readonly map: AMAP.Map | L.Map;
    private layer: L.Layer | AMAP.CustomLayer;
    protected readonly canvas: HTMLCanvasElement;
    protected readonly ctx: CanvasRenderingContext2D;
    protected width: number;
    protected height: number;
    public readonly options: SLPMap.Canvas;
    /**动画循环的id标识 */
    protected flagAnimation: number;
    /**移除图层 */
    public onRemove(): MapCanvasLayer;
    /** 清空并重新设置画布 */
    public resetCanvas(): void
    /**添加或关闭地图特定的监听事件(_eventSwitch事件后自动调用) */
    protected addMapEvents(map: AMAP.Map | L.Map, key: 'on' | 'off'): void
    /**绘制静态数据推荐使用此方法(固定的图) */
    protected renderFixedData(): void
    /** 推荐使用此方法绘制动态图(跟随鼠标拖动，移动时需要立刻绘制时)
     ** 动画图层绘制前的画布清空、计算等均在此方法中自行计算 
     ** 与renderFixedData本质是一样的
     */
    protected renderAnimation(): void
    /** */
    protected on(key: string, cb: Function): void
    /** */
    protected off(key: string, cb: Function): void
    /**初始化canvas */
    private initCanvas(): void
    /** 将图层添加到map实例中显示 */
    private onAdd(): this
    /**基础的监听事件   
    * @param flag true开启重绘事件监听 false 关闭重绘事件监听
    **/
    private _eventSwitch(flag?: boolean): void
    /**基础绘制 */
    /** 重绘(子类重写也无效)
     ** 清空之前的绘制
     ** ①高德地图渲染配置alwaysRender:true后拖动缩放会多次渲染
     */
    protected _redraw: () => {};
    /**------------------------------高德地图的实现------------------------------*/
    private _onAmapAdd(): void
    private _onAmapRemove(): void
    /**------------------------------Leaflet地图的实现------------------------------*/
    /**初始化画布并添加到Pane中 */
    private initLeafletCanvas(): void
    /**移除 */
    private _onLeafletRemove(): void
    private addLeafletEvent(flag?: boolean): void
    /**重设画布,并重新渲染*/
    private _reset(): void
    /**缩放动画 */
    private _animateZoom(e: any): void
    private _onCanvasLoad(): void
  }

  /**地图插件----绘制 */
  export class MapPluginDraw extends MapCanvasLayer {
    constructor(map: AMAP.Map | L.Map, options?: AMAP.CustomLayerOption | MapCanvasPara)
    /**地图绘制控制类 */
    protected _draw: MapCanvasDraw;
    /**地图事件引起的重绘绘制 */
    protected override renderFixedData(): void
    /**绘制所有需要绘制的类 */
    public drawMapAll(): this
    /**设置原点 */
    public setAllArcs(arcs: MapArc[]): this
    /**设置线数据 */
    public setAllLines(lines: MapLine[]): this
    /**设置贝塞尔曲线数据 */
    public setAllBezierLines(lines: MapLine[]): this
    /**设置多边形数据 */
    public setAllRects(rects: MapRect[]): this
    /**设置文本数据 */
    public setAllTexts(texts: MapText[]): this
    /**设置图片数据 */
    public setAllImgs(imgs: MapImage[]): this
    /**设置gif数据 */
    public setAllGifs(gifs: MapGif[]): this
    /**增加原点 */
    public addArc(arc: MapArc): this
    /**增加线 */
    public addLine(line: MapLine): this
    /**增加贝塞尔曲线 */
    public addBezierLine(line: MapLine): this
    /**增加多边形 */
    public addRect(rect: MapRect): this
    /**增加文本 */
    public addText(text: MapText): this
    /**增加图片 */
    public addImg(img: MapImage): this
    /**删除指定圆点 */
    public delArc(arc: MapArc): this
    /**删除指定线 */
    public delLine(line: MapLine): this
    /**删除指定贝塞尔曲线 */
    public delBezierLine(line: MapLine): this
    /**删除指定多边形 */
    public delRect(rect: MapRect): this
    /**删除指定多边形 */
    public delText(text: MapText): this
    /**删除指定Img */
    public delImg(img: MapImage): this
    /**清空
     * @param type 不填清空所有内容数据
     */
    public delAll(type?: 'all' | 'arc' | 'line' | 'bezier' | 'rect' | 'img' | 'gif'): this;
  }
}