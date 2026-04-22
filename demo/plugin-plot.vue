<script setup lang="ts">
import {
  SLUMap,
  MapPluginPlot,
  OptMapPluginPlot,
  MapPlotType,
  DataMapPlot,
} from "@sl-utils/map";
import { onMounted, ref, Ref } from "vue";
let plot_: MapPluginPlot;
let plotList: Ref<DataMapPlot[]> = ref([
  {
    type: "polygon",
    colorFill: "rgba(37,155,138,0.5)",
    colorLine: "#2c9b8a",
    latLngs: [
      [22.8042, 114.1074],
      [22.7742, 114.1574],
      [22.7442, 114.1474],
      [22.6742, 113.6374],
    ],
    name: "这是一个多边形",
  },
]);
/**标绘 */
onMounted(async () => {
  const map = new SLUMap("map");
  const opt: OptMapPluginPlot = {
    plotOpt: {
      zIndex: 200,
      widthLine: 2,
      colorFill: "rgba(137,85,38,0.5)",
      colorLine: "#9c9b8a",
      dash: [15, 15],
      className: "plot",
    },
    editOpt: {
      colorFill: "#dc3926",
      colorLine: "#7C9B8A",
      size: 4,
    },
    textOpt: {
      colorFill: "#ee3e16",
      widthLine: 5,
      colorLine: "#0fe62b",
      ifShadow: true,
    },
  };
  await map.init({ type: "A" });
  plot_ = new MapPluginPlot(map, opt);
  plot_.setPlotList(plotList.value);

  /**如果plotList 不支持响应式更新，需要手动更新plotList.value */
  // plot_.addCbPlotListChange((newPlotList) => {
  //   plotList.value = newPlotList;
  // });
});
function onPlot(type: MapPlotType) {
  plot_.open(type);
}
function onSave() {
  plot_.savePlot();
}
function onEdit(item: DataMapPlot) {
  plot_.setEditPlot(item);
}
function onDelete(item: DataMapPlot) {
  plot_.delPlot(item);
}
</script>

<template>
  <div id="map" class="card"></div>
  <div class="btns">
    <button class="btn" @click="onPlot('point')">绘制点</button>
    <button class="btn" @click="onPlot('circle')">绘制圆</button>
    <button class="btn" @click="onPlot('line')">绘制线</button>
    <button class="btn" @click="onPlot('rect')">绘制矩形</button>
    <button class="btn" @click="onPlot('polygon')">绘制多边形</button>
    <button class="btn" @click="onSave">保存标绘</button>
  </div>
  <div class="plots">
    <div v-for="item in plotList" :key="item.name" class="plot">
      <span>标绘名称：{{ item.name ?? "--" }}</span>
      <span @click="onEdit(item)">编辑</span>
      <span @click="onDelete(item)">删除</span>
    </div>
  </div>
</template>

<style scoped>
.card {
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
  overflow: hidden;
}
.btns {
  display: flex;
  flex-direction: column;
  gap: 7px;
  position: absolute;
  z-index: 100;
}

.btn {
  min-width: 84px;
  height: 32px;
}

.plots {
  background: rgba(255, 255, 255, 0.6);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  position: absolute;
  left: 120px;
  z-index: 100;
}

.plot {
  display: flex;
  gap: 10px;
}
</style>
