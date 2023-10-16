import { StyleSheet, Text, View } from "react-native";
import * as React from "react";
import { useToken } from "../hooks/useToken";
import { Button } from "react-native-paper";

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trip Mingle</Text>
      <Text style={styles.title}>伴</Text>
      <Text style={styles.title}>旅</Text>
      <Demo />
    </View>
  );
}

function Demo() {
  const { token, payload, setToken } = useToken();
  // console.log(token);

  return (
    <View>
      <Text>Token: {JSON.stringify(token)}</Text>
      <Text>Payload: {JSON.stringify(payload, null, 2)}</Text>
      <Button onPress={() => setToken("")}>
        <Text>logout</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    display: "flex",
    flexDirection: "row",
    fontSize: 48,
  },
});
