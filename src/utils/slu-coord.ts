import type { MapLatLng } from "../map";

const a = 6378245.0;
const pi = 3.1415926535897932384626;
const ee = 0.00669342162296594323;
const x_pi = pi * 3000.0 / 180.0;

/**百度转84
 * @params lng 经度
 * @params lat 纬度
 * @returns 84坐标
 */
function tobd09gps84(lng: number, lat: number): MapLatLng {
    const gcj02 = tobd09cj02(lng, lat);
    const map84 = togcj02gps84(gcj02.lng, gcj02.lat);
    return map84;
}
/** 火星转84
 * @params lng 经度
 * @params lat 纬度
 * @returns 84坐标
 */
function togcj02gps84(lng: number, lat: number): MapLatLng {
    const coord = transform(lng, lat);
    const lontitude = lng * 2 - coord.lng;
    const latitude = lat * 2 - coord.lat;
    const newCoord = {
        lng: lontitude,
        lat: latitude
    };
    return newCoord;
}
/** 84转百度
 * @params lng 经度
 * @params lat 纬度
 * @returns 百度坐标
 */
function togps84bd09(lng: number, lat: number): MapLatLng {
    const gcj02 = togps84gcj02(lng, lat);
    const bd09 = togcj02bd09(gcj02.lng, gcj02.lat);
    return bd09;
}
/** 84转火星
 * @params lng 经度
 * @params lat 纬度
 * @returns 火星坐标
 */
function togps84gcj02(lng: number, lat: number): MapLatLng {
    let dLat = transformLat(lng - 105.0, lat - 35.0);
    let dLng = transformLng(lng - 105.0, lat - 35.0);
    const radLat = lat / 180.0 * pi;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
    const mgLat = lat + dLat;
    const mgLng = lng + dLng;
    const newCoord = {
        lng: mgLng,
        lat: mgLat
    };
    return newCoord;
}
/** 火星转百度
 * @params lng 经度
 * @params lat 纬度
 * @returns 百度坐标
 */
function togcj02bd09(lng: number, lat: number): MapLatLng {
    const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_pi);
    const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_pi);
    const bd_lng = z * Math.cos(theta) + 0.0065;
    const bd_lat = z * Math.sin(theta) + 0.006;
    const newCoord = {
        lng: bd_lng,
        lat: bd_lat
    };
    return newCoord;
}
/** 百度转火星
 * @params lng 经度
 * @params lat 纬度
 * @returns 火星坐标
 */
function tobd09cj02(bd_lng: number, bd_lat: number): MapLatLng {
    const x = bd_lng - 0.0065;
    const y = bd_lat - 0.006;
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    const gg_lng = z * Math.cos(theta);
    const gg_lat = z * Math.sin(theta);
    const newCoord = {
        lng: gg_lng,
        lat: gg_lat
    };
    return newCoord;
}
/** 转换坐标： WGS-84转为 GCJ-02
 * @params lng 经度
 * @params lat 纬度
 * @returns 转换后的坐标
 */
function transform(lng: number, lat: number): MapLatLng {
    let dLat = transformLat(lng - 105.0, lat - 35.0);
    let dLng = transformLng(lng - 105.0, lat - 35.0);
    const radLat = lat / 180.0 * pi;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
    const mgLat = lat + dLat;
    const mgLng = lng + dLng;
    const newCoord = {
        lng: mgLng,
        lat: mgLat
    };
    return newCoord;
}
/** 纬度偏移计算
 * @params x 经度
 * @params y 纬度
 * @returns 纬度偏移量
 */
function transformLat(x: number, y: number): number {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    return ret;
}
/** 经度偏移计算
 * @params x 经度
 * @params y 纬度
 * @returns 经度偏移量
 */
function transformLng(x: number, y: number): number {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
    return ret;
}

export {
    tobd09gps84 as um_tobd09gps84,
    togcj02gps84 as um_togcj02gps84,
    togps84bd09 as um_togps84bd09,
    togps84gcj02 as um_togps84gcj02,
    togcj02bd09 as um_togcj02bd09,
    tobd09cj02 as um_tobd09cj02,
};
