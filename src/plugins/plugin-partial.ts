import { um_getPointsByLnglats } from "../utils";
import { MapCanvasLayer, type MOptCanvas, type SLUMap } from "../map";
import { CanvasLine, SLUCanvas } from "../canvas";
import { CanvasPosition } from "../canvas";
import { Map as MaplibreMap } from 'maplibre-gl';
import { um_drawConvertgps84Togcj02 } from "../utils";
/**
 * 粒子效果插件
 *
 * 用于在地图上绘制流动的粒子效果，支持贝塞尔曲线路径、自定义粒子颜色和速度。
 * 常用于表示洋流、气流、航线等流动数据。
 *
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap SLUMap 地图实例
 * @param options 粒子配置
 *
 * @example
 * ```typescript
 * import { SLUMap, MapPluginPartial } from '@sl-utils/map';
 *
 * const map = new SLUMap('map');
 * await map.init({ type: 'L' });
 *
 * // 创建粒子插件
 * const partial = new MapPluginPartial(map, {
 *   pane: 'canvas',
 *   zIndex: 150
 * });
 *
 * // 设置粒子数据
 * partial.setAllParticles([
 *   {
 *     lnglats: [
 *       [114.12, 22.68],
 *       [114.15, 22.70],
 *       [114.18, 22.72],
 *       [114.20, 22.75]
 *     ],
 *     colorParticle: '#00FFFF',
 *     speed: 0.002,        // 移动速度
 *     length: 0.05,        // 粒子长度占比
 *     dense: 1,            // 密度
 *     showParticle: true
 *   },
 *   {
 *     lnglats: [
 *       [114.25, 22.80],
 *       [114.30, 22.85],
 *       [114.35, 22.90]
 *     ],
 *     colorParticle: '#FF6600',
 *     speed: 0.003,
 *     length: 0.08,
 *     degree: 0.3,         // 贝塞尔曲线曲度
 *     showParticle: true
 *   }
 * ]);
 *
 * // 移除图层
 * partial.onRemove();
 * ```
 */
export class MapPluginPartial extends MapCanvasLayer {
  constructor(sluMap: SLUMap, options?: MOptCanvas) {
    super(sluMap.map, options);
  }
  /**
   * 图层是否在移动 高德默认每次渲染更新像素坐标
   * leaflet 图层移动不更新像素坐标 高德 图层移动更新像素坐标
   * 高德地图移动画布和地图同步偏移，leaflet画布固定 地图偏移 的区别
   * 所以防止leaflet移动过程二次偏移 以及高德移动过程坐标未更新导致画布和容器相对位置发生偏移
   * */
  private isDrag: boolean = false;
  /**所有的粒子效果数据 */
  private _allParticle: (MDataParticle & CanvasPosition)[] = [];
  /**设置所有粒子数据
   * @param particles 粒子数据
   */
  public setAllParticles(particles: (MDataParticle & CanvasPosition)[]): void {
    um_drawConvertgps84Togcj02(this.map, particles);
    /**渲染内部会添加CanvasPosition到数据 */
    this._allParticle = particles;
    this._redraw();
  }
  /**渲染动态数据
   * @param time 时间戳
   */
  protected renderAnimation(time?: number): void {
    this.resetCanvas();
    this._allParticle.forEach((particle) => {
      particle.curPoints = [];
      particle.curve = [];
      let points = (particle.points = um_getPointsByLnglats(this.map, particle.lnglats) || []);
      for (let i = 0, len = points.length - 1; i < len; i++) {
        const e0 = points[i],
          e1 = points[i + 1];
        let curve = SLUCanvas.getBezierCtrlPoint(e0, e1, particle.degree);
        particle.curve.push(curve);
      }
    });
    this._drawParticles();
    this.flagAnimation && cancelAnimationFrame(this.flagAnimation);
    this.flagAnimation = requestAnimationFrame((time) => {
      // leaflet图层和高德不同，拖动结束才更新像素坐标 因此不影响 但是需要传isMapMove的值
      if (this.isDrag) return; // 拖动过程不允许更新动画 否则出现偏移可能出问题（动画图层每次拖动都会触发重绘，防止像素坐标计算的时候出现快速的偏移）
      this.renderAnimation(time);
    });
  }
  /**动画循环 */
  private _animat(): void {
    this.flagAnimation = requestAnimationFrame(() => {
      this._animat();
    });
    this._drawParticles();
  }
  /**绘制粒子效果 */
  private _drawParticles(): void {
    let particles = this._allParticle,
      ctx = this.ctx;
    // ctx.globalCompositeOperation = "destination-in";
    // ctx.fillRect(0, 0, this.width, this.height);
    ctx.globalCompositeOperation = "source-over";
    particles.forEach((e) => {
      if (e.showParticle === false) {
        return;
      }
      ctx.strokeStyle = e.colorParticle || "white";
      ctx.fillStyle = e.colorParticle || "white";
      ctx.shadowColor = e.colorParticle || "white";
      ctx.shadowBlur = 5;
      this.genCurBezierPoints(e);
      this.drawParticle(e);
    });
  }
  /**获取当前贝塞尔曲线的粒子点位
   * @param particle 粒子数据
   */
  private genCurBezierPoints(particle: MDataParticle & CanvasPosition): void {
    /**画布坐标*/
    let { points = [], index: i = 0, dense = 1 } = particle;
    let j = i + 1;
    /**坐标不足 */
    if (points.length < 2) return;
    /**当前数据已达坐标上限（从开始绘制） */
    if (j >= points.length) {
      (i = 0), (j = 1), (particle.index = 0), (particle.curPoints = undefined), (particle.age = 0);
    }
    /**当前粒子坐标，上一点位坐标和下一点位坐标 */
    let cur = particle.curPoints,
      p1 = points[i],
      p2 = points[j],
      per: [number, number] = p1,
      nex: [number, number] = p2,
      ctrl = particle.curve![i];
    /**当前粒子坐标不足（表明可能移动画布或缩放需要重新开始绘制） */
    if (!cur || cur.length < 2) {
      cur = [per, per];
    }
    /**点位差值和线段长度 */
    let x = nex[0] - per[0],
      y = nex[1] - per[1];
    let length = Math.sqrt(x * x + y * y);
    let interval = 1 / (dense * length);
    /**每次移动距离占比*/
    let speed = particle.speed || 0.001;
    speed = speed > 0.1 ? speed / length : speed;
    /**粒子效果长度占比 */
    let size = particle.length || 0.03;
    /**单个粒子需要的点数量*/
    let len = (size > 0.1 ? size : size * length) * dense,
      age = (particle.age || 0) + speed,
      curPoints: [number, number][] = [];
    age = age > 1 ? 1 : age;
    /**计算粒子点位 */
    for (let i = 0; i < len; i++) {
      let percent = age - interval * i;
      if (percent < 0) {
        break;
      }
      percent = percent > 0 ? percent : 0;
      let point: [number, number] = this.getBezierPointByPercent(percent, per, nex, ctrl);
      curPoints.push(point);
    }
    if (age == 1) {
      particle.index = ++i;
      age = 0;
    }
    particle.age = age;
    particle.curPoints = curPoints;
  }
  /**获取二阶贝塞尔曲线指定百分比的点位置信息
  * @param t 当前百分比
  * @param p1 起点坐标
  * @param p2 终点坐标
  * @param cp 控制点
  */
  private getBezierPointByPercent(percent: number, p1: [number, number], p2: [number, number], cp: [number, number]): [number, number] {
    const [x1, y1] = p1, [cx, cy] = cp, [x2, y2] = p2, t = percent;
    let x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2;
    let y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
    return [x, y];
  }
  /**绘制粒子
   * @param particle 粒子数据
   */
  private drawParticle(particle: MDataParticle): void {
    let ctx = this.ctx;
    let points = particle.curPoints || [];
    for (let i = 0, len = points.length; i < len; i++) {
      let xy = points[i];
      let alpha = (1 - i / len) * (1 / 2);
      // let alpha = Math.cos(Math.PI / 2 * i / len) * (6 / 12);
      ctx.globalAlpha = i == 0 ? 1 : alpha;
      ctx.beginPath();
      ctx.arc(xy[0], xy[1], 1, 0, 2 * Math.PI, false);
      ctx.stroke();
      ctx.fill();
    }
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

// ==================== 类型约束 ====================

/**粒子数据 */
export interface MDataParticle extends CanvasLine {
  /**经纬度集合 */
  lnglats?: [number, number][];
  /**曲线控制点 */
  curve?: [number, number][];
  /**移动速度 */
  speed?: number;
  /**粒子长度 */
  length?: number;
  /**密度 */
  dense?: number;
  /**当前点集合 */
  curPoints?: [number, number][];
  /**粒子年龄 */
  age?: number;
  /**索引 */
  index?: number;
  /**粒子颜色 */
  colorParticle?: string;
  /**是否显示粒子 */
  showParticle?: boolean;
}