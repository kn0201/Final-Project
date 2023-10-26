//Buffer Line
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SavedLocationScreen from "../screen/SavedLocationScreen";

import ProfileScreen from "../screen/ProfileScreen";

import BookmarkScreen from "../screen/BookmarkScreen";
import MyPostScreen from "../screen/MyPostScreen";

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
        name="OwnPost"
        component={MyPostScreen}
        options={{ tabBarLabel: "MY Post" }}
      />
      <Tab.Screen
        name="Bookmark"
        component={BookmarkScreen}
        options={{ tabBarLabel: "Bookmark" }}
      />
    </Tab.Navigator>
  );
}
