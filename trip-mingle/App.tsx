import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Trip Mingle</Text>
      <Text style={styles.title}>伴</Text>
      <Text style={styles.title}>旅</Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title:{
    display:'flex',
    flexDirection:'row',
    fontSize:48,
  }
});
