import { useEffect, useRef, useState } from "react";
import { Input, SpeedDial } from "@rneui/themed";
import { View, Text, StyleSheet, Keyboard } from "react-native";
import { Button, Card } from "react-native-paper";
import { Agenda, AgendaEntry } from "react-native-calendars";
import { TextInput } from "react-native-gesture-handler";
import { MarkedDates } from "react-native-calendars/src/types";
import { DAY } from "@beenotung/tslib/time";
import { format_2_digit } from "@beenotung/tslib/format";

import { useRoute } from "@react-navigation/native";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import { ScheduleItem, ScheduleItemInfo } from "../utils/types";
import { useToken } from "../hooks/useToken";
import { useAppNavigation, useAppRoute } from "../../navigators";
import { api } from "../apis/api";
import { boolean, object } from "cast.ts";
import PlanningStyleSheet from "../StyleSheet/PlanningStyleSheet";
import TextButton from "../components/TextButton";

function Space(props: { height: number }) {
  return (
    <View
      style={{
        height: props.height,
      }}
    ></View>
  );
}

const SampleSchedule = () => {
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const [selectedDate, setSelectedDate] = useState<any>("2023-10-27");
  const [open, setOpen] = useState(false);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const { token, payload, setToken } = useToken();

  const navigation = useAppNavigation();
  const routeState = navigation.getState();

  useEffect(() => {
    setScheduleItems([
      {
        id: 1,
        selectedDate: "2023-10-27",
        startTime: "13:00",
        endTime: "15:00",
        location: "Place 1",
        remark: "",
      },
      {
        id: 2,
        selectedDate: "2023-10-27",
        startTime: "15:30",
        endTime: "15:45",
        location: "Place 2",
        remark: "",
      },
      {
        id: 3,
        selectedDate: "2023-10-27",
        startTime: "15:30",
        endTime: "15:45",
        location: "Place 3",
        remark: "",
      },
      {
        id: 4,
        selectedDate: "2023-10-27",
        startTime: "13:00",
        endTime: "15:00",
        location: "Place 1",
        remark: "",
      },
      {
        id: 5,
        selectedDate: "2023-10-28",
        startTime: "15:30",
        endTime: "15:45",
        location: "Place 2",
        remark: "",
      },
      {
        id: 6,
        selectedDate: "2023-10-28",
        startTime: "16:00",
        endTime: "16:30",
        location: "Place 3",
        remark: "",
      },
      {
        id: 7,
        selectedDate: "2023-10-29",
        startTime: "16:45",
        endTime: "16:55",
        location: "Place 4",
        remark: "",
      },
      {
        id: 1,
        selectedDate: "2023-10-29",
        startTime: "13:00",
        endTime: "15:00",
        location: "Place 1",
        remark: "",
      },
      {
        id: 2,
        selectedDate: "2023-10-30",
        startTime: "15:30",
        endTime: "15:45",
        location: "Place 2",
        remark: "",
      },
      {
        id: 3,
        selectedDate: "2023-10-30",
        startTime: "15:30",
        endTime: "15:45",
        location: "Place 3",
        remark: "",
      },
      {
        id: 4,
        selectedDate: "2023-10-30",
        startTime: "13:00",
        endTime: "15:00",
        location: "Place 1",
        remark: "",
      },
      {
        id: 5,
        selectedDate: "2023-10-31",
        startTime: "15:30",
        endTime: "15:45",
        location: "Place 2",
        remark: "",
      },
      {
        id: 6,
        selectedDate: "2023-10-31",
        startTime: "16:00",
        endTime: "16:30",
        location: "Place 3",
        remark: "",
      },
      {
        id: 7,
        selectedDate: "2023-10-31",
        startTime: "16:45",
        endTime: "16:55",
        location: "Place 4",
        remark: "",
      },
      {
        id: 7,
        selectedDate: "2023-10-31",
        startTime: "16:45",
        endTime: "16:55",
        location: "Place 4",
        remark: "",
      },
      {
        id: 7,
        selectedDate: "2023-10-31",
        startTime: "16:45",
        endTime: "16:55",
        location: "Place 4",
        remark: "",
      },
    ]);
  }, []);

  const data: Record<string, ScheduleItem[]> = {};
  scheduleItems.forEach((item) => {
    let date = item.selectedDate;
    let items = data[date];
    if (items) {
      items.push(item);
    } else {
      data[date] = [item];
    }
  });

  const [startDate, setStartDate] = useState<string>("2023-10-27");
  const [endDate, setEndDate] = useState<string>("2023-10-31");

  // const function addNewMarkDate() {

  // }

  const markedDates: MarkedDates = {
    [startDate]: { startingDay: true, color: "lightgreen" },
    [endDate]: { endingDay: true, color: "lightgreen" },
    [selectedDate]: {
      selected: true,
      disableTouchEvent: true,
      color: "red",
    },
  };

  for (let date = startDate; date <= endDate; date = nextDate(date)) {
    markedDates[date] = {
      startingDay: date == startDate,
      endingDay: date == endDate,
      color: "lightgreen",
    };
  }

  const updateScheduleList = (scheduleInfo: ScheduleItemInfo) => {
    setScheduleItems((currentList) => {
      const newID = (currentList.pop()?.id || -1) + 1;
      return [...currentList, { ...scheduleInfo, id: newID }];
    });
    IonNeverDialog.dismiss();
  };

  return (
    <>
      <View>
        <Space height={10}></Space>
        <Text style={PlanningStyleSheet.inputTitle}>Starting Date</Text>
        <TextInput
          style={PlanningStyleSheet.dateInputContainer}
          value={startDate}
          onChangeText={setStartDate}
          onEndEditing={() => Keyboard.dismiss()}
          placeholder="Input your start travel date"
        ></TextInput>
        <Text style={PlanningStyleSheet.inputTitle}>Ending Date</Text>
        <TextInput
          style={PlanningStyleSheet.dateInputContainer}
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
            // console.log("press day:", day);
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
          renderItem={(reservation: AgendaEntry, isFirst: boolean) => {
            let scheduleItem: ScheduleItem = reservation as any;
            return (
              <View>
                <Card
                  style={{
                    margin: 8,
                    padding: 4,
                    borderRadius: 0,
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
                      {scheduleItem.selectedDate}
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

export default SampleSchedule;
