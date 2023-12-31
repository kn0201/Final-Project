import { StyleSheet } from "react-native";
import {
  center,
  flex,
  flexEnd,
  full,
  iosBlue,
  row,
  white,
} from "./StyleSheetHelper";
import { theme } from "../theme/variables";

const PlanningStyleSheet = StyleSheet.create({
  center: {
    display: flex,
    justifyContent: center,
    alignItems: center,
    width: full,
    flexDirection: row,
  },
  inputTitle: {
    fontWeight: "800",
    fontSize: 24,
    marginLeft: 8,
  },
  inputContainer: {
    backgroundColor: "transparent",
    width: "100%",
    padding: 10,
    fontSize: 16,
  },
  inputOuterContainer: {
    display: flex,
    justifyContent: center,
    alignItems: center,
    width: "90%",
    height: 60,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  daySelectCon: {
    display: flex,
    justifyContent: center,
    alignItems: center,
    height: 50,
    width: "90%",
    flexDirection: row,
    margin: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    textDecorationLine: "none",
  },
  uploadContainerSquare: {
    marginTop: 90,
    elevation: 2,
    height: 300,
    width: "90%",
    backgroundColor: "#CBE9CE",
    position: "relative",
    overflow: "hidden",
    marginBottom: 16,
    justifyContent: center,
  },
  uploadBtnContainerSquare: {
    opacity: 0.7,
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#eeeeee",
    width: "100%",
    height: "15%",
    color: "red",
    justifyContent: center,
    alignItems: center,
  },
  backgroundColor: {
    backgroundColor: "#ffffff",
  },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  countryContainer: {
    display: flex,
    justifyContent: center,
    alignItems: center,
    height: 50,
    width: "90%",
    flexDirection: row,
    margin: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    textDecorationLine: "none",
  },
  ModalButtonContainer: {
    display: flex,
    flexDirection: row,
    width: "100%",
    height: "10%",
    justifyContent: center,
    alignItems: center,
  },
  ModalText: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 8,
    color: iosBlue,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: center,
    alignItems: center,
    justifyContent: center,
  },
  AddScheduleSytle: {
    height: 1000,
  },
  buttonStyle: {
    width: "90%",
    height: 60,
    margin: 12,
    padding: 10,
    display: flex,
    justifyContent: center,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: iosBlue,
    backgroundColor: iosBlue,
  },
  loginText: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: center,
  },
  cancelButtonDiv: {
    width: "90%",
    display: flex,
    flexDirection: row,
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelButton: {
    width: "47%",
    height: 50,
    backgroundColor: "#DC3545",
    display: flex,
    justifyContent: center,
    alignItems: center,
    borderRadius: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    textShadowColor: "#8E8E8E",
    textShadowRadius: 1,
    textShadowOffset: {
      width: 0.9,
      height: 0.9,
    },
  },

  addButton: {
    width: "47%",
    height: 50,
    backgroundColor: iosBlue,
    display: flex,
    justifyContent: center,
    alignItems: center,
    borderRadius: 10,
  },
  addButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    textShadowColor: "#8E8E8E",
    textShadowRadius: 1,
    textShadowOffset: {
      width: 0.9,
      height: 0.9,
    },
  },
  formInputContainer: {
    width: full,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginVertical: 16,
  },
  dateInputContainer: {
    width: "90%",
    height: 50,
    marginLeft: 8,
    marginTop: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
});

export default PlanningStyleSheet;
