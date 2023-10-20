import { useEffect, useState } from "react";
import { api } from "../apis/api";
import { Parser } from "cast.ts";
import { useToken } from "./useToken";
import { View, Text } from "react-native";

export function useGet<T>(url: string, parser: Parser<T>) {
  const { token } = useToken();
  const [state, setState] = useState<T>();
  const [error, setError] = useState("");

  const reload = async () => {
    try {
      const json = await api.get(url, parser, token);
      setState(json);
      setError("");
    } catch (error) {
      setError(String(error));
    }
  };

  useEffect(() => {
    reload();
  }, [url, token]);

  function render(fn: (data: T) => React.JSX.Element[] | React.JSX.Element) {
    if (error) {
      return (
        <View>
          <Text>{error}</Text>
        </View>
      );
    }
    if (!state) {
      return (
        <View>
          <Text>Loading ...</Text>
        </View>
      );
    }
    return fn(state);
  }

  return { state, setState, reload, render };
}
