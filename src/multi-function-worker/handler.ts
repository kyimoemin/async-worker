/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 } from "uuid";
import type { ResponsePayload } from "../type";
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

  call<Func extends (...args: any[]) => any>(func: string) {
    return (...args: Parameters<Func>) =>
      new Promise<ReturnType<Func>>((resolve, reject) => {
        const id = v4();
        this.calls.set(id, { resolve, reject });
        this.worker.postMessage({ func, args, id });
      });
  }
}
