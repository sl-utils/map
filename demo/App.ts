import { MapPluginDraw, SLUMap } from "../src/index.ts";

async function main() {
  const map = new SLUMap("map");
  await map.init({ type: "A" });

  const draw = new MapPluginDraw(map);
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
}

main().catch((error) => {
  console.error("App demo failed", error);
});
