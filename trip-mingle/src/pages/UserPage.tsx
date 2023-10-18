import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

import UserPageTopTab from "../tabs/UserPageTopTab";
import { Avatar, Header, Icon } from "@rneui/themed";
import UserPageStyleSheet from "../StyleSheet/UserPageCss";
import { iosBlue, white } from "../StyleSheet/StyleSheetHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { useToken } from "../hooks/useToken";

import { getIconResult } from "../utils/parser";
import { apiOrigin } from "../utils/apiOrigin";
import { useGet } from "../hooks/useGet";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ProfileScreenStyleSheet from "../StyleSheet/ProfileScreenCss";

//@ts-ignore
export default function UserPage({ navigation }) {
  const { token, payload, setToken } = useToken();
  const [editableIcon, setEditableIcon] = useState(false);

  const editProfile = "Edit Profile";
  const submitProfile = "Submit";

  const logout = async () => {
    setToken("");
    await AsyncStorage.removeItem("username");
    navigation.navigate("Home");
  };

  let result = useGet("/user/icon", getIconResult).state?.path;
  console.log(result);

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
            source={
              result == null
                ? require("../assets/yukimin.png")
                : {
                    uri: `${apiOrigin}/${result}`,
                  }
            }
          />
          <Text style={UserPageStyleSheet.username}>{payload?.username}</Text>
        </View>
        <UserPageTopTab></UserPageTopTab>
      </KeyboardAvoidingView>
    </>
  );
}
