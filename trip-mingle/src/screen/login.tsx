import { useState, useRef, useEffect } from "react";
import { Button, TextInput, View, Text, Keyboard } from "react-native";
import { Input } from "@rneui/base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Avatar } from "@rneui/themed";
import { center, flex } from "../StyleSheet/StyleSheetHelper";
import LoginPageStyleSheet from "../StyleSheet/LoginPageCss";
import { LoginInfo } from "../utils/types";

//@ts-ignore
export default function Login({ navigation }) {
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

  const login = () => {
    console.log(loginInfo);
    Object.entries(clearInputs).map(([_key, clear]) => clear());
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Avatar
        size={150}
        rounded
        containerStyle={{ backgroundColor: "#9700b9" }}
        source={require("../assets/yukimin.png")}
      />
      <TextInput />
      <Input
        ref={(input: any) => {
          clearInputs.username = () => input?.clear();
        }}
        onChangeText={(text: string) => updateInputText("username", text)}
        onEndEditing={() => Keyboard.dismiss()}
        containerStyle={{}}
        errorMessage=""
        label="Username"
        leftIcon={<Icon name="account-outline" size={20} />}
        rightIcon={
          <Icon name="close" size={20} onPress={() => clearInputs.username()} />
        }
        rightIconContainerStyle={{}}
        placeholder="Username"
      />
      <Input
        ref={(input: any) => {
          clearInputs.password = () => input?.clear();
        }}
        onChangeText={(text: string) => updateInputText("password", text)}
        containerStyle={{}}
        errorMessage=""
        label="Password"
        leftIcon={<Icon name="account-outline" size={20} />}
        rightIcon={
          <Icon name="close" size={20} onPress={() => clearInputs.password()} />
        }
        rightIconContainerStyle={{}}
        placeholder="Password"
        secureTextEntry={true}
      />
      <Button title="Login" onPress={login} />

      <Button
        title="Register"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
}
