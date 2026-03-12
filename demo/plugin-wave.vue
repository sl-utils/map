<script setup lang="ts">
/**浪场 */
import { SLUMap, MapPluginGrid } from "@sl-utils/map";
import { onMounted, ref } from "vue";
import wavejson from "./assets/json/wave-global.json";
let wave_: MapPluginGrid | undefined;
let map: SLUMap;
/**是否显示浪场数据 */
const ifShow = ref(false);
const options = {
  zIndex: 200,
  mosaicColor: [
    "#0000CD",
    "#0066ff",
    "#00B7ff",
    "#00E0FF",
    "#00FFFF",
    "#00FFCC",
    "#00FF99",
    "#00FF00",
    "#99FF00",
    "#CCFF00",
    "#FFFF00",
    "#FFCC00",
    "#FF9900",
    "#FF6600",
    "#FF0000",
    "#B03060",
    "#D02090",
    "#FF00FF",
  ],
  mosaicValue: [0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  pane: "wavePane",
};
onMounted(async () => {
  map = new SLUMap("map");
  await map.init({ type: "L" });
});
function onVisible() {
  ifShow.value = !ifShow.value;
  ifShow.value ? add() : remove();
}
function add() {
  wave_ = new MapPluginGrid(map.map, options);
  wave_.setData(wavejson);
}
function remove() {
  if (!wave_) return;
  wave_?.onRemove();
  wave_ = undefined;
}
</script>

<template>
  <div id="map" class="card"></div>
  <button class="btn" @click="onVisible">
    {{ ifShow ? "隐藏" : "显示" }}浪场
  </button>
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
