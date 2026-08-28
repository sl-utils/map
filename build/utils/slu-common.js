import { tsIfPlainObject } from "./slu-type-guard";
function delItem(arr, item, key) {
    if (Array.isArray(arr) && arr.length > 0) {
        let index;
        if (key) {
            index = arr.findIndex(e => e == item || e[key] == item[key]);
        }
        else {
            index = arr.findIndex(e => e == item);
        }
        index >= 0 && arr.splice(index, 1);
    }
    return arr || [];
}
function deepMergeOpt(target, source) {
    const result = { ...target };
    for (const key in source) {
        const sourceValue = source[key];
        if (sourceValue === undefined) {
            continue;
        }
        const targetValue = result[key];
        if (tsIfPlainObject(targetValue) && tsIfPlainObject(sourceValue)) {
            result[key] = deepMergeOpt(targetValue, sourceValue);
        }
        else {
            result[key] = sourceValue;
        }
    }
    return result;
}
export { delItem as um_arrItemDel, deepMergeOpt as um_deepMergeOpt, };
//# sourceMappingURL=slu-common.js.map