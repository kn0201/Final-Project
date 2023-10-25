import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SnapScreen from "../screen/SnapScreen";
import NewSnapScreen from "../screen/NewSnapScreen";
import CommentScreen from "../screen/CommentScreen";
import OtherProfileScreen from "../screen/OtherProfileScreen";

const Stack = createStackNavigator();

export default function SnapPage() {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="Snap"
          component={SnapScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewSnap"
          component={NewSnapScreen}
          options={{
            presentation: "modal",
            cardStyle: {
              backgroundColor: "white",
            },
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
          name="Other Profile"
          component={OtherProfileScreen}
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
