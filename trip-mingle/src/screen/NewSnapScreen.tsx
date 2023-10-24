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
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { center, full } from "../StyleSheet/StyleSheetHelper";
import { BlogContentStyleSheet } from "../StyleSheet/blogContentCss";
import * as ImagePicker from "expo-image-picker";
import { SnapInfo, UserLocation } from "../utils/types";
import AddPostPageStyleSheet from "../StyleSheet/AddPostScreenCss";
import PlanningStyleSheet from "../StyleSheet/PlanningStyleSheet";
import { useToken } from "../hooks/useToken";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import { SnapScreenStyleSheet } from "../StyleSheet/SnapScreenCss";
import { NewSnapScreenStyleSheet } from "../StyleSheet/NewSnapScreenCss";
import InputAutocomplete from "../components/InputAutocomplete";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import LocationInput from "../components/locationInput";
import { useAppNavigation } from "../../navigators";
import { boolean, object } from "cast.ts";
import { api } from "../apis/api";
import TextButton from "../components/TextButton";

type ImageFile = {
  uri: string;
  file: File;
};

export default function NewSnapScreen() {
  const { token } = useToken();
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const navigation = useAppNavigation();
  const [image, setImage] = useState(null);
  const [content, setContent] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
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
  const postInfo = useRef<SnapInfo>({
    trip_location: [],
  }).current;

  const updateInputText = (
    field: string,
    value: string | boolean | string[]
  ) => {
    //@ts-ignore
    postInfo[field as keyof PostInfo] = value;
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
      console.log(formData);

      // formData.append("location", postInfo.trip_location[0]);
      // let json = await api.post(
      //   "/snap",
      //   formData,
      //   object({
      //     result: boolean(),
      //   }),
      //   token
      // );

      // IonNeverDialog.show({
      //   type: "success",
      //   title: "Add a new plan",
      //   firstButtonVisible: true,
      // });

      // navigation.navigate("SnapPage");
    } catch (error) {
      let message = String(error);
      IonNeverDialog.show({
        type: "warning",
        title: "Failed to add Snap",
        message,
        firstButtonVisible: true,
      });
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={NewSnapScreenStyleSheet.center}>
        <View style={NewSnapScreenStyleSheet.uploadContainerSquare}>
          {imageFile && (
            <Image
              source={{ uri: imageFile.uri }}
              style={{
                width: "100%",
                height: 300,
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

        <LocationInput code={code} updateInputText={updateInputText} />
        <View style={NewSnapScreenStyleSheet.contentContainer}>
          <TextInput
            onChangeText={(content) => {
              setContent([...content, content]);
              console.log(content);
            }}
            multiline
            placeholder="Post Content *"
            style={{ width: full, height: full }}
          />
        </View>
        <TextButton text="Continue" onPress={addSnap}></TextButton>
      </View>
    </TouchableWithoutFeedback>
  );
}
