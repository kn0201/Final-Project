import { Text, View, Image } from "react-native";
import { api } from "../apis/api";
import { postDetailParser } from "../utils/parser";
import { PostDetailItem } from "../utils/types";
import { useEffect, useState } from "react";
import { useGet } from "../hooks/useGet";
import { apiOrigin } from "../utils/apiOrigin";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Fontisto from "react-native-vector-icons/Fontisto";
import { setStarRating } from "./PostScreen";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import TourDetailScreenStyleSheet from "../StyleSheet/TourDetailScreenCss";

const TourDetailScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const { id, title } = route.params || {
    id: 0,
    title: "Default Title",
  };
  useEffect(() => {
    navigation.setOptions({ headerTitle: title });
  }, [title]);
  const postDetail = useGet(`/blog/${id}`, postDetailParser);
  const postDetailData = postDetail.state || null;
  const [post, setPost] = useState<PostDetailItem | null>(postDetailData);
  const getPostDetail = async () => {
    try {
      let postDetailData = await api.get(`/blog/${id}`, postDetailParser);
      setPost(postDetailData);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getPostDetail();
    setPost(post);
  }, [postDetailData]);
  return (
    <>
      <View style={TourDetailScreenStyleSheet.postContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            style={TourDetailScreenStyleSheet.avatar}
            source={{
              uri: `${apiOrigin}/${post?.avatar_path}`,
            }}
          />
          <Text
            style={{
              marginRight: 5,
              fontWeight: "600",
            }}
          >
            {post?.username}
          </Text>
          {setStarRating(post?.rating ? post.rating : 0)}
          <Text> ({post?.number_of_rating})</Text>
        </View>
        <View style={TourDetailScreenStyleSheet.row}>
          <Text style={{ fontWeight: "800" }}>#{post?.id}</Text>
          {post?.status === "open" ? (
            <Fontisto name="radio-btn-active" color="#0CD320" size={16} />
          ) : post?.status === "complete" ? (
            <MaterialIcons
              name="remove-circle-outline"
              color="grey"
              size={20}
            />
          ) : (
            <Fontisto name="close" color="red" size={16} />
          )}
          <Text style={TourDetailScreenStyleSheet.titleKey}>
            {post?.created_at?.substring(0, 10)}
          </Text>
        </View>
      </View>
      <View style={TourDetailScreenStyleSheet.rowContainer}>
        <View style={TourDetailScreenStyleSheet.row}>
          <Text style={TourDetailScreenStyleSheet.titleKey}>Title:</Text>
          <Text>{post?.title}</Text>
        </View>
      </View>
      <View style={TourDetailScreenStyleSheet.rowContainer}>
        <Text style={TourDetailScreenStyleSheet.titleKey}>Destination:</Text>
        <Text>{post?.trip_country}</Text>
      </View>
      <View style={TourDetailScreenStyleSheet.rowContainer}>
        <View style={TourDetailScreenStyleSheet.row}>
          <Text style={TourDetailScreenStyleSheet.titleKey}>Period:</Text>
          <Text>{post?.trip_period}</Text>
        </View>
        <View style={{ marginRight: 15 }}>
          <MaterialCommunityIcons name="comment-plus" size={16} />
        </View>
      </View>
    </>
  );
};

export default TourDetailScreen;
