import { createStackNavigator } from "@react-navigation/stack";
import PlanningPage from "./Planning";
import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Avatar, Card, Image } from "@rneui/themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import TourScreen from "./PostScreen";
import SchedulePage from "../pages/SchedulePage";
import AddSchedule from "./AddSchedule";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

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
          <Card.Title>Sample</Card.Title>
          <Card.Divider />
          <Card.Image
            style={{ padding: 0 }}
            source={{
              uri: "https://res.klook.com/image/upload/q_85/c_fill,w_1360/v1674030135/blog/bnbtltnp5nqbdevfcbmn.webp",
            }}
          />
        </Card>
      </TouchableOpacity>
      <MaterialIcons
        name="add-circle"
        size={60}
        style={{ position: "absolute", bottom: 10, right: 10 }}
        onPress={() => navigation.navigate("NewPlanning")}
      />
    </>
  );
};
export default Schedule;
