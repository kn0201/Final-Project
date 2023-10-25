//Buffer Line

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import BlogDetailScreenStyleSheet from "../StyleSheet/BlogDetailScreenCss";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import HTMLView from "react-native-htmlview";
import { useState } from "react";
import { center, iosBlue, row } from "../StyleSheet/StyleSheetHelper";
import { apiOrigin } from "../utils/apiOrigin";
import { useAppNavigation } from "../../navigators";

export default function BlogDetailScreen() {
  let path = "d76562b8-adef-470b-9934-5181d38b68c9.jpeg";
  const navigation = useAppNavigation();
  const [isLike, setIsLike] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);
  const like = () => {
    setIsLike(!isLike);
  };
  const bookmark = () => {
    setIsBookmark(!isBookmark);
  };
  const [blogContent, setBlogContent] = useState<string>("");
  const htmlContent = `<p><a href="http://jsdf.co">&hearts; nice job!</a></p>`;
  return (
    <>
      <ScrollView>
        <View style={BlogDetailScreenStyleSheet.topContentContainer}>
          <Text>2023年9月14日</Text>
        </View>
        <View style={BlogDetailScreenStyleSheet.centerContainer}>
          <Text style={BlogDetailScreenStyleSheet.blogTitle}>Blog Title</Text>
          <Text>
            Author : <Text style={{ fontWeight: "bold" }}>username</Text>
          </Text>
        </View>
        <View style={BlogDetailScreenStyleSheet.tripDetailContainer}>
          <Text>Destination: USA</Text>
          <Text>Travel Date : 2023/08/15 - 2023/08/22</Text>
        </View>

        <View style={BlogDetailScreenStyleSheet.contentContainer}>
          <HTMLView value={htmlContent} stylesheet={styles} />
        </View>
      </ScrollView>
      <View style={BlogDetailScreenStyleSheet.bottomContainer}>
        <View style={BlogDetailScreenStyleSheet.buttonContainer}>
          <TouchableOpacity onPress={bookmark}>
            <MaterialCommunityIcons
              name={isBookmark ? "bookmark" : "bookmark-outline"}
              size={22}
              style={{ color: iosBlue }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={like}
            style={{ flexDirection: row, alignItems: center, gap: 5 }}
          >
            <AntDesign
              name={isLike ? "like1" : "like2"}
              size={20}
              style={{ color: iosBlue }}
            />
            <Text style={{ color: iosBlue }}>3</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{ flexDirection: row, alignItems: center, gap: 5 }}
          onPress={() => {
            navigation.navigate("Comment", { post_id: 1 });
          }}
        >
          <MaterialCommunityIcons name="comment-plus" size={22} />
          <Text>Comment</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  a: {
    fontWeight: "300",
    color: "#FF3366", // make links coloured pink
  },
});
