import { useCallback, useState } from "react";

export function InputForm({ onSubmit }: { onSubmit: (value: string) => void }) {
  const [value, setValue] = useState("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSubmit(value);
    },
    [onSubmit, value]
  );

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">Calculate</button>
    </form>
  );
}
