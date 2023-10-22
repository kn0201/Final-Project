import React, { useEffect, useRef, useState } from "react";
import MapView, {
  Callout,
  Details,
  LatLng,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import {
  GooglePlacesAutocomplete,
  GooglePlaceDetail,
  Geometry,
} from "react-native-google-places-autocomplete";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";

import { LocationObject } from "expo-location";
import Constants from "expo-constants";
import useEvent from "react-use-event";
import { MapEvent } from "../utils/events";

import { api } from "../apis/api";

import { markerParser } from "../utils/parser";
import { useAppNavigation, useAppRoute } from "../../navigators";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { center, row } from "../StyleSheet/StyleSheetHelper";
import MarkerDetail from "../components/markerDetail";
import { array, float, object, optional, string } from "cast.ts";

const { width, height } = Dimensions.get("window");
const aspect_ratio = width / height;
const latitudeDelta = 0.05;
const longitudeDelta = latitudeDelta * aspect_ratio;

type InputAutocompleteProps = {
  placeholder?: string;
  onPlaceSelected: (details: GooglePlaceDetail | null) => void;
};
type Place = {
  coordinate: LatLng;
  placeId: string;
  placeName: string;
  //   opening_hours: [Object];
  //   photos: string;
  address: string;
  rating?: number;
};

type DataBaseMarker = {
  address: string;
  latitude: number;
  longitude: number;
  place_id: string;
  name: string;
};

const GOOGLE_API_KEY = "AIzaSyDkl6HfJvmSSKDGWH0L0Y183PbBuY9fjdo";
const placeType = "tourist_attraction";

const defaultCenter = {
  latitude: 22.2773199,
  longitude: 114.173206,
};

export default function MapScreen({ route }: { route: any }) {
  const navigation = useAppNavigation();
  const params = useAppRoute<"MapScreen">();
  useEffect(() => {
    console.log("MapScreen, params:", params);
  }, [params?.center]);
  //   useEffect(() => {
  //     console.log(params);
  //   }, [params]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [center, setCenter] = useState(params?.center || defaultCenter);
  const [mapData, setMapData] = useState();
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
      moveTo(location.coords);
      // setLocation(location.coords);
    })();
  }, [params?.center]);

  // Custom Marker
  // const [state, setState] = useState({});
  const [markerCoordinate, setMarkerCoordinate] = useState(center);

  // Move to search place
  const mapRef = useRef<MapView>(null);
  const [bookmark, setBookmark] = useState<LatLng[]>([]);

  function InputAutocomplete({
    placeholder,
    onPlaceSelected,
  }: InputAutocompleteProps) {
    return (
      <>
        <View style={{ height: "100%" }}>
          <GooglePlacesAutocomplete
            styles={{ textInput: styles.search, listView: styles.list }}
            placeholder={placeholder || ""}
            fetchDetails
            onPress={(data, details = null) => {
              console.log(JSON.stringify(data));
              console.log(JSON.stringify(details));
              onPlaceSelected(details);
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

  const onPlaceSelected = (details: GooglePlaceDetail | null) => {
    const position = {
      latitude: details?.geometry?.location.lat || 0,
      longitude: details?.geometry?.location.lng || 0,
    };
    setBookmark([...bookmark, position]);
    moveTo(position);
  };

  //marker on Change
  const onRegionChange = (region: Region) => {
    setMarkerCoordinate(region);
  };
  const onRegionChangeComplete = async (region: Region, details: Details) => {
    setCenter(region);
    setMarkerCoordinate(region);
    // fetchPlacesFormDB();
  };

  // Fetch places from google map
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    fetchPlacesFromGoogleMaps(center)
      .then((placesData) => {
        setPlaces(placesData);
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.search}>
          <InputAutocomplete
            placeholder="Search"
            onPlaceSelected={(details) => {
              onPlaceSelected(details);
            }}
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
          {/* {markersList.map((marker) => {
            return (
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                title={marker.title ? marker.title : undefined}
                description={
                  marker.description ? marker.description : undefined
                }
              />
            );
          })} */}
          <Marker draggable coordinate={markerCoordinate}>
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
  // console.log("fetchPlacesFromGoogleMaps:", center);
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

  //   const places = data.results.map(
  //     (googlePlace: {
  //       geometry: Geometry;
  //       name: string;
  //       opening_hours: "";
  //       photos: any;
  //       place_id: string;
  //       rating: number;
  //       vicinity: string;
  //     }) => {
  //       const width = 200;
  //       const url =
  //         `https://maps.googleapis.com/maps/api/place/photo?` +
  //         new URLSearchParams({
  //           maxwidth: width.toString(),
  //           photo_reference: googlePlace.photos[0].photo_reference,
  //           key: GOOGLE_API_KEY,
  //         });
  //       const { lat, lng } = googlePlace.geometry.location;
  //       const coordinate = {
  //         latitude: lat,
  //         longitude: lng,
  //       };

  //       return {
  //         coordinate,
  //         opening_hours: googlePlace.opening_hours,
  //         photos: url,
  //         placeId: googlePlace.place_id,
  //         placeName: googlePlace.name,
  //         address: googlePlace.vicinity,
  //         rating: googlePlace.rating,
  //       };
  //     }
  //   );

  //   // let json = await api.post("/location/Marker", places, object({}));
  //   return places;

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

const setStarRating = (rating: number) => {
  rating = Math.round(rating * 2) / 2;
  let output = [];
  for (var i = rating; i >= 1; i--) output.push(1);
  if (i >= 0.5 && i < 1) output.push(0.5);
  for (let i = 5 - rating; i >= 1; i--) output.push(0);
  return output.map((star, index) => (
    <MaterialCommunityIcons
      key={index}
      name={
        star === 1 ? "star" : star === 0.5 ? "star-half-full" : "star-outline"
      }
      color={"#DEB934"}
      size={16}
    />
  ));
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
