import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screen/login";
import Register from "../screen/register";

const Stack = createStackNavigator();

export default function UserPage() {
  return (
    <Stack.Navigator
      initialRouteName="LoginPage"
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}
