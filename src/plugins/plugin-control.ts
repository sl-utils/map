import * as L from 'leaflet';
import { MapCanvasLayer, SLUMap } from '../map';
import { u_mapGetDistance, u_mapGetMapSize, u_mapGetBounds } from '../utils/slu-map';
import { u_mathGetPoint } from '../utils/slu-math';
import { OptMapPluginControl, OptLatlngScale, MapType, OptLatLng, AMapMapsEvent } from '@sl-utils/map';
import { LeafletMouseEvent } from 'leaflet';
/**地图插件-控制插件 */
export class MapPluginControl extends MapCanvasLayer {
  constructor(sluMap: SLUMap, options?: OptMapPluginControl) {
    super(sluMap.map, options);
    Object.assign(this.options, {
      precision: 4,
      pointerEvents: 'none',
    }, options);
    this.eventSwitch(true);
  }

  public options: OptMapPluginControl = {};
  private cb?: (info: Partial<OptLatlngScale>) => void;
  private info: Partial<OptLatlngScale> = { zoom: 0 };
  private latLng: OptLatLng;

  public init() {
    let latlng = this.latLng = this.map.getCenter();
    this.info.lat = this.getLatlng(latlng.lat, false);
    this.info.lng = this.getLatlng(latlng.lng, true);
    this.setZoomAndScale();
    return this.info;
  }

  public setOptions(opt: Partial<OptMapPluginControl>) {
    Object.assign(this.options, opt);
    this.info.lat = this.getLatlng(this.latLng.lat, false);
    this.info.lng = this.getLatlng(this.latLng.lng, true);
    this.setZoomAndScale();
    return this.info;
  }

  /**位置等更新时触发 
   * @param cb 回调函数
  */
  public onUpdate(cb: (info: OptLatlngScale) => void) {
    this.cb = cb;
    return this;
  }

  private eventSwitch(flag: boolean) {
    let key: 'on' | 'off' = flag ? 'on' : 'off';
    /**开启事件前需关闭事件防止多次添加 */
    if (flag) this.eventSwitch(false);
    this.map[key]('mousemove', (e) => this.setLatlng(e));
    this.map[key]('zoomend', () => this.setZoomAndScale());
  }
  /**设置经纬度信息 */
  private setLatlng = (e: LeafletMouseEvent | AMapMapsEvent) => {
    const latlng = this.getLatLngFromEvent(e);
    if (!latlng) return;
    this.latLng = { lat: latlng[0], lng: latlng[1] };
    this.info.lat = this.getLatlng(latlng[0], false);
    this.info.lng = this.getLatlng(latlng[1], true);
    if (this.cb) this.cb(this.info);
  }
  private getLatlng(value: number, ifLng: boolean): string {
    let unit = "N";
    if (value < 0) unit = "S"
    if (ifLng) {
      unit = "E";
      while (value < 0) { value = value + 360 }
      value = value % 360;
      if (value > 180) {
        unit = 'W'; value = 360 - value
      }
    }
    value = Math.abs(value)
    if (!this.options.ifTran) return u_mathGetPoint(value, this.options.precision ?? 5) + '°' + unit;
    let f = value % 1 * 60
    let m = (f % 1 * 60).toFixed(2)
    let d = Math.floor(value);
    f = Math.floor(f);
    return `${d}°${f}'${m}"${unit}`
  }
  private setZoomAndScale() {
    if (!this.map) return;
    this.info.zoom = this.getZoom();
    const bounds = u_mapGetBounds(this.map);
    let width = u_mapGetMapSize(this.map).w;
    let dissLng = Math.abs(bounds.lngRight - bounds.lngLeft);
    let averLat = (bounds.latTop + bounds.latBottom) / 2;
    let distance = u_mapGetDistance([averLat, 0], [averLat, dissLng], this.map);
    distance = distance / width * 50;
    let text = '';
    if (distance > 2000) {
      distance = distance / 1852
      text = ' nm'
    } else {
      text = ' m'
    }
    let num = distance;
    let power = 1;
    while (num > 10) {
      power = power * 10;
      num = Math.ceil(num / 10)
    }
    num = Math.ceil(num) * power;
    this.info.width = 50 * num / distance + 'px';
    this.info.scale = num + text;
    if (this.cb) this.cb(this.info);
  }

  private getZoom(): number {
    const map = this.map as any;
    return typeof map.getZoom === 'function' ? map.getZoom() : 0;
  }

  private getLatLngFromEvent(e: LeafletMouseEvent | AMapMapsEvent): [number, number] | null {
    if (!e) return null;
    if ((e as LeafletMouseEvent).latlng) {
      const { lat, lng } = (e as LeafletMouseEvent).latlng;
      return [lat, lng];
    }
    if ((e as AMapMapsEvent).lnglat) {
      const { lat, lng } = (e as AMapMapsEvent).lnglat;
      return [lat, lng];
    }
    return null;
  }
}
