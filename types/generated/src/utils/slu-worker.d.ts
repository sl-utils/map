/**线程工具类
 * @param name 子线程的文件名(线程文件必须放到`/assets/worker`)
 * @param cb 子线程结果回调函数
 * @T 子线程接收的数据类型
 * @D 子线程返回的数据类型
*/
export declare class SLUWorker<T = any, D = any> {
    constructor(name: string, cb?: (data: D) => void);
    private worker;
    /**回调函数 @data 子线程返回的数据类型*/
    private cb?;
    /**发送信息给子线程 */
    post(data: T, transfer?: Transferable[]): SLUWorker<T, D>;
    /**线程处理后返回数据处理 */
    then(cb: (data: D) => void): SLUWorker<T, D>;
}
