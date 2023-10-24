//Buffer Line

import { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { center, full } from "../StyleSheet/StyleSheetHelper";
import * as ImagePicker from "expo-image-picker";
import AddPostPageStyleSheet from "../StyleSheet/AddPostScreenCss";
import { useToken } from "../hooks/useToken";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import { NewSnapScreenStyleSheet } from "../StyleSheet/NewSnapScreenCss";
import { useAppNavigation } from "../../navigators";
import { api, api2 } from "../apis/api";
import TextButton from "../components/TextButton";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import query from "../utils/googleAPIQuery";
import { SnapScreenStyleSheet } from "../StyleSheet/SnapScreenCss";
import { SpotInfo } from "../utils/types";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { boolean, object } from "cast.ts";

type ImageFile = {
  uri: string;
  file: File;
};

const GOOGLE_API_KEY = "AIzaSyDkl6HfJvmSSKDGWH0L0Y183PbBuY9fjdo";
const language = ["en", "zh-CN", "zh-TW", "ja"];
const types = [
  "tourist_attraction",
  "landmark",
  "natural_feature",
  "point_of_interest",
];

export default function NewSnapScreen() {
  const { token } = useToken();
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const navigation = useAppNavigation();
  const [image, setImage] = useState(null);
  const [content, setContent] = useState<string>("");
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [keyboardShow, setKeyboardShow] = useState(false);
  const autocompleteRef = useRef(null);
  const [selectedLocationText, setSelectedLocationText] =
    useState("Trip Spot(s)");

  const code = null;
  const type = "snap";
  const addImage = async () => {
    console.log("addImage");
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
  // Submit
  const spotInfo = useRef<SpotInfo>({
    place_id: "",
    name: "",
    address: "",
    latitude: 0,
    longitude: 0,
  }).current;

  const updateInputText = (field: string, value: string | number) => {
    //@ts-ignore
    spotInfo[field as keyof spotInfo] = value;
  };
  const inputRef = useRef<TextInput | null>(null);
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  const LocationInput = () => {
    return (
      <TouchableOpacity
        style={AddPostPageStyleSheet.postCountryContainer}
        onPress={() => {
          {
            focusInput;
          }
          Keyboard.dismiss();

          IonNeverDialog.show({
            component: () => {
              return <InputAutocomplete />;
            },
          });
        }}
      >
        <Text ref={inputRef}>{selectedLocationText}</Text>
        <MaterialIcons name="edit" size={16} />
      </TouchableOpacity>
    );
  };

  const InputAutocomplete = () => {
    return (
      <>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <>
            <View style={NewSnapScreenStyleSheet.spotContainer}>
              <GooglePlacesAutocomplete
                ref={autocompleteRef}
                styles={{
                  textInput: NewSnapScreenStyleSheet.search,
                  listView: NewSnapScreenStyleSheet.list,
                }}
                placeholder="Search..."
                fetchDetails
                onPress={(data, details) => {
                  if (details) {
                    const position = {
                      place_id: details.place_id,
                      name: details.name,
                      address: details.formatted_address,
                      latitude: details.geometry.location.lat,
                      longitude: details.geometry.location.lng,
                    };
                    updateInputText("place_id", position.place_id);
                    updateInputText("name", position.name);
                    updateInputText("address", position.address);
                    updateInputText("latitude", position.latitude);
                    updateInputText("longitude", position.longitude);
                  }
                }}
                textInputProps={{
                  onPressIn: () => {},
                }}
                query={query}
                onFail={(error) => console.log(error)}
              />
            </View>
            <View style={AddPostPageStyleSheet.ModalButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  IonNeverDialog.dismiss();
                  setSelectedLocationText(spotInfo.name);
                }}
              >
                <Text style={AddPostPageStyleSheet.ModalText}>OK</Text>
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </>
    );
  };

  async function addSnap() {
    if (!imageFile) {
      IonNeverToast.show({
        type: "warning",
        title: "Missing Photo",
      });
      return;
    }

    console.log("add plan");
    try {
      let formData = new FormData();
      if (imageFile) {
        formData.append("image", imageFile.file);
      }
      formData.append("type", type);
      formData.append("place_id", spotInfo.place_id);
      formData.append("name", spotInfo.name);
      formData.append("address", spotInfo.address);
      formData.append("latitude", spotInfo.latitude.toString());
      formData.append("longitude", spotInfo.longitude.toString());
      formData.append("content", content);
      console.log(formData);

      let json = await api2.upload(
        "/snap",
        formData,
        object({
          result: boolean(),
        }),
        token
      );
      if (json.result == true) {
        IonNeverDialog.show({
          type: "success",
          title: "Add New Snap",
          firstButtonVisible: true,
        });

        navigation.navigate("Snap");
      }
    } catch (error) {
      let message = String(error);
      IonNeverDialog.show({
        type: "warning",
        title: "Failed Snap",
        message,
        firstButtonVisible: true,
      });
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={{ flex: keyboardShow ? 0.65 : 0 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView>
          <View style={NewSnapScreenStyleSheet.center}>
            <View style={NewSnapScreenStyleSheet.uploadContainerSquare}>
              {imageFile && (
                <Image
                  source={{ uri: imageFile.uri }}
                  style={{
                    width: "100%",
                    minHeight: 450,
                    justifyContent: center,
                    alignItems: center,
                  }}
                />
              )}
              <View style={NewSnapScreenStyleSheet.uploadBtnContainerSquare}>
                <TouchableOpacity
                  onPress={addImage}
                  style={NewSnapScreenStyleSheet.uploadBtn}
                >
                  <Text>{imageFile ? "Edit" : "Upload"} Image</Text>
                  <AntDesign name="camera" size={20} color="black" />
                </TouchableOpacity>
              </View>
            </View>

            <LocationInput />

            <View style={NewSnapScreenStyleSheet.contentContainer}>
              <TextInput
                onBlur={() => {
                  setKeyboardShow(!keyboardShow);
                }}
                onFocus={() => {
                  setKeyboardShow(!keyboardShow);
                }}
                onChangeText={(content) => {
                  setContent(content);
                  console.log(content);
                }}
                placeholder="Post Content"
                style={{ width: full, height: full }}
              />
            </View>
            <TextButton text="SNAP" onPress={addSnap}></TextButton>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
