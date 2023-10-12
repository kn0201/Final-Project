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
} from "react-native";
import ProfileScreenStyleSheet from "../StyleSheet/ProfileScreenCss";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { center, flex } from "../StyleSheet/StyleSheetHelper";
import { useState } from "react";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
//@ts-ignore
export default function ProfileScreen({ navigation }) {
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const [language, setLanguage] = useState("add");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View>
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
            <Text>language</Text>

            <Text>{language}</Text>
            <Icon
              style={{
                display: flex,
                justifyContent: "flex-end",
                marginEnd: 4,
              }}
              name="earth"
              size={20}
              onPress={() => {
                IonNeverDialog.show({
                  // dialogHeight: 150,
                  component: () => {
                    const [localLanguage, setLocalLanguage] = useState("");
                    const updateLocalLanguage = (text: string) => {
                      setLocalLanguage(text);
                    };
                    return (
                      <>
                        <TextInput
                          // multiline={true}
                          value={localLanguage}
                          style={{ height: 120 }}
                          onChangeText={updateLocalLanguage}
                        ></TextInput>
                        <TouchableOpacity
                          onPress={() => {
                            setLanguage(localLanguage);
                            setLocalLanguage(localLanguage);
                            IonNeverDialog.dismiss();
                          }}
                        >
                          <Text style={{ justifyContent: center }}>
                            Confirm
                          </Text>
                        </TouchableOpacity>
                      </>
                    );
                  },
                });
              }}
            />
          </View>
        </View>
        <View style={ProfileScreenStyleSheet.center}>
          <View style={ProfileScreenStyleSheet.inputContainer}>
            <Text>skill</Text>
          </View>
        </View>
        <View style={ProfileScreenStyleSheet.center}>
          <View style={ProfileScreenStyleSheet.inputContainer}>
            <Text>hobby</Text>
          </View>
        </View>
        <View style={ProfileScreenStyleSheet.center}>
          <View style={ProfileScreenStyleSheet.inputContainer}>
            <Text>countries_traveled</Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
