import * as L from "leaflet";
import { MapPluginDraw } from "./plugin-draw";
import { MapCanvasEvent } from "@sl-utils/map";
export class MapPluginTrack {
  /**轨迹绘制类 */
  constructor(map: L.Map | AMAP.Map, options?: Partial<MapTrackPara>) {
    this.map = map;
    Object.assign(this.options, options);
    let zIndex = this.options.zIndex! + 1;
    this.layerDraw = new MapPluginDraw(map, this.options);
    this.layerAniDraw = new MapPluginDraw(map, Object.assign({}, this.options, { zIndex, className: "track ani" }));
    this.allEvents = new MapCanvasEvent(map);
  }
  private map: L.Map | AMAP.Map;
  /**默认配置 */
  private options: MapTrackPara = {
    pane: "canvas",
    ifLine: true,
    ifArc: true,
    arcInterval: 1,
    className: "track",
    zIndex: 100,
    sizeArc: 3,
    colorArc: "#FFFFFF",
    colorArcFill: "#D9AF3B",
    widthLine: 1,
    colorLine: "#525b65",
    textEnd: "终点",
    textStart: "起点",
    colorTextEnd: "#D85151",
    colorTextStart: "#8D4CC3",
    colorArcStart: "#8D4CC3",
    colorArcEnd: "#D85151",
  };
  /**当前的轨迹数据 */
  private allTracks: MapTrackGroup[] = [];
  /**现有轨迹最早的时间点 */
  private earlyTime: number = 0;
  /**距离最早时间点多少秒去获取下一阶段数据 */
  private intervalTime: number = 20;
  /**时间点 */
  private time: number = 0;
  /**事件集合 */
  private allEvents: MapCanvasEvent;
  /** */
  private layerDraw: MapPluginDraw;
  /**动态画船的图层 */
  private layerAniDraw: MapPluginDraw;
  /**指针点击所对应的点*/
  private cursorData!: MapPoint[];
  /**点击圆点时的回调*/
  private cbClickPoint?: (plotAni: MapEventResponse) => void;
  /**zoom变化 重设arc数据 */
  public onRemove() {
    this.layerDraw.onRemove();
    this.layerAniDraw.onRemove();
  }
  /**设置添加轨迹数据(并重新绘制) */
  public setTracks(tracks: MapTrackGroup[]) {
    const that = this,
      { allTracks } = that;
    /**添加数据到轨迹 */
    tracks.forEach(track => {
      const cur = allTracks.find(el => el.id === track.id);
      if (cur) {
        cur.data.push(...track.data);
      } else {
        allTracks.push(track);
      }
    })
    /**记录最早时间，以便获取下一阶段 */
    that.earlyTime = Infinity;
    allTracks.forEach(track => {
      const positions = track.data,
        len = positions.length,
        last = positions[len - 1];
      if (last) that.earlyTime = Math.min(that.earlyTime, last.timeStamp);
    })
    this.setAniImage([]);
  }
  /**获取指定时间各轨迹点的位置信息集合 */
  public getInfosByTime<T = any>(time: Date): ({ orginData: T } & MapTrackTimePosition)[] {
    const that = this,
      { allTracks } = that,
      curTimeDatas: ({ orginData: T } & MapTrackTimePosition)[] = [];
    that.time = time.getTime() / 1000;
    this.getNextTrack();
    allTracks.forEach(track => {
      const positions = track.data;
      let cur = this.getInfoByTime(that.time, positions);
      let point = Object.assign({}, { orginData: track.orginData }, cur);
      curTimeDatas.push(point);
    })
    this._drawTracks();
    return curTimeDatas;
  }
  /**获取下一时间段的数据 */
  private getNextTrack() {
    let { earlyTime, intervalTime, time } = this;
    if (!earlyTime || time - earlyTime < intervalTime) return;
    this.earlyTime = 0;
    /**通知外部获取下一段数据 */
    console.log("获取下一段数据");
    this.trigger("next");
  }
  /**设置轨迹上的动点船 */
  public setAniImage(imgs: MapImage[], texts: MapText[] = []) {
    const { layerAniDraw } = this;
    /**动态渲染需要时刻重新设置canvas 不然会导致错位 */
    layerAniDraw.resetCanvas();
    layerAniDraw.setAllImgs(imgs);
    layerAniDraw.setAllTexts(texts);
    layerAniDraw.drawMapAll();
  }
  /**添加点击圆点时的监听函数 */
  public addCbClickPoint(cb: (plotAni: MapEventResponse<any>) => void) {
    this.cbClickPoint = cb;
    this._drawTracks();
    return this;
  }
  /**设置轨迹的显示和隐藏 */
  public setOpt(opt: Partial<MapTrackPara>) {
    Object.assign(this.options, opt);
    this._drawTracks();
  }
  /**绘制轨迹数据 */
  private _drawTracks() {
    const that = this,
      { layerDraw, layerAniDraw, allEvents, allTracks, options, time } = that,
      { ifArc, ifLine } = options;
    layerDraw.resetCanvas();
    layerDraw.setAllLines([]);
    layerDraw.setAllArcs([]);
    layerDraw.setAllTexts([]);
    allEvents.clearEventsByKey("track");
    /**不绘制线就不进行绘制 */
    if (!ifLine) {
      layerDraw.drawMapAll();
      return;
    }
    let eves: MapEvent[] = [];
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
  /**单条轨迹绘制 （并给点添加事件）*/
  private drawHistoryTrack(track: MapTrackGroup) {
    this.drawLine(track);
    this.drawArc(track);
    this.drawStartEnd(track);
  }
  /**绘制轨迹线 */
  private drawLine(track: MapTrackGroup) {
    let { widthLine, colorLine } = this.options,
      { data } = track,
      time = this.time;
    let latlngs: [number, number][] = [];
    for (let i = 0; i < data.length; i++) {
      let e = data[i];
      latlngs.push([e.lat, e.lng]);
      if (e.timeStamp > time && i > 1) break;
    }
    let line: MapLine = {
      latlngs,
      widthLine,
      colorLine,
      minZoom: 10,
    };
    this.layerDraw.addLine(line);
  }
  /**绘制轨迹点 */
  private drawArc(track: MapTrackGroup) {
    let { sizeArc, colorArcFill, colorArc, arcInterval = 0, ifArc } = this.options,
      { data } = track;
    if (!ifArc) return;
    let time = 0;
    let latlngs: [number, number][] = data.map((e, i) => {
      if (arcInterval < 1000 && i % (arcInterval + 1) === 0) return [e.lat, e.lng];
      if (arcInterval >= 1000 && (e.timeStamp - time) / arcInterval > 1) {
        time = e.timeStamp;
        return [e.lat, e.lng];
      }
      return undefined;
    }).filter((e) => e) as [number, number][];
    let arc: MapArc = Object.assign(
      {},
      {
        size: sizeArc,
        colorFill: colorArcFill,
        latlngs,
        colorLine: colorArc,
        minZoom: 10,
      }
    );
    this.layerDraw.addArc(arc);
  }
  /**实现移除数组第一个和最后一个元素得到新的数组 */
  private removeFirstLast(arr: any[]) {
    let len = arr.length;
    if (len <= 2) return [];
    let newArr = arr.slice(1, len - 1);
    return newArr;
  }
  /**绘制轨迹起点终点 */
  private drawStartEnd(track: MapTrackGroup) {
    return;
    const that = this,
      { layerDraw } = that,
      { textStart, textEnd, colorTextStart, colorTextEnd, colorArcStart, colorArcEnd, sizeArc } = that.options;
    let { data } = track;
    if (!data || data.length < 2) return;
    let s = data[0],
      e = data[data.length - 1];
    let slatlng: [number, number] = [s.lat, s.lng],
      elatlng: [number, number] = [e.lat, e.lng];
    let sText: MapText = { latlng: slatlng, text: textStart, colorFill: colorTextStart, py: -10, ifShadow: true };
    let eText: MapText = { latlng: elatlng, text: textEnd, colorFill: colorTextEnd, py: -10, ifShadow: true };
    let sPoint: MapArc = { latlng: slatlng, colorFill: colorArcStart, size: sizeArc };
    let ePoint: MapArc = { latlng: elatlng, colorFill: colorArcEnd, size: sizeArc };
    layerDraw.addText(sText);
    layerDraw.addText(eText);
    layerDraw.addArc(sPoint);
    layerDraw.addArc(ePoint);
  }
  /**添加轨迹点事件*/
  private addPointEvent(track: MapTrackGroup, eves: MapEvent[]) {
    if (!this.cbClickPoint) return;
    let latlngs: [number, number][] = track.data.map((e) => [e.lat, e.lng])!;
    eves.push({
      type: ["click"],
      latlng: [90, 180],
      minZoom: 10,
      latlngs: latlngs,
      info: track,
      range: [3, 3],
      cb: (e) => {
        this.cbClickPoint && this.cbClickPoint(e);
      },
    });
  }
  /**获得指定时间的位置信息 */
  private getInfoByTime(epoch: number, infos: MapTrackItem[]): MapTrackTimePosition {
    let len = infos.length,
      sData: MapTrackItem = infos[0],
      eData: MapTrackItem = infos[len - 1];
    if (epoch <= sData.timeStamp) {
      (sData = sData), (eData = infos[1] || sData);
    } else if (epoch >= eData.timeStamp) {
      (eData = eData), (sData = infos[len - 2] || eData);
    } else {
      for (let i = 0; i < len; i++) {
        (sData = infos[i]), (eData = infos[i + 1]);
        let s = sData.timeStamp,
          e = eData.timeStamp;
        if (s <= epoch && e >= epoch) {
          break;
        }
      }
    }
    return this.computeDate(sData, eData, epoch);
  }
  /**计算位置信息 */
  private computeDate(sData: MapTrackItem, eData: MapTrackItem, time: number): MapTrackTimePosition {
    let { lat: sLat, lng: sLng, timeStamp: sTime, course: rotate, speed: SPEED } = sData;
    let { lat: eLat, lng: eLng, timeStamp: eTime } = eData;
    if (sData == eData) {
      return { lat: sLat, lng: sLng, SPEED, time: new Date(time * 1000), rotate, speed: 0 };
    }
    // let [sX, sY] = u_mapGetPointByLatlng(this.map, [sLat, sLng]),
    //     [eX, eY] = u_mapGetPointByLatlng(this.map, [eLat, eLng]);
    /**Math.atan2 正X轴和点(x, y)与原点连线之间的偏移角度*/
    let angleY = 90 - (Math.atan2(eLat - sLat, eLng - sLng) * 180) / Math.PI;
    /**计算指定时间的经纬度 */
    let s = sTime,
      e = eTime,
      cur = time;
    let percentage = (cur - s) / (e - s);
    percentage = percentage > 1 ? 1 : percentage < 0 ? 0 : percentage;
    let dLat = eLat - sLat,
      dLng = eLng - sLng,
      lat = sLat + dLat * percentage,
      lng = sLng + dLng * percentage,
      speed = Math.sqrt(((dLat / (e - s)) * dLat) / (e - s) + ((dLng / (e - s)) * dLng) / (e - s));
    return { lat, lng, time: new Date(time * 1000), rotate: angleY, speed, SPEED };
  }
  /**移除所有的监听函数 */
  private clearCb() {
    this.cbClickPoint = undefined;
  }

  private cbs = Object.create(null);
  /** */
  public on(key: string, cb: Function) {
    this.cbs[key] = cb;
  }
  /** */
  public trigger(key: string) {
    this.cbs[key] && this.cbs[key]();
  }
}
