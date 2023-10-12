import react, { useState } from "react";
import { View } from "react-native";
import { Agenda, AgendaSchedule } from "react-native-calendars";
import AgendaListItem from "../components/AgendaLIstItem";
import { ReservationListProps } from "react-native-calendars/src/agenda/reservation-list";
import { NewType } from "../utils/types";

const AddSchedule = () => {
  const [selected, setSelected] = useState("");
  const items: AgendaSchedule = {
    "2023-10-11": [
      { name: "Event", height: 10, day: "Lundi", id: 1 } as NewType,
    ],
    "2023-10-12": [
      { name: "Event", height: 10, day: "Lundi", id: 2 } as NewType,
    ],
    "2023-10-13": [
      { name: "Event", height: 10, day: "Lundi", id: 3 } as NewType,
    ],
    "2023-10-14": [
      { name: "Event", height: 10, day: "Lundi", id: 4 } as NewType,
    ],
  };
  return (
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
            selectedColor: "#30C0FE",
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
        pastScrollRange={1}
        futureScrollRange={12}
      />
    </View>
  );
};

export default AddSchedule;
