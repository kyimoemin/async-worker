export class WorkerManager {
  private workers: Array<WorkerInfo> = [];
  private readonly workerURL: URL;

  constructor(workerURL: URL) {
    this.workerURL = workerURL;
  }

  private spawnWorker = () => {
    const worker = new Worker(this.workerURL, { type: "module" });
    this.workers.push(new WorkerInfo(worker));
    return worker;
  };

  getWorker = () => {
    const availableWorker = this.workers.find((workerInfo) => !workerInfo.busy);
    if (availableWorker) return availableWorker.worker;
    return this.spawnWorker();
  };

  terminateWorker = (worker: Worker) => {
    const workerInfo = this.workers.find(
      (workerInfo) => workerInfo.worker === worker
    );
    if (workerInfo) {
      workerInfo.worker.terminate();
      this.workers.splice(this.workers.indexOf(workerInfo), 1);
    }
  };

  cleanup = () => {
    for (const workerInfo of this.workers) workerInfo.worker.terminate();
    this.workers = [];
  };
}

class WorkerInfo {
  public readonly worker: Worker;
  busy: boolean;

  constructor(worker: Worker) {
    this.worker = worker;
    this.busy = false;
  }
}
