export function asynchronizeWorker(
  worker: Worker,
  num: number
): Promise<number> {
  return new Promise((resolve, reject) => {
    worker.onmessage = (event) => {
      resolve(event.data);
    };
    worker.onerror = (error) => {
      reject(error.message);
    };
    worker.addEventListener("close", () => {
      console.log("Worker has been terminated.");
    });
    worker.postMessage(num);
  });
}
