//Buffer Line
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SavedLocationScreen from "../screen/SavedLocationScreen";
import MemoryScreen from "../screen/MemoryScreen";
import ProfileScreen from "../screen/ProfileScreen";

import BookmarkScreen from "../screen/BookmarkScreen";

const Tab = createMaterialTopTabNavigator();

export default function UserPageTopTab() {
  return (
    <Tab.Navigator
      initialRouteName="Profile"
      screenOptions={{
        tabBarActiveTintColor: "#000000",
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { backgroundColor: "white" },
      }}
    >
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profile" }}
      />
      <Tab.Screen
        name="Saved Location"
        component={SavedLocationScreen}
        // component={SavedLocationScreen}
        options={{ tabBarLabel: "Saved Location" }}
      />
      <Tab.Screen
        name="Memory"
        component={MemoryScreen}
        options={{ tabBarLabel: "Memory" }}
      />
      <Tab.Screen
        name="Bookmark"
        component={BookmarkScreen}
        options={{ tabBarLabel: "Liked" }}
      />
    </Tab.Navigator>
  );
}
