// Buffer Line
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Animated,
  StyleSheet,
  Keyboard,
} from "react-native";
import { useIonNeverNotification } from "./IonNeverNotification/NotificationProvider";
import { AntDesign } from "@expo/vector-icons";
import LoginPageStyleSheet from "../StyleSheet/LoginScreenCss";
import { CheckBox, SearchBar } from "@rneui/base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import * as ImagePicker from "expo-image-picker";
import { ScheduleCardInputInfo } from "../utils/types";
import { countriesList } from "../source/countries";
import { absolute, center } from "../StyleSheet/StyleSheetHelper";
import PlannigStyleSheet from "../StyleSheet/PlanningStyleSheet";

function AddScheduleForm(props: {
  closeModal: () => void;
  addNewScheduleCard: (newScheduleInfo: ScheduleCardInputInfo) => void;
}) {
  const { closeModal, addNewScheduleCard } = props;

  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const countriesListData = countriesList;

  const [image, setImage] = useState<string>();

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
      <TouchableOpacity
        style={PlannigStyleSheet.countryContainer}
        onPress={() => {
          IonNeverDialog.show({
            dialogHeight: 800,
            component: () => {
              return (
                <View>
                  <Text>123</Text>
                </View>
              );
            },
          });
        }}
      >
        <Icon
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginEnd: 4,
          }}
          name={"earth"}
          size={16}
        />
        <Text>{"selectedCountry"}</Text>
      </TouchableOpacity>
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
