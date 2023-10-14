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
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { NewType, RegisInfo } from "../utils/types";
import { countriesList } from "../source/countries";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import AddPostPageStyleSheet from "../StyleSheet/AddPostScreenCss";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import LocationInput from "../components/locationInput";
import { Calendar } from "react-native-calendars";
import CalendarPicker from "react-native-calendar-picker";
import PeriodPicker from "../components/PeriodPicker";

export default function AddPost() {
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const [title, onChangeTitle] = useState("");
  const [content, onChangeContent] = useState("");
  const [selectedGender, setSelectedGender] = useState("Preferred Gender");
  const [gender, setGender] = useState("");
  const [selectedAge, setSelectedAge] = useState("Preferred Age");
  const [age, setAge] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(
    "Destination Country *",
  );
  const [country, setCountry] = useState("");
  const [code, setCode] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("Preferred Period");

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

  // Update Input fields
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
  //                         padding: 3,
  //                       }}
  //                       textStyle={{ fontWeight: "normal" }}
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
            dialogHeight: 350,
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
                          padding: 3,
                        }}
                        textStyle={{ fontWeight: "normal" }}
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
              const [localCode, setLocalCode] = useState<string>(code);
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
              type CountryProps = { name: string; code: string };
              const Country = ({ name, code }: CountryProps) => (
                <View>
                  <CheckBox
                    title={name}
                    containerStyle={{
                      backgroundColor: "transparent",
                      borderWidth: 0,
                      padding: 3,
                    }}
                    textStyle={{ fontWeight: "normal" }}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={localCountry === name}
                    onPress={() => {
                      if (localCountry === name) {
                        setCountry("");
                        setCode("");
                        setLocalCountry("");
                        setLocalCode("");
                      } else {
                        setCountry(name);
                        setCode(code);
                        setLocalCountry(name);
                        setLocalCode(code);
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
                    containerStyle={{
                      backgroundColor: "transparent",
                      borderTopColor: "transparent",
                      borderBottomColor: "transparent",
                      height: 50,
                    }}
                    inputContainerStyle={{
                      backgroundColor: "white",
                      borderColor: "black",
                      height: 40,
                      borderRadius: 10,
                      borderWidth: 1,
                    }}
                    inputStyle={{ fontSize: 14 }}
                    placeholderTextColor="#BFBFC1"
                    searchIcon={false}
                    lightTheme
                  />
                  <FlatList
                    data={matchedCountryList}
                    renderItem={({ item }) => (
                      <Country name={item.name} code={item.code} />
                    )}
                  />
                  <View style={AddPostPageStyleSheet.ModalButtonContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        localCountry ? setSelectedCountry(localCountry) : null;
                        IonNeverDialog.dismiss();
                        updateInputText("country", country);
                        // setCode(localCode);
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

  // Period Selector
  const periodSelector = () => {
    const [selectedDays, setSelectedDays] = useState([]);

    const handleDaysSelected = (days: any) => {
      setSelectedDays(days);
    };

    return (
      <TouchableOpacity
        style={AddPostPageStyleSheet.postAgeContainer}
        onPress={() => {
          {
            focusInput;
          }
          Keyboard.dismiss();
          IonNeverDialog.show({
            dialogHeight: 420,
            component: () => {
              return (
                <PeriodPicker
                  setSelectedPeriod={setSelectedPeriod}
                  selectedPeriod={selectedPeriod}
                  onDaysSelected={handleDaysSelected}
                />
              );
            },
          });
        }}
      >
        <Text ref={inputRef}>{selectedPeriod}</Text>
        <MaterialIcons name="edit" size={16} />
      </TouchableOpacity>
    );
  };

  // Display
  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {/* <ScrollView> */}
          <View style={{ flex: 1, alignItems: "center" }}>
            {titleInput()}
            {countryCheckbox()}
            {periodSelector()}
            <LocationInput code={code} />
            {contentInput()}
            {/* {genderCheckbox()} */}
            {ageCheckbox()}
          </View>
          {/* </ScrollView> */}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
}
