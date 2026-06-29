import { MapPluginArrowLine, SLUMap } from "../src/index.ts";

async function main() {
  const map = new SLUMap("map");
  await map.init({ type: "L" });

  const plugin = new MapPluginArrowLine(map, {
    imgUrl: new URL("./assets/images/direction-arrow.png", import.meta.url).href,
  });

  plugin.setAllLines([
    {
      lnglats: [
        [117.555, 39.745],
        [117.555, 39.74],
        [117.565, 39.74],
        [117.565, 39.745],
      ],
    },
    {
      lnglats: [
        [117.555, 39.73],
        [117.555, 39.735],
      ],
    },
    {
      lnglats: [
        [117.545, 39.72],
        [117.565, 39.72],
      ],
    },
    {
      lnglats: [
        [117.565, 39.715],
        [117.545, 39.715],
      ],
    },
  ]);

  map.setFitView([
    [117.555, 39.745],
    [117.555, 39.74],
    [117.565, 39.74],
  ]);
}

main().catch((error) => {
  console.error("plugin-arrow-line failed", error);
});
