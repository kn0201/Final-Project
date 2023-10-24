//Buffer Line
import { StyleSheet } from "react-native";
import { center, flex, row, white } from "./StyleSheetHelper";

const UserPageStyleSheet = StyleSheet.create({
  container: {
    // backgroundColor: "#FFFFFF",

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
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: "#ffffff",
  },
  username: {
    fontSize: 32,
    color: white,

    opacity: 1,
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
    top: 142,
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
    paddingBottom: 8,
    gap: 5,
    backgroundColor: "black",
    opacity: 0.8,
    width: "100%",
  },
  changeContainer: {
    borderWidth: 1,
    padding: 4,
    borderColor: white,
  },
  image: {
    width: 428,
    height: 264,
    justifyContent: "center",
  },
});

export default UserPageStyleSheet;
