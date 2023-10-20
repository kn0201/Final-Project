import {
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { api } from "../apis/api";
import { postDetailParser } from "../utils/parser";
import { PostDetailItem } from "../utils/types";
import { useEffect, useState } from "react";
import { useGet } from "../hooks/useGet";
import { apiOrigin } from "../utils/apiOrigin";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Fontisto from "react-native-vector-icons/Fontisto";
import { ItemSeparatorView, setStarRating } from "./PostScreen";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import TourDetailScreenStyleSheet from "../StyleSheet/TourDetailScreenCss";
import { Card } from "react-native-paper";
import CommentScreenStyleSheet from "../StyleSheet/CommentScreenCss";
import { Avatar } from "@rneui/themed";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useToken } from "../hooks/useToken";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";

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
  const { id, title } = route.params || {
    id: 0,
    title: "Tour Detail",
  };
  useEffect(() => {
    navigation.setOptions({ headerTitle: `#${id} ${title}` });
  }, [title]);
  const postDetail = useGet(`/blog/${id}`, postDetailParser);
  const postDetailData = postDetail.state || null;
  const [post, setPost] = useState<PostDetailItem | null>(postDetailData);
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
  }, [postDetailData]);
  const locationNames = post?.trip_location?.map((location) => location.name);
  const locationNamesString = Array.isArray(locationNames)
    ? locationNames.join(", ")
    : "";

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

  return (
    <>
      <Card style={{ margin: 15, marginRight: 20, height: "96%" }}>
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
            {post?.status === "open" ? (
              <Fontisto name="radio-btn-active" color="#0CD320" size={16} />
            ) : post?.status === "complete" ? (
              <MaterialIcons
                name="remove-circle-outline"
                color="grey"
                size={20}
              />
            ) : (
              <Fontisto name="close" color="red" size={16} />
            )}
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
                <Text style={TourDetailScreenStyleSheet.titleKey}>Period:</Text>
                <Text>{post?.trip_period ? post.trip_period : "Pending"}</Text>
              </View>
            </View>
          </>
        ) : null}
        <View style={TourDetailScreenStyleSheet.rowContainer}>
          <Text style={TourDetailScreenStyleSheet.titleKey}>Destination:</Text>
          <Text>{post?.trip_country}</Text>
        </View>
        {post?.trip_location?.length !== undefined &&
        post?.trip_location?.length > 0 ? (
          <>
            <View style={TourDetailScreenStyleSheet.rowContainer}>
              <View style={TourDetailScreenStyleSheet.row}>
                <Text style={TourDetailScreenStyleSheet.titleKey}>Spot:</Text>
                <Text>{locationNamesString}</Text>
              </View>
            </View>
          </>
        ) : null}
        {post?.trip_budget ? (
          <>
            <View style={TourDetailScreenStyleSheet.rowContainer}>
              <View style={TourDetailScreenStyleSheet.row}>
                <Text style={TourDetailScreenStyleSheet.titleKey}>Budget:</Text>
                <Text>{post?.trip_budget ? post.trip_budget : "Pending"}</Text>
              </View>
            </View>
          </>
        ) : null}
        <View style={TourDetailScreenStyleSheet.rowContainer}>
          <View style={TourDetailScreenStyleSheet.row}>
            <Text style={TourDetailScreenStyleSheet.titleKey}>Headcount:</Text>
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
              </View>
            </View>
            <View style={TourDetailScreenStyleSheet.rowContainer}>
              <View style={TourDetailScreenStyleSheet.row}>
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
              </View>
            </View>
            <View style={TourDetailScreenStyleSheet.rowContainer}>
              <View style={TourDetailScreenStyleSheet.row}>
                <Text>
                  {post?.preferred_language ? post.preferred_language : "Any"}
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
              </View>
            </View>
            <View style={TourDetailScreenStyleSheet.rowContainer}>
              <View style={TourDetailScreenStyleSheet.row}>
                <Text>
                  {post?.preferred_hobby ? post.preferred_hobby : "Any"}
                </Text>
              </View>
            </View>
          </>
        ) : null}
        <View style={TourDetailScreenStyleSheet.rowContainer}>
          <View style={TourDetailScreenStyleSheet.row}>
            <Text style={TourDetailScreenStyleSheet.titleKey}>Content:</Text>
          </View>
        </View>
        <View style={TourDetailScreenStyleSheet.rowContainer}>
          <View style={TourDetailScreenStyleSheet.rowContent}>
            <Text>{post?.content}</Text>
          </View>
        </View>
        <ItemSeparatorView />
        <View style={TourDetailScreenStyleSheet.replyContainer}>
          <Text style={TourDetailScreenStyleSheet.titleKey}>Reply:</Text>
        </View>
        <ItemSeparatorView />
        <ScrollView style={{ height: "100%" }}>
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
              <Text style={{ fontWeight: "800" }}>#{post?.id}</Text>
              <Text style={TourDetailScreenStyleSheet.titleKey}>
                {post?.created_at?.substring(0, 10)}
              </Text>
            </View>
          </View>
          <View style={TourDetailScreenStyleSheet.rowContainer}>
            <View style={TourDetailScreenStyleSheet.rowContent}>
              <Text>{post?.content}</Text>
            </View>
          </View>
          <ItemSeparatorView />
        </ScrollView>
        <View style={CommentScreenStyleSheet.bottomContainer}>
          <Avatar
            size={35}
            rounded
            source={{
              uri: `${apiOrigin}/${post?.avatar_path}`,
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
            ></TextInput>
          </View>

          <TouchableOpacity onPress={submit}>
            <Ionicons name="send" size={20} />
          </TouchableOpacity>
        </View>
      </Card>
    </>
  );
};

export default TourDetailScreen;
