import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Avatar } from "@rneui/themed";
import LoginScreenStyleSheet from "../StyleSheet/LoginScreenCss";
import { LoginInfo } from "../utils/types";
import { api } from "../apis/api";
import { nullable, number, object, string } from "cast.ts";
import { center, flex, iosBlue } from "../StyleSheet/StyleSheetHelper";
import { loginResultParser } from "../utils/parser";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import { storeToken } from "../utils/jwtToken";
import { AsyncResource } from "async_hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
//@ts-ignore

export default function LoginScreen({ navigation, setCheckToken }) {
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();

  const [showPassword, setPassword] = useState(true);
  const password = () => {
    setPassword(!showPassword);
  };

  const clearInputs = useRef({
    username() {},
    password() {},
  }).current;

  const loginInfo = useRef<LoginInfo>({
    username: "",
    password: "",
  }).current;

  const updateInputText = (field: string, value: string) => {
    loginInfo[field as keyof LoginInfo] = value;
  };

  const toUserPage = () => {
    navigation.navigate("Users");
  };
  const login = async () => {
    try {
      let json = await api.post("/login", loginInfo, loginResultParser);
      Object.entries(clearInputs).map(([_key, clear]) => clear());
      storeToken(json.token);

      await AsyncStorage.setItem("username", json.username);
      IonNeverDialog.show({
        type: "success",
        title: "Welcome Back",
        message: json.username,
        firstButtonVisible: true,
        firstButtonFunction: () => {
          toUserPage();
        },
      });
    } catch (error) {
      const errorObject: any = { ...(error as object) };
      console.log(errorObject);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={LoginScreenStyleSheet.container}>
        <View style={LoginScreenStyleSheet.center}>
          <Avatar
            size={150}
            rounded
            containerStyle={{
              backgroundColor: "#ffffff",
            }}
            source={require("../assets/yukimin.png")}
          />

          <Text style={LoginScreenStyleSheet.welcome}>Welcome</Text>
          <Text style={{ marginBottom: 16 }}>
            Log in to explore more feature
          </Text>
        </View>
        <View style={LoginScreenStyleSheet.input}>
          <Icon
            style={{
              display: flex,
              justifyContent: "flex-start",
              marginEnd: 4,
            }}
            name="account-outline"
            size={20}
          />
          <TextInput
            ref={(input: any) => {
              clearInputs.username = () => input?.clear();
            }}
            onChangeText={(text: string) => updateInputText("username", text)}
            onEndEditing={() => Keyboard.dismiss()}
            style={{ display: flex, width: 320 }}
            autoCapitalize="none"
            placeholder="Username"
          ></TextInput>
          <Icon
            style={{ display: flex, justifyContent: "flex-end" }}
            name="close"
            size={20}
            onPress={() => clearInputs.username()}
          />
        </View>
        <View style={LoginScreenStyleSheet.input}>
          <Icon
            style={{
              display: flex,
              justifyContent: "flex-start",
              marginEnd: 4,
            }}
            name="lock-outline"
            size={20}
          />
          <TextInput
            style={{ display: flex, width: 320 }}
            ref={(input: any) => {
              clearInputs.password = () => input?.clear();
            }}
            onChangeText={(text: string) => updateInputText("password", text)}
            placeholder="Password"
            secureTextEntry={showPassword}
            clearTextOnFocus={true}
          ></TextInput>
          <Icon
            style={{ display: flex, justifyContent: "flex-end" }}
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={20}
            onPress={password}
          />
        </View>
        <View style={{ width: "100%" }}>
          <Text style={LoginScreenStyleSheet.forgotPW}>Forgot Password?</Text>
        </View>

        <View style={LoginScreenStyleSheet.center}>
          <TouchableOpacity style={LoginScreenStyleSheet.login} onPress={login}>
            <Text style={LoginScreenStyleSheet.loginText}>Continue</Text>
          </TouchableOpacity>
        </View>

        <View style={LoginScreenStyleSheet.signUpContainer}>
          <Text>Don't have an account?</Text>
          <Text
            style={LoginScreenStyleSheet.signUp}
            onPress={() => navigation.navigate("Register")}
          >
            Sign up
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
