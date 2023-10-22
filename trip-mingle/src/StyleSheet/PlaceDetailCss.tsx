import { StyleSheet } from "react-native";
import { center, flex } from "./StyleSheetHelper";

const PlaceDetailStyleSheet = StyleSheet.create({
  header: {
    display: flex,
    color: "black",
    fontSize: 17,
    fontWeight: "600",
    justifyContent: center,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
});

export default PlaceDetailStyleSheet;
