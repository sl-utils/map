import { MapPluginTrack } from "@sl-utils/map";
import { SLUMap } from "src/map";

/**地图轨迹服务类 */
export class MapServiceTrack {
  constructor(private readonly sluMap_: SLUMap) { }
  /**是否绘制名称 */
  private _ifName: boolean = false;
  public get ifName(): boolean {
    return this._ifName;
  }
  public set ifName(value: boolean) {
    this._ifName = value;
  }
  /**是否绘制编号 */
  public ifMmsi: boolean = false;
  /**是否绘制速度 */
  public ifSpeed: boolean = false;
  /**是否绘制轨迹 */
  public ifTrack: boolean = true;
  /**下一段路径回调 */
  private cbNext!: Function;
  /** */
  private ifFitView: boolean = false;
  /**设置轨迹数据 */
  public setTracks(infos: MapTrackGroup[]): MapPluginTrack {
    let layer = (this.layer = this.layer || new MapPluginTrack(this.map!, { zIndex: 299, ifArc: true }));
    layer.on("next", this.cbNext);
    layer.setTracks(infos);
    if (this.ifFitView) return layer;
    let latlngs: [number, number][] = [];
    infos.forEach((info) => {
      const POSITIONS = info.data,
        first = POSITIONS[0];
      latlngs.push([first.lat, first.lng]);
    });
    /**获取latlngs中最大最小经纬度值 */
    let maxLat = Math.max(...latlngs.map((e) => e[0])),
      minLat = Math.min(...latlngs.map((e) => e[0])),
      maxLng = Math.max(...latlngs.map((e) => e[1])),
      minLng = Math.min(...latlngs.map((e) => e[1]));
    this.sluMap_.setFitView([
      [minLat, minLng],
      [maxLat, maxLng],
    ]);
    this.ifFitView = true;
    return layer;
  }
  /**获取下一段数据 */
  public onNext(cb: Function) {
    this.cbNext = cb;
  }
  /**设置轨迹的显影 */
  public setTrackVisible(visible: boolean) {
    this.ifTrack = visible;
    this.layer?.setOpt({ ifLine: visible });
  }
  /**设置指定时间的轨迹点并绘制 */
  public setPointByTime(time: Date) {
    let layer: MapPluginTrack = (this.layer = this.layer || new MapPluginTrack(this.map!, { zIndex: 299, ifArc: false }));
    let res = layer.getInfosByTime<MapTrackShipInfo>(time);
    let imgs: MapImage[] = res.map((e) => {
      let { time, rotate, orginData } = e;
      const { TYPE_COLOR = "8" } = orginData;
      // let { posX, posY } = appCodeImgPos(TYPE_COLOR);
      return {
        info: "A" + TYPE_COLOR,
        // url: "/assets/icons/sprite_medium.png",
        url: "",
        latlng: [e.lat, e.lng],
        size: [16, 16],
        sizeo: [24, 24],
        posX: 24,
        posY: 0,
        rotate,
      };
    });
    const { ifMmsi, ifName, ifSpeed } = this;
    let texts: MapText[] = res.map((e) => {
      const { orginData, SPEED } = e;
      const { MMSI, SHIPNAME } = orginData;
      let text: string = "";
      if (ifName) text += SHIPNAME;
      if (ifSpeed) text += (ifName ? "," : "") + SPEED?.toString() + "KN\n";
      if (ifMmsi) text += (ifName ? "\n" : "") + MMSI + "\n";
      return {
        text: text,
        font: "12px Droid Sans",
        textAlign: "center",
        latlng: [e.lat, e.lng],
        colorFill: "#ffffff",
        ifShadow: false,
        colorLine: "#333",
        widthLine: 1,
        px: 0,
        py: 5,
        lineHeight: 20,
        maxWidth: 100,
        overlap: {
          type: "py",
          maxDistance: 50,
          minSpacing: 8,
          querySpace: 3,
          line: {
            widthLine: 1,
            colorLine: "#a00",
          },
        },
        panel: {
          pb: 2,
          pt: 2,
          pl: 2,
          pr: 2,
          colorFill: "#2C9B8A",
          fillAlpha: 0.3,
        },
      } as MapText;
    });
    layer.setAniImage(imgs, texts);
    return this;
  }
  /**每个服务类都有的 */
  /**标绘图层 */
  private layer?: MapPluginTrack;
  /**地图实例 */
  private get map() {
    return this.sluMap_.map;
  }
  /**移除图层 */
  public remove() {
    this.layer?.onRemove();
    this.layer = undefined;
  }
}
