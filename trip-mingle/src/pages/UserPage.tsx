import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import UserPageTopTab from "../tabs/UserPageTopTab";
import { Avatar, Header, Icon } from "@rneui/themed";
import UserPageStyleSheet from "../StyleSheet/UserPageCss";
import { iosBlue } from "../StyleSheet/StyleSheetHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useToken } from "../hooks/useToken";

//@ts-ignore
export default function UserPage({ navigation }) {
  const { token, payload, setToken } = useToken();
  const logout = async () => {
    setToken("");
    await AsyncStorage.removeItem("username");
    navigation.navigate("Home");
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={{ flex: 2 }}
      >
        <Header
          backgroundColor="white"
          centerComponent={{
            text: "User",
            style: UserPageStyleSheet.header,
          }}
          rightComponent={
            <View>
              <TouchableOpacity
                style={UserPageStyleSheet.rightComponent}
                onPress={logout}
              >
                <Text style={{ color: iosBlue }}>Logout</Text>
                <Icon
                  name="logout"
                  type="material-community"
                  color={iosBlue}
                ></Icon>
              </TouchableOpacity>
            </View>
          }
        ></Header>
        <View style={UserPageStyleSheet.container}>
          <Avatar
            size={120}
            rounded
            containerStyle={UserPageStyleSheet.AvatarContainer}
            source={require("../assets/yukimin.png")}
          />
          <Text style={UserPageStyleSheet.username}>{payload?.username}</Text>
        </View>
        <UserPageTopTab></UserPageTopTab>
      </KeyboardAvoidingView>
    </>
  );
}
