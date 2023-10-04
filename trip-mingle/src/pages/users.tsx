import { StyleSheet, Text, View } from "react-native";
import * as React from "react";

function UserPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users Page</Text>
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

export default UserPage;
