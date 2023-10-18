import { View, Text } from "react-native";
import BuddiesPageStyleSheet from "../StyleSheet/BuddiesPageCss";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

//@ts-ignore
export default function BlogScreen({ navigation }) {
  return (
    <>
      <View style={BuddiesPageStyleSheet.container}>
        <Text>Blog!</Text>
      </View>
    </>
  );
}
