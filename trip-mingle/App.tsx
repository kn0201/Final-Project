import { Fragment } from "react";
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
  View,
  Dimensions,
} from "react-native";
import TestingApp from "./src/components/IonNeverNotification/testingApp";

const Stack = createNativeStackNavigator();

function RootApp() {
  const { width, height } = Dimensions.get("screen");

  return (
    <IonNeverNotificationRoot>
      <NavigationContainer>
        <MyBottomTab />
        <Bar.StatusBar style="auto" />
      </NavigationContainer>
    </IonNeverNotificationRoot>
  );
}

function App() {
  return (
    <Fragment>
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView>
          <RootApp />
        </KeyboardAvoidingView>
      ) : (
        <RootApp />
      )}
    </Fragment>
  );
}

export default App;
