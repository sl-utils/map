/**在项目中用于数据转换的工具类 */

import { MapTrackGroup, MapTrackItem } from "@sl-utils/map";

/**
 * 映射轨迹数据结构格式转为plugin-track通用数据结构
 * @param orginDataItem 原始轨迹点数据项
 * @param itemMapping 映射关系 MapTrackItem 于原始数据结构
 * @returns 返回MapPluginTrack需要的结构
 */
function formatToMapItemTrack<T>(orginDataItem: T, itemMapping: { [key in keyof MapTrackItem]: keyof T }): MapTrackItem {
    const trackItem: Partial<MapTrackItem> = {};
    Object.keys(itemMapping).forEach((key) => {
        trackItem[key] = orginDataItem[itemMapping[key]];
    });
    return trackItem as MapTrackItem;
}
/**
 * 转为plugin-track通用数据结构
 * @param orginDataGroup 原始轨迹数据组 内置轨迹集合点位
 * @param groupMapping orginData 不需要映射 用于存储原始数据结构 方便取值
 * @param itemMapping 轨迹点数据映射
 * @returns 返回MapPluginTrack需要的结构
 */
function formatToMapTrackGroup<T, R>(
    orginDataGroup: T,
    groupMapping: { [key in keyof Omit<MapTrackGroup<T>, 'orginData'>]: keyof T },
    itemMapping: { [key in keyof MapTrackItem]: keyof R }
): MapTrackGroup {
    const trackGroup = {} as MapTrackGroup;
    Object.keys(groupMapping).forEach((key) => {
        trackGroup[key] = orginDataGroup[groupMapping[key]];
    });
    const trackList = orginDataGroup[groupMapping["data"]];
    if (Array.isArray(trackList)) {
        trackGroup['data'] = trackList.map((item) => {
            return formatToMapItemTrack(item, itemMapping);
        });
    }
    trackGroup.orginData = orginDataGroup
    return trackGroup as MapTrackGroup;
}
export const SLUFormat = {
    /**
     * 转为plugin-track通用数据结构
     * @param orginDataGroup 原始轨迹数据组 内置轨迹集合点位
     * @param groupMapping orginData 不需要映射 用于存储原始数据结构 方便取值
     * @param itemMapping 轨迹点数据映射
     * @returns 返回MapPluginTrack需要的结构
     */
    formatToMapTrackGroup,
};
