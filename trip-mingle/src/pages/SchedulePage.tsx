import { createStackNavigator } from "@react-navigation/stack";
import PlanningPage from "../screen/Planning";
import AddSchedule from "../screen/AddSchedule";
import MySchedule from "../screen/MySchedule";
import NewPlanning from "../screen/NewPlanning";

const Stack = createStackNavigator();

const SchedulePage = () => {
  return (
    <Stack.Navigator
      initialRouteName="SchedulePage"
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen name="MySchedule" component={MySchedule} />
      <Stack.Screen name="Planning" component={PlanningPage} />
      <Stack.Screen name="Add Schedule" component={AddSchedule} />
      <Stack.Screen name="NewPlanning" component={NewPlanning} />
      {/* <Stack.Screen
        name="Cancel"
        component={Schedule}
        options={{ headerShown: false }}
      /> */}
    </Stack.Navigator>
  );
};

export default SchedulePage;
