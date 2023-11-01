// Buffer Line
import { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { useIonNeverNotification } from "./IonNeverNotification/NotificationProvider";
import { ScheduleItemInfo } from "../utils/types";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import query from "../utils/googleAPIQuery";
import PlanningStyleSheet from "../StyleSheet/PlanningStyleSheet";
import { api } from "../apis/api";
import { boolean, object } from "cast.ts";
import { useToken } from "../hooks/useToken";
import { useAppNavigation, useAppRoute } from "../../navigators";
import TextButton from "./TextButton";
import { center, flex } from "../StyleSheet/StyleSheetHelper";

export default function AgendaListItem() {
  const { selectedDate, updateScheduleList, planId } =
    useAppRoute<"Add Agenda">();
  const navigation = useAppNavigation();
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const { token } = useToken();

  const [scheduleInfo, setScheduleInfo] = useState<ScheduleItemInfo>({
    selectedDate: selectedDate,
    startTime: "",
    endTime: "",
    location: "",
    remark: "",
  });

  const clearInputRef = useRef({ clearInput() {} }).current;

  const updateScheduleInfo = (field: string, newInfo: string) => {
    setScheduleInfo((info) => {
      return { ...info, [field]: newInfo };
    });
  };

  async function addNewEvent() {
    if (!selectedDate) {
      IonNeverToast.show({
        type: "warning",
        title: "Please select a day",
      });
      return;
    }
    try {
      console.log("HERE");
      let data = {
        selectedDate: new Date(selectedDate + " 00:00").toISOString(),
        startTime: new Date(
          selectedDate + " " + scheduleInfo.startTime
        ).toISOString(),
        endTime: new Date(
          selectedDate + " " + scheduleInfo.endTime
        ).toISOString(),
        location: scheduleInfo.location,
      };
      console.log({ data });

      let res = await api.post(
        `/planning/${planId}/event`,
        data,
        object({ result: boolean() }),
        token
      );
      if (res.result) {
        updateScheduleList(scheduleInfo);

        IonNeverDialog.show({
          type: "success",
          title: "Add a new event",
          firstButtonVisible: true,
        });
        navigation.navigate("AddSchedule");
      }
    } catch (error) {
      let message = String(error);
      IonNeverDialog.show({
        type: "warning",
        title: "Failed to add event",
        message,
        firstButtonVisible: true,
      });
    }
  }

  return (
    <View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <Text style={[PlanningStyleSheet.inputTitle, { marginTop: 6 }]}>
            Staring Time
          </Text>
          <View
            style={{
              display: flex,
              justifyContent: center,
              alignItems: center,
            }}
          >
            <View style={PlanningStyleSheet.inputOuterContainer}>
              <TextInput
                style={PlanningStyleSheet.inputContainer}
                value={scheduleInfo.startTime}
                onChangeText={(text) =>
                  updateScheduleInfo("startTime", checkTime(text))
                }
                keyboardType="numeric"
                placeholder="Input Start time (e.g. 13:44)"
              />
            </View>
          </View>
          <Text style={PlanningStyleSheet.inputTitle}>End Time</Text>
          <View
            style={{
              display: flex,
              justifyContent: center,
              alignItems: center,
            }}
          >
            <View style={PlanningStyleSheet.inputOuterContainer}>
              <TextInput
                style={PlanningStyleSheet.inputContainer}
                value={scheduleInfo.endTime}
                onChangeText={(text) =>
                  updateScheduleInfo("endTime", checkTime(text))
                }
                keyboardType="numeric"
                placeholder="Input End time (e.g. 15:55)"
              ></TextInput>
            </View>
          </View>
          <Text style={PlanningStyleSheet.inputTitle}>Location</Text>
          <View
            style={{
              height: 250,
              width: "100%",
              display: flex,
              justifyContent: center,
            }}
          >
            <GooglePlacesAutocomplete
              ref={(elem) => {
                clearInputRef.clearInput = () => elem?.clear();
              }}
              styles={{
                textInput: styles.search,
                listView: styles.list,
              }}
              placeholder="Search..."
              fetchDetails
              onPress={(_data, details) => {
                if (details) {
                  updateScheduleInfo("location", details.formatted_address);
                } else {
                  clearInputRef.clearInput();
                }
              }}
              query={query}
              onFail={(error) => console.log(error)}
            />
          </View>

          <TextButton
            text="Add New Event"
            onPress={() => {
              if (!scheduleInfo.location) {
                IonNeverToast.show({
                  type: "warning",
                  title: "Please Input Location",
                });
                return;
              } else {
                addNewEvent();
              }
              Keyboard.dismiss();
            }}
          ></TextButton>
        </>
      </TouchableWithoutFeedback>
    </View>
  );
}

const { width } = Dimensions.get("screen");
const styles = StyleSheet.create({
  search: {
    height: 40,
    width: "90%",
    margin: 8,
    borderWidth: 1,
    borderRadius: 10,
  },
  list: {
    zIndex: 999,
    height: "100%",
    width: "100%",
    borderRadius: 8,
  },
  container: { flex: 1 },
  selectedLocationListDiv: {
    position: "absolute",
    top: 550 * 0.12,
    left: ((1 - 0.9) / 2) * (0.9 * width),
    width: 0.9 * 0.9 * width,
    height: 550 * 0.75,
  },
});

function checkTime(text: string): string {
  console.log("checkTime:", text);
  if (text.length == 1) {
    return "0" <= text && text <= "2" ? text : "";
  }
  if (text.length == 2) {
    return "00" <= text && text <= "23" ? text : text.slice(0, 1);
  }
  if (text.length === 3 && text.endsWith(":")) {
    return text.slice(0, 2);
  }
  if (text.length == 3) {
    let h = text.slice(0, 2);
    let m = text.slice(2);
    text = h + ":" + m;
  }
  if (text.length === 4) {
    let h = text.slice(0, 2);
    let m = text.slice(3);
    return "0" <= m && m <= "5" ? h + ":" + m : h;
  }
  if (text.length === 5) {
    let h = text.slice(0, 2);
    let m = text.slice(3);
    return "00" <= m && m <= "59" ? h + ":" + m : h + ":" + m.slice(0, 1);
  }
  return text.slice(0, 5);
}
