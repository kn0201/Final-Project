import { useEffect, useState } from "react";
import { api } from "../apis/api";
import { Parser } from "cast.ts";
import { useToken } from "./useToken";

export function useGet<T>(url: string, parser: Parser<T>) {
  const { token } = useToken();
  const [state, setState] = useState<T>();
  const reload = async () => {
    const json = await api.get(url, parser, token);
    setState(json);
  };
  useEffect(() => {
    reload();
  }, [url, token]);
  return { state, setState, reload };
}
