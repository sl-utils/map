<!-- 汇集所有插件 -->
<script setup lang="ts">
import {
  SLUMap,
  MapPluginDraw,
  MapPluginArrowLine,
  MapPluginBigData,
  MapImage,
  MapPluginHeat,
  DataMapHeat,
  MapPluginPartial,
  MapPluginPlot,
  OptMapPluginPlot,
  MapPluginRadar,
  MapRadarScanEvent,
  MapPluginRange,
  MapPluginTrack,
  MapTrackShipInfo,
  DataMapTrackGroup,
  MapTrackPosition,
  MapPluginWind,
  OptMapPluginWind,
  Image,
  DataMapGrid,
  MapPluginGrid,
  MapPluginFlow,
  OptMapPluginFlow,
  DataMapVeloctiyWind,
  MapPluginFixedHeat,
  MapPluginGridRender,
  PluginCoastlineMask,
} from "@sl-utils/map";
import { ref, onMounted, reactive } from "vue";
// 使用 fetch 动态加载 JSON 文件
const shipjson = fetch(new URL("./assets/json/ship.json", import.meta.url).href)
  .then(res => res.json());
import { SLUFormat } from "./utils/app";
const mapstyle = fetch(new URL("./assets/json/mapstyle-protomaps.json", import.meta.url).href)
  .then(res => res.json());
const low = fetch(new URL("./assets/json/coast_low.json", import.meta.url).href)
  .then(res => res.json());
const mid = fetch(new URL("./assets/json/coast_mid.json", import.meta.url).href)
  .then(res => res.json());
// 使用 fetch 动态加载大文件，避免 Vite 解析内存问题
const high = fetch(new URL("./assets/json/coast_high.json", import.meta.url).href)
  .then(res => res.json());
const arrowUrl = new URL("./assets/images/direction-arrow.png", import.meta.url)
  .href;
const windUrl = new URL("./assets/icons/icon-28.png", import.meta.url).href;

let map: SLUMap;
onMounted(async () => {
  map = new SLUMap("map");
  const style = await mapstyle;
  await map.init({ type: "L", style: style });
});

/**控件------------------------------- */
/**控件数据 */
let data = reactive({ lat: 0, lng: 0, zoom: 0, scale: 0, width: "0px" });
/**是否开启控件 */
const ifControl = ref(false);
const ifDMS = ref(true);
/**点击开启/关闭控件按钮 */
function onControl() {
  ifControl.value = !ifControl.value;
  ifControl.value ? openCtr() : map.closeControl();
}
/**开启控件 */
function openCtr() {
  const info = map.openControl();
  const { lat, lng, zoom, scale, width } = info;
  Object.assign(data, { lat, lng, zoom, scale, width });
  /**持续更新控件数据 */
  map.onControlUpdate((info) => {
    const { lat, lng, zoom, scale, width } = info;
    Object.assign(data, { lat, lng, zoom, scale, width });
  });
}
/**切换经纬度模式 */
function onClickTran() {
  ifDMS.value = !ifDMS.value;
  const info = map.changeLatlngFormat(ifDMS.value);
  const { lat, lng, zoom, scale, width } = info;
  Object.assign(data, { lat, lng, zoom, scale, width });
}
/**----------------------------------------------------- */

/**绘制的内容------------------------------- */
/**是否展示绘制的内容 */
const ifDraw = ref(false);
let drawPlugin: MapPluginDraw;
/**点击展示/关闭绘制内容 按钮 */
function onDraw() {
  ifDraw.value = !ifDraw.value;
  ifDraw.value ? openDraw() : (drawPlugin.delAll(), drawPlugin.drawMapAll());
}
/**展示绘制内容 */
function openDraw() {
  drawPlugin = drawPlugin || new MapPluginDraw(map);
  drawPlugin.addRect({
    latlngs: [
      [26.3, 110.5],
      [27.3, 112.5],
      [28.3, 112.5],
      [27.3, 110.5],
    ],
    maxZoom: 16,
  });
  drawPlugin.addArc({
    latlng: [22.5, 114.0],
    size: 100,
  });
  drawPlugin.drawMapAll();
}
/**----------------------------------------------------- */

/**绘制------------------------------- */
/**是否开启绘制 */
const ifPlot = ref(false);
let plotPlugin: MapPluginPlot;
/**点击开启/关闭绘制按钮 */
function onPlot() {
  ifPlot.value = !ifPlot.value;
  ifPlot.value ? openPlot() : (plotPlugin.setPlotList([]), plotPlugin.redraw());
}
/**展示绘制内容 */
function openPlot() {
  const opt: OptMapPluginPlot = {
    plotOpt: {
      zIndex: 200,
      widthLine: 4,
      colorFill: "rgba(137,85,38,0.5)",
      colorLine: "#9c9b8a",
      dash: [15, 15],
      className: "plot",
    },
    editOpt: {
      colorFill: "#dc3926",
      colorLine: "#7C9B8A",
      size: 4,
    },
    textOpt: {
      colorFill: "#2C9B8A",
      widthLine: 2,
      colorLine: "#FFFFFF",
      ifShadow: true,
    },
  };
  plotPlugin = plotPlugin || new MapPluginPlot(map, opt);
  plotPlugin.open("rect");
}
/**----------------------------------------------------- */

/**动态箭头线------------------------------- */
/**是否开启箭头线 */
const ifArrowLine = ref(false);
let arrowlinePlugin: MapPluginArrowLine;
/**点击开启/关闭箭头线按钮 */
function onArrowLine() {
  ifArrowLine.value = !ifArrowLine.value;
  ifArrowLine.value ? openArrowLine() : arrowlinePlugin.setAllLines([]);
}
/**开启箭头线 */
function openArrowLine() {
  arrowlinePlugin =
    arrowlinePlugin ||
    new MapPluginArrowLine(map, {
      imgUrl: arrowUrl,
      lineWidth: 15,
    });
  arrowlinePlugin.setAllLines([
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
}
/**----------------------------------------------------- */

/**大数据渲染------------------------------- */
/**是否开启大数据渲染 */
const ifBigData = ref(false);
let bigDataPlugin: MapPluginBigData;
/**点击开启/关闭大数据渲染按钮 */
function onBigData() {
  ifBigData.value = !ifBigData.value;
  ifBigData.value ? openBigData() : bigDataPlugin.setbigDataImgs([]);
}
/**开启大数据渲染 */
async function openBigData() {
  map.setFitView([
    [38.925008, 118.05103],
    [38.94, 117.555],
  ]);
  bigDataPlugin =
    bigDataPlugin ||
    new MapPluginBigData(map, {
      zIndex: 299,
      zoomOption: {
        1: { maxCount: 2, minBound: [22, 22] },
        // 12: { maxCount: 2, minBound: [100, 100] },
        // 层级大于等于14 不处理
        14: { maxCount: -1 },
      },
    });
  const imgs: MapImage[] = [];
  const shipData = await shipjson;
  shipData.forEach((e: any) => {
    imgs.push(transfromShipImage(e));
  });
  bigDataPlugin.setbigDataImgs(imgs);
}
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
/**----------------------------------------------------- */

/**热力图------------------------------- */
/**是否开启热力图 */
const ifHeat = ref(false);
let heatPlugin: MapPluginHeat;
/**点击开启/关闭热力图按钮 */
function onHeat() {
  ifHeat.value = !ifHeat.value;
  ifHeat.value ? openHeat() : heatPlugin.onRemove();
}
/**开启热力图 */
function openHeat() {
  const data: DataMapHeat[] = [
    { latlng: [22.745, 114.055], weight: 1 },
    { latlng: [22.74, 114.055], weight: 1 },
    { latlng: [22.74, 114.065], weight: 0.5 },
    { latlng: [22.745, 114.065], weight: 0.2 },
  ];
  heatPlugin = new MapPluginHeat(map);
  heatPlugin.setAllHeats(data);
}
/**----------------------------------------------------- */

/**固定内容热力图------------------------------- */
/**是否开启固定内容热力图 */
const ifFixedHeat = ref(false);
let fixedHeatPlugin: MapPluginFixedHeat;
/**点击开启/关闭固定内容热力图按钮 */
function onFixedHeat() {
  ifFixedHeat.value = !ifFixedHeat.value;
  ifFixedHeat.value ? openFixedHeat() : fixedHeatPlugin.onRemove();
}
/**开启固定内容热力图 */
async function openFixedHeat() {
  map.setCenter([38.954736111, 117.89823611], 13);
  const data = await genFixedHeat();
  fixedHeatPlugin = new MapPluginFixedHeat(map);
  fixedHeatPlugin.setData(data);
}
async function genFixedHeat() {
  const res = await fetch("/json/fixed-heat.json");
  console.log(res);

  const data = await res.json();
  const heats: [number, number, number][] = [];
  for (const key in data) {
    const item = data[key];
    heats.push([item.lng, item.lat, item.speed]);
  }
  return heats;
}
/**----------------------------------------------------- */

/**粒子------------------------------- */
/**是否开启粒子 */
const ifPartial = ref(false);
let partialPlugin: MapPluginPartial;
/**点击开启/关闭粒子按钮 */
function onParticle() {
  ifPartial.value = !ifPartial.value;
  ifPartial.value ? openParticle() : partialPlugin.onRemove();
}
/**开启粒子 */
function openParticle() {
  map.setFitView([
    [39.735008, 117.58103],
    [39.74, 117.525],
  ]);
  partialPlugin = new MapPluginPartial(map);
  partialPlugin.setAllParticles([
    {
      latlngs: [
        [39.745, 117.555],
        [39.74, 117.555],
        [39.74, 117.565],
      ],
      colorParticle: "red",
      dense: 10,
      points: [],
    },
  ]);
}
/**----------------------------------------------------- */

/**雷达------------------------------- */
/**是否开启雷达 */
const ifRadar = ref(false);
let radarPlugin: MapPluginRadar;
/**点击开启/关闭雷达按钮 */
function onRadar() {
  ifRadar.value = !ifRadar.value;
  ifRadar.value ? openRadar() : radarPlugin.onRemove();
}
/**开启雷达 */
function openRadar() {
  radarPlugin = new MapPluginRadar(map);
  let radarData = [
    {
      id: "1",
      name: "厂区雷达",
      radius: 500,
      latitude: 39.749,
      longitude: 117.555,
      angle: [115, 205],
      ifClockwise: false,
    },
    {
      id: "2",
      name: "海口雷达",
      radius: 50000,
      latitude: 20.47719,
      sectorAngle: 60,
      longitude: 109.45816,
      angle: [0, 90],
    },
  ];
  map.setCenter([39.749, 117.555], 15);
  let radars = radarData.map((e) => transformRadarInfo(e));
  radarPlugin.setAllRadars(radars);
}
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
/**----------------------------------------------------- */

/**测距------------------------------- */
/**是否开启测距 */
const ifRange = ref(false);
let rangePlugin: MapPluginRange;
/**点击开启/关闭测距按钮 */
function onRange() {
  ifRange.value = !ifRange.value;
  ifRange.value ? openRange() : rangePlugin.close();
}
/**开启测距 */
function openRange() {
  rangePlugin = rangePlugin || new MapPluginRange(map);
  rangePlugin.open();
}
/**----------------------------------------------------- */

/**轨迹------------------------------- */
/**是否开启轨迹 */
const ifTrack = ref(false);
let trackPlugin: MapPluginTrack;
let trackData: DataMapTrackGroup<MapTrackPosition>[] = [];
/**点击开启/关闭轨迹按钮 */
async function onTrack() {
  ifTrack.value = !ifTrack.value;
  if (!trackData.length) {
    await openTrack();
  }
  trackPlugin.setIfShow(ifTrack.value);
  if (ifTrack.value) locaTrack();
}
/**开启轨迹 */
async function openTrack() {
  trackPlugin = new MapPluginTrack(map);
  trackData = await genTracks();
  trackPlugin.setTracks(trackData);
}
/**定位到轨迹 */
function locaTrack() {
  let latlngs: [number, number][] = [];
  trackData.forEach((info) => {
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
}
async function genTracks() {
  const response = await fetch("/json/track-chunk.json");
  const trackChunk = await response.json();
  const rawData = trackChunk as MapTrackShipInfo;
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
      },
    );
    tracks.push(trackGroup);
  }
  return tracks;
}
/**----------------------------------------------------- */

/**风速风向------------------------------- */
/**是否开启风速风向 */
const ifWind = ref(false);
let windPlugin: MapPluginWind;
let windData: DataMapGrid[] = [];
/**点击开启/关闭风速风向按钮 */
async function onWind() {
  ifWind.value = !ifWind.value;
  if (!windData.length) {
    await openWind();
  }
  ifWind.value ? windPlugin.setData(windData) : windPlugin.setData([]);
}
/**开启风速风向 */
async function openWind() {
  const options: OptMapPluginWind = {
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
  windPlugin = new MapPluginWind(map, options);
  windData = await genWind();
}
async function genWind() {
  const response = await fetch("/json/wind-global.json");
  const windChunk = await response.json();
  const iconResolver: (speed: number) => Image = (speed: number) => {
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
      url: windUrl,
      size,
      sizeo: [28, 28],
      posX: pos[0] * (size[0] + 1),
      posY: pos[1] * (size[1] + 1),
    };
  };
  windPlugin.setIconResolver(iconResolver);
  return windChunk;
}
/**----------------------------------------------------- */

/**海浪------------------------------- */
/**是否开启海浪 */
const ifWave = ref(false);
let wavePlugin: MapPluginGrid;
let waveData: DataMapGrid[] = [];
/**点击开启/关闭海浪按钮 */
async function onWave() {
  ifWave.value = !ifWave.value;
  await openWave();
  ifWave.value ? wavePlugin.setData(waveData) : wavePlugin.setData([]);
}
/**开启海浪 */
async function openWave() {
  if (!wavePlugin) {
    const options = {
      zIndex: 200,
      mosaicColor: [
        "#337ffc",
        "#32aafc",
        "#31d6fc",
        "#72e9c7",
        "#e0f16b",
        "#e4e35f",
        "#FFCC00",
        "#FF6600",
        "#FF0000",
        "#B03060",
      ],
      mosaicValue: [0.5, 1, 2, 3, 4, 5, 7, 9, 12, 15],
      pane: "wavePane",
    };
    wavePlugin = new MapPluginGrid(map, options);
  }
  waveData = waveData.length ? waveData : (await genWave());
}
async function genWave() {
  const res = await fetch("/json/wave-global.json");
  const waveChunk = await res.json();
  return waveChunk;
}
/**----------------------------------------------------- */

/**海浪2------------------------------- */
/**是否开启海浪2 */
const ifWave2 = ref(false);
let wavePlugin2: MapPluginGridRender;
/**点击开启/关闭海浪2按钮 */
async function onWave2() {
  ifWave2.value = !ifWave2.value;
  await openWave2();
  ifWave2.value ? wavePlugin2.setData(waveData) : wavePlugin2.setData([]);
}
/**开启海浪2 */
async function openWave2() {
  if (!wavePlugin2) {
    // 等待数据加载完成
    const lowData = await low;
    const midData = await mid;
    const highData = await high;
    
    const options = {
      zIndex: 200,
      mosaicColor: [
        "#337FFC",
        "#32AAFC",
        "#31D6FC",
        "#72E9C7",
        "#E0F16B",
        "#E4E35F",
        "#FFCC00",
        "#FF6600",
        "#FF0000",
        "#B03060",
      ],
      mosaicValue: [0.5, 1, 2, 3, 4, 5, 7, 9, 12, 15],
      pane: "wavePane2",
    };
    const mask = new PluginCoastlineMask(
      [
        { minZoom: 0, maxZoom: 4, data: lowData },
        { minZoom: 5, maxZoom: 7, data: midData },
        { minZoom: 8, maxZoom: 20, data: highData },
      ],
      map.map,
    );
    /**无需裁切海岸线 */
    // wavePlugin2 = new MapPluginGridRender(map, options);

    wavePlugin2 = new MapPluginGridRender(map, options, mask);
  }
  waveData = waveData.length ? waveData : (await genWave());
}
/**----------------------------------------------------- */

/**洋流------------------------------- */
/**是否开启洋流 */
const ifFlow = ref(false);
let flowPlugin: MapPluginFlow;
let flowData: DataMapVeloctiyWind[] = [];
/**点击开启/关闭洋流按钮 */
async function onFlow() {
  ifFlow.value = !ifFlow.value;
  if (!flowData.length) {
    await openFlow();
  }
  ifFlow.value ? flowPlugin.setData(flowData) : flowPlugin.setData([]);
}
/**开启洋流 */
async function openFlow() {
  const options: Partial<OptMapPluginFlow> = {
    pane: "flowPane",
    displayValues: true,
    unit: "m/s",
    angleConvention: "bearingCCW",
    emptyString: "No velocity data",
    maxVelocity: 15,
    colorScale: null,
  };
  flowPlugin = new MapPluginFlow(map, options);
  flowData = await genFlow();
}
async function genFlow() {
  const res = await fetch("/json/flow-global.json");
  const flowChunk = await res.json();
  return flowChunk;
}
/**----------------------------------------------------- */
</script>

<template>
  <div id="map" class="card">
    <div class="latlng-scale" v-if="ifControl">
      <div class="zoom-count">
        <span>{{ data.zoom }}级</span>
        <div class="scale" :style="{ width: data.width }">
          {{ data.scale }}
        </div>
      </div>
      <div class="lat-lng">
        <div class="lat">{{ data.lat }}</div>
        <div class="lng">{{ data.lng }}</div>
        <div class="tran" @click="onClickTran">
          <svg
            t="1773281510386"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4831"
            width="16"
            height="16"
          >
            <path
              d="M947.368 607.782c-19.538-19.572-51.196-19.572-70.734 0l-58.855 58.98c-0.601 0.604-1.632 0.178-1.632-0.675V311.256c0-97.337-78.735-176.243-175.865-176.243-88.322 0-161.419 65.24-173.958 150.252a0.95 0.95 0 0 1-0.939 0.814h-0.018a0.956 0.956 0 0 0-0.956 0.955v427.063c0 41.714-33.747 75.532-75.371 75.532-41.63 0-75.372-33.818-75.372-75.532V236.678c0-0.528-0.064-1.07-0.073-1.557-0.232-12.572-6.916-28.194-16.49-37.788-19.623-19.664-58.22-16.88-77.844 2.784L77.139 342.542c-19.624 19.668-19.624 51.549 0 71.211 19.624 19.67 51.437 19.67 71.061 0l63.332-63.465c0.601-0.603 1.632-0.177 1.632 0.675v363.134c0 97.337 78.74 176.243 175.876 176.243 88.312 0 161.413-65.241 173.952-150.252a0.95 0.95 0 0 1 0.939-0.814h0.018a0.956 0.956 0 0 0 0.956-0.956V311.256c0-41.714 33.748-75.532 75.377-75.532 41.624 0 75.371 33.818 75.371 75.532v477.418c0 0.528 0.103 2.972 0.155 3.456 1.2 10.934 6.132 24.789 14.497 33.173 19.533 19.572 56.072 14.683 75.605-4.89L947.368 678.66c19.527-19.57 19.527-51.304 0-70.877z"
              p-id="4832"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
  <div class="btns">
    <button class="btn" @click="onControl">
      {{ ifControl ? "关闭" : "开启" }}控件
    </button>
    <button class="btn" @click="onDraw">
      {{ ifDraw ? "关闭" : "展示" }}绘制的内容
    </button>
    <button class="btn" @click="onPlot">
      {{ ifPlot ? "关闭" : "开启" }}绘制
    </button>
    <button class="btn" @click="onArrowLine">
      {{ ifArrowLine ? "关闭" : "开启" }}箭头线
    </button>
    <button class="btn" @click="onBigData">
      {{ ifBigData ? "关闭" : "开启" }}大数据渲染
    </button>
    <button class="btn" @click="onHeat">
      {{ ifHeat ? "关闭" : "开启" }}热力图
    </button>
    <!-- <button class="btn" @click="onFixedHeat">
      {{ ifFixedHeat ? "关闭" : "开启" }}固定内容热力图
    </button> -->
    <button class="btn" @click="onParticle">
      {{ ifPartial ? "关闭" : "开启" }}粒子
    </button>
    <button class="btn" @click="onRadar">
      {{ ifRadar ? "关闭" : "开启" }}雷达
    </button>
    <button class="btn" @click="onRange">
      {{ ifRange ? "关闭" : "开启" }}测距
    </button>
    <button class="btn" @click="onTrack">
      {{ ifTrack ? "关闭" : "开启" }}轨迹
    </button>
    <button class="btn" @click="onWind">
      {{ ifWind ? "关闭" : "开启" }}风速风向
    </button>
    <button class="btn" @click="onWave">
      {{ ifWave ? "关闭" : "开启" }}海浪
    </button>
    <button class="btn" @click="onWave2">
      {{ ifWave2 ? "关闭" : "开启" }}海浪2
    </button>
    <button class="btn" @click="onFlow">
      {{ ifFlow ? "关闭" : "开启" }}洋流
    </button>
  </div>
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

.btns {
  display: flex;
  flex-direction: column;
  gap: 7px;
  position: absolute;
  z-index: 100;
}

.btn {
  min-width: 84px;
  height: 32px;
}

.latlng-scale {
  font-size: 14px;
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 401;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
}
.lat-lng {
  padding: 2px 5px;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: flex-end;
  align-self: flex-end;
  align-items: center;
}
.lat {
  margin-left: 5px;
  margin-right: 10px;
}
.lng {
  padding-right: 10px;
}
.zoom-count {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 5px;
  padding: 3px;
  border-radius: 3px;
}
.scale {
  border: 1px solid #333;
  border-top-width: 0px;
  height: 10px;
  line-height: 0px;
  text-align: center;
  margin-right: 50px;
  margin-left: 25px;
  background-color: rgba(255, 255, 255, 0.3);
}
.tran {
  height: 24px;
  width: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #e2e9f8;
  cursor: pointer;
}
</style>
