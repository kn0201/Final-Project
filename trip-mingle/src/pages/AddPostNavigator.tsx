import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import TourScreen from "../screen/PostScreen";
import AddPost from "../screen/AddPost";

const Stack = createStackNavigator();

export default function AddPostNavigator() {
  return (
    <Stack.Navigator
      //   mode="modal"
      screenOptions={{
        cardStyle: {
          backgroundColor: "white",
        },
      }}
    >
      <Stack.Screen name="Posts" component={TourScreen} />
      <Stack.Screen name="AddPost" component={AddPost} />
    </Stack.Navigator>
  );
}
