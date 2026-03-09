import { MapPluginPlot } from '@sl-utils/map';

export class MapServicePlot {
    constructor(private readonly map_: AMAP.Map | L.Map, private readonly options?: SLPMap.Plot) { }
    private plotList: MapPlotInfo[] = [];
    /**标绘图层 */
    private layer?: MapPluginPlot;
    /**将标绘添加到地图 */
    public plotAdd(): MapPluginPlot {
        this.layer =
            this.layer ||
            new MapPluginPlot(this.map!, this.options ?? {
                zIndex: 200,
                widthLine: 2,
                colorFill: 'rgba(37,155,138,0.5)',
                colorLine: '#2c9b8a',
                dash: [5, 5],
                pane: 'plotPane',
            });
        return this.layer;
    }
    /**设置标绘的数据 */
    public plotSetList(plotList: MapPlotInfo[]) {
        this.plotList = plotList;
        if (!this.layer) this.plotAdd();
        this.layer!.setPlotList(plotList);
        return this;
    }
    /**设置正在编辑的标绘 */
    public plotSetEdit(plot: MapPlotInfo) {
        if (!this.layer) return undefined;
        this.layer.setEditPlot(plot);
        return this;
    }

    public plotSave() {
        if (!this.layer) return undefined;
        this.layer.savePlot();
        return this;
    }
    /**打开标绘(返回正在标绘的对象) */
    public plotOpenEdit(type: MapPlotType): MapPlotInfo {
        if (!this.layer) this.plotAdd();
        return this.layer!.open(type);
    }
    /**标绘数据改变需要重绘 */
    public plotRedraw() {
        if (!this.layer) return;
        this.layer.redraw();
    }
    /**地图实例 */
    private get map() {
        return this.map_;
    }
    /**移除图层 */
    public remove() {
        this.layer?.onRemove();
        this.layer = undefined;
    }
}