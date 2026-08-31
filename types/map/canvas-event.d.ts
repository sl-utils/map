import { MapEventType, MapType } from "../utils";
import { CanvasCursorPosition, CanvasEvent, CanvasEventResponse, CanvasImage, EventType } from "../canvas";
import { MapArc, MapGif, MapImage, MapLine, MapPolygon, MapPosition, MapRect, MapShow, MapTextBase } from ".";
/**地图事件控制类
 * @constructor
 * @param map 地图实例
 */
export declare class MapCanvasEvent {
    constructor(map: MapType);
    /**R树搜索 事件 */
    private rbush;
    /**R树查找对象 */
    private readonly rbush_search;
    /**是否重新开始事件指针变化(使不同canvas的事件指针能正确显示)*/
    private static ifInitCursor;
    /**是否开启事件控制类初始化 */
    private static ifInit;
    /**地图销毁必须调用此方法，否则事件指针会异常 */
    static destory(): void;
    /**地图实例 */
    protected map: MapType;
    /**监听事件 */
    protected _listenCbs: {
        [key in EventType]?: ((e: MapEventResponse<any>) => void)[];
    };
    /**key 防止setEvent清除其他事件 */
    _allMapEvents: Map<string, MapEvent[]>;
    /**Rbush查询子集 */
    private _allRbush;
    /**上一次触发的事件集合 */
    private perEvents;
    /**海图事件回调函数
     * @param e 事件对象
     */
    private cbMapEvent;
    /**事件类型名称集合 */
    private readonly types;
    /** 事件开关
     * @param flag true开启地图事件监听 false关闭地图事件监听
    */
    private _eventSwitch;
    /**重设rbush */
    private resetRbush;
    /**统一监听该类的指定事件
     * @param type 事件类型
     * @param cb 事件回调函数
     */
    on<T extends MapEvent<any>>(type: EventType, cb: (e: MapEventResponse<T>) => void): void;
    /**统一关闭指定事件的监听
     * @param type 事件类型
     * @param cb 事件回调函数
     */
    off<T extends MapEvent<any>>(type: EventType, cb?: (e: MapEventResponse<T>) => void): void;
    /**清空之前设置的统一监听事件 */
    clear(): void;
    /** 设置指定key的事件
     * @param evs 事件集合
     * @param key 事件key
     * 设置key 事件 会覆盖原来的事件
     * 不覆盖使用 pushEventByKey
     *  */
    setEventsByKey<T extends MapEvent>(evs: T[], key: string): void;
    /**清除所有事件 */
    clearAllEvents(): void;
    /**清除指定类型事件
     * @param key 事件key
     */
    clearEventsByKey(key: string): void;
    /**添加一个事件
     * @param key 事件key
     * @param ev 事件对象
     * 尽量使用setEventsByKey
     * 或者pushEventByKey数组 而不是for 一个个push
     * 不然每次for循环push都会重新构造rbush
     *  */
    pushEventByKey<T extends MapEvent>(key: string, ev: T | T[]): void;
    /**添加事件
     * @param ev 事件对象
     */
    private handleTransform;
    /**转换添加事件
     * @param event 事件对象
     */
    private transformEvent;
    /**转为Rbush数据格式
     * @param event 事件对象
     */
    private transformRbush;
    /**准备触发事件
    * @param e 地图事件
    */
    private triggerEvent;
    /**获取指针触发范围内的事件
     * @param e 地图事件
     * @returns MapEventRange
     */
    private getEventsByRange;
    /**通过事件类型执行回调函数
     * @param resp 事件响应对象
     * @param type 事件类型
    */
    private doCbByEventType;
}
/**rbush空间索引查询类 */
export interface MapRbush<T = any> {
    /**最小X坐标 */
    minX: number;
    /**最小Y坐标 */
    minY: number;
    /**最大X坐标 */
    maxX: number;
    /**最大Y坐标 */
    maxY: number;
    /**经纬度 [lng, lat] */
    lnglat: [number, number];
    /**关联的数据 */
    data: T;
}
/**地图上的事件类型，继承自CanvasEvent并添加地图位置和显示配置 */
export type MapEvent<T extends MapEvent = any, I = any> = CanvasEvent<T, I> & MapPosition & MapShow;
/**带事件的地图图片类 @template I 标识图片携带的info的类型 */
export type MapImageEvent<I = any> = MapImage<I> & MapEvent<MapEvent, I>;
/**地图上带事件的图片渲染类型 */
export type MapImageRender = MapImageEvent & CanvasImage;
/**带事件的地图文本类 @template I 标识文本携带的info的类型 */
export type MapTextEvent<I = any> = MapTextBase<I> & MapEvent<MapEvent, I> & MapPosition;
/**带事件的地图圆点类 @template I 标识圆点携带的info的类型 */
export type MapArcEvent<I = any> = MapArc & MapEvent<MapEvent, I>;
/**带事件的地图矩形类 @template I 标识矩形携带的info的类型 */
export type MapRectEvent<I = any> = MapRect & MapEvent<MapEvent, I>;
/**带事件的地图多边形类 @template I 标识多边形携带的info的类型 */
export type MapPolygonEvent<I = any> = MapPolygon & MapEvent<MapEvent, I>;
/**带事件的地图线条类 @template I 标识线条携带的info的类型 */
export type MapLineEvent<I = any> = MapLine & MapEvent<MapEvent, I>;
/**带事件的地图Gif类 @template I 标识Gif携带的info的类型 */
export type MapGifEvent<I = any> = MapGif<I> & MapEvent<MapEvent, I>;
/**地图鼠标事件 */
export interface MapMouseEvent {
    /**事件类型 */
    type: EventType;
    /**事件位置信息 */
    latlng: {
        lat: number;
        lng: number;
    };
    /**事件容器位置 */
    containerPoint: {
        x: number;
        y: number;
    };
    /**原始DOM事件 */
    orginDOMEvent: MouseEvent;
    /**原始地图事件 */
    orginMapEvent: MapEventType;
}
/**地图事件触发时的响应对象 @template T 挂载此次事件的对象(MapImage|MapArc|Event) @template I 对象携带的相关数据 */
export type MapEventResponse<T extends MapEvent = MapEvent, I = any> = CanvasEventResponse<T, I> & {
    /**事件位置信息，包含经纬度 */
    position: MapCursorPosition;
};
/**地图事件触发时的范围，包含当前事件、进入事件和离开事件 */
export interface MapEventRange {
    /**当前事件 */
    curEvents: MapEventResponse[];
    /**进入事件 */
    enterEvents: MapEventResponse[];
    /**离开事件 */
    leaveEvents: MapEventResponse[];
}
/**地图事件触发时鼠标位置发出的信息，继承自CanvasCursorPosition并添加经纬度 */
export interface MapCursorPosition extends CanvasCursorPosition {
    /**地图事件所定义的经纬度 [lng, lat] */
    lnglat: [number, number];
}
/**高德地图地图插件原生事件触发后发出的对象 */
export interface AMapMapsEvent {
    /**事件位置信息 */
    lnglat: {
        Q: number;
        R: number;
        lng: number;
        lat: number;
    };
    /**原始DOM事件 */
    originEvent: MouseEvent;
    /**事件容器位置 */
    pixel: {
        x: number;
        y: number;
    };
    /**事件类型 */
    type: EventType;
}
