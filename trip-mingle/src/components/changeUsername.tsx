import { View, Text, TextInput } from "react-native";
import { ChangeUsernameStyleSheet } from "../StyleSheet/ChangeUsernameCss";

//@ts-ignore
export default function ChangeUsername({ username }) {
  return (
    <View style={ChangeUsernameStyleSheet.center}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        Changing Username
      </Text>
      <View style={ChangeUsernameStyleSheet.previousUsernameContainer}>
        <Text>Previous Username : </Text>
        <Text>{username}</Text>
      </View>
      <View style={ChangeUsernameStyleSheet.newUsernameContainer}>
        <Text>New Username</Text>
        <TextInput placeholder="Type Here"></TextInput>
      </View>
    </View>
  );
}
