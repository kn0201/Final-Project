//Buffer Line
import { StyleSheet } from "react-native";
import { center, flex, iosBlue, row, white } from "./StyleSheetHelper";

const ProfileScreenStyleSheet = StyleSheet.create({
  center: {
    display: flex,
    justifyContent: center,
    alignItems: center,
  },
  addProfile: {
    display: flex,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 48,
    height: 50,
    justifyContent: center,
    textAlign: center,
    borderRadius: 10,
    backgroundColor: iosBlue,
  },
  addText: {
    color: white,
  },
  IntroContainer: {
    display: flex,
    justifyContent: center,
    alignItems: center,
    width: "95%",
    height: 180,
    borderWidth: 1,
    borderRadius: 10,
  },
  IntroText: {
    fontSize: 18,
    marginTop: 24,
    marginBottom: 4,
    marginLeft: "2.5%",
  },
  textInput: {},
  inputContainer: {
    display: flex,
    flexDirection: row,
    alignItems: center,
    justifyContent: "space-between",
    height: "auto",
    width: "95%",
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    textDecorationLine: "none",
  },
});

export default ProfileScreenStyleSheet;
