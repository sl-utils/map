<script setup lang="ts">
/**热力图 */
import { SLUMap, MapPluginHeat } from "@sl-utils/map";
import { onMounted, ref } from "vue";
let heat_: MapPluginHeat | undefined;
/**是否显示热力图数据 */
let map: SLUMap;
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
onMounted(async () => {
  map = new SLUMap("map");
  await map.init({ type: "L" });
});
function onVisible() {
  ifShow.value = !ifShow.value;
  ifShow.value ? add() : remove();
}
function add() {
  heat_ = new MapPluginHeat(map.map);
  heat_.setAllHeats(data);
}
function remove() {
  if (!heat_) return;
  heat_?.onRemove();
  heat_ = undefined;
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
