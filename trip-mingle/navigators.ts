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
//- MapPage (Stack)
//  - MapScreen (default)
//  - PlaceDetail
//- User Page
//  - Saved Location
export interface AppParamList {
  AddSchedule: {
    planId: number;
  };
  DemoPage: undefined;
  MapPage:
    | {
        screen: string;
        params:
          | {
              center?: {
                latitude: number;
                longitude: number;
              };
            }
          | undefined
          | { name: string; place_id: string };
      }
    | undefined;
  MapScreen:
    | {
        center?: {
          latitude: number;
          longitude: number;
        };
      }
    | undefined;
  PlaceDetail: {
    id: string;
    name: string;
  };
  ExplorePage: {
    screen: string;
    params: {
      id: number;
      title: string;
      status: string;
    };
  };
  NewSnap: undefined;
  Comment: undefined;
  SnapPage: undefined;
}

export function useAppNavigation() {
  return useNavigation<NavigationProp<AppParamList>>();
}

export function useAppRoute<
  RouteName extends keyof AppParamList
>(): AppParamList[RouteName] {
  return useRoute<RouteProp<AppParamList, RouteName>>().params;
}
