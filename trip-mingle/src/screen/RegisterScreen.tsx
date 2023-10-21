import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
} from "react-native";

import LoginPageStyleSheet from "../StyleSheet/LoginScreenCss";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { flex } from "../StyleSheet/StyleSheetHelper";
import { useEffect, useRef, useState } from "react";
import { CheckBox } from "@rneui/themed";
import RegisterScreenStyleSheet from "../StyleSheet/RegisterScreenCss";
import { RegisInfo } from "../utils/types";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { api } from "../apis/api";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import SelectCountry from "../components/selectCountry";
import {
  checkResultParser,
  countryListParser,
  signUpResultParser,
} from "../utils/parser";
import { JWTPayload, useToken } from "../hooks/useToken";
import decode from "jwt-decode";
import { apiOrigin } from "../utils/apiOrigin";
import { useGet } from "../hooks/useGet";

// @ts-ignore
export default function RegisterScreen({ navigation }) {
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const { token, payload, setToken } = useToken();
  const [checkGender, setCheck1] = useState(true);
  const [imageFile, setImageFile] = useState<any>();
  const [selectedAge, setSelectedAge] = useState("Select Your Age Group*");
  const [age, setAge] = useState("");

  const [selectedCountry, setSelectedCountry] = useState("Country*");

  const [image, setImage] = useState<string>();

  const [checkPassword, setCheckPassword] = useState("");
  const [checkConfirmPassword, setCheckConfirmPassword] = useState("");

  const [checkUsernameResult, setCheckUsernameResult] = useState(false);
  const [checkEmailResult, setCheckEmailResult] = useState(false);

  const errMsg = "Password Not Match!";
  const usernameErrorMsg = "Username already exist";
  const emailErrorMsg = "Email already exist";
  const regisInfo = useRef<RegisInfo>({
    username: "",
    email: "",
    password: "",
    gender: checkGender,
    age: "",
    country_id: "",
    avatar: "",
  }).current;

  const clearInputs = useRef({
    username() {},
    email() {},
    password() {},
    confirmPassword() {},
    gender() {},
    age() {},
    country() {},
  }).current;

  const [showPassword, setPassword] = useState(true);
  const password = () => {
    setPassword(!showPassword);
  };

  const [showConfirmPassword, setConfirmPassword] = useState(true);
  const confirmPassword = () => {
    setConfirmPassword(!showConfirmPassword);
  };

  const updateInputText = (field: string, value: string | boolean) => {
    //@ts-ignore
    regisInfo[field as keyof RegisInfo] = value;
  };

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
      : imageAsset.uri.endsWith(".jpg") || imageAsset.uri.endsWith(".jpeg")
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
      setImageFile(file);
    }
    // console.log(imageFile);
  };

  const checkUsername = async (text: string) => {
    try {
      let checker = await api.loginSignUp(
        "/login/check_username",
        { username: text },
        checkResultParser
      );
      if (checker.result === true) {
        setCheckUsernameResult(true);
      } else if (checker.result === false) {
        setCheckUsernameResult(false);
      }
    } catch (error) {
      const errorObject: any = { ...(error as object) };
      console.log(errorObject);
    }
  };

  const checkEmail = async (text: string) => {
    try {
      let checker = await api.loginSignUp(
        "/login/check_email",
        { email: text },
        checkResultParser
      );
      if (checker.result === true) {
        setCheckEmailResult(true);
      } else if (checker.result === false) {
        setCheckEmailResult(false);
      }
    } catch (error) {
      const errorObject: any = { ...(error as object) };
      console.log(errorObject);
    }
  };
  const register = async () => {
    try {
      let formData = new FormData();
      formData.append("image", imageFile as any);
      formData.append("username", regisInfo.username);
      formData.append("email", regisInfo.email);
      formData.append("password", regisInfo.password);
      formData.append("gender", regisInfo.gender as any);
      formData.append("country_id", regisInfo.country_id);
      formData.append("age", regisInfo.age);

      let res = await fetch(apiOrigin + "/login/register", {
        method: "POST",
        body: formData,
      });
      let json = await res.json();
      Object.entries(clearInputs).map(([_key, clear]) => clear());
      setSelectedAge("Select Your Age Group");
      setSelectedCountry("Country");
      setToken(json.token);
      const username = decode<JWTPayload>(json.token).username;
      IonNeverDialog.show({
        type: "success",
        title: "Welcome to TripMingle",
        message: username,
        firstButtonVisible: true,
        firstButtonFunction: () => {
          navigation.navigate("Users");
        },
        secondButtonVisible: false,
      });
    } catch (error) {
      const errorObject: any = { ...(error as object) };
      console.log(errorObject);
    }
    console.log(regisInfo);
    navigation.navigate("Users");
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={RegisterScreenStyleSheet.uploadContainer}>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 150, height: 150 }}
            />
          )}
          <View style={RegisterScreenStyleSheet.uploadBtnContainer}>
            <TouchableOpacity
              onPress={addImage}
              style={RegisterScreenStyleSheet.uploadBtn}
            >
              <Text>{image ? "Edit" : "Upload"} Image</Text>
              <AntDesign name="camera" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={RegisterScreenStyleSheet.outerContainer}>
          <Text>
            Username* <Text style={{ fontSize: 10 }}> Max 10 letter</Text>
          </Text>
          <View style={RegisterScreenStyleSheet.inputContainer}>
            <Icon
              style={{
                display: flex,
                justifyContent: "flex-start",
                marginEnd: 4,
                // backgroundColor: "red",
              }}
              name="account-outline"
              size={20}
            />

            <TextInput
              ref={(input: any) => {
                clearInputs.username = () => input?.clear();
              }}
              onChangeText={(text: string) => {
                updateInputText("username", text);
                checkUsername(text);
              }}
              onEndEditing={() => Keyboard.dismiss()}
              placeholder="Username"
              maxLength={10}
              autoCapitalize="none"
              style={RegisterScreenStyleSheet.textInput}
            ></TextInput>
            <Icon
              style={{ display: flex, justifyContent: "flex-end" }}
              name={"close"}
              size={20}
              onPress={() => clearInputs.username()}
            />
          </View>
          <View style={RegisterScreenStyleSheet.center}>
            <Text style={{ color: "red" }}>
              {checkUsernameResult ? usernameErrorMsg : ""}
            </Text>
          </View>
        </View>
        <View style={RegisterScreenStyleSheet.outerContainer}>
          <Text>Email*</Text>
          <View style={RegisterScreenStyleSheet.inputContainer}>
            <Icon
              style={{
                display: flex,
                justifyContent: "flex-start",
                marginEnd: 4,
              }}
              name="email-outline"
              size={20}
            />

            <TextInput
              ref={(input: any) => {
                clearInputs.email = () => input?.clear();
              }}
              onChangeText={(text: string) => {
                updateInputText("email", text);
                checkEmail(text);
              }}
              onEndEditing={() => Keyboard.dismiss()}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Email"
              style={RegisterScreenStyleSheet.textInput}
            ></TextInput>
            <Icon name="close" size={20} onPress={() => clearInputs.email()} />
          </View>
          <View style={RegisterScreenStyleSheet.center}>
            <Text style={{ color: "red" }}>
              {checkEmailResult ? emailErrorMsg : ""}
            </Text>
          </View>
        </View>
        <View style={RegisterScreenStyleSheet.passwordContainer}>
          <Text>
            Password*
            {/* <Text style={{ fontSize: 10 }}>
              Required Digit Number include One Upper & Lower letter ,
              minlength:8
            </Text> */}
          </Text>
          <View style={RegisterScreenStyleSheet.password}>
            <Icon
              style={{
                display: flex,
                justifyContent: "flex-start",
                marginEnd: 4,
              }}
              name="lock-outline"
              size={20}
            />

            <TextInput
              style={RegisterScreenStyleSheet.textInput}
              ref={(input: any) => {
                clearInputs.password = () => input?.clear();
              }}
              onChangeText={(text: string) => {
                updateInputText("password", text);
                setCheckPassword(text);
              }}
              placeholder="Password"
              secureTextEntry={showPassword}
              // passwordRules={
              //   "required: upper; required: lower; required: digit; minlength: 8;"
              // }
              clearTextOnFocus={true}
            ></TextInput>
            <Icon
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              onPress={password}
            />
          </View>
          <View style={RegisterScreenStyleSheet.center}>
            <Text>─────────────────────────</Text>
          </View>

          <View style={RegisterScreenStyleSheet.password}>
            <Icon
              style={{
                display: flex,
                justifyContent: "flex-start",
                marginEnd: 4,
              }}
              name="lock-outline"
              size={20}
            />

            <TextInput
              style={RegisterScreenStyleSheet.textInput}
              ref={(input: any) => {
                clearInputs.confirmPassword = () => input?.clear();
              }}
              onChangeText={(text: string) => setCheckConfirmPassword(text)}
              placeholder="Confirm Password"
              secureTextEntry={showConfirmPassword}
              clearTextOnFocus={true}
            ></TextInput>
            <Icon
              style={{ display: flex, justifyContent: "flex-end" }}
              name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              onPress={confirmPassword}
            />
          </View>
          <View style={RegisterScreenStyleSheet.center}>
            <Text style={{ color: "red" }}>
              {checkPassword === checkConfirmPassword ? "" : errMsg}
            </Text>
          </View>
        </View>
        <View style={RegisterScreenStyleSheet.genderContainer}>
          <CheckBox
            center
            title="Male"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={checkGender}
            onPress={() => {
              setCheck1(!checkGender), updateInputText("gender", checkGender);
            }}
            size={20}
            containerStyle={{ backgroundColor: "transparent" }}
          />
          <CheckBox
            center
            title="Female"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={!checkGender}
            onPress={() => {
              setCheck1(!checkGender), updateInputText("gender", checkGender);
            }}
            size={20}
            containerStyle={{ backgroundColor: "transparent" }}
          />
        </View>
        <View style={LoginPageStyleSheet.center}>
          <TouchableOpacity
            style={RegisterScreenStyleSheet.birthdayContainer}
            onPress={() => {
              IonNeverDialog.show({
                dialogHeight: 500,
                component: () => {
                  const [localAge, setLocalAge] = useState<string>(age);
                  return (
                    <>
                      <ScrollView
                        horizontal={false}
                        style={
                          RegisterScreenStyleSheet.BirthdayScrollViewContainer
                        }
                      >
                        {[
                          "18-24",
                          "25-30",
                          "31-36",
                          "37-42",
                          "42-48",
                          "48-54",
                          ">55",
                        ].map((label, index) => (
                          <CheckBox
                            key={index + 1}
                            title={label}
                            containerStyle={{
                              backgroundColor: "transparent",
                              borderWidth: 0,
                            }}
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                            checked={localAge === label}
                            onPress={() => {
                              setAge(label);
                              setLocalAge(label);
                            }}
                          />
                        ))}
                      </ScrollView>
                      <View
                        style={RegisterScreenStyleSheet.ModalButtonContainer}
                      >
                        <TouchableOpacity
                          disabled={localAge === ""}
                          onPress={() => {
                            setSelectedAge(localAge);
                            IonNeverDialog.dismiss();
                            updateInputText("age", localAge);
                          }}
                        >
                          <Text style={RegisterScreenStyleSheet.ModalText}>
                            Confirm
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  );
                },
              });
            }}
          >
            <Icon
              style={{
                display: flex,
                justifyContent: "flex-start",
                marginEnd: 4,
              }}
              name={age === "" ? "cake-variant-outline" : ""}
              size={20}
            />
            <Text>{selectedAge}</Text>
          </TouchableOpacity>
        </View>
        <View style={RegisterScreenStyleSheet.center}>
          <TouchableOpacity
            style={RegisterScreenStyleSheet.countryContainer}
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
          >
            <Icon
              style={{
                display: flex,
                justifyContent: "flex-start",
                marginEnd: 4,
              }}
              name={selectedCountry === "Country" ? "earth" : ""}
              size={20}
            />
            <Text>{selectedCountry}</Text>
          </TouchableOpacity>
        </View>
        <View style={LoginPageStyleSheet.center}>
          <TouchableOpacity
            style={LoginPageStyleSheet.login}
            onPress={register}
          >
            <Text style={LoginPageStyleSheet.loginText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
