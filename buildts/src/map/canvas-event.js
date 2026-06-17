"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapCanvasEvent = void 0;
const slu_map_1 = require("../utils/slu-map");
const rbush_1 = __importDefault(require("rbush"));
class MapCanvasEvent {
    constructor(map) {
        this.rbush = new rbush_1.default();
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
            if ((0, slu_map_1.u_tsMapisMapLibre)(this.map)) {
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
            (0, slu_map_1.u_tsIsMapEventType)(type);
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
            (0, slu_map_1.u_arrItemDel)(cbs, cb);
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
            let [onX, onY] = (0, slu_map_1.u_mapGetPointByLatlng)(this.map, latlng);
            let item = {
                minX: onX - range[0] + left,
                minY: onY - range[1] + top,
                maxX: onX + range[0] + left,
                maxY: onY + range[1] + top,
                data: event,
                latlng: latlng,
            };
            this._allRbush.push(item);
        });
    }
    getEventsByRange(e) {
        let x = 0, y = 0, pageX = 0, pageY = 0, zoom = this.map.getZoom();
        if ((0, slu_map_1.u_tsEventisLeaflet)(e)) {
            let event = e;
            ({ x, y } = event.containerPoint, { pageX, pageY } = event.originalEvent);
        }
        else if ((0, slu_map_1.u_tsEventisAmap)(e)) {
            let event = e;
            ({ x, y } = event.pixel, { pageX, pageY } = event.originEvent);
        }
        else if ((0, slu_map_1.u_tsEventisMapLibre)(e)) {
            ({ x, y } = e.point, { pageX, pageY } = e.originalEvent);
        }
        let curEvents = [], enterEvents = [], leaveEvents = this.perEvents;
        if (e.type == 'click')
            console.time('start');
        const search = this.rbush_search;
        search.maxX = search.minX = x, search.maxY = search.minY = y;
        let ret = this.rbush.search(search);
        ret.forEach(res => {
            let event = res.data, latlng = res.latlng, { minZoom = 1, maxZoom = 50 } = event;
            if (minZoom > zoom || maxZoom < zoom)
                return;
            let position = Object.create(null);
            { }
            position.latlng = latlng, position.page = [pageX, pageY], position.point = [x, y];
            let response = Object.create(null);
            response.type = 'unset', response.position = position, response.event = event, response.info = event.info;
            curEvents.push(response);
            let per = leaveEvents.find(e => e.position.latlng[0] === latlng[0] && e.position.latlng[1] === latlng[1]);
            if (per) {
                (0, slu_map_1.u_arrItemDel)(leaveEvents, per);
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
exports.MapCanvasEvent = MapCanvasEvent;
MapCanvasEvent.ifInitCursor = true;
MapCanvasEvent.ifInit = true;
//# sourceMappingURL=canvas-event.js.map