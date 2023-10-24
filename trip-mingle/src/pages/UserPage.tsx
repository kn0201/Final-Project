import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

import UserPageTopTab from "../tabs/UserPageTopTab";
import { Avatar, Header, Icon } from "@rneui/themed";
import UserPageStyleSheet from "../StyleSheet/UserPageCss";
import { flex, iosBlue, white } from "../StyleSheet/StyleSheetHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { useToken } from "../hooks/useToken";
import * as ImagePicker from "expo-image-picker";
import { getIconResult } from "../utils/parser";
import { useGet } from "../hooks/useGet";
import { AntDesign } from "@expo/vector-icons";

import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import ChangeUsername from "../components/changeUsername";
import { apiOrigin } from "../utils/apiOrigin";

//@ts-ignore
export default function UserPage({ navigation }) {
  const { token, payload, setToken } = useToken();
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();

  const [isUpload, setIsUpload] = useState(false);
  const [image, setImage] = useState<string>();

  const addImage = async () => {
    let imagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    let imageAsset = imagePickerResult.assets?.[0];
    if (!imageAsset) return;
    let type = imageAsset.uri.endsWith(".png")
      ? "image/png"
      : imageAsset.uri.endsWith(".jpg") || imageAsset.uri.endsWith(".jpg")
      ? "image/jpeg"
      : null;
    if (!type) return;
    let filename = imageAsset.uri.split("/").pop();
    let file = {
      uri: imageAsset.uri,
      type,
      name: filename,
    };
    console.log("fileUri:", file);

    if (!imagePickerResult.canceled) {
      setImage(imagePickerResult.assets[0].uri);
      let formData = new FormData();
      formData.append("image", file as any);

      let res = await fetch(apiOrigin + "/user/update_icon", {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });
      let json = await res.json();
      if (json.result === true) {
        setIsUpload(true);
      }
    }
  };

  const logout = async () => {
    setToken("");
    await AsyncStorage.removeItem("username");
    navigation.navigate("Home");
  };

  let result = useGet("/user/icon", getIconResult).state?.path;
  const username = payload?.username;
  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={{ flex: 2 }}
      >
        <Header
          backgroundColor="white"
          centerComponent={{
            text: "User",
            style: UserPageStyleSheet.header,
          }}
          rightComponent={
            <View>
              <TouchableOpacity
                style={UserPageStyleSheet.rightComponent}
                onPress={logout}
              >
                <Text style={{ color: iosBlue }}>Logout</Text>
                <Icon
                  name="logout"
                  type="material-community"
                  color={iosBlue}
                ></Icon>
              </TouchableOpacity>
            </View>
          }
        ></Header>

        <View style={UserPageStyleSheet.container}>
          <Avatar
            size={150}
            rounded
            containerStyle={UserPageStyleSheet.AvatarContainer}
            source={{
              uri: isUpload ? image : `${apiOrigin}/${result}`,
            }}
          />
          <View style={UserPageStyleSheet.uploadBtnContainer}>
            <TouchableOpacity
              onPress={addImage}
              style={UserPageStyleSheet.uploadBtn}
            >
              <AntDesign name="camera" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <View style={UserPageStyleSheet.usernameContainer}>
            <Text style={UserPageStyleSheet.username}>{payload?.username}</Text>
            <TouchableOpacity
              style={UserPageStyleSheet.changeContainer}
              onPress={() => {
                IonNeverDialog.show({
                  dialogHeight: 320,
                  component: () => {
                    return (
                      <ChangeUsername
                        username={username}
                        navigation={navigation}
                      />
                    );
                  },
                });
              }}
            >
              <Text style={{ fontSize: 10 }}>Change Username</Text>
            </TouchableOpacity>
          </View>
        </View>
        <UserPageTopTab></UserPageTopTab>
      </KeyboardAvoidingView>
    </>
  );
}
