/**在指定index后添加一个数组的数据 ,不改变引用地址
 *@param arr 要操作的数组
 *@param arr 要添加的数组
 *@param index 要添加的位置
 */
declare function addItemsIndex<T>(arr: T[], adds: T[], index?: number): T[];
/**数组操作工具对象 */
export { addItemsIndex as u_arrAddItemsIndex, };
