import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import TourScreen from "../screen/PostScreen";
import AddPost from "../screen/AddPost";
import BuddiesPage from "../tabs/ExplorePageTopTab";

const Stack = createStackNavigator();

export default function ExplorePage() {
  return (
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
      <Stack.Screen name="Add Post" component={AddPost} />
    </Stack.Navigator>
  );
}
