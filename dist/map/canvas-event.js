"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapCanvasEvent = void 0;
const slu_map_1 = require("../utils/slu-map");
const rbush_1 = require("rbush");
class MapCanvasEvent {
    constructor(map) {
        this.rbush = new rbush_1.default();
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
        this.resetRbush = () => {
            if (this.rbush)
                this.rbush.clear();
            this._eventSwitch(false);
            this._allRbush = [];
            this._allMapEvents.forEach(evs => {
                evs.forEach(ev => {
                    this.transformRbush(ev);
                });
            });
            this.rbush.load(this._allRbush);
            this._eventSwitch(true);
        };
        this.triggerEvent = (e) => {
            let allEvents = [];
            this._allMapEvents.forEach(eves => {
                allEvents = allEvents.concat(eves);
            });
            let style = document.querySelector('#map').style;
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
            curEvents.forEach(resp => this.doCbByEventType(resp, e.type));
        };
        this.map = map;
        this._eventSwitch(true);
        this.map.on('moveend', this.resetRbush);
        this.map.on('zoomend', this.resetRbush);
    }
    static destory() {
        MapCanvasEvent.ifInit = true;
    }
    static initCursor() {
        MapCanvasEvent.ifInitCursor = true;
    }
    _eventSwitch(flag) {
        if (MapCanvasEvent.ifInit) {
            MapCanvasEvent.ifInit = false;
            this.map.on('mousemove', () => { MapCanvasEvent.ifInitCursor = true; });
        }
        let types = ['click', 'dblclick', 'mousemove', 'mousedown', 'mouseup', 'rightclick'];
        types.map(e => {
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
            (0, slu_map_1.u_arrItemDel)(cbs, cb);
        }
        else {
            this._listenCbs[type] = [];
        }
    }
    clear() {
        this._listenCbs = Object.create(null);
    }
    setEventsByKey(evs, key) {
        this._allMapEvents.set(key, evs.filter(ev => !ev.ifHide));
        this._allRbush = [];
        this.rbush.clear();
        this._allMapEvents.forEach((evs) => {
            evs.forEach(e => this.handleTransform(e));
        });
        this.rbush.load(this._allRbush);
    }
    clearAllEvents() {
        this._allMapEvents = new Map();
        this._allRbush = [];
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
            latlng: event.latlng || undefined,
            latlngs: event.latlngs || [],
            type: event.type,
            info: event.info,
            cb: event.cb
        };
    }
    transformRbush(event) {
        if (event.ifHide === true)
            return;
        let { range = [5, 5], latlng, latlngs = [], left = 0, top = 0 } = event;
        if (latlng && latlng.length === 2)
            latlngs = [...latlngs, latlng];
        latlngs.forEach(latlng => {
            const [lat, lng] = latlng;
            let [onX, onY] = (0, slu_map_1.u_mapGetPointByLatlng)(this.map, latlng);
            let item = {
                minX: onX - range[0] + left,
                minY: onY - range[1] + top,
                maxX: onX + range[0] + left,
                maxY: onY + range[1] + top,
                data: event
            };
            this._allRbush.push(item);
        });
    }
    getEventsByRange(e) {
        let lng, lat, x, y, pageX, pageY, zoom = this.map.getZoom();
        if (e.latlng) {
            let event = e;
            ({ lng, lat } = event.latlng, { x, y } = event.containerPoint, { pageX, pageY } = event.originalEvent);
        }
        else {
            let event = e;
            ({ lng, lat } = event.lnglat, { x, y } = event.pixel, { pageX, pageY } = event.originEvent);
        }
        let cursor = { latlng: [lat, lng], page: [pageX, pageY], point: [x, y], };
        let curEvents = [], enterEvents = [], leaveEvents = this.perEvents;
        let curr = new Date();
        if (e.type == 'click')
            console.time('start');
        let ret = this.rbush.search({ minX: x, minY: y, maxX: x, maxY: y });
        ret.forEach(res => {
            let ev = res.data;
            let { latlng, latlngs = [], range = [5, 5], left = 0, top = 0, minZoom = 1, maxZoom = 50 } = res.data;
            if (minZoom > zoom || maxZoom < zoom)
                return;
            if (latlng && latlng.length === 2)
                latlngs = [...latlngs, latlng];
            let [onX, onY] = (0, slu_map_1.u_mapGetPointByLatlng)(this.map, latlng);
            let eventRes = this.genEventResponse(latlng, [onX, onY], ev, cursor);
            curEvents.push(eventRes);
            let per = leaveEvents.find(e => e.position.latlng[0] === eventRes.position.latlng[0] && e.position.latlng[1] === eventRes.position.latlng[1]);
            if (per) {
                (0, slu_map_1.u_arrItemDel)(leaveEvents, per);
            }
            else {
                enterEvents.push(eventRes);
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
    genEventResponse(latlng, point, event, cursor) {
        let pageX = point[0] + cursor.page[0] - cursor.point[0], pageY = point[1] + cursor.page[1] - cursor.point[1];
        let position = { latlng: latlng, page: [pageX, pageY], point: point, };
        return { position, cursor, event, info: event.info ?? {}, type: 'unset' };
    }
}
exports.MapCanvasEvent = MapCanvasEvent;
MapCanvasEvent.ifInitCursor = true;
MapCanvasEvent.ifInit = true;
//# sourceMappingURL=canvas-event.js.map