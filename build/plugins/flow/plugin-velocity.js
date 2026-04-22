import { u_mapGetLatLngByPoint as C, u_mapGetPointByLatlng as L } from "../../utils/slu-map.js";
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
      defualtColorScale: ["rgb(36,104, 180)", "rgb(60,157, 194)", "rgb(128,205,193 )", "rgb(151,218,168 )", "rgb(198,231,181)", "rgb(238,247,217)", "rgb(255,238,159)", "rgb(252,217,125)", "rgb(255,182,100)", "rgb(252,150,75)", "rgb(250,112,52)", "rgb(245,64,32)", "rgb(237,45,28)", "rgb(220,24,32)", "rgb(180,0,35)"],
      data: []
    }, this.PARTICLE_REDUCTION = Math.pow(window.devicePixelRatio, 1 / 3) || 1.6, this.OPACITY = 0.97, this.NULL_WIND_VECTOR = [NaN, NaN, null], this.grid = [], this.allThreatIds = [], this.canvas = t.canvas, this.setOptions(t);
  }
  /**设置自身参数
   * @param options 配置项
   */
  setOptions(t) {
    t = Object.assign(this.options, t), this.map = t.map, this.MIN_VELOCITY_INTENSITY = t.minVelocity, this.MAX_VELOCITY_INTENSITY = t.maxVelocity, this.VELOCITY_SCALE = t.velocityScale * (Math.pow(window.devicePixelRatio, 1 / 3) || 1), this.MAX_PARTICLE_AGE = t.particleAge, this.PARTICLE_LINE_WIDTH = t.lineWidth, this.PARTICLE_MULTIPLIER = t.particleMultiplier, this.FRAME_RATE = t.frameRate, this.FRAME_TIME = 1e3 / this.FRAME_RATE, this.OPACITY = 0.98, this.colorScale = t.colorScale || t.defualtColorScale, this.NULL_WIND_VECTOR = [NaN, NaN, null], this.gridData = t.data, t.hasOwnProperty("opacity") && (this.OPACITY = +t.opacity);
  }
  /**设置数据
   * @param data 数据
   */
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
    this.stop();
    const r = {
      south: this.deg2rad(i[0][1]),
      north: this.deg2rad(i[1][1]),
      east: this.deg2rad(i[1][0]),
      west: this.deg2rad(i[0][0]),
      width: t,
      height: e
    };
    let s = {
      x: 0,
      y: 0,
      xMax: t,
      yMax: e - 1,
      width: t,
      height: e
    };
    this.buildGrid(this.gridData), this.interpolateField(s, r);
  }
  /**构建网格数据
   * @param data 数据
   */
  buildGrid(t) {
    t.length < 2 && console.log("Windy Error: data must have at least two components (u,v)");
    let e = this.createBuilder(t);
    const i = e.header;
    this.lng0 = i.lo1, this.lat0 = i.la1;
    const r = this.Δlng = i.dx;
    this.Δlat = i.dy;
    const s = i.nx, h = i.ny, o = new Date(i.refTime);
    o.setHours(o.getHours() + i.forecastTime);
    let u = this.grid = [], l = 0;
    const I = Math.floor(s * r) >= 360;
    for (let d = 0; d < h; d++) {
      const g = [];
      for (let a = 0; a < s; a++, l++)
        g[a] = e.data(l);
      I && g.push(g[0]), u[d] = g;
    }
  }
  /**创建构造器
   * @param data 数据
   */
  createBuilder(t) {
    let e = t[0], i = t[1];
    t[2];
    let r = e.data, s = i.data;
    return {
      header: e?.header,
      data: function(h) {
        return [r[h], s[h]];
      }
    };
  }
  /**grid 数据，以及获得指定经纬度数据的方法interpolate
   * @param bounds  可视区域的像素范围
   * @param extent  数据地图的经纬度范围
   */
  interpolateField(t, e) {
    const i = (e.south - e.north) * (e.west - e.east), r = this.VELOCITY_SCALE * Math.pow(i, 0.4) * 0.01, s = [];
    this.allThreatIds.forEach((o) => {
      cancelIdleCallback(o);
    }), this.allThreatIds.length = 0;
    for (let o = t.x, u = t.width; o < u; o += 2) {
      let l = [];
      const I = requestIdleCallback(() => {
        for (let d = t.y, g = t.yMax; d <= g; d += 2) {
          let [a, n] = C(this.map, [o, d]);
          if (isFinite(n)) {
            let c = this.interpolate(n, a);
            c && (c = this.distort(n, a, o, d, r, c), l[d + 1] = l[d] = c);
          }
        }
        s[o + 1] = s[o] = l;
      });
      this.allThreatIds.push(I);
    }
    let h = this.field = new _(s, t, this.NULL_WIND_VECTOR);
    this.animate(t, h);
  }
  /**获得指定经纬度的数据信息
   * @param lng 经度
   * @param lat 纬度
   * @return [ 计算得到的开始值S , 计算的到的结束值E, sqrt(S*S+E*E) ]
   */
  interpolate(t, e) {
    if (!this.grid) return null;
    let i = this.grid, r = this.lng0, s = this.Δlng, h = this.Δlat, o = this.lat0, u = this.floorMod(t - r, 360) / s, l = (o - e) / h, I = Math.floor(u), d = I + 1, g = Math.floor(l), a = g + 1, n;
    if (n = i[g]) {
      const c = n[I], m = n[d];
      if (this.isValue(c) && this.isValue(m) && (n = i[a])) {
        const T = n[I], f = n[d];
        if (this.isValue(T) && this.isValue(f))
          return this.bilinearInterpolateVector(u - I, l - g, c, m, T, f);
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
  bilinearInterpolateVector(t, e, i, r, s, h) {
    let o = 1 - t, u = 1 - e, l = o * u, I = t * u, d = o * e, g = t * e, a = i[0] * l + r[0] * I + s[0] * d + h[0] * g, n = i[1] * l + r[1] * I + s[1] * d + h[1] * g;
    return [a, n, Math.sqrt(a * a + n * n)];
  }
  /**根据地图的缩放级别调整粒子的大小
   * @param lng 经度
   * @param lat 纬度
   * @param x 像素点X
   * @param y 像素点Y
   * @param scale 风速刻度
   * @param wind 风速信息 [计算得到的开始值S , 计算的到的结束值E, sqrt(S*S+E*E) ]
   * @returns 风速信息
   */
  distort(t, e, i, r, s, h) {
    let o = h[0] * s, u = h[1] * s, l = this.distortion(t, e, i, r);
    return h[0] = l[0] * o + l[2] * u, h[1] = l[1] * o + l[3] * u, h;
  }
  /**粒子系统 经纬度速度 → 屏幕像素速度
   * 单个经纬度值跨越的像素点数量级
   * @param lng 经度
   * @param lat 纬度
   * @param x 像素点X
   * @param y 像素点Y
   * @returns [经度转 X 像素系数，0, 0, 纬度转 Y 像素系数]
   */
  distortion(t, e, i, r) {
    let s = 5, h = t < 0 ? s : -s, o = e < 0 ? s : -s, u = this.project(e, t + h), l = this.project(e + o, t);
    const I = Math.cos(e / 360 * 2 * Math.PI);
    return [
      (u[0] - i) / h / I,
      0,
      //(pλ[1] - y) / hλ / k,
      0,
      //(pφ[0] - x) / hφ,
      (l[1] - r) / o
    ];
  }
  /**根据经纬度获得像素点
   * @param lat 纬度
   * @param lon 经度
   * @returns [像素点X, 像素点Y]
   */
  project(t, e) {
    let [i, r] = L(this.map, [t, e]);
    return [i, r];
  }
  /**动画
   * @param bounds 可视区域的像素范围
   * @param field 风场数据
   */
  animate(t, e) {
    const i = this.colorScale, r = i.map(function() {
      return [];
    });
    let s = Math.round(t.width * t.height * this.PARTICLE_MULTIPLIER);
    this.isMobile() && (s *= this.PARTICLE_REDUCTION);
    const h = `rgba(0, 0, 0, ${this.OPACITY})`;
    let o = [];
    for (let a = 0; a < s; a++)
      o.push(
        e.randomize({ age: Math.floor(Math.random() * this.MAX_PARTICLE_AGE) + 0, x: 0, y: 0 })
      );
    let u = () => {
      r.forEach((a) => {
        a.length = 0;
      }), o.forEach((a) => {
        a.age > this.MAX_PARTICLE_AGE && (e.randomize(a).age = 0);
        let n = a.x, c = a.y, m = e.run(n, c), T = m[2];
        if (T === null)
          a.age = this.MAX_PARTICLE_AGE;
        else {
          let f = n + m[0], E = c + m[1];
          if (e.run(f, E)[2] !== null) {
            a.xt = f, a.yt = E;
            let y = this.windColorIndexBySpeed(T);
            r[y].push(a);
          } else
            a.x = f, a.y = E;
        }
        a.age += 1;
      });
    };
    const l = this.canvas.getContext("2d");
    l.lineWidth = this.PARTICLE_LINE_WIDTH, l.globalAlpha = 0.6;
    let I = () => {
      l.globalCompositeOperation = "destination-over", l.fillStyle = "rgba(0, 0, 0, 0.15)", l.fillRect(t.x, t.y, t.width, t.height), l.globalCompositeOperation = "destination-in", l.fillStyle = h, l.fillRect(t.x, t.y, t.width, t.height), l.globalCompositeOperation = "lighter", l.globalAlpha = this.OPACITY === 0 ? 0 : this.OPACITY * 0.9, r.forEach((a, n) => {
        a.length > 0 && (l.beginPath(), l.strokeStyle = i[n], a.forEach((c) => {
          l.moveTo(c.x, c.y), l.lineTo(c.xt, c.yt), c.x = c.xt, c.y = c.yt;
        }), l.stroke());
      });
    }, d = Date.now(), g = () => {
      this.animationLoop = requestAnimationFrame(g);
      const a = Date.now(), n = a - d;
      n > this.FRAME_TIME && (d = a - n % this.FRAME_TIME, u(), I());
    };
    g();
  }
  /**根据风速得到所属颜色层级
   * @param m 风速
   * @returns 颜色层级
   */
  windColorIndexBySpeed(t) {
    let e = this.colorScale.length, i = this.MIN_VELOCITY_INTENSITY, r = this.MAX_VELOCITY_INTENSITY;
    return Math.max(0, Math.min(e - 1, Math.round((t - i) / (r - i) * (e - 1))));
  }
  /**将经纬度转换为弧度  180 = Math.PI
   * @param deg 经纬度
   * @returns 弧度
   */
  deg2rad(t) {
    return t / 180 * Math.PI;
  }
  /**针对经纬度特殊的取余数方法
   * 小于等于n的数字若a小于0，返回 2n+a ， -365  => 2n-365
   * @param a 数字
   * @param n 数字范围
   * @returns 取余数
   */
  floorMod(t, e) {
    return t - e * Math.floor(t / e);
  }
  /**判断是否是有效值
   * @param x 值
   * @returns 是否是有效值
   */
  isValue(t) {
    return t != null;
  }
  /**判断是否是移动端
   * @returns 是否是移动端
   */
  isMobile() {
    return /android|blackberry|iemobile|ipad|iphone|ipod|opera mini|webos/i.test(navigator.userAgent);
  }
}
class _ {
  constructor(t, e, i) {
    this.NULL_WIND_VECTOR = [NaN, NaN, null], this.columns = t, this.bounds = e, this.NULL_WIND_VECTOR = i || [NaN, NaN, null];
  }
  /**释放内存 */
  release() {
    this.columns.length = 0;
  }
  /**获取随机的  x , y 有数据的点(一个糟糕的未完成方法)
   * @param o 粒子
   * @returns 粒子
  */
  randomize(t) {
    let e, i, r = 0;
    do
      e = Math.round(Math.floor(Math.random() * this.bounds.width) + this.bounds.x), i = Math.round(Math.floor(Math.random() * this.bounds.height) + this.bounds.y);
    while (this.run(e, i)[2] === null && r++ < 30);
    return t.x = e, t.y = i, t;
  }
  /**获取指定像素点的数据
   * @param x x坐标
   * @param y y坐标
   * @returns 风矢量
   */
  run(t, e) {
    const i = this.columns[Math.round(t)];
    return (i && i[Math.round(e)]) ?? this.NULL_WIND_VECTOR;
  }
}
export {
  N as PluginVelocity
};
