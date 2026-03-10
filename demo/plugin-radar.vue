<script setup lang="ts">
import { SLUMap, MapPluginRadar, MapRadarScanEvent } from "@sl-utils/map";
import { onMounted } from "vue";
/**雷达 */
onMounted(async () => {
  const map = new SLUMap("map");
  await map.init({ type: "L" });
  const radar = new MapPluginRadar(map.map);
  let radarData = [
      { id: "1", name: "厂区雷达", radius: 500, latitude: 39.749, longitude: 117.555, angle: [115, 205], ifClockwise: false },
      { id: "2", name: "海口雷达", radius: 50000, latitude: 20.47719, sectorAngle: 60, longitude: 109.45816, angle: [0, 90] },
    ];
    map.setCenter([39.749, 117.555], 15);
    let radars = radarData.map((e) => transformRadarInfo(e));
    radar.setAllRadars(radars);
});
/**转换为雷达数据配置 */
  function transformRadarInfo(radar: any): MapRadarScanEvent<any> {
    let { latitude, longitude, radius, angle, ifClockwise, id } = radar;
    return {
      latlng: [latitude, longitude],
      sizeFix: [radius, radius],
      time: 3,
      ifClockwise,
      angle,
      minZoom: 5,
      animeId: id,
      sectorAngle: 60,
      arcDash: [100, 500, 1500, 2000, 4000],
      colorDash: ["#FF0000", "#ffff00"],
      colorRadar: "#00FFFF",
      info: radar,
      type: "click",
    };
  }
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
