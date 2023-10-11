import React, { useEffect, useRef, useState } from "react";
import MapView, {
  Callout,
  LatLng,
  Marker,
  PROVIDER_GOOGLE,
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
} from "react-native";
import * as Location from "expo-location";
import { GOOGLE_API_KEY, placeType } from "../../environments";
import { LocationObject } from "expo-location";
import Constants from "expo-constants";

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

export default function MapPage() {
  // Custom Marker
  const [state, setState] = useState({});

  const MyCustomMarkerView = () => {
    return (
      <Image
        source={require("../assets/Biglogo.webp")}
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

  // Get current location
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  // Fetch places from google map
  const [places, setPlaces] = useState<Place[]>([]);
  const [markersList, setMarkersList] = useState([
    {
      id: 1,
      latitude: 35.652832,
      longitude: 139.839478,
      title: "Tokyo",
      description: "",
    },
    {
      id: 2,
      latitude: 34.672314,
      longitude: 135.484802,
      title: "Osaka",
      description: "",
    },
  ]);

  useEffect(() => {
    if (location) {
      fetchPlacesFromGoogleMaps(location, placeType)
        .then((placesData) => {
          setPlaces(placesData);
        })
        .catch((error) => {
          console.error("Error fetching places:", error);
        });
    }
  }, [location, placeType]);

  const fetchPlacesFromGoogleMaps = async (
    location: LocationObject,
    placeType: string
  ) => {
    let radius = 4 * 1000;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location?.coords.latitude},${location?.coords.longitude}&radius=${radius}&type=${placeType}&key=${GOOGLE_API_KEY}`;
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
          placeId: googlePlace.place_id,
          placeName: googlePlace.name,
        };
      });
      return places;
    } catch (error) {
      console.error("Error fetching places:", error);
      return [];
    }
  };

  // Display
  if (location != null) {
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
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={{
              latitude: location?.coords.latitude,
              longitude: location?.coords.longitude,
              latitudeDelta: latitudeDelta,
              longitudeDelta: longitudeDelta,
            }}
          >
            {bookmark?.map((position, index) => (
              <Marker key={index} coordinate={position} />
            ))}
            {places.map((place, index) => (
              <Marker
                key={index}
                coordinate={place.coordinate}
                title={place.placeName}
              />
            ))}
            {markersList.map((marker) => {
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
            })}
            <Marker
              draggable
              coordinate={{
                latitude: location?.coords.latitude,
                longitude: location?.coords.longitude,
              }}
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
  if (location == null) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }
}

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
