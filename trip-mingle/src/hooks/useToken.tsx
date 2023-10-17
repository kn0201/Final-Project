import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { View, Text, SafeAreaView } from "react-native";
import { useEvent } from "react-use-event";
import decode from "jwt-decode";

type TokenEvent = {
  type: "token";
  token: string;
};

let token = "";

export type JWTPayload = {
  role: "member" | "admin";
  user_id: number;
  username: string;
};

export function useToken() {
  const [_, setState] = useState(token);
  // console.log({ useToken: token });

  const dispatch = useEvent<TokenEvent>("token", (event) => {
    setState(event.token);
  });
  return {
    token,
    payload: token ? decode<JWTPayload>(token) : null,
    setToken(value: string) {
      token = value;
      AsyncStorage.setItem("token", token);
      dispatch({ token });
    },
  };
}

export function TokenProvider(props: { children: any }) {
  const [state, setState] = useState({ status: "loading", token: "" });
  const { setToken } = useToken();
  useEffect(() => {
    AsyncStorage.getItem("token").then((value) => {
      let token = value || "";
      setState({ status: "ready", token });
      setToken(token);
    });
  }, []);
  if (state.status == "loading") {
    return (
      <SafeAreaView>
        <Text>Loading ...</Text>
      </SafeAreaView>
    );
  }
  return <>{props.children}</>;
}
