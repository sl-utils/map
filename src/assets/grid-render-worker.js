/**Worker线程
 * 功能：
 * 1. 经纬度双线性插值
 * 2. 栅格数据采样
 * 3. 色带映射
 * 4. ImageBitmap生成
 * 适用于：海浪/风场/海流/温度场/任意规则栅格
 */
// importScripts();
/**主线程发送的数据 */
let data;
/**OffscreenCanvas上下文 */
let offCtx;
/**颜色查找表（LUT）用于：value -> rgba 避免每像素重复计算颜色 */
let colorLUT;
/**worker消息入口 */
self.addEventListener(
  "message",
  function (ev) {
    data = ev.data;
    const width = Math.max(1, Math.floor(data.width));
    const height = Math.max(1, Math.floor(data.height));
    /**OffscreenCanvas worker内渲染canvas */
    const canvas = new OffscreenCanvas(width, height);
    /**desynchronized降低同步阻塞 */
    offCtx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    buildColorLUT();
    draw();
    const bmp = canvas.transferToImageBitmap();
    self.postMessage({ workerId: data.id, data: bmp });
  },
  false,
);

/**绘制栅格数据 */
function draw() {
  const { width, height, samplingRate = 1 } = data;
  const image = offCtx.createImageData(width, height);
  const buf32 = new Uint32Array(image.data.buffer);
  /**遍历屏幕像素 */
  for (let y = 0; y < height; y += samplingRate) {
    for (let x = 0; x < width; x += samplingRate) {
      /**获取屏幕对应经纬度 */
      const [lng, lat] = getLngLat(x, y);
      /**经纬度插值栅格值 */
      const val = interpolate(lng, lat);
      if (val == null) continue;
      const rgba = getColorByLUT(val);
      /**透明 */
      if (rgba === 0) continue;
      /**samplingRate块填充 避免每像素计算 */
      for (let dy = 0; dy < samplingRate && y + dy < height; dy++) {
        const row = (y + dy) * width;
        for (let dx = 0; dx < samplingRate && x + dx < width; dx++) {
          buf32[row + x + dx] = rgba;
        }
      }
    }
  }
  /**写回canvas */
  offCtx.putImageData(image, 0, 0);
}

/**获取屏幕像素对应经纬度
 * 使用低分辨率经纬度网格+双线性插值,避免每像素调用地图投影
 */
function getLngLat(x, y) {
  /**geoStep经纬度采样步长; geoCols经纬度采样网格数量; lngLatBuffer经纬度缓存 [lng, lat, lng, lat...] */
  const { geoStep, geoCols, geoRows, lngLatBuffer } = data;
  /**转采样网格坐标 */
  const gx = x / geoStep;
  const gy = y / geoStep;
  /**四邻域 */
  const x0 = Math.floor(gx);
  const y0 = Math.floor(gy);
  const x1 = Math.min(x0 + 1, geoCols - 1);
  const y1 = Math.min(y0 + 1, geoRows - 1);
  /**插值权重 */
  const rx = gx - x0;
  const ry = gy - y0;
  /**四个采样点 */
  const p00 = getGeoPoint(x0, y0);
  const p10 = getGeoPoint(x1, y0);
  const p01 = getGeoPoint(x0, y1);
  const p11 = getGeoPoint(x1, y1);
  /**经度防180跳变 防止：179 -> -179 导致横跨全球插值 */
  const lng00 = p00[0];
  const lng10 = alignLng(lng00, p10[0]);
  const lng01 = alignLng(lng00, p01[0]);
  const lng11 = alignLng(lng00, p11[0]);
  /**纬度 */
  const lat00 = p00[1];
  const lat10 = p10[1];
  const lat01 = p01[1];
  const lat11 = p11[1];
  /**双线性插值 */
  const lng =
    lng00 * (1 - rx) * (1 - ry) +
    lng10 * rx * (1 - ry) +
    lng01 * (1 - rx) * ry +
    lng11 * rx * ry;

  const lat =
    lat00 * (1 - rx) * (1 - ry) +
    lat10 * rx * (1 - ry) +
    lat01 * (1 - rx) * ry +
    lat11 * rx * ry;

  return [normalizeLng(lng), lat];
}

/**获取采样网格经纬度 return [lng, lat] */
function getGeoPoint(gx, gy) {
  const { geoCols, lngLatBuffer } = data;
  const idx = (gy * geoCols + gx) * 2;
  return [lngLatBuffer[idx], lngLatBuffer[idx + 1]];
}

/**对齐经度，防止180°跳变 */
function alignLng(base, lng) {
  let d = lng - base;
  if (d > 180) {
    lng -= 360;
  } else if (d < -180) {
    lng += 360;
  }
  return lng;
}

/**标准化经度 转到：[-180, 180] */
function normalizeLng(lng) {
  while (lng > 180) {
    lng -= 360;
  }
  while (lng < -180) {
    lng += 360;
  }
  return lng;
}

/**栅格双线性插值 */
function interpolate(lng, lat) {
  /**grid栅格值; mask有效值; nx,ny网格宽高; lng0,lat0起点经纬度; lngΔ,latΔ网格步长 */
  const { grid, mask, nx, ny, lng0, lat0, lngΔ, latΔ } = data;
  /**经度方向索引 */
  let i = wrapDeltaLng(lng, lng0) / lngΔ;
  /**修复负数 */
  if (i < 0) {
    i += nx;
  }
  /**纬度方向索引 */
  const j = (lat0 - lat) / latΔ;
  /**超出纬度范围 */
  if (j < 0 || j >= ny - 1) {
    return null;
  }
  /**四邻域索引 */
  const x0 = mod(Math.floor(i), nx);
  const x1 = mod(x0 + 1, nx);
  const y0 = Math.floor(j);
  const y1 = y0 + 1;
  /**一维索引 */
  const idx00 = y0 * nx + x0;
  const idx10 = y0 * nx + x1;
  const idx01 = y1 * nx + x0;
  const idx11 = y1 * nx + x1;
  /**插值权重 */
  const rx = i - Math.floor(i);
  const ry = j - y0;
  let sum = 0;
  let weight = 0;
  /**p00 */
  if (mask[idx00]) {
    const w = (1 - rx) * (1 - ry);
    sum += grid[idx00] * w;
    weight += w;
  }
  /**p10 */
  if (mask[idx10]) {
    const w = rx * (1 - ry);
    sum += grid[idx10] * w;
    weight += w;
  }
  /**p01 */
  if (mask[idx01]) {
    const w = (1 - rx) * ry;
    sum += grid[idx01] * w;
    weight += w;
  }
  /**p11 */
  if (mask[idx11]) {
    const w = rx * ry;
    sum += grid[idx11] * w;
    weight += w;
  }
  /**四邻域全无效 */
  if (weight === 0) {
    return null;
  }
  return sum / weight;
}

/**wrap经度差值 */
function wrapDeltaLng(a, b) {
  let d = a - b;
  if (d > 180) {
    d -= 360;
  }
  if (d < -180) {
    d += 360;
  }
  return d;
}

/**真正数学mod */
function mod(n, m) {
  return ((n % m) + m) % m;
}

/**构建颜色查找表 value -> rgba 避免：每像素重复计算颜色 */
function buildColorLUT() {
  const max = 20;
  /**精度：0.01 */
  const size = max * 100;
  colorLUT = new Uint32Array(size);
  for (let i = 0; i < size; i++) {
    const value = i / 100;
    const [r, g, b] = getColorRGB(value);
    /**Uint32 RGBA little-endian: ABGR */
    colorLUT[i] = (180 << 24) | (b << 16) | (g << 8) | r;
  }
}

/**LUT取色 */
function getColorByLUT(value) {
  if (value == null || !Number.isFinite(value)) {
    return 0;
  }
  /**value -> LUT索引 */
  const idx = Math.max(
    0,
    Math.min(colorLUT.length - 1, Math.round(value * 100)),
  );
  return colorLUT[idx];
}

/**获取插值颜色 */
function getColorRGB(value) {
  const colors = data.mosaicColor || [];
  const values = data.mosaicValue || [];
  if (colors.length === 0) {
    return [0, 0, 0];
  }
  /**小于最小值 */
  if (value <= values[0]) {
    return hexToRgb(colors[0]);
  }
  /**分段颜色插值 */
  for (let i = 1, len = values.length; i < len; i++) {
    if (value <= values[i]) {
      const t = (value - values[i - 1]) / (values[i] - values[i - 1]);
      return interpolateColor(colors[i - 1], colors[i], t);
    }
  }
  /**超出最大值 */
  return hexToRgb(colors[colors.length - 1]);
}

/**RGB颜色插值 return [r, g, b] */
function interpolateColor(c1, c2, t) {
  const a = hexToRgb(c1);
  const b = hexToRgb(c2);
  return [
    (a[0] + (b[0] - a[0]) * t) | 0,
    (a[1] + (b[1] - a[1]) * t) | 0,
    (a[2] + (b[2] - a[2]) * t) | 0,
  ];
}

/**hex -> rgb return [r, g, b] */
function hexToRgb(hex) {
  hex = hex.replace("#", "");
  /**#fff -> #ffffff */
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
}
