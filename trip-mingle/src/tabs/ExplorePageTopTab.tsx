import * as React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Header } from "@rneui/base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import BlogScreen from "../screen/BlogScreen";
import TourScreen from "../screen/PostScreen";
import EnquireScreen from "../screen/EnquireScreen";

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <>
      <Header
        backgroundColor="#fff"
        centerComponent={{
          text: "EXPLORE",
          style: { color: "#000000" },
        }}
        containerStyle={{ width: "100%" }}
        placement="center"
      />
      <Tab.Navigator
        initialRouteName="Blog"
        screenOptions={{
          tabBarActiveTintColor: "#0a1128",
          tabBarLabelStyle: { fontSize: 10 },
          tabBarStyle: { backgroundColor: "#c4ffdb" },
        }}
      >
        <Tab.Screen
          name="Blog"
          component={BlogScreen}
          options={{
            tabBarLabel: "Blog",
            // tabBarIcon: ({ color }) => (
            //   <MaterialCommunityIcons name="post" color={color} size={26} />
            // ),
          }}
        />
        <Tab.Screen
          name="Tour"
          component={TourScreen}
          options={{
            tabBarLabel: "Tour",
            // tabBarIcon: ({ color }) => (
            //   <MaterialCommunityIcons
            //     name="transit-detour"
            //     color={color}
            //     size={26}
            //   />
            // ),
          }}
        />
        <Tab.Screen
          name="Enquire"
          component={EnquireScreen}
          options={{
            tabBarLabel: "Enquire",
            // tabBarIcon: ({ color }) => (
            //   <MaterialCommunityIcons
            //     name="chat-question"
            //     color={color}
            //     size={26}
            //   />
            // ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

export default function BuddiesPage() {
  return <MyTabs />;
}
