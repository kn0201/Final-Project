//Buffer Line
import { StyleSheet } from "react-native";
import { center, flex, row, white } from "./StyleSheetHelper";

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
    position: "relative",
    marginTop: 24,
    marginBottom: 8,
    backgroundColor: "#ffffff",
  },
  username: {
    fontSize: 32,
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
  uploadBtnContainer: {
    position: "absolute",
    top: 150,
    left: 235,
    // backgroundColor: "lightgrey",
  },
  uploadBtn: {
    height: 30,
    width: 30,
    backgroundColor: white,
    borderRadius: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  usernameContainer: {
    display: flex,
    alignItems: center,
    justifyContent: center,
    marginTop: 8,
    marginBottom: 8,
    gap: 5,
  },
  changeContainer: {
    borderWidth: 1,
    padding: 4,
  },
});

export default UserPageStyleSheet;
