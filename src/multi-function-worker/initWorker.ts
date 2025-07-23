import type { RequestPayload, ResponsePayload } from "../type";

/**
 *
 * @param obj Object containing functions to be called in the worker.
 */
export const initWorker = <
  T extends Record<string | number | symbol, (...args: any[]) => any>
>(
  obj: T
) => {
  self.onmessage = (event) => {
    const { func, args, id } = event.data as RequestPayload<
      Parameters<T[keyof T]>
    >;
    try {
      const result = obj[func](...args);
      self.postMessage({ id, result });
    } catch (error) {
      const response: ResponsePayload = {
        id,
        error: {
          message: (error as Error)?.message,
          stack: (error as Error)?.stack,
          name: (error as Error)?.name,
          cause: (error as Error)?.cause, // Optional, if available
        },
      };
      self.postMessage(response);
    }
  };
};
