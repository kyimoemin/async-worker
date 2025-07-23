/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 } from "uuid";
import type { ResponsePayload } from "../type";
import type { WorkerObject } from "./initWorker";
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
export class AsyncCallHandler<T extends WorkerObject> {
  private calls = new Map<string, Calls>();
  private worker: Worker;

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

  private cleanup = () => {
    const error = new Error("Worker was terminated or encountered an error.");
    for (const { reject } of this.calls.values()) {
      reject(error);
    }
    this.calls.clear();
  };

  /**
   * Calls a function in the worker with optional timeout.
   * @param funcName Function name in the worker
   * @param timeoutMs Optional timeout in milliseconds
   */
  func = <K extends keyof T>(funcName: K, timeoutMs?: number) => {
    return (...args: Parameters<T[K]>) =>
      new Promise<ReturnType<T[K]>>((resolve, reject) => {
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
        this.worker.postMessage({ func: funcName, args, id });
      });
  };
  /**
   * Terminates the worker and cleans up all pending calls.
   * This method removes all event listeners and clears the calls map.
   * It should be called when the worker is no longer needed to prevent memory leaks.
   */
  terminate = () => {
    this.worker.removeEventListener("error", this.cleanup);
    this.worker.removeEventListener("exit", this.cleanup);
    this.worker.removeEventListener("close", this.cleanup);
    this.cleanup();
    this.worker.terminate();
  };
}
