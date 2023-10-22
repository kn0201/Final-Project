import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screen/LoginScreen";
import Register from "../screen/RegisterScreen";
import MapScreen from "../screen/MapScreen";
import PlaceDetail from "../screen/PlaceDetail";
import { useAppNavigation, useAppRoute } from "../../navigators";

const Stack = createStackNavigator();

export default function MapPage() {
  return (
    <Stack.Navigator
      initialRouteName="MapScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen
        name="PlaceDetail"
        component={PlaceDetail}
        options={{
          presentation: "modal",
          cardStyle: {
            backgroundColor: "transparent",
            flex: 1,
          },
        }}
      />
    </Stack.Navigator>
  );
}
