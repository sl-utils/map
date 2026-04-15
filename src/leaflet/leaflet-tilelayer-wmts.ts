export function LeafletTilelayersWMTS(L: any) {
    const LeafletTileLayerWMTS = L.TileLayer.extend({
        defaultWmtsParams: {
            service: 'wmts',
            request: 'gettile',
            version: '1.0.0',
            layer: 'default',
            style: 'default',
            tilematrixset: 'basicsearoad',
            // format: 'image/png'
            // service: "WMTS",
            // request: "GetTile",
            // version: "1.0.0",
            // layer: "",
            // style: "default",
            // tileMatrixSet: "",
            // format: "image/jpeg",
        },

        /**初始化WMTS图层
         * @param url WMTS服务URL
         * @param options WMTS图层选项
         */
        initialize: function (url: string, options: any): void { // (String, Object)
            this._url = url;
            const lOptions: any = Object.assign({});
            const cOptions = Object.keys(options);
            cOptions.forEach(element => {
                lOptions[element.toLowerCase()] = options[element];
            });
            const wmtsParams = L.extend({}, this.defaultWmtsParams);
            const tileSize = lOptions.tileSize || this.options.tileSize;
            if (lOptions.detectRetina && L.Browser.retina) {
                wmtsParams.width = wmtsParams.height = tileSize * 2;
            } else {
                wmtsParams.width = wmtsParams.height = tileSize;
            }
            for (const i in lOptions) {
                // all keys that are in defaultWmtsParams options go to WMTS params
                if (wmtsParams.hasOwnProperty(i) && i != "matrixIds") {
                    wmtsParams[i] = lOptions[i];
                }
            }
            this.wmtsParams = wmtsParams;
            this.matrixIds = options.matrixIds || this.getDefaultMatrix();
            L.setOptions(this, options);
        },

        /**添加到地图
         * @param map 地图实例
         */
        onAdd: function (map: L.Map): void {
            this._crs = this.options.crs || map.options.crs;
            L.TileLayer.prototype.onAdd.call(this, map);
        },

        /**获取WMTS图层的URL
         * @param coords 矩阵坐标
         * @param zoom 缩放级别
         * @returns WMTS图层的URL
         */
        getTileUrl: function (coords: any, zoom: any): string { // (Point, Number) -> String
            const tileSize = this.options.tileSize;
            const nwPoint = coords.multiplyBy(tileSize);
            nwPoint.x += 1;
            nwPoint.y -= 1;
            const sePoint = nwPoint.add(new L.Point(tileSize, tileSize));
            var zoom = this._tileZoom;
            const nw = this._crs.project(this._map.unproject(nwPoint, zoom));
            const se = this._crs.project(this._map.unproject(sePoint, zoom));
            const tilewidth = se.x - nw.x;
            const ident = this.matrixIds[zoom].identifier;
            // const tilematrix =  this.wmtsParams.tilematrixset + ":" + ident;
            const tilematrix = ident;
            const X0 = this.matrixIds[zoom].topLeftCorner.lng;
            const Y0 = this.matrixIds[zoom].topLeftCorner.lat;
            const tilecol = Math.floor((nw.x - X0) / tilewidth);
            const tilerow = -Math.floor((nw.y - Y0) / tilewidth);
            const url = L.Util.template(this._url, { s: this._getSubdomain(coords) });
            return url + L.Util.getParamString(this.wmtsParams, url) + "&tilematrix=" + tilematrix + "&tilerow=" + tilerow + "&tilecol=" + tilecol;
        },

        /**设置WMTS图层的参数
         * @param params WMTS图层的参数
         * @param noRedraw 是否不重新绘制图层
         * @returns WMTS图层实例
         */
        setParams: function (params: any, noRedraw: boolean): void {
            L.extend(this.wmtsParams, params);
            if (!noRedraw) {
                this.redraw();
            }
            return this;
        },

        /**获取默认的WMTS图层的矩阵ID
         * @returns 默认的WMTS图层的矩阵ID
         */
        getDefaultMatrix: function () {
            /**
             * the matrix3857 represents the projection 
             * for in the IGN WMTS for the google coordinates.
             */
            const matrixIds3857 = new Array(22);
            for (let i = 0; i < 22; i++) {
                matrixIds3857[i] = {
                    identifier: "" + i,
                    topLeftCorner: new L.LatLng(20037508.3428, -20037508.3428)
                };
            }
            return matrixIds3857;
        }
    });

    return function (url: string, options: any) {
        return new LeafletTileLayerWMTS(url, options);
    };
}