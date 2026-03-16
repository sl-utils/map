import { l as s } from "../_virtual/leaflet-src.js";
import "../_virtual/proj4leaflet.js";
import { u_mapTogps84gcj02 as c, u_mapTogps84bd09 as u } from "../utils/slu-map.js";
(function(a, o) {
  s.GridLayer.include({
    _setZoomTransform: function(e, i, t) {
      var r = i;
      r != null && this.options && (this.options.corrdType == "gcj02" ? r = c(i.lng, i.lat) : this.options.corrdType == "bd09" && (r = u(i.lng, i.lat)));
      var l = this._map.getZoomScale(t, e.zoom), n = e.origin.multiplyBy(l).subtract(this._map._getNewPixelOrigin(r, t)).round();
      s.Browser.any3d ? s.DomUtil.setTransform(e.el, n, l) : s.DomUtil.setPosition(e.el, n);
    },
    _getTiledPixelBounds: function(e) {
      var i = e;
      i != null && this.options && (this.options.corrdType == "gcj02" ? i = c(e.lng, e.lat) : this.options.corrdType == "bd09" && (i = u(e.lng, e.lat)));
      var t = this._map, r = t._animatingZoom ? Math.max(t._animateToZoom, t.getZoom()) : t.getZoom(), l = t.getZoomScale(r, this._tileZoom), n = t.project(i, this._tileZoom).floor(), p = t.getSize().divideBy(l * 2);
      return new s.Bounds(n.subtract(p), n.add(p));
    }
  });
})();
var y = /* @__PURE__ */ ((a) => (a.tianDiTuNormalMap = "TianDiTu.Normal.Map", a.tianDiTuNormalAnnotion = "TianDiTu.Normal.Annotion", a.tianDiTuSatelliteMap = "TianDiTu.Satellite.Map", a.tianDiTuSatelliteAnnotion = "TianDiTu.Satellite.Annotion", a.tianDiTuTerrainMap = "TianDiTu.Terrain.Map", a.tianDiTuTerrainAnnotion = "TianDiTu.Terrain.Annotion", a.gaoDeNormalMap = "GaoDe.Normal.Map", a.gaoDeSatelliteMap = "GaoDe.Satellite.Map", a.gaoDeSatelliteAnnotion = "GaoDe.Satellite.Annotion", a.baiDuNormalMap = "Baidu.Normal.Map", a.baiDuSatelliteMap = "Baidu.Satellite.Map", a.baiDuSatelliteAnnotion = "Baidu.Satellite.Annotion", a.googleNormalMap = "Google.Normal.Map", a.googleSatelliteMap = "Google.Satellite.Map", a.googleSatelliteAnnotion = "Google.Satellite.Annotion", a.geoqNormalMap = "Geoq.Normal.Map", a.geoqNormalPurplishBlue = "Geoq.Normal.PurplishBlue", a.geoqNormalGray = "Geoq.Normal.Gray", a.geoqNormalWarm = "Geoq.Normal.Warm", a.geoqThemeHydro = "Geoq.Theme.Hydro", a.oSMNormalMap = "OSM.Normal.Map", a))(y || {});
class h {
  constructor(o, e) {
    this.setMapProvider(o, e);
  }
  /**将图层添加到map显示在页面 */
  addTo(o) {
    return o ? (this.map = o, this.mapLayer?.addTo(this.map), this) : this;
  }
  /**从map中移除当前图层 */
  remove() {
    return this.mapLayer?.remove(), this;
  }
  /**变更当前图层并添加到map中 */
  changeMap(o, e) {
    return this.remove(), this.setMapProvider(o, e), this.addTo(this.map), this;
  }
  /**设置map的地图来源，名称，类型 */
  setMapProvider(o, e) {
    e = e || {};
    let i = o.split("."), t = i[0], r = i[1], l = i[2], n = m[t][r][l];
    e.subdomains = m[t].Subdomains, e.key = e.key || m[t].key, e.corrdType = this.getCorrdType(t), "tms" in m[t] && (e.tms = m[t].tms), this.mapLayer = new s.TileLayer(n, e);
  }
  /**获取坐标转换类型*/
  getCorrdType(o) {
    var e = "wgs84";
    switch (o) {
      case "Geoq":
      case "GaoDe":
      case "Google":
        e = "gcj02";
        break;
      case "Baidu":
        e = "bd09";
        break;
      case "OSM":
      case "TianDiTu":
        e = "wgs84";
        break;
    }
    return e;
  }
}
const m = {
  TianDiTu: {
    Normal: {
      Map: "//t{s}.tianditu.com/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk={key}",
      Annotion: "//t{s}.tianditu.com/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk={key}",
      AnnotionEn: "//t{s}.tianditu.com/DataServer?T=eva_w&X={x}&Y={y}&L={z}&tk={key}"
    },
    Satellite: {
      Map: "//t{s}.tianditu.com/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk={key}",
      Annotion: "//t{s}.tianditu.com/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk={key}"
    },
    Terrain: {
      Map: "//t{s}.tianditu.com/DataServer?T=ter_w&X={x}&Y={y}&L={z}&tk={key}",
      Annotion: "//t{s}.tianditu.com/DataServer?T=cta_w&X={x}&Y={y}&L={z}&tk={key}"
    },
    // Subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    Subdomains: ["1"],
    key: "a9e2dd65c94fab979c9d897ff7098a4c"
  },
  GaoDe: {
    Normal: {
      Map: "//webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
    },
    Satellite: {
      Map: "//webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
      Annotion: "//webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}"
    },
    Subdomains: ["1", "2", "3", "4"]
  },
  Google: {
    Normal: {
      Map: "//www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
    },
    Satellite: {
      Map: "//www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}",
      Annotion: "//www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}"
    },
    Subdomains: []
  },
  Geoq: {
    Normal: {
      Map: "//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}",
      PurplishBlue: "//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
      Gray: "//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}",
      Warm: "//map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}"
    },
    Theme: {
      Hydro: "//thematic.geoq.cn/arcgis/rest/services/ThematicMaps/WorldHydroMap/MapServer/tile/{z}/{y}/{x}"
    },
    Subdomains: []
  },
  OSM: {
    Normal: {
      Map: "//{s}.tile.osm.org/{z}/{x}/{y}.png"
    },
    Subdomains: ["a", "b", "c"]
  },
  Baidu: {
    Normal: {
      Map: "//online{s}.map.bdimg.com/onlinelabel/qt=tile&x={x}&y={y}&z={z}"
    },
    Satellite: {
      Map: "//online{s}.map.bdimg.com/starpic/?qt=satepc&u=x={x}&y={y}&z={z};v=009;type=sate&fm=46&app=webearth2&v=009&udt=20231212",
      Annotion: "//online{s}.map.bdimg.com/starpic/?qt=satepc&u=x={x}&y={y}&z={z};v=009;type=sate&fm=46&app=webearth2&v=009&udt=20231212"
    },
    Subdomains: "0123456789",
    tms: !0
  }
};
export {
  y as SLEMap,
  h as SLULeafletNetMap
};
