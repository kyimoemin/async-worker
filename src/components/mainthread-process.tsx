import { useCallback, useState } from "react";
import { InputForm } from "./input-form";
import { fibonacci } from "../utils/fibonacci";
import { asynchronize } from "../utils/async";

export function MainThreadProcess() {
  const [value, setValue] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);

  const calculateNumber = useCallback(async (num: string) => {
    try {
      setPending(true);
      const result = await asynchronize(() => fibonacci(Number(num)));
      setValue(result.toString());
    } catch (error) {
      console.error("Error calculating Fibonacci:", error);
    } finally {
      setPending(false);
    }
  }, []);

  return (
    <section>
      <h3>Main thread process</h3>
      <InputForm onSubmit={calculateNumber} />
      <p>
        <span>Fibonacci:</span>
        {pending ? "Calculating..." : value}
      </p>
    </section>
  );
}
