//Buffer Line
import { StyleSheet } from "react-native";
import { flex, center, row } from "./StyleSheetHelper";

const RegisterPageStyleSheet = StyleSheet.create({
  center: {
    display: flex,
    justifyContent: center,
    alignItems: center,
    width: "100%",
    flexDirection: row,
  },
});

export default RegisterPageStyleSheet;
