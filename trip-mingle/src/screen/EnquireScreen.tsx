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
import { useCallback, useEffect, useState } from "react";
import Fontisto from "react-native-vector-icons/Fontisto";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import BuddiesPageStyleSheet from "../StyleSheet/BuddiesPageCss";
import { enquireInfoParser, postInfoParser } from "../utils/parser";
import { EnquireInfoItem, PostInfoItem } from "../utils/types";
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
export default function EnquireScreen({ navigation }) {
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
  const [search, setSearch] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<EnquireInfoItem[]>([]);
  const [posts, setPosts] = useState<EnquireInfoItem[]>([]);

  useEffect(() => {
    getPostInfo();
  }, []);

  const searchFilterFunction = (text: string) => {
    const newData = text
      ? posts.filter((item) => {
          const textData = text.toUpperCase();
          return (
            (item.title && item.title.toUpperCase().includes(textData)) ||
            (item.content && item.content.toUpperCase().includes(textData))
          );
        })
      : posts;
    setFilteredPosts(newData);
    setSearch(text);
  };

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
              {new Date(item.created_at).toLocaleString("zh-CN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
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
    [],
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
