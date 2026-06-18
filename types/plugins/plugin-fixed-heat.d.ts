import { OptMapPluginFixedHeat } from "../types";
import { MapCanvasLayer, SLUMap } from "../map";
/**固定图片热力图
 * @extends MapCanvasLayer
 * @constructor
 * @param sluMap 地图实例
 * @param options 热力图配置
 */
export declare class MapPluginFixedHeat extends MapCanvasLayer {
    constructor(sluMap: SLUMap, options?: OptMapPluginFixedHeat);
    private fixedHeat;
    /**
     * 外部设置热力数据
     * @param data [经度, 纬度, 强度]
     */
    setData(data: [number, number, number][]): void;
    /**静态数据层 */
    protected renderFixedData(): void;
}
