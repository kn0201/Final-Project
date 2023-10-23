import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AddPostScreen from "../screen/AddPostScreen";
import BuddiesPage from "../tabs/ExplorePageTopTab";
import CommentScreen from "../screen/CommentScreen";
import TourDetailScreen from "../screen/TourDetailScreen";
import BlogDetailScreen from "../screen/BlogDetailScreen";
import OtherProfileScreen from "../screen/OtherProfileScreen";
import ManageTourScreen from "../screen/ManageTourScreen";

const Stack = createStackNavigator();

export default function ExplorePage() {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="Explore"
          component={BuddiesPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="New Post"
          component={AddPostScreen}
          options={{
            presentation: "modal",
            cardStyle: {
              backgroundColor: "white",
            },
          }}
        />
        <Stack.Screen
          name="Blog Detail"
          component={BlogDetailScreen}
          options={{
            title: "testing",
          }}
        />
        <Stack.Screen name="Comment" component={CommentScreen} />
        <Stack.Screen
          name="Tour Detail"
          component={TourDetailScreen}
          options={{
            presentation: "modal",
            cardStyle: {
              backgroundColor: "white",
            },
          }}
        />
        <Stack.Screen
          name="Other Profile"
          component={OtherProfileScreen}
          options={{
            presentation: "modal",
            cardStyle: {
              backgroundColor: "white",
            },
          }}
        />
        <Stack.Screen
          name="Manage Tour"
          component={ManageTourScreen}
          options={{
            presentation: "modal",
            cardStyle: {
              backgroundColor: "white",
            },
          }}
        />
      </Stack.Navigator>
    </>
  );
}
