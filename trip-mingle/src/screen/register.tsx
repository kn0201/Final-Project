import * as React from "react";
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
} from "react-native";

import LoginPageStyleSheet from "../StyleSheet/LoginPageCss";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { center, flex, full, row } from "../StyleSheet/StyleSheetHelper";
import { useState } from "react";
import { CheckBox } from "@rneui/themed";
import RegisterPageStyleSheet from "../StyleSheet/RegisterPageCss";
import UploadImage from "../components/uploadImage";

// const register = async () => {
//   try {
//     let json = await api.post("/login", loginInfo, loginResult);
//     Object.entries(clearInputs).map(([_key, clear]) => clear());
//   } catch (error) {
//     const errorObject: any = { ...(error as object) };
//     console.log(errorObject);
//   }
// };

//@ts-ignore
export default function Register({ navigation }) {
  const [checkGender, setCheck1] = useState(true);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <UploadImage />

        <View
          style={(RegisterPageStyleSheet.center, RegisterPageStyleSheet.input)}
        >
          <Icon
            style={{
              display: flex,
              justifyContent: "flex-start",
              marginEnd: 4,
            }}
            name="account-outline"
            size={20}
          />
          <Text>Username</Text>
          <TextInput
            placeholder="Username"
            style={RegisterPageStyleSheet.textInput}
          ></TextInput>
        </View>
        <View
          style={(RegisterPageStyleSheet.center, RegisterPageStyleSheet.input)}
        >
          <Icon
            style={{
              display: flex,
              justifyContent: "flex-start",
              marginEnd: 4,
            }}
            name="email-outline"
            size={20}
          />
          <Text>Email</Text>
          <TextInput
            keyboardType="email-address"
            placeholder="Email"
            style={RegisterPageStyleSheet.textInput}
          ></TextInput>
        </View>
        <View style={RegisterPageStyleSheet.passwordContainer}>
          <View style={RegisterPageStyleSheet.password}>
            <Icon
              style={{
                display: flex,
                justifyContent: "flex-start",
                marginEnd: 4,
              }}
              name="lock-outline"
              size={20}
            />
            <Text>Password</Text>
            <TextInput
              placeholder="Password"
              style={RegisterPageStyleSheet.textInput}
            ></TextInput>
          </View>
          <Text>─────────────────────────</Text>
          <View style={RegisterPageStyleSheet.password}>
            <Icon
              style={{
                display: flex,
                justifyContent: "flex-start",
                marginEnd: 4,
              }}
              name="lock-outline"
              size={20}
            />
            <Text>Confirm Password</Text>
            <TextInput
              placeholder="Confirm Password"
              style={RegisterPageStyleSheet.textInput}
            ></TextInput>
          </View>
        </View>
        <View style={RegisterPageStyleSheet.genderContainer}>
          <Icon
            style={{
              display: flex,
              justifyContent: "flex-start",
              marginEnd: 4,
            }}
            name="gender-male-female"
            size={20}
          />
          <Text>Gender</Text>
          <CheckBox
            center
            title="Male"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={checkGender}
            onPress={() => setCheck1(!checkGender)}
            size={20}
            containerStyle={{ backgroundColor: "transparent" }}
          />
          <CheckBox
            center
            title="Female"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={!checkGender}
            onPress={() => setCheck1(!checkGender)}
            size={20}
            containerStyle={{ backgroundColor: "transparent" }}
          />
        </View>
        <View style={RegisterPageStyleSheet.center}>
          <Icon
            style={{
              display: flex,
              justifyContent: "flex-start",
              marginEnd: 4,
            }}
            name="cake-variant-outline"
            size={20}
          />
          <Text>Birthday</Text>
        </View>
        <View style={RegisterPageStyleSheet.center}>
          <Icon
            style={{
              display: flex,
              justifyContent: "flex-start",
              marginEnd: 4,
            }}
            name="earth"
            size={20}
          />
          <Text>Country</Text>
        </View>
        <View style={LoginPageStyleSheet.center}>
          <TouchableOpacity style={LoginPageStyleSheet.login}>
            <Text style={LoginPageStyleSheet.loginText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
