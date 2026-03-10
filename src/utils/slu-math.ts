
/**获取二阶贝塞尔曲线指定百分比的点位置信息
* @param t 当前百分比
* @param p1 起点坐标
* @param p2 终点坐标
* @param cp 控制点
*/
function getBezierPointByPercent(percent: number, p1: [number, number], p2: [number, number], cp: [number, number]): [number, number] {
    const [x1, y1] = p1, [cx, cy] = cp, [x2, y2] = p2, t = percent;
    let x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2;
    let y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
    return [x, y];
}
/**---------------------------------------------------- */
/**---------------------------------------------------- */
/**数学工具类
 * 数学运算、三角函数、曲线函数、坐标转换等
 */
export {
    getBezierPointByPercent as u_mathGetBezierPointByPercent,
}