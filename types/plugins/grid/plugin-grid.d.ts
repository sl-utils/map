import { MapPluginGridBase } from "./plugin-grid-base";
import { SLUMap } from "../../map";
import { DataMapGrid, OptMapGrid } from "../../types";
/**网格插件,用于渲染网格数据
 * @extends MapPluginGridBase
 * @constructor
 * @param sluMap 地图实例
 * @param options 基础配置
 */
export declare class MapPluginGrid extends MapPluginGridBase {
    constructor(sluMap: SLUMap, options: Partial<OptMapGrid>);
    /**可视区内的网格数据XY */
    protected boundsDatas: [number, number, number][][];
    /**设置渲染数据
     * @param datas 网格数据
     */
    setData(datas: DataMapGrid[]): void;
    /**根据经纬度获取网格数据
     * @param lng 经度
     * @param lat 纬度
     * @returns 网格数据
     */
    getInfoByLngLat(lng: number, lat: number): [number, number, number] | null;
    /**渲染开始 */
    private renderStart;
    /**渲染静态图层 */
    protected renderFixedData(): void;
}
