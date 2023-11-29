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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { api, api2 } from "../apis/api";
import { useToken } from "../hooks/useToken";
import { checkResultParser, updateUsernameResultParser } from "../utils/parser";
import { useIonNeverNotification } from "./IonNeverNotification/NotificationProvider";

//@ts-ignore
export default function ChangeUsername({ username }) {
  const { token, setToken } = useToken();
  const { IonNeverDialog } = useIonNeverNotification();

  const [newUsername, setNewUsername] = useState<string>();

  const [checkUsernameResult, setCheckUsernameResult] = useState(false);

  const usernameErrorMsg = "Username already exist";

  const checkUsername = async (text: string) => {
    try {
      let checker = await api2.get(
        "/login/check_username?" + new URLSearchParams({ username: text }),
        checkResultParser
      );
      if (checker.result === true) {
        setCheckUsernameResult(true);
      } else if (checker.result === false) {
        setCheckUsernameResult(false);
      }
    } catch (error) {
      console.log("failed to check username:", error);
    }
  };

  const logout = async () => {
    setToken("");
    await AsyncStorage.removeItem("username");
  };

  const submit = async () => {
    let json = await api.patch(
      "/user/update_username",
      { username: newUsername },
      updateUsernameResultParser,
      token
    );
    if (json.result == true) {
      IonNeverDialog.dismiss();
      IonNeverDialog.show({
        type: "success",
        title: "Update Success",
        message: "Please login again with new Username",
        firstButtonVisible: true,
        firstButtonFunction: () => {},
      });
      logout();
    }
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
            }}
          >
            New Username
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 16 }}> Max 10 letter</Text>
          <TextInput
            style={{ fontSize: 18 }}
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
          <TouchableOpacity
            style={ChangeUsernameStyleSheet.submit}
            onPress={submit}
          >
            <Text style={ChangeUsernameStyleSheet.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={ChangeUsernameStyleSheet.cancel}
            onPress={() => {
              IonNeverDialog.dismiss();
              setNewUsername("");
            }}
          >
            <Text style={ChangeUsernameStyleSheet.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
