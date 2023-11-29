import { View, Text, TouchableOpacity } from "react-native";
import BuddiesPageStyleSheet from "../StyleSheet/BuddiesPageCss";
import { center, flex } from "../StyleSheet/StyleSheetHelper";
import useEvent from "react-use-event";
import { AddPostEvent } from "../utils/events";
import { useAppNavigation } from "../../navigators";

export default function BlogScreen() {
  useEvent<AddPostEvent>("AddPost", (event) => {});
  const navigation = useAppNavigation();
  return (
    <>
      <View style={BuddiesPageStyleSheet.container}>
        <Text>Blog!</Text>
        <View
          style={{ display: flex, justifyContent: center, alignItems: center }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Blog Detail", { post_id: 1 });
            }}
          >
            <Text>Blog!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
