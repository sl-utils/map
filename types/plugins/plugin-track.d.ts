import { SLUMap } from "../map";
import { DataMapTrackGroup, MapEventResponse, MapImage, MapText, MapTrackTimePosition, OptMapPluginTrack } from "../types";
/**轨迹绘制类
 * @constructor
 * @param sluMap 地图实例
 * @param options 配置项
 */
export declare class MapPluginTrack {
    constructor(sluMap: SLUMap, options?: Partial<OptMapPluginTrack>);
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
    setTracks(tracks: DataMapTrackGroup[]): void;
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
