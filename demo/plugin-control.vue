<script setup lang="ts">
/**地图控件-比例尺/当前层级/鼠标所在位置 */
import { SLUMap, MapPluginControl } from "@sl-utils/map";
import { ref, reactive, onMounted } from "vue";

/**控件数据 */
let data = reactive({
  lat: 0,
  lng: 0,
  zoom: 0,
  scale: 0,
  width: "0px",
});
const ifTran = ref(true);
let ctl: MapPluginControl | undefined;

onMounted(async () => {
  const slu = new SLUMap("map");
  await slu.init({ type: "L" });

  ctl = new MapPluginControl(slu.map, { ifTran: ifTran.value, precision: 5 });

  const info = ctl.init();
  const { lat, lng, zoom, scale, width } = info;
  Object.assign(data, { lat, lng, zoom, scale, width });

  ctl.onUpdate((info) => {
    const { lat, lng, zoom, scale, width } = info;
    Object.assign(data, { lat, lng, zoom, scale, width });
  });
});
/**切换经纬度模式 */
function onClickTran() {
  ifTran.value = !ifTran.value;
  const info = ctl?.setOptions({ ifTran: ifTran.value });
  const { lat, lng, zoom, scale, width } = info;
  Object.assign(data, { lat, lng, zoom, scale, width });
}
</script>

<template>
  <div id="map" class="card">
    <div class="latlng-scale">
      <div class="zoom-count">
        <span>{{ data.zoom }}级</span>
        <div class="scale" :style="{ width: data.width }">
          {{ data.scale }}
        </div>
      </div>
      <div class="lat-lng">
        <div class="lat">{{ data.lat }}</div>
        <div class="lng">{{ data.lng }}</div>
        <div class="tran" @click="onClickTran">
          <svg t="1773281510386" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4831" width="16" height="16"><path d="M947.368 607.782c-19.538-19.572-51.196-19.572-70.734 0l-58.855 58.98c-0.601 0.604-1.632 0.178-1.632-0.675V311.256c0-97.337-78.735-176.243-175.865-176.243-88.322 0-161.419 65.24-173.958 150.252a0.95 0.95 0 0 1-0.939 0.814h-0.018a0.956 0.956 0 0 0-0.956 0.955v427.063c0 41.714-33.747 75.532-75.371 75.532-41.63 0-75.372-33.818-75.372-75.532V236.678c0-0.528-0.064-1.07-0.073-1.557-0.232-12.572-6.916-28.194-16.49-37.788-19.623-19.664-58.22-16.88-77.844 2.784L77.139 342.542c-19.624 19.668-19.624 51.549 0 71.211 19.624 19.67 51.437 19.67 71.061 0l63.332-63.465c0.601-0.603 1.632-0.177 1.632 0.675v363.134c0 97.337 78.74 176.243 175.876 176.243 88.312 0 161.413-65.241 173.952-150.252a0.95 0.95 0 0 1 0.939-0.814h0.018a0.956 0.956 0 0 0 0.956-0.956V311.256c0-41.714 33.748-75.532 75.377-75.532 41.624 0 75.371 33.818 75.371 75.532v477.418c0 0.528 0.103 2.972 0.155 3.456 1.2 10.934 6.132 24.789 14.497 33.173 19.533 19.572 56.072 14.683 75.605-4.89L947.368 678.66c19.527-19.57 19.527-51.304 0-70.877z" p-id="4832"></path></svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  overflow: hidden;
}
.latlng-scale {
  font-size: 14px;
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 401;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
}

.lat-lng {
  padding: 2px 5px;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: flex-end;
  align-self: flex-end;
  align-items: center;
}
.lat {
  margin-left: 5px;
  margin-right: 10px;
}

.lng {
  padding-right: 10px;
}

.zoom-count {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 5px;
  padding: 3px;
  border-radius: 3px;
}
.scale {
  border: 1px solid #333;
  border-top-width: 0px;
  height: 10px;
  line-height: 0px;
  text-align: center;
  margin-right: 50px;
  margin-left: 25px;
  background-color: rgba(255, 255, 255, 0.3);
}

.tran {
  height: 24px;
  width: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #e2e9f8;
  cursor: pointer;
}
</style>
