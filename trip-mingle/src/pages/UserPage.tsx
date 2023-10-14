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
import { removeToken } from "../utils/jwtToken";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

//@ts-ignore
export default function UserPage({ navigation }) {
  const logout = async () => {
    removeToken();
    await AsyncStorage.removeItem("username");
    navigation.navigate("Home");
  };
  const getUsername = async () => {
    try {
      const result = await AsyncStorage.getItem("username");
      if (result) {
        setUsername(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [username, setUsername] = useState("");
  useEffect(() => {
    getUsername();
  }, []);
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
          <Text style={UserPageStyleSheet.username}>{username}</Text>
        </View>
        <UserPageTopTab></UserPageTopTab>
      </KeyboardAvoidingView>
    </>
  );
}
