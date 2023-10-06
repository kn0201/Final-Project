// Buffer Line
import { StyleSheet } from "react-native";
import { center, column, flex, full, iosBlue, row } from "./StyleSheetHelper";

const LoginPageStyleSheet = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: center,
    alignItems: center,
  },
  center: {
    display: flex,
    justifyContent: center,
    alignItems: center,
    width: "100%",
  },
  icon: {
    display: flex,
    justifyContent: center,
    alignItems: center,
    borderWidth: 1,
    url: "../assets/yukimin.png",
  },
  input: {
    flexDirection: row,
    alignItems: center,
    height: "7%",
    width: "90%",
    margin: 12,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textDecorationLine: "none",
  },
  welcome: {
    fontSize: 32,
    margin: 16,
  },

  signUp: {
    color: iosBlue,
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  forgotPW: {
    width: "90%",
    margin: 12,
    color: iosBlue,

    fontWeight: "bold",
    padding: 10,
  },
  login: {
    width: "90%",
    height: 60,
    margin: 12,
    padding: 10,
    display: flex,
    justifyContent: center,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: iosBlue,
    backgroundColor: iosBlue,
  },
  loginText: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: center,
  },
});

export default LoginPageStyleSheet;
