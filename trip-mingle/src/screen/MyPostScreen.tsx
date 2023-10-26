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
import {
  bookmarkInfoParser,
  likeParser,
  postInfoParser,
  snapListParser,
} from "../utils/parser";
import { PostInfoItem, bookmarkInfoItem } from "../utils/types";
import { api } from "../apis/api";
import { apiOrigin } from "../utils/apiOrigin";
import TourDetailScreenStyleSheet from "../StyleSheet/TourDetailScreenCss";
import AntDesign from "react-native-vector-icons/AntDesign";

import useEvent from "react-use-event";
import {
  AddPostEvent,
  AddSnapEvent,
  BookmarkEvent,
  LikeEvent,
  RatingEvent,
} from "../utils/events";
import { useAppNavigation } from "../../navigators";
import { useToken } from "../hooks/useToken";
import { LinearGradient } from "expo-linear-gradient";
import MyPostScreenScreenStyleSheet from "../StyleSheet/MemoryScreenCss";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import { useGet } from "../hooks/useGet";
import { Avatar } from "@rneui/themed";
import { SnapScreenStyleSheet } from "../StyleSheet/SnapScreenCss";
import { row, center } from "../StyleSheet/StyleSheetHelper";
import { Icon } from "@rneui/themed";
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
export default function MyPostScreen() {
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
        "/user/ownPost",
        bookmarkInfoParser,
        token,
      );
      if (postInfoData) {
        setPosts(postInfoData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [posts, setPosts] = useState<any[]>([]);

  useEvent<AddPostEvent>("AddPost", (event) => {
    getPostInfo();
  });

  useEffect(() => {
    getPostInfo();
  }, []);
  useEvent<RatingEvent>("Rating", (event) => {
    getPostInfo();
  });

  //Snap

  const [refreshing, setRefreshing] = useState(false);

  const { IonNeverDialog } = useIonNeverNotification();
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const snapList = useGet("/snap/own", snapListParser);

  useEvent<AddSnapEvent>("AddSnap", (event) => {
    snapList.reload();
  });

  // Likes
  const [isLike, setIsLike] = useState(false);
  const [likeNumber, setLikeNumber] = useState(0);
  const dispatchLikeEvent = useEvent<LikeEvent>("Like");
  const like = async (id: number) => {
    try {
      let likeResult = await api.post(`/like/${id}`, { id }, likeParser, token);
      setLikeNumber(likeResult.number_of_like);
      setIsLike(!isLike);
      dispatchLikeEvent("Like");
    } catch (err) {
      IonNeverDialog.show({
        type: "warning",
        title: "Error",
        message: `${err}`,
        firstButtonVisible: true,
        firstButtonFunction: () => {
          IonNeverDialog.dismiss();
        },
      });
      console.log({ err });
    }
  };
  useEvent<LikeEvent>("Like", (event) => {
    snapList.reload();
  });

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
    [],
  );
  const [isUse, setInUse] = useState(true);
  const [showSnap, setShowSnap] = useState(true);
  // Display
  return (
    <>
      <View style={BuddiesPageStyleSheet.container}>
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
        <View style={MyPostScreenScreenStyleSheet.selectButtonContainer}>
          <TouchableOpacity
            onPress={() => {
              setInUse(true);
              setShowSnap(true);
            }}
            style={
              isUse
                ? MyPostScreenScreenStyleSheet.inUseButton
                : MyPostScreenScreenStyleSheet.nonUseButton
            }
          >
            <Text
              style={
                isUse
                  ? MyPostScreenScreenStyleSheet.inUseText
                  : MyPostScreenScreenStyleSheet.nonUseText
              }
            >
              Snap
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setInUse(false);
              setShowSnap(false);
            }}
            style={
              isUse
                ? MyPostScreenScreenStyleSheet.nonUseButton
                : MyPostScreenScreenStyleSheet.inUseButton
            }
          >
            <Text
              style={
                isUse
                  ? MyPostScreenScreenStyleSheet.nonUseText
                  : MyPostScreenScreenStyleSheet.inUseText
              }
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
        {showSnap ? (
          <>
            {snapList.render((snapList) => (
              <FlatList
                data={snapList}
                renderItem={({ item }) => {
                  const {
                    post_id,
                    username,
                    content,
                    created_at,
                    location_name,
                    image_path,
                    avatar_path,
                    likeCount,
                    isLike,
                  } = item;
                  return (
                    <View style={SnapScreenStyleSheet.center}>
                      <View style={SnapScreenStyleSheet.outerContainer}>
                        <View style={SnapScreenStyleSheet.userContainer}>
                          <Avatar
                            size={30}
                            rounded
                            source={{
                              uri: `${apiOrigin}/${avatar_path}`,
                            }}
                          />
                          <Text>{username}</Text>
                        </View>
                        <View style={SnapScreenStyleSheet.imageContainer}>
                          <Image
                            source={{ uri: `${apiOrigin}/${image_path}` }}
                            style={{
                              width: "100%",
                              height: 350,
                              borderRadius: 10,
                            }}
                          />
                        </View>

                        <View
                          style={{
                            flexDirection: row,
                            justifyContent: "space-between",
                          }}
                        >
                          {token ? (
                            <View style={SnapScreenStyleSheet.buttonContainer}>
                              <TouchableOpacity
                                onPress={() => {
                                  like(post_id);
                                }}
                                style={SnapScreenStyleSheet.likeContainer}
                              >
                                <AntDesign
                                  name={isLike ? "like1" : "like2"}
                                  size={20}
                                />
                                <Text>{likeCount}</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={{
                                  flexDirection: row,
                                  alignItems: center,
                                  gap: 5,
                                }}
                                onPress={() => {
                                  navigation.navigate("Comment", { post_id });
                                }}
                              >
                                <MaterialCommunityIcons
                                  name="comment-plus"
                                  size={22}
                                />
                                <Text>Comment</Text>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <></>
                          )}
                          <View style={SnapScreenStyleSheet.timeContainer}>
                            <Text>
                              {new Date(created_at).toLocaleString("zh-CN", {
                                minute: "2-digit",
                                hour: "2-digit",
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                                hour12: false,
                              })}
                            </Text>
                          </View>
                        </View>
                        <View style={SnapScreenStyleSheet.spotContainer}>
                          <Icon
                            name="location-pin"
                            type="materialIcons"
                            size={16}
                          ></Icon>
                          <Text style={SnapScreenStyleSheet.spotText}>
                            {location_name}
                          </Text>
                        </View>
                        <View style={SnapScreenStyleSheet.contentContainer}>
                          <Text style={SnapScreenStyleSheet.contentText}>
                            {content}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            ))}
          </>
        ) : (
          <>
            <FlatList
              data={posts}
              keyExtractor={(item, index) => index.toString()}
              renderItem={ItemView}
              ItemSeparatorComponent={ItemSeparatorView}
            />
          </>
        )}
      </View>
    </>
  );
}
