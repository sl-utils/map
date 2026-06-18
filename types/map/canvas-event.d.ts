import { MapEventType, MapEventResponse, MapEvent } from "../types";
import { Map as LMap } from "leaflet";
import { Map as MaplibreMap } from 'maplibre-gl';
/**地图事件控制类
 * @constructor
 * @param map 地图实例
 */
export declare class MapCanvasEvent {
    constructor(map: AMAP.Map | LMap | MaplibreMap);
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
    protected map: AMAP.Map | LMap | MaplibreMap;
    /**监听事件 */
    protected _listenCbs: {
        [key in MapEventType]?: ((e: MapEventResponse<any>) => void)[];
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
    on<T extends MapEvent<any>>(type: MapEventType, cb: (e: MapEventResponse<T>) => void): void;
    /**统一关闭指定事件的监听
     * @param type 事件类型
     * @param cb 事件回调函数
     */
    off<T extends MapEvent<any>>(type: MapEventType, cb?: (e: MapEventResponse<T>) => void): void;
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
