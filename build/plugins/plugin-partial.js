import { um_getPointsByLnglats, um_drawConvertgps84Togcj02 } from "../utils";
import { MapCanvasLayer } from "../map";
import { SLUCanvas } from "../canvas";
export class MapPluginPartial extends MapCanvasLayer {
    constructor(sluMap, options) {
        super(sluMap.map, options);
        this.isDrag = false;
        this._allParticle = [];
    }
    setAllParticles(particles) {
        um_drawConvertgps84Togcj02(this.map, particles);
        this._allParticle = particles;
        this._redraw();
    }
    renderAnimation(time) {
        this.resetCanvas();
        this._allParticle.forEach((particle) => {
            particle.curPoints = [];
            particle.curve = [];
            let points = (particle.points = um_getPointsByLnglats(this.map, particle.lnglats) || []);
            for (let i = 0, len = points.length - 1; i < len; i++) {
                const e0 = points[i], e1 = points[i + 1];
                let curve = SLUCanvas.getBezierCtrlPoint(e0, e1, particle.degree);
                particle.curve.push(curve);
            }
        });
        this._drawParticles();
        this.flagAnimation && cancelAnimationFrame(this.flagAnimation);
        this.flagAnimation = requestAnimationFrame((time) => {
            if (this.isDrag)
                return;
            this.renderAnimation(time);
        });
    }
    _animat() {
        this.flagAnimation = requestAnimationFrame(() => {
            this._animat();
        });
        this._drawParticles();
    }
    _drawParticles() {
        let particles = this._allParticle, ctx = this.ctx;
        ctx.globalCompositeOperation = "source-over";
        particles.forEach((e) => {
            if (e.showParticle === false) {
                return;
            }
            ctx.strokeStyle = e.colorParticle || "white";
            ctx.fillStyle = e.colorParticle || "white";
            ctx.shadowColor = e.colorParticle || "white";
            ctx.shadowBlur = 5;
            this.genCurBezierPoints(e);
            this.drawParticle(e);
        });
    }
    genCurBezierPoints(particle) {
        let { points = [], index: i = 0, dense = 1 } = particle;
        let j = i + 1;
        if (points.length < 2)
            return;
        if (j >= points.length) {
            (i = 0), (j = 1), (particle.index = 0), (particle.curPoints = undefined), (particle.age = 0);
        }
        let cur = particle.curPoints, p1 = points[i], p2 = points[j], per = p1, nex = p2, ctrl = particle.curve[i];
        if (!cur || cur.length < 2) {
            cur = [per, per];
        }
        let x = nex[0] - per[0], y = nex[1] - per[1];
        let length = Math.sqrt(x * x + y * y);
        let interval = 1 / (dense * length);
        let speed = particle.speed || 0.001;
        speed = speed > 0.1 ? speed / length : speed;
        let size = particle.length || 0.03;
        let len = (size > 0.1 ? size : size * length) * dense, age = (particle.age || 0) + speed, curPoints = [];
        age = age > 1 ? 1 : age;
        for (let i = 0; i < len; i++) {
            let percent = age - interval * i;
            if (percent < 0) {
                break;
            }
            percent = percent > 0 ? percent : 0;
            let point = this.getBezierPointByPercent(percent, per, nex, ctrl);
            curPoints.push(point);
        }
        if (age == 1) {
            particle.index = ++i;
            age = 0;
        }
        particle.age = age;
        particle.curPoints = curPoints;
    }
    getBezierPointByPercent(percent, p1, p2, cp) {
        const [x1, y1] = p1, [cx, cy] = cp, [x2, y2] = p2, t = percent;
        let x = (1 - t) * (1 - t) * x1 + 2 * t * (1 - t) * cx + t * t * x2;
        let y = (1 - t) * (1 - t) * y1 + 2 * t * (1 - t) * cy + t * t * y2;
        return [x, y];
    }
    drawParticle(particle) {
        let ctx = this.ctx;
        let points = particle.curPoints || [];
        for (let i = 0, len = points.length; i < len; i++) {
            let xy = points[i];
            let alpha = (1 - i / len) * (1 / 2);
            ctx.globalAlpha = i == 0 ? 1 : alpha;
            ctx.beginPath();
            ctx.arc(xy[0], xy[1], 1, 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.fill();
        }
    }
    addMapEvents(map, key) {
        const end = () => this.drawEnd();
        const start = () => this.drawStart();
        map[key]("dragstart", end);
        map[key]('dragend', start);
    }
    drawStart() {
        this.isDrag = false;
    }
    drawEnd() {
        this.isDrag = true;
    }
}
//# sourceMappingURL=plugin-partial.js.map