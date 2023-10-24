import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AddPostScreen from "../screen/AddPostScreen";
import BuddiesPage from "../tabs/ExplorePageTopTab";
import CommentScreen from "../screen/CommentScreen";
import TourDetailScreen from "../screen/TourDetailScreen";

import OtherProfileScreen from "../screen/OtherProfileScreen";
import ManageTourScreen from "../screen/ManageTourScreen";
import BlogDetailScreen from "../screen/BlogDetailScreen";
// import ViewTourScreen from "../screen/ViewTourScreen";

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
        <Stack.Screen
          name="Comment"
          component={CommentScreen}
          options={{
            presentation: "modal",
            cardStyle: {
              backgroundColor: "white",
            },
          }}
        />
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
        {/* <Stack.Screen
          name="Tour Member"
          component={ViewTourScreen}
          options={{
            presentation: "modal",
            cardStyle: {
              backgroundColor: "white",
            },
          }}
        /> */}
      </Stack.Navigator>
    </>
  );
}
