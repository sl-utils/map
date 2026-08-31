import { MapType } from "../utils";
import type { MOptCanvasLayer } from "./canvas-layer";
/** 固定图片热力图-不随缩放而变化
 * @constructor
 * @param map 地图实例
 * @param ctx 2D渲染上下文
 * @param heatOpt 热力图配置
 */
export declare class MapCanvasFixedHeat {
    private map;
    private ctx;
    heatOpt?: MOptPluginFixedHeat;
    constructor(map: MapType, ctx: CanvasRenderingContext2D, heatOpt?: MOptPluginFixedHeat);
    /** 热力图默认配置 */
    private readonly defaultOption;
    /** 原始数据 [经度, 纬度, 强度] */
    private data;
    /** 100m网格聚合后的数据 */
    private aggregatedData;
    /** 强度最大值（用于归一化） */
    private maxIntensity;
    /** 当前渲染缩放比例（大区域自动缩小） */
    private renderScale;
    /** 渲染好的热力图离屏画布 */
    private heatCanvas;
    /** 热力图对应的经纬度边界 */
    private bounds;
    /** 设置热力图数据（100m网格聚合 → 细长条的关键）
     * @param data [经度, 纬度, 强度]
     */
    setData(data: [number, number, number][]): void;
    /** 100m网格聚合:一个网格只剩一个中心点 + 平均强度 → 点数大幅减少，形成细长条
     * @param data [经度, 纬度, 强度]
     * @returns [经度, 纬度, 平均强度]
     */
    private buildHeatPoints;
    /** 将聚合后的数据渲染为固定图片（二次聚合 + 画布保护） */
    private renderToImage;
    /** 自定义渲染（已优化：归一化 + 动态半径 + 淡色过滤）
     * @param ctx 画布上下文
     * @param points 聚合后的点数据
     */
    private renderHeat;
    /** 将十六进制颜色转换为RGB数组
     * @param hex #RRGGBB
     * @returns [R, G, B]
     */
    private hexToRgb;
    /** 绘制热力图（根据当前缩放级别） */
    draw(): void;
    /** 清除热力图数据 */
    clear(): void;
}
/**固定热力图插件配置 */
export type MOptPluginFixedHeat = MOptCanvasLayer & {
    /**参考层级 */
    refZoom?: number;
    /**最小层级 */
    minZoom?: number;
    /**最大层级 */
    maxZoom?: number;
    /**半径 */
    radius?: number;
    /**模糊程度 */
    blur?: number;
    /**透明度 */
    opacity?: number;
    /**渐变颜色 */
    gradient?: Record<number, string>;
};
