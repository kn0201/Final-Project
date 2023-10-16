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
import { center, flex, white } from "../StyleSheet/StyleSheetHelper";
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
//@ts-ignore
export default function ProfileScreen({ navigation }) {
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
    }
    if (json.language != null) {
      for (let language of json.language) {
        selectedLanguage.push(language.name);
      }
      setSelectedLanguage(selectedLanguage);
    }
    if (json.hobby != null) {
      for (let hobby of json.hobby) {
        selectedHobby.push(hobby.name);
      }
      setSelectedHobby(selectedHobby);
    }
    if (json.countries_travelled != null) {
      for (let countries_travelled of json.countries_travelled) {
        selectedCountry.push(countries_travelled.name);
      }
      setSelectedCountry(selectedCountry);
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
          // message: json.username,
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
                  }}
                  onChangeText={(text) => {
                    setIntroText(text);
                    updateInputText("intro", text);
                    console.log(profileInfo);
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
                            // <SelectLanguage
                            //   setSelectedLanguage={setSelectedLanguage}
                            //   updateInputText={updateInputText}
                            // />
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
                            // <SelectLanguage
                            //   setSelectedLanguage={setSelectedLanguage}
                            //   updateInputText={updateInputText}
                            // />
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
                            // <SelectCountry
                            //   setSelectedCountry={setSelectedCountry}
                            //   updateInputText={updateInputText}
                            // />
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
