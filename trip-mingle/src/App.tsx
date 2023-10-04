import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import MyTab from "./components/bottomTab";

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <MyTab></MyTab>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default App;
