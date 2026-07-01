# map
注意事项：
1. 如果使用maplibre地图的自定义样式，自定义样式mapstyle-protomaps.json中需要将token替换为自己的token(protomaps官网中申请)
   sources.protomaps.tiles内 https://api.protomaps.com/tiles/v4/{z}/{x}/{y}.mvt?key=token

# css
注意事项：
1. 如果使用leaflet，需要引入leaflet的css文件 
   @import '@sl-utils/map/styles/leaflet.css';

2. 部分组件默认示例依赖assets,需要将assets文件夹中内容放入项目assets目录下 