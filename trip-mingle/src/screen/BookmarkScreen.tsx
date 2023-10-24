import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import Fontisto from "react-native-vector-icons/Fontisto";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import BuddiesPageStyleSheet from "../StyleSheet/BuddiesPageCss";
import { bookmarkInfoParser, postInfoParser } from "../utils/parser";
import { PostInfoItem, bookmarkInfoItem } from "../utils/types";
import { api } from "../apis/api";
import { apiOrigin } from "../utils/apiOrigin";
import TourDetailScreenStyleSheet from "../StyleSheet/TourDetailScreenCss";
import AntDesign from "react-native-vector-icons/AntDesign";
import React from "react";
import useEvent from "react-use-event";
import {
  AddCommentEvent,
  AddPostEvent,
  BookmarkEvent,
  LikeEvent,
} from "../utils/events";
import { useAppNavigation } from "../../navigators";
import { useToken } from "../hooks/useToken";
import { LinearGradient } from "expo-linear-gradient";

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

//@ts-ignore
export default function BookmarkScreen() {
  const { token } = useToken();
  const navigation = useAppNavigation();
  // Select post
  const [selectedPostID, setSelectedPostIDs] = useState(0);
  const handlePostClick = (id: number, title: string, status: string) => {
    navigation.navigate("ExplorePage", {
      screen: "Tour Detail",
      params: { id, title, status },
    });
    if (selectedPostID == id) {
      setSelectedPostIDs(0);
    } else {
      setSelectedPostIDs(id);
    }
  };
  const getPostInfo = async () => {
    try {
      let postInfoData = await api.get(
        "/user/bookmark",
        bookmarkInfoParser,
        token
      );
      if (postInfoData) {
        setPosts(postInfoData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [posts, setPosts] = useState<any[]>([]);

  useEvent<BookmarkEvent>("Bookmark", (event) => {
    getPostInfo();
  });

  useEffect(() => {
    getPostInfo();
  }, []);

  const ItemView = useCallback(
    ({ item }: ListRenderItemInfo<bookmarkInfoItem>) => (
      <TouchableOpacity
        key={item.id}
        onPress={() =>
          handlePostClick(item.id, item.title, item.status ? item.status : "")
        }
        style={[
          { flex: 1 },
          selectedPostID === item.id ? { backgroundColor: "#E7FFF0" } : null,
        ]}
      >
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
            {item.status === "open" ? (
              <Fontisto name="radio-btn-active" color="#0CD320" size={16} />
            ) : item.status === "complete" ? (
              <MaterialIcons
                name="remove-circle-outline"
                color="grey"
                size={20}
              />
            ) : (
              <Fontisto name="close" color="red" size={16} />
            )}
            <Text style={TourDetailScreenStyleSheet.titleKey}>
              {item.created_at?.substring(0, 10)}
            </Text>
          </View>
        </View>
        <View style={TourDetailScreenStyleSheet.rowContainer}>
          <View style={TourDetailScreenStyleSheet.row}>
            <Text style={TourDetailScreenStyleSheet.titleKey}>Title:</Text>
            <Text>{item.title}</Text>
          </View>
        </View>
        <View style={TourDetailScreenStyleSheet.rowContainer}>
          <Text style={TourDetailScreenStyleSheet.titleKey}>Destination:</Text>
          <Text>{item.trip_country}</Text>
        </View>
        <View style={TourDetailScreenStyleSheet.rowContainerWithEnd}>
          <View style={TourDetailScreenStyleSheet.row}>
            <Text style={TourDetailScreenStyleSheet.titleKey}>Period:</Text>
            <Text>{item.trip_period ? item.trip_period : "Pending"}</Text>
          </View>
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

  // Display
  return (
    <>
      <View style={BuddiesPageStyleSheet.container}>
        <LinearGradient
          // Background Linear Gradient
          colors={["#FFFFFF", "rgba(195,214,246,0.8)"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: "100%",
          }}
        />
        <FlatList
          data={posts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={ItemView}
          ItemSeparatorComponent={ItemSeparatorView}
        />
      </View>
    </>
  );
}
