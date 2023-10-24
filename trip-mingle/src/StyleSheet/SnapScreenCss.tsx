//Buffer Line
import { StyleSheet } from "react-native";
import { center, flex, full, iosBlue, row, white } from "./StyleSheetHelper";

export const SnapScreenStyleSheet = StyleSheet.create({
  center: {
    display: flex,
    justifyContent: center,
    width: full,
    alignItems: center,
  },
  outerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    display: flex,
    width: "95%",
    backgroundColor: "white",
    marginVertical: 16,
  },
  contentContainer: {
    paddingHorizontal: 8,
    flexWrap: "wrap",
    marginBottom: 16,
  },
  contentText: {
    display: flex,
    fontSize: 16,
    flexWrap: "wrap",
    width: "100%",
  },
  buttonContainer: {
    display: flex,

    flexDirection: row,
  },

  imageContainer: {
    borderRadius: 10,
    paddingTop: 0,
    padding: 8,
    display: flex,
    alignItems: center,
    width: "100%",
  },
  spotContainer: {
    flexDirection: row,
    alignSelf: "flex-end",

    paddingHorizontal: 8,
    marginBottom: 8,
  },
  spotText: {
    fontSize: 16,
  },
  userContainer: {
    flexDirection: row,
    paddingHorizontal: 8,
    paddingTop: 8,
    alignItems: "flex-end",
    gap: 4,
    marginBottom: 4,
  },
  timeContainer: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
  },
  likeContainer: {
    alignItems: center,
    paddingHorizontal: 8,
    flexDirection: row,
    gap: 5,
  },
  rightComponent: {
    display: flex,
    flexDirection: row,
    alignItems: center,
  },
});
