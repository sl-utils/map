import { MapEventType, MapEventResponse, MapEvent, MapRbush, AMapMapsEvent, MapCursorPosition, MapEventRange } from "@sl-utils/map";
import { u_arrItemDel, u_mapGetPointByLatlng, u_tsEventisAmap, u_tsEventisLeaflet, u_tsEventisMapLibre, u_tsIsMapEventType, u_tsMapisMapLibre } from "../utils/slu-map";
import rbush, { BBox } from 'rbush'
import { LeafletMouseEvent, Map as LMap } from "leaflet";
import { Map as MaplibreMap, MapMouseEvent as MaplibreMouseEvent } from 'maplibre-gl';

/**地图事件控制类
 * @constructor
 * @param map 地图实例
 */
export class MapCanvasEvent {
    constructor(map: AMAP.Map | LMap | MaplibreMap) {
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
    protected map: AMAP.Map | LMap | MaplibreMap;
    /**监听事件 */
    protected _listenCbs: { [key in MapEventType]?: ((e: MapEventResponse<any>) => void)[] } = Object.create(null);
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
    public on<T extends MapEvent<any>>(type: MapEventType, cb: (e: MapEventResponse<T>) => void): void {
        let cbs = this._listenCbs[type] = this._listenCbs[type] || [];
        cbs.push(cb);
    }
    /**统一关闭指定事件的监听
     * @param type 事件类型
     * @param cb 事件回调函数
     */
    public off<T extends MapEvent<any>>(type: MapEventType, cb?: (e: MapEventResponse<T>) => void): void {
        let cbs = this._listenCbs[type] = this._listenCbs[type] || [];
        if (cb) {
            u_arrItemDel(cbs, cb);
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
            latlng: event.latlng || undefined,
            latlngs: event.latlngs || [],
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
        let { range = [5, 5], latlng, latlngs = [], left = 0, top = 0 } = event;
        if (latlng && latlng.length === 2) latlngs = [...latlngs, latlng];
        latlngs.forEach(latlng => {
            let [onX, onY] = u_mapGetPointByLatlng(this.map, latlng);
            let item: MapRbush = {
                minX: onX - range[0] + left,
                minY: onY - range[1] + top,
                maxX: onX + range[0] + left,
                maxY: onY + range[1] + top,
                data: event,
                latlng: latlng,
            }
            this._allRbush.push(item)
        })
    }
    /**准备触发事件 
    * @param e 地图事件
    */
    private triggerEvent = (e: AMapMapsEvent | LeafletMouseEvent | MaplibreMouseEvent): void => {
        let allEvents: MapEvent<any, any>[] = [], el: HTMLElement;
        this._allMapEvents.forEach(eves => {
            allEvents = allEvents.concat(eves);
        });
        if (u_tsMapisMapLibre(this.map)) {
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
        const type = e.type;
        u_tsIsMapEventType(type);
        curEvents.forEach(resp => this.doCbByEventType(resp, type));
    };
    /**获取指针触发范围内的事件
     * @param e 地图事件
     * @returns MapEventRange
     */
    private getEventsByRange(e: AMapMapsEvent | LeafletMouseEvent | MaplibreMouseEvent): MapEventRange {
        let x: number = 0, y: number = 0, pageX: number = 0, pageY: number = 0, zoom: number = this.map.getZoom();
        if (u_tsEventisLeaflet(e)) {
            let event = e;
            ({ x, y } = event.containerPoint, { pageX, pageY } = event.originalEvent);
        } else if (u_tsEventisAmap(e)) {
            let event = e;
            ({ x, y } = event.pixel, { pageX, pageY } = event.originEvent);
        } else if (u_tsEventisMapLibre(e)) {
            ({ x, y } = e.point, { pageX, pageY } = e.originalEvent);
        }
        /** curEvents 当前位置存在的所有事件  enterEvents 鼠标首次进入事件集合  leaveEvents 鼠标离开事件集合 */
        let curEvents: MapEventResponse[] = [], enterEvents: MapEventResponse[] = [], leaveEvents: MapEventResponse[] = this.perEvents;
        if (e.type == 'click') console.time('start');
        // rbush查找
        const search = this.rbush_search;
        search.maxX = search.minX = x, search.maxY = search.minY = y;
        let ret = this.rbush.search(search);
        ret.forEach(res => {
            let event: MapEvent = res.data, latlng = res.latlng, { minZoom = 1, maxZoom = 50 } = event
            if (minZoom > zoom || maxZoom < zoom) return;
            /**事件位置信息 */
            let position: MapCursorPosition = Object.create(null);
            { }
            position.latlng = latlng, position.page = [pageX, pageY], position.point = [x, y];
            /**事件响应对象 */
            let response: MapEventResponse = Object.create(null);
            response.type = 'unset', response.position = position, response.event = event, response.info = event.info;
            curEvents.push(response);
            /**从之前的所有响应对象中查找是否存在位置一样的响应对象 */
            let per = leaveEvents.find(e =>
                e.position.latlng[0] === latlng[0] && e.position.latlng[1] === latlng[1]
            );
            if (per) {
                /**存在则说明鼠标没有离开,则从离开事件集合中移除 */
                u_arrItemDel(leaveEvents, per)
            } else {
                /**不存在则说明鼠标刚刚进入,则添加到进入事件集合 */
                enterEvents.push(response)
            };
        })
        // for (let i = 0, len = allEvents.length; i < len; i++) {
        //     let ev = allEvents[i];
        //     let { latlng, latlngs = [], range = [5, 5], left = 0, top = 0, minZoom = 1, maxZoom = 50 } = ev;
        //     if (minZoom > zoom || maxZoom < zoom) continue;
        //     if (latlng && latlng.length === 2) latlngs = [...latlngs, latlng];
        //     let sizeX = range[0], sizeY = range[1];
        //     /**判断是否在范围内 */
        //     for (let p = 0, len2 = latlngs.length; p < len2; p++) {
        //         let latlng = latlngs[p];
        //         let [onX, onY] = u_mapGetPointByLatlng(this.map, latlng);
        //         if ((onX - sizeX + left) <= x && x <= (onX + sizeX + left) && (onY - sizeY + top) <= y && y <= (onY + sizeY + top)) {
        //             /**当前响应对象 */
        //             let res = this.genEventResponse(latlng, [onX, onY], ev, cursor);
        //             curEvents.push(res);
        //             /**从之前的所有响应对象中查找是否存在位置一样的响应对象 */
        //             let per = leaveEvents.find(e =>
        //                 e.position.latlng[0] === res.position.latlng[0] && e.position.latlng[1] === res.position.latlng[1]
        //             );
        //             if (per) {
        //                 /**存在则说明鼠标没有离开,则从离开事件集合中移除 */
        //                 u_arrItemDel(leaveEvents, per)
        //             } else {
        //                 /**不存在则说明鼠标刚刚进入,则添加到进入事件集合 */
        //                 enterEvents.push(res)
        //             };
        //         }
        //     }
        // }
        if (e.type == 'click') console.timeEnd('start');
        return { curEvents, enterEvents, leaveEvents }
    }
    /**通过事件类型执行回调函数
     * @param resp 事件响应对象
     * @param type 事件类型
    */
    private doCbByEventType(resp: MapEventResponse, type: MapEventType): void {
        let types = resp.event.type;
        if (!Array.isArray(types)) types = [types];
        if (!types.includes(type)) return;
        resp.type = type;
        this.cbMapEvent(resp)
    }
}