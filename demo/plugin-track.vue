<script setup lang="ts">
import {
  SLUMap,
  MapServiceTrack,
  MapTrackShipInfo,
  MapTrackPosition,
  MapTrackGroup,
} from "@sl-utils/map";
import { onMounted, ref } from "vue";
import trackChunk from "./assets/json/track-chunk.json";
import { SLUFormat } from "./utils/app";
let track_: MapServiceTrack;
/**是否显示轨迹 */
const ifShow = ref(false);
/**轨迹 */
onMounted(async () => {
  const map = new SLUMap("map");
  await map.init({ type: "L" });
  track_ = new MapServiceTrack(map);

  const rawData = trackChunk as MapTrackShipInfo;
  const tracks: MapTrackGroup<MapTrackPosition>[] = [];
  for (const key in rawData) {
    if (!Object.hasOwn(rawData, key)) continue;

    const element = rawData[key];
    const positions = element.POSITIONS;

    // 建议在类型层面处理 number，而不是运行时转
    // 但如果你必须在这里转，可以保留
    positions.forEach((p: any) => {
      p.LAT = Number(p.LAT);
      p.LON = Number(p.LON);
      p.SPEED = Number(p.SPEED);
      p.EPOCH = Number(p.EPOCH);
    });

    const trackGroup = SLUFormat.formatToMapTrackGroup<
      MapTrackShipInfo,
      MapTrackPosition
    >(
      element,
      { id: "SHIP_ID", name: "SHIPNAME", data: "POSITIONS" },
      {
        lat: "LAT",
        lng: "LON",
        timeStamp: "EPOCH",
        speed: "SPEED",
        course: "COURSE",
      },
    );

    tracks.push(trackGroup);
  }

  track_.setTracks(tracks);
});
function onVisible() {
  ifShow.value = !ifShow.value;
  track_.setTrackVisible(ifShow.value);
}
</script>

<template>
  <div id="map" class="card"></div>
  <button class="btn" @click="onVisible">
    {{ ifShow ? "隐藏" : "显示" }}轨迹
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
