//Buffer Line
import { StyleSheet } from "react-native";
import { center, flex, full, iosBlue, row, white } from "./StyleSheetHelper";

export const ChangeUsernameStyleSheet = StyleSheet.create({
  center: {
    display: flex,
    alignItems: center,
    marginTop: 12,
    height: full,
  },
  previousUsernameContainer: {
    flexDirection: row,
    alignItems: center,
    justifyContent: center,
    marginBottom: 32,
  },
  newUsernameContainer: {
    alignItems: center,
    justifyContent: center,
    marginBottom: 24,
  },
  submit: {
    width: 120,
    height: 50,
    marginTop: 12,
    padding: 10,
    display: flex,
    justifyContent: center,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: iosBlue,
    backgroundColor: iosBlue,
  },
  buttonText: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: center,
  },
  buttonContainer: {
    flexDirection: row,
    alignItems: center,
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  titleContainer: {
    marginBottom: 30,
    flexDirection: row,
    justifyContent: center,
    alignItems: center,
    borderBottomWidth: 2,
    gap: 10,
  },
  cancel: {
    width: 120,
    height: 50,
    marginTop: 12,
    padding: 10,
    display: flex,
    justifyContent: center,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#FF2C2C",
    backgroundColor: "#FF2C2C",
  },
  errorMsgContainer: {
    display: flex,
    justifyContent: center,
    alignItems: center,
    width: "100%",
    flexDirection: row,
  },
});
