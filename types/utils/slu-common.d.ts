/**移除数组指定item，会改变原数组，不改变引用地址
 * @param arr 要操作的数组
 * @param item 要移除的对象或某个对象key属性的值
 * @param key 用于比较的key属性
*/
declare function delItem<T>(arr: T[] | undefined, item: T, key?: keyof T): T[];
/**
 * 用于深度合并同类型的配置：入参类型一致,不改变原对象,返回合并后的新对象
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的新对象
 */
declare function deepMergeOpt<T>(target: T, source: T): T;
export { delItem as um_arrItemDel, deepMergeOpt as um_deepMergeOpt, };
