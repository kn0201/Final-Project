//Buffer Line
import { StyleSheet } from "react-native";
import { center, flex, row, white } from "./StyleSheetHelper";

export const ChangeUsernameStyleSheet = StyleSheet.create({
  center: {
    display: flex,
    justifyContent: center,
    alignItems: center,
    margin: 16,
  },
  previousUsernameContainer: {
    // height: "30%",
    flexDirection: row,
    alignItems: center,
  },
  newUsernameContainer: {
    alignItems: center,
  },
});
