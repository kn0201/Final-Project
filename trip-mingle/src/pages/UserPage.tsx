import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import UserPageTopTab from "../tabs/UserPageTopTab";
import { Avatar, Header, Icon } from "@rneui/themed";
import UserPageStyleSheet from "../StyleSheet/UserPageCss";
import { iosBlue } from "../StyleSheet/StyleSheetHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useToken } from "../hooks/useToken";
import { api } from "../apis/api";
import { getIconResult } from "../utils/parser";

//@ts-ignore
export default function UserPage({ navigation }) {
  // let path = "e88faa97-9f5a-4551-8a48-f31827f57385.jpeg";
  // let path = "yukimin.png";
  const { token, payload, setToken } = useToken();
  const [iconPath, setIconPath] = useState("");
  const logout = async () => {
    setToken("");
    await AsyncStorage.removeItem("username");
    navigation.navigate("Home");
  };
  const getIcon = async () => {
    let json = await api.get("/user/icon", getIconResult, token);
    console.log(json);

    setIconPath("../../uploads/" + json.path);
  };
  useEffect(() => {
    getIcon();
  }, []);
  useEffect(() => {}, [iconPath]);
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
            size={150}
            rounded
            containerStyle={UserPageStyleSheet.AvatarContainer}
            // source={require("../../uploads/" + path)}
          />
          <Text style={UserPageStyleSheet.username}>{payload?.username}</Text>
          {/* <Image source={require(iconPath)} /> */}
        </View>
        <UserPageTopTab></UserPageTopTab>
      </KeyboardAvoidingView>
    </>
  );
}
