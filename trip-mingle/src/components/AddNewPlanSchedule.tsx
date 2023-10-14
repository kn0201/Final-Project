import React, { useState } from "react";
import { Agenda, AgendaSchedule } from "react-native-calendars";
import { StyleSheet, View } from "react-native";
import Constants from "expo-constants";
import { ListItem, SpeedDial } from "@rneui/base";
import { ReservationListProps } from "react-native-calendars/src/agenda/reservation-list";
import AgendaListItem from "./AgendaLIstItem";

const styles = StyleSheet.create({
  view: {
    margin: 20,
    backgroundColor: "#FFF",
    top: Constants.statusBarHeight,
  },
});

const AddNewPlan = () => {
  const [selected, setSelected] = useState("");

  const [open, setOpen] = useState(false);

  const items: AgendaSchedule = {
    seleted: [
      {
        name: "sample name",
        height: 10,
        day: "",
        startingDay: true,
        endingDay: true,
        color: "green",
      },
    ],
  };

  return (
    <>
      <>
        <>
          <View style={styles.view}></View>
        </>
        <View style={{ flex: 1 }}>
          <Agenda
            markingType={"period"}
            markedDates={items}
            items={items}
            onDayPress={(day) => {
              setSelected(day.dateString);
            }}
            renderList={(listItem: ReservationListProps) => {
              return (
                <AgendaListItem data={listItem.items} selectedDate={selected} />
              );
            }}
            showClosingKnob={true}
            pastScrollRange={1}
            futureScrollRange={12}
          ></Agenda>
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

export default AddNewPlan;
