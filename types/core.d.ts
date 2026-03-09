/**-------------------------------工具类 canvas 类型文件-------------------------------*/
type GlobalCompositeOperationSelf = 'color' | 'color-burn' | 'color-dodge' | 'copy' | 'darken' | 'destination-atop' | 'destination-in' | 'destination-out' | 'destination-over' | 'difference' | 'exclusion' | 'hard-light' | 'hue' | 'lighten' | 'lighter' | 'luminosity' | 'multiply' | 'overlay' | 'saturation' | 'screen' | 'soft-light' | 'source-atop' | 'source-in' | 'source-out' | 'source-over' | 'xor';
/**canvas相关的配置项 */
interface SLPCanvas {
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
interface CanvasPoint {
    /**映射到canvas上的位置 [x,y] */
    point: [number, number];
    /**映射到canvas上的多个位置 [x,y][] */
    points?: [number, number][];
}
/**多点位 */
interface CanvasPoints {
    /**映射到canvas上的位置 [x,y] */
    point?: [number, number];
    /**映射到canvas上的多个位置 [x,y][] */
    points: [number, number][];
}
/**图片的基本配置 */
interface CanvasImage<I = any> {
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
interface CanvasGif<I = any> extends CanvasImage<I> {
    /**id必传且唯一，用于后续关闭之前绘制的动画 */
    id: string;
    delay?: number;
}
/**文本绘制 */
interface CanvasTxt<I = any> extends SLPCanvas {
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
interface CanvasTextPanel extends SLPCanvas {
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
interface CanvasArc<I = any> extends SLPCanvas {
    /**圆半径 */
    size?: number;
    /**通过该信息可决定其他情况 */
    info?: I;
}
/**矩形渲染 */
interface CanvasRect_<I = any> extends SLPCanvas {
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
interface CanvasPolygon<I = any> extends SLPCanvas {
    /**通过该信息可决定其他情况 */
    info?: I;
}
/**线渲染 */
interface CanvasLine<I = any> extends SLPCanvas {
    /**贝塞尔曲线的曲度 数值越大越弯曲 */
    degree?: number;
    /**通过该信息可决定其他情况 */
    info?: I;
}

/**canvas绘图类型空间 */

interface SLPMapOpt {
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
declare namespace SLTCanvas {
    /**canvse上的点位信息 */
    type Point = CanvasPoint | CanvasPoints;
    /**canvas渲染的图片类 @param T 标识该图片携带的info的类型  事件响应时将挂载在MapEventResponse的info上*/
    type Image<I = any> = CanvasImage<I> & (CanvasPoint | CanvasPoints);
    /**canvas渲染的文本类 */
    type Text<I = any> = CanvasTxt<I> & (CanvasPoint | CanvasPoints);
    /**canvas渲染的圆点类 */
    type Arc<I = any> = CanvasArc<I> & (CanvasPoint | CanvasPoints);
    /**canvas渲染的矩形类 */
    type Rect<I = any> = CanvasRect_<I> & (CanvasPoint | CanvasPoints);
    type TextRect<I = any> = CanvasTxt<I> & CanvasRect_<I> & {
        x: number;
        y: number;
    };
    /**canvas渲染的多边形类 */
    type Polygon<I = any> = SLPCanvas & CanvasPoints;
    /**canvas渲染的线条类 */
    type Line<I = any> = CanvasLine<I> & CanvasPoints;

    type Event1<T extends Event = any, I = any> = Point & {
        /**事件类型(挂在单个事件) */
        type: SLTEventType | SLTEventType[];
        /**申明事件特殊回调(不写则运用类里面的cb函数) */
        cb?: (e: EventResponse<T, I>) => void;
        /**申明事件特殊回调(挂多个事件的不同响应) */
        cbs?: { [key in SLTEventType]: (e: EventResponse<T, I>) => void };
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
    /**Canvas事件相关类 */
    interface Event<T extends Event = any, I = any> {
        /**映射到canvas上的位置 [x,y] */
        point?: [number, number];
        /**映射到canvas上的多个位置 [x,y][] */
        points?: [number, number][];
        /**事件类型(挂在单个事件) */
        type: SLTEventType | SLTEventType[];
        /**申明事件特殊回调(不写则运用类里面的cb函数) */
        cb?: (e: EventResponse<T, I>) => void;
        /**申明事件特殊回调(挂多个事件的不同响应) */
        cbs?: { [key in SLTEventType]: (e: EventResponse<T, I>) => void };
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
    /**事件触发时的响应对象 T事件对象  I为事件对象携带的信息*/
    interface EventResponse<T = Event, I = any> {
        /**事件类型 */
        type: SLTEventType;
        /**事件位置信息 */
        position: CursorInfo;
        /**鼠标信息 */
        cursor: CursorInfo;
        /**事件对象 CanvasEvent | Map*/
        event: T;
        /**事件挂载的相关info */
        info: I;
    }
    /**事件触发时鼠标位置的信息 */
    interface CursorInfo {
        /**在canvas上的位置[x,y] */
        point: [number, number];
        /**在整个网页的位置[x,y] */
        page: [number, number];
    }
}




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


///地图相关类型设置


/**-------------------------------工具类 地图扩展类型文件   ω 工具类内部使用-------------------------------*/
/**地图扩展 */
/**事件类型 */
declare type SLTEventType = 'unset' | 'click' | 'dblclick' | 'mousemove' | 'mousedown' | 'mouseup' | 'mouseleave' | 'mouseenter' | 'rightclick';
/**抛出给地图扩展的图片类 由于地图size可能采用固定m为单位，故采用不限定size的_BaseImage*/
type ωCanvasMapImage<I = any> = CanvasImage<I>;
/**抛出给地图扩展的Gif类 由于地图size可能采用固定m为单位，故采用不限定size的_BaseGif*/
type ωCanvasMapGif<I = any> = CanvasGif<I>;
/**显示的相关配置 */
interface MapShow {
    /**显示的最大地图级别(包含此级别) */
    maxZoom?: number,
    /**显示的最小地图级别(包含此级别) */
    minZoom?: number,
    /**绘制层级，类似z-index */
    index?: number,
}
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
interface MapSize {
    size: [number, number] | number
    sizeFix?: [number, number] | number
}
/**地图上的大小（米） */
interface MapSizeFix {
    size?: [number, number] | number
    sizeFix: [number, number] | number
}

type MM<T extends MapEvent = any, I = any> = SLTCanvas.Event1 | (MapPoint | MapPoints) & {
    /**事件可触发的层级范围 */
    minZoom?: number;
    maxZoom?: number;
    /**此事件对象的特殊回调(不写则运用类里面的cb函数) */
    cb?: (e: MapEventResponse<T, I>) => void;
    /**申明事件特殊回调(挂多个事件的不同响应) */
    cbs?: { [key in SLTEventType]: (e: MapEventResponse<T, I>) => void; };
}



/** 地图上的事件 */
interface MapEvent<T extends MapEvent = any, I = any> extends SLTCanvas.Event<T, I> {
    /**事件所在纬经度(恒定不变) */
    latlng?: [number, number];
    latlngs?: [number, number][];
    /**事件可触发的层级范围 */
    minZoom?: number;
    maxZoom?: number;
    /**此事件对象的特殊回调(不写则运用类里面的cb函数) */
    cb?: (e: MapEventResponse<T, I>) => void;
    /**申明事件特殊回调(挂多个事件的不同响应) */
    cbs?: { [key in SLTEventType]: (e: MapEventResponse<T, I>) => void; };
}
/**地图事件触发时的响应对象 T为挂载此次事件的对象(MapImage|MapArc|Event),I为对象携带的相关数据*/
interface MapEventResponse<T extends MapEvent = MapEvent, I = any> extends SLTCanvas.EventResponse<T, I> {
    /**鼠标信息 */
    cursor: MapCursorInfo;
    /**事件位置信息 */
    position: MapCursorInfo;
    /**事件的相关信息 */
    event: T
}
/**地图事件触发时鼠标位置发出的信息 */
interface MapCursorInfo extends SLTCanvas.CursorInfo {
    /**鼠标指针所在的纬经度 [lat,lng] */
    latlng: [number, number];
}
/**地图上的图片(无事件)*/
type MapImage<I = any> = CanvasImage<I> & MapShow & (MapPoint | MapPoints) & (MapSize | MapSizeFix);
/**带事件的图片类 */
type MapImageEvent<I = any> = MapImage<I> & MapEvent<MapImageEvent<I>, I>;
/**地图上的Gif(无事件)*/
type MapGif<I = any> = ωCanvasMapGif<I> & MapShow & (MapPoint | MapPoints) & (MapSize | MapSizeFix);
/**带事件的Gif类 */
type MapGifEvent<I = any> = MapGif<I> & MapEvent<MapGifEvent<I>, I>;
/**不带事件的地图文本类 */
type MapText = CanvasTxt & MapShow & (MapPoint | MapPoints);
/**带事件的地图文本类 */
type MapTextEvent<I = any> = Text & MapEvent<MapTextEvent<I>, I>;
/**不带事件的圆点类 */
type MapArc = CanvasArc & MapShow & (MapPoint | MapPoints) & (MapSize | MapSizeFix);
/**带事件的圆点类 */
type MapArcEvent<I = any> = MapArc & MapEvent<MapArcEvent<I>, I>;
/**不带事件的矩形 */
type MapRect = CanvasRect_ & MapShow & MapPoints;
/**带事件的矩形类 */
type MapRectEvent<I = any> = MapRect & MapEvent<MapRectEvent<I>, I>;
/**不带事件的地图多边形类 */
type MapPolygon = CanvasPolygon & MapShow & MapPoints;
/**带事件的地图多边形类 */
type MapPolygonEvent<I = any> = MapPolygon & MapEvent<MapPolygonEvent<I>, I>;
/**不带事件的地图线条类 */
type MapLine = CanvasLine & MapShow & MapPoints;
/**带事件的地图线条类 */
type MapLineEvent<I = any> = MapLine & MapEvent<MapLineEvent<I>, I>;
/**地图类型定义 */
declare namespace SLTMap {
    /**不带事件的图片类 */
    type Image<I = any> = MapImage<I>;
    /**不带事件的Gif类 */
    type Gif<I = any> = MapGif<I>;
    /**不带事件的地图文本类 */
    type Text = MapText;
    /**不带事件的圆点类 */
    type Arc = MapArc;
    /**不带事件的矩形 */
    type Rect = MapRect;
    /**不带事件的地图多边形类 */
    type Polygon = MapPolygon;
    /**不带事件的地图线条类 */
    type Line = MapLine;
    /**带事件的图片类 */
    type ImageEvent<I = any> = MapImageEvent<I>;
    /**带事件的Gif类 */
    type GifEvent<I = any> = MapGifEvent<I>;
    /**带事件雷达扫描类 */
    type RadarScanEvent<I = any> = MapRadarScanEvent<I>;
    /**带事件的地图文本类 */
    type TextEvent<I = any> = MapTextEvent<I>;
    /**带事件的圆点类 */
    type ArcEvent<I = any> = MapArcEvent<I>;
    /**带事件的矩形类 */
    type RectEvent<I = any> = MapRectEvent<I>;
    /**带事件的地图多边形类 */
    type PolygonEvent<I = any> = MapPolygonEvent<I>;
    /**带事件的地图线条类 */
    type LineEvent<I = any> = MapLineEvent<I>;
    /**地图事件触发时鼠标位置发出的信息 */
    type CursorInfo = MapCursorInfo;
    /** 地图事件 */
    type Event<T extends Event = any, I = any> = MapEvent<T, I>;
    /**地图事件触发时的响应对象 T为挂载此次事件的对象(MapImage|MapArc|Event),I为对象携带的相关数据*/
    type EventResponse<T extends Event = Event, I = any> = MapEventResponse<T, I>;
}


interface MapTrackPara extends MapCanvasPara {
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
/**-----------------------------画布的部分配置---------------------------- */
interface MapCanvasPara extends L.LayerOptions {
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

/**地图插件原生事件触发后发出的对象 */
declare interface AMapMapsEvent {
    lnglat: { Q: number, R: number, lng: number, lat: number }
    originEvent: MouseEvent,
    pixel: { x: number, y: number }
    type: SLTEventType
}
declare interface SLPAMapLayer extends AMAP.CustomLayerOption {
    /**添加增加动画画布 =>*/
    aniCanvas?: boolean;
}
/** 0 leaflet 1 高德 2 百度 js类型 */
declare type MapType = 0 | 1 | 2
/** type 0 1 2 转化为对应库的类型 2百度地图 暂时不支持 */
declare type TypeToMap<T extends MapType> = T extends 0 ? L.Map : T extends 1 ? AMAP.Map : never
/**地图工具类命名空间 */
declare namespace MapUtils {
    type MapOrginEvent<T> = T extends AMAP.Map ? AMapMapsEvent : T extends L.Map ? L.LeafletEvent : never;
    /**
     * 地图相关事件内置转化为对应库的事件 需要传入 type 0 | 1 | 2
     */
    interface MapEventResponse<R> {
        /**事件类型 mousemove等 */
        type: string;
        latlng: { lat: number, lng: number };
        /**画布的位置 */
        containerPoint: { x: number, y: number };
        /**库内置原始事件 */
        orginMapEvent: MapOrginEvent<R>;
        /**dom原生事件 */
        orginDOMEvent: MouseEvent;
    }

}

/**rbush 查询类*/
declare interface SLTRbush<T = any> {
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
    data: T
}













/**--------------------------------------------------------------地图扩展插件相关类型---------------------------------------------------- */




/**------雷达的配置（单个） ---- */
type MapPluginRadarPara<I = any> = {
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
} & MapShow & MapPoint & MapSizeFix;
/**带事件的雷达扫描类 */
type MapRadarScanEvent<I = any> = MapPluginRadarPara<I> & MapEvent<MapRadarScanEvent<I>, I>;

/**------地图轨迹相关------------*/
/**轨迹必要的数据 */
interface MapTrackGroup<T = any> {
    /**唯一标识 */
    id: string;
    /**轨迹名 */
    name: string;
    /**轨迹 */
    data: MapTrackItem[];
    /**原始数据源 */
    orginData: T
}
/**轨迹必要的数据 */
interface MapTrackItem {
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

/**!------------------标绘相关类型----------------- */
/**标绘的类型 */
type MapPlotType = 'point' | 'line' | 'polygon' | 'circle' | 'rect';
// /**标绘的信息 */
type MapPlotInfo<T extends MapPlotType = MapPlotType> = SLPCanvas & {
    /**名称 */
    name?: string;
    /**是否隐藏 */
    ifHide?: boolean;
    /**是否是编辑状态 */
    ifEdit?: boolean;
} & MapPlotDetailType<T>
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








/**地图类型定义 */
declare namespace SLTMap {
    /**雷达 */
    namespace Radar {
        /**雷达的配置(单个雷达也可以是整个绘制类) */
        type Para = MapPluginRadarPara;

    }

    /**热力图插件 */
    namespace Heat {
        /**粒子信息 */
        interface Info {
            latlng: [number, number]
            /**权重 */
            weight?: number
        }
    }
    /**粒子插件 */
    namespace Particle {
        /**粒子信息 */
        interface Info extends Line {
            /**canvas上对应的坐标 */
            points?: [number, number][];
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
    }

    /**标绘插件 */
    namespace Plot {
        /**标绘类型 point点 line线 polygon多边形 circle圆形 rect矩形*/
        type Type = 'point' | 'line' | 'polygon' | 'circle' | 'rect';
        /**标绘的信息 */
        type Info = MapPlotInfo;
    }
    /**轨迹插件 */
    namespace Track {
        /**地图轨迹信息 */
        type Info<T = any> = MapTrackInfo<T>;
        type PointInfo = MapTrackPointInfo;
    }
}


/**地图配置项 */
declare namespace SLPMap {
    /**canvas画布的部分配置 */
    type Canvas = MapCanvasPara;
    /**雷达的配置项 */
    type Radar = MapPluginRadarPara;


    /**标绘类的配置项 */
    interface Plot extends Canvas, SLPCanvas { }
    /**热力图类的配置项*/
    interface Heat extends Canvas {
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
    /**测距类的配置项 */
    interface Range extends Canvas {
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
    /**轨迹类的配置项 */
    interface Track extends MapTrackPara { }
    /**风速风向配置 */
    interface Wind extends Canvas {
        /**风速风向雪碧图地址 */
        url: string;
        /**风速风向雪碧图宽高 */
        size: [number, number];
        /**风速风向雪碧图原始大小 */
        sizeo: [number, number];
        /**不同层级下的大小 */
        zooMsize: [number, number][];
    }
    interface ArrowLine extends Canvas, SLDMap.ArrowLine {
        /**样式配置 */
        fillColor?: string
        strokeColor?: string
        imgUrl?: string
    }
}
/**-----------------------------各插件数据格式---------------------------- */
declare namespace SLDMap {
    /**风速风向数据类型 */
    interface Wind {
        /**纬度经度 */
        latlng: [number, number]
        /**风速 */
        speed: number;
        /**风向 */
        direction: number;
    }
    /**动态线条 */
    interface ArrowLine {
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
}



/**-----------------------------grid数据格式-------------------------start--- */
/**数据信息 */
interface SLDMapGrid {
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
    header: SLDMapGridHeader,
    //数据
    data: number[],
}
interface SLDMapGridHeader {
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
interface SLPMapGrid extends SLPMap.Canvas {
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
/**数据信息 */
interface SLDMapGrid {
    //行数
    nx: number;
    //列数
    ny: number;
    //经度差值
    dx: number;
    //纬度差值
    dy: number;
    //起始点经度(左上角)
    sx: number;
    //起始点纬度
    sy: number;
    //()
    nodata: number | undefined;
    //数据缩放比例(scale:0.01,data中数据1,真实数据0.01,减少数据包大小)
    scale: number;
    //每个数据由几个元素组成( 温度 1  , 降雨 1 ， 风速风向(u,v)  2)
    num: number;
    header: SLDMapGridHeader;
    //数据
    data: number[];
}
interface SLDMapGridHeader {
    //行数
    nx: number;
    //列数
    ny: number;
    la1: number;
    lo1: number;
    dx: number;
    dy: number;
    la2: number;
    lo2: number;
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



/**-----------------------------运动粒子类-------------------------start--- */
interface SLPMapVelocity extends SLPMap.Canvas {
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
    data?: SLDVeloctiyWind[];
}
/**配置项 */
interface SLPVelocityWindy {
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
interface SLDVeloctiyWind {
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