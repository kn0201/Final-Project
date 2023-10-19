import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import { useEffect, useState } from "react";
import Fontisto from "react-native-vector-icons/Fontisto";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import BuddiesPageStyleSheet from "../StyleSheet/BuddiesPageCss";
import { useGet } from "../hooks/useGet";
import { postInfoParser } from "../utils/parser";
import { PostInfoItem } from "../utils/types";
import { api } from "../apis/api";
import { apiOrigin } from "../utils/apiOrigin";

//@ts-ignore
export default function TourScreen() {
  // Star rating
  const setStarRating = (rating: number) => {
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

  // Select post
  const [selectedPostID, setSelectedPostIDs] = useState(0);
  const handlePostClick = (id: number) => {
    if (selectedPostID == id) {
      setSelectedPostIDs(0);
    } else {
      setSelectedPostIDs(id);
    }
  };

  // Search bar
  const [search, setSearch] = useState("");
  const postInfo = useGet("/blog", postInfoParser);
  const postInfoData = postInfo.state || [];
  const [filteredPosts, setFilteredPosts] = useState<PostInfoItem[]>([]);
  const [posts, setPosts] = useState<PostInfoItem[]>([]);

  const getPostInfo = async () => {
    try {
      let postInfoData = await api.get("/blog", postInfoParser);
      setPosts(postInfoData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPostInfo();
    setFilteredPosts(posts);
  }, [postInfoData]);

  const searchFilterFunction = (text: string) => {
    const newData = text
      ? posts.filter((item) => {
          const textData = text.toUpperCase();
          return (
            (item.title && item.title.toUpperCase().includes(textData)) ||
            (item.content && item.content.toUpperCase().includes(textData)) ||
            (item.trip_country &&
              item.trip_country.toUpperCase().includes(textData)) ||
            (item.trip_location &&
              item.trip_location.some((location) =>
                location.name.toUpperCase().includes(textData),
              )) ||
            (item.trip_location &&
              item.trip_location.some((location) =>
                location.address.toUpperCase().includes(textData),
              )) ||
            (item.preferred_hobby &&
              item.preferred_hobby.toUpperCase().includes(textData))
          );
        })
      : posts;
    setFilteredPosts(newData);
    setSearch(text);
  };
  const ItemView = ({ item }: ListRenderItemInfo<PostInfoItem>) => {
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => handlePostClick(item.id)}
        style={[
          { flex: 1 },
          selectedPostID === item.id ? { backgroundColor: "#E7FFF0" } : null,
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            padding: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              style={{
                width: 30,
                height: 30,
                borderRadius: 20,
                resizeMode: "contain",
                marginRight: 10,
              }}
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 10,
              gap: 6,
            }}
          >
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
            <Text style={{ fontWeight: "600" }}>
              {item.created_at?.substring(0, 10)}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginLeft: 50,
            paddingBottom: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Text style={{ fontWeight: "600" }}>Title:</Text>
            <Text>{item.title}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginLeft: 50,
            paddingBottom: 10,
          }}
        >
          <Text style={{ fontWeight: "600" }}>Destination:</Text>
          <Text>{item.trip_country}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginLeft: 50,
            paddingBottom: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Text style={{ fontWeight: "600" }}>Period:</Text>
            <Text>{item.trip_period}</Text>
          </View>
          <View style={{ marginRight: 15 }}>
            <MaterialCommunityIcons name="comment-plus" size={16} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const ItemSeparatorView = () => {
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

  // Display
  return (
    <>
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
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
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
