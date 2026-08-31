import { MapPluginGrid, SLMap } from "../src/index.ts";

async function main() {
  const map = new SLMap("map");
  await map.init({ type: "L" });

  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  document.body.append(toolbar);

  const button = document.createElement("button");
  button.className = "button";
  button.textContent = "Show Wave";
  toolbar.append(button);

  const response = await fetch("./assets/json/wave-global.json");
  const waveData = await response.json();
  let plugin: MapPluginGrid | undefined;

  button.addEventListener("click", () => {
    if (plugin) {
      plugin.onRemove();
      plugin = undefined;
      button.textContent = "Show Wave";
      return;
    }

    plugin = new MapPluginGrid(map, {
      zIndex: 200,
      mosaicColor: [
        "#0000CD",
        "#0066ff",
        "#00B7ff",
        "#00E0FF",
        "#00FFFF",
        "#00FFCC",
        "#00FF99",
        "#00FF00",
        "#99FF00",
        "#CCFF00",
        "#FFFF00",
        "#FFCC00",
        "#FF9900",
        "#FF6600",
        "#FF0000",
        "#B03060",
        "#D02090",
        "#FF00FF",
      ],
      mosaicValue: [0.5, 1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      pane: "wavePane",
    });
    plugin.setData(waveData);
    button.textContent = "Hide Wave";
  });
}

main().catch((error) => {
  console.error("plugin-wave failed", error);
});
