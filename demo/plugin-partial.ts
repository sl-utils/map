import { MapPluginPartial, SLUMap } from "../src/index.ts";

async function main() {
  const map = new SLUMap("map");
  await map.init({ type: "L" });
  map.setFitView([
    [117.58103, 39.735008],
    [117.525, 39.74],
  ]);

  const plugin = new MapPluginPartial(map);
  plugin.setAllParticles([
    {
      lnglats: [
        [117.555, 39.745],
        [117.555, 39.74],
        [117.565, 39.74],
      ],
      colorParticle: "red",
      dense: 10,
    },
  ]);
}

main().catch((error) => {
  console.error("plugin-partial failed", error);
});
