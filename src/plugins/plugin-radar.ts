import { MapCanvasLayer, MapCanvasRadar } from "../map";

/**地图插件(更换地图只需要更换继承的父类类型)----绘制 */
export class MapPluginRadar extends MapCanvasLayer {
    constructor(map: L.Map, opt?: MapCanvasPara);
    constructor(map: AMAP.Map, opt?: AMAP.CustomLayerOption);
    constructor(map: AMAP.Map | L.Map, opt?: AMAP.CustomLayerOption | MapCanvasPara);
    constructor(map: AMAP.Map | L.Map, options?: AMAP.CustomLayerOption | MapCanvasPara) {
        super(map, options);
        this.canvasRadar = new MapCanvasRadar(map, this.ctx);
    }
    /**动画所有状态 */
    private canvasRadar: MapCanvasRadar;
    /**
     * 图层是否在移动 高德默认每次渲染更新像素坐标
     * leaflet 图层移动不更新像素坐标 高德 图层移动更新像素坐标
     * 高德地图移动画布和地图同步偏移，leaflet画布固定 地图偏移 的区别
     * 所以防止leaflet移动过程二次偏移 以及高德移动过程坐标未更新导致画布和容器相对位置发生偏移
     * */
    private isDrag: boolean = false;
    /**重设雷达绘制类 */
    public setAllRadars(radars: MapPluginRadarPara[]) {
        this.canvasRadar.setAllRadars(radars)
        return this;
    }
    /**添加雷达绘制类 */
    public addRadar(radar: MapPluginRadarPara) {
        this.canvasRadar.addRadar(radar)
        return this;
    }
    protected override renderFixedData(): void {

    }
    protected override renderAnimation(time?: number) {
        this.resetCanvas();
        this.canvasRadar.drawRadarStatic();
        this.canvasRadar.drawRadarAmi(time)
        this.flagAnimation && cancelAnimationFrame(this.flagAnimation);
        this.flagAnimation = requestAnimationFrame((time) => {
            // leaflet图层和高德不同，拖动结束才更新像素坐标 因此不影响 但是需要传isMapMove的值
            if (this.isDrag) return;// 拖动过程不允许更新动画 否则出现偏移可能出问题（动画图层每次拖动都会触发重绘，防止像素坐标计算的时候出现快速的偏移）
            this.renderAnimation(time);
        });
    }
    /**拖拽不允许更新动画 */
    protected addMapEvents(map: L.Map, key: 'on' | 'off') {
        map[key]('dragstart', this.drawEnd, this);
        // map[key]('dragend', this.drawStart, this);
        map[key]('movestart', this.drawEnd, this);
        map[key]('moveend', this.drawStart, this);
    }
    private drawStart() {
        console.log('drawStart')
        this.isDrag = false;
    }
    private drawEnd() {
        console.log('drawEnd')
        this.isDrag = true;
    }
}
