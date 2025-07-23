import "./App.css";
import { MainThreadProcess } from "./components/mainthread-process";
import { MultiFuncWorkerThreadProcess } from "./components/multi-func-worker-process";
import { WorkerThreadProcess } from "./components/workerthread-proces";

function App() {
  return (
    <main>
      <MainThreadProcess />
      <WorkerThreadProcess />
      <MultiFuncWorkerThreadProcess />
    </main>
  );
}

export default App;
