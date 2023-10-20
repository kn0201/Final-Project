import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import TourScreen from "../screen/PostScreen";
import AddPostScreen from "../screen/AddPostScreen";
import BuddiesPage from "../tabs/ExplorePageTopTab";

import CommentScreen from "../screen/CommentScreen";
import TourDetailScreen from "../screen/TourDetailScreen";
import BlogDetailScreen from "../screen/BlogDetailScreen";

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
        <Stack.Screen name="Tour Detail" component={TourDetailScreen} />
      </Stack.Navigator>
    </>
  );
}
