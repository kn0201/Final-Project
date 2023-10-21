import { useEffect, useRef, useState } from "react";
import { Input, SpeedDial } from "@rneui/themed";
import { View, Text, StyleSheet, Keyboard } from "react-native";
import { Button, Card } from "react-native-paper";
import { Agenda, AgendaEntry } from "react-native-calendars";
import Constants from "expo-constants";
import { TextInput } from "react-native-gesture-handler";
import { MarkedDates } from "react-native-calendars/src/types";
import { DAY } from "@beenotung/tslib/time";
import { format_2_digit } from "@beenotung/tslib/format";
import AgendaListItem from "../components/AgendaLIstItem";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import { ScheduleDate, ScheduleItem, ScheduleItemInfo } from "../utils/types";
import PlanningStyleSheet from "../StyleSheet/PlanningStyleSheet";
import { api, api2 } from "../apis/api";
import { object } from "cast.ts";
import { useToken } from "../hooks/useToken";
import TextButton from "../components/TextButton";
import { AppParamList, useAppNavigation, useAppRoute } from "../../navigators";
import {
  RouteProp,
  useNavigationState,
  useRoute,
} from "@react-navigation/native";
import { apiOrigin } from "../utils/apiOrigin";

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
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const [selectedDate, setSelectedDate] = useState<any>();
  const [open, setOpen] = useState(false);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const { token, payload, setToken } = useToken();

  const navigation = useAppNavigation();
  const routeState = navigation.getState();
  // console.log("route state:", routeState);

  const planId = useAppRoute<"AddSchedule">().planId;

  async function addMarkDate() {
    if (!startDate) {
      IonNeverToast.show({
        type: "warning",
        title: "Please input start date",
      });
      if (!endDate)
        IonNeverToast.show({
          type: "warning",
          title: "Please input end date",
        });
      return;
    }
    try {
      let formData = new FormData();
      formData.append("start_date", startDate);
      formData.append("end_date", endDate);

      let data = {
        start_date: startDate,
        end_date: endDate,
      };

      let res = await api.post(
        `/planning/${planId}/mark`,
        data,
        object({}),
        token
      );

      console.log("add mark:", res);
      IonNeverDialog.show({
        type: "success",
        title: "Add a new mark",
        firstButtonVisible: true,
      });
    } catch (error) {
      let message = String(error);
      IonNeverDialog.show({
        type: "warning",
        title: "Failed to add a new mark",
        message,
        firstButtonVisible: true,
      });
    }
  }
  useEffect(() => {
    setScheduleItems([
      {
        id: 1,
        selectedDate: "2023-10-16",
        startTime: "13:00",
        endTime: "15:00",
        location: "Place 1",
      },
      {
        id: 2,
        selectedDate: "2023-10-16",
        startTime: "15:30",
        endTime: "15:45",
        location: "Place 2",
      },
      {
        id: 3,
        selectedDate: "2023-10-17",
        startTime: "15:30",
        endTime: "15:45",
        location: "Place 3",
      },
      {
        id: 4,
        selectedDate: "2023-10-17",
        startTime: "13:00",
        endTime: "15:00",
        location: "Place 1",
      },
      {
        id: 5,
        selectedDate: "2023-10-18",
        startTime: "15:30",
        endTime: "15:45",
        location: "Place 2",
      },
      {
        id: 6,
        selectedDate: "2023-10-18",
        startTime: "16:00",
        endTime: "16:30",
        location: "Place 3",
      },
      {
        id: 7,
        selectedDate: "2023-10-19",
        startTime: "16:45",
        endTime: "16:55",
        location: "Place 4",
      },
      {
        id: 1,
        selectedDate: "2023-10-19",
        startTime: "13:00",
        endTime: "15:00",
        location: "Place 1",
      },
      {
        id: 2,
        selectedDate: "2023-10-20",
        startTime: "15:30",
        endTime: "15:45",
        location: "Place 2",
      },
      {
        id: 3,
        selectedDate: "2023-10-20",
        startTime: "15:30",
        endTime: "15:45",
        location: "Place 3",
      },
      {
        id: 4,
        selectedDate: "2023-10-20",
        startTime: "13:00",
        endTime: "15:00",
        location: "Place 1",
      },
      {
        id: 5,
        selectedDate: "2023-10-21",
        startTime: "15:30",
        endTime: "15:45",
        location: "Place 2",
      },
      {
        id: 6,
        selectedDate: "2023-10-21",
        startTime: "16:00",
        endTime: "16:30",
        location: "Place 3",
      },
      {
        id: 7,
        selectedDate: "2023-10-21",
        startTime: "16:45",
        endTime: "16:55",
        location: "Place 4",
      },
      {
        id: 7,
        selectedDate: "2023-10-21",
        startTime: "16:45",
        endTime: "16:55",
        location: "Place 4",
      },
      {
        id: 7,
        selectedDate: "2023-10-21",
        startTime: "16:45",
        endTime: "16:55",
        location: "Place 4",
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

  const [startDate, setStartDate] = useState<string>("2023-10-16");
  const [endDate, setEndDate] = useState<string>("2023-10-27");

  // const function addNewMarkDate() {

  // }

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

  const updateScheduleList = (scheduleInfo: ScheduleItemInfo) => {
    setScheduleItems((currentList) => {
      const newID = (currentList.pop()?.id || -1) + 1;
      return [...currentList, { ...scheduleInfo, id: newID }];
    });
    IonNeverDialog.dismiss();
  };

  return (
    <>
      {/* <View style={styles.view}>
        <Text>11</Text>
      </View> */}
      {/* <Space height={40} /> */}
      <View>
        <Space height={10}></Space>
        <Text>plan id: {planId}</Text>
        <Text>Starting Date</Text>
        <TextInput
          style={PlanningStyleSheet.inputContainer}
          value={startDate}
          onChangeText={setStartDate}
          onEndEditing={() => Keyboard.dismiss()}
          placeholder="Input your start travel date"
        ></TextInput>
        <Text>Ending Date</Text>
        <TextInput
          style={PlanningStyleSheet.inputContainer}
          value={endDate}
          onChangeText={setEndDate}
          onEndEditing={() => Keyboard.dismiss()}
          placeholder="Input your end travel date"
        ></TextInput>
        <TextButton text="Add New Mark" onPress={addMarkDate}></TextButton>
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
          onPress={() => {
            IonNeverDialog.show({
              dialogHeight: 600,
              component: () => {
                return (
                  <AgendaListItem
                    selectedDate={selectedDate as string}
                    updateScheduleList={updateScheduleList}
                  />
                );
              },
            });
          }}
        />
        <SpeedDial.Action
          icon={{ name: "delete", color: "#fff" }}
          title="Delete"
          onPress={() => {
            console.log("delete");
          }}
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
