/**
 * Creates a function that sends messages to a web worker and returns a promise that resolves with the worker's response.
 * You can use this function to handle asynchronous operations in a web worker.
 * e.g.,
 * ```typescript
 * const asyncWorker = asynchronizeWorker(myWorker);
 * asyncWorker(arg1, arg2).then(result => {
 *   console.log(result);
 * }).catch(error => {
 *   console.error(error);
 * });
 * ```
 * @param worker - The worker instance to be used for asynchronous operations.
 * @returns A function that takes arguments for the worker and returns a promise.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function asynchronizeWorker<Args extends any[], R>(worker: Worker) {
  return (...param: Args): Promise<R> =>
    new Promise((resolve, reject) => {
      worker.onmessage = (event) => {
        resolve(event.data);
      };
      worker.onerror = (error) => {
        reject(error.message);
      };
      worker.addEventListener("close", () => {
        console.log("Worker has been terminated.");
      });
      worker.postMessage(param);
    });
}
