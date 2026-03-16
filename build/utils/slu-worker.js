import c from "../assets/grid-worker.js";
class l {
  constructor(r, t) {
    this.cb = t;
    const s = new Blob([c], { type: "text/javascript" }), n = URL.createObjectURL(s), o = this.worker = new Worker(n, { type: "classic" });
    o.onmessage = (e) => {
      console.log(e), this.cb?.(e.data);
    }, o.onerror = (e) => {
      console.error(["ERROR: Line ", e.lineno, " in ", e.filename, ": ", e.message].join(""));
    };
  }
  /**发送信息给子线程 */
  post(r) {
    return this.worker.postMessage(r), this;
  }
  /**线程处理后返回数据处理 */
  then(r) {
    return this.cb = r, this;
  }
}
export {
  l as SLUWorker
};
