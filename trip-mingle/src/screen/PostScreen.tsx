import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
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
import BuddiesPageStyleSheet from "../StyleSheet/BuddiesPageCss";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import Fontisto from "react-native-vector-icons/Fontisto";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

type Post = {
  id: number;
  avatar_path: string;
  username: string;
  title: string;
  content: string;
  trip_country: string[] | null;
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
  view: number;
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

export default function TourScreen() {
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

  // Select post
  const [selectedPostID, setSelectedPostIDs] = useState(0);

  const handlePostClick = (id: number) => {
    if (selectedPostID === 0) {
      setSelectedPostIDs(id);
    } else {
      setSelectedPostIDs(0);
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
      title: "testtitle",
      content: "testcontent",
      trip_country: ["Japan"],
      trip_location: ["Disneyland Tokyo"],
      trip_period: "TODO",
      trip_headcount: 3,
      trip_budget: "HKD10000",
      preferred_gender: null,
      preferred_age: ["20-30"],
      preferred_language: ["Chinese", "English"],
      preferred_skill: ["Driving"],
      preferred_hobby: null,
      status: "complete",
      created_at: "TODO",
      view: 0,
    },
    {
      id: 2,
      avatar_path: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
      username: "testuser1",
      title: "testtitle1",
      content: "testcontent1",
      trip_country: ["Thailand"],
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
              item.trip_country.some((country) =>
                country.toUpperCase().includes(textData),
              )) ||
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
              gap: 10,
            }}
          >
            <Image
              style={{
                width: 30,
                height: 30,
                borderRadius: 20,
                resizeMode: "contain",
              }}
              source={{
                uri: item.avatar_path,
              }}
            />
            <Text>{item.username}</Text>
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
            marginLeft: 10,
            paddingBottom: 20,
          }}
        >
          <Text style={{ fontWeight: "800" }}>#{item.id} </Text>
          <Text style={{ fontWeight: "600" }}>Title: </Text>
          <Text>{item.title} • </Text>
          <Text style={{ fontWeight: "600" }}>Period: </Text>
          <Text>{item.trip_period}</Text>
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
    </>
  );
}
