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
 * A generic handler for making asynchronous function calls to a Web Worker.
 *
 * This class manages communication between the main thread and a worker, allowing you to call worker-exposed functions as Promises.
 * It handles message passing, result/error propagation, timeouts, and worker cleanup.
 *
 * @template T - The type describing the functions exposed by the worker (should extend WorkerObject).
 *
 * @example
 *
 * ```typescript
 * // Suppose your worker exposes an 'add' function:
 * type MyWorker = { add: (a: number, b: number) => number };
 * const handler = new AsyncCallHandler<MyWorker>(workerUrl);
 * const add = handler.func('add');
 * const result = await add(1, 2); // result is 3
 * ```
 * @see func for calling worker functions
 * @see terminate for cleanup
 */
export class AsyncCallHandler<T extends WorkerObject> {
  private calls = new Map<string, Calls>();
  private worker: Worker;

  constructor(workerURL: URL) {
    this.worker = new Worker(workerURL, { type: "module" });
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
    console.log("Cleaning up worker calls");
    const error = new Error("Worker was terminated or encountered an error.");
    for (const { reject } of this.calls.values()) {
      reject(error);
    }
    this.calls.clear();
  };

  /**
   * Returns a function that calls a method in the worker asynchronously with optional timeout.
   *
   * @template K - The key of the function in the worker object.
   * @param funcName - The name of the function to call in the worker.
   * @param timeoutMs - Optional timeout in milliseconds (default: 5000ms).
   * @returns A function that, when called with arguments, returns a Promise resolving to the result of the worker function.
   *
   * @example
   * const add = handler.func('add');
   * const result = await add(1, 2);
   */
  func = <K extends keyof T>(funcName: K, timeoutMs: number = 5000) => {
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
