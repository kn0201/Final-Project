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

//@ts-ignore
export default function LocationInput({ code }) {
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();

  const [selectedLocationText, setSelectedLocationText] =
    useState("Destination Spots");
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
          dialogHeight: 550,
          component: () => {
            return (
              <InputAutocomplete
                setSelectedLocationText={setSelectedLocationText}
                setSelectedLocationList={setSelectedLocationList}
                selectedLocationList={selectedLocationList}
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
