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
  Modal,
} from "react-native";
import { api } from "../apis/api";
import {
  addCommentParser,
  allConfirmStatusParser,
  applicationInfoParser,
  applicationStatusParser,
  applyTourParser,
  bookmarkParser,
  bookmarkStatusParser,
  commentInfoParser,
  deletePostParser,
  getIconResult,
  likeParser,
  likeStatusParser,
  postDetailParser,
} from "../utils/parser";
import { CommentInfo, EnquireDetailItem, ReplyInfoItem } from "../utils/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { apiOrigin } from "../utils/apiOrigin";
import { ItemSeparatorView, setStarRating } from "./PostScreen";
import TourDetailScreenStyleSheet from "../StyleSheet/TourDetailScreenCss";
import CommentScreenStyleSheet from "../StyleSheet/CommentScreenCss";
import { Avatar } from "@rneui/themed";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useToken } from "../hooks/useToken";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Card } from "react-native-paper";
import useEvent from "react-use-event";
import {
  AddCommentEvent,
  BookmarkEvent,
  DeleteEvent,
  LikeEvent,
  LoginEvent,
  RatingEvent,
  UpdateProfileEvent,
} from "../utils/events";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";

const EnquireDetailScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const { token, payload } = useToken();
  let login_user_id = payload?.user_id;
  const { IonNeverDialog } = useIonNeverNotification();
  const [keyboardShow, setKeyboardShow] = useState(false);
  const [avatar, setAvatar] = useState<any>("yukimin.png");
  // Params
  const { id, title } = route.params || {
    id: 0,
    title: "Enquire Detail",
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
          <Text style={{ fontWeight: "600", fontSize: 18 }}>
            #{id} {limitedTitle}
          </Text>
        </View>
      ),
    });
  }, []);

  // Likes
  const [isLike, setIsLike] = useState(false);
  // const [likeNumber, setLikeNumber] = useState(0);

  function setLikeNumber(number_of_like: number) {
    setPost((post) => {
      if (post) {
        return { ...post, number_of_like };
      }
    });
  }

  const dispatchLikeEvent = useEvent<LikeEvent>("Like");
  const like = async () => {
    try {
      let likeResult = await api.post(`/like/${id}`, { id }, likeParser, token);
      setLikeNumber(likeResult.number_of_like);
      setIsLike(!isLike);
      dispatchLikeEvent({
        post_id: id,
        number_of_like: likeResult.number_of_like,
      });
    } catch (err) {
      console.log({ err });
    }
  };
  useEvent<LikeEvent>("Like", (event) => {
    if (event.post_id == id) {
      setLikeNumber(event.number_of_like);
    }
  });

  const getUserLikeStatus = async () => {
    try {
      let result = await api.get(`/like/status/${id}`, likeStatusParser, token);
      setIsLike(result.isLike);
    } catch (err) {
      console.log({ err });
    }
  };
  useEffect(() => {
    // getLikeNumber();
    if (token) {
      getUserLikeStatus();
    }
  }, [token]);

  // Bookmarks
  const [isBookmark, setIsBookmark] = useState(false);
  const dispatchBookmarkEvent = useEvent<BookmarkEvent>("Bookmark");
  const bookmark = async () => {
    try {
      let bookmarkResult = await api.post(
        `/bookmark/${id}`,
        { id },
        bookmarkParser,
        token
      );
      setIsBookmark(!isBookmark);
      dispatchBookmarkEvent("Bookmark");
    } catch (err) {
      console.log({ err });
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
        token
      );
      setIsBookmark(result.isBookmark);
    } catch (err) {
      console.log({ err });
    }
  };
  useEffect(() => {
    if (token) {
      getUserBookmarkStatus();
    }
  }, []);

  // Get post detail
  const [post, setPost] = useState<EnquireDetailItem | null>();
  const getPostDetail = async () => {
    try {
      let postDetailData = await api.get(`/blog/${id}`, postDetailParser);
      setPost(postDetailData);
      // setLikeNumber(postDetailData.number_of_like);
    } catch (err) {
      console.log({ err });
    }
  };
  useEffect(() => {
    getPostDetail();
  }, []);
  useEvent<RatingEvent>("Rating", (event) => {
    getPostDetail();
  });

  // Delete post
  const dispatchDeleteEvent = useEvent<DeleteEvent>("Delete");
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const deletePost = async () => {
    try {
      let result = await api.patch(
        `/blog/${id}`,
        { id },
        deletePostParser,
        token
      );
      if (result.result === true) {
        dispatchDeleteEvent("Delete");
        navigation.pop();
      } else {
        throw new Error(`Unauthorized to delete tour #${id}`);
      }
    } catch (err) {
      console.log({ err });
    }
  };
  const handleDelete = () => {
    IonNeverDialog.show({
      type: "warning",
      title: `Are you sure you want to delete tour #${id}?`,
      message: ``,
      firstButtonVisible: true,
      firstButtonText: "Cancel",
      firstButtonFunction: () => {
        IonNeverDialog.dismiss();
      },
      secondButtonVisible: true,
      secondButtonText: "Delete",
      secondButtonFunction: () => {
        deletePost();
      },
    });
    setPopoverVisible(false);
  };
  useEvent<DeleteEvent>("Delete", (event) => {
    getPostDetail();
  });

  // Get comments list
  const [comments, setComments] = useState<ReplyInfoItem[] | null>([]);
  const getCommentInfo = async () => {
    try {
      let commentInfoData = await api.get(`/comment/${id}`, commentInfoParser);
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

  // Get login user avatar
  const getUserIcon = async () => {
    if (token) {
      const avatar = await api.get("/user/userIcon", getIconResult, token);
      setAvatar(avatar.path);
    }
  };

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
      if (commentInfo.content !== "") {
        let result = await api.post(
          `/comment/${id}/add`,
          commentInfo,
          addCommentParser,
          token
        );
      } else {
        throw new Error("Missing content");
      }

      dispatchAddCommentEvent("AddComment");
      inputRef?.current?.clear();
      //@ts-ignore
      flatListRef?.current?.scrollToEnd();
      IonNeverDialog.show({
        type: "success",
        title: `Success`,
        message: `Added new comment to tour #${id}`,
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
  const handleAvatarClick = (
    id: number,
    username: string,
    post_id: string,
    post_user_id?: string
  ) => {
    navigation.navigate("Other Profile", {
      id,
      username,
      post_id,
      post_user_id,
    });
  };

  useEvent<LoginEvent>("Login", (event) => {
    getUserBookmarkStatus();
    getUserLikeStatus();

    navigation.pop();
  });
  useEvent<UpdateProfileEvent>("UpdateProfile", (event) => {
    getPostDetail();
    getUserIcon();
    getCommentInfo();
  });
  useEffect(() => {
    getUserIcon();
  }, []);

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
                  id,
                  post?.user_id.toString()
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
              {moment(new Date(item.created_at)).fromNow()}
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
    []
  );

  // Display
  return (
    <>
      <TouchableWithoutFeedback
        style={{ flex: 1 }}
        onPress={() => {
          Keyboard.dismiss();
          setPopoverVisible(false);
        }}
      >
        <>
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={{
              flex: keyboardShow
                ? // ? comments?.length != undefined && comments?.length > 0
                  0.635
                : // : 0.634
                  1,
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
                          handleAvatarClick(
                            post.user_id,
                            post.username,
                            id,
                            post?.user_id.toString()
                          );
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
                  {token ? (
                    <>
                      <View style={TourDetailScreenStyleSheet.row}>
                        <TouchableOpacity
                          onPress={like}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <AntDesign
                            name={isLike ? "like1" : "like2"}
                            size={20}
                          />
                          <Text>{post?.number_of_like}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ marginTop: 2 }}
                          onPress={bookmark}
                        >
                          <Ionicons
                            name={isBookmark ? "bookmark" : "bookmark-outline"}
                            size={20}
                          />
                        </TouchableOpacity>

                        {login_user_id !== post?.user_id ? (
                          <></>
                        ) : (
                          <TouchableWithoutFeedback
                            style={{ marginTop: 2 }}
                            onPress={() => {
                              setPopoverVisible(!isPopoverVisible);
                            }}
                          >
                            <MaterialCommunityIcons
                              name="dots-vertical"
                              size={26}
                            />
                          </TouchableWithoutFeedback>
                        )}
                      </View>
                      <Modal
                        transparent={true}
                        animationType="fade"
                        visible={isPopoverVisible}
                      >
                        <TouchableOpacity
                          style={TourDetailScreenStyleSheet.modalContainer}
                          onPress={() => setPopoverVisible(false)}
                        >
                          <View style={TourDetailScreenStyleSheet.modalContent}>
                            <TouchableOpacity onPress={handleDelete}>
                              <Text style={{ color: "red" }}>Delete</Text>
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      </Modal>
                    </>
                  ) : (
                    <></>
                  )}
                </View>
                <View style={TourDetailScreenStyleSheet.rowContainer}>
                  <Text style={TourDetailScreenStyleSheet.titleKey}>
                    {post?.created_at
                      ? moment(new Date(post.created_at)).fromNow()
                      : null}
                  </Text>
                </View>

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

              <ItemSeparatorView />

              <ItemSeparatorView />
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
            <ItemSeparatorView />

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
                    updateInputText("content", content);
                  }}
                  ref={inputRef}
                ></TextInput>
              </View>
              <TouchableOpacity
                style={{ paddingRight: 10 }}
                onPress={() => {
                  token
                    ? submit()
                    : IonNeverDialog.show({
                        type: "info",
                        title: "You are Guest",
                        message: "Please Login / Sign Up",
                        firstButtonVisible: true,
                        firstButtonFunction: () => {},
                      });
                }}
              >
                <Ionicons name="send" size={20} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </>
      </TouchableWithoutFeedback>
    </>
  );
};

export default EnquireDetailScreen;
