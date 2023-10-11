import { useState, SetStateAction } from "react";
import { SearchBar, SpeedDial } from "@rneui/themed";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Avatar } from "react-native-paper";
import {
  Agenda,
  AgendaEntry,
  AgendaSchedule,
  Calendar,
} from "react-native-calendars";
import { ReservationListProps } from "react-native-calendars/src/agenda/reservation-list";
import AgendaListItem from "../components/AgendaLIstItem";
import { Entypo } from "@expo/vector-icons";

const styles = StyleSheet.create({
  view: {
    margin: 7,
    backgroundColor: "#FFF",
  },
});

const PlanningPage = () => {
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");
  // const updateSearch = (search: SetStateAction<string>) => {
  //   setSearch(search);
  // };
  const [open, setOpen] = useState(false);
  const items: AgendaSchedule = {
    "2023-10-01": [{ name: "123", height: 10, day: "Lundi" }],
    "2023-10-02": [{ name: "234", height: 10, day: "Lundi" }],
    "2023-10-03": [{ name: "345", height: 10, day: "Lundi" }],
    "2023-10-04": [{ name: "456", height: 10, day: "Lundi" }],
    // '2023-10-02': [{ name: 'Event 2' }, { name: 'Event 3' }],
  };

  return (
    <>
      <>
        <>
          <View style={styles.view}>
            <SearchBar
              placeholder="Type Here..."
              onChangeText={setSearch}
              value={search}
              inputStyle={{ color: "white" }}
            />
          </View>
        </>
        <View style={{ flex: 1 }}>
          <Agenda
            items={items}
            onDayPress={(day) => {
              setSelected(day.dateString);
            }}
            markedDates={{
              [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: "aqua",
              },
            }}
            renderList={(listItem: ReservationListProps) => {
              return (
                <AgendaListItem data={listItem.items} selectedDate={selected} />
              );
            }}
            // renderKnob={() => {
            //   return (
            //     <Entypo name="chevron-thin-down" size={24} color="black" />
            //   );
            // }}
            showClosingKnob={true}
            pastScrollRange={0}
            futureScrollRange={18}
          />
        </View>
      </>
      <SpeedDial
        isOpen={open}
        icon={{ name: "edit", color: "#fff" }}
        openIcon={{ name: "close", color: "#fff" }}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}
      >
        <SpeedDial.Action
          icon={{ name: "add", color: "#fff" }}
          title="Add"
          onPress={() => console.log("Add Something")}
        />
        <SpeedDial.Action
          icon={{ name: "delete", color: "#fff" }}
          title="Delete"
          onPress={() => console.log("Delete Something")}
        />
      </SpeedDial>
    </>
  );
};

export default PlanningPage;
