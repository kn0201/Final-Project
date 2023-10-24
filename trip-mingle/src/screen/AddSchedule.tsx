import { useEffect, useRef, useState } from "react";
import { Input, SpeedDial } from "@rneui/themed";
import { View, Text, StyleSheet, Keyboard } from "react-native";
import { Button, Card } from "react-native-paper";
import { Agenda, AgendaEntry } from "react-native-calendars";
import { TextInput } from "react-native-gesture-handler";
import { MarkedDates } from "react-native-calendars/src/types";
import { DAY } from "@beenotung/tslib/time";
import { format_2_digit } from "@beenotung/tslib/format";
import AgendaListItem from "../components/AgendaLIstItem";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import {
  ScheduleData,
  ScheduleDate,
  ScheduleItem,
  ScheduleItemInfo,
  ScheduleMark,
} from "../utils/types";
import PlanningStyleSheet from "../StyleSheet/PlanningStyleSheet";
import { api, api2 } from "../apis/api";
import { array, boolean, id, object, optional, string } from "cast.ts";
import { useToken } from "../hooks/useToken";
import TextButton from "../components/TextButton";
import { AppParamList, useAppNavigation, useAppRoute } from "../../navigators";

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
  const [scheduleItems, setScheduleItems] = useState<ScheduleData>({});
  const [scheduleMark, setScheduleMark] = useState<ScheduleMark>();
  const { token, payload, setToken } = useToken();
  const navigation = useAppNavigation();
  const routeState = navigation.getState();
  const params = useAppRoute<"AddSchedule">();
  const { planId } = params;
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
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
      let data = {
        start_date: startDate,
        end_date: endDate,
      };

      let res = await api.post(
        `/planning/${planId}/mark`,
        data,
        object({ result: boolean() }),
        token
      );
      if (res.result) {
        IonNeverDialog.show({
          type: "success",
          title: "Add a new mark",
          firstButtonVisible: true,
        });
      }
    } catch (error) {
      let message = String(error);
      IonNeverDialog.show({
        type: "warning",
        title: "Failed to add a mark",
        message,
        firstButtonVisible: true,
      });
    }
  }

  async function getMarks() {
    let result = await api.get(
      `/planning/${planId}/mark`,
      object({
        marks: optional(
          object({
            id: id(),
            startDate: string(),
            endDate: string(),
          })
        ),
      }),
      token
    );
    // setScheduleMark(result.marks as ScheduleMark);
    setStartDate(result?.marks?.startDate);
    setEndDate(result?.marks?.endDate);
  }

  async function getEvent() {
    let result = await api.get(
      `/planning/${planId}/event`,
      array(
        object({
          id: id(),
          selectedDate: string(),
          startTime: string(),
          endTime: string(),
          location: string(),
          remark: string(),
        })
      ),
      token
    );
    console.log("event result:", result);

    let dataObject: ScheduleData = {};
    result.map((event) => {
      const current = dataObject[event.selectedDate as string];
      if (current) {
        dataObject[event.selectedDate.split("T")[0] as string] = [
          ...current,
          event,
        ];
      } else {
        dataObject[event.selectedDate.split("T")[0] as string] = [event];
      }
    });

    setScheduleItems(dataObject);
  }
  // const data: Record<string, ScheduleItem[]> = {};

  // useEffect(() => console.log({ data }), [data]);
  useEffect(() => {
    getMarks();
    getEvent();

    // setScheduleItems([
    //   {
    //     id: 1,
    //     selectedDate: "2023-10-16",
    //     startTime: "13:00",
    //     endTime: "15:00",
    //     location: "Place 1",
    //     remark: "",
    //   },
    //   {
    //     id: 2,
    //     selectedDate: "2023-10-16",
    //     startTime: "15:30",
    //     endTime: "15:45",
    //     location: "Place 2",
    //     remark: "",
    //   },
    //   {
    //     id: 3,
    //     selectedDate: "2023-10-17",
    //     startTime: "15:30",
    //     endTime: "15:45",
    //     location: "Place 3",
    //     remark: "",
    //   },
    //   {
    //     id: 4,
    //     selectedDate: "2023-10-17",
    //     startTime: "13:00",
    //     endTime: "15:00",
    //     location: "Place 1",
    //     remark: "",
    //   },
    //   {
    //     id: 5,
    //     selectedDate: "2023-10-18",
    //     startTime: "15:30",
    //     endTime: "15:45",
    //     location: "Place 2",
    //     remark: "",
    //   },
    // ]);
  }, []);

  useEffect(() => {
    console.log({ scheduleItems });
    // scheduleItems.forEach((item) => {
    //   let date = item.selectedDate;
    //   let items = data[date];
    //   if (items) {
    //     items.push(item);
    //   } else {
    //     data[date] = [item];
    //   }
    // });
    // console.log({ data });
  }, [scheduleItems]);
  // const function addNewMarkDate() {

  // }

  const markedDates: MarkedDates = {
    [startDate || new Date(Date.now()).toLocaleDateString()]: {
      startingDay: true,
      color: "lightgreen",
    },
    [endDate || new Date(Date.now()).toLocaleDateString()]: {
      endingDay: true,
      color: "lightgreen",
    },
    [selectedDate]: {
      selected: true,
      disableTouchEvent: true,
      selectedColor: "blue",
    },
  };
  if (endDate && startDate) {
    for (
      let date = startDate.split("T")[0];
      date <= endDate;
      date = nextDate(date)
    ) {
      console.log(date);
      markedDates[date] = {
        startingDay: date == startDate,
        endingDay: date == endDate,
        color: "lightgreen",
      };
    }
  }
  const updateScheduleList = (scheduleInfo: ScheduleItemInfo) => {
    setScheduleItems((currentObject) => {
      const current = currentObject[scheduleInfo.selectedDate as string];
      if (current) {
        const newID = ([...current].pop()?.id || 0) + 1;
        currentObject[scheduleInfo.selectedDate.split("T")[0] as string] = [
          ...current,
          { ...scheduleInfo, id: newID },
        ];
      } else {
        currentObject[scheduleInfo.selectedDate.split("T")[0] as string] = [
          { ...scheduleInfo, id: 0 },
        ];
      }
      return currentObject;
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
          items={scheduleItems}
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
            console.log({ reservation });

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
            navigation.navigate("Add Agenda", {
              selectedDate,
              updateScheduleList,
              planId,
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
