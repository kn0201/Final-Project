//Buffer Line
import { useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import AddPostPageStyleSheet from "../StyleSheet/AddPostScreenCss";
import { useIonNeverNotification } from "./IonNeverNotification/NotificationProvider";
import { flex } from "../StyleSheet/StyleSheetHelper";
import Entypo from "react-native-vector-icons/Entypo";

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

  const autocompleteRef = useRef(null);
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [listDivVisible, setListDivVisible] = useState<boolean>(true);
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
    setSelectedLocation([]);
  };

  const Country = ({ id, name, onPress }: CountryProps) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 5,
        }}
      >
        <Text>{`${id}. ${name}`}</Text>
        <TouchableOpacity onPress={onPress}>
          <Entypo name="cross" size={16} />
        </TouchableOpacity>
      </View>
    );
  };
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
      <TouchableWithoutFeedback
        onPress={() => {
          //@ts-ignore
          autocompleteRef.current?.clear();
          Keyboard.dismiss();
          setListDivVisible(!listDivVisible);
        }}
      >
        <View style={styles.container}>
          <GooglePlacesAutocomplete
            ref={autocompleteRef}
            styles={{
              textInput: styles.search,
              listView: styles.list,
            }}
            placeholder="Search..."
            fetchDetails
            onPress={(data, details) => {
              if (details) {
                const position = { id: details.place_id, name: details.name };
                if (
                  selectedLocationList.some(
                    (loc: { id: string; name: string }) =>
                      loc.id === position.id,
                  )
                ) {
                  IonNeverToast.show({
                    type: "warning",
                    title: "This location has \n been already in list!",
                    autoClose: 500,
                  });
                } else {
                  selectedLocationList.push(position);
                  const updatedSelectedLocationText = selectedLocationList
                    .map((location: { name: any }) => location.name)
                    .join(", ");
                  setSelectedLocation([...selectedLocation, position.name]);
                  setSelectedLocationText(updatedSelectedLocationText);
                }
              }
              //@ts-ignore
              autocompleteRef.current?.clear();
              setListDivVisible(!listDivVisible);
            }}
            textInputProps={{
              onPressIn: () => {
                setListDivVisible(!listDivVisible);
              },
            }}
            query={query}
            onFail={(error) => console.log(error)}
          />
        </View>
      </TouchableWithoutFeedback>
      {listDivVisible ? (
        <View style={styles.selectedLocationListDiv}>
          <FlatList
            data={localSelectedLocationList}
            renderItem={({ item, index }) => (
              <Country
                name={item.name}
                id={index + 1}
                onPress={() => {
                  handleLocationClick(index);
                }}
              />
            )}
          />
        </View>
      ) : null}
      <View style={AddPostPageStyleSheet.ModalButtonContainer}>
        <TouchableOpacity
          onPress={() => {
            IonNeverDialog.dismiss();
            setSelectedLocationList(localSelectedLocationList);
          }}
        >
          <Text style={AddPostPageStyleSheet.ModalText}>OK</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const { width } = Dimensions.get("screen");
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
