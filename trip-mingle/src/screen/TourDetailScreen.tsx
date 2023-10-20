import { Text, View, Image, ScrollView } from "react-native";
import { api } from "../apis/api";
import { postDetailParser } from "../utils/parser";
import { PostDetailItem } from "../utils/types";
import { useEffect, useState } from "react";
import { useGet } from "../hooks/useGet";
import { apiOrigin } from "../utils/apiOrigin";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Fontisto from "react-native-vector-icons/Fontisto";
import { ItemSeparatorView, setStarRating } from "./PostScreen";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import TourDetailScreenStyleSheet from "../StyleSheet/TourDetailScreenCss";
import { Card } from "react-native-paper";

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
  const locationNames = post?.trip_location?.map((location) => location.name);
  const locationNamesString = Array.isArray(locationNames)
    ? locationNames.join(", ")
    : "";
  return (
    <>
      <Card style={{ margin: 15, marginRight: 20, height: "96%" }}>
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
        {post?.trip_period ? (
          <>
            <View style={TourDetailScreenStyleSheet.rowContainer}>
              <View style={TourDetailScreenStyleSheet.row}>
                <Text style={TourDetailScreenStyleSheet.titleKey}>Period:</Text>
                <Text>{post?.trip_period ? post.trip_period : "Pending"}</Text>
              </View>
            </View>
          </>
        ) : null}
        <View style={TourDetailScreenStyleSheet.rowContainer}>
          <Text style={TourDetailScreenStyleSheet.titleKey}>Destination:</Text>
          <Text>{post?.trip_country}</Text>
        </View>
        {post?.trip_location?.length !== undefined &&
        post?.trip_location?.length > 0 ? (
          <>
            <View style={TourDetailScreenStyleSheet.rowContainer}>
              <View style={TourDetailScreenStyleSheet.row}>
                <Text style={TourDetailScreenStyleSheet.titleKey}>Spot:</Text>
                <Text>{locationNamesString}</Text>
              </View>
            </View>
          </>
        ) : null}
        {post?.trip_budget ? (
          <>
            <View style={TourDetailScreenStyleSheet.rowContainer}>
              <View style={TourDetailScreenStyleSheet.row}>
                <Text style={TourDetailScreenStyleSheet.titleKey}>Budget:</Text>
                <Text>{post?.trip_budget ? post.trip_budget : "Pending"}</Text>
              </View>
            </View>
          </>
        ) : null}
        <View style={TourDetailScreenStyleSheet.rowContainer}>
          <View style={TourDetailScreenStyleSheet.row}>
            <Text style={TourDetailScreenStyleSheet.titleKey}>Headcount:</Text>
            <Text>{post?.trip_headcount}</Text>
          </View>
        </View>
        {post?.preferred_gender ? (
          <>
            <View style={TourDetailScreenStyleSheet.rowContainer}>
              <View style={TourDetailScreenStyleSheet.row}>
                <Text style={TourDetailScreenStyleSheet.titleKey}>
                  Preferred Gender:
                </Text>
                <Text>{post?.preferred_gender}</Text>
              </View>
            </View>
          </>
        ) : null}
        {post?.preferred_age ? (
          <>
            <View style={TourDetailScreenStyleSheet.rowContainer}>
              <View style={TourDetailScreenStyleSheet.row}>
                <Text style={TourDetailScreenStyleSheet.titleKey}>
                  Preferred Age:
                </Text>
              </View>
            </View>
            <View style={TourDetailScreenStyleSheet.rowContainer}>
              <View style={TourDetailScreenStyleSheet.row}>
                <Text>{post?.preferred_age}</Text>
              </View>
            </View>
          </>
        ) : null}
        {post?.preferred_language ? (
          <>
            <View style={TourDetailScreenStyleSheet.rowContainer}>
              <View style={TourDetailScreenStyleSheet.row}>
                <Text style={TourDetailScreenStyleSheet.titleKey}>
                  Preferred Language:
                </Text>
              </View>
            </View>
            <View style={TourDetailScreenStyleSheet.rowContainer}>
              <View style={TourDetailScreenStyleSheet.row}>
                <Text>
                  {post?.preferred_language ? post.preferred_language : "Any"}
                </Text>
              </View>
            </View>
          </>
        ) : null}
        {post?.preferred_hobby ? (
          <>
            <View style={TourDetailScreenStyleSheet.rowContainer}>
              <View style={TourDetailScreenStyleSheet.row}>
                <Text style={TourDetailScreenStyleSheet.titleKey}>
                  Preferred Hobby:
                </Text>
              </View>
            </View>
            <View style={TourDetailScreenStyleSheet.rowContainer}>
              <View style={TourDetailScreenStyleSheet.row}>
                <Text>
                  {post?.preferred_hobby ? post.preferred_hobby : "Any"}
                </Text>
              </View>
            </View>
          </>
        ) : null}
        <View style={TourDetailScreenStyleSheet.rowContainer}>
          <View style={TourDetailScreenStyleSheet.row}>
            <Text style={TourDetailScreenStyleSheet.titleKey}>Content:</Text>
          </View>
        </View>
        <View style={TourDetailScreenStyleSheet.rowContainer}>
          <View style={TourDetailScreenStyleSheet.rowContent}>
            <Text>{post?.content}</Text>
          </View>
        </View>
        <ItemSeparatorView />
        <Text>Reply:</Text>
        <ScrollView style={{ height: "100%" }}>
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
              <Text style={TourDetailScreenStyleSheet.titleKey}>Reply:</Text>
            </View>
          </View>
          <View style={TourDetailScreenStyleSheet.rowContainer}>
            <View style={TourDetailScreenStyleSheet.rowContent}>
              <Text>{post?.content}</Text>
            </View>
          </View>
          <ItemSeparatorView />
        </ScrollView>
      </Card>
    </>
  );
};

export default TourDetailScreen;
