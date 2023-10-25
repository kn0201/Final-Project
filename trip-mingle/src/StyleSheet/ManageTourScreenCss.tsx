import { StyleSheet } from "react-native";
import { theme } from "../theme/variables";

const ManageTourScreenStyleSheet = StyleSheet.create({
  postDetailContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: 10,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
    resizeMode: "contain",
    marginRight: 10,
  },
  row: {
    flexDirection: "row",
    marginRight: 10,
    flexWrap: "wrap",
    gap: 6,
  },
  rowContent: {
    flexDirection: "row",
    marginRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    flexWrap: "wrap",
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "white",
    flex: 1,
  },
  titleKey: { fontWeight: "600" },
  button: {
    width: 55,
    height: 33,
    marginRight: 5,
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: theme.primaryColor,
    backgroundColor: theme.primaryColor,
  },
  rejectButton: {
    width: 55,
    height: 33,
    marginRight: 8,
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "red",
    backgroundColor: "red",
  },
  text: {
    fontSize: 14,
    color: theme.primaryTextColor,
    textAlign: "center",
  },
  statusText: {
    fontSize: 14,
    marginRight: 13,
    color: "black",
    textAlign: "center",
  },
});

export default ManageTourScreenStyleSheet;
