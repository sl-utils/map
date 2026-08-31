import { MapPluginTrack, SLMap } from "../src/index.ts";

function formatToMapItemTrack(originDataItem: any, itemMapping: Record<string, string>) {
  const trackItem: Record<string, unknown> = {};
  Object.keys(itemMapping).forEach((key) => {
    trackItem[key] = originDataItem[itemMapping[key]];
  });
  return trackItem;
}

function formatToMapTrackGroup(
  originDataGroup: any,
  groupMapping: Record<string, string>,
  itemMapping: Record<string, string>,
) {
  const trackGroup: Record<string, unknown> = {};
  Object.keys(groupMapping).forEach((key) => {
    trackGroup[key] = originDataGroup[groupMapping[key]];
  });

  const trackList = originDataGroup[groupMapping.data];
  if (Array.isArray(trackList)) {
    trackGroup.data = trackList.map((item) => formatToMapItemTrack(item, itemMapping));
  }

  trackGroup.orginData = originDataGroup;
  return trackGroup;
}

async function main() {
  const map = new SLMap("map");
  await map.init({ type: "L" });

  const plugin = new MapPluginTrack(map);
  const response = await fetch("./assets/json/track-chunk.json");
  const rawData = await response.json();

  const tracks = Object.keys(rawData).map((key) => {
    const element = rawData[key];
    element.POSITIONS.forEach((position: any) => {
      position.LAT = Number(position.LAT);
      position.LON = Number(position.LON);
      position.SPEED = Number(position.SPEED);
      position.EPOCH = Number(position.EPOCH);
    });

    return formatToMapTrackGroup(
      element,
      { id: "SHIP_ID", name: "SHIPNAME", data: "POSITIONS" },
      {
        lat: "LAT",
        lng: "LON",
        timeStamp: "EPOCH",
        speed: "SPEED",
        course: "COURSE",
      },
    );
  });

  plugin.setTracks(tracks as any);

  const lnglats = tracks
    .map((track: any) => track.data?.[0])
    .filter(Boolean)
    .map((point: any) => [point.lng, point.lat]);

  if (lnglats.length > 0) {
    const maxLat = Math.max(...lnglats.map((item) => item[1]));
    const minLat = Math.min(...lnglats.map((item) => item[1]));
    const maxLng = Math.max(...lnglats.map((item) => item[0]));
    const minLng = Math.min(...lnglats.map((item) => item[0]));

    map.setFitView([[minLng, minLat], [maxLng, maxLat],]);
  }

  plugin.addCbClickPoint((event) => {
    console.log("track point clicked", event);
  });

  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  document.body.append(toolbar);

  const button = document.createElement("button");
  button.className = "button";
  button.textContent = "Show Track";
  toolbar.append(button);

  let visible = false;
  button.addEventListener("click", () => {
    visible = !visible;
    plugin.setIfShow(visible);
    button.textContent = visible ? "Hide Track" : "Show Track";
  });
}

main().catch((error) => {
  console.error("plugin-track failed", error);
});
