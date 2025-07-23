/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 } from "uuid";
import type { ResponsePayload } from "../type";
type Calls = {
  resolve: (result?: any) => void;
  reject: (error: Error) => void;
  timeoutId?: ReturnType<typeof setTimeout>;
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
      const call = this.calls.get(id);
      if (!call) return;
      if (call.timeoutId) clearTimeout(call.timeoutId);
      if (error) {
        const e = new Error(error.message, { cause: error.cause });
        if (error.name) e.name = error.name;
        if (error.stack) e.stack = error.stack;
        call.reject(e);
      } else {
        call.resolve(result);
      }
      this.calls.delete(id);
    };

    this.worker.addEventListener("error", this.cleanup);
    this.worker.addEventListener("exit", this.cleanup);
    this.worker.addEventListener("close", this.cleanup);
  }

  cleanup = () => {
    const error = new Error("Worker was terminated or encountered an error.");
    for (const { reject } of this.calls.values()) {
      reject(error);
    }
    this.calls.clear();
  };

  /**
   * Calls a function in the worker with optional timeout.
   * @param func Function name in the worker
   * @param timeoutMs Optional timeout in milliseconds
   */
  call = <Func extends (...args: any[]) => any>(
    func: string,
    timeoutMs?: number
  ) => {
    return (...args: Parameters<Func>) =>
      new Promise<ReturnType<Func>>((resolve, reject) => {
        const id = v4();
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        if (timeoutMs && timeoutMs > 0) {
          timeoutId = setTimeout(() => {
            this.calls
              .get(id)
              ?.reject(new Error(`Worker call timed out after ${timeoutMs}ms`));
            this.calls.delete(id);
          }, timeoutMs);
        }
        this.calls.set(id, { resolve, reject, timeoutId });
        this.worker.postMessage({ func, args, id });
      });
  };
}
