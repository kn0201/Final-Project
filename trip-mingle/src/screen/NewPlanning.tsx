import { CheckBox, SearchBar } from "@rneui/themed";
import { useEffect, useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  FlatList,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RegisInfo, ScheduleCardInputInfo } from "../utils/types";
import { countriesList } from "../source/countries";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import { center, flex } from "../StyleSheet/StyleSheetHelper";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import LoginPageStyleSheet from "../StyleSheet/LoginScreenCss";
import { apiOrigin } from "../utils/apiOrigin";
import { useToken } from "../hooks/useToken";
import PlanningStyleSheet from "../StyleSheet/PlanningStyleSheet";

const NewPlanning = () => {
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const [title, onChangeTitle] = useState("");
  const [setTitle, setSelectedTitle] = useState("Add Title");
  const [selectedCountry, setSelectedCountry] = useState("Country");
  const [country, setCountry] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState<any>();
  const { token, payload, setToken } = useToken();

  const addImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // @ts-ignore
    // console.log(JSON.stringify(_image.assets[0].uri));
    //@ts-ignore
    if (!_image.canceled) {
      //@ts-ignore
      setImage(_image.assets[0].uri);
      updateInputText("avatar", _image.assets[0].uri);
    }
  };

  let countriesListData = countriesList;

  const planInfo = useRef<ScheduleCardInputInfo>({
    title: "",
    uri: "",
  }).current;
  const clearInputs = useRef({
    title() {},
    country() {},
  }).current;

  const updateInputText = (field: string, value: string) => {
    //@ts-ignore
    planInfo[field as keyof ScheduleCardInputInfo] = value;
  };

  const addPlan = async () => {
    // console.log("add plan");
    try {
      let formData = new FormData();
      formData.append("image", imageFile as any);
      formData.append("title", title);
      let res = await fetch(apiOrigin + "/planning/plan", {
        method: "POST",
        body: formData,
      });
      let json = await res.json();
      Object.entries(clearInputs).map(([_key, clear]) => clear());
      setSelectedTitle("Add Title");
      setToken(json.token);
      IonNeverDialog.show({
        type: "success",
        title: "Add a new plan",
        firstButtonVisible: true,
      });
    } catch (error) {
      const errorObject: any = { ...(error as object) };
      console.log(errorObject);
    }
    // console.log(planInfo);
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss;
      }}
    >
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={PlanningStyleSheet.uploadContainerSquare}>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 300, height: 300, alignItems: center }}
            />
          )}
          <View style={PlanningStyleSheet.uploadBtnContainerSquare}>
            <TouchableOpacity
              onPress={addImage}
              style={PlanningStyleSheet.uploadBtn}
            >
              <Text>{image ? "Edit" : "Upload"} Image</Text>
              <AntDesign name="camera" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <TextInput
          style={PlanningStyleSheet.inputContainer}
          onChangeText={onChangeTitle}
          value={title}
          placeholder="Title"
        />
        <TouchableOpacity
          style={PlanningStyleSheet.countryContainer}
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
                    <View style={PlanningStyleSheet.ModalButtonContainer}>
                      <TouchableOpacity
                        disabled={localCountry === ""}
                        onPress={() => {
                          setSelectedCountry(localCountry);
                          IonNeverDialog.dismiss();
                          updateInputText("country", country);
                        }}
                      >
                        <Text style={PlanningStyleSheet.ModalText}>OK</Text>
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
          onPress={() => console.log("add plan log")}
        >
          <Text style={LoginPageStyleSheet.loginText}>Add Plan</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NewPlanning;
