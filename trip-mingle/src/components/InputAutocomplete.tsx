//Buffer Line

import { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import AddPostPageStyleSheet from "../StyleSheet/AddPostScreenCss";
import { useIonNeverNotification } from "./IonNeverNotification/NotificationProvider";

export default function InputAutocomplete({
  //@ts-ignore
  setSelectedLocationText,
  //@ts-ignore
  setSelectedLocationList,
  //@ts-ignore
  selectedLocationList,
  //@ts-ignore
  code,
}) {
  const GOOGLE_API_KEY = "AIzaSyDkl6HfJvmSSKDGWH0L0Y183PbBuY9fjdo";

  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const [selectedLocation, setSelectedLocation] = useState("");
  const localSelectedLocationList = selectedLocationList;

  type CountryProps = { id: number; name: string; onPress: () => void };

  const handleLocationClick = (index: number) => {
    selectedLocationList.splice(index, 1);
    const updatedSelectedLocationText = selectedLocationList
      .map((location: { name: any }) => location.name)
      .join(", ");
    if (updatedSelectedLocationText == "") {
      setSelectedLocationText("Destination Spots");
    } else {
      setSelectedLocationText(updatedSelectedLocationText);
    }
    setSelectedLocation("");
  };
  useEffect(() => {
    setSelectedLocationList([...selectedLocationList]);
  }, [selectedLocationList]);
  const Country = ({ id, name, onPress }: CountryProps) => (
    <TouchableOpacity onPress={onPress}>
      <Text>{`${id}. ${name}`}</Text>
    </TouchableOpacity>
  );
  const query = {
    key: GOOGLE_API_KEY,
    language: ["en", "zh-CN", "zh-TW", "ja"],
    types: [
      "establishment",
      "tourist_attraction",
      "landmark",
      "natural_feature",
      "point_of_interest",
    ],
  };
  if (code) {
    //@ts-ignore
    query.components = `country:${code}`;
  }

  return (
    <>
      <GooglePlacesAutocomplete
        styles={{ textInput: styles.search, listView: styles.list }}
        placeholder="Search..."
        fetchDetails
        onPress={(data, details) => {
          if (details) {
            const position = { id: details.place_id, name: details.name };
            selectedLocationList.push(position);
            const updatedSelectedLocationText = selectedLocationList
              .map((location: { name: any }) => location.name)
              .join(", ");
            setSelectedLocation(position.name);
            setSelectedLocationText(updatedSelectedLocationText);
          }
        }}
        query={query}
        onFail={(error) => console.log(error)}
      />
      <FlatList
        data={localSelectedLocationList}
        renderItem={({ item, index }) => (
          <Country
            name={item.name}
            id={index + 1}
            onPress={() => handleLocationClick(index)}
          />
        )}
      />
      <View style={AddPostPageStyleSheet.ModalButtonContainer}>
        <TouchableOpacity
          onPress={() => {
            IonNeverDialog.dismiss();
            setSelectedLocationList(localSelectedLocationList);
          }}
        >
          <Text style={AddPostPageStyleSheet.ModalText}>OK</Text>
        </TouchableOpacity>
        <Text>{code}</Text>
      </View>
    </>
  );
}
// Stylesheet
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
    height: "80%",
    width: "100%",
    borderRadius: 8,
  },
});
