import React, { useEffect, useRef, useState } from "react";
import MapView, {
  Callout,
  Details,
  LatLng,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from "react-native";
import * as Location from "expo-location";
import Constants from "expo-constants";
import { api } from "../apis/api";
import { useAppNavigation, useAppRoute } from "../../navigators";
import MarkerDetail from "../components/markerDetail";
import { array, float, object, optional, string } from "cast.ts";
import { useToken } from "../hooks/useToken";

const { width, height } = Dimensions.get("window");
const aspect_ratio = width / height;
const latitudeDelta = 0.05;
const longitudeDelta = latitudeDelta * aspect_ratio;

type InputAutocompleteProps = {
  placeholder?: string;
  // onPlaceSelected: (details: GooglePlaceDetail | null) => void;
};
type Place = {
  coordinate: LatLng;
  placeId: string;
  placeName: string;
  address: string;
  rating?: number;
};

type Location = {
  name: string;
  place_id: string;
  latitude: number;
  longitude: number;
};

const GOOGLE_API_KEY = "AIzaSyDkl6HfJvmSSKDGWH0L0Y183PbBuY9fjdo";
const placeType = "tourist_attraction";

const defaultCenter = {
  latitude: 22.2782639,
  longitude: 114.1672747,
};

export default function MapScreen({ route }: { route: any }) {
  const { token, payload, setToken } = useToken();
  const navigation = useAppNavigation();
  const params = useAppRoute<"MapScreen">();
  useEffect(() => {
    console.log("MapScreen, params:", params);
  }, [params?.center]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [center, setCenter] = useState(params?.center || defaultCenter);
  const [mapData, setMapData] = useState();
  const [locationList, setLocationList] = useState<Location[]>([]);
  type LatLng = typeof center;

  useEffect(() => {
    if (params?.center) {
      if (params.center != center) {
        setCenter(params.center);
        moveTo(params.center);
      }
      return;
    }

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setCenter(location.coords);
      moveTo(location.coords);
    })();
  }, [params?.center]);

  // Custom Marker
  const [markerCoordinate, setMarkerCoordinate] = useState(center);

  // Move to search place
  const mapRef = useRef<MapView>(null);
  const [bookmark, setBookmark] = useState<LatLng[]>([]);

  function InputAutocomplete({ placeholder }: InputAutocompleteProps) {
    return (
      <>
        <View style={{ height: "100%" }}>
          <GooglePlacesAutocomplete
            styles={{ textInput: styles.search, listView: styles.list }}
            placeholder={placeholder || ""}
            fetchDetails
            onPress={(data, details = null) => {
              if (details) {
                setCenter({
                  latitude: details?.geometry.location.lat,
                  longitude: details?.geometry.location.lng,
                });
                moveTo({
                  latitude: details?.geometry.location.lat,
                  longitude: details?.geometry.location.lng,
                });
              }
            }}
            query={{
              key: GOOGLE_API_KEY,
              language: ["en", "zh-CN", "zh-TW", "ja"],
            }}
            onFail={(error) => console.log(error)}
          />
        </View>
      </>
    );
  }
  const moveTo = async (position: LatLng) => {
    const map = mapRef.current;
    if (!map) return;
    animatedMoveTo(map, position);
  };

  //marker on Change
  const onRegionChange = (region: Region) => {
    setMarkerCoordinate(region);
  };
  const onRegionChangeComplete = async (region: Region, details: Details) => {
    setCenter(region);
    setMarkerCoordinate(region);
  };

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

  // Fetch places from google map
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    fetchPlacesFromGoogleMaps(center)
      .then(async (placesData) => {
        setPlaces(placesData);
        await api.post("/location/Marker", placesData, object({}));
      })
      .catch((error) => {
        console.error(
          "MapScreen, Error fetching places, center:",
          center,
          "error:",
          error
        );
      });
  }, [center]);

  if (errorMsg) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>error: {errorMsg}</Text>
      </SafeAreaView>
    );
  }

  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.search}>
          <InputAutocomplete
            placeholder="Search"
            // onPlaceSelected={(details) => {}}
          />
        </View>
        <MapView
          onRegionChangeComplete={onRegionChangeComplete}
          onRegionChange={onRegionChange}
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: center.latitude,
            longitude: center.longitude,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
          }}
        >
          {bookmark?.map((position, index) => (
            <Marker key={index} coordinate={position} />
          ))}
          {places.map((place) => (
            <Marker
              key={place.placeId}
              coordinate={place.coordinate}
              title={place.placeName}
            >
              <Callout
                onPress={() => {
                  navigation.navigate("PlaceDetail", {
                    id: place.placeId,
                    name: place.placeName,
                  });
                }}
              >
                <MarkerDetail place={place} />
              </Callout>
            </Marker>
          ))}
          <Marker coordinate={markerCoordinate}>
            <MyCustomMarkerView />
            <Callout>
              <MyCustomCalloutView />
            </Callout>
          </Marker>
        </MapView>
      </View>
    </TouchableWithoutFeedback>
  );
}

async function animatedMoveTo(map: MapView, center: LatLng) {
  let box = await map.getMapBoundaries();
  let originalCenter = {
    latitude: (box.northEast.latitude + box.southWest.latitude) / 2,
    longitude: (box.northEast.longitude + box.southWest.longitude) / 2,
  };

  let farZoom = 5;

  let camera = await map.getCamera();
  camera.zoom = farZoom;
  camera.center = originalCenter;
  map.animateCamera(camera, { duration: 800 });
  await sleep(800);

  camera = await map.getCamera();
  camera.zoom = farZoom;
  camera.center = center;
  map.animateCamera(camera, { duration: 1000 });
  await sleep(1000);

  camera = await map.getCamera();
  camera.zoom = 15;
  camera.center = center;
  map.animateCamera(camera, { duration: 800 });
  await sleep(800);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const fetchPlacesFromGoogleMaps = async (center: LatLng): Promise<Place[]> => {
  let radius = 20 * 1000;
  const url =
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
    new URLSearchParams({
      location: center.latitude + "," + center.longitude,
      radius: radius.toString(),
      type: placeType,
      key: GOOGLE_API_KEY,
    });
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Network failure: " + (await res.text()));
  }

  const data = await res.json();

  let GooglePlaceNearbySearchParser = object({
    results: array(
      object({
        name: string(),
        geometry: object({
          location: object({
            lat: float(),
            lng: float(),
          }),
        }),
        place_id: string(),
        vicinity: string(),
        rating: optional(float()),
      })
    ),
  });

  let output = GooglePlaceNearbySearchParser.parse(data, {
    name: "google_place_data",
  });

  return output.results.map(
    (place): Place => ({
      coordinate: {
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
      },
      placeId: place.place_id,
      placeName: place.name,
      address: place.vicinity,
      rating: place.rating,
    })
  );
  return [];
};

const MyCustomMarkerView = () => {
  return (
    <Image
      source={require("../assets/fav.png")}
      style={{ width: 30, height: 30 }}
    />
  );
};

const MyCustomCalloutView = () => {
  return (
    <View>
      <Text>You</Text>
    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  search: {
    zIndex: 1,
    width: "95%",
    position: "absolute",
    borderRadius: 8,
    margin: 8,
    top: Constants.statusBarHeight / 2,
  },
  list: {
    width: "95%",
    opacity: 0.8,
    borderRadius: 8,
    position: "relative",
    top: 60 + Constants.statusBarHeight / 2,
    left: 8,
  },
});
