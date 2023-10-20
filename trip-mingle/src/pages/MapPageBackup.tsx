import React, { useState } from "react";
import MapView, { Details, Marker, Region } from "react-native-maps";
import { StyleSheet, View } from "react-native";

export default function MapPage() {
  let latitude = 22.316668;
  let longitude = 114.183334;

  const onRegionChange = (region: Region) => {
    setMarkerCoordinate({
      latitude: region.latitude,
      longitude: region.longitude,
    });
  };

  const onRegionChangeComplete = (region: Region, details: Details) => {
    console.log(region);
  };

  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: 22.316668,
    longitude: 114.183334,
  });

  return (
    <View style={styles.container}>
      <MapView
        onRegionChangeComplete={onRegionChangeComplete}
        onRegionChange={onRegionChange}
        style={styles.map}
        initialRegion={{
          latitude: 22.316668,
          longitude: 114.183334,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker key={"test"} coordinate={markerCoordinate} />
        {/* <Marker
          key={"test"}
          coordinate={{ latitude: 22.302219, longitude: 114.174637 }}
          title={"tst"}
          description={"TST"}
        /> */}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
