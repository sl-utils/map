import { um_tsIfPlainObject } from "./slu-type-guard";

/**移除数组指定item，会改变原数组，不改变引用地址
 * @param arr 要操作的数组
 * @param item 要移除的对象或某个对象key属性的值
 * @param key 用于比较的key属性
*/
function delItem<T>(arr: T[] | undefined, item: T, key?: keyof T): T[] {
    if (Array.isArray(arr) && arr.length > 0) {
        let index;
        if (key) {
            index = arr.findIndex(e => e == item || e[key] == item[key])
        } else {
            index = arr.findIndex(e => e == item);
        }
        index >= 0 && arr.splice(index, 1);
    }
    return arr || [];
}

/**
 * 用于深度合并同类型的配置：入参类型一致,不改变原对象,返回合并后的新对象
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的新对象
 */
function deepMergeOpt<T>(target: T, source: T): T {
    const result = { ...target };
    for (const key in source) {
        const sourceValue = source[key];
        if (sourceValue === undefined) {
            continue;
        }
        const targetValue = result[key];
        if (um_tsIfPlainObject(targetValue) && um_tsIfPlainObject(sourceValue)) {
            result[key] = deepMergeOpt(targetValue, sourceValue);
        } else {
            result[key] = sourceValue;
        }
    }
    return result;
}

export {
    delItem as um_arrItemDel,
    deepMergeOpt as um_deepMergeOpt,
};
