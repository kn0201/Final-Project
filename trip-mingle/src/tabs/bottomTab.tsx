import { StyleSheet, Text, View } from "react-native";
import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import HomeScreen from "../pages/Homepage";
import BuddiesPage from "../pages/FindBuddiesPage";
import MapPage from "../pages/MapPage";
import PlanningPage from "../pages/PlanningPage";
import UserPage from "../pages/UserPage";
import LoginPage from "../pages/LoginPage";

const Tab = createBottomTabNavigator();

function MyTab() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
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
        name="Login"
        component={LoginPage}
        options={{
          tabBarLabel: "Login",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="login" color={color} size={size} />
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
