import { fibonacci } from "./fibonacci";

self.onmessage = (event) => {
  const num = event.data;
  const result = fibonacci(num);
  self.postMessage(result);
};
