import { asynchronizeWorker } from "../asynchronize-worker";

const fibonacciWorker = new Worker(
  new URL("./worker.ts", import.meta.url).href,
  {
    type: "module",
  }
);
export const asyncWorkerFibonacci = asynchronizeWorker<[number], number>(
  fibonacciWorker
);
