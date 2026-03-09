import workerSource from '../assets/worker/grid-worker1.js?raw';
/**线程工具类 
 * @param name 子线程的文件名(线程文件必须放到`/assets/worker`)
 * @param cb 子线程结果回调函数
 * @T 子线程接收的数据类型
 * @D 子线程返回的数据类型
*/
export class SLUWorker<T = any, D = any> {
    constructor(name: string, cb?: (data: D) => void) {
        this.cb = cb;
        // let worker = this.worker = new Worker(`../../assets/worker/${name}.js`);
        const blob = new Blob([workerSource], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const worker = this.worker = new Worker(url, { type: 'classic' });
        worker.onmessage = (ev: MessageEvent) => {
            console.log(ev);
            this.cb?.(ev.data);
        }
        worker.onerror = (e: ErrorEvent) => {
            console.error(['ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message].join(''));
        };
    }
    private worker: Worker;
    /**回调函数 @data 子线程返回的数据类型*/
    private cb?: (data: D) => void
    /**发送信息给子线程 */
    public post(data: T): SLUWorker<T, D> {
        this.worker.postMessage(data);
        return this;
    }
    /**线程处理后返回数据处理 */
    public then(cb: (data: D) => void): SLUWorker<T, D> {
        this.cb = cb;
        return this;
    }
}