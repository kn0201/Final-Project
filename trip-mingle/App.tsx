import { Fragment } from "react";
import * as Bar from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import MyBottomTab from "./src/tabs/bottomTab";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IonNeverNotificationRoot from "./src/components/IonNeverNotification/NotificationProvider";
import { KeyboardAvoidingView, Platform, Dimensions } from "react-native";
import TestingApp from "./src/components/IonNeverNotification/testingApp";

const Stack = createNativeStackNavigator();

function RootApp() {
  return (
    <NavigationContainer>
      <IonNeverNotificationRoot>
        <MyBottomTab />
        <Bar.StatusBar style="auto" />
      </IonNeverNotificationRoot>
    </NavigationContainer>
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
