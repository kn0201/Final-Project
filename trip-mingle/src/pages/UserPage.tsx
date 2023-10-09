import { StyleSheet, Text, View } from "react-native";
import * as React from "react";
import MyTopTab from "../tabs/topTab";
import { createStackNavigator } from "@react-navigation/stack";
import Test1 from "../screen/login";
import Test2 from "../screen/register";

const Stack = createStackNavigator();

export default function UserPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Page</Text>
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
