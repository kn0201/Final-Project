import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Avatar } from "@rneui/themed";
import LoginScreenStyleSheet from "../StyleSheet/LoginScreenCss";
import { LoginInfo } from "../utils/types";
import { api } from "../apis/api";
import { flex } from "../StyleSheet/StyleSheetHelper";
import { loginResultParser } from "../utils/parser";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import decode from "jwt-decode";
import { JWTPayload, useToken } from "../hooks/useToken";
import useEvent from "react-use-event";
import { LoginEvent } from "../utils/events";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../theme/variables";

//@ts-ignore
export default function LoginScreen({ navigation }) {
  const { token, payload, setToken } = useToken();
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const dispatchLoginEvent = useEvent<LoginEvent>("Login");
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
      setToken(json.token);
      const username = decode<JWTPayload>(json.token).username;

      Object.entries(clearInputs).map(([_key, clear]) => clear());
      if (json.token) {
        dispatchLoginEvent("Login");
        navigation.navigate("Users");
        loginAlert(username);
      }
    } catch (error) {
      const errorObject: any = { ...(error as object) };
      console.log(errorObject);
    }
  };

  const loginAlert = (username: string) => {
    IonNeverDialog.show({
      type: "success",
      title: "Welcome Back",
      message: username,
      firstButtonVisible: true,
      firstButtonFunction: () => {
        toUserPage();
      },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={LoginScreenStyleSheet.container}>
        <LinearGradient
          // Background Linear Gradient
          colors={["#FFFFFF", theme.background]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: "100%",
          }}
        />
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
        {/* <View style={{ width: "100%" }}>
          <Text style={LoginScreenStyleSheet.forgotPW}>Forgot Password?</Text>
        </View> */}

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
