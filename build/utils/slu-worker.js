export class SLUWorker {
    constructor(name, cb) {
        this.cb = cb;
        let worker = this.worker = new Worker(`/assets/workers/${name}.js`);
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