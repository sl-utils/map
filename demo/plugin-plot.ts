import { MapPluginPlot, SLUMap } from "../src/index.ts";

function createButton(text: string) {
  const button = document.createElement("button");
  button.className = "button";
  button.textContent = text;
  return button;
}

async function main() {
  const map = new SLUMap("map");
  await map.init({ type: "A" });

  const plugin = new MapPluginPlot(map, {
    plotOpt: {
      zIndex: 200,
      widthLine: 2,
      colorFill: "rgba(137,85,38,0.5)",
      colorLine: "#9c9b8a",
      dash: [15, 15],
      className: "plot",
    },
    editOpt: {
      colorFill: "#dc3926",
      colorLine: "#7C9B8A",
      size: 4,
    },
    textOpt: {
      colorFill: "#ee3e16",
      widthLine: 5,
      colorLine: "#0fe62b",
      ifShadow: true,
    },
  });

  const initialPlots = [
    {
      type: "polygon",
      colorFill: "rgba(37,155,138,0.5)",
      colorLine: "#2c9b8a",
      latLngs: [
        [22.8042, 114.1074],
        [22.7742, 114.1574],
        [22.7442, 114.1474],
        [22.6742, 113.6374],
      ],
      name: "sample-polygon",
    },
  ];

  plugin.setPlotList(initialPlots as any);

  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  document.body.append(toolbar);

  const plotListPanel = document.createElement("div");
  plotListPanel.className = "panel stack plot-list";
  document.body.append(plotListPanel);

  const actions: Array<[string, string]> = [
    ["Point", "point"],
    ["Circle", "circle"],
    ["Line", "line"],
    ["Rect", "rect"],
    ["Polygon", "polygon"],
  ];

  for (const [label, type] of actions) {
    const button = createButton(`Draw ${label}`);
    button.addEventListener("click", () => {
      plugin.open(type as any);
    });
    toolbar.append(button);
  }

  const saveButton = createButton("Save Plot");
  saveButton.addEventListener("click", () => {
    plugin.savePlot();
  });
  toolbar.append(saveButton);

  function renderPlotList(plotList: any[]) {
    plotListPanel.replaceChildren();

    const title = document.createElement("strong");
    title.textContent = "Saved plots";
    plotListPanel.append(title);

    if (plotList.length === 0) {
      const empty = document.createElement("div");
      empty.className = "muted";
      empty.textContent = "No plots";
      plotListPanel.append(empty);
      return;
    }

    plotList.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "row";

      const name = document.createElement("span");
      name.textContent = item.name || `${item.type}-${index + 1}`;

      const editButton = createButton("Edit");
      editButton.addEventListener("click", () => {
        plugin.setEditPlot(item);
      });

      const deleteButton = createButton("Delete");
      deleteButton.addEventListener("click", () => {
        plugin.delPlot(item);
      });

      row.append(name, editButton, deleteButton);
      plotListPanel.append(row);
    });
  }

  plugin.addCbPlotListChange((plotList) => {
    renderPlotList([...plotList]);
  });

  renderPlotList(initialPlots as any[]);
}

main().catch((error) => {
  console.error("plugin-plot failed", error);
});
