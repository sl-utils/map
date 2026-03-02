"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeafletTilelayersWMTS = LeafletTilelayersWMTS;
function LeafletTilelayersWMTS(L) {
    const LeafletTileLayerWMTS = L.TileLayer.extend({
        defaultWmtsParams: {
            service: 'wmts',
            request: 'gettile',
            version: '1.0.0',
            layer: 'default',
            style: 'default',
            tilematrixset: 'basicsearoad',
        },
        initialize: function (url, options) {
            this._url = url;
            var lOptions = {};
            var cOptions = Object.keys(options);
            cOptions.forEach(element => {
                lOptions[element.toLowerCase()] = options[element];
            });
            var wmtsParams = L.extend({}, this.defaultWmtsParams);
            var tileSize = lOptions.tileSize || this.options.tileSize;
            if (lOptions.detectRetina && L.Browser.retina) {
                wmtsParams.width = wmtsParams.height = tileSize * 2;
            }
            else {
                wmtsParams.width = wmtsParams.height = tileSize;
            }
            for (var i in lOptions) {
                if (wmtsParams.hasOwnProperty(i) && i != "matrixIds") {
                    wmtsParams[i] = lOptions[i];
                }
            }
            this.wmtsParams = wmtsParams;
            this.matrixIds = options.matrixIds || this.getDefaultMatrix();
            L.setOptions(this, options);
        },
        onAdd: function (map) {
            this._crs = this.options.crs || map.options.crs;
            L.TileLayer.prototype.onAdd.call(this, map);
        },
        getTileUrl: function (coords) {
            var tileSize = this.options.tileSize;
            var nwPoint = coords.multiplyBy(tileSize);
            nwPoint.x += 1;
            nwPoint.y -= 1;
            var sePoint = nwPoint.add(new L.Point(tileSize, tileSize));
            var zoom = this._tileZoom;
            var nw = this._crs.project(this._map.unproject(nwPoint, zoom));
            var se = this._crs.project(this._map.unproject(sePoint, zoom));
            var tilewidth = se.x - nw.x;
            var ident = this.matrixIds[zoom].identifier;
            var tilematrix = ident;
            var X0 = this.matrixIds[zoom].topLeftCorner.lng;
            var Y0 = this.matrixIds[zoom].topLeftCorner.lat;
            var tilecol = Math.floor((nw.x - X0) / tilewidth);
            var tilerow = -Math.floor((nw.y - Y0) / tilewidth);
            var url = L.Util.template(this._url, { s: this._getSubdomain(coords) });
            return url + L.Util.getParamString(this.wmtsParams, url) + "&tilematrix=" + tilematrix + "&tilerow=" + tilerow + "&tilecol=" + tilecol;
        },
        setParams: function (params, noRedraw) {
            L.extend(this.wmtsParams, params);
            if (!noRedraw) {
                this.redraw();
            }
            return this;
        },
        getDefaultMatrix: function () {
            var matrixIds3857 = new Array(22);
            for (var i = 0; i < 22; i++) {
                matrixIds3857[i] = {
                    identifier: "" + i,
                    topLeftCorner: new L.LatLng(20037508.3428, -20037508.3428)
                };
            }
            return matrixIds3857;
        }
    });
    return function (url, options) {
        return new LeafletTileLayerWMTS(url, options);
    };
}
//# sourceMappingURL=leaflet-tilelayer-wmts.js.map