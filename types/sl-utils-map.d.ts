import { SLUCanvasGif } from "src/canvas";

declare module '@sl-utils/map' {
  /**leaflet 需要开发者在样式表中挂载leaflet样式 */
  export class SLUMap {
    constructor(ele: string,);
    map: AMAP.Map | L.Map
    /**初始实例化地图
      * @param options 地图初始化参数
      */
    public init(options?: Partial<SLPMapOpt>): Promise<void>;
    /**设置合适的视图范围 */
    public setFitView(latlngs: [number, number][]): this;
    /**获取地图边界 */
    public getBound(): AMAP.Bounds | L.LatLngBounds;
  }
  // 添加其他导出...
  /** 地图canvas基础图形绘制类    点(arc) 线(line BezierLine) 多边形(rect) 图片(img)*/
  export class MapCanvasDraw {
    constructor(map: AMAP.Map | L.Map, canvas: HTMLCanvasElement);
    private canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected map: AMAP.Map | L.Map;
    private gif: SLUCanvasGif;
    /**所有的小圆数据 */
    protected _allArcs: MapArc[];
    /**所有的线数据 */
    protected _allLines: MapLine[];
    /**所有的贝塞尔曲线数据 */
    protected _allBLins: MapLine[];
    /**所有的多边形数据 */
    protected _allRects: MapRect[];
    /**所有的文本数据 */
    protected _allTexts: MapText[];
    /**所有的图片数据 */
    protected _allImgs: MapImage[];
    /**所有的Gif数据 */
    protected _allGifs: MapGif[];
    protected get zoom(): number;
    /** 清空并重新设置画布 */
    public reSetCanvas(): void;
    /**绘制所有需要绘制的类(按drawIndex顺序) */
    public drawMapAll(): void;
    /**绘制通过index */
    protected drawByIndex(): Promise<void>;
    /**设置原点 */
    public setAllArcs(arcs: MapArc[]): this;
    /**设置线数据 */
    public setAllLines(lines: MapLine[]): this;
    /**设置贝塞尔曲线数据 */
    public setAllBezierLines(lines: MapLine[]): this;
    /**设置多边形数据 */
    public setAllRects(rects: MapRect[]): this;
    /**设置文本数据 */
    public setAllTexts(texts: MapText[]): this;
    /**设置图片数据 */
    public setAllImgs(imgs: MapImage[]): this;
    /**设置gif数据 */
    public setAllGifs(gifs: MapGif[]): this;
    /**增加原点 */
    public addArc(arc: MapArc): this;
    /**增加线 */
    public addLine(line: MapLine): this;
    /**增加贝塞尔曲线 */
    public addBezierLine(line: MapLine): this;
    /**增加多边形 */
    public addRect(rect: MapRect): this;
    /**增加文本 */
    public addText(text: MapText): this;
    /**增加图片 */
    public addImg(img: MapImage): this;
    /**删除指定圆点 */
    public delArc(arc: MapArc): this;
    /**删除指定线 */
    public delLine(line: MapLine): this;
    /**删除指定贝塞尔曲线 */
    public delBezierLine(line: MapLine): this;
    /**删除指定多边形 */
    public delRect(rect: MapRect): this;
    /**删除指定文本 */
    public delText(text: MapText): this;
    /**删除指定Img */
    public delImg(img: MapImage): this;
    /**清空
   * @param type 不填清空所有内容数据
   */
    public delAll(type?: 'all' | 'text' | 'arc' | 'line' | 'bezier' | 'rect' | 'img' | 'gif'): this;
    /**将对象上经纬度数据(latlngs,latlng)变换为像素XY的数据(points,point)
   * latlngs为undefined,points也为undefined
   * latlng为undefined,point为[0,0]
   */
    public transformXY(info: MapPoint & SLTCanvas.Point): void;
    /**设置固定大小的图片 */
    public transformImageSize(img: MapImage): void;
    private transformArcSize(arc: MapArc): void;
  }
  /**地图事件控制类 */
  export class MapCanvasEvent {
    constructor(map: AMAP.Map | L.Map);
    /**R树搜索 事件 */
    private rbush;
    /**是否重新开始事件指针变化(使不同canvas的事件指针能正确显示)*/
    private static ifInitCursor: boolean;
    /**是否开启事件控制类初始化 */
    private static ifInit: boolean;
    /**地图销毁必须调用此方法，否则事件指针会异常 */
    public static destory(): void;
    private static initCursor(): void;
    protected map: AMAP.Map | L.Map;
    /** 监听事件 */
    protected _listenCbs: { [key in SLTEventType]?: ((e: MapEventResponse<any>) => void)[] };
    /** key 防止setEvent清除其他事件 */
    public _allMapEvents: Map<string, MapEvent[]>;
    /** Rbush查询子集 */
    private _allRbush: SLTRbush<MapEvent>[];
    /** 上一次触发的事件集合 */
    private perEvents: MapEventResponse[];
    /** 海图事件回调函数 */
    private cbMapEvent: (e: MapEventResponse<any>) => void;
    /** 事件开关 
     * @param flag true开启地图事件监听 false关闭地图事件监听
    */
    private _eventSwitch(flag: boolean): void;
    /**重设rbush */
    private resetRbush(): void;
    /**统一监听该类的指定事件 */
    public on<T extends MapEvent<any>>(type: SLTEventType, cb: (e: MapEventResponse<T>) => void): void;
    /**统一关闭指定事件的监听 */
    public off<T extends MapEvent<any>>(type: SLTEventType, cb?: (e: MapEventResponse<T>) => void): void;
    /**清空之前设置的统一监听事件 */
    public clear(): void;
    /** 
     * @param evs 事件集合
     * @param key 事件key
     * 设置key 事件 会覆盖原来的事件 
     * 不覆盖使用 pushEventByKey
     *  */
    public setEventsByKey<T extends MapEvent>(evs: T[], key: string): void;
    /**
     * 清除所有事件
     */
    public clearAllEvents(): void;
    /**
     * 清除指定类型事件
     * @param key
     */
    public clearEventsByKey(key: string): void;
    /**
     * 添加一个事件
     * 尽量使用setEventsByKey 
     * 或者pushEventByKey数组 而不是for 一个个push
     * 不然每次for循环push都会重新构造rbush
     *  */
    public pushEventByKey<T extends MapEvent>(key: string, ev: T | T[]): void;
    /** 添加事件 */
    private handleTransform<T extends MapEvent>(ev: T): void;
    /** 转换添加事件 */
    private transformEvent<T extends MapEvent>(event: T): void;
    /** 转为Rbush数据格式 */
    private transformRbush<T extends MapEvent>(event: T): void;
    /**准备触发事件 
    * @param e 地图事件
    */
    private triggerEvent(e: AMapMapsEvent | L.LeafletMouseEvent): void;
    /**获取指针触发范围内的事件 */
    private getEventsByRange(e: AMapMapsEvent | L.LeafletMouseEvent): { curEvents: MapEventResponse<MapEvent<any, any>, any>[], enterEvents: MapEventResponse<MapEvent<any, any>, any>[], leaveEvents: MapEventResponse<MapEvent<any, any>, any>[] };
    /**通过事件类型执行回调函数*/
    private doCbByEventType(resp: MapEventResponse, type: SLTEventType): void;
    /**生成地图事件响应对象 
     * @param latlng 该事件对象的地图坐标
     * @param point 该事件对象的地图像素坐标
     * @param event 地图事件
     * @param cursor 鼠标位置信息
    */
    private genEventResponse(latlng: [number, number], point: [number, number], event: MapEvent, cursor: MapCursorInfo): MapEventResponse;
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
  /**自定义标绘类 需要调用addTo添加到map地图中 */
  export class MapPluginPlot extends MapCanvasLayer {
    constructor(map: AMAP.Map | L.Map, options?: SLPMap.Plot);
    /**默认配置 */
    public options: SLPMap.Plot;
    /**动态绘制图层 */
    private ctrMapAniDraw: MapPluginDraw;
    /**静态标绘图层 */
    private ctrMapDraw: MapCanvasDraw;
    /**图层事件控制器 */
    private ctrEvent: MapCanvasEvent;
    /**编辑圆点样式 */
    private editArc: MapArc;
    /**所有的标绘集合 */
    private plotList: MapPlotInfo<MapPlotType>[];
    /**正在动态绘制的标(仅仅改变图形不会动态改变原始数据) */
    public plotAni: MapPlotInfo;
    /**记录当前鼠标纬经度 */
    private curPoint: [number, number];
    /** 单击事件 */
    private eventClickTimer: number | undefined;
    /**开启新增的绘制 */
    public open<T extends MapPlotType>(type: T): MapPlotInfo<T>;
    /**关闭绘制 */
    public close(): this;
    /**保存标绘 */
    public savePlot(): this;
    /**删除标绘 */
    public delPlot(plot?: MapPlotInfo): this;
    /**设置所有区域数据 */
    public setPlotList(plotList: MapPlotInfo[]): this;
    /**设置编辑区域数据 */
    public setEditPlot(plot: MapPlotInfo): this;
    /**重绘 */
    public redraw(): this;
    protected renderFixedData(): void;
    protected renderAnimation(): void;
    /**生成动态绘制图层 */
    private genAniPlot(): void;
    /**绘制标绘 */
    private drawPlot(layer: MapCanvasDraw | MapPluginDraw, plotInfo: MapPlotInfo, type: MapPlotType): void;
    /**各个点的平均值计算中心点 */
    private calcCenter(points: [number, number][], type: MapPlotType): [number, number];
    /**直接最大最小计算中心点 */
    private calcCenter2(points: [number, number][]): [number, number];
    /**计算多边形的重心*/
    private calcCenter3(points: [number, number][]): [number, number];
    /**计算矩形的四个点 */
    private calcRect(latLngs: [number, number][]): [number, number][];
    /**计算圆的半径 */
    private calcRadius(latLngs: [number, number][]): number;
    /**开启鼠标编辑功能 */
    private openMouseEdit(plotInfo: MapPlotInfo): void;
    /**设置圆的编辑点 */
    private setCircleEditPoint(plotInfo: MapPlotInfo): void;
    /**设置多边形的编辑点 */
    private setPolygonEditPoint(plotInfo: MapPlotInfo): void;
    /**点标绘仍可编辑移动位置 */
    private setPointEdit(plotInfo: MapPlotInfo): void;
    /**设置线段的编辑点 */
    private setLineEditPoint(plotInfo: MapPlotInfo): void;
    /**设置矩形的编辑点 */
    private setRectEditPoint(plotInfo: MapPlotInfo): void;
    /**添加响应事件 
     * @param latLng 经纬度
     * @param i 索引
     * @param plotInfo 绘制信息
     * @param eves 事件
     * @param ifVirtual 是否为虚拟点
    */
    private addEvent(latLng: [number, number], i: number, plotInfo: MapPlotInfo, eves: MapEvent[], ifVirtual?: boolean): void;
    /**事件开关方法 
    * @param flag true开启 false关闭
    */
    private eventSwitch(flag: boolean): void;
    private eventClick(e: L.LeafletMouseEvent | AMapMapsEvent): void;
    /** 鼠标移动事件 */
    private eventMousemove(e: L.LeafletMouseEvent | AMapMapsEvent): void;
    /** 双击关闭事件 */
    private eventDblclick(): void;
    /**移除所有的监听函数 */
    private clearCb(): void;
    /**绘制时添加了新点位时的回调*/
    private cbPointChange: (plotAni: MapPlotInfo) => void;
    /**绘制时添加了新点位时的回调*/
    private cbPointAdd: (plotAni: MapPlotInfo) => void;
    /**绘制时移动已有点位时的回调*/
    private cbPointMove: (plotAni: MapPlotInfo) => void;
    /**添加新增点位时的监听函数 */
    public addCbPointChange(cb: (plotAni: MapPlotInfo) => void): this;
    /**添加新增点位时的监听函数 */
    public addCbPointAdd(cb: (plotAni: MapPlotInfo) => void): this;
    /**添加新增点位时的监听函数 */
    public addCbPointMove(cb: (plotAni: MapPlotInfo) => void): this;
  }
  /** 测绘类 */
  export class MapPluginRange extends MapCanvasLayer {
    /** 测绘类，传入Amap或者调用addTo */
    constructor(map: L.Map | AMAP.Map, options?: SLPMap.Range);
    /**默认配置 */
    public options: SLPMap.Range;
    /** 地图事件控制管理对象 */
    private ctrEvent: MapCanvasEvent;
    /** 地图基础绘制类 */
    private ctrMapDraw: MapCanvasDraw;
    /** 动画绘制类 */
    private ctrMapAniDraw: MapPluginDraw;
    /** 所有的已确定的经纬度 (绘制确定的点线)*/
    private lnglats: L.LatLng[][];
    /** 鼠标当前所在的经纬度(绘制虚线) */
    private lnglat?: L.LatLng;
    /** 是否正在拖动地图 */
    private ifDrag: boolean;
    /** 单击事件 */
    private eventClickTimer: number | undefined;
    public setOptions(opt: SLPMap.Range): this;
    /** 启用测距功能 */
    public open(): this;
    /** 关闭测距功能 */
    public close(flag?: boolean): void;
    endCb?: () => void;
    public onEnd(cb: () => void): void;
    /** 缓存绘图数据（对于引进确定的数据进行缓存） */
    protected renderFixedData(): void;
    protected renderAnimation(): void;
    /** 动画虚线绘制 */
    private genAniLineDate(): void;
    /** 绘制文本信息  flag标识该条线已经绘制完成 */
    protected drawEndTextImg(info: MapText, lineId: number): MapImage;
    /**事件开关方法 
      * @param flag true开启 false关闭
    */
    private eventSwitch(flag: boolean): void;
    private eventDrag(e: L.LeafletMouseEvent): void;
    private eventDragend(e: L.LeafletMouseEvent): void;
    /** 单击事件 */
    private eventClick(e: L.LeafletMouseEvent | AMapMapsEvent): void;
    /** 鼠标移动事件 */
    private eventMousemove(e: L.LeafletMouseEvent | AMapMapsEvent): void;
    /** 双击关闭事件 */
    private eventDblclick(): void;
  }

  /**服务类--------集成层功能 */
  /**标绘 */
  export class MapServicePlot {
    constructor(map_: AMAP.Map | L.Map, options?: SLPMap.Plot);
    private plotList: MapPlotInfo[];
    /**标绘图层 */
    private layer?: MapPluginPlot;
    /**将标绘添加到地图 */
    public plotAdd(): MapPluginPlot;
    /**设置标绘的数据 */
    public plotSetList(plotList: MapPlotInfo[]): this;
    /**设置正在编辑的标绘 */
    public plotSetEdit(plot: MapPlotInfo): this;
    public plotSave(): this;
    /**打开标绘(返回正在标绘的对象) */
    public plotOpenEdit(type: MapPlotType): MapPlotInfo;
    /**标绘数据改变需要重绘 */
    public plotRedraw(): void;
    /**地图实例 */
    private get map(): AMAP.Map | L.Map;
    /**移除图层 */
    public remove(): void;
  }
  /**测距 */
  export class MapServiceRange {
    constructor(map_: AMAP.Map | L.Map,);
    /**开启,关闭测距
     * @param flag 是否开启
     * @param map 地图对象
     */
    public openRange(flag?: boolean): this
    /**双击结束了测距 */
    public onEnd(cb: () => void): void;
    /**重设测距图层的相关配置 */
    public resetOpt(opt: SLPMap.Range): void;
    /**每个服务类都有的 */
    /**测距图层 */
    private layer?: MapPluginRange;
    /**地图实例 */
    private get map(): AMAP.Map | L.Map;
    /**移除图层 */
    public remove(): void;
  }
}