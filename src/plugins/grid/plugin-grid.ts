import { MapPluginGridBase } from "./plugin-grid-base";
import { u_mapGetMapSize } from "../../utils/slu-map";
import { SLUMap } from "../../map";
import { DataMapGrid, OptMapGrid } from "../../types";
/**网格插件,用于渲染网格数据
 * @extends MapPluginGridBase
 * @constructor
 * @param sluMap 地图实例
 * @param options 基础配置
 */
export class MapPluginGrid extends MapPluginGridBase {
  constructor(sluMap: SLUMap, options: Partial<OptMapGrid>) {
    super(sluMap.map, options);
  }
  /**可视区内的网格数据XY */
  protected boundsDatas: [number, number, number][][] = [];
  /**设置渲染数据
   * @param datas 网格数据
   */
  public setData(datas: DataMapGrid[]): void {
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
    const { w, h } = u_mapGetMapSize(this.map);
    this.interpolateFieldByWorker({ x: 0, y: 0, width: w, height: h });
  }
  /**渲染静态图层 */
  protected renderFixedData(): void {
    this.renderStart();
  }
}