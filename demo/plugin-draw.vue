<script setup lang="ts">
import { SLUMap, MapPluginDraw } from "@sl-utils/map";
import { ref, onMounted } from "vue";

onMounted(() => {
  const map4 = new SLUMap("map");
  map4.init({ type: "A" }).then(()=>{
 const draw = new MapPluginDraw(map4.map);
    draw.addRect({
      latlngs: [
        [26.3, 110.5],
        [27.3, 112.5],
      ],
      width: 500,
      height: 50,
    });
    draw.addArc({
      latlng: [22.5, 114.0],
      size: 100,
    });
  })
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
