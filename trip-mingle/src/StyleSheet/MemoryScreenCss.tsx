import { StyleSheet } from "react-native";
import { center, flex, iosBlue, row, white } from "./StyleSheetHelper";

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
    backgroundColor: iosBlue,
    borderWidth: 1,
    borderColor: iosBlue,
    color: white,
  },
  inUseText: {
    color: white,
    justifyContent: center,
    alignSelf: center,
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
