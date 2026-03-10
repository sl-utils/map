<script setup lang="ts">
import { SLUMap, MapPluginPartial } from "@sl-utils/map";
import { onMounted } from "vue";
/**leaflet的粒子效果 */
onMounted(async () => {
  const map = new SLUMap("map");
  await map.init({ type: "L" });
  map.setFitView([
    [39.735008, 117.58103],
    [39.74, 117.525],
  ]);
  const partial = new MapPluginPartial(map.map);
  partial.setAllParticles([
    {
      latlngs: [
        [39.745, 117.555],
        [39.74, 117.555],
        [39.74, 117.565],
      ],
      colorParticle: "red",
      dense: 10,
    },
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
