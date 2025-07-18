export const fibonacciWorker = new Worker(
  new URL("./fibonacci-worker.ts", import.meta.url).href,
  {
    type: "module",
  }
);
