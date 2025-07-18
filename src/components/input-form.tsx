import { useCallback, useState } from "react";

export function InputForm({
  onSubmit,
  loading,
}: {
  onSubmit: (value: string) => void;
  loading: boolean;
}) {
  const [value, setValue] = useState("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = useCallback(
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
      <button type="submit" disabled={loading}>
        Calculate
      </button>
    </form>
  );
}
