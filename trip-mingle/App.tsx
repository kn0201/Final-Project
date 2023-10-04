import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import HomeScreen from "./src/pages/Homepage";
import BuddiesPage from "./src/pages/buddies";
import PlanningPage from "./src/pages/planning";
import UserPage from "./src/pages/users";

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
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
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default App;
