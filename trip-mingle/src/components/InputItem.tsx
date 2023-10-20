import { View, TextInput, Keyboard, StyleSheet } from "react-native";
import { Icon } from "react-native-vector-icons/Icon";

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
      {/* <Icon
        style={{
          display: flex,
          justifyContent: "flex-start",
          marginEnd: 4,
        }}
        name="account-outline"
        size={20}
      /> */}
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        onEndEditing={() => Keyboard.dismiss()}
        style={styles.input}
        autoCapitalize={props.autoCapitalize}
        placeholder={props.placeholder}
      ></TextInput>
      {/* <Icon
        style={{ display: flex, justifyContent: "flex-end" }}
        name="close"
        size={20}
        onPress={() => clearInputs.username()}
      /> */}
    </View>
  );
}
