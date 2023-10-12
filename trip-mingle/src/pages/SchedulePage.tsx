import { createStackNavigator } from "@react-navigation/stack";
import PlanningPage from "../screen/Planning";
import Schedule from "../screen/Schedule";
import AddSchedule from "../screen/AddSchedule";

const Stack = createStackNavigator();

const SchedulePage = () => {
  return (
    <Stack.Navigator
      initialRouteName="SchedulePage"
      screenOptions={{ headerShown: true }}
    >
      <Stack.Screen name="Schedule" component={Schedule} />
      <Stack.Screen name="Planning" component={PlanningPage} />
      <Stack.Screen name="Add Schedule" component={AddSchedule}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default SchedulePage;
