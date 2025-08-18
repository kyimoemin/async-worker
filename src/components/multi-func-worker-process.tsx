import { useState } from "react";
import { calculator } from "../lib-worker/index";

export function MultiFuncWorkerThreadProcess() {
  const [value, setValue] = useState<string>("");
  const [num1, setNum1] = useState<string>("");
  const [num2, setNum2] = useState<string>("");

  return (
    <section>
      <h3>Multi Function Worker thread process</h3>
      <div>
        <input
          type="text"
          value={num1}
          onChange={(e) => setNum1(e.target.value)}
        />
        <input
          type="text"
          value={num2}
          onChange={(e) => setNum2(e.target.value)}
        />
      </div>
      <button
        onClick={async () => {
          const result = await calculator.add(Number(num1), Number(num2));
          setValue(result.toString());
        }}
      >
        +
      </button>
      <button
        onClick={async () => {
          const result = await calculator.subtract(Number(num1), Number(num2));
          setValue(result.toString());
        }}
      >
        -
      </button>
      <button
        onClick={async () => {
          const result = await calculator.multiply(Number(num1), Number(num2));
          setValue(result.toString());
        }}
      >
        x
      </button>
      <button
        onClick={async () => {
          const result = await calculator.divide(Number(num1), Number(num2));
          setValue(result.toString());
        }}
      >
        /
      </button>
      <button
        onClick={async () => {
          const result = await calculator.modulus(Number(num1), Number(num2));
          setValue(result.toString());
        }}
      >
        %
      </button>
      <button
        onClick={async () => {
          const result = await calculator.fibonacci(Number(num1));
          setValue(result.toString());
        }}
      >
        φ
      </button>
      <p>
        <span>Result:</span>
        {value}
      </p>
    </section>
  );
}
