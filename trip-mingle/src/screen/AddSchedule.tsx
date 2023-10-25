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
import { array, boolean, color, id, object, optional, string } from "cast.ts";
import { useToken } from "../hooks/useToken";
import TextButton from "../components/TextButton";
import { AppParamList, useAppNavigation, useAppRoute } from "../../navigators";
import { textColor } from "../StyleSheet/StyleSheetHelper";

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

  useEffect(() => {
    getMarks();
    getEvent();
  }, []);

  useEffect(() => {
    console.log({ scheduleItems });
  }, [scheduleItems]);

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
      textColor: "black",
      color: "#1e90ff",
      dotColor: "blue",
    },
  };
  if (endDate && startDate) {
    for (
      let date = startDate.split("T")[0];
      date <= endDate;
      date = nextDate(date)
    ) {
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
      <View>
        <Space height={10}></Space>
        <Text>plan id: {planId}</Text>
        <Text>Starting Date</Text>
        <TextInput
          style={PlanningStyleSheet.inputContainer}
          value={
            startDate?.split("T")[0] ||
            new Date(Date.now()).toLocaleDateString()
          }
          onChangeText={setStartDate}
          onEndEditing={() => Keyboard.dismiss()}
          placeholder="Input your start travel date"
        ></TextInput>
        <Text>Ending Date</Text>
        <TextInput
          style={PlanningStyleSheet.inputContainer}
          value={
            endDate?.split("T")[0] || new Date(Date.now()).toLocaleDateString()
          }
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
                      {scheduleItem.selectedDate.split("T")[0]}
                    </Text>
                    <Text>
                      {scheduleItem.startTime.split("T")[1]?.slice(0, 5) ||
                        scheduleItem.startTime}{" "}
                      -{" "}
                      {scheduleItem.endTime.split("T")[1]?.slice(0, 5) ||
                        scheduleItem.endTime}
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
