import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import MyBottomTab from "./src/tabs/bottomTab";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IonNeverNotificationRoot from "./src/components/IonNeverNotification/NotificationProvider";

const Stack = createNativeStackNavigator();
function App() {
  return (
    <IonNeverNotificationRoot>
      <NavigationContainer>
        <MyBottomTab></MyBottomTab>
        <StatusBar style="auto" />
      </NavigationContainer>
    </IonNeverNotificationRoot>
  );
}

export default App;
