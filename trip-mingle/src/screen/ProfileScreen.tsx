//Buffer Line

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import ProfileScreenStyleSheet from "../StyleSheet/ProfileScreenCss";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { center, flex, full, white } from "../StyleSheet/StyleSheetHelper";
import { useEffect, useRef, useState } from "react";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";

import { ProfileInfo } from "../utils/types";
import MultipleLanguagesCheckbox from "../components/multipleLanguagesCheckbox";
import { api } from "../apis/api";
import {
  getProfileResultParser,
  sendProfileResultParser,
} from "../utils/parser";
import { useToken } from "../hooks/useToken";
import MultipleCountryCheckbox from "../components/multipleCountryCheckbox";
import MultipleHobbyCheckbox from "../components/multipleHobbyCheckbox";
import useBoolean from "../hooks/useBoolean";

export default function ProfileScreen(props: {
  //@ts-ignore
  navigation;
  // //@ts-ignore
  // setEditableIcon;
  // //@ts-ignore
  // editableIcon;
}) {
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const { token, payload, setToken } = useToken();

  const profileInfo = useRef<ProfileInfo>({
    intro: "",
    language: "",
    hobby: "",
    country: "",
  }).current;

  const getProfile = async () => {
    let json = await api.get("/user/profile", getProfileResultParser, token);
    if (json.intro != null) {
      setIntroText(json.intro);
      updateInputText("intro", json.intro);
    }
    if (json.language != null) {
      let IDarray: string[] = [];
      let nameArray: string[] = [];
      for (let language of json.language) {
        nameArray.push(language.name);

        IDarray.push(language.id);
        let idString = IDarray.join(",");
        updateInputText("language", idString);
      }

      const languageString = nameArray.join(", ");
      //@ts-ignore
      setSelectedLanguage(languageString);
    }
    if (json.hobby != null) {
      let IDarray: string[] = [];
      let nameArray: string[] = [];
      for (let hobby of json.hobby) {
        nameArray.push(hobby.name);
        IDarray.push(hobby.id);
        let idString = IDarray.join(",");
        updateInputText("hobby", idString);
      }
      const hobbyString = nameArray.join(", ");
      //@ts-ignore
      setSelectedHobby(hobbyString);
    }
    if (json.countries_travelled != null) {
      let IDarray: string[] = [];
      let nameArray: string[] = [];
      for (let countries_travelled of json.countries_travelled) {
        nameArray.push(countries_travelled.name);
        IDarray.push(countries_travelled.id);
        let idString = IDarray.join(",");
        updateInputText("country", idString);
      }
      const countryString = nameArray.join(", ");
      //@ts-ignore
      setSelectedCountry(countryString);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);
  const [introText, setIntroText] = useState("add");
  const [selectedLanguage, setSelectedLanguage] = useState<string[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<string[]>([]);

  const [selectedHobby, setSelectedHobby] = useState<string[]>([]);

  const [editableText, setEditableText] = useState(false);

  const updateInputText = (field: string, value: string) => {
    profileInfo[field as keyof ProfileInfo] = value;
  };

  const [editSubmit, setEditSubmit] = useState(true);

  const editable = useBoolean();

  const editProfile = "Edit Profile";
  const submitProfile = "Submit";

  const sendProfile = async () => {
    try {
      let json = await api.post(
        "/user/profile",
        profileInfo,
        sendProfileResultParser,
        token
      );
      if (json.result == true) {
        IonNeverDialog.show({
          type: "success",
          title: "Updated Profile",
          firstButtonVisible: true,
          firstButtonFunction: () => {
            getProfile();
          },
        });
      }
    } catch (error) {
      const errorObject: any = { ...(error as object) };
      console.log(errorObject);
    }
    console.log(profileInfo);
  };

  return (
    <>
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <View style={ProfileScreenStyleSheet.editContainer}>
              <TouchableOpacity
                onPress={() => {
                  editable.on;
                  setEditableText(!editableText);
                  if (editableText) {
                    sendProfile();
                  }
                }}
                style={
                  editableText
                    ? ProfileScreenStyleSheet.submitButton
                    : ProfileScreenStyleSheet.editButton
                }
              >
                <Text style={{ color: white }}>
                  {editableText ? submitProfile : editProfile}
                </Text>
                <MaterialIcons
                  name={editableText ? "check" : "edit"}
                  size={20}
                  style={{ color: white }}
                />
              </TouchableOpacity>
            </View>

            <Text style={ProfileScreenStyleSheet.IntroText}>Introduction</Text>
            <View style={ProfileScreenStyleSheet.center}>
              <View style={ProfileScreenStyleSheet.IntroContainer}>
                <TextInput
                  editable={editableText ? true : false}
                  style={{
                    textDecorationLine: editableText ? "underline" : "none",
                    width: full,
                    height: "100%",
                    // backgroundColor: "red",
                    textAlign: center,
                  }}
                  onChangeText={(text) => {
                    setIntroText(text);
                    updateInputText("intro", text);
                  }}
                >
                  {introText}
                </TextInput>
              </View>
            </View>
            <View style={ProfileScreenStyleSheet.center}>
              <View style={ProfileScreenStyleSheet.inputContainer}>
                <Text>Language :</Text>
                <Text
                  style={{
                    flex: 1,

                    flexDirection: "column",
                    flexWrap: "wrap",
                    justifyContent: center,
                    marginHorizontal: 4,
                  }}
                >
                  {selectedLanguage}
                </Text>
                <TouchableOpacity>
                  <MaterialIcons
                    style={{
                      display: flex,
                      marginHorizontal: 2,
                    }}
                    name={editableText ? "edit" : ""}
                    size={20}
                    onPress={() => {
                      IonNeverDialog.show({
                        dialogHeight: 800,
                        component: () => {
                          return (
                            <MultipleLanguagesCheckbox
                              setSelectedLanguage={setSelectedLanguage}
                              updateInputText={updateInputText}
                            />
                          );
                        },
                      });
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={ProfileScreenStyleSheet.center}>
              <View style={ProfileScreenStyleSheet.inputContainer}>
                <Text>Hobby :</Text>
                <Text
                  style={{
                    flex: 1,

                    flexDirection: "column",
                    flexWrap: "wrap",
                    justifyContent: center,
                    marginHorizontal: 4,
                  }}
                >
                  {selectedHobby}
                </Text>
                <TouchableOpacity>
                  <MaterialIcons
                    style={{
                      display: flex,
                      marginHorizontal: 2,
                    }}
                    name={editableText ? "edit" : ""}
                    size={20}
                    onPress={() => {
                      IonNeverDialog.show({
                        dialogHeight: 800,
                        component: () => {
                          return (
                            <MultipleHobbyCheckbox
                              setSelectedHobby={setSelectedHobby}
                              updateInputText={updateInputText}
                            />
                          );
                        },
                      });
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={ProfileScreenStyleSheet.center}>
              <View style={ProfileScreenStyleSheet.inputContainer}>
                <Text>Countries Traveled :</Text>
                <Text
                  style={{
                    flex: 1,

                    flexDirection: "column",
                    flexWrap: "wrap",
                    justifyContent: center,
                    marginHorizontal: 4,
                  }}
                >
                  {selectedCountry}
                </Text>
                <TouchableOpacity>
                  <MaterialIcons
                    style={{
                      display: flex,
                      marginHorizontal: 2,
                    }}
                    name={editableText ? "edit" : ""}
                    size={20}
                    onPress={() => {
                      IonNeverDialog.show({
                        dialogHeight: 800,
                        component: () => {
                          return (
                            <MultipleCountryCheckbox
                              setSelectedCountry={setSelectedCountry}
                              updateInputText={updateInputText}
                            />
                          );
                        },
                      });
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </>
  );
}
