/**获取指定位数的小数(num过大或point过大可能导致数据异常出现负值)
 * @param num 数字
 * @param point 需要几位小数
 * @param type 0四舍五入 1下取整  2 上取整
*/
declare function getPoint(num: number, point?: number, type?: 0 | 1 | 2): number;
/**获取二阶贝塞尔曲线指定百分比的点位置信息
* @param t 当前百分比
* @param p1 起点坐标
* @param p2 终点坐标
* @param cp 控制点
*/
declare function getBezierPointByPercent(percent: number, p1: [number, number], p2: [number, number], cp: [number, number]): [number, number];
/**---------------------------------------------------- */
/**---------------------------------------------------- */
/**数学工具类
 * 数学运算、三角函数、曲线函数、坐标转换等
 */
export { getPoint as u_mathGetPoint, getBezierPointByPercent as u_mathGetBezierPointByPercent, };
