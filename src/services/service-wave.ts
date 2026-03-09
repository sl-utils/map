import { MapPluginGrid, SLPMapField, SLUMap } from "@sl-utils/map";

/**地图浪绘制服务类*/
export class MapServiceWave {
  constructor(private readonly sluMap_: SLUMap) {}
  /**将流体数据添加到 */
  public flowAdd(imgs: SLDMapGrid[]) {
    let layer = (this.layer = this.layer || new MapPluginGrid(this.map as L.Map, this.options));
    layer.setData(imgs);
  }
  /**每个服务类都有的 */
  /**绘制图层 */
  private layer?: MapPluginGrid;
  private options: Partial<SLPMapField> = {
    zIndex: 200,
    mosaicColor: [
      "#0000CD",
      "#0066ff",
      "#00B7ff",
      "#00E0FF",
      "#00FFFF",
      "#00FFCC",
      "#00FF99",
      "#00FF00",
      "#99FF00",
      "#CCFF00",
      "#FFFF00",
      "#FFCC00",
      "#FF9900",
      "#FF6600",
      "#FF0000",
      "#B03060",
      "#D02090",
      "#FF00FF",
    ],
    mosaicValue: [0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    pane: "wavePane",
  };
  /**地图实例 */
  private get map() {
    return this.sluMap_.map;
  }
  public setOption(opt: Partial<SLPMapField>) {
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
