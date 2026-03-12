import { createApp } from 'vue'
import './style.css'
/**绘制 */
// import App from './plugin-draw.vue';
/**标绘 */
// import App from './plugin-plot.vue';
/**测距 */
// import App from './plugin-range.vue';
/**轨迹 */
// import App from './plugin-track.vue';
/**风场 */
// import App from './plugin-wind.vue';
/**流场 */
// import App from './plugin-flow.vue';
/**浪场 */
// import App from './plugin-wave.vue';
/**热力图 */
// import App from './plugin-heat.vue';
/**动态箭头线 */
// import App from './plugin-arrow-line.vue';
/**大数据渲染 */
// import App from './plugin-big-data.vue';
/**leaflet的粒子效果 */
// import App from './plugin-partial.vue';
/**雷达 */
// import App from './plugin-radar.vue';
/**地图控件-比例尺/当前层级/鼠标所在位置 */
import App from './plugin-control.vue';

createApp(App).mount('#app')
