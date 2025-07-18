import { fibonacci } from "../utils/fibonacci.ts";

self.onmessage = (event) => {
  const num = event.data;
  const result = fibonacci(num);
  self.postMessage(result);
};
