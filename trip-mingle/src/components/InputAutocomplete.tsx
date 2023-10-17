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
import Entypo from "react-native-vector-icons/Entypo";
import query from "../utils/googleAPIQuery";

export default function InputAutocomplete({
  //@ts-ignore
  setSelectedLocationText,
  //@ts-ignore
  setSelectedLocationList,
  //@ts-ignore
  selectedLocationText,
  //@ts-ignore
  selectedLocationList,
  //@ts-ignore
  code,
  //@ts-ignore
  updateInputText,
}) {
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
      setSelectedLocationText("Destination Spot(s)");
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
                const position = {
                  id: details.place_id,
                  name: details.name,
                  // country:
                  //   details.address_components.find((component) =>
                  //     component.types.includes("country"),
                  //   )?.long_name || null,
                  // county:
                  //   details.address_components.find((component) =>
                  //     component.types.includes("administrative_area_level_1"),
                  //   )?.long_name || null,
                  // city:
                  //   details.address_components.find((component) =>
                  //     component.types.includes("locality"),
                  //   )?.long_name || null,
                  address: details.formatted_address,
                  // website: details.website || null,
                  // opening_hours: details.opening_hours?.weekday_text || null,
                  coordinates: {
                    lat: details.geometry.location.lat,
                    lng: details.geometry.location.lng,
                  },
                  // type: details.types,
                  // photo: details.photos
                  //   ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${details.photos[1].photo_reference}&key=${query.key}`
                  //   : null,
                };
                if (
                  selectedLocationList.some(
                    (loc: {
                      id: string;
                      name: string;
                      // overview: string | null;
                      // country: string | null;
                      // county: string | null;
                      // city: string | null;
                      address: string;
                      // website: string | null;
                      // opening_hours: string[] | null;
                      coordinates: {
                        lat: string;
                        lng: string;
                      };
                      // types: string[];
                      // photo: string | null;
                    }) => loc.id === position.id,
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
            if (localSelectedLocationList.length > 0) {
              updateInputText("trip_location", localSelectedLocationList);
            }
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
