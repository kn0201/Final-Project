//Buffer Line
import { StyleSheet } from "react-native";
import { center, flex, row } from "./StyleSheetHelper";

const UserPageStyleSheet = StyleSheet.create({
  container: {
    backgroundColor: "#D3D3D3",
    alignItems: "center",
    // justifyContent: "center",
  },
  header: {
    color: "black",
    fontSize: 17,
    fontWeight: "600",
  },
  AvatarContainer: {
    marginTop: 24,
    marginBottom: 8,
    backgroundColor: "#ffffff",
  },
  username: {
    marginBottom: 16,
    fontSize: 24,
  },
  rightComponent: {
    display: flex,
    flexDirection: row,
    alignItems: center,
  },
  editContainer: {
    display: flex,
    flexDirection: row,
    justifyContent: "flex-end",
    marginTop: 8,
    marginEnd: "2.5%",
  },
});

export default UserPageStyleSheet;
