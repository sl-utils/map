import { MapPluginPartial, SLUMap } from "../src/index.ts";

async function main() {
  const map = new SLUMap("map");
  await map.init({ type: "L" });
  map.setFitView([
    [39.735008, 117.58103],
    [39.74, 117.525],
  ]);

  const plugin = new MapPluginPartial(map);
  plugin.setAllParticles([
    {
      latlngs: [
        [39.745, 117.555],
        [39.74, 117.555],
        [39.74, 117.565],
      ],
      colorParticle: "red",
      dense: 10,
    },
  ]);
}

main().catch((error) => {
  console.error("plugin-partial failed", error);
});
