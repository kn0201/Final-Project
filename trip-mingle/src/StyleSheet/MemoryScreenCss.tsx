import { StyleSheet } from "react-native";
import { center, flex, iosBlue, row, white } from "./StyleSheetHelper";
import { theme } from "../theme/variables";

const MyPostScreenScreenStyleSheet = StyleSheet.create({
  center: {
    display: flex,
    justifyContent: center,
    alignItems: center,
  },

  selectButtonContainer: {
    display: flex,
    flexDirection: row,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  inUseButton: {
    marginVertical: 16,
    width: 100,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.button,
    borderWidth: 1,
    borderColor: theme.button,
    color: white,
  },
  inUseText: {
    color: white,
    justifyContent: center,
    alignSelf: center,
    fontWeight: "bold",
    textShadowColor: "#8E8E8E",
    textShadowRadius: 1,
    textShadowOffset: {
      width: 0.9,
      height: 0.9,
    },
  },
  nonUseButton: {
    marginVertical: 16,
    width: 100,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  nonUseText: {
    color: "black",
    justifyContent: center,
    alignSelf: center,
  },
});

export default MyPostScreenScreenStyleSheet;
