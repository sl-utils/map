import { SLUCanvasGif } from "src/canvas";
import { SLUWorker } from "src/utils/slu-worker";
import type { Map as AMap, Bounds, CustomLayerOption, CustomLayer } from './amap'
import type { Map as LMap, LatLngBounds, LeafletMouseEvent, Layer, LatLng, LayerOptions } from 'leaflet'

declare module '@sl-utils/map' {

  /**! ------------------Canvas相关----------------------- */
  type GlobalCompositeOperationSelf = 'color' | 'color-burn' | 'color-dodge' | 'copy' | 'darken' | 'destination-atop' | 'destination-in' | 'destination-out' | 'destination-over' | 'difference' | 'exclusion' | 'hard-light' | 'hue' | 'lighten' | 'lighter' | 'luminosity' | 'multiply' | 'overlay' | 'saturation' | 'screen' | 'soft-light' | 'source-atop' | 'source-in' | 'source-out' | 'source-over' | 'xor';
  /**canvas相关的配置项 */
  export interface OptCanvas {
    /**透明度 */
    alpha?: number;
    /**填充的颜色透明度 */
    fillAlpha?: number;
    /**填充的颜色 (字体的颜色) */
    colorFill?: string | CanvasGradient | CanvasPattern;
    /**线条的颜色 */
    colorLine?: string | CanvasGradient | CanvasPattern;
    /**模糊阴影颜色 */
    shadowColor?: string;
    /**模糊范围大小 */
    shadowBlur?: number;
    /**线宽(文本阴影) */
    widthLine?: number;
    /**虚线 线长,间隔长 */
    dash?: [number, number];
    /**虚线偏移 */
    dashOff?: number;
    /**文本字体 设置字体大小和字体种类 14px serif */
    font?: string;
    /**文本对齐方式的属性 指定文本的(中心|左侧|右侧)渲染在指定位置 */
    textAlign?: CanvasTextAlign;
    /**文字垂直方向的对齐方式  alphabetic 未使用 */
    textBaseline?: CanvasTextBaseline;
    globalCompositeOperation?: GlobalCompositeOperationSelf;
    /**为true时图片隐藏不绘制 */
    ifHide?: boolean;
  }
  /**单点位 */
  interface Point {
    /**映射到canvas上的位置 [x,y] */
    point: [number, number];
    /**映射到canvas上的多个位置 [x,y][] */
    points?: [number, number][];
  }
  /**多点位 */
  interface Points {
    /**映射到canvas上的位置 [x,y] */
    point?: [number, number];
    /**映射到canvas上的多个位置 [x,y][] */
    points: [number, number][];
  }


  /**图片的基本配置 */
  export interface Image<I = any> {
    id?: string;
    /**图片路径 */
    url: string;
    /**图片大小(渲染的) */
    size?: [number, number];
    /**整图中截取的大小 */
    sizeo?: [number, number];
    /**整图中的位置X左边(css中的定位取正数) */
    posX?: number;
    /**整图中的位置Y上(css中的定位取正数) */
    posY?: number;
    /**图片中心左偏移位置大小(与position定位相同) */
    left?: number;
    /**图片中心上偏移位置大小(与position定位相同)  */
    top?: number;
    /**图片旋转角度 */
    rotate?: number;
    /**透明度 */
    alpha?: number;
    /**为true时图片隐藏不绘制也象征着事件不响应 */
    ifHide?: boolean;
    /**大于0在上  小于0在下 */
    index?: number;
    /**通过该信息可决定图片是否显示或其他情况 */
    info?: I;
  }
  /**gif的基本配置 */
  export type CanvasGif<I = any> = Image<I> & CanvasPosition & {
    size: [number, number];
    /**id必传且唯一，用于后续关闭之前绘制的动画 */
    id: string;
    delay?: number;
  }
  /**文本绘制 */
  interface Text<I = any> extends OptCanvas {
    /**文本内容 */
    text?: string;
    /**是否描边(描边颜色 colorLine  描边大小 widthLine) */
    ifShadow?: boolean;
    /**水平偏移量 右偏>0 左偏<0*/
    px?: number;
    /**垂直偏移量 下偏>0 上偏<0*/
    py?: number;
    /**文本间距 无则默认取actualBoundingBoxDescent属性获取文字基线向下边界高度*/
    lineHeight?: number;
    /**文本最大宽度 */
    maxWidth?: number;
    /**背景板 */
    panel?: CanvasTextPanel;
    /**文本重叠处理方式(不设置等同于type:show) */
    overlap?: TextOverlap;
    /**通过该信息可决定其他情况 */
    info?: I;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/fillText) */
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/measureText) */
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/strokeText) */
  }
  /**文字背景板的配置 */
  interface CanvasTextPanel extends OptCanvas {
    /**面板的圆角半径 3 */
    radius?: number;
    /**padding left 设置背景板生效*/
    pl?: number;
    /**padding right 设置背景板生效*/
    pr?: number;
    /**padding top 设置背景板生效*/
    pt?: number;
    /**padding bottom 设置背景板生效*/
    pb?: number;
  }
  interface TextOverlap {
    /**文本重叠处理方式 hide隐藏|py偏移|show强制显示*/
    type?: 'hide' | 'py' | 'show';
    /**最大查找距离 超过距离不显示 */
    maxDistance?: number;
    /**矩形之间最小间距 可以为负 重叠一部分*/
    minSpacing?: number;
    /**点和矩形最小距离 */
    minDistance?: number;
    /**遍历间距 */
    querySpace?: number;
    /**指示线配置(配置后才渲染) */
    line?: CanvasLine;
  }
  /**圆点 */
  interface Arc<I = any> extends OptCanvas {
    /**圆半径 */
    size?: number;
    /**通过该信息可决定其他情况 */
    info?: I;
  }
  /**矩形渲染 */
  interface Rect<I = any> extends OptCanvas {
    /**矩形宽*/
    width?: number;
    /**矩形高*/
    height?: number;
    /**矩形圆角*/
    radius?: number | number[];
    /**通过该信息可决定其他情况 */
    info?: I;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/clearRect) */
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/fillRect) */
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/strokeRect) */
  }
  /**多边形渲染 */
  interface Polygon<I = any> extends OptCanvas {
    /**通过该信息可决定其他情况 */
    info?: I;
  }
  /**线渲染 */
  export interface Line<I = any> extends OptCanvas {
    /**贝塞尔曲线的曲度 数值越大越弯曲 */
    degree?: number;
    /**通过该信息可决定其他情况 */
    info?: I;
  }
  /**canvse上的位置信息 */
  export type CanvasPosition = Point | Points;
  /**canvas渲染的图片类 @param T 标识该图片携带的info的类型  事件响应时将挂载在MapEventResponse的info上*/
  export type CanvasImage<I = any> = Image<I> & CanvasPosition;
  /**canvas渲染的文本类 */
  export type CanvasTxt<I = any> = Text<I> & CanvasPosition;
  /**canvas渲染的圆点类 */
  export type CanvasArc<I = any> = Arc<I> & CanvasPosition;
  /**canvas渲染的矩形类 */
  export type CanvasRect<I = any> = Rect<I> & CanvasPosition;
  /**canvas渲染的文本背景矩形框 */
  export type CanvasTextRect<I = any> = Text<I> & Rect<I> & {
    x: number;
    y: number;
  };
  /**canvas渲染的多边形类 */
  export type CanvasPolygon<I = any> = OptCanvas & CanvasPosition;
  /**canvas渲染的线条类 */
  export type CanvasLine<I = any> = Line<I> & Points;
  /**标识动画数据类型 */
  interface CanvasAnimeElement {
    /**动画唯一标识 保留动画状态 */
    animeId: string
  }
  /**动画绘制基类*/
  interface CanvasAnimeDraw {
    /**绘制数据 */
    data: CanvasAnimeElement & MapShow & (MapPoint | MapPoints)
    /**动画回调 传入time为requestAnimeFrame的时间戳 返回当前动画进度 animeProgress*/
    animeRender: (time: number) => number
    /**动画渲染前相关逻辑 */
    beforeRender: () => void
    /**动画进度 0 - 1 */
    animeProgress: number
    /**更新动画进度后 回调 绘制类相关动画状态都在这里更新 */
    updateAnimeProgress: (progress: number) => void;
    /**一秒绘制帧率*/
    frameRate: number
  }

  /**动画绘制状态 */
  interface CanvasAnimeCtr {
    /**动画唯一标识 */
    animeId: string
    /**动画进度 0 - 1 */
    animeProgress: number
    /**动画阶段 */
    animeState?: string
    /**后续拓展... */
    type?: string
  }

  /**事件触发时鼠标位置的信息 */
  interface CanvasCursorPosition {
    /**在canvas上的位置[x,y] */
    point: [number, number];
    /**在整个网页的位置[x,y] */
    page: [number, number];
  }
  /**事件触发时的响应对象 T事件对象  I为事件对象携带的信息*/
  interface CanvasEventResponse<T = CanvasEvent, I = any> {
    /**事件类型 */
    type: MapEventType;
    /**事件位置信息 */
    position: CanvasCursorPosition;
    /**事件对象 CanvasEvent | Map*/
    event: T;
    /**事件挂载的相关info */
    info?: I;
  }
  /**申明画布事件  */
  export type CanvasEvent<T extends CanvasEvent = any, I = any> = {
    /**事件类型(挂在单个事件) */
    type: MapEventType | MapEventType[];
    /**申明事件特殊回调(不写则运用类里面的cb函数) */
    cb?: (e: CanvasEventResponse<T, I>) => void;
    /**申明事件特殊回调(挂多个事件的不同响应) */
    cbs?: { [key in MapEventType]: (e: CanvasEventResponse<T, I>) => void };
    /**事件响应范围(px) */
    range?: [number, number];
    /**事件定位左偏移指定像素(类似position定位) */
    left?: number;
    /**事件定位上偏移指定像素(类似position定位) */
    top?: number;
    /**为true时图片隐藏不绘制也象征着事件不响应 */
    ifHide?: boolean;
    /** */
    info?: I;
  }

  /**! ------------------地图相关----------------------- */
  /**配置 -- 地图配置项 */
  export interface OptMap {
    /**地图的类型 @param L leaflet插件 @param A 高德地图 @param B 百度地图  @default L*/
    type: 'L' | 'A' | 'B',
    /**地图中心点 [lat,lng] @default [22.68471,114.12027] */
    center: [number, number],
    /**地图初始层级 @default 11*/
    zoom: number,
    /**最小层级 @default 2*/
    minZoom: number,
    /**最大层级 @default 20*/
    maxZoom: number,
    /**拖拽功能 @default true */
    dragging: boolean,
    /**显示层级控制器 @default false */
    zoomControl: boolean,
    /**显示属性控制器 @default false */
    attributionControl: boolean,
    /**双击放大层级 @default false */
    doubleClickZoom: boolean,
    /**点击关闭弹窗 @default false */
    closePopupOnClick: boolean,
    /**显示标签(省会、地名等) @param AMap @default true  */
    showLabel: boolean,
  }

  /**地图事件类型 */
  type MapEventType = 'unset' | 'click' | 'dblclick' | 'mousemove' | 'mousedown' | 'mouseup' | 'mouseleave' | 'mouseenter' | 'rightclick';
  /**抛出给地图扩展的图片类 由于地图size可能采用固定m为单位，故采用不限定size的_BaseImage*/
  type ωCanvasMapImage<I = any> = CanvasImage<I>;
  /**抛出给地图扩展的Gif类 由于地图size可能采用固定m为单位，故采用不限定size的_BaseGif*/
  type ωCanvasMapGif<I = any> = CanvasGif<I>;

  /**地图上的纬度经度 [lat,lng] */
  interface MapPoint {
    latlng: [number, number],
    latlngs?: [number, number][],
  }
  /**地图上的纬度经度 [lat,lng][] */
  interface MapPoints {
    latlngs: [number, number][],
    latlng?: [number, number],
  }
  /**地图上的大小 */
  interface Size_ {
    size: [number, number] | number
    sizeFix?: [number, number] | number
  }
  /**地图上的大小（米） */
  interface SizeFix_ {
    size?: [number, number] | number
    sizeFix: [number, number] | number
  }
  /**rbush 查询类*/
  export interface MapRbush<T = any> {
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
    latlng: [number, number]
    data: T,
  }
  /** 0 leaflet 1 高德 2 百度 js类型 */
  type MapType = 0 | 1 | 2
  /**高德地图地图插件原生事件触发后发出的对象 */
  interface AMapMapsEvent {
    lnglat: { Q: number, R: number, lng: number, lat: number }
    originEvent: MouseEvent,
    pixel: { x: number, y: number }
    type: MapEventType
  }

  /** type 0 1 2 转化为对应库的类型 2百度地图 暂时不支持 */
  type TypeToMap<T extends MapType> = T extends 0 ? LMap : T extends 1 ? AMap : never
  interface SLPAMapLayer extends CustomLayerOption {
    /**添加增加动画画布 =>*/
    aniCanvas?: boolean;
  }
  /** 地图上的事件 */
  export type MapEvent<T extends MapEvent = any, I = any> = CanvasEvent<T, I> & MapPosition & MapShow;
  export interface MapMouseEvent {
    type: MapEventType;
    latlng: { lat: number, lng: number };
    containerPoint: {
      x: number;
      y: number;
    };
    orginDOMEvent: MouseEvent;
    orginMapEvent: LeafletMouseEvent | AMapMapsEvent
  }
  /**地图事件触发时的响应对象 T为挂载此次事件的对象(MapImage|MapArc|Event),I为对象携带的相关数据*/
  export type MapEventResponse<T extends MapEvent = MapEvent, I = any> = CanvasEventResponse<T, I> & {
    /**事件位置信息 */
    position: MapCursorPosition;
  }
  /**地图事件触发时鼠标位置发出的信息 */
  interface MapCursorPosition extends CanvasCursorPosition {
    /**地图事件所定义的纬经度 [lat,lng] */
    latlng: [number, number];
  }
  /**显示的相关配置 */
  export interface MapShow {
    /**显示的最大地图级别(包含此级别) */
    maxZoom?: number,
    /**显示的最小地图级别(包含此级别) */
    minZoom?: number,
    /**绘制层级，类似z-index */
    index?: number,
  }
  /**在地图上的位置数据 */
  export type MapPosition = MapPoint | MapPoints;
  /**在地图上的大小 */
  export type MapSize = Size_ | SizeFix_;
  /**地图上的图片(无事件)*/
  export type MapImage<I = any> = Image<I> & MapShow & MapPosition & MapSize;
  /**带事件的图片类 */
  export type MapImageEvent<I = any> = MapImage<I> & MapEvent<MapEvent, I>;
  /**地图上的Gif(无事件)*/
  export type MapGif<I = any> = ωCanvasMapGif<I> & MapShow & MapPosition & MapSize;
  /**带事件的Gif类 */
  export type MapGifEvent<I = any> = MapGif<I> & MapEvent<MapEvent, I>;
  /**不带事件的地图文本类 */
  export type MapText = Text & MapShow & MapPosition;
  /**带事件的地图文本类 */
  export type MapTextEvent<I = any> = Text & MapEvent<MapEvent, I>;
  /**不带事件的圆点类 */
  export type MapArc = Arc & MapShow & MapPosition & MapSize;
  /**带事件的圆点类 */
  export type MapArcEvent<I = any> = MapArc & MapEvent<MapEvent, I>;
  /**不带事件的矩形 */
  export type MapRect = Rect & MapShow & MapPoints;
  /**带事件的矩形类 */
  export type MapRectEvent<I = any> = MapRect & MapEvent<MapEvent, I>;
  /**不带事件的地图多边形类 */
  export type MapPolygon = Polygon & MapShow & MapPoints;
  /**带事件的地图多边形类 */
  export type MapPolygonEvent<I = any> = MapPolygon & MapEvent<MapEvent, I>;
  /**不带事件的地图线条类 */
  export type MapLine = Line & MapShow & MapPoints;
  /**带事件的地图线条类 */
  export type MapLineEvent<I = any> = MapLine & MapEvent<MapEvent, I>;


  /**配置--地图画布配置 */
  interface OptMapCanvas extends LayerOptions {
    /**画布挂载的div节点;
     * map默认创建 mapPane tilePane shadowPane overlayPane markerPane tooltipPane popupPane,
     * 不存在时CanvasLayer会调用创建方法 
     * 类名会去掉Pane， 例如XPane和X都生成类名为 leaflet-X-pane的div节点，但是属于不同的pane
     */
    pane?: string;
    /**画布的class名称 */
    className?: string
    /**画布层级  默认100，最大400(受挂载的div影响，可修改) */
    zIndex?: number;
    /**zoom调整是开启缩放动画 true*/
    zoomAnimation?: boolean;
  }

















  /**--------------------------------------------------------------地图扩展插件相关类型---------------------------------------------------- */

  /**------雷达的配置（单个） ---- */
  export type OptMapPluginRadar<I = any> = {
    /**动画唯一标识 保留动画状态 */
    animeId: string
    /**雷达方位角 正北为起始点 顺时针 @default [0,90]*/
    angle?: [number, number],
    /**扫描方向默认顺时针 @default true*/
    ifClockwise?: boolean
    /**扫描周期,单位秒 @default 3*/
    time?: number
    /**当前扫描角度 @default 0*/
    currentAngle?: number
    /**扇形扫描区域角度 @default 30*/
    sectorAngle?: number;
    /**扇形扫描区域颜色 @default #00FF00*/
    colorSector?: string;
    /**网格线颜色 @default #49EFEF66 */
    colorGrid?: string;
    /**标签文字颜色 @default #FFFF00 */
    colorText?: string;
    /**雷达主色调  @default #00FFFF */
    colorRadar?: string
    /**虚线圆颜色(颜色数少于线圈数时渐变) @default ['#FF0000','#00FF00'] */
    colorDash?: string[];
    /**虚线圆距离界限 @default [100,500] */
    arcDash?: number[];
    /**网格密度 半径划分n格*/
    gridDensity?: number;
    /**虚线圈密度 划分n圈*/
    dashDensity?: number;
    /**为true时隐藏不绘制也象征着事件不响应 */
    ifHide?: boolean
    /**雷达半径(根据size计算得出) */
    radius?: number;
    /**位置(根据经纬度计算得出) */
    center?: [number, number]
    /**通过该信息可决定图片是否显示或其他情况 */
    info?: I
  } & MapShow & MapPoint & SizeFix_;
  /**带事件的雷达扫描类 */
  type MapRadarScanEvent<I = any> = OptMapPluginRadar<I> & MapEvent<MapEvent, I>;



  /**------地图轨迹相关------------*/
  /**数据--轨迹必要的数据 */
  interface DataMapTrack {
    /**纬度 */
    lat: number;
    /**经度 */
    lng: number;
    /**速度 */
    speed: number;
    /**方向 */
    course: number;
    /**时间戳 */
    timeStamp: number;
  }
  /**轨迹必要的数据 */
  interface DataMapTrackGroup<T = any> {
    /**唯一标识 */
    id: string;
    /**轨迹名 */
    name: string;
    /**轨迹 */
    data: DataMapTrack[];
    /**原始数据源 */
    orginData: T
  }
  /**轨迹的各坐标点位信息 */
  interface MapTrackPosition {
    /**经度 */
    LON: number
    /**纬度 */
    LAT: number
    /**速度 */
    SPEED: number
    /**方向 */
    COURSE: number
    /**时间（秒） */
    EPOCH: number
    SAT: string
    GAP_MINUTES: string
    HEADING: string
    /**该时间点已被应用 */
    ifUse?: boolean
  }
  /**轨迹时的船信息 */
  interface MapTrackShipInfo {
    SHIP_ID: string
    MMSI: string
    SHIPNAME: string
    TYPE_COLOR: string
    LENGTH: string
    WIDTH: string
    W_LEFT: string
    L_FORE: string
    HIDDEN_SAT: string
    POSITIONS: MapTrackPosition[]
  }
  /**轨迹中指定时间的点位信息 */
  interface MapTrackTimePosition {
    /**纬度 */
    lat: number,
    /**经度 */
    lng: number,
    /**时间 */
    time: Date,
    /**角度 */
    rotate: number,
    /**速度 */
    speed: number
    /**速度(后端传过来的) */
    SPEED: number
  }
  /**轨迹中指定时间点的数据信息 */
  interface MapTrackTimeInfo extends MapTrackTimePosition {
    SHIP_ID: string
    MMSI: string
    SHIPNAME: string
    TYPE_COLOR: string
    LENGTH: string
    WIDTH: string
    W_LEFT: string
    L_FORE: string
    HIDDEN_SAT: string
  }

  interface MapTrackInfos {
    [K: string]: MapTrackShipInfo
  }

  /**每一条轨迹的信息 */
  type MapTrackInfo<T = {}> = CanvasLine & {
    /**构成线的点位 */
    latlngs: [number, number][];
    /**个点位的信息（差异数据） */
    infos: MapTrackPointInfo[];
  } & T;
  /**每条轨迹上所有有点位信息 */
  type MapTrackPointInfo = {
    /**纬度 */
    lat: number;
    /**经度 */
    lng: number,
    /**播发时间 */
    time: Date,
    /**角度(不属于后端传过来的值则是通过计算得到) */
    rotate?: number;
  };
  /**轨迹上任意一时间获取到的相关信息 */
  type MapTrackPointInfoByTime = {
    /**纬度 */
    lat: number;
    /**经度 */
    lng: number,
    /**播发时间 */
    time: Date,
    /**角度(不属于后端传过来的值则是通过计算得到) */
    rotate?: number;
    /**移动速度*/
    speed?: number;
  };




  /**数据--热力图数据 */
  export interface DataMapHeat {
    /**经纬度点 */
    latlng: [number, number]
    /**权重 */
    weight?: number
  }
  /**数据--地图粒子数据 */
  export interface DataMapParticle extends Line {
    /**canvas上对应的坐标 */
    latlngs?: [number, number][];
    /**计算得到的贝塞尔曲线控制点*/
    curve?: [number, number][];
    /**粒子速度(小于0.1采用百分比)(每帧移动距离) */
    speed?: number;
    /**粒子长度(小于0.1采用百分比) */
    length?: number;
    /**粒子密集度(数字越大绘制粒子的点越多,性能越差,大于1) */
    dense?: number;
    /**当前粒子点位数据 */
    curPoints?: [number, number][];
    /**生命 0-1*/
    age?: number;
    /**所属线段序号 (两个点一条线段，三个点两条线段) */
    index?: number;
    /**粒子的颜色 */
    colorParticle?: string;
    /**显示粒子（只有为false才隐藏） */
    showParticle?: boolean;
  }

  /**!------------------标绘相关类型----------------- */
  /**标绘的类型 */
  type MapPlotType = 'point' | 'line' | 'polygon' | 'circle' | 'rect';
  /**细分标绘类型 */
  type MapPlotDetailType<T extends MapPlotType> = T extends 'point' ? ({
    /**点标绘 */
    type: 'point',
    latLngs: [[number, number]],
  } & CanvasImage) : T extends "circle" ? {
    /**circle圆形 rect矩形 */
    type: 'circle',
    /**圆心和编辑点*/
    latLngs: [[number, number], [number, number]] | [[number, number]] | [],
    rail?: number
  } : T extends "rect" ? {
    /**circle圆形 rect矩形 */
    type: 'rect',
    latLngs: [[number, number], [number, number]] | [],
  } : {
    type: Exclude<MapPlotType, 'circle' | 'rect' | 'point'>
    /**经纬度集合 */
    latLngs: [number, number][];
  };
  /**数据--地图标绘数据 */
  type DataMapPlot<T extends MapPlotType = MapPlotType> = OptCanvas & {
    /**名称 */
    name?: string;
    /**是否隐藏 */
    ifHide?: boolean;
    /**是否是编辑状态 */
    ifEdit?: boolean;
  } & MapPlotDetailType<T>

  /**配置--插件标绘类的配置项 */
  export interface OptMapPluginPlot extends OptMapCanvas, OptCanvas { }
  /**配置--插件热力图类的配置项*/
  export interface OptMapPluginHeat extends OptMapCanvas, OptCanvas {
    /**半径 */
    radius?: number,
    /**模糊级数(越大影响范围越大影响系数越小，最好不要超过半径的两倍) */
    blur?: number,
    /**渐变色 */
    gradient?: any,
    /**最小阴影透明度 */
    minOpacity?: number,
    /**渐变色指数 小于10，越大变色越难*/
    gradientIndex?: number,
    /**是否显示等级标识tip */
    ifTip?: boolean,
    /**tip偏移量*/
    tipX?: number,
    /**tip偏移量 */
    tipY?: number,
  }
  /**配置--插件测距类的配置项 */
  export interface OptMapPluginRange extends OptCanvas, OptMapCanvas {
    /**线的颜色(点的边线色) */
    colorLine?: string;
    /**点的填充色 */
    colorArc?: string;
    /**起点的填充色 */
    colorArcStart?: string;
    /**字体的颜色 */
    colorFont?: string;
    /**语言模式 cn中文 en英文*/
    lang?: 'cn' | 'en';
  }
  /**配置--插件地图轨迹配置 */
  export interface OptMapPluginTrack extends OptMapCanvas {
    /**是否显示轨迹 */
    ifLine?: boolean;
    /**是否显示圆点 */
    ifArc?: boolean;
    /**圆点的间隔（大于1000时采用时间模式） */
    arcInterval?: number;
    minIcon?: string;
    /**圆点大小 */
    sizeArc?: number;
    /**圆点颜色 ( rgb(),rgba(),#fff )*/
    colorArc?: string;
    /**圆点填充色*/
    colorArcFill?: string;
    alpha?: number;
    /**线条宽度 */
    widthLine?: number;
    /**线条颜色 */
    colorLine?: string;
    /**起点文字 */
    textStart?: string;
    /**终点文字 */
    textEnd?: string;
    /**起点文字颜色 */
    colorTextStart?: string;
    /**终点文字颜色 */
    colorTextEnd?: string;
    /**起点圆点颜色 */
    colorArcStart?: string;
    /**终点圆点颜色 */
    colorArcEnd?: string;
  }
  /**配置--插件风速风向配置 */
  export interface OptMapPluginWind extends OptMapCanvas {
    /**风速风向雪碧图地址 */
    url: string;
    /**风速风向雪碧图宽高 */
    size: [number, number];
    /**风速风向雪碧图原始大小 */
    sizeo: [number, number];
    /**不同层级下的大小 */
    zooMsize: [number, number][];
  }
  /**配置--插件风速风向配置 */
  export interface OptMapPluginArrowLine extends OptMapCanvas, DataMapArrowLine {
    /**样式配置 */
    fillColor?: string
    strokeColor?: string
    imgUrl?: string
  }
  /**地图控件配置-比例尺/当前层级/鼠标所在位置 */
  export interface OptMapPluginControl extends OptMapCanvas {
    /**经纬度是否转为度数显示 */
    ifTran?: boolean;
    /**经纬度度数显示精度 */
    precision?: number;
  }
  /**配置--Grid配置 */
  export interface OptMapGrid extends OptMapCanvas {
    /**马赛克颜色等级 */
    mosaicColor?: string[];
    /**马赛克颜色值 */
    mosaicValue?: number[];
    /**渐变色设置 */
    gradient?: { [key: number]: string };
    /**渐变色最高值 */
    gradientMax?: number;
    /**渐变半径 */
    gradientRadius?: number;
  }
  interface OptLatLng {
    /**纬度 */
    lat: number;
    /**经度 */
    lng: number;
  }
  interface OptLatlngScale {
    /**纬度 */
    lat: string;
    /**经度 */
    lng: string;
    /**层级 */
    zoom: number;
    /**比例尺 */
    scale: string;
    /**比例尺对应像素宽度 */
    width: string;
  }
  /**-----------------------------各插件数据格式---------------------------- */

  /**数据--风速风向数据类型 */
  export interface DataMapWind {
    /**纬度经度 */
    latlng: [number, number]
    /**风速 */
    speed: number;
    /**风向 */
    direction: number;
  }
  /**数据--动态线条 */
  export interface DataMapArrowLine {
    /**线宽 */
    lineWidth: number
    /**粒子速度 */
    speed?: number
    partialWidth?: number
    partialHeight?: number
    /**间隙 */
    partialSpace?: number
    /**贝塞尔曲线 */
    isBezier?: boolean
    /**曲率 */
    degree?: number
  }


  /**-----------------------------grid数据格式-------------------------start--- */
  /**数据--grid数据格式 */
  export interface DataMapGrid {
    //行数
    nx: number,
    //列数
    ny: number,
    //经度差值
    dx: number,
    //纬度差值
    dy: number,
    //起始点经度(左上角)
    sx: number,
    //起始点纬度
    sy: number,
    //()
    nodata: number | undefined,
    //数据缩放比例(scale:0.01,data中数据1,真实数据0.01,减少数据包大小)
    scale: number,
    //每个数据由几个元素组成( 温度 1  , 降雨 1 ， 风速风向(u,v)  2)
    num: number,
    header: DataMapGridHeader,
    //数据
    data: number[],
  }
  interface DataMapGridHeader {
    //行数
    nx: number,
    //列数
    ny: number,
    la1: number,
    lo1: number,
    dx: number,
    dy: number,
    la2: number,
    lo2: number,
  }
  /**网格可视区边界 */
  interface GridBounds {
    /**X轴起点 0 */
    x: number;
    /**Y轴起点 0*/
    y: number;
    /**X轴宽度 */
    width: number;
    /**Y轴高度 */
    height: number;
  }

  interface WorkerInfo {
    /**worker id */
    id?: number;
    /**可视区宽度 */
    width: number;
    /**可视区高度 */
    height: number;
    /**左上角纬度 */
    lat: number;
    /**左上角进度 */
    lng: number;
    /**可视范围内Y轴各像素点对应的纬度 */
    lats: number[];
    /**可视范围内X轴各像素点对应的经度差 */
    lngd: number;
    /**数据起始纬度 */
    lat0: number;
    /**数据起始经度 */
    lng0: number;
    /**数据纬度差 */
    latΔ: number;
    /**数据经度差 */
    lngΔ: number;
    /**空数据无数据的标识 */
    invalid: number | undefined | null;
    /**数据 */
    grid: any;
    /**马赛克颜色设置 */
    mosaicColor?: string[];
    /**马赛克颜色对应的值 */
    mosaicValue?: number[];
  }
  /**-----------------------------grid数据格式-------------------------end--- */



  /**配置--流体粒子动画类*/
  export interface OptMapPluginFlow extends OptMapCanvas {
    displayValues: boolean;
    /**粒子大小控制 */
    velocityScale?: number;

    particleAge?: number;
    maxVelocity: number;
    /**速度单位(m/s  米/秒 ； k/h 千米/小时 ；  kt 节 ) */
    unit: 'm/s' | 'k/h' | 'kt';
    // 'bearing' (气流流向的角度) or 'meteo' (angle from which the flow comes)
    // 'CW'(角度值顺时针增加)或'CCW'(角度值逆时针增加)
    angleConvention: "bearingCCW" | "bearingCW" | "meteoCCW" | "meteoCW";
    emptyString: string;
    colorScale?: any;
    data?: DataMapVeloctiyWind[];
  }
  /**配置项 */
  interface OptMapPluginVelocity {
    /**最小速度 */
    minVelocity: number;
    /**最大速度(决定了粒子的颜色) */
    maxVelocity: number;
    /**粒子刻度(大小) */
    velocityScale: number;
    /**粒子生命值 */
    particleAge: number;
    /**粒子线宽 */
    lineWidth: number;
    /**绘制粒子数量的比例（宽像素*高像素*此比例）*/
    particleMultiplier: number;
    /**每秒播放帧数 */
    frameRate: number;
    defualtColorScale: string[];
    data: any[];
    canvas?: HTMLCanvasElement;
  }
  /**风场数据 */
  export interface DataMapVeloctiyWind {
    header: VelocityHeader;
    /**单个方向的值  该值是风速和角度运算后的结果 */
    data: number[];
  }
  interface VelocityHeader {
    /**数据时间 */
    refTime: string;
    /**数据纬度起点 */
    la1: number;
    /**数据经度起点 */
    lo1: number;
    /**数据纬度结束点 */
    la2: number;
    /**数据经度结束点 */
    lo2: number;
    /**数据x轴方向nx个数为一行(若全球数据中dx经度间隔得到一个数据，则nx =   360 * 1/ dx ) */
    nx: number;
    /**数据y轴方向ny个数为一列(若全球数据中dy纬度间隔得到一个数据，则nx =   181 * 1/ dy ) */
    ny: number;
    /**数据经度间隔 (若全球数据中0.5经度间隔得到一个数据，则 dx = 1 * 0.5 )*/
    dx: number;
    /**数据纬度间隔 (若全球数据中0.5纬度间隔得到一个数据，则 dy = 1 * 0.5 )*/
    dy: number;
    /**数据类型 */
    type: "X" | "Y" | "Z";
    /**流速单位 m/s */
    unit: string;
    forecastTime: number;
  }

  interface WindBounds {
    /**X轴起点 0 */
    x: number;
    /**Y轴起点 0*/
    y: number;
    xMax: number;
    yMax: number;
    width: number;
    height: number;
  }

  interface WindMapBounds {
    south: number;
    north: number;
    east: number;
    west: number;
    width: number;
    height: number;
  }

  /**风粒子 */
  interface WindParticle {
    /**生命周期 */
    age: number;
    x: number;
    y: number;
    xt?: number;
    yt?: number;
  }
  /**-----------------------------运动粒子类-------------------------end--- */


  /**-----------------------------大数据渲染类-------------------------start--- */
  interface BigDataOption {
    zoomOption: {
      [key: number]: {
    // maxCount为-1 退化成初始全部渲染 并且性能比全部渲染还差 还要维护rbush结构
    /**最大重叠数量 -1 表示不限制重叠数量 */ maxCount: number;
        /**划分检索最小区域 不传则表示整个画布区域 划分越小越影响性能*/
        minBound?: [number, number];
      };
    };
  }
  /**-----------------------------大数据渲染类-------------------------end--- */







































  /**leaflet 需要开发者在样式表中挂载leaflet样式 */
  export class SLUMap {
    constructor(ele: string,);
    map: AMap | LMap
    /**初始实例化地图
      * @param options 地图初始化参数
      */
    public init(options?: Partial<OptMap>): Promise<void>;
    /**设置合适的视图范围 */
    public setFitView(latlngs: [number, number][]): this;
    /**获取地图边界 */
    public getBound(): Bounds | LatLngBounds;
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
    constructor(map: AMap | LMap, canvas: HTMLCanvasElement);
    private canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected map: AMap | LMap;
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
    public transformXY(info: MapPosition & CanvasPosition): void;
    /**设置固定大小的图片 */
    public transformImageSize(img: MapImage): void;
    private transformArcSize(arc: MapArc): void;
  }
  /**地图事件控制类 */
  export class MapCanvasEvent {
    constructor(map: AMap | LMap);
    /**R树搜索 事件 */
    private rbush;
    /**是否重新开始事件指针变化(使不同canvas的事件指针能正确显示)*/
    private static ifInitCursor: boolean;
    /**是否开启事件控制类初始化 */
    private static ifInit: boolean;
    /**地图销毁必须调用此方法，否则事件指针会异常 */
    public static destory(): void;
    private static initCursor(): void;
    protected map: AMap | LMap;
    /** 监听事件 */
    protected _listenCbs: { [key in MapEventType]?: ((e: MapEventResponse<any>) => void)[] };
    /** key 防止setEvent清除其他事件 */
    public _allMapEvents: Map<string, MapEvent[]>;
    /** Rbush查询子集 */
    private _allRbush: MapRbush<MapEvent>[];
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
    public on<T extends MapEvent<any>>(type: MapEventType, cb: (e: MapEventResponse<T>) => void): void;
    /**统一关闭指定事件的监听 */
    public off<T extends MapEvent<any>>(type: MapEventType, cb?: (e: MapEventResponse<T>) => void): void;
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
    private triggerEvent(e: AMapMapsEvent | LeafletMouseEvent): void;
    /**获取指针触发范围内的事件 */
    private getEventsByRange(e: AMapMapsEvent | LeafletMouseEvent): { curEvents: MapEventResponse<MapEvent<any, any>, any>[], enterEvents: MapEventResponse<MapEvent<any, any>, any>[], leaveEvents: MapEventResponse<MapEvent<any, any>, any>[] };
    /**通过事件类型执行回调函数*/
    private doCbByEventType(resp: MapEventResponse, type: MapEventType): void;
    /**生成地图事件响应对象 
     * @param latlng 该事件对象的地图坐标
     * @param point 该事件对象的地图像素坐标
     * @param event 地图事件
     * @param cursor 鼠标位置信息
    */
    private genEventResponse(latlng: [number, number], point: [number, number], event: MapEvent, cursor: MapCursorPosition): MapEventResponse;
  }
  /** 地图canvas箭头线类 */
  export class MapCanvasArrowLine {
    constructor(map: AMap | LMap, ctx: CanvasRenderingContext2D, animeLineOpt?: OptMapPluginArrowLine);
    private readonly defaultOption: OptMapPluginArrowLine;
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
    constructor(map: AMap | LMap, ctx: CanvasRenderingContext2D);
    private get zoom(): number;
    /**上一动画时间(毫秒) */
    private pertime: number;
    /**雷达的默认设置 */
    private radarDefault: OptMapPluginRadar;
    /**所有的雷达数据 */
    private allRadars: OptMapPluginRadar[];
    /**重设雷达绘制类 */
    public setAllRadars(radars: OptMapPluginRadar[]): this;
    /**添加雷达绘制类 */
    public addRadar(radar: OptMapPluginRadar): this;
    /**开始绘制所有雷达静态部分 */
    public drawRadarStatic(): void;
    /**开始绘制所有雷达动态扫描部分 */
    public drawRadarAmi(time?: number): void;
    /**更新所有雷达位置和大小 */
    private updatePoint(radar: OptMapPluginRadar): void;
    /**绘制雷达网格 */
    private drawGrid(radar: OptMapPluginRadar): void;
    /**虚线圈到中心点距离 */
    private drawDashArc(radar: OptMapPluginRadar): void;
    /**绘制自定义的虚线圈 */
    private drawCustomDashArc(radar: OptMapPluginRadar): void;
    /**绘制轮廓 */
    private drawOutline(radar: OptMapPluginRadar): void;
    /**绘制边缘单元 */
    private drawOutlineUnit(radar: OptMapPluginRadar): void;
    /**雷达背景蒙版 中间泛白*/
    private drawBackground(radar: OptMapPluginRadar): void;
    /**绘制文字描述 */
    private drawText(radar: OptMapPluginRadar): void;
    /**绘制扫描范围 */
    private drawScanRange(radar: OptMapPluginRadar): void;
    /**更新动态当前角度 */
    private updateAngle(radar: OptMapPluginRadar, diffTime: number): void;
    /**绘制扫描部分(动态) */
    private drawScan(radar: OptMapPluginRadar): void;
    /**
     * 绘制扇形区域
     * @param sectorDeg 扇形渐变角度
     * @returns
     */
    private drawSector(radar: OptMapPluginRadar): void;
    /**计算colors 渐变颜色 */
    private caculateColorChange(colors: string[], total: number): [number, number, number][];
  }
  /** 地图canvas基础图层类(基本所有插件都要继承此类) 删除永远比新增简单 */
  export class MapCanvasLayer {
    constructor(MAP: LMap, opt?: OptMapCanvas)
    constructor(MAP: AMap, opt?: CustomLayerOption)
    constructor(MAP: AMap | LMap, opt?: CustomLayerOption | OptMapCanvas)
    /**开发自己设置项目使用了的地图插件类型Leaflet(0)、高德(1)、百度(2),防止网络加载的第三方插件再使用instanceof是为define*/
    protected readonly type: 0 | 1 | 2;
    protected readonly map: AMap | LMap;
    private layer: Layer | CustomLayer;
    protected readonly canvas: HTMLCanvasElement;
    protected readonly ctx: CanvasRenderingContext2D;
    protected width: number;
    protected height: number;
    public readonly options: OptMapCanvas;
    /**动画循环的id标识 */
    protected flagAnimation: number;
    /**移除图层 */
    public onRemove(): MapCanvasLayer;
    /** 清空并重新设置画布 */
    public resetCanvas(): void
    /**添加或关闭地图特定的监听事件(_eventSwitch事件后自动调用) */
    protected addMapEvents(map: AMap | LMap, key: 'on' | 'off'): void
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
    constructor(sluMap: SLUMap, options?: CustomLayerOption | OptMapCanvas)
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
    constructor(sluMap: SLUMap, options?: OptMapPluginPlot);
    /**默认配置 */
    public options: OptMapPluginPlot;
    /**动态绘制图层 */
    private ctrMapAniDraw: MapPluginDraw;
    /**静态标绘图层 */
    private ctrMapDraw: MapCanvasDraw;
    /**图层事件控制器 */
    private ctrEvent: MapCanvasEvent;
    /**编辑圆点样式 */
    private editArc: MapArc;
    /**所有的标绘集合 */
    private plotList: DataMapPlot<MapPlotType>[];
    /**正在动态绘制的标(仅仅改变图形不会动态改变原始数据) */
    public plotAni: DataMapPlot;
    /**记录当前鼠标纬经度 */
    private curPoint: [number, number];
    /** 单击事件 */
    private eventClickTimer: number | undefined;
    /**开启新增的绘制 */
    public open<T extends MapPlotType>(type: T): DataMapPlot<T>;
    /**关闭绘制 */
    public close(): this;
    /**保存标绘 */
    public savePlot(): this;
    /**删除标绘 */
    public delPlot(plot?: DataMapPlot): this;
    /**设置所有区域数据 */
    public setPlotList(plotList: DataMapPlot[]): this;
    /**设置编辑区域数据 */
    public setEditPlot(plot: DataMapPlot): this;
    /**重绘 */
    public redraw(): this;
    protected renderFixedData(): void;
    protected renderAnimation(): void;
    /**生成动态绘制图层 */
    private genAniPlot(): void;
    /**绘制标绘 */
    private drawPlot(layer: MapCanvasDraw | MapPluginDraw, plotInfo: DataMapPlot, type: MapPlotType): void;
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
    private openMouseEdit(plotInfo: DataMapPlot): void;
    /**设置圆的编辑点 */
    private setCircleEditPoint(plotInfo: DataMapPlot): void;
    /**设置多边形的编辑点 */
    private setPolygonEditPoint(plotInfo: DataMapPlot): void;
    /**点标绘仍可编辑移动位置 */
    private setPointEdit(plotInfo: DataMapPlot): void;
    /**设置线段的编辑点 */
    private setLineEditPoint(plotInfo: DataMapPlot): void;
    /**设置矩形的编辑点 */
    private setRectEditPoint(plotInfo: DataMapPlot): void;
    /**添加响应事件 
     * @param latLng 经纬度
     * @param i 索引
     * @param plotInfo 绘制信息
     * @param eves 事件
     * @param ifVirtual 是否为虚拟点
    */
    private addEvent(latLng: [number, number], i: number, plotInfo: DataMapPlot, eves: MapEvent[], ifVirtual?: boolean): void;
    /**事件开关方法 
    * @param flag true开启 false关闭
    */
    private eventSwitch(flag: boolean): void;
    private eventClick(e: LeafletMouseEvent | AMapMapsEvent): void;
    /** 鼠标移动事件 */
    private eventMousemove(e: LeafletMouseEvent | AMapMapsEvent): void;
    /** 双击关闭事件 */
    private eventDblclick(): void;
    /**移除所有的监听函数 */
    private clearCb(): void;
    /**绘制时添加了新点位时的回调*/
    private cbPointChange: (plotAni: DataMapPlot) => void;
    /**绘制时添加了新点位时的回调*/
    private cbPointAdd: (plotAni: DataMapPlot) => void;
    /**绘制时移动已有点位时的回调*/
    private cbPointMove: (plotAni: DataMapPlot) => void;
    /**添加新增点位时的监听函数 */
    public addCbPointChange(cb: (plotAni: DataMapPlot) => void): this;
    /**添加新增点位时的监听函数 */
    public addCbPointAdd(cb: (plotAni: DataMapPlot) => void): this;
    /**添加新增点位时的监听函数 */
    public addCbPointMove(cb: (plotAni: DataMapPlot) => void): this;
  }
  /** 测绘类 */
  export class MapPluginRange extends MapCanvasLayer {
    /** 测绘类，传入Amap或者调用addTo */
    constructor(sluMap: SLUMap, options?: OptMapPluginRange);
    /**默认配置 */
    public options: OptMapPluginRange;
    /** 地图事件控制管理对象 */
    private ctrEvent: MapCanvasEvent;
    /** 地图基础绘制类 */
    private ctrMapDraw: MapCanvasDraw;
    /** 动画绘制类 */
    private ctrMapAniDraw: MapPluginDraw;
    /** 所有的已确定的经纬度 (绘制确定的点线)*/
    private lnglats: LatLng[][];
    /** 鼠标当前所在的经纬度(绘制虚线) */
    private lnglat?: LatLng;
    /** 是否正在拖动地图 */
    private ifDrag: boolean;
    /** 单击事件 */
    private eventClickTimer: number | undefined;
    public setOptions(opt: OptMapPluginRange): this;
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
    private eventDrag(e: LeafletMouseEvent): void;
    private eventDragend(e: LeafletMouseEvent): void;
    /** 单击事件 */
    private eventClick(e: LeafletMouseEvent | AMapMapsEvent): void;
    /** 鼠标移动事件 */
    private eventMousemove(e: LeafletMouseEvent | AMapMapsEvent): void;
    /** 双击关闭事件 */
    private eventDblclick(): void;
  }
  /**轨迹类 */
  export class MapPluginTrack {
    /**轨迹绘制类 */
    constructor(sluMap: SLUMap, options?: Partial<OptMapPluginTrack>);
    private map: LMap | AMap;
    /**默认配置 */
    private options: OptMapPluginTrack;
    /**当前的轨迹数据 */
    private allTracks: DataMapTrackGroup[];
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
    public setTracks(tracks: DataMapTrackGroup[]): void;
    /**获取指定时间各轨迹点的位置信息集合 */
    public getInfosByTime<T = any>(time: Date): ({ orginData: T } & MapTrackTimePosition)[];
    /**获取下一时间段的数据 */
    private getNextTrack(): void;
    /**设置轨迹上的动点船 */
    public setAniImage(imgs: MapImage[], texts?: MapText[]): void;
    /**添加点击圆点时的监听函数 */
    public addCbClickPoint(cb: (plotAni: MapEventResponse<any>) => void): this;
    /**设置轨迹的显示和隐藏 */
    public setOpt(opt: Partial<OptMapPluginTrack>): void;
    /**绘制轨迹数据 */
    private _drawTracks(): void;
    /**单条轨迹绘制 （并给点添加事件）*/
    private drawHistoryTrack(track: DataMapTrackGroup): void;
    /**绘制轨迹线 */
    private drawLine(track: DataMapTrackGroup): void;
    /**绘制轨迹点 */
    private drawArc(track: DataMapTrackGroup): void;
    /**实现移除数组第一个和最后一个元素得到新的数组 */
    private removeFirstLast(arr: any[]): any[];
    /**绘制轨迹起点终点 */
    private drawStartEnd(track: DataMapTrackGroup): void;
    /**添加轨迹点事件*/
    private addPointEvent(track: DataMapTrackGroup, eves: MapEvent[]): void;
    /**获得指定时间的位置信息 */
    private getInfoByTime(epoch: number, infos: DataMapTrack[]): MapTrackTimePosition;
    /**计算位置信息 */
    private computeDate(sData: DataMapTrack, eData: DataMapTrack, time: number): MapTrackTimePosition;
    /**移除所有的监听函数 */
    private clearCb(): void;
    private cbs;
    /** */
    public on(key: string, cb: Function): void;
    /** */
    public trigger(key: string): void;
  }
  export class MapPluginGridBase extends MapCanvasLayer {
    constructor(map: LMap | AMap, options: Partial<OptMapGrid>);
    public readonly options: OptMapGrid
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
    public _setDatas(datas: DataMapGrid[]): void;
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
    private builder(grids: DataMapGrid[]): number[][][];
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
  export class MapPluginGrid extends MapPluginGridBase {
    constructor(sluMap: SLUMap, options: Partial<OptMapGrid>);
    /**可视区内的网格数据XY */
    protected boundsDatas: [number, number, number][][];
    public setOptions(options: Partial<OptMapGrid>): void;
    /**设置渲染数据 */
    public setData(datas: DataMapGrid[]): void;
    public getInfoByLngLat(lng: number, lat: number): [number, number, number] | null;
    /**渲染开始 */
    private renderStart(): void;
    protected renderFixedData(): void;
  }
  /**风场类 */
  export class MapPluginWind extends MapPluginGridBase {
    constructor(sluMap: SLUMap, options: Partial<OptMapPluginWind>);
    /**根据风速返回图标配置 */
    private iconResolver?: (speed: number) => CanvasImage;
    private draw: MapCanvasDraw;
    /**配置 */
    public options: OptMapPluginWind;
    /**设置图标解析器 */
    public setIconResolver(resolver: (speed: number) => CanvasImage): void;
    /**设置风速风向数据 */
    public setData(data: DataMapGrid[]): void;
    /**获取视图范围内的(指定像素间隔的数据) */
    protected getViewBoundsGridWind(bounds: GridBounds, pixelInterval?: number): DataMapWind[];
    /**根据风力等级获取图片裁剪地址 x,y */
    protected renderAnimation(): void;
    protected renderFixedData(): void;
  }
  /**运动粒子类 */
  export class VelocityWindy {
    constructor(options: Partial<OptMapPluginVelocity>);
    private options: OptMapPluginVelocity;
    private map: LMap | AMap;
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
    private gridData: DataMapVeloctiyWind[];
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
    public setData(data: DataMapVeloctiyWind[]): void;
    /**停止运行 */
    public stop(): void;
    /**开始运行
     * @param width 画布宽度
     * @param height 画布高度
     * @param extent 可视的经纬度范围
     */
    public start(width: number, height: number, extent: [[number, number], [number, number]]): void;
    /**构建网格数据 */
    private buildGrid(data: DataMapVeloctiyWind[]): void;
    /**创建构造器 */
    private createBuilder(data: DataMapVeloctiyWind[]): { header: VelocityHeader; data: (i: number) => [number, number] };
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
    constructor(sluMap: SLUMap, options?: Partial<OptMapPluginFlow>);
    /**配置项 */
    public options: OptMapPluginFlow;
    private windy: VelocityWindy | null;
    private cbClick?: (degrees: number, speed: number) => void;
    /**设置配置项 */
    public setOptions(opt: OptMapPluginFlow): void;
    /**设置数据并绘制canvas
     * data[0] 为X轴经度longitude方向的数据
     * data[1] 为Y轴纬度latitude方向的数据
     */
    public setData(datas: DataMapVeloctiyWind[]): void;
    /**添加鼠标点击时的回调函数 */
    public addCbMouseClick(cb: (degrees: number, speed: number) => void): void;
    /*------------------------------------ PRIVATE ------------------------------------------*/
    protected renderFixedData(): void;
    /**添加或关闭地图特定的监听事件(_eventSwitch事件后自动调用) */
    protected addMapEvents(map: LMap, key: "on" | "off"): void;
    /**初始化windy对象 */
    private initWindy(): void;
    /**开始动画 */
    private startWindy(): void;
    /**停止动画 */
    private stopWindy(): void;
    /**鼠标点击事件监听 */
    private onMouseClick(e: LeafletMouseEvent | AMapMapsEvent): void;
    private vectorToDegrees(uMs: number, vMs: number, angleConvention: string): number;
    /**将m/s 转换为指定单位的速度 */
    private vectorToSpeed(uMs: number, vMs: number, unit: string): number;
    private meterSec2Knots(meters: number): number;
    private meterSec2kilometerHour(meters: number): number;
  }
  /**热力图图层  传入经纬度坐标[],也可传入系数 [纬度,经度,系数?] */
  export class MapPluginHeat extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: OptMapPluginHeat);
    /**热力数据集合 */
    private _allHeats: DataMapHeat[];
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
    public options: OptMapPluginHeat;
    protected renderAnimation(): void;
    /**重置[纬度，经度]集合*/
    public setAllHeats(heats: DataMapHeat[]): () => {};
    /**添加[纬度，经度],并重绘*/
    public addHeat(heat: DataMapHeat): () => {};
    public delHeat(heat: DataMapHeat): () => {};
    /**更新配置 */
    setOptions(options?: OptMapPluginHeat): () => {};
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
    constructor(sluMap: SLUMap, options?: OptMapPluginArrowLine);
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
    protected addMapEvents(map: AMap | LMap, key: "on" | "off"): void;
    private drawStart(): void;
    private drawEnd(): void;
  }
  /**
 * 大数据绘制 优化处理
 * 划分网格 同网格内设置最大图标数量
 * 超出不绘制 减少画布渲染次数
 */
  export class MapPluginBigData extends MapPluginDraw {
    constructor(sluMap: SLUMap, options: Partial<OptMapCanvas> & BigDataOption);
    /**R树搜索 绘制 */
    private rbush;
    private rbushData: MapRbush[];
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
    private transformRbush(img: MapImage): MapRbush<MapImage>;
    /**绘制所有需要绘制的类 */
    public drawMapAll(): this;
  }
  /**leaflet的粒子效果 */
  export class MapPluginPartial extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: OptMapCanvas);
    /**
     * 图层是否在移动 高德默认每次渲染更新像素坐标
     * leaflet 图层移动不更新像素坐标 高德 图层移动更新像素坐标
     * 高德地图移动画布和地图同步偏移，leaflet画布固定 地图偏移 的区别
     * 所以防止leaflet移动过程二次偏移 以及高德移动过程坐标未更新导致画布和容器相对位置发生偏移
     * */
    private isDrag: boolean;
    /**所有的粒子效果数据 */
    private _allParticle: DataMapParticle[];
    /**设置所有粒子数据 */
    public setAllParticles(particles: DataMapParticle[]): void;
    protected renderAnimation(time?: number): void;
    private _animat(): void;
    /**绘制粒子效果 */
    private _drawParticles(): void;
    /**获取当前贝塞尔曲线的粒子点位 */
    private genCurBezierPoints(particle: DataMapParticle): void;
    /**绘制粒子 */
    private drawParticle(particle: DataMapParticle): void;
    /**拖拽不允许更新动画 */
    protected addMapEvents(map: LMap | AMap, key: "on" | "off"): void;
    private drawStart(): void;
    private drawEnd(): void;
  }
  /*绘制雷达扫描图 */
  export class MapPluginRadar extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: CustomLayerOption | OptMapCanvas);
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
    public setAllRadars(radars: OptMapPluginRadar[]): this;
    /**添加雷达绘制类 */
    public addRadar(radar: OptMapPluginRadar): this;
    protected override renderFixedData(): void;
    protected override renderAnimation(time?: number): void;
    /**拖拽不允许更新动画 */
    protected addMapEvents(map: LMap, key: 'on' | 'off'): void;
    private drawStart(): void;
    private drawEnd(): void;
  }
  /**地图控件-比例尺/当前层级/鼠标所在位置 */
  export class MapPluginControl extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: OptMapPluginControl);
    public options: OptMapPluginControl;
    private cb?: (info: Partial<OptLatlngScale>) => void;
    private info: Partial<OptLatlngScale>;
    private mapType: MapType;
    private latLng: OptLatLng;
    public init(): Partial<OptLatlngScale>;
    public setOptions(opt: Partial<OptMapPluginControl>): Partial<OptLatlngScale>;
    /**位置等更新时触发 */
    public onUpdate(cb: (info: OptLatlngScale) => void): this;
    private eventSwitch(flag: boolean): void;
    /**设置经纬度信息 */
    private setLatlng(e: LeafletMouseEvent | AMapMapsEvent): void;
    private getLatlng(value: number, ifLng: boolean): string;
    private setZoomAndScale(): void;
    private getZoom(): number;
    private getLatLngFromEvent(e: LeafletMouseEvent | AMapMapsEvent): [number, number] | null;
  }

}