<script setup lang="ts">
import { SLUMap, MapServiceFlow } from "@sl-utils/map";
import { onMounted, ref } from "vue";
import flowjson from "./assets/json/flow-global.json";
let flow_: MapServiceFlow;
/**是否显示流场数据 */
const ifShow = ref(false);
/**流场 */
onMounted(async () => {
  const map = new SLUMap("map");
  await map.init({ type: "L" });
  flow_ = new MapServiceFlow(map);
});
function onVisible() {
  ifShow.value = !ifShow.value;
  ifShow.value ? flow_.flowAdd(flowjson) : flow_.remove();
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
