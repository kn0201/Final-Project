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
import { postInfoParser } from "../utils/parser";
import { PostInfoItem } from "../utils/types";
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
export default function TourScreen({ navigation }) {
  // Select post
  const [selectedPostID, setSelectedPostIDs] = useState(0);
  const handlePostClick = (id: number, title: string, status: string) => {
    navigation.navigate("Tour Detail", { id, title, status });
    if (selectedPostID == id) {
      setSelectedPostIDs(0);
    } else {
      setSelectedPostIDs(id);
    }
  };
  const getPostInfo = async () => {
    try {
      let postInfoData = await api.get("/blog", postInfoParser);
      setPosts(postInfoData);
      setFilteredPosts(postInfoData);
    } catch (err) {
      console.log(err);
    }
  };

  // Update post list
  useEvent<AddPostEvent>("AddPost", (event) => {
    if (event.post_type == "tour") {
      getPostInfo();
    }
  });
  useEvent<LikeEvent>("Like", (event) => {
    getPostInfo();
  });
  useEvent<AddCommentEvent>("AddComment", (event) => {
    getPostInfo();
  });

  // Search bar
  const [search, setSearch] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<PostInfoItem[]>([]);
  const [posts, setPosts] = useState<PostInfoItem[]>([]);

  useEffect(() => {
    getPostInfo();
  }, []);

  const searchFilterFunction = (text: string) => {
    const newData = text
      ? posts.filter((item) => {
          const textData = text.toUpperCase();
          return (
            (item.title && item.title.toUpperCase().includes(textData)) ||
            (item.content && item.content.toUpperCase().includes(textData)) ||
            (item.trip_country &&
              item.trip_country.toUpperCase().includes(textData)) ||
            (item.trip_location &&
              item.trip_location.some((location) =>
                location.name.toUpperCase().includes(textData),
              )) ||
            (item.trip_location &&
              item.trip_location.some((location) =>
                location.address.toUpperCase().includes(textData),
              )) ||
            (item.preferred_hobby &&
              item.preferred_hobby.toUpperCase().includes(textData))
          );
        })
      : posts;
    setFilteredPosts(newData);
    setSearch(text);
  };

  const ItemView = useCallback(
    ({ item }: ListRenderItemInfo<PostInfoItem>) => (
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
    [],
  );

  // Display
  return (
    <>
      <TextInput
        style={BuddiesPageStyleSheet.textInputStyle}
        onChangeText={(text) => searchFilterFunction(text)}
        value={search}
        underlineColorAndroid="transparent"
        placeholder="Search..."
      />
      <View style={BuddiesPageStyleSheet.container}>
        <FlatList
          data={filteredPosts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={ItemView}
          ItemSeparatorComponent={ItemSeparatorView}
        />
      </View>
      {/* <MaterialIcons
        name="add-circle"
        size={60}
        style={{ position: "absolute", bottom: 10, right: 10 }}
        onPress={() => navigation.navigate("Add Post")}
      /> */}
    </>
  );
}
