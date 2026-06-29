import { MapPluginDraw, SLUMap } from "../src/index.ts";

function createButton(text: string) {
  const button = document.createElement("button");
  button.className = "button";
  button.textContent = text;
  return button;
}

async function main() {
  const map = new SLUMap("map");
  await map.init({ type: "A" });

  const draw = new MapPluginDraw(map);
  draw.addRect({
    lnglats: [
      [110.5, 26.3],
      [112.5, 27.3],
    ],
    maxZoom: 18,
    width: 500,
    height: 50,
  });
  draw.addArc({
    lnglat: [114.0, 22.5],
    size: 100,
  });

  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  document.body.append(toolbar);

  const toggleControl = createButton("Open Control");
  toolbar.append(toggleControl);

  const panel = document.createElement("div");
  panel.className = "panel stack control-panel";
  panel.hidden = true;
  panel.innerHTML = `
    <div class="row"><strong>Map Control</strong></div>
    <div class="row"><span class="muted">Zoom</span><span data-field="zoom">--</span></div>
    <div class="row"><span class="muted">Lat</span><span data-field="lat">--</span></div>
    <div class="row"><span class="muted">Lng</span><span data-field="lng">--</span></div>
    <div class="row"><span class="muted">Scale</span><span data-field="scale-label">--</span></div>
    <div class="scale-bar" data-field="scale-bar"></div>
  `;
  document.body.append(panel);

  const toggleFormat = createButton("Use Decimal");
  panel.append(toggleFormat);

  const fields = {
    zoom: panel.querySelector<HTMLElement>('[data-field="zoom"]')!,
    lat: panel.querySelector<HTMLElement>('[data-field="lat"]')!,
    lng: panel.querySelector<HTMLElement>('[data-field="lng"]')!,
    scaleLabel: panel.querySelector<HTMLElement>('[data-field="scale-label"]')!,
    scaleBar: panel.querySelector<HTMLElement>('[data-field="scale-bar"]')!,
  };

  let showControl = false;
  let useDms = true;

  function renderControl(info: any) {
    fields.zoom.textContent = String(info.zoom ?? "--");
    fields.lat.textContent = String(info.lat ?? "--");
    fields.lng.textContent = String(info.lng ?? "--");
    fields.scaleLabel.textContent = String(info.scale ?? "--");
    fields.scaleBar.textContent = String(info.scale ?? "");
    fields.scaleBar.style.width = String(info.width ?? "0px");
  }

  toggleControl.addEventListener("click", () => {
    showControl = !showControl;
    toggleControl.textContent = showControl ? "Close Control" : "Open Control";
    panel.hidden = !showControl;

    if (!showControl) {
      map.closeControl();
      return;
    }

    renderControl(map.openControl(useDms));
    map.onControlUpdate(renderControl);
  });

  toggleFormat.addEventListener("click", () => {
    useDms = !useDms;
    toggleFormat.textContent = useDms ? "Use Decimal" : "Use DMS";
    renderControl(map.changeLatlngFormat(useDms));
  });
}

main().catch((error) => {
  console.error("plugin-draw failed", error);
});
