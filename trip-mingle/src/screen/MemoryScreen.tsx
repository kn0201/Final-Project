//Buffer Line

import { View, Text } from "react-native";
import MemoryScreenStyleSheet from "../StyleSheet/MemoryScreenCss";

//@ts-ignore
export default function MemoryScreen({ navigation }) {
  return (
    <View style={MemoryScreenStyleSheet.center}>
      <Text>Memory Screen</Text>
    </View>
  );
}
