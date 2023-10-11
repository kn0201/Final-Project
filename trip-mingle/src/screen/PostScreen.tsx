import {
  SafeAreaView,
  View,
  Text,
  Image,
  TextInput,
  Button,
} from "react-native";
import BuddiesPageStyleSheet from "../StyleSheet/BuddiesPageCss";
import { createContext, useContext, useState } from "react";

export default function TourScreen() {
  const [content, setContent] = useState("");

  return (
    <SafeAreaView style={BuddiesPageStyleSheet.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 10,
        }}
      >
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            resizeMode: "contain",
          }}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
        />

        <Text>Username</Text>
      </View>

      <View style={{ flexDirection: "row", marginLeft: 10 }}>
        <TextInput
          value={content}
          onChangeText={(text) => setContent(text)}
          placeholderTextColor={"black"}
          placeholder="Type your message..."
          multiline
        />
      </View>

      <View style={{ marginTop: 20 }} />
    </SafeAreaView>
  );
}
