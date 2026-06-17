<script setup lang="ts">
import {
  SLUMap,
  MapPluginTrack,
  MapTrackShipInfo,
  MapTrackPosition,
  DataMapTrackGroup,
} from "../types";
import { onMounted, ref } from "vue";
import { SLUFormat } from "./utils/app";
let track_: MapPluginTrack;
/**是否显示轨迹 */
const ifShow = ref(false);
/**轨迹 */
onMounted(async () => {
  const map = new SLUMap("map");
  await map.init({ type: "L" });
  track_ = new MapPluginTrack(map);
  const tracks = await genTracks();
  track_.setTracks(tracks);
  let latlngs: [number, number][] = [];
  tracks.forEach((info) => {
    const POSITIONS = info.data,
      first = POSITIONS[0];
    latlngs.push([first.lat, first.lng]);
  });
  /**获取latlngs中最大最小经纬度值 */
  let maxLat = Math.max(...latlngs.map((e) => e[0])),
    minLat = Math.min(...latlngs.map((e) => e[0])),
    maxLng = Math.max(...latlngs.map((e) => e[1])),
    minLng = Math.min(...latlngs.map((e) => e[1]));
  map.setFitView([
    [minLat, minLng],
    [maxLat, maxLng],
  ]);
  track_.addCbClickPoint((e)=>{
    console.log(e)
  })
});
function onVisible() {
  ifShow.value = !ifShow.value;
  track_.setIfShow(ifShow.value);
}
async function genTracks() {
  const response = await fetch("/json/track-chunk.json");
  const trackChunk = await response.json()
  const rawData =  trackChunk as any as MapTrackShipInfo;
  const tracks: DataMapTrackGroup<MapTrackPosition>[] = [];
  for (const key in rawData) {
    if (!Object.hasOwn(rawData, key)) continue;
    const element = rawData[key];
    const positions = element.POSITIONS;
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
      }
    );
    tracks.push(trackGroup);
  }
  return tracks;
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
