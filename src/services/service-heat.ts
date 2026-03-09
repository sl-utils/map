import { MapPluginHeat, SLUMap } from "@sl-utils/map";

/**热力图绘制服务类*/
export class MapServiceHeat {
  constructor(private readonly sluMap_: SLUMap) {}
  /**将流体数据添加到 */
  public heatAdd(heats: SLTMap.Heat.Info[]) {
    let layer = (this.layer = this.layer || new MapPluginHeat(this.map));
    layer.setAllHeats(heats);
  }
  setOptions() {
    
  }
  /**每个服务类都有的 */
  /**绘制图层 */
  private layer?: MapPluginHeat;
  /**地图实例 */
  private get map() {
    return this.sluMap_.map;
  }
  /**移除图层 */
  public remove() {
    let that = this;
    if (!that.layer) return;
    that.layer?.onRemove();
    that.layer = undefined;
  }
}
