importScripts();
/**全局变量  */
/**主线程传过来的数据(此线程处理单个数据由1个元素组成的数据) */
var data;
/**绘图用的离屏的画布OffscreenCanvas上下文 */
var offCtx;
/**执行任务的id */
var taskId;
/** */
self.addEventListener('message', function (ev) {
    data = ev.data;
    let id = data.id;
    // 创建一个 OffscreenCanvas，并获取其渲染上下文
    const offscreenCanvas = new OffscreenCanvas(data.width, data.height);
    offCtx = offscreenCanvas.getContext('2d');
    computeData();
    let bitMap = offscreenCanvas.transferToImageBitmap();
    self.postMessage({workerId: data.id , data:bitMap});
}, false);
/**计算并构建数据 */
function computeData() {
    let columns = this.interpolateField();
    this.genMosaic(columns);
}
/**生成可视区范围数据
 * @param bounds  可视区域的像素范围
*/
function interpolateField() {
    // width 可视区宽度  height 可视区高度 lat起始纬度 lng起始经度 latd单个像素纬度差 lngd单个像素经度差
    let { width, height, lng, lngd, lats } = data, columns = [];
    for (let y = 0; y < height; y += 2) {
        //[number, number, number][]
        let column = [];
        for (let x = 0; x < width; x += 2) {
            //得到可视区X , Y 点对应地图上的经纬度
            let cLat = lats[y], cLng = lng + x * lngd;
            // let {lat:cLat,lng:cLng} = containerPointToLatLng([x,y])
            /**是否是有效数字 */
            if (isFinite(cLng)) {
                //获得指定经纬度的信息 [ u数据 , v数据 , 平均值 ]
                var wind = interpolate(cLng, cLat);
                if (wind) column[x + 1] = column[x] = wind;
            }
        }
        columns[y + 1] = columns[y] = column;
    }
    return columns;
}
/**获得指定经纬度的数据信息
* @param lng 经度number
* @param lat 纬度number
* @return [ 计算得到的开始值S , 计算的到的结束值E, sqrt(S*S+E*E) ]
*/
function interpolate(lng, lat) {
    let { lat0, latΔ, lng0, lngΔ, grid } = data;
    if (!grid) return null;
    /** 该经度属于nx的第几个 */
    let i = floorMod(lng - lng0, 360) / lngΔ;
    /** 该纬度属于ny的第几个 */
    let j = (lat0 - lat) / latΔ;
    let fx = Math.floor(i),
        nx = fx + 1,
        fy = Math.floor(j),
        ny = fy + 1;
    let row;
    /** Y轴第fy个数据 赋值并且不为undefined */
    if (row = grid[fy]) {
        let g00 = row[fx], g10 = row[nx];
        if (isValue(g00) && isValue(g10) && (row = grid[ny])) {
            //X轴第fy+1个数据
            var g01 = row[fx], g11 = row[nx];
            if (isValue(g01) && isValue(g11)) {
                return bilinearInterpolateVector(i - fx, j - fy, g00, g10, g01, g11);
            }
        }
    }
    return null;
}
/**根据网格数据构建虚拟数值
* @param x 指定经度的X数值相对最近的低位整数坐标的差值 [0,1)
* @param y 指定纬度的Y数值相对最近的低位整数坐标的差值 [0,1)
* @param g00 该经纬度所在的网格的左上角的数据
* @param g10 该经纬度所在的网格的右上角的数据
* @param g01 该经纬度所在的网格的左下角的数据
* @param g11 该经纬度所在的网格的右下角的数据
* @returns [ 计算得到的开始值S , 计算的到的结束值E, 平均速度 ]
*/
function bilinearInterpolateVector(x, y, g00, g10, g01, g11) {
    /**右侧(下一个)的影响权重 */
    let invalid = data.invalid, rx = 1 - x, ry = 1 - y, u, v;
    let a = rx * ry,
        b = x * ry,
        c = rx * y,
        d = x * y;
    if (g00[0] === invalid || g10[0] === invalid || g01[0] === invalid || g11[0] === invalid) u = invalid;
    if (u === invalid ) return [invalid];
    u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;
    return [u];
}
/**生成马赛克类型图 */
function genMosaic(datas) {
    let ctx = offCtx;
    //根据点位创建颜色深度不一的黑色遮罩
    ctx.globalAlpha = 0.35;
    let { width, height, invalid } = data;
    for (let i = 0, len = height; i < len; i++) {
        for (let j = 0, len = width; j < len; j++) {
            let p = datas[i][j] || [], value = p[0];
            if (value === invalid || value === undefined || value === null) continue;
            ctx.fillStyle = this.getColorByValue(value);
            ctx.fillRect(j, i, 1, 1);
        }
    }
}
/**获取该值所在的颜色 */
function getColorByValue(value) {
    let colors = data.mosaicColor || [], values = data.mosaicValue || [];
    for (let i = 0, len = values.length; i < len; i++) {
        let p = values[i];
        if (value < p) return colors[i];
    }
    return colors[colors.length - 1];
}
/**是否是空数据 */
function isNull(value) {
    return value === invalid || value === undefined || value === null || isNaN(value);
}
/**判断是否为有效数据 */
function isValue(x) {
    return x !== null && x !== undefined;
}
/**针对经纬度特殊的取余数方法
 * 小于等于n的数字若a小于0，返回 2n+a ， -365  => 2n-365 
*/
function floorMod(a, n) {
    return a - n * Math.floor(a / n);
}