import { MapPluginWind, SLUMap } from "../src/index.ts";

async function main() {
  const map = new SLUMap("map");
  await map.init({ type: "M" });

  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  document.body.append(toolbar);

  const button = document.createElement("button");
  button.className = "button";
  button.textContent = "Show Wind";
  toolbar.append(button);

  const windResponse = await fetch("./assets/json/wind-global.json");
  const windData = await windResponse.json();
  const iconUrl = new URL("./assets/icons/icon-28.png", import.meta.url).href;
  let plugin: MapPluginWind | undefined;

  const options = {
    size: [28, 28] as [number, number],
    zooMsize: [
      [6, 6],
      [6, 6],
      [6, 6],
      [6, 6],
      [8, 8],
      [8, 8],
      [12, 12],
      [16, 16],
      [22, 22],
      [28, 28],
      [28, 28],
      [28, 28],
      [32, 32],
      [32, 32],
      [32, 32],
      [32, 32],
      [32, 32],
      [32, 32],
      [32, 32],
      [32, 32],
      [32, 32],
      [32, 32],
      [32, 32],
      [32, 32],
    ],
    pane: "windPane",
  };

  function iconResolver(speed: number) {
    const level =
      speed < 0.3 ? 0 :
      speed < 1.6 ? 1 :
      speed < 3.4 ? 2 :
      speed < 5.5 ? 3 :
      speed < 8.0 ? 4 :
      speed < 10.8 ? 5 :
      speed < 13.9 ? 6 :
      speed < 17.2 ? 7 :
      speed < 20.8 ? 8 :
      speed < 24.5 ? 9 :
      speed < 28.5 ? 10 :
      speed < 32.7 ? 11 : 12;

    const pos = [level + 2, 1];

    return {
      url: iconUrl,
      size: [28, 28] as [number, number],
      sizeo: [28, 28] as [number, number],
      posX: pos[0] * 29,
      posY: pos[1] * 29,
    };
  }

  button.addEventListener("click", () => {
    if (plugin) {
      plugin.onRemove();
      plugin = undefined;
      button.textContent = "Show Wind";
      return;
    }

    plugin = new MapPluginWind(map, options as any);
    plugin.setIconResolver(iconResolver as any);
    plugin.setData(windData);
    button.textContent = "Hide Wind";
  });
}

main().catch((error) => {
  console.error("plugin-wind failed", error);
});
