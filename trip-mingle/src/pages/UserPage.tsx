import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UserPageTopTab from "../tabs/UserPageTopTab";
import { Avatar, Header } from "@rneui/themed";
import UserPageStyleSheet from "../StyleSheet/UserPageCss";

const Stack = createStackNavigator();

export default function UserPage() {
  return (
    <>
      <Header
        backgroundColor="white"
        centerComponent={{ text: "Header", style: UserPageStyleSheet.header }}
      ></Header>
      <View style={UserPageStyleSheet.container}>
        <Avatar
          size={120}
          rounded
          containerStyle={UserPageStyleSheet.AvatarContainer}
          source={require("../assets/yukimin.png")}
        />
        <Text style={UserPageStyleSheet.username}>Username</Text>
      </View>
      <UserPageTopTab></UserPageTopTab>
    </>
  );
}
