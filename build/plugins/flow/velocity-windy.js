import { u_mapGetLatLngByPoint as C, u_mapGetPointByLatlng as A } from "../../utils/slu-map.js";
class N {
  constructor(t) {
    this.options = {
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
        "rgb(180,0,35)"
      ],
      data: []
    }, this.PARTICLE_REDUCTION = Math.pow(window.devicePixelRatio, 1 / 3) || 1.6, this.OPACITY = 0.97, this.NULL_WIND_VECTOR = [NaN, NaN, null], this.grid = [], this.allThreatIds = [], this.canvas = t.canvas, this.setOptions(t);
  }
  /**设置自身参数 */
  setOptions(t) {
    t = Object.assign(this.options, t), this.map = t.map, this.MIN_VELOCITY_INTENSITY = t.minVelocity, this.MAX_VELOCITY_INTENSITY = t.maxVelocity, this.VELOCITY_SCALE = t.velocityScale * (Math.pow(window.devicePixelRatio, 1 / 3) || 1), this.MAX_PARTICLE_AGE = t.particleAge, this.PARTICLE_LINE_WIDTH = t.lineWidth, this.PARTICLE_MULTIPLIER = t.particleMultiplier, this.FRAME_RATE = t.frameRate, this.FRAME_TIME = 1e3 / this.FRAME_RATE, this.OPACITY = 0.98, this.colorScale = t.colorScale || t.defualtColorScale, this.NULL_WIND_VECTOR = [NaN, NaN, null], this.gridData = t.data, t.hasOwnProperty("opacity") && (this.OPACITY = +t.opacity);
  }
  /**设置数据 */
  setData(t) {
    this.gridData = t;
  }
  /**停止运行 */
  stop() {
    this.field && this.field.release(), this.animationLoop && cancelAnimationFrame(this.animationLoop);
  }
  /**开始运行
   * @param width 画布宽度
   * @param height 画布高度
   * @param extent 可视的经纬度范围
   */
  start(t, e, i) {
    this.stop(), console.time("start");
    var h = {
      south: this.deg2rad(i[0][1]),
      north: this.deg2rad(i[1][1]),
      east: this.deg2rad(i[1][0]),
      west: this.deg2rad(i[0][0]),
      width: t,
      height: e
    };
    let r = {
      x: 0,
      y: 0,
      xMax: t,
      yMax: e - 1,
      width: t,
      height: e
    };
    this.buildGrid(this.gridData), this.interpolateField(r, h), console.timeEnd("start");
  }
  /**构建网格数据 */
  buildGrid(t) {
    t.length < 2 && console.log("Windy Error: data must have at least two components (u,v)");
    let e = this.createBuilder(t);
    var i = e.header;
    this.lng0 = i.lo1, this.lat0 = i.la1;
    let h = this.Δlng = i.dx;
    this.Δlat = i.dy;
    let r = i.nx, o = i.ny, s = new Date(i.refTime);
    s.setHours(s.getHours() + i.forecastTime);
    let u = this.grid = [];
    for (var n = 0, l = Math.floor(r * h) >= 360, g = 0; g < o; g++) {
      for (var d = [], I = 0; I < r; I++, n++)
        d[I] = e.data(n);
      l && d.push(d[0]), u[g] = d;
    }
  }
  /**创建构造器 */
  createBuilder(t) {
    let e = t[0], i = t[1];
    t[2];
    let h = e.data, r = i.data;
    return {
      header: e?.header,
      data: function(o) {
        return [h[o], r[o]];
      }
    };
  }
  /**grid 数据，以及获得指定经纬度数据的方法interpolate
   * @param bounds  可视区域的像素范围
   * @param extent  数据地图的经纬度范围
   */
  interpolateField(t, e) {
    var i = (e.south - e.north) * (e.west - e.east), h = this.VELOCITY_SCALE * Math.pow(i, 0.4) * 0.01, r = [];
    t.x, this.allThreatIds.forEach((s) => {
      cancelIdleCallback(s);
    }), this.allThreatIds = [];
    for (let s = t.x, u = t.width; s < u; s += 2) {
      let n = [];
      const l = requestIdleCallback(() => {
        for (let d = t.y; d <= t.yMax; d += 2) {
          let [I, a] = C(this.map, [s, d]);
          if (isFinite(a)) {
            var g = this.interpolate(a, I);
            g && (g = this.distort(a, I, s, d, h, g), n[d + 1] = n[d] = g);
          }
        }
        r[s + 1] = r[s] = n;
      });
      this.allThreatIds.push(l);
    }
    let o = this.field = new L(r, t, this.NULL_WIND_VECTOR);
    this.animate(t, o);
  }
  /**获得指定经纬度的数据信息
   * @param lng 经度
   * @param lat 纬度
   * @return [ 计算得到的开始值S , 计算的到的结束值E, sqrt(S*S+E*E) ]
   */
  interpolate(t, e) {
    if (!this.grid) return null;
    let i = this.grid, h = this.lng0, r = this.Δlng, o = this.Δlat, s = this.lat0, u = this.floorMod(t - h, 360) / r, n = (s - e) / o, l = Math.floor(u), g = l + 1, d = Math.floor(n), I = d + 1;
    var a;
    if (a = i[d]) {
      let f = a[l], E = a[g];
      if (this.isValue(f) && this.isValue(E) && (a = i[I])) {
        var m = a[l], c = a[g];
        if (this.isValue(m) && this.isValue(c))
          return this.bilinearInterpolateVector(u - l, n - d, f, E, m, c);
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
  bilinearInterpolateVector(t, e, i, h, r, o) {
    let s = 1 - t, u = 1 - e, n = s * u, l = t * u, g = s * e, d = t * e, I = i[0] * n + h[0] * l + r[0] * g + o[0] * d, a = i[1] * n + h[1] * l + r[1] * g + o[1] * d;
    return [I, a, Math.sqrt(I * I + a * a)];
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
  distort(t, e, i, h, r, o) {
    let s = o[0] * r, u = o[1] * r, n = this.distortion(t, e, i, h);
    return o[0] = n[0] * s + n[2] * u, o[1] = n[1] * s + n[3] * u, o;
  }
  /**单个经纬度值跨越的像素点数量级
   * @param lng 经度
   * @param lat 纬度
   * @param x 像素点X
   * @param y 像素点Y
   * @returns
   */
  distortion(t, e, i, h) {
    let r = 5, o = t < 0 ? r : -r, s = e < 0 ? r : -r, u = this.project(e, t + o), n = this.project(e + s, t);
    var l = Math.cos(e / 360 * 2 * Math.PI);
    return [
      (u[0] - i) / o / l,
      0,
      //(pλ[1] - y) / hλ / k,
      0,
      //(pφ[0] - x) / hφ,
      (n[1] - h) / s
    ];
  }
  /**根据经纬度获得像素点 */
  project(t, e) {
    let [i, h] = A(this.map, [t, e]);
    return [i, h];
  }
  /**动画 */
  animate(t, e) {
    var i = this.colorScale, h = i.map(function() {
      return [];
    }), r = Math.round(t.width * t.height * this.PARTICLE_MULTIPLIER);
    this.isMobile() && (r *= this.PARTICLE_REDUCTION);
    var o = `rgba(0, 0, 0, ${this.OPACITY})`;
    let s = [];
    for (var u = 0; u < r; u++)
      s.push(
        e.randomize({
          age: Math.floor(Math.random() * this.MAX_PARTICLE_AGE) + 0,
          x: 0,
          y: 0
        })
      );
    let n = () => {
      h.forEach((a) => {
        a.length = 0;
      }), s.forEach((a) => {
        a.age > this.MAX_PARTICLE_AGE && (e.randomize(a).age = 0);
        let m = a.x, c = a.y, f = e.run(m, c), E = f[2];
        if (E === null)
          a.age = this.MAX_PARTICLE_AGE;
        else {
          let T = m + f[0], y = c + f[1];
          if (e.run(T, y)[2] !== null) {
            a.xt = T, a.yt = y;
            let v = this.windColorIndexBySpeed(E);
            h[v].push(a);
          } else
            a.x = T, a.y = y;
        }
        a.age += 1;
      });
    };
    var l = this.canvas.getContext("2d");
    l.lineWidth = this.PARTICLE_LINE_WIDTH, l.globalAlpha = 0.6;
    let g = () => {
      l.globalCompositeOperation = "destination-over", l.fillStyle = "rgba(0, 0, 0, 0.15)", l.fillRect(t.x, t.y, t.width, t.height), l.globalCompositeOperation = "destination-in", l.fillStyle = o, l.fillRect(t.x, t.y, t.width, t.height), l.globalCompositeOperation = "lighter", l.globalAlpha = this.OPACITY === 0 ? 0 : this.OPACITY * 0.9, h.forEach((a, m) => {
        a.length > 0 && (l.beginPath(), l.strokeStyle = i[m], a.forEach((c) => {
          l.moveTo(c.x, c.y), l.lineTo(c.xt, c.yt), c.x = c.xt, c.y = c.yt;
        }), l.stroke());
      });
    };
    var d = Date.now();
    let I = () => {
      this.animationLoop = requestAnimationFrame(I);
      var a = Date.now(), m = a - d;
      m > this.FRAME_TIME && (d = a - m % this.FRAME_TIME, n(), g());
    };
    I();
  }
  /**根据风速得到所属颜色层级 */
  windColorIndexBySpeed(t) {
    let e = this.colorScale.length, i = this.MIN_VELOCITY_INTENSITY, h = this.MAX_VELOCITY_INTENSITY;
    return Math.max(0, Math.min(e - 1, Math.round((t - i) / (h - i) * (e - 1))));
  }
  /**将经纬度转换为弧度  180 = Math.PI */
  deg2rad(t) {
    return t / 180 * Math.PI;
  }
  /**针对经纬度特殊的取余数方法
   * 小于等于n的数字若a小于0，返回 2n+a ， -365  => 2n-365
   */
  floorMod(t, e) {
    return t - e * Math.floor(t / e);
  }
  isValue(t) {
    return t != null;
  }
  /**判断是否是移动端 */
  isMobile() {
    return /android|blackberry|iemobile|ipad|iphone|ipod|opera mini|webos/i.test(navigator.userAgent);
  }
}
class L {
  constructor(t, e, i) {
    this.columns = t, this.bounds = e, this.NULL_WIND_VECTOR = i || [NaN, NaN, null];
  }
  /**释放内存 */
  release() {
    this.columns = [];
  }
  /**获取随机的  x , y 有数据的点(一个糟糕的未完成方法)*/
  randomize(t) {
    let e, i, h = 0;
    do
      e = Math.round(Math.floor(Math.random() * this.bounds.width) + this.bounds.x), i = Math.round(Math.floor(Math.random() * this.bounds.height) + this.bounds.y);
    while (this.run(e, i)[2] === null && h++ < 30);
    return t.x = e, t.y = i, t;
  }
  /**获取指定像素点的数据 */
  run(t, e) {
    var i = this.columns[Math.round(t)];
    return i && i[Math.round(e)] || this.NULL_WIND_VECTOR;
  }
}
export {
  N as VelocityWindy
};
