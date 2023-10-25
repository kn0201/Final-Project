//Buffer Line
import { StyleSheet } from "react-native";
import { center, flex, full, iosBlue, row, white } from "./StyleSheetHelper";

const SavedLocationScreenStyleSheet = StyleSheet.create({
  center: {
    display: flex,
    // justifyContent: center,
    alignItems: center,
    width: "100%",

    height: full,
    // backgroundColor: white,
  },
  outerContainer: {
    marginVertical: 8,
    display: flex,
    height: 80,
    width: 400,
    margin: 8,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    justifyContent: "space-between",
    alignItems: center,
    flexDirection: row,
  },
  nameText: {
    fontSize: 16,
    justifyContent: center,
  },
  detailContainer: {
    flexDirection: row,
    alignItems: center,
  },
});

export default SavedLocationScreenStyleSheet;
