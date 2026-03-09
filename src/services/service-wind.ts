import { MapPluginWind, SLUMap } from "@sl-utils/map";

export class MapServiceWind {
  constructor(private readonly sluMap_: SLUMap) {}
  private iconResolver?: (speed: number) => CanvasImage;
  /**将流体数据添加到 */
  public flowAdd(imgs: SLDMapGrid[]) {
    let layer = (this.layer = this.layer || new MapPluginWind(this.map, this.options));
    if (this.iconResolver) layer.setIconResolver(this.iconResolver);
    layer.setData(imgs);
  }
  public setOption(opt: Partial<SLPMap.Wind>) {
    Object.assign(this.options, opt);
  }
  public setIconResolver(resolver: (speed: number) => CanvasImage) {
    this.iconResolver = resolver;
    if (this.layer) this.layer.setIconResolver(resolver);
  }
  /**每个服务类都有的 */
  /**绘制图层 */
  private layer?: MapPluginWind;
  private options: Partial<SLPMap.Wind> = { 
    // url: '/assets/icons/icon-28.png',
    size: [28, 28],
    zooMsize: [
        [6, 6], [6, 6], [6, 6], [6, 6], [8, 8], [8, 8],//0-5
        [12, 12], [16, 16], [22, 22], [28, 28], [28, 28], [28, 28],//6-11
        [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32],
    ],
    pane: 'windPane'
  };
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
