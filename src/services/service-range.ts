import { MapPluginRange } from "@sl-utils/map";


/**地图测距服务类 */
export class MapServiceRange {
  constructor(private readonly map_: AMAP.Map | L.Map,) {}
  /**开启,关闭测距
   * @param flag 是否开启
   * @param map 地图对象
   */
  public openRange(flag: boolean = true) {
    let layer: MapPluginRange = (this.layer = this.layer || new MapPluginRange(this.map!, { zIndex: 300 }));
    flag ? layer.open() : layer.close();
    return this;
  }
  /**双击结束了测距 */
  public onEnd(cb: () => void) {
    this.layer?.onEnd(cb);
  }
  /**重设测距图层的相关配置 */
  public resetOpt(opt: SLPMap.Range) {
    this.layer?.setOptions(opt);
  }
  /**每个服务类都有的 */
  /**测距图层 */
  private layer?: MapPluginRange;
  /**地图实例 */
  private get map() {
    return this.map_;
  }
  /**移除图层 */
  public remove() {
    this.layer?.onRemove();
    this.layer = undefined;
  }
}
