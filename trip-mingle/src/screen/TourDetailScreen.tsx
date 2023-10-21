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
import { commentInfoParser, postDetailParser } from "../utils/parser";
import { PostDetailItem, ReplyInfoItem } from "../utils/types";
import { useCallback, useEffect, useState } from "react";
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

const TourDetailScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const { token, payload, setToken } = useToken();
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const [keyboardShow, setKeyboardShow] = useState(false);
  const { id, title, status } = route.params || {
    id: 0,
    title: "Tour Detail",
    status: "",
  };
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
  }, [title, status]);
  const [isLike, setIsLike] = useState(false);
  const [isBookmark, setIsBookmark] = useState(false);
  const like = () => {
    setIsLike(!isLike);
  };
  const bookmark = () => {
    setIsBookmark(!isBookmark);
  };

  const [post, setPost] = useState<PostDetailItem | null>();
  const getPostDetail = async () => {
    try {
      let postDetailData = await api.get(`/blog/${id}`, postDetailParser);
      setPost(postDetailData);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getPostDetail();
    setPost(post);
  }, []);
  const locationNames = post?.trip_location?.map((location) => location.name);
  const locationNamesString = Array.isArray(locationNames)
    ? locationNames.join(", ")
    : "";

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

  const submit = () => {
    if (token != "") {
      console.log("ok");
    } else {
      IonNeverDialog.show({
        type: "warning",
        title: "Guest cannot Comment",
        message: "Please Login",
        firstButtonVisible: true,
      });
    }
  };

  const ItemView = useCallback(
    ({ item }: ListRenderItemInfo<ReplyInfoItem>) => (
      <>
        <View style={TourDetailScreenStyleSheet.postDetailContainer}>
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
              flex: keyboardShow ? 0.839 : 1,
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
                    <Image
                      style={TourDetailScreenStyleSheet.avatar}
                      source={{
                        uri: `${apiOrigin}/${post?.avatar_path}`,
                      }}
                    />
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
                      <Text>{post?.number_of_like}</Text>
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
                  uri: `${apiOrigin}/${post?.avatar_path}`,
                }}
              />
              <View style={CommentScreenStyleSheet.textInputContainer}>
                <TextInput
                  multiline
                  onBlur={() => {
                    setKeyboardShow(!keyboardShow);
                  }}
                  onFocus={() => {
                    setKeyboardShow(!keyboardShow);
                  }}
                  style={CommentScreenStyleSheet.textInput}
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
