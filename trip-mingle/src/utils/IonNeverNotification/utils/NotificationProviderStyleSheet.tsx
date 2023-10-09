// Buffer Line
const flex = "flex";
const row = "row";
const column = "column";

const full = "100%";

const flexStart = "flex-start";
const center = "center";
const flexEnd = "flex-end";

const absolute = "absolute";

const textColor = "#313432";

import { StyleSheet, ViewProps, Dimensions } from "react-native";

const { width, height } = Dimensions.get("screen");

const providerStyleSheet = StyleSheet.create({
  pageDiv: {
    width: full,
    height: full,
    zIndex: 0.8,
  },
  iconDiv: {
    display: flex,
    width: 50,
    height: 50,
    justifyContent: center,
    alignItems: center,
    marginHorizontal: 5,
  },
  toastDiv: {
    position: absolute,
    width: width - 20,
    height: 80,
    flexDirection: row,
    justifyContent: flexStart,
    alignItems: center,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#F1F5F9",
    margin: 10,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "600",
    color: textColor,
  },
  buttonDiv: {
    width: "60%",
    height: "80%",
    borderWidth: 2,
    borderRadius: 16,
  },
  dummyDiv: {
    width,
    height,
    opacity: 0.6,
    backgroundColor: "#E2E8F0",
    zIndex: 0.9,
  },
  dialogDiv: {
    position: absolute,
    width: 0.9 * width,
    left: 0.05 * width,
  },
  dialogTextDiv: { width: full, display: flex, justifyContent: center },
  dialogButtonDiv: {
    height: 100,
    display: flex,
    flexDirection: row,
    justifyContent: "space-around",
    padding: 5,
  },
});

export default providerStyleSheet;
