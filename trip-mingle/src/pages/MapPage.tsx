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
import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import * as Location from "expo-location";
import { GOOGLE_API_KEY } from "../environments";

const { width, height } = Dimensions.get("window");
const aspect_ratio = width / height;
const latitudeDelta = 0.01;
const longitudeDelta = latitudeDelta * aspect_ratio;

type InputAutocompleteProps = {
  placeholder?: string;
  onPlaceSelected: (details: GooglePlaceDetail | null) => void;
};
type Location = {
  coords: {
    accuracy: number;
    altitude: number;
    altitudeAccuracy: number;
    heading: number;
    latitude: number;
    longitude: number;
    speed: number;
  };
  timestamp: number;
};

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

export default function MapPage() {
  const mapRef = useRef<MapView>(null);
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
  const [state, setState] = useState({});
  const [bookmark, setBookmark] = useState<LatLng[]>([]);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const MyCustomMarkerView = () => {
    return (
      <Image
        source={require("../assets/Biglogo.webp")}
        style={{ width: 30, height: 30 }}
      />
    );
  };

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

  const MyCustomCalloutView = () => {
    return (
      <View>
        <Text>You</Text>
      </View>
    );
  };
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

  if (location != null) {
    return (
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
        </MapView>
      </View>
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
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    borderRadius: 8,
    margin: 8,
  },
  list: {
    width: "95%",
    opacity: 0.8,
    borderRadius: 8,
    position: "relative",
    top: 60,
    left: 8,
  },
});
