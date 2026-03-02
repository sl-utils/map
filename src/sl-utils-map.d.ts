declare module '@sl-utils/map' {
  // 根据你的包实际导出的内容声明类型
  export function mapFunction<T>(array: T[], callback: (item: T) => any): any[];
  export const someValue: string;
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
  export class SLUMap {
    constructor(ele: string);
  }
}