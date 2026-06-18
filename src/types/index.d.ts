
/**! ------------------Canvas相关----------------------- */
import type { Map as AMap, CustomLayerOption, CustomLayer, LngLat } from './amap';
import type { Map as LMap, LeafletMouseEvent, Layer, LatLng, LayerOptions, ZoomAnimEvent } from 'leaflet'
import type { Map as MaplibreMap, MapMouseEvent as MaplibreMouseEvent, LngLat as MaplibreLngLat, CustomLayerInterface, StyleSpecification } from 'maplibre-gl';


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
type MapEventType = 'unset' | 'click' | 'dblclick' | 'mousemove' | 'mousedown' | 'mouseup' | 'mouseleave' | 'mouseenter' | 'rightclick';
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
    textPanel?: CanvasTextPanel;
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

