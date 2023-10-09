//Buffer Line
import { StyleSheet } from "react-native";
import { flex, center, row, full } from "./StyleSheetHelper";

const RegisterPageStyleSheet = StyleSheet.create({
  center: {
    display: flex,
    justifyContent: center,
    alignItems: center,
    width: "100%",
    flexDirection: row,
  },
  input: {
    flexDirection: row,
    alignItems: center,
    height: "7%",
    width: "90%",
    margin: 8,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textDecorationLine: "none",
  },
  textInput: {
    width: full,
    marginLeft: 8,
  },
  passwordContainer: {
    display: flex,
    justifyContent: center,
    alignItems: center,
    width: "90%",
    flexDirection: row,
    flexWrap: "wrap",
    margin: 8,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textDecorationLine: "none",
  },
  password: {
    flexDirection: row,
    alignItems: center,
    width: "100%",
    margin: 8,
  },
  genderContainer: {
    display: flex,

    alignItems: center,
    width: "90%",
    flexDirection: row,

    margin: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    textDecorationLine: "none",
  },
});

export default RegisterPageStyleSheet;
