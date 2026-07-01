import { u_arrItemDel, u_mapGetPointByLnglat, u_tsEventisAmap, u_tsEventisLeaflet, u_tsEventisMapLibre, u_tsIsMapEventType, u_tsMapisMapLibre } from "../utils/slu-map";
import rbush from 'rbush';
export class MapCanvasEvent {
    constructor(map) {
        this.rbush = new rbush();
        this.rbush_search = Object.create(null);
        this._listenCbs = Object.create(null);
        this._allMapEvents = new Map();
        this._allRbush = [];
        this.perEvents = [];
        this.cbMapEvent = (e) => {
            let { cb, cbs } = e.event;
            if (cb) {
                cb(e);
                return;
            }
            if (cbs) {
                cbs[e.type]?.(e);
                return;
            }
            let _cbs = this._listenCbs[e.type] || [];
            _cbs.map(cb => cb(e));
        };
        this.types = ['click', 'dblclick', 'mousemove', 'mousedown', 'mouseup', 'rightclick'];
        this.resetRbush = () => {
            if (this.rbush)
                this.rbush.clear();
            this._eventSwitch(false);
            this._allRbush.length = 0;
            this._allMapEvents.forEach(evs => {
                evs.forEach(ev => {
                    this.transformRbush(ev);
                });
            });
            this.rbush.load(this._allRbush);
            this._eventSwitch(true);
        };
        this.triggerEvent = (e) => {
            let allEvents = [], el;
            this._allMapEvents.forEach(eves => {
                allEvents = allEvents.concat(eves);
            });
            if (u_tsMapisMapLibre(this.map)) {
                el = this.map.getCanvasContainer();
            }
            else {
                el = this.map.getContainer();
            }
            if (!el)
                return;
            let style = el.style;
            style.cursor = MapCanvasEvent.ifInitCursor ? 'default' : style.cursor;
            if (allEvents.length === 0)
                return;
            let { curEvents, enterEvents, leaveEvents } = this.getEventsByRange(e);
            enterEvents.forEach(resp => this.doCbByEventType(resp, 'mouseenter'));
            leaveEvents.forEach(resp => this.doCbByEventType(resp, 'mouseleave'));
            this.perEvents = curEvents;
            if (curEvents.length == 0)
                return;
            MapCanvasEvent.ifInitCursor = false;
            style.cursor = 'pointer';
            const type = e.type;
            u_tsIsMapEventType(type);
            curEvents.forEach(resp => this.doCbByEventType(resp, type));
        };
        this.map = map;
        this._eventSwitch(true);
        this.map.on('moveend', this.resetRbush);
        this.map.on('zoomend', this.resetRbush);
    }
    static destory() {
        MapCanvasEvent.ifInit = true;
    }
    _eventSwitch(flag) {
        if (MapCanvasEvent.ifInit) {
            MapCanvasEvent.ifInit = false;
            this.map.on('mousemove', () => { MapCanvasEvent.ifInitCursor = true; });
        }
        this.types.forEach(e => {
            this.map[flag ? 'on' : 'off'](e, this.triggerEvent);
        });
    }
    on(type, cb) {
        let cbs = this._listenCbs[type] = this._listenCbs[type] || [];
        cbs.push(cb);
    }
    off(type, cb) {
        let cbs = this._listenCbs[type] = this._listenCbs[type] || [];
        if (cb) {
            u_arrItemDel(cbs, cb);
        }
        else {
            this._listenCbs[type].length = 0;
        }
    }
    clear() {
        this._listenCbs = Object.create(null);
    }
    setEventsByKey(evs, key) {
        this._allMapEvents.set(key, evs.filter(ev => !ev.ifHide));
        this._allRbush.length = 0;
        this.rbush.clear();
        this._allMapEvents.forEach((evs) => {
            evs.forEach(e => this.handleTransform(e));
        });
        this.rbush.load(this._allRbush);
    }
    clearAllEvents() {
        this._allMapEvents.clear();
        this._allRbush.length = 0;
        this.rbush.clear();
    }
    clearEventsByKey(key) {
        this.setEventsByKey([], key);
    }
    pushEventByKey(key, ev) {
        if (!this._allMapEvents.has(key))
            this._allMapEvents.set(key, []);
        const eves = this._allMapEvents.get(key);
        Array.isArray(ev) ? eves.push(...ev) : eves.push(ev);
        this.setEventsByKey(eves, key);
    }
    handleTransform(ev) {
        this.transformEvent(ev);
        this.transformRbush(ev);
    }
    transformEvent(event) {
        if (event.ifHide === true)
            return;
        let ev = {
            lnglat: event.lnglat || undefined,
            lnglats: event.lnglats || [],
            type: event.type,
            info: event.info,
            cb: event.cb
        };
    }
    transformRbush(event) {
        if (event.ifHide === true)
            return;
        let { range = [5, 5], lnglat, lnglats = [], left = 0, top = 0 } = event;
        if (lnglat && lnglat.length === 2)
            lnglats = [...lnglats, lnglat];
        lnglats.forEach(lnglat => {
            let [onX, onY] = u_mapGetPointByLnglat(this.map, lnglat);
            let item = {
                minX: onX - range[0] + left,
                minY: onY - range[1] + top,
                maxX: onX + range[0] + left,
                maxY: onY + range[1] + top,
                data: event,
                lnglat: lnglat,
            };
            this._allRbush.push(item);
        });
    }
    getEventsByRange(e) {
        let x = 0, y = 0, pageX = 0, pageY = 0, zoom = this.map.getZoom();
        if (u_tsEventisLeaflet(e)) {
            let event = e;
            ({ x, y } = event.containerPoint, { pageX, pageY } = event.originalEvent);
        }
        else if (u_tsEventisAmap(e)) {
            let event = e;
            ({ x, y } = event.pixel, { pageX, pageY } = event.originEvent);
        }
        else if (u_tsEventisMapLibre(e)) {
            ({ x, y } = e.point, { pageX, pageY } = e.originalEvent);
        }
        let curEvents = [], enterEvents = [], leaveEvents = this.perEvents;
        if (e.type == 'click')
            console.time('start');
        const search = this.rbush_search;
        search.maxX = search.minX = x, search.maxY = search.minY = y;
        let ret = this.rbush.search(search);
        ret.forEach(res => {
            let event = res.data, lnglat = res.lnglat, { minZoom = 1, maxZoom = 50 } = event;
            if (minZoom > zoom || maxZoom < zoom)
                return;
            let position = Object.create(null);
            { }
            position.lnglat = lnglat, position.page = [pageX, pageY], position.point = [x, y];
            let response = Object.create(null);
            response.type = 'unset', response.position = position, response.event = event, response.info = event.info;
            curEvents.push(response);
            let per = leaveEvents.find(e => e.position.lnglat[0] === lnglat[0] && e.position.lnglat[1] === lnglat[1]);
            if (per) {
                u_arrItemDel(leaveEvents, per);
            }
            else {
                enterEvents.push(response);
            }
            ;
        });
        if (e.type == 'click')
            console.timeEnd('start');
        return { curEvents, enterEvents, leaveEvents };
    }
    doCbByEventType(resp, type) {
        let types = resp.event.type;
        if (!Array.isArray(types))
            types = [types];
        if (!types.includes(type))
            return;
        resp.type = type;
        this.cbMapEvent(resp);
    }
}
MapCanvasEvent.ifInitCursor = true;
MapCanvasEvent.ifInit = true;
//# sourceMappingURL=canvas-event.js.map