import * as L from "leaflet";
import 'proj4leaflet';
/**地图的名称
 * tianDiTu 天地图 gaoDe 高德 baiDu 百度 google 谷歌
 * Normal 矢量地图 Satellite 卫星图
 * Map地图 Annotion地名
 */
export declare enum MapNameType {
    /**天地图 */
    /**天地图 矢量地图 */
    tianDiTuNormalMap = "TianDiTu.Normal.Map",
    /**天地图 矢量地图 地名 */
    tianDiTuNormalAnnotion = "TianDiTu.Normal.Annotion",
    /**天地图 卫星图 */
    tianDiTuSatelliteMap = "TianDiTu.Satellite.Map",
    /**天地图 卫星图 地名 */
    tianDiTuSatelliteAnnotion = "TianDiTu.Satellite.Annotion",
    /**天地图 地形图 */
    tianDiTuTerrainMap = "TianDiTu.Terrain.Map",
    /**天地图 地形图 地名 */
    tianDiTuTerrainAnnotion = "TianDiTu.Terrain.Annotion",
    /**gaoDe 高德*/
    /**高德 矢量地图 */
    gaoDeNormalMap = "GaoDe.Normal.Map",
    /**高德 卫星图 */
    gaoDeSatelliteMap = "GaoDe.Satellite.Map",
    /**高德 卫星图 地名 */
    gaoDeSatelliteAnnotion = "GaoDe.Satellite.Annotion",
    /**百度 */
    /**百度 矢量地图 */
    baiDuNormalMap = "Baidu.Normal.Map",
    /**百度 卫星图 */
    baiDuSatelliteMap = "Baidu.Satellite.Map",
    /**百度 卫星图 地名 */
    baiDuSatelliteAnnotion = "Baidu.Satellite.Annotion",
    /**谷歌 */
    /**谷歌 矢量地图 */
    googleNormalMap = "Google.Normal.Map",
    /**谷歌 卫星图 */
    googleSatelliteMap = "Google.Satellite.Map",
    /**谷歌 卫星图 地名 */
    googleSatelliteAnnotion = "Google.Satellite.Annotion",
    /**Geoq 矢量地图 */
    geoqNormalMap = "Geoq.Normal.Map",
    /**Geoq 午夜蓝/紫蓝色地图 */
    geoqNormalPurplishBlue = "Geoq.Normal.PurplishBlue",
    /**Geoq 灰色地图 */
    geoqNormalGray = "Geoq.Normal.Gray",
    /**Geoq 暖色地图 */
    geoqNormalWarm = "Geoq.Normal.Warm",
    /**Geoq 水系主题地图 */
    geoqThemeHydro = "Geoq.Theme.Hydro",
    /**OSM 矢量地图 */
    oSMNormalMap = "OSM.Normal.Map"
}
/**网络地图图层配置项 */
export interface SLPMapLeafletLayer extends L.TileLayerOptions {
    /**个人地图凭证token */
    key?: string;
    /**地图采用的坐标系信息(根据地图名称自动匹配) */
    corrdType?: string;
}
/**加载网络地图 并通过坐标转换使瓦片偏移解决地图偏移问题
 * @constructor
 * @param name 网络地图名称SLEMap
 * @param options 地图配置
 */
export declare class SLULeafletNetMap {
    constructor(name: MapNameType, options?: SLPMapLeafletLayer);
    /**地图实例 */
    private map;
    /**地图图层 */
    private mapLayer;
    /**将图层添加到map显示在页面
     * @param map 地图实例
     * @returns SLULeafletNetMap实例
     */
    addTo(map: L.Map): this;
    /**从map中移除当前图层
     * @returns SLULeafletNetMap实例
     */
    remove(): this;
    /**变更当前图层并添加到map中
     * @param name 网络地图名称SLEMap
     * @param options 地图配置
     * @returns SLULeafletNetMap实例
     */
    changeMap(name: MapNameType, options?: SLPMapLeafletLayer): this;
    /**设置map的地图来源，名称，类型
     * @param name 网络地图名称SLEMap
     * @param options 地图配置
     */
    private setMapProvider;
    /**获取坐标转换类型
     * @param name 地图来源
     * @returns 坐标转换类型
     */
    private getCorrdType;
}
