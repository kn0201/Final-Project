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
} from "react-native";
import { RegisInfo } from "../utils/types";
import { countriesList } from "../source/countries";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import AddPostPageStyleSheet from "../StyleSheet/AddPostScreenCss";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import LocationInput from "../components/locationInput";

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
  const [code, setCode] = useState("");

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
              const [localCode, setLocalCode] = useState<string>(code);
              const [search, setSearch] = useState("");
              const [countryList, setCountryList] = useState(countriesListData);
              const [localCode, setLocalCode] = useState("");
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
              type CountryProps = { name: string; code: string };
              const Country = ({ name, code }: CountryProps) => (
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
                    containerStyle={{ borderRadius: 10 }}
                    inputContainerStyle={{ backgroundColor: "white" }}
                    lightTheme={true}
                  />
                  <FlatList
                    data={matchedCountryList}
                    renderItem={({ item }) => (
                      <Country name={item.name} code={item.code} />
                    )}
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
          <View style={{ flex: 1, alignItems: "center" }}>
            {titleInput()}
            {countryCheckbox()}
            <LocationInput code={code} />
            <LocationInput code={code} />
            {contentInput()}
            {/* {genderCheckbox()} */}
            {ageCheckbox()}
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
}
