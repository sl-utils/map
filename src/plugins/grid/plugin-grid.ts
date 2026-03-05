import { MapPluginGridBase } from "@sl-utils/map";
import { u_mapGetMapSize } from "../../utils/slu-map";


export class MapPluginGrid extends MapPluginGridBase {
  constructor(map: L.Map | AMAP.Map, options: Partial<SLPMapField>) {
    super(map, options);
  }
  /**可视区内的网格数据XY */
  protected boundsDatas: [number, number, number][][] = [];
  public setOptions(options: Partial<SLPMapField>) {
    Object.assign(this.options, options);
  }
  /**设置渲染数据 */
  public setData(datas: SLDMapGrid[]): void {
    this._setDatas(datas);
    this.renderStart();
  }
  public getInfoByLngLat(lng: number, lat: number): [number, number, number] | null {
    return this.interpolate(lng, lat);
  }
  /**渲染开始 */
  private renderStart() {
    const {w, h} = u_mapGetMapSize(this.map);
    this.interpolateFieldByWorker({ x: 0, y: 0, width: w, height: h });
  }
  protected renderFixedData(): void {
    this.renderStart();
  }
}

export interface SLPMapField extends SLPMapGrid {

}