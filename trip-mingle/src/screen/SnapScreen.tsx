//Buffer Line
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image,
  FlatList,
} from "react-native";
import { AddPostEvent, AddSnapEvent, LikeEvent } from "../utils/events";
import { useCallback, useEffect, useState } from "react";
import { Avatar, Header } from "@rneui/themed";
import { useToken } from "../hooks/useToken";
import { Icon } from "@rneui/themed";
import { apiOrigin } from "../utils/apiOrigin";
import { center, flex, iosBlue, row } from "../StyleSheet/StyleSheetHelper";
import UserPageStyleSheet from "../StyleSheet/UserPageCss";
import { useAppNavigation } from "../../navigators";
import { SnapScreenStyleSheet } from "../StyleSheet/SnapScreenCss";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import { id, object } from "cast.ts";
import useEvent from "react-use-event";
import TourDetailScreenStyleSheet from "../StyleSheet/TourDetailScreenCss";
import { api } from "../apis/api";
import { likeParser, likeStatusParser, snapListParser } from "../utils/parser";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Snap } from "../utils/types";

export default function SnapScreen() {
  const { token } = useToken();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useAppNavigation();
  const { IonNeverDialog } = useIonNeverNotification();
  const [snapList, setSnapList] = useState<Snap[]>([]);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getSnapList = async () => {
    if (token) {
      let json = await api.get("/snap", snapListParser, token);
      setSnapList(json);
    } else {
      let json = await api.get("/snap", snapListParser);
      setSnapList(json);
    }
  };
  useEffect(() => {
    getSnapList();
  }, []);

  useEvent<AddSnapEvent>("AddSnap", (event) => {
    getSnapList();
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
    getSnapList();
  });

  const Item = ({
    post_id,
    username,
    content,
    created_at,
    location_name,
    image_path,
    avatar_path,
    likeCount,
    isLike,
  }: Snap) => (
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

        <View style={{ flexDirection: row, justifyContent: "space-between" }}>
          {token ? (
            <View style={SnapScreenStyleSheet.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  like(post_id);
                }}
                style={SnapScreenStyleSheet.likeContainer}
              >
                <AntDesign name={isLike ? "like1" : "like2"} size={20} />
                <Text>{likeCount}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: row, alignItems: center, gap: 5 }}
                onPress={() => {
                  navigation.navigate("Comment", { post_id });
                }}
              >
                <MaterialCommunityIcons name="comment-plus" size={22} />
                <Text>Comment</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <></>
          )}
          <View style={SnapScreenStyleSheet.timeContainer}>
            <Text>
              {(created_at = new Date(created_at).toLocaleDateString())}
            </Text>
          </View>
        </View>
        <View style={SnapScreenStyleSheet.spotContainer}>
          <Icon name="location-pin" type="materialIcons" size={16}></Icon>
          <Text style={SnapScreenStyleSheet.spotText}>{location_name}</Text>
        </View>
        <View style={SnapScreenStyleSheet.contentContainer}>
          <Text style={SnapScreenStyleSheet.contentText}>{content}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <Header
        backgroundColor="#fff"
        centerComponent={{
          text: "SNAP",
          style: { color: "#000000", fontSize: 17, fontWeight: "600" },
        }}
        rightComponent={
          token ? (
            <View>
              <TouchableOpacity
                style={SnapScreenStyleSheet.rightComponent}
                onPress={() => navigation.navigate("NewSnap")}
              >
                <Text style={{ color: iosBlue }}>New Snap </Text>
                <Icon
                  name="new-message"
                  type="entypo"
                  color={iosBlue}
                  size={20}
                  style={{ marginEnd: 8 }}
                ></Icon>
              </TouchableOpacity>
            </View>
          ) : (
            <></>
          )
        }
        containerStyle={{ width: "100%" }}
        placement="center"
      />

      <FlatList
        data={snapList}
        renderItem={({ item }) => (
          <Item
            post_id={item.post_id}
            user_id={item.user_id}
            username={item.username}
            content={item.content}
            created_at={item.created_at}
            location_name={item.location_name}
            image_path={item.image_path}
            avatar_id={item.avatar_id}
            avatar_path={item.avatar_path}
            likeCount={item.likeCount}
            isLike={item.isLike}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </>
  );
}
