//Buffer Line

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ListRenderItemInfo,
  Image,
  FlatList,
  RefreshControl,
} from "react-native";
import { useGet } from "../hooks/useGet";
import { useToken } from "../hooks/useToken";
import {
  addCommentParser,
  commentInfoParser,
  getIconResult,
} from "../utils/parser";
import { Avatar } from "@rneui/themed";
import { Card } from "react-native-paper";
import CommentScreenStyleSheet from "../StyleSheet/CommentScreenCss";
import Ionicons from "react-native-vector-icons/Ionicons";
import { apiOrigin } from "../utils/apiOrigin";
import useBoolean from "../hooks/useBoolean";
import { useCallback, useEffect, useRef, useState } from "react";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import { useAppNavigation, useAppRoute } from "../../navigators";
import { CommentInfo, ReplyInfoItem } from "../utils/types";
import useEvent from "react-use-event";
import { AddCommentEvent, RatingEvent } from "../utils/events";
import { id } from "cast.ts";
import { api } from "../apis/api";
import TourDetailScreenStyleSheet from "../StyleSheet/TourDetailScreenCss";
import { setStarRating } from "./BookmarkScreen";
import { ItemSeparatorView } from "./PostScreen";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../theme/variables";

export default function CommentScreen() {
  const { token, payload, setToken } = useToken();
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const params = useAppRoute<"Comment">();
  const [keyboardShow, setKeyboardShow] = useState(false);
  const navigation = useAppNavigation();
  let result = useGet("/user/icon", getIconResult).state?.path;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getCommentInfo();
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  // Get comments list
  const [comments, setComments] = useState<ReplyInfoItem[] | null>([]);
  const getCommentInfo = async () => {
    try {
      let commentInfoData = await api.get(
        `/comment/${params.post_id}`,
        commentInfoParser,
      );
      setComments(commentInfoData);
    } catch (err) {
      console.log({ err });
    }
  };
  useEffect(() => {
    getCommentInfo();
  }, []);
  useEvent<AddCommentEvent>("AddComment", (event) => {
    getCommentInfo();
  });
  useEvent<RatingEvent>("Rating", (event) => {
    getCommentInfo();
  });

  // Add comment
  const [content, setContent] = useState<string>("");
  const dispatchAddCommentEvent = useEvent<AddCommentEvent>("AddComment");
  const commentInfo = useRef<CommentInfo>({
    content: "",
  }).current;
  const inputRef = useRef<TextInput | null>(null);
  const submit = async () => {
    try {
      if (token === "") {
        throw new Error("Please login to add comment");
      }
      if (content !== "") {
        updateInputText("content", content);
      } else {
        throw new Error("Missing content");
      }
      let result = await api.post(
        `/comment/${params.post_id}/add`,
        commentInfo,
        addCommentParser,
        token,
      );
      dispatchAddCommentEvent("AddComment");
      inputRef?.current?.clear();
      //@ts-ignore
      flatListRef?.current?.scrollToEnd();
      IonNeverDialog.show({
        type: "success",
        title: `Success`,
        message: `Added new comment`,
        firstButtonVisible: true,
        firstButtonFunction: () => {
          IonNeverDialog.dismiss();
          Keyboard.dismiss();
        },
      });
    } catch (e) {
      IonNeverDialog.show({
        type: "warning",
        title: "Error",
        message: `${e}`,
        firstButtonVisible: true,
        firstButtonFunction: () => {
          IonNeverDialog.dismiss();
        },
      });
      console.log({ e });
    }
  };
  const updateInputText = (field: string, value: string) => {
    //@ts-ignore
    commentInfo[field as keyof CommentInfo] = value;
  };

  // Select avatar
  const handleAvatarClick = (id: number, username: string, post_id: string) => {
    navigation.navigate("Other Profile", {
      id,
      username,
      post_id,
    });
  };

  // Display comments list
  const flatListRef = useRef(null);
  const ItemView = useCallback(
    ({ item, index }: ListRenderItemInfo<ReplyInfoItem>) => (
      <>
        <View style={TourDetailScreenStyleSheet.postDetailContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableWithoutFeedback
              key={item.user_id}
              onPress={() =>
                handleAvatarClick(
                  item.user_id,
                  item.username,
                  params.post_id.toString(),
                )
              }
            >
              <Image
                style={TourDetailScreenStyleSheet.avatar}
                source={{
                  uri: `${apiOrigin}/${item.avatar_path}`,
                }}
              />
            </TouchableWithoutFeedback>
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
            <Text style={{ fontWeight: "800" }}>#{index + 1}</Text>
            <Text style={TourDetailScreenStyleSheet.titleKey}>
              {item.created_at.substring(0, 10)}
            </Text>
          </View>
        </View>
        <Card style={TourDetailScreenStyleSheet.contentContainer}>
          <View style={TourDetailScreenStyleSheet.rowContent}>
            <Text>{item.content}</Text>
          </View>
        </Card>
      </>
    ),
    [],
  );
  return (
    <TouchableWithoutFeedback>
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
        <FlatList
          ref={flatListRef}
          data={comments}
          keyExtractor={(item, index) => index.toString()}
          renderItem={ItemView}
          ItemSeparatorComponent={ItemSeparatorView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          style={{ flex: keyboardShow ? 0.38 : 0 }}
        >
          <View style={CommentScreenStyleSheet.bottomContainer}>
            <Avatar
              size={35}
              rounded
              //   containerStyle={UserPageStyleSheet.AvatarContainer}
              source={{
                uri: `${apiOrigin}/${result}`,
              }}
            />
            <View style={CommentScreenStyleSheet.textInputContainer}>
              <TextInput
                onBlur={() => {
                  setKeyboardShow(!keyboardShow);
                }}
                onFocus={() => {
                  setKeyboardShow(!keyboardShow);
                }}
                style={CommentScreenStyleSheet.textInput}
                onChangeText={(content) => {
                  setContent(content);
                }}
              ></TextInput>
            </View>

            <TouchableOpacity onPress={submit}>
              <Ionicons name="send" size={20} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </>
    </TouchableWithoutFeedback>
  );
}
