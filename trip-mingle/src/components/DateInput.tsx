import { format_2_digit } from "@beenotung/tslib/format";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TextButton from "./TextButton";
import { theme } from "../theme/variables";

let styles = StyleSheet.create({
  button: {
    backgroundColor: theme.primaryColor,
    borderRadius: 8,
    margin: 4,
    width: "25%",
    height: 64,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: theme.mediumColor,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  buttonTextNull: {
    color: "#888888",
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  draft: {
    margin: 18,
  },
  draftText: {
    color: "#ff0000",
  },
});

export default function DateInput(props: {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
}) {
  const [mode, setMode] = useState("view");
  const [draft, setDraft] = useState("");

  function renderButton(num: number | null) {
    let canPress = calcCanPress();
    function calcCanPress() {
      if (num == null) return false;
      if (draft.length == 0) {
        return num == 2;
      }
      if (draft.length == 1) {
        return num == 0;
      }
      if (draft.length == 2) {
        return num >= 2 && num <= 3;
      }
      if (draft.length == 5) {
        return num >= 0 && num <= 1;
      }
      if (draft.length == 6) {
        if (draft[5] == "1") {
          return num >= 0 && num <= 2;
        }
        if (draft[5] == "0") {
          return num >= 1;
        }
      }
      if (draft.length == 8) {
        return num >= 0 && num <= 3;
      }
      if (draft.length == 9) {
        if (draft[8] == "3") {
          return num >= 0 && num <= 1;
        }
        if (draft[8] == "0") {
          return num >= 1;
        }
      }
      if (draft.length == 10) {
        return false;
      }
      return true;
    }
    return (
      <TouchableOpacity
        onPress={() => {
          let text = draft + num;
          if (text.length == 4 || text.length == 7) {
            text += "-";
          }
          setDraft(text);
        }}
        style={[styles.button, canPress ? [] : [styles.buttonDisabled]]}
        disabled={!canPress}
      >
        <Text style={num == null ? styles.buttonTextNull : styles.buttonText}>
          {num == null ? "0" : num}
        </Text>
      </TouchableOpacity>
    );
  }
  return (
    <View>
      <Text>-----------------------------------</Text>

      {mode == "view" ? (
        <View>
          <Text>
            {props.value ? formatDate(props.value) : props.placeholder}
          </Text>
          <Text>{props.value}</Text>
          <TextButton
            text="Edit"
            onPress={() => {
              setMode("edit");
              setDraft("");
            }}
          ></TextButton>
        </View>
      ) : null}
      {mode == "edit" ? (
        <View>
          <View style={styles.draft}>
            <Text style={styles.draftText}>Draft: {draft}</Text>
          </View>
          <View>
            <View style={styles.row}>
              {renderButton(1)}
              {renderButton(2)}
              {renderButton(3)}
            </View>
            <View style={styles.row}>
              {renderButton(4)}
              {renderButton(5)}
              {renderButton(6)}
            </View>
            <View style={styles.row}>
              {renderButton(7)}
              {renderButton(8)}
              {renderButton(9)}
            </View>
            <View style={styles.row}>
              {renderButton(null)}
              {renderButton(0)}
              {renderButton(null)}
            </View>
          </View>
          <View style={styles.row}>
            <TextButton
              style={{ width: "25%" }}
              text="Cancel"
              onPress={() => {
                setMode("view");
              }}
            ></TextButton>
            <TextButton
              disabled={draft.length != 10}
              style={{ width: "25%" }}
              text="Save"
              onPress={() => {
                setMode("view");
                let date = new Date(draft);
                date.setHours(0, 0, 0, 0);
                props.setValue(date.toISOString());
              }}
            ></TextButton>
            <TextButton
              style={{ width: "25%" }}
              text="<"
              onPress={() => {
                let text = draft.slice(0, draft.length - 1);
                if (text.length == 4) {
                  text = text.slice(0, 3);
                }
                setDraft(text);
              }}
            ></TextButton>
          </View>
        </View>
      ) : null}

      <Text>-----------------------------------</Text>
    </View>
  );
}

function formatDate(str: string) {
  let date = new Date(str);
  let y = date.getFullYear();
  let m = format_2_digit(date.getMonth() + 1);
  let d = format_2_digit(date.getDate());
  return `${y}-${m}-${d}`;
}
