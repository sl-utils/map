<script setup lang="ts">
import { SLUMap, MapServiceHeat } from "@sl-utils/map";
import { onMounted, ref } from "vue";
let heat_: MapServiceHeat;
/**是否显示热力图数据 */
const ifShow = ref(false);
const data = [
  {
    latlng: [22.745, 114.055],
    weight: 1,
  },
  {
    latlng: [22.74, 114.055],
    weight: 1,
  },
  {
    latlng: [22.74, 114.065],
    weight: 0.5,
  },
  {
    latlng: [22.745, 114.065],
    weight: 0.2,
  },
];
/**热力图 */
onMounted(async () => {
  const map = new SLUMap("map");
  await map.init({ type: "L" });
  heat_ = new MapServiceHeat(map);
});
function onVisible() {
  ifShow.value = !ifShow.value;
  ifShow.value ? heat_.heatAdd(data) : heat_.remove();
}
</script>

<template>
  <div id="map" class="card"></div>
  <button class="btn" @click="onVisible">
    {{ ifShow ? "隐藏" : "显示" }}热力图
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
