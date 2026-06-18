import { MapPluginHeat, SLUMap } from "../src/index.ts";

async function main() {
  const map = new SLUMap("map");
  await map.init({ type: "L" });

  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  document.body.append(toolbar);

  const button = document.createElement("button");
  button.className = "button";
  button.textContent = "Show Heat";
  toolbar.append(button);

  const data = [
    { latlng: [22.745, 114.055], weight: 1 },
    { latlng: [22.74, 114.055], weight: 1 },
    { latlng: [22.74, 114.065], weight: 0.5 },
    { latlng: [22.745, 114.065], weight: 0.2 },
  ];

  let plugin: MapPluginHeat | undefined;

  button.addEventListener("click", () => {
    if (plugin) {
      plugin.onRemove();
      plugin = undefined;
      button.textContent = "Show Heat";
      return;
    }

    plugin = new MapPluginHeat(map);
    plugin.setAllHeats(data);
    button.textContent = "Hide Heat";
  });
}

main().catch((error) => {
  console.error("plugin-heat failed", error);
});
