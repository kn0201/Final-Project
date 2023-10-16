import { createStackNavigator } from "@react-navigation/stack";
import PlanningPage from "../screen/Planning";
import AddSchedule from "../screen/AddSchedule";
import MySchedule from "../screen/MySchedule";
import NewPlanning from "../screen/NewPlanning";
import AddNewPlan from "../components/AddNewPlanSchedule";

const Stack = createStackNavigator();

const SchedulePage = () => {
  return (
    <>
      <Stack.Screen
        name="Cancel"
        component={MySchedule}
        options={{ headerShown: false }}
      />
      <Stack.Navigator
        initialRouteName="MySchedule"
        screenOptions={{
          presentation: "modal",
          cardStyle: {
            backgroundColor: "white",
          },
        }}
      >
        <Stack.Screen name="MySchedule" component={MySchedule} />
        <Stack.Screen name="Planning" component={PlanningPage} />
        <Stack.Screen name="AddSchedule" component={AddSchedule} />
        <Stack.Screen name="NewPlanning" component={NewPlanning} />
        <Stack.Screen name="AddNewPlan" component={AddNewPlan} />
      </Stack.Navigator>
    </>
  );
};

export default SchedulePage;
