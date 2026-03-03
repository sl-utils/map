declare module '@sl-utils/map' {
  /**leaflet 需要开发者在样式表中挂载leaflet样式 */
  export class SLUMap {
    constructor(ele: string);
  }
  // 添加其他导出...
  export class MapCanvasDraw {
    constructor();
  }
  export class MapCanvasEvent {
    constructor();
  }
  export class MapCanvasLayer {
    constructor();
  }
}