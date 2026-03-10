<script setup lang="ts">
import { SLUMap, MapPluginArrowLine } from "@sl-utils/map";
import { onMounted } from "vue";
const url = new URL("./assets/images/direction-arrow.png", import.meta.url).href;
onMounted(async () => {
  const map = new SLUMap("map");
  await map.init({ type: "A" });
  const arrowline = new MapPluginArrowLine(map.map,{imgUrl:url});
  arrowline.setAllLines([
    {
      latlngs: [
        [39.745, 117.555],
        [39.74, 117.555],
        [39.74, 117.565],
        [39.745, 117.565],
      ],
    },
    {
      latlngs: [
        [39.73, 117.555],
        [39.735, 117.555],
      ],
    },
    {
      latlngs: [
        [39.72, 117.545],
        [39.72, 117.565],
      ],
    },
    {
      latlngs: [
        [39.715, 117.565],
        [39.715, 117.545],
      ],
    },
  ]);
  map.setFitView([
    [39.745, 117.555],
    [39.74, 117.555],
    [39.74, 117.565],
  ]);
});
</script>

<template>
  <div id="map" class="card"></div>
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
</style>
