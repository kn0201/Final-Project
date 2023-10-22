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
} from "react-native";
import * as Location from "expo-location";

import { LocationObject } from "expo-location";
import Constants from "expo-constants";
import useEvent from "react-use-event";
import { MapEvent } from "../utils/events";
import { navigate } from "../tabs/RootNavigation";
import { api } from "../apis/api";
import { object } from "cast.ts";
import { useGet } from "../hooks/useGet";
import { markerParser } from "../utils/parser";
import { useAppRoute } from "../../navigators";

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
  placeId: number;
  placeName: string;
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

export default function MapPage({ route }: { route: any }) {
  const defaultCenter = {
    latitude: 22.2773199,
    longitude: 114.173206,
  };

  const params = useAppRoute<"Map">();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [center, setCenter] = useState(defaultCenter);

  type LatLng = {
    latitude: number;
    longitude: number;
  };

  useEffect(() => {
    if (params.center) {
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
    })();
  }, [params.center]);

  // Custom Marker
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
        console.error("Error fetching places:", error);
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
            />
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
          <Marker
            draggable
            coordinate={markerCoordinate}
            // onDragEnd={(e) => setState({ x: e.nativeEvent.coordinate })}
          >
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

const fetchPlacesFromGoogleMaps = async (center: LatLng) => {
  console.log("fetchPlacesFromGoogleMaps:", center);
  // let radius = givenLocation == "clickIn" ? 2 * 1000 : 20 * 1000;
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

  const places = data.results.map((googlePlace: GooglePlaceDetail) => {
    const { lat, lng } = googlePlace.geometry.location;
    const coordinate = {
      latitude: lat,
      longitude: lng,
    };
    return {
      coordinate,
      placeId: googlePlace.place_id,
      placeName: googlePlace.name,
      address: googlePlace.vicinity,
    };
  });

  // let json = await api.post("/location/Marker", places, object({}));
  return places;
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
    // shadowColor: "black",
    // shadowOffset: { width: 2, height: 2 },
    // shadowOpacity: 0.5,
    // shadowRadius: 4,
    // elevation: 4,
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
