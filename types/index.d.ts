import { SLUCanvasGif } from "src/canvas";
import { SLUWorker } from "src/utils/slu-worker";
import type { Map as AMap, CustomLayerOption, CustomLayer, LngLat } from './amap'
import type { Map as LMap, LeafletMouseEvent, Layer, LatLng, LayerOptions, ZoomAnimEvent } from 'leaflet'
import type { Map as MaplibreMap, MapMouseEvent as MaplibreMouseEvent, LngLat as MaplibreLngLat, CustomLayerInterface, StyleSpecification } from 'maplibre-gl';
import { MAP_EVENT } from "src/const";
import rbush, { BBox } from "rbush";
import { MapNameType, SLULeafletNetMap } from "src/leaflet";
import RBush from "rbush";

declare module '@sl-utils/map' {

  /**! ------------------Canvas相关----------------------- */
  /**canvas全局合成操作类型 */
  type GlobalCompositeOperationSelf = 'color' | 'color-burn' | 'color-dodge' | 'copy' | 'darken' | 'destination-atop' | 'destination-in' | 'destination-out' | 'destination-over' | 'difference' | 'exclusion' | 'hard-light' | 'hue' | 'lighten' | 'lighter' | 'luminosity' | 'multiply' | 'overlay' | 'saturation' | 'screen' | 'soft-light' | 'source-atop' | 'source-in' | 'source-out' | 'source-over' | 'xor';
  /**canvas相关的配置项 */
  export interface OptCanvas {
    /**透明度 @default 1 */
    alpha?: number;
    /**填充的颜色透明度 @default 1 */
    fillAlpha?: number;
    /**填充的颜色 (字体的颜色) @default '#EE3434' */
    colorFill?: string | CanvasGradient | CanvasPattern;
    /**线条的颜色 @default '#FFFFFF' */
    colorLine?: string | CanvasGradient | CanvasPattern;
    /**模糊阴影颜色 @default '#000000' */
    shadowColor?: string;
    /**模糊范围大小 @default 0 */
    shadowBlur?: number;
    /**线宽(文本阴影) @default 1 */
    widthLine?: number;
    /**虚线 线长,间隔长 @default [10, 0] */
    dash?: [number, number];
    /**虚线偏移 @default 0 */
    dashOff?: number;
    /**文本字体 设置字体大小和字体种类 @default '14px serif' */
    font?: string;
    /**文本对齐方式的属性 指定文本的(中心|左侧|右侧)渲染在指定位置 */
    textAlign?: CanvasTextAlign;
    /**文字垂直方向的对齐方式  alphabetic 未使用 @default 'top' */
    textBaseline?: CanvasTextBaseline;
    /**全局合成操作 @default 'source-over' */
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
    /**图片唯一id */
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
    /**gif大小 */
    size: [number, number];
    /**id必传且唯一，用于后续关闭之前绘制的动画 */
    id: string;
    /**gif播放延迟时间 */
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
  /**文字重叠处理的配置 */
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
    /**文本背景矩形框的x坐标 */
    x: number;
    /**文本背景矩形框的y坐标 */
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
    /**数据信息 */
    info?: I;
  }

  /**! ------------------地图相关----------------------- */
  /**配置 -- 地图配置项 */
  export interface OptMap {
    /**地图的类型 @param L leaflet插件 @param A 高德地图 @param B 百度地图 @param M maplibre地图 @default L*/
    type: 'L' | 'A' | 'B' | 'M',
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
    /**maplibre地图样式 url/json自定义样式 */
    style: string | StyleSpecification,
  }
  /**高德地图图层配置项 */
  interface OptAMapLayer extends CustomLayerOption {
    /**添加增加动画画布 =>*/
    aniCanvas?: boolean;
  }
  /**地图边界信息 */
  interface MapBounds {
    /**最小经度 */
    lngLeft: number;
    /**最大纬度 */
    latTop: number;
    /**最大经度 */
    lngRight: number;
    /**最小纬度 */
    latBottom: number;
  }
  /**地图事件类型 */
  type MapEventType = keyof typeof MAP_EVENT;
  /**抛出给地图扩展的图片类 由于地图size可能采用固定m为单位，故采用不限定size的_BaseImage*/
  type ωCanvasMapImage<I = any> = CanvasImage<I>;
  /**抛出给地图扩展的Gif类 由于地图size可能采用固定m为单位，故采用不限定size的_BaseGif*/
  type ωCanvasMapGif<I = any> = CanvasGif<I>;
  /**地图上的纬度经度 [lat,lng] */
  interface MapPoint {
    /**单经纬度 */
    latlng: [number, number],
    /**经纬度集合 */
    latlngs?: [number, number][],
  }
  /**地图上的纬度经度 [lat,lng][] */
  interface MapPoints {
    /**经纬度集合 */
    latlngs: [number, number][],
    /**单经纬度 */
    latlng?: [number, number],
  }
  /**地图上的大小 */
  interface Size_ {
    /**图片大小 */
    size: [number, number] | number
    /**固定的图片大小 */
    sizeFix?: [number, number] | number
  }
  /**地图上的大小（米） */
  interface SizeFix_ {
    /**图片大小 */
    size?: [number, number] | number
    /**固定的图片大小 */
    sizeFix: [number, number] | number
  }
  /**rbush 查询类*/
  export interface MapRbush<T = any> {
    /**最小X坐标 */
    minX: number,
    /**最小Y坐标 */
    minY: number,
    /**最大X坐标 */
    maxX: number,
    /**最大Y坐标 */
    maxY: number,
    /**经纬度 */
    latlng: [number, number],
    /**数据 */
    data: T,
  }
  /**高德地图地图插件原生事件触发后发出的对象 */
  interface AMapMapsEvent {
    /**事件位置信息 */
    lnglat: { Q: number, R: number, lng: number, lat: number }
    /**原始DOM事件 */
    originEvent: MouseEvent,
    /**事件容器位置 */
    pixel: { x: number, y: number }
    /**事件类型 */
    type: MapEventType
  }
  /** 地图上的事件 */
  export type MapEvent<T extends MapEvent = any, I = any> = CanvasEvent<T, I> & MapPosition & MapShow;
  /**地图鼠标事件 */
  export interface MapMouseEvent {
    /**事件类型 */
    type: MapEventType;
    /**事件位置信息 */
    latlng: { lat: number, lng: number };
    /**事件容器位置 */
    containerPoint: {
      x: number;
      y: number;
    };
    /**原始DOM事件 */
    orginDOMEvent: MouseEvent;
    /**原始地图事件 */
    orginMapEvent: LeafletMouseEvent | AMapMapsEvent | MaplibreMouseEvent;
  }
  /**地图事件触发时的响应对象 T为挂载此次事件的对象(MapImage|MapArc|Event),I为对象携带的相关数据*/
  export type MapEventResponse<T extends MapEvent = MapEvent, I = any> = CanvasEventResponse<T, I> & {
    /**事件位置信息 */
    position: MapCursorPosition;
  }
  /**地图事件触发时的范围 */
  export interface MapEventRange {
    /**当前事件 */
    curEvents: MapEventResponse[];
    /**进入事件 */
    enterEvents: MapEventResponse[];
    /**离开事件 */
    leaveEvents: MapEventResponse[];
  }
  /**地图事件触发时鼠标位置发出的信息 */
  interface MapCursorPosition extends CanvasCursorPosition {
    /**地图事件所定义的纬经度 [lat,lng] */
    latlng: [number, number];
  }
  /**地图控件信息 */
  interface MapControlInfo {
    /**纬度 */
    lat?: string;
    /**经度 */
    lng?: string;
    /**层级 */
    zoom?: number;
    /**比例尺 */
    scale?: string;
    /**比例尺对应像素宽度 */
    width?: string;
  }
  /**地图上的纬度经度 {lat,lng} */
  interface MapLatLng {
    /**纬度 */
    lat: number;
    /**经度 */
    lng: number;
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
  /**地图上带事件的图片渲染*/
  export type MapImageRender = MapImageEvent & CanvasImage;
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
    /**画布挂载的div节点 
     * @default 'canvas'
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
    /**动画唯一标识 保留动画状态 @default '0'*/
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
    /**网格密度 半径划分n格 @default 8*/
    gridDensity?: number;
    /**虚线圈密度 划分n圈 @default 3*/
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
    /**卫星数量 */
    SAT: string
    /**间隔时间（分钟） */
    GAP_MINUTES: string
    /**角度 */
    HEADING: string
    /**该时间点已被应用 */
    ifUse?: boolean
  }
  /**轨迹时的船信息 */
  interface MapTrackShipInfo {
    /**船ID */
    SHIP_ID: string
    /**MMSI */
    MMSI: string
    /**船名 */
    SHIPNAME: string
    /**类型颜色 */
    TYPE_COLOR: string
    /**长度 */
    LENGTH: string
    /**宽度 */
    WIDTH: string
    /**左舷宽度 */
    W_LEFT: string
    /**船头长度 */
    L_FORE: string
    /**隐藏的卫星数量 */
    HIDDEN_SAT: string
    /**轨迹点位信息 */
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
    /**船ID */
    SHIP_ID: string
    /**MMSI */
    MMSI: string
    /**船名 */
    SHIPNAME: string
    /**类型颜色 */
    TYPE_COLOR: string
    /**长度 */
    LENGTH: string
    /**宽度 */
    WIDTH: string
    /**左舷宽度 */
    W_LEFT: string
    /**船头长度 */
    L_FORE: string
    /**隐藏的卫星数量 */
    HIDDEN_SAT: string
  }
  /**轨迹中所有点位的信息 */
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
  type MapPlotDetailType =
    | ({ type: 'point'; latLngs: [[number, number]] | []; } & CanvasImage)
    | { type: 'circle'; latLngs: [[number, number], [number, number]] | [[number, number]] | []; rail?: number; }
    | { type: 'rect'; latLngs: [[number, number], [number, number]] | []; }
    | { type: 'line' | 'polygon'; latLngs: [number, number][]; };
  /**数据--地图标绘数据 */
  type DataMapPlot = OptCanvas & {
    /**名称 */
    name?: string;
    /**是否隐藏 */
    ifHide?: boolean;
    /**是否是编辑状态 */
    ifEdit?: boolean;
  } & MapPlotDetailType;

  /**配置--插件标绘类的配置项 */
  export interface OptMapPluginPlotBase extends OptMapCanvas, OptCanvas { }
  /**配置--插件标绘类编辑点的配置项 */
  export type OptMapPluginPlotEdit = Partial<MapArc>;
  /**配置--插件标绘类文字的配置项 */
  export type OptMapPluginPlotText = Partial<MapText>;
  export interface OptMapPluginPlot {
    /**标绘形状配置 */
    plotOpt?: OptMapPluginPlotBase,
    /**标绘编辑点配置 */
    editOpt?: OptMapPluginPlotEdit,
    /**标绘文字配置 */
    textOpt?: OptMapPluginPlotText
  }
  /**配置--插件热力图类的配置项*/
  export interface OptMapPluginHeat extends OptMapCanvas, OptCanvas {
    /**半径 @default 20*/
    radius?: number,
    /**模糊级数(越大影响范围越大影响系数越小，最好不要超过半径的两倍) @default 10*/
    blur?: number,
    /**渐变色 @default {0.2: 'blue', 0.4: 'cyan', 0.6: 'lime', 0.8: 'yellow', 1.0: 'red'} */
    gradient?: any,
    /**最小阴影透明度 @default 0.1*/
    minOpacity?: number,
    /**渐变色指数 小于10，越大变色越难 @default 1*/
    gradientIndex?: number,
    /**是否显示等级标识tip @default true*/
    ifTip?: boolean,
    /**tip偏移量 @default 80*/
    tipX?: number,
    /**tip偏移量 @default 20*/
    tipY?: number,
  }
  /**配置--插件测距类的配置项 */
  export interface OptMapPluginRange extends OptCanvas, OptMapCanvas {
    /**线的颜色(点的边线色) @default '#364A7D'*/
    colorLine?: string;
    /**点的填充色 @default '#FFF'*/
    colorArc?: string;
    /**起点的填充色 @default '#415880'*/
    colorArcStart?: string;
    /**字体的颜色 @default '#333333'*/
    colorFont?: string;
    /**语言模式 cn中文 en英文*/
    lang?: 'cn' | 'en';
  }
  /**配置--插件地图轨迹配置 */
  export interface OptMapPluginTrack extends OptMapCanvas {
    /**是否显示圆点 @default true*/
    ifArc?: boolean;
    /**圆点的间隔（大于1000时采用时间模式） @default 1*/
    arcInterval?: number;
    /**最小图标 */
    minIcon?: string;
    /**圆点大小 @default 3*/
    sizeArc?: number;
    /**圆点颜色 ( rgb(),rgba(),#fff ) @default '#FFFFFF'*/
    colorArc?: string;
    /**圆点填充色 @default '#D9AF3B'*/
    colorArcFill?: string;
    /**透明度 */
    alpha?: number;
    /**线条宽度 @default 1*/
    widthLine?: number;
    /**线条颜色 @default '#525b65'*/
    colorLine?: string;
    /**起点文字 @default '起点'*/
    textStart?: string;
    /**终点文字 @default '终点'*/
    textEnd?: string;
    /**起点文字颜色 @default '#8D4CC3'*/
    colorTextStart?: string;
    /**终点文字颜色 @default '#D85151'*/
    colorTextEnd?: string;
    /**起点圆点颜色 @default '#8D4CC3'*/
    colorArcStart?: string;
    /**终点圆点颜色 @default '#D85151'*/
    colorArcEnd?: string;
  }
  /**配置--插件风速风向配置 */
  export interface OptMapPluginWind extends OptMapCanvas {
    /**风速风向雪碧图地址 @default '/assets/icons/icon-28.png'*/
    url?: string;
    /**风速风向雪碧图宽高 @default [28, 28]*/
    size?: [number, number];
    /**风速风向雪碧图原始大小 @default [28, 28]*/
    sizeo?: [number, number];
    /**不同层级下的大小 @default [
            [6, 6], [6, 6], [6, 6], [6, 6], [8, 8], [8, 8],//0-5
            [12, 12], [16, 16], [22, 22], [28, 28], [28, 28], [28, 28],//6-11
            [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32],
    ]*/
    zooMsize?: [number, number][];
  }
  /**配置--插件风速风向配置 */
  export interface OptMapPluginArrowLine extends OptMapCanvas, DataMapArrowLine {
    /**填充颜色 @default 'rgb(41, 152, 137)'*/
    fillColor?: string;
    /**边框颜色 @default 'rgb(179, 218, 255)'*/
    strokeColor?: string;
    /**(箭头)图片地址 @default '/assets/images/direction-arrow.png'*/
    imgUrl?: string
  }
  /**配置--Grid配置 */
  export interface OptMapGrid extends OptMapCanvas {
    /**马赛克颜色等级 @default ["#0000CD", "#0066ff", "#00B7ff", "#00E0FF", "#00FFFF", "#00FFCC", "#00FF99", "#00FF00", "#99FF00", "#CCFF00", "#FFFF00", "#FFCC00", "#FF9900", "#FF6600", "#FF0000", "#B03060", "#D02090", "#FF00FF"]*/
    mosaicColor?: string[];
    /**马赛克颜色值 @default [0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]*/
    mosaicValue?: number[];
    /**渐变色设置 */
    gradient?: { [key: number]: string };
    /**渐变色最高值 */
    gradientMax?: number;
    /**渐变半径 */
    gradientRadius?: number;
  }
  /**-----------------------------固定图片热力图类--------------------start--- */
  export interface OptMapPluginFixedHeat extends OptMapCanvas {
    /**固定渲染级别（只在这级生成图片）@default 13 */
    refZoom?: number;
    /**最小显示级别 @default 13 */
    minZoom?: number;
    /**最大显示级别 @default 16 */
    maxZoom?: number;
    /**热力半径 @default 30 */
    radius?: number;
    /**模糊半径 @default 5 */
    blur?: number;
    /**透明度 @default 1 */
    opacity?: number;
    /**颜色梯度  @default {0.0: '#00008b', 0.4: '#0088ff', 0.5: '#00ffff', 0.6: '#ffff00', 0.8: '#ff8800', 1.0: '#ff0000'} */
    gradient?: Record<number, string>;
  }
  /**-----------------------------固定图片热力图类--------------------end--- */

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
    lineWidth?: number;
    /**粒子速度 */
    speed?: number;
    /**粒子宽度 */
    partialWidth?: number;
    /**粒子高度 */
    partialHeight?: number;
    /**间隙 */
    partialSpace?: number;
    /**贝塞尔曲线 */
    isBezier?: boolean;
    /**曲率 */
    degree?: number;
  }


  /**-----------------------------grid数据格式-------------------------start--- */
  /**数据--grid数据格式 */
  export interface DataMapGrid {
    /**行数 */
    nx?: number,
    /**列数 */
    ny?: number,
    /**经度差值 */
    dx?: number,
    /**纬度差值 */
    dy?: number,
    /**起始点经度(左上角) */
    sx?: number,
    /**起始点纬度 */
    sy?: number,
    /**空数据无数据的标识 */
    nodata?: number | undefined,
    /**数据缩放比例(scale:0.01,data中数据1,真实数据0.01,减少数据包大小) */
    scale?: number,
    /**每个数据由几个元素组成( 温度 1  , 降雨 1 ， 风速风向(u,v)  2) */
    num?: number,
    /**数据头 */
    header: DataMapGridHeader,
    /**数据 */
    data: number[],
  }
  /**数据--grid数据头 */
  interface DataMapGridHeader {
    /**行数 */
    nx: number,
    /**列数 */
    ny: number,
    /**数据纬度起点 */
    la1: number,
    /**数据经度起点 */
    lo1: number,
    /**经度差值 */
    dx: number,
    /**纬度差值 */
    dy: number,
    /**数据纬度结束点 */
    la2: number,
    /**数据经度结束点 */
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
  /**worker信息 */
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
  interface GridRenderWorkerInfo {
    /**worker id */
    id?: number;
    /**可视区宽度 */
    width: number;
    /**可视区高度 */
    height: number;
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
    /**经纬度采样步长 */
    geoStep?: number;
    /**经纬度采样网格 列 */
    geoCols?: number;
    /**经纬度采样网格 行 */
    geoRows?: number;
    /**经纬度缓存 [lng, lat, lng, lat...] */
    lngLatBuffer?: Float32Array<ArrayBuffer>;
    /**栅格有效性mask 0:无效值; 1:有效值 */
    mask?: Uint8Array<ArrayBufferLike>;
    /**经度方向格点数 */
    nx?: number;
    /**纬度方向格点数 */
    ny?: number;
    /**像素采样率 */
    samplingRate?: number;
  }
  /**-----------------------------grid数据格式-------------------------end--- */



  /**配置--流体粒子动画类*/
  export interface OptMapPluginFlow extends OptMapCanvas {
    /**是否显示速度值 @default true*/
    displayValues: boolean;
    /**粒子大小控制 */
    velocityScale?: number;
    /**粒子生命值 */
    particleAge?: number;
    /**最大速度 @default 15*/
    maxVelocity: number;
    /**速度单位(m/s  米/秒 ； k/h 千米/小时 ；  kt 节 ) @default 'm/s'*/
    unit: 'm/s' | 'k/h' | 'kt';
    /**'bearing' (气流流向的角度) or 'meteo' (angle from which the flow comes) 
     * 'CW'(角度值顺时针增加)或'CCW'(角度值逆时针增加)
     * @default 'bearingCCW'
     */
    angleConvention: "bearingCCW" | "bearingCW" | "meteoCCW" | "meteoCW";
    /**空数据无数据的标识 @default 'No velocity data'*/
    emptyString: string;
    /**颜色等级 @default null*/
    colorScale?: any;
    /**数据 */
    data?: DataMapVeloctiyWind[];
  }
  /**配置项--运动粒子类对象 */
  interface OptMapPluginVelocity {
    /**最小速度 @default 0*/
    minVelocity: number;
    /**最大速度(决定了粒子的颜色) @default 1*/
    maxVelocity: number;
    /**粒子刻度(大小) @default 1*/
    velocityScale: number;
    /**粒子生命值 @default 90*/
    particleAge: number;
    /**粒子线宽 @default 1*/
    lineWidth: number;
    /**绘制粒子数量的比例（宽像素*高像素*此比例） @default 1/300*/
    particleMultiplier: number;
    /**每秒播放帧数 @default 30*/
    frameRate: number;
    /**默认颜色等级 @default ["rgb(36,104, 180)", "rgb(60,157, 194)", "rgb(128,205,193 )", "rgb(151,218,168 )", "rgb(198,231,181)", "rgb(238,247,217)", "rgb(255,238,159)", "rgb(252,217,125)", "rgb(255,182,100)", "rgb(252,150,75)", "rgb(250,112,52)", "rgb(245,64,32)", "rgb(237,45,28)", "rgb(220,24,32)", "rgb(180,0,35)"]*/
    defualtColorScale: string[];
    /**数据 @default []*/
    data: any[];
    /**画布元素 */
    canvas?: HTMLCanvasElement;
  }
  /**风场数据 */
  export interface DataMapVeloctiyWind {
    /**数据头 */
    header: VelocityHeader;
    /**单个方向的值  该值是风速和角度运算后的结果 */
    data: number[];
  }
  /**数据--风场数据头 */
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
    /**预报时间 */
    forecastTime: number;
  }
  /**风场数据可视区像素边界 */
  interface WindBounds {
    /**X轴起点 0 */
    x: number;
    /**Y轴起点 0*/
    y: number;
    /**X轴最大值 */
    xMax: number;
    /**Y轴最大值 */
    yMax: number;
    /**宽度 */
    width: number;
    /**高度 */
    height: number;
  }
  /**风场数据可视区地图边界 */
  interface WindMapBounds {
    /**南纬度 */
    south: number;
    /**北纬度 */
    north: number;
    /**东经度 */
    east: number;
    /**西经度 */
    west: number;
    /**宽度 */
    width: number;
    /**高度 */
    height: number;
  }

  /**风粒子 */
  interface WindParticle {
    /**生命周期 */
    age: number;
    /**X轴位置 */
    x: number;
    /**Y轴位置 */
    y: number;
    /**X轴目标位置 */
    xt?: number;
    /**Y轴目标位置 */
    yt?: number;
  }
  /**风场数据向量 */
  type WindVector = [number, number, number | null];
  /**-----------------------------运动粒子类-------------------------end--- */


  /**-----------------------------大数据渲染类-------------------------start--- */
  /**配置项--大数据渲染类对象 */
  interface OptBigData extends OptMapCanvas {
    /**缩放级别 */
    zoomOption: {
      [key: number]: {
        /**最大重叠数量 -1 表示不限制重叠数量 
         * maxCount为-1 退化成初始全部渲染 并且性能比全部渲染还差 还要维护rbush结构
        */
        maxCount: number;
        /**划分检索最小区域 不传则表示整个画布区域 划分越小越影响性能*/
        minBound?: [number, number];
      };
    };
  }
  /**-----------------------------大数据渲染类-------------------------end--- */

  /**[west, south, east, north] */
  type BBox = [number, number, number, number];
  /**海岸线数据源 */
  interface DataCoastline {
    /**最小适用层级 */
    minZoom: number;
    /** 最大适用层级 */
    maxZoom: number;
    /**GeoJSON海岸线数据 */
    data: GeoJSON.FeatureCollection;
  }






































  /**leaflet 需要开发者在样式表中挂载leaflet样式 */
  /**地图
   * @constructor
   * @param ele 地图容器元素
   * @param options 地图初始化参数
   */
  export class SLUMap {
    constructor(ele: string);
    /**地图容器元素 */
    private ele: string;
    /**地图实例 */
    private _map: AMap | LMap | MaplibreMap;
    /**地图实例 */
    public get map(): AMap | LMap | MaplibreMap;
    /**地图控件更新时的回调 */
    private controlCb?: (info: MapControlInfo) => void;
    /**地图控件信息 */
    private controlInfo: MapControlInfo;
    /**当前鼠标所在经纬度 */
    private latLng: MapLatLng;
    /**鼠标所在经纬度是否使用度分秒格式 */
    private ifDMS: boolean;
    /**当前正在显示的网络图层 */
    private curs: Partial<{ [key in MapNameType]: SLULeafletNetMap | undefined }>;
    /**初始实例化地图
     * @param options @default {} 地图初始化参数
     */
    public init(options?: Partial<OptMap>): Promise<void>;
    /**设置合适的视图范围
     * @param latlngs 纬度经度数组
     * @returns SLUMap实例
     */
    public setFitView(latlngs: [number, number][]): SLUMap;
    /**
     * 设置地图中心
     * @param center 中心 latlng顺序
     * @param zoom 缩放级别
     * @param offset 中心 但需要偏移固定像素
     */
    public setCenter(center: [number, number], zoom: number, offset?: [number, number]): void;
    /**获取地图边界
     * @returns 地图边界信息
     */
    public getBound(): MapBounds;
    /**获取地图中心
     * @returns 地图中心
     */
    public getCenter(): LatLng | LngLat | MaplibreLngLat;
    /**获取地图缩放级别
     * @returns 地图缩放级别
     */
    public getZoom(): number;
    /**获取地图大小
     * @returns 地图大小{ w: number; h: number }
     */
    public getSize(): { w: number; h: number };
    /**显示指定的网络图层
     * @param names @default [] 网络图层名称数组
     * @returns SLUMap实例
     */
    public showMap(names?: Array<MapNameType>): SLUMap;
    /**打开地图控件
     * @param ifDMS @default true 是否使用度分秒格式，否则显示度格式，默认精度为5
     * @returns 地图控件信息
     */
    public openControl(ifDMS?: boolean): MapControlInfo;
    /**关闭地图控件 */
    public closeControl(): void;
    /**地图控件更新时触发
     * @param cb 回调函数
     */
    public onControlUpdate(cb: (info: MapControlInfo) => void): void;
    /**切换控件经纬度格式
     * @param ifDMS 是否使用度分秒格式，否则显示度格式，默认精度为5
     * @returns 地图控件信息
     */
    public changeLatlngFormat(ifDMS: boolean): MapControlInfo;
    /**---------------leaflet地图的相关方法------------------- */
    /**初始化leaflet地图
     * @param ele 地图容器元素
     * @param opt 地图初始化参数
     * @returns LMap实例
     */
    private initLeaflet(ele: string, opt: Partial<OptMap>): Promise<LMap>;
    /**---------------maplibre地图的相关方法------------------- */
    /**初始化maplibre地图
     * @param ele 地图容器元素
     * @param opt 地图初始化参数
     * @returns maplibregl.Map实例
     */
    private initMaplibre(ele: string, opt: Partial<OptMap>): Promise<MaplibreMap>;
    /**切换中英文 仅对maplibre地图生效
     * @param ifEn 是否切换英文
     */
    public changeLanguage(ifEn: boolean): void;
    /**---------------高德地图的相关方法------------------- */
    /**初始化高德地图
     * @param ele 地图容器元素
     * @param opt 地图初始化参数
     * @returns AMap实例
     */
    private initAmap(ele: string, opt: Partial<OptMap>): Promise<AMap>;
    /**--------------地图控件的相关方法------------------- */
    /**监听事件开关
     * @param flag 开启或关闭事件
     */
    private eventSwitch(flag: boolean): void;
    /**设置经纬度信息
     * @param e 鼠标事件
     */
    private setLatlng(e: LeafletMouseEvent | AMapMapsEvent | MaplibreMouseEvent): void;
    /**设置地图层级和比例尺 */
    private setZoomAndScale(): void;
    /**设置地图比例尺 */
    private setScale(): void;
    /**取整比例尺
     * @param num 距离（米）
     * @returns 取整后的比例尺（米）
     */
    private getScaleNum(num: number): number;
  }
  /** 地图canvas基础图形绘制类
 * @constructor
 * @param map 地图实例
 * @param canvas 画布元素
 *  设置/新增/删除：点(arc) 线(line BezierLine) 多边形(rect) 图片(img) Gif(gif) 文本(text) 
 *  绘制：所有需要绘制的类(按drawIndex顺序)
 *  将对象上经纬度数据(latlngs,latlng)变换为像素XY的数据(points,point)
 *  设置图片/圆点的大小
 */
  export class MapCanvasDraw {
    constructor(map: AMap | LMap | MaplibreMap, canvas: HTMLCanvasElement);
    /**画布 */
    private canvas: HTMLCanvasElement;
    /**画布上下文 */
    protected ctx: CanvasRenderingContext2D;
    /**地图实例 */
    protected map: AMap | LMap | MaplibreMap;
    /**Gif实例 */
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
    /**当前地图缩放层级 */
    protected get zoom(): number;
    /**清空并重新设置画布 */
    public reSetCanvas(): void;
    /**绘制所有需要绘制的类(按drawIndex顺序) */
    public drawMapAll(): void;
    /**绘制通过index */
    protected drawByIndex(): void;
    /**设置圆点
     * @param arcs 圆点集合
     * @returns MapCanvasDraw实例
     */
    public setAllArcs(arcs: MapArc[]): MapCanvasDraw;
    /**设置线数据
     * @param lines 线集合
     * @returns MapCanvasDraw实例
     */
    public setAllLines(lines: MapLine[]): MapCanvasDraw;
    /**设置贝塞尔曲线数据
     * @param lines 贝塞尔曲线集合
     * @returns MapCanvasDraw实例
     */
    public setAllBezierLines(lines: MapLine[]): MapCanvasDraw;
    /**设置多边形数据
     * @param rects 多边形集合
     * @returns MapCanvasDraw实例
     */
    public setAllRects(rects: MapRect[]): MapCanvasDraw;
    /**设置文本数据
     * @param texts 文本集合
     * @returns MapCanvasDraw实例
     */
    public setAllTexts(texts: MapText[]): MapCanvasDraw;
    /**设置图片数据
     * @param imgs 图片集合
     * @returns MapCanvasDraw实例
     */
    public setAllImgs(imgs: MapImage[]): MapCanvasDraw;
    /**设置图片数据
     * @param gifs Gif集合
     * @returns MapCanvasDraw实例
     */
    public setAllGifs(gifs: MapGif[]): MapCanvasDraw;
    /**增加圆点
     * @param arc 圆点
     * @returns MapCanvasDraw实例
     */
    public addArc(arc: MapArc): MapCanvasDraw;
    /**增加线
     * @param line 线
     * @returns MapCanvasDraw实例
     */
    public addLine(line: MapLine): MapCanvasDraw;
    /**增加贝塞尔曲线
     * @param line 贝塞尔曲线
     * @returns MapCanvasDraw实例
     */
    public addBezierLine(line: MapLine): MapCanvasDraw;
    /**增加多边形
     * @param rect 多边形
     * @returns MapCanvasDraw实例
     */
    public addRect(rect: MapRect): MapCanvasDraw;
    /**增加文本
     * @param text 文本
     * @returns MapCanvasDraw实例
     */
    public addText(text: MapText): MapCanvasDraw;
    /**增加图片
     * @param img 图片
     * @returns MapCanvasDraw实例
     */
    public addImg(img: MapImage): MapCanvasDraw;
    /**删除指定圆点
     * @param arc 圆点
     * @returns MapCanvasDraw实例
     */
    public delArc(arc: MapArc): MapCanvasDraw;
    /**删除指定线
     * @param line 线
     * @returns MapCanvasDraw实例
     */
    public delLine(line: MapLine): MapCanvasDraw;
    /**删除指定贝塞尔曲线
     * @param line 贝塞尔曲线
     * @returns MapCanvasDraw实例
     */
    public delBezierLine(line: MapLine): MapCanvasDraw;
    /**删除指定多边形
     * @param rect 多边形
     * @returns MapCanvasDraw实例
     */
    public delRect(rect: MapRect): MapCanvasDraw;
    /**删除指定文本
     * @param text 文本
     * @returns MapCanvasDraw实例
     */
    public delText(text: MapText): MapCanvasDraw;
    /**删除指定Img
     * @param img 图片
     * @returns MapCanvasDraw实例
     */
    public delImg(img: MapImage): MapCanvasDraw;
    /**清空
     * @param type @default 'all' ,不填清空所有内容数据
     * @returns MapCanvasDraw实例
     */
    public delAll(type?: 'all' | 'text' | 'arc' | 'line' | 'bezier' | 'rect' | 'img' | 'gif'): MapCanvasDraw;
    /**将对象上经纬度数据(latlngs,latlng)变换为像素XY的数据(points,point)
     * latlngs为undefined,points也为undefined
     * latlng为undefined,point为[0,0]
     * @param info 对象
     */
    public transformXY(info: MapPosition & CanvasPosition): void;
    /**设置图片的大小
     * @param img 图片
     */
    public transformImageSize(img: MapImage): void;
    /**设置圆点的大小
     * @param arc 圆点
     */
    private transformArcSize(arc: MapArc): void;
  }
  /**地图事件控制类
   * @constructor
   * @param map 地图实例
   */
  export class MapCanvasEvent {
    constructor(map: AMap | LMap | MaplibreMap);
    /**R树搜索 事件 */
    private rbush: rbush<MapRbush<MapEvent>>;
    /**R树查找对象 */
    private readonly rbush_search: BBox;
    /**是否重新开始事件指针变化(使不同canvas的事件指针能正确显示)*/
    private static ifInitCursor: boolean;
    /**是否开启事件控制类初始化 */
    private static ifInit: boolean;
    /**地图销毁必须调用此方法，否则事件指针会异常 */
    public static destory(): void;
    /**地图实例 */
    protected map: AMap | LMap | MaplibreMap;
    /**监听事件 */
    protected _listenCbs: { [key in MapEventType]?: ((e: MapEventResponse<any>) => void)[] };
    /**key 防止setEvent清除其他事件 */
    public _allMapEvents: Map<string, MapEvent[]>;
    /**Rbush查询子集 */
    private _allRbush: MapRbush<MapEvent>[];
    /**上一次触发的事件集合 */
    private perEvents: MapEventResponse[];
    /**海图事件回调函数
     * @param e 事件对象
     */
    private cbMapEvent(e: MapEventResponse): void;
    /**事件类型名称集合 */
    private readonly types;
    /** 事件开关 
     * @param flag true开启地图事件监听 false关闭地图事件监听
    */
    private _eventSwitch(flag: boolean): void;
    /**重设rbush */
    private resetRbush(): void;
    /**统一监听该类的指定事件
     * @param type 事件类型
     * @param cb 事件回调函数
     */
    public on<T extends MapEvent<any>>(type: MapEventType, cb: (e: MapEventResponse<T>) => void): void;
    /**统一关闭指定事件的监听
     * @param type 事件类型
     * @param cb 事件回调函数
     */
    public off<T extends MapEvent<any>>(type: MapEventType, cb?: (e: MapEventResponse<T>) => void): void;
    /**清空之前设置的统一监听事件 */
    public clear(): void;
    /** 设置指定key的事件
     * @param evs 事件集合
     * @param key 事件key
     * 设置key 事件 会覆盖原来的事件 
     * 不覆盖使用 pushEventByKey
     *  */
    public setEventsByKey<T extends MapEvent>(evs: T[], key: string): void;
    /**清除所有事件 */
    public clearAllEvents(): void;
    /**清除指定类型事件
     * @param key 事件key
     */
    public clearEventsByKey(key: string): void;
    /**添加一个事件
     * @param key 事件key
     * @param ev 事件对象
     * 尽量使用setEventsByKey 
     * 或者pushEventByKey数组 而不是for 一个个push
     * 不然每次for循环push都会重新构造rbush
     *  */
    public pushEventByKey<T extends MapEvent>(key: string, ev: T | T[]): void;
    /**添加事件
     * @param ev 事件对象
     */
    private handleTransform<T extends MapEvent>(ev: T): void;
    /**转换添加事件
     * @param event 事件对象
     */
    private transformEvent<T extends MapEvent>(event: T): void;
    /**转为Rbush数据格式
     * @param event 事件对象
     */
    private transformRbush<T extends MapEvent>(event: T): void;
    /**准备触发事件 
    * @param e 地图事件
    */
    private triggerEvent(e: AMapMapsEvent | LeafletMouseEvent | MaplibreMouseEvent): void;
    /**获取指针触发范围内的事件
     * @param e 地图事件
     * @returns MapEventRange
     */
    private getEventsByRange(e: AMapMapsEvent | LeafletMouseEvent | MaplibreMouseEvent): MapEventRange;
    /**通过事件类型执行回调函数
     * @param resp 事件响应对象
     * @param type 事件类型
    */
    private doCbByEventType(resp: MapEventResponse, type: MapEventType): void;
  }
  /**地图canvas箭头线类
   * @constructor
   * @param map 地图实例
   * @param ctx 画布上下文
   * @param opts 动画线配置项
   */
  export class MapCanvasArrowLine {
    constructor(map: AMap | LMap | MaplibreMap, ctx: CanvasRenderingContext2D, opt?: OptMapPluginArrowLine);
    /**默认配置项 */
    private readonly options: OptMapPluginArrowLine;
    /**(箭头)图片地址 */
    private get imgUrl(): string;
    /**(箭头)图片宽度 */
    private get partialWidth(): number;
    /**(箭头)图片高度 */
    private get partialHeight(): number;
    /**边界 */
    private get patternBound(): [number, number];
    /**初始化资源加载图片 */
    private initResource(): void;
    /**所有的线数据 */
    private allLines: MapLine[];
    /**每组线的动画偏移变量暂存 */
    private offset: number;
    /**所有的点数据 */
    private allPoints: [number, number][][];
    /**设置所有线
     * @param lines 线集合
     */
    public setAllLines(lines: MapLine[]): void;
    /**更新所有线的点并绘制 */
    public update(): void;
    /**判断点是否在画布范围内
     * @param point 点
     * @param range 画布范围
     * @returns 是否在画布范围内
     */
    private visiblePoint(point: [number, number], range: [number, number]): boolean;

    /** 线段连线方向
     * @param point1
     * @param point2
     * @returns 线段连线方向
     */
    private directionLine(point1: [number, number], point2: [number, number]): string;
    /** 不在画布范围内修改起始点 减少生成过多粒子
     * @param points 线段点
     * @returns 修正后的线段点
     */
    private validLine(points: [[number, number], [number, number]]): false | [[number, number], [number, number]];
    /**获取二次贝塞尔曲线划分任意点位置
     * @param {number} t 当前百分比
     * @param {Array} p1 起点坐标
     * @param {Array} cp 控制点
     * @param {Array} p2 终点坐标
     * @returns 二次贝塞尔曲线划分任意点位置
     */
    private getQuadraticBezierPoint(t: number, p1: [number, number], cp: [number, number], p2: [number, number]): [number, number];
    /**绘制箭头线 */
    public draw(): void;
    /**获取修正后的线段点
     * @param points 线段点
     * @returns 修正后的线段点
     */
    private getValidPoints(points: [number, number][]): [number, number][];
    /**绘制箭头线路径
     * @param points 线段点
     */
    private drawPath(points: [number, number][]): void;
    /**初始化箭头线图案路径 */
    private patternPathInit(): void;
    /**创建箭头线图案
     * @returns 箭头线图案
     */
    private createPattern(): CanvasPattern | null;
  }
  /**地图canvas绘制雷达类
   * @constructor
   * @param map 地图实例
   * @param ctx 画布上下文
   */
  export class MapCanvasRadar {
    constructor(map: AMap | LMap | MaplibreMap, ctx: CanvasRenderingContext2D);
    /**当前地图缩放层级 */
    private get zoom(): number;
    /**上一动画时间(毫秒) */
    private pertime: number;
    /**雷达的默认设置 */
    private radarDefault: OptMapPluginRadar;
    /**所有的雷达数据 */
    private allRadars: OptMapPluginRadar[];
    /**重设雷达绘制类
     * @param radars 雷达数据集合
     * @returns MapCanvasRadar实例
     */
    public setAllRadars(radars: OptMapPluginRadar[]): MapCanvasRadar;
    /**添加雷达绘制类
     * @param radar 雷达数据
     * @returns MapCanvasRadar实例
     */
    public addRadar(radar: OptMapPluginRadar): MapCanvasRadar;
    /**开始绘制所有雷达静态部分 */
    public drawRadarStatic(): void;
    /**开始绘制所有雷达动态扫描部分
     * @param time 当前时间(毫秒)
     */
    public drawRadarAmi(time?: number): void;
    /**更新所有雷达位置和大小
     * @param radar 雷达数据
     */
    private updatePoint(radar: OptMapPluginRadar): void;
    /**绘制雷达网格
     * @param radar 雷达数据
     */
    private drawGrid(radar: OptMapPluginRadar): void;
    /**虚线圈到中心点距离
     * @param radar 雷达数据
     */
    private drawDashArc(radar: OptMapPluginRadar): void;
    /**绘制自定义的虚线圈
     * @param radar 雷达数据
     */
    private drawCustomDashArc(radar: OptMapPluginRadar): void;
    /**绘制轮廓
     * @param radar 雷达数据
     */
    private drawOutline(radar: OptMapPluginRadar): void;
    /**绘制边缘单元
     * @param radar 雷达数据
     */
    private drawOutlineUnit(radar: OptMapPluginRadar): void;
    /**雷达背景蒙版 中间泛白
     * @param radar 雷达数据
     */
    private drawBackground(radar: OptMapPluginRadar): void;
    /**绘制文字描述
     * @param radar 雷达数据
     */
    private drawText(radar: OptMapPluginRadar): void;
    /**绘制扫描范围
     * @param radar 雷达数据
     */
    private drawScanRange(radar: OptMapPluginRadar): void;
    /**更新动态当前角度
     * @param radar 雷达数据
     * @param diffTime 时间差
     */
    private updateAngle(radar: OptMapPluginRadar, diffTime: number): void;
    /**绘制扫描部分(动态)
     * @param radar 雷达数据
     */
    private drawScan(radar: OptMapPluginRadar): void;
    /**
     * 绘制扇形区域
     * @param sectorDeg 扇形渐变角度
     */
    private drawSector(radar: OptMapPluginRadar): void;
    /**计算colors 渐变颜色
     * @param colors 颜色数组
     * @param total 总颜色数
     * @returns 渐变颜色数组
     */
    private caculateColorChange(colors: string[], total: number): number[][];
  }
  /**
* 固定图片热力图
* 只在指定级别渲染一次热力图为图片，缩放仅拉伸图片，不重新计算
*/
  export class MapCanvasFixedHeat {
    constructor(map: AMAP.Map | L.Map, ctx: CanvasRenderingContext2D, heatOpt?: OptMapPluginFixedHeat);
    /** 热力图默认配置 */
    private readonly defaultOption: OptMapPluginFixedHeat;
    /** 原始数据 [经度, 纬度, 强度] */
    private data: [number, number, number][];
    /** 渲染好的热力图离屏画布（核心：固定图片） */
    private heatCanvas: HTMLCanvasElement | null;
    /** 热力图对应的经纬度边界 */
    private bounds: { minLng: number; maxLng: number; minLat: number; maxLat: number; } | null;
    /**
     * 设置热力图数据
     * @param data [经度, 纬度, 强度]
     */
    public setData(data: [number, number, number][]): void;
    /**将热力数据渲染为一张固定图片；只在 refZoom 级别计算一次，后续缩放不再计算 */
    private renderToImage(): void;
    /**
     * 自定义热力图渲染逻辑
     * @param ctx 目标画布上下文
     * @param points 偏移后的像素点 [x, y, 强度]
     */
    private renderHeat(ctx: CanvasRenderingContext2D, points: [number, number, number][]): void;
    /**
     * 十六进制颜色转RGB
     * @param hex 十六进制颜色字符串
     */
    private hexToRgb(hex: string): [number, number, number];
    /**每帧绘制：只贴图片，不计算；根据当前地图级别自动显隐 */
    public draw(): void;
    /**清空数据与图片 */
    public clear(): void;
  }
  /** 地图canvas基础图层类(基本所有插件都要继承此类) 删除永远比新增简单 
   * @constructor
   * @param MAP 地图实例
   * @param opt 图层配置项
   */
  export class MapCanvasLayer {
    constructor(MAP: LMap, opt?: OptMapCanvas)
    constructor(MAP: MaplibreMap, opt?: OptMapCanvas)
    constructor(MAP: AMap, opt?: CustomLayerOption)
    constructor(MAP: AMap | LMap | MaplibreMap, opt?: CustomLayerOption | OptMapCanvas)
    constructor(map: AMap | LMap | MaplibreMap, opt?: CustomLayerOption | OptMapCanvas);
    /**地图实例*/
    public readonly map: AMap | LMap | MaplibreMap;
    /**图层 */
    private layer: Layer | CustomLayer | CustomLayerInterface;
    /**画布 */
    protected readonly canvas: HTMLCanvasElement;
    /**画布上下文 */
    protected readonly ctx: CanvasRenderingContext2D;
    /**画布宽度 */
    protected width: number;
    /**画布高度 */
    protected height: number;
    /**图层配置项 */
    public readonly options: OptMapCanvas;
    /**动画循环的id标识 */
    protected flagAnimation: number;
    /**移除图层 */
    public onRemove(): MapCanvasLayer;
    /**清空并重新设置画布 */
    public resetCanvas(): void;
    /**添加或关闭地图特定的监听事件(_eventSwitch事件后自动调用)
     * @param map 地图实例
     * @param key 事件类型
     */
    protected addMapEvents(map: AMap | LMap | MaplibreMap, key: 'on' | 'off'): void;
    /**绘制静态数据推荐使用此方法(固定的图) */
    protected renderFixedData(): void;
    /** 推荐使用此方法绘制动态图(跟随鼠标拖动，移动时需要立刻绘制时)
     ** 动画图层绘制前的画布清空、计算等均在此方法中自行计算 
     ** 与renderFixedData本质是一样的
     */
    protected renderAnimation(): void;
    /**添加地图事件监听
     * @param key 事件类型
     * @param cb 事件回调函数
     */
    protected on(key: string, cb: Function): void;
    /**移除地图事件监听
     * @param key 事件类型
     * @param cb 事件回调函数
     */
    protected off(key: string, cb: Function): void;
    /**初始化canvas */
    private initCanvas(): void;
    /**将图层添加到map实例中显示
     * @returns MapCanvasLayer实例
     */
    private onAdd(): MapCanvasLayer;
    /**基础的监听事件   
    * @param flag @default true
    *  true开启重绘事件监听; false关闭重绘事件监听
    **/
    private _eventSwitch(flag?: boolean): void;
    /**基础绘制 */
    /** 重绘(子类重写也无效)
     ** 清空之前的绘制
     ** ①高德地图渲染配置alwaysRender:true后拖动缩放会多次渲染
     */
    protected _redraw(): void;
    /**------------------------------高德地图的实现------------------------------*/
    /**初始化高德地图的图层 */
    private _initAMap(): void;
    /**将图层添加到map实例中显示 */
    private _onAmapAdd(): void;
    /**移除图层 */
    private _onAmapRemove(): void;
    /**------------------------------Leaflet地图的实现------------------------------*/
    /**初始化Leaflet地图的图层 */
    private _initLeaflet(): void;
    /**初始化画布并添加到Pane中 */
    private initLeafletCanvas(): void;
    /**移除图层 */
    private _onLeafletRemove(): void;
    /**添加Leaflet地图事件监听
     *  @param flag @default true
     *  true开启重绘事件监听; false关闭重绘事件监听
     */
    private addLeafletEvent(flag?: boolean): void;
    /**重设画布,并重新渲染*/
    private _reset(): void;
    /**缩放动画
     * @param e 缩放事件对象
     */
    private _animateZoom(e: ZoomAnimEvent): void;
    /**画布加载完成 */
    private _onCanvasLoad(): void;
    /**------------------------------MapLibre地图的实现------------------------------*/
    /**异步初始化MapLibre地图的图层 */
    private _initMapLibreAsync(): void;
    /**添加MapLibre图层到地图上 */
    private _initMapLibre(): void;
    /**将图层添加到容器 */
    private _onMapLibreAdd(): void;
    /**移除图层 */
    private _onMapLibreRemove(): void;
    /**添加MapLibre地图事件监听
     *  @param flag @default true
     *  true开启事件监听; false关闭事件监听
     */
    private addMaplibreEvent(flag?: boolean): void;
  }

  /**地图插件----绘制类
 * @extends MapCanvasLayer
 * @param sluMap 地图实例
 * @param options 地图绘制选项
 * @description 地图绘制类，用于绘制地图上的元素：圆点、线、贝塞尔曲线、多边形、文本、图片、gif动画
 */
  export class MapPluginDraw extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: CustomLayerOption | OptMapCanvas);
    /**地图绘制控制类 */
    protected _draw: MapCanvasDraw;
    /**地图事件引起的重绘绘制 */
    protected override renderFixedData(): void;
    /**绘制所有需要绘制的类
     * @returns MapPluginDraw实例
     */
    public drawMapAll(): MapPluginDraw;
    /**设置圆点
     * @param arcs 圆点数据
     * @returns MapPluginDraw实例
     */
    public setAllArcs(arcs: MapArc[]): MapPluginDraw;
    /**设置线数据
     * @param lines 线数据
     * @returns MapPluginDraw实例
     */
    public setAllLines(lines: MapLine[]): MapPluginDraw;
    /**设置贝塞尔曲线数据 
     * @param lines 贝塞尔曲线数据
     * @returns MapPluginDraw实例
     */
    public setAllBezierLines(lines: MapLine[]): MapPluginDraw;
    /**设置多边形数据 
     * @param rects 多边形数据
     * @returns MapPluginDraw实例
     */
    public setAllRects(rects: MapRect[]): MapPluginDraw;
    /**设置文本数据 
     * @param texts 文本数据
     * @returns MapPluginDraw实例
     */
    public setAllTexts(texts: MapText[]): MapPluginDraw;
    /**设置图片数据
     * @param imgs 图片数据
     * @returns MapPluginDraw实例
     */
    public setAllImgs(imgs: MapImage[]): MapPluginDraw;
    /**设置gif数据
     * @param gifs gif数据
     * @returns MapPluginDraw实例
     */
    public setAllGifs(gifs: MapGif[]): MapPluginDraw;
    /**增加圆点
     * @param arc 圆点数据
     * @returns MapPluginDraw实例
     */
    public addArc(arc: MapArc): MapPluginDraw;
    /**增加线
     * @param line 线数据
     * @returns MapPluginDraw实例
     */
    public addLine(line: MapLine): MapPluginDraw;
    /**增加贝塞尔曲线
     * @param line 贝塞尔曲线数据
     * @returns MapPluginDraw实例
     */
    public addBezierLine(line: MapLine): MapPluginDraw;
    /**增加多边形
     * @param rect 多边形数据
     * @returns MapPluginDraw实例
     */
    public addRect(rect: MapRect): MapPluginDraw;
    /**增加文本
     * @param text 文本数据
     * @returns MapPluginDraw实例
     */
    public addText(text: MapText): MapPluginDraw;
    /**增加图片
     * @param img 图片数据
     * @returns MapPluginDraw实例
     */
    public addImg(img: MapImage): MapPluginDraw;
    /**删除指定圆点
     * @param arc 圆点数据
     * @returns MapPluginDraw实例
     */
    public delArc(arc: MapArc): MapPluginDraw;
    /**删除指定线
     * @param line 线数据
     * @returns MapPluginDraw实例
     */
    public delLine(line: MapLine): MapPluginDraw;
    /**删除指定贝塞尔曲线
     * @param line 贝塞尔曲线数据
     * @returns MapPluginDraw实例
     */
    public delBezierLine(line: MapLine): MapPluginDraw;
    /**删除指定多边形
     * @param rect 多边形数据
     * @returns MapPluginDraw实例
     */
    public delRect(rect: MapRect): MapPluginDraw;
    /**删除指定文本
     * @param text 文本数据
     * @returns MapPluginDraw实例
     */
    public delText(text: MapText): MapPluginDraw;
    /**删除指定图片
     * @param img 图片数据
     * @returns MapPluginDraw实例
     */
    public delImg(img: MapImage): MapPluginDraw;
    /**清空
     * @param type @default 'all' ,不填清空所有内容数据
     * @returns MapPluginDraw实例
     */
    public delAll(type?: 'all' | 'arc' | 'line' | 'bezier' | 'rect' | 'img' | 'gif'): MapPluginDraw;
  }
  /**自定义标绘类
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap 地图实例
 * @param options 标绘配置
 */
  export class MapPluginPlot extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: OptMapPluginPlot);
    /**默认配置 */
    public options: OptMapPluginPlotBase;
    /**动态绘制图层 */
    private ctrMapAniDraw: MapPluginDraw;
    /**静态标绘图层 */
    private ctrMapDraw: MapCanvasDraw;
    /**图层事件控制器 */
    private ctrEvent: MapCanvasEvent;
    /**编辑圆点样式 */
    private editArc: MapArc;
    /**标绘文字样式 */
    private plotText: OptMapPluginPlotText;
    /**所有的标绘集合 */
    private plotList: DataMapPlot[];
    /**正在动态绘制的标(仅仅改变图形不会动态改变原始数据) */
    public plotAni?: DataMapPlot;
    /**记录当前鼠标纬经度 */
    private curPoint?: [number, number];
    /** 单击事件 */
    private eventClickTimer: number | undefined;
    /**开启新增的绘制
     * @param type 标绘类型
     * @returns 新增的标绘实例
     */
    public open(type: MapPlotType): DataMapPlot;
    /**关闭绘制 
     * @returns MapPluginPlot实例
    */
    public close(): MapPluginPlot;
    /**保存标绘
     * @returns MapPluginPlot实例
    */
    public savePlot(): MapPluginPlot;
    /**删除标绘
     * @param plot 标绘实例
     * @returns MapPluginPlot实例
     */
    public delPlot(plot?: DataMapPlot): MapPluginPlot;
    /**设置所有区域数据
     * @param plotList 标绘集合
     * @returns MapPluginPlot实例
     */
    public setPlotList(plotList: DataMapPlot[]): MapPluginPlot;
    /**设置编辑区域数据
     * @param plot 标绘实例
     * @returns MapPluginPlot实例
     */
    public setEditPlot(plot: DataMapPlot): MapPluginPlot;
    /**重绘
     * @returns MapPluginPlot实例
     */
    public redraw(): MapPluginPlot;
    /**渲染静态标绘图层 */
    protected renderFixedData(): void;
    /**渲染动态绘制图层 */
    protected renderAnimation(): void;
    /**创建标绘
     * @param type 标绘类型
     * @returns 标绘数据
     */
    private createPlot(type: MapPlotType): DataMapPlot;
    /**生成动态绘制图层 */
    private genAniPlot(): void;
    /**绘制标绘
     * @param layer 绘制图层
     * @param plotInfo 标绘数据
     * @param type 标绘类型
     */
    private drawPlot(layer: MapCanvasDraw | MapPluginDraw, plotInfo: DataMapPlot, type: MapPlotType): void;
    /**各个点的平均值计算中心点
     * @param points 纬度经度点数组
     * @param type 标绘类型
     * @returns 中心点[number, number]
     */
    private calcCenter(points: [number, number][], type: MapPlotType): [number, number];
    /**直接最大最小计算中心点
     * @param points 纬度经度点数组
     * @returns 中心点[number, number]
     */
    private calcCenter2(points: [number, number][]): [number, number];
    /**计算多边形的重心
     * @param points 纬度经度点数组
     * @returns 中心点[number, number]
     */
    private calcCenter3(points: [number, number][]): [number, number];
    /**计算矩形的四个点
     * @param latLngs 纬度经度点数组
     * @returns 矩形四个点[number, number]
     */
    private calcRect(latLngs: [number, number][]): [number, number][];
    /**计算圆的半径
     * @param latLngs 纬度经度点数组
     * @returns 圆的半径
     */
    private calcRadius(latLngs: [number, number][]): number;
    /**开启鼠标编辑功能
     * @param plotInfo 标绘数据
     */
    private openMouseEdit(plotInfo: DataMapPlot): void;
    /**设置圆的编辑点
     * @param plotInfo 标绘数据
     */
    private setCircleEditPoint(plotInfo: DataMapPlot): void;
    /**设置多边形的编辑点
     * @param plotInfo 标绘数据
     */
    private setPolygonEditPoint(plotInfo: DataMapPlot): void;
    /**点标绘仍可编辑移动位置
     * @param plotInfo 标绘数据
     */
    private setPointEdit(plotInfo: DataMapPlot): void;
    /**设置线段的编辑点
     * @param plotInfo 标绘数据
     */
    private setLineEditPoint(plotInfo: DataMapPlot): void;
    /**设置矩形的编辑点
     * @param plotInfo 标绘数据
     */
    private setRectEditPoint(plotInfo: DataMapPlot): void;
    /**添加响应事件 
     * @param latLng 经纬度
     * @param i 索引
     * @param plotInfo 标绘数据
     * @param eves 事件
     * @param ifVirtual 是否为虚拟点
    */
    private addEvent(latLng: [number, number], i: number, plotInfo: DataMapPlot, eves: MapEvent[], ifVirtual?: boolean): void;
    /**事件开关方法 
    * @param flag true开启 false关闭
    */
    private eventSwitch(flag: boolean): void;
    /**鼠标点击事件
     * @param e 鼠标事件对象
     */
    private eventClick(e: LeafletMouseEvent | AMapMapsEvent | MaplibreMouseEvent): void;
    /**鼠标移动事件
     * @param e 鼠标事件对象
     */
    private eventMousemove(e: LeafletMouseEvent | AMapMapsEvent | MaplibreMouseEvent): void;
    /**双击关闭事件 */
    private eventDblclick(): void;
    /**移除所有的监听函数 */
    private clearCb(): void;
    /**绘制时添加了新点位时的回调
     * @param plotAni 绘制的点位数据
    */
    private cbPointChange?: (plotAni: DataMapPlot) => void;
    /**绘制时添加了新点位时的回调
     * @param plotAni 绘制的点位数据
    */
    private cbPointAdd?: (plotAni: DataMapPlot) => void;
    /**绘制时移动已有点位时的回调
     * @param plotAni 绘制的点位数据
    */
    private cbPointMove?: (plotAni: DataMapPlot) => void;
    /**添加新增点位时的监听函数
     * @param cb 回调函数
     * @returns MapPluginPlot实例
     */
    public addCbPointChange(cb: (plotAni: DataMapPlot) => void): MapPluginPlot;
    /**添加新增点位时的监听函数
     * @param cb 回调函数
     * @returns MapPluginPlot实例
     */
    public addCbPointAdd(cb: (plotAni: DataMapPlot) => void): MapPluginPlot;
    /**添加新增点位时的监听函数
     * @param cb 回调函数
     * @returns MapPluginPlot实例
     */
    public addCbPointMove(cb: (plotAni: DataMapPlot) => void): MapPluginPlot;
    /**标绘列表变化时的回调（新增/删除等） */
    private cbPlotListChange?: (plotList: DataMapPlot[]) => void;
    /**设置标绘列表变化时的监听函数
     * @param cb 回调函数，参数为最新的标绘列表
     * @returns MapPluginPlot实例
     */
    public addCbPlotListChange(cb: (plotList: DataMapPlot[]) => void): MapPluginPlot;
  }
  /**测绘类
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap 地图实例
 * @param options 测绘配置
 */
  export class MapPluginRange extends MapCanvasLayer {
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
    /** 启用测距功能
     * @returns MapPluginRange实例
     */
    public open(): MapPluginRange;
    /** 关闭测距功能
     * @param flag @default true 是否关闭事件监听
     */
    public close(flag?: boolean): void;
    /** 测距结束回调函数 */
    endCb?: () => void;
    /** 测距结束回调函数 */
    public onEnd(cb: () => void): void;
    /** 缓存绘图数据（对于引进确定的数据进行缓存） */
    protected renderFixedData(): void;
    /** 渲染动画 */
    protected renderAnimation(): void;
    /** 动画虚线绘制 */
    private genAniLineDate(): void;
    /** 绘制文本信息  flag标识该条线已经绘制完成
     * @param info 文本信息
     * @param lineId 线索引
     * @returns MapImage实例
     */
    protected drawEndTextImg(info: MapText, lineId: number): MapImage;
    /**控制地图监听事件
   * @param map 地图实例
   * @param key 事件类型
   */
    private eventSwitch(flag: boolean): void;
    /** 拖动事件 */
    private eventDrag(): void;
    /** 拖动结束事件 */
    private eventDragend(): void;
    /** 单击事件
     * @param e 事件对象
     */
    private eventClick(e: LeafletMouseEvent | AMapMapsEvent | MaplibreMouseEvent): void;
    /** 鼠标移动事件
     * @param e 事件对象
     */
    private eventMousemove(e: LeafletMouseEvent | AMapMapsEvent | MaplibreMouseEvent): void;
    /** 双击关闭事件 */
    private eventDblclick(): void;
  }
  /**轨迹绘制类
 * @constructor
 * @param sluMap 地图实例
 * @param options 配置项
 */
  export class MapPluginTrack {
    constructor(sluMap: SLUMap, options?: Partial<OptMapPluginTrack>);
    /**地图实例 */
    private map: LMap | AMap | MaplibreMap;
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
    /**轨迹图层 */
    private layerDraw: MapPluginDraw;
    /**动态画船的图层 */
    private layerAniDraw: MapPluginDraw;
    /**指针点击所对应的点*/
    private cursorData: MapPoint[];
    /**点击圆点时的回调
     * @param plotAni 点击事件数据
    */
    private cbClickPoint?: (plotAni: MapEventResponse) => void;
    /**是否显示轨迹 */
    private ifShow: boolean;
    /**zoom变化 重设arc数据 */
    public onRemove(): void;
    /**设置添加轨迹数据(并重新绘制)
     * @param tracks 轨迹数据
     */
    public setTracks(tracks: DataMapTrackGroup[]): void;
    /**获取指定时间各轨迹点的位置信息集合
     * @param time 时间点
     * @returns 指定时间各轨迹点的位置信息集合
     */
    public getInfosByTime<T = any>(time: Date): ({ orginData: T } & MapTrackTimePosition)[];
    /**获取下一时间段的数据 */
    private getNextTrack(): void;
    /**设置轨迹上的动点船
     * @param imgs 图片数据
     * @param texts @default [] 文本数据
     */
    public setAniImage(imgs: MapImage[], texts?: MapText[]): void;
    /**添加点击圆点时的监听函数
     * @param cb 点击事件回调 
     * @returns MapPluginTrack实例
     */
    public addCbClickPoint(cb: (plotAni: MapEventResponse<any>) => void): MapPluginTrack;
    /**设置轨迹的显示和隐藏
     * @param ifShow 是否显示轨迹
     */
    public setIfShow(ifShow: boolean): void;
    /**绘制轨迹数据 */
    private _drawTracks(): void;
    /**单条轨迹绘制 （并给点添加事件）
     * @param track 轨迹数据
    */
    private drawHistoryTrack(track: DataMapTrackGroup): void;
    /**绘制轨迹线
     * @param track 轨迹数据
     */
    private drawLine(track: DataMapTrackGroup): void;
    /**绘制轨迹点
     * @param track 轨迹数据
     */
    private drawArc(track: DataMapTrackGroup): void;
    /**绘制轨迹起点终点
     * @param track 轨迹数据
     */
    private drawStartEnd(track: DataMapTrackGroup): void;
    /**添加轨迹点事件
     * @param track 轨迹数据
     * @param eves 事件数组
    */
    private addPointEvent(track: DataMapTrackGroup, eves: MapEvent[]): void;
    /**获得指定时间的位置信息
     * @param epoch 时间戳
     * @param infos 轨迹数据数组
     * @returns 位置信息
    */
    private getInfoByTime(epoch: number, infos: DataMapTrack[]): MapTrackTimePosition;
    /**计算位置信息
     * @param sData 起点轨迹数据
     * @param eData 终点轨迹数据
     * @param time 时间戳
     * @returns 位置信息
     */
    private computeDate(sData: DataMapTrack, eData: DataMapTrack, time: number): MapTrackTimePosition;
    /**移除所有的监听函数 */
    private clearCb(): void;
    /**监听函数对象 */
    private cbs: Record<string, Function>;
    /**添加监听函数
     * @param key 事件键
     * @param cb 监听函数
    */
    public on(key: string, cb: Function): void;
    /**触发监听函数
     * @param key 事件键
    */
    public trigger(key: string): void;
  }
  /**网格插件基础类
 * @extends MapCanvasLayer
 * @constructor
 * @param map 地图实例
 * @param options 配置
 */
  export class MapPluginGridBase extends MapCanvasLayer {
    constructor(map: LMap | AMap | MaplibreMap, options: Partial<OptMapGrid>);
    /**基础配置 */
    public readonly options: OptMapGrid;
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
    /**将线程绘制的图像绘制出来
     * @param data 线程绘制的图像
     */
    private workerCb(data: { workerId: number, data: CanvasImageSource }): void;
    /**设置网格数据
     * @param datas 网格数据
     */
    public _setDatas(datas: DataMapGrid[]): void;
    /**采用线程调取生成可视区网格数据
     * @param bounds 可视区域的像素范围
     */
    protected interpolateFieldByWorker(bounds: GridBounds): void;
    /**grid数据，以及获得指定经纬度数据的方法interpolate
     * @param bounds 可视区域的像素范围
    */
    protected interpolateField(bounds: GridBounds): void;
    /**获取视图范围内的(指定像素间隔的数据)
     * @param bounds 可视区域的像素范围
     * @param pixelInterval @default 2 像素间隔
     * @returns 可视区域的网格数据
     */
    protected getViewBoundsGrid(bounds: GridBounds, pixelInterval?: number): [number, number, number][][];
    /**构建网格数据gridXY: [开始的数据,结束的数据] [x序号] [y序号] 
     * @param grids 一维数据
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
     * @param a 待取余的数字
     * @param n 取余的除数
     * @returns 取余的结果
    */
    private floorMod(a: number, n: number): number;
    /**判断是否为有效数据
     * @param x 待判断的数字
     * @returns 是否为有效数据
     */
    private isValue(x: number[]): boolean;
    /**此处无数据数据
     * @param xy 待判断的经纬度
     * @returns 是否为无数据数据
     */
    private isNull(xy: [number, number]): boolean;
    /**生成马赛克类型图
     * @param datas 网格数据
     */
    protected genMosaic(datas: [number, number, number][][]): void;
    /**生成黑白遮罩，以便构建渐变图
     * @param datas 网格数据
     * @returns MapPluginGridBase实例
     */
    protected genShade(datas: [number, number, number][][]): MapPluginGridBase;
    /**获取该值所在的颜色
     * @param value 待判断的数值
     * @returns 该数值对应的颜色
     */
    protected getColorByValue(value: number): string;
    /**生成单个的阴影半径(圆形) 
     * @param r 半径
     * @param blur @default 15 模糊度
     * @returns 画布元素
    */
    protected genShadowRadius(r: number, blur?: number): HTMLCanvasElement;
    /**构建渐变色
     * @param grad 渐变颜色
     * @returns 画布元素
     */
    private genGradient(grad: { [key: number]: string }): HTMLCanvasElement;
    /**填充颜色
     * @param pixels 像素数据
     * @param gradient 渐变颜色
     */
    private _colorize(pixels: Uint8ClampedArray, gradient: Uint8ClampedArray): void;
  }
  /**网格插件,用于渲染网格数据
   * @extends MapPluginGridBase
   * @constructor
   * @param sluMap 地图实例
   * @param options 基础配置
   */
  export class MapPluginGrid extends MapPluginGridBase {
    constructor(sluMap: SLUMap, options: Partial<OptMapGrid>);
    /**可视区内的网格数据XY */
    protected boundsDatas: [number, number, number][][];
    /**设置渲染数据
     * @param datas 网格数据
     */
    public setData(datas: DataMapGrid[]): void;
    /**根据经纬度获取网格数据
     * @param lng 经度
     * @param lat 纬度
     * @returns 网格数据
     */
    public getInfoByLngLat(lng: number, lat: number): [number, number, number] | null;
    /**渲染开始 */
    private renderStart(): void;
    /**渲染静态图层 */
    protected renderFixedData(): void;
  }
  /**风速风向插件
   * @extends MapPluginGridBase
   * @constructor
   * @param sluMap 地图实例
   * @param options 配置
   */
  export class MapPluginWind extends MapPluginGridBase {
    constructor(sluMap: SLUMap, options: OptMapPluginWind);
    /**根据风速返回图标配置
     * @param speed 风速
     * @returns 图标配置
     */
    private iconResolver: (speed: number) => Image;
    /**绘制实例 */
    private draw: MapCanvasDraw;
    /**基础配置 */
    public options: OptMapPluginWind;
    /**设置图标解析器
     * @param resolver 图标解析器
     * @returns MapPluginWind实例
     */
    public setIconResolver(resolver: (speed: number) => Image): MapPluginWind;
    /**设置风速风向数据
     * @param data 风速风向数据
     */
    public setData(data: DataMapGrid[]): void;
    /**获取视图范围内的(指定像素间隔的数据)
     * @param bounds 视图范围
     * @param pixelInterval @default 2 像素间隔
     * @returns 风速风向数据
     */
    protected getViewBoundsGridWind(bounds: GridBounds, pixelInterval?: number): DataMapWind[];
    /**根据风力等级获取图片裁剪地址 x,y */
    protected renderAnimation(): void;
    /**渲染静态图层 */
    protected renderFixedData(): void;
  }
  /**运动粒子类
   * @constructor
   * @param options 配置项
   */
  export class PluginVelocity {
    constructor(options: Partial<OptMapPluginVelocity>);
    /**基础配置项 */
    private options: OptMapPluginVelocity;
    /**地图实例 */
    private map: LMap | AMap | MaplibreMap;
    /**画布元素 */
    private canvas: HTMLCanvasElement;
    /**粒子强度最低时的速度（米 / 秒） velocity at which particle intensity is minimum (m/s)*/
    private MIN_VELOCITY_INTENSITY: number;
    /**粒子强度最高时的速度（米 / 秒） velocity at which particle intensity is maximum (m/s)*/
    private MAX_VELOCITY_INTENSITY: number;
    /**风速刻度(内部与可视区面积相关联) scale for wind velocity (completely arbitrary--this value looks nice)*/
    private VELOCITY_SCALE: number;
    /**粒子生命周期内最大绘制帧数 max number of frames a particle is drawn before regeneration*/
    private MAX_PARTICLE_AGE: number;
    /**粒子线宽 line width of a drawn particle*/
    private PARTICLE_LINE_WIDTH: number;
    /**绘制粒子数量的比例（宽像素*高像素*此比例）*/
    private PARTICLE_MULTIPLIER: number;
    /**移动端粒子数量倍率 multiply particle count for mobiles by this amount*/
    private PARTICLE_REDUCTION: number;
    /**每秒播放帧数 */
    private FRAME_RATE: number;
    /**每帧播放时间 desired frames per second*/
    private FRAME_TIME: number;
    /**粒子透明度 */
    private OPACITY: number;
    /**粒子颜色等级 */
    private colorScale: string[];
    /**无风状态下的单例 singleton for no wind in the form: [u, v, magnitude]*/
    private NULL_WIND_VECTOR: WindVector;
    /**传过来的原始数据 */
    private gridData: DataMapVeloctiyWind[];
    /** [U数据,V数据][ x序号 ][ y轴序号 ]   */
    private grid: [number, number][][];
    /**风场数据 */
    private field: PluginVelocityField;
    /**数据起始经度 */
    private lng0: number;
    /**数据起始纬度 */
    private lat0: number;
    /**数据经度差值 数据经度间隔 (若全球数据中0.5经度间隔得到一个数据，则 dx = 1 * 0.5 )*/
    private Δlng: number;
    /**数据纬度差值 */
    private Δlat: number;
    /**动画循环 */
    private animationLoop?: number;
    /**所有粒子id */
    private allThreatIds: number[];
    /**设置自身参数
     * @param options 配置项
     */
    public setOptions(options: any): void;
    /**设置数据
     * @param data 数据
     */
    public setData(data: DataMapVeloctiyWind[]): void;
    /**停止运行 */
    public stop(): void;
    /**开始运行
     * @param width 画布宽度
     * @param height 画布高度
     * @param extent 可视的经纬度范围
     */
    public start(width: number, height: number, extent: [[number, number], [number, number]]): void;
    /**构建网格数据
     * @param data 数据
     */
    private buildGrid(data: DataMapVeloctiyWind[]): void;
    /**创建构造器
     * @param data 数据
     */
    private createBuilder(data: DataMapVeloctiyWind[]): { header: VelocityHeader; data: (i: number) => [number, number]; };
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
     * @param lng 经度
     * @param lat 纬度
     * @param x 像素点X
     * @param y 像素点Y
     * @param scale 风速刻度
     * @param wind 风速信息 [计算得到的开始值S , 计算的到的结束值E, sqrt(S*S+E*E) ]
     * @returns 风速信息
     */
    private distort(lng: number, lat: number, x: number, y: number, scale: number, wind: [number, number, number]): [number, number, number];
    /**粒子系统 经纬度速度 → 屏幕像素速度
     * 单个经纬度值跨越的像素点数量级
     * @param lng 经度
     * @param lat 纬度
     * @param x 像素点X
     * @param y 像素点Y
     * @returns [经度转 X 像素系数，0, 0, 纬度转 Y 像素系数]
     */
    private distortion(lng: number, lat: number, x: number, y: number): [number, number, number, number];
    /**根据经纬度获得像素点
     * @param lat 纬度
     * @param lon 经度
     * @returns [像素点X, 像素点Y]
     */
    private project(lat: number, lon: number): [number, number];
    /**动画
     * @param bounds 可视区域的像素范围
     * @param field 风场数据
     */
    private animate(bounds: WindBounds, field: PluginVelocityField): void;
    /**根据风速得到所属颜色层级
     * @param m 风速
     * @returns 颜色层级
     */
    private windColorIndexBySpeed(m: number): number;
    /**将经纬度转换为弧度  180 = Math.PI
     * @param deg 经纬度
     * @returns 弧度
     */
    private deg2rad(deg: number): number;
    /**针对经纬度特殊的取余数方法
     * 小于等于n的数字若a小于0，返回 2n+a ， -365  => 2n-365
     * @param a 数字
     * @param n 数字范围
     * @returns 取余数
     */
    private floorMod(a: number, n: number): number;
    /**判断是否是有效值
     * @param x 值
     * @returns 是否是有效值
     */
    private isValue(x: [number, number]): boolean;
    /**判断是否是移动端
     * @returns 是否是移动端
     */
    private isMobile(): boolean;
  }
  /**风场类
 * @constructor
 * @param columns 风场数据
 * @param bounds 风场边界
 * @param NULL_WIND_VECTOR 空风矢量
 * */
  class PluginVelocityField {
    constructor(columns: WindVector[][], bounds: WindBounds, NULL_WIND_VECTOR?: WindVector);
    /**风场数据 */
    private columns: WindVector[][];
    /**风场边界 */
    private bounds: WindBounds;
    /**空风矢量 */
    private NULL_WIND_VECTOR: WindVector;
    /**释放内存 */
    public release(): void;
    /**获取随机的  x , y 有数据的点(一个糟糕的未完成方法)
     * @param o 粒子
     * @returns 粒子
    */
    public randomize(o: WindParticle): WindParticle;
    /**获取指定像素点的数据
     * @param x x坐标
     * @param y y坐标
     * @returns 风矢量
     */
    public run(x: number, y: number): WindVector;
  }
  /**流体动画(风速风向洋流动图)leaflet-velocity.js
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap 地图实例
 * @param options 基础配置
*/
  export class MapPluginFlow extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: Partial<OptMapPluginFlow>);
    /**基础配置项 */
    public options: OptMapPluginFlow;
    /**运动粒子类对象 */
    private windy: PluginVelocity | null;
    /**鼠标点击时的回调函数
     * @param degrees 方向
     * @param speed 速度
     */
    private cbClick?: (degrees: number, speed: number) => void;
    /**设置数据并绘制canvas
     * @param datas 数据
     * data[0] 为X轴经度longitude方向的数据
     * data[1] 为Y轴纬度latitude方向的数据
     */
    public setData(datas: DataMapVeloctiyWind[]): void;
    /**添加鼠标点击时的回调函数
     * @param cb 回调函数
     * @param degrees 方向
     * @param speed 速度
     */
    public addCbMouseClick(cb: (degrees: number, speed: number) => void): void;
    /*------------------------------------ PRIVATE ------------------------------------------*/
    /**渲染静态图层 */
    protected renderFixedData(): void;
    /**添加或关闭地图特定的监听事件(_eventSwitch事件后自动调用) 
     * @param map 地图实例
     * @param key 事件类型
    */
    protected addMapEvents(map: LMap | AMap | MaplibreMap, key: "on" | "off"): void;
    /**初始化windy对象 */
    private initWindy(): void;
    /**开始动画 */
    private startWindy(): void;
    /**停止动画 */
    private stopWindy(): void;
    /**鼠标点击事件监听
     * @param e 鼠标事件
     */
    private onMouseClick(e: LeafletMouseEvent | AMapMapsEvent | MaplibreMouseEvent): void;
    /**将m/s转换为方向
     * @param uMs X轴速度
     * @param vMs Y轴速度
     * @param angleConvention 角度约定
     * @returns 方向
     */
    private vectorToDegrees(uMs: number, vMs: number, angleConvention: string): number;
    /**将m/s 转换为指定单位的速度
     * @param uMs X轴速度
     * @param vMs Y轴速度
     * @param unit 单位
     * @returns 速度
     */
    private vectorToSpeed(uMs: number, vMs: number, unit: string): number;
    /**将m/s转换为kn节
     * @param meters m/s
     * @returns knot节/s
     */
    private meterSec2Knots(meters: number): number;
    /**将m/s转换为km/h
     * @param meters m/s
     * @returns km/h
     */
    private meterSec2kilometerHour(meters: number): number;
  }
  /**热力图图层  传入经纬度坐标[],也可传入系数 [纬度,经度,系数?] 
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap 地图实例
 * @param options 热力图配置
*/
  export class MapPluginHeat extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: OptMapPluginHeat);
    /**热力数据集合 */
    private _allHeats: DataMapHeat[];
    /**计算后的热力图绘制数据 [位置x,位置y,权重W] */
    private heatDatas: [number, number, number][];
    /**用于绘制阴影，决定渲染颜色层级 */
    private _circleShadow: HTMLCanvasElement;
    /**单点渲染半径（ 默认+blur 15 ） */
    private _r: number;
    /**渐变的二进制数据 */
    private _grad: Uint8ClampedArray;
    /**渐变元素 */
    private _gradEl: HTMLCanvasElement;
    /**默认配置 */
    public options: OptMapPluginHeat;
    /**渲染动态数据 */
    protected renderAnimation(): void;
    /**重置[纬度，经度]集合
     * @param heats 热力数据集合
    */
    public setAllHeats(heats: DataMapHeat[]): void;
    /**添加[纬度，经度],并重绘
     * @param heat 热力数据
    */
    public addHeat(heat: DataMapHeat): void;
    /**删除[纬度，经度],并重绘
     * @param heat 热力数据
    */
    public delHeat(heat: DataMapHeat): void;
    /**设置配置
     * @param options 热力图配置
     */
    private setOptions(options?: OptMapPluginHeat): void;
    /**更新配置 */
    private _updateOptions(): void;
    /**计算热力图数据
     * @returns 热力图绘制数据 [位置x,位置y,权重W]
     */
    private computeHeatData(): [number, number, number][];
    /**计算最高变色需要的数值
     * @returns 最高变色需要的数值
     */
    private computeZoomGradient(): number;
    /**添加等级标识
     * @param num 等级标识
     */
    private _addGradient(num: string): void;
    /**根据数据重绘制热力图
     * @returns MapPluginHeat实例
     */
    private drawByheatData(): MapPluginHeat;
    /**生成单个的阴影半径
     * @param r 半径
     * @param blur @default 15 模糊半径
     */
    private genShadowRadius(r: number, blur?: number): void;
    /**创建渐变色
     * @param grad 渐变色
     * @returns MapPluginHeat实例
     */
    private genGradient(grad: any): MapPluginHeat;
    /**填充颜色
     * @param pixels 像素数据
     * @param gradient 渐变色
     */
    private _colorize(pixels: Uint8ClampedArray, gradient: Uint8ClampedArray): void;
  }
  /**固定图片热力图 - 插件 */
  export class MapPluginFixedHeat extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: OptMapPluginFixedHeat);
    private fixedHeat: MapCanvasFixedHeat;
    /**
     * 外部设置热力数据
     * @param data [经度, 纬度, 强度]
     */
    public setData(data: [number, number, number][]): void;
    /**静态数据层 */
    protected override renderFixedData(): void;
    /**动态数据层 */
    protected override renderAnimation(time?: number): void;
  }
  /**
   * 地图canvas动态箭头线插件
   * @extends MapCanvasLayer
   * @constructor
   * @param {SLUMap} sluMap
   * @param {OptMapPluginArrowLine} arrowLineOption
   */
  export class MapPluginArrowLine extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: OptMapPluginArrowLine);
    /**箭头线实例 */
    private arrowLine: MapCanvasArrowLine;
    /**设置所有线数据
     * @param lines 箭头线数据
     */
    public setAllLines(lines: MapLine[]): void;
    /**
     * 图层是否在移动 高德默认每次渲染更新像素坐标
     * leaflet 图层移动不更新像素坐标 高德 图层移动更新像素坐标
     * 高德地图移动画布和地图同步偏移，leaflet画布固定 地图偏移 的区别
     * 所以防止leaflet移动过程二次偏移 以及高德移动过程坐标未更新导致画布和容器相对位置发生偏移
     * */
    private isDrag: boolean;
    /**渲染固定数据 */
    protected override renderFixedData(): void;
    /**渲染动态数据
     * @param time 时间戳
     */
    protected override renderAnimation(time?: number): void;
    /**控制地图监听事件 拖拽不允许更新动画
     * @param map 地图实例
     * @param key 事件类型
     */
    protected addMapEvents(map: LMap | AMap | MaplibreMap, key: "on" | "off"): void;
    /**拖拽结束，开始绘制 */
    private drawStart(): void;
    /**拖拽开始，结束绘制 */
    private drawEnd(): void;
  }
  /**大数据绘制 优化处理
   * @extends MapPluginDraw
   * @param sluMap 地图实例
   * @param options 大数据绘制选项
   * 划分网格 同网格内设置最大图标数量
   * 超出不绘制 减少画布渲染次数
   */
  export class MapPluginBigData extends MapPluginDraw {
    constructor(sluMap: SLUMap, options: OptBigData);
    /**R树搜索 绘制 */
    private rbush: RBush<MapRbush<MapImageRender>>;
    /**R树搜索 矩形 */
    private readonly rbush_search: BBox;
    /**R树搜索 数据 */
    private rbushData: MapRbush[];
    /**大数据绘制图标 */
    private bigDataImgs: MapImage[];
    /**已渲染的图标 用于事件添加 */
    private _renderBigDataImgs: MapImageEvent[];
    /**大数据绘制选项 */
    private bigDataOption: OptBigData;
    /**大数据绘制图标 用于事件添加 */
    get renderBigDataList(): MapImageEvent[];
    /**绘制大量图标 rbush筛选重叠优化
     * @param imgs 图标数组
     */
    public setbigDataImgs(imgs: MapImage[]): void;
    /**重设rbush */
    private resetRbush(): void;
    /**
     * 将画布划分为多个矩形
     * 矩形内限制最大重叠图形，超出不绘制
     */
    private handleOverlapImage(): void;
    /**
     * 根据图层缩放 获取配置
     * @param zoom
     * @returns { maxCount: number; minBound?: [number, number]; }
     */
    private getZoomOption(zoom: number): { maxCount: number; minBound?: [number, number]; };
    /**图片转化为rbush数据格式
     * @param img 图标
     * @returns rbush数据格式
     */
    private transformRbush(img: MapImage): MapRbush<MapImage>;
    /**绘制所有需要绘制的类
     * @returns MapPluginBigData实例
     */
    public drawMapAll(): this;
  }
  /**用于绘制地图上的粒子效果
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap 地图实例
 * @param options 地图初始化参数
 */
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
    private _allParticle: (DataMapParticle & CanvasPosition)[];
    /**设置所有粒子数据
     * @param particles 粒子数据
     */
    public setAllParticles(particles: (DataMapParticle & CanvasPosition)[]): void;
    /**渲染动态数据
     * @param time 时间戳
     */
    protected renderAnimation(time?: number): void;
    /**动画循环 */
    private _animat(): void;
    /**绘制粒子效果 */
    private _drawParticles(): void;
    /**获取当前贝塞尔曲线的粒子点位
     * @param particle 粒子数据
     */
    private genCurBezierPoints(particle: DataMapParticle & CanvasPosition): void;
    /**绘制粒子
     * @param particle 粒子数据
     */
    private drawParticle(particle: DataMapParticle): void;
    /**控制地图监听事件 拖拽不允许更新动画
     * @param map 地图实例
     * @param key 事件类型
     */
    protected addMapEvents(map: LMap | AMap | MaplibreMap, key: "on" | "off"): void;
    /**拖拽结束，开始绘制 */
    private drawStart(): void;
    /**拖拽开始，结束绘制 */
    private drawEnd(): void;
  }
  /**雷达绘制插件
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap 地图实例
 * @param options 雷达绘制配置
 * */
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
    /**重设雷达绘制类
     * @param radars 雷达绘制数据
     * @returns MapPluginRadar实例
     */
    public setAllRadars(radars: OptMapPluginRadar[]): MapPluginRadar;
    /**添加雷达绘制类
     * @param radar 雷达绘制数据
     * @returns MapPluginRadar实例
     */
    public addRadar(radar: OptMapPluginRadar): MapPluginRadar;
    /**渲染静态标绘图层 */
    protected override renderFixedData(): void;
    /**渲染动画
     * @param time 时间戳
     */
    protected override renderAnimation(time?: number): void;
    /**控制地图监听事件 拖拽不允许更新动画
   * @param map 地图实例
   * @param key 事件类型
   */
    protected addMapEvents(map: LMap | AMap | MaplibreMap, key: 'on' | 'off'): void;
    /**拖拽结束，开始绘制 */
    private drawStart(): void;
    /**拖拽开始，结束绘制 */
    private drawEnd(): void;
  }
  /**海岸线Mask生成器: bbox裁剪、自动按zoom切换海岸线精度
 * @constructor
 * @param sources 海岸线数据源
 * @param map 地图实例
 * 适用于：
 * - 风浪流裁剪
 * - 海洋粒子遮罩
 * - 海岸线mask
 * - 气象海洋渲染
 */
  export class PluginCoastlineMask {
    constructor(sources: DataCoastline[], map: AMAP.Map | LMap | MaplibreMap);
    /**地图实例 */
    private map: AMAP.Map | LMap | MaplibreMap;
    /**海岸线数据源 */
    private sources: DataCoastline[];
    /**canvas缓存 */
    private cacheCanvas: HTMLCanvasElement | null;
    /**缓存key */
    private cacheKey;
    /**世界复制偏移(低zoom会出现世界复制，所以海岸线也需要同步复制) */
    private readonly worldOffsets;
    /**获取mask
     * @param bbox 经纬度bbox
     * @param zoom 缩放层级
     * @param width canvas宽度
     * @param height canvas高度
     * @returns mask canvas
     */
    public getMask(bbox: BBox, zoom: number, width: number, height: number): HTMLCanvasElement;
    /**根据zoom选择海岸线数据
     * @param zoom 缩放层级
     * @returns 海岸线数据源
     */
    private pickSource(zoom: number): DataCoastline;
    /**标准化经度 转换到：[-180, 180]
     * @param lng 经度
     * @returns 标准化后的经度
     */
    private normalizeLng(lng: number): number;
    /**标准化bbox 如：[220, ... ,260]=>[-140, ... ,-100]
     * @param bbox 经纬度bbox
     * @returns 标准化后的经纬度bbox
     */
    private normalizeBBox(bbox: BBox): BBox;
    /**bbox裁剪GeoJSON
     * @param geojson GeoJSON数据
     * @param bbox 经纬度bbox
     * @returns 裁剪后的GeoJSON数据
    */
    private clipGeoJSON(geojson: GeoJSON.FeatureCollection, bbox: BBox): GeoJSON.FeatureCollection;
    /**构建mask canvas
     * @param width canvas宽度
     * @param height canvas高度
     * @param geojson GeoJSON数据
     * @returns mask canvas
     */
    private buildMaskCanvas(width: number, height: number, geojson: GeoJSON.FeatureCollection): HTMLCanvasElement;
    /**绘制polygon
     * @param ctx canvas上下文
     * @param coordinates polygon坐标
     */
    private drawPolygon(ctx: CanvasRenderingContext2D, coordinates: number[][][]): void;
    /**构建缓存key,带容差：避免拖动1px就重建 
     * @param bbox 经纬度bbox
     * @param zoom 缩放级别
     * @param width canvas宽度
     * @param height canvas高度
     * @returns 缓存key
    */
    private buildCacheKey(bbox: BBox, zoom: number, width: number, height: number): string;
    /**清除缓存 */
    public clearCache(): void;
  }
  /**
 * 色斑图插件（CPU栅格填色）
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap - SLUMap实例
 * @param options - 配置项
 * @param mask - 海岸线Mask /可选
 *
 * 功能：
 * 1. 渲染海浪/风场/流场等栅格数据
 * 2. Worker异步计算颜色
 * 3. Canvas绘制
 * 4. 海岸线Mask裁剪
 *
 * 适用于：
 * - 海浪
 * - 海流
 * - 风场
 * - 温度场
 * - 盐度场
 * - 任意规则经纬度栅格
 */
  export class MapPluginGridRender extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options: Partial<OptMapGrid>, mask?: PluginCoastlineMask);
    /**Worker线程:栅格插值-颜色计算-ImageBitmap生成 */
    private worker: SLUWorker<WorkerInfo, { workerId: number; data: ImageBitmap; }>;
    /**worker任务ID-用于丢弃旧帧 */
    private workerId;
    /**海岸线mask */
    private mask?: PluginCoastlineMask;
    /**离屏canvas */
    private offCanvas: HTMLCanvasElement;
    /**离屏canvas ctx */
    private offCtx: CanvasRenderingContext2D;
    /**栅格值 Float32Array:内存占用低,Worker传输快 */
    private gridData: Float32Array;
    /**栅格有效性mask 0:无效值; 1:有效值 */
    private gridMask: Uint8Array;
    /**经度方向格点数 */
    private nx: number;
    /**纬度方向格点数 */
    private ny: number;
    /**起始经度 */
    private lng0: number;
    /**起始纬度 */
    private lat0: number;
    /**经度步长 */
    private lngΔ: number;
    /**纬度步长 */
    private latΔ: number;
    /**默认配置 */
    public readonly options: OptMapGrid;
    /**设置栅格数据
     * @param datas 栅格数据源
     */
    public setData(datas: DataMapGrid[]): void;
    /**渲染 */
    private render(): void;
    /** worker回调
     * @param res worker结果 
     */
    private workerCb(res: { workerId: number, data: ImageBitmap }): void;
    /**动态像素采样 越大：CPU越低，越模糊
     * @returns 像素采样率
     */
    private getSamplingRate(): number;
    /**经纬度采样步长 越大：CPU越低，经纬度误差越大
     * @returns 经纬度采样步长
     */
    private getGeoStep(): number;
    /**获取当前地图bbox
     * @returns bbox
     */
    private getBBox(): [number, number, number, number];
    /**控制地图监听事件
     * @param map 地图实例
     * @param key 事件类型
     */
    protected addMapEvents(map: L.Map | AMAP.Map | MaplibreMap, key: "on" | "off"): void;
  }
}