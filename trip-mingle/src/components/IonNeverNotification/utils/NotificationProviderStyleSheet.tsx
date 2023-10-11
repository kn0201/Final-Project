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

import { StyleSheet, ViewStyle, Dimensions } from "react-native";

const { width, height } = Dimensions.get("screen");

export const dialogDivPositioning: (dialogHeight: number) => ViewStyle = (
  dialogHeight
) => {
  return { top: (height - 20 - dialogHeight) / 2 };
};

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
  buttonOuterDiv: {
    height: "80%",
    display: flex,
    justifyContent: center,
    alignItems: center,
  },
  buttonDiv: {
    width: "60%",
    height: "70%",
    justifyContent: center,
    alignItems: center,
    borderRadius: 16,
  },
  dummyDiv: {
    position: absolute,
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
    minHeight: 300,
    borderRadius: 16,
    padding: 10,
  },
  dialogInnerDiv: {
    display: flex,
    height: full,
    flexDirection: column,
    justifyContent: "space-between",
    alignItems: center,
    marginTop: 10,
  },
  dialogIconDiv: {
    width: full,
    display: flex,
    justifyContent: center,
    alignItems: center,
  },
  dialogTextDiv: {
    width: full,
    display: flex,
    justifyContent: center,
    alignItems: center,
  },
  dialogButtonDiv: {
    width: full,
    height: 100,
    display: flex,
    flexDirection: row,
    justifyContent: "space-around",
    alignItems: center,
    padding: 10,
  },
  dialogTitleText: { fontSize: 28, fontWeight: "800", color: textColor },
  dialogMessageText: { fontSize: 24, fontWeight: "500", color: textColor },
  dialogButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#F1F5F9",
  },
});

export default providerStyleSheet;
