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
  TouchableWithoutFeedback,
} from "react-native";
import { useIonNeverNotification } from "./IonNeverNotification/NotificationProvider";
import { AntDesign } from "@expo/vector-icons";
import { CheckBox, SearchBar } from "@rneui/base";
import * as ImagePicker from "expo-image-picker";
import { countriesList } from "../source/countries";
import { center } from "../StyleSheet/StyleSheetHelper";
import PlanningStyleSheet from "../StyleSheet/PlanningStyleSheet";
import AddPostPageStyleSheet from "../StyleSheet/AddPostScreenCss";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useToken } from "../hooks/useToken";
import { api, api2 } from "../apis/api";
import { boolean, id, object, string } from "cast.ts";
import TextButton from "./TextButton";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../theme/variables";
<<<<<<< HEAD
import { useAppRoute } from "../../navigators";
import DateInput from "./DateInput";
=======
import useEvent from "react-use-event";
import { AddPlanEvent } from "../utils/events";
>>>>>>> refs/remotes/origin/main

type ImageFile = {
  uri: string;
  file: File;
};

export function AddScheduleForm(props: {
  closeModal: () => void;

  addNewScheduleCard: (newScheduleInfo: {
    plan_id: number;
    plan_title: string;
    image_path: string;
    startDate: string | undefined;
    endDate: string | undefined;
  }) => void;

  confirmedUsersList?: any;
}) {
  const { closeModal, addNewScheduleCard } = props;
  const [userList, setUserList] = useState(props.confirmedUsersList || null);
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const countriesListData = countriesList;
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const { token, payload, setToken } = useToken();
  const [country, setCountry] = useState("");
  const [code, setCode] = useState("");
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const params = useAppRoute<"AddSchedule">();
  // const { planId } = params;
  const [selectedCountry, setSelectedCountry] = useState(
    "Destination Country *",
  );

  const [state, setState] = useState({
    title: "",
    country: "",
  });

  // function reset() {
  //   setState({ title: "", country: "" });
  //   setImageFile(null);
  // }

  const addImage = async () => {
    let imagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (imagePickerResult.canceled) return;
    let imageAsset = imagePickerResult.assets?.[0];
    if (!imageAsset) return;
    let type = imageAsset.uri.endsWith(".png")
      ? "image/png"
      : imageAsset.uri.endsWith(".jpg") || imageAsset.uri.endsWith(".jpeg")
      ? "image/jpeg"
      : null;
    if (!type) {
      IonNeverDialog.show({
        type: "warning",
        title: "unknown image type: " + imageAsset.uri,
        firstButtonVisible: true,
      });
      return;
    }
    let filename = imageAsset.uri.split("/").pop();
    let file = {
      uri: imageAsset.uri,
      type,
      name: filename,
    };
    console.log("image file:", file);
    setImageFile({
      uri: file.uri,
      file: file as unknown as File,
    });
  };

<<<<<<< HEAD
  // async function addMarkDate() {
  //   if (!startDate) {
  //     IonNeverToast.show({
  //       type: "warning",
  //       title: "Please input start date",
  //     });
  //     if (!endDate)
  //       IonNeverToast.show({
  //         type: "warning",
  //         title: "Please input end date",
  //       });
  //     return;
  //   }=
  //   try {
  //     let data = {
  //       start_date: startDate,
  //       end_date: endDate,
  //     };

  //     let res = await api.post(
  //       `/planning/${planId}/mark`,
  //       data,
  //       object({ result: boolean() }),
  //       token
  //     );
  //     if (res.result) {
  //       IonNeverDialog.show({
  //         type: "success",
  //         title: "Add a new mark",
  //         firstButtonVisible: true,
  //       });
  //     }
  //   } catch (error) {
  //     let message = String(error);
  //     IonNeverDialog.show({
  //       type: "warning",
  //       title: "Failed to add a mark",
  //       message,
  //       firstButtonVisible: true,
  //     });
  //   }
  // }
=======
  const dispatchAddPlanEvent = useEvent<AddPlanEvent>("AddPlan");
>>>>>>> refs/remotes/origin/main
  async function addPlan(
    title: string,
    country: string,
    imageFile?: ImageFile | null,
  ) {
    let user_id_array = [];
    if (!title) {
      IonNeverToast.show({
        type: "warning",
        title: "Please Input Title",
      });
      return;
    }
    Keyboard.dismiss;

    try {
      let formData = new FormData();
      if (!imageFile) {
        formData.append("image", "null");
      }
      if (imageFile) {
        formData.append("image", imageFile.file);
      }
      formData.append("title", title);
      formData.append("country", country);
      if (userList != null) {
        formData.append("user_list", userList.join(""));
        let json = await api2.upload(
          "/planning/tour_plan",
          formData,
          object({
            plan_id: id(),
            image_path: string(),
          }),
          token,
        );
        dispatchAddPlanEvent("AddPlan");
      }

      let json = await api2.upload(
        "/planning/plan",
        formData,
        object({
          plan_id: id(),
          image_path: string(),
        }),
        token,
      );
      console.log("add plan result:", json);
      IonNeverDialog.show({
        type: "success",
        title: "Add a new plan",
        firstButtonVisible: true,
      });
      addNewScheduleCard({
        plan_id: json.plan_id,
        plan_title: title,
        image_path: json.image_path || "",
        startDate: "",
        endDate: "",
      });
      closeModal();
    } catch (error) {
      let message = String(error);
      IonNeverDialog.show({
        type: "warning",
        title: "Failed to add a new plan",
        message,
        firstButtonVisible: true,
      });
    }
  }
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
                        setState({ ...state, country });
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
    <View style={{ flex: 1, alignItems: "center" }}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#FFFFFF", theme.background]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "100%",
        }}
      />
      <View style={PlanningStyleSheet.uploadContainerSquare}>
        {imageFile && (
          <Image
            source={{ uri: imageFile.uri }}
            style={{
              width: 500,
              height: 300,
              justifyContent: center,
              alignItems: center,
            }}
          />
        )}
        <View style={PlanningStyleSheet.uploadBtnContainerSquare}>
          <TouchableOpacity
            onPress={addImage}
            style={PlanningStyleSheet.uploadBtn}
          >
            <Text>{imageFile ? "Edit" : "Upload"} Image</Text>
            <AntDesign name="camera" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        style={PlanningStyleSheet.inputContainer}
        placeholder="Title"
        value={state.title}
        onChangeText={(text) => setState({ ...state, title: text })}
      />

      <TextButton
        text="Add New Plan"
        onPress={() => {
          addPlan(state.title, state.country, imageFile);
        }}
      ></TextButton>
      <View style={PlanningStyleSheet.cancelButtonDiv}>
        <TouchableOpacity
          style={PlanningStyleSheet.cancelButton}
          onPress={closeModal}
        >
          <Text style={PlanningStyleSheet.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default AddScheduleForm;
