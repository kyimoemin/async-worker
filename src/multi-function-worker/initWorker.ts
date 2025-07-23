import type { RequestPayload, ResponsePayload } from "../type";

export type WorkerObject = Record<
  string | number | symbol,
  (...args: any[]) => any
>;

/**
 *
 * @param obj Object containing functions to be called in the worker.
 */
export const initWorker = <T extends WorkerObject>(obj: T) => {
  self.onmessage = async (event) => {
    const { func, args, id } = event.data as RequestPayload<
      Parameters<T[keyof T]>
    >;
    try {
      if (typeof obj[func] !== "function") {
        throw new Error(`Function '${String(func)}' not found in worker.`);
      }
      const result = await obj[func](...args);
      self.postMessage({ id, result });
    } catch (error) {
      const err = error as Error;
      const response: ResponsePayload = {
        id,
        error: {
          message: err?.message,
          stack: err?.stack,
          name: err?.name,
          // Only include cause if it's a string or primitive
          cause: typeof err?.cause === "string" ? err.cause : undefined,
        },
      };
      self.postMessage(response);
    }
  };
};
