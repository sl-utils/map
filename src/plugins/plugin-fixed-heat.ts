import { OptMapPluginFixedHeat } from "@sl-utils/map";
import { MapCanvasFixedHeat, MapCanvasLayer, SLUMap } from "../map";
//todo 待完成
/**固定图片热力图
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap 地图实例
 * @param options 热力图配置
 */
export class MapPluginFixedHeat extends MapCanvasLayer {
  constructor(sluMap: SLUMap, options?: OptMapPluginFixedHeat) {
    super(sluMap.map, options);
    this.fixedHeat = new MapCanvasFixedHeat(sluMap.map, this.ctx, options);
  }
  private fixedHeat: MapCanvasFixedHeat;
  /**
   * 外部设置热力数据
   * @param data [经度, 纬度, 强度]
   */
  public setData(data: [number, number, number][]) {
    this.fixedHeat.setData(data);
  }
  /**静态数据层 */
  protected override renderFixedData(): void {
    this.fixedHeat.draw();
  }
  /**动态数据层 */
  // protected override renderAnimation(time?: number) { }
}