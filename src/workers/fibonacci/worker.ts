import { fibonacci } from "../../utils/fibonacci.ts";

self.onmessage = (event) => {
  const num: [number] = event.data;
  const result = fibonacci(...num);
  self.postMessage(result);
};
