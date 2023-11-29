import { useEffect, useState } from "react";
import { SpeedDial } from "@rneui/themed";
import { View, Text, Keyboard } from "react-native";
import { Card } from "react-native-paper";
import { Agenda, AgendaEntry } from "react-native-calendars";
import { TextInput } from "react-native-gesture-handler";
import { MarkedDates } from "react-native-calendars/src/types";
import { DAY } from "@beenotung/tslib/time";
import { format_2_digit } from "@beenotung/tslib/format";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import {
  ScheduleData,
  ScheduleItem,
  ScheduleItemInfo,
  ScheduleMark,
} from "../utils/types";
import PlanningStyleSheet from "../StyleSheet/PlanningStyleSheet";
import { api } from "../apis/api";
import { array, boolean, id, object, optional, string } from "cast.ts";
import { useToken } from "../hooks/useToken";
import TextButton from "../components/TextButton";
import { useAppNavigation, useAppRoute } from "../../navigators";
import { center, flex } from "../StyleSheet/StyleSheetHelper";

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
  const params = useAppRoute<"AddSchedule">() as { planId: number } | undefined;
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();

  function addEightHours(date: Date) {
    return new Date(date.getTime() + 8 * 3600000);
  }

  const getDefaultSelectedDate = () => {
    if (scheduleItems) {
      const firstEventDate = Object.keys(scheduleItems).find(
        (date) => scheduleItems[date]?.length > 0
      );
      if (firstEventDate) {
        return firstEventDate;
      }
    }
    return new Date().toISOString().split("T")[0];
  };

  useEffect(() => {
    setSelectedDate(getDefaultSelectedDate());
  }, [scheduleItems]);

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
      if (params) {
        const { planId } = params;
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
    if (params) {
      const { planId } = params;
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

      // console.log(result?.marks?.startDate);

      if (result.marks && result.marks.startDate)
        setStartDate(
          addEightHours(new Date(result.marks.startDate)).toISOString()
        );
      if (result.marks && result.marks.endDate)
        setEndDate(addEightHours(new Date(result.marks.endDate)).toISOString());
    }
  }

  async function getEvent() {
    if (params) {
      const { planId } = params;
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

      let dataObject: ScheduleData = {};
      result.map((event) => {
        const newStartTime = addEightHours(
          new Date(event.startTime)
        ).toISOString();
        const newEndTime = addEightHours(new Date(event.endTime)).toISOString();
        const newSelectedDate = addEightHours(new Date(event.selectedDate))
          .toISOString()
          .split("T")[0];

        const newEvent = {
          ...event,
          startTime: newStartTime,
          endTime: newEndTime,
          selectedDate: newSelectedDate,
        };

        const current = dataObject[newSelectedDate as string];
        if (current) {
          dataObject[newSelectedDate.split("T")[0] as string] = [
            ...current,
            newEvent,
          ];
        } else {
          dataObject[newSelectedDate.split("T")[0] as string] = [newEvent];
        }
      });

      setScheduleItems(dataObject);
    }
  }

  useEffect(() => {
    getMarks();
    getEvent();
  }, []);

  const markedDates: MarkedDates = {
    [startDate || new Date(Date.now()).toISOString()]: {
      startingDay: true,
      color: "lightgreen",
    },
    [endDate || new Date(Date.now()).toISOString()]: {
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

        <Text style={PlanningStyleSheet.inputTitle}>Starting Date</Text>
        <TextInput
          style={PlanningStyleSheet.dateInputContainer}
          value={
            startDate?.split("T")[0] ||
            new Date(Date.now()).toISOString().split("T")[0]
          }
          onChangeText={setStartDate}
          keyboardType="numeric"
          onEndEditing={() => Keyboard.dismiss()}
          placeholder="Input your start travel date"
        ></TextInput>
        <Text style={PlanningStyleSheet.inputTitle}>Ending Date</Text>
        <TextInput
          style={PlanningStyleSheet.dateInputContainer}
          value={
            endDate?.split("T")[0] ||
            new Date(Date.now()).toISOString().split("T")[0]
          }
          onChangeText={setEndDate}
          keyboardType="numeric"
          onEndEditing={() => Keyboard.dismiss()}
          placeholder="Input your end travel date"
        ></TextInput>
        <TextButton
          text="Add New Mark"
          onPress={() => {
            addMarkDate();
            Keyboard.dismiss();
          }}
        ></TextButton>
      </View>
      <Space height={10}></Space>
      <View style={{ flex: 1 }}>
        <Agenda
          markingType="period"
          items={scheduleItems}
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
            <View
              style={{
                height: "100%",
                display: flex,
                justifyContent: center,
                alignItems: center,
              }}
            >
              <Text>No Daily Event</Text>
            </View>
          )}
          renderEmptyDate={(date) => (
            <View
              style={{
                height: "100%",
                display: flex,
                justifyContent: center,
                alignItems: center,
              }}
            >
              <Text>No Daily Event Now</Text>
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
            if (params) {
              const { planId } = params;
              navigation.navigate("Add Agenda", {
                selectedDate,
                updateScheduleList,
                planId,
              });
            }
          }}
        />
        <SpeedDial.Action
          icon={{ name: "delete", color: "#fff" }}
          title="Delete"
          onPress={() => {
            // console.log("delete");
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

function calcCanPress(text: string): string {
  if (text.length == 0) {
    return "2";
  }
  if (text.length == 1) {
    return "0";
  }
  if (text.length == 2) {
    return "2" && "3";
  }
  if (text.length == 5) {
    return "0" && "1";
  }
  if (text.length == 6) {
    if (text[5] == "1") {
      return "0" && "2";
    }
    if (text[5] == "0") {
      return "1";
    }
  }
  if (text.length == 8) {
    return "0" && "3";
  }
  if (text.length == 9) {
    if (text[8] == "3") {
      return "0" && "1";
    }
    if (text[8] == "0") {
      return "1";
    }
  }
  if (text.length == 10) {
    return text.slice(0, 1);
  }
  return text.slice(0, 10);
}

export default AddSchedule;
