import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import TourScreen from "../screen/PostScreen";
import AddPostScreen from "../screen/AddPostScreen";
import BuddiesPage from "../tabs/ExplorePageTopTab";
import BlogDetailScreen from "../screen/BlogDetailScreen";
import CommentScreen from "../screen/CommentScreen";

const Stack = createStackNavigator();

export default function ExplorePage() {
  return (
    <>
      <Stack.Navigator
      // screenOptions={{
      //   presentation: "modal",
      //   cardStyle: {
      //     backgroundColor: "white",
      //   },
      // }}
      >
        <Stack.Screen
          name="Explore"
          component={BuddiesPage}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen name="Posts" component={TourScreen} /> */}
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
        <Stack.Screen name="Blog Detail" component={BlogDetailScreen} />
        <Stack.Screen name="Comment" component={CommentScreen} />
      </Stack.Navigator>
    </>
  );
}
