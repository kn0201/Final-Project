import { createStackNavigator } from "@react-navigation/stack";
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
  Text,
  RefreshControl,
} from "react-native";
import { Card, Header } from "@rneui/themed";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  RegisInfo,
  ScheduleCardInfo,
  ScheduleCardInputInfo,
} from "../utils/types";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import { Entypo } from "@expo/vector-icons";
import AddScheduleForm from "../components/AddScheduleForm";
import { useNavigation } from "@react-navigation/native";
import { useAppNavigation } from "../../navigators";
import { useGet } from "../hooks/useGet";
import { ParseResult, array, number, object, optional, string } from "cast.ts";
import { apiOrigin } from "../utils/apiOrigin";
import { api, api2 } from "../apis/api";
import UserPageStyleSheet from "../StyleSheet/UserPageCss";
import useBoolean from "../hooks/useBoolean";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { flex, row } from "../StyleSheet/StyleSheetHelper";
import React from "react";
import SampleSchedule from "./SampleSchedule";
import { HomePageStyleSheet } from "../StyleSheet/HomePageCss";
import { navigate } from "../tabs/RootNavigation";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../theme/variables";

const Stack = createStackNavigator();

const styles = StyleSheet.create({
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

let getMyPlanListParser = object({
  planList: array(
    object({
      plan_id: number(),
      plan_title: string(),
      image_path: string(),
      // startDate: optional(string()),
      // endDate: optional(string()),
    })
  ),
});
type PlanListItem = ParseResult<typeof getMyPlanListParser>["planList"][number];

//@ts-ignore
const Schedule = () => {
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

  const myPlanListResult = useGet("/planning/my-plans", getMyPlanListParser);

  const addNewScheduleCard = (newScheduleInfo: PlanListItem) => {
    myPlanListResult.setState((state) => ({
      planList: [...state!.planList, newScheduleInfo],
    }));
  };

  return (
    <SafeAreaView>
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
                      <Card.Title>Sample Plan</Card.Title>
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

function ScheduleCard(props: { item: PlanListItem }) {
  const { item } = props;
  const navigation = useAppNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("AddSchedule", { planId: item.plan_id })
      }
    >
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
          {/* <View
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
          </View> */}
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

export default Schedule;
