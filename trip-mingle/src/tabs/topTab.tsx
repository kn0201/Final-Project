import { StyleSheet } from "react-native";
import * as React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import Test1 from "../screen/login";
import Test2 from "../screen/register";

const Tab = createMaterialTopTabNavigator();

export default function MyTopTab() {
  return (
    <Tab.Navigator
      initialRouteName="Test"
      screenOptions={{
        tabBarActiveTintColor: "#000000",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { backgroundColor: "white" },
      }}
    >
      <Tab.Screen
        name="test11"
        component={Test1}
        options={{ tabBarLabel: "test1" }}
      />
      <Tab.Screen
        name="Test22"
        component={Test2}
        options={{ tabBarLabel: "Test2" }}
      />
    </Tab.Navigator>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   title: {
//     display: "flex",
//     flexDirection: "row",
//     fontSize: 48,
//   },
// });
