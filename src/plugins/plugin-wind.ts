import { MapCanvasDraw } from "@sl-utils/map";
import { u_mapGetLatLngByPoint, u_mapGetMapSize, u_mapGetPointByLatlng } from "../utils/slu-map";
import { MapPluginGridBase } from "./grid/grid";


export class MapPluginWind extends MapPluginGridBase {
    constructor(map: L.Map | AMAP.Map, options: Partial<SLPMap.Wind>) {
        super(map, options);
        this.draw = new MapCanvasDraw(this.map, this.canvas);
        this.options = { ...this.options, ...options };
    }
    /**根据风速返回图标配置 */
    private iconResolver: (speed: number) => CanvasImage = (speed: number) => {
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
    private draw: MapCanvasDraw;
    /**配置 */
    public options: SLPMap.Wind = {
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
    /**设置图标解析器 */
    public setIconResolver(resolver: (speed: number) => CanvasImage) {
        this.iconResolver = resolver;
        return this;
    }
    /**设置风速风向数据 */
    public setData(data: SLDMapGrid[]) {
        this._setDatas(data);
        this.renderFixedData();
    }
    /**获取视图范围内的(指定像素间隔的数据) */
    protected getViewBoundsGridWind(bounds: GridBounds, pixelInterval: number = 2): SLDMap.Wind[] {
        var columns: SLDMap.Wind[] = [];
        /**获取经纬度为[0,0]的点相对于容器的像素点(假设经纬度为[0,0]的点为必须渲染的点) */
        let [x0, y0] = u_mapGetPointByLatlng(this.map, [0, 0]);
        /**获取可视范围内需要渲染数据的起点x,y */
        let j = y0 % pixelInterval, k = x0 % pixelInterval;
        for (let y = j, len = bounds.height; y < len; y += pixelInterval) {
            for (let x = k; x <= bounds.width; x += pixelInterval) {
                //得到可视区X , Y 点对应地图上的经纬度
                let [lat, lng] = u_mapGetLatLngByPoint(this.map, [x, y]);
                /**是否是有效数字 */
                if (isFinite(lng)) {
                    //获得指定经纬度的信息 [ u数据 , v数据 , 平均值 ]
                    var wind = this.interpolate(lng, lat);
                    if (wind) columns.push({ latlng: [lat, lng], speed: wind[0], direction: wind[1] })
                }
            }
        }
        return columns;
    }
    /**根据风力等级获取图片裁剪地址 x,y */
    protected renderAnimation() { }
    protected renderFixedData() {
        var size = u_mapGetMapSize(this.map); // bounds, width, height, extent
        let columns = this.getViewBoundsGridWind({ x: 10, y: 10, width: size.w, height: size.h }, 60);
        let options = this.options, i = 1, imgs: MapImage[] = [];
        for (let index = 0; index < columns.length;) {
            const item = columns[index];
            index = index + i;
            const res = this.iconResolver(item.speed);
            imgs.push({
                url: res.url,
                size: res.size || options.size,
                sizeo: res.sizeo,
                posX: res.posX,
                posY: res.posY,
                latlng: item.latlng,
                rotate: item.direction,
            });
        }
        this.draw.setAllImgs(imgs);
        this.draw.drawMapAll();
    }
}
