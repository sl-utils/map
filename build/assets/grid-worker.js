const n = `importScripts();\r
/**全局变量  */\r
/**主线程传过来的数据(此线程处理单个数据由1个元素组成的数据) */\r
var data;\r
/**绘图用的离屏的画布OffscreenCanvas上下文 */\r
var offCtx;\r
/**执行任务的id */\r
var taskId;\r
/** */\r
self.addEventListener('message', function (ev) {\r
    data = ev.data;\r
    let id = data.id;\r
    // 创建一个 OffscreenCanvas，并获取其渲染上下文\r
    const offscreenCanvas = new OffscreenCanvas(data.width, data.height);\r
    offCtx = offscreenCanvas.getContext('2d');\r
    computeData();\r
    let bitMap = offscreenCanvas.transferToImageBitmap();\r
    self.postMessage({workerId: data.id , data:bitMap});\r
}, false);\r
/**计算并构建数据 */\r
function computeData() {\r
    let columns = this.interpolateField();\r
    this.genMosaic(columns);\r
}\r
/**生成可视区范围数据\r
 * @param bounds  可视区域的像素范围\r
*/\r
function interpolateField() {\r
    // width 可视区宽度  height 可视区高度 lat起始纬度 lng起始经度 latd单个像素纬度差 lngd单个像素经度差\r
    let { width, height, lng, lngd, lats } = data, columns = [];\r
    for (let y = 0; y < height; y += 2) {\r
        //[number, number, number][]\r
        let column = [];\r
        for (let x = 0; x < width; x += 2) {\r
            //得到可视区X , Y 点对应地图上的经纬度\r
            let cLat = lats[y], cLng = lng + x * lngd;\r
            // let {lat:cLat,lng:cLng} = containerPointToLatLng([x,y])\r
            /**是否是有效数字 */\r
            if (isFinite(cLng)) {\r
                //获得指定经纬度的信息 [ u数据 , v数据 , 平均值 ]\r
                var wind = interpolate(cLng, cLat);\r
                if (wind) column[x + 1] = column[x] = wind;\r
            }\r
        }\r
        columns[y + 1] = columns[y] = column;\r
    }\r
    return columns;\r
}\r
/**获得指定经纬度的数据信息\r
* @param lng 经度number\r
* @param lat 纬度number\r
* @return [ 计算得到的开始值S , 计算的到的结束值E, sqrt(S*S+E*E) ]\r
*/\r
function interpolate(lng, lat) {\r
    let { lat0, latΔ, lng0, lngΔ, grid } = data;\r
    if (!grid) return null;\r
    /** 该经度属于nx的第几个 */\r
    let i = floorMod(lng - lng0, 360) / lngΔ;\r
    /** 该纬度属于ny的第几个 */\r
    let j = (lat0 - lat) / latΔ;\r
    let fx = Math.floor(i),\r
        nx = fx + 1,\r
        fy = Math.floor(j),\r
        ny = fy + 1;\r
    let row;\r
    /** Y轴第fy个数据 赋值并且不为undefined */\r
    if (row = grid[fy]) {\r
        let g00 = row[fx], g10 = row[nx];\r
        if (isValue(g00) && isValue(g10) && (row = grid[ny])) {\r
            //X轴第fy+1个数据\r
            var g01 = row[fx], g11 = row[nx];\r
            if (isValue(g01) && isValue(g11)) {\r
                return bilinearInterpolateVector(i - fx, j - fy, g00, g10, g01, g11);\r
            }\r
        }\r
    }\r
    return null;\r
}\r
/**根据网格数据构建虚拟数值\r
* @param x 指定经度的X数值相对最近的低位整数坐标的差值 [0,1)\r
* @param y 指定纬度的Y数值相对最近的低位整数坐标的差值 [0,1)\r
* @param g00 该经纬度所在的网格的左上角的数据\r
* @param g10 该经纬度所在的网格的右上角的数据\r
* @param g01 该经纬度所在的网格的左下角的数据\r
* @param g11 该经纬度所在的网格的右下角的数据\r
* @returns [ 计算得到的开始值S , 计算的到的结束值E, 平均速度 ]\r
*/\r
function bilinearInterpolateVector(x, y, g00, g10, g01, g11) {\r
    /**右侧(下一个)的影响权重 */\r
    let invalid = data.invalid, rx = 1 - x, ry = 1 - y, u, v;\r
    let a = rx * ry,\r
        b = x * ry,\r
        c = rx * y,\r
        d = x * y;\r
    if (g00[0] === invalid || g10[0] === invalid || g01[0] === invalid || g11[0] === invalid) u = invalid;\r
    if (u === invalid ) return [invalid];\r
    u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;\r
    return [u];\r
}\r
/**生成马赛克类型图 */\r
function genMosaic(datas) {\r
    let ctx = offCtx;\r
    //根据点位创建颜色深度不一的黑色遮罩\r
    ctx.globalAlpha = 0.35;\r
    let { width, height, invalid } = data;\r
    for (let i = 0, len = height; i < len; i++) {\r
        for (let j = 0, len = width; j < len; j++) {\r
            let p = datas[i][j] || [], value = p[0];\r
            if (value === invalid || value === undefined || value === null) continue;\r
            ctx.fillStyle = this.getColorByValue(value);\r
            ctx.fillRect(j, i, 1, 1);\r
        }\r
    }\r
}\r
/**获取该值所在的颜色 */\r
function getColorByValue(value) {\r
    let colors = data.mosaicColor || [], values = data.mosaicValue || [];\r
    for (let i = 0, len = values.length; i < len; i++) {\r
        let p = values[i];\r
        if (value < p) return colors[i];\r
    }\r
    return colors[colors.length - 1];\r
}\r
/**是否是空数据 */\r
function isNull(value) {\r
    return value === invalid || value === undefined || value === null || isNaN(value);\r
}\r
/**判断是否为有效数据 */\r
function isValue(x) {\r
    return x !== null && x !== undefined;\r
}\r
/**针对经纬度特殊的取余数方法\r
 * 小于等于n的数字若a小于0，返回 2n+a ， -365  => 2n-365 \r
*/\r
function floorMod(a, n) {\r
    return a - n * Math.floor(a / n);\r
}`;
export {
  n as default
};
