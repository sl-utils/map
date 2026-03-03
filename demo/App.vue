<script setup lang="ts">

import { SLUMap } from "@sl-utils/map";
import { ref, onMounted } from "vue";


onMounted(() => {
  const map4 = new SLUMap("map");
  // const map1 = new MapCanvasDraw()
  // const map2 = new MapCanvasEvent()
  // const map3 = new MapCanvasLayer()
  // SLUCanvasText.drawText({},{})
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
