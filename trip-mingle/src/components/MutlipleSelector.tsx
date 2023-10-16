import { useState } from "react";
import { ScrollView, TouchableOpacity, View, Text } from "react-native";
import AddPostPageStyleSheet from "../StyleSheet/AddPostScreenCss";
import { CheckBox } from "@rneui/themed";
import { useIonNeverNotification } from "./IonNeverNotification/NotificationProvider";

const MultipleSelector = ({
  //@ts-ignore
  setSelectedAgesText,
  //@ts-ignore
  setSelectedAges,
  //@ts-ignore
  selectedAges,
  //@ts-ignore
  labels,
}) => {
  const { IonNeverDialog } = useIonNeverNotification();
  const [localSelectedAges, setLocalSelectedAges] =
    useState<string[]>(selectedAges);

  const toggleAgeSelection = (label: string) => {
    if (localSelectedAges.includes(label)) {
      setLocalSelectedAges(
        localSelectedAges.filter((age: string) => age !== label),
      );
    } else {
      setLocalSelectedAges([...localSelectedAges, label]);
    }
  };

  return (
    <>
      <ScrollView
        horizontal={false}
        style={AddPostPageStyleSheet.AgeScrollViewContainer}
      >
        {labels.map((label: any, index: number) => (
          <CheckBox
            key={index + 1}
            title={label}
            containerStyle={{
              backgroundColor: "transparent",
              borderWidth: 0,
              padding: 3,
            }}
            textStyle={{ fontWeight: "normal" }}
            iconType="material-community"
            checkedIcon="checkbox-marked-outline"
            uncheckedIcon="checkbox-blank-outline"
            checked={localSelectedAges.includes(label)}
            onPress={() => toggleAgeSelection(label)}
          />
        ))}
      </ScrollView>
      <View style={AddPostPageStyleSheet.ModalButtonContainer}>
        <TouchableOpacity
          onPress={() => {
            const selectedAgesString = localSelectedAges.join(", ");
            setSelectedAges(localSelectedAges);
            selectedAgesString
              ? setSelectedAgesText(selectedAgesString)
              : setSelectedAgesText("Preferred Age(s)");
            IonNeverDialog.dismiss();
          }}
        >
          <Text style={AddPostPageStyleSheet.ModalText}>OK</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default MultipleSelector;
