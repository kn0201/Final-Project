//Buffer Line
import { StatusBar, StyleSheet } from "react-native";
import { flex, center, row, full, iosBlue } from "./StyleSheetHelper";

const BlogDetailScreenStyleSheet = StyleSheet.create({
  centerContainer: {
    display: flex,
    justifyContent: center,
    alignItems: center,
  },
  blogTitle: {
    fontWeight: "bold",
    fontSize: 32,
  },
  topContentContainer: {
    display: flex,
    flexDirection: row,
    marginTop: 16,
    marginStart: 16,
    marginEnd: 16,
    justifyContent: "space-between",
  },
  buttonContainer: {
    flexDirection: row,
    gap: 16,
  },
  tripDetailContainer: {
    margin: 16,
    flexDirection: row,
    justifyContent: "space-between",
  },
  introContainer: {
    margin: 16,
  },
  contentContainer: {
    marginHorizontal: 16,
  },
});
export default BlogDetailScreenStyleSheet;
