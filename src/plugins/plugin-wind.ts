import type { MapImage, MOptCanvas } from "../map";
import { Image } from "../canvas";
import { MapCanvasDraw, SLUMap } from "../map";
import { um_getLngLatByPoint, um_getMapSize, um_getPointByLnglat } from "../utils";
import { MapPluginGridBase, MDataGrid, GridBounds } from "./grid/plugin-grid-base";

/**
 * 风速风向插件
 *
 * 用于在地图上渲染风速风向数据，通过图标展示风力等级和风向。
 * 支持自定义图标解析器和不同层级的图标大小配置。
 *
 * @extends MapPluginGridBase
 * @constructor
 * @param sluMap SLUMap 地图实例
 * @param options 风场配置
 *
 * @example
 * ```typescript
 * import { SLUMap, MapPluginWind } from '@sl-utils/map';
 *
 * const map = new SLUMap('map');
 * await map.init({ type: 'L' });
 *
 * // 创建风场插件
 * const wind = new MapPluginWind(map, {
 *   url: '/assets/icons/icon-28.png',
 *   size: [28, 28],
 *   sizeo: [28, 28],
 *   pane: 'windPane'
 * });
 *
 * // 设置风速风向数据
 * wind.setData([
 *   {
 *     header: {
 *       lo1: 100, la1: 20, lo2: 130, la2: 40,
 *       nx: 61, ny: 41, dx: 0.5, dy: 0.5
 *     },
 *     data: [/* U 风速数据 *\/]
 *   },
 *   {
 *     header: {
 *       lo1: 100, la1: 20, lo2: 130, la2: 40,
 *       nx: 61, ny: 41, dx: 0.5, dy: 0.5
 *     },
 *     data: [/* V 风速数据 *\/]
 *   }
 * ]);
 *
 * // 自定义图标解析器
 * wind.setIconResolver((speed) => {
 *   const level = speed < 3.4 ? 0 : speed < 8.0 ? 1 : speed < 13.9 ? 2 : 3;
 *   return {
 *     url: '/assets/icons/wind-icons.png',
 *     size: [28, 28],
 *     sizeo: [28, 28],
 *     posX: level * 28,
 *     posY: 0
 *   };
 * });
 *
 * // 移除图层
 * wind.onRemove();
 * ```
 */
export class MapPluginWind extends MapPluginGridBase {
    constructor(sluMap: SLUMap, options: MOptPluginWind) {
        super(sluMap.map, options);
        this.draw = new MapCanvasDraw(this.map, this.canvas);
        this.options = { ...this.options, ...options };
    }
    /**根据风速返回图标配置
     * @param speed 风速
     * @returns 图标配置
     */
    private iconResolver: (speed: number) => Image = (speed: number) => {
        const level = speed < 0.3 ? 0 : speed < 1.6 ? 1 : speed < 3.4 ? 2 : speed < 5.5 ? 3 : speed < 8.0 ? 4 : speed < 10.8 ? 5 : speed < 13.9 ? 6 : speed < 17.2 ? 7 : speed < 20.8 ? 8 : speed < 24.5 ? 9 : speed < 28.5 ? 10 : speed < 32.7 ? 11 : 12;
        const pos = [level + 2, 1];
        const { url, size, sizeo } = this.options;
        return {
            url,
            size,
            sizeo,
            posX: pos[0] * (size[0] + 1),
            posY: pos[1] * (size[1] + 1),
        };
    };
    /**绘制实例 */
    private draw: MapCanvasDraw;
    /**基础配置 */
    public options: MOptPluginWind = {
        url: '/assets/icons/icon-28.png',
        size: [28, 28],
        sizeo: [28, 28],
        zooMsize: [
            [6, 6], [6, 6], [6, 6], [6, 6], [8, 8], [8, 8],//0-5
            [12, 12], [16, 16], [22, 22], [28, 28], [28, 28], [28, 28],//6-11
            [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32],
        ],
        pane: 'windPane',
    };
    /**设置图标解析器
     * @param resolver 图标解析器
     * @returns MapPluginWind实例
     */
    public setIconResolver(resolver: (speed: number) => Image): MapPluginWind {
        this.iconResolver = resolver;
        return this;
    }
    /**设置风速风向数据
     * @param data 风速风向数据
     */
    public setData(data: MDataGrid[]): void {
        this._setDatas(data);
        this.renderFixedData();
    }
    /**获取视图范围内的(指定像素间隔的数据)
     * @param bounds 视图范围
     * @param pixelInterval @default 2 像素间隔
     * @returns 风速风向数据
     */
    protected getViewBoundsGridWind(bounds: GridBounds, pixelInterval: number = 2): MDataWind[] {
        const columns: MDataWind[] = [];
        /**获取经纬度为[0,0]的点相对于容器的像素点(假设经纬度为[0,0]的点为必须渲染的点) */
        let [x0, y0] = um_getPointByLnglat(this.map, [0, 0]);
        /**获取可视范围内需要渲染数据的起点x,y */
        let j = y0 % pixelInterval, k = x0 % pixelInterval;
        for (let y = j, len = bounds.height; y < len; y += pixelInterval) {
            for (let x = k, len2 = bounds.width; x < len2; x += pixelInterval) {
                //得到可视区X , Y 点对应地图上的经纬度
                let [lng, lat] = um_getLngLatByPoint(this.map, [x, y]);
                /**是否是有效数字 */
                if (isFinite(lng)) {
                    //获得指定经纬度的信息 [ u数据 , v数据 , 平均值 ]
                    const wind = this.interpolate(lng, lat);
                    if (wind) columns.push({ lnglat: [lng, lat], speed: wind[0], direction: wind[1] })
                }
            }
        }
        return columns;
    }
    /**根据风力等级获取图片裁剪地址 x,y */
    protected renderAnimation(): void { }
    /**渲染静态图层 */
    protected renderFixedData(): void {
        const size = um_getMapSize(this.map); // bounds, width, height, extent
        let columns = this.getViewBoundsGridWind({ x: 10, y: 10, width: size.w, height: size.h }, 60);
        let options = this.options, i = 1, imgs: MapImage[] = [];
        for (let index = 0, len = columns.length; index < len;) {
            const item = columns[index];
            index = index + i;
            const res = this.iconResolver(item.speed);
            imgs.push({
                url: res.url,
                size: res.size || options.size,
                sizeo: res.sizeo,
                posX: res.posX,
                posY: res.posY,
                lnglat: item.lnglat,
                rotate: item.direction,
            });
        }
        this.draw.setAllImgs(imgs);
        this.draw.drawMapAll();
    }
}

/**风场数据点 */
export interface MDataWind {
    /**经纬度 [lng, lat] */
    lnglat: [number, number]
    /**风速 */
    speed: number;
    /**风向 */
    direction: number;
}

/**风速风向插件配置 */
export interface MOptPluginWind extends MOptCanvas {
    /**风场数据路径 */
    url?: string;
    /**渲染大小 */
    size?: [number, number];
    /**原图大小 */
    sizeo?: [number, number];
    /**不同层级的大小配置 */
    zooMsize?: [number, number][];
}
