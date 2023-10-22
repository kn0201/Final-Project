import { StyleSheet } from "react-native";
import { center, flex, row, white } from "./StyleSheetHelper";

const OtherProfileScreenStyleSheet = StyleSheet.create({
  container: {
    backgroundColor: "#c4ffdb",
    alignItems: "center",
    paddingBottom: 10,
  },
  AvatarContainer: {
    position: "relative",
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#ffffff",
  },
  center: {
    display: flex,
    justifyContent: center,
    alignItems: center,
    width: "100%",
  },
  TitleText: {
    fontSize: 16,
    marginTop: 4,
    marginLeft: "2.5%",
  },
  inputContainer: {
    display: flex,
    flexDirection: row,
    justifyContent: "space-between",
    height: "auto",
    width: "95%",
    marginVertical: 8,
    marginRight: 5,
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    textDecorationLine: "none",
  },
  inputText: {
    flex: 1,
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: center,
    marginHorizontal: 4,
  },
});

export default OtherProfileScreenStyleSheet;
