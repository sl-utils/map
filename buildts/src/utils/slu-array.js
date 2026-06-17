"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.u_arrAddItemsIndex = addItemsIndex;
function isArray(arr) {
    if (Array.isArray) {
        return Array.isArray(arr);
    }
    else {
        return Object.prototype.toString.call(arr) === '[object Array]';
    }
}
function isNonNull(arr) {
    return isArray(arr) && arr.length > 0;
}
function addItemsIndex(arr, adds, index) {
    if (isNonNull(adds)) {
        if (index !== undefined) {
            let start = arr.slice(0, index + 1);
            let end = arr.slice(index + 1);
            arr.length = 0;
            start.forEach(e => arr.push(e));
            adds.forEach(e => arr.push(e));
            end.forEach(e => arr.push(e));
        }
    }
    return arr;
}
//# sourceMappingURL=slu-array.js.map