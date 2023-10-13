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
    // marginTop: 16,
    marginBottom: 4,
    marginLeft: "2.5%",
  },
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
  editContainer: {
    display: flex,
    flexDirection: row,
    justifyContent: "flex-end",
    marginTop: 8,
    marginEnd: "2.5%",
  },
  editButton: {
    display: flex,
    width: "auto",
    borderWidth: 1,
    borderColor: iosBlue,
    borderRadius: 5,
    backgroundColor: iosBlue,
    color: white,
    flexDirection: row,
    alignItems: center,
    paddingHorizontal: 4,
  },
});

export default ProfileScreenStyleSheet;
