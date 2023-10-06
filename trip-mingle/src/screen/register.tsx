import * as React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";

//@ts-ignore
export default function Register({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>test2!</Text>
      <Button onPress={() => navigation.navigate("Test3")}>Login</Button>
      <Button mode="contained" onPress={() => navigation.goBack("Test1")}>
        Go Back
      </Button>
    </View>
  );
}
