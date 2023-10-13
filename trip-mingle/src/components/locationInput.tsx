//Buffer Line

import { useState, useEffect, useRef } from "react";
import {
  TouchableOpacity,
  Keyboard,
  View,
  FlatList,
  Text,
  TextInput,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AddPostPageStyleSheet from "../StyleSheet/AddPostScreenCss";
import InputAutocomplete from "./InputAutocomplete";
import { useIonNeverNotification } from "./IonNeverNotification/NotificationProvider";

export default function LocationInput() {
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();

  const [selectedLocationText, setSelectedLocationText] = useState(
    "Destination Location"
  );
  const [selectedLocationList, setSelectedLocationList] = useState<
    UserLocation[]
  >([]);
  type UserLocation = {
    id: string;
    name: string;
  };
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
          dialogHeight: 300,
          component: () => {
            return (
              <InputAutocomplete
                setSelectedLocationText={setSelectedLocationText}
                setSelectedLocationList={setSelectedLocationList}
                selectedLocationList={selectedLocationList}
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
