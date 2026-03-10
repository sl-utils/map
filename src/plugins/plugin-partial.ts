import { u_mapGetPointsByLatlngs } from "../utils/slu-map";
import { MapCanvasLayer } from "../map";
import { SLUCanvas } from "../canvas";
import { u_mathGetBezierPointByPercent } from "../utils/slu-math";

/**leaflet的粒子效果 */
export class MapPluginPartial extends MapCanvasLayer {
  constructor(map: L.Map | AMAP.Map, options?: SLPMap.Canvas) {
    super(map, options);
  }
  /**
   * 图层是否在移动 高德默认每次渲染更新像素坐标
   * leaflet 图层移动不更新像素坐标 高德 图层移动更新像素坐标
   * 高德地图移动画布和地图同步偏移，leaflet画布固定 地图偏移 的区别
   * 所以防止leaflet移动过程二次偏移 以及高德移动过程坐标未更新导致画布和容器相对位置发生偏移
   * */
  private isDrag: boolean = false;
  /**所有的粒子效果数据 */
  private _allParticle: SLTMap.Particle.Info[] = [];
  /**设置所有粒子数据 */
  public setAllParticles(particles: SLTMap.Particle.Info[]) {
    this._allParticle = particles;
    this._redraw();
  }
  protected renderAnimation(time?: number) {
    this.resetCanvas();
    this._allParticle.forEach((particle) => {
      particle.curPoints = [];
      particle.curve = [];
      let points = (particle.points = u_mapGetPointsByLatlngs(this.map, particle.latlngs) || []);
      for (let i = 0, len = points.length; i < len - 1; i++) {
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
  private _animat() {
    this.flagAnimation = requestAnimationFrame(() => {
      this._animat();
    });
    this._drawParticles();
  }
  /**绘制粒子效果 */
  private _drawParticles() {
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
  /**获取当前贝塞尔曲线的粒子点位 */
  private genCurBezierPoints(particle: SLTMap.Particle.Info): void {
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
      let point: [number, number] = u_mathGetBezierPointByPercent(percent, per, nex, ctrl);
      curPoints.push(point);
    }
    if (age == 1) {
      particle.index = ++i;
      age = 0;
    }
    particle.age = age;
    particle.curPoints = curPoints;
  }
  /**绘制粒子 */
  private drawParticle(particle: SLTMap.Particle.Info): void {
    var ctx = this.ctx;
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
  /**拖拽不允许更新动画 */
  protected addMapEvents(map: L.Map, key: "on" | "off") {
    map[key]("dragstart", this.drawEnd, this);
    // map[key]('dragend', this.drawStart, this);
    map[key]("movestart", this.drawEnd, this);
    map[key]("moveend", this.drawStart, this);
  }
  private drawStart() {
    console.log("drawStart");
    this.isDrag = false;
  }
  private drawEnd() {
    console.log("drawEnd");
    this.isDrag = true;
  }
}
