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
    borderColor: theme.primaryColor,
    backgroundColor: theme.primaryColor,
  },
  text: {
    fontSize: 16,
    color: theme.primaryTextColor,
    textAlign: "center",
  },
});

export default function TextButton(props: {
  text: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      <Text style={styles.text}>{props.text}</Text>
    </TouchableOpacity>
  );
}
