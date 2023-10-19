import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screen/LoginScreen";
import Register from "../screen/RegisterScreen";

const Stack = createStackNavigator();

export default function LoginPage() {
  return (
    <Stack.Navigator
      // initialRouteName="Login"
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}
