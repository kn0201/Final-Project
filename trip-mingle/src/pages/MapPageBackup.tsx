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
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { api } from "../apis/api";
import { markerParser } from "../utils/parser";
import { object } from "cast.ts";
import * as Location from "expo-location";
import { LocationObject } from "expo-location";
import {
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";

import Constants from "expo-constants";
import useEvent from "react-use-event";

const { width, height } = Dimensions.get("window");
const aspect_ratio = width / height;
const latitudeDelta = 0.05;
const longitudeDelta = latitudeDelta * aspect_ratio;

type Place = {
  coordinate: LatLng;
  place_id: number;
  name: string;
};
type InputAutocompleteProps = {
  placeholder?: string;
  onPlaceSelected: (details: GooglePlaceDetail | null) => void;
};

const GOOGLE_API_KEY = "AIzaSyDkl6HfJvmSSKDGWH0L0Y183PbBuY9fjdo";
const placeType = "tourist_attraction";

//@ts-ignore
export default function MapPageBackUP({ route }) {
  // let latitude = 22.316668;
  // let longitude = 114.183334;
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [latitude, setLatitude] = useState<any>();
  const [longitude, setLongitude] = useState<any>();

  const [givenLocation, setGivenLocation] = useState<any>("clickIn");
  const [currentLatitude, setCurrentLatitude] = useState<any>();
  const [currentLongitude, setCurrentLongitude] = useState<any>();

  const [places, setPlaces] = useState<Place[]>([]);

  const [location, setLocation] = useState<LocationObject | null>(null);

  useEffect(() => {
    if (route.params) {
      const { latitude, longitude } = route.params;
      setGivenLocation("given");
      // console.log({ useEffect: givenLocation });
      setLatitude(latitude);
      setLongitude(longitude);
    }
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, [useEvent]);

  // Custom Marker
  const [state, setState] = useState({});
  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: givenLocation == "clickIn" ? location?.coords.latitude : latitude,
    longitude:
      givenLocation == "clickIn" ? location?.coords.longitude : longitude,
  });
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

  //marker on Change
  const onRegionChange = (region: Region) => {
    setMarkerCoordinate({
      latitude: region.latitude,
      longitude: region.longitude,
    });
    setCurrentLatitude(region.latitude);
    setCurrentLongitude(region.longitude);
  };
  const onRegionChangeComplete = async (region: Region, details: Details) => {
    setGivenLocation("current");
    setCurrentLatitude(region.latitude);
    setCurrentLongitude(region.longitude);
    let location = undefined;
    await fetchPlacesFromGoogleMaps(
      placeType,
      location,
      currentLatitude,
      currentLongitude
    )
      .then((placesData) => {
        setPlaces(placesData);
      })
      .catch((error) => {
        console.error("Error fetching places:", error);
      });
    // fetchPlacesFormDB();
  };

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
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  };
  const onPlaceSelected = (details: GooglePlaceDetail | null) => {
    const position = {
      latitude: details?.geometry?.location.lat || 0,
      longitude: details?.geometry?.location.lng || 0,
    };
    setBookmark([...bookmark, position]);
    moveTo(position);
  };

  const fetchPlacesFromGoogleMaps = async (
    placeType: string,
    location?: LocationObject,
    currentLatitude?: number,
    currentLongitude?: number
  ) => {
    // console.log("fetching");
    // console.log({ givenLocation: givenLocation });
    let radius = givenLocation == "clickIn" ? 2 * 1000 : 20 * 1000;
    const url =
      givenLocation == "current"
        ? `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${currentLatitude},${currentLongitude}&radius=${radius}&type=${placeType}&key=${GOOGLE_API_KEY}`
        : givenLocation == "given"
        ? `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${placeType}&key=${GOOGLE_API_KEY}`
        : `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location?.coords.latitude},${location?.coords.longitude}&radius=${radius}&type=${placeType}&key=${GOOGLE_API_KEY}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Network response was not ok");
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
          place_id: googlePlace.place_id,
          name: googlePlace.name,
          address: googlePlace.vicinity,
        };
      });
      // console.log(places);
      let json = await api.post("/location/Marker", places, object({}));
      setPlaces(places);
    } catch (error) {
      console.error("Error fetching places:", error);
      return [];
    }
  };

  const fetchPlacesFormDB = async () => {
    const result = await api.get("/location", markerParser);
    // console.log(result);

    const places = result.map((dataBaseMarker: any) => {
      const coordinate = {
        latitude: dataBaseMarker.latitude,
        longitude: dataBaseMarker.longitude,
      };

      return {
        coordinate: coordinate,
        place_id: dataBaseMarker.place_id,
        name: dataBaseMarker.name,
      };
    });
    // console.log(places);
    setPlaces(places);
  };

  useEffect(() => {
    // fetchPlacesFormDB();
    fetchPlacesFromGoogleMaps;
  }, []);

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
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude:
              givenLocation == "clickIn" ? location?.coords.latitude : latitude,
            longitude:
              givenLocation == "clickIn"
                ? location?.coords.longitude
                : longitude,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
          }}
        >
          {/* {places.map((place, index) => (
            <Marker
              key={index}
              coordinate={place.coordinate}
              title={place.name}
            />
          ))} */}
          <Marker
            draggable
            coordinate={markerCoordinate}
            onDragEnd={(e) => setState({ x: e.nativeEvent.coordinate })}
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

// Stylesheet
const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  // },
  // map: {
  //   width: "100%",
  //   height: "100%",
  // },

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
