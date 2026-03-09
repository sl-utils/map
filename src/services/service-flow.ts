import { MapPluginFlow, SLUMap } from "@sl-utils/map";

export class MapServiceFlow {
  constructor(private readonly sluMap_: SLUMap) {}
  /**将流体数据添加到 */
  public flowAdd(imgs: SLDVeloctiyWind[]) {
    let layer = (this.layer = this.layer || new MapPluginFlow(this.map, this.options));
    layer.setData(imgs);
  }
  private options: SLPMapVelocity = {
    pane: "flowPane",
    displayValues: true,
    unit: "m/s",
    angleConvention: "bearingCCW",
    emptyString: "No velocity data",
    maxVelocity: 15,
    colorScale: null,
  }
  /**每个服务类都有的 */
  /**绘制图层 */
  private layer?: MapPluginFlow;
  /**地图实例 */
  private get map() {
    return this.sluMap_.map;
  }
  public setOption(opt: Partial<SLPMap.Wind>) {
    Object.assign(this.options, opt);
  }
  /**移除图层 */
  public remove() {
    let that = this;
    if (!that.layer) return;
    that.layer?.onRemove();
    that.layer = undefined;
  }
}
