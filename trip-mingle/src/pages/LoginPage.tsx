import { StyleSheet, Text, View } from "react-native";
import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screen/login";
import Register from "../screen/register";

const Stack = createStackNavigator();

export default function UserPage() {
  return (
    <Stack.Navigator
      initialRouteName="Test1"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
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
