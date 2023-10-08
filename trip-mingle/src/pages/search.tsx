import React, { useState } from 'react';
import { SearchBar } from '@rneui/themed';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {Card, Avatar} from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
type SearchBarComponentProps = {}; 

const styles = StyleSheet.create({
view: {
  margin: 10,
},
});
<Calendar
  onDayPress={day => {
    console.log('selected day', day);
  }}
/>
const App = () => {
  const [selected, setSelected] = useState('');
  const [search, setSearch] = useState("");  
  const updateSearch = (search: React.SetStateAction<string>) => {
    setSearch(search);
  };
  return (
    <><><View style={styles.view}>
      <SearchBar
        placeholder="Type Here..."
        onChangeText={updateSearch}
        value={search} />
    </View></><Calendar
        onDayPress={day => {
          setSelected(day.dateString);
        } }
        markedDates={{
          [selected]: { selected: true, disableTouchEvent: true, selectedColor: 'aqua' }
        }} /></>
)};


export default App;