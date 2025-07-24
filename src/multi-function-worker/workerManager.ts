export class WorkerManager {
  public readonly MAX_NON_BUSY_WORKERS: number;
  private workers: Map<Worker, WorkerInfo> = new Map();
  private readonly workerURL: URL;

  constructor(workerURL: URL, maxNonBusyWorkers: number = 5) {
    this.workerURL = workerURL;
    this.MAX_NON_BUSY_WORKERS = maxNonBusyWorkers;
  }

  private spawnWorker = () => {
    const worker = new Worker(this.workerURL, { type: "module" });
    this.workers.set(worker, new WorkerInfo(worker));
    return worker;
  };

  getWorker = () => {
    this.removeNonBusyWorkers();
    for (const workerInfo of this.workers.values()) {
      if (!workerInfo.busy) return workerInfo.worker;
    }
    return this.spawnWorker();
  };

  private removeNonBusyWorkers = () => {
    const nonBusyWorkers: WorkerInfo[] = [];
    for (const workerInfo of this.workers.values()) {
      if (!workerInfo.busy) nonBusyWorkers.push(workerInfo);
    }
    if (nonBusyWorkers.length <= this.MAX_NON_BUSY_WORKERS) return;
    const excessWorkers = nonBusyWorkers.slice(this.MAX_NON_BUSY_WORKERS);
    for (const workerInfo of excessWorkers) {
      workerInfo.worker.terminate();
      this.workers.delete(workerInfo.worker);
    }
  };

  terminateWorker = (worker: Worker) => {
    const workerInfo = this.workers.get(worker);
    if (workerInfo) {
      workerInfo.worker.terminate();
      this.workers.delete(worker);
    }
  };

  cleanup = () => {
    for (const workerInfo of this.workers.values()) {
      workerInfo.worker.terminate();
    }
    this.workers.clear();
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
