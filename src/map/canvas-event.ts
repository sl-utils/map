import { u_arrItemDel, u_mapGetPointByLatlng } from "../utils/slu-map";
import rbush from 'rbush'
/** 地图canvas事件类*/
export class MapCanvasEvent {
    /**地图事件控制类 */
    constructor(map: AMAP.Map | L.Map) {
        this.map = map;
        this._eventSwitch(true);
        this.map.on('moveend', this.resetRbush);
        this.map.on('zoomend', this.resetRbush);
    }
    /**R树搜索 事件 */
    private rbush = new rbush();
    /**是否重新开始事件指针变化(使不同canvas的事件指针能正确显示)*/
    private static ifInitCursor: boolean = true;
    /**是否开启事件控制类初始化 */
    private static ifInit: boolean = true;
    /**地图销毁必须调用此方法，否则事件指针会异常 */
    public static destory() {
        MapCanvasEvent.ifInit = true;
    }
    private static initCursor() {
        MapCanvasEvent.ifInitCursor = true
    }
    protected map: AMAP.Map | L.Map;
    /** 监听事件 */
    protected _listenCbs: { [key in SLTEventType]?: ((e: MapEventResponse<any>) => void)[] } = Object.create(null);
    /** key 防止setEvent清除其他事件 */
    public _allMapEvents: Map<string, MapEvent[]> = new Map();
    /** Rbush查询子集 */
    private _allRbush: SLTRbush<MapEvent>[] = [];
    /** 上一次触发的事件集合 */
    private perEvents: MapEventResponse[] = [];
    /** 海图事件回调函数 */
    private cbMapEvent = (e: MapEventResponse) => {
        let { cb, cbs } = e.event;
        if (cb) { cb(e); return; }
        if (cbs) { cbs[e.type]?.(e); return }
        /**响应的事件类型集合 */
        let _cbs = this._listenCbs[e.type] || [];
        _cbs.map(cb => cb(e));
    };
    /** 事件开关 
     * @param flag true开启地图事件监听 false关闭地图事件监听
    */
    private _eventSwitch(flag: boolean) {
        // this.map.off('mousemove', MapCanvasEvent.initCursor)
        // this.map.on('mousemove', MapCanvasEvent.initCursor)
        if (MapCanvasEvent.ifInit) {
            MapCanvasEvent.ifInit = false;
            this.map.on('mousemove', () => { MapCanvasEvent.ifInitCursor = true })
        }
        let types = ['click', 'dblclick', 'mousemove', 'mousedown', 'mouseup', 'rightclick'];
        types.map(e => {
            this.map[flag ? 'on' : 'off'](e, this.triggerEvent)
        })
    }
    /**重设rbush */
    private resetRbush = () => {
        if (this.rbush) this.rbush.clear();
        // 先暂时取消监听所有事件
        this._eventSwitch(false);
        this._allRbush = [];
        this._allMapEvents.forEach(evs => {
            evs.forEach(ev => {
                this.transformRbush(ev);
            })
        })
        this.rbush.load(this._allRbush);
        // 设置完成重新监听
        this._eventSwitch(true);
    }
    /**统一监听该类的指定事件 */
    public on<T extends MapEvent<any>>(type: SLTEventType, cb: (e: MapEventResponse<T>) => void) {
        let cbs = this._listenCbs[type] = this._listenCbs[type] || [];
        cbs.push(cb);
    }
    /**统一关闭指定事件的监听 */
    public off<T extends MapEvent<any>>(type: SLTEventType, cb?: (e: MapEventResponse<T>) => void) {
        let cbs = this._listenCbs[type] = this._listenCbs[type] || [];
        if (cb) {
            u_arrItemDel(cbs, cb);
        } else {
            this._listenCbs[type] = [];
        }
    }
    /**清空之前设置的统一监听事件 */
    public clear() {
        this._listenCbs = Object.create(null);
    }
    /** 
     * @param evs 事件集合
     * @param key 事件key
     * 设置key 事件 会覆盖原来的事件 
     * 不覆盖使用 pushEventByKey
     *  */
    public setEventsByKey<T extends MapEvent>(evs: T[], key: string) {
        /**ifHide不显示,事件就不添加 */
        this._allMapEvents.set(key, evs.filter(ev => !ev.ifHide));
        this._allRbush = [];
        this.rbush.clear();
        // map所有事件
        this._allMapEvents.forEach((evs) => {
            evs.forEach(e => this.handleTransform(e));
        });
        this.rbush.load(this._allRbush);
    }
    /**
     * 清除所有事件
     */
    public clearAllEvents() {
        this._allMapEvents = new Map();
        this._allRbush = [];
        this.rbush.clear();
    }
    /**
     * 清除指定类型事件
     * @param key
     */
    public clearEventsByKey(key: string) {
        this.setEventsByKey([], key);
    }
    /**
     * 添加一个事件
     * 尽量使用setEventsByKey 
     * 或者pushEventByKey数组 而不是for 一个个push
     * 不然每次for循环push都会重新构造rbush
     *  */
    public pushEventByKey<T extends MapEvent>(key: string, ev: T | T[]) {
        if (!this._allMapEvents.has(key)) this._allMapEvents.set(key, []);
        const eves = this._allMapEvents.get(key);
        Array.isArray(ev) ? eves.push(...ev) : eves.push(ev);
        this.setEventsByKey(eves, key);
    }
    /** 添加事件 */
    private handleTransform<T extends MapEvent>(ev: T) {
        this.transformEvent(ev);
        this.transformRbush(ev);
    }
    /** 转换添加事件 */
    private transformEvent<T extends MapEvent>(event: T) {
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
    /** 转为Rbush数据格式 */
    private transformRbush<T extends MapEvent>(event: T) {
        /**ifHide不显示,事件就不添加 */
        if (event.ifHide === true) return;
        let { range = [5, 5], latlng, latlngs = [], left = 0, top = 0 } = event;
        if (latlng && latlng.length === 2) latlngs = [...latlngs, latlng];
        latlngs.forEach(latlng => {
            const [lat, lng] = latlng;
            let [onX, onY] = u_mapGetPointByLatlng(this.map, latlng);
            let item: SLTRbush = {
                minX: onX - range[0] + left,
                minY: onY - range[1] + top,
                maxX: onX + range[0] + left,
                maxY: onY + range[1] + top,
                data: event
            }
            this._allRbush.push(item)
        })

    }
    /**准备触发事件 
    * @param e 地图事件
    */
    private triggerEvent = (e: AMapMapsEvent | L.LeafletMouseEvent): void => {
        let allEvents: MapEvent<any, any>[] = []
        this._allMapEvents.forEach(eves => {
            allEvents = allEvents.concat(eves);
        });
        let style: any = (document.querySelector('#map')! as HTMLElement).style;
        style.cursor = MapCanvasEvent.ifInitCursor ? 'default' : style.cursor;
        if (allEvents.length === 0) return;
        let { curEvents, enterEvents, leaveEvents } = this.getEventsByRange(e);
        enterEvents.forEach(resp => this.doCbByEventType(resp, 'mouseenter'))
        leaveEvents.forEach(resp => this.doCbByEventType(resp, 'mouseleave'))
        this.perEvents = curEvents;
        if (curEvents.length == 0) return
        MapCanvasEvent.ifInitCursor = false;
        style.cursor = 'pointer';
        curEvents.forEach(resp => this.doCbByEventType(resp, e.type as SLTEventType))
    };
    /**获取指针触发范围内的事件 */
    private getEventsByRange(e: AMapMapsEvent | L.LeafletMouseEvent) {
        let lng, lat, x, y, pageX, pageY, zoom = this.map.getZoom();
        if ((e as L.LeafletMouseEvent).latlng) {
            let event: L.LeafletMouseEvent = e as L.LeafletMouseEvent
            ({ lng, lat } = event.latlng, { x, y } = event.containerPoint, { pageX, pageY } = event.originalEvent);
        } else {
            let event: AMapMapsEvent = e as AMapMapsEvent
            ({ lng, lat } = event.lnglat, { x, y } = event.pixel, { pageX, pageY } = event.originEvent);
        }
        /**鼠标位置信息 */
        let cursor: MapCursorInfo = { latlng: [lat, lng], page: [pageX, pageY], point: [x, y], }
        /** curEvents 当前位置存在的所有事件  enterEvents 鼠标首次进入事件集合  leaveEvents 鼠标离开事件集合 */
        let curEvents: MapEventResponse[] = [], enterEvents: MapEventResponse[] = [], leaveEvents: MapEventResponse[] = this.perEvents;
        let curr = new Date()
        if (e.type == 'click')
            console.time('start');
        // rbush查找
        let ret = this.rbush.search({ minX: x, minY: y, maxX: x, maxY: y }) as SLTRbush<MapEvent>[]
        ret.forEach(res => {
            let ev = res.data;
            let { latlng, latlngs = [], range = [5, 5], left = 0, top = 0, minZoom = 1, maxZoom = 50 } = res.data
            if (minZoom > zoom || maxZoom < zoom) return;
            if (latlng && latlng.length === 2) latlngs = [...latlngs, latlng];
            let [onX, onY] = u_mapGetPointByLatlng(this.map, latlng);
            let eventRes = this.genEventResponse(latlng, [onX, onY], ev, cursor);
            curEvents.push(eventRes);
            /**从之前的所有响应对象中查找是否存在位置一样的响应对象 */
            let per = leaveEvents.find(e =>
                e.position.latlng[0] === eventRes.position.latlng[0] && e.position.latlng[1] === eventRes.position.latlng[1]
            );
            if (per) {
                /**存在则说明鼠标没有离开,则从离开事件集合中移除 */
                u_arrItemDel(leaveEvents, per)
            } else {
                /**不存在则说明鼠标刚刚进入,则添加到进入事件集合 */
                enterEvents.push(eventRes)
            };
        })
        // for (let i = 0, len = allEvents.length; i < len; i++) {
        //     let ev = allEvents[i];
        //     let { latlng, latlngs = [], range = [5, 5], left = 0, top = 0, minZoom = 1, maxZoom = 50 } = ev;
        //     if (minZoom > zoom || maxZoom < zoom) continue;
        //     if (latlng && latlng.length === 2) latlngs = [...latlngs, latlng];
        //     let sizeX = range[0], sizeY = range[1];
        //     /**判断是否在范围内 */
        //     for (let p = 0; p < latlngs.length; p++) {
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
        if (e.type == 'click')
            console.timeEnd('start');
        return { curEvents, enterEvents, leaveEvents }
    }
    /**通过事件类型执行回调函数*/
    private doCbByEventType(resp: MapEventResponse, type: SLTEventType) {
        let types = resp.event.type;
        if (!Array.isArray(types)) types = [types];
        if (!types.includes(type)) return;
        resp.type = type;
        this.cbMapEvent(resp)
    }
    /**生成地图事件响应对象 
     * @param latlng 该事件对象的地图坐标
     * @param point 该事件对象的地图像素坐标
     * @param event 地图事件
     * @param cursor 鼠标位置信息
    */
    private genEventResponse(latlng: [number, number], point: [number, number], event: MapEvent, cursor: MapCursorInfo): MapEventResponse {
        let pageX = point[0] + cursor.page[0] - cursor.point[0], pageY = point[1] + cursor.page[1] - cursor.point[1];
        let position: MapCursorInfo = { latlng: latlng, page: [pageX, pageY], point: point, }
        return { position, cursor, event, info: event.info ?? {}, type: 'unset' };
    }
}