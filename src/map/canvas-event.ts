import { MapEventType, MapType, um_arrItemDel, um_getPointByLnglat, um_tsEventisAmap, um_tsEventisLeaflet, um_tsEventisMapLibre, um_tsIsMapEventType, um_tsMapisMapLibre } from "../utils";
import rbush, { BBox } from 'rbush'
import { CanvasCursorPosition, CanvasEvent, CanvasEventResponse, CanvasImage, EventType } from "../canvas";
import { MapArc, MapGif, MapImage, MapLine, MapPolygon, MapPosition, MapRect, MapShow, MapTextBase } from ".";

/**地图事件控制类
 * @constructor
 * @param map 地图实例
 */
export class MapCanvasEvent {
    constructor(map: MapType) {
        this.map = map;
        this._eventSwitch(true);
        this.map.on('moveend', this.resetRbush);
        this.map.on('zoomend', this.resetRbush);
    }
    /**R树搜索 事件 */
    private rbush: rbush<MapRbush<MapEvent>> = new rbush();
    /**R树查找对象 */
    private readonly rbush_search: BBox = Object.create(null);
    /**是否重新开始事件指针变化(使不同canvas的事件指针能正确显示)*/
    private static ifInitCursor: boolean = true;
    /**是否开启事件控制类初始化 */
    private static ifInit: boolean = true;
    /**地图销毁必须调用此方法，否则事件指针会异常 */
    public static destory(): void {
        MapCanvasEvent.ifInit = true;
    }
    /**地图实例 */
    protected map: MapType;
    /**监听事件 */
    protected _listenCbs: { [key in EventType]?: ((e: MapEventResponse<any>) => void)[] } = Object.create(null);
    /**key 防止setEvent清除其他事件 */
    public _allMapEvents: Map<string, MapEvent[]> = new Map();
    /**Rbush查询子集 */
    private _allRbush: MapRbush<MapEvent>[] = [];
    /**上一次触发的事件集合 */
    private perEvents: MapEventResponse[] = [];
    /**海图事件回调函数
     * @param e 事件对象
     */
    private cbMapEvent = (e: MapEventResponse): void => {
        let { cb, cbs } = e.event;
        if (cb) { cb(e); return; }
        if (cbs) { cbs[e.type]?.(e); return }
        /**响应的事件类型集合 */
        let _cbs = this._listenCbs[e.type] || [];
        _cbs.map(cb => cb(e));
    };
    /**事件类型名称集合 */
    private readonly types = ['click', 'dblclick', 'mousemove', 'mousedown', 'mouseup', 'rightclick'];
    /** 事件开关 
     * @param flag true开启地图事件监听 false关闭地图事件监听
    */
    private _eventSwitch(flag: boolean): void {
        if (MapCanvasEvent.ifInit) {
            MapCanvasEvent.ifInit = false;
            this.map.on('mousemove', () => { MapCanvasEvent.ifInitCursor = true })
        }
        this.types.forEach(e => {
            this.map[flag ? 'on' : 'off'](e, this.triggerEvent)
        })
    }
    /**重设rbush */
    private resetRbush = (): void => {
        if (this.rbush) this.rbush.clear();
        // 先暂时取消监听所有事件
        this._eventSwitch(false);
        this._allRbush.length = 0;
        this._allMapEvents.forEach(evs => {
            evs.forEach(ev => {
                this.transformRbush(ev);
            })
        })
        this.rbush.load(this._allRbush);
        // 设置完成重新监听
        this._eventSwitch(true);
    }
    /**统一监听该类的指定事件
     * @param type 事件类型
     * @param cb 事件回调函数
     */
    public on<T extends MapEvent<any>>(type: EventType, cb: (e: MapEventResponse<T>) => void): void {
        let cbs = this._listenCbs[type] = this._listenCbs[type] || [];
        cbs.push(cb);
    }
    /**统一关闭指定事件的监听
     * @param type 事件类型
     * @param cb 事件回调函数
     */
    public off<T extends MapEvent<any>>(type: EventType, cb?: (e: MapEventResponse<T>) => void): void {
        let cbs = this._listenCbs[type] = this._listenCbs[type] || [];
        if (cb) {
            um_arrItemDel(cbs, cb);
        } else {
            this._listenCbs[type].length = 0;
        }
    }
    /**清空之前设置的统一监听事件 */
    public clear(): void {
        this._listenCbs = Object.create(null);
    }
    /** 设置指定key的事件
     * @param evs 事件集合
     * @param key 事件key
     * 设置key 事件 会覆盖原来的事件 
     * 不覆盖使用 pushEventByKey
     *  */
    public setEventsByKey<T extends MapEvent>(evs: T[], key: string): void {
        /**ifHide不显示,事件就不添加 */
        this._allMapEvents.set(key, evs.filter(ev => !ev.ifHide));
        this._allRbush.length = 0;
        this.rbush.clear();
        // map所有事件
        this._allMapEvents.forEach((evs) => {
            evs.forEach(e => this.handleTransform(e));
        });
        this.rbush.load(this._allRbush);
    }
    /**清除所有事件 */
    public clearAllEvents(): void {
        this._allMapEvents.clear();
        this._allRbush.length = 0;
        this.rbush.clear();
    }
    /**清除指定类型事件
     * @param key 事件key
     */
    public clearEventsByKey(key: string): void {
        this.setEventsByKey([], key);
    }
    /**添加一个事件
     * @param key 事件key
     * @param ev 事件对象
     * 尽量使用setEventsByKey 
     * 或者pushEventByKey数组 而不是for 一个个push
     * 不然每次for循环push都会重新构造rbush
     *  */
    public pushEventByKey<T extends MapEvent>(key: string, ev: T | T[]): void {
        if (!this._allMapEvents.has(key)) this._allMapEvents.set(key, []);
        const eves = this._allMapEvents.get(key);
        Array.isArray(ev) ? eves.push(...ev) : eves.push(ev);
        this.setEventsByKey(eves, key);
    }
    /**添加事件
     * @param ev 事件对象
     */
    private handleTransform<T extends MapEvent>(ev: T): void {
        this.transformEvent(ev);
        this.transformRbush(ev);
    }
    /**转换添加事件
     * @param event 事件对象
     */
    private transformEvent<T extends MapEvent>(event: T): void {
        /**ifHide不显示,事件就不添加 */
        if (event.ifHide === true) return;
        let ev: MapEvent = {
            lnglat: event.lnglat || undefined,
            lnglats: event.lnglats || [],
            type: event.type,
            info: event.info,
            cb: event.cb
        }
        // let ev = this.genDefaultMapEvent(event, event)
    }
    /**转为Rbush数据格式
     * @param event 事件对象
     */
    private transformRbush<T extends MapEvent>(event: T): void {
        /**ifHide不显示,事件就不添加 */
        if (event.ifHide === true) return;
        let { range = [5, 5], lnglat, lnglats = [], left = 0, top = 0 } = event;
        if (lnglat && lnglat.length === 2) lnglats = [...lnglats, lnglat];
        lnglats.forEach(lnglat => {
            let [onX, onY] = um_getPointByLnglat(this.map, lnglat);
            let item: MapRbush = {
                minX: onX - range[0] + left,
                minY: onY - range[1] + top,
                maxX: onX + range[0] + left,
                maxY: onY + range[1] + top,
                data: event,
                lnglat: lnglat,
            }
            this._allRbush.push(item)
        })
    }
    /**准备触发事件 
    * @param e 地图事件
    */
    private triggerEvent = (e: MapEventType): void => {
        let allEvents: MapEvent<any, any>[] = [], el: HTMLElement;
        this._allMapEvents.forEach(eves => {
            allEvents = allEvents.concat(eves);
        });
        if (um_tsMapisMapLibre(this.map)) {
            el = this.map.getCanvasContainer();
        } else {
            el = this.map.getContainer();
        }
        if (!el) return;
        let style = el.style;
        style.cursor = MapCanvasEvent.ifInitCursor ? 'default' : style.cursor;
        if (allEvents.length === 0) return;
        let { curEvents, enterEvents, leaveEvents } = this.getEventsByRange(e);
        enterEvents.forEach(resp => this.doCbByEventType(resp, 'mouseenter'))
        leaveEvents.forEach(resp => this.doCbByEventType(resp, 'mouseleave'))
        this.perEvents = curEvents;
        if (curEvents.length == 0) return
        MapCanvasEvent.ifInitCursor = false;
        style.cursor = 'pointer';
        const type: string = e.type as string;
        um_tsIsMapEventType(type);
        curEvents.forEach(resp => this.doCbByEventType(resp, type));
    };
    /**获取指针触发范围内的事件
     * @param e 地图事件
     * @returns MapEventRange
     */
    private getEventsByRange(e: MapEventType): MapEventRange {
        let x: number = 0, y: number = 0, pageX: number = 0, pageY: number = 0, zoom: number = this.map.getZoom();
        if (um_tsEventisLeaflet(e)) {
            let event = e;
            ({ x, y } = event.containerPoint, { pageX, pageY } = event.originalEvent);
        } else if (um_tsEventisAmap(e)) {
            let event = e;
            ({ x, y } = event.pixel, { pageX, pageY } = event.originEvent);
        } else if (um_tsEventisMapLibre(e)) {
            ({ x, y } = e.point, { pageX, pageY } = e.originalEvent);
        }
        /** curEvents 当前位置存在的所有事件  enterEvents 鼠标首次进入事件集合  leaveEvents 鼠标离开事件集合 */
        let curEvents: MapEventResponse[] = [], enterEvents: MapEventResponse[] = [], leaveEvents: MapEventResponse[] = this.perEvents;
        // rbush查找
        const search = this.rbush_search;
        search.maxX = search.minX = x, search.maxY = search.minY = y;
        let ret = this.rbush.search(search);
        ret.forEach(res => {
            let event: MapEvent = res.data, lnglat = res.lnglat, { minZoom = 1, maxZoom = 50 } = event
            if (minZoom > zoom || maxZoom < zoom) return;
            /**事件位置信息 */
            let position: MapCursorPosition = Object.create(null);
            { }
            position.lnglat = lnglat, position.page = [pageX, pageY], position.point = [x, y];
            /**事件响应对象 */
            let response: MapEventResponse = Object.create(null);
            response.type = 'unset', response.position = position, response.event = event, response.info = event.info;
            curEvents.push(response);
            /**从之前的所有响应对象中查找是否存在位置一样的响应对象 */
            let per = leaveEvents.find(e =>
                e.position.lnglat[0] === lnglat[0] && e.position.lnglat[1] === lnglat[1]
            );
            if (per) {
                /**存在则说明鼠标没有离开,则从离开事件集合中移除 */
                um_arrItemDel(leaveEvents, per)
            } else {
                /**不存在则说明鼠标刚刚进入,则添加到进入事件集合 */
                enterEvents.push(response)
            };
        })
        return { curEvents, enterEvents, leaveEvents }
    }
    /**通过事件类型执行回调函数
     * @param resp 事件响应对象
     * @param type 事件类型
    */
    private doCbByEventType(resp: MapEventResponse, type: EventType): void {
        let types = resp.event.type;
        if (!Array.isArray(types)) types = [types];
        if (!types.includes(type)) return;
        resp.type = type;
        this.cbMapEvent(resp)
    }
}

// =============== 类型约束 ===============

/**rbush空间索引查询类 */
export interface MapRbush<T = any> {
    /**最小X坐标 */
    minX: number,
    /**最小Y坐标 */
    minY: number,
    /**最大X坐标 */
    maxX: number,
    /**最大Y坐标 */
    maxY: number,
    /**经纬度 [lng, lat] */
    lnglat: [number, number],
    /**关联的数据 */
    data: T,
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
    latlng: { lat: number, lng: number };
    /**事件容器位置 */
    containerPoint: {
        x: number;
        y: number;
    };
    /**原始DOM事件 */
    orginDOMEvent: MouseEvent;
    /**原始地图事件 */
    orginMapEvent:MapEventType;
}

/**地图事件触发时的响应对象 @template T 挂载此次事件的对象(MapImage|MapArc|Event) @template I 对象携带的相关数据 */
export type MapEventResponse<T extends MapEvent = MapEvent, I = any> = CanvasEventResponse<T, I> & {
    /**事件位置信息，包含经纬度 */
    position: MapCursorPosition;
}

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
    lnglat: { Q: number, R: number, lng: number, lat: number }
    /**原始DOM事件 */
    originEvent: MouseEvent,
    /**事件容器位置 */
    pixel: { x: number, y: number }
    /**事件类型 */
    type: EventType
}