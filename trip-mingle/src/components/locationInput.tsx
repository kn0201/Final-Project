//Buffer Line
import { useState, useRef } from "react";
import { TouchableOpacity, Keyboard, Text, TextInput } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AddPostPageStyleSheet from "../StyleSheet/AddPostScreenCss";
import InputAutocomplete from "./InputAutocomplete";
import { useIonNeverNotification } from "./IonNeverNotification/NotificationProvider";
import { UserLocation } from "../utils/types";

//@ts-ignore
export default function LocationInput({ code, updateInputText }) {
  const { IonNeverDialog } = useIonNeverNotification();

  const [selectedLocationText, setSelectedLocationText] =
    useState("Trip Spot(s)");
  const [selectedLocationList, setSelectedLocationList] = useState<
    UserLocation[]
  >([]);

  const inputRef = useRef<TextInput | null>(null);
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  return (
    <TouchableOpacity
      style={AddPostPageStyleSheet.postCountryContainer}
      onPress={() => {
        {
          focusInput;
        }
        Keyboard.dismiss();

        IonNeverDialog.show({
          dialogHeight: 550,
          component: () => {
            return (
              <InputAutocomplete
                setSelectedLocationText={setSelectedLocationText}
                setSelectedLocationList={setSelectedLocationList}
                selectedLocationText={selectedLocationText}
                selectedLocationList={selectedLocationList}
                updateInputText={updateInputText}
                code={code}
              />
            );
          },
        });
      }}
    >
      <Text ref={inputRef}>{selectedLocationText}</Text>
      <MaterialIcons name="edit" size={16} />
    </TouchableOpacity>
  );
}
