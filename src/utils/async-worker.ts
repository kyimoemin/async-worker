export function asynchronizeWorker(num: number): Promise<number> {
  const worker = new Worker(
    new URL("./fibonacci-worker.ts", import.meta.url).href,
    {
      type: "module",
    }
  );
  return new Promise((resolve, reject) => {
    worker.onmessage = (event) => {
      resolve(event.data);
    };
    worker.onerror = (error) => {
      reject(error.message);
    };
    worker.postMessage(num);
  });
}
