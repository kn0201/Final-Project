import { CheckBox, SearchBar } from "@rneui/themed";
import { useEffect, useRef, useState } from "react";
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
import { RegisInfo } from "../utils/types";
import { countriesList } from "../source/countries";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import AddPostPageStyleSheet from "../StyleSheet/AddPostScreenCss";
import {
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

type InputAutocompleteProps = {
  placeholder?: string;
  onPlaceSelected: (details: GooglePlaceDetail | null) => void;
};

const GOOGLE_API_KEY = "AIzaSyDkl6HfJvmSSKDGWH0L0Y183PbBuY9fjdo";

export default function AddPost() {
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const [title, onChangeTitle] = useState("");
  const [content, onChangeContent] = useState("");
  const [selectedGender, setSelectedGender] = useState("Preferred Gender");
  const [gender, setGender] = useState("");
  const [selectedAge, setSelectedAge] = useState("Preferred Age Group");
  const [age, setAge] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(
    "Destination Country *",
  );
  const [country, setCountry] = useState("");
  const [userLocation, setUserLocation] = useState<UserLocation[]>([]);
  const [location, setLocation] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedLocationText, setSelectedLocationText] = useState(
    "Destination Location",
  );
  let countriesListData = countriesList;

  const regisInfo = useRef<RegisInfo>({
    username: "",
    email: "",
    password: "",
    gender: true,
    age: "",
    country: "",
    avatar: "",
  }).current;

  const updateInputText = (field: string, value: string) => {
    //@ts-ignore
    regisInfo[field as keyof RegisInfo] = value;
  };

  // Autofocus
  const inputRef = useRef<TextInput | null>(null);
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Title input
  const titleInput = () => {
    return (
      <TextInput
        ref={inputRef}
        style={AddPostPageStyleSheet.postInputContainer}
        onChangeText={onChangeTitle}
        value={title}
        placeholder="Post Title *"
      />
    );
  };

  // Content input
  const contentInput = () => {
    return (
      <TextInput
        ref={inputRef}
        style={AddPostPageStyleSheet.contentContainer}
        onChangeText={onChangeContent}
        value={content}
        multiline
        placeholder="Post Content *"
      />
    );
  };

  // Gender checkbox
  // const genderCheckbox = () => {
  //   return (
  //     <TouchableOpacity
  //       style={AddPostPageStyleSheet.postAgeContainer}
  //       onPress={() => {
  //         {
  //           focusInput;
  //         }
  //         Keyboard.dismiss();
  //         IonNeverDialog.show({
  //           dialogHeight: 300,
  //           component: () => {
  //             const [localGender, setLocalGender] = useState<string>(age);
  //             return (
  //               <>
  //                 <ScrollView
  //                   horizontal={false}
  //                   style={AddPostPageStyleSheet.AgeScrollViewContainer}
  //                 >
  //                   {["Male", "Female", "Either"].map((label, index) => (
  //                     <CheckBox
  //                       key={index + 1}
  //                       title={label}
  //                       containerStyle={{
  //                         backgroundColor: "transparent",
  //                         borderWidth: 0,
  //                       }}
  //                       checkedIcon="dot-circle-o"
  //                       uncheckedIcon="circle-o"
  //                       checked={localGender === label}
  //                       onPress={() => {
  //                         if (localGender === label) {
  //                           setGender("");
  //                           setLocalGender("");
  //                         } else {
  //                           setGender(label);
  //                           setLocalGender(label);
  //                         }
  //                       }}
  //                     />
  //                   ))}
  //                 </ScrollView>
  //                 <View style={AddPostPageStyleSheet.ModalButtonContainer}>
  //                   <TouchableOpacity
  //                     onPress={() => {
  //                       localGender ? setSelectedGender(localGender) : null;
  //                       IonNeverDialog.dismiss();
  //                       updateInputText("gender", localGender);
  //                     }}
  //                   >
  //                     <Text style={AddPostPageStyleSheet.ModalText}>OK</Text>
  //                   </TouchableOpacity>
  //                 </View>
  //               </>
  //             );
  //           },
  //         });
  //       }}
  //     >
  //       <Text ref={inputRef}>{selectedGender}</Text>
  //       <MaterialIcons name="edit" size={16} />
  //     </TouchableOpacity>
  //   );
  // };

  // Age checkbox
  const ageCheckbox = () => {
    return (
      <TouchableOpacity
        style={AddPostPageStyleSheet.postAgeContainer}
        onPress={() => {
          {
            focusInput;
          }
          Keyboard.dismiss();
          IonNeverDialog.show({
            dialogHeight: 450,
            component: () => {
              const [localAge, setLocalAge] = useState<string>(age);
              return (
                <>
                  <ScrollView
                    horizontal={false}
                    style={AddPostPageStyleSheet.AgeScrollViewContainer}
                  >
                    {[
                      "18-24",
                      "25-30",
                      "31-36",
                      "37-42",
                      "42-48",
                      "48-54",
                      ">55",
                    ].map((label, index) => (
                      <CheckBox
                        key={index + 1}
                        title={label}
                        containerStyle={{
                          backgroundColor: "transparent",
                          borderWidth: 0,
                        }}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checked={localAge === label}
                        onPress={() => {
                          if (localAge === label) {
                            setAge("");
                            setLocalAge("");
                          } else {
                            setAge(label);
                            setLocalAge(label);
                          }
                        }}
                      />
                    ))}
                  </ScrollView>
                  <View style={AddPostPageStyleSheet.ModalButtonContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        localAge ? setSelectedAge(localAge) : null;
                        IonNeverDialog.dismiss();
                        updateInputText("age", localAge);
                      }}
                    >
                      <Text style={AddPostPageStyleSheet.ModalText}>OK</Text>
                    </TouchableOpacity>
                  </View>
                </>
              );
            },
          });
        }}
      >
        <Text ref={inputRef}>{selectedAge}</Text>
        <MaterialIcons name="edit" size={16} />
      </TouchableOpacity>
    );
  };

  // Country checkbox
  const countryCheckbox = () => {
    return (
      <TouchableOpacity
        style={AddPostPageStyleSheet.postCountryContainer}
        onPress={() => {
          {
            focusInput;
          }
          Keyboard.dismiss();
          IonNeverDialog.show({
            dialogHeight: 560,
            component: () => {
              const [localCountry, setLocalCountry] = useState<string>(country);
              const [search, setSearch] = useState("");
              const [countryList, setCountryList] = useState(countriesListData);
              const [matchedCountryList, setMatchedCountryList] =
                useState(countriesListData);
              useEffect(() => {
                setMatchedCountryList(
                  countryList.filter((country) =>
                    country.name
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase()),
                  ),
                );
              }, [search, countryList]);
              const updateSearch = (search: string) => {
                setSearch(search);
              };
              type CountryProps = { name: string };
              const Country = ({ name }: CountryProps) => (
                <View>
                  <CheckBox
                    title={name}
                    containerStyle={{
                      backgroundColor: "transparent",
                      borderWidth: 0,
                    }}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={localCountry === name}
                    onPress={() => {
                      if (localCountry === name) {
                        setCountry("");
                        setLocalCountry("");
                      } else {
                        setCountry(name);
                        setLocalCountry(name);
                      }
                    }}
                  />
                </View>
              );
              return (
                <>
                  <SearchBar
                    placeholder="Search..."
                    onChangeText={updateSearch}
                    value={search}
                    containerStyle={{ borderRadius: 10 }}
                    inputContainerStyle={{ backgroundColor: "white" }}
                    lightTheme={true}
                  />
                  <FlatList
                    data={matchedCountryList}
                    renderItem={({ item }) => <Country name={item.name} />}
                  />
                  <View style={AddPostPageStyleSheet.ModalButtonContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        localCountry ? setSelectedCountry(localCountry) : null;
                        IonNeverDialog.dismiss();
                        updateInputText("country", country);
                      }}
                    >
                      <Text style={AddPostPageStyleSheet.ModalText}>OK</Text>
                    </TouchableOpacity>
                  </View>
                </>
              );
            },
          });
        }}
      >
        <Text ref={inputRef}>{selectedCountry}</Text>
        <MaterialIcons name="edit" size={16} />
      </TouchableOpacity>
    );
  };

  // Location input
  const locationInput = () => {
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
              const [localLocation, setLocalLocation] =
                useState<string[]>(location);
              return (
                <>
                  <InputAutocomplete />
                  <FlatList
                    data={userLocation}
                    renderItem={({ item, index }) => (
                      <Text>{`${index + 1}. ${item.name}`}</Text>
                    )}
                  />
                  <View style={AddPostPageStyleSheet.ModalButtonContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        IonNeverDialog.dismiss();
                        updateInputText("location", selectedLocationText);
                      }}
                    >
                      <Text style={AddPostPageStyleSheet.ModalText}>OK</Text>
                    </TouchableOpacity>
                  </View>
                </>
              );
            },
          });
        }}
      >
        <Text ref={inputRef}>{selectedLocationText}</Text>
        <MaterialIcons name="edit" size={16} />
      </TouchableOpacity>
    );
  };

  // Location autocomplete
  type UserLocation = {
    id: string;
    name: string;
  };

  function InputAutocomplete() {
    return (
      <>
        <GooglePlacesAutocomplete
          styles={{ textInput: styles.search, listView: styles.list }}
          placeholder="Search..."
          fetchDetails
          onPress={(data, details) => {
            // console.log(JSON.stringify(data));
            // console.log(JSON.stringify(details));
            if (details) {
              const position = { id: details.place_id, name: details.name };
              console.log({ userLocationbefore: userLocation });
              setUserLocation([position]);
              console.log({ userLocationafter: userLocation });
              const updatedSelectedLocationText = userLocation
                .concat(position)
                .map((location) => location.name)
                .join(", ");
              setSelectedLocationText(updatedSelectedLocationText);
            }
          }}
          query={{
            key: GOOGLE_API_KEY,
            language: ["en", "zh-CN", "zh-TW", "ja"],
          }}
          onFail={(error) => console.log(error)}
        />
      </>
    );
  }

  //Display
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, alignItems: "center" }}>
          {titleInput()}
          {countryCheckbox()}
          {locationInput()}
          {contentInput()}
          {/* {genderCheckbox()} */}
          {ageCheckbox()}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
    zIndex: 1,
    height: "100%",
    width: "100%",
    borderRadius: 8,
  },
});
