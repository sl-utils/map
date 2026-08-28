import * as L from "leaflet";
import { MapPluginDraw } from "./plugin-draw";
import { MapCanvasEvent, SLUMap } from "../map";
import type { MapArc, MapLine, MapPoint, MapText, MapImage } from "../map/canvas-draw";
import type { MapEvent, MapEventResponse } from "../map/canvas-event";
import type { MOptCanvas } from "../map/canvas-layer";
import type { CanvasLine } from "../canvas";
import { Map as MaplibreMap } from 'maplibre-gl';
import { um_deepMergeOpt, um_togps84gcj02, um_tsMapisAmap } from "../utils";

/**
 * 轨迹绘制类
 *
 * 用于在地图上绘制历史轨迹，支持轨迹回放、动点展示、轨迹点事件等。
 * 常用于船舶、车辆、飞机等移动目标的历史轨迹展示。
 *
 * @constructor
 * @param sluMap SLUMap 地图实例
 * @param options 轨迹配置项
 *
 * @example
 * ```typescript
 * import { SLUMap, MapPluginTrack } from '@sl-utils/map';
 *
 * const map = new SLUMap('map');
 * await map.init({ type: 'L' });
 *
 * // 创建轨迹插件
 * const track = new MapPluginTrack(map, {
 *   ifArc: true,           // 显示轨迹点
 *   arcInterval: 1,        // 每隔1个点显示一个
 *   sizeArc: 3,            // 轨迹点大小
 *   colorArc: '#FFFFFF',   // 轨迹点边框颜色
 *   colorArcFill: '#D9AF3B', // 轨迹点填充颜色
 *   widthLine: 1,          // 轨迹线宽度
 *   colorLine: '#525b65',  // 轨迹线颜色
 *   textStart: '起点',     // 起点文本
 *   textEnd: '终点',       // 终点文本
 *   colorTextStart: '#8D4CC3',
 *   colorTextEnd: '#D85151'
 * });
 *
 * // 设置轨迹数据
 * track.setTracks([
 *   {
 *     id: 'track1',
 *     name: '船舶A',
 *     data: [
 *       { lng: 114.12, lat: 22.68, speed: 10, course: 45, timeStamp: 1625000000 },
 *       { lng: 114.15, lat: 22.70, speed: 12, course: 50, timeStamp: 1625000060 },
 *       { lng: 114.18, lat: 22.72, speed: 11, course: 48, timeStamp: 1625000120 }
 *     ],
 *     orginData: { mmsi: '123456789' }
 *   }
 * ]);
 *
 * // 显示轨迹
 * track.setIfShow(true);
 *
 * // 获取指定时间的位置信息
 * const position = track.getInfosByTime(new Date(1625000030 * 1000));
 *
 * // 设置动点图片
 * track.setAniImage([
 *   {
 *     lnglat: [114.15, 22.70],
 *     url: '/assets/icons/ship.png',
 *     size: [32, 32],
 *     rotate: 45
 *   }
 * ]);
 *
 * // 添加点击事件
 * track.addCbClickPoint((e) => {
 *   console.log('点击了轨迹点:', e.info);
 * });
 *
 * // 监听下一段数据请求
 * track.on('next', () => {
 *   // 加载下一段轨迹数据
 *   track.setTracks([nextTrackData]);
 * });
 *
 * // 移除图层
 * track.onRemove();
 * ```
 */
export class MapPluginTrack {
  constructor(sluMap: SLUMap, options?: Partial<MOptPluginTrack>) {
    const map = sluMap.map;
    this.map = map;
    if (options) this.options = um_deepMergeOpt(this.options, options);
    let zIndex = this.options.zIndex! + 1;
    this.layerDraw = new MapPluginDraw(sluMap, this.options);
    const aniOpt = um_deepMergeOpt(this.options, { zIndex, className: "track ani" });
    this.layerAniDraw = new MapPluginDraw(sluMap, aniOpt);
    this.allEvents = new MapCanvasEvent(map);
  }
  /**地图实例 */
  private map: L.Map | AMAP.Map | MaplibreMap;
  /**默认配置 */
  private options: MOptPluginTrack = {
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
  private allTracks: MDataTrackGroup[] = [];
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
  public setTracks(tracks: MDataTrackGroup[]): void {
    if (um_tsMapisAmap(this.map)) {
      tracks.forEach(track => {
        track.data.forEach(e => {
          const { lat, lng } = um_togps84gcj02(e.lng, e.lat);
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
  private drawHistoryTrack(track: MDataTrackGroup): void {
    this.drawLine(track);
    this.drawArc(track);
    this.drawStartEnd(track);
  }
  /**绘制轨迹线
   * @param track 轨迹数据
   */
  private drawLine(track: MDataTrackGroup): void {
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
  private drawArc(track: MDataTrackGroup): void {
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
  private drawStartEnd(track: MDataTrackGroup): void {
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
  private addPointEvent(track: MDataTrackGroup, eves: MapEvent[]): void {
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
  private getInfoByTime(epoch: number, infos: MDataTrack[]): MapTrackTimePosition {
    let len = infos.length,
      sData: MDataTrack = infos[0],
      eData: MDataTrack = infos[len - 1];
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
  private computeDate(sData: MDataTrack, eData: MDataTrack, time: number): MapTrackTimePosition {
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

/**轨迹点数据 */
export interface MDataTrack {
    /**纬度 */
    lat: number;
    /**经度 */
    lng: number;
    /**速度 */
    speed: number;
    /**航向 */
    course: number;
    /**时间戳 */
    timeStamp: number;
}

/**轨迹组数据 @template T 原始数据类型 */
export interface MDataTrackGroup<T = any> {
    /**轨迹组ID */
    id: string;
    /**轨迹组名称 */
    name: string;
    /**轨迹点数据 */
    data: MDataTrack[];
    /**原始数据 */
    orginData: T
}

/**轨迹时间位置信息 */
export interface MapTrackTimePosition {
    /**纬度 */
    lat: number,
    /**经度 */
    lng: number,
    /**时间 */
    time: Date,
    /**旋转角度 */
    rotate: number,
    /**速度 */
    speed: number
    /**速度(大写) */
    SPEED: number
}

/**轨迹信息 @template T 自定义类型 */
export type MapTrackInfo<T = {}> = CanvasLine & {
    /**经纬度集合 */
    lnglats: [number, number][];
    /**轨迹点信息 */
    infos: MapTrackPointInfo[];
} & T;

/**轨迹点信息 */
export type MapTrackPointInfo = {
    /**纬度 */
    lat: number;
    /**经度 */
    lng: number,
    /**时间 */
    time: Date,
    /**旋转角度 */
    rotate?: number;
};

/**轨迹点信息(带速度) */
export type MapTrackPointInfoByTime = {
    /**纬度 */
    lat: number;
    /**经度 */
    lng: number,
    /**时间 */
    time: Date,
    /**旋转角度 */
    rotate?: number;
    /**速度 */
    speed?: number;
};

/**轨迹插件配置 */
export interface MOptPluginTrack extends MOptCanvas {
    /**是否绘制圆弧 */
    ifArc?: boolean;
    /**圆弧间隔 */
    arcInterval?: number;
    /**最小图标 */
    minIcon?: string;
    /**圆弧大小 */
    sizeArc?: number;
    /**圆弧颜色 */
    colorArc?: string;
    /**圆弧填充颜色 */
    colorArcFill?: string;
    /**透明度 */
    alpha?: number;
    /**线宽 */
    widthLine?: number;
    /**线条颜色 */
    colorLine?: string;
    /**起始文本 */
    textStart?: string;
    /**结束文本 */
    textEnd?: string;
    /**起始文本颜色 */
    colorTextStart?: string;
    /**结束文本颜色 */
    colorTextEnd?: string;
    /**起始圆弧颜色 */
    colorArcStart?: string;
    /**结束圆弧颜色 */
    colorArcEnd?: string;
}
