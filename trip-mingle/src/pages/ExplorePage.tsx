import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import TourScreen from "../screen/PostScreen";
import AddPostScreen from "../screen/AddPostScreen";
import BuddiesPage from "../tabs/ExplorePageTopTab";

const Stack = createStackNavigator();

export default function ExplorePage() {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          presentation: "modal",
          cardStyle: {
            backgroundColor: "white",
          },
        }}
      >
        <Stack.Screen
          name="Cancel"
          component={BuddiesPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Posts" component={TourScreen} />
        <Stack.Screen name="New Post" component={AddPostScreen} />
      </Stack.Navigator>
    </>
  );
}
