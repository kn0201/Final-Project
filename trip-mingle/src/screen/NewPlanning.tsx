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
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import LoginPageStyleSheet from "../StyleSheet/LoginScreenCss";

//@ts-ignore
const NewPlanning = () => {
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const [title, onChangeTitle] = useState("");
  const [content, onChangeContent] = useState("");
  const [checkGender, setCheck1] = useState(true);
  const [selectedAge, setSelectedAge] = useState("Select Your Age Group");
  const [age, setAge] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("Country");
  const [country, setCountry] = useState("");
  const [image, setImage] = useState(null);

  const addImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // @ts-ignore
    console.log(JSON.stringify(_image.assets[0].uri));
    //@ts-ignore
    if (!_image.canceled) {
      //@ts-ignore
      setImage(_image.assets[0].uri);
      updateInputText("avatar", _image.assets[0].uri);
    }
  };

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
        <View style={RegisterScreenStyleSheet.uploadContainerSquare}>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 300, height: 300 }}
            />
          )}
          <View style={RegisterScreenStyleSheet.uploadBtnContainerSquare}>
            <TouchableOpacity
              onPress={addImage}
              style={RegisterScreenStyleSheet.uploadBtn}
            >
              <Text>{image ? "Edit" : "Upload"} Image</Text>
              <AntDesign name="camera" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
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
                        .includes(search.toLocaleLowerCase())
                    )
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
        <TouchableOpacity
          style={LoginPageStyleSheet.login}
          // onPress={register}
        >
          <Text style={LoginPageStyleSheet.loginText}>Add New Plan</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NewPlanning;
