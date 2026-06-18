import { MapCanvasDraw, MapCanvasEvent, MapCanvasLayer } from "../map";
import { MapPluginDraw } from "./plugin-draw";
import { u_mapGetLatLngByPoint, u_mapGetLngDiffByDistance, u_mapGetMapMouseEvent, u_mapGetPointByLatlng, u_mapSetMapStatus, u_mapTogcj02gps84, u_mapTogps84gcj02, u_tsMapisAmap } from "../utils/slu-map";
export class MapPluginPlot extends MapCanvasLayer {
    constructor(sluMap, options) {
        const map = sluMap.map, { plotOpt, editOpt, textOpt } = options || {};
        super(map, plotOpt);
        this.options = {
            pane: 'canvas',
            className: 'plot',
        };
        this.editArc = {
            latlng: [0, 0],
            colorFill: '#fff',
            colorLine: '#2C9B8A',
            size: 4,
        };
        this.plotText = {
            colorFill: "#2C9B8A",
            widthLine: 2,
            colorLine: '#FFFFFF',
            ifShadow: true,
        };
        this.plotList = [];
        this.plotAni = { latLngs: [], type: 'polygon', ifEdit: true };
        this.eventClickTimer = null;
        this.eventClick = (e) => {
            this.eventClickTimer = setTimeout(() => {
                const plot = this.plotAni;
                if (!plot)
                    return;
                let { latlng } = u_mapGetMapMouseEvent(e, this.map);
                let lat84 = latlng.lat, lng84 = latlng.lng;
                if (u_tsMapisAmap(this.map)) {
                    const { lat, lng } = u_mapTogcj02gps84(latlng.lng, latlng.lat);
                    lat84 = lat, lng84 = lng;
                }
                const point = [lat84, lng84];
                if (plot.type === 'polygon' || plot.type === 'line') {
                    plot.latLngs.push(point);
                }
                else if (plot.latLngs.length < 2) {
                    plot.latLngs = [...plot.latLngs, point];
                }
                if ((plot.type === 'rect' || plot.type === 'circle') && plot.latLngs.length >= 2) {
                    this.eventDblclick();
                }
                else {
                    this._redraw();
                }
                this.cbPointChange && this.cbPointChange(this.plotAni);
            }, 50);
        };
        this.eventMousemove = (e) => {
            let { latlng } = u_mapGetMapMouseEvent(e, this.map);
            let lat84 = latlng.lat, lng84 = latlng.lng;
            if (u_tsMapisAmap(this.map)) {
                const { lat, lng } = u_mapTogcj02gps84(latlng.lng, latlng.lat);
                lat84 = lat, lng84 = lng;
            }
            this.curPoint = [lat84, lng84];
            this.renderAnimation();
        };
        this.eventDblclick = () => {
            if (this.eventClickTimer) {
                clearTimeout(this.eventClickTimer);
                this.eventClickTimer = null;
            }
            const plot = this.plotAni;
            if (!plot)
                return;
            const { type, latLngs } = plot;
            if (type === 'polygon' && latLngs.length < 3) {
                return;
            }
            this.close();
            this.curPoint = undefined;
            this._redraw();
        };
        this.ctrMapDraw = new MapCanvasDraw(map, this.canvas);
        Object.assign(this.options, plotOpt);
        this.ctrMapAniDraw = new MapPluginDraw(sluMap, Object.assign({}, this.options, { className: this.options.className + ' ani' }));
        this.ctrEvent = new MapCanvasEvent(map);
        Object.assign(this.editArc, editOpt);
        Object.assign(this.plotText, textOpt);
    }
    open(type) {
        let i = this.plotList.length - 1 > 0 ? this.plotList.length - 1 : 0;
        this.eventSwitch(true);
        let plot = this.plotList.find(info => info.ifEdit);
        if (plot) {
            plot.latLngs = [];
            plot.type = type;
            plot.ifEdit = true;
            this.plotAni = plot;
            return plot;
        }
        if (this.plotAni && this.plotAni === this.plotList[i] && this.plotAni.ifEdit) {
            const cur = this.plotAni;
            cur.latLngs = [];
            cur.type = type;
            cur.ifEdit = true;
            return cur;
        }
        if (this.plotList[i] && this.plotList[i].latLngs.length > 0)
            i++;
        const newplot = this.createPlot(type);
        this.plotList[i] = this.plotAni = newplot;
        this.renderAnimation();
        this.cbPlotListChange && this.cbPlotListChange(this.plotList);
        return this.plotAni;
    }
    close() {
        this.eventSwitch(false);
        return this;
    }
    savePlot() {
        if (this.plotAni) {
            let plot = this.plotAni;
            plot.ifEdit = false;
            this.plotAni = undefined;
            this.redraw();
            this.cbPlotListChange && this.cbPlotListChange(this.plotList);
        }
        return this;
    }
    delPlot(plot) {
        plot = plot || this.plotAni;
        const idx = this.plotList.findIndex(info => info === plot);
        if (idx > -1)
            this.plotList.splice(idx, 1);
        this._redraw();
        this.cbPlotListChange && this.cbPlotListChange(this.plotList);
        return this;
    }
    setPlotList(plotList) {
        this.plotList = plotList;
        this.renderFixedData();
        return this;
    }
    setEditPlot(plot) {
        let info = this.plotList.find(info => info === plot);
        info && (info.ifEdit = true);
        this.eventSwitch(false);
        this._redraw();
        return this;
    }
    redraw() {
        this._redraw();
        return this;
    }
    renderFixedData() {
        if (!this.map)
            return;
        this.ctrMapDraw.delAll();
        this.ctrMapDraw.reSetCanvas();
        this.plotList.forEach((info, i) => {
            if (info.latLngs.length > 0 && !info.ifEdit && info.ifHide !== true) {
                this.drawPlot(this.ctrMapDraw, info, info.type);
            }
        });
        this.ctrMapDraw.drawMapAll();
    }
    renderAnimation() {
        if (!this.map)
            return;
        this.genAniPlot();
    }
    createPlot(type) {
        switch (type) {
            case 'point':
                return { type: 'point', latLngs: [], ifEdit: true, url: '', points: [] };
            case 'circle':
                return { type: 'circle', latLngs: [], ifEdit: true };
            case 'rect':
                return { type: 'rect', latLngs: [], ifEdit: true };
            case 'line':
            case 'polygon':
                return { type, latLngs: [], ifEdit: true };
        }
    }
    genAniPlot() {
        this.ctrMapAniDraw.delAll();
        this.ctrMapAniDraw.resetCanvas();
        this.ctrEvent.clearAllEvents();
        let polygon = this.plotList.find(info => info.ifEdit);
        if (polygon) {
            this.plotAni = polygon;
            let plotAni = { ...polygon }, latlngs = polygon.latLngs;
            if (this.curPoint && (plotAni.type === 'circle' && latlngs.length < 2 || plotAni.type !== 'circle')) {
                plotAni.latLngs = [...latlngs, this.curPoint];
            }
            this.drawPlot(this.ctrMapAniDraw, plotAni, plotAni.type);
            this.openMouseEdit(plotAni);
            this.ctrMapAniDraw.drawMapAll();
            return;
        }
    }
    drawPlot(layer, plotInfo, type) {
        let info = Object.assign({}, this.options, plotInfo);
        info.colorFill = info.colorFill;
        info.colorLine = info.colorLine || info.colorFill;
        switch (info.type) {
            case 'line':
                layer.addLine({ ...info, latlngs: info.latLngs });
                break;
            case 'polygon':
                let polygon = { ...info, latlngs: info.latLngs };
                layer.addRect(polygon);
                break;
            case 'circle':
                if (info.latLngs.length == 0)
                    break;
                let [slatlng, elatlng] = info.latLngs, rail = info.rail || 0;
                if (!elatlng) {
                    let [lat, lng] = slatlng;
                    let lngDis = u_mapGetLngDiffByDistance(this.map, rail, [[lat, lng]]);
                    info.latLngs[1] = [lat, lng + lngDis];
                }
                let size = this.calcRadius(info.latLngs);
                layer.addArc({ ...info, size, latlng: slatlng });
                break;
            case 'rect':
                const latlngs = this.calcRect(info.latLngs);
                let rect = { ...info, latlngs };
                layer.addRect(rect);
                break;
            case 'point':
                if (!info.latLngs.length)
                    break;
                const { url, size: pSize = [16, 16] } = info;
                if (url) {
                    layer.addImg({ ...info, latlng: info.latLngs[0], size: pSize });
                }
                else {
                    layer.addArc({ ...info, size: 4, dash: [0, 0], latlng: info.latLngs[0] });
                }
                break;
        }
        let name = { ...this.plotText, text: info.name || '', latlng: this.calcCenter(info.latLngs, type) };
        layer.addText(name);
    }
    calcCenter(points, type) {
        let len = points.length;
        if (len < 2 || type === 'circle' || type == 'point')
            return (points[0] || [0, 0]);
        if (type == 'line') {
            let totalLength = 0;
            let weightedXSum = 0;
            let weightedYSum = 0;
            for (let i = 0, len = points.length - 1; i < len; i++) {
                const [x1, y1] = points[i];
                const [x2, y2] = points[i + 1];
                const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                totalLength += length;
                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;
                weightedXSum += midX * length;
                weightedYSum += midY * length;
            }
            const centerX = weightedXSum / totalLength;
            const centerY = weightedYSum / totalLength;
            return [centerX, centerY];
        }
        let center = points.reduce((pre, cur) => {
            return [(pre[0] + cur[0]), pre[1] + cur[1]];
        }, [0, 0]);
        center = [center[0] / len, center[1] / len];
        return center;
    }
    calcCenter2(points) {
        let len = points.length;
        if (len < 2)
            return (points[0] || [0, 0]);
        let maxmin = points.reduce((pre, cur) => {
            let [maxLat, minLat, maxLng, minLng] = pre;
            return [
                maxLat > cur[0] ? maxLat : cur[0],
                minLat < cur[0] ? minLat : cur[0],
                maxLng > cur[1] ? maxLng : cur[1],
                minLng < cur[1] ? minLng : cur[1]
            ];
        }, [-Infinity, Infinity, -Infinity, Infinity]);
        let [maxLat, minLat, maxLng, minLng] = maxmin;
        return [(maxLat + minLat) / 2, (maxLng + minLng) / 2];
    }
    calcCenter3(points) {
        let xSum = 0;
        let ySum = 0;
        let areaSum = 0;
        for (let i = 0, len = points.length - 1; i < len; i++) {
            const j = (i + 1) % points.length;
            const cross = points[i][0] * points[j][1] - points[j][0] * points[i][1];
            areaSum += cross;
            xSum += (points[i][0] + points[j][0]) * cross;
            ySum += (points[i][1] + points[j][1]) * cross;
        }
        areaSum *= 3;
        const center = [xSum / areaSum, ySum / areaSum];
        return center;
    }
    calcRect(latLngs) {
        if (latLngs.length < 2)
            return latLngs;
        let latlngs = [];
        let [latlng1, latlng2] = latLngs;
        latlngs.push(latlng1);
        latlngs.push([latlng1[0], latlng2[1]]);
        latlngs.push(latlng2);
        latlngs.push([latlng2[0], latlng1[1]]);
        return latlngs;
    }
    calcRadius(latLngs) {
        if (latLngs.length < 2)
            return 0;
        let [px1, py1] = u_mapGetPointByLatlng(this.map, latLngs[0]);
        let [px2, py2] = u_mapGetPointByLatlng(this.map, latLngs[1]);
        let x = Math.abs(px1 - px2);
        let y = Math.abs(py1 - py2);
        return Math.sqrt(x * x + y * y);
    }
    openMouseEdit(plotInfo) {
        let type = plotInfo.type;
        switch (type) {
            case 'point':
                return this.setPointEdit(plotInfo);
            case 'line':
                return this.setLineEditPoint(plotInfo);
            case 'polygon':
                return this.setPolygonEditPoint(plotInfo);
            case 'circle':
                return this.setCircleEditPoint(plotInfo);
            case 'rect':
                return this.setRectEditPoint(plotInfo);
        }
    }
    setCircleEditPoint(plotInfo) {
        let { latLngs } = plotInfo, eves = [];
        for (let i = 0, len = latLngs.length; i < len; i++) {
            let s = latLngs[i];
            this.addEvent(s, i, plotInfo, eves, false);
        }
        let line = { ...this.options, latlngs: plotInfo.latLngs };
        this.ctrMapAniDraw.addLine(line);
        this.ctrEvent.setEventsByKey(eves, 'circleEdit');
    }
    setPolygonEditPoint(plotInfo) {
        let { latLngs } = plotInfo, eves = [];
        for (let i = 0, len = latLngs.length; i < len; i++) {
            let s = latLngs[i];
            this.addEvent(s, i, plotInfo, eves, false);
            if (!this.curPoint) {
                let next = i + 1 == len ? 0 : i + 1, e = latLngs[next];
                let [px1, py1] = u_mapGetPointByLatlng(this.map, s);
                let [px2, py2] = u_mapGetPointByLatlng(this.map, e);
                let x = (px1 + px2) / 2, y = (py1 + py2) / 2;
                let point = u_mapGetLatLngByPoint(this.map, [x, y]);
                this.addEvent(point, i, plotInfo, eves, true);
            }
        }
        this.ctrEvent.setEventsByKey(eves, 'polygonEdit');
    }
    setPointEdit(plotInfo) {
        let { latLngs } = plotInfo;
        if (!latLngs || latLngs.length != 2)
            return;
        let eves = [];
        this.addEvent(latLngs[0], 0, plotInfo, eves);
        this.ctrEvent.setEventsByKey(eves, 'pointEdit');
    }
    setLineEditPoint(plotInfo) {
        let { latLngs } = plotInfo, eves = [];
        for (let i = 0, len = latLngs.length; i < len; i++) {
            let s = latLngs[i];
            this.addEvent(s, i, plotInfo, eves, false);
        }
        this.ctrEvent.setEventsByKey(eves, 'lineEdit');
    }
    setRectEditPoint(plotInfo) {
        let { latLngs } = plotInfo, eves = [];
        let latlngs = this.calcRect(latLngs);
        for (let i = 0, len = latlngs.length; i < len; i++) {
            let latLng = latlngs[i];
            this.addEvent(latLng, i, plotInfo, eves, false);
        }
        this.ctrEvent.setEventsByKey(eves, 'rectEdit');
    }
    addEvent(latLng, i, plotInfo, eves, ifVirtual) {
        const that = this, { map } = that;
        let circle = { ...this.editArc, latlng: latLng }, { latLngs, type } = plotInfo;
        if (ifVirtual) {
            circle.size = 3, circle.fillAlpha = 0.9;
        }
        ;
        this.ctrMapAniDraw.addArc(circle);
        let hitLatLng = latLng;
        if (u_tsMapisAmap(this.map)) {
            const { lat, lng } = u_mapTogps84gcj02(latLng[1], latLng[0]);
            hitLatLng = [lat, lng];
        }
        eves.push({
            latlng: hitLatLng,
            type: 'mousedown',
            cb: () => {
                u_mapSetMapStatus(map, 'dragEnable', false);
                if (ifVirtual) {
                    for (let j = latLngs.length, end = i + 1; j > end; j--) {
                        latLngs[j] = latLngs[j - 1];
                    }
                    latLngs[i + 1] = latLng;
                    this.cbPointChange && this.cbPointChange(this.plotAni);
                }
                this._redraw();
                let moveCb = (e) => {
                    let { latlng: eLatlng } = u_mapGetMapMouseEvent(e, this.map);
                    let lat84 = eLatlng.lat, lng84 = eLatlng.lng;
                    if (u_tsMapisAmap(this.map)) {
                        const { lat, lng } = u_mapTogcj02gps84(eLatlng.lng, eLatlng.lat);
                        lat84 = lat, lng84 = lng;
                    }
                    if (type === 'polygon' || type === 'circle' || type === 'point' || type === 'line') {
                        latLng[0] = lat84;
                        latLng[1] = lng84;
                    }
                    else if (type === 'rect') {
                        let points = this.calcRect(latLngs);
                        let index = (i + 2) % 4;
                        let p1 = [lat84, lng84];
                        let p2 = points[index];
                        this.plotAni.latLngs = [p1, p2].filter(p => !!p);
                    }
                    this.renderAnimation();
                };
                let upCb = () => {
                    this.map.off('mousemove', moveCb);
                    this.map.off('mouseup', upCb);
                    u_mapSetMapStatus(map, 'dragEnable', true);
                    this.cbPointChange && this.cbPointChange(this.plotAni);
                    this._redraw();
                };
                this.map.on('mousemove', moveCb);
                this.map.on('mouseup', upCb);
            }
        });
    }
    eventSwitch(flag) {
        let key = flag ? 'on' : 'off';
        if (flag)
            this.eventSwitch(false);
        this.map[key]('click', this.eventClick);
        this.map[key]('dblclick', this.eventDblclick);
        this.map[key]('mousemove', this.eventMousemove);
    }
    clearCb() {
        this.cbPointAdd = undefined;
        this.cbPointMove = undefined;
        this.cbPointChange = undefined;
    }
    addCbPointChange(cb) {
        this.cbPointChange = cb;
        return this;
    }
    addCbPointAdd(cb) {
        this.cbPointAdd = cb;
        return this;
    }
    addCbPointMove(cb) {
        this.cbPointMove = cb;
        return this;
    }
    addCbPlotListChange(cb) {
        this.cbPlotListChange = cb;
        return this;
    }
}
//# sourceMappingURL=plugin-plot.js.map