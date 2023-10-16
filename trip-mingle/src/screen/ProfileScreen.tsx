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
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { center, flex, row, white } from "../StyleSheet/StyleSheetHelper";
import { useEffect, useRef, useState } from "react";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import SelectCountry from "../components/selectCountry";
import { ProfileInfo } from "../utils/types";
import SelectLanguage from "../components/selectLanguage";
import { api } from "../apis/api";
import {
  getProfileResultParser,
  sendProfileResultParser,
} from "../utils/parser";
import { useToken } from "../hooks/useToken";
//@ts-ignore
export default function ProfileScreen({ navigation }) {
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const { token, payload, setToken } = useToken();

  const profileInfo = useRef<ProfileInfo>({
    intro: "",
    language: "",
    skill: "",
    hobby: "",
    country: "",
  }).current;

  const [introText, setIntroText] = useState("add");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const [selectedSkill, setSelectedSkill] = useState("");

  const [selectedHobby, setSelectedHobby] = useState("");

  const [editableText, setEditableText] = useState(false);

  const updateInputText = (field: string, value: string) => {
    profileInfo[field as keyof ProfileInfo] = value;
  };

  const [editSubmit, setEditSubmit] = useState(true);

  const editProfile = "Edit Profile";
  const submitProfile = "Submit";

  const getProfile = async () => {
    let json = await api.get("/user/profile", getProfileResultParser, token);
    if (json.intro != null) {
      setIntroText(json.intro);
    }
    if (json.language != null) {
      setSelectedLanguage(json.language);
    }
    if (json.countries_travelled != null) {
      setSelectedCountry(json.countries_travelled);
    }
    if (json.skill != null) {
      setSelectedSkill(json.skill);
    }
    if (json.hobby != null) {
      setSelectedHobby(json.hobby);
    }
  };

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
  };

  useEffect(() => {
    getProfile();
  }, []);
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
                            <SelectLanguage
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
                <Text>Skill :</Text>
                <Text
                  style={{
                    flex: 1,

                    flexDirection: "column",
                    flexWrap: "wrap",
                    justifyContent: center,
                    marginHorizontal: 4,
                  }}
                >
                  {selectedSkill}
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
                            <SelectLanguage
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
                            <SelectLanguage
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
                            <SelectCountry
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
