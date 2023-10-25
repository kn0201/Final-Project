import { createStackNavigator } from "@react-navigation/stack";
import AddSchedule from "../screen/AddSchedule";
import MySchedule from "../screen/MySchedule";
import AddNewPlan from "../components/AddNewPlanSchedule";
import AgendaListItem from "../components/AgendaLIstItem";
import SampleSchedule from "../screen/SampleSchedule";
// import SamplePlan from "../screen/SamplePlan";

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
        <Stack.Screen name="AddSchedule" component={AddSchedule} />
        <Stack.Screen name="AddNewPlan" component={AddNewPlan} />
        <Stack.Screen name="Add Agenda" component={AgendaListItem} />
        <Stack.Screen name="SampleSchedule" component={SampleSchedule} />
      </Stack.Navigator>
    </>
  );
};

// my schedule (get schedule list)
// add schedule (post schedule)

export default SchedulePage;
