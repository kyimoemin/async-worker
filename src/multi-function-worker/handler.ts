import { v4 } from "uuid";
import type { RequestPayload, ResponsePayload } from "../type";
type Calls = {
  resolve: (result?: any) => void;
  reject: (error: Error) => void;
};

export class AsyncCallHandler {
  calls = new Map<string, Calls>();
  worker: Worker;

  constructor(worker: Worker) {
    this.worker = worker;
    this.worker.onmessage = (event) => {
      const { id, result, error } = event.data as ResponsePayload<any>;
      if (error) {
        this.calls.get(id)?.reject(error);
      } else {
        this.calls.get(id)?.resolve(result);
      }
      this.calls.delete(id);
    };
  }

  call<Func extends string, Args extends unknown[], R = void>(
    payload: Omit<RequestPayload<Func, Args>, "id">
  ): Promise<R> {
    return new Promise((resolve, reject) => {
      const id = v4();
      this.calls.set(id, { resolve, reject });
      this.worker.postMessage({ ...payload, id });
    });
  }
}
