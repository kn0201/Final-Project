import { View, TextInput, Keyboard, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 53,
    width: "90%",
    margin: 12,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textDecorationLine: "none",
  },
  input: {
    display: "flex",
    width: 320,
  },
});

export default function InputItem(props: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters" | undefined;
}) {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        onEndEditing={() => Keyboard.dismiss()}
        style={styles.input}
        autoCapitalize={props.autoCapitalize}
        placeholder={props.placeholder}
      ></TextInput>
    </View>
  );
}
