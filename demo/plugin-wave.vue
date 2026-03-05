<script setup lang="ts">
import { SLUMap, MapServiceWave } from "@sl-utils/map";
import { onMounted, ref } from "vue";
import wavejson from "./assets/json/wave-global.json";
let wave_: MapServiceWave;
/**是否显示浪场数据 */
const ifShow = ref(false);
/**浪场 */
onMounted(async () => {
  const map = new SLUMap("map");
  await map.init({ type: "L" });
  wave_ = new MapServiceWave(map);
});
function onVisible() {
  ifShow.value = !ifShow.value;
  ifShow.value ? wave_.flowAdd(wavejson) : wave_.remove();
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
