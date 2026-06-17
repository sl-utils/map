"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLUWorker = void 0;
const grid_worker_js_worker_1 = __importDefault(require("../assets/grid-worker.js?worker"));
const grid_render_worker_js_worker_1 = __importDefault(require("../assets/grid-render-worker.js?worker"));
const WorkerMap = {
    grid: () => new grid_worker_js_worker_1.default(),
    gridRender: () => new grid_render_worker_js_worker_1.default()
};
class SLUWorker {
    constructor(name, cb) {
        this.cb = cb;
        const factory = WorkerMap[name];
        if (!factory) {
            throw new Error(`Worker ${name} not found`);
        }
        ;
        const worker = this.worker = factory();
        worker.onmessage = (ev) => {
            console.log(ev);
            this.cb?.(ev.data);
        };
        worker.onerror = (e) => {
            console.error(['ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message].join(''));
        };
    }
    post(data, transfer) {
        if (transfer) {
            this.worker.postMessage(data, transfer);
        }
        else {
            this.worker.postMessage(data);
        }
        return this;
    }
    then(cb) {
        this.cb = cb;
        return this;
    }
}
exports.SLUWorker = SLUWorker;
//# sourceMappingURL=slu-worker.js.map