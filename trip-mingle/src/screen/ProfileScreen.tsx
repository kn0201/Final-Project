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
import { center, flex, white } from "../StyleSheet/StyleSheetHelper";
import { useRef, useState } from "react";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import SelectCountry from "../components/selectCountry";
import { ProfileInfo } from "../utils/types";
import SelectLanguage from "../components/selectLanguage";
//@ts-ignore
export default function ProfileScreen({ navigation }) {
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();

  const profileInfo = useRef<ProfileInfo>({
    language: "",
    skill: "",
    hobby: "",
    country: "",
  }).current;

  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("Skill");
  const [selectedHobby, setSelectedHobby] = useState("Hobby");
  const updateInputText = (field: string, value: string) => {
    //@ts-ignore
    profileInfo[field as keyof ProfileInfo] = value;
  };

  return (
    <>
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <Icon
              style={{
                display: flex,
                marginHorizontal: 2,
              }}
              name="square-edit-outline"
              size={20}
            />
            <Text style={ProfileScreenStyleSheet.IntroText}>Introduction</Text>
            <View style={ProfileScreenStyleSheet.center}>
              <View style={ProfileScreenStyleSheet.IntroContainer}>
                <TouchableOpacity style={ProfileScreenStyleSheet.addProfile}>
                  <Text style={ProfileScreenStyleSheet.addText}>
                    Add Introduction
                  </Text>
                </TouchableOpacity>
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
                  <Icon
                    style={{
                      display: flex,
                      marginHorizontal: 2,
                    }}
                    name="square-edit-outline"
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
                  <Icon
                    style={{
                      display: flex,
                      marginHorizontal: 2,
                    }}
                    name="square-edit-outline"
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
                  <Icon
                    style={{
                      display: flex,
                      marginHorizontal: 2,
                    }}
                    name="square-edit-outline"
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
                  <Icon
                    style={{
                      display: flex,
                      marginHorizontal: 2,
                    }}
                    name="square-edit-outline"
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
