import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ListRenderItemInfo,
  FlatList,
  ScrollView,
} from "react-native";
import { api } from "../apis/api";
import {
  addCommentParser,
  bookmarkParser,
  bookmarkStatusParser,
  commentInfoParser,
  getIconResult,
  likeParser,
  likeStatusParser,
  postDetailParser,
} from "../utils/parser";
import { CommentInfo, PostDetailItem, ReplyInfoItem } from "../utils/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { apiOrigin } from "../utils/apiOrigin";
import Fontisto from "react-native-vector-icons/Fontisto";
import { ItemSeparatorView, setStarRating } from "./PostScreen";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import TourDetailScreenStyleSheet from "../StyleSheet/TourDetailScreenCss";
import CommentScreenStyleSheet from "../StyleSheet/CommentScreenCss";
import { Avatar } from "@rneui/themed";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useToken } from "../hooks/useToken";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Card } from "react-native-paper";
import useEvent from "react-use-event";
import { AddCommentEvent, BookmarkEvent, LikeEvent } from "../utils/events";
import { useGet } from "../hooks/useGet";

const TourDetailScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const { token, payload, setToken } = useToken();
  const { IonNeverDialog } = useIonNeverNotification();
  const [keyboardShow, setKeyboardShow] = useState(false);

  // Params
  const { id, title, status } = route.params || {
    id: 0,
    title: "Tour Detail",
    status: "",
  };

  // Header
  const maxTitleLength = 16;
  const limitedTitle =
    title.length > maxTitleLength
      ? title.substring(0, maxTitleLength) + "..."
      : title;
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            marginLeft: 15,
          }}
        >
          {status === "open" ? (
            <Fontisto name="radio-btn-active" color="#0CD320" size={16} />
          ) : status === "complete" ? (
            <MaterialIcons
              name="remove-circle-outline"
              color="grey"
              size={20}
            />
          ) : (
            <Fontisto name="close" color="red" size={16} />
          )}
          <Text style={{ fontWeight: "600", fontSize: 18 }}>
            #{id} {limitedTitle}
          </Text>
        </View>
      ),
    });
  }, [status]);

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
      console.log(err);
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
      console.log(err);
    }
  };
  const getUserLikeStatus = async () => {
    try {
      let result = await api.get(`/like/status/${id}`, likeStatusParser, token);
      setIsLike(result.isLike);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getLikeNumber();
    getUserLikeStatus();
  }, []);

  // Bookmarks
  const [isBookmark, setIsBookmark] = useState(false);
  const dispatchBookmarkEvent = useEvent<BookmarkEvent>("Bookmark");
  const bookmark = async () => {
    try {
      let bookmarkResult = await api.post(
        `/bookmark/${id}`,
        { id },
        bookmarkParser,
        token,
      );
      setIsBookmark(!isBookmark);
      dispatchBookmarkEvent("Bookmark");
    } catch (err) {
      console.log(err);
    }
  };
  useEvent<BookmarkEvent>("Bookmark", (event) => {
    getUserBookmarkStatus();
  });

  // Get bookmark status
  const getUserBookmarkStatus = async () => {
    try {
      let result = await api.get(
        `/bookmark/${id}`,
        bookmarkStatusParser,
        token,
      );
      setIsBookmark(result.isBookmark);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getUserBookmarkStatus();
  }, []);

  // Get post detail
  const [post, setPost] = useState<PostDetailItem | null>();
  const getPostDetail = async () => {
    try {
      let postDetailData = await api.get(`/blog/${id}`, postDetailParser);
      setPost(postDetailData);
      setLikeNumber(postDetailData.number_of_like);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getPostDetail();
    setPost(post);
    setLikeNumber(likeNumber);
  }, []);
  const locationNames = post?.trip_location?.map((location) => location.name);
  const locationNamesString = Array.isArray(locationNames)
    ? locationNames.join(", ")
    : "";

  // Get comments list
  const [comments, setComments] = useState<ReplyInfoItem[] | null>([]);
  const getCommentInfo = async () => {
    try {
      let commentInfoData = await api.get(`/comment/${id}`, commentInfoParser);
      setComments(commentInfoData);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getCommentInfo();
  }, []);
  useEvent<AddCommentEvent>("AddComment", (event) => {
    getCommentInfo();
  });

  // Get login user avatar
  let avatar = useGet("/user/userIcon", getIconResult).state?.path;

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
        `/comment/${id}/add`,
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
        message: `Added new comment to post #${id}`,
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
    navigation.navigate("Other Profile", { id, username, post_id });
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
              onPress={() => handleAvatarClick(item.user_id, item.username, id)}
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

  // Display
  return (
    <>
      <TouchableWithoutFeedback
        style={{ flex: 1 }}
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <>
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={{
              flex: keyboardShow
                ? comments?.length != undefined && comments?.length > 0
                  ? 0.839
                  : 0.634
                : 1,
            }}
          >
            <View style={{ maxHeight: "50%" }}>
              <ScrollView style={{ flexGrow: 0 }}>
                <View style={TourDetailScreenStyleSheet.postDetailContainer}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <TouchableWithoutFeedback
                      onPress={() => {
                        if (post && post.user_id) {
                          handleAvatarClick(post.user_id, post.username, id);
                        } else {
                          return;
                        }
                      }}
                    >
                      <Image
                        style={TourDetailScreenStyleSheet.avatar}
                        source={{
                          uri: `${apiOrigin}/${post?.avatar_path}`,
                        }}
                      />
                    </TouchableWithoutFeedback>
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
                    <TouchableOpacity
                      onPress={like}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <AntDesign name={isLike ? "like1" : "like2"} size={20} />
                      <Text>{likeNumber}</Text>
                      <TouchableOpacity onPress={bookmark}>
                        <Ionicons
                          name={isBookmark ? "bookmark" : "bookmark-outline"}
                          size={20}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={TourDetailScreenStyleSheet.rowContainer}>
                  <Text style={TourDetailScreenStyleSheet.titleKey}>
                    {post?.created_at?.substring(0, 10)}
                  </Text>
                </View>
                {post?.trip_period ? (
                  <>
                    <View style={TourDetailScreenStyleSheet.rowContainer}>
                      <View style={TourDetailScreenStyleSheet.row}>
                        <Text style={TourDetailScreenStyleSheet.titleKey}>
                          Period:
                        </Text>
                        <Text>
                          {post?.trip_period ? post.trip_period : "Pending"}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : null}
                <View style={TourDetailScreenStyleSheet.rowContainer}>
                  <Text style={TourDetailScreenStyleSheet.titleKey}>
                    Destination:
                  </Text>
                  <Text>{post?.trip_country}</Text>
                </View>
                {post?.trip_location?.length !== undefined &&
                post?.trip_location?.length > 0 ? (
                  <>
                    <View style={TourDetailScreenStyleSheet.rowContainer}>
                      <View style={TourDetailScreenStyleSheet.row}>
                        <Text style={TourDetailScreenStyleSheet.titleKey}>
                          Spot:
                        </Text>
                        <Text>{locationNamesString}</Text>
                      </View>
                    </View>
                  </>
                ) : null}
                {post?.trip_budget ? (
                  <>
                    <View style={TourDetailScreenStyleSheet.rowContainer}>
                      <View style={TourDetailScreenStyleSheet.row}>
                        <Text style={TourDetailScreenStyleSheet.titleKey}>
                          Budget:
                        </Text>
                        <Text>
                          {post?.trip_budget ? post.trip_budget : "Pending"}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : null}
                <View style={TourDetailScreenStyleSheet.rowContainer}>
                  <View style={TourDetailScreenStyleSheet.row}>
                    <Text style={TourDetailScreenStyleSheet.titleKey}>
                      Headcount:
                    </Text>
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
                        <Text>
                          {post?.preferred_language
                            ? post.preferred_language
                            : "Any"}
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
                        <Text>
                          {post?.preferred_hobby ? post.preferred_hobby : "Any"}
                        </Text>
                      </View>
                    </View>
                  </>
                ) : null}
                <View style={TourDetailScreenStyleSheet.contentTitleContainer}>
                  <View style={TourDetailScreenStyleSheet.row}>
                    <Text style={TourDetailScreenStyleSheet.titleKey}>
                      CONTENT
                    </Text>
                  </View>
                </View>
                <Card style={TourDetailScreenStyleSheet.contentContainer}>
                  <View style={TourDetailScreenStyleSheet.rowContent}>
                    <Text>{post?.content}</Text>
                  </View>
                </Card>
              </ScrollView>
            </View>
            <View style={TourDetailScreenStyleSheet.replyContainer}>
              <Text style={TourDetailScreenStyleSheet.titleKey}>REPLY</Text>
            </View>
            <ItemSeparatorView />
            <FlatList
              ref={flatListRef}
              data={comments}
              keyExtractor={(item, index) => index.toString()}
              renderItem={ItemView}
              ItemSeparatorComponent={ItemSeparatorView}
            />
            <View style={CommentScreenStyleSheet.bottomContainer}>
              <Avatar
                size={30}
                rounded
                source={{
                  uri: `${apiOrigin}/${avatar}`,
                }}
              />
              <View style={CommentScreenStyleSheet.textInputContainer}>
                <TextInput
                  multiline
                  onBlur={() => {
                    setKeyboardShow(false);
                  }}
                  onFocus={() => {
                    setKeyboardShow(true);
                  }}
                  style={CommentScreenStyleSheet.textInput}
                  onChangeText={(content) => {
                    setContent(content);
                  }}
                  value={content}
                  ref={inputRef}
                ></TextInput>
              </View>
              <TouchableOpacity style={{ paddingRight: 10 }} onPress={submit}>
                <Ionicons name="send" size={20} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </>
      </TouchableWithoutFeedback>
    </>
  );
};

export default TourDetailScreen;
