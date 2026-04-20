
import { OptMapPluginArrowLine, MapLine } from "@sl-utils/map";
import { MapCanvasArrowLine, MapCanvasLayer, SLUMap } from "../map";
import { Map as MaplibreMap } from 'maplibre-gl';
/**
 * 地图canvas动态箭头线插件
 * @extends MapCanvasLayer
 * @constructor
 * @param {SLUMap} sluMap
 * @param {OptMapPluginArrowLine} arrowLineOption
 */
export class MapPluginArrowLine extends MapCanvasLayer {
  constructor(sluMap: SLUMap, options?: OptMapPluginArrowLine) {
    super(sluMap.map, options);
    this.arrowLine = new MapCanvasArrowLine(sluMap.map, this.ctx, options);
  }
  /**箭头线实例 */
  private arrowLine: MapCanvasArrowLine;
  /**设置所有线数据
   * @param lines 箭头线数据
   */
  public setAllLines(lines: MapLine[]): void {
    this.arrowLine.setAllLines(lines);
  }
  /**
   * 图层是否在移动 高德默认每次渲染更新像素坐标
   * leaflet 图层移动不更新像素坐标 高德 图层移动更新像素坐标
   * 高德地图移动画布和地图同步偏移，leaflet画布固定 地图偏移 的区别
   * 所以防止leaflet移动过程二次偏移 以及高德移动过程坐标未更新导致画布和容器相对位置发生偏移
   * */
  private isDrag: boolean = false;
  /**渲染静态图层 */
  protected override renderFixedData(): void {
    // 拖拽更新坐标
    // this.arrowLine.updateArrowLine();
    this.arrowLine.update();
  }
  /**渲染动态数据
   * @param time 时间戳
   */
  protected override renderAnimation(time?: number): void {
    this.resetCanvas();
    this.arrowLine.draw();
    this.flagAnimation && cancelAnimationFrame(this.flagAnimation);
    this.flagAnimation = requestAnimationFrame((time) => {
      // console.log('this.isDrag', this.isDrag);      
      // leaflet图层和高德不同，拖动结束才更新像素坐标 因此不影响 但是需要传isMapMove的值
      if (this.isDrag) return; // 拖动过程不允许更新动画 否则出现偏移可能出问题（动画图层每次拖动都会触发重绘，防止像素坐标计算的时候出现快速的偏移）
      this.renderAnimation(time);
    });
  }
  /**控制地图监听事件 拖拽不允许更新动画
   * @param map 地图实例
   * @param key 事件类型
   */
  protected addMapEvents(map: L.Map | AMAP.Map | MaplibreMap, key: "on" | "off"): void {
    const end = () => this.drawEnd();
    const start = () => this.drawStart();
    map[key]("dragstart", end);
    map[key]('dragend', start);
    // map[key]("movestart", end);
    // map[key]("moveend", start);
  }
  /**拖拽结束，开始绘制 */
  private drawStart(): void {
    this.isDrag = false;
  }
  /**拖拽开始，结束绘制 */
  private drawEnd(): void {
    this.isDrag = true;
  }
}
