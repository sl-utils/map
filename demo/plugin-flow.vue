<script setup lang="ts">
/**流场 */
import { SLUMap, MapPluginFlow } from "@sl-utils/map";
import { onMounted, ref } from "vue";
import flowjson from "./assets/json/flow-global.json";
let flow_: MapPluginFlow | undefined;
/**是否显示流场数据 */
const ifShow = ref(false);
const options = {
  pane: "flowPane",
  displayValues: true,
  unit: "m/s",
  angleConvention: "bearingCCW",
  emptyString: "No velocity data",
  maxVelocity: 15,
  colorScale: null,
};
let map: SLUMap;
onMounted(async () => {
  map = new SLUMap("map");
  await map.init({ type: "L" });
});
function onVisible() {
  ifShow.value = !ifShow.value;
  ifShow.value ? add() : remove();
}
function add() {
  flow_ = new MapPluginFlow(map.map, options);
  flow_.setData(flowjson);
}
function remove() {
  if (!flow_) return;
  flow_?.onRemove();
  flow_ = undefined;
}
</script>

<template>
  <div id="map" class="card"></div>
  <button class="btn" @click="onVisible">
    {{ ifShow ? "隐藏" : "显示" }}流场
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
