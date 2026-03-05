import * as L from "leaflet";
import { u_mapGetLatLngByPoint, u_mapGetPointByLatlng } from "../../utils/slu-map";
/**运动粒子类 */
export class VelocityWindy {
  constructor(options: Partial<SLPVelocityWindy>) {
    this.canvas = options.canvas!;
    this.setOptions(options);
  }
  private options: SLPVelocityWindy = {
    minVelocity: 0,
    maxVelocity: 1,
    velocityScale: 1,
    particleAge: 90,
    lineWidth: 1,
    particleMultiplier: 1 / 300,
    frameRate: 30,
    defualtColorScale: [
      "rgb(36,104, 180)",
      "rgb(60,157, 194)",
      "rgb(128,205,193 )",
      "rgb(151,218,168 )",
      "rgb(198,231,181)",
      "rgb(238,247,217)",
      "rgb(255,238,159)",
      "rgb(252,217,125)",
      "rgb(255,182,100)",
      "rgb(252,150,75)",
      "rgb(250,112,52)",
      "rgb(245,64,32)",
      "rgb(237,45,28)",
      "rgb(220,24,32)",
      "rgb(180,0,35)",
    ],
    data: [],
  };
  private map!: L.Map;
  private canvas!: HTMLCanvasElement;
  /**velocity at which particle intensity is minimum (m/s)*/
  private MIN_VELOCITY_INTENSITY!: number;
  /**velocity at which particle intensity is maximum (m/s)*/
  private MAX_VELOCITY_INTENSITY!: number;
  /**风速刻度(内部与可视区面积相关联) scale for wind velocity (completely arbitrary--this value looks nice)*/
  private VELOCITY_SCALE!: number;
  /** max number of frames a particle is drawn before regeneration*/
  private MAX_PARTICLE_AGE!: number;
  /** line width of a drawn particle*/
  private PARTICLE_LINE_WIDTH!: number;
  /**绘制粒子数量的比例（宽像素*高像素*此比例）*/
  private PARTICLE_MULTIPLIER!: number;
  /** multiply particle count for mobiles by this amount*/
  private PARTICLE_REDUCTION = Math.pow(window.devicePixelRatio, 1 / 3) || 1.6;
  private FRAME_RATE!: number;
  /** desired frames per second*/
  private FRAME_TIME!: number;
  private OPACITY = 0.97;
  private colorScale!: string[];
  /** singleton for no wind in the form: [u, v, magnitude]*/
  private NULL_WIND_VECTOR = [NaN, NaN, null];
  /**传过来的原始数据 */
  private gridData!: SLDVeloctiyWind[];
  /** [U数据,V数据][ x序号 ][ y轴序号 ]   */
  private grid: [number, number][][] = [];
  private field!: WindyField;
  /**数据起始经度 */
  private lng0: number;
  /**数据起始纬度 */
  private lat0: number;
  /**数据经度差值 数据经度间隔 (若全球数据中0.5经度间隔得到一个数据，则 dx = 1 * 0.5 )*/
  private Δlng: number;
  /**数据纬度差值 */
  private Δlat: number;
  private animationLoop?: any;
  private allThreatIds: number[] = [];
  /**设置自身参数 */
  public setOptions(options: any) {
    options = Object.assign(this.options, options);
    this.map = options.map;
    this.MIN_VELOCITY_INTENSITY = options.minVelocity;
    this.MAX_VELOCITY_INTENSITY = options.maxVelocity;
    this.VELOCITY_SCALE = options.velocityScale * (Math.pow(window.devicePixelRatio, 1 / 3) || 1);
    this.MAX_PARTICLE_AGE = options.particleAge;
    this.PARTICLE_LINE_WIDTH = options.lineWidth;
    this.PARTICLE_MULTIPLIER = options.particleMultiplier;
    this.FRAME_RATE = options.frameRate;
    this.FRAME_TIME = 1000 / this.FRAME_RATE;
    this.OPACITY = 0.98;
    this.colorScale = options.colorScale || options.defualtColorScale;
    this.NULL_WIND_VECTOR = [NaN, NaN, null];
    this.gridData = options.data;
    if (options.hasOwnProperty("opacity")) this.OPACITY = +options.opacity;
  }
  /**设置数据 */
  public setData(data: SLDVeloctiyWind[]) {
    this.gridData = data;
  }
  /**停止运行 */
  public stop() {
    if (this.field) this.field.release();
    if (this.animationLoop) cancelAnimationFrame(this.animationLoop);
  }
  /**开始运行
   * @param width 画布宽度
   * @param height 画布高度
   * @param extent 可视的经纬度范围
   */
  public start(width: number, height: number, extent: [[number, number], [number, number]]) {
    this.stop();
    console.time('start');
    var mapBounds = {
      south: this.deg2rad(extent[0][1]),
      north: this.deg2rad(extent[1][1]),
      east: this.deg2rad(extent[1][0]),
      west: this.deg2rad(extent[0][0]),
      width: width,
      height: height,
    };
    let buildBounds = {
      x: 0,
      y: 0,
      xMax: width,
      yMax: height - 1,
      width: width,
      height: height,
    };
    this.buildGrid(this.gridData);
    this.interpolateField(buildBounds, mapBounds);
    console.timeEnd('start');
  }
  /**构建网格数据 */
  private buildGrid(data: SLDVeloctiyWind[]) {
    /**数据太少不支持 */
    if (data.length < 2) console.log("Windy Error: data must have at least two components (u,v)");
    let builder = this.createBuilder(data);
    var header = builder.header;
    let lng0 = (this.lng0 = header.lo1);
    let lat0 = (this.lat0 = header.la1); // the grid's origin (e.g., 0.0E, 90.0N)
    let Δlng = (this.Δlng = header.dx);
    let Δlat = (this.Δlat = header.dy); // distance between grid points (e.g., 2.5 deg lon, 2.5 deg lat)
    let nx = header.nx;
    let ny = header.ny; // number of grid points W-E and N-S (e.g., 144 x 73)
    let date = new Date(header.refTime);
    date.setHours(date.getHours() + header.forecastTime);
    // Scan modes 0, 64 allowed.
    // http://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_table3-4.shtml
    let grid: [number, number][][] = (this.grid = []);
    var p = 0;
    var isContinuous = Math.floor(nx * Δlng) >= 360;
    for (var j = 0; j < ny; j++) {
      /** [开始的数据,结束的数据] [x序号]   */
      var row: [number, number][] = [];
      for (var i = 0; i < nx; i++, p++) {
        row[i] = builder.data(p);
      }
      // For wrapped grids, duplicate first column as last column to simplify interpolation logic
      if (isContinuous) row.push(row[0]);
      grid[j] = row;
    }
  }
  /**创建构造器 */
  private createBuilder(data: SLDVeloctiyWind[]) {
    /**获得并设置起始数据 */
    let uComp: SLDVeloctiyWind = data[0],
      vComp: SLDVeloctiyWind = data[1],
      zComp: SLDVeloctiyWind = data[2];
    let uData = uComp.data,
      vData = vComp.data;
    return {
      header: uComp?.header,
      data: function (i: number): [number, number] {
        return [uData[i], vData[i]];
      },
    };
  }
  /**grid 数据，以及获得指定经纬度数据的方法interpolate
   * @param bounds  可视区域的像素范围
   * @param extent  数据地图的经纬度范围
   */
  private interpolateField(bounds: WindBounds, extent: WindMapBounds) {
    /**数据地图面积 */
    var mapArea = (extent.south - extent.north) * (extent.west - extent.east);
    /**得到与可视区域的面积相关联的风速刻度*/
    var velocityScale = this.VELOCITY_SCALE * Math.pow(mapArea, 0.4) * 0.01;
    var columns: [number, number, number][][] = [];
    var x = bounds.x;
    this.allThreatIds.forEach(id => {
      cancelIdleCallback(id);
    })
    this.allThreatIds = [];
    for (let x = bounds.x, len = bounds.width; x < len; x += 2) {
      let column: [number, number, number][] = [];
      const id = requestIdleCallback(() => {
        for (let y = bounds.y; y <= bounds.yMax; y += 2) {
          //得到X , Y 点对应地图上的经纬度
          let [lat, lng] = u_mapGetLatLngByPoint(this.map, [x, y]);
          /**是否是有效数字 */
          if (isFinite(lng)) {
            //获得指定经纬度的信息 [ 开始值 , 结束值 , 平均值 ]
            var wind = this.interpolate(lng, lat);
            if (wind) {
              //根据地图的缩放级别调整粒子的大小
              wind = this.distort(lng, lat, x, y, velocityScale, wind);
              column[y + 1] = column[y] = wind;
            }
          }
        }
        columns[x + 1] = columns[x] = column;
      })
      this.allThreatIds.push(id);
    }
    let field = this.field = new WindyField(columns, bounds, this.NULL_WIND_VECTOR);
    this.animate(bounds, field);
  }
  /**获得指定经纬度的数据信息
   * @param lng 经度
   * @param lat 纬度
   * @return [ 计算得到的开始值S , 计算的到的结束值E, sqrt(S*S+E*E) ]
   */
  public interpolate(lng: number, lat: number): null | [number, number, number] {
    if (!this.grid) return null;
    let grid = this.grid,
      lng0 = this.lng0,
      Δlng = this.Δlng,
      Δlat = this.Δlat,
      lat0 = this.lat0;
    /** 该经度属于nx的第几个 */
    let i = this.floorMod(lng - lng0, 360) / Δlng;
    /** 该纬度属于ny的第几个 */
    let j = (lat0 - lat) / Δlat;
    let fx = Math.floor(i),
      nx = fx + 1,
      fy = Math.floor(j),
      ny = fy + 1;
    var row: [number, number][];
    /** Y轴第fy个数据 赋值并且不为undefined */
    if ((row = grid[fy])) {
      let g00 = row[fx],
        g10 = row[nx];
      if (this.isValue(g00) && this.isValue(g10) && (row = grid[ny])) {
        //X轴第fy+1个数据
        var g01 = row[fx],
          g11 = row[nx];
        if (this.isValue(g01) && this.isValue(g11)) {
          return this.bilinearInterpolateVector(i - fx, j - fy, g00, g10, g01, g11);
        }
      }
    }
    return null;
  }
  /**根据网格数据构建虚拟数值
   * @param x 指定经度的X数值相对最近的低位整数坐标的差值 [0,1)
   * @param y 指定纬度的Y数值相对最近的低位整数坐标的差值 [0,1)
   * @param g00 该经纬度所在的网格的左上角的风速信息
   * @param g10 该经纬度所在的网格的右上角的风速信息
   * @param g01 该经纬度所在的网格的左下角的风速信息
   * @param g11 该经纬度所在的网格的右下角的风速信息
   * @returns [ 计算得到的开始值S , 计算的到的结束值E, 平均速度 ]
   */
  private bilinearInterpolateVector(x: number, y: number, g00: [number, number], g10: [number, number], g01: [number, number], g11: [number, number]): [number, number, number] {
    /**右侧(下一个)的影响权重 */
    let rx = 1 - x,
      ry = 1 - y;
    let a = rx * ry,
      b = x * ry,
      c = rx * y,
      d = x * y;
    let u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;
    let v = g00[1] * a + g10[1] * b + g01[1] * c + g11[1] * d;
    return [u, v, Math.sqrt(u * u + v * v)];
  }
  /**根据地图的缩放级别调整粒子的大小
   * @param λ 经度
   * @param φ 纬度
   * @param x 像素点X
   * @param y 像素点Y
   * @param scale 风速刻度
   * @param wind 风速信息 [计算得到的开始值S , 计算的到的结束值E, sqrt(S*S+E*E) ]
   * @returns
   */
  private distort(lng: number, lat: number, x: number, y: number, scale: number, wind: [number, number, number]): [number, number, number] {
    let u = wind[0] * scale;
    let v = wind[1] * scale;
    //根据地图的缩放比例决定粒子运动距离
    let d = this.distortion(lng, lat, x, y);
    wind[0] = d[0] * u + d[2] * v;
    wind[1] = d[1] * u + d[3] * v;
    return wind;
  }
  /**单个经纬度值跨越的像素点数量级
   * @param lng 经度
   * @param lat 纬度
   * @param x 像素点X
   * @param y 像素点Y
   * @returns
   */
  private distortion(lng: number, lat: number, x: number, y: number): [number, number, number, number] {
    let H = 5; // ToDo:   Why does this work?
    let hλ = lng < 0 ? H : -H;
    let hφ = lat < 0 ? H : -H;
    /**经度加上指定H后的像素点位置 */
    let pλ = this.project(lat, lng + hλ);
    /**纬度加上指定H后的像素点位置 */
    let pφ = this.project(lat + hφ, lng);
    /**纬度的弧度值*/
    var k = Math.cos((lat / 360) * 2 * Math.PI);
    return [
      (pλ[0] - x) / hλ / k,
      0, //(pλ[1] - y) / hλ / k,
      0, //(pφ[0] - x) / hφ,
      (pφ[1] - y) / hφ,
    ];
  }
  /**根据经纬度获得像素点 */
  private project(lat: number, lon: number): [number, number] {
    let [x, y] = u_mapGetPointByLatlng(this.map, [lat, lon]);
    return [x, y];
  }
  /**动画 */
  private animate(bounds: WindBounds, field: WindyField) {
    var colorStyles = this.colorScale;
    var buckets: any[][] = colorStyles.map(function (): any[] {
      return [];
    });
    /**粒子数量*/
    var count = Math.round(bounds.width * bounds.height * this.PARTICLE_MULTIPLIER);
    if (this.isMobile()) count *= this.PARTICLE_REDUCTION;
    var fadeFillStyle = `rgba(0, 0, 0, ${this.OPACITY})`;
    /**粒子组 */
    let particles: WindParticle[] = [];
    for (var i = 0; i < count; i++) {
      particles.push(
        field.randomize({
          age: Math.floor(Math.random() * this.MAX_PARTICLE_AGE) + 0,
          x: 0,
          y: 0,
        })
      );
    }
    let evolve = () => {
      buckets.forEach((bucket) => {
        bucket.length = 0;
      });
      particles.forEach((particle) => {
        /**重新生成新的粒子 */
        if (particle.age > this.MAX_PARTICLE_AGE) field.randomize(particle).age = 0;
        /**有数据的点 */
        let x = particle.x,
          y = particle.y;
        /**获取当前位置矢量 */
        let v = field.run(x, y),
          m = v[2];
        /**当前位置矢量已经不存在了 */
        if (m === null) {
          particle.age = this.MAX_PARTICLE_AGE;
        } else {
          let xt = x + v[0],
            yt = y + v[1];
          if (field.run(xt, yt)[2] !== null) {
            // Path from (x,y) to (xt,yt) is visible, so add this particle to the appropriate draw bucket.
            particle.xt = xt;
            particle.yt = yt;
            let index = this.windColorIndexBySpeed(m);
            buckets[index].push(particle);
          } else {
            // Particle isn't visible, but it still moves through the field.
            particle.x = xt;
            particle.y = yt;
          }
        }
        particle.age += 1;
      });
    };

    var g = this.canvas.getContext("2d")!;
    g.lineWidth = this.PARTICLE_LINE_WIDTH;
    // g.fillStyle = "rgba(0, 0, 0, 0.15)";
    g.globalAlpha = 0.6;
    let draw = () => {
      g.globalCompositeOperation = "destination-over";
      g.fillStyle = "rgba(0, 0, 0, 0.15)";
      g.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
      //淡化已经存在的粒子，实现尾拖效果
      g.globalCompositeOperation = "destination-in";
      g.fillStyle = fadeFillStyle;
      g.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
      g.globalCompositeOperation = "lighter";
      //绘制新的粒子
      g.globalAlpha = this.OPACITY === 0 ? 0 : this.OPACITY * 0.9;
      buckets.forEach((bucket, i) => {
        if (bucket.length > 0) {
          g.beginPath();
          g.strokeStyle = colorStyles[i];
          bucket.forEach((particle) => {
            g.moveTo(particle.x, particle.y);
            g.lineTo(particle.xt, particle.yt);
            particle.x = particle.xt;
            particle.y = particle.yt;
          });
          g.stroke();
        }
      });
    };
    var then = Date.now();
    let frame = () => {
      this.animationLoop = requestAnimationFrame(frame);
      var now = Date.now();
      var delta = now - then;
      if (delta > this.FRAME_TIME) {
        then = now - (delta % this.FRAME_TIME);
        evolve();
        draw();
      }
    };
    frame();
  }
  /**根据风速得到所属颜色层级 */
  private windColorIndexBySpeed(m: number) {
    let length = this.colorScale.length,
      min = this.MIN_VELOCITY_INTENSITY,
      max = this.MAX_VELOCITY_INTENSITY;
    let index = Math.max(0, Math.min(length - 1, Math.round(((m - min) / (max - min)) * (length - 1))));
    return index;
  }
  /**将经纬度转换为弧度  180 = Math.PI */
  private deg2rad(deg: number) {
    return (deg / 180) * Math.PI;
  }
  /**针对经纬度特殊的取余数方法
   * 小于等于n的数字若a小于0，返回 2n+a ， -365  => 2n-365
   */
  private floorMod(a: number, n: number): number {
    return a - n * Math.floor(a / n);
  }

  private isValue(x: [number, number]): boolean {
    return x !== null && x !== undefined;
  }
  /**判断是否是移动端 */
  private isMobile() {
    return /android|blackberry|iemobile|ipad|iphone|ipod|opera mini|webos/i.test(navigator.userAgent);
  }
}

class WindyField {
  constructor(columns: [number, number, number][][], bounds: WindBounds, NULL_WIND_VECTOR?: any[]) {
    this.columns = columns;
    this.bounds = bounds;
    this.NULL_WIND_VECTOR = NULL_WIND_VECTOR || [NaN, NaN, null];
  }
  private columns: [number, number, number][][];
  private bounds: WindBounds;
  private NULL_WIND_VECTOR: any[];
  /**释放内存 */
  public release() {
    this.columns = [];
  }
  /**获取随机的  x , y 有数据的点(一个糟糕的未完成方法)*/
  public randomize(o: WindParticle): WindParticle {
    let x,
      y,
      safetyNet = 0;
    do {
      x = Math.round(Math.floor(Math.random() * this.bounds.width) + this.bounds.x);
      y = Math.round(Math.floor(Math.random() * this.bounds.height) + this.bounds.y);
    } while (this.run(x, y)[2] === null && safetyNet++ < 30);
    o.x = x;
    o.y = y;
    return o;
  }
  /**获取指定像素点的数据 */
  public run(x: number, y: number): [number, number, number] {
    var column = this.columns[Math.round(x)];
    return (column && column[Math.round(y)]) || (this.NULL_WIND_VECTOR as any);
  }
}
