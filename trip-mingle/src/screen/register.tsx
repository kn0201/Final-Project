import * as React from "react";
import { Pressable, Text, TouchableOpacity, View, Image } from "react-native";
import { Button } from "react-native-paper";
import LoginPageStyleSheet from "../StyleSheet/LoginPageCss";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { center, flex, row } from "../StyleSheet/StyleSheetHelper";
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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <UploadImage />

      <View style={RegisterPageStyleSheet.center}>
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
      </View>
      <View style={RegisterPageStyleSheet.center}>
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
      </View>
      <View style={RegisterPageStyleSheet.center}>
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
      </View>
      <View style={RegisterPageStyleSheet.center}>
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
          <Text style={LoginPageStyleSheet.loginText}>Continue</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={() => navigation.goBack("Test1")}>
        Go Back
      </Button>
    </View>
  );
}
