import * as React from "react";
import * as Bar from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import MyBottomTab from "./src/tabs/bottomTab";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IonNeverNotificationRoot from "./src/components/IonNeverNotification/NotificationProvider";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";

const Stack = createNativeStackNavigator();
function App() {
  return (
    <IonNeverNotificationRoot>
      <NavigationContainer>
        <MyBottomTab></MyBottomTab>
        <Bar.StatusBar style="auto" />
      </NavigationContainer>
    </IonNeverNotificationRoot>
  );
}

export default App;
