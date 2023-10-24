//Buffer Line
import { StyleSheet } from "react-native";
import { flex, center, row, iosBlue, full, white } from "./StyleSheetHelper";

export const NewSnapScreenStyleSheet = StyleSheet.create({
  center: {
    alignItems: center,
    width: full,
  },

  uploadContainerSquare: {
    elevation: 2,
    minHeight: 450,
    width: "90%",
    backgroundColor: "#efefef",
    position: "relative",
    overflow: "hidden",
    marginBottom: 8,
    justifyContent: center,
  },
  uploadBtnContainerSquare: {
    opacity: 0.7,
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "lightgrey",
    width: "100%",
    height: "10%",
    color: "red",
    justifyContent: center,
    alignItems: center,
  },
  backgroundColor: {
    backgroundColor: "#ffffff",
  },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    height: 100,
    width: "90%",
    margin: 8,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textDecorationLine: "none",
  },
  search: {
    height: 40,
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
  },
  list: {
    zIndex: 999,
    height: "100%",
    width: "100%",
    borderRadius: 8,
    backgroundColor: white,
  },
  spotContainer: {
    flexDirection: row,
    alignSelf: center,
    width: "90%",
  },
  autocompleteContainer: {
    height: 40,
    width: "100%",
  },
});
