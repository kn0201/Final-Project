// Buffer Line
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Keyboard,
} from "react-native";
import { useIonNeverNotification } from "./IonNeverNotification/NotificationProvider";
import { AntDesign } from "@expo/vector-icons";
import LoginPageStyleSheet from "../StyleSheet/LoginScreenCss";
import { CheckBox, SearchBar } from "@rneui/base";
import * as ImagePicker from "expo-image-picker";
import { ScheduleCardInputInfo } from "../utils/types";
import { countriesList } from "../source/countries";
import { center } from "../StyleSheet/StyleSheetHelper";
import PlannigStyleSheet from "../StyleSheet/PlanningStyleSheet";
import AddPostPageStyleSheet from "../StyleSheet/AddPostScreenCss";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

function AddScheduleForm(props: {
  closeModal: () => void;
  addNewScheduleCard: (newScheduleInfo: ScheduleCardInputInfo) => void;
}) {
  const { closeModal, addNewScheduleCard } = props;

  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const countriesListData = countriesList;

  const [image, setImage] = useState<string>();
  const [country, setCountry] = useState("");
  const [code, setCode] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(
    "Destination Country *"
  );
  const schdeuleInfo = useRef<ScheduleCardInputInfo>({
    title: "",
    uri: "",
  }).current;

  const clearInputs = useRef({
    uri() {},
    title() {},
    country() {},
  }).current;

  const updateInputText = (field: string, value: string) => {
    schdeuleInfo[field as keyof ScheduleCardInputInfo] = value;
  };

  const addImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // @ts-ignore
    console.log(JSON.stringify(_image.assets[0].uri));
    if (!_image.canceled) {
      setImage(_image.assets[0].uri);
      updateInputText("uri", _image.assets[0].uri);
    }
  };

  // Autofocus
  const inputRef = useRef<TextInput | null>(null);
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const CountryCheckbox = () => {
    return (
      <TouchableOpacity
        style={AddPostPageStyleSheet.postCountryContainer}
        onPress={() => {
          {
            focusInput;
          }
          Keyboard.dismiss();
          IonNeverDialog.show({
            dialogHeight: 600,
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
                      .includes(search.toLocaleLowerCase())
                  )
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
                      borderBottomWidth: 1,
                      borderWidth: 1,
                    }}
                    inputStyle={{ fontSize: 14, color: "black" }}
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
                        localCountry
                          ? setSelectedCountry(localCountry)
                          : setSelectedCountry("Destination Country *");
                        IonNeverDialog.dismiss();
                        updateInputText("trip_country", country);
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
  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: "white" }}>
      <View style={PlannigStyleSheet.uploadContainerSquare}>
        {image && (
          <Image
            source={{ uri: image }}
            style={{
              width: 500,
              height: 300,
              justifyContent: center,
              alignItems: center,
            }}
          />
        )}
        <View style={PlannigStyleSheet.uploadBtnContainerSquare}>
          <TouchableOpacity
            onPress={addImage}
            style={PlannigStyleSheet.uploadBtn}
          >
            <Text>{image ? "Edit" : "Upload"} Image</Text>
            <AntDesign name="camera" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        style={PlannigStyleSheet.inputContainer}
        ref={(input: any) => {
          clearInputs.title = () => input?.clear();
        }}
        onChangeText={(text) => {
          updateInputText("title", text);
        }}
        placeholder="Title"
      />
      <CountryCheckbox />
      <TouchableOpacity
        style={LoginPageStyleSheet.login}
        onPress={() => {
          if (!schdeuleInfo.title) {
            IonNeverToast.show({
              type: "warning",
              title: "Please Input Title",
            });
            return;
          }
          addNewScheduleCard(schdeuleInfo);
          closeModal();
          Keyboard.dismiss;
        }}
      >
        <Text style={LoginPageStyleSheet.loginText}>Add New Plan</Text>
      </TouchableOpacity>
    </View>
  );
}

export default AddScheduleForm;
