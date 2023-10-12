import { CheckBox, SearchBar } from "@rneui/themed";
import { useEffect, useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RegisInfo } from "../utils/types";
import { countriesList } from "../source/countries";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import RegisterScreenStyleSheet from "../StyleSheet/RegisterScreenCss";
import { flex } from "../StyleSheet/StyleSheetHelper";

//@ts-ignore
export default function AddPost() {
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const [title, onChangeTitle] = useState("");
  const [content, onChangeContent] = useState("");
  const [checkGender, setCheck1] = useState(true);
  const [selectedAge, setSelectedAge] = useState("Select Your Age Group");
  const [age, setAge] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("Country");
  const [country, setCountry] = useState("");

  let countriesListData = countriesList;

  const regisInfo = useRef<RegisInfo>({
    username: "",
    email: "",
    password: "",
    gender: checkGender,
    age: "",
    country: "",
    avatar: "",
  }).current;

  const updateInputText = (field: string, value: string) => {
    //@ts-ignore
    regisInfo[field as keyof RegisInfo] = value;
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss;
      }}
    >
      <View style={{ flex: 1, alignItems: "center" }}>
        <TextInput
          style={RegisterScreenStyleSheet.inputContainer}
          onChangeText={onChangeTitle}
          value={title}
          placeholder="Title"
        />
        <TextInput
          style={RegisterScreenStyleSheet.inputContainer}
          onChangeText={onChangeContent}
          value={content}
          placeholder="Post content"
        />
        <TouchableOpacity
          style={RegisterScreenStyleSheet.birthdayContainer}
          onPress={() => {
            IonNeverDialog.show({
              dialogHeight: 500,
              component: () => {
                const [localAge, setLocalAge] = useState<string>(age);
                return (
                  <>
                    <ScrollView
                      horizontal={false}
                      style={
                        RegisterScreenStyleSheet.BirthdayScrollViewContainer
                      }
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
                            setAge(label);
                            setLocalAge(label);
                          }}
                        />
                      ))}
                    </ScrollView>
                    <View style={RegisterScreenStyleSheet.ModalButtonContainer}>
                      <TouchableOpacity
                        disabled={localAge === ""}
                        onPress={() => {
                          setSelectedAge(localAge);
                          IonNeverDialog.dismiss();
                          updateInputText("age", localAge);
                        }}
                      >
                        <Text style={RegisterScreenStyleSheet.ModalText}>
                          OK
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                );
              },
            });
          }}
        >
          <Text>{selectedAge}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={RegisterScreenStyleSheet.countryContainer}
          onPress={() => {
            IonNeverDialog.show({
              dialogHeight: 800,
              component: () => {
                const [localCountry, setLocalCountry] =
                  useState<string>(country);
                const [search, setSearch] = useState("");

                const [countryList, setCountryList] =
                  useState(countriesListData);

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
                        setCountry(name);
                        setLocalCountry(name);
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
                    <View style={RegisterScreenStyleSheet.ModalButtonContainer}>
                      <TouchableOpacity
                        disabled={localCountry === ""}
                        onPress={() => {
                          setSelectedCountry(localCountry);
                          IonNeverDialog.dismiss();
                          updateInputText("country", country);
                        }}
                      >
                        <Text style={RegisterScreenStyleSheet.ModalText}>
                          OK
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                );
              },
            });
          }}
        >
          <Icon
            style={{
              display: flex,
              justifyContent: "flex-start",
              marginEnd: 4,
            }}
            name={country === "" ? "earth" : ""}
            size={16}
          />
          <Text>{selectedCountry}</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}
