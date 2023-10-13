import { useState, SetStateAction } from "react";
import { Input, SearchBar, SpeedDial } from "@rneui/themed";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Avatar } from "react-native-paper";
import {
  Agenda,
  AgendaEntry,
  AgendaSchedule,
  Calendar,
} from "react-native-calendars";
import { ReservationListProps } from "react-native-calendars/src/agenda/reservation-list/index";
import AgendaListItem from "../components/AgendaLIstItem";
import { NewType } from "../utils/types";
import Constants from "expo-constants";

const styles = StyleSheet.create({
  view: {
    margin: 20,
    backgroundColor: "#FFF",
    top: Constants.statusBarHeight,
    borderRadius: 8,
  },
});

const AddSchedule = () => {
  const [selected, setSelected] = useState("");

  const [open, setOpen] = useState(false);

  const items: AgendaSchedule = {
    "2023-10-11": [
      {
        name: "Event",
        height: 10,
        day: "Lundi",
        id: 1,
        startingDay: true,
        color: "green",
      } as NewType,
    ],
    "2023-10-12": [
      { name: "Event", height: 10, day: "Lundi", id: 2 } as NewType,
    ],
    "2023-10-13": [
      { name: "Event", height: 10, day: "Lundi", id: 3 } as NewType,
    ],
    "2023-10-14": [
      {
        name: "Event",
        height: 10,
        day: "Lundi",
        id: 4,
        endingDay: true,
        color: "green",
      } as NewType,
    ],
  };

  //   const localtion = localtionInput;

  return (
    <>
      <>
        <>
          <View style={styles.view}></View>
        </>
        <View style={{ flex: 1 }}>
          <Agenda
            markingType={"period"}
            markedDates={{
              "2023-10-11": { startingDay: true, color: "lightblue" },
              "2023-10-12": { selected: true, color: "lightblue" },
              "2023-10-13": { selected: true, color: "lightblue" },
              "2023-10-14": {
                selected: true,
                endingDay: true,
                color: "lightblue",
                textColor: "gray",
              },
            }}
            items={items}
            onDayPress={(day) => {
              setSelected(day.dateString);
            }}
            // markedDates={{
            //   [selected]: {
            //     selected: true,
            //     disableTouchEvent: true,
            //     selectedColor: "#30C0FE",
            //   },
            // }}
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
            pastScrollRange={1}
            futureScrollRange={12}
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

export default AddSchedule;
