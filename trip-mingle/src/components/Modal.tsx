import { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useEvent } from "react-use-event";
import TextButton from "./TextButton";
import { BooleanState } from "../hooks/useBoolean";
import { theme } from "../theme/variables";

type ModalEvent = {
  type: "modal";
  content: any;
};

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    height: "100%",
    width: "100%",
    zIndex: 1,
    // backgroundColor: theme.white,
    backgroundColor: "#F8FAFCAA",
    display: "flex",
    // alignItems: "center",
    // flexDirection: "row",
  },
  container: {
    margin: "auto",
  },
  space: {
    flexGrow: 1,
  },
});

export function ModalRoot() {
  const [content, setContent] = useState<any>();
  const dispatch = useEvent<ModalEvent>("modal", (event) => {
    setContent(() => event.content);
  });
  if (!content) {
    return <></>;
  }
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.space}></View>
      <View style={styles.container}>{content}</View>
      <View style={styles.space}></View>
    </SafeAreaView>
  );
}

export function Modal(props: {
  //   isOpen: boolean;
  //   onDismiss: () => void;
  children: React.JSX.Element[] | React.JSX.Element;
  state: BooleanState;
}) {
  const { state, children } = props;
  const isOpen = state.value;

  const dispatch = useEvent<ModalEvent>("modal", (event) => {
    if (!event.content) {
      state.off();
    }
  });

  useEffect(() => {
    if (isOpen) {
      dispatch({ content: children });
    } else {
      dispatch({ content: null });
    }
  }, [isOpen, children]);

  return <></>;
}
