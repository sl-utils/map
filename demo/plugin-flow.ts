import { MapPluginFlow, SLUMap } from "../src/index.ts";

async function main() {
  const map = new SLUMap("map");
  await map.init({ type: "L" });

  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  document.body.append(toolbar);

  const button = document.createElement("button");
  button.className = "button";
  button.textContent = "Show Flow";
  toolbar.append(button);

  const response = await fetch("./assets/json/flow-global.json");
  const flowData = await response.json();
  let plugin: MapPluginFlow | undefined;

  button.addEventListener("click", () => {
    if (plugin) {
      plugin.onRemove();
      plugin = undefined;
      button.textContent = "Show Flow";
      return;
    }

    plugin = new MapPluginFlow(map, {
      pane: "flowPane",
      displayValues: true,
      unit: "m/s",
      angleConvention: "bearingCCW",
      emptyString: "No velocity data",
      maxVelocity: 15,
      colorScale: null,
    });
    plugin.setData(flowData);
    button.textContent = "Hide Flow";
  });
}

main().catch((error) => {
  console.error("plugin-flow failed", error);
});
