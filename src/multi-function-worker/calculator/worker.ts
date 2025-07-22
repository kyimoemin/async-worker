import type { RequestPayload, ResponsePayload } from "../../type";
import { calculator } from "./module";

self.onmessage = (event) => {
  const { func, args, id } = event.data as RequestPayload<
    keyof typeof calculator,
    [number, number]
  >;
  try {
    const result = calculator[func](...args);
    self.postMessage({ id, result });
  } catch (error: unknown) {
    const response: ResponsePayload = { id, error: error as Error };
    self.postMessage(response);
  }
};
