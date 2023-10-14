import { createStackNavigator } from "@react-navigation/stack";
import PlanningPage from "./Planning";
import { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ListRenderItemInfo,
  Dimensions,
  Animated,
  SafeAreaView,
} from "react-native";
import { Avatar, Card, CheckBox, Image, SearchBar } from "@rneui/themed";
import TourScreen from "./PostScreen";
import SchedulePage from "../pages/SchedulePage";
import AddSchedule from "./AddSchedule";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  RegisInfo,
  ScheduleCardInfo,
  ScheduleCardInputInfo,
} from "../utils/types";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import { countriesList } from "../source/countries";
import RegisterScreenStyleSheet from "../StyleSheet/RegisterScreenCss";
import { flex, white } from "../StyleSheet/StyleSheetHelper";
import LoginPageStyleSheet from "../StyleSheet/LoginScreenCss";
import AddScheduleForm from "../components/AddScheduleForm";

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fonts: {
    marginBottom: 8,
  },
  user: {
    flexDirection: "row",
    marginBottom: 6,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    marginTop: 5,
  },
});

//@ts-ignore
const Schedule = ({ navigation }) => {
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();

  const [cardList, setCardList] = useState<ScheduleCardInfo[]>([]);

  const translateAnim = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get("screen");

  const renderItem = (cardInfo: ListRenderItemInfo<ScheduleCardInfo>) => {
    return <ScheduleCard cardInfo={cardInfo.item} />;
  };

  const openModal = () => {
    console.log("opened modal");
    Animated.timing(translateAnim, {
      duration: 500,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(translateAnim, {
      duration: 500,
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const addNewScheduleCard = (newScheduleInfo: ScheduleCardInputInfo) => {
    setCardList((currentList) => {
      const newID = (currentList.pop()?.id || -1) + 1;
      return [...currentList, { ...newScheduleInfo, id: newID }];
    });
  };

  function ScheduleCard(props: { cardInfo: ScheduleCardInfo }) {
    const { title, uri } = props.cardInfo;
    return (
      <TouchableOpacity onPress={() => navigation.navigate("AddSchedule")}>
        <Card>
          <Card.Title>{title}</Card.Title>
          <Card.Divider />
          <Card.Image
            style={{ padding: 0, height: 200 }}
            source={{
              uri,
            }}
          />
        </Card>
      </TouchableOpacity>
    );
  }

  useEffect(() => {
    setCardList([
      {
        id: 0,
        title: "Sample",
        uri: "https://res.klook.com/image/upload/q_85/c_fill,w_1360/v1674030135/blog/bnbtltnp5nqbdevfcbmn.webp",
      },
      {
        id: 1,
        title: "Sample",
        uri: "https://res.klook.com/image/upload/fl_lossy.progressive,q_85/c_fill,w_1000/v1674014276/blog/wsqagneebxdvvquuk9db.webp",
      },
    ]);
  }, []);

  return (
    <SafeAreaView>
      <View
        style={{ height: Dimensions.get("screen").height - 180, zIndex: 0.9 }}
      >
        <FlatList data={cardList} renderItem={renderItem} />
        <MaterialIcons
          name="add-circle"
          size={60}
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            backgroundColor: "white",
            borderRadius: 32,
            zIndex: 0.95,
          }}
          onPress={openModal}
        />
      </View>
      <Animated.View
        style={[
          {
            width,
            height: height * 0.9,
            position: "absolute",
            top: height,
            zIndex: 1,
            backgroundColor: "white",
          },
          {
            transform: [
              {
                translateY: translateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -height],
                }),
              },
            ],
          },
        ]}
      >
        <AddScheduleForm
          closeModal={closeModal}
          addNewScheduleCard={addNewScheduleCard}
        />
      </Animated.View>
    </SafeAreaView>
  );
};
export default Schedule;
