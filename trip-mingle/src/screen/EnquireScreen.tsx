import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
} from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import BuddiesPageStyleSheet from "../StyleSheet/BuddiesPageCss";
import { enquireInfoParser } from "../utils/parser";
import { EnquireInfoItem } from "../utils/types";
import { api } from "../apis/api";
import { apiOrigin } from "../utils/apiOrigin";
import TourDetailScreenStyleSheet from "../StyleSheet/TourDetailScreenCss";
import AntDesign from "react-native-vector-icons/AntDesign";
import React from "react";
import useEvent from "react-use-event";
import {
  AcceptEvent,
  AddCommentEvent,
  AddPostEvent,
  DeleteEvent,
  LikeEvent,
  RatingEvent,
  RejectEvent,
  UpdateProfileEvent,
} from "../utils/events";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../theme/variables";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { useAppNavigation } from "../../navigators";

// Star rating
export const setStarRating = (rating: number) => {
  rating = Math.round(rating * 2) / 2;
  let output = [];
  for (var i = rating; i >= 1; i--) output.push(1);
  if (i >= 0.5 && i < 1) output.push(0.5);
  for (let i = 5 - rating; i >= 1; i--) output.push(0);
  return output.map((star, index) => (
    <MaterialCommunityIcons
      key={index}
      name={
        star === 1 ? "star" : star === 0.5 ? "star-half-full" : "star-outline"
      }
      color={"#DEB934"}
      size={16}
    />
  ));
};

// Separator
export const ItemSeparatorView = () => {
  return (
    <View
      style={{
        height: 0.5,
        width: "100%",
        backgroundColor: "#C8C8C8",
      }}
    />
  );
};

// @xts-ignore
export default function EnquireScreen({}) {
  const navigation = useAppNavigation();

  // Select post
  const [selectedPostID, setSelectedPostIDs] = useState(0);
  const handlePostClick = (id: number, title: string) => {
    navigation.navigate("Enquire Detail", { id, title });
    if (selectedPostID == id) {
      setSelectedPostIDs(0);
    } else {
      setSelectedPostIDs(id);
    }
  };
  const getPostInfo = async () => {
    try {
      let postInfoData = await api.get("/blog/enquire", enquireInfoParser);
      setPosts(postInfoData);
    } catch (err) {
      console.log(err);
    }
  };

  // Update post list
  useEvent<AddPostEvent>("AddPost", (event) => {
    if (event.post_type == "enquire") {
      getPostInfo();
    }
  });
  useEvent<LikeEvent>("Like", (event) => {
    setPosts((posts) =>
      posts.map((post) =>
        post.id == event.post_id
          ? { ...post, number_of_like: event.number_of_like }
          : post
      )
    );
  });
  useEvent<AddCommentEvent>("AddComment", (event) => {
    getPostInfo();
  });
  useEvent<AcceptEvent>("Accept", (event) => {
    getPostInfo();
  });
  useEvent<UpdateProfileEvent>("UpdateProfile", (event) => {
    getPostInfo();
  });
  useEvent<DeleteEvent>("Delete", (event) => {
    getPostInfo();
  });
  useEvent<RejectEvent>("Reject", (event) => {
    getPostInfo();
  });
  useEvent<RatingEvent>("Rating", (event) => {
    getPostInfo();
  });

  // Search bar
  const [searchText, setSearchText] = useState("");
  // const [filteredPosts, setFilteredPosts] = useState<EnquireInfoItem[]>([]);
  const [posts, setPosts] = useState<EnquireInfoItem[]>([]);

  useEffect(() => {
    getPostInfo();
  }, []);

  const filteredPosts = useMemo(
    () =>
      searchText
        ? posts.filter((item) => {
            const textData = searchText.toUpperCase();
            return (
              (item.title && item.title.toUpperCase().includes(textData)) ||
              (item.content && item.content.toUpperCase().includes(textData))
            );
          })
        : posts,
    [searchText, posts]
  );

  const ItemView = useCallback(
    ({ item }: ListRenderItemInfo<EnquireInfoItem>) => (
      <TouchableOpacity
        key={item.id}
        onPress={() => handlePostClick(item.id, item.title)}
        style={[
          { flex: 1 },
          selectedPostID === item.id ? { backgroundColor: "#E7FFF0" } : null,
        ]}
      >
        <LinearGradient
          // Background Linear Gradient
          colors={["#FFFFFF", theme.background]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: "100%",
          }}
        />
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
                uri: `${apiOrigin}/${item.avatar_path}`,
              }}
            />
            <Text
              style={{
                marginRight: 5,
                fontWeight: "600",
              }}
            >
              {item.username}
            </Text>
            {setStarRating(item.rating)}
            <Text> ({item.number_of_rating})</Text>
          </View>
          <View style={TourDetailScreenStyleSheet.row}>
            <Text style={{ fontWeight: "800" }}>#{item.id}</Text>
            <Text style={TourDetailScreenStyleSheet.titleKey}>
              {moment(new Date(item.created_at)).fromNow()}
            </Text>
          </View>
        </View>
        <View style={TourDetailScreenStyleSheet.rowContainer}>
          <View style={TourDetailScreenStyleSheet.row}>
            <Text style={TourDetailScreenStyleSheet.titleKey}>Title:</Text>
            <Text>{item.title}</Text>
          </View>
        </View>

        <View style={TourDetailScreenStyleSheet.rowContainerWithEnd}>
          <View style={TourDetailScreenStyleSheet.rowWithEnd}>
            <AntDesign name={"like1"} size={16} />
            <Text>{item.number_of_like}</Text>
            <MaterialCommunityIcons name="comment" size={16} />
            <Text>{item.number_of_reply}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    []
  );

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getPostInfo();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Display
  return (
    <>
      <LinearGradient
        // Background Linear Gradient
        colors={["#FFFFFF", theme.background]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "100%",
        }}
      />
      <TextInput
        style={BuddiesPageStyleSheet.textInputStyle}
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
        underlineColorAndroid="transparent"
        placeholder="Search..."
      />
      <View style={BuddiesPageStyleSheet.container}>
        <FlatList
          data={filteredPosts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={ItemView}
          ItemSeparatorComponent={ItemSeparatorView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </>
  );
}
