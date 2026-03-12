import { SLUCanvasGif } from "src/canvas";
import { SLUWorker } from "src/utils/slu-worker";

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
    /**
     * 设置地图中心
     * @param center 中心 latlng顺序
     * @param zoom 
     * @param offset 中心 但需要偏移固定像素
     */
    public setCenter(center: [number, number], zoom: number, offset?: [number, number]): void;
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
  /** 地图canvas箭头线类 */
  export class MapCanvasArrowLine {
    constructor(map: AMAP.Map | L.Map, ctx: CanvasRenderingContext2D, animeLineOpt?: SLPMap.ArrowLine);
    private readonly defaultOption: SLPMap.ArrowLine;
    private get imgUrl(): string;
    private get patternBound(): [number, number];
    private initResource(): void;
    private allLines: MapLine[];
    /**每组线的动画偏移变量暂存 */
    private offset: number;
    private allPoints: [number, number][][];
    public setAllLines(lines: MapLine[]): void;
    public update(): void;
    private visiblePoint(point: [number, number], range: [number, number]): boolean;
    /**
     * 线段连线方向
     * @param point1
     * @param point2
     * @returns
     */
    private directionLine(point1: [number, number], point2: [number, number]): string;
    /**
     * 不在画布范围内修改起始点 减少生成过多粒子
     * @returns
     */
    private validLine(points: [[number, number], [number, number]]): false | [[number, number], [number, number]];
    /**
     * 获取二次贝塞尔曲线划分任意点位置
     * @param {number} t 当前百分比
     * @param {Array} p1 起点坐标
     * @param {Array} cp 控制点
     * @param {Array} p2 终点坐标
     */
    private getQuadraticBezierPoint(t: number, p1: [number, number], cp: [number, number], p2: [number, number]): [number, number];
    public draw(): void;
    private getValidPoints(points: [number, number][]): [number, number][];
    private drawPath(points: [number, number][]): void;
    private patternPathInit(): void;
    private createPattern(): null | CanvasPattern;
  }
  /**地图canvas绘制雷达类 */
  export class MapCanvasRadar {
    constructor(map: AMAP.Map | L.Map, ctx: CanvasRenderingContext2D);
    private get zoom(): number;
    /**上一动画时间(毫秒) */
    private pertime: number;
    /**雷达的默认设置 */
    private radarDefault: MapPluginRadarPara;
    /**所有的雷达数据 */
    private allRadars: MapPluginRadarPara[];
    /**重设雷达绘制类 */
    public setAllRadars(radars: MapPluginRadarPara[]): this;
    /**添加雷达绘制类 */
    public addRadar(radar: MapPluginRadarPara): this;
    /**开始绘制所有雷达静态部分 */
    public drawRadarStatic(): void;
    /**开始绘制所有雷达动态扫描部分 */
    public drawRadarAmi(time?: number): void;
    /**更新所有雷达位置和大小 */
    private updatePoint(radar: MapPluginRadarPara): void;
    /**绘制雷达网格 */
    private drawGrid(radar: MapPluginRadarPara): void;
    /**虚线圈到中心点距离 */
    private drawDashArc(radar: MapPluginRadarPara): void;
    /**绘制自定义的虚线圈 */
    private drawCustomDashArc(radar: MapPluginRadarPara): void;
    /**绘制轮廓 */
    private drawOutline(radar: MapPluginRadarPara): void;
    /**绘制边缘单元 */
    private drawOutlineUnit(radar: MapPluginRadarPara): void;
    /**雷达背景蒙版 中间泛白*/
    private drawBackground(radar: MapPluginRadarPara): void;
    /**绘制文字描述 */
    private drawText(radar: MapPluginRadarPara): void;
    /**绘制扫描范围 */
    private drawScanRange(radar: MapPluginRadarPara): void;
    /**更新动态当前角度 */
    private updateAngle(radar: MapPluginRadarPara, diffTime: number): void;
    /**绘制扫描部分(动态) */
    private drawScan(radar: MapPluginRadarPara): void;
    /**
     * 绘制扇形区域
     * @param sectorDeg 扇形渐变角度
     * @returns
     */
    private drawSector(radar: MapPluginRadarPara): void;
    /**计算colors 渐变颜色 */
    private caculateColorChange(colors: string[], total: number): [number, number, number][];
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
  /**自定义标绘类  */
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
  /**轨迹类 */
  export class MapPluginTrack {
    /**轨迹绘制类 */
    constructor(map: L.Map | AMAP.Map, options?: Partial<MapTrackPara>);
    private map: L.Map | AMAP.Map;
    /**默认配置 */
    private options: MapTrackPara;
    /**当前的轨迹数据 */
    private allTracks: MapTrackGroup[];
    /**现有轨迹最早的时间点 */
    private earlyTime: number;
    /**距离最早时间点多少秒去获取下一阶段数据 */
    private intervalTime: number;
    /**时间点 */
    private time: number;
    /**事件集合 */
    private allEvents: MapCanvasEvent;
    /** */
    private layerDraw: MapPluginDraw;
    /**动态画船的图层 */
    private layerAniDraw: MapPluginDraw;
    /**指针点击所对应的点*/
    private cursorData: MapPoint[];
    /**点击圆点时的回调*/
    private cbClickPoint?: (plotAni: MapEventResponse) => void;
    /**zoom变化 重设arc数据 */
    public onRemove(): void;
    /**设置添加轨迹数据(并重新绘制) */
    public setTracks(tracks: MapTrackGroup[]): void;
    /**获取指定时间各轨迹点的位置信息集合 */
    public getInfosByTime<T = any>(time: Date): ({ orginData: T } & MapTrackTimePosition)[];
    /**获取下一时间段的数据 */
    private getNextTrack(): void;
    /**设置轨迹上的动点船 */
    public setAniImage(imgs: MapImage[], texts?: MapText[]): void;
    /**添加点击圆点时的监听函数 */
    public addCbClickPoint(cb: (plotAni: MapEventResponse<any>) => void): this;
    /**设置轨迹的显示和隐藏 */
    public setOpt(opt: Partial<MapTrackPara>): void;
    /**绘制轨迹数据 */
    private _drawTracks(): void;
    /**单条轨迹绘制 （并给点添加事件）*/
    private drawHistoryTrack(track: MapTrackGroup): void;
    /**绘制轨迹线 */
    private drawLine(track: MapTrackGroup): void;
    /**绘制轨迹点 */
    private drawArc(track: MapTrackGroup): void;
    /**实现移除数组第一个和最后一个元素得到新的数组 */
    private removeFirstLast(arr: any[]): any[];
    /**绘制轨迹起点终点 */
    private drawStartEnd(track: MapTrackGroup): void;
    /**添加轨迹点事件*/
    private addPointEvent(track: MapTrackGroup, eves: MapEvent[]): void;
    /**获得指定时间的位置信息 */
    private getInfoByTime(epoch: number, infos: MapTrackItem[]): MapTrackTimePosition;
    /**计算位置信息 */
    private computeDate(sData: MapTrackItem, eData: MapTrackItem, time: number): MapTrackTimePosition;
    /**移除所有的监听函数 */
    private clearCb(): void;
    private cbs;
    /** */
    public on(key: string, cb: Function): void;
    /** */
    public trigger(key: string): void;
  }
  export class MapPluginGridBase extends MapCanvasLayer {
    constructor(map: L.Map | AMAP.Map, options: Partial<SLPMapGrid>);
    public readonly options: SLPMapGrid
    /**网格数据   数据 [X] [Y]  */
    protected gridXY?: [number, number][][];
    /**可视区网格数据 */
    protected boundsDatas?: [number, number, number][][];
    /**数据起始经度 */
    protected lng0: number;
    /**数据起始纬度 */
    protected lat0: number;
    /**数据经度差值 数据经度间隔 (若全球数据中0.5经度间隔得到一个数据，则 dx = 1 * 0.5 )*/
    protected lngΔ: number;
    /**数据纬度差值 */
    protected latΔ: number;
    /**单挑数据由几个数据组成 */
    protected dataLength: number;
    /**无数据值 */
    protected invalid: number | undefined | null;
    /**构建阴影的html */
    protected shadowElement?: HTMLCanvasElement;
    /**渐变图像的html */
    protected gradientElement?: HTMLCanvasElement;
    /**渐变数据 */
    protected gradient?: Uint8ClampedArray;
    /**启用新的线程 */
    private worker: SLUWorker<WorkerInfo, { workerId: number; data: CanvasImageSource; }>;
    /**线程id */
    private workerId: number;
    /**将线程绘制的图像绘制出来 */
    private workerCb(data: { workerId: number, data: CanvasImageSource }): void;
    /**设置网格数据 */
    public _setDatas(datas: SLDMapGrid[]): void;
    /**采用线程调取生成可视区网格数据 */
    protected interpolateFieldByWorker(bounds: GridBounds): void;
    /**grid数据，以及获得指定经纬度数据的方法interpolate
     * @param bounds 可视区域的像素范围
    */
    protected interpolateField(bounds: GridBounds): void;
    /**获取视图范围内的(指定像素间隔的数据) */
    protected getViewBoundsGrid(bounds: GridBounds, pixelInterval?: number): [number, number, number][][];
    /**构建网格数据gridXY: [开始的数据,结束的数据] [x序号] [y序号] 
     * @param data 一维数据
     * @param nx 列数
     * @param ny 行数
     * @returns 三维网格数据
     */
    private builder(grids: SLDMapGrid[]): number[][][];
    /**获得指定经纬度的数据信息
    * @param lng 经度
    * @param lat 纬度
    * @return [ 计算得到的开始值S , 计算的到的结束值E, sqrt(S*S+E*E) ]
    */
    protected interpolate(lng: number, lat: number): null | [number, number, number];
    /**根据网格数据构建虚拟数值
    * @param x 指定经度的X数值相对最近的低位整数坐标的差值 [0,1)
    * @param y 指定纬度的Y数值相对最近的低位整数坐标的差值 [0,1)
    * @param g00 该经纬度所在的网格的左上角的风速信息
    * @param g10 该经纬度所在的网格的右上角的风速信息
    * @param g01 该经纬度所在的网格的左下角的风速信息
    * @param g11 该经纬度所在的网格的右下角的风速信息
    * @returns [ 计算得到的开始值S , 计算的到的结束值E, 平均速度 ]
    */
    private bilinearInterpolateVector(x: number, y: number, g00: [number, number], g10: [number, number], g01: [number, number], g11: [number, number]): [number, number, number];
    /**针对经纬度特殊的取余数方法
     * 小于等于n的数字若a小于0，返回 2n+a ， -365  => 2n-365 
    */
    private floorMod(a: number, n: number): number;
    /**判断是否为有效数据 */
    private isValue(x: number[]): boolean;
    /**此处无数据数据 */
    private isNull(xy: [number, number]): boolean;
    /**生成马赛克类型图 */
    protected genMosaic(datas: [number, number, number][][]): void;
    /**生成黑白遮罩，以便构建渐变图 */
    protected genShade(datas: [number, number, number][][]): this;
    /**获取该值所在的颜色 */
    protected getColorByValue(value: number): string;

    /**生成单个的阴影半径(圆形) 
     * @param r 半径
     * @param blur 模糊度
    */
    protected genShadowRadius(r: number, blur?: number): HTMLCanvasElement;
    /**构建渐变色 */
    private genGradient(grad: { [key: number]: string }): HTMLCanvasElement;
    /**填充颜色 */
    private _colorize(pixels: Uint8ClampedArray, gradient: Uint8ClampedArray): void;
  }
  export interface SLPMapField extends SLPMapGrid {

  }
  export class MapPluginGrid extends MapPluginGridBase {
    constructor(map: L.Map | AMAP.Map, options: Partial<SLPMapField>);
    /**可视区内的网格数据XY */
    protected boundsDatas: [number, number, number][][];
    public setOptions(options: Partial<SLPMapField>): void;
    /**设置渲染数据 */
    public setData(datas: SLDMapGrid[]): void;
    public getInfoByLngLat(lng: number, lat: number): [number, number, number] | null;
    /**渲染开始 */
    private renderStart(): void;
    protected renderFixedData(): void;
  }
  /**风场类 */
  export class MapPluginWind extends MapPluginGridBase {
    constructor(map: L.Map | AMAP.Map, options: Partial<SLPMap.Wind>);
    /**根据风速返回图标配置 */
    private iconResolver?: (speed: number) => CanvasImage;
    private draw: MapCanvasDraw;
    /**配置 */
    public options: SLPMap.Wind;
    /**设置图标解析器 */
    public setIconResolver(resolver: (speed: number) => CanvasImage): void;
    /**设置风速风向数据 */
    public setData(data: SLDMapGrid[]): void;
    /**获取视图范围内的(指定像素间隔的数据) */
    protected getViewBoundsGridWind(bounds: GridBounds, pixelInterval?: number): SLDMap.Wind[];
    /**根据风力等级获取图片裁剪地址 x,y */
    protected renderAnimation(): void;
    protected renderFixedData(): void;
  }
  /**运动粒子类 */
  export class VelocityWindy {
    constructor(options: Partial<SLPVelocityWindy>);
    private options: SLPVelocityWindy;
    private map: L.Map | AMAP.Map;
    private canvas: HTMLCanvasElement;
    /**velocity at which particle intensity is minimum (m/s)*/
    private MIN_VELOCITY_INTENSITY: number;
    /**velocity at which particle intensity is maximum (m/s)*/
    private MAX_VELOCITY_INTENSITY: number;
    /**风速刻度(内部与可视区面积相关联) scale for wind velocity (completely arbitrary--this value looks nice)*/
    private VELOCITY_SCALE: number;
    /** max number of frames a particle is drawn before regeneration*/
    private MAX_PARTICLE_AGE: number;
    /** line width of a drawn particle*/
    private PARTICLE_LINE_WIDTH: number;
    /**绘制粒子数量的比例（宽像素*高像素*此比例）*/
    private PARTICLE_MULTIPLIER: number;
    /** multiply particle count for mobiles by this amount*/
    private PARTICLE_REDUCTION;
    private FRAME_RATE: number;
    /** desired frames per second*/
    private FRAME_TIME: number;
    private OPACITY: number;
    private colorScale: string[];
    /** singleton for no wind in the form: [u, v, magnitude]*/
    private NULL_WIND_VECTOR: [number, number, number];
    /**传过来的原始数据 */
    private gridData: SLDVeloctiyWind[];
    /** [U数据,V数据][ x序号 ][ y轴序号 ]   */
    private grid: [number, number][][];
    private field: WindyField;
    /**数据起始经度 */
    private lng0: number;
    /**数据起始纬度 */
    private lat0: number;
    /**数据经度差值 数据经度间隔 (若全球数据中0.5经度间隔得到一个数据，则 dx = 1 * 0.5 )*/
    private Δlng: number;
    /**数据纬度差值 */
    private Δlat: number;
    private animationLoop?: any;
    private allThreatIds: number[];
    /**设置自身参数 */
    public setOptions(options: any): void;
    /**设置数据 */
    public setData(data: SLDVeloctiyWind[]): void;
    /**停止运行 */
    public stop(): void;
    /**开始运行
     * @param width 画布宽度
     * @param height 画布高度
     * @param extent 可视的经纬度范围
     */
    public start(width: number, height: number, extent: [[number, number], [number, number]]): void;
    /**构建网格数据 */
    private buildGrid(data: SLDVeloctiyWind[]): void;
    /**创建构造器 */
    private createBuilder(data: SLDVeloctiyWind[]): { header: VelocityHeader; data: (i: number) => [number, number] };
    /**grid 数据，以及获得指定经纬度数据的方法interpolate
     * @param bounds  可视区域的像素范围
     * @param extent  数据地图的经纬度范围
     */
    private interpolateField(bounds: WindBounds, extent: WindMapBounds): void;
    /**获得指定经纬度的数据信息
     * @param lng 经度
     * @param lat 纬度
     * @return [ 计算得到的开始值S , 计算的到的结束值E, sqrt(S*S+E*E) ]
     */
    public interpolate(lng: number, lat: number): null | [number, number, number];
    /**根据网格数据构建虚拟数值
     * @param x 指定经度的X数值相对最近的低位整数坐标的差值 [0,1)
     * @param y 指定纬度的Y数值相对最近的低位整数坐标的差值 [0,1)
     * @param g00 该经纬度所在的网格的左上角的风速信息
     * @param g10 该经纬度所在的网格的右上角的风速信息
     * @param g01 该经纬度所在的网格的左下角的风速信息
     * @param g11 该经纬度所在的网格的右下角的风速信息
     * @returns [ 计算得到的开始值S , 计算的到的结束值E, 平均速度 ]
     */
    private bilinearInterpolateVector(x: number, y: number, g00: [number, number], g10: [number, number], g01: [number, number], g11: [number, number]): [number, number, number];
    /**根据地图的缩放级别调整粒子的大小
     * @param λ 经度
     * @param φ 纬度
     * @param x 像素点X
     * @param y 像素点Y
     * @param scale 风速刻度
     * @param wind 风速信息 [计算得到的开始值S , 计算的到的结束值E, sqrt(S*S+E*E) ]
     * @returns
     */
    private distort(lng: number, lat: number, x: number, y: number, scale: number, wind: [number, number, number]): [number, number, number];
    /**单个经纬度值跨越的像素点数量级
     * @param lng 经度
     * @param lat 纬度
     * @param x 像素点X
     * @param y 像素点Y
     * @returns
     */
    private distortion(lng: number, lat: number, x: number, y: number): [number, number, number, number];
    /**根据经纬度获得像素点 */
    private project(lat: number, lon: number): [number, number];
    /**动画 */
    private animate(bounds: WindBounds, field: WindyField): void;
    /**根据风速得到所属颜色层级 */
    private windColorIndexBySpeed(m: number): number;
    /**将经纬度转换为弧度  180 = Math.PI */
    private deg2rad(deg: number): number;
    /**针对经纬度特殊的取余数方法
     * 小于等于n的数字若a小于0，返回 2n+a ， -365  => 2n-365
     */
    private floorMod(a: number, n: number): number;

    private isValue(x: [number, number]): boolean;
    /**判断是否是移动端 */
    private isMobile(): boolean;
  }
  export class WindyField {
    constructor(columns: [number, number, number][][], bounds: WindBounds, NULL_WIND_VECTOR?: any[]);
    private columns: [number, number, number][][];
    private bounds: WindBounds;
    private NULL_WIND_VECTOR: any[];
    /**释放内存 */
    public release(): void;
    /**获取随机的  x , y 有数据的点(一个糟糕的未完成方法)*/
    public randomize(o: WindParticle): WindParticle;
    /**获取指定像素点的数据 */
    public run(x: number, y: number): [number, number, number];
  }
  /**流体动画(风速风向洋流动图)leaflet-velocity.js*/
  export class MapPluginFlow extends MapCanvasLayer {
    constructor(map: L.Map | AMAP.Map, options?: Partial<SLPMapVelocity>);
    /**配置项 */
    public options: SLPMapVelocity;
    private windy: VelocityWindy | null;
    private cbClick?: (degrees: number, speed: number) => void;
    /**设置配置项 */
    public setOptions(opt: SLPMapVelocity): void;
    /**设置数据并绘制canvas
     * data[0] 为X轴经度longitude方向的数据
     * data[1] 为Y轴纬度latitude方向的数据
     */
    public setData(datas: SLDVeloctiyWind[]): void;
    /**添加鼠标点击时的回调函数 */
    public addCbMouseClick(cb: (degrees: number, speed: number) => void): void;
    /*------------------------------------ PRIVATE ------------------------------------------*/
    protected renderFixedData(): void;
    /**添加或关闭地图特定的监听事件(_eventSwitch事件后自动调用) */
    protected addMapEvents(map: L.Map, key: "on" | "off"): void;
    /**初始化windy对象 */
    private initWindy(): void;
    /**开始动画 */
    private startWindy(): void;
    /**停止动画 */
    private stopWindy(): void;
    /**鼠标点击事件监听 */
    private onMouseClick(e: L.LeafletMouseEvent | AMapMapsEvent): void;
    private vectorToDegrees(uMs: number, vMs: number, angleConvention: string): number;
    /**将m/s 转换为指定单位的速度 */
    private vectorToSpeed(uMs: number, vMs: number, unit: string): number;
    private meterSec2Knots(meters: number): number;
    private meterSec2kilometerHour(meters: number): number;
  }
  /**热力图图层  传入经纬度坐标[],也可传入系数 [纬度,经度,系数?] */
  export class MapPluginHeat extends MapCanvasLayer {
    constructor(map: L.Map | AMAP.Map, options?: SLPMap.Heat);
    /**热力数据集合 */
    private _allHeats: SLTMap.Heat.Info[];
    /**计算后的热力图绘制数据 [位置x,位置y,权重W] */
    private heatDatas: [number, number, number][];
    /**用于绘制阴影，决定渲染颜色层级 */
    private _circleShadow: HTMLCanvasElement
    /**单点渲染半径（ 默认+blur 15 ） */
    private _r: number;
    /**渐变的二进制数据 */
    private _grad: Uint8ClampedArray;
    private _gradEl: HTMLCanvasElement;
    /**默认配置 */
    public options: SLPMap.Heat;
    protected renderAnimation(): void;
    /**重置[纬度，经度]集合*/
    public setAllHeats(heats: SLTMap.Heat.Info[]): () => {};
    /**添加[纬度，经度],并重绘*/
    public addHeat(heat: SLTMap.Heat.Info): () => {};
    public delHeat(heat: SLTMap.Heat.Info): () => {};
    /**更新配置 */
    setOptions(options?: SLPMap.Heat): () => {};
    private _updateOptions(): void;
    /**计算热力图数据 */
    private computeHeatData(): [number, number, number][];
    /**计算最高变色需要的数值 */
    private computeZoomGradient(): number;
    /**添加等级标识 */
    private _addGradient(num: any): void;
    /**根据数据重绘制热力图 */
    private drawByheatData(): this;
    /**生成单个的阴影半径 */
    private genShadowRadius(r: any, blur?: number): void;
    /**创建渐变色 */
    private genGradient(grad: any): this
    /**填充颜色 */
    private _colorize(pixels: Uint8ClampedArray, gradient: Uint8ClampedArray): void;
  }
  /**动态箭头线图层 */
  export class MapPluginArrowLine extends MapCanvasLayer {
    constructor(map: AMAP.Map | L.Map, options?: SLPMap.ArrowLine);
    private arrowLine: MapCanvasArrowLine;
    public setAllLines(lines: MapLine[]): void;
    /**
     * 图层是否在移动 高德默认每次渲染更新像素坐标
     * leaflet 图层移动不更新像素坐标 高德 图层移动更新像素坐标
     * 高德地图移动画布和地图同步偏移，leaflet画布固定 地图偏移 的区别
     * 所以防止leaflet移动过程二次偏移 以及高德移动过程坐标未更新导致画布和容器相对位置发生偏移
     * */
    private isDrag: boolean;
    protected override renderFixedData(): void;
    protected override renderAnimation(time?: number): void;
    /**拖拽不允许更新动画 */
    protected addMapEvents(map: AMAP.Map | L.Map, key: "on" | "off"): void;
    private drawStart(): void;
    private drawEnd(): void;
  }
  /**
 * 大数据绘制 优化处理
 * 划分网格 同网格内设置最大图标数量
 * 超出不绘制 减少画布渲染次数
 */
  export class MapPluginBigData extends MapPluginDraw {
    constructor(map: L.Map | AMAP.Map, options: Partial<SLPMap.Canvas> & BigDataOption);
    /**R树搜索 绘制 */
    private rbush;
    private rbushData: SLTRbush[];
    /**大数据绘制图标 */
    private bigDataImgs: MapImage[];
    /**已渲染的图标 用于事件添加 */
    private _renderBigDataImgs: MapImageEvent[];
    private bigDataOption: BigDataOption;
    get renderBigDataList(): MapImageEvent[];
    /**绘制大量图标 rbush筛选重叠优化 */
    public setbigDataImgs(imgs: MapImage[]): void;
    /**重设rbush */
    private resetRbush(): void;
    /**
     * 将画布划分为多个矩形
     * 矩形内限制最大重叠图形，超出不绘制
     */
    handleOverlapImage(): void;
    /**
     * 根据图层缩放 获取配置
     * @param zoom
     * @returns
     */
    private getZoomOption(zoom: number): [number, number];
    /**图片转化为rbush数据格式 */
    private transformRbush(img: MapImage): SLTRbush<MapImage>;
    /**绘制所有需要绘制的类 */
    public drawMapAll(): this;
  }
  /**leaflet的粒子效果 */
  export class MapPluginPartial extends MapCanvasLayer {
    constructor(map: L.Map | AMAP.Map, options?: SLPMap.Canvas);
    /**
     * 图层是否在移动 高德默认每次渲染更新像素坐标
     * leaflet 图层移动不更新像素坐标 高德 图层移动更新像素坐标
     * 高德地图移动画布和地图同步偏移，leaflet画布固定 地图偏移 的区别
     * 所以防止leaflet移动过程二次偏移 以及高德移动过程坐标未更新导致画布和容器相对位置发生偏移
     * */
    private isDrag: boolean;
    /**所有的粒子效果数据 */
    private _allParticle: SLTMap.Particle.Info[];
    /**设置所有粒子数据 */
    public setAllParticles(particles: SLTMap.Particle.Info[]): void;
    protected renderAnimation(time?: number): void;
    private _animat(): void;
    /**绘制粒子效果 */
    private _drawParticles(): void;
    /**获取当前贝塞尔曲线的粒子点位 */
    private genCurBezierPoints(particle: SLTMap.Particle.Info): void;
    /**绘制粒子 */
    private drawParticle(particle: SLTMap.Particle.Info): void;
    /**拖拽不允许更新动画 */
    protected addMapEvents(map: L.Map | AMAP.Map, key: "on" | "off"): void;
    private drawStart(): void;
    private drawEnd(): void;
  }
  /*绘制雷达扫描图 */
  export class MapPluginRadar extends MapCanvasLayer {
    constructor(map: AMAP.Map | L.Map, options?: AMAP.CustomLayerOption | MapCanvasPara);
    /**动画所有状态 */
    private canvasRadar: MapCanvasRadar;
    /**
     * 图层是否在移动 高德默认每次渲染更新像素坐标
     * leaflet 图层移动不更新像素坐标 高德 图层移动更新像素坐标
     * 高德地图移动画布和地图同步偏移，leaflet画布固定 地图偏移 的区别
     * 所以防止leaflet移动过程二次偏移 以及高德移动过程坐标未更新导致画布和容器相对位置发生偏移
     * */
    private isDrag: boolean;
    /**重设雷达绘制类 */
    public setAllRadars(radars: MapPluginRadarPara[]): this;
    /**添加雷达绘制类 */
    public addRadar(radar: MapPluginRadarPara): this;
    protected override renderFixedData(): void;
    protected override renderAnimation(time?: number): void;
    /**拖拽不允许更新动画 */
    protected addMapEvents(map: L.Map, key: 'on' | 'off'): void;
    private drawStart(): void;
    private drawEnd(): void;
  }
  /**地图控件-比例尺/当前层级/鼠标所在位置 */
  export class MapPluginControl extends MapCanvasLayer {
    constructor(map: L.Map | AMAP.Map, options?: SLPMap.Control);
    public options: SLPMap.Control;
    private cb?: (info: Partial<SLPMap.LatlngScale>) => void;
    private info: Partial<SLPMap.LatlngScale>;
    private mapType: MapType;
    private latLng: SLPMap.LatLng;
    public init(): Partial<SLPMap.LatlngScale>;
    public setOptions(opt: Partial<SLPMap.Control>): Partial<SLPMap.LatlngScale>;
    /**位置等更新时触发 */
    public onUpdate(cb: (info: SLPMap.LatlngScale) => void): this;
    private eventSwitch(flag: boolean): void;
    /**设置经纬度信息 */
    private setLatlng(e: L.LeafletMouseEvent | AMapMapsEvent): void;
    private getLatlng(value: number, ifLng: boolean): string;
    private setZoomAndScale(): void;
    private getZoom(): number;
    private getLatLngFromEvent(e: L.LeafletMouseEvent | AMapMapsEvent): [number, number] | null;
  }


  /**对外暴露的类型-待优化 */
  /**轨迹船舶信息 */
  export type MapTrackShipInfo = globalThis.MapTrackShipInfo;
  /**轨迹点位置信息 */
  export type MapTrackPosition = globalThis.MapTrackPosition;
  /**轨迹组信息 */
  export type MapTrackGroup<T = any> = globalThis.MapTrackGroup<T>;
  /**轨迹点位信息 */
  export type MapTrackItem = globalThis.MapTrackItem;
  /**图片信息 */
  export type MapImage = globalThis.MapImage;
  /**雷达扫描事件 */
  export type MapRadarScanEvent<T = any> = globalThis.MapRadarScanEvent<T>;
}