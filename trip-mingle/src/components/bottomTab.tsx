import { StyleSheet, Text, View } from "react-native";
import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import HomeScreen from "../pages/Homepage";
import BuddiesPage from "../pages/buddies";
import PlanningPage from "../pages/planning";
import UserPage from "../pages/users";
import MapPage from "../pages/MapPage";

const Tab = createBottomTabNavigator();

function MyTab() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Find Buddies"
        component={BuddiesPage}
        options={{
          tabBarLabel: "Find Buddies",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Planning"
        component={PlanningPage}
        options={{
          tabBarLabel: "Planning",
          tabBarIcon: ({ color, size }) => (
            <Fontisto name="suitcase" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Users"
        component={UserPage}
        options={{
          tabBarLabel: "Users",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapPage}
        options={{
          tabBarLabel: "Map",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    display: "flex",
    flexDirection: "row",
    fontSize: 48,
  },
});

export default MyTab;
