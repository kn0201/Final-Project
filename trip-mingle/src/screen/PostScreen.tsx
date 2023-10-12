import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
  Button,
} from "react-native";
import {
  ContextType,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { SpeedDial } from "@rneui/themed";
import Fontisto from "react-native-vector-icons/Fontisto";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import BuddiesPageStyleSheet from "../StyleSheet/BuddiesPageCss";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import AddPostNavigator from "../pages/AddPostNavigator";

type Post = {
  id: number;
  avatar_path: string;
  username: string;
  rating: number;
  title: string;
  content: string;
  trip_country: string;
  trip_location: string[] | null;
  trip_period: string | null;
  trip_headcount: number | null;
  trip_budget: string | null;
  preferred_gender: boolean | null;
  preferred_age: string[] | null;
  preferred_language: string[] | null;
  preferred_skill: string[] | null;
  preferred_hobby: string[] | null;
  status: string;
  created_at: string;
  like: number[] | null;
  reply: Reply[] | null;
  view: number;
};

type Reply = {
  id: number;
  avatar_path: string;
  username: string;
  content: string;
  application: boolean;
  created_at: string;
};

// type UserContextType = {
//   userId: string;
//   setUserId: React.Dispatch<React.SetStateAction<string>>;
// };

// type DecodedToken = {
//   userId: string;
// };

// const UserType = createContext<UserContextType | null>(null);

// const UserContext = ({ children }: { children: ReactNode }) => {
//   const [userId, setUserId] = useState("");
//   return (
//     <UserType.Provider value={{ userId, setUserId }}>
//       {children}
//     </UserType.Provider>
//   );
// };

//@ts-ignore
export default function TourScreen({ navigation }) {
  // Configure user
  // const [users, setUsers] = useState([]);
  // const userContext = useContext(UserType);

  // if (userContext) {
  //   const { userId, setUserId } = userContext;

  //   useEffect(() => {
  //     const fetchUsers = async () => {
  //       const token = await AsyncStorage.getItem("authToken");
  //       if (token) {
  //         const decodedToken = jwt_decode<DecodedToken>(token);
  //         const userId = decodedToken.userId;
  //         setUserId(userId);

  //         get(`http://localhost:8100/user/${userId}`)
  //           .then((response) => {
  //             setUsers(response.data);
  //           })
  //           .catch((error) => {
  //             console.log("error", error);
  //           });
  //       }
  //       fetchUsers();
  //     };
  //   }, []);
  // } else {
  //   return null;
  // }

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
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      avatar_path: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
      username: "testuser",
      rating: 3.6,
      title: "testtitle",
      content: "testcontent",
      trip_country: "Japan",
      trip_location: ["Disneyland Tokyo"],
      trip_period: "TODO",
      trip_headcount: 3,
      trip_budget: "HKD10000",
      preferred_gender: null,
      preferred_age: ["20-30"],
      preferred_language: ["Chinese", "English"],
      preferred_skill: ["Driving"],
      preferred_hobby: [],
      status: "complete",
      created_at: "TODO",
      like: [],
      reply: [
        {
          id: 1,
          avatar_path: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          username: "testuser2",
          content: "testcomment",
          application: true,
          created_at: "TODO1",
        },
        {
          id: 2,
          avatar_path: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          username: "testuser3",
          content: "testcomment1",
          application: true,
          created_at: "TODO1",
        },
        {
          id: 3,
          avatar_path: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          username: "testuser4",
          content: "testcomment2",
          application: false,
          created_at: "TODO1",
        },
        {
          id: 4,
          avatar_path: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          username: "testuser4",
          content: "testcomment3",
          application: true,
          created_at: "TODO1",
        },
      ],
      view: 0,
    },
    {
      id: 2,
      avatar_path: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
      username: "testuser1",
      rating: 4.2,
      title: "testtitle1",
      content: "testcontent1",
      trip_country: "Thailand",
      trip_location: [],
      trip_period: "TODO1",
      trip_headcount: 2,
      trip_budget: "HKD20000",
      preferred_gender: null,
      preferred_age: ["30-40"],
      preferred_language: ["Chinese", "English"],
      preferred_skill: ["Driving", "Diving"],
      preferred_hobby: ["Hiking"],
      status: "open",
      created_at: "TODO",
      like: [],
      reply: [],
      view: 0,
    },
  ]);
  useEffect(() => {
    setFilteredPosts(posts);
    // fetch("http://localhost:8100/posts")
    //   .then((res) => res.json())
    //   .then((resJson) => {
    //     setFilteredPosts(resJson);
    //     setPosts(resJson);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  }, []);
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
                location.toUpperCase().includes(textData),
              ))
          );
        })
      : posts;
    setFilteredPosts(newData);
    setSearch(text);
  };
  const ItemView = ({ item }: ListRenderItemInfo<Post>) => {
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
                uri: item.avatar_path,
              }}
            />
            <Text
              style={{
                marginRight: 10,
              }}
            >
              {item.username}
            </Text>
            {setStarRating(item.rating)}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Text style={{ fontWeight: "600" }}>{item.trip_country}</Text>
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
            <Text style={{ fontWeight: "600" }}>{item.created_at}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginLeft: 10,
            paddingBottom: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Text style={{ fontWeight: "800" }}>#{item.id} </Text>
            <Text style={{ fontWeight: "600" }}>Title: </Text>
            <Text>{item.title} • </Text>
            <Text style={{ fontWeight: "600" }}>Period: </Text>
            <Text>{item.trip_period}</Text>
          </View>
          <View style={{ marginRight: 10 }}>
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
      <Button title="Add" onPress={() => navigation.navigate("AddPost")} />
    </>
  );
}
