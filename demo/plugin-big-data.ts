import { MapPluginBigData, SLUMap } from "../src/index.ts";

function getShipImgPosByTypeCode(shipCode: string) {
  let posX = 0;
  let posY = 0;

  switch (shipCode) {
    case "1":
      posX = 204;
      posY = 272;
      break;
    case "2":
      posX = 221;
      posY = 272;
      break;
    case "3":
      posX = 238;
      posY = 272;
      break;
    case "4":
      posX = 34;
      posY = 289;
      break;
    case "5":
      posX = 0;
      posY = 289;
      break;
    case "6":
      posX = 17;
      posY = 289;
      break;
    case "7":
      posX = 51;
      posY = 289;
      break;
    case "8":
      posX = 68;
      posY = 289;
      break;
  }

  return { posX, posY };
}

function transformShipImage(item: any) {
  const code = item.shipTypeCode || "8";
  const { posX, posY } = getShipImgPosByTypeCode(code);

  return {
    info: { ...item, typeCode: `A${code}` },
    url: new URL("./assets/icons/icon-16.png", import.meta.url).href,
    lnglat: [item.lng, item.lat],
    size: [16, 16],
    sizeo: [16, 16],
    rotate: item.cog,
    posX,
    posY,
    type: ["click", "dblclick"],
  };
}

async function main() {
  const map = new SLUMap("map");
  await map.init({ type: "L" });
  map.setFitView([[118.05103, 38.925008], [117.555, 38.94],]);

  const plugin = new MapPluginBigData(map, {
    zIndex: 299,
    zoomOption: {
      1: { maxCount: 2, minBound: [22, 22] },
      12: { maxCount: 2, minBound: [100, 100] },
      14: { maxCount: -1 },
    },
  });

  const response = await fetch("/assets/json/ship.json");
  const shipData = await response.json();
  const images = shipData.map(transformShipImage);

  plugin.setbigDataImgs(images);
}

main().catch((error) => {
  console.error("plugin-big-data failed", error);
});
