//Buffer Line

import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import BlogDetailScreenStyleSheet from "../StyleSheet/BlogDetailScreenCss";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useState } from "react";
import { iosBlue } from "../StyleSheet/StyleSheetHelper";
import { apiOrigin } from "../utils/apiOrigin";

export default function BlogDetailScreen() {
  let path = "d76562b8-adef-470b-9934-5181d38b68c9.jpeg";
  const [isLike, setIsLike] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);
  const like = () => {
    setIsLike(!isLike);
  };
  const bookmark = () => {
    setIsBookmark(!isBookmark);
  };

  return (
    <>
      <ScrollView>
        <View style={BlogDetailScreenStyleSheet.topContentContainer}>
          <View>
            <Text>2023年9月14日</Text>
          </View>
          <View style={BlogDetailScreenStyleSheet.buttonContainer}>
            <TouchableOpacity onPress={like}>
              <AntDesign
                name={isLike ? "like1" : "like2"}
                size={20}
                style={{ color: iosBlue }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={bookmark}>
              <MaterialCommunityIcons
                name={isBookmark ? "bookmark" : "bookmark-outline"}
                size={22}
                style={{ color: iosBlue }}
              />
            </TouchableOpacity>
          </View>
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
        <View style={BlogDetailScreenStyleSheet.introContainer}>
          <Text style={{ color: "grey" }}>123 321 1234567</Text>
        </View>
        <View style={BlogDetailScreenStyleSheet.contentContainer}>
          <Text style={{ marginBottom: 16 }}>
            Content1..............................................................................................................END
          </Text>
          <Image
            source={{ uri: `${apiOrigin}/${path}` }}
            width={400}
            height={400}
            style={{ marginBottom: 16 }}
          />
        </View>
        <View style={BlogDetailScreenStyleSheet.contentContainer}>
          <Text style={{ marginBottom: 16 }}>
            Content2..............................................................................................................END
          </Text>
          <Image
            source={{ uri: `${apiOrigin}/${path}` }}
            width={400}
            height={400}
            style={{ marginBottom: 16 }}
          />
        </View>
        <View style={BlogDetailScreenStyleSheet.contentContainer}>
          <Text style={{ marginBottom: 16 }}>
            Content3..............................................................................................................END
          </Text>
          <Image
            source={{ uri: `${apiOrigin}/${path}` }}
            width={400}
            height={400}
            style={{ marginBottom: 16 }}
          />
        </View>
      </ScrollView>
    </>
  );
}
