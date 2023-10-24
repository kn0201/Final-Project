import { StyleSheet } from "react-native";
import { theme } from "../theme/variables";

const TourDetailScreenStyleSheet = StyleSheet.create({
  postContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: 10,
  },
  postDetailContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: 10,
    paddingBottom: 0,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    resizeMode: "contain",
    marginRight: 10,
  },
  rowWithEnd: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    gap: 6,
  },
  row: {
    flexDirection: "row",
    marginRight: 10,
    // flexWrap: "wrap",
    gap: 6,
  },
  rowContent: {
    flexDirection: "row",
    marginRight: 10,
    paddingBottom: 10,
    flexWrap: "wrap",
    gap: 6,
  },
  replyContainer: {
    flexDirection: "row",
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "white",
  },
  rowContainerWithEnd: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 50,
    paddingBottom: 15,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginLeft: 50,
    paddingBottom: 8,
  },
  contentTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginLeft: 50,
    paddingBottom: 5,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginLeft: 50,
    marginRight: 20,
    marginBottom: 15,
    paddingLeft: 10,
    paddingTop: 10,
    backgroundColor: "white",
  },
  titleKey: { fontWeight: "600" },
  applyContainer: {
    flexDirection: "row",
    height: "100%",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 10,
    backgroundColor: "#c4ffdb",
  },
  applyRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 2,
  },
  button: {
    width: 55,
    height: 33,
    marginRight: 13,
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: theme.primaryColor,
    backgroundColor: theme.primaryColor,
  },
  text: {
    fontSize: 14,
    color: theme.primaryTextColor,
    textAlign: "center",
  },
});

export default TourDetailScreenStyleSheet;
