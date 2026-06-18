import GridWorker from '../assets/grid-worker.js?worker';
import GridRenderWorker from '../assets/grid-render-worker.js?worker';
const WorkerMap = {
    grid: () => new GridWorker(),
    gridRender: () => new GridRenderWorker()
};
export class SLUWorker {
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
//# sourceMappingURL=slu-worker.js.map