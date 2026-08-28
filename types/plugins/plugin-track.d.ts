import { SLUMap } from "../map";
import type { MapText, MapImage } from "../map/canvas-draw";
import type { MapEventResponse } from "../map/canvas-event";
import type { MOptCanvas } from "../map/canvas-layer";
import type { CanvasLine } from "../canvas";
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
export declare class MapPluginTrack {
    constructor(sluMap: SLUMap, options?: Partial<MOptPluginTrack>);
    /**地图实例 */
    private map;
    /**默认配置 */
    private options;
    /**当前的轨迹数据 */
    private allTracks;
    /**现有轨迹最早的时间点 */
    private earlyTime;
    /**距离最早时间点多少秒去获取下一阶段数据 */
    private intervalTime;
    /**时间点 */
    private time;
    /**事件集合 */
    private allEvents;
    /**轨迹图层 */
    private layerDraw;
    /**动态画船的图层 */
    private layerAniDraw;
    /**指针点击所对应的点*/
    private cursorData;
    /**点击圆点时的回调
     * @param plotAni 点击事件数据
    */
    private cbClickPoint?;
    /**是否显示轨迹 */
    private ifShow;
    /**zoom变化 重设arc数据 */
    onRemove(): void;
    /**设置添加轨迹数据(并重新绘制)
     * @param tracks 轨迹数据
     */
    setTracks(tracks: MDataTrackGroup[]): void;
    /**获取指定时间各轨迹点的位置信息集合
     * @param time 时间点
     * @returns 指定时间各轨迹点的位置信息集合
     */
    getInfosByTime<T = any>(time: Date): ({
        orginData: T;
    } & MapTrackTimePosition)[];
    /**获取下一时间段的数据 */
    private getNextTrack;
    /**设置轨迹上的动点船
     * @param imgs 图片数据
     * @param texts @default [] 文本数据
     */
    setAniImage(imgs: MapImage[], texts?: MapText[]): void;
    /**添加点击圆点时的监听函数
     * @param cb 点击事件回调
     * @returns MapPluginTrack实例
     */
    addCbClickPoint(cb: (plotAni: MapEventResponse<any>) => void): MapPluginTrack;
    /**设置轨迹的显示和隐藏
     * @param ifShow 是否显示轨迹
     */
    setIfShow(ifShow: boolean): void;
    /**绘制轨迹数据 */
    private _drawTracks;
    /**单条轨迹绘制 （并给点添加事件）
     * @param track 轨迹数据
    */
    private drawHistoryTrack;
    /**绘制轨迹线
     * @param track 轨迹数据
     */
    private drawLine;
    /**绘制轨迹点
     * @param track 轨迹数据
     */
    private drawArc;
    /**绘制轨迹起点终点
     * @param track 轨迹数据
     */
    private drawStartEnd;
    /**添加轨迹点事件
     * @param track 轨迹数据
     * @param eves 事件数组
    */
    private addPointEvent;
    /**获得指定时间的位置信息
     * @param epoch 时间戳
     * @param infos 轨迹数据数组
     * @returns 位置信息
    */
    private getInfoByTime;
    /**计算位置信息
     * @param sData 起点轨迹数据
     * @param eData 终点轨迹数据
     * @param time 时间戳
     * @returns 位置信息
     */
    private computeDate;
    /**移除所有的监听函数 */
    private clearCb;
    /**监听函数对象 */
    private cbs;
    /**添加监听函数
     * @param key 事件键
     * @param cb 监听函数
    */
    on(key: string, cb: Function): void;
    /**触发监听函数
     * @param key 事件键
    */
    trigger(key: string): void;
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
    orginData: T;
}
/**轨迹时间位置信息 */
export interface MapTrackTimePosition {
    /**纬度 */
    lat: number;
    /**经度 */
    lng: number;
    /**时间 */
    time: Date;
    /**旋转角度 */
    rotate: number;
    /**速度 */
    speed: number;
    /**速度(大写) */
    SPEED: number;
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
    lng: number;
    /**时间 */
    time: Date;
    /**旋转角度 */
    rotate?: number;
};
/**轨迹点信息(带速度) */
export type MapTrackPointInfoByTime = {
    /**纬度 */
    lat: number;
    /**经度 */
    lng: number;
    /**时间 */
    time: Date;
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
