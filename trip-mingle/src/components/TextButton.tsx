import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { theme } from "../theme/variables";

const styles = StyleSheet.create({
  button: {
    width: "90%",
    height: 60,
    margin: 12,
    padding: 10,
    display: "flex",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: theme.button,
    backgroundColor: theme.button,
  },
  buttonDisabled: {
    borderColor: theme.mediumColor,
    backgroundColor: theme.mediumColor,
  },
  text: {
    fontSize: 16,
    color: theme.primaryTextColor,
    textAlign: "center",
    fontWeight: "bold",
    textShadowColor: "#8E8E8E",
    textShadowRadius: 1,
    textShadowOffset: {
      width: 0.9,
      height: 0.9,
    },
  },
});

export default function TextButton(props: {
  text: string;
  onPress: () => void;
  style?: { width?: string };
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      disabled={props.disabled}
      style={[
        styles.button,
        props.style as any,
        props.disabled ? [styles.buttonDisabled] : [],
      ]}
      onPress={props.onPress}
    >
      <Text style={styles.text}>{props.text}</Text>
    </TouchableOpacity>
  );
}
