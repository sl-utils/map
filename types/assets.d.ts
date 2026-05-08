declare module '*?raw' {
  const content: string;
  export default content;
}
declare module '*?worker' {
  const workerConstructor: {
    new(): Worker;
  };

  export default workerConstructor;
}
declare module '*?url' {
  const url: string;
  export default url;
}