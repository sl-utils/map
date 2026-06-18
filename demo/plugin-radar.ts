import { MapPluginRadar, SLUMap } from "../src/index.ts";

function transformRadarInfo(radar: any) {
  return {
    latlng: [radar.latitude, radar.longitude],
    sizeFix: [radar.radius, radar.radius],
    time: 3,
    ifClockwise: radar.ifClockwise,
    angle: radar.angle,
    minZoom: 5,
    animeId: radar.id,
    sectorAngle: 60,
    arcDash: [100, 500, 1500, 2000, 4000],
    colorDash: ["#FF0000", "#ffff00"],
    colorRadar: "#00FFFF",
    info: radar,
    type: "click",
  };
}

async function main() {
  const map = new SLUMap("map");
  await map.init({ type: "L" });

  const plugin = new MapPluginRadar(map);
  const radarData = [
    {
      id: "1",
      name: "Plant Radar",
      radius: 500,
      latitude: 39.749,
      longitude: 117.555,
      angle: [115, 205],
      ifClockwise: false,
    },
    {
      id: "2",
      name: "Harbor Radar",
      radius: 50000,
      latitude: 20.47719,
      sectorAngle: 60,
      longitude: 109.45816,
      angle: [0, 90],
    },
  ];

  map.setCenter([39.749, 117.555], 15);
  plugin.setAllRadars(radarData.map(transformRadarInfo));
}

main().catch((error) => {
  console.error("plugin-radar failed", error);
});
