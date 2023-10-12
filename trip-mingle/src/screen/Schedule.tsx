import { createStackNavigator } from "@react-navigation/stack";
import PlanningPage from "../screen/Planning";
import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Avatar, Card, Image } from "@rneui/themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import TourScreen from "./PostScreen";
import SchedulePage from "../pages/SchedulePage";
import AddSchedule from "./AddSchedule";

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
  return (
    <>
      <TouchableOpacity onPress={() => navigation.navigate("Planning")}>
        <Card>
          <Card.Title>Japan Travel</Card.Title>
          <Card.Divider />
          <Card.Image
            style={{ padding: 0 }}
            source={{
              uri: "https://res.klook.com/image/upload/q_85/c_fill,w_1360/v1674030135/blog/bnbtltnp5nqbdevfcbmn.webp",
            }}
          />
        </Card>
      </TouchableOpacity>
      <Stack.Navigator
        screenOptions={{
          presentation: "modal",
          cardStyle: {
            backgroundColor: "aqua",
          },
        }}
      >
        <Stack.Screen
          name="Add Schedule"
          component={AddSchedule}
        ></Stack.Screen>
      </Stack.Navigator>
    </>
  );
};
export default Schedule;
