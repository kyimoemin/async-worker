/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 } from "uuid";
import type { ResponsePayload } from "../type";
type Calls = {
  resolve: (result?: any) => void;
  reject: (error: Error) => void;
};

/**
 * Handles asynchronous calls to a Web Worker.
 * It manages the communication between the main thread and the worker,
 * allowing functions to be called in the worker and returning results or errors.
 */
export class AsyncCallHandler {
  calls = new Map<string, Calls>();
  worker: Worker;

  constructor(worker: Worker) {
    this.worker = worker;
    this.worker.onmessage = (event) => {
      const { id, result, error } = event.data as ResponsePayload<any>;
      if (error) {
        const e = new Error(error.message, { cause: error.cause });
        if (error.name) e.name = error.name;
        if (error.stack) e.stack = error.stack;
        this.calls.get(id)?.reject(e);
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
