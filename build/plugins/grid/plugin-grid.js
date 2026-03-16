import { MapPluginGridBase as r } from "./grid.js";
import { u_mapGetMapSize as s } from "../../utils/slu-map.js";
class o extends r {
  constructor(t, e) {
    super(t.map, e), this.boundsDatas = [];
  }
  setOptions(t) {
    Object.assign(this.options, t);
  }
  /**设置渲染数据 */
  setData(t) {
    this._setDatas(t), this.renderStart();
  }
  getInfoByLngLat(t, e) {
    return this.interpolate(t, e);
  }
  /**渲染开始 */
  renderStart() {
    const { w: t, h: e } = s(this.map);
    this.interpolateFieldByWorker({ x: 0, y: 0, width: t, height: e });
  }
  renderFixedData() {
    this.renderStart();
  }
}
export {
  o as MapPluginGrid
};
