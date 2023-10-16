import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import AddPostPageStyleSheet from "../StyleSheet/AddPostScreenCss";
import { useIonNeverNotification } from "./IonNeverNotification/NotificationProvider";

const PeriodPicker = ({
  //@ts-ignore
  setSelectedPeriod,
  //@ts-ignore
  setPeriod,
}) => {
  const { IonNeverDialog } = useIonNeverNotification();
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const onDateChange = (date: any, type: any) => {
    if (type === "END_DATE") {
      setSelectedEndDate(date);
    } else {
      setSelectedEndDate(null);
      setSelectedStartDate(date);
    }
  };

  const formatDate = (date: any) => {
    return date ? date.toISOString().substring(0, 10) : "";
  };

  const getFormattedPeriod = (start: any, end: any) => {
    if (start && end) {
      const formattedStart = start.toISOString().substring(0, 10);
      const formattedEnd = end.toISOString().substring(0, 10);
      return `${formattedStart} to ${formattedEnd}`;
    }
    return "";
  };

  const getSelectedDays = (start: any, end: any) => {
    const selectedDays = [];
    if (start && end) {
      const currentDate = new Date(start);
      while (currentDate <= new Date(end)) {
        selectedDays.push(currentDate.toISOString().substring(0, 10));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    return selectedDays;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <CalendarPicker
          startFromMonday={false}
          allowRangeSelection={true}
          allowBackwardRangeSelect={true}
          minDate={new Date(Date.now())}
          weekdays={["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]}
          months={[
            "January",
            "Febraury",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ]}
          previousTitleStyle={{}}
          previousTitle="          Previous"
          nextTitleStyle={{}}
          nextTitle="Next          "
          todayBackgroundColor="#fff"
          selectedDayColor="#c4ffdb"
          selectedDayTextColor="#000000"
          scaleFactor={450}
          onDateChange={onDateChange}
        />
        <Text style={styles.textStyle}>
          Selected Start Date : {formatDate(selectedStartDate)}
        </Text>
        <Text style={styles.textStyle}>
          Selected End Date : {formatDate(selectedEndDate)}
        </Text>
      </View>
      <View style={AddPostPageStyleSheet.ModalButtonContainer}>
        <TouchableOpacity
          onPress={() => {
            if (selectedStartDate && selectedEndDate) {
              const formattedPeriod = getFormattedPeriod(
                selectedStartDate,
                selectedEndDate,
              );
              setSelectedPeriod(formattedPeriod);
            } else if (selectedStartDate && !selectedEndDate) {
              const selectedDay = selectedStartDate
                //@ts-ignore
                .toISOString()
                .substring(0, 10);
              setSelectedPeriod(selectedDay);
            } else {
              setSelectedPeriod("Expected Period");
            }
            const selectedDays = getSelectedDays(
              selectedStartDate,
              selectedEndDate,
            );
            setPeriod(selectedDays);
            IonNeverDialog.dismiss();
          }}
        >
          <Text style={AddPostPageStyleSheet.ModalText}>OK</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default PeriodPicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  textStyle: {
    marginTop: 10,
  },
});
