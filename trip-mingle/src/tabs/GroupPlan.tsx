import { TouchableOpacity } from "react-native-gesture-handler";
import { useGet } from "../hooks/useGet";
import { PlanListItem, getMyPlanListParser } from "../utils/parser";
import { Card } from "@rneui/base";
import {
  View,
  Text,
  FlatList,
  Animated,
  SafeAreaView,
  Dimensions,
  ListRenderItemInfo,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import { useAppNavigation } from "../../navigators";
import { flex, row } from "../StyleSheet/StyleSheetHelper";
import { api2 } from "../apis/api";
import Ionicons from "react-native-vector-icons/Ionicons";
import AddScheduleForm from "../components/AddScheduleForm";
import { HomePageStyleSheet } from "../StyleSheet/HomePageCss";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import { useRef } from "react";
import { ScheduleCard } from "../screen/ScheduleCard";

const myPlanListResult = useGet("/planning/my-plans", getMyPlanListParser);

const addNewScheduleCard = (newScheduleInfo: PlanListItem) => {
  myPlanListResult.setState((state) => ({
    planList: [...state!.planList, newScheduleInfo],
  }));
};

const GroupSchedule = () => {
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const translateAnim = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get("screen");
  const navigation = useAppNavigation();
  const renderItem = (info: ListRenderItemInfo<PlanListItem>) => {
    return <ScheduleCard item={info.item} />;
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

  const myPlanListResult = useGet("/planning/tour-plan", getMyPlanListParser);

  const addNewScheduleCard = (newScheduleInfo: PlanListItem) => {
    myPlanListResult.setState((state) => ({
      planList: [...state!.planList, newScheduleInfo],
    }));
  };

  return (
    <SafeAreaView>
      <View
        style={{ height: Dimensions.get("screen").height - 180, zIndex: 0.9 }}
      >
        {myPlanListResult.render((json) => {
          return (
            <>
              {json.planList.length === 0 ? (
                <View>
                  <Text style={HomePageStyleSheet.planText}>My Plan</Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("SampleSchedule")}
                  >
                    <Card>
                      <Card.Title>Kyoto</Card.Title>
                      <Card.Divider />
                      <Card.Image
                        style={{ padding: 0, height: 200 }}
                        source={{
                          uri: "https://www.budgetdirect.com.au/blog/wp-content/uploads/2018/03/Japan-Travel-Guide.jpg",
                        }}
                      />
                    </Card>
                  </TouchableOpacity>
                </View>
              ) : (
                <FlatList data={json.planList} renderItem={renderItem} />
              )}
            </>
          );
        })}
        <Ionicons
          name="add-circle"
          size={60}
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            // backgroundColor: "white",
            // color: "white",
            borderRadius: 32,
            zIndex: 0.95,
          }}
          onPress={() => {
            openModal();
          }}
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

function GroupPlanSchedule(props: { item: PlanListItem }) {
  const { item } = props;
  const navigation = useAppNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("AddSchedule", { planId: item.plan_id })
      }
    >
      <Card>
        <Card.Title>
          <Text>{item.plan_title}</Text>
        </Card.Title>
        <View
          style={{
            display: flex,
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              display: flex,
              flexDirection: row,
              width: "30%",
              minWidth: 100,
              justifyContent: "space-between",
            }}
          >
            {item.startDate ? (
              <>
                <Text>{item.startDate.split("T")[0]}</Text>
                <Entypo name="aircraft-take-off" size={24} color="black" />
              </>
            ) : null}
          </View>

          <View
            style={{
              display: flex,
              flexDirection: row,
              width: "30%",
              minWidth: 100,
              justifyContent: "space-between",
            }}
          >
            {item.endDate ? (
              <>
                <Entypo name="aircraft-landing" size={24} color="black" />
                <Text>{item.endDate.split("T")[0]}</Text>
              </>
            ) : null}
          </View>
        </View>
        <Card.Divider />
        <Card.Image
          style={{ padding: 0, height: 200 }}
          source={{
            uri: api2.toImageURI(item.image_path),
          }}
        />
      </Card>
    </TouchableOpacity>
  );
}

export default GroupSchedule;
