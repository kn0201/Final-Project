//Buffer Line

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useGet } from "../hooks/useGet";
import { useToken } from "../hooks/useToken";
import { getIconResult } from "../utils/parser";
import { Avatar } from "@rneui/themed";
import CommentScreenStyleSheet from "../StyleSheet/CommentScreenCss";
import Ionicons from "react-native-vector-icons/Ionicons";
import { apiOrigin } from "../utils/apiOrigin";
import useBoolean from "../hooks/useBoolean";
import { useEffect, useState } from "react";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";

export default function CommentScreen() {
  const { token, payload, setToken } = useToken();
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();

  const [keyboardShow, setKeyboardShow] = useState(false);
  let result = useGet("/user/icon", getIconResult).state?.path;

  const submit = () => {
    if (token != "") {
      console.log("ok");
    } else {
      IonNeverDialog.show({
        type: "warning",
        title: "Guest cannot Comment",
        message: "Please Login",
        firstButtonVisible: true,
      });
    }
  };

  useEffect(() => {}, [useToken()]);
  return (
    <TouchableWithoutFeedback>
      <>
        <ScrollView style={{ flex: 0 }}>
          <Text>3333333333</Text>
          <Text>3333333333</Text>
          <Text>3333333333</Text>
          <Text>3333333333</Text>
          <Text>3333333333</Text>
          <Text>3333333333</Text>
          <Text>3333333333</Text>
          <Text>3333333333</Text>
        </ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          style={{ flex: keyboardShow ? 0.45 : 0 }}
        >
          <View style={CommentScreenStyleSheet.bottomContainer}>
            <Avatar
              size={35}
              rounded
              //   containerStyle={UserPageStyleSheet.AvatarContainer}
              source={{
                uri: `${apiOrigin}/${result}`,
              }}
            />
            <View style={CommentScreenStyleSheet.textInputContainer}>
              <TextInput
                onBlur={() => {
                  setKeyboardShow(!keyboardShow);
                }}
                onFocus={() => {
                  setKeyboardShow(!keyboardShow);
                }}
                style={CommentScreenStyleSheet.textInput}
              ></TextInput>
            </View>

            <TouchableOpacity onPress={submit}>
              <Ionicons name="send" size={20} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </>
    </TouchableWithoutFeedback>
  );
}
