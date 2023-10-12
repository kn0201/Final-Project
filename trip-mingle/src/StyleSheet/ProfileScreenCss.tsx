//Buffer Line
import { StyleSheet } from "react-native";
import { center, flex } from "./StyleSheetHelper";

const ProfileScreenStyleSheet = StyleSheet.create({
  center: {
    display: flex,
    justifyContent: center,
    alignItems: center,
  },
  addProfile: {
    display: flex,
    borderWidth: 1,
    // width: 100,
    padding: 16,
    height: 50,
    justifyContent: center,
    textAlign: center,
  },
});

export default ProfileScreenStyleSheet;
