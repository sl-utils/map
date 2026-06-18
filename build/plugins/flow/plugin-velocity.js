import { u_mapGetLatLngByPoint, u_mapGetPointByLatlng } from "../../utils/slu-map";
export class PluginVelocity {
    constructor(options) {
        this.options = {
            minVelocity: 0,
            maxVelocity: 1,
            velocityScale: 1,
            particleAge: 90,
            lineWidth: 1,
            particleMultiplier: 1 / 300,
            frameRate: 30,
            defualtColorScale: ["rgb(36,104, 180)", "rgb(60,157, 194)", "rgb(128,205,193 )", "rgb(151,218,168 )", "rgb(198,231,181)", "rgb(238,247,217)", "rgb(255,238,159)", "rgb(252,217,125)", "rgb(255,182,100)", "rgb(252,150,75)", "rgb(250,112,52)", "rgb(245,64,32)", "rgb(237,45,28)", "rgb(220,24,32)", "rgb(180,0,35)"],
            data: [],
        };
        this.PARTICLE_REDUCTION = Math.pow(window.devicePixelRatio, 1 / 3) || 1.6;
        this.OPACITY = 0.97;
        this.NULL_WIND_VECTOR = [NaN, NaN, null];
        this.grid = [];
        this.allThreatIds = [];
        this.canvas = options.canvas;
        this.setOptions(options);
    }
    setOptions(options) {
        options = Object.assign(this.options, options);
        this.map = options.map;
        this.MIN_VELOCITY_INTENSITY = options.minVelocity;
        this.MAX_VELOCITY_INTENSITY = options.maxVelocity;
        this.VELOCITY_SCALE = options.velocityScale * (Math.pow(window.devicePixelRatio, 1 / 3) || 1);
        this.MAX_PARTICLE_AGE = options.particleAge;
        this.PARTICLE_LINE_WIDTH = options.lineWidth;
        this.PARTICLE_MULTIPLIER = options.particleMultiplier;
        this.FRAME_RATE = options.frameRate;
        this.FRAME_TIME = 1000 / this.FRAME_RATE;
        this.OPACITY = 0.98;
        this.colorScale = options.colorScale || options.defualtColorScale;
        this.NULL_WIND_VECTOR = [NaN, NaN, null];
        this.gridData = options.data;
        if (options.hasOwnProperty("opacity"))
            this.OPACITY = +options.opacity;
    }
    setData(data) {
        this.gridData = data;
    }
    stop() {
        if (this.field)
            this.field.release();
        if (this.animationLoop)
            cancelAnimationFrame(this.animationLoop);
    }
    start(width, height, extent) {
        this.stop();
        const mapBounds = {
            south: this.deg2rad(extent[0][1]),
            north: this.deg2rad(extent[1][1]),
            east: this.deg2rad(extent[1][0]),
            west: this.deg2rad(extent[0][0]),
            width: width,
            height: height,
        };
        let buildBounds = {
            x: 0,
            y: 0,
            xMax: width,
            yMax: height - 1,
            width: width,
            height: height,
        };
        this.buildGrid(this.gridData);
        this.interpolateField(buildBounds, mapBounds);
    }
    buildGrid(data) {
        if (data.length < 2)
            console.log("Windy Error: data must have at least two components (u,v)");
        let builder = this.createBuilder(data);
        const header = builder.header;
        const lng0 = (this.lng0 = header.lo1);
        const lat0 = (this.lat0 = header.la1);
        const Δlng = (this.Δlng = header.dx);
        const Δlat = (this.Δlat = header.dy);
        const nx = header.nx;
        const ny = header.ny;
        const date = new Date(header.refTime);
        date.setHours(date.getHours() + header.forecastTime);
        let grid = (this.grid = []);
        let p = 0;
        const isContinuous = Math.floor(nx * Δlng) >= 360;
        for (let j = 0; j < ny; j++) {
            const row = [];
            for (let i = 0; i < nx; i++, p++) {
                row[i] = builder.data(p);
            }
            if (isContinuous)
                row.push(row[0]);
            grid[j] = row;
        }
    }
    createBuilder(data) {
        let uComp = data[0], vComp = data[1], zComp = data[2];
        let uData = uComp.data, vData = vComp.data;
        return {
            header: uComp?.header,
            data: function (i) {
                return [uData[i], vData[i]];
            },
        };
    }
    interpolateField(bounds, extent) {
        const mapArea = (extent.south - extent.north) * (extent.west - extent.east);
        const velocityScale = this.VELOCITY_SCALE * Math.pow(mapArea, 0.4) * 0.01;
        const columns = [];
        this.allThreatIds.forEach(id => {
            cancelIdleCallback(id);
        });
        this.allThreatIds.length = 0;
        for (let x = bounds.x, len = bounds.width; x < len; x += 2) {
            let column = [];
            const id = requestIdleCallback(() => {
                for (let y = bounds.y, len = bounds.yMax; y <= len; y += 2) {
                    let [lat, lng] = u_mapGetLatLngByPoint(this.map, [x, y]);
                    if (isFinite(lng)) {
                        let wind = this.interpolate(lng, lat);
                        if (wind) {
                            wind = this.distort(lng, lat, x, y, velocityScale, wind);
                            column[y + 1] = column[y] = wind;
                        }
                    }
                }
                columns[x + 1] = columns[x] = column;
            });
            this.allThreatIds.push(id);
        }
        let field = this.field = new PluginVelocityField(columns, bounds, this.NULL_WIND_VECTOR);
        this.animate(bounds, field);
    }
    interpolate(lng, lat) {
        if (!this.grid)
            return null;
        let grid = this.grid, lng0 = this.lng0, Δlng = this.Δlng, Δlat = this.Δlat, lat0 = this.lat0;
        let i = this.floorMod(lng - lng0, 360) / Δlng;
        let j = (lat0 - lat) / Δlat;
        let fx = Math.floor(i), nx = fx + 1, fy = Math.floor(j), ny = fy + 1;
        let row;
        if ((row = grid[fy])) {
            const g00 = row[fx], g10 = row[nx];
            if (this.isValue(g00) && this.isValue(g10) && (row = grid[ny])) {
                const g01 = row[fx], g11 = row[nx];
                if (this.isValue(g01) && this.isValue(g11)) {
                    return this.bilinearInterpolateVector(i - fx, j - fy, g00, g10, g01, g11);
                }
            }
        }
        return null;
    }
    bilinearInterpolateVector(x, y, g00, g10, g01, g11) {
        let rx = 1 - x, ry = 1 - y;
        let a = rx * ry, b = x * ry, c = rx * y, d = x * y;
        let u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;
        let v = g00[1] * a + g10[1] * b + g01[1] * c + g11[1] * d;
        return [u, v, Math.sqrt(u * u + v * v)];
    }
    distort(lng, lat, x, y, scale, wind) {
        let u = wind[0] * scale;
        let v = wind[1] * scale;
        let d = this.distortion(lng, lat, x, y);
        wind[0] = d[0] * u + d[2] * v;
        wind[1] = d[1] * u + d[3] * v;
        return wind;
    }
    distortion(lng, lat, x, y) {
        let H = 5;
        let hλ = lng < 0 ? H : -H;
        let hφ = lat < 0 ? H : -H;
        let pλ = this.project(lat, lng + hλ);
        let pφ = this.project(lat + hφ, lng);
        const k = Math.cos((lat / 360) * 2 * Math.PI);
        return [
            (pλ[0] - x) / hλ / k,
            0,
            0,
            (pφ[1] - y) / hφ,
        ];
    }
    project(lat, lon) {
        let [x, y] = u_mapGetPointByLatlng(this.map, [lat, lon]);
        return [x, y];
    }
    animate(bounds, field) {
        const colorStyles = this.colorScale;
        const buckets = colorStyles.map(function () {
            return [];
        });
        let count = Math.round(bounds.width * bounds.height * this.PARTICLE_MULTIPLIER);
        if (this.isMobile())
            count *= this.PARTICLE_REDUCTION;
        const fadeFillStyle = `rgba(0, 0, 0, ${this.OPACITY})`;
        let particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(field.randomize({ age: Math.floor(Math.random() * this.MAX_PARTICLE_AGE) + 0, x: 0, y: 0, }));
        }
        let evolve = () => {
            buckets.forEach((bucket) => { bucket.length = 0; });
            particles.forEach((particle) => {
                if (particle.age > this.MAX_PARTICLE_AGE)
                    field.randomize(particle).age = 0;
                let x = particle.x, y = particle.y;
                let v = field.run(x, y), m = v[2];
                if (m === null) {
                    particle.age = this.MAX_PARTICLE_AGE;
                }
                else {
                    let xt = x + v[0], yt = y + v[1];
                    if (field.run(xt, yt)[2] !== null) {
                        particle.xt = xt;
                        particle.yt = yt;
                        let index = this.windColorIndexBySpeed(m);
                        buckets[index].push(particle);
                    }
                    else {
                        particle.x = xt;
                        particle.y = yt;
                    }
                }
                particle.age += 1;
            });
        };
        const g = this.canvas.getContext("2d");
        g.lineWidth = this.PARTICLE_LINE_WIDTH;
        g.globalAlpha = 0.6;
        let draw = () => {
            g.globalCompositeOperation = "destination-over";
            g.fillStyle = "rgba(0, 0, 0, 0.15)";
            g.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
            g.globalCompositeOperation = "destination-in";
            g.fillStyle = fadeFillStyle;
            g.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
            g.globalCompositeOperation = "lighter";
            g.globalAlpha = this.OPACITY === 0 ? 0 : this.OPACITY * 0.9;
            buckets.forEach((bucket, i) => {
                if (bucket.length > 0) {
                    g.beginPath();
                    g.strokeStyle = colorStyles[i];
                    bucket.forEach((particle) => {
                        g.moveTo(particle.x, particle.y);
                        g.lineTo(particle.xt, particle.yt);
                        particle.x = particle.xt;
                        particle.y = particle.yt;
                    });
                    g.stroke();
                }
            });
        };
        let then = Date.now();
        let frame = () => {
            this.animationLoop = requestAnimationFrame(frame);
            const now = Date.now();
            const delta = now - then;
            if (delta > this.FRAME_TIME) {
                then = now - (delta % this.FRAME_TIME);
                evolve();
                draw();
            }
        };
        frame();
    }
    windColorIndexBySpeed(m) {
        let length = this.colorScale.length, min = this.MIN_VELOCITY_INTENSITY, max = this.MAX_VELOCITY_INTENSITY;
        let index = Math.max(0, Math.min(length - 1, Math.round(((m - min) / (max - min)) * (length - 1))));
        return index;
    }
    deg2rad(deg) {
        return (deg / 180) * Math.PI;
    }
    floorMod(a, n) {
        return a - n * Math.floor(a / n);
    }
    isValue(x) {
        return x !== null && x !== undefined;
    }
    isMobile() {
        return /android|blackberry|iemobile|ipad|iphone|ipod|opera mini|webos/i.test(navigator.userAgent);
    }
}
class PluginVelocityField {
    constructor(columns, bounds, NULL_WIND_VECTOR) {
        this.NULL_WIND_VECTOR = [NaN, NaN, null];
        this.columns = columns;
        this.bounds = bounds;
        this.NULL_WIND_VECTOR = NULL_WIND_VECTOR || [NaN, NaN, null];
    }
    release() {
        this.columns.length = 0;
    }
    randomize(o) {
        let x, y, safetyNet = 0;
        do {
            x = Math.round(Math.floor(Math.random() * this.bounds.width) + this.bounds.x);
            y = Math.round(Math.floor(Math.random() * this.bounds.height) + this.bounds.y);
        } while (this.run(x, y)[2] === null && safetyNet++ < 30);
        o.x = x;
        o.y = y;
        return o;
    }
    run(x, y) {
        const column = this.columns[Math.round(x)];
        return (column && column[Math.round(y)]) ?? this.NULL_WIND_VECTOR;
    }
}
//# sourceMappingURL=plugin-velocity.js.map