import { MapPluginGridBase } from "./plugin-grid-base";
import { um_getMapSize } from "../../utils";
import { SLMap } from "../../map";
import { MDataGrid, MOptGrid } from "./plugin-grid-base";
/**
 * 网格插件
 *
 * 用于渲染网格数据，支持马赛克填色和渐变色效果。
 * 适用于海浪、风场、温度场等规则经纬度栅格数据的可视化。
 *
 * @extends MapPluginGridBase
 * @constructor
 * @param sluMap SLMap 地图实例
 * @param options 网格配置
 *
 * @example
 * ```typescript
 * import { SLMap, MapPluginGrid } from '@sl-utils/map';
 *
 * const map = new SLMap('map');
 * await map.init({ type: 'L' });
 *
 * // 创建网格插件
 * const grid = new MapPluginGrid(map, {
 *   zIndex: 200,
 *   mosaicColor: [
 *     '#0000CD', '#0066ff', '#00B7ff', '#00E0FF',
 *     '#00FFFF', '#00FFCC', '#00FF99', '#00FF00',
 *     '#99FF00', '#CCFF00', '#FFFF00', '#FFCC00',
 *     '#FF9900', '#FF6600', '#FF0000', '#B03060',
 *     '#D02090', '#FF00FF'
 *   ],
 *   mosaicValue: [0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
 * });
 *
 * // 加载并设置网格数据
 * const waveData = await (await fetch('./json/wave-global.json')).json();
 * grid.setData(waveData);
 *
 * // 获取指定经纬度的数据
 * const info = grid.getInfoByLngLat(114.12, 22.68);
 * if (info) {
 *   console.log(`浪高: ${info[2]} 米`);
 * }
 *
 * // 移除图层
 * grid.onRemove();
 * ```
 */
export class MapPluginGrid extends MapPluginGridBase {
  constructor(sluMap: SLMap, options: Partial<MOptGrid>) {
    super(sluMap.map, options);
  }
  /**可视区内的网格数据XY */
  protected boundsDatas: [number, number, number][][] = [];
  /**设置渲染数据
   * @param datas 网格数据
   */
  public setData(datas: MDataGrid[]): void {
    this._setDatas(datas);
    this.renderStart();
  }
  /**根据经纬度获取网格数据
   * @param lng 经度
   * @param lat 纬度
   * @returns 网格数据
   */
  public getInfoByLngLat(lng: number, lat: number): [number, number, number] | null {
    return this.interpolate(lng, lat);
  }
  /**渲染开始 */
  private renderStart(): void {
    const { w, h } = um_getMapSize(this.map);
    this.interpolateFieldByWorker({ x: 0, y: 0, width: w, height: h });
  }
  /**渲染静态图层 */
  protected renderFixedData(): void {
    this.renderStart();
  }
}