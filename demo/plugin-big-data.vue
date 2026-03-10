<script setup lang="ts">
import { SLUMap, MapPluginBigData, MapImage } from "@sl-utils/map";
import { onMounted } from "vue";
import shipjson from "./assets/json/ship.json";
/**大数据渲染 */
onMounted(async () => {
  const map = new SLUMap("map");
  await map.init({ type: "L" });
  map.setFitView([
    [38.925008, 118.05103],
    [38.94, 117.555],
  ]);
  const data = new MapPluginBigData(map.map, {
    zIndex: 299,
    zoomOption: {
      1: { maxCount: 2, minBound: [22, 22] },
      12: { maxCount: 2, minBound: [100, 100] },
      // 层级大于等于14 不处理
      14: { maxCount: -1 },
    },
  });
  const imgs: MapImage[] = [];
  shipjson.forEach((e: any) => {
    imgs.push(transfromShipImage(e));
  });
  data.setbigDataImgs(imgs);
  data.drawMapAll();
});
function transfromShipImage(e: any): any {
  let { shipTypeCode, lat, lng, cog } = e;
  let code = shipTypeCode || "8";
  let { posX, posY } = getShipImgPosBytypeCode(code);
  e.typeCode = `A${code}`;
  return {
    info: e,
    url: new URL(`./assets/icons/icon-16.png`, import.meta.url).href,
    latlng: [lat, lng],
    size: [16, 16],
    sizeo: [16, 16],
    rotate: cog,
    posX,
    posY,
    type: ["click", "dblclick"],
  };
}
function getShipImgPosBytypeCode(shipCode: string): {
  posX: number;
  posY: number;
} {
  let posX = 0,
    posY = 0;
  switch (shipCode) {
    case "1":
      ((posX = 204), (posY = 272));
      break;
    case "2":
      ((posX = 221), (posY = 272));
      break;
    case "3":
      ((posX = 238), (posY = 272));
      break;
    case "4":
      ((posX = 34), (posY = 289));
      break;
    case "5":
      ((posX = 0), (posY = 289));
      break;
    case "6":
      ((posX = 17), (posY = 289));
      break;
    case "7":
      ((posX = 51), (posY = 289));
      break;
    case "8":
      ((posX = 68), (posY = 289));
      break;
  }
  return { posX, posY };
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
