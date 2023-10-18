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

export default function CommentScreen() {
  const { token, payload, setToken } = useToken();
  let result = useGet("/user/icon", getIconResult).state?.path;
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={{ flex: 10 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <ScrollView style={{ flex: 1 }}>
            <Text>3333333333</Text>
            <Text>3333333333</Text>
            <Text>3333333333</Text>
            <Text>3333333333</Text>
            <Text>3333333333</Text>
            <Text>3333333333</Text>
            <Text>3333333333</Text>
            <Text>3333333333</Text>
          </ScrollView>

          <View style={CommentScreenStyleSheet.bottomContainer}>
            <Avatar
              size={35}
              rounded
              //   containerStyle={UserPageStyleSheet.AvatarContainer}
              source={
                result == null
                  ? require("../assets/yukimin.png")
                  : {
                      uri: `${apiOrigin}/${result}`,
                    }
              }
            />
            <View style={CommentScreenStyleSheet.textInputContainer}>
              <TextInput style={CommentScreenStyleSheet.textInput}></TextInput>
            </View>

            <TouchableOpacity>
              <Ionicons name="send" size={20} />
            </TouchableOpacity>
          </View>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
