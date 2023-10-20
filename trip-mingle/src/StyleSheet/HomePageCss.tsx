//Buffer Line
import { StyleSheet } from "react-native";
import { center, flex, row, white } from "./StyleSheetHelper";

export const HomePageStyleSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    display: "flex",
    flexDirection: "row",
    fontSize: 48,
  },
  slogan: {
    fontSize: 16,
    margin: 16,
    fontWeight: "bold",
  },
  header: {
    color: "black",
    fontSize: 17,
    fontWeight: "600",
  },
  routeContainer: {
    display: flex,
    flexDirection: row,
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: center,
    marginVertical: 32,
    marginHorizontal: 16,
  },
  routerBox: {
    display: flex,
    justifyContent: center,
    alignItems: center,
    borderWidth: 1,
    borderRadius: 10,
    width: 110,
    height: 80,
    gap: 5,
  },
  cityContainer: {
    margin: 16,
  },
  cityText: {
    fontWeight: "bold",
    fontSize: 20,
  },
  cityBoxContainer: {
    flexDirection: row,
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: center,
    marginTop: 16,
    gap: 16,
    marginBottom: 16,
  },
  cityBox: {
    display: flex,
    justifyContent: center,
    alignItems: center,
    width: 110,
    height: 110,
    gap: 5,
    backgroundColor: "#444",
    opacity: 0.6,
  },
  image: {
    display: flex,
    justifyContent: center,
    alignItems: center,
    width: 110,
    height: 110,
  },
  cityBoxText: {
    // paddingTop: 60,
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  imageBackground: {
    opacity: 0.9,
    width: 110,
    height: 110,
  },
  planText: {
    fontWeight: "bold",
    fontSize: 20,
    marginStart: 16,
  },
});
