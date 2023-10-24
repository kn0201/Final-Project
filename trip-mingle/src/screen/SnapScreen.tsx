//Buffer Line
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image,
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
import { likeParser, likeStatusParser } from "../utils/parser";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function SnapScreen() {
  const { token } = useToken();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useAppNavigation();
  const { IonNeverDialog } = useIonNeverNotification();
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getSnapList = async () => {
    let json = await api.get("/snap", object({}));
    console.log(json);
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
  const like = async () => {
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
    getLikeNumber();
  });

  // Get like number
  const getLikeNumber = async () => {
    try {
      let result = await api.get(`/like/${id}`, likeParser);
      setLikeNumber(result.number_of_like);
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
  // const getUserLikeStatus = async () => {
  //   try {
  //     let result = await api.get(`/like/status/${id}`, likeStatusParser, token);
  //     setIsLike(result.isLike);
  //   } catch (err) {
  //     IonNeverDialog.show({
  //       type: "warning",
  //       title: "Error",
  //       message: `${err}`,
  //       firstButtonVisible: true,
  //       firstButtonFunction: () => {
  //         IonNeverDialog.dismiss();
  //       },
  //     });
  //     console.log({ err });
  //   }
  // };
  // useEffect(() => {
  //   getLikeNumber();
  //   if (token) {
  //     getUserLikeStatus();
  //   }
  // }, []);

  type ItemProps = { title: string };

  const Item = ({ title }: ItemProps) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={SnapScreenStyleSheet.center}>
          <View style={SnapScreenStyleSheet.outerContainer}>
            <View style={SnapScreenStyleSheet.userContainer}>
              <Avatar
                size={30}
                rounded
                source={{
                  uri: `${apiOrigin}/trip_mingle_logo_2.png`,
                }}
              />
              <Text>Username</Text>
            </View>
            <View style={SnapScreenStyleSheet.imageContainer}>
              <Image
                source={{ uri: `${apiOrigin}/kyoto.jpg` }}
                style={{
                  width: "100%",
                  height: 350,
                  borderRadius: 10,
                }}
              />
            </View>

            <View
              style={{ flexDirection: row, justifyContent: "space-between" }}
            >
              {token ? (
                <View style={SnapScreenStyleSheet.buttonContainer}>
                  <TouchableOpacity
                    onPress={like}
                    style={SnapScreenStyleSheet.likeContainer}
                  >
                    <AntDesign name={isLike ? "like1" : "like2"} size={20} />
                    <Text>{likeNumber}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flexDirection: row, alignItems: center, gap: 5 }}
                    onPress={() => {
                      navigation.navigate("Comment");
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
                <Text>2023-10-24 03:14</Text>
              </View>
            </View>
            <View style={SnapScreenStyleSheet.spotContainer}>
              <Icon name="location-pin" type="materialIcons" size={16}></Icon>
              <Text style={SnapScreenStyleSheet.spotText}>Hello World</Text>
            </View>
            <View style={SnapScreenStyleSheet.contentContainer}>
              <Text style={SnapScreenStyleSheet.contentText}>
                ............................................................
                contentContainercontentContainercontentContaincontentContainercontentContainer
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
