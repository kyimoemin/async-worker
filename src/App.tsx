import "./App.css";
import { MainThreadProcess } from "./components/mainthread-process";
import { WorkerThreadProcess } from "./components/workerthread-proces";

function App() {
  return (
    <main>
      <MainThreadProcess />
      <WorkerThreadProcess />
    </main>
  );
}

export default App;
