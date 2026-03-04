/**清空数组，不改变引用地址
 * @param arr 数组
 */
function clear<T>(arr: T[]): T[] {
    arr.length = 0;
    return arr;
}
/**判读对象是否是数组
 * @param arr 数组
 */
function isArray(arr: any): arr is any[] {
    if (Array.isArray) {
        return Array.isArray(arr)
    } else {
        return Object.prototype.toString.call(arr) === '[object Array]'
    }
}

/**对象是数组且length > 0
 * @param arr 数组
 */
function isNonNull(arr: Array<any> | undefined): arr is any[] {
    return isArray(arr) && arr.length > 0
}
/**在指定index后添加一个数组的数据 ,不改变引用地址
 *@param arr 要操作的数组
 *@param arr 要添加的数组
 *@param index 要添加的位置
 */
function addItemsIndex<T>(arr: T[], adds: T[], index?: number): T[] {
    if (isArray(arr) && isNonNull(adds)) {
        if (index !== undefined) {
            let start = arr.slice(0, index + 1)
            let end = arr.slice(index + 1)
            clear(arr);
            start.forEach(e => arr.push(e));
            adds.forEach(e => arr.push(e));
            end.forEach(e => arr.push(e));
        }
    }
    return arr
}

/**数组操作工具对象 */
export {
    addItemsIndex as u_arrAddItemsIndex,
}