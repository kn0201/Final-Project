import { Fragment, useEffect, useState } from "react";
import * as Bar from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import MyBottomTab from "./src/tabs/bottomTab";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IonNeverNotificationRoot from "./src/components/IonNeverNotification/NotificationProvider";
import {
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  SafeAreaView,
  Text,
} from "react-native";
import TestingApp from "./src/components/IonNeverNotification/testingApp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TokenProvider } from "./src/hooks/useToken";

const Stack = createNativeStackNavigator();

function Root() {
  return (
    <TokenProvider>
      <NavigationContainer>
        <IonNeverNotificationRoot>
          <MyBottomTab />
          <Bar.StatusBar style="auto" />
        </IonNeverNotificationRoot>
      </NavigationContainer>
    </TokenProvider>
  );
}

export default function App() {
  return (
    <Fragment>
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView>
          <Root />
        </KeyboardAvoidingView>
      ) : (
        <Root />
      )}
    </Fragment>
  );
}
