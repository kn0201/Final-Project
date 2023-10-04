import { StyleSheet, Text, View } from "react-native";
import * as React from "react";

export default function BuddiesPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Buddies</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    display: "flex",
    flexDirection: "row",
    fontSize: 48,
  },
});
