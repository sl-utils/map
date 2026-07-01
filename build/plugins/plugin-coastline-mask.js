import bboxClip from '@turf/bbox-clip';
import { u_mapGetPointByLnglat } from '../utils/slu-map';
const clipGeometryTypes = ['LineString', 'MultiLineString', 'Polygon', 'MultiPolygon'];
export class PluginCoastlineMask {
    constructor(sources, map) {
        this.sources = [];
        this.cacheCanvas = null;
        this.cacheKey = '';
        this.worldOffsets = [-720, -360, 0, 360, 720];
        this.sources = sources;
        this.map = map;
    }
    getMask(bbox, zoom, width, height) {
        const key = this.buildCacheKey(bbox, zoom, width, height);
        if (this.cacheKey === key && this.cacheCanvas) {
            return this.cacheCanvas;
        }
        const source = this.pickSource(zoom);
        const normalizedBBox = this.normalizeBBox(bbox);
        const clipped = this.clipGeoJSON(source.data, normalizedBBox);
        const canvas = this.buildMaskCanvas(width, height, clipped);
        this.cacheCanvas = canvas;
        this.cacheKey = key;
        return canvas;
    }
    pickSource(zoom) {
        const len = this.sources.length;
        for (let i = 0; i < len; i++) {
            const source = this.sources[i];
            if (zoom >= source.minZoom && zoom <= source.maxZoom) {
                return source;
            }
        }
        return this.sources[len - 1];
    }
    normalizeLng(lng) {
        while (lng > 180) {
            lng -= 360;
        }
        while (lng < -180) {
            lng += 360;
        }
        return lng;
    }
    normalizeBBox(bbox) {
        let [west, south, east, north] = bbox;
        west = this.normalizeLng(west);
        east = this.normalizeLng(east);
        return [west, south, east, north];
    }
    clipGeoJSON(geojson, bbox) {
        const [west, south, east, north] = bbox;
        const result = [];
        const bboxes = west > east ? [[west, south, 180, north], [-180, south, east, north]] : [bbox];
        const features = geojson.features;
        for (let i = 0, len = features.length; i < len; i++) {
            const feature = features[i];
            if (!feature.geometry)
                continue;
            if (!clipGeometryTypes.includes(feature.geometry.type))
                continue;
            for (let j = 0, len2 = bboxes.length; j < len2; j++) {
                try {
                    const clipped = bboxClip(feature, bboxes[j]);
                    if (clipped && clipped.geometry) {
                        result.push(clipped);
                    }
                }
                catch (e) { }
            }
        }
        return { type: 'FeatureCollection', features: result };
    }
    buildMaskCanvas(width, height, geojson) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000';
        ctx.imageSmoothingEnabled = false;
        ctx.beginPath();
        const features = geojson.features;
        for (let i = 0, len = features.length; i < len; i++) {
            const geom = features[i].geometry;
            if (!geom)
                continue;
            if (geom.type === 'Polygon') {
                this.drawPolygon(ctx, geom.coordinates);
            }
            else if (geom.type === 'MultiPolygon') {
                const polys = geom.coordinates;
                for (let j = 0, len2 = polys.length; j < len2; j++) {
                    this.drawPolygon(ctx, polys[j]);
                }
            }
        }
        ctx.fill('evenodd');
        return canvas;
    }
    drawPolygon(ctx, coordinates) {
        const offsets = this.worldOffsets;
        for (let r = 0, len = coordinates.length; r < len; r++) {
            const ring = coordinates[r];
            for (let o = 0, len2 = offsets.length; o < len2; o++) {
                const offset = offsets[o];
                let first = true;
                let prevLng = 0;
                for (let i = 0, len3 = ring.length; i < len3; i++) {
                    const point = ring[i];
                    const lng = point[0] + offset;
                    const lat = point[1];
                    if (i > 0 && Math.abs(lng - prevLng) > 180) {
                        first = true;
                    }
                    prevLng = lng;
                    const [x, y] = u_mapGetPointByLnglat(this.map, [lng, lat]);
                    if (first) {
                        ctx.moveTo(x, y);
                        first = false;
                    }
                    else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.closePath();
            }
        }
    }
    buildCacheKey(bbox, zoom, width, height) {
        const precision = 2;
        const bboxStr = bbox.map(v => v.toFixed(precision)).join(',');
        return (`${bboxStr}` + `|z${Math.floor(zoom)}` + `|${width}x${height}`);
    }
    clearCache() {
        this.cacheCanvas = null;
        this.cacheKey = '';
    }
}
//# sourceMappingURL=plugin-coastline-mask.js.map