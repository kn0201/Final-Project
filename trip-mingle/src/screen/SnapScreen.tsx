//Buffer Line
import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Image,
  FlatList,
} from "react-native";
import { AddSnapEvent, LikeEvent } from "../utils/events";
import { useCallback, useEffect, useState } from "react";
import { Avatar, Header } from "@rneui/themed";
import { useToken } from "../hooks/useToken";
import { Icon } from "@rneui/themed";
import { apiOrigin } from "../utils/apiOrigin";
import { center, iosBlue, row } from "../StyleSheet/StyleSheetHelper";
import { LinearGradient } from "expo-linear-gradient";
import { useAppNavigation } from "../../navigators";
import { SnapScreenStyleSheet } from "../StyleSheet/SnapScreenCss";
import AntDesign from "react-native-vector-icons/AntDesign";

import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";

import useEvent from "react-use-event";

import { api, api2 } from "../apis/api";
import { likeParser, snapListParser } from "../utils/parser";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Snap } from "../utils/types";
import { useGet } from "../hooks/useGet";

export default function SnapScreen() {
  const { token, payload } = useToken();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useAppNavigation();
  const [guestSnapList, setGuestSnapList] = useState<Snap[]>([]);
  const { IonNeverDialog } = useIonNeverNotification();
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const snapList = useGet("/snap", snapListParser);

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

  return (
    <>
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
      <Header
        backgroundColor="transparent"
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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ))}
    </>
  );
}
