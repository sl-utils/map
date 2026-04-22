import { MapPluginGridBase as r } from "./plugin-grid-base.js";
import { u_mapGetMapSize as a } from "../../utils/slu-map.js";
class o extends r {
  constructor(t, e) {
    super(t.map, e), this.boundsDatas = [];
  }
  /**设置渲染数据
   * @param datas 网格数据
   */
  setData(t) {
    this._setDatas(t), this.renderStart();
  }
  /**根据经纬度获取网格数据
   * @param lng 经度
   * @param lat 纬度
   * @returns 网格数据
   */
  getInfoByLngLat(t, e) {
    return this.interpolate(t, e);
  }
  /**渲染开始 */
  renderStart() {
    const { w: t, h: e } = a(this.map);
    this.interpolateFieldByWorker({ x: 0, y: 0, width: t, height: e });
  }
  /**渲染静态图层 */
  renderFixedData() {
    this.renderStart();
  }
}
export {
  o as MapPluginGrid
};
