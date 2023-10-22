import { StyleSheet } from "react-native";
import { center, flex, iosBlue, row } from "./StyleSheetHelper";

const PlaceDetailStyleSheet = StyleSheet.create({
  header: {
    display: flex,
    color: "black",
    fontSize: 17,
    fontWeight: "600",
    justifyContent: center,
    textAlign: center,
    marginTop: 16,
  },
  imageContainer: {
    margin: 8,
    // borderWidth: 1,
    borderRadius: 10,
    // padding: 8,
    display: flex,
    alignItems: center,
  },
  contentContainer: {
    margin: 8,
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
  },
  nameContainer: {
    display: flex,
    justifyContent: "space-between",
    flexDirection: row,
    alignItems: center,
  },
  allText: {
    fontSize: 16,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 4,
    textDecorationLine: "underline",
  },
  buttonContainer: {
    display: flex,
    alignSelf: "flex-end",
    flexDirection: row,
    justifyContent: center,
    marginHorizontal: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  bookmarkText: {
    fontSize: 16,
    // color: iosBlue,
    justifyContent: center,
    alignItems: center,
  },
});

export default PlaceDetailStyleSheet;
