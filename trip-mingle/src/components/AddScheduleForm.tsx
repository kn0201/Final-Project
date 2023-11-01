// Buffer Line
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";
import { useIonNeverNotification } from "./IonNeverNotification/NotificationProvider";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { center } from "../StyleSheet/StyleSheetHelper";
import PlanningStyleSheet from "../StyleSheet/PlanningStyleSheet";
import { useToken } from "../hooks/useToken";
import { api2 } from "../apis/api";
import { id, object, string } from "cast.ts";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../theme/variables";
import useEvent from "react-use-event";
import { AddPlanEvent } from "../utils/events";

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
  title?: string;
  post_id?: number;
}) {
  const { closeModal, addNewScheduleCard, confirmedUsersList, title } = props;
  const [userList, setUserList] = useState(props.confirmedUsersList || null);
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const { token, payload, setToken } = useToken();
  const [code, setCode] = useState("");
  const [planTitle, setPlanTitle] = useState<string>(props.title || "");
  const [postId, stPostId] = useState<number>(props.post_id || 0);
  function reset() {
    setPlanTitle("");
    setImageFile(null);
  }

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
  const dispatchAddPlanEvent = useEvent<AddPlanEvent>("AddPlan");

  async function addPlan(
    title: string,

    imageFile?: ImageFile | null
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
      formData.append("post_id", postId.toString());
      console.log(formData);

      if (userList != null) {
        formData.append("user_list", userList.join(""));
        let json = await api2.upload(
          "/planning/tour_plan",
          formData,
          object({
            plan_id: id(),
            image_path: string(),
          }),
          token
        );
        dispatchAddPlanEvent("AddPlan");
      } else {
        let json = await api2.upload(
          "/planning/plan",
          formData,
          object({
            plan_id: id(),
            image_path: string(),
          }),
          token
        );
        dispatchAddPlanEvent("AddPlan");
      }

      IonNeverDialog.show({
        type: "success",
        title: "Add a new plan",
        firstButtonVisible: true,
      });

      closeModal();

      reset();
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

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <LinearGradient
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
      <View
        style={{ width: "90%", justifyContent: center, alignItems: center }}
      >
        <TextInput
          style={PlanningStyleSheet.formInputContainer}
          placeholder="Title"
          value={planTitle}
          onChangeText={(text) => {
            setPlanTitle(text);
            console.log(planTitle);
          }}
        />
      </View>

      <View style={PlanningStyleSheet.cancelButtonDiv}>
        <TouchableOpacity
          style={PlanningStyleSheet.addButton}
          onPress={() => {
            addPlan(planTitle, imageFile);
          }}
        >
          <Text style={PlanningStyleSheet.addButtonText}>Add New Plan</Text>
        </TouchableOpacity>
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
