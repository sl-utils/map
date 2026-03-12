<script setup lang="ts">
/**测距 */
import { SLUMap, MapPluginRange } from "@sl-utils/map";
import { onMounted } from "vue";
let range_: MapPluginRange;
onMounted(async () => {
  const map = new SLUMap("map");
  await map.init({ type: "L" });
  range_ = new MapPluginRange(map.map);
});
function onRange() {
  range_.open();
}
</script>

<template>
  <div id="map" class="card"></div>
  <button class="btn" @click="onRange">测距</button>
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
