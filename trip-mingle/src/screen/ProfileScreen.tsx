//Buffer Line

import { View, Text, TouchableOpacity } from "react-native";
import ProfileScreenStyleSheet from "../StyleSheet/ProfileScreenCss";

//@ts-ignore
export default function ProfileScreen({ navigation }) {
  return (
    <View style={ProfileScreenStyleSheet.center}>
      <TouchableOpacity style={ProfileScreenStyleSheet.addProfile}>
        <Text>Add Profile</Text>
      </TouchableOpacity>
    </View>
  );
}
