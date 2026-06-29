import * as L from "leaflet";
import { MapPluginDraw } from "./plugin-draw";
import { MapCanvasEvent, SLUMap } from "../map";
import { DataMapTrack, DataMapTrackGroup, MapArc, MapEvent, MapEventResponse, MapImage, MapLine, MapPoint, MapText, MapTrackTimePosition, OptMapPluginTrack } from "../types";
import { Map as MaplibreMap } from 'maplibre-gl';
import { u_deepMergeOpt, u_mapTogps84gcj02, u_tsMapisAmap } from "../utils";
/**轨迹绘制类
 * @constructor
 * @param sluMap 地图实例
 * @param options 配置项
 */
export class MapPluginTrack {
  constructor(sluMap: SLUMap, options?: Partial<OptMapPluginTrack>) {
    const map = sluMap.map;
    this.map = map;
    if (options) this.options = u_deepMergeOpt(this.options, options);
    let zIndex = this.options.zIndex! + 1;
    this.layerDraw = new MapPluginDraw(sluMap, this.options);
    const aniOpt = u_deepMergeOpt(this.options, { zIndex, className: "track ani" });
    this.layerAniDraw = new MapPluginDraw(sluMap, aniOpt);
    this.allEvents = new MapCanvasEvent(map);
  }
  /**地图实例 */
  private map: L.Map | AMAP.Map | MaplibreMap;
  /**默认配置 */
  private options: OptMapPluginTrack = {
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
  /**当前的轨迹数据 */
  private allTracks: DataMapTrackGroup[] = [];
  /**现有轨迹最早的时间点 */
  private earlyTime: number = 0;
  /**距离最早时间点多少秒去获取下一阶段数据 */
  private intervalTime: number = 20;
  /**时间点 */
  private time: number = 0;
  /**事件集合 */
  private allEvents: MapCanvasEvent;
  /**轨迹图层 */
  private layerDraw: MapPluginDraw;
  /**动态画船的图层 */
  private layerAniDraw: MapPluginDraw;
  /**指针点击所对应的点*/
  private cursorData!: MapPoint[];
  /**点击圆点时的回调
   * @param plotAni 点击事件数据
  */
  private cbClickPoint?: (plotAni: MapEventResponse) => void;
  /**是否显示轨迹 */
  private ifShow: boolean = false;
  /**zoom变化 重设arc数据 */
  public onRemove(): void {
    this.layerDraw.onRemove();
    this.layerAniDraw.onRemove();
  }
  /**设置添加轨迹数据(并重新绘制)
   * @param tracks 轨迹数据
   */
  public setTracks(tracks: DataMapTrackGroup[]): void {
    if (u_tsMapisAmap(this.map)) {
      tracks.forEach(track => {
        track.data.forEach(e => {
          const { lat, lng } = u_mapTogps84gcj02(e.lng, e.lat);
          e.lat = lat;
          e.lng = lng;
        })
      })
    }
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
  /**获取指定时间各轨迹点的位置信息集合
   * @param time 时间点
   * @returns 指定时间各轨迹点的位置信息集合
   */
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
  private getNextTrack(): void {
    let { earlyTime, intervalTime, time } = this;
    if (!earlyTime || time - earlyTime < intervalTime) return;
    this.earlyTime = 0;
    /**通知外部获取下一段数据 */
    // console.log("获取下一段数据");
    this.trigger("next");
  }
  /**设置轨迹上的动点船
   * @param imgs 图片数据
   * @param texts @default [] 文本数据
   */
  public setAniImage(imgs: MapImage[], texts: MapText[] = []): void {
    const { layerAniDraw } = this;
    /**动态渲染需要时刻重新设置canvas 不然会导致错位 */
    layerAniDraw.resetCanvas();
    layerAniDraw.setAllImgs(imgs);
    layerAniDraw.setAllTexts(texts);
    layerAniDraw.drawMapAll();
  }
  /**添加点击圆点时的监听函数
   * @param cb 点击事件回调 
   * @returns MapPluginTrack实例
   */
  public addCbClickPoint(cb: (plotAni: MapEventResponse<any>) => void): MapPluginTrack {
    this.cbClickPoint = cb;
    this._drawTracks();
    return this;
  }
  /**设置轨迹的显示和隐藏
   * @param ifShow 是否显示轨迹
   */
  public setIfShow(ifShow: boolean): void {
    this.ifShow = ifShow;
    this._drawTracks();
  }
  /**绘制轨迹数据 */
  private _drawTracks(): void {
    const that = this,
      { layerDraw, layerAniDraw, allEvents, allTracks, options, time } = that,
      { ifArc } = options;
    layerDraw.resetCanvas();
    layerDraw.setAllLines([]);
    layerDraw.setAllArcs([]);
    layerDraw.setAllTexts([]);
    allEvents.clearEventsByKey("track");
    /**不绘制线就不进行绘制 */
    if (!this.ifShow) {
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
  /**单条轨迹绘制 （并给点添加事件）
   * @param track 轨迹数据
  */
  private drawHistoryTrack(track: DataMapTrackGroup): void {
    this.drawLine(track);
    this.drawArc(track);
    this.drawStartEnd(track);
  }
  /**绘制轨迹线
   * @param track 轨迹数据
   */
  private drawLine(track: DataMapTrackGroup): void {
    let { widthLine, colorLine } = this.options,
      { data } = track,
      time = this.time;
    let lnglats: [number, number][] = [];
    for (let i = 0, len = data.length; i < len; i++) {
      let e = data[i];
      lnglats.push([e.lng, e.lat]);
      if (e.timeStamp > time && i > 1) break;
    }
    let line: MapLine = {
      lnglats,
      widthLine,
      colorLine,
      minZoom: 10,
    };
    this.layerDraw.addLine(line);
  }
  /**绘制轨迹点
   * @param track 轨迹数据
   */
  private drawArc(track: DataMapTrackGroup): void {
    let { sizeArc, colorArcFill, colorArc, arcInterval = 0, ifArc } = this.options,
      { data } = track;
    if (!ifArc) return;
    let time = 0;
    let lnglats: [number, number][] = data.map((e, i) => {
      if (arcInterval < 1000 && i % (arcInterval + 1) === 0) return [e.lng, e.lat];
      if (arcInterval >= 1000 && (e.timeStamp - time) / arcInterval > 1) {
        time = e.timeStamp;
        return [e.lng, e.lat];
      }
      return undefined;
    }).filter((e): e is [number, number] => e !== undefined);
    let arc: MapArc = Object.assign(
      {},
      {
        size: sizeArc,
        colorFill: colorArcFill,
        lnglats,
        colorLine: colorArc,
        minZoom: 10,
      }
    );
    this.layerDraw.addArc(arc);
  }
  /**绘制轨迹起点终点
   * @param track 轨迹数据
   */
  private drawStartEnd(track: DataMapTrackGroup): void {
    return;
    const that = this,
      { layerDraw } = that,
      { textStart, textEnd, colorTextStart, colorTextEnd, colorArcStart, colorArcEnd, sizeArc } = that.options;
    let { data } = track;
    if (!data || data.length < 2) return;
    let s = data[0],
      e = data[data.length - 1];
    let slatlng: [number, number] = [s.lng, s.lat],
      elatlng: [number, number] = [e.lng, e.lat];
    let sText: MapText = { lnglat: slatlng, text: textStart, colorFill: colorTextStart, py: -10, ifShadow: true };
    let eText: MapText = { lnglat: elatlng, text: textEnd, colorFill: colorTextEnd, py: -10, ifShadow: true };
    let sPoint: MapArc = { lnglat: slatlng, colorFill: colorArcStart, size: sizeArc };
    let ePoint: MapArc = { lnglat: elatlng, colorFill: colorArcEnd, size: sizeArc };
    layerDraw.addText(sText);
    layerDraw.addText(eText);
    layerDraw.addArc(sPoint);
    layerDraw.addArc(ePoint);
  }
  /**添加轨迹点事件
   * @param track 轨迹数据
   * @param eves 事件数组
  */
  private addPointEvent(track: DataMapTrackGroup, eves: MapEvent[]): void {
    if (!this.cbClickPoint) return;
    let lnglats: [number, number][] = track.data.map((e) => [e.lng, e.lat])!;
    eves.push({
      type: ["click"],
      minZoom: 10,
      lnglats: lnglats,
      info: track,
      range: [3, 3],
      cb: (e: MapEventResponse) => {
        this.cbClickPoint && this.cbClickPoint(e);
      },
    });
  }
  /**获得指定时间的位置信息
   * @param epoch 时间戳
   * @param infos 轨迹数据数组
   * @returns 位置信息
  */
  private getInfoByTime(epoch: number, infos: DataMapTrack[]): MapTrackTimePosition {
    let len = infos.length,
      sData: DataMapTrack = infos[0],
      eData: DataMapTrack = infos[len - 1];
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
  /**计算位置信息
   * @param sData 起点轨迹数据
   * @param eData 终点轨迹数据
   * @param time 时间戳
   * @returns 位置信息
   */
  private computeDate(sData: DataMapTrack, eData: DataMapTrack, time: number): MapTrackTimePosition {
    let { lat: sLat, lng: sLng, timeStamp: sTime, course: rotate, speed: SPEED } = sData;
    let { lat: eLat, lng: eLng, timeStamp: eTime } = eData;
    if (sData == eData) {
      return { lat: sLat, lng: sLng, SPEED, time: new Date(time * 1000), rotate, speed: 0 };
    }
    // let [sX, sY] = u_mapGetPointByLnglat(this.map, [sLng, sLat]),
    //   [eX, eY] = u_mapGetPointByLnglat(this.map, [eLng, eLat]);
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
  private clearCb(): void {
    this.cbClickPoint = undefined;
  }

  /**监听函数对象 */
  private cbs: Record<string, Function> = Object.create(null);
  /**添加监听函数
   * @param key 事件键
   * @param cb 监听函数
  */
  public on(key: string, cb: Function): void {
    this.cbs[key] = cb;
  }
  /**触发监听函数
   * @param key 事件键
  */
  public trigger(key: string): void {
    this.cbs[key] && this.cbs[key]();
  }
}
