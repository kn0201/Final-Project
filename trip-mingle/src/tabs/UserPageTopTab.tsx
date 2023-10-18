//Buffer Line
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SavedLocationScreen from "../screen/SavedLocationScreen";
import MemoryScreen from "../screen/MemoryScreen";
import ProfileScreen from "../screen/ProfileScreen";
import LikedScreen from "../screen/LikedScreen";
import BlogDetailScreen from "../screen/blogDetailScreen";

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
        component={BlogDetailScreen}
        // component={SavedLocationScreen}
        options={{ tabBarLabel: "Saved Location" }}
      />
      <Tab.Screen
        name="Memory"
        component={MemoryScreen}
        options={{ tabBarLabel: "Memory" }}
      />
      <Tab.Screen
        name="Liked"
        component={LikedScreen}
        options={{ tabBarLabel: "Liked" }}
      />
    </Tab.Navigator>
  );
}
