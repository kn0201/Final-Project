import { useRef, useState } from "react";
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
import LoginPageStyleSheet from "../StyleSheet/LoginPageCss";
import { LoginInfo } from "../utils/types";
import { api } from "../apis/api";
import { nullable, number, object, string } from "cast.ts";
import { center, flex, iosBlue } from "../StyleSheet/StyleSheetHelper";

//@ts-ignore
export default function Login({ navigation }) {
  let loginResult = object({
    // role: nullable(string()),
    // id: nullable(number()),
    // error: nullable(string()),
    username: string(),
    password: string(),
  });
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

  const login = async () => {
    try {
      let json = await api.post("/login", loginInfo, loginResult);
      Object.entries(clearInputs).map(([_key, clear]) => clear());
    } catch (error) {
      const errorObject: any = { ...(error as object) };
      console.log(errorObject);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={LoginPageStyleSheet.container}>
        <View style={LoginPageStyleSheet.center}>
          <Avatar
            size={150}
            rounded
            containerStyle={{
              backgroundColor: "#ffffff",
            }}
            source={require("../assets/yukimin.png")}
          />

          <Text style={LoginPageStyleSheet.welcome}>Welcome</Text>
          <Text style={{ marginBottom: 16 }}>
            Log in to explore more feature
          </Text>
        </View>
        <View style={LoginPageStyleSheet.input}>
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
            placeholder="Username"
          ></TextInput>
          <Icon
            style={{ display: flex, justifyContent: "flex-end" }}
            name="close"
            size={20}
            onPress={() => clearInputs.username()}
          />
        </View>
        <View style={LoginPageStyleSheet.input}>
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
          <Text style={LoginPageStyleSheet.forgotPW}>Forgot Password?</Text>
        </View>

        <View style={LoginPageStyleSheet.center}>
          <TouchableOpacity style={LoginPageStyleSheet.login} onPress={login}>
            <Text style={LoginPageStyleSheet.loginText}>Continue</Text>
          </TouchableOpacity>
        </View>

        <View style={{ width: "100%" }}>
          <Text style={{ width: "90%", margin: 12, padding: 10 }}>
            Don't have an account?{" "}
            <Text
              style={LoginPageStyleSheet.signUp}
              onPress={() => navigation.navigate("Register")}
            >
              Sign up
            </Text>
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
