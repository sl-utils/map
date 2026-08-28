import { MapCanvasFixedHeat, MapCanvasLayer, SLUMap } from "../map";
import type { MOptPluginFixedHeat } from "../map";
//todo 待完成

/**
 * 固定图片热力图插件
 *
 * 用于在地图上渲染固定位置的热力图效果，支持自定义半径、模糊程度和渐变颜色。
 * 与 MapPluginHeat 不同，此插件的热力点位置不会随地图缩放而改变。
 *
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap SLUMap 地图实例
 * @param options 热力图配置
 *
 * @example
 * ```typescript
 * import { SLUMap, MapPluginFixedHeat } from '@sl-utils/map';
 *
 * const map = new SLUMap('map');
 * await map.init({ type: 'L' });
 *
 * // 创建固定热力图插件
 * const fixedHeat = new MapPluginFixedHeat(map, {
 *   refZoom: 10,      // 参考层级
 *   minZoom: 5,       // 最小层级
 *   maxZoom: 15,      // 最大层级
 *   radius: 25,       // 半径
 *   blur: 15,         // 模糊程度
 *   opacity: 0.8,     // 透明度
 *   gradient: {       // 渐变颜色
 *     0.2: 'blue',
 *     0.4: 'cyan',
 *     0.6: 'lime',
 *     0.8: 'yellow',
 *     1.0: 'red'
 *   }
 * });
 *
 * // 设置热力数据 [经度, 纬度, 强度]
 * fixedHeat.setData([
 *   [114.12, 22.68, 0.8],
 *   [114.15, 22.70, 1.2],
 *   [114.18, 22.72, 0.5],
 *   [114.20, 22.75, 2.0]
 * ]);
 *
 * // 移除图层
 * fixedHeat.onRemove();
 * ```
 */
export class MapPluginFixedHeat extends MapCanvasLayer {
  constructor(sluMap: SLUMap, options?: MOptPluginFixedHeat) {
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
