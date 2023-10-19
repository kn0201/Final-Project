import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { ChangeUsernameStyleSheet } from "../StyleSheet/ChangeUsernameCss";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { useState } from "react";
import { flex } from "../StyleSheet/StyleSheetHelper";
import { api } from "../apis/api";
import { useToken } from "../hooks/useToken";
import { checkResultParser } from "../utils/parser";

//@ts-ignore
export default function ChangeUsername({ username }) {
  const { token, payload, setToken } = useToken();
  const [newUsername, setNewUsername] = useState<string>();
  const [checkUsernameResult, setCheckUsernameResult] = useState(false);
  const usernameErrorMsg = "Username already exist";
  const checkUsername = async (text: string) => {
    try {
      let checker = await api.loginSignUp(
        "/login/check",
        { username: text },
        checkResultParser
      );
      if (checker.result === true) {
        setCheckUsernameResult(true);
      } else if (checker.result === false) {
        setCheckUsernameResult(false);
      }
    } catch (error) {
      const errorObject: any = { ...(error as object) };
      console.log(errorObject);
    }
  };

  const submit = async () => {
    let result = await api.patch("/user/");
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={ChangeUsernameStyleSheet.center}>
        <View style={ChangeUsernameStyleSheet.titleContainer}>
          <Text style={ChangeUsernameStyleSheet.title}>Changing Username</Text>
          <MaterialIcons
            style={ChangeUsernameStyleSheet.title}
            name="edit"
            size={20}
          />
        </View>
        <View style={ChangeUsernameStyleSheet.previousUsernameContainer}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginEnd: 8,
            }}
          >
            Previous Username :
          </Text>
          <Text style={{ fontSize: 18, marginEnd: 8 }}>{username}</Text>
        </View>
        <View style={ChangeUsernameStyleSheet.newUsernameContainer}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginEnd: 8,
              marginBottom: 16,
            }}
          >
            New Username
          </Text>
          <TextInput
            placeholder="Type Here"
            onChangeText={(text) => {
              setNewUsername(text);
              checkUsername(text);
            }}
          ></TextInput>
          <View style={ChangeUsernameStyleSheet.errorMsgContainer}>
            <Text style={{ color: "red" }}>
              {checkUsernameResult ? usernameErrorMsg : ""}
            </Text>
          </View>
        </View>
        <View style={ChangeUsernameStyleSheet.buttonContainer}>
          <TouchableOpacity style={ChangeUsernameStyleSheet.submit}>
            <Text style={ChangeUsernameStyleSheet.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={ChangeUsernameStyleSheet.cancel}>
            <Text style={ChangeUsernameStyleSheet.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
