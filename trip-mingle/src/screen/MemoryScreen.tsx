//Buffer Line

import { View, Text } from "react-native";
import MemoryScreenStyleSheet from "../StyleSheet/MemoryScreenCss";
import { LinearGradient } from "expo-linear-gradient";

//@ts-ignore
export default function MemoryScreen({ navigation }) {
  return (
    <>
      <LinearGradient
        // Background Linear Gradient
        colors={["#FFFFFF", "rgba(195,214,246,0.8)"]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "100%",
        }}
      />
      <View style={MemoryScreenStyleSheet.center}>
        <Text>Memory Screen</Text>
      </View>
    </>
  );
}
