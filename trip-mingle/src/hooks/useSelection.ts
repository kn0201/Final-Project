import { useState } from "react";

export function useSelection<T>() {
  const [state, setState] = useState<T[]>([]);
  function includes(value: T) {
    return state.includes(value);
  }
  function add(value: T) {
    if (includes(value)) return;
    setState([...state, value]);
  }
  function remove(value: T) {
    if (includes(value)) {
      setState(state.filter((each) => each !== value));
    }
  }
  function toggle(value: T) {
    if (includes(value)) {
      setState(state.filter((each) => each !== value));
    } else {
      setState([...state, value]);
    }
  }
  return {
    state,
    setState,
    includes,
    add,
    remove,
    toggle,
  };
}
