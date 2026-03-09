<script setup lang="ts">
import { SLUMap, MapServicePlot } from "@sl-utils/map";
import { onMounted } from "vue";
let plot_: MapServicePlot;
/**标绘 */
onMounted(async () => {
  const map = new SLUMap("map");
  const opt = {
    zIndex: 200,
    widthLine: 2,
    colorFill: "rgba(37,155,138,0.5)",
    colorLine: "#2c9b8a",
    dash: [5, 5],
    className: "plot",
  };
  await map.init({ type: "L" });
  plot_ = new MapServicePlot(map.map, opt);
});
function onPlot() {
  plot_.plotOpenEdit("polygon");
}
</script>

<template>
  <div id="map" class="card"></div>
  <button class="btn" @click="onPlot">绘制多边形</button>
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
.btn {
  width: 84px;
  height: 32px;
  position: absolute;
  z-index: 100;
}
</style>
