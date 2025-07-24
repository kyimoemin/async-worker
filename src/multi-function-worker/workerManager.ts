export class WorkerManager {
  public readonly MAX_NON_BUSY_WORKERS: number;
  private workers: Array<WorkerInfo> = [];
  private readonly workerURL: URL;

  constructor(workerURL: URL, maxNonBusyWorkers: number = 5) {
    this.workerURL = workerURL;
    this.MAX_NON_BUSY_WORKERS = maxNonBusyWorkers;
  }

  private spawnWorker = () => {
    const worker = new Worker(this.workerURL, { type: "module" });
    this.workers.push(new WorkerInfo(worker));
    return worker;
  };

  getWorker = () => {
    this.removeNonBusyWorkers();
    const availableWorker = this.workers.find((workerInfo) => !workerInfo.busy);
    if (availableWorker) return availableWorker.worker;
    return this.spawnWorker();
  };

  private removeNonBusyWorkers = () => {
    const nonBusyWorkers = this.workers.filter(
      (workerInfo) => !workerInfo.busy
    );
    if (nonBusyWorkers.length <= this.MAX_NON_BUSY_WORKERS) return;
    const excessWorkers = nonBusyWorkers.slice(this.MAX_NON_BUSY_WORKERS);
    for (const workerInfo of excessWorkers) {
      workerInfo.worker.terminate();
      this.workers.splice(this.workers.indexOf(workerInfo), 1);
    }
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
