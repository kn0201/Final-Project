import { useState } from "react";

export default function useBoolean(defaultValue: boolean = false) {
  const [value, setValue] = useState(defaultValue);
  function on() {
    setValue(true);
  }
  function off() {
    setValue(false);
  }
  function toggle() {
    setValue((value) => !value);
  }
  return {
    value,
    setValue,
    on,
    off,
    toggle,
  };
}

export type BooleanState = ReturnType<typeof useBoolean>;
