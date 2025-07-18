import { useCallback, useState } from "react";
import { InputForm } from "./input-form";
import { asyncWorkerFibonacci } from "../workers/fibonacci";

export function WorkerThreadProcess() {
  const [value, setValue] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);

  const calculateNumber = useCallback(async (num: string) => {
    try {
      setPending(true);
      const result = await asyncWorkerFibonacci(Number(num));
      setValue(result.toString());
    } catch (error) {
      console.error("Error calculating Fibonacci:", error);
    } finally {
      setPending(false);
    }
  }, []);

  return (
    <section>
      <h3>Worker thread process</h3>
      <InputForm onSubmit={calculateNumber} loading={pending} />
      <p>
        <span>Fibonacci:</span>
        {pending ? "Calculating..." : value}
      </p>
    </section>
  );
}
