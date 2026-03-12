<script setup lang="ts">
/**风场 */
import { SLUMap, MapPluginWind } from "@sl-utils/map";
import { onMounted, ref } from "vue";
import windjson from "./assets/json/wind-global.json";
const iconUrl = new URL("./assets/icons/icon-28.png", import.meta.url).href;
let wind_: MapPluginWind | undefined;
let map: SLUMap;
/**是否显示风场数据 */
const ifShow = ref(false);
const iconResolver = (speed: number) => {
  const level =
    speed < 0.3
      ? 0
      : speed < 1.6
        ? 1
        : speed < 3.4
          ? 2
          : speed < 5.5
            ? 3
            : speed < 8.0
              ? 4
              : speed < 10.8
                ? 5
                : speed < 13.9
                  ? 6
                  : speed < 17.2
                    ? 7
                    : speed < 20.8
                      ? 8
                      : speed < 24.5
                        ? 9
                        : speed < 28.5
                          ? 10
                          : speed < 32.7
                            ? 11
                            : 12;
  const pos = [level + 2, 1],
    size: [number, number] = [28, 28];
  return {
    url: iconUrl,
    size,
    sizeo: [28, 28],
    posX: pos[0] * (size[0] + 1),
    posY: pos[1] * (size[1] + 1),
  };
};
const options = {
  size: [28, 28],
  zooMsize: [
    [6, 6],
    [6, 6],
    [6, 6],
    [6, 6],
    [8, 8],
    [8, 8], //0-5
    [12, 12],
    [16, 16],
    [22, 22],
    [28, 28],
    [28, 28],
    [28, 28], //6-11
    [32, 32],
    [32, 32],
    [32, 32],
    [32, 32],
    [32, 32],
    [32, 32],
    [32, 32],
    [32, 32],
    [32, 32],
    [32, 32],
    [32, 32],
    [32, 32],
  ],
  pane: "windPane",
};
onMounted(async () => {
  map = new SLUMap("map");
  await map.init({ type: "L" });
});
function onVisible() {
  ifShow.value = !ifShow.value;
  ifShow.value ? add() : remove();
}
function add() {
  wind_ = new MapPluginWind(map.map, options);
  wind_.setIconResolver(iconResolver);
  wind_.setData(windjson);
}
function remove() {
  if (!wind_) return;
  wind_?.onRemove();
  wind_ = undefined;
}
</script>

<template>
  <div id="map" class="card"></div>
  <button class="btn" @click="onVisible">
    {{ ifShow ? "隐藏" : "显示" }}风场
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
