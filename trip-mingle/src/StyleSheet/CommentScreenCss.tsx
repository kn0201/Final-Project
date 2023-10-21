//Buffer Line
import { StatusBar, StyleSheet } from "react-native";
import { flex, center, row, full, iosBlue, white } from "./StyleSheetHelper";

const CommentScreenStyleSheet = StyleSheet.create({
  centerContainer: {
    display: flex,
    justifyContent: center,
    alignItems: center,
  },
  bottomContainer: {
    backgroundColor: white,
    height: 45,
    width: full,
    justifyContent: "space-between",
    alignItems: center,
    flexDirection: row,
    paddingHorizontal: 10,
    gap: 3,
  },
  textInputContainer: {
    flex: 1,
    height: 45,
    justifyContent: center,
    paddingHorizontal: 8,
  },
  textInput: {
    backgroundColor: "#eeeeee",
    borderRadius: 10,
    height: 37,
    paddingHorizontal: 5,
  },
});
export default CommentScreenStyleSheet;
