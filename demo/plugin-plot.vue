<script setup lang="ts">
import { SLUMap, MapPluginPlot } from "@sl-utils/map";
import { onMounted } from "vue";
let plot_: MapPluginPlot;
/**标绘 */
onMounted(async () => {
  const map = new SLUMap("map");
  const opt = {
    zIndex: 200,
    widthLine: 2,
    colorFill: "rgba(137,185,138,0.5)",
    colorLine: "#2c9b8a",
    dash: [5, 5],
    className: "plot",
  };
  await map.init({ type: "L" });
  plot_ = new MapPluginPlot(map.map, opt);
  plot_.setPlotList([
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
    },
  ]);
});
function onPlot() {
  plot_.open("polygon");
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
