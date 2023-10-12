import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import HomeScreen from "../pages/Homepage";
import BuddiesPage from "./ExplorePageTopTab";
import MapPage from "../pages/MapPage";
import PlanningPage from "../pages/SchedulePage";
import UserPage from "../pages/UserPage";
import LoginPage from "../pages/LoginPage";
import { useEffect } from "react";
import ExplorePage from "../pages/ExplorePage";
import SchedulePage from "../pages/SchedulePage";

const Tab = createBottomTabNavigator();

function MyTab() {
  useEffect;
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
        name="Explore"
        component={ExplorePage}
        options={{
          tabBarLabel: "Explore",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={SchedulePage}
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
        name="login"
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
