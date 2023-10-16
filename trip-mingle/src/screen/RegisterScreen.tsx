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
import { useRef, useState } from "react";
import { CheckBox } from "@rneui/themed";
import RegisterScreenStyleSheet from "../StyleSheet/RegisterScreenCss";
import { RegisInfo } from "../utils/types";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { api } from "../apis/api";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import SelectCountry from "../components/selectCountry";
import { checkResultParser, signUpResultParser } from "../utils/parser";
import { JWTPayload, useToken } from "../hooks/useToken";
import decode from "jwt-decode";

// @ts-ignore
export default function RegisterScreen({ navigation }) {
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
  const { token, payload, setToken } = useToken();
  const [checkGender, setCheck1] = useState(true);

  const [selectedAge, setSelectedAge] = useState("Select Your Age Group");
  const [age, setAge] = useState("");

  const [selectedCountry, setSelectedCountry] = useState("Country");

  const [image, setImage] = useState<string>();

  const [checkPassword, setCheckPassword] = useState("");
  const [checkConfirmPassword, setCheckConfirmPassword] = useState("");

  const [checkUsernameResult, setCheckUsernameResult] = useState(false);

  const errMsg = "Password Not Match!";
  const usernameErrorMsg = "Username already exist";

  const regisInfo = useRef<RegisInfo>({
    username: "",
    email: "",
    password: "",
    gender: checkGender,
    age: "",
    country: "",
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

  const updateInputText = (field: string, value: string) => {
    //@ts-ignore
    regisInfo[field as keyof RegisInfo] = value;
  };

  const addImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // @ts-ignore
    console.log(JSON.stringify(_image.assets[0].uri));

    if (!_image.canceled) {
      setImage(_image.assets[0].uri);
      updateInputText("avatar", _image.assets[0].uri);
    }
  };

  const checkUsername = async (text: string) => {
    try {
      let checker = await api.loginSignUp(
        "/login/check",
        { username: text },
        checkResultParser
      );
      if (checker.result === true) {
        setCheckUsernameResult(true);
        console.log(checkUsernameResult);
      } else if (checker.result === false) {
        console.log(checkUsernameResult);
        setCheckUsernameResult(false);
      }
    } catch (error) {
      const errorObject: any = { ...(error as object) };
      console.log(errorObject);
    }
  };

  const register = async () => {
    try {
      let json = await api.loginSignUp(
        "/login/register",
        regisInfo,
        signUpResultParser
      );
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
        Keyboard.dismiss;
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
              onChangeText={(text: string) => updateInputText("email", text)}
              onEndEditing={() => Keyboard.dismiss()}
              keyboardType="email-address"
              placeholder="Email"
              style={RegisterScreenStyleSheet.textInput}
            ></TextInput>
            <Icon name="close" size={20} onPress={() => clearInputs.email()} />
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
            onPress={() => setCheck1(!checkGender)}
            size={20}
            containerStyle={{ backgroundColor: "transparent" }}
          />
          <CheckBox
            center
            title="Female"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={!checkGender}
            onPress={() => setCheck1(!checkGender)}
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
