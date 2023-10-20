import { StyleSheet } from "react-native";

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
    flexWrap: "wrap",
    gap: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    flexWrap: "wrap",
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
    paddingBottom: 10,
  },
  titleKey: { fontWeight: "600" },
});

export default TourDetailScreenStyleSheet;
