// Buffer Line
import { StyleSheet } from "react-native";
import { center, column, flex, full, iosBlue, row } from "./StyleSheetHelper";
import { theme } from "../theme/variables";

const LoginScreenStyleSheet = StyleSheet.create({
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
    height: 53,
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
  signUpContainer: {
    width: "90%",
    display: flex,
    flexDirection: row,
    alignItems: center,
    margin: 12,
  },
  signUp: {
    color: iosBlue,
    textDecorationLine: "underline",
    fontWeight: "bold",
    // backgroundColor: "red",
    padding: 10,
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
    borderColor: theme.button,
    backgroundColor: theme.button,
  },
  loginText: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: center,
    fontWeight: "bold",
    textShadowColor: "#8E8E8E",
    textShadowRadius: 1,
    textShadowOffset: {
      width: 0.9,
      height: 0.9,
    },
  },
});

export default LoginScreenStyleSheet;
