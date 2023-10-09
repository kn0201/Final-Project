import React, { useState } from 'react';
import { SearchBar, SpeedDial } from '@rneui/themed';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {Card, Avatar} from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
type SearchBarComponentProps = {}; 

const styles = StyleSheet.create({
view: {
  margin: 7,
  backgroundColor:'#FFF'
},
});
<Calendar
  onDayPress={day => {
    console.log('selected day', day);
  }}
/>
const PlanningPage = () => {
  const [selected, setSelected] = useState('');
  const [search, setSearch] = useState("");  
  const updateSearch = (search: React.SetStateAction<string>) => {
    setSearch(search);
  };
  const [open, setOpen] = React.useState(false);
  return (
    <><><><View style={styles.view}>
      <SearchBar
        placeholder="Type Here..."
        onChangeText={updateSearch}
        value={search}
        inputStyle={{ color: "white" }}
         />
    </View></><Calendar
        onDayPress={day => {
          setSelected(day.dateString);
        } }
        markedDates={{
          [selected]: { selected: true, disableTouchEvent: true, selectedColor: 'red' }
        }} /></>
        <SpeedDial
          isOpen={open} 
          icon={{ name: 'edit', color: '#fff' }}
          openIcon={{ name: 'close', color: '#fff' }}
          onOpen={() => setOpen(!open)}
          onClose={() => setOpen(!open)}
        >
        <SpeedDial.Action
          icon={{ name: 'add', color: '#fff' }}
          title="Add"
          onPress={() => console.log('Add Something')} />
        <SpeedDial.Action 
          icon={{ name: 'delete', color: '#fff' }}
          title="Delete"
          onPress={() => console.log('Delete Something')} />
      </SpeedDial></>
)};


export default PlanningPage