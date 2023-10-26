//Buffer Line

import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { row, center, flex } from "../StyleSheet/StyleSheetHelper";
import { api } from "../apis/api";
import { useToken } from "../hooks/useToken";
import { array, float, object, optional, string } from "cast.ts";
import { useEffect, useState } from "react";
import { apiOrigin } from "../utils/apiOrigin";
import SavedLocationScreenStyleSheet from "../StyleSheet/SavedLocationScreenCss";
import { useAppNavigation } from "../../navigators";
import useEvent from "react-use-event";
import { MapPositionEvent, SaveLocationEvent } from "../utils/events";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../theme/variables";

const { width, height } = Dimensions.get("window");
const aspect_ratio = width / height;
const latitudeDelta = 0.05;
const longitudeDelta = latitudeDelta * aspect_ratio;
const GOOGLE_API_KEY = "AIzaSyDkl6HfJvmSSKDGWH0L0Y183PbBuY9fjdo";

type Location = {
  name: string;
  place_id: string;
  latitude: number;
  longitude: number;
};

//@ts-ignore
export default function SavedLocationScreen() {
  const { token, payload, setToken } = useToken();
  const navigation = useAppNavigation();
  const dispatchMapEvent = useEvent<MapPositionEvent>("MapPosition");
  const [locationList, setLocationList] = useState<Location[]>([]);

  useEvent<SaveLocationEvent>("SaveLocation", () => {
    getSavedLocation();
  });
  const getSavedLocation = async () => {
    let result = await api.get(
      "/location/bookmark",
      array(
        object({
          name: string(),
          place_id: string(),
          latitude: float(),
          longitude: float(),
        })
      ),
      token
    );
    setLocationList(result);
  };

  const handleMapClick = (latitude: number, longitude: number) => {
    const center = { latitude, longitude };
    const params = { center };
    console.log("HomePage, go to map:", params);
    dispatchMapEvent(params);
    navigation.navigate("MapPage", {
      screen: "MapScreen",
      params: {
        center,
      },
    });
  };

  type ItemProps = {
    name: string;
    place_id: string;
    latitude: number;
    longitude: number;
  };

  const Item = ({ name, place_id, latitude, longitude }: ItemProps) => (
    <View style={SavedLocationScreenStyleSheet.outerContainer}>
      <Text style={SavedLocationScreenStyleSheet.nameText}>{name}</Text>
      <TouchableOpacity
        style={SavedLocationScreenStyleSheet.detailContainer}
        onPress={() => {
          handleMapClick(latitude, longitude);
        }}
      >
        <Text>More Details</Text>
        <MaterialCommunityIcons name="chevron-right" size={20} />
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    getSavedLocation();
  }, []);

  return (
    <View style={SavedLocationScreenStyleSheet.center}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#FFFFFF", theme.background]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "100%",
        }}
      />
      <FlatList
        data={locationList}
        renderItem={({ item }) => (
          <Item
            name={item.name}
            place_id={item.place_id}
            latitude={item.latitude}
            longitude={item.longitude}
          />
        )}
        keyExtractor={(item) => item.place_id}
      />
    </View>
  );
}
