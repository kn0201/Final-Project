import { View, Text, TouchableOpacity } from "react-native";
import BuddiesPageStyleSheet from "../StyleSheet/BuddiesPageCss";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { center, flex } from "../StyleSheet/StyleSheetHelper";
import useEvent from "react-use-event";
import { AddPostEvent } from "../utils/events";

export default function BlogScreen({ navigation }: { navigation: any }) {
  useEvent<AddPostEvent>("AddPost", (event) => {});
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
