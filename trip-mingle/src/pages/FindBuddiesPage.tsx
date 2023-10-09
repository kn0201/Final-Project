import * as React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { SegmentedButtons } from 'react-native-paper';

export default function BuddiesPage() {
  const [value, setValue] = React.useState('');
  
  return (
    <SafeAreaView style={styles.container}>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            value: 'blog',
            label: 'Blog',
          },
          { value: 'tour', label: 'Tour' },
        ]}
      />
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    display: "flex",
    flexDirection: "row",
    fontSize: 48,
  },
});
