import { MapPluginGrid, MapPluginGridRender, PluginCoastlineMask, SLUMap } from "../src/index.ts";
import { DataMapGrid } from "../src/types/index";

async function main() {
  const map = new SLUMap("map");
  await map.init({ type: "L" });

  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  document.body.append(toolbar);

  const button = document.createElement("button");
  button.className = "button";
  button.textContent = "Show Wave";
  toolbar.append(button);

  const low = await (await fetch("./assets/json/coast_low.json")).json();
  const mid = await (await fetch("./assets/json/coast_mid.json")).json();
  const high = await (await fetch("./assets/json/coast_high.json")).json();
  let waveData: DataMapGrid[] = [], wavePlugin2: MapPluginGridRender;;
  button.addEventListener("click", async () => {
    if (!wavePlugin2) {
      const options = {
        zIndex: 120,
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
          { minZoom: 0, maxZoom: 4, data: low },
          { minZoom: 5, maxZoom: 7, data: mid },
          { minZoom: 8, maxZoom: 20, data: high },
        ],
        map.map,
      );
      /**无需裁切海岸线 */
      // wavePlugin2 = new MapPluginGridRender(map, options);

      wavePlugin2 = new MapPluginGridRender(map, options, mask);
    }
    waveData = waveData.length ? waveData : (await genWave());
    wavePlugin2.setData(waveData);
  });
  async function genWave() {
    const res = await fetch("/json/wave-global.json");
    const waveChunk = await res.json();
    return waveChunk;
  }
}




main().catch((error) => {
  console.error("plugin-wave failed", error);
});
