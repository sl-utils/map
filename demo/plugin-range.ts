import { MapPluginRange, SLMap } from "../src/index.ts";

async function main() {
  const map = new SLMap("map");
  await map.init({ type: "L" });

  const plugin = new MapPluginRange(map);

  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  document.body.append(toolbar);

  const button = document.createElement("button");
  button.className = "button";
  button.textContent = "Open Measure";
  toolbar.append(button);

  button.addEventListener("click", () => {
    plugin.open();
  });
}

main().catch((error) => {
  console.error("plugin-range failed", error);
});
