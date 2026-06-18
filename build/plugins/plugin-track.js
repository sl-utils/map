import { MapPluginDraw } from "./plugin-draw";
import { MapCanvasEvent } from "../map";
import { u_mapTogps84gcj02, u_tsMapisAmap } from "../utils";
export class MapPluginTrack {
    constructor(sluMap, options) {
        this.options = {
            pane: "canvas",
            className: "track",
            zIndex: 100,
            ifArc: true,
            arcInterval: 1,
            sizeArc: 3,
            colorArc: "#FFFFFF",
            colorArcFill: "#D9AF3B",
            widthLine: 1,
            colorLine: "#525b65",
            textStart: "起点",
            textEnd: "终点",
            colorTextStart: "#8D4CC3",
            colorTextEnd: "#D85151",
            colorArcStart: "#8D4CC3",
            colorArcEnd: "#D85151",
        };
        this.allTracks = [];
        this.earlyTime = 0;
        this.intervalTime = 20;
        this.time = 0;
        this.ifShow = false;
        this.cbs = Object.create(null);
        const map = sluMap.map;
        this.map = map;
        Object.assign(this.options, options);
        let zIndex = this.options.zIndex + 1;
        this.layerDraw = new MapPluginDraw(sluMap, this.options);
        this.layerAniDraw = new MapPluginDraw(sluMap, Object.assign({}, this.options, { zIndex, className: "track ani" }));
        this.allEvents = new MapCanvasEvent(map);
    }
    onRemove() {
        this.layerDraw.onRemove();
        this.layerAniDraw.onRemove();
    }
    setTracks(tracks) {
        if (u_tsMapisAmap(this.map)) {
            tracks.forEach(track => {
                track.data.forEach(e => {
                    const { lat, lng } = u_mapTogps84gcj02(e.lng, e.lat);
                    e.lat = lat;
                    e.lng = lng;
                });
            });
        }
        const that = this, { allTracks } = that;
        tracks.forEach(track => {
            const cur = allTracks.find(el => el.id === track.id);
            if (cur) {
                cur.data.push(...track.data);
            }
            else {
                allTracks.push(track);
            }
        });
        that.earlyTime = Infinity;
        allTracks.forEach(track => {
            const positions = track.data, len = positions.length, last = positions[len - 1];
            if (last)
                that.earlyTime = Math.min(that.earlyTime, last.timeStamp);
        });
        this.setAniImage([]);
    }
    getInfosByTime(time) {
        const that = this, { allTracks } = that, curTimeDatas = [];
        that.time = time.getTime() / 1000;
        this.getNextTrack();
        allTracks.forEach(track => {
            const positions = track.data;
            let cur = this.getInfoByTime(that.time, positions);
            let point = Object.assign({}, { orginData: track.orginData }, cur);
            curTimeDatas.push(point);
        });
        this._drawTracks();
        return curTimeDatas;
    }
    getNextTrack() {
        let { earlyTime, intervalTime, time } = this;
        if (!earlyTime || time - earlyTime < intervalTime)
            return;
        this.earlyTime = 0;
        this.trigger("next");
    }
    setAniImage(imgs, texts = []) {
        const { layerAniDraw } = this;
        layerAniDraw.resetCanvas();
        layerAniDraw.setAllImgs(imgs);
        layerAniDraw.setAllTexts(texts);
        layerAniDraw.drawMapAll();
    }
    addCbClickPoint(cb) {
        this.cbClickPoint = cb;
        this._drawTracks();
        return this;
    }
    setIfShow(ifShow) {
        this.ifShow = ifShow;
        this._drawTracks();
    }
    _drawTracks() {
        const that = this, { layerDraw, layerAniDraw, allEvents, allTracks, options, time } = that, { ifArc } = options;
        layerDraw.resetCanvas();
        layerDraw.setAllLines([]);
        layerDraw.setAllArcs([]);
        layerDraw.setAllTexts([]);
        allEvents.clearEventsByKey("track");
        if (!this.ifShow) {
            layerDraw.drawMapAll();
            return;
        }
        let eves = [];
        for (const key in allTracks) {
            if (Object.prototype.hasOwnProperty.call(allTracks, key)) {
                const info = allTracks[key];
                that.drawHistoryTrack(info);
                that.addPointEvent(info, eves);
            }
        }
        allEvents.setEventsByKey(eves, "track");
        layerDraw.drawMapAll();
    }
    drawHistoryTrack(track) {
        this.drawLine(track);
        this.drawArc(track);
        this.drawStartEnd(track);
    }
    drawLine(track) {
        let { widthLine, colorLine } = this.options, { data } = track, time = this.time;
        let latlngs = [];
        for (let i = 0, len = data.length; i < len; i++) {
            let e = data[i];
            latlngs.push([e.lat, e.lng]);
            if (e.timeStamp > time && i > 1)
                break;
        }
        let line = {
            latlngs,
            widthLine,
            colorLine,
            minZoom: 10,
        };
        this.layerDraw.addLine(line);
    }
    drawArc(track) {
        let { sizeArc, colorArcFill, colorArc, arcInterval = 0, ifArc } = this.options, { data } = track;
        if (!ifArc)
            return;
        let time = 0;
        let latlngs = data.map((e, i) => {
            if (arcInterval < 1000 && i % (arcInterval + 1) === 0)
                return [e.lat, e.lng];
            if (arcInterval >= 1000 && (e.timeStamp - time) / arcInterval > 1) {
                time = e.timeStamp;
                return [e.lat, e.lng];
            }
            return undefined;
        }).filter((e) => e !== undefined);
        let arc = Object.assign({}, {
            size: sizeArc,
            colorFill: colorArcFill,
            latlngs,
            colorLine: colorArc,
            minZoom: 10,
        });
        this.layerDraw.addArc(arc);
    }
    drawStartEnd(track) {
        return;
        const that = this, { layerDraw } = that, { textStart, textEnd, colorTextStart, colorTextEnd, colorArcStart, colorArcEnd, sizeArc } = that.options;
        let { data } = track;
        if (!data || data.length < 2)
            return;
        let s = data[0], e = data[data.length - 1];
        let slatlng = [s.lat, s.lng], elatlng = [e.lat, e.lng];
        let sText = { latlng: slatlng, text: textStart, colorFill: colorTextStart, py: -10, ifShadow: true };
        let eText = { latlng: elatlng, text: textEnd, colorFill: colorTextEnd, py: -10, ifShadow: true };
        let sPoint = { latlng: slatlng, colorFill: colorArcStart, size: sizeArc };
        let ePoint = { latlng: elatlng, colorFill: colorArcEnd, size: sizeArc };
        layerDraw.addText(sText);
        layerDraw.addText(eText);
        layerDraw.addArc(sPoint);
        layerDraw.addArc(ePoint);
    }
    addPointEvent(track, eves) {
        if (!this.cbClickPoint)
            return;
        let latlngs = track.data.map((e) => [e.lat, e.lng]);
        eves.push({
            type: ["click"],
            minZoom: 10,
            latlngs: latlngs,
            info: track,
            range: [3, 3],
            cb: (e) => {
                this.cbClickPoint && this.cbClickPoint(e);
            },
        });
    }
    getInfoByTime(epoch, infos) {
        let len = infos.length, sData = infos[0], eData = infos[len - 1];
        if (epoch <= sData.timeStamp) {
            (sData = sData), (eData = infos[1] || sData);
        }
        else if (epoch >= eData.timeStamp) {
            (eData = eData), (sData = infos[len - 2] || eData);
        }
        else {
            for (let i = 0; i < len; i++) {
                (sData = infos[i]), (eData = infos[i + 1]);
                let s = sData.timeStamp, e = eData.timeStamp;
                if (s <= epoch && e >= epoch) {
                    break;
                }
            }
        }
        return this.computeDate(sData, eData, epoch);
    }
    computeDate(sData, eData, time) {
        let { lat: sLat, lng: sLng, timeStamp: sTime, course: rotate, speed: SPEED } = sData;
        let { lat: eLat, lng: eLng, timeStamp: eTime } = eData;
        if (sData == eData) {
            return { lat: sLat, lng: sLng, SPEED, time: new Date(time * 1000), rotate, speed: 0 };
        }
        let angleY = 90 - (Math.atan2(eLat - sLat, eLng - sLng) * 180) / Math.PI;
        let s = sTime, e = eTime, cur = time;
        let percentage = (cur - s) / (e - s);
        percentage = percentage > 1 ? 1 : percentage < 0 ? 0 : percentage;
        let dLat = eLat - sLat, dLng = eLng - sLng, lat = sLat + dLat * percentage, lng = sLng + dLng * percentage, speed = Math.sqrt(((dLat / (e - s)) * dLat) / (e - s) + ((dLng / (e - s)) * dLng) / (e - s));
        return { lat, lng, time: new Date(time * 1000), rotate: angleY, speed, SPEED };
    }
    clearCb() {
        this.cbClickPoint = undefined;
    }
    on(key, cb) {
        this.cbs[key] = cb;
    }
    trigger(key) {
        this.cbs[key] && this.cbs[key]();
    }
}
//# sourceMappingURL=plugin-track.js.map