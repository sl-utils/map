import { MapCanvasDraw } from "../map";
import { u_mapGetLngLatByPoint, u_mapGetMapSize, u_mapGetPointByLnglat } from "../utils/slu-map";
import { MapPluginGridBase } from "./grid/plugin-grid-base";
export class MapPluginWind extends MapPluginGridBase {
    constructor(sluMap, options) {
        super(sluMap.map, options);
        this.iconResolver = (speed) => {
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
        this.options = {
            url: '/assets/icons/icon-28.png',
            size: [28, 28],
            sizeo: [28, 28],
            zooMsize: [
                [6, 6], [6, 6], [6, 6], [6, 6], [8, 8], [8, 8],
                [12, 12], [16, 16], [22, 22], [28, 28], [28, 28], [28, 28],
                [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32], [32, 32],
            ],
            pane: 'windPane',
        };
        this.draw = new MapCanvasDraw(this.map, this.canvas);
        this.options = { ...this.options, ...options };
    }
    setIconResolver(resolver) {
        this.iconResolver = resolver;
        return this;
    }
    setData(data) {
        this._setDatas(data);
        this.renderFixedData();
    }
    getViewBoundsGridWind(bounds, pixelInterval = 2) {
        const columns = [];
        let [x0, y0] = u_mapGetPointByLnglat(this.map, [0, 0]);
        let j = y0 % pixelInterval, k = x0 % pixelInterval;
        for (let y = j, len = bounds.height; y < len; y += pixelInterval) {
            for (let x = k, len2 = bounds.width; x < len2; x += pixelInterval) {
                let [lng, lat] = u_mapGetLngLatByPoint(this.map, [x, y]);
                if (isFinite(lng)) {
                    const wind = this.interpolate(lng, lat);
                    if (wind)
                        columns.push({ lnglat: [lng, lat], speed: wind[0], direction: wind[1] });
                }
            }
        }
        return columns;
    }
    renderAnimation() { }
    renderFixedData() {
        const size = u_mapGetMapSize(this.map);
        let columns = this.getViewBoundsGridWind({ x: 10, y: 10, width: size.w, height: size.h }, 60);
        let options = this.options, i = 1, imgs = [];
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
//# sourceMappingURL=plugin-wind.js.map