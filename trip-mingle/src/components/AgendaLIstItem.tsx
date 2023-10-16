// Buffer Line
import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ListRenderItemInfo,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Avatar, Card, TextInput } from "react-native-paper";
import reservation from "react-native-calendars/src/agenda/reservation-list/reservation";
import PlannigStyleSheet from "../StyleSheet/PlanningStyleSheet";
import LocationInput from "./locationInput";
import AddPostPageStyleSheet from "../StyleSheet/AddPostScreenCss";
import { useIonNeverNotification } from "./IonNeverNotification/NotificationProvider";
import { Agenda } from "react-native-calendars";
import { ScheduleItemInfo, UserLocation } from "../utils/types";
import InputAutocomplete from "./InputAutocomplete";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import query from "../utils/googleAPIQuery";

function Space(props: { height: number }) {
  return (
    <View
      style={{
        height: props.height,
      }}
    ></View>
  );
}
export default function AgendaListItem(props: {
  selectedDate: string;
  updateScheduleList: (scheduleInfo: ScheduleItemInfo) => void;
}) {
  const { selectedDate, updateScheduleList } = props;
  const { IonNeverToast } = useIonNeverNotification();

  const [scheduleInfo, setScheduleInfo] = useState<ScheduleItemInfo>({
    date: selectedDate,
    startTime: "",
    endTime: "",
    location: "",
  });

  const clearInputRef = useRef({ clearInput() {} }).current;

  const updateScheduleInfo = (field: string, newInfo: string) => {
    setScheduleInfo((info) => {
      return { ...info, [field]: newInfo };
    });
  };

  useEffect(() => console.log(scheduleInfo), [scheduleInfo]);

  return (
    <View>
      <TouchableOpacity>
        <Text style={[PlannigStyleSheet.inputTitle, { marginTop: 6 }]}>
          Staring Time
        </Text>
        <TextInput
          style={PlannigStyleSheet.inputContainer}
          onChangeText={(text) => updateScheduleInfo("startTime", text)}
          keyboardType="numeric"
          onEndEditing={() => Keyboard.dismiss()}
          placeholder="Input Start time"
          placeholderTextColor="gray"
        ></TextInput>
        <Text style={PlannigStyleSheet.inputTitle}>End Time</Text>
        <TextInput
          style={PlannigStyleSheet.inputContainer}
          onChangeText={(text) => updateScheduleInfo("endTime", text)}
          keyboardType="numeric"
          onEndEditing={() => Keyboard.dismiss()}
          placeholder="Input End time"
          placeholderTextColor="gray"
        ></TextInput>
        <Text style={PlannigStyleSheet.inputTitle}>Location</Text>
        {/* <Space height={50} /> */}
        <View style={{ height: 250 }}>
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
              }
              clearInputRef.clearInput();
            }}
            query={query}
            onFail={(error) => console.log(error)}
          />
        </View>
        <TouchableOpacity
          style={PlannigStyleSheet.buttonStyle}
          onPress={() => {
            if (!scheduleInfo.location) {
              IonNeverToast.show({
                type: "warning",
                title: "Please Input Location",
              });
              return;
            }
            // addNewEvent(scheduleItem);
            Keyboard.dismiss();
            updateScheduleList(scheduleInfo);
          }}
        >
          <Text style={PlannigStyleSheet.loginText}>Add New Event</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}
//   const [eventList, setEventList] = useState<AgendaEventListItem[]>([]);

//   const renderItem = (listItem: ListRenderItemInfo<AgendaEventListItem>) => {
//     const index = listItem.index;
//     const { date, name, day } = listItem.item;

//     return (
//       <TouchableOpacity style={{ marginRight: 10, marginTop: 17 }}>
//         <Card>
//           <Card.Content>
//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <Text>{date}</Text>
//               <Text>{name}</Text>
//               <Avatar.Text label={day} />
//             </View>
//           </Card.Content>
//         </Card>
//       </TouchableOpacity>
//     );
//   };

//   useEffect(() => {
//     const eventItems: AgendaEventListItem[] = [];
//     if (!props.data) return;

//     const dateEventObject = props.data;
//     for (const date in dateEventObject) {
//       if (props.selectedDate && props.selectedDate !== date) {
//         continue;
//       }

//       (dateEventObject[date as keyof AgendaSchedule] as NewType[]).map((info) =>
//         eventItems.push({ ...info, date } as AgendaEventListItem)
//       );
//     }

//     setEventList(eventItems);
//   }, [props.data, props.selectedDate]);

//   return <FlatList data={eventList} renderItem={renderItem}></FlatList>;

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
