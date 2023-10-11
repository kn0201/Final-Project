import * as React from "react";
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
  ScrollView,
} from "react-native";

import LoginPageStyleSheet from "../StyleSheet/LoginPageCss";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { center, flex, full, row } from "../StyleSheet/StyleSheetHelper";
import { useRef, useState } from "react";
import { CheckBox } from "@rneui/themed";
import RegisterPageStyleSheet from "../StyleSheet/RegisterPageCss";
import UploadImage from "../components/uploadImage";
import { RegisInfo } from "../utils/types";
import { Dialog } from "@rneui/themed";
import { countriesList } from "../source/countries";
import { api } from "../apis/api";

//@ts-ignore
export default function Register({ navigation }) {
  const [checkGender, setCheck1] = useState(true);

  const [selectedAge, setSelectedAge] = useState("Select Your Age Group");
  const [age, setAge] = useState("");
  const [birthdayIcon, setBirthdayIcon] = useState(true);
  const [visibleBirthday, setVisibleBirthday] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState("Country");
  const [country, setCountry] = useState("");
  const [countryIcon, setCountryIcon] = useState(true);
  const [visibleCountry, setVisibleCountry] = useState(false);

  const regisInfo = useRef<RegisInfo>({
    username: "",
    email: "",
    password: "",
    gender: checkGender,
    age: "",
    country: "",
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

  const toggleBirthdayDialog = () => {
    setVisibleBirthday(!visibleBirthday);
  };

  const toggleCountryDialog = () => {
    setVisibleCountry(!visibleCountry);
  };

  const register = async () => {
    // try {
    //   let json = await api.post("/login", regisInfo, loginResult);
    //   Object.entries(clearInputs).map(([_key, clear]) => clear());
    // } catch (error) {
    //   const errorObject: any = { ...(error as object) };
    //   console.log(errorObject);
    // }
    console.log(regisInfo);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <UploadImage />

        <View style={RegisterPageStyleSheet.inputContainer}>
          <Icon
            style={{
              display: flex,
              justifyContent: "flex-start",
              marginEnd: 4,
            }}
            name="account-outline"
            size={20}
          />

          <TextInput
            ref={(input: any) => {
              clearInputs.username = () => input?.clear();
            }}
            onChangeText={(text: string) => updateInputText("username", text)}
            onEndEditing={() => Keyboard.dismiss()}
            placeholder="Username"
            style={RegisterPageStyleSheet.textInput}
          ></TextInput>
          <Icon
            style={{ display: flex, justifyContent: "flex-end" }}
            name="close"
            size={20}
            onPress={() => clearInputs.username()}
          />
        </View>
        <View style={RegisterPageStyleSheet.inputContainer}>
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
            style={RegisterPageStyleSheet.textInput}
          ></TextInput>
          <Icon
            style={{ display: flex, justifyContent: "flex-end" }}
            name="close"
            size={20}
            onPress={() => clearInputs.email()}
          />
        </View>
        <View style={RegisterPageStyleSheet.passwordContainer}>
          <View style={RegisterPageStyleSheet.password}>
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
              style={RegisterPageStyleSheet.textInput}
              ref={(input: any) => {
                clearInputs.password = () => input?.clear();
              }}
              onChangeText={(text: string) => updateInputText("password", text)}
              placeholder="Password"
              secureTextEntry={showPassword}
              clearTextOnFocus={true}
            ></TextInput>
            <Icon
              style={{ display: flex, justifyContent: "flex-end" }}
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              onPress={password}
            />
          </View>
          <Text>─────────────────────────</Text>
          <View style={RegisterPageStyleSheet.password}>
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
              style={RegisterPageStyleSheet.textInput}
              ref={(input: any) => {
                clearInputs.confirmPassword = () => input?.clear();
              }}
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
        </View>
        <View style={RegisterPageStyleSheet.genderContainer}>
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
            style={RegisterPageStyleSheet.birthdayContainer}
            onPress={toggleBirthdayDialog}
          >
            <Icon
              style={{
                display: flex,
                justifyContent: "flex-start",
                marginEnd: 4,
              }}
              name={birthdayIcon ? "cake-variant-outline" : ""}
              size={20}
            />
            <Text>{selectedAge}</Text>
          </TouchableOpacity>
          <Dialog
            isVisible={visibleBirthday}
            onBackdropPress={toggleBirthdayDialog}
          >
            <ScrollView>
              <Dialog.Title title="Your Age" />
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
                  containerStyle={{ backgroundColor: "white", borderWidth: 0 }}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checked={age === label}
                  onPress={() => setAge(label)}
                />
              ))}

              <Dialog.Actions>
                <Dialog.Button
                  title="CONFIRM"
                  onPress={() => {
                    setSelectedAge(age);
                    setBirthdayIcon(!birthdayIcon);
                    toggleBirthdayDialog();
                    updateInputText("age", age);
                  }}
                />
                <Dialog.Button
                  title="CANCEL"
                  onPress={() => {
                    setAge(selectedAge);
                    toggleBirthdayDialog();
                  }}
                />
              </Dialog.Actions>
            </ScrollView>
          </Dialog>
        </View>
        <View style={RegisterPageStyleSheet.center}>
          <TouchableOpacity
            style={RegisterPageStyleSheet.countryContainer}
            onPress={toggleCountryDialog}
          >
            <Icon
              style={{
                display: flex,
                justifyContent: "flex-start",
                marginEnd: 4,
              }}
              name={countryIcon ? "earth" : ""}
              size={20}
            />
            <Text>{selectedCountry}</Text>
          </TouchableOpacity>
          <Dialog
            isVisible={visibleCountry}
            onBackdropPress={toggleCountryDialog}
          >
            <Dialog.Title title="Your Age" />
            {countriesList.map((name, index) => (
              <CheckBox
                key={index + 1}
                title={name}
                containerStyle={{ backgroundColor: "white", borderWidth: 0 }}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={country === name}
                onPress={() => setCountry(name)}
              />
            ))}

            <Dialog.Actions>
              <Dialog.Button
                title="CONFIRM"
                onPress={() => {
                  setSelectedCountry(country);
                  setCountryIcon(!countryIcon);
                  toggleCountryDialog();
                }}
              />
              <Dialog.Button
                title="CANCEL"
                onPress={() => {
                  setCountry(selectedCountry);
                  toggleCountryDialog();
                }}
              />
            </Dialog.Actions>
          </Dialog>
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
