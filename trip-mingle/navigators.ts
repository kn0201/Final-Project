import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

// BottomTabNavigator
// - HomePage
// - SchedulePage (Stack)
//   - MySchedule (default)
//   - AddSchedule

export interface AppParamList {
  AddSchedule: {
    planId: number;
  };
  DemoPage: undefined;
}

export function useAppNavigation() {
  return useNavigation<NavigationProp<AppParamList>>();
}

export function useAppRoute<
  RouteName extends keyof AppParamList
>(): AppParamList[RouteName] {
  return useRoute<RouteProp<AppParamList, RouteName>>().params;
}
