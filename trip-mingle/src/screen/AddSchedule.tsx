import { useState, SetStateAction } from "react";
import { Input, SearchBar, SpeedDial } from "@rneui/themed";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Button,
  TouchableWithoutFeedback,
} from "react-native";
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
import { TextInput } from "react-native-gesture-handler";
import { MarkedDates } from "react-native-calendars/src/types";
import { DAY } from "@beenotung/tslib/time";
import { format_2_digit } from "@beenotung/tslib/format";
import { color } from "cast.ts";
import PlannigStyleSheet from "../StyleSheet/PlanningStyleSheet";
import day from "react-native-calendars/src/calendar/day";

const styles = StyleSheet.create({
  view: {
    margin: 20,
    backgroundColor: "#FFF",
    top: Constants.statusBarHeight,
    borderRadius: 8,
    selectedDayTextColor: "yellow",
    selectedDay: "red",
  },
});

function Space(props: { height: number }) {
  return (
    <View
      style={{
        height: props.height,
      }}
    ></View>
  );
}

const AddSchedule = () => {
  const [selectedDate, setSelectedDate] = useState<any>();
  const [open, setOpen] = useState(false);

  type ScheduleItem = {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
  };
  const scheduleItems: ScheduleItem[] = [
    {
      id: 1,
      date: "2023-10-10",
      startTime: "13:00",
      endTime: "15:00",
      location: "Place 1",
    },
    {
      id: 2,
      date: "2023-10-10",
      startTime: "15:30",
      endTime: "15:45",
      location: "Place 2",
    },
    {
      id: 3,
      date: "2023-10-11",
      startTime: "15:30",
      endTime: "15:45",
      location: "Place 3",
    },
    {
      id: 4,
      date: "2023-10-12",
      startTime: "13:00",
      endTime: "15:00",
      location: "Place 1",
    },
    {
      id: 5,
      date: "2023-10-12",
      startTime: "15:30",
      endTime: "15:45",
      location: "Place 2",
    },
    {
      id: 6,
      date: "2023-10-12",
      startTime: "16:00",
      endTime: "16:30",
      location: "Place 3",
    },
    {
      id: 7,
      date: "2023-10-12",
      startTime: "16:45",
      endTime: "16:55",
      location: "Place 4",
    },
    {
      id: 1,
      date: "2023-10-10",
      startTime: "13:00",
      endTime: "15:00",
      location: "Place 1",
    },
    {
      id: 2,
      date: "2023-10-10",
      startTime: "15:30",
      endTime: "15:45",
      location: "Place 2",
    },
    {
      id: 3,
      date: "2023-10-11",
      startTime: "15:30",
      endTime: "15:45",
      location: "Place 3",
    },
    {
      id: 4,
      date: "2023-10-12",
      startTime: "13:00",
      endTime: "15:00",
      location: "Place 1",
    },
    {
      id: 5,
      date: "2023-10-12",
      startTime: "15:30",
      endTime: "15:45",
      location: "Place 2",
    },
    {
      id: 6,
      date: "2023-10-12",
      startTime: "16:00",
      endTime: "16:30",
      location: "Place 3",
    },
    {
      id: 7,
      date: "2023-10-12",
      startTime: "16:45",
      endTime: "16:55",
      location: "Place 4",
    },
  ];

  const data: Record<string, ScheduleItem[]> = {};

  scheduleItems.forEach((item) => {
    let date = item.date;
    let items = data[date];
    if (items) {
      items.push(item);
    } else {
      data[date] = [item];
    }
  });

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const markedDates: MarkedDates = {
    [startDate]: { startingDay: true, color: "lightgreen" },
    [endDate]: { endingDay: true, color: "lightgreen" },
    [selectedDate]: {
      selected: true,
      disableTouchEvent: true,
      selectedColor: "blue",
    },
  };

  for (let date = startDate; date <= endDate; date = nextDate(date)) {
    markedDates[date] = {
      startingDay: date == startDate,
      endingDay: date == endDate,
      color: "lightgreen",
    };
  }

  return (
    <>
      {/* <View style={styles.view}>
        <Text>11</Text>
      </View> */}
      {/* <Space height={40} /> */}
      <View>
        <Space height={10}></Space>
        <Text>Starting Date</Text>
        <TextInput
          style={PlannigStyleSheet.inputContainer}
          value={startDate}
          onChangeText={setStartDate}
          onEndEditing={() => Keyboard.dismiss()}
          placeholder="Input your start travl date"
        ></TextInput>
        <Text>Ending Date</Text>
        <TextInput
          style={PlannigStyleSheet.inputContainer}
          value={endDate}
          onChangeText={setEndDate}
          onEndEditing={() => Keyboard.dismiss()}
          placeholder="Input your end travel date"
        ></TextInput>
      </View>
      <Space height={10}></Space>
      <View style={{ flex: 1 }}>
        <Agenda
          markingType="period"
          items={data}
          markedDates={markedDates}
          onDayPress={(day) => {
            console.log("press day:", day);
            setSelectedDate(day.dateString);
          }}
          selected={selectedDate}
          showClosingKnob={true}
          pastScrollRange={1}
          futureScrollRange={12}
          renderEmptyData={() => (
            <View>
              <Text>empty data</Text>
            </View>
          )}
          renderEmptyDate={(date) => (
            <View>
              <Text>empty date</Text>
            </View>
          )}
          // renderList={(listProps) => (
          //   <AgendaListItem
          //     data={listProps.items}
          //     selectedDate={selectedDate}
          //   ></AgendaListItem>
          // )}

          // renderItem={(reservation: AgendaEntry, isFirst: boolean) => (
          //     <AgendaListItem
          //       data={data}
          //       selectedDate={selectedDate}
          //     ></AgendaListItem>
          // )}

          renderItem={(reservation: AgendaEntry, isFirst: boolean) => {
            let scheduleItem: ScheduleItem = reservation as any;
            return (
              <View>
                <Card
                  style={{
                    margin: 8,
                    padding: 4,
                    // margin: "auto",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ textShadowColor: "#ff0000" }}>
                      {scheduleItem.date}
                    </Text>
                    <Text>
                      {scheduleItem.startTime} - {scheduleItem.endTime}
                    </Text>
                  </View>
                  <Space height={50} />
                  <Text>{scheduleItem.location}</Text>
                </Card>
              </View>
            );
          }}
        />
      </View>
      {/* <View style={{ flex: 1 }}>
          <Agenda
            markingType={"period"}
            markedDates={{
              "2023-10-11": { startingDay: true, color: "lightgreen" },
              "2023-10-12": { selected: true, color: "lightgreen" },
              "2023-10-13": { selected: true, color: "lightgreen" },
              "2023-10-14": {
                selected: true,
                endingDay: true,
                color: "lightgreen",
                textColor: "gray",
              },
            }}
            items={items}
            onDayPress={(day) => {
              setSelected(day.dateString);
            }}
            // markedDates={{
              [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: "#30C0FE",
              },
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
        </View> */}
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
          onPress={() => console.log("Added")}
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

function nextDate(dateStr: string): string {
  let date = new Date(dateStr);
  date.setTime(date.getTime() + DAY);
  let y = date.getFullYear();
  let m = format_2_digit(date.getMonth() + 1);
  let d = format_2_digit(date.getDate());
  return `${y}-${m}-${d}`;
}

export default AddSchedule;
