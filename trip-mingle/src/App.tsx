import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import MyBottomTab from "./tabs/bottomTab";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <MyBottomTab></MyBottomTab>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default App;
