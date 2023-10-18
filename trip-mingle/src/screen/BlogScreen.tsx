import { View, Text, TouchableOpacity } from "react-native";
import BuddiesPageStyleSheet from "../StyleSheet/BuddiesPageCss";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { center, flex } from "../StyleSheet/StyleSheetHelper";

//@ts-ignore
export default function BlogScreen({ navigation }) {
  return (
    <>
      <View style={BuddiesPageStyleSheet.container}>
        <Text>Blog!</Text>
        <View
          style={{ display: flex, justifyContent: center, alignItems: center }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Blog Detail");
            }}
          >
            <Text>Blog!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
