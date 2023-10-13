//Buffer Line

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import ProfileScreenStyleSheet from "../StyleSheet/ProfileScreenCss";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { center, flex, row, white } from "../StyleSheet/StyleSheetHelper";
import { useRef, useState } from "react";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import SelectCountry from "../components/selectCountry";
import { ProfileInfo } from "../utils/types";
import SelectLanguage from "../components/selectLanguage";
//@ts-ignore
export default function ProfileScreen({ navigation }) {
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();

  const profileInfo = useRef<ProfileInfo>({
    intro: "",
    language: "",
    skill: "",
    hobby: "",
    country: "",
  }).current;

  const [introText, setIntroText] = useState("Test");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const [selectedCountry, setSelectedCountry] = useState("");

  const [selectedSkill, setSelectedSkill] = useState("Skill");

  const [selectedHobby, setSelectedHobby] = useState("Hobby");

  const [editableText, setEditableText] = useState(false);

  const updateInputText = (field: string, value: string) => {
    profileInfo[field as keyof ProfileInfo] = value;
  };

  const sendProfile = async () => {
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
                  sendProfile();
                }}
                style={ProfileScreenStyleSheet.editButton}
              >
                <Text style={{ color: white }}>Edit Profile</Text>
                <MaterialIcons name="edit" size={20} style={{ color: white }} />
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
                <Text>Language</Text>

                <Text
                  style={{
                    flex: 1,
                    backgroundColor: "red",
                    flexDirection: "column",
                    flexWrap: "wrap",
                    justifyContent: center,
                    marginHorizontal: 4,
                    color: white,
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
                <Text>Skill</Text>
                <Text
                  style={{
                    flex: 1,
                    backgroundColor: "red",
                    flexDirection: "column",
                    flexWrap: "wrap",
                    justifyContent: center,
                    marginHorizontal: 4,
                    color: white,
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
                <Text>Hobby</Text>
                <Text
                  style={{
                    flex: 1,
                    backgroundColor: "red",
                    flexDirection: "column",
                    flexWrap: "wrap",
                    justifyContent: center,
                    marginHorizontal: 4,
                    color: white,
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
                <Text>Countries Traveled</Text>
                <Text
                  style={{
                    flex: 1,
                    backgroundColor: "red",
                    flexDirection: "column",
                    flexWrap: "wrap",
                    justifyContent: center,
                    marginHorizontal: 4,
                    color: white,
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
